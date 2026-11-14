export function emitEffect(state, kind, x, y) {
  if (state.effects.length >= 32) state.effects.shift();
  state.effects.push({ kind, x, y, age: 0, life: kind === 'victory' ? 1.1 : .35 });
}

export function updateEffects(state, dt) {
  for (const effect of state.effects) effect.age += dt;
  state.effects = state.effects.filter((effect) => effect.age < effect.life);
}
