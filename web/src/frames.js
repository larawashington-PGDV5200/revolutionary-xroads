// C2: plane outlines, plane numbers, dotted corner guides.
import { PathLayer, ScatterplotLayer, SolidPolygonLayer, TextLayer } from '@deck.gl/layers';
import { STACK, GAP_M, GUIDE_DOTS, COLORS } from './config.js';
import { stack, stackProps } from './stack.js';

const cornersOf = ([w, s, e, n]) => [[w, s], [e, s], [e, n], [w, n]];

// Invisible pickable fill of one plane, so hovering anywhere on it focuses that layer.
// Alpha 1/255: alpha 0 would not be picked.
export function planeFill(extent, index, common) {
  return new SolidPolygonLayer({
    id: `${STACK[index].id}-plane`,
    data: [{ plane: STACK[index].id, polygon: cornersOf(extent) }],
    getPolygon: (d) => d.polygon,
    getFillColor: [255, 255, 255, 1],
    pickable: true,
    ...common,
  });
}

export function frameLayers(extent, focus) {
  const corners = cornersOf(extent);
  const [w, s] = corners[0];
  const label = [w - (extent[2] - extent[0]) * 0.025, s];

  const frames = STACK.flatMap(({ id, index }) => [
    new PathLayer({
      id: `frame-${id}`,
      data: [{ path: [...corners, corners[0]] }],
      getPath: (d) => d.path,
      getColor: focus === id ? COLORS.frameFocus : COLORS.frame,
      getWidth: 1,
      widthUnits: 'pixels',
      updateTriggers: { getColor: focus },
      ...stackProps(index),
    }),
    new TextLayer({
      id: `frame-number-${id}`,
      data: [{ text: String(index + 1).padStart(2, '0'), position: label }],
      getPosition: (d) => d.position,
      getText: (d) => d.text,
      getSize: 12,
      getColor: focus === id ? COLORS.frameFocus : COLORS.frame,
      // Collapsed, the numbers 02–06 would sit on top of 01; they fade in as the stack opens.
      opacity: index === 0 ? 1 : Math.min(1, stack.t * 3),
      getTextAnchor: 'end',
      getAlignmentBaseline: 'center',
      fontFamily: 'system-ui, sans-serif',
      updateTriggers: { getColor: focus },
      ...stackProps(index),
    }),
  ]);

  // Fixed dot count per gap, so the dots spread as the stack explodes and close as it collapses.
  const gaps = STACK.length - 1;
  const dots = [];
  for (const [lon, lat] of corners) {
    for (let k = 0; k <= gaps * GUIDE_DOTS; k += 1) {
      dots.push([lon, lat, (k / GUIDE_DOTS) * GAP_M * stack.t]);
    }
  }
  const guides = new ScatterplotLayer({
    id: 'frame-guides',
    data: dots,
    getPosition: (d) => d,
    getFillColor: COLORS.guide,
    getRadius: 1.4,
    radiusUnits: 'pixels',
    billboard: true,
    visible: stack.t > 0.01,
    parameters: { depthCompare: 'always', depthWriteEnabled: false },
  });

  return [...frames, guides];
}
