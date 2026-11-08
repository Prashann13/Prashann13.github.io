import { intersects } from './collision.js';
import { updatePlayer, attackStage } from './player.js';
import { updateEnemy } from './enemies.js';
import { updateCheckpoint, restoreCheckpoint } from './checkpoints.js';
import { updateBoss } from './boss.js';
import { emitEffect, updateEffects } from './effects.js';

export function createGame(config, reduced = false, best = 0) {
  return { mode: 'ready', reduced, elapsed: 0, score: 0, best, camera: 0, jumpCount: 0, attackCount: 0, checkpoint: null, effects: [],
    player: { x: config.playerX, y: config.ground, vy: 0, grounded: true, duck: false, facing: 1,
      health: 3, invulnerable: 0, safeX: config.playerX, hold: 0, attack: 0, cooldown: 0, coyote: config.physics.coyoteTime, buffer: 0 },
    boss: { active: false, health: config.boss.health, x: config.boss.positions[0], y: 188, width: 42, height: 42,
      timer: 0, cycleIndex: 0, phase: 1, action: 'warn', pattern: 'aim', targetX: config.boss.positions[0], vulnerable: false, openingHit: false, lastHit: -1 },
    input: { left: false, right: false, jump: false, held: false, duck: false, attack: false },
    playerBox: { x: 0, y: 0, width: 16, height: 33 }, whipBox: { x: 0, y: 0, width: config.physics.whipRange, height: 20 },
    entities: Array.from({ length: 24 }, () => ({ active: false, kind: 'projectile', x: 0, y: 0, width: 8, height: 8 })),
  };
}
export function releaseInput(state) { for (const key of Object.keys(state.input)) state.input[key] = false; }
export function beginRun(state, config) {
  const fresh = createGame(config, state.reduced, state.best); Object.assign(state, fresh); state.mode = 'playing';
  config.level.enemies.forEach((enemy, index) => { Object.assign(state.entities[index], enemy, { active: true, direction: 1, originY: enemy.y, action: 'patrol', timer: 0 }); });
}
export function retryCheckpoint(state, config) {
  if (restoreCheckpoint(state, config, createGame(config).player)) releaseInput(state);
}
function damage(state, config) {
  const p = state.player;
  if (p.invulnerable > 0 || state.mode !== 'playing') return;
  p.health--; p.invulnerable = config.physics.damageProtection;
  emitEffect(state, 'damage', p.x + 10, p.y - 20);
  if (p.health <= 0) { state.mode = 'over'; releaseInput(state); }
}
export function stepGame(state, config, dt = 1 / 60) {
  if (state.mode !== 'playing') return;
  const p = state.player;
  state.elapsed += dt;
  updateEffects(state, dt);
  if (updatePlayer(state, config, dt)) damage(state, config);
  const striking = attackStage(p, config.physics) === 'strike';
  updateBoss(state, config, dt);
  for (const e of state.entities) {
    if (!e.active) continue;
    updateEnemy(e, state, config, dt);
    if (!e.active) continue;
    if (striking && intersects(state.whipBox, e)) {
      e.active = false; emitEffect(state, 'hit', e.x + e.width / 2, e.y + e.height / 2);
      if (e.kind !== 'projectile') state.score += config.points.enemy;
    }
    else if (intersects(state.playerBox, e)) { damage(state, config); if (e.kind === 'projectile') e.active = false; }
  }
  const boss = state.boss;
  if (boss.active && boss.health > 0) {
    if (striking && boss.vulnerable && boss.lastHit !== state.attackCount && intersects(state.whipBox, boss)) {
      boss.lastHit = state.attackCount; boss.health--; boss.openingHit = true; boss.vulnerable = false;
      emitEffect(state, boss.health === 0 ? 'victory' : 'hit', boss.x + 21, boss.y + 21);
      if (boss.health === 0 && state.mode === 'playing') { state.score += config.points.boss; state.mode = 'won'; releaseInput(state); }
    } else if (intersects(state.playerBox, boss)) damage(state, config);
  }
  state.camera = Math.max(0, Math.min(config.level.width - config.width, p.x - config.width * .38));
  state.best = Math.max(state.best, state.score);
  updateCheckpoint(state, config);
}
