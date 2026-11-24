import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { FillStyleExtension } from '@deck.gl/extensions';
import { COLORS, NATIVE } from '../config.js';
import { royceLines } from './L2-not-ceded.js';

const hatch = new FillStyleExtension({ proceduralPattern: true });
const TAKEN_PATTERNS = Object.fromEntries(Object.entries(NATIVE.taken).map(([k, v]) => [k, v.pattern]));
// Unknown or missing uncertainty is drawn as the least certain.
const takenLevel = (f) => (NATIVE.taken[f.properties.uncertainty] ? f.properties.uncertainty : 'high');

export function reservationLayers(data, state, common) {
  // C5 (T-019): a null cession_year is "never ceded", so it never shows here.
  const ceded = data.royce.features.filter((f) =>
    f.properties.cession_year != null && f.properties.cession_year <= state.year);
  const reserves = data.reservations.filter((r) =>
    r.start_year != null &&
    r.start_year <= state.year &&
    (r.end_year == null || r.end_year > state.year));
  const showRemoval = state.year >= 1830;

  return [
    // "Taken before 1784": hatched, sparser and fainter where the bounding line is less certain (T-022).
    new GeoJsonLayer({
      id: 'L5-before1784',
      data: data.before1784,
      filled: true,
      stroked: false,
      getFillColor: (f) => [...COLORS.taken.slice(0, 3), NATIVE.taken[takenLevel(f)].alpha],
      extensions: [hatch],
      fillPatternMapping: TAKEN_PATTERNS,
      fillPatternSizeUnits: 'pixels',
      getFillPattern: takenLevel,
      pickable: true,
      ...common,
    }),
    // Ceded: the held madder, hatched, with a faint outline; no grey (D-028).
    new GeoJsonLayer({
      id: 'L5-ceded',
      data: ceded,
      filled: true,
      stroked: true,
      getFillColor: COLORS.ceded,
      getLineColor: COLORS.cededLine,
      getLineWidth: 0.5,
      lineWidthUnits: 'pixels',
      extensions: [hatch],
      fillPatternMapping: { ceded: NATIVE.cededHatch },
      fillPatternSizeUnits: 'pixels',
      getFillPattern: () => 'ceded',
      pickable: true,
      ...common,
    }),
    new GeoJsonLayer({
      id: 'L5-removal',
      data: data.removal,
      getLineColor: COLORS.removal,
      getLineWidth: 2,
      lineWidthUnits: 'pixels',
      pickable: true,
      ...common,
      visible: common.visible && showRemoval,
    }),
    new ScatterplotLayer({
      id: 'L5-reserves',
      data: reserves,
      getPosition: (d) => [d.lon, d.lat],
      getFillColor: COLORS.reserve,
      getLineColor: [255, 255, 255, 220],
      getRadius: 4.5,
      radiusUnits: 'pixels',
      stroked: true,
      getLineWidth: 1,
      lineWidthUnits: 'pixels',
      pickable: true,
      ...common,
    }),
  ];
}

export function reservationTooltip(layerId, object) {
  const p = object.properties ?? object;
  if (layerId === 'L5-ceded') {
    const head = p.assigned_year != null ? p.nation_assigned : p.nation_as_named;
    return `<strong>${head}</strong><br>${royceLines(p).join('<br>')}`;
  }
  if (layerId === 'L5-before1784') {
    const lines = [`<strong>${p.label}</strong>`];
    if (p.note) lines.push(p.note);
    if (p.uncertainty) lines.push(`Line position: ${p.uncertainty} uncertainty`);
    return lines.join('<br>');
  }
  if (layerId === 'L5-removal') {
    const route = p.TRALTNAME ? `<br>${p.TRALTNAME.replaceAll('|', ', ')}` : '';
    return `<strong>Trail of Tears</strong>: Cherokee removal, 1838–39${route}<br>NPS National Historic Trail`;
  }
  if (layerId === 'L5-reserves') {
    const ended = p.date_ended ? `ended ${p.date_ended}` : 'continuing';
    return `<strong>${p.name}</strong><br>${p.nation_as_in_source}<br>Established ${p.date_established}; ${ended}`;
  }
  return null;
}
