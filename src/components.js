import { t } from './i18n.js';
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function badge(source) { return `<span class="badge ${source === 'Sample' ? 'sample' : 'live'}">${esc(source)}</span>`; }
export function scoreBar(label, value) { return `<div class="score"><span>${label}</span><strong>${value}/100 ${badge('Sample')}</strong><div><i style="width:${value}%"></i></div></div>`; }
export function climateCard(climate, summary) {
  const bars = Object.entries(summary.monthlyRain).map(([m,v]) => `<div class="month"><span>${m}</span><i style="height:${Math.min(100,v*12)}%"></i><small>${v.toFixed(1)} mm/दिन ${badge(climate.source)}</small></div>`).join('');
  return `<section class="card climate"><h2>${t.climate}</h2><div class="climate-grid">
    <div><b>🌡️ ${summary.annualTemp.toFixed(1)}°C ${badge(climate.source)}</b><small>${t.annualTemp}</small></div>
    <div><b>🌧️ ${summary.annualRain.toFixed(1)} mm/दिन ${badge(climate.source)}</b><small>वार्षिक वर्षा औसत</small></div>
    <div><b>🌧️ ${summary.monsoonRain.toFixed(1)} mm/दिन ${badge(climate.source)}</b><small>${t.monsoon}</small></div>
    <div><b>🔥 ${summary.heatStress.length || 0} महीने ${badge(climate.source)}</b><small>गर्मी तनाव (&gt;35°C)</small></div>
  </div><div class="months" aria-label="monthly rainfall bars">${bars}</div><p>यह 25 साल के मौसम औसत का संकेत है, आज के खेत की नमी का माप नहीं।</p></section>`;
}
export function rotationCard(r, index) {
  return `<article class="card rotation"><div class="rank">#${index + 1}</div><h3>${esc(r.name)}</h3><p>${esc(r.why)}</p><strong class="total">${r.total}/100 ${badge('Sample')}</strong>
    ${scoreBar('पानी',r.scores.water)}${scoreBar('मिट्टी',r.scores.soil)}${scoreBar('जलवायु',r.scores.climate_fit)}${scoreBar('आय',r.scores.income)}
    <button class="detail" data-rotation="${r.id}">विस्तार से देखें</button></article>`;
}
