# Data card

- **Provider:** NASA POWER, Community: AG.
- **Parameters:** T2M (°C) and PRECTOTCORR (mm/day), monthly JAN–DEC plus ANN.
- **Baseline:** MERRA-2 regional climatology, January 2001–December 2025.
- **Resolution:** NASA POWER point request at the selected district coordinate.
- **Known gaps:** This is not field-level soil, irrigation, market, or live weather data.
- **Fill handling:** `-999` and non-finite, missing, or implausible values fail validation and activate the Sample fallback.
- **Fetch timestamp:** Live responses receive an IST browser timestamp; the fallback records `captured_at` in `data/fallback-cache.json`.
- **Licence/attribution:** NASA POWER data is attributed below; application code is MIT licensed.

NASA POWER acknowledgement (from the [referencing guide](https://power.larc.nasa.gov/docs/referencing/)):

> The data was obtained from National Aeronautics and Space Administration (NASA) Langley Research Center's Prediction Of Worldwide Energy Resources (POWER) project funded through the NASA Earth Science Division.

For a data reference, NASA requests including the service name, version number, and date accessed. This app uses the POWER Climatology API and records the captured baseline in the fallback metadata.
