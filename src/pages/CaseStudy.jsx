import { useParams, Link, Navigate } from 'react-router';
import { useRef } from 'react';
import { projects } from '../data/projects';
import { content, ui } from '../data/content';
import { siteConfig } from '../data/siteConfig';
import Section from '../components/Sections';
import NotFound from './NotFound';
import usePageTitle from '../hooks/usePageTitle';
import useScrollMotion from '../hooks/useScrollMotion';
export default function CaseStudy() {
 const { id } = useParams(); const project = projects.find((item) => String(item.id) === id); const ref = useRef(null);
 usePageTitle(project?.title || content.notFound.title); useScrollMotion(ref);
 if (!project) return <NotFound />;
 if (!project.caseStudyPath) return <Navigate to={siteConfig.routes.projects} replace />;
 const previewLabel = project.previewLabel ?? content.projects.fallbackMarker;
 const sections = ['approach', 'outcome'].filter((key) => project.caseStudy?.[key]);
 return <div ref={ref}><Section eyebrow={content.caseStudy.eyebrow} title={project.title} description={project.summary}>
  <Link to={siteConfig.routes.projects} className="text-button">{ui.backProjects} ←</Link>
  <img className="case-image" src={project.imageMissing ? project.fallbackImage : project.image} alt={project.alt} width="1200" height="800" />
  {project.imageMissing && previewLabel && <p className="placeholder">{previewLabel}</p>}
  <div className="case-links"><a href={project.repo} className="text-button" target="_blank" rel="noopener noreferrer">{content.projects.repo} ↗</a>{!project.livePlaceholder && project.live && <a href={project.live} className="text-button" target="_blank" rel="noopener noreferrer">{content.projects.live} ↗</a>}</div>
  {sections.length > 0 && <div className="case-sections">{sections.map((key) => <article data-reveal key={key}><h2>{content.caseStudy[key]}</h2><p className="body-copy">{project.caseStudy[key]}</p></article>)}</div>}
 </Section></div>;
}
