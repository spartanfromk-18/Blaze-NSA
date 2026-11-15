import { readFile } from 'node:fs/promises';
import { parseClimatology, LOCATIONS } from '../src/nasa.js';

const base = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https:\/\/[^/]+\.vercel\.app$/.test(base)) throw new Error('Usage: node scripts/verify-prod.mjs https://<project>.vercel.app');
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
const expectedHeaders = Object.fromEntries(config.headers[0].headers.map(header => [header.key.toLowerCase(), header.value]));
const results = [];
const check = (gate, ok, detail) => { results.push({ gate, status: ok ? 'PASS' : 'FAIL', detail }); if (!ok) throw new Error(`${gate} failed: ${detail}`); };
const get = async path => fetch(`${base}${path}`);
const text = response => response.text();

const home = await get('/');
const html = await text(home);
check('V1', home.status === 200 && html.includes('Blaze Field Advisor') && /<html lang="hi">/.test(html) && html.includes('canonical" href="https://blazecrops.vercel.app/"'), `GET / ${home.status}`);
for (const [key, value] of Object.entries(expectedHeaders)) check('V2', home.headers.get(key) === value, `${key}: ${home.headers.get(key) || '(missing)'}`);
const missing = await get('/nope-12345');
check('V3', missing.status === 404 && (await text(missing)).includes('पृष्ठ नहीं मिला'), `GET /nope-12345 ${missing.status}`);
for (const [path, type] of [['/robots.txt', 'text/plain'], ['/sitemap.xml', 'xml'], ['/.well-known/security.txt', 'text/plain'], ['/og.png', 'image/png'], ['/favicon.svg', 'image/svg+xml'], ['/favicon-32.png', 'image/png']]) {
  const response = await get(path);
  check('V4', response.status === 200 && (response.headers.get('content-type') || '').includes(type), `${path} ${response.status} ${response.headers.get('content-type') || ''}`);
}
const cacheResponse = await get('/data/fallback-cache.json');
const cache = await cacheResponse.json();
parseClimatology(cache, LOCATIONS.agra);
check('V5', cacheResponse.status === 200, `fallback cache ${cacheResponse.status}`);
for (const path of ['/Docx/01-PRD-FieldShift-Blaze-v2-FINAL.docx', '/scripts/verify.mjs', '/test/engine.test.mjs', '/submission/submission.json', '/.git/config', '/.env']) {
  const response = await get(path);
  check('V6', response.status === 404, `${path} ${response.status}`);
}
const nasa = await fetch('https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M%2CPRECTOTCORR&community=AG&longitude=78.0081&latitude=27.1767&format=JSON');
const nasaPayload = await nasa.json();
const nasaClimate = parseClimatology(nasaPayload, LOCATIONS.agra);
const annual = nasaClimate.parameters.T2M.ANN;
check('V7', nasa.status === 200 && Math.abs(annual - 26.5) <= 2, `T2M.ANN=${annual} · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
const og = await get('/og.png');
const ogBytes = new Uint8Array(await og.arrayBuffer());
const width = ogBytes[16] * 0x1000000 + (ogBytes[17] << 16) + (ogBytes[18] << 8) + ogBytes[19];
const height = ogBytes[20] * 0x1000000 + (ogBytes[21] << 16) + (ogBytes[22] << 8) + ogBytes[23];
check('V10', og.status === 200 && og.url.startsWith('https://') && width >= 1200 && height >= 630, `OG ${width}x${height}`);

if (process.env.RUN_BROWSER === '1') {
  console.log('V8/V9: browser verification requested; run the Playwright production flow here.');
} else {
  results.push({ gate: 'V8', status: 'UNVERIFIED', detail: 'Set RUN_BROWSER=1 with ephemeral Playwright/Chromium.' });
  results.push({ gate: 'V9', status: 'UNVERIFIED', detail: 'Set RUN_BROWSER=1 with ephemeral Playwright/Chromium.' });
}
console.table(results);
