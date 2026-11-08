import { useCallback, useEffect, useRef, useState } from 'react';

// Native capture runs before OrbitControls' non-passive wheel listener.
// Ordinary scrolling is never prevented unless this viewport is deliberately armed.
export default function useViewerInteraction(stageRef, shellRef, apiRef, touchDevice, visible, ready, onRequestScene) {
 const [touchActive, setTouchActive] = useState(false);
 const armed = useRef(false);
 const activeTouch = useRef(false);
 const changeTouch = useCallback((active) => {
  activeTouch.current = active; setTouchActive(active);
  const stage = stageRef.current;
  stage?.toggleAttribute('data-lenis-prevent', active);
  if (stage) stage.dataset.touchActive = String(active);
  apiRef.current?.gate(active || armed.current, !touchDevice || active);
  if (active) { onRequestScene?.(); stage?.focus({ preventScroll: true }); apiRef.current?.activity(); }
 }, [apiRef, stageRef, touchDevice, onRequestScene]);
 useEffect(() => {
  const stage = stageRef.current, shell = shellRef.current;
  const pointers = new Set(); let wheelTimer; let mouseDown = false;
  const gate = () => apiRef.current?.gate(armed.current || activeTouch.current, !touchDevice || activeTouch.current);
  const release = () => {
   armed.current = false; stage.toggleAttribute('data-lenis-prevent', activeTouch.current);
   gate();
  };
  const wheel = (event) => {
   const allowed = visible && (armed.current || activeTouch.current || event.ctrlKey || event.metaKey);
   apiRef.current?.gate(allowed, !touchDevice || activeTouch.current);
   stage.toggleAttribute('data-lenis-prevent', allowed || activeTouch.current);
   if (allowed) apiRef.current?.activity();
   // No preventDefault/stopPropagation here: OrbitControls consumes allowed wheels.
   clearTimeout(wheelTimer);
   wheelTimer = setTimeout(() => { stage.toggleAttribute('data-lenis-prevent', armed.current || activeTouch.current); gate(); }, 180);
  };
  const pointerDown = (event) => {
   if (!visible) return;
   if (event.pointerType === 'touch') {
    pointers.add(event.pointerId);
    if (pointers.size >= 2) changeTouch(true);
    gate();
    if (activeTouch.current) { stage.focus({ preventScroll: true }); apiRef.current?.activity(true); }
   } else {
    mouseDown = true; armed.current = true; stage.setAttribute('data-lenis-prevent', '');
    stage.focus({ preventScroll: true }); gate(); apiRef.current?.activity(true);
   }
  };
  const pointerUp = (event) => {
   if (!mouseDown && !pointers.has(event.pointerId)) return;
   mouseDown = false; pointers.delete(event.pointerId);
   if (!pointers.size) apiRef.current?.end();
  };
  const focus = () => { if (!touchDevice) { armed.current = true; stage.setAttribute('data-lenis-prevent', ''); gate(); } };
  const blur = () => release();
  const focusOut = (event) => {
   if (!shell.contains(event.relatedTarget)) { changeTouch(false); release(); }
  };
  const touch = (event) => {
   if (visible && event.touches.length >= 2 && !activeTouch.current) changeTouch(true);
   if (activeTouch.current && event.cancelable) event.preventDefault();
  };
  if (!visible) armed.current = false;
  gate();
  stage.addEventListener('wheel', wheel, { capture: true, passive: true });
  stage.addEventListener('pointerdown', pointerDown, true);
  stage.addEventListener('pointerleave', release);
  stage.addEventListener('focus', focus);
  stage.addEventListener('blur', blur);
  stage.addEventListener('touchstart', touch, { passive: false });
  stage.addEventListener('touchmove', touch, { passive: false });
  shell.addEventListener('focusout', focusOut);
  window.addEventListener('pointerup', pointerUp);
  window.addEventListener('pointercancel', pointerUp);
  return () => {
   clearTimeout(wheelTimer);
   stage.removeEventListener('wheel', wheel, true);
   stage.removeEventListener('pointerdown', pointerDown, true);
   stage.removeEventListener('pointerleave', release);
   stage.removeEventListener('focus', focus);
   stage.removeEventListener('blur', blur);
   stage.removeEventListener('touchstart', touch);
   stage.removeEventListener('touchmove', touch);
   shell.removeEventListener('focusout', focusOut);
   window.removeEventListener('pointerup', pointerUp);
   window.removeEventListener('pointercancel', pointerUp);
   stage.removeAttribute('data-lenis-prevent');
  };
 }, [apiRef, stageRef, shellRef, touchDevice, visible, ready, changeTouch]);
 return { touchActive, changeTouch };
}
