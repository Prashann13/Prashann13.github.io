import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useMediaQuery';
import { siteConfig } from '../data/siteConfig';
import { ui } from '../data/content';
export default function Preloader() {
 const reduced = useReducedMotion();
 const [visible, setVisible] = useState(() => { try { return !sessionStorage.getItem(siteConfig.introStorageKey); } catch { return true; } });
 const dismiss = () => { setVisible(false); try { sessionStorage.setItem(siteConfig.introStorageKey, 'seen'); } catch { /* Session storage optional. */ } };
 useEffect(() => {
  const timeout = setTimeout(() => { setVisible(false); try { sessionStorage.setItem(siteConfig.introStorageKey, 'seen'); } catch { /* Optional. */ } }, 900);
  return () => clearTimeout(timeout);
 }, []);
 if (!visible || reduced) return null;
 return <div className="boot-screen" aria-label={ui.boot}>
  <div><span className="boot-mark" aria-hidden="true">/</span><p className="eyebrow">{ui.boot}</p><div className="boot-progress" /><p className="meta">{ui.bootReady}</p></div>
  <button type="button" onClick={dismiss} className="text-button">{ui.skipBoot} ↗</button>
 </div>;
}