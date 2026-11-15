# Production hardening audit

Branch: `hardening` · baseline: `stable-pre-hardening`

Phase 0 evidence (2026-11-15 IST):

- `stable-pre-hardening` was created from updated `main` and pushed.
- `hardening` was created and pushed.
- Runtime asset inventory: `index.html` loads `./styles.css` and `./src/main.js`; JavaScript fetches `https://power.larc.nasa.gov` and `./data/fallback-cache.json`; no external fonts or scripts are used.
- Dynamic HTML sinks exist in `src/main.js` and `src/hero.js`; these are Tier 1.4 work.
- `pages.yml` currently tests and uploads the repository root in one deploy job; CI gating and an allow-listed `_site/` are Tier 1.1/T1.2 work.

## Tier 1 — must

- [x] T1.1 CI workflow and Pages deploy dependency — `ci.yml` runs both required commands; Pages `deploy` needs `test`.
- [x] T1.2 allow-listed `_site/` artifact and referenced-asset check — workflow copies only app paths and checks index references.
- [ ] T1.3 real-asset CSP, referrer policy, and browser validation — policy and referrer are present; browser validation cut because Chromium is unavailable.
- [x] T1.4 DOM sink review and NASA response validation — dynamic score width uses CSSOM; validator tests complete/missing/fill/range/non-JSON cases.
- [x] T1.5 relative paths, 404 page, ignore rules, and secret scan — verify gate passes; scan has only documented non-secret words and `id-token`.
- [x] T1.6 complete metadata, favicon, and social preview assets — metadata gate, 32px PNG, and 1200x630 PNG pass.

## Tier 2 — should

- [ ] T2.1 accessibility audit and keyboard walkthrough — cut: Chromium/Lighthouse/axe unavailable; manual checklist documented.
- [ ] T2.2 performance budget and Lighthouse evidence — shipped assets are approximately 92 KB; Lighthouse scores are UNVERIFIED.
- [ ] T2.3 blocked-NASA and slow-network resilience evidence — cut: browser runner unavailable.
- [x] T2.4 production documentation set — README, data/model/threat/security/privacy/accessibility cards added.

## Tier 3 — could

- [ ] T3.1 service worker
- [ ] T3.2 CodeQL and secret-scanning setup (GitHub UI)
- [ ] T3.3 submission release tag and GitHub Release

## Verification evidence

- `node --test`: 11 passing.
- `node scripts/verify.mjs`: all local gates passing.
- Secret scan: no credential findings; matches are repository documentation and the required GitHub Actions `id-token` permission.
- Browser CSP, blocked-NASA, slow-3G, Lighthouse, and axe: **UNVERIFIED** because Chromium is not installed in this environment.

## Verification

Required after every change: `node --test && node scripts/verify.mjs`.
