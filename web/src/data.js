import { feature } from 'topojson-client';
import { BORDER_SNAPSHOTS } from './config.js';

const getJSON = async (file) => {
  const res = await fetch(`data/${file}`);
  if (!res.ok) throw new Error(`${file}: ${res.status}`);
  return res.json();
};

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

  const placeCoords = new Map();
  for (const n of nodes) placeCoords.set(n.place_id, [n.lon, n.lat]);

  return {
    relief: { image: 'data/relief.png', bounds: bounds.bounds },
    states: toGeo(borders, 'states'),
    counties: toGeo(borders, 'counties'),
    rivers: toGeo(water, 'rivers'),
    lakes: toGeo(water, 'lakes'),
    coast: toGeo(water, 'coast'),
    royce: toGeo(native, 'royce_cessions'),
    stateCessions: toGeo(native, 'state_cessions'),
    ads: ads.places,
    flows: flows.filter((f) => f.level === 'state'),
    locations: [...new Map(
      nodes.filter((n) => n.level === 'state').map((n) => [n.place_id, { id: n.place_id, lat: n.lat, lon: n.lon }]),
    ).values()],
    placeCoords,
    pathIndex,
    reservations: reservations.filter((r) => r.has_coords),
    removal: toGeo(removal, 'trail_of_tears'),
    infrastructure: toGeo(infra, 'infrastructure'),
  };
}

const pathCache = new Map();
export async function loadPerson(data, state, naid) {
  const part = data.pathIndex.parts.find((p) => p.state === state);
  if (!part) return null;
  if (!pathCache.has(part.file)) pathCache.set(part.file, await getJSON(part.file));
  const person = pathCache.get(part.file).find((p) => p.NAID === naid);
  if (!person) return null;
  const stops = person.stops
    .map((s) => ({ ...s, position: data.placeCoords.get(s.place_id) }))
    .filter((s) => s.position);
  return { ...person, stops };
}

export function snapshotFor(year) {
  return [...BORDER_SNAPSHOTS].reverse().find((y) => y <= year) ?? BORDER_SNAPSHOTS[0];
}
