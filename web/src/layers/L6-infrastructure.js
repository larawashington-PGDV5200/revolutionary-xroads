// C6 (T-019): "Settlement and routes" (D-026). Settlements below, railroads, canals and roads above.
import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { COLORS, SETTLE } from '../config.js';

// A post office shows from year_established through year_discontinued, gone after it (null = open past the data).
export const officesOpen = (data, year) => data.offices.filter((d) =>
  d.year_established <= year && (d.year_discontinued == null || d.year_discontinued >= year));

// An urban place shows in a census year that lists it (Raleigh is listed in 1820 only). The 10 places
// carried into 1840 (T-016) show in 1840 sized by their 1830 figure. No census before 1790, so none then.
const censusFor = (d, year) => (d.pop[year] != null ? year : d.carried_1840 && year === 1840 ? 1830 : null);

export const urbanOpen = (data, year) => data.urban
  .map((d) => ({ ...d, census: censusFor(d, year) }))
  .filter((d) => d.census != null)
  .map((d) => ({ ...d, popShown: d.pop[d.census] }))
  .sort((a, b) => b.popShown - a.popShown); // big circles first, so small ones stay on top and pickable

const urbanRadius = (d) => SETTLE.urbanMin + Math.sqrt(d.popShown ?? 0) * SETTLE.urbanPerSqrt;

export function infrastructureLayers(data, state, common) {
  const open = data.infrastructure.features.filter((f) => f.properties.year_open <= state.year);

  return [
    new ScatterplotLayer({
      id: 'L6-offices',
      data: officesOpen(data, state.year),
      getPosition: (d) => [d.lon, d.lat],
      getFillColor: COLORS.postOffice,
      getRadius: SETTLE.officeRadius,
      radiusUnits: 'pixels',
      pickable: true,
      ...common,
    }),
    new ScatterplotLayer({
      id: 'L6-urban',
      data: urbanOpen(data, state.year),
      getPosition: (d) => [d.lon, d.lat],
      getFillColor: COLORS.urban,
      getLineColor: [255, 255, 255, 230],
      getRadius: urbanRadius,
      radiusUnits: 'pixels',
      stroked: true,
      getLineWidth: 1,
      lineWidthUnits: 'pixels',
      pickable: true,
      ...common,
    }),
    new GeoJsonLayer({
      id: 'L6-infrastructure',
      data: open,
      getLineColor: (f) => COLORS[f.properties.kind],
      getLineWidth: 2,
      lineWidthUnits: 'pixels',
      pickable: true,
      ...common,
    }),
  ];
}

const KIND = { rail: 'Railroad', canal: 'Canal', road: 'Road', route: 'Route' };

export function infrastructureTooltip(layerId, object, state) {
  if (layerId === 'L6-offices') {
    const d = object;
    const closed = d.year_discontinued ? `–${d.year_discontinued}` : '';
    return `<strong>${d.name}, ${d.state}</strong><br>Post office, ${d.year_established}${closed}`;
  }
  if (layerId === 'L6-urban') {
    const d = object;
    const carried = d.census < state.year ? '<br>Not in Gibson\'s 1840 top 100 (≥ 4,226); kept as urban' : '';
    const flag = d.unverified ? '<br><em>location unverified</em>' : '';
    return `<strong>${d.name}, ${d.state}</strong><br>${d.popShown.toLocaleString()} people, census of ${d.census}` +
      `${carried}${flag}`;
  }
  if (layerId === 'L6-infrastructure') {
    const p = object.properties;
    return `<strong>${p.name}</strong><br>${KIND[p.kind] ?? p.kind}, open ${p.year_open}`;
  }
  return null;
}
