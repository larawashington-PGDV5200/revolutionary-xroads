export const INITIAL_VIEW = {
  longitude: -88,
  latitude: 32,
  zoom: 4,
  pitch: 60,
  bearing: 360,
  minPitch: 60,
  maxPitch: 60,
};

export const STACK = [
  { id: 'L1', label: 'Topography' },
  { id: 'L2', label: 'Land not yet ceded' },
  { id: 'L3', label: 'Land ads' },
  { id: 'L4', label: 'Migration' },
  { id: 'L5', label: 'Cessions & reservations' },
  { id: 'L6', label: 'Infrastructure' },
].map((d, index) => ({ ...d, index }));

export const GAP_M = 120_000;
export const EXPLODE_MS = 900;

export const YEARS = { min: 1770, max: 1840, step: 10, start: 1790 };
export const BORDER_SNAPSHOTS = [1784, 1790, 1800, 1810, 1820, 1830, 1840];
export const COHORTS = ['all', '1818-19', '1820-31', '1832-35', '1836-47', '1848+', 'unknown'];

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
