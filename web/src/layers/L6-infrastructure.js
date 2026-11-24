import { GeoJsonLayer } from '@deck.gl/layers';
import { COLORS } from '../config.js';

export function infrastructureLayers(data, state, common) {
  const open = data.infrastructure.features.filter((f) => f.properties.year_open <= state.year);

  return [
    new GeoJsonLayer({
      id: 'L6-infrastructure',
      data: open,
      getLineColor: (f) => COLORS[f.properties.kind],
      getLineWidth: (f) => (f.properties.kind === 'steamboat' ? 1 : 2),
      lineWidthUnits: 'pixels',
      pickable: true,
      ...common,
    }),
  ];
}
