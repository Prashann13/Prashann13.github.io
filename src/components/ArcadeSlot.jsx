import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { siteConfig } from '../data/siteConfig';
import { gameConfig } from '../data/gameConfig';
const ArcadePresentation = lazy(() => import('./ArcadePresentation'));
export default function ArcadeSlot() {
  const ref = useRef(null); const [near, setNear] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setNear(true); observer.disconnect(); } }, { rootMargin: '200px' });
    observer.observe(ref.current); return () => observer.disconnect();
  }, []);
  const skeleton = <div className="arcade-skeleton" role="status">{gameConfig.ui.loading}</div>;
  return <div className="arcade-card" ref={ref}><h3>{siteConfig.playerArea.arcadeHeading}</h3>
    <a className="arcade-skip" href={gameConfig.ui.skipTarget}>{gameConfig.ui.skip}</a>
    {near ? <Suspense fallback={skeleton}><ArcadePresentation /></Suspense> : skeleton}
    <span id="after-arcade" tabIndex={-1} />
  </div>;
}
