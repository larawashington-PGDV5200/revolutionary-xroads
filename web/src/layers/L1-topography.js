// L1 Topography: relief, water, period borders.
// A deck.gl layer is a plain object of settings ("props"). You never draw anything yourself:
// you describe the layer, and deck.gl redraws whenever you hand it a new set of layers.
import { BitmapLayer, GeoJsonLayer } from '@deck.gl/layers';
import { COORDINATE_SYSTEM } from '@deck.gl/core';
import { COLORS } from '../config.js';
import { snapshotFor } from '../data.js';
import { ___ } from '../blank.js';

const RELIEF_READY = false;   // ✏️ flip to true once a2 is filled
const BORDERS_READY = false;  // ✏️ flip to true once a3 is filled

export function topographyLayers(data, state, common) {
  const layers = [];

  // ✏️ a2 Relief: a BitmapLayer stretches one image over a lon/lat rectangle.
  //   image:  the PNG's URL             → data.relief.image
  //   bounds: [west, south, east, north] → data.relief.bounds
  //   _imageCoordinateSystem: LNGLAT tells deck.gl the PNG is a plain lon/lat grid (it is, see
  //   relief_bounds.json). Without it the image is assumed to be Web Mercator and the
  //   north end drifts by ~30 km.
  if (RELIEF_READY) {
    layers.push(new BitmapLayer({
      id: 'L1-relief',
      image: ___,
      bounds: ___,
      _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      opacity: ___,        // 0–1; try 0.5 so lines on top stay readable
      ...common,
    }));
  }

  // Worked example (done for you): water. Read this one before a3.
  //   data:        a GeoJSON FeatureCollection (or an array of features)
  //   stroked / filled: draw outlines / fill polygons
  //   getLineColor: an "accessor". A constant here, but it can be a function of each feature,
  //                 f => ..., which deck.gl calls once per feature.
  //   lineWidthUnits: 'pixels' keeps lines the same on-screen width at every zoom.
  layers.push(
    new GeoJsonLayer({
      id: 'L1-lakes',
      data: data.lakes,
      stroked: false,
      filled: true,
      getFillColor: COLORS.water,
      ...common,
    }),
    new GeoJsonLayer({
      id: 'L1-rivers',
      data: data.rivers,
      getLineColor: COLORS.water,
      getLineWidth: (f) => (f.properties.scalerank <= 4 ? 1.2 : 0.6), // big rivers thicker
      lineWidthUnits: 'pixels',
      ...common,
    }),
    new GeoJsonLayer({
      id: 'L1-coast',
      data: data.coast,
      getLineColor: COLORS.water,
      getLineWidth: 1,
      lineWidthUnits: 'pixels',
      ...common,
    }),
  );

  // ✏️ a3 Borders for one year. Each feature has properties.years, the snapshots it belongs to.
  //   1. Pick the snapshot: snapshotFor(state.year) gives 1784, 1790 … 1840.
  //   2. Keep only features whose years include it: features.filter(f => f.properties.years.includes(snap))
  //   3. Draw states darker and thicker than counties (COLORS.state / COLORS.county).
  //   updateTriggers: deck.gl caches accessor results. When an accessor's answer depends on
  //   something outside the feature (like the year), list that value here so deck.gl recomputes.
  //   (Here the year changes `data` itself, which deck.gl notices on its own, so this is optional.)
  if (BORDERS_READY) {
    const snap = ___;
    const counties = ___;   // filtered data.counties.features
    const states = ___;     // filtered data.states.features
    layers.push(
      new GeoJsonLayer({
        id: 'L1-counties',
        data: counties,
        filled: false,
        getLineColor: ___,
        getLineWidth: ___,
        lineWidthUnits: 'pixels',
        pickable: true,     // lets hover/click find a county (see getTooltip in main.js)
        ...common,
      }),
      new GeoJsonLayer({
        id: 'L1-states',
        data: states,
        filled: false,
        getLineColor: ___,
        getLineWidth: ___,
        lineWidthUnits: 'pixels',
        ...common,
      }),
    );
  }

  return layers;
}
