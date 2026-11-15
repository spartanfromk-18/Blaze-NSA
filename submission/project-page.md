# Blaze Field Advisor

Blaze Field Advisor is a Hindi-first, mobile-first static web app for farmers in Agra district. It uses live NASA POWER climatology to compare four crop rotations and transparently re-ranks them against farmer priorities.

## Data and method

The browser fetches NASA POWER temperature and precipitation climatology with a timeout, retry, and captured sample fallback. Scoring is a documented rule-based heuristic, not machine learning. Income values and crop-water values are curated approximations marked for agronomist review; local soil, irrigation, pest, and mandi data are not inferred.

## Limits and next steps

GPM IMERG, SMAP, MODIS NDVI, and GRACE are named as future data sources, not presented as live observations.

- Live link: add the deployed GitHub Pages URL before submission.
- Repository: `spartanfromk-18/Blaze-NSA`
