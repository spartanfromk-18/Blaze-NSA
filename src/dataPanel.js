import { buildCsv } from './chart.js';
export function provenance(climate) {
  const location = climate.location || {};
  return `<details class="provenance" id="data"><summary>डेटा स्रोत / Data provenance</summary><dl><dt>Source</dt><dd>NASA POWER · parameters T2M + PRECTOTCORR · community AG</dd><dt>Baseline</dt><dd>2001–2025 MERRA-2 climatology</dd><dt>Units</dt><dd>T2M °C · PRECTOTCORR mm/day</dd><dt>Coordinates</dt><dd>${location.latitude ?? '—'}, ${location.longitude ?? '—'}</dd><dt>Fetched at (IST)</dt><dd>${climate.fetchedAt || 'fallback cache timestamp'}</dd><dt>Status</dt><dd>${climate.source}</dd></dl><p class="muted">-999 NASA fill values are treated as unavailable, never as real weather.</p><button class="secondary" id="download-csv">Download data (CSV)</button></details>`;
}
export function wireDownload(climate) {
  const button = document.querySelector('#download-csv');
  if (!button) return;
  button.onclick = () => { const blob = new Blob([buildCsv(climate)], { type: 'text/csv;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'blaze-climate.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 0); };
}
