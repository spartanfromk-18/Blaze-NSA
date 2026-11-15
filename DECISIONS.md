# Decisions

- **Static browser app:** NASA POWER has public CORS and no key; keeping calls in the browser makes the demo deployable on GitHub Pages/Vercel.
- **Fallback is explicit:** cached values are marked `Sample`, never presented as live observations.
- **Rule-based scoring:** water, soil, heat tolerance, and income are curated inputs; weights and sub-scores are rendered so judges can audit them. This is not ML.
- **Hindi first, English second:** labels and voice use `hi-IN`; every voice message remains visible as transcript.
- **No invented datasets:** GPM, SMAP, NDVI and other sources are roadmap items rather than fake measurements.
