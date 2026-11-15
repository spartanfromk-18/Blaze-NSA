import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCsv, heatFlags, scale } from '../src/chart.js';
const climate = { source: 'Sample', fetchedAt: '15/11/2026, 10:00:00 am', parameters: { T2M: { JAN: 20, MAY: 36, JUN: 35.1 }, PRECTOTCORR: { JAN: 1, JUN: 4, DEC: 2 } } };
test('scales bounded values and flags heat stress months', () => {
  assert.equal(scale(5, 10, 100), 50);
  assert.equal(scale(20, 10, 100), 100);
  assert.equal(heatFlags(climate.parameters).filter(Boolean).length, 2);
});
test('CSV contains provenance and all twelve month rows', () => {
  const csv = buildCsv(climate);
  assert.match(csv, /^# Source: NASA POWER; fetched-at:/);
  assert.equal(csv.trim().split('\n').length, 14);
});
