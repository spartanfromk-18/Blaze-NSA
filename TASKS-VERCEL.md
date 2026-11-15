# Vercel production deployment audit

Branch: `vercel-prod` · baseline: `stable-pre-vercel` · production URL: `https://blazecrops.vercel.app/`

Phase 0 evidence (2026-11-15 IST):

- `main` was fast-forwarded from `cfadf3d` to `83f541e`.
- Frontend merge is present: `cfadf3d` (`Merge pull request #2 ... frontend-v2`).
- Hardening merge is present: `83f541e` (`Merge pull request #3 ... hardening`), containing `f5eede1`.
- `stable-pre-vercel` was created and pushed; `vercel-prod` was created and pushed.
- Current asset inventory: `index.html`, `styles.css`, `src/`, `data/`, `404.html`, `favicon.svg`, `favicon-32.png`, and `og.png`; no existing Vercel config or discovery files.
- Existing meta CSP is the source of truth for the Vercel header parity test.

## Tier 1 — must

- [x] T1.1 Create `vercel.json` with security headers, exact CSP parity, and cache rules — local parity test passes.
- [x] T1.2 Create `.vercelignore` and verify the exact publish set and all referenced assets — publish gate passes.
- [x] T1.3 Make `https://blazecrops.vercel.app/` canonical everywhere; retain GitHub Pages as labelled backup — only the labelled README backup contains `github.io`.
- [x] T1.4 Add `robots.txt`, `sitemap.xml`, and `.well-known/security.txt`.
- [x] T1.5 Verify static Vercel configuration has no build/install/env requirements — no package manifest or Vercel env configuration exists.
- [ ] T1.6 Add `scripts/verify-prod.mjs` for live Vercel gates V1–V10 — V1–V7 and V10 pass on production; V8/V9 remain unverified without Chrome/Playwright.

## Tier 2 — should

- [ ] T2.1 Run Lighthouse mobile against production and record real scores — UNVERIFIED: Lighthouse reports no Chrome executable.
- [x] T2.2 Verify production security headers and document external grading if reachable — `curl` and V2 pass; external grader not run.
- [x] T2.3 Verify preview deployment no-index hygiene — preview returned `x-robots-tag: noindex` but required Vercel SSO.
- [x] T2.4 Add CSP parity coverage to CI.
- [x] T2.5 Update deployment, rollback, security, privacy, and threat-model docs.

## Tier 3 — could

- [ ] T3.1 Custom domain (cut unless independently configured and reverified).
- [ ] T3.2 Service worker (cut unless every gate is green).
- [ ] T3.3 Submission release tag and GitHub Release.

## Verification

Required after every change: `node --test && node scripts/verify.mjs`.
After deployment: `node scripts/verify-prod.mjs https://blazecrops.vercel.app/`.

Post-merge production evidence (2026-11-15 10:46 IST):

- `node scripts/verify-prod.mjs https://blazecrops.vercel.app/`: V1–V7 and V10 PASS.
- V2 includes `nosniff`, `DENY`, `no-referrer`, Permissions-Policy, COOP, CORP, and CSP with `frame-ancestors 'none'`.
- V8/V9 are UNVERIFIED because Chromium/Playwright could not run; Lighthouse is also UNVERIFIED because Chrome is unavailable.
