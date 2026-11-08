import HeroVisual from './HeroVisual';
import { useState } from 'react';
import { Link } from 'react-router';
import { content, ui } from '../data/content';
import { siteConfig } from '../data/siteConfig';
export default function Hero() {
 const [role, setRole] = useState(0); const h = content.hero;
 return <section id="hero" className="hero shell">
  <div className="hero-topline"><p className="eyebrow">{h.eyebrow}</p><span className="availability"><span aria-hidden="true" />{h.status}</span></div>
  <div className="hero-grid"><div className="hero-copy">
   <h1 data-stagger aria-label={h.greeting + ' ' + h.name + h.punctuation}><span>{h.greeting}</span><span className="hero-name">{h.name}<i>{h.punctuation}</i></span></h1>
   <button type="button" className="role-rotator" onClick={() => setRole((role + 1) % h.roles.length)} aria-label={h.roles[role] + ' / ' + ui.rotateRole}><span key={role}>{h.roles[role]}</span><span aria-hidden="true">↻</span></button>
   <p className="hero-description" data-reveal>{h.description}</p>
   <div className="hero-actions" data-reveal><Link to={siteConfig.routes.projects} className="hud-button" data-magnetic>{ui.viewProjects}<span aria-hidden="true">↗</span></Link></div>
  </div><HeroVisual /></div>
  <div className="hero-bottom"><a href={siteConfig.sections.about} className="meta">{h.scrollLabel} ↓</a><span className="meta">{h.online} <span className="signal-dot" aria-hidden="true" /></span></div>
 </section>;
}
