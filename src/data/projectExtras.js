// TODO: replace pending live URLs and AQI artwork when the real screenshot is ready.
export const projectExtras = [
  { id: 1, alt: 'Reelist entertainment dashboard screenshot', imageMissing: false },
  {
    id: 2, alt: 'Academix learning management system screenshot', imageMissing: false,
    caseStudy: {
      approach: 'I built Academix around separate dashboards and role-based permissions for administrators, lecturers and students. CSV imports bring student and lecturer records into the system, with a preview, dry-run mode and per-row reporting for student imports so records can be checked before they are saved.',
      outcome: 'The working LMS brings the role-specific dashboards and import workflow together with session and course management, lecturer allocations and automatic grading. Student CSV imports support 500+ records, and the project is backed by 46 automated tests.',
    },
  },
  {
    id: 3, alt: 'Traffic cone with the message: Going through Changes, BRB', imageMissing: true,
    previewLabel: '',
    caseStudy: {
      approach: 'I exposed the Scikit-learn model through Flask, connecting the prediction model to a web interface that accepts pollutant readings and returns the predicted Air Quality Index.',
      outcome: 'The working app lets a user enter pollutant readings and receive an AQI prediction in the browser.',
    },
  },
].map((extra) => ({ fallbackImage: `/placeholders/project-${extra.id}.svg`, livePlaceholder: true, caseStudyPath: `/projects/${extra.id}`, year: '2026', ...extra }));
