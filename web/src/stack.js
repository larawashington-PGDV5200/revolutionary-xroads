import { Matrix4 } from '@math.gl/core';
import { GAP_M, EXPLODE_MS } from './config.js';

export const stack = { t: 0 };

export function stackProps(index) {
  const z = index * GAP_M * stack.t;
  return {
    modelMatrix: new Matrix4().translate([0, 0, z]),
    parameters: { depthCompare: 'always', depthWriteEnabled: false },
  };
}

export function animateStack(target, redraw) {
  const from = stack.t;
  const start = performance.now();
  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
  const tick = (now) => {
    const p = Math.min(1, (now - start) / EXPLODE_MS);
    stack.t = from + (target - from) * ease(p);
    redraw();
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
