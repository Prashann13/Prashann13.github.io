import { useEffect, useRef, useState } from 'react';
import SceneBoundary from './SceneBoundary';
import { supportsWebGL, isLowPower } from '../hooks/deviceCapabilities';
import { content, ui } from '../data/content';
import ModelViewer from '../three/ModelViewer';
export default function ModelPreview({ project }) {
 const [capable] = useState(() => !isLowPower() && supportsWebGL());
 const [unavailable, setUnavailable] = useState(false), [near, setNear] = useState(false);
 const sectionRef = useRef(null);
 const fallback = <img src={project.thumbnail} srcSet={project.thumbnailSrcSet} sizes={project.heroSizes || project.thumbnailSizes} alt={project.alt} width="1200" height="900" />;
 const c = content.blender;
 useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
   if (entry.isIntersecting) { setNear(true); observer.disconnect(); }
  }, { rootMargin: '200px' });
  observer.observe(sectionRef.current);
  return () => observer.disconnect();
 }, []);
 const src = project.model;
 return <div className="model-preview" ref={sectionRef}>{capable && !unavailable
  ? <SceneBoundary key={src} fallback={<div className="model-stage"><p className="field-error" role="alert">{c.glbError}</p>{fallback}</div>}>
     <ModelViewer renderScene={near} src={src} viewer={project.viewer} excludedNodes={project.modelExcludedNodes}
      onUnavailable={() => setUnavailable(true)} />
    </SceneBoundary>
  : <div className="model-stage">{fallback}</div>}
  {project.modelPlaceholder !== false && <p className="placeholder">{c.sample}</p>}
  {(unavailable || !capable) && <p role="status">{ui.webglUnavailable}</p>}
 </div>;
}
