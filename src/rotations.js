export const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const CROP_WATER_MIDPOINT = { paddy: 1350, wheat: 550, maize: 650, moong: 350, bajra: 425, mustard: 325, cover: 175, dhaincha: 200 };
export const ROTATIONS = [
  { id:'current', name:'धान–गेहूँ', name_hi:'धान–गेहूँ', name_en:'Paddy-Wheat (current)', english:'Paddy-Wheat (current)', crops:['paddy','wheat'], soil:42, heatTolerance:55, income:55, is_current:true, why:'यह वर्तमान पद्धति है, पर धान में पानी की मांग अधिक है।', evidence:['NASA वर्षा औसत और फसल जल-मध्यबिंदु'], gaps:['खेत की मिट्टी और सिंचाई उपलब्धता अज्ञात'], risks:['पानी की कमी में धान की पैदावार घट सकती है'] },
  { id:'maize-moong', name:'मक्का–गेहूँ + मूंग', name_hi:'मक्का–गेहूँ + मूंग', name_en:'Maize-Wheat + Moong', english:'Maize-Wheat + Moong', crops:['maize','wheat','moong'], soil:68, heatTolerance:72, income:78, why:'कम पानी वाली खरीफ फसल और नाइट्रोजन देने वाली मूंग।', evidence:['मक्का और मूंग के जल-मध्यबिंदु', 'मूंग nitrogen-fixing legume है'], gaps:['बाजार भाव और मूंग की बुवाई खिड़की अज्ञात'], risks:['मक्का में कीट दबाव के लिए स्थानीय निगरानी चाहिए'] },
  { id:'bajra-mustard', name:'बाजरा–सरसों + कवर फसल', name_hi:'बाजरा–सरसों + कवर फसल', name_en:'Bajra-Mustard + cover crop', english:'Bajra-Mustard + cover crop', crops:['bajra','mustard','cover'], soil:78, heatTolerance:90, income:68, why:'सूखा-सहने वाला बाजरा और मिट्टी ढकने वाली फसल।', evidence:['बाजरा का कम जल-मध्यबिंदु', 'कवर फसल erosion घटा सकती है'], gaps:['कवर फसल के बीज और श्रम उपलब्धता अज्ञात'], risks:['सरसों में पाला/रोग जोखिम का स्थानीय आकलन करें'] },
  { id:'paddy-dhaincha', name:'धान–गेहूँ + ढैंचा', name_hi:'धान–गेहूँ + ढैंचा', name_en:'Paddy-Wheat + Dhaincha', english:'Paddy-Wheat + Dhaincha', crops:['paddy','wheat','dhaincha'], soil:92, heatTolerance:58, income:62, why:'धान कायम रखते हुए ढैंचा जैविक पदार्थ और nitrogen लौटाता है।', evidence:['ढैंचा green manure है', 'NASA गर्मी और बारिश संकेत'], gaps:['ढैंचा पलटने का समय और सिंचाई अज्ञात'], risks:['धान की पानी मांग और methane trade-off पर विशेषज्ञ समीक्षा चाहिए'] }
].map(r => ({ ...r, waterNeed: r.crops.reduce((sum,c) => sum + CROP_WATER_MIDPOINT[c], 0) }));
const clamp = n => Math.max(0, Math.min(100, Math.round(n)));
export function scoreRotations(climate, priorities = {}) {
  const rain = climate?.parameters?.PRECTOTCORR || {};
  const monsoon = ['JUN','JUL','AUG','SEP'].reduce((s,m) => s + Number(rain[m] || 0), 0) / 4;
  const monsoonMm = monsoon * 122;
  const heat = ['MAY','JUN'].filter(m => Number(climate?.parameters?.T2M?.[m]) > 35).length;
  const weights = { water: priorities.water ? 1.5 : 1, soil: priorities.soil ? 1.5 : 1, income: priorities.income ? 1.5 : 1 };
  return ROTATIONS.map(r => {
    const kharifNeed = r.crops.filter(c => !['wheat', 'mustard'].includes(c))
      .reduce((sum,c) => sum + CROP_WATER_MIDPOINT[c], 0);
    const coverage = Math.min(1, monsoonMm / Math.max(kharifNeed, 1));
    const water = clamp(100 * (1 - r.waterNeed / 3000) + 15 * (coverage - 0.5));
    const soil = clamp(r.soil);
    const climateFit = clamp(r.heatTolerance - heat * 8 + monsoon * 2);
    const weighted = (water * weights.water + soil * weights.soil + climateFit + r.income * weights.income) /
      (weights.water + weights.soil + 1 + weights.income);
    return { ...r, scores: { water, soil, climate_fit: climateFit, income: r.income }, total: clamp(weighted), weights, monsoon };
  }).sort((a,b) => b.total - a.total);
}
