import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import useMediaQuery from '../hooks/useMediaQuery';
import { loadMotionEngine } from '../hooks/motionEngine';
export default function MotionFoundation() {
 const desktop = useMediaQuery('(pointer: fine) and (min-width: 1024px)');
 const cursor = useRef(null); const { pathname } = useLocation();
 useEffect(() => {
  let disposed = false; let lenis; let ticker; let core;
  Promise.all([import('lenis'), loadMotionEngine()]).then(([module, engine]) => {
   if (disposed) return;
   core = engine;
   lenis = new module.default({ lerp: .1, smoothWheel: true, anchors: true });
   window.portfolioLenis = lenis;
   lenis.on('scroll', core.ScrollTrigger.update);
   ticker = (time) => lenis.raf(time * 1000);
   core.gsap.ticker.add(ticker);
  });
  return () => { disposed = true; if (ticker) core.gsap.ticker.remove(ticker); lenis?.destroy(); delete window.portfolioLenis; };
 }, []);
 useEffect(() => {
  if (!desktop) return;
  let magnetic;
  const move = (event) => {
   if (cursor.current) { cursor.current.style.transform = 'translate3d(' + event.clientX + 'px,' + event.clientY + 'px,0)'; cursor.current.style.opacity = '1'; }
   const next = event.target.closest('[data-magnetic]');
   if (magnetic && magnetic !== next) magnetic.style.translate = '';
   magnetic = next;
   if (next) { const rect = next.getBoundingClientRect(); next.style.translate = (event.clientX - rect.left - rect.width / 2) * .09 + 'px ' + (event.clientY - rect.top - rect.height / 2) * .09 + 'px'; }
   cursor.current?.classList.toggle('is-interactive', Boolean(event.target.closest('a,button')));
  };
  const reset = () => { if (cursor.current) cursor.current.style.opacity = '0'; if (magnetic) magnetic.style.translate = ''; };
  document.addEventListener('pointermove', move); document.addEventListener('pointerleave', reset);
  return () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', reset); reset(); };
 }, [desktop, pathname]);
 return desktop ? <div ref={cursor} className="custom-cursor" aria-hidden="true" /> : null;
}