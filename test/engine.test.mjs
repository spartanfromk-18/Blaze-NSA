import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreRotations, climateSummary } from '../src/engine.js';
import { ROTATIONS } from '../src/rotations.js';
const climate={source:'Sample',parameters:{T2M:{MAY:36,JUN:36,ANN:27},PRECTOTCORR:{JUN:4,JUL:6,AUG:6,SEP:3}}};
test('scores all rotations and stays transparent',()=>{const r=scoreRotations(climate,{water:true});assert.equal(r.length,4);assert.ok(r.every(x=>x.total>=0&&x.total<=100));assert.equal(r[0].weights.water,1.5)});
test('summary includes annual, monthly and heat stress signals',()=>{const s=climateSummary(climate);assert.equal(s.annualRain,0);assert.equal(s.monsoonRain,4.75);assert.deepEqual(s.heatStress,['MAY','JUN']);assert.equal(s.monthlyRain.JUL,6)});
test('uses the four required rotations and evidence fields',()=>{assert.deepEqual(ROTATIONS.map(r=>r.id),['current','maize-moong','bajra-mustard','paddy-dhaincha']);assert.equal(ROTATIONS[0].name,'धान–गेहूँ');assert.ok(ROTATIONS.every(r=>r.evidence?.length&&r.gaps?.length&&r.risks?.length&&typeof r.income==='number'))});
test('priority toggles apply exact 1.5 multipliers',()=>{const r=scoreRotations(climate,{water:true,soil:true,income:true});assert.deepEqual(r[0].weights,{water:1.5,soil:1.5,income:1.5})});
