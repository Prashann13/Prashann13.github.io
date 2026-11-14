import { createGame, beginRun, releaseInput, stepGame, retryCheckpoint } from './engine.js';
import { drawGame } from './renderer.js';
import { updateEffects } from './effects.js';

export function mountArcade(canvas, root, config, onChange) {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return null;
  let best = 0;
  try { const saved = Number(localStorage.getItem(config.storageKey)); best = Number.isFinite(saved) && saved > 0 ? saved : 0; } catch { /* Storage is optional. */ }
  const state = createGame(config, best);
  const colors = {};
  let raf = 0, last = 0, accumulator = 0, published = 0, visible = true, disposed = false;
  let duckTimer = 0, moveTimer = 0, lastSnapshot = '';
  const publish = () => {
    const area = config.level.areas.findLast((section) => state.player.x >= section.x) || config.level.areas[0];
    const boss = state.boss;
    const snapshot = { mode: state.mode, score: state.score, best: state.best, health: state.player.health,
      bossHealth: boss.active ? boss.health : null, bossPhase: boss.phase, bossCue: boss.vulnerable ? config.ui.opening : boss.action === 'warn' ? config.ui[boss.pattern] : config.ui.bossGuarded,
      area: area.name, hint: area.hint, checkpoint: state.checkpoint?.name ?? null, elapsed: Math.floor(state.elapsed) };
    const serialized = JSON.stringify(snapshot);
    if (serialized !== lastSnapshot) { lastSnapshot = serialized; onChange(snapshot); }
  };
  const palette = () => {
    const css = getComputedStyle(document.documentElement);
    for (const key in config.palette) colors[key] = css.getPropertyValue(config.palette[key]).trim();
  };
  const draw = () => drawGame(ctx, state, config, colors);
  const resize = () => {
    const width = canvas.getBoundingClientRect().width;
    const scale = Math.min(window.devicePixelRatio || 1, 2) * width / config.width;
    canvas.width = Math.max(1, Math.round(config.width * scale));
    canvas.height = Math.max(1, Math.round(config.height * scale));
    ctx.setTransform(canvas.width / config.width, 0, 0, canvas.height / config.height, 0, 0);
    ctx.imageSmoothingEnabled = false; draw();
  };
  const save = () => { try { localStorage.setItem(config.storageKey, String(state.best)); } catch { /* Private mode is supported. */ } };
  const stop = () => { cancelAnimationFrame(raf); clearTimeout(duckTimer); clearTimeout(moveTimer); raf = 0; last = 0; accumulator = 0; releaseInput(state); };
  const pause = () => {
    if (state.mode !== 'playing') return;
    state.mode = 'paused'; stop(); save(); draw(); publish();
  };
  const frame = (time) => {
    if (disposed || !['playing', 'over', 'won'].includes(state.mode)) return;
    accumulator += last ? Math.min((time - last) / 1000, .1) : 0; last = time;
    while (accumulator >= 1 / 60) {
      if (state.mode === 'playing') stepGame(state, config); else updateEffects(state, 1 / 60);
      accumulator -= 1 / 60;
    }
    draw();
    if (time - published > 100 || state.mode === 'over' || state.mode === 'won') { publish(); published = time; }
    if (state.mode !== 'playing') save();
    if (state.mode !== 'playing' && state.effects.length === 0) stop(); else raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (document.hidden || (!visible && !root.closest('dialog')?.open)) return;
    root.focus({ preventScroll: true });
    if (state.mode === 'over' && state.checkpoint) retryCheckpoint(state, config);
    else if (state.mode === 'ready' || state.mode === 'over' || state.mode === 'won') beginRun(state, config);
    else { state.mode = 'playing'; releaseInput(state); }
    stop(); state.mode = 'playing'; publish(); raf = requestAnimationFrame(frame);
  };
  const focused = () => root.contains(document.activeElement);
  const keydown = (event) => {
    if (!focused() || event.target.closest('button, a, input')) return;
    const key = event.key.toLowerCase();
    if (key === 'escape' && root.closest('dialog')?.open) return;
    if (![' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'a', 'd', 's', 'x', 'z', 'p', 'escape', 'enter'].includes(key)) return;
    event.preventDefault();
    if (key === 'p' || key === 'escape') { if (!event.repeat) state.mode === 'playing' ? pause() : state.mode === 'paused' && start(); return; }
    if (state.mode !== 'playing') { if (!event.repeat && ['enter', ' ', 'arrowup'].includes(key)) start(); return; }
    if (key === ' ' || key === 'arrowup') { if (!event.repeat) state.input.jump = true; state.input.held = true; }
    if (key === 'arrowdown' || key === 's') state.input.duck = true;
    if (key === 'arrowleft' || key === 'a') state.input.left = true;
    if (key === 'arrowright' || key === 'd') state.input.right = true;
    if ((key === 'x' || key === 'z') && !event.repeat) state.input.attack = true;
  };
  const keyup = (event) => {
    if (!focused()) return;
    if (event.key === ' ' || event.key === 'ArrowUp') state.input.held = false;
    const key = event.key.toLowerCase();
    if (key === 'arrowdown' || key === 's') state.input.duck = false;
    if (key === 'arrowleft' || key === 'a') state.input.left = false;
    if (key === 'arrowright' || key === 'd') state.input.right = false;
  };
  const pointerdown = (event) => { if (event.pointerType !== 'touch') root.focus({ preventScroll: true }); };
  const focusout = (event) => { if (!root.contains(event.relatedTarget)) pause(); };
  const hidden = () => { if (document.hidden) pause(); };
  root.addEventListener('keydown', keydown); root.addEventListener('keyup', keyup);
  root.addEventListener('focusout', focusout);
  canvas.addEventListener('pointerdown', pointerdown);
  document.addEventListener('visibilitychange', hidden);
  window.addEventListener('blur', pause);
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) pause(); }, { threshold: .05 });
  intersection.observe(root);
  const observer = new ResizeObserver(resize); observer.observe(canvas);
  const theme = new MutationObserver(() => { palette(); draw(); });
  theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  palette(); resize(); publish();
  return {
    start, pause,
    retryCheckpoint: () => { if (state.mode === 'over' && state.checkpoint) { retryCheckpoint(state, config); start(); } },
    restart: () => { beginRun(state, config); start(); },
    move: (direction, held) => { if (state.mode === 'playing') state.input[direction < 0 ? 'left' : 'right'] = held; },
    moveBriefly: (direction) => { if (state.mode === 'playing') { state.input[direction < 0 ? 'left' : 'right'] = true; clearTimeout(moveTimer); moveTimer = setTimeout(() => { state.input.left = false; state.input.right = false; }, 200); } },
    jump: (held) => { if (state.mode === 'playing') { state.input.jump = held; state.input.held = held; } },
    hop: () => { if (state.mode === 'playing') { state.input.jump = true; state.input.held = false; } },
    duck: (held) => { if (state.mode === 'playing') state.input.duck = held; },
    duckBriefly: () => { if (state.mode === 'playing') { state.input.duck = true; clearTimeout(duckTimer); duckTimer = setTimeout(() => { state.input.duck = false; }, 650); } },
    whip: () => { if (state.mode === 'playing') state.input.attack = true; },
    destroy: () => {
      disposed = true; stop(); clearTimeout(duckTimer); clearTimeout(moveTimer); save();
      observer.disconnect(); intersection.disconnect(); theme.disconnect();
      root.removeEventListener('keydown', keydown); root.removeEventListener('keyup', keyup);
      root.removeEventListener('focusout', focusout);
      canvas.removeEventListener('pointerdown', pointerdown);
      document.removeEventListener('visibilitychange', hidden);
      window.removeEventListener('blur', pause);
    },
  };
}
