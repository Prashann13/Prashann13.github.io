import { useEffect, useRef, useState } from 'react';
import { mountArcade } from '../game/controller';
import { gameConfig as config } from '../data/gameConfig';

export default function ArcadeGame({ onEnlarge, enlarged, onController }) {
  const root = useRef(null), canvas = useRef(null), controller = useRef(null);
  const [snapshot, setSnapshot] = useState({ mode: 'ready', score: 0, best: 0, health: 3, bossHealth: null, area: config.level.areas[0].name, hint: config.level.areas[0].hint, elapsed: 0, checkpoint: null });
  const [unavailable, setUnavailable] = useState(false); const ui = config.ui;
  useEffect(() => {
    const engine = mountArcade(canvas.current, root.current, config, setSnapshot);
    controller.current = engine;
    onController(engine);
    if (!engine) setUnavailable(true);
    return () => { engine?.destroy(); controller.current = null; onController(null); };
  }, [onController]);
  const { mode, score, best, health, bossHealth, area, hint, checkpoint, bossPhase, bossCue, elapsed } = snapshot;
  const action = mode === 'paused' ? ui.resume : mode === 'over' && checkpoint ? ui.retry : ['over', 'won'].includes(mode) ? ui.restart : ui.start;
  const time = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`;
  const message = mode === 'won' ? config.victory : mode === 'over' ? ui.gameOver : mode === 'paused' ? ui.paused : ui.pressStart;
  const hold = (action, pressed) => {
    if (action === 'left' || action === 'right') controller.current?.move(action === 'left' ? -1 : 1, pressed);
    else if (action === 'jump') controller.current?.jump(pressed);
    else controller.current?.duck(pressed);
  };
  const click = (action) => {
    if (action === 'left' || action === 'right') controller.current?.moveBriefly(action === 'left' ? -1 : 1);
    else if (action === 'jump') controller.current?.hop();
    else controller.current?.duckBriefly();
  };
  return <div className="arcade-game" ref={root} tabIndex={0} role="group" aria-label={ui.title} aria-describedby="arcade-instructions" data-mode={mode}>
    <div className="arcade-toolbar"><span className="arcade-area meta">{area}</span>
      <div className="arcade-utilities"><button type="button" className="filter-button" disabled={mode !== 'playing'} onClick={() => controller.current?.pause()}>{ui.pause}</button>
        <button type="button" className="filter-button" hidden={enlarged} onClick={onEnlarge}>{ui.enlarge}</button></div>
    </div>
    <div className="arcade-score"><span>{ui.health} <strong>{health}/3</strong></span><span>{ui.score} <strong>{score}</strong></span><span>{ui.best} <strong>{best}</strong></span><span>{ui.time} <strong>{time}</strong></span></div>
    {bossHealth !== null && <div className="arcade-boss"><p className="meta">{ui.bossHealth}: {bossHealth}/{config.boss.health} · {ui.phase} {bossPhase}</p>
      <meter min="0" max={config.boss.health} value={bossHealth} aria-label={ui.bossHealth} /><p>{bossCue}</p></div>}
    <div className="arcade-stage"><canvas ref={canvas} width={config.width} height={config.height} aria-label={config.title + ' — ' + config.runner} />
      {mode !== 'playing' && <div className="arcade-overlay"><p className="meta">{config.title} / {config.runner}</p><h4>{message}</h4>
        {mode === 'won' && <p>{ui.score}: {score} · {ui.time}: {time}</p>}
        {mode === 'ready' && <p className="arcade-objective">{config.level.areas[2].hint}</p>}
        {unavailable ? <p>{ui.unavailable}</p> : <button type="button" className="hud-button" onClick={() => controller.current?.start()}>{action}</button>}
      </div>}
    </div>
    <div className="arcade-controls">
      {['left', 'right', 'duck', 'jump'].map((action) => <button key={action} type="button" className={`filter-button arcade-${action}`}
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); hold(action, true); }}
        onPointerUp={() => hold(action, false)} onPointerCancel={() => hold(action, false)} onLostPointerCapture={() => hold(action, false)} onBlur={() => hold(action, false)}
        onClick={(event) => { if (event.detail === 0) click(action); }}
        onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (!event.repeat) hold(action, true); } }}
        onKeyUp={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); hold(action, false); } }}>{ui[action]}</button>)}
      <button type="button" className="filter-button arcade-whip" onClick={() => controller.current?.whip()}>{ui.whip}</button>
    </div>
    <div className="arcade-checkpoint"><p>{checkpoint ? `${ui.checkpoint}: ${checkpoint}` : ui.noCheckpoint}</p>
      {mode !== 'ready' && <button type="button" className="filter-button arcade-restart" onClick={() => controller.current?.restart()}>{ui.restart}</button>}</div>
    <p className="arcade-guide">{hint}</p>
    <div id="arcade-instructions" className="arcade-hints"><p className="desktop-hint">{enlarged ? ui.keyboardEnlarged : ui.keyboard}</p><p className="touch-hint">{ui.touch}</p></div>
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{mode === 'ready' ? ui.readyAnnouncement : (mode === 'won' ? config.victory : mode === 'over' ? ui.gameOver : mode === 'paused' ? ui.paused : ui.status) + '. ' + ui.health + ': ' + health + '. ' + ui.score + ': ' + score}</p>
  </div>;
}
