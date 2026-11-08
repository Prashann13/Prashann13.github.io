import Section from '../components/Sections';
import { experience } from '../data/experience';
import { content } from '../data/content';
export default function Timeline() {
 return <Section id="experience" {...content.experience} headingLevel="h2"><ol className="timeline">{experience.map((entry) => <li key={entry.id} data-reveal><div className="timeline-date"><span className="meta">{entry.date}</span>{entry.type && <span className="meta">{entry.type}</span>}</div><div className="timeline-detail"><h3>{entry.title}</h3><p className="meta">{entry.organization}</p>{entry.paragraphs.map((paragraph) => <p className="body-copy" key={paragraph}>{paragraph}</p>)}{entry.editions && <ul className="body-copy">{entry.editions.map((edition) => <li key={edition}>{edition}</li>)}</ul>}{entry.note && <p className="meta">{entry.note}</p>}</div></li>)}</ol></Section>;
}
