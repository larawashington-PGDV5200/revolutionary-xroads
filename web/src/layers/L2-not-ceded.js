// L2 Land not yet ceded to the US (Royce 1899), as of the slider year.
// Page text and caveats: docs/PLAN.md §2. Empty areas stay empty; the note says why.
import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { COLORS } from '../config.js';
import { ___ } from '../blank.js';

const READY = true; // ✏️ flip once c1–c2 are filled

export function notCededLayers(data, state, common) {
  if (!READY) return [];

  // ✏️ c1 "Not yet ceded in year Y" = the cession happened AFTER Y.
  //   Keep Royce features where f.properties.cession_year > state.year.
  //   (Some areas were ceded in several steps; cession_year is the first date. See cession_dates.)
  const unceded = data.royce.features.filter((f) => f.properties.cession_year > state.year);

  // ✏️ c2 NY state cessions (not in Royce) as dated points: show those with year <= state.year.
  //   They're GeoJSON Point features, so getPosition reads f.geometry.coordinates.
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
