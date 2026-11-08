import { useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import Section from '../components/Sections';
import BlenderCard from '../components/BlenderCard';
import { blenderProjects } from '../data/blenderProjects';
import { content } from '../data/content';
import useScrollMotion from '../hooks/useScrollMotion';
import usePageTitle from '../hooks/usePageTitle';
import { useReducedMotion } from '../hooks/useMediaQuery';
export default function Blender() {
 const reduced = useReducedMotion(); const [filter, setFilter] = useState(null); const ref = useRef(null);
 usePageTitle(content.blender.title); useScrollMotion(ref);
 const filtered = blenderProjects.filter((project) => !filter || project.primaryCategory === filter);
 return <div ref={ref}><Section {...content.blender}><div className="filter-row" role="group" aria-label={content.blender.filterLabel}>{[null, ...content.blender.categories].map((category) => <button className="filter-button" type="button" aria-pressed={filter === category} key={category || 'all'} onClick={() => setFilter(category)}>{category || content.blender.all}</button>)}</div>
  <m.div layout={!reduced} className="blender-grid"><AnimatePresence initial={false}>{filtered.map((project) => <BlenderCard key={project.slug} project={project} />)}</AnimatePresence></m.div>
  {!filtered.length && <p role="status">{content.blender.empty}</p>}
 </Section></div>;
}
