
export const siteConfig = {
  name: 'Prashann Mishra', nameMarker: '',
  title: 'Prashann Mishra — Full-Stack Developer',
  description: 'Prashann Mishra, Full-Stack Developer in India. Work across the Stack, AI/ML, design and security. Open to full-time roles, freelance work and collaborations.',
  url: 'https://prashann13.github.io/', domainMarker: '', ogImage: '/sharing.png', ogAlt: 'Prashann Mishra — Full-Stack Developer, with a monochrome portrait', sharingRole: 'Full-Stack Developer', faviconPng: '/favicon-32.png', appleIcon: '/apple-touch-icon.png', robots: 'User-agent: *\nAllow: /\n', favicon: '/favicon.svg',
  introStorageKey: 'portfolio-intro', sections: { about: '#about', top: '#top', main: '#main' }, themeStorageKey: 'portfolio-theme', resume: '/PRASHANN%20MISHRA%20-%20Resume.pdf',
  resumeMarker: '',
  playerArea: { id: 'player-profile', eyebrow: '02 // ARCADE MODULE',
    title: 'Arcade', profileHeading: 'Player Profile', arcadeHeading: 'Arcade' },
  footer: 'Prashann Mishra',
  routes: { home: '/', projects: '/projects', skills: '/skills', contact: '/contact', blender: '/blender', blenderDetail: '/blender/:slug', caseStudy: '/projects/:id', notFound: '*' },
};
export const navigation = [
  { to: '/', label: 'HOME', code: '01', end: true },
  { to: '/projects', label: 'PROJECTS', code: '02' },
  { to: '/blender', label: 'BLENDER', code: '03' },
  { to: '/skills', label: 'SKILLS', code: '04' },
  { to: '/contact', label: 'CONTACT', code: '05' },
];
