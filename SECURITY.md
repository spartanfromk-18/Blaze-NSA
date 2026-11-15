# Security

Please report suspected vulnerabilities privately through the repository's GitHub security contact or a private maintainer message. Do not include secrets or sensitive personal data in a public issue.

The app intentionally has no backend, credentials, cookies, analytics, or personal-data storage. Vercel may process ordinary request logs as the hosting provider; the application does not add analytics or tracking. For ordinary bugs, open a GitHub issue with reproduction steps and browser details.

Vercel production headers are defined in `vercel.json`; the GitHub Pages mirror has the defensive meta-CSP but cannot set equivalent HTTP headers.
