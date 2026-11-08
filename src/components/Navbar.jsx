import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import ThemeToggle from './ThemeToggle';
import { navigation, siteConfig } from '../data/siteConfig';
import { ui } from '../data/content';
export default function Navbar() {
 const [open, setOpen] = useState(false); const [hidden, setHidden] = useState(false); const [active, setActive] = useState('hero');
 const { pathname } = useLocation();
 useEffect(() => {
  let last = window.scrollY;
  const onScroll = () => { const next = window.scrollY; setHidden(next > 180 && next > last && !document.querySelector('.site-header:focus-within')); last = next; };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
 }, []);
 useEffect(() => {
  const observer = new IntersectionObserver((entries) => { for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id); }, { rootMargin: '-15% 0px -65% 0px' });
  const seen = new Set();
  const scan = () => document.querySelectorAll('section[id]').forEach((section) => { if (!seen.has(section)) { observer.observe(section); seen.add(section); } });
  const mutations = new MutationObserver(scan); mutations.observe(document.getElementById('main'), { childList: true, subtree: true }); scan();
  return () => { mutations.disconnect(); observer.disconnect(); };
 }, [pathname]);
 const handleKey = (event) => { if (event.key === 'Escape') { setOpen(false); document.getElementById('menu-toggle')?.focus(); } };
 return <header className={'site-header ' + (hidden && !open ? 'is-hidden' : '')} onKeyDown={handleKey}>
  <nav className="nav-shell" aria-label={ui.mainNav}>
   <Link to={siteConfig.routes.home} className="brand" onClick={() => setOpen(false)}><span>{siteConfig.name}<small>{siteConfig.nameMarker}</small></span></Link>
   <ul className="desktop-nav">{navigation.map((item) => <li key={item.to}><NavLink to={item.to} end={item.end} className={({ isActive }) => 'nav-link ' + (isActive ? 'is-active' : '')}>{item.label}<span aria-hidden="true">.</span></NavLink></li>)}</ul>
   <div className="nav-controls"><ThemeToggle /><button id="menu-toggle" type="button" className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? ui.closeMenu : ui.openMenu}>{open ? ui.close : ui.menu}<span aria-hidden="true">{open ? '−' : '+'}</span></button></div>
  </nav>
  {open && <ul id="mobile-menu" className="mobile-menu">{navigation.map((item) => <li key={item.to}><NavLink to={item.to} end={item.end} onClick={() => setOpen(false)}><span className="meta">{item.code}</span>{item.label} ↗</NavLink></li>)}<li><a href={siteConfig.resume} download>{ui.downloadResume}<small>{siteConfig.resumeMarker}</small></a></li></ul>}
  {pathname === siteConfig.routes.home && <div className="section-progress" aria-hidden="true"><span style={{ width: ({ hero: '12%', about: '30%', 'player-profile': '55%', experience: '100%' })[active] || '12%' }} /></div>}
 </header>;
}
