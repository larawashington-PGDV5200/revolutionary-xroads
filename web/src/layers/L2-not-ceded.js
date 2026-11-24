import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { COLORS } from '../config.js';

export function notCededLayers(data, state, common) {
  const unceded = data.royce.features.filter((f) => f.properties.cession_year > state.year);
  const nyPoints = data.stateCessions.features.filter((f) => f.properties.year <= state.year);

  return [
    new GeoJsonLayer({
      id: 'L2-unceded',
      data: unceded,
      filled: true,
      stroked: true,
      getFillColor: COLORS.uncededFill,
      getLineColor: COLORS.uncededLine,
      getLineWidth: 0.5,
      lineWidthUnits: 'pixels',
      pickable: true,
      ...common,
    }),
    new ScatterplotLayer({
      id: 'L2-ny-cessions',
      data: nyPoints,
      getPosition: (f) => f.geometry.coordinates,
      getFillColor: COLORS.uncededLine,
      getRadius: 6,
      radiusUnits: 'pixels',
      pickable: true,
      ...common,
    }),
  ];
}
