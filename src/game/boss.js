import { spawnProjectile } from './enemies.js';

const patterns = ['aim', 'sweep', 'teleport'];
export function updateBoss(state, config, dt) {
  const boss = state.boss, rules = config.boss;
  if (!boss.active && state.player.x >= rules.arenaStart) boss.active = true;
  if (!boss.active || boss.health <= 0) return;
  boss.phase = boss.health <= rules.phaseTwoHealth ? 2 : 1;
  const fast = boss.phase === 2;
  const warning = fast ? rules.fastWarning : rules.warning;
  boss.timer += dt;
  boss.vulnerable = boss.action === 'recover' && !boss.openingHit;
  if (boss.action === 'warn' && boss.timer >= warning) {
    boss.timer = 0; boss.action = 'recover'; boss.vulnerable = true; boss.openingHit = false;
    if (boss.pattern === 'teleport') {
      boss.x = boss.targetX;
      if (fast) fireAimed(state, config);
    } else if (boss.pattern === 'sweep') {
      const speed = rules.projectileSpeed * (fast ? 1.3 : 1);
      spawnProjectile(state, boss.x + 17, config.ground - 10, -speed, 0, 'sweep');
      spawnProjectile(state, boss.x + 17, config.ground - 10, speed, 0, 'sweep');
    } else fireAimed(state, config);
  } else if (boss.action === 'recover' && boss.timer >= (fast ? rules.fastRecovery : rules.recovery)) {
    boss.timer = 0; boss.action = 'rest'; boss.vulnerable = false;
  } else if (boss.action === 'rest' && boss.timer >= (fast ? rules.fastRest : rules.rest)) {
    boss.timer = 0; boss.action = 'warn'; boss.cycleIndex++;
    boss.pattern = patterns[boss.cycleIndex % patterns.length];
    boss.targetX = rules.positions[boss.cycleIndex % rules.positions.length];
  }
}

function fireAimed(state, config) {
  const b = state.boss, p = state.player;
  const dx = p.x + 10 - (b.x + 21), dy = p.y - 20 - (b.y + 21);
  const length = Math.max(1, Math.hypot(dx, dy));
  const speed = config.boss.projectileSpeed * (b.phase === 2 ? 1.2 : 1);
  spawnProjectile(state, b.x + 17, b.y + 17, dx / length * speed, dy / length * speed, 'orb');
}
