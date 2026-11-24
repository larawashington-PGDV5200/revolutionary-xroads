// C1: gap between planes (120 km → 300 km in T-017 → 800 km in T-018, so the planes part on screen
// at the three-quarter view below); the camera orbits the middle of the exploded stack.
export const GAP_M = 800_000;

export const INITIAL_VIEW = {
  longitude: -88,
  latitude: 32,
  zoom: 2.85,
  // T-018: three-quarter view like the reference plate.
  pitch: 52,
  bearing: -25,
  minPitch: 20,
  maxPitch: 85,
  minZoom: 2, // T-023: zoom clamp, from the whole East to a county or two
  maxZoom: 9,
  position: [0, 0, GAP_M * 2.5],
};

// T-023: collapsed, the camera looks straight down on plane 01, fitted to the extent. The orbit offset
// goes to 0 (all planes sit at z = 0). Padding clears the side panel, the timeline and the plane label.
export const COLLAPSED_VIEW = { pitch: 0, bearing: 0, minPitch: 0, position: [0, 0, 0] };
export const FIT_PAD = { edge: 24, label: 100 };

export const STACK = [
  { id: 'L1', label: 'Topography' },
  { id: 'L2', label: 'Native land' },
  { id: 'L3', label: 'Land ads' },
  { id: 'L4', label: 'Migration' },
  { id: 'L5', label: 'Native land ceded' },
  { id: 'L6', label: 'Settlement and routes' },
].map((d, index) => ({ ...d, index }));

export const GUIDE_DOTS = 12;
export const FOCUS_MS = 200;
export const FOCUS_DIM = 0.15;
export const EXPLODE_MS = 900;

export const YEARS = { min: 1770, max: 1840, step: 10, start: 1790 };
export const BORDER_SNAPSHOTS = [1784, 1790, 1800, 1810, 1820, 1830, 1840];
export const ACTS = [1818, 1820, 1832, 1836, 1838];

export const COLORS = {
  water: [120, 160, 190, 255],
  state: [60, 60, 60, 255],
  county: [170, 170, 170, 120],
  // C5 / D-028: the Native layers are one madder family. Held = solid (L2); ceded = outline only, no fill
  // (L5, B-044), in a darker madder so its edges still read over the held fill when collapsed; reserves and
  // removal routes = the dark madder. The before-1784 zone is a warm neutral, outside the madder family.
  held: [158, 59, 46, 150], // #9E3B2E
  heldLine: [158, 59, 46, 230],
  cededLine: [122, 42, 32, 235], // #7A2A20, between held and reserve
  cededWidth: 1.25, // px
  taken: [176, 148, 118, 255], // #B09476 before-1784 zone tint; alpha set per uncertainty (NATIVE.taken)
  reserve: [107, 34, 25, 255], // #6B2219
  removal: [107, 34, 25, 220],
  ads: [40, 90, 160, 160],
  // Reds are kept for the Native layers (T-018/T-019), so the per-person path is ink.
  path: [30, 30, 30, 255],
  // C6: settlement and routes (L6). Settlements in ink, routes drawn above them.
  postOffice: [60, 55, 50, 150],
  urban: [30, 28, 26, 230],
  road: [90, 70, 50, 255],
  canal: [40, 110, 160, 255],
  rail: [20, 20, 20, 255],
  route: [150, 110, 60, 255],
  frame: [90, 90, 90, 110],
  frameFocus: [40, 40, 40, 220],
  guide: [60, 60, 60, 200],
};

// C4 migration (T-018). The 8 states with most people out (all decades) take these hues in rank order
// (MA, CT, VA, NC, PA, NY, NJ, NH at the time of writing); every other state takes HUB_NEUTRAL.
// No reds (Native layers). Checked with the dataviz validate_palette.py, --pairs all, on white and on
// the relief at 50 % (#d0c6b8): worst pair normal-vision ΔE 17.7, colour-blind ΔE 10.2.
export const HUB_PALETTE = ['#0c558f', '#cbb100', '#34621c', '#aa9df9', '#1694b8', '#795edc', '#499c02', '#27cda5'];
export const HUB_NEUTRAL = '#a9a59f';

export const STATE_NAMES = {
  AL: 'Alabama', AR: 'Arkansas', CT: 'Connecticut', DC: 'District of Columbia', DE: 'Delaware', FL: 'Florida',
  GA: 'Georgia', IA: 'Iowa', IL: 'Illinois', IN: 'Indiana', KY: 'Kentucky', LA: 'Louisiana', MA: 'Massachusetts',
  MD: 'Maryland', ME: 'Maine', MI: 'Michigan', MO: 'Missouri', MS: 'Mississippi', NC: 'North Carolina',
  NH: 'New Hampshire', NJ: 'New Jersey', NY: 'New York', OH: 'Ohio', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', TN: 'Tennessee', TX: 'Texas', VA: 'Virginia', VT: 'Vermont', WI: 'Wisconsin',
};

export const FLOW = {
  top: 40, // T-019 #7, default: the largest 40 flows of the decade shown (state.minPeople = null)
  minOptions: [25, 10, 5, 1], // or every flow of at least this many people
  kmPerSqrtPerson: 5, // width at the origin = 5 km × √people (1,676 people → 205 km)
  tip: 0.15, // width at the destination, as a share of the origin width
  bend: 0.18, // curve to the right of travel, so A→B and B→A don't overlap
  particleKmPerS: 90, // drift speed
};

// C5: Native layers (T-019). T-023: flat tints, no screen-pixel hatches (they slid over the moving planes).
export const NATIVE = {
  l2Title: (year) => `Native land, as of ${year}`,
  l2Subtitle: 'Shaded until the year a treaty ceded it to the United States (Royce 1899, from 1784).',
  // "Taken before 1784" zone: fainter where the bounding line is less certain (T-022). Three alpha steps;
  // B-044: "high" raised from 30 so it still shows on the white plane and in the swatch.
  taken: {
    low: { alpha: 180 },
    medium: { alpha: 120 },
    high: { alpha: 70 },
  },
  // R10 §3 page text. With no zone geometry, the first sentence drops "in this shaded zone".
  pageNote: [
    'Land in this shaded zone was taken from Native nations before 1784 by colonial governments, private deeds and ' +
      'Crown treaties such as Fort Stanwix (1768); Royce maps only cessions to the United States from 1784, so these ' +
      'losses are not drawn here.',
    'Native communities did not leave with the land: the dots mark reserves and towns that remained, from Mashpee to ' +
      'Pamunkey to Catawba.',
  ],
  pageNoteNoZone:
    'Land was taken from Native nations before 1784 by colonial governments, private deeds and Crown treaties such as ' +
    'Fort Stanwix (1768); Royce maps only cessions to the United States from 1784, so these losses are not drawn here.',
};

// C6: settlement dots (L6). Post offices are a fixed small dot; urban places (≥ 2,500) grow with √population.
export const SETTLE = {
  officeRadius: 1.1, // px
  urbanMin: 2.5, // px, plus √pop × urbanPerSqrt
  urbanPerSqrt: 0.025, // New York 1840 (312,710) → ~16.5 px
};
