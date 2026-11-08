import { useRef } from 'react';
import Section from '../components/Sections';
import SkillList from '../components/SkillList';
import { skillGroups, certifications } from '../data/skills';
import { content } from '../data/content';
import usePageTitle from '../hooks/usePageTitle';
import useScrollMotion from '../hooks/useScrollMotion';

export default function Skills() {
  const ref = useRef(null);
  usePageTitle(content.skills.title);
  useScrollMotion(ref);
  return <div ref={ref}><Section {...content.skills} className="skills-section"><div className="skills-grid">
    {Object.entries(skillGroups).map(([name, items], index) => <article key={name} className="skill-module">
      <span className="meta">{content.skills.module} {String(index + 1).padStart(2, '0')}</span>
      <h2 id={'skill-category-' + index}>{name}</h2>
      <SkillList items={items} labelledBy={'skill-category-' + index} />
    </article>)}
    <article className="skill-module"><h2>{content.skills.certifications}</h2>
      <ul>{certifications.map((item) => <li key={item.id}><a href={item.href} target="_blank" rel="noopener noreferrer">{item.label} — {item.issuer} ↗</a></li>)}</ul>
    </article>
  </div></Section></div>;
}
