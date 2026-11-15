import { LOCATIONS, loadClimate } from './nasa.js';
import { scoreRotations, climateSummary, recommendationText } from './engine.js';
import { climateCard, rotationCard, badge, comparisonTable } from './components.js';
import { provenance, wireDownload } from './dataPanel.js';
import { createHero } from './hero.js';
import { speak } from './voice.js';
import { t } from './i18n.js';

const app = document.querySelector('#app');
let state = { location: LOCATIONS.agra, climate: null, priorities: {}, rotations: [], previousRanks: {} };
const ranks = rotations => Object.fromEntries(rotations.map((r, i) => [r.id, i]));
function hero() {
  app.replaceChildren(createHero(load, state.climate));
}
function nav() {
  return `<header><a class="wordmark" href="#advisor">Blaze Field Advisor</a><nav aria-label="मुख्य नेविगेशन"><a href="#advisor">${t.advisor}</a><a href="#methods">${t.methods}</a><a href="#data">${t.data}</a><a href="https://github.com/spartanfromk-18/Blaze-NSA" target="_blank" rel="noreferrer">GitHub</a><a class="demo-link" href="#advisor">डेमो चलाएँ</a></nav><label class="location-label">क्षेत्र <select id="location">${Object.values(LOCATIONS).map(l => `<option value="${l.id}" ${l.id === state.location.id ? 'selected' : ''}>${l.name} · ${l.englishName}</option>`).join('')}</select></label></header>`;
}
function render() {
  if (!state.climate) return hero();
  const summary = climateSummary(state.climate);
  app.innerHTML = `<main class="shell" id="advisor">${nav()}${state.climate.source === 'Sample' ? `<div class="notice">⚠️ ${t.offline} ${badge('Sample')}</div>` : ''}${climateCard(state.climate, summary)}${provenance(state.climate)}
  <section class="card priorities"><h2>आपकी प्राथमिकता</h2><div class="toggles">${[['water',t.saveWater],['soil',t.improveSoil],['income',t.income]].map(([key,label]) => `<button class="toggle" type="button" aria-pressed="${!!state.priorities[key]}" data-priority="${key}">${label}</button>`).join('')}</div><small>चयनित वज़न 1.5×; अन्य वज़न 1×। यह ML नहीं है। ${badge('Sample')}</small></section>
  <section><h2>${t.recommendation}</h2><p class="muted">नियम-आधारित तुलना · 0–100 स्कोर</p><div id="rotations">${state.rotations.map((r,i) => rotationCard(r,i,state.previousRanks)).join('')}</div>${comparisonTable(state.rotations)}</section>
  <section id="methods" class="card evidence"><h2>तरीका और सीमाएँ</h2><p>NASA POWER climatology के तापमान और वर्षा औसत से पानी, मिट्टी, जलवायु-फिट और प्राथमिकताओं का पारदर्शी स्कोर बनाया गया है।</p><details><summary>How these scores are computed</summary><p>Weights और crop water midpoints <a href="./src/rotations.js">rotations.js</a> में खुले हैं। Score खेत का आदेश नहीं है।</p></details><p><b>हमें यह नहीं पता:</b> आपकी मिट्टी की जाँच, सिंचाई, बीज और स्थानीय बाज़ार।</p><p class="disclaimer"><b>यह सलाह है, आदेश नहीं — अपने कृषि विशेषज्ञ से ज़रूर पूछें।</b></p></section>
  <footer>सलाह, आदेश नहीं। NASA POWER attribution · MIT licence · डेटा विफल होने पर Sample fallback उपलब्ध है।</footer></main>`;
  wireDownload(state.climate);
  document.querySelector('#location')?.addEventListener('change', e => { state.location = LOCATIONS[e.target.value]; state.climate = null; load(); });
  document.querySelectorAll('[data-priority]').forEach(button => button.addEventListener('click', () => { state.previousRanks = ranks(state.rotations); state.priorities[button.dataset.priority] = !state.priorities[button.dataset.priority]; state.rotations = scoreRotations(state.climate, state.priorities); render(); }));
  document.querySelectorAll('.detail').forEach(button => button.addEventListener('click', () => showDetail(state.rotations.find(r => r.id === button.dataset.rotation))));
  document.querySelectorAll('.climate-chart [data-month]').forEach(point => point.addEventListener('focus', () => { const m = point.dataset.month; document.querySelector('.chart-tooltip').textContent = `${m}: ${state.climate.parameters.T2M[m]}°C · ${state.climate.parameters.PRECTOTCORR[m]} mm/day · ${state.climate.source}`; }));
}
function showDetail(rotation) {
  const detail = document.createElement('section'); detail.className = 'card evidence'; detail.id = 'detail';
  detail.innerHTML = `<h2>${rotation.name}</h2><p>${recommendationText(rotation, state.climate)}</p>${badge(state.climate.source)}<h3>स्कोर</h3>${Object.entries(rotation.scores).map(([key,value]) => `<p>${key}: ${value}/100 ${badge('Sample')}</p>`).join('')}<h3>सबूत</h3><ul>${rotation.evidence.map(x => `<li>${x}</li>`).join('')}</ul><p class="disclaimer">यह सलाह है, आदेश नहीं — अपने कृषि विशेषज्ञ से ज़रूर पूछें।</p><button id="speak" class="primary">${t.listen}</button><p id="voice-status" class="muted"></p>`;
  document.querySelector('#methods').before(detail); document.querySelector('#speak').onclick = () => speak(recommendationText(rotation, state.climate), x => { document.querySelector('#voice-status').textContent = x || ''; }); detail.scrollIntoView({ behavior: 'smooth' });
}
async function load() {
  if (state.climate) { state.rotations = scoreRotations(state.climate, state.priorities); render(); return; }
  app.innerHTML = `<main class="shell"><div class="loading" role="status">${t.loading}</div></main>`;
  state.climate = await loadClimate(state.location);
  state.rotations = scoreRotations(state.climate, state.priorities);
  render();
}
async function boot() {
  app.innerHTML = `<main class="shell"><div class="loading" role="status">${t.loading}</div></main>`;
  state.climate = await loadClimate(state.location);
  hero();
}
boot();
