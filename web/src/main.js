import { Deck } from '@deck.gl/core';
import { INITIAL_VIEW, STACK, YEARS, STATE_NAMES } from './config.js';
import { loadAll, loadPerson } from './data.js';
import { stack, stackProps } from './stack.js';
import { planeFill, frameLayers } from './frames.js';
import { fade, focus, hoverFrom, stackIdOf } from './focus.js';
import { initUI } from './ui.js';
import { topographyLayers } from './layers/L1-topography.js';
import { notCededLayers, notCededTooltip } from './layers/L2-not-ceded.js';
import { adsLayers } from './layers/L3-ads.js';
import { migrationLayers, migrationAnimates, hubStats } from './layers/L4-migration.js';
import { reservationLayers, reservationTooltip } from './layers/L5-reservations.js';
import { infrastructureLayers, infrastructureTooltip } from './layers/L6-infrastructure.js';

const BUILDERS = {
  L1: topographyLayers,
  L2: notCededLayers,
  L3: adsLayers,
  L4: migrationLayers,
  L5: reservationLayers,
  L6: infrastructureLayers,
};

const state = {
  year: YEARS.start,
  person: null,
  minPeople: null, // C4: smallest flow drawn; null = the largest FLOW.top flows (T-019 #7)
  hoverHub: null, // C4: state under the pointer
  pinnedHub: null, // C4: state kept by a click, until Esc
  visible: Object.fromEntries(STACK.map((l) => [l.id, true])),
};

// T-018: open with the stack exploded, so the default view shows the planes apart.
stack.t = 1;

const hint = document.getElementById('hint');
hint.textContent = 'Loading data…';
hint.hidden = false;
const data = await loadAll();
hint.hidden = true;

// Drawn above every plane, so a hub can be hovered wherever the planes overlap on screen.
const ON_TOP = new Set(['L4-hubs', 'L4-labels']);

function buildLayers() {
  const fills = [];
  const planes = STACK.flatMap(({ id, index }) => {
    const common = { ...stackProps(index), visible: state.visible[id] };
    fills.push(planeFill(data.extent, index, common));
    const layers = BUILDERS[id](data, state, common);
    // C3: scale each layer's own opacity by its focus fade.
    return fade[id] === 1 ? layers : layers.map((l) => l.clone({ opacity: l.props.opacity * fade[id] }));
  });
  // Plane fills go first, so any feature (on any plane) wins the pick over an invisible fill.
  return [
    ...fills,
    ...planes.filter((l) => !ON_TOP.has(l.id)),
    ...frameLayers(data.extent, focus.id),
    ...planes.filter((l) => ON_TOP.has(l.id)),
  ];
}

const nameOf = (id) => STATE_NAMES[id] ?? id;
const n = (x) => x.toLocaleString();

// C4: hub tooltip for the decade shown.
function hubTooltip(id) {
  const s = hubStats(data, state.year, id);
  const list = (rows) => (rows.length ? rows.map(([p, k]) => `${nameOf(p)} ${n(k)}`).join(', ') : 'none');
  return `<strong>${nameOf(id)}</strong>, moves ${state.year}–${String(state.year + 9).slice(2)}<br>` +
    `People out: ${n(s.out)} · in: ${n(s.in)}<br>` +
    `To: ${list(s.topTo)}<br>From: ${list(s.topFrom)}`;
}

const TOOLTIP_STYLE = {
  background: 'rgba(255, 255, 255, 0.95)', color: '#222', border: '1px solid #ccc',
  font: '12px/1.45 system-ui, sans-serif', padding: '6px 8px', maxWidth: '280px',
};

const TOOLTIPS = { L2: notCededTooltip, L5: reservationTooltip, L6: infrastructureTooltip };

function getTooltip({ object, layer }) {
  if (!object || layer?.id.endsWith('-plane')) return null;
  if (layer.id === 'L4-hubs') return { html: hubTooltip(object.id), style: TOOLTIP_STYLE };
  if (layer.id === 'L4-flows') {
    return { text: `${nameOf(object.from)} → ${nameOf(object.to)}, ${state.year}s: ${n(object.people)} people`, style: TOOLTIP_STYLE };
  }
  // C5/C6 (T-019): Native and settlement layers write their own tooltips.
  const html = TOOLTIPS[stackIdOf(layer.id)]?.(layer.id, object, state);
  if (html) return { html, style: TOOLTIP_STYLE };
  const p = object.properties ?? object;
  const text = p.name ?? p.nation_as_named ?? p.kind ?? null;
  return text && { text, style: TOOLTIP_STYLE };
}

function render() {
  deck.setProps({ layers: buildLayers() });
}

// C4 + step 9: hover sets the layer focus and the isolated hub; no object clears both.
function onHover({ layer, object }) {
  hoverFrom('map', object ? stackIdOf(layer?.id) : null, render);
  const hub = object && layer?.id === 'L4-hubs' ? object.id : null;
  if (hub !== state.hoverHub) {
    state.hoverHub = hub;
    render();
  }
}

// C4: a click on a hub keeps its flows isolated (a second click on it lets go); Esc clears.
function onClick({ layer, object }) {
  if (layer?.id !== 'L4-hubs' || !object) return;
  state.pinnedHub = state.pinnedHub === object.id ? null : object.id;
  render();
}

const deck = new Deck({
  parent: document.getElementById('map'),
  initialViewState: INITIAL_VIEW,
  // C1: left-drag turns (horizontal = bearing) and tilts (vertical = pitch); right- or shift-drag pans.
  controller: { dragMode: 'rotate' },
  getTooltip,
  onHover,
  onClick,
  layers: buildLayers(),
});

// Step 9: leaving the canvas (e.g. onto the panel) clears the map hover, so focus doesn't stick.
document.getElementById('map').addEventListener('pointerleave', () => onHover({}));
window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || !state.pinnedHub) return;
  state.pinnedHub = null;
  render();
});

// C4: the drifting dots need a frame-by-frame redraw while the migration layer is on.
const animate = () => {
  if (migrationAnimates(state)) render();
  requestAnimationFrame(animate);
};
requestAnimationFrame(animate);

initUI(state, data, render);

state.person = await loadPerson(data, 'RI', '111524877');
render();
