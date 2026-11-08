import { Canvas } from '@react-three/fiber';
import ContextGuard from './ContextGuard';
import ModelScene from './ModelScene';

export default function ModelCanvas({ onUnavailable, ...sceneProps }) {
 return <Canvas onCreated={({ gl }) => gl.domElement.setAttribute('aria-hidden', 'true')}
  frameloop="demand" dpr={[1, 1.5]} camera={{ position: [4, 3, 5], fov: 45 }} gl={{ powerPreference: 'low-power' }}>
  <ContextGuard onUnavailable={onUnavailable} />
  <ModelScene {...sceneProps} />
 </Canvas>;
}
