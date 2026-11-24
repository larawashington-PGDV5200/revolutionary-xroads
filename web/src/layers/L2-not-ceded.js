import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { COLORS } from '../config.js';

// C5 (T-019): a Royce polygon is held until its cession year. A null cession_year means no later cession
// in the USFS data (never ceded, so never in L5). A removal destination is hidden before its assigned_year
// (the older polygons under it show), then drawn as held.
export const isHeld = (p, year) =>
  (p.cession_year == null || p.cession_year > year) && (p.assigned_year == null || p.assigned_year <= year);

// Tooltip lines shared by L2 and L5 for a Royce polygon.
export function royceLines(p) {
  const lines = [];
  if (p.assigned_year != null) {
    lines.push(`Assigned to ${p.nation_assigned} (removal destination), ${p.assigned_treaty}, ${p.assigned_date ?? p.assigned_year}`);
    if (p.assigned_verified !== 'y') lines.push('<em>date unverified</em>');
  } else if (p.is_destination) {
    lines.push(`Removal destination for ${p.nation_assigned}; date not found`);
  }
  lines.push(p.cession_year == null
    ? 'No cession to the United States in the USFS data'
    : `Ceded to the United States: ${p.cession_date}`);
  lines.push(`Royce area ${p.cessnum}`);
  return lines;
}

export function notCededLayers(data, state, common) {
  const unceded = data.royce.features.filter((f) => isHeld(f.properties, state.year));
  const nyPoints = data.stateCessions.features.filter((f) => f.properties.year <= state.year);

  return [
    new GeoJsonLayer({
      id: 'L2-unceded',
      data: unceded,
      filled: true,
      stroked: true,
      getFillColor: COLORS.held,
      getLineColor: COLORS.heldLine,
      getLineWidth: 0.5,
      lineWidthUnits: 'pixels',
      pickable: true,
      ...common,
    }),
    new ScatterplotLayer({
      id: 'L2-ny-cessions',
      data: nyPoints,
      getPosition: (f) => f.geometry.coordinates,
      getFillColor: COLORS.reserve,
      getRadius: 6,
      radiusUnits: 'pixels',
      pickable: true,
      ...common,
    }),
  ];
}

export function notCededTooltip(layerId, object) {
  const p = object.properties ?? object;
  if (layerId === 'L2-unceded') {
    const head = p.assigned_year != null ? p.nation_assigned : p.nation_as_named;
    return `<strong>${head}</strong><br>${royceLines(p).join('<br>')}`;
  }
  if (layerId === 'L2-ny-cessions') {
    return `<strong>${p.name}</strong>, ${p.date_signed}<br>${p.native_parties} to ${p.colonial_or_us_party}` +
      '<br>State cession, not in Royce (point placed in the county)';
  }
  return null;
}
