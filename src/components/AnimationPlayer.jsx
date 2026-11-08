import { useEffect, useId, useRef, useState } from 'react';
import { blenderUi } from '../data/blenderUi';
export default function AnimationPlayer({ media }) {
 const root = useRef(null), video = useRef(null), id = useId(); const ui = blenderUi.video;
 const [near, setNear] = useState(false), [playing, setPlaying] = useState(false), [muted, setMuted] = useState(true);
 const [time, setTime] = useState(0), [duration, setDuration] = useState(0), [failed, setFailed] = useState(false);
 const [fullscreen, setFullscreen] = useState(false), [notice, setNotice] = useState('');
 useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setNear(true); else video.current?.pause(); }, { rootMargin: '100px' });
  observer.observe(root.current);
  const hide = () => { if (document.hidden) video.current?.pause(); };
  const change = () => setFullscreen(document.fullscreenElement === root.current);
  document.addEventListener('visibilitychange', hide); document.addEventListener('fullscreenchange', change);
  return () => { observer.disconnect(); document.removeEventListener('visibilitychange', hide); document.removeEventListener('fullscreenchange', change); };
 }, []);
 const play = () => { if (playing) video.current?.pause(); else video.current?.play().catch(() => setFailed(true)); };
 const expand = async () => {
  try { if (fullscreen) await document.exitFullscreen(); else if (root.current.requestFullscreen) await root.current.requestFullscreen(); else setNotice(ui.fullscreenUnavailable); }
  catch { setNotice(ui.fullscreenUnavailable); }
 };
 return <div className="animation-player" ref={root}>
  {failed || !media.video ? <><img src={media.poster} alt={media.alt} width="1200" height="900" loading="lazy" /><p role="status">{ui.unavailable}</p></> : <video ref={video} src={near ? media.video : undefined} poster={media.poster} muted={muted} playsInline preload="none" aria-label={media.alt}
   onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => setFailed(true)}
   onLoadedMetadata={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
   onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)} />}
  {media.video && !failed && <div className="video-controls">
   <button className="filter-button" type="button" onClick={play}>{playing ? ui.pause : ui.play}</button>
   <label className="sr-only" htmlFor={id}>{ui.scrub}</label><input id={id} type="range" min="0" max={duration || 1} step=".1" disabled={!duration} value={time} aria-valuetext={time.toFixed(1) + ' / ' + duration.toFixed(1)} onChange={(event) => { const value = Number(event.target.value); video.current.currentTime = value; setTime(value); }} />
   <output className="meta" aria-label={ui.time}>{Math.floor(time)} / {Math.floor(duration)}</output>
   <button className="filter-button" type="button" onClick={() => setMuted(!muted)} aria-pressed={muted}>{muted ? ui.unmute : ui.mute}</button>
   <button className="filter-button" type="button" onClick={expand}>{fullscreen ? ui.exitFullscreen : ui.fullscreen}</button>
  </div>}
  <p className="placeholder">{media.marker}</p>{notice && <p role="status">{notice}</p>}
 </div>;
}
