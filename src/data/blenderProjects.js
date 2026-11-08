// Three confirmed projects and one conspicuously marked sample.
// TODO: replace the fourth project sample artwork with finished owner media.
export const blenderProjects = [
  {
    "id": "study-1",
    "slug": "starfighter",
    "title": "Starfighter",
    "primaryCategory": "Models",
    "category": "Models",
    "date": "2025",
    "tools": [
      "Blender"
    ],
    "addons": [],
    "thumbnail": "/blender/starfighter-preview.webp",
    "thumbnailSizes": "(min-width: 900px) 40vw, 90vw",
    "alt": "Starfighter 3D model preview",
    "model": "/starfighter.glb",
    "modelExcludedNodes": [
      "X-Wing"
    ],
    "renders": [],
    "animation": null,
    "description": "Fan-inspired X-wing tribute and hard-surface modelling project.",
    "details": {
      "concept": "Fan-inspired X-wing tribute with R2-D2 behind the cockpit. The goal is an organized asset for future animation and possible 3D printing.",
      "process": "Twenty meshes under one X-Wing root separate the fuselage, wings, engines, plating, surface details and droid. The droid body, head and plating remain separate.",
      "challenges": "Correct wing proportions were the main challenge, refined using many reference images.",
      "stats": {
        "meshes": "20",
        "triangles": "59,601",
        "vertices": "78,715 exported"
      }
    },
    "viewer": {
      "autoRotate": true,
      "hotspots": [],
      "animationClips": [],
      "animationAutoplay": false
    },
    "featured": true,
    "modelPlaceholder": false,
    "thumbnailPlaceholder": false,
    "thumbnailSrcSet": "/blender/starfighter-preview-small.webp 600w, /blender/starfighter-preview.webp 1200w",
    "heroSizes": "(min-width: 1200px) 1100px, 90vw"
  },
  {
    "tools": [
      "Blender"
    ],
    "addons": [],
    "renders": [],
    "animation": null,
    "modelPlaceholder": false,
    "thumbnailPlaceholder": false,
    "thumbnailSizes": "(min-width: 900px) 40vw, 90vw",
    "heroSizes": "(min-width: 1200px) 1100px, 90vw",
    "viewer": {
      "autoRotate": true,
      "hotspots": [],
      "animationClips": [],
      "animationAutoplay": false
    },
    "id": "study-2",
    "slug": "tie-fighter",
    "title": "TIE Fighter",
    "primaryCategory": "Models",
    "category": "Models",
    "date": "2026",
    "thumbnail": "/blender/tie-fighter-preview.webp",
    "thumbnailSrcSet": "/blender/tie-fighter-preview-small.webp 600w, /blender/tie-fighter-preview.webp 1200w",
    "alt": "TIE Fighter 3D model preview",
    "model": "/blender/tie-fighter.glb",
    "featured": true,
    "description": "Fan-made TIE fighter tribute, chosen as the X-wing’s cold, minimal and symmetrical counterpart.",
    "details": {
      "concept": "Fan-made TIE fighter tribute, chosen as the X-wing’s counterpart: cold, minimal and symmetrical.",
      "process": "Dark military palette, glowing red details and one combined mesh with seven material groups.",
      "challenges": "The combined mesh simplifies real-time loading and rendering but makes individual parts harder to animate or edit.",
      "stats": {
        "meshes": "1",
        "materialGroups": "7",
        "triangles": "12,020",
        "vertices": "17,654 exported"
      }
    }
  },
  {
    "tools": [
      "Blender"
    ],
    "addons": [],
    "renders": [],
    "animation": null,
    "modelPlaceholder": false,
    "thumbnailPlaceholder": false,
    "thumbnailSizes": "(min-width: 900px) 40vw, 90vw",
    "heroSizes": "(min-width: 1200px) 1100px, 90vw",
    "viewer": {
      "autoRotate": true,
      "hotspots": [],
      "animationClips": [
        "Cylinder.002Action",
        "SphereAction"
      ],
      "fitNodes": ["Cylinder.002", "Sphere"],
      "animationAutoplay": false
    },
    "id": "study-3",
    "slug": "light-saber",
    "title": "Light saber",
    "primaryCategory": "Animations",
    "category": "Animations",
    "date": "2026",
    "thumbnail": "/blender/light-saber-preview.webp",
    "alt": "Light saber 3D model preview",
    "model": "/blender/light-saber.glb",
    "featured": false,
    "description": "Stylised lightsaber project focused on a glowing blade, glossy reflective floor and the impact of lighting and reflection.",
    "details": {
      "concept": "A glowing blade and glossy reflective floor explore how lighting and reflection give a simple shape impact.",
      "process": "Spinning showcase motion and a timed blade effect. Geometry was deliberately kept lightweight for web loading and playback.",
      "stats": {
        "meshes": "3",
        "materialGroups": "5",
        "triangles": "2,870",
        "vertices": "3,154 exported"
      }
    }
  },
  {
    "id": "study-4",
    "slug": "project-title-here-4",
    "title": "Suspiciously moon-like space station",
    "primaryCategory": "Renders",
    "category": "Renders",
    "tools": [], "addons": [],
    "thumbnail": "/placeholders/blender-4.svg",
    "thumbnailSizes": "(min-width: 900px) 40vw, 90vw",
    "alt": "Sample geometric artwork for the space station work in progress",
    "previewLabel": "Work in progress · Sample preview.",
    "model": null,
    "renders": [{
      "src": "/placeholders/blender-4.svg",
      "alt": "Sample geometric render; finished space station artwork is pending",
      "width": 1200, "height": 900,
      "sizes": "(min-width: 1000px) 1100px, 90vw"
    }],
    "animation": null,
    "description": "Construction underway.",
    "details": {},
    "viewer": { "autoRotate": true, "hotspots": [] },
    "featured": false,
    "process": {
      "wireframe": "/placeholders/wireframe.svg",
      "clay": "/placeholders/clay.svg",
      "final": "/placeholders/blender-4.svg",
      "alt": "Sample wireframe, clay and final artwork comparison",
      "previewLabel": "Sample comparison · Wireframe / Clay / Final"
    },
    "thumbnailPlaceholder": true,
    "modelPlaceholder": false
  }
];
