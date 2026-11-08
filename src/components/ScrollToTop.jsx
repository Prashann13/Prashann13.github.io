import { useEffect } from 'react';
import { useLocation } from 'react-router';
export default function ScrollToTop() {
 const { pathname, hash } = useLocation();
 useEffect(() => {
  if (!hash) { window.portfolioLenis?.scrollTo(0, { immediate: true }); window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }
  const timer = setTimeout(() => {
   if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
   else document.getElementById('main')?.focus({ preventScroll: true });
  }, 120);
  return () => clearTimeout(timer);
 }, [pathname, hash]);
 return null;
}