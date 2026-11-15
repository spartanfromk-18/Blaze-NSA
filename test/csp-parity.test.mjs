import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function policyParts(policy) {
  return Object.fromEntries(policy.split(';').map(part => {
    const [name, ...values] = part.trim().split(/\s+/);
    return [name, values.join(' ')];
  }));
}

test('Vercel CSP exactly extends the meta CSP with frame protection', async () => {
  const index = await readFile('index.html', 'utf8');
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  const meta = index.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1];
  const header = config.headers[0].headers.find(item => item.key === 'Content-Security-Policy')?.value;
  assert.ok(meta);
  assert.equal(header, `${meta} frame-ancestors 'none'`);
  const parts = policyParts(header);
  assert.equal(parts['script-src'], "'self'");
  assert.equal(parts['object-src'], "'none'");
  assert.equal(parts['base-uri'], "'none'");
  assert.ok(!parts['script-src'].includes('unsafe-inline'));
  assert.ok(!parts['script-src'].includes('unsafe-eval'));
  assert.deepEqual(parts['connect-src'].split(' '), ["'self'", 'https://power.larc.nasa.gov']);
});
