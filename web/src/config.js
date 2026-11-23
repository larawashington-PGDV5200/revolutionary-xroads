// Every constant the page uses lives here, so you can tune the look without touching layer code.
import { ___ } from './blank.js';

// Data extent from data/relief_bounds.json: [west, south, east, north] in degrees.
export const BOUNDS = [-100.0, 24.908, -66.617, 47.442];

// ✏️ a1: the camera. deck.gl calls this the "view state".
//   longitude, latitude: the point the camera looks at (try the middle of BOUNDS).
//   zoom: 0 = whole world; each +1 doubles the scale. The eastern US fits at about 4.
//   pitch: tilt in degrees. 0 = straight down; 60 = the axonometric look.
//   bearing: rotation in degrees. Negative turns the map clockwise.
export const INITIAL_VIEW = {
  longitude: ___,
  latitude: ___,
  zoom: ___,
  pitch: ___,
  bearing: ___,
  maxPitch: 85,      // deck.gl caps pitch at 60 unless you raise this
};

// The stack, bottom → top (PLAN.md). `index` decides each layer's height when exploded.
export const STACK = [
  { id: 'L1', label: 'Topography' },
  { id: 'L2', label: 'Land not yet ceded' },
  { id: 'L3', label: 'Land ads' },
  { id: 'L4', label: 'Migration' },
  { id: 'L5', label: 'Cessions & reservations' },
  { id: 'L6', label: 'Infrastructure' },
].map((d, index) => ({ ...d, index }));

// Explode/collapse (step d).
export const GAP_M = 120_000;   // metres between layers when fully exploded (tune by eye)
export const EXPLODE_MS = 900;  // animation length

// Time slider (step e). Applies to the dated layers 2, 5, 6 (and borders, ads).
export const YEARS = { min: 1770, max: 1840, step: 10, start: 1790 };
// Border snapshots that exist in borders.topojson (each shape has a `years` list).
export const BORDER_SNAPSHOTS = [1784, 1790, 1800, 1810, 1820, 1830, 1840];

// Pension Act cohorts in flows.json / nodes.json (`act_cohort`). 'all' = no filter.
export const COHORTS = ['all', '1818-19', '1820-31', '1832-35', '1836-47', '1848+', 'unknown'];

// Colours as [r, g, b, alpha 0–255]. Plain on purpose; the design pass comes in V1.
export const COLORS = {
  water: [120, 160, 190, 255],
  state: [60, 60, 60, 255],
  county: [170, 170, 170, 120],
  uncededFill: [200, 120, 60, 90],
  uncededLine: [160, 90, 40, 200],
  cededFill: [120, 120, 120, 50],
  ads: [40, 90, 160, 160],
  path: [200, 30, 30, 255],
  reservation: [140, 40, 110, 220],
  removal: [140, 40, 110, 200],
  road: [90, 70, 50, 255],
  canal: [40, 110, 160, 255],
  rail: [20, 20, 20, 255],
  steamboat: [80, 140, 180, 180],
  route: [150, 110, 60, 255],
};
