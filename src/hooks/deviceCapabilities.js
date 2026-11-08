export function supportsWebGL() {
 try { const canvas = document.createElement('canvas'); const gl = canvas.getContext('webgl2'); const supported = Boolean(gl); gl?.getExtension('WEBGL_lose_context')?.loseContext(); return supported; } catch { return false; }
}
export function isLowPower() {
 return Boolean(navigator.connection?.saveData || (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) || (navigator.deviceMemory && navigator.deviceMemory < 4));
}