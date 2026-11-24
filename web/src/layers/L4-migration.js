// C4: state-to-state migration for the decade shown (T-018).
// Each flow is a curved band, wide where people left and thin where they arrived; dots drift along it.
import { PathLayer, ScatterplotLayer, SolidPolygonLayer, TextLayer } from '@deck.gl/layers';
import { COLORS, FLOW, HUB_PALETTE, HUB_NEUTRAL } from '../config.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const KM_PER_DEG = 111.32;
const SAMPLES = 32;

const rgb = (hex, a = 255) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).concat(a);
const darker = ([r, g, b], a = 255) => [r * 0.7, g * 0.7, b * 0.7, a];

// Moves between two different states; a move inside one state has no line to draw.
const between = (data) => data.flows.filter((f) => f.from !== f.to);

// The 8 states with most people out over all decades, in rank order (memoised: data never changes).
let ranked = null;
export function topHubs(data) {
  if (ranked) return ranked;
  const out = new Map();
  for (const f of between(data)) out.set(f.from, (out.get(f.from) ?? 0) + f.people);
  ranked = [...out].sort((a, b) => b[1] - a[1]).slice(0, HUB_PALETTE.length).map(([id], i) => ({ id, hex: HUB_PALETTE[i] }));
  return ranked;
}
export const hubHex = (data, id) => topHubs(data).find((h) => h.id === id)?.hex ?? HUB_NEUTRAL;

// Hubs inside the shared map extent (T-011); California and Oregon Territory fall outside and aren't drawn.
const coordsOf = (data) => {
  const [w, s, e, n] = data.extent;
  return new Map(data.locations.filter((l) => l.lon >= w && l.lon <= e && l.lat >= s && l.lat <= n)
    .map((l) => [l.id, [l.lon, l.lat]]));
};

// Quadratic Bézier from a to b, bent to the right of travel. Works in a local frame where
// x = lon × cos(lat), so the bend and the band width are the same on screen in every direction.
function geometry(a, b, people) {
  const k = Math.cos((((a[1] + b[1]) / 2) * Math.PI) / 180);
  const dx = (b[0] - a[0]) * k;
  const dy = b[1] - a[1];
  const c = [(a[0] + b[0]) / 2 + (FLOW.bend * dy) / k, (a[1] + b[1]) / 2 - FLOW.bend * dx];
  const w0 = (FLOW.kmPerSqrtPerson * Math.sqrt(people)) / KM_PER_DEG;

  const centre = [];
  const left = [];
  const right = [];
  for (let i = 0; i <= SAMPLES; i += 1) {
    const t = i / SAMPLES;
    const u = 1 - t;
    const p = [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
    // Tangent in the local frame → unit normal → back to lon/lat.
    const tx = (2 * u * (c[0] - a[0]) + 2 * t * (b[0] - c[0])) * k;
    const ty = 2 * u * (c[1] - a[1]) + 2 * t * (b[1] - c[1]);
    const len = Math.hypot(tx, ty) || 1;
    const half = (w0 * (1 - (1 - FLOW.tip) * t)) / 2;
    const nx = (-ty / len) * half;
    const ny = (tx / len) * half;
    centre.push(p);
    left.push([p[0] + nx / k, p[1] + ny]);
    right.push([p[0] - nx / k, p[1] - ny]);
  }
  let km = 0;
  for (let i = 1; i < centre.length; i += 1) {
    km += Math.hypot((centre[i][0] - centre[i - 1][0]) * k, centre[i][1] - centre[i - 1][1]) * KM_PER_DEG;
  }
  return { centre, polygon: [...left, ...right.reverse()], km };
}

// One record per flow of the decade, with its geometry (memoised per decade).
const decadeCache = new Map();
function decadeFlows(data, year) {
  if (!decadeCache.has(year)) {
    const coords = coordsOf(data);
    const rows = between(data)
      .filter((f) => f.decade === year && coords.has(f.from) && coords.has(f.to))
      .sort((a, b) => b.people - a.people)
      .map((f) => ({ ...f, ...geometry(coords.get(f.from), coords.get(f.to), f.people) }));
    decadeCache.set(year, rows);
  }
  return decadeCache.get(year);
}

// Tooltip numbers for one state in the decade shown: people out and in, top 3 each way.
export function hubStats(data, year, id) {
  const rows = decadeFlows(data, year);
  const outs = rows.filter((f) => f.from === id);
  const ins = rows.filter((f) => f.to === id);
  const sum = (list) => list.reduce((n, f) => n + f.people, 0);
  return {
    out: sum(outs),
    in: sum(ins),
    topTo: outs.slice(0, 3).map((f) => [f.to, f.people]),
    topFrom: ins.slice(0, 3).map((f) => [f.from, f.people]),
  };
}

const hubRadius = (h) => 2.5 + Math.sqrt(h.people) * 0.06;

// The state whose flows are isolated: a clicked one stays until Esc; otherwise the hovered one.
export const selectedHub = (state) => state.pinnedHub ?? state.hoverHub;

// Flows drawn without a selection: the largest FLOW.top of the decade (state.minPeople = null, the default,
// T-019 #7), or every flow of at least state.minPeople.
export const unselectedFlows = (data, state) => {
  const all = decadeFlows(data, state.year);
  return state.minPeople == null ? all.slice(0, FLOW.top) : all.filter((f) => f.people >= state.minPeople);
};

// Legend numbers: flows drawn, flows in the decade, the largest.
export function flowCounts(data, state) {
  const all = decadeFlows(data, state.year);
  return { shown: unselectedFlows(data, state).length, total: all.length, largest: all[0]?.people ?? 0 };
}

export function migrationLayers(data, state, common) {
  const all = decadeFlows(data, state.year);
  const sel = selectedHub(state);
  // Isolated: every flow in or out of that state, whatever its size.
  const flows = sel ? all.filter((f) => f.from === sel || f.to === sel) : unselectedFlows(data, state);
  // Every flow takes its origin's colour, also when a hub is isolated, so in-flows show where people came from.
  const colourOf = (f) => rgb(hubHex(data, f.from));

  const coords = coordsOf(data);
  // Every state with a move this decade stays hoverable, even when its flows are under the threshold.
  const hubIds = new Set((sel ? flows : all).flatMap((f) => [f.from, f.to]));
  if (sel) hubIds.add(sel);
  const hubs = [...hubIds].filter((id) => coords.has(id)).map((id) => {
    const s = hubStats(data, state.year, id);
    return { id, position: coords.get(id), people: s.out + s.in, colour: rgb(hubHex(data, id)) };
  });
  const trigger = [state.year, state.minPeople, sel];

  const layers = [
    new SolidPolygonLayer({
      id: 'L4-flows',
      data: flows,
      getPolygon: (f) => f.polygon,
      getFillColor: (f) => [...colourOf(f).slice(0, 3), 190],
      pickable: true,
      updateTriggers: { getFillColor: trigger },
      ...common,
    }),
    // A 1 px centre line, so flows thinner than a pixel still show.
    new PathLayer({
      id: 'L4-lines',
      data: flows,
      getPath: (f) => f.centre,
      getColor: (f) => colourOf(f),
      getWidth: 1,
      widthUnits: 'pixels',
      updateTriggers: { getColor: trigger },
      ...common,
    }),
  ];

  // Slow dots from origin to destination; none with prefers-reduced-motion.
  if (!reduced.matches) {
    const now = performance.now() / 1000;
    const dots = [];
    for (const f of flows) {
      const n = Math.min(8, Math.max(1, Math.round(Math.sqrt(f.people) / 3)));
      const period = f.km / FLOW.particleKmPerS;
      const colour = darker(colourOf(f));
      for (let j = 0; j < n; j += 1) {
        const s = ((now / period + j / n) % 1) * SAMPLES;
        const i = Math.min(SAMPLES - 1, Math.floor(s));
        const [p, q] = [f.centre[i], f.centre[i + 1]];
        const r = s - i;
        dots.push({ position: [p[0] + (q[0] - p[0]) * r, p[1] + (q[1] - p[1]) * r], colour });
      }
    }
    layers.push(new ScatterplotLayer({
      id: 'L4-particles',
      data: dots,
      getPosition: (d) => d.position,
      getFillColor: (d) => d.colour,
      getRadius: 1.4,
      radiusUnits: 'pixels',
      ...common,
    }));
  }

  layers.push(
    new ScatterplotLayer({
      id: 'L4-hubs',
      data: hubs,
      getPosition: (h) => h.position,
      getFillColor: (h) => h.colour,
      getLineColor: [255, 255, 255, 255],
      getRadius: (h) => hubRadius(h),
      radiusUnits: 'pixels',
      stroked: true,
      lineWidthUnits: 'pixels',
      getLineWidth: (h) => (h.id === sel ? 2.5 : 1),
      pickable: true,
      updateTriggers: { getLineWidth: sel },
      ...common,
    }),
    // Direct labels: several hub hues sit under 3:1 contrast on the relief, so each hub is named.
    new TextLayer({
      id: 'L4-labels',
      data: hubs,
      getPosition: (h) => h.position,
      getText: (h) => h.id,
      getSize: 10,
      getColor: [40, 40, 40, 230],
      getPixelOffset: (h) => [0, -(hubRadius(h) + 2)],
      getAlignmentBaseline: 'bottom',
      fontFamily: 'system-ui, sans-serif',
      characterSet: 'auto',
      ...common,
    }),
  );

  if (state.person) {
    layers.push(
      new PathLayer({
        id: 'L4-path',
        data: [state.person],
        getPath: (p) => p.stops.map((s) => s.position),
        getColor: COLORS.path,
        getWidth: 3,
        widthUnits: 'pixels',
        ...common,
      }),
      new ScatterplotLayer({
        id: 'L4-stops',
        data: state.person.stops,
        getPosition: (s) => s.position,
        getFillColor: COLORS.path,
        getRadius: 5,
        radiusUnits: 'pixels',
        pickable: true,
        ...common,
      }),
    );
  }

  return layers;
}

// The particles need a redraw every frame while the layer is on.
export const migrationAnimates = (state) => state.visible.L4 && !reduced.matches;
