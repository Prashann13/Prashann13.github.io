export function spawnProjectile(state, x, y, vx, vy, style = 'bolt') {
  // Enemy slots remain reserved so a projectile cannot overwrite a defeated enemy's checkpoint state.
  const slot = state.entities.find((e) => e.kind === 'projectile' && !e.active);
  if (slot) Object.assign(slot, { active: true, x, y, vx, vy, width: 8, height: 6, life: 5, style });
}

function patrol(e, dt) {
  e.x += e.direction * e.speed * dt;
  if (e.x >= e.patrolMax) { e.x = e.patrolMax; e.direction = -1; }
  if (e.x <= e.patrolMin) { e.x = e.patrolMin; e.direction = 1; }
}

export function updateEnemy(e, state, config, dt) {
  const p = state.player, rules = config.enemyRules;
  if (e.kind === 'projectile') {
    e.x += e.vx * dt; e.y += e.vy * dt; e.life -= dt;
    if (e.life <= 0 || e.x < 0 || e.x > config.level.width || e.y < -40 || e.y > config.height) e.active = false;
    return;
  }
  // Distant encounters wait for the player rather than attacking through several screens.
  if (Math.abs(e.x - p.x) > config.width) return;
  e.timer = Math.max(0, e.timer - dt);
  if (e.kind === 'flyer') {
    patrol(e, dt);
    const approaching = Math.abs(e.x - p.x) < rules.flyerRange;
    const targetY = approaching ? Math.max(135, p.y - 42) : e.originY + Math.sin(state.elapsed * 3) * 8;
    e.y += (targetY - e.y) * Math.min(1, dt * 3);
    e.action = approaching ? 'approach' : 'patrol';
    return;
  }
  if (e.action === 'warn' && e.timer === 0) {
    if (e.kind === 'sentry') {
      spawnProjectile(state, e.x + 8, config.ground - 29, e.direction * rules.boltSpeed, 0);
      e.action = 'recover'; e.timer = rules.sentryRecovery;
    } else { e.action = 'charge'; e.timer = rules.guardCharge; }
  } else if (e.action === 'charge') {
    e.x = Math.max(e.patrolMin, Math.min(e.patrolMax, e.x + e.direction * rules.chargeSpeed * dt));
    if (e.timer === 0) { e.action = 'recover'; e.timer = rules.guardRecovery; }
  } else if (e.action === 'recover' && e.timer === 0) e.action = 'patrol';
  if (e.action !== 'patrol') return;
  const range = e.kind === 'sentry' ? rules.sentryRange : rules.guardRange;
  if (Math.abs(e.x - p.x) < range && Math.abs(p.y - config.ground) < 48) {
    e.direction = p.x < e.x ? -1 : 1; e.action = 'warn';
    e.timer = e.kind === 'sentry' ? rules.sentryWarn : rules.guardWarn;
  } else if (e.kind === 'guard') patrol(e, dt);
}
