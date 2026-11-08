let engine;
export function loadMotionEngine() {
 engine ||= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([core, plugin]) => {
  const gsap = core.gsap; const ScrollTrigger = plugin.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger); gsap.ticker.lagSmoothing(0);
  return { gsap, ScrollTrigger };
 });
 return engine;
}