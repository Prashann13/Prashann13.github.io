import useTheme from '../hooks/useTheme';
import { ui } from '../data/content';
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return <button type="button" className="theme-toggle" onClick={toggle} aria-label={(theme === 'dark' ? ui.dark : ui.light) + ' / ' + ui.toggleTheme} aria-pressed={theme === 'light'}>
    <span className="theme-icon" aria-hidden="true" />
  </button>;
}
