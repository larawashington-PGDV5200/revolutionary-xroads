import { BitmapLayer, GeoJsonLayer } from '@deck.gl/layers';
import { COORDINATE_SYSTEM } from '@deck.gl/core';
import { COLORS } from '../config.js';
import { snapshotFor } from '../data.js';

export function topographyLayers(data, state, common) {
  const snap = snapshotFor(state.year);
  const counties = data.counties.features.filter((f) => f.properties.years.includes(snap));
  const states = data.states.features.filter((f) => f.properties.years.includes(snap));

  return [
    new BitmapLayer({
      id: 'L1-relief',
      image: data.relief.image,
      bounds: data.relief.bounds,
      _imageCoordinateSystem: COORDINATE_SYSTEM.LNGLAT,
      opacity: 0.5,
      ...common,
    }),
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
      getLineWidth: (f) => (f.properties.scalerank <= 4 ? 1.2 : 0.6),
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
    new GeoJsonLayer({
      id: 'L1-counties',
      data: counties,
      filled: false,
      getLineColor: COLORS.county,
      getLineWidth: 0.5,
      lineWidthUnits: 'pixels',
      pickable: true,
      ...common,
    }),
    new GeoJsonLayer({
      id: 'L1-states',
      data: states,
      filled: false,
      getLineColor: COLORS.state,
      getLineWidth: 1.5,
      lineWidthUnits: 'pixels',
      ...common,
    }),
  ];
}
