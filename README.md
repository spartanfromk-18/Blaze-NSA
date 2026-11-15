# Blaze Field Advisor

Hindi-first, mobile-first field guidance using NASA POWER climate normals. Open `index.html` from a static host; there is no build step and no dependency install.

## Run

Serve this directory over HTTP (ES modules and the NASA request require a browser origin):

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`. Choose a district, select priorities, and open a rotation for evidence and Hindi voice. If NASA POWER times out, the app remains usable with `data/fallback-cache.json` and shows `Sample`.

## Verify

```sh
node --test test/*.test.mjs
node scripts/verify.mjs
```

Scoring is a transparent heuristic, not machine learning or agronomic advice. NASA POWER climatology values are long-term averages; local soil, irrigation, pests, prices and farmer goals still require an expert.
