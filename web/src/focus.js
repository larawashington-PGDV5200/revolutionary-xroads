// C3: one layer at full strength, the others faded; 200 ms, none with reduced motion.
import { STACK, FOCUS_MS, FOCUS_DIM } from './config.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
export const fade = Object.fromEntries(STACK.map(({ id }) => [id, 1]));
export const focus = { id: null };

// Two hover sources (map and layer list); the list wins, so leaving the canvas for the list doesn't clear it.
const hover = { map: null, list: null };
export function hoverFrom(source, id, redraw) {
  hover[source] = id;
  setFocus(hover.list ?? hover.map, redraw);
}

let frame = null;
function setFocus(id, redraw) {
  if (id === focus.id) return;
  focus.id = id;
  const target = (l) => (id == null || l === id ? 1 : FOCUS_DIM);
  if (frame) cancelAnimationFrame(frame);
  if (reduced.matches) {
    for (const l of Object.keys(fade)) fade[l] = target(l);
    redraw();
    return;
  }
  const from = { ...fade };
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min(1, (now - start) / FOCUS_MS);
    for (const l of Object.keys(fade)) fade[l] = from[l] + (target(l) - from[l]) * p;
    redraw();
    frame = p < 1 ? requestAnimationFrame(tick) : null;
  };
  frame = requestAnimationFrame(tick);
}

// Layer id → stack id ('L3-ads' → 'L3'); frames and guides belong to no layer.
export const stackIdOf = (layerId) => (layerId ? layerId.match(/^(L\d)-/)?.[1] ?? null : null);
