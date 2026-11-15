import { scoreRotations } from './rotations.js';
export { scoreRotations };
export function climateSummary(climate) {
  const p = climate.parameters || {};
  const monthlyRain = Object.fromEntries(['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
    .map(m => [m, Number(p.PRECTOTCORR?.[m] || 0)]));
  const heatStress = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
    .filter(m => Number(p.T2M?.[m]) > 35);
  const monsoonRain = ['JUN','JUL','AUG','SEP'].reduce((s,m) => s + monthlyRain[m], 0) / 4;
  return { annualTemp: Number(p.T2M?.ANN || 0), annualRain: Number(p.PRECTOTCORR?.ANN || 0),
    monthlyRain, monsoonRain, heatStress, source: climate.source };
}
export function recommendationText(rotation, climate) {
  return `${rotation.name} चुनने पर पानी का स्कोर ${rotation.scores.water}/100 और मिट्टी का स्कोर ${rotation.scores.soil}/100 है। यह नियम-आधारित सुझाव है, अंतिम निर्णय स्थानीय कृषि विशेषज्ञ से लें।`;
}
