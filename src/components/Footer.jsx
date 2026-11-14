import { Link, useLocation } from 'react-router';
import { siteConfig } from '../data/siteConfig';
import { socials } from '../data/socials';
import { content, ui } from '../data/content';
export default function Footer() {
 const { pathname } = useLocation(); const isContact = pathname === siteConfig.routes.contact;
 const back = (event) => { event.preventDefault(); if (window.portfolioLenis) window.portfolioLenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' }); document.getElementById('top')?.focus({ preventScroll: true }); };
 return <footer className="site-footer shell"><div className={'footer-top' + (isContact ? ' footer-top-compact' : '')}>{!isContact && <Link to={siteConfig.routes.contact} className="footer-title">{content.contact.title}<span aria-hidden="true">↗</span></Link>}<a className="text-button" href={siteConfig.sections.top} onClick={back}>{ui.backTop} ↑</a></div>
  <div className="footer-bottom"><p className="meta">© {new Date().getFullYear()} {siteConfig.footer}<span className="placeholder">{siteConfig.nameMarker}</span></p><ul className="social-links">{socials.map((item) => <li key={item.label}><a href={item.href} target="_blank" rel="noopener noreferrer">{item.label} ↗</a><small className="placeholder">{siteConfig.nameMarker}</small></li>)}</ul></div>
 </footer>;
}
