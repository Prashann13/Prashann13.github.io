import { lazy, Suspense, useState } from 'react';
import { Link, useParams } from 'react-router';
import ModelPreview from '../components/ModelPreview';
import ProcessSlider from '../components/ProcessSlider';
import RenderZoom from '../components/RenderZoom';
import { blenderProjects } from '../data/blenderProjects';
import { blenderUi as ui } from '../data/blenderUi';
import { siteConfig } from '../data/siteConfig';
import usePageTitle from '../hooks/usePageTitle';
const AnimationPlayer = lazy(() => import('../components/AnimationPlayer'));
export default function BlenderDetail() {
 const { slug } = useParams(); const index = blenderProjects.findIndex((item) => item.slug === slug);
 const project = blenderProjects[index]; const [zoom, setZoom] = useState(null);
 usePageTitle(project?.title || ui.missingTitle);
 const route = (item) => siteConfig.routes.blender + '/' + item.slug;
 if (!project) return <section className="section"><p className="eyebrow">{ui.missing}</p><h1>{ui.missingTitle}</h1><p>{ui.missingBody}</p><Link className="hud-button" to={siteConfig.routes.blender}>{ui.back}</Link></section>;
 const tools = [...(project.tools || []), ...(project.addons || [])];
 const detailKeys = ['concept', 'process', 'challenges'].filter((key) => project.details?.[key]);
 const stats = Object.entries(project.details?.stats || {}).filter(([, value]) => value);
 const previous = blenderProjects[(index - 1 + blenderProjects.length) % blenderProjects.length], next = blenderProjects[(index + 1) % blenderProjects.length];
 return <article className="section blender-detail">
  <header className="blender-detail-header"><Link className="detail-back meta" to={siteConfig.routes.blender}>← {ui.back}</Link><p className="eyebrow">{project.primaryCategory}{project.date ? ' / ' + project.date : ''}</p><h1>{project.title}</h1>
   {project.previewLabel && <p className="placeholder">{project.previewLabel}</p>}
   {!!tools.length && <ul className="tags">{tools.map((tool, i) => <li key={tool + i}>{tool}</li>)}</ul>}
  </header>
  {project.model && <section className="blender-detail-block" aria-labelledby="detail-model"><h2 id="detail-model">{ui.model}</h2><ModelPreview project={project} /></section>}
  {!!project.renders?.length && <section className="blender-detail-block" aria-labelledby="detail-render"><h2 id="detail-render">{project.thumbnailPlaceholder ? ui.sampleRender : ui.render}</h2><div className="render-gallery">{project.renders.map((render, i) => <button className="render-image" type="button" key={render.src} onClick={() => setZoom(render)} aria-label={ui.zoom + ': ' + render.alt}>
    <img src={render.src} srcSet={render.srcSet} sizes={render.sizes} alt={render.alt} width={render.width} height={render.height} loading="lazy" /><span className="meta">{ui.zoom} ↗ {i + 1}</span></button>)}</div>{project.process && <ProcessSlider process={project.process} />}</section>}
  {project.animation && <section className="blender-detail-block" aria-labelledby="detail-animation"><h2 id="detail-animation">{ui.animation}</h2><Suspense fallback={<p role="status">{ui.video.loading}</p>}><AnimationPlayer media={project.animation} /></Suspense></section>}
  <section className="blender-detail-block" aria-labelledby="detail-description"><h2 id="detail-description">{ui.description}</h2><p>{project.description}</p>{(detailKeys.length > 0 || stats.length > 0) && <div className="blender-description-grid">{!!detailKeys.length && <div>{detailKeys.map((key) => <div key={key}><h3>{ui[key]}</h3><p>{project.details[key]}</p></div>)}</div>}
   {!!stats.length && <div className="blender-stats"><h3>{ui.stats}</h3><dl>{stats.map(([key, value]) => <div key={key}><dt>{ui[key]}</dt><dd>{value}</dd></div>)}</dl></div>}</div>}</section>
  <nav className="blender-detail-nav" aria-label={ui.previous + ' / ' + ui.next}><Link to={route(previous)}><span className="meta">← {ui.previous}</span><strong>{previous.title}</strong></Link><Link to={route(next)}><span className="meta">{ui.next} →</span><strong>{next.title}</strong></Link></nav>
  {zoom && <RenderZoom render={zoom} onClose={() => setZoom(null)} />}
 </article>;
}
