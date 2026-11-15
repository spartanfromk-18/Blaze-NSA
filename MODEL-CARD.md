# Model card

## Purpose and inputs

The advisor ranks four curated rotations using validated NASA POWER temperature and precipitation climatology, plus curated water, soil, climate-fit, and illustrative income inputs.

## Formula and controls

Each component is a bounded 0–100 score. The total is a weighted average; the selected priority receives a `1.5×` weight and other priorities receive `1×`. The UI exposes component scores, evidence, and Sample badges.

## Biases and limits

Curated tables can encode local assumptions and require agronomist review. Climate normals are regional averages and cannot represent a particular field. Income is illustrative, not a price forecast.

## Safe use

Do not use this as a guaranteed yield, irrigation, planting, financial, or safety decision. It is advice, not orders; consult a local agronomist and combine it with local soil, water, pest, market, and farmer-goal information.
