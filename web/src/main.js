import { Deck } from '@deck.gl/core';
import { INITIAL_VIEW, STACK, YEARS } from './config.js';
import { loadAll, loadPerson } from './data.js';
import { stackProps } from './stack.js';
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
  person: null,
  visible: Object.fromEntries(STACK.map((l) => [l.id, true])),
};

const hint = document.getElementById('hint');
hint.textContent = 'Loading data…';
hint.hidden = false;
const data = await loadAll();
hint.hidden = true;

function buildLayers() {
  return STACK.flatMap(({ id, index }) => {
    const common = { ...stackProps(index), visible: state.visible[id] };
    return BUILDERS[id](data, state, common);
  });
}

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
  controller: { dragMode: 'rotate' },
  getTooltip,
  layers: buildLayers(),
});

function render() {
  deck.setProps({ layers: buildLayers() });
}

initUI(state, render);

state.person = await loadPerson(data, 'RI', '111524877');
render();
