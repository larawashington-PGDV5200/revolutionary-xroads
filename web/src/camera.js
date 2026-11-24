// T-023: the camera. Collapsed, it looks straight down on plane 01, fitted to the extent; exploded, it
// returns to the three-quarter view. Moves ease alongside animateStack and are instant under reduced motion.
import { LinearInterpolator, WebMercatorViewport } from '@deck.gl/core';
import { INITIAL_VIEW, COLLAPSED_VIEW, FIT_PAD, EXPLODE_MS } from './config.js';
import { ease, reducedMotion } from './stack.js';

const interpolator = new LinearInterpolator(['longitude', 'latitude', 'zoom', 'pitch', 'bearing', 'position']);

// C1 + T-023: left-drag turns and tilts; right- or shift-drag pans. Inertia and smooth zoom unless reduced motion.
export const controller = () => ({
  dragMode: 'rotate',
  inertia: reducedMotion.matches ? false : 300,
  scrollZoom: { smooth: !reducedMotion.matches, speed: 0.01 },
  doubleClickZoom: true,
  keyboard: true,
});

export const getCursor = ({ isDragging, isHovering }) => (isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab');

// Top-down view of the extent, clear of the side panel (and the plane label left of it) and the timeline.
function fitted(extent) {
  const { innerWidth: width, innerHeight: height } = window;
  const panel = document.getElementById('panel').getBoundingClientRect();
  const timeline = document.getElementById('timeline').getBoundingClientRect();
  const padding = {
    left: Math.min(panel.right + FIT_PAD.edge + FIT_PAD.label, width / 2),
    right: FIT_PAD.edge,
    top: FIT_PAD.edge,
    bottom: Math.min(height - timeline.top + FIT_PAD.edge, height / 2),
  };
  const [w, s, e, n] = extent;
  const fit = new WebMercatorViewport({ width, height }).fitBounds([[w, s], [e, n]], { padding });
  const zoom = Math.max(INITIAL_VIEW.minZoom, Math.min(INITIAL_VIEW.maxZoom, fit.zoom));
  return { ...INITIAL_VIEW, ...COLLAPSED_VIEW, longitude: fit.longitude, latitude: fit.latitude, zoom };
}

export const viewFor = (collapsed, extent) => (collapsed ? fitted(extent) : INITIAL_VIEW);

// Setting a new initialViewState moves the camera; a transition eases it there.
export function moveCamera(deck, view, animate = true) {
  const duration = animate && !reducedMotion.matches ? EXPLODE_MS : 0;
  deck.setProps({
    initialViewState: { ...view, transitionDuration: duration, transitionEasing: ease, transitionInterpolator: interpolator },
  });
}
