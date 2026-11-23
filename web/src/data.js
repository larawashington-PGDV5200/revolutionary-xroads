// Loads every file in data/ once and reshapes it for deck.gl. Nothing to fill in here; read it to
// see what shape each layer receives.
import { feature } from 'topojson-client';
import { BORDER_SNAPSHOTS } from './config.js';

const getJSON = async (file) => {
  const res = await fetch(`data/${file}`);
  if (!res.ok) throw new Error(`${file}: ${res.status}`);
  return res.json();
};

// TopoJSON stores shared borders once (smaller files). deck.gl's GeoJsonLayer wants GeoJSON,
// so feature(topology, object) unpacks one named object into a GeoJSON FeatureCollection.
// Features with no geometry (Royce rows with no polygon, untraced lines) are dropped here.
const toGeo = (topo, name) => {
  const fc = feature(topo, topo.objects[name]);
  fc.features = fc.features.filter((f) => f.geometry);
  return fc;
};

export async function loadAll() {
  const [bounds, borders, water, native, ads, flows, nodes, reservations, infra, removal, pathIndex] =
    await Promise.all([
      getJSON('relief_bounds.json'),
      getJSON('borders.topojson'),
      getJSON('water.topojson'),
      getJSON('native_land.topojson'),
      getJSON('ads_places.json'),
      getJSON('flows.json'),
      getJSON('nodes.json'),
      getJSON('reservations.json'),
      getJSON('infrastructure.topojson'),
      getJSON('removal_routes.topojson'),
      getJSON('paths.json'),
    ]);

  // place_id → [lon, lat], from nodes.json (one row per place × cohort, so dedupe).
  // paths/*.json stops only carry place_id, so this is how a stop finds its position.
  const placeCoords = new Map();
  for (const n of nodes) placeCoords.set(n.place_id, [n.lon, n.lat]);

  return {
    // L1: relief image + bounds; states and counties (each feature has properties.years); water.
    relief: { image: 'data/relief.png', bounds: bounds.bounds, meta: bounds },
    states: toGeo(borders, 'states'),
    counties: toGeo(borders, 'counties'),
    rivers: toGeo(water, 'rivers'),
    lakes: toGeo(water, 'lakes'),
    coast: toGeo(water, 'coast'),

    // L2 + L5: Royce polygons (properties.cession_year, nation_as_named), NY state cessions (points).
    royce: toGeo(native, 'royce_cessions'),
    stateCessions: toGeo(native, 'state_cessions'),
    pre1784: toGeo(native, 'pre1784_lines'), // empty for now: lines not traced yet (todo in C01)

    // L3: one row per place × decade: { place_id, lat, lon, decade, n_ads, n_runs, papers }
    ads: ads.places,

    // L4: flows = { from, to, act_cohort, people, legs, level }; locations = state centroids.
    flows: flows.filter((f) => f.level === 'state'),
    locations: [...new Map(
      nodes.filter((n) => n.level === 'state').map((n) => [n.place_id, { id: n.place_id, lat: n.lat, lon: n.lon }]),
    ).values()],
    placeCoords,
    pathIndex, // which paths/<state>.json holds whom (split by state of last stop)

    // L5: reservations = { name, nation_as_in_source, lat, lon, start_year, end_year, ... }
    reservations: reservations.filter((r) => r.has_coords),
    removal: toGeo(removal, 'trail_of_tears'), // undated in the source (year: null)

    // L6: { kind: road | canal | rail | steamboat | route, name, year_open }
    infrastructure: toGeo(infra, 'infrastructure'),
  };
}

// One person's file: loads paths/<state>.json on demand (31 MB in all, so never up front).
const pathCache = new Map();
export async function loadPerson(data, state, naid) {
  const part = data.pathIndex.parts.find((p) => p.state === state);
  if (!part) return null;
  if (!pathCache.has(part.file)) pathCache.set(part.file, await getJSON(part.file));
  const person = pathCache.get(part.file).find((p) => p.NAID === naid);
  if (!person) return null;
  // Attach a position to each stop so a PathLayer can draw it.
  const stops = person.stops
    .map((s) => ({ ...s, position: data.placeCoords.get(s.place_id) }))
    .filter((s) => s.position);
  return { ...person, stops };
}

// The latest border snapshot at or before `year` (falls back to the first, 1784).
export function snapshotFor(year) {
  return [...BORDER_SNAPSHOTS].reverse().find((y) => y <= year) ?? BORDER_SNAPSHOTS[0];
}
