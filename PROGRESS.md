# Blaze Field Advisor — progress

- [x] Zero-build Hindi-first static SPA
- [x] NASA POWER climatology fetch with timeout/retry
- [x] Honest Live/Sample badges and cached fallback
- [x] Transparent four-rotation scoring and priority toggles
- [x] Evidence, limitations, methods, and Hindi voice fallback
- [x] Node test suite and verification harness

Verification evidence (2026-11-15): NASA POWER climatology request returned HTTP 200 for Agra; captured fallback response contains `T2M.ANN = 26.54°C`. `node --test test/*.test.mjs` passes 8/8 and `node scripts/verify.mjs` passes the captured-cache, rotation-evidence, and climate-summary gates.

The app intentionally has no backend, keys, cookies, analytics, or build step.

Hardening evidence (2026-11-15):

- `node --test` passes 11/11; `node scripts/verify.mjs` passes.
- CI is separated from Pages deployment; deployment needs the test job and uploads an allow-listed `_site/`.
- NASA payload validation rejects missing, non-finite, `-999`, and implausible values; fallback metadata includes `captured_at`, source, and parameters.
- Self-only meta CSP, referrer policy, relative paths, 404 page, favicon, OG/Twitter metadata, and production documentation are present.
- Browser CSP/offline/Lighthouse/axe checks are UNVERIFIED because Chromium is unavailable; see `TASKS-HARDEN.md`.
