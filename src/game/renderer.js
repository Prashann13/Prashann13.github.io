import { SPRITES, ENEMIES, drawSprite } from './pixelArt.js';
import { attackStage } from './player.js';
import { drawBackground, drawCastle } from './scenery.js';

export function drawGame(ctx, state, config, colors) {
  ctx.globalAlpha = 1; drawBackground(ctx, state, config, colors);
  ctx.save(); ctx.translate(-Math.round(state.camera), 0);
  drawCastle(ctx, state, config, colors);
  for (const e of state.entities) {
    if (!e.active || e.x + e.width < state.camera || e.x > state.camera + config.width) continue;
    const x = Math.round(e.x), y = Math.round(e.y);
    if (e.kind === 'projectile') {
      ctx.fillStyle = colors.hazard; ctx.fillRect(x, y + 1, 8, 4); ctx.fillRect(x + 2, y, 4, 6);
      ctx.fillStyle = colors.highlight; ctx.fillRect(x + 3, y + 2, 2, 2);
    } else {
      const sprite = e.kind === 'flyer' ? (Math.floor(state.elapsed * 7) % 2 ? ENEMIES.flyerUp : ENEMIES.flyer)
        : e.kind === 'sentry' ? ENEMIES.sentry : e.action === 'warn' ? ENEMIES.guardWarn : ENEMIES.guard;
      drawSprite(ctx, sprite, x, y, { ...colors, cloak: colors.hazard, steel: colors.enemySteel }, e.direction);
      if (e.action === 'warn') {
        ctx.fillStyle = colors.pickup; ctx.fillRect(x + e.width / 2 - 1, y - 12, 3, 6); ctx.fillRect(x + e.width / 2 - 1, y - 3, 3, 2);
      }
    }
  }
  const b = state.boss;
  if (b.active && b.health > 0) {
    // Original four-pane enemy: staggered shards, a central core and a broken crown.
    const spread = b.vulnerable ? 4 : 0;
    ctx.fillStyle = b.vulnerable ? colors.pickup : colors.enemySteel;
    for (const [dx, dy] of [[0, 0], [23, 2], [2, 23], [25, 25]]) {
      const sx = b.x + dx + (dx < 20 ? -spread : spread), sy = b.y + dy;
      ctx.fillRect(sx + 2, sy, 15, 18); ctx.fillRect(sx, sy + 3, 18, 12);
      ctx.fillStyle = colors.highlight; ctx.fillRect(sx + 3, sy + 2, 10, 2);
      ctx.fillStyle = b.vulnerable ? colors.pickup : colors.enemySteel;
    }
    ctx.fillStyle = b.vulnerable ? colors.highlight : colors.hazard; ctx.fillRect(b.x + 18, b.y + 18, 7, 7);
    ctx.fillRect(b.x + 7, b.y - 6, 3, 5); ctx.fillRect(b.x + 30, b.y - 9, 4, 7);
    if (b.action === 'warn') {
      ctx.fillStyle = colors.pickup;
      if (b.pattern === 'sweep') { ctx.fillRect(b.x - 35, config.ground - 9, 28, 2); ctx.fillRect(b.x + 49, config.ground - 9, 28, 2); }
      else if (b.pattern === 'teleport') { ctx.strokeStyle = colors.pickup; ctx.lineWidth = 2; ctx.strokeRect(b.targetX - 3, b.y - 3, b.width + 6, b.height + 6); }
      else { ctx.fillRect(b.x + 19, b.y - 19, 3, 7); ctx.fillRect(b.x + 19, b.y - 9, 3, 2); }
    }
  }
  const p = state.player;
  const moving = state.input.left || state.input.right;
  const stage = attackStage(p, config.physics);
  const sprite = p.health <= 0 ? SPRITES.defeat : p.invulnerable > .85 ? SPRITES.hurt : p.duck ? SPRITES.duck
    : stage !== 'idle' ? SPRITES[stage] : !p.grounded ? (p.vy < 0 ? SPRITES.rise : SPRITES.fall)
      : moving ? SPRITES.run[Math.floor(state.elapsed * 12) % SPRITES.run.length] : SPRITES.idle[Math.floor(state.elapsed * 2) % 2];
  ctx.globalAlpha = p.invulnerable > 0 ? .65 : 1;
  drawSprite(ctx, sprite, p.x, p.y - 34, colors, p.facing);
  ctx.globalAlpha = 1;
  if (stage === 'strike') {
    ctx.fillStyle = colors.pickup; const whip = state.whipBox;
    ctx.fillRect(Math.round(whip.x), Math.round(p.y) - (p.duck ? 12 : 25), whip.width, 2);
    ctx.fillRect(Math.round(p.facing > 0 ? whip.x + whip.width - 3 : whip.x), Math.round(p.y) - (p.duck ? 12 : 25), 3, 5);
    ctx.globalAlpha = .25; ctx.fillRect(whip.x, p.y - (p.duck ? 15 : 28), whip.width - 6, 1); ctx.globalAlpha = 1;
  }
  for (const effect of state.effects) {
    ctx.globalAlpha = 1 - effect.age / effect.life;
    ctx.fillStyle = effect.kind === 'damage' ? colors.hazard : effect.kind === 'dust' ? colors.steel : colors.pickup;
    const count = effect.kind === 'victory' ? 18 : 6;
    for (let i = 0; i < count; i++) {
      const angle = i * Math.PI * 2 / count, distance = effect.age * (effect.kind === 'victory' ? 85 : 45);
      ctx.fillRect(Math.round(effect.x + Math.cos(angle) * distance), Math.round(effect.y + Math.sin(angle) * distance - effect.age * 12), 2, 2);
    }
  }
  ctx.globalAlpha = 1; ctx.restore();
}
