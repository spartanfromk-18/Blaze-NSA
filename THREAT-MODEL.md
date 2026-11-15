# Threat model

## Assets and boundaries

The app has no sensitive assets. The trust boundary is the browser ↔ NASA POWER request; GitHub Pages serves static application files.

## Threats and mitigations

- **XSS or malicious upstream data:** escaped rendered values, DOM APIs for score widths, strict payload validation, and meta CSP.
- **CDN or supply-chain compromise:** no CDN scripts, no runtime dependencies, and major-version-pinned GitHub Actions.
- **Clickjacking:** documented residual risk because Pages cannot set `frame-ancestors` or `X-Frame-Options`.
- **Availability:** timeout/retry plus validated local fallback cache.

## Residual risk

GitHub Pages cannot enforce response headers such as HSTS or Permissions-Policy. A compromised hosting account or browser remains outside this static app's controls.
