import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
export default function ContextGuard({ onUnavailable }) {
 const { gl } = useThree();
 useEffect(() => {
  const lost = (event) => { event.preventDefault(); onUnavailable(); };
  const canvas = gl.domElement; canvas.addEventListener('webglcontextlost', lost);
  return () => canvas.removeEventListener('webglcontextlost', lost);
 }, [gl, onUnavailable]);
 return null;
}
