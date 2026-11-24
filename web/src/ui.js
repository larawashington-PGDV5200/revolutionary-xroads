import { STACK, YEARS, COHORTS } from './config.js';
import { stack, animateStack } from './stack.js';
import { snapshotFor } from './data.js';

export function initUI(state, render) {
  const toggles = document.getElementById('toggles');
  for (const { id, label } of [...STACK].reverse()) {
    const row = document.createElement('label');
    row.innerHTML = `<input type="checkbox" checked> ${label}`;
    row.querySelector('input').addEventListener('change', (e) => {
      state.visible[id] = e.target.checked;
      render();
    });
    toggles.append(row);
  }

  const explode = document.getElementById('explode');
  explode.addEventListener('click', () => {
    const target = stack.t < 0.5 ? 1 : 0;
    explode.textContent = target ? 'Collapse' : 'Explode';
    animateStack(target, render);
  });

  const cohort = document.getElementById('cohort');
  cohort.innerHTML = COHORTS.map((c) => `<option>${c}</option>`).join('');
  cohort.addEventListener('change', (e) => {
    state.cohort = e.target.value;
    render();
  });

  const slider = document.getElementById('year');
  const label = document.getElementById('year-label');
  Object.assign(slider, { min: YEARS.min, max: YEARS.max, step: YEARS.step, value: YEARS.start });
  const show = () => { label.textContent = `${state.year} · borders as of ${snapshotFor(state.year)}`; };
  slider.addEventListener('input', (e) => {
    state.year = Number(e.target.value);
    show();
    render();
  });
  show();
}
