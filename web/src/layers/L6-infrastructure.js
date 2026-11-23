// L6 Infrastructure: roads, canals, railroads, steamboat rivers, named routes, by opening year.
import { GeoJsonLayer } from '@deck.gl/layers';
import { COLORS } from '../config.js';
import { ___ } from '../blank.js';

const READY = false; // ✏️ flip once c8–c9 are filled

export function infrastructureLayers(data, state, common) {
  if (!READY) return [];

  // ✏️ c8 Open by year Y: features with properties.year_open <= state.year.
  const open = ___;

  return [
    new GeoJsonLayer({
      id: 'L6-infrastructure',
      data: open,
      // ✏️ c9 Colour by kind. An accessor function gets each feature:
      //   f => COLORS[f.properties.kind]   (road, canal, rail, steamboat, route)
      getLineColor: ___,
      getLineWidth: (f) => (f.properties.kind === 'steamboat' ? 1 : 2),
      lineWidthUnits: 'pixels',
      pickable: true,
      ...common,
    }),
  ];
}
