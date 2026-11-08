import { useEffect, useRef } from 'react';
import { blenderUi } from '../data/blenderUi';
export default function RenderZoom({ render, onClose }) {
 const ref = useRef(null);
 useEffect(() => {
  const previous = document.activeElement, dialog = ref.current, overflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden'; window.portfolioLenis?.stop(); dialog.showModal();
  return () => { dialog.close(); document.body.style.overflow = overflow; window.portfolioLenis?.start(); previous?.focus({ preventScroll: true }); };
 }, []);
 return <dialog ref={ref} className="render-zoom" aria-label={render.alt} data-lenis-prevent onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === ref.current) onClose(); }}>
  <button type="button" className="filter-button" autoFocus onClick={onClose}>{blenderUi.close} ×</button>
  <img src={render.src} srcSet={render.srcSet} sizes="94vw" alt={render.alt} width={render.width} height={render.height} />
 </dialog>;
}
