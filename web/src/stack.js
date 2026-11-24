// Step d: the exploded stack. Every layer is drawn flat on the same map; we lift each one by
// moving it up the z axis with a "model matrix", a 4×4 transform deck.gl applies to a layer's
// positions before drawing. With lon/lat data, x and y are degrees and z is METRES.
import { Matrix4 } from '@math.gl/core';
import { GAP_M, EXPLODE_MS } from './config.js';
import { ___ } from './blank.js';

// t runs from 0 (collapsed) to 1 (exploded). The animation below changes it; stackProps reads it.
export const stack = { t: 0 };

export function stackProps(index) {
  // ✏️ d1: how high (metres) layer number `index` sits for the current stack.t.
  //   Collapsed (t = 0) → 0 for every layer. Exploded (t = 1) → index × GAP_M.
  //   Until you fill it, everything stays collapsed.
  const z = index * GAP_M * stack.t;

  return {
    modelMatrix: new Matrix4().translate([0, 0, z]),
    // Turn off the depth test: layers are drawn in array order (bottom → top), like paper on a
    // table. Without this, flat layers at the same height flicker ("z-fighting").
    parameters: { depthCompare: 'always', depthWriteEnabled: false },
  };
}

// Animate stack.t toward `target` (0 or 1), calling redraw() every frame.
export function animateStack(target, redraw) {
  const from = stack.t;
  const start = performance.now();
  const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2); // ease-in-out
  const tick = (now) => {
    const p = Math.min(1, (now - start) / EXPLODE_MS);
    stack.t = from + (target - from) * ease(p);
    redraw();
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
