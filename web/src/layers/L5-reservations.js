// L5 Cessions and reservations: the countermovement. Same Royce polygons as L2, read the other
// way (ceded by the slider year), plus reserves that exist in that year, plus removal routes.
import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { COLORS } from '../config.js';
import { ___ } from '../blank.js';

const READY = true; // ✏️ flip once c5–c7 are filled

export function reservationLayers(data, state, common) {
  if (!READY) return [];

  // ✏️ c5 Ceded by year Y: Royce features with cession_year <= state.year.
  const ceded = data.royce.features.filter((f) => f.properties.cession_year <= state.year);

  // ✏️ c6 Reserves that exist in year Y: start_year <= Y, and end_year is null or > Y.
  //   Some have no start_year (start_flag says why): decide whether to hide them or show them always.
  const reserves = data.reservations.filter((r) =>
    r.start_year != null &&
    r.start_year <= state.year &&
    (r.end_year == null || r.end_year > state.year));

  // ✏️ c7 Removal routes are UNDATED in the NPS source (year: null). Pick a rule, e.g. show only
  //   from 1830 on (Indian Removal Act), and say it on the page. A historian check before it ships.
  const showRemoval = state.year >= 1830;

  return [
    new GeoJsonLayer({
      id: 'L5-ceded',
      data: ceded,
      filled: true,
      stroked: false,
      getFillColor: COLORS.cededFill,
      pickable: true,
      ...common,
    }),
    new GeoJsonLayer({
      id: 'L5-removal',
      data: data.removal,
      getLineColor: COLORS.removal,
      getLineWidth: 1.5,
      lineWidthUnits: 'pixels',
      ...common,
      // After ...common, so it wins. `visible` hides a layer without deck.gl rebuilding it.
      visible: common.visible && Boolean(showRemoval),
    }),
    new ScatterplotLayer({
      id: 'L5-reserves',
      data: reserves,
      getPosition: (d) => [d.lon, d.lat],
      getFillColor: COLORS.reservation,
      getRadius: 5,
      radiusUnits: 'pixels',
      pickable: true,
      ...common,
    }),
  ];
}
