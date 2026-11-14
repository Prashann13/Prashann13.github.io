import { useEffect, useRef } from 'react';
import useMediaQuery from '../hooks/useMediaQuery';
import { content } from '../data/content';
import '../styles/hero-logos.css';

const logos = [
 { id: 'react', src: '/logos/react.png', cell: 0 },
 { id: 'python', src: '/logos/python.png', cell: 2 },
 { id: 'javascript', src: '/logos/javascript.png', cell: 4 },
 { id: 'blender', src: '/logos/blender.png', cell: 6 },
 { id: 'sql', src: '/logos/sql.png', cell: 8 },
];
const grid = [21 / 720, 252 / 720, 483 / 720];

export default function HeroVisual() {
 const ref = useRef(null);
 const hover = useMediaQuery('(hover: hover) and (pointer: fine)');

 useEffect(() => {
  if (!hover) return;
  const stage = ref.current;
  const tiles = Array.from(stage.children);
  const cells = logos.map((logo) => logo.cell);
  let frame = 0, pointerX = 0, pointerY = 0;

  const reset = () => {
   cancelAnimationFrame(frame);
   frame = 0;
   for (let i = 0; i < tiles.length; i++) {
    cells[i] = logos[i].cell;
    tiles[i].style.removeProperty('transform');
   }
  };

  const evade = () => {
   frame = 0;
   const bounds = stage.getBoundingClientRect();
   const x = (pointerX - bounds.left) / bounds.width;
   const y = (pointerY - bounds.top) / bounds.height;
   let closest = -1, distance = .26 ** 2;
   for (let i = 0; i < cells.length; i++) {
    const dx = grid[cells[i] % 3] + .15 - x;
    const dy = grid[Math.floor(cells[i] / 3)] + .15 - y;
    const squared = dx * dx + dy * dy;
    if (squared < distance) { closest = i; distance = squared; }
   }
   if (closest === -1) return;

   const current = cells[closest];
   let destination = -1, best = distance + .035;
   for (let pass = 0; pass < 2 && destination === -1; pass++) {
    for (let cell = 0; cell < 9; cell++) {
     if (cells.includes(cell)) continue;
     const adjacent = Math.abs(cell % 3 - current % 3) + Math.abs(Math.floor(cell / 3) - Math.floor(current / 3)) === 1;
     if (pass === 0 && !adjacent) continue;
     const dx = grid[cell % 3] + .15 - x;
     const dy = grid[Math.floor(cell / 3)] + .15 - y;
     const squared = dx * dx + dy * dy;
     if (squared > best) { destination = cell; best = squared; }
    }
   }
   if (destination === -1) return;
   cells[closest] = destination;
   tiles[closest].style.transform = `translate(${grid[destination % 3] / .3 * 100}%, ${grid[Math.floor(destination / 3)] / .3 * 100}%)`;
  };

  const move = (event) => {
   if (event.pointerType === 'touch' || document.hidden) return;
   pointerX = event.clientX;
   pointerY = event.clientY;
   if (!frame) frame = requestAnimationFrame(evade);
  };
  const visibility = () => { if (document.hidden) reset(); };
  const observer = new IntersectionObserver(([entry]) => {
   if (!entry.isIntersecting) reset();
  });
  observer.observe(stage);
  stage.addEventListener('pointerenter', move);
  stage.addEventListener('pointermove', move);
  stage.addEventListener('pointerleave', reset);
  stage.addEventListener('pointercancel', reset);
  document.addEventListener('visibilitychange', visibility);
  return () => {
   reset();
   observer.disconnect();
   stage.removeEventListener('pointerenter', move);
   stage.removeEventListener('pointermove', move);
   stage.removeEventListener('pointerleave', reset);
   stage.removeEventListener('pointercancel', reset);
   document.removeEventListener('visibilitychange', visibility);
  };
 }, [hover]);

 return <div className="hero-visual hero-logo-animation" data-parallax>
  <div ref={ref} className="hero-logo-stage" role="img" aria-label={content.hero.artAlt}>
   {logos.map((logo) => <div key={logo.id} className={'hero-logo-tile hero-logo-tile--' + logo.id}>
    <img src={logo.src} alt="" width="1024" height="1024" draggable="false" fetchPriority="high" />
   </div>)}
  </div>
  <div className="visual-caption">
   <p className="meta">{content.hero.artLabel}</p>
   {hover && <span className="meta">HOVER TO EXPLORE</span>}
  </div>
 </div>;
}
