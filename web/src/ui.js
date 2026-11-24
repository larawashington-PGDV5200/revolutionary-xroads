import { STACK, YEARS, ACTS, FLOW, HUB_NEUTRAL, NATIVE, COLORS, SETTLE } from './config.js';
import { stack, animateStack } from './stack.js';
import { hoverFrom } from './focus.js';
import { snapshotFor } from './data.js';
import { topHubs, flowCounts } from './layers/L4-migration.js';
import { officesOpen, urbanOpen } from './layers/L6-infrastructure.js';

// Position on the slider track, 0–100 %.
const pct = (year) => ((year - YEARS.min) / (YEARS.max - YEARS.min)) * 100;

export function initUI(state, data, render, onStack) {
  const toggles = document.getElementById('toggles');
  for (const { id, label, index } of [...STACK].reverse()) {
    const row = document.createElement('label');
    row.innerHTML = `<input type="checkbox" checked> <span class="num">${String(index + 1).padStart(2, '0')}</span> ${label}`;
    row.querySelector('input').addEventListener('change', (e) => {
      state.visible[id] = e.target.checked;
      render();
    });
    row.addEventListener('mouseenter', () => hoverFrom('list', id, render));
    row.addEventListener('mouseleave', () => hoverFrom('list', null, render));
    toggles.append(row);
  }

  const explode = document.getElementById('explode');
  explode.textContent = stack.t < 0.5 ? 'Explode' : 'Collapse';
  explode.addEventListener('click', () => {
    const target = stack.t < 0.5 ? 1 : 0;
    explode.textContent = target ? 'Collapse' : 'Explode';
    animateStack(target, render);
    onStack(target); // T-023: the camera moves with the planes
  });

  const updateLegend = initLegend(state, data, render);
  const updateNative = initNativeLegend(state, data);
  const updateSettle = initSettleLegend(state, data);
  initTimeline(state, data, () => {
    updateLegend();
    updateNative();
    updateSettle();
    render();
  });
}

// C4: migration legend: hub colours, the taper, the threshold control.
function initLegend(state, data, render) {
  const box = document.createElement('fieldset');
  box.id = 'legend';
  const swatch = (hex, id) => `<span class="sw"><i style="background:${hex}"></i>${id}</span>`;
  box.innerHTML = `<legend>04 Migration</legend>
    <div class="hubs">${topHubs(data).map((h) => swatch(h.hex, h.id)).join('')}${swatch(HUB_NEUTRAL, 'other states')}</div>
    <p class="muted">Most people out, 1770–1840. A flow takes the colour of the state people left.</p>
    <p class="taper"><svg width="64" height="12" aria-hidden="true"><path d="M2 1 L62 5 L62 7 L2 11 Z" fill="#888"/></svg>
      wide end = leaving, thin end = arriving</p>
    <p class="muted">Width ∝ √people. Dots drift from origin to destination.</p>
    <label>Show <select id="min-people"><option value=""${state.minPeople == null ? ' selected' : ''}>the largest ${FLOW.top} flows</option>${
      FLOW.minOptions.map((v) => `<option value="${v}"${v === state.minPeople ? ' selected' : ''}>flows of ${v}+ people</option>`).join('')}</select></label>
    <p class="muted" id="flow-note"></p>
    <p class="muted">Hover a state to see only its moves; click to keep them, Esc to clear.</p>`;
  document.getElementById('panel').append(box);

  const note = box.querySelector('#flow-note');
  const update = () => {
    const { shown, total, largest } = flowCounts(data, state);
    note.textContent = shown
      ? `${shown} of ${total} state-to-state flows in the ${state.year}s.`
      : `No flow of ${state.minPeople}+ people in the ${state.year}s (largest: ${largest}). Lower the threshold to see them.`;
  };
  box.querySelector('#min-people').addEventListener('change', (e) => {
    state.minPeople = e.target.value === '' ? null : Number(e.target.value);
    update();
    render();
  });
  update();
  return update;
}

const css = (rgba) => `rgba(${rgba.slice(0, 3).join(',')},${(rgba[3] ?? 255) / 255})`;

// C5 (T-019): Native layers 02 and 05, one madder family, and the "before 1784" note (R10 §3).
function initNativeLegend(state, data) {
  const box = document.createElement('fieldset');
  box.className = 'legend';
  const zone = data.before1784.length > 0;
  // T-022 page_note (one per piece, the same text): what the zone still leaves out.
  const extra = zone ? [...new Set(data.before1784Props.map((p) => p.page_note).filter(Boolean))] : [];
  // With the zone drawn, its note is in each piece's tooltip; without it, only the page note shows.
  const levels = zone
    ? Object.entries(NATIVE.taken).map(([k, v]) => `<span class="sw"><i style="background:${css([...COLORS.taken.slice(0, 3), v.alpha])}"></i>${k}</span>`).join('')
    : '';
  // T-023: layer 2 title follows the slider (reverses the D-028 title "Native land not yet ceded").
  box.innerHTML = `<legend>02 · 05 Native land</legend>
    <p><strong id="l2-title"></strong></p>
    <p class="muted">${NATIVE.l2Subtitle}</p>
    <div class="keys">
      <span class="sw"><i style="background:${css(COLORS.held)}"></i>not yet ceded</span>
      <span class="sw"><i class="outline" style="border-color:${css(COLORS.cededLine)}"></i>ceded (outline)</span>
      <span class="sw"><i class="dot" style="background:${css(COLORS.reserve)}"></i>reserve</span>
      <span class="sw"><i class="line" style="background:${css(COLORS.removal)}"></i>removal route</span>
    </div>
    <p class="muted">Removal destinations show from the year a treaty assigned them.</p>
    ${zone ? `<p class="muted">Taken before 1784; the tint fades where the line is less certain:</p><div class="keys three">${levels}</div>` : ''}
    ${data.before1784Open.length ? `<p class="muted"><i class="dash" style="border-color:${css(COLORS.taken)}"></i>left open: taken after 1784 by state treaties or never ceded; see note</p>` : ''}
    ${(zone ? [...NATIVE.pageNote, ...extra] : [NATIVE.pageNoteNoZone, NATIVE.pageNote[1]]).map((t) => `<p class="muted">${t}</p>`).join('')}`;
  document.getElementById('panel').append(box);
  const title = box.querySelector('#l2-title');
  const update = () => {
    title.textContent = NATIVE.l2Title(state.year);
  };
  update();
  return update;
}

// C6 (T-019): settlement dots for the decade shown.
function initSettleLegend(state, data) {
  const box = document.createElement('fieldset');
  box.className = 'legend';
  const r = (pop) => 2 * (SETTLE.urbanMin + Math.sqrt(pop) * SETTLE.urbanPerSqrt);
  box.innerHTML = `<legend>06 Settlement and routes</legend>
    <div class="keys">
      <span class="sw"><i class="dot" style="width:3px;height:3px;background:${css(COLORS.postOffice)}"></i>post office</span>
      <span class="sw"><i class="dot" style="width:${r(10000)}px;height:${r(10000)}px;background:${css(COLORS.urban)}"></i>town ≥ 2,500 (10k)</span>
      <span class="sw"><i class="line" style="background:${css(COLORS.rail)}"></i>railroad</span>
      <span class="sw"><i class="line" style="background:${css(COLORS.canal)}"></i>canal</span>
      <span class="sw"><i class="line" style="background:${css(COLORS.road)}"></i>road</span>
    </div>
    <p class="muted" id="settle-note"></p>`;
  document.getElementById('panel').append(box);
  const note = box.querySelector('#settle-note');
  const update = () => {
    const offices = officesOpen(data, state.year).length;
    const urban = urbanOpen(data, state.year).length;
    note.textContent = `${state.year}: ${offices.toLocaleString()} post offices open, ${urban} urban places` +
      (urban ? ' (circles sized by census population).' : ' (first census 1790).');
  };
  update();
  return update;
}

// C7: one decade slider for every layer, Pension Act ticks, migration legs per decade above.
function initTimeline(state, data, render) {
  const decades = [];
  for (let y = YEARS.min; y <= YEARS.max; y += YEARS.step) decades.push(y);
  const max = Math.max(...data.legsByDecade.values());

  const strip = document.getElementById('strip');
  strip.innerHTML = decades.map((d) => {
    const n = data.legsByDecade.get(d) ?? 0;
    return `<div class="bar" data-decade="${d}" style="left:${pct(d)}%;height:${(n / max) * 100}%"
      title="${d}s: ${n.toLocaleString()} legs"></div>`;
  }).join('');

  document.getElementById('ticks').innerHTML =
    decades.map((d) => `<span class="tick" style="left:${pct(d)}%">${d}</span>`).join('');
  // Acts two years apart (1818/1820, 1836/1838) alternate rows so their labels don't collide.
  document.getElementById('acts').innerHTML = ACTS.map((a, i) =>
    `<span class="act${i % 2 ? ' low' : ''}" style="left:${pct(a)}%">${a} Act</span>`).join('');

  document.getElementById('strip-note').textContent =
    `Migration legs per decade (state level). ${data.undatedLegs.toLocaleString()} legs with no year are not shown. ` +
    `Marks on the track are the Pension Acts.`;

  const slider = document.getElementById('year');
  const label = document.getElementById('year-label');
  Object.assign(slider, { min: YEARS.min, max: YEARS.max, step: YEARS.step, value: YEARS.start });
  const show = () => {
    const n = data.legsByDecade.get(state.year) ?? 0;
    label.textContent = `${state.year} · moves ${state.year}–${String(state.year + 9).slice(2)}: ` +
      `${n.toLocaleString()} · borders as of ${snapshotFor(state.year)}`;
    for (const bar of strip.children) bar.classList.toggle('on', Number(bar.dataset.decade) === state.year);
  };
  slider.addEventListener('input', (e) => {
    state.year = Number(e.target.value);
    show();
    render();
  });
  show();
}
