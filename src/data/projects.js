import { projectExtras } from './projectExtras.js';
// Original fields unchanged. TODO: replace with real content — missing media and live links.
export const projects = [
  {
    id: 1,
    title: "Reelist: Entertainment Dashboard",
    summary:
      "React movie dashboard powered by the TMDB API, with trending, popular and top-rated feeds. Genre, year and sort filters live in the URL, so links are shareable and the back button works. Includes debounced search, pagination, a detail modal with cast, trailer and similar titles, and a watchlist that persists and syncs across tabs. Built with an accessible, keyboard-friendly UI.",
    image: "/projects/project-one.webp",
    tags: ["React", "Vite", "Tailwind CSS", "Rest API"],
    live: "https://example.com",
    repo: "https://github.com/Prashann13/Dashboard",
  },
  {
    id: 2,
    title: "Academix: Role-Based Learning Management System",
    summary:
      "Django LMS with separate dashboards and permissions for administrators, lecturers and students. Covers sessions, courses, lecturer allocations and automatic grading, plus bulk CSV import of 500+ students with a preview, per-row report and dry-run mode. Backed by 46 automated tests.",
    image: "/projects/project-two.webp",
    tags: ["Django", "SQLite", "Bootstrap 5", "JavaScript"],
    live: "https://example.com",
    repo: "https://github.com/Prashann13/Academix-LMS",
  },
  {
    id: 3,
    title: "AQI Prediction System",
    summary:
      "Machine learning app that predicts Air Quality Index from pollutant data. A Scikit-learn model is served through a Flask web interface, so anyone can enter values and get a prediction.",
    image: "/projects/project-three.webp",
    tags: ["Flask", "Scikit-learn", "Python"],
    live: "https://example.com",
    repo: "https://github.com/Prashann13/aqi-prediction-system",
  },
].map((project) => ({ ...project, ...projectExtras.find((extra) => extra.id === project.id) }));