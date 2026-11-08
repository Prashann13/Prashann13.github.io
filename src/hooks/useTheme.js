import { useSyncExternalStore } from 'react';
import { siteConfig } from '../data/siteConfig';

const listeners = new Set();
const notify = () => listeners.forEach((listener) => listener());
const getSnapshot = () => document.documentElement.dataset.theme || 'dark';
function subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }

const system = window.matchMedia('(prefers-color-scheme: dark)');
function apply(theme) { document.documentElement.dataset.theme = theme; notify(); }
system.addEventListener('change', (event) => {
  try { if (localStorage.getItem(siteConfig.themeStorageKey)) return; } catch { /* Private browsing. */ }
  apply(event.matches ? 'dark' : 'light');
});
window.addEventListener('storage', (event) => {
  if (event.key === siteConfig.themeStorageKey) apply(['dark', 'light'].includes(event.newValue) ? event.newValue : (system.matches ? 'dark' : 'light'));
});
export default function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => 'dark');
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem(siteConfig.themeStorageKey, next); } catch { /* Theme still works without storage. */ }
    apply(next);
  };
  return { theme, toggle };
}
