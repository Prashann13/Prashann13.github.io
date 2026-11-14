import { useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import ProjectShowcase from '../sections/ProjectShowcase';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/projects';
import { content } from '../data/content';
import usePageTitle from '../hooks/usePageTitle';
import useScrollMotion from '../hooks/useScrollMotion';
const tags = [...new Set(projects.flatMap((project) => project.tags))];
export default function Projects() {
 const [filter, setFilter] = useState(null); const ref = useRef(null); usePageTitle(content.projects.title); useScrollMotion(ref);
 const filtered = projects.filter((project) => !filter || project.tags.includes(filter));
 return <div ref={ref}><ProjectShowcase><div className="filter-row" role="group" aria-label={content.projects.filterLabel}>{[null, ...tags].map((tag) => <button type="button" key={tag || 'all'} className="filter-button" aria-pressed={filter === tag} onClick={() => setFilter(tag)}>{tag || content.projects.all}</button>)}</div><m.div layout className="projects-grid"><AnimatePresence mode="popLayout">{filtered.map((project) => <ProjectCard headingLevel="h2" project={project} key={project.id} />)}</AnimatePresence></m.div></ProjectShowcase></div>;
}