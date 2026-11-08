import { MathUtils, Vector3 } from 'three';

export function fitDistance(radius, fov, aspect, margin = 1.15) {
 const vertical = MathUtils.degToRad(fov) / 2;
 const horizontal = Math.atan(Math.tan(vertical) * Math.max(.1, aspect));
 return Math.max(.01, radius) * margin / Math.sin(Math.min(vertical, horizontal));
}
export function viewerLimits(radius, distance) {
 return { minDistance: radius * 1.05, maxDistance: distance * 3.5, panRadius: radius * .4,
  minPolarAngle: .12, maxPolarAngle: Math.PI / 2 - .04 };
}
export function clampPan(target, cameraPosition, radius, scratch = new Vector3()) {
 if (target.lengthSq() <= radius * radius) return false;
 scratch.copy(target).clampLength(0, radius).sub(target);
 target.add(scratch); cameraPosition.add(scratch);
 return true;
}
export function zoomPosition(position, target, factor, limits, result = new Vector3()) {
 return result.copy(position).sub(target).multiplyScalar(factor)
  .clampLength(limits.minDistance, limits.maxDistance).add(target);
}
