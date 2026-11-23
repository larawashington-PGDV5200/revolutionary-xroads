// Entry point. The pattern deck.gl uses (and this file follows):
//   1. keep all app state in one object (`state`)
//   2. a function turns state → a fresh list of layers (`buildLayers`)
//   3. whenever state changes, hand deck.gl the new list (`render`)
// Building new layer objects every time is cheap: deck.gl compares props with the last
// frame and only re-uploads to the GPU what actually changed.
import { Deck } from '@deck.gl/core';
import { INITIAL_VIEW, STACK, YEARS } from './config.js';
import { loadAll, loadPerson } from './data.js';
import { stack, stackProps } from './stack.js';
import { initUI } from './ui.js';
import { topographyLayers } from './layers/L1-topography.js';
import { notCededLayers } from './layers/L2-not-ceded.js';
import { adsLayers } from './layers/L3-ads.js';
import { migrationLayers } from './layers/L4-migration.js';
import { reservationLayers } from './layers/L5-reservations.js';
import { infrastructureLayers } from './layers/L6-infrastructure.js';

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
  cohort: 'all',
  person: null,                                           // one veteran's path (L4)
  visible: Object.fromEntries(STACK.map((l) => [l.id, true])),
};

const hint = document.getElementById('hint');
const say = (msg) => { hint.textContent = msg; hint.hidden = !msg; };

// Stop early with a readable message while the camera blanks (a1) are empty.
if (Object.values(INITIAL_VIEW).some((v) => v === undefined)) {
  say('Fill the ✏️ a1 blanks in src/config.js (INITIAL_VIEW) to see the map.');
  throw new Error('INITIAL_VIEW has blanks');
}

say('Loading data…');
const data = await loadAll();
say('');

// Every layer of stack level L gets the same "common" props: its height and whether it's on.
function buildLayers() {
  return STACK.flatMap(({ id, index }) => {
    const common = { ...stackProps(index), visible: state.visible[id] };
    return BUILDERS[id](data, state, common);
  });
}

// Hover text. `object` is the picked data row (a GeoJSON feature, a CSV-like row, or a
// flowmap object with type 'flow' or 'location'). Only layers with pickable: true are picked.
function getTooltip({ object }) {
  if (!object) return null;
  if (object.type === 'flow') return `${object.origin.id} → ${object.dest.id}: ${object.count} people`;
  if (object.type === 'location') return object.id;
  const p = object.properties ?? object;
  return p.name ?? p.nation_as_named ?? p.kind ?? null;
}

const deck = new Deck({
  parent: document.getElementById('map'),
  initialViewState: INITIAL_VIEW,
  controller: true,       // drag = pan, ctrl/right-drag = rotate and tilt, scroll = zoom
  getTooltip,
  layers: buildLayers(),
});

export function render() {
  deck.setProps({ layers: buildLayers() });
}

initUI(state, render);

// Demo for step b3: one veteran with a long path (RI → CT → MA → CT → RI).
// Later you'll set state.person from a click instead.
state.person = await loadPerson(data, 'RI', '111524877');
render();

// Handy in the browser console while learning: type `rx.state`, `rx.data`, `rx.stack`.
window.rx = { state, data, stack, deck, render };
