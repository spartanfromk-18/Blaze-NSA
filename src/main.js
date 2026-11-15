import { LOCATIONS, loadClimate } from './nasa.js';
import { scoreRotations } from './engine.js';
import { climateSummary, recommendationText } from './engine.js';
import { climateCard, rotationCard, badge } from './components.js';
import { speak } from './voice.js';
import { t } from './i18n.js';

const app = document.querySelector('#app');
let state = { location: LOCATIONS.agra, climate: null, priorities: {}, rotations: [] };
const render = () => {
  if (!state.climate) { app.innerHTML = `<main class="shell"><div class="hero"><p class="eyebrow">🌾 NASA Space Apps</p><h1>${t.app}</h1><p>${t.tagline}<br><span>Your soil, sky data, better choices.</span></p><button id="start" class="primary">${t.start} / Start</button><p class="muted">NASA data · Hindi voice</p></div></main>`; document.querySelector('#start').onclick = load; return; }
  const summary = climateSummary(state.climate), top = state.rotations[0];
  app.innerHTML = `<main class="shell"><header><h1>🌾 ${t.app}</h1><nav><a href="#methods">तरीका</a> <select id="location">${Object.values(LOCATIONS).map(l=>`<option value="${l.id}" ${l.id===state.location.id?'selected':''}>${l.name} · ${l.englishName}</option>`).join('')}</select></nav></header>
  ${state.climate.source === 'Sample' ? `<div class="notice">⚠️ ${t.offline} ${badge('Sample')}</div>` : ''}
  ${climateCard(state.climate, summary)}
  <section class="card priorities"><h2>आपकी प्राथमिकता</h2><div class="toggles">${[['water',t.saveWater],['soil',t.improveSoil],['income',t.income]].map(([k,v])=>`<label><input type="checkbox" data-priority="${k}" ${state.priorities[k]?'checked':''}> ${v}</label>`).join('')}</div><small>चयनित वज़न: पानी ×${state.priorities.water?1.5:1}, मिट्टी ×${state.priorities.soil?1.5:1}, आय ×${state.priorities.income?1.5:1}. यह ML नहीं है।</small></section>
  <section><h2>${t.recommendation}</h2><p class="muted">नियम-आधारित तुलना · 0–100 स्कोर</p><div id="rotations">${state.rotations.map(rotationCard).join('')}</div></section>
  <section id="detail" class="card evidence"><h2>तरीका और सीमाएँ</h2><p>NASA POWER climatology के तापमान और वर्षा औसत से पानी, मिट्टी, जलवायु-फिट और आपकी प्राथमिकताओं का पारदर्शी स्कोर बनाया गया है।</p><p><b>हमें यह नहीं पता:</b> आपकी मिट्टी की जाँच, सिंचाई, बीज और स्थानीय बाज़ार।</p><p class="disclaimer"><b>यह सलाह है, आदेश नहीं — अपने कृषि विशेषज्ञ से ज़रूर पूछें।</b></p></section><section id="methods" class="card evidence"><h2>Methods / तरीका</h2><p>यह नियम-आधारित तुलना है, ML नहीं। अंतिम उपयोग से पहले agronomist / स्थानीय कृषि विशेषज्ञ की समीक्षा ज़रूरी है।</p><p>GPM IMERG, SMAP, MODIS/Landsat NDVI और GRACE इस संस्करण में live उपयोग नहीं किए गए; ये अगले चरण के स्रोत हैं।</p></section></main>`;
  document.querySelector('#location').onchange = e => { state.location = LOCATIONS[e.target.value]; load(); };
  document.querySelectorAll('[data-priority]').forEach(x => x.onchange = () => { state.priorities[x.dataset.priority]=x.checked; state.rotations=scoreRotations(state.climate,state.priorities); render(); });
  document.querySelectorAll('.detail').forEach(b => b.onclick = () => showDetail(state.rotations.find(r=>r.id===b.dataset.rotation)));
};
function showDetail(r) { const d=document.querySelector('#detail'); const text=recommendationText(r,state.climate); const list=a=>`<ul>${a.map(x=>`<li>${x}</li>`).join('')}</ul>`; d.innerHTML=`<h2>${r.name}</h2><p>${text}</p>${badge(state.climate.source)}<h3>स्कोर</h3>${Object.entries(r.scores).map(([k,v])=>`<p>${k}: ${v}/100 ${badge('Sample')}</p>`).join('')}<h3>सबूत</h3>${list(r.evidence)}<h3>हमें यह नहीं पता</h3>${list(r.gaps)}<h3>सावधानी / risks</h3>${list(r.risks)}<p class="disclaimer">यह सलाह है, आदेश नहीं — अपने कृषि विशेषज्ञ से ज़रूर पूछें।</p><button id="speak" class="primary">${t.listen}</button><p id="voice-status" class="muted">${text}</p>`; document.querySelector('#speak').onclick=()=>speak(text,x=>document.querySelector('#voice-status').textContent=x||text); d.scrollIntoView({behavior:'smooth'}); }
async function load() { app.innerHTML=`<main class="shell"><div class="loading">${t.loading}</div></main>`; state.climate=await loadClimate(state.location); state.rotations=scoreRotations(state.climate,state.priorities); render(); }
render();
