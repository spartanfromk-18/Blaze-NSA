import { MONTHS } from './rotations.js';

export const MONTH_HI = { JAN: 'जन', FEB: 'फ़र', MAR: 'मार्च', APR: 'अप्रै', MAY: 'मई', JUN: 'जून', JUL: 'जुल', AUG: 'अग', SEP: 'सित', OCT: 'अक्ट', NOV: 'नव', DEC: 'दिस' };
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export function scale(value, domainMax, rangeMax) { return domainMax ? clamp(Number(value) / domainMax, 0, 1) * rangeMax : 0; }
export function heatFlags(parameters) { return MONTHS.map(month => Number(parameters?.T2M?.[month]) > 35); }
export function csvRows(climate) {
  const rows = MONTHS.map(month => [month, MONTH_HI[month], climate.parameters?.T2M?.[month] ?? '', climate.parameters?.PRECTOTCORR?.[month] ?? '']);
  return rows.map(row => row.join(',')).join('\n');
}
export function buildCsv(climate) {
  const timestamp = climate.fetchedAt || new Date().toISOString();
  return `# Source: NASA POWER; fetched-at: ${timestamp}\nmonth,month_hi,T2M_C,PRECTOTCORR_mm_day\n${csvRows(climate)}\n`;
}

export function climateChart(climate, summary) {
  const width = 720, height = 300, left = 44, right = 42, top = 24, bottom = 52;
  const plotW = width - left - right, plotH = height - top - bottom;
  const rainfall = MONTHS.map(m => Number(summary.monthlyRain[m] || 0));
  const temps = MONTHS.map(m => Number(climate.parameters?.T2M?.[m] || 0));
  const rainMax = Math.max(1, ...rainfall) * 1.15;
  const tempMin = Math.min(0, ...temps), tempMax = Math.max(40, ...temps);
  const x = i => left + i * plotW / 12 + plotW / 24;
  const yRain = value => top + plotH - scale(value, rainMax, plotH);
  const yTemp = value => top + plotH - scale(value - tempMin, tempMax - tempMin, plotH);
  const barW = plotW / 12 * .62;
  const grid = [0, 10, 20, 30, 40].filter(v => v <= tempMax).map(v => `<line class="grid" x1="${left}" x2="${width-right}" y1="${yTemp(v)}" y2="${yTemp(v)}"/><text class="axis-label" x="${left-8}" y="${yTemp(v)+4}" text-anchor="end">${v}°</text>`).join('');
  const bars = MONTHS.map((month, i) => {
    const barHeight = plotH - (yRain(rainfall[i]) - top);
    return `<rect class="rain-bar${heatFlags(climate.parameters)[i] ? ' heat' : ''}" tabindex="0" role="img" aria-label="${MONTH_HI[month]} ${month}: ${rainfall[i].toFixed(1)} mm/day, ${temps[i].toFixed(1)}°C" data-month="${month}" x="${x(i)-barW/2}" y="${yRain(rainfall[i])}" width="${barW}" height="${Math.max(1, barHeight)}"><title>${MONTH_HI[month]} / ${month}: ${temps[i].toFixed(1)}°C, ${rainfall[i].toFixed(1)} mm/day · ${climate.source}</title></rect><text class="month-label" x="${x(i)}" y="${height-24}" text-anchor="middle">${MONTH_HI[month]}<tspan>${month}</tspan></text>`;
  }).join('');
  const line = temps.map((temp, i) => `${x(i)},${yTemp(temp)}`).join(' ');
  const monsoonX = left + 5 * plotW / 12, monsoonW = 4 * plotW / 12;
  const threshold = yTemp(35);
  return `<div class="chart-wrap"><div class="chart-heading"><h3>बारिश और तापमान / Rain & temperature</h3>${climate.source === 'Sample' ? '<span class="badge sample">Sample</span>' : '<span class="badge live">Live · NASA POWER</span>'}</div><svg class="climate-chart" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="chart-title chart-desc"><title id="chart-title">आगरा का मासिक मौसम चार्ट</title><desc id="chart-desc">बारें मिलीमीटर प्रति दिन बारिश और रेखा डिग्री सेल्सियस तापमान दिखाती है। मानसून जून से सितंबर है। एम्बर बार 35 डिग्री गर्मी तनाव दिखाते हैं।</desc><rect class="monsoon-band" x="${monsoonX}" y="${top}" width="${monsoonW}" height="${plotH}"/><text class="band-label" x="${monsoonX+monsoonW/2}" y="${top+14}" text-anchor="middle">मानसून / Monsoon</text>${grid}<line class="threshold" x1="${left}" x2="${width-right}" y1="${threshold}" y2="${threshold}"/><text class="threshold-label" x="${width-right}" y="${threshold-5}" text-anchor="end">35°C heat stress</text><line class="axis" x1="${left}" x2="${width-right}" y1="${top+plotH}" y2="${top+plotH}"/>${bars}<polyline class="temp-line" points="${line}"/>${temps.map((temp,i)=>`<circle class="temp-point" tabindex="0" cx="${x(i)}" cy="${yTemp(temp)}" r="4" data-month="${MONTHS[i]}" aria-label="${MONTHS[i]} temperature ${temp.toFixed(1)} degrees"><title>${MONTHS[i]}: ${temp.toFixed(1)}°C</title></circle>`).join('')}<text class="unit-label" x="8" y="${top+8}">°C</text><text class="unit-label" x="${width-8}" y="${top+8}" text-anchor="end">mm/day</text></svg><div class="chart-tooltip" role="status" aria-live="polite">किसी बार पर जाएँ / Focus a bar</div></div>`;
}
