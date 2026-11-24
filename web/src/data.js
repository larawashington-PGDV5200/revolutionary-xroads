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
  const [bounds, borders, water, native, ads, flows, nodes, reservations, infra, removal, pathIndex, settlements] =
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
      getJSON('settlements.json'),
    ]);

  // C7: migration legs per decade (state level); legs with no year are counted, not drawn.
  const stateFlows = flows.filter((f) => f.level === 'state');
  const legsByDecade = new Map();
  let undatedLegs = 0;
  for (const f of stateFlows) {
    if (f.decade == null) undatedLegs += f.legs;
    else legsByDecade.set(f.decade, (legsByDecade.get(f.decade) ?? 0) + f.legs);
  }

  // C5: the "taken before 1784" zone (T-021/T-022). Kept even with null geometry, so the page note can show.
  const before = native.objects.before_1784 ? feature(native, native.objects.before_1784).features : [];

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
    before1784: before.filter((f) => f.geometry),
    before1784Props: before.map((f) => f.properties),
    // T-022 addendum: areas left open (northern NY, Maine, Vermont), drawn as a dashed outline only.
    before1784Open: native.objects.before_1784_open ? toGeo(native, 'before_1784_open').features : [],
    ads: ads.places,
    extent: bounds.extent,
    flows: stateFlows,
    legsByDecade,
    undatedLegs,
    // Hubs at the people-weighted centre of the state's residences (T-013); centroid if none.
    locations: [...new Map(
      nodes.filter((n) => n.level === 'state').map((n) => [n.place_id, {
        id: n.place_id, lat: n.hub_lat ?? n.lat, lon: n.hub_lon ?? n.lon,
      }]),
    ).values()],
    placeCoords,
    pathIndex,
    reservations: reservations.filter((r) => r.has_coords),
    removal: toGeo(removal, 'trail_of_tears'),
    infrastructure: toGeo(infra, 'infrastructure'),
    // C6: dated settled places (T-016): post offices and Gibson urban places ≥ 2,500.
    offices: settlements.settlements.filter((d) => d.kind === 'post_office'),
    urban: settlements.settlements.filter((d) => d.kind === 'urban_2500'),
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
