import { Link } from 'react-router';
import { m } from 'framer-motion';
import { content } from '../data/content';
import { useReducedMotion } from '../hooks/useMediaQuery';
export default function ProjectCard({ project, headingLevel = 'h3' }) {
 const Heading = headingLevel; const reduced = useReducedMotion(); const p = content.projects;
 const previewLabel = project.previewLabel ?? p.fallbackMarker;
 const Media = project.caseStudyPath ? Link : 'div';
 return <m.article layout={!reduced} initial={false} animate={{ opacity: 1 }} className="project-card">
  <Media to={project.caseStudyPath || undefined} className="project-media" aria-label={project.caseStudyPath ? p.caseStudy + ': ' + project.title + (project.imageMissing && previewLabel ? ' / ' + previewLabel + ' ↗' : '') : undefined}>
   <img src={project.imageMissing ? project.fallbackImage : project.image} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = project.fallbackImage; }} alt={project.alt} width="1200" height="800" loading="lazy" />
   {project.imageMissing && previewLabel && <span className="media-marker">{previewLabel}</span>}{project.caseStudyPath && <span className="media-arrow" aria-hidden="true">↗</span>}
  </Media>
  <div className="project-body"><div className="card-meta"><span className="meta">{p.cardLabel} {String(project.id).padStart(2, '0')}</span><span className="meta">{project.year}</span></div>
   <Heading>{project.caseStudyPath ? <Link to={project.caseStudyPath}>{project.title}</Link> : project.title}</Heading><p className="project-summary">{project.summary}</p><ul className="tags">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
   <div className="project-links">{!project.livePlaceholder && project.live && <a href={project.live} target="_blank" rel="noopener noreferrer">{p.live} ↗</a>}<a href={project.repo} target="_blank" rel="noopener noreferrer">{p.repo} ↗</a>{project.caseStudyPath && <Link to={project.caseStudyPath}>{p.caseStudy} →</Link>}</div>
  </div>
 </m.article>;
}
