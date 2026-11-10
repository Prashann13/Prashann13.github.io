import { certifications } from './skills.js';
export const averageLevel = (stats) => stats.length ? Math.round(stats.reduce((sum, stat) => sum + stat.value, 0) / stats.length) : 0;
const stats = [{ id: 'frontend', label: 'Frontend', value: 80 }, { id: 'backend', label: 'Backend', value: 75 },
  { id: 'data', label: 'AI/ML', value: 70 }, { id: 'security', label: 'Security', value: 65 }, { id: 'three', label: '3D', value: 60 }];
export const hudProfile = {
  handle: 'Prashann', role: 'Full-Stack Developer',
  level: averageLevel(stats), levelLabel: 'Level', status: 'Open to full-time, freelance & collaborations',
  location: 'India', avatar: '/portrait-small.webp',
  avatarAlt: 'Portrait of Prashann Mishra.',
  tabs: [{ id: 'stats', label: 'STATS' }, { id: 'loadout', label: 'LOADOUT' },
    { id: 'missions', label: 'MISSIONS' }, { id: 'perks', label: 'PERKS' }],
  stats,
  loadout: [
    { slot: 'Frontend', items: ['React.js', 'JavaScript', 'Tailwind CSS', 'Vite'] },
    { slot: 'Backend & AI/ML', items: ['Django', 'Flask', 'Python', 'Scikit-learn'] },
    { slot: 'Design & Security', items: ['Blender', 'Illustrator', 'Photoshop', 'Fortinet'] },
  ],
  missions: [{ projectId: 1, label: 'Mission 01' }, { projectId: 2, label: 'Mission 02' }, { projectId: 3, label: 'Mission 03' }],
  perks: certifications.map((item) => ({ ...item, detail: item.issuer })),
  ui: { tabList: 'Profile panels', projects: 'View all projects', equipment: 'Equipment slots',
    missions: 'Featured project missions', perks: 'Certifications' },
};
