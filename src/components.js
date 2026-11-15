import { t } from './i18n.js';
import { climateChart } from './chart.js';
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function badge(source) { return `<span class="badge ${source === 'Sample' ? 'sample' : 'live'}">${esc(source)}</span>`; }
export function scoreBar(label, value) { return `<div class="score"><span>${label}</span><strong>${value}/100 ${badge('Sample')}</strong><div><i style="width:${value}%"></i></div></div>`; }
export function climateCard(climate, summary) {
  return `<section class="card climate" id="climate"><div class="section-kicker">${t.climate}</div><div class="climate-grid">
    <div><b>${summary.annualTemp.toFixed(1)}°C ${badge(climate.source)}</b><small>${t.annualTemp}</small></div><div><b>${summary.annualRain.toFixed(1)} mm/day ${badge(climate.source)}</b><small>वार्षिक वर्षा औसत</small></div>
    <div><b>${summary.monsoonRain.toFixed(1)} mm/day ${badge(climate.source)}</b><small>${t.monsoon}</small></div><div><b>${summary.heatStress.length} महीने ${badge(climate.source)}</b><small>गर्मी तनाव (&gt;35°C)</small></div>
  </div>${climateChart(climate, summary)}<p class="muted">25 साल के मौसम औसत का संकेत; आज के खेत की नमी का माप नहीं।</p></section>`;
}
export function rotationCard(r, index, previous = {}) {
  const arrow = previous[r.id] && previous[r.id] !== index ? (index < previous[r.id] ? '▲' : '▼') : '';
  return `<article class="card rotation"><div class="rank">#${index + 1} ${arrow}</div><h3>${esc(r.name)}</h3><p>${esc(r.why)}</p><strong class="total">${r.total}/100 ${badge('Sample')}</strong>
    ${scoreBar('पानी',r.scores.water)}${scoreBar('मिट्टी',r.scores.soil)}${scoreBar('जलवायु',r.scores.climate_fit)}${scoreBar('आय',r.scores.income)}
    <button class="detail" data-rotation="${r.id}">विस्तार से देखें</button></article>`;
}
export function comparisonTable(rotations) {
  return `<div class="table-wrap"><table><caption>फसल चक्र तुलना ${badge('Sample')}</caption><thead><tr><th>चक्र</th><th>पानी</th><th>मिट्टी</th><th>जलवायु</th><th>आय</th><th>कुल</th></tr></thead><tbody>${rotations.map(r => `<tr><th>${esc(r.name)}</th><td>${r.scores.water}</td><td>${r.scores.soil}</td><td>${r.scores.climate_fit}</td><td>${r.scores.income}</td><td><b>${r.total}</b></td></tr>`).join('')}</tbody></table></div>`;
}
