export function updateCheckpoint(state, config) {
  if (state.mode !== 'playing' || !state.player.grounded || state.player.y !== config.ground) return;
  const flag = config.level.checkpoints.find((point) => point.x > (state.checkpoint?.x ?? -1) && state.player.x >= point.x);
  if (!flag) return;
  state.player.health = 3;
  state.checkpoint = { ...flag, score: state.score, entities: structuredClone(state.entities), boss: structuredClone(state.boss) };
  emitEffect(state, 'checkpoint', flag.x, config.ground - 30);
}

export function restoreCheckpoint(state, config, freshPlayer) {
  if (!state.checkpoint || state.mode !== 'over') return false;
  const saved = state.checkpoint;
  state.player = { ...freshPlayer, x: saved.x, safeX: saved.x, invulnerable: config.physics.damageProtection };
  state.entities = structuredClone(saved.entities);
  state.entities.forEach((e) => { if (e.kind === 'projectile') e.active = false; });
  state.boss = structuredClone(saved.boss); state.score = saved.score;
  state.effects = [];
  state.camera = Math.max(0, saved.x - config.width * .38); state.mode = 'playing';
  // Elapsed play time and best score intentionally include previous attempts.
  return true;
}
import { emitEffect } from './effects.js';

