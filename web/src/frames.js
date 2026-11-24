// C2: plane outlines, plane names ("01 Topography", T-023), dotted corner guides.
import { PathLayer, ScatterplotLayer, SolidPolygonLayer, TextLayer } from '@deck.gl/layers';
import { STACK, GAP_M, GUIDE_DOTS, COLORS } from './config.js';
import { stack, stackProps, planeZ } from './stack.js';

const cornersOf = ([w, s, e, n]) => [[w, s], [e, s], [e, n], [w, n]];

// B-044: a plane name ends a fixed few pixels left of the plane's SW corner (right-aligned to it). Where the
// full name would run under the side panel or off the screen, only the number shows ("06"); if even that
// won't fit, the number sits just inside the corner; if the corner itself is hidden, no name.
const FONT = { size: 12, family: 'system-ui, sans-serif' };
const LABEL_GAP = 6; // px
const number = (index) => String(index + 1).padStart(2, '0');
const fullName = ({ label, index }) => `${number(index)} ${label}`;
let ctx;
const textWidth = (text) => {
  ctx ??= document.createElement('canvas').getContext('2d');
  ctx.font = `${FONT.size}px ${FONT.family}`;
  return ctx.measureText(text).width;
};

// One mode per plane: 'full', 'short', 'inside' or 'none'. viewport: the current WebMercatorViewport.
export function labelModes(extent, viewport) {
  const panel = document.getElementById('panel').getBoundingClientRect();
  const [w, s] = extent;
  return STACK.map((plane) => {
    const [x, y] = viewport.project([w, s, planeZ(plane.index)]);
    const left = y > panel.top - FONT.size && y < panel.bottom + FONT.size ? panel.right : 0;
    if (x - LABEL_GAP - textWidth(fullName(plane)) >= left) return 'full';
    if (x - LABEL_GAP - textWidth(number(plane.index)) >= left) return 'short';
    return x >= left ? 'inside' : 'none';
  });
}

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

export function frameLayers(extent, focus, modes) {
  const corners = cornersOf(extent);

  const frames = STACK.flatMap(({ id, label: name, index }) => [
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
      data: [{ text: modes[index] === 'full' ? fullName({ label: name, index }) : number(index), position: corners[0] }],
      getPosition: (d) => d.position,
      getText: (d) => d.text,
      getSize: FONT.size,
      getPixelOffset: [modes[index] === 'inside' ? LABEL_GAP : -LABEL_GAP, 0],
      getColor: focus === id ? COLORS.frameFocus : COLORS.frame,
      // Collapsed, the names 02–06 would sit on top of 01; they fade in as the stack opens.
      opacity: index === 0 ? 1 : Math.min(1, stack.t * 3),
      getTextAnchor: modes[index] === 'inside' ? 'start' : 'end',
      visible: modes[index] !== 'none',
      getAlignmentBaseline: 'center',
      fontFamily: FONT.family,
      updateTriggers: { getColor: focus, getPixelOffset: modes[index], getTextAnchor: modes[index] },
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
