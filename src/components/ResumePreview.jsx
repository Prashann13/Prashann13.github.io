import { useState } from 'react';
import useMediaQuery from '../hooks/useMediaQuery';
import { siteConfig } from '../data/siteConfig';
import { contactConfig } from '../data/contactConfig';

export default function ResumePreview() {
  const [active, setActive] = useState(false);
  const mobile = useMediaQuery('(max-width: 700px)');
  const c = contactConfig.resume;
  return <section className="resume-preview" aria-labelledby="resume-title">
    <h2 id="resume-title">{c.title}</h2>
    <div className="resume-links"><a className="text-button" href={siteConfig.resume} target="_blank" rel="noopener noreferrer">{c.open} ↗</a><a className="text-button" href={siteConfig.resume} download>{c.download} ↓</a></div>
    {!active && <button type="button" className="hud-button" onClick={() => setActive(true)}>{c.activate}</button>}
    {active && !mobile && <div data-lenis-prevent><iframe className="resume-frame" src={siteConfig.resume} title={c.viewerTitle} /></div>}
  </section>;
}
