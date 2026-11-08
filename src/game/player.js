import { crossesTop } from './collision.js';
import { emitEffect } from './effects.js';

export const overlapsX = (player, surface) => player.x + 20 > surface.x && player.x < surface.x + surface.width;

export function attackStage(player, rules) {
  if (player.attack <= 0) return 'idle';
  if (player.attack > rules.attackActive + rules.attackRecovery) return 'anticipation';
  return player.attack > rules.attackRecovery ? 'strike' : 'recovery';
}

export function updatePlayer(state, config, dt) {
  const p = state.player, input = state.input, rules = config.physics, terrain = config.level.terrain;
  p.invulnerable = Math.max(0, p.invulnerable - dt);
  const ceiling = terrain.some((s) => overlapsX(p, s) && p.y - 34 < s.y + s.height && p.y > s.y);
  p.duck = input.duck || (p.duck && ceiling);
  const height = p.duck ? 18 : 34;
  const direction = Number(input.right) - Number(input.left);
  if (direction) p.facing = direction;
  const oldX = p.x;
  p.x += direction * (p.duck ? rules.crouchSpeed : rules.speed) * dt;
  for (const surface of terrain) {
    if (p.y > surface.y + .5 && p.y - height < surface.y + surface.height && overlapsX(p, surface)) {
      if (oldX + 20 <= surface.x + .5) p.x = surface.x - 20;
      else if (oldX >= surface.x + surface.width - .5) p.x = surface.x + surface.width;
    }
  }
  p.x = Math.max(state.boss.active ? config.boss.arenaStart : 0, Math.min(config.level.width - 20, p.x));
  if (p.grounded && !terrain.some((s) => Math.abs(s.y - p.y) < .5 && overlapsX(p, s))) p.grounded = false;
  p.coyote = p.grounded ? rules.coyoteTime : Math.max(0, p.coyote - dt);
  p.buffer = input.jump ? rules.jumpBuffer : Math.max(0, p.buffer - dt);
  if (p.buffer > 0 && (p.grounded || p.coyote > 0) && !p.duck) {
    p.vy = -rules.jumpSpeed; p.grounded = false; p.hold = 0; p.coyote = 0; p.buffer = 0; state.jumpCount++;
  }
  input.jump = false;
  p.cooldown = Math.max(0, p.cooldown - dt); p.attack = Math.max(0, p.attack - dt);
  if (input.attack && p.cooldown <= 0) {
    p.attack = rules.attackDuration; p.cooldown = rules.attackCooldown; state.attackCount++;
  }
  input.attack = false;
  const previousFeet = p.y;
  if (!p.grounded) {
    if (!input.held && p.vy < -rules.cutSpeed) p.vy = -rules.cutSpeed;
    const heldRise = input.held && p.vy < 0 && p.hold < rules.holdTime;
    p.vy = Math.min(600, p.vy + rules.gravity * (heldRise ? rules.holdGravity : 1) * dt);
    p.hold += dt; p.y += p.vy * dt;
    if (p.vy >= 0) {
      let landing = Infinity;
      for (const s of terrain) if (overlapsX(p, s) && crossesTop(previousFeet, p.y, s.y, p.vy)) landing = Math.min(landing, s.y);
      if (landing < Infinity) { p.y = landing; p.vy = 0; p.grounded = true; emitEffect(state, 'dust', p.x + 10, p.y); }
    } else {
      for (const s of terrain) if (overlapsX(p, s) && previousFeet - height >= s.y + s.height && p.y - height <= s.y + s.height) {
        p.y = s.y + s.height + height; p.vy = 0;
      }
    }
  }
  if (p.grounded && p.y === config.ground && terrain.some((s) => s.y === config.ground && p.x >= s.x + 25 && p.x + 45 <= s.x + s.width)) p.safeX = p.x;
  const fell = p.y > config.height + 40;
  if (fell) { p.x = p.safeX; p.y = config.ground; p.vy = 0; p.grounded = true; p.buffer = 0; p.coyote = 0; }
  Object.assign(state.playerBox, { x: p.x + 2, y: p.y - height, width: 16, height: height - 1 });
  Object.assign(state.whipBox, { x: p.facing > 0 ? p.x + 18 : p.x - rules.whipRange, y: p.y - (p.duck ? 18 : 36), width: rules.whipRange, height: 20 });
  return fell;
}
