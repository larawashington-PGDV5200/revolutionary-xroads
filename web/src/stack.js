import { Matrix4 } from '@math.gl/core';
import { GAP_M, EXPLODE_MS } from './config.js';

export const stack = { t: 0 };

// T-023: shared with the camera move, so the planes and the view arrive together.
export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
export const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);

export const planeZ = (index) => index * GAP_M * stack.t;

export function stackProps(index) {
  return {
    modelMatrix: new Matrix4().translate([0, 0, planeZ(index)]),
    parameters: { depthCompare: 'always', depthWriteEnabled: false },
  };
}

export function animateStack(target, redraw) {
  if (reducedMotion.matches) {
    stack.t = target;
    redraw();
    return;
  }
  const from = stack.t;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / EXPLODE_MS);
    stack.t = from + (target - from) * ease(p);
    redraw();
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
