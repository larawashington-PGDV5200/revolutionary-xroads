// L3 Land ads (MVP, D-018): a circle at each place the ads name, sized by number of ads.
import { ScatterplotLayer } from '@deck.gl/layers';
import { COLORS } from '../config.js';
import { ___ } from '../blank.js';

const READY = true; // ✏️ flip once c3–c4 are filled

export function adsLayers(data, state, common) {
  if (!READY) return [];

  // ✏️ c3 data.ads has one row per place × decade (1770–1810). Choose what the slider means:
  //   - this decade only:    d.decade === state.year
  //   - everything so far:   d.decade <= state.year (circles pile up; sum n_ads per place first)
  //   Write down which one you chose; it's a decision for log/DECISIONS.md.
  const byPlace = new Map();
  for (const d of data.ads.filter((d) => d.decade <= state.year)) {
    const p = byPlace.get(d.place_id) ?? { ...d, n_ads: 0 };
    p.n_ads += d.n_ads;
    byPlace.set(d.place_id, p);
  }
  const rows = [...byPlace.values()];

  return [
    new ScatterplotLayer({
      id: 'L3-ads',
      data: rows,
      getPosition: (d) => [d.lon, d.lat],
      // ✏️ c4 Circle AREA should be proportional to the count, so the radius ∝ √n_ads.
      //   radiusUnits 'meters' grows the circles with zoom; radiusScale multiplies every radius.
      getRadius: (d) => Math.sqrt(d.n_ads),
      radiusUnits: 'meters',
      radiusScale: 2000,      // try 2000, then tune by eye
      getFillColor: COLORS.ads,
      stroked: true,
      getLineColor: [255, 255, 255],
      lineWidthMinPixels: 0.5,
      pickable: true,
      ...common,
    }),
  ];
}
