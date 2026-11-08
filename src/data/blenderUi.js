// Functional labels; editable project content is in blenderProjects.js.
export const blenderUi = {
 back: 'Back to Blender', model: 'MODEL', render: 'RENDER', sampleRender: 'SAMPLE RENDER', animation: 'ANIMATION', description: 'DESCRIPTION',
 concept: 'Concept', process: 'Process', challenges: 'Challenges', stats: 'Project details',
 polycount: 'Polycount', renderEngine: 'Render engine', renderTime: 'Render time',
 meshes: 'Meshes', triangles: 'Triangles', vertices: 'Vertices', materialGroups: 'Material groups',
 missing: '404 // PROJECT NOT FOUND', missingTitle: 'Project not found', missingBody: 'This project address is unavailable. Return to the gallery.',
 previous: 'Previous project', next: 'Next project', zoom: 'Zoom render', close: 'Close render',
 video: { play: 'Play', pause: 'Pause', mute: 'Mute', unmute: 'Unmute', scrub: 'Playback position',
 fullscreen: 'Fullscreen', exitFullscreen: 'Exit fullscreen', time: 'Playback time',
 loading: 'Loading animation', unavailable: 'Animation unavailable. Showing its poster.', fullscreenUnavailable: 'Fullscreen is unavailable in this browser.' },

 // Viewer controls share one playback state for all selected embedded clips.
 viewer: {
  canvas: 'Interactive 3D model', controls: 'Model controls', loading: 'Loading model',
  playAnimation: 'Play animation', pauseAnimation: 'Pause animation', animationOn: 'Combined animations playing', animationOff: 'Combined animations paused',
  hintStorageKey: 'portfolio-model-drag-hint',
  touchStart: 'Tap Interact to view the model',
  firstHint: 'Drag to rotate', scrollHint: 'Click to interact, Ctrl+scroll to zoom',
  touchHint: 'Scroll to explore. Tap Interact or use two fingers to control the model.',
  touchActiveHint: 'Drag to rotate. Pinch to zoom; two-finger drag to pan. Tap Done to scroll.',
  rotatedLeft: 'Rotated left', rotatedRight: 'Rotated right', tiltedUp: 'View tilted up', tiltedDown: 'View tilted down',
  reset: 'Reset view', resetTooltip: 'Reset camera position and pan (R)', resetAnnouncement: 'View reset',
  turntable: 'Auto-rotate', turntableTooltip: 'Toggle idle turntable (Space)',
  pauseTurntable: 'Pause turntable', playTurntable: 'Play turntable',
  turntableOn: 'Turntable enabled. Rotation resumes after three seconds of inactivity.',
  turntableOff: 'Turntable paused', zoomIn: 'Zoom in', zoomOut: 'Zoom out',
  fullscreen: 'Fullscreen', exitFullscreen: 'Exit fullscreen', fullscreenOn: 'Fullscreen entered',
  fullscreenOff: 'Fullscreen exited', fullscreenUnavailable: 'Fullscreen is unavailable in this browser.',
  interact: 'Interact', done: 'Done', interactTooltip: 'Enable touch rotation, zoom and pan',
  doneTooltip: 'Restore page scrolling', touchOn: 'Model touch interaction enabled', touchOff: 'Page scrolling restored',
  shading: 'Shading mode', shadingAnnouncement: 'Shading mode: ',
  modes: [
   { value: 'material', label: 'Material', tooltip: 'Show original model materials' },
   { value: 'wireframe', label: 'Wireframe', tooltip: 'Show model edges' },
   { value: 'clay', label: 'Clay', tooltip: 'Show a neutral clay surface' },
  ],
 },

};
