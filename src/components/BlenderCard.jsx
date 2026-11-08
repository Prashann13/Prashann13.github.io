import { useRef } from 'react';
import { Link } from 'react-router';
import { m } from 'framer-motion';
import { content } from '../data/content';
import { siteConfig } from '../data/siteConfig';
import { useReducedMotion } from '../hooks/useMediaQuery';
export default function BlenderCard({ project }) {
 const video = useRef(null); const reduced = useReducedMotion();
 const start = (event) => { if (!reduced && event.pointerType !== 'touch') video.current?.play().catch(() => {}); };
 const stop = () => { if (video.current) { video.current.pause(); video.current.currentTime = 0; } };
 return <m.article layout={!reduced} initial={false} exit={reduced ? undefined : { opacity: 0, scale: .98 }} className="blender-card">
  <Link className="blender-preview" to={siteConfig.routes.blender + '/' + project.slug} onPointerEnter={start} onPointerLeave={stop} onBlur={stop} aria-label={content.blender.open + ': ' + project.title}>
   <img src={project.thumbnail} srcSet={project.thumbnailSrcSet} alt={project.alt} width="1200" height="900" loading="lazy" sizes={project.thumbnailSizes} />
   {project.animation?.video && !reduced && <video ref={video} src={project.animation.video} poster={project.animation.poster} muted playsInline preload="none" aria-hidden="true" />}
   <span className="media-arrow" aria-hidden="true">↗</span>{project.thumbnailPlaceholder !== false && <span className="media-marker">{project.previewLabel || content.projects.fallbackMarker}</span>}
  </Link>
  <div className="card-meta"><span className="meta">{project.primaryCategory}{project.featured ? ' / ' + content.blender.featured : ''}</span>{project.date && <span className="meta">{project.date}</span>}</div><h2>{project.title}</h2><p className="project-summary">{project.description}</p>{!!project.tools?.length && <ul className="tags">{project.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>}
 </m.article>;
}
