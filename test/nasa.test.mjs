import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUrl, parseClimatology, fetchClimatology, loadClimate, LOCATIONS } from '../src/nasa.js';
const values = (t2m = 26, rain = 2) => ({
  T2M: Object.fromEntries(['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC','ANN'].map(key => [key, t2m])),
  PRECTOTCORR: Object.fromEntries(['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC','ANN'].map(key => [key, rain]))
});
const payload = (params = values()) => ({ properties: { parameter: params } });
test('builds NASA POWER climatology URL',()=>{const u=new URL(buildUrl(LOCATIONS.agra));assert.equal(u.hostname,'power.larc.nasa.gov');assert.equal(u.searchParams.get('community'),'AG');assert.match(u.searchParams.get('parameters'),/T2M/)});
test('parses a complete GeoJSON POWER response',()=>{const x=parseClimatology(payload(values(26.5, 5.9)),LOCATIONS.agra);assert.equal(x.source,'Live · NASA POWER');assert.equal(x.parameters.T2M.ANN,26.5)});
test('rejects missing keys, fill values, and implausible values',()=>{assert.throws(() => parseClimatology(payload({ T2M: { ANN: 26 }, PRECTOTCORR: values().PRECTOTCORR }), LOCATIONS.agra), /invalid T2M/); const fill = values(); fill.T2M.JAN = -999; assert.throws(() => parseClimatology(payload(fill), LOCATIONS.agra), /invalid T2M.JAN/); const range = values(); range.PRECTOTCORR.JUL = 101; assert.throws(() => parseClimatology(payload(range), LOCATIONS.agra), /invalid PRECTOTCORR.JUL/)});
test('retries once after transient failure',async()=>{let calls=0;const fetcher=async()=>{calls++;if(calls===1)throw new Error('network');return {ok:true,json:async()=>payload()}};const x=await fetchClimatology(LOCATIONS.agra,{fetch:fetcher,retries:1,timeout:20});assert.equal(calls,2);assert.equal(x.parameters.T2M.ANN,26)});
test('falls back for non-JSON or invalid NASA data and marks Sample',async()=>{let calls=0;const fetcher=async(url)=>{calls++;return {json:async()=>{if(url.startsWith('http')) throw new SyntaxError('not JSON'); return payload()}}};const x=await loadClimate(LOCATIONS.agra,{fetch:fetcher,retries:0,fallbackUrl:'cache.json'});assert.equal(x.source,'Sample');assert.equal(calls,2)});
