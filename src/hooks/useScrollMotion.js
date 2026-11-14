import { useEffect } from 'react';
import { loadMotionEngine } from './motionEngine';

export default function useScrollMotion(ref, key = '') {
  useEffect(() => {
    let cancelled = false;
    let context;
    let media;
    loadMotionEngine().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !ref.current) return;
      context = gsap.context(() => {
        gsap.utils.toArray('[data-reveal]').forEach((element) => {
          gsap.from(element, { y: 24, opacity: 0, duration: .7, ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
        });
        gsap.utils.toArray('[data-heading]').forEach((heading) => {
          gsap.from(heading, { clipPath: 'inset(0 100% 0 0)', duration: .65, ease: 'power2.out',
            scrollTrigger: { trigger: heading, start: 'top 94%', once: true } });
        });
        gsap.utils.toArray('[data-stagger]').forEach((element) => {
          gsap.from(element.children, { y: 15, opacity: 0, stagger: .07, duration: .5,
            scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
        });
        media = gsap.matchMedia();
        media.add('(min-width: 1100px) and (pointer: fine)', () => {
          gsap.utils.toArray('[data-parallax]').forEach((element) => {
            gsap.to(element, { y: -35, ease: 'none',
              scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 1 } });
          });
        });
        ScrollTrigger.refresh();
      }, ref);
    });
    return () => { cancelled = true; media?.revert(); context?.revert(); };
  }, [ref, key]);
}