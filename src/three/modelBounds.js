import { AnimationMixer, Box3, PropertyBinding } from 'three';

// Fit selected foreground nodes across authored motion without removing the backdrop.
export function modelBounds(root, names = [], clips = [], selectedNames = []) {
  const nodes = names.map((name) => root.getObjectByName(name) || root.getObjectByName(PropertyBinding.sanitizeNodeName(name))).filter(Boolean);
  if (!nodes.length) return new Box3().setFromObject(root);
  const box = new Box3(), scratch = new Box3();
  const measure = () => { root.updateMatrixWorld(true); for (const node of nodes) box.union(scratch.setFromObject(node)); };
  measure();
  const selected = clips.filter((clip) => selectedNames.includes(clip.name));
  if (selected.length) {
    const mixer = new AnimationMixer(root);
    for (const clip of selected) mixer.clipAction(clip).play();
    const duration = Math.max(...selected.map((clip) => clip.duration));
    for (let sample = 0; sample <= 32; sample++) { mixer.setTime(duration * sample / 32); measure(); }
    mixer.stopAllAction(); mixer.uncacheRoot(root); root.updateMatrixWorld(true);
  }
  return box;
}
