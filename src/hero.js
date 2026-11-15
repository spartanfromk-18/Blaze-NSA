export function createHero(onStart, climate = null) {
  const canvas = document.createElement('canvas');
  canvas.className = 'hero-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  const wrap = document.createElement('section');
  wrap.className = 'hero-screen';
  wrap.innerHTML = `<div class="hero-copy"><p class="wordmark">Blaze Field Advisor</p><h1>सही फसल,<br>सही फैसला</h1><p class="hero-english">Right crop. Right decision.</p><p class="hero-caption">NASA के डेटा से बनी सलाह।<br><span>आपकी खेती के अगले मौसम के लिए।</span></p><p class="hero-source">${climate ? `Visual driven by <b>${climate.source}</b> (Agra)` : '<b>Sample — illustrative</b>'}</p><button class="hero-cta" aria-label="सलाह शुरू करें">→</button><p class="scroll-hint">देखने के लिए स्क्रॉल करें</p></div>`;
  wrap.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { wrap.classList.add('canvas-fallback'); }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0, visible = true, started = false, pointer = 0;
  const seed = climate ? (Number(climate.parameters?.T2M?.ANN || 26) * 17) : 42;
  const count = innerWidth <= 480 || (navigator.hardwareConcurrency || 8) <= 4 ? 32 : 80;
  const heatCount = climate ? Object.values(climate.parameters?.T2M || {}).filter(value => Number(value) > 35).length : 0;
  const particles = Array.from({ length: count }, (_, i) => ({ x: (i * 97 + seed) % 100, y: (i * 47 + seed) % 100, z: (i % 10) / 10 + .1, heat: i < heatCount }));
  function resize() { const dpr = Math.min(devicePixelRatio, 2); canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`; ctx?.setTransform(dpr, 0, 0, dpr, 0, 0); }
  function frame(time = 0) { if (!ctx || !visible || started) return; ctx.clearRect(0, 0, innerWidth, innerHeight); const gradient = ctx.createLinearGradient(0, 0, 0, innerHeight); gradient.addColorStop(0, '#071b19'); gradient.addColorStop(1, '#173b2b'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, innerWidth, innerHeight); for (const p of particles) { const x = p.x / 100 * innerWidth + pointer * p.z * 12; const y = (p.y + time * .002 * p.z) % 105 / 100 * innerHeight; const r = 2 + p.z * 8; ctx.fillStyle = p.heat ? '#d88b45aa' : '#9acb9aaa'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = p.heat ? '#e5aa66' : '#b4e1b4'; ctx.stroke(); } raf = requestAnimationFrame(frame); }
  if (ctx) { resize(); addEventListener('resize', resize); addEventListener('pointermove', e => { pointer = (e.clientX / innerWidth - .5); }); document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible && !reduced) raf = requestAnimationFrame(frame); }); if (!reduced) raf = requestAnimationFrame(frame); else frame(); }
  wrap.querySelector('.hero-cta').onclick = () => { started = true; cancelAnimationFrame(raf); onStart(); };
  return wrap;
}
