import { useEffect, useRef, useState } from 'react';
import useMediaQuery from '../hooks/useMediaQuery';
import { content } from '../data/content';
import { hudProfile as profile } from '../data/hudProfile';

export default function PortraitCard() {
  const ref = useRef(null);
  const [flipped, setFlipped] = useState(false);
  const interactive = useMediaQuery('(hover: hover) and (pointer: fine)');
  const h = content.hero;

  useEffect(() => {
    if (!interactive) return;
    const figure = ref.current;
    const card = figure.querySelector('.portrait-card');
    let bounds, frame = 0, previousTime = 0;
    let x = 0, y = 0, targetX = 0, targetY = 0;

    const render = (time) => {
      const blend = 1 - Math.exp(-Math.min(time - previousTime, 64) / 65);
      previousTime = time;
      x += (targetX - x) * blend;
      y += (targetY - y) * blend;
      const settled = Math.abs(targetX - x) + Math.abs(targetY - y) < .001;
      if (settled) { x = targetX; y = targetY; }
      card.style.setProperty('--portrait-rx', `${-y * 9}deg`);
      card.style.setProperty('--portrait-ry', `${x * 11}deg`);
      card.style.setProperty('--portrait-light-x', `${50 + x * 45}%`);
      card.style.setProperty('--portrait-light-y', `${50 + y * 45}%`);
      frame = settled ? 0 : requestAnimationFrame(render);
    };
    const schedule = () => {
      if (!frame) { previousTime = performance.now(); frame = requestAnimationFrame(render); }
    };
    const move = (event) => {
      if (event.pointerType !== 'mouse') return;
      bounds ||= figure.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      card.dataset.hovered = 'true';
      schedule();
    };
    const reset = () => {
      bounds = null;
      targetX = targetY = 0;
      delete card.dataset.hovered;
      if (x || y || frame) schedule();
    };
    figure.addEventListener('pointermove', move);
    figure.addEventListener('pointerleave', reset);
    figure.addEventListener('pointercancel', reset);
    window.addEventListener('scroll', reset, { passive: true });
    window.addEventListener('resize', reset);
    window.addEventListener('blur', reset);
    return () => {
      cancelAnimationFrame(frame);
      figure.removeEventListener('pointermove', move);
      figure.removeEventListener('pointerleave', reset);
      figure.removeEventListener('pointercancel', reset);
      window.removeEventListener('scroll', reset);
      window.removeEventListener('resize', reset);
      window.removeEventListener('blur', reset);
      delete card.dataset.hovered;
      card.removeAttribute('style');
    };
  }, [interactive]);

  return <div ref={ref} className="portrait portrait-stage" data-reveal>
    <div className="portrait-card">
      <div className="portrait-card-turn" data-flipped={flipped}>
      <figure className="portrait-card-face portrait-card-front" aria-hidden={flipped} inert={flipped}>
      <div className="portrait-card-header">
        <span>{h.eyebrow}</span><span className="portrait-card-status"><span aria-hidden="true" />{h.online}</span>
      </div>
      <div className="portrait-card-image">
        <span className="portrait-card-wordmark" aria-hidden="true">{h.name}</span>
        <img src={h.portraitOptimized} srcSet={`${h.portraitSmall} 480w, ${h.portraitMedium} 640w, ${h.portraitOptimized} 800w`} sizes="(min-width: 1001px) 473px, (min-width: 701px) 473px, min(378px, 90vw)" alt={h.portraitAlt} width="800" height="800" loading="lazy" />
      </div>
      <span className="portrait-card-sheen" aria-hidden="true" />
      <figcaption className="portrait-card-caption">
        <span className="portrait-card-label">{h.visualLabel}</span>
        <strong>{h.name}<span aria-hidden="true">.</span></strong>
        <span className="portrait-card-role">{h.roles[0]}</span>
      </figcaption>
      </figure>
      <div className="portrait-card-face portrait-card-back" aria-hidden={!flipped} inert={!flipped}>
        <div className="portrait-card-header"><span>{h.eyebrow}</span><span>{profile.location}</span></div>
        <div className="portrait-card-stats">
          <div className="portrait-stats-heading">
            <div><span className="portrait-card-label">PLAYER PROFILE // {profile.tabs[0].label}</span><strong>{profile.handle}</strong><span className="portrait-card-role">{profile.role}</span></div>
            <div className="portrait-card-level"><span>{profile.levelLabel}</span><strong>{profile.level}</strong></div>
          </div>
          <div className="hud-stats">{profile.stats.map((stat) => <div className="hud-stat" key={stat.id}>
            <div className="hud-stat-label"><span>{stat.label}</span><span>{stat.value}</span></div>
            <div className="hud-meter" role="meter" aria-label={stat.label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={stat.value}>
              <span style={{ transform: `scaleX(${stat.value / 100})`, transformOrigin: 'left' }} />
            </div>
          </div>)}</div>
          <p className="portrait-card-availability">{profile.status}</p>
        </div>
        <span className="portrait-card-sheen" aria-hidden="true" />
        <div className="portrait-card-back-footer"><span className="portrait-card-label">{h.visualLabel}</span></div>
      </div>
      </div>
      <button type="button" className="portrait-card-flip" aria-label={flipped ? 'Show portrait' : 'Show player stats'} onClick={() => setFlipped((value) => !value)}>
        <span className="portrait-flip-hint" aria-hidden="true">{flipped ? 'PORTRAIT' : 'STATS'} <span>↻</span></span>
      </button>
    </div>
  </div>;
}
