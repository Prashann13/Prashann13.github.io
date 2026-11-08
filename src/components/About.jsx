import Section from './Sections';
import PortraitCard from './PortraitCard';
import { content } from '../data/content';
import { skillGroups } from '../data/skills';
export default function About() {
 const a = content.about;
 return <Section id="about" {...a} headingLevel="h2"><div className="about-grid"><PortraitCard /><div className="about-story"><h3 className="story-title" data-heading>{a.focus}</h3><p className="body-copy" data-reveal>{a.focusDescription}</p>{a.paragraphs.map((paragraph) => <p className="body-copy" data-reveal key={paragraph}>{paragraph}</p>)}<p className="body-copy" data-reveal>{a.interest}</p><h3 className="meta">{a.booksLabel}</h3><ul className="body-copy">{a.books.map((book) => <li key={book}>{book}</li>)}</ul><div className="tech-display" data-stagger>{Object.values(skillGroups).flat().slice(0, 7).map((skill) => <span className="tech-chip" key={skill}>{skill}</span>)}</div></div></div></Section>;
}
