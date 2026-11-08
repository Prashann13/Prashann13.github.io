import { useEffect, useId, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useMediaQuery';
import { loadMotionEngine } from '../hooks/motionEngine';

export default function SkillList({ items, labelledBy }) {
  const viewportRef = useRef(null);
  const instructionId = useId();
  const reduced = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const isStatic = reduced || failed;

  useEffect(() => {
    if (isStatic) return;
    let disposed = false;
    let cleanup;
    loadMotionEngine().then(({ gsap }) => {
      if (disposed || !viewportRef.current) return;
      const viewport = viewportRef.current;
      const card = viewport.closest('.skill-module');
      const names = [...viewport.querySelectorAll('.skill-name')];
      const setters = names.map((name) => ({
        transform: gsap.quickSetter(name, 'transform'),
        filter: gsap.quickSetter(name, 'filter'),
        color: gsap.quickSetter(name, 'color'),
        weight: gsap.quickSetter(name, 'fontWeight'),
      }));
      let pitch = viewport.querySelector('li')?.offsetHeight || 48;
      let frame = 0;
      let snapTimer;
      let snapTween;
      let previousActive = -1;
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
      const render = () => {
        frame = 0;
        const progress = viewport.scrollTop / pitch;
        const active = clamp(Math.round(progress), 0, names.length - 1);
        for (let index = 0; index < setters.length; index++) {
          const distance = clamp((index - progress) / 2, -1, 1);
          const amount = Math.abs(distance);
          setters[index].transform('perspective(1000px) rotateX(' + distance * 32 + 'deg) rotateZ(' + distance * 10 + 'deg) scale(' + (1 - amount * .15) + ')');
          setters[index].filter('blur(' + amount * 2 + 'px)');
          if (active !== previousActive) {
            setters[index].color(index === active ? 'var(--text)' : 'var(--muted)');
            setters[index].weight(index === active ? 600 : 400);
          }
        }
        previousActive = active;
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
      const stopSnap = () => {
        clearTimeout(snapTimer);
        snapTween?.kill();
        viewport.style.scrollSnapType = '';
      };
      const snapTo = (top) => {
        stopSnap();
        viewport.style.scrollSnapType = 'none';
        snapTween = gsap.to(viewport, {
          scrollTop: top, duration: .22, ease: 'power2.out',
          onComplete: () => { viewport.style.scrollSnapType = ''; },
        });
      };
      const release = () => card.removeAttribute('data-lenis-prevent-wheel');
      const wheel = (event) => {
        if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY) || !event.cancelable) {
          release(); return;
        }
        const delta = event.deltaY * .5 * (event.deltaMode === 1 ? pitch / 3 : event.deltaMode === 2 ? viewport.clientHeight : 1);
        const limit = viewport.scrollHeight - viewport.clientHeight;
        if ((delta < 0 && viewport.scrollTop <= .5) || (delta > 0 && viewport.scrollTop >= limit - .5)) {
          stopSnap(); release(); return;
        }
        event.preventDefault();
        card.setAttribute('data-lenis-prevent-wheel', '');
        stopSnap();
        viewport.style.scrollSnapType = 'none';
        viewport.scrollTop = clamp(viewport.scrollTop + delta, 0, limit);
        schedule();
        snapTimer = setTimeout(() => snapTo(Math.round(viewport.scrollTop / pitch) * pitch), 160);
      };
      const keyboard = (event) => {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        const index = Math.round(viewport.scrollTop / pitch);
        const targets = { ArrowUp: index - 1, ArrowDown: index + 1, PageUp: index - 4, PageDown: index + 4, Home: 0, End: names.length - 1 };
        if (!(event.key in targets)) return;
        const top = clamp(targets[event.key], 0, names.length - 1) * pitch;
        if (Math.abs(top - viewport.scrollTop) < .5) return;
        event.preventDefault(); snapTo(top);
      };
      const observer = new ResizeObserver(() => {
        pitch = viewport.querySelector('li')?.offsetHeight || 48;
        schedule();
      });
      observer.observe(viewport);
      viewport.addEventListener('scroll', schedule, { passive: true });
      viewport.addEventListener('pointerdown', stopSnap, { passive: true });
      viewport.addEventListener('keydown', keyboard);
      card.addEventListener('wheel', wheel, { passive: false });
      card.addEventListener('pointerleave', release);
      render();
      cleanup = () => {
        stopSnap(); release(); observer.disconnect(); cancelAnimationFrame(frame);
        viewport.removeEventListener('scroll', schedule);
        viewport.removeEventListener('pointerdown', stopSnap);
        viewport.removeEventListener('keydown', keyboard);
        card.removeEventListener('wheel', wheel);
        card.removeEventListener('pointerleave', release);
        for (const name of names) {
          for (const property of ['transform', 'filter', 'color', 'font-weight']) name.style.removeProperty(property);
        }
      };
    }).catch(() => { if (!disposed) setFailed(true); });
    return () => { disposed = true; cleanup?.(); };
  }, [items, isStatic]);

  return <div className={'skill-list' + (isStatic ? ' is-static' : '')}>
    <span className="skill-focus-arrow" aria-hidden="true">→</span>
    <div ref={viewportRef} className="skill-list-viewport" tabIndex={isStatic ? undefined : 0}
      role={isStatic ? undefined : 'region'} aria-labelledby={isStatic ? undefined : labelledBy}
      aria-describedby={isStatic ? undefined : instructionId} data-lenis-prevent-touch={isStatic ? undefined : ''}>
      <ul>{items.map((item) => <li key={item}><span className="skill-name">{item}</span></li>)}</ul>
    </div>
    {!isStatic && <span id={instructionId} className="sr-only">Use the up and down arrow keys to browse skills. Home and End move to the first and last skill.</span>}
  </div>;
}
