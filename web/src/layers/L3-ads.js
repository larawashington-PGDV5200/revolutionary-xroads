import { ScatterplotLayer } from '@deck.gl/layers';
import { COLORS } from '../config.js';

export function adsLayers(data, state, common) {
  const byPlace = new Map();
  for (const d of data.ads.filter((d) => d.decade <= state.year)) {
    const p = byPlace.get(d.place_id) ?? { ...d, n_ads: 0 };
    p.n_ads += d.n_ads;
    byPlace.set(d.place_id, p);
  }

  return [
    new ScatterplotLayer({
      id: 'L3-ads',
      data: [...byPlace.values()],
      getPosition: (d) => [d.lon, d.lat],
      getRadius: (d) => Math.sqrt(d.n_ads),
      radiusUnits: 'meters',
      radiusScale: 2000,
      getFillColor: COLORS.ads,
      stroked: true,
      getLineColor: [255, 255, 255],
      lineWidthMinPixels: 0.5,
      pickable: true,
      ...common,
    }),
  ];
}
