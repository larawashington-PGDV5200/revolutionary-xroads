import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { COLORS } from '../config.js';

export function reservationLayers(data, state, common) {
  const ceded = data.royce.features.filter((f) => f.properties.cession_year <= state.year);
  const reserves = data.reservations.filter((r) =>
    r.start_year != null &&
    r.start_year <= state.year &&
    (r.end_year == null || r.end_year > state.year));
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
      visible: common.visible && showRemoval,
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
