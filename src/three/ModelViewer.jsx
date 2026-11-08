import { lazy, Suspense, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import useTheme from '../hooks/useTheme';
import useMediaQuery, { useReducedMotion } from '../hooks/useMediaQuery';
import useViewerInteraction from '../hooks/useViewerInteraction';
import { blenderUi } from '../data/blenderUi';
const ModelCanvas = lazy(() => import('./ModelCanvas'));
const ui = blenderUi.viewer;

function rememberHint() {
 try { sessionStorage.setItem(ui.hintStorageKey, 'seen'); } catch { /* Storage is optional. */ }
}
export default function ModelViewer({ src, onUnavailable, excludedNodes, viewer = {}, renderScene = true }) {
 const { theme } = useTheme(); const reduced = useReducedMotion();
 const touchDevice = useMediaQuery('(pointer: coarse)');
 const [touchRequested, setTouchRequested] = useState(false);
 const sceneEnabled = renderScene && (!touchDevice || touchRequested);
 const requestScene = useCallback(() => setTouchRequested(true), []);
 const shellRef = useRef(null), stageRef = useRef(null), apiRef = useRef(null), returnFocus = useRef(null);
 const [ready, setReady] = useState(false), [dragging, setDragging] = useState(false);
 const [mode, setMode] = useState('material');
 const [rotationChoice, setRotationChoice] = useState(null);
 const [animationPlaying, setAnimationPlaying] = useState(Boolean(viewer.animationAutoplay));
 const hasAnimations = Boolean(viewer.animationClips?.length);
 const autoRotate = rotationChoice ?? (Boolean(viewer.autoRotate ?? true) && !reduced);
 const [visible, setVisible] = useState(true), [fullscreen, setFullscreen] = useState(false);
 const [announcement, setAnnouncement] = useState('');
 const [hint, setHint] = useState(() => { try { return sessionStorage.getItem(ui.hintStorageKey) !== 'seen'; } catch { return true; } });
 const hintId = useId(), dismissed = useRef(false);
 const colors = useMemo(() => {
  const style = getComputedStyle(document.documentElement);
  const color = (token) => style.getPropertyValue(token).trim();
  return { base: color('--scene-base'), rim: color('--scene-rim'), sky: color('--scene-sky'),
   wire: color('--scene-wire'), clay: color('--scene-clay'), intensity: theme === 'dark' ? 1.2 : 2 };
 }, [theme]);
 const settings = useMemo(() => ({ ...viewer, autoRotate: autoRotate && !animationPlaying, animationPlaying }), [viewer, autoRotate, animationPlaying]);
 const activity = useCallback(() => { if (!dismissed.current) { dismissed.current = true; setHint(false); rememberHint(); } }, []);
 const loaded = useCallback(() => setReady(true), []);
 const { touchActive, changeTouch } = useViewerInteraction(stageRef, shellRef, apiRef, touchDevice, visible, ready, requestScene);

 useEffect(() => {
  let intersecting = true;
  const update = () => {
   const active = intersecting && !document.hidden; setVisible(active);
   if (!active) changeTouch(false);
  };
  const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; update(); }, { threshold: .01 });
  observer.observe(shellRef.current); document.addEventListener('visibilitychange', update);
  return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
 }, [changeTouch]);
 useEffect(() => {
  const shell = shellRef.current;
  const changed = () => {
   const active = document.fullscreenElement === shell; setFullscreen(active);
   setAnnouncement(active ? ui.fullscreenOn : ui.fullscreenOff);
   if (!active) returnFocus.current?.focus({ preventScroll: true });
  };
  const escape = (event) => {
   if (event.key === 'Escape' && document.fullscreenElement === shell) {
    event.preventDefault(); document.exitFullscreen().catch(() => setAnnouncement(ui.fullscreenUnavailable));
   }
  };
  document.addEventListener('fullscreenchange', changed); document.addEventListener('keydown', escape);
  return () => { document.removeEventListener('fullscreenchange', changed); document.removeEventListener('keydown', escape); };
 }, []);
 const toggleRotate = () => {
  const next = !autoRotate; setRotationChoice(next); apiRef.current?.activity();
  setAnnouncement(next ? ui.turntableOn : ui.turntableOff);
 };
 const reset = () => { apiRef.current?.reset(); setAnnouncement(ui.resetAnnouncement); };
 const togglePlayback = () => { const next = !animationPlaying; setAnimationPlaying(next); apiRef.current?.activity(); setAnnouncement(next ? ui.animationOn : ui.animationOff); };
 const zoom = (factor) => { apiRef.current?.zoom(factor); setAnnouncement(factor < 1 ? ui.zoomIn : ui.zoomOut); };
 const toggleFullscreen = async (event) => {
  apiRef.current?.activity();
  try {
   if (document.fullscreenElement === shellRef.current) await document.exitFullscreen();
   else {
    returnFocus.current = event.currentTarget;
    if (!shellRef.current.requestFullscreen) { setAnnouncement(ui.fullscreenUnavailable); return; }
    await shellRef.current.requestFullscreen(); stageRef.current?.focus({ preventScroll: true });
   }
  } catch { setAnnouncement(ui.fullscreenUnavailable); }
 };
 const keyboard = (event) => {
  if (event.target !== event.currentTarget || !ready) return;
  switch (event.key) {
   case 'ArrowLeft': apiRef.current?.rotate(-.14, 0); setAnnouncement(ui.rotatedLeft); break;
   case 'ArrowRight': apiRef.current?.rotate(.14, 0); setAnnouncement(ui.rotatedRight); break;
   case 'ArrowUp': apiRef.current?.rotate(0, -.12); setAnnouncement(ui.tiltedUp); break;
   case 'ArrowDown': apiRef.current?.rotate(0, .12); setAnnouncement(ui.tiltedDown); break;
   case '+': case '=': zoom(.8); break;
   case '-': case '_': zoom(1.25); break;
   case 'r': case 'R': reset(); break;
   case ' ': if (!event.repeat) toggleRotate(); break;
   case 'Escape': if (touchActive) { changeTouch(false); setAnnouncement(ui.touchOff); } else return; break;
   default: return;
  }
  event.preventDefault();
 };
 return <div ref={shellRef} className="model-viewer" data-render-state={visible ? 'active' : 'paused'}>
  <div ref={stageRef} className="model-canvas" tabIndex={0} role="group" aria-label={ui.canvas}
   aria-describedby={hintId} aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown + - R Space"
   data-touch-active={touchActive} data-dragging={dragging} onKeyDown={keyboard}>
   {sceneEnabled && <Suspense fallback={null}><ModelCanvas onUnavailable={onUnavailable} src={src} excludedNodes={excludedNodes} mode={mode} colors={colors} settings={settings}
     reduced={reduced} visible={visible} apiRef={apiRef} onReady={loaded} onActivity={activity} onDragging={setDragging} />
   </Suspense>}
   {!ready && <p className="model-loading" role="status">{sceneEnabled ? ui.loading : ui.touchStart}</p>}
   <AnimatePresence>{hint && <m.div className="model-first-hint" aria-hidden="true"
    initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .2 }}>
    <m.span className="model-drag-icon" animate={reduced ? { x: 0 } : { x: [0, 5, -5, 0] }} transition={{ duration: 1.2 }} aria-hidden="true">↔</m.span>
    <span>{touchDevice ? ui.touchHint : ui.firstHint}</span>
   </m.div>}</AnimatePresence>
  </div>
  <div className="model-control-bar" role="group" aria-label={ui.controls}>
   <button type="button" className="filter-button" disabled={!ready} title={ui.resetTooltip} aria-label={ui.reset} onClick={reset}>{ui.reset}</button>
   <button type="button" className="filter-button" disabled={!ready || animationPlaying} title={ui.turntableTooltip} aria-label={ui.turntable} aria-pressed={settings.autoRotate} onClick={toggleRotate}>{settings.autoRotate ? ui.pauseTurntable : ui.playTurntable}</button>
   {hasAnimations && <button type="button" className="filter-button" disabled={!ready} aria-pressed={animationPlaying} onClick={togglePlayback}>{animationPlaying ? ui.pauseAnimation : ui.playAnimation}</button>}
   <button type="button" className="filter-button" disabled={!ready} title={ui.zoomIn} aria-label={ui.zoomIn} onClick={() => zoom(.8)}>+</button>
   <button type="button" className="filter-button" disabled={!ready} title={ui.zoomOut} aria-label={ui.zoomOut} onClick={() => zoom(1.25)}>−</button>
   <button type="button" className="filter-button" title={fullscreen ? ui.exitFullscreen : ui.fullscreen} aria-label={fullscreen ? ui.exitFullscreen : ui.fullscreen} aria-pressed={fullscreen} onClick={toggleFullscreen}>{fullscreen ? ui.exitFullscreen : ui.fullscreen}</button>
   <div className="model-shading" role="group" aria-label={ui.shading}>{ui.modes.map((item) =>
    <button type="button" className="filter-button" key={item.value} disabled={!ready} aria-pressed={mode === item.value}
     title={item.tooltip} onClick={() => { setMode(item.value); apiRef.current?.activity(); setAnnouncement(ui.shadingAnnouncement + item.label); }}>{item.label}</button>)}</div>
   {touchDevice && <button type="button" className="hud-button model-interact" aria-pressed={touchActive} title={touchActive ? ui.doneTooltip : ui.interactTooltip}
    onClick={() => { changeTouch(!touchActive); setAnnouncement(touchActive ? ui.touchOff : ui.touchOn); }}>{touchActive ? ui.done : ui.interact}</button>}
  </div>
  <p className="model-hint meta" id={hintId}>{touchDevice ? (touchActive ? ui.touchActiveHint : ui.touchHint) : ui.scrollHint}</p>
  <p className="sr-only model-announcement" role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
 </div>;
}
