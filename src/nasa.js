const BASE = 'https://power.larc.nasa.gov/api/temporal/climatology/point';
export const LOCATIONS = {
  agra: { id: 'agra', name: 'आगरा', englishName: 'Agra', latitude: 27.1767, longitude: 78.0081 },
  lucknow: { id: 'lucknow', name: 'लखनऊ', englishName: 'Lucknow', latitude: 26.8467, longitude: 80.9462 },
  jaipur: { id: 'jaipur', name: 'जयपुर', englishName: 'Jaipur', latitude: 26.9124, longitude: 75.7873 }
};

export function buildUrl(location) {
  const p = new URLSearchParams({ parameters: 'T2M,PRECTOTCORR', community: 'AG',
    longitude: location.longitude, latitude: location.latitude, format: 'JSON' });
  return `${BASE}?${p}`;
}

export function parseClimatology(payload, location) {
  const props = payload?.properties?.parameter || payload?.parameter;
  if (!props?.T2M || !props?.PRECTOTCORR) throw new Error('NASA response missing climate parameters');
  return { source: 'Live · NASA POWER', location, parameters: { T2M: props.T2M, PRECTOTCORR: props.PRECTOTCORR } };
}

export async function fetchClimatology(location = LOCATIONS.agra, options = {}) {
  const timeout = options.timeout ?? 2800;
  const retries = options.retries ?? 1;
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await (options.fetch || fetch)(buildUrl(location), { signal: controller.signal });
      if (!response.ok) throw new Error(`NASA POWER HTTP ${response.status}`);
      return parseClimatology(await response.json(), location);
    } catch (error) { lastError = error; if (attempt < retries) await new Promise(r => setTimeout(r, 120)); }
    finally { clearTimeout(timer); }
  }
  throw lastError || new Error('NASA POWER unavailable');
}

export async function loadClimate(location = LOCATIONS.agra, options = {}) {
  try { return await fetchClimatology(location, options); }
  catch (error) {
    const fallbackUrl = options.fallbackUrl || './data/fallback-cache.json';
    const cached = await (options.fetch || fetch)(fallbackUrl).then(r => r.json());
    const parsed = parseClimatology(cached, location);
    return { ...parsed, source: 'Sample', error: error.message };
  }
}
