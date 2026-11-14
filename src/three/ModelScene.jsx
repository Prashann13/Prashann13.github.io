import { Suspense, useCallback, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei/core/OrbitControls';
import { useGLTF } from '@react-three/drei/core/Gltf';
import { Html } from '@react-three/drei/web/Html';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import { MeshStandardMaterial, Sphere, Vector3 } from 'three';
import { fitDistance, viewerLimits, clampPan, zoomPosition } from './viewerMath';
import { createClipPlayback } from './clipPlayback';
import { modelBounds } from './modelBounds';

function Asset({ src, excludedNodes, mode, colors, onFit, hotspots, visible, animationClips, animationAutoplay, animationPlaying, fitNodes, modelRotation = [0, 0, 0] }) {
 const { scene, animations } = useGLTF(src, false, false);
 const playbackRef = useRef(null);
 const { invalidate } = useThree();
 const asset = useMemo(() => {
  const clone = scene.clone(true);
  for (const name of excludedNodes || []) clone.getObjectByName(name)?.removeFromParent();
  clone.updateMatrixWorld(true);
  const box = modelBounds(clone, fitNodes, animations, animationClips);
  const extent = Math.max(...box.getSize(new Vector3()).toArray());
  const scale = Number.isFinite(extent) && extent > 0 ? 3 / extent : 1;
  const center = box.getCenter(new Vector3());
  const radius = Math.max(.1, box.getBoundingSphere(new Sphere()).radius * scale);
  const variants = new Map();
  clone.traverse((node) => {
   if (!node.isMesh) return;
   const original = Array.isArray(node.material) ? node.material : [node.material];
   for (const material of original) {
    if (variants.has(material)) continue;
    const wire = material.clone(); wire.wireframe = true; wire.color?.set(colors.wire);
    const clay = new MeshStandardMaterial({ color: colors.clay, roughness: .78, metalness: .08,
     side: material.side });
    variants.set(material, { material, wireframe: wire, clay });
   }
   node.userData.viewerMaterials = original;
  });
  return { clone, scale, center, radius, variants };
 }, [scene, excludedNodes, colors.wire, colors.clay, fitNodes, animations, animationClips]);
 useEffect(() => {
  const playback = createClipPlayback(asset.clone, animations, animationClips, animationAutoplay);
  playbackRef.current = playback;
  return () => { playback.dispose(); if (playbackRef.current === playback) playbackRef.current = null; };
 }, [asset.clone, animations, animationClips, animationAutoplay]);
 useEffect(() => {
  playbackRef.current?.setPlaying(animationPlaying);
  if (visible) invalidate();
 }, [animationPlaying, asset.clone, visible, invalidate]);
 useFrame((_, delta) => {
  const playback = playbackRef.current;
  if (!visible || !playback?.playing) return;
  playback.advance(Math.min(delta, .1), visible); invalidate();
 });
 useEffect(() => {
  asset.clone.traverse((node) => {
   if (!node.isMesh) return;
   const materials = node.userData.viewerMaterials.map((original) => asset.variants.get(original)[mode]);
   node.material = Array.isArray(node.material) ? materials : materials[0];
  });
  onFit(asset.radius);
 }, [asset, mode, onFit]);
 useEffect(() => () => {
  for (const variants of asset.variants.values()) { variants.wireframe.dispose(); variants.clay.dispose(); }
 }, [asset]);
 return <group rotation={modelRotation}><group scale={asset.scale}><group position={asset.center.clone().negate().toArray()}>
  <primitive object={asset.clone} dispose={null} />
  {hotspots?.map((spot, index) => <Html key={index} position={spot.position} center distanceFactor={8} zIndexRange={[20, 0]}>
   <LazyMotion features={domAnimation} strict><details className="model-hotspot">
    <m.summary aria-label={spot.label} title={spot.label} animate={!visible ? { scale: 1 } : { scale: [1, .94, 1] }}
     transition={!visible ? { duration: 0 } : { duration: 3, repeat: Infinity }}><span aria-hidden="true">+</span><span className="sr-only">{spot.label}</span></m.summary>
    <div role="note"><strong>{spot.label}</strong><p>{spot.description}</p></div>
   </details></LazyMotion>
  </Html>)}
 </group></group></group>;
}

export default function ModelScene({ src, excludedNodes, mode, colors, settings, visible,
 apiRef, onReady, onActivity, onDragging }) {
 const { camera, gl, size, invalidate, setFrameloop, get } = useThree();
 const controlsRef = useRef(null);
 const rig = useRef({ ready: false, radius: 1, limits: null, lastAspect: 0,
  transition: null, idleAt: 0, holding: false, timer: null, defaultDirection: new Vector3(4, 3, 5).normalize(),
  defaultPosition: new Vector3(), defaultTarget: new Vector3(), scratch: new Vector3(), zoom: new Vector3() });

 useEffect(() => {
  setFrameloop(visible ? 'demand' : 'never');
  if (visible) invalidate();
  else { rig.current.holding = false; const controls = controlsRef.current; if (controls) { controls.enabled = false; controls.autoRotate = false; } }
  return () => { setFrameloop('demand'); };
 }, [visible, invalidate, setFrameloop]);

 useEffect(() => {
  const controls = controlsRef.current, state = rig.current;
  const scheduleIdle = () => {
   clearTimeout(state.timer);
   state.idleAt = performance.now() + 3000;
   state.timer = setTimeout(() => { if (visible && !state.holding) invalidate(); }, 3020);
  };
  const activity = (holding = false) => {
   state.holding = holding; controls.autoRotate = false;
   if (state.transition) { state.transition = null; controls.enabled = visible; }
   onActivity(); scheduleIdle(); invalidate();
  };
  const transition = (position, target) => {
   // Clear OrbitControls' remaining inertia before taking camera ownership.
   controls.autoRotate = false; controls.enableDamping = false; controls.update();
   controls.enableDamping = true; controls.enabled = false;
   state.transition = { position: position.clone(), target: target.clone() };
   invalidate();
  };
  const api = {
   activity, end: () => { state.holding = false; scheduleIdle(); onDragging(false); },
   reset: () => { if (!state.ready) return; activity(); transition(state.defaultPosition, state.defaultTarget); },
   zoom: (factor) => {
    if (!state.ready) return;
    activity();
    transition(zoomPosition(camera.position, controls.target, factor, state.limits, state.zoom), controls.target);
   },
   rotate: (azimuth, polar) => {
    if (!state.ready) return;
    activity();
    controls.setAzimuthalAngle(controls.getAzimuthalAngle() + azimuth);
    controls.setPolarAngle(Math.max(state.limits.minPolarAngle, Math.min(state.limits.maxPolarAngle, controls.getPolarAngle() + polar)));
    invalidate();
   },
   gate: (zoom, touch) => {
    controls.enableZoom = zoom;
    controls.enableRotate = touch !== false; controls.enablePan = touch !== false;
   },
   reframe: () => {
    if (!state.ready) return;
    activity();
    const distance = fitDistance(state.radius, camera.fov, camera.aspect);
    state.defaultPosition.copy(state.defaultDirection).multiplyScalar(distance);
    state.limits = viewerLimits(state.radius, distance);
    controls.minDistance = state.limits.minDistance; controls.maxDistance = state.limits.maxDistance;
    const position = camera.position.clone().sub(controls.target).normalize().multiplyScalar(distance).add(controls.target);
    transition(position, controls.target);
   },
  };
  if (visible && state.idleAt > performance.now()) state.timer = setTimeout(invalidate, state.idleAt - performance.now() + 20);
  apiRef.current = api;
  return () => { clearTimeout(state.timer); if (apiRef.current === api) apiRef.current = null; };
 }, [camera, visible, invalidate, apiRef, onActivity, onDragging]);

 // Fit once after geometry loads; changing shading never replaces camera state.
 const fit = useCallback((radius) => {
  const camera = get().camera;
  const state = rig.current, controls = controlsRef.current;
  if (state.ready || !controls) { invalidate(); return; }
  state.radius = radius;
  const distance = fitDistance(radius, camera.fov, camera.aspect);
  state.limits = viewerLimits(radius, distance);
  state.defaultPosition.copy(state.defaultDirection).multiplyScalar(distance);
  if (settings.initialCameraPosition?.length === 3) {
   const initial = new Vector3(...settings.initialCameraPosition);
   if (initial.lengthSq() > 0 && initial.toArray().every(Number.isFinite)) {
    initial.clampLength(state.limits.minDistance, state.limits.maxDistance);
    // Keep an authored camera above the floor as well.
    initial.y = Math.max(initial.y, initial.length() * .04);
    state.defaultPosition.copy(initial); state.defaultDirection.copy(initial).normalize();
   }
  }
  camera.near = radius / 100; camera.far = state.limits.maxDistance + radius * 8;
  camera.position.copy(state.defaultPosition); controls.target.set(0, 0, 0);
  controls.minDistance = state.limits.minDistance; controls.maxDistance = state.limits.maxDistance;
  controls.minPolarAngle = state.limits.minPolarAngle; controls.maxPolarAngle = state.limits.maxPolarAngle;
  controls.update(); controls.saveState(); camera.updateProjectionMatrix();
  state.defaultPosition.copy(camera.position); state.lastAspect = camera.aspect;
  state.ready = true; onReady(); invalidate();
 }, [get, invalidate, onReady, settings.initialCameraPosition]);

 useEffect(() => {
  const state = rig.current;
  if (state.ready && state.lastAspect !== size.width / size.height) {
   state.lastAspect = size.width / size.height; apiRef.current?.reframe();
  }
 }, [size.width, size.height, apiRef]);

 useFrame((_, delta) => {
  const state = rig.current, controls = controlsRef.current;
  if (!controls || !visible) return;
  controls.autoRotate = state.ready && settings.autoRotate && !state.holding && !state.transition && performance.now() >= state.idleAt;
  if (state.transition) {
   controls.enabled = false;
   const amount = 1 - Math.exp(-9 * Math.min(delta, .05));
   camera.position.lerp(state.transition.position, amount);
   controls.target.lerp(state.transition.target, amount); camera.lookAt(controls.target);
   if (camera.position.distanceToSquared(state.transition.position) + controls.target.distanceToSquared(state.transition.target) < .000001) {
    camera.position.copy(state.transition.position); controls.target.copy(state.transition.target);
    state.transition = null; controls.enabled = true; controls.update();
   }
   invalidate();
  } else controls.enabled = true;
 }, -2);
 useFrame(() => {
  const state = rig.current, controls = controlsRef.current;
  if (!visible || !state.ready || !controls) return;
  if (clampPan(controls.target, camera.position, state.limits.panRadius, state.scratch)) { controls.update(); invalidate(); }
  if (controls.autoRotate) invalidate();
 });
 return <>
  <hemisphereLight args={[colors.sky, colors.base, colors.intensity]} />
  <directionalLight position={[4, 6, 3]} intensity={3} />
  <directionalLight position={[-3, 2, -2]} color={colors.rim} intensity={1} />
  <Suspense fallback={null}><Asset src={src} excludedNodes={excludedNodes} mode={mode} colors={colors}
   onFit={fit} hotspots={settings.hotspots} visible={visible}
   animationClips={settings.animationClips} animationAutoplay={settings.animationAutoplay} animationPlaying={settings.animationPlaying} fitNodes={settings.fitNodes} modelRotation={settings.modelRotation} /></Suspense>
  <OrbitControls ref={controlsRef} makeDefault domElement={gl.domElement} enableDamping dampingFactor={.08}
   enabled={visible} enableZoom={false} autoRotateSpeed={.8} rotateSpeed={.7} zoomSpeed={.7} panSpeed={.65}
   onStart={() => { apiRef.current?.activity(true); onDragging(true); }}
   onEnd={() => apiRef.current?.end()} />
 </>;
}
