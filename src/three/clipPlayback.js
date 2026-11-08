import { AnimationMixer } from 'three';

// One mixer advances every selected authored clip on the same clock.
export function createClipPlayback(root, clips, names = [], autoplay = false) {
  const mixer = new AnimationMixer(root);
  const actions = names.map((name) => clips.find((clip) => clip.name === name)).filter(Boolean)
    .map((clip) => mixer.clipAction(clip).reset().play());
  let playing = Boolean(autoplay && actions.length), disposed = false;
  for (const action of actions) action.paused = !playing;
  mixer.update(0);
  return {
    mixer, actions,
    get playing() { return playing; },
    setPlaying(value) { playing = !disposed && Boolean(value && actions.length); for (const action of actions) action.paused = !playing; },
    advance(delta, active) { if (!disposed && active && playing) mixer.update(delta); },
    dispose() { disposed = true; playing = false; mixer.stopAllAction(); mixer.uncacheRoot(root); },
  };
}
