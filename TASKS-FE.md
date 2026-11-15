# Frontend v2 audit

Branch: `frontend-v2` · baseline: `stable-p0`

| Item | Status | Evidence / acceptance |
|---|---|---|
| B1–B4 climate chart defects | done | Bounded SVG ClimateChart; one chart badge and readable Hindi month labels |
| B5 priority controls | done | Accessible toggle buttons with visible focus |
| B6 navigation | done | Real hash sections and GitHub link; no dead links |
| ClimateChart | done | 12 rainfall bars, temperature line, monsoon band, heat threshold, keyboard tooltip |
| Provenance + CSV | done | Collapsible NASA POWER metadata and offline-capable 12-row download |
| Compare table | done | Four rotations, ranking columns, rank-change arrows |
| Hero | done | Seeded Canvas 2D, reduced-motion and fallback behavior |
| Nav / footer | done | Advisor, methods, data, GitHub, demo flow, honesty attribution |

Validation target: `node --test && node scripts/verify.mjs`.
