# CI/CD Overview

## Branch Strategy
- `feature/*` → Pull requests → Preview deploys
- `dev` → Staging deploy
- `main` → Production deploy

## Promotion Flow
All changes must flow through `dev`.  
Promotions to `main` use fast-forward merges enforced by the `promote.yml` workflow.

## Secrets
- `NETLIFY_AUTH_TOKEN`: shared across environments
- `NETLIFY_SITE_ID_STAGING`: staging site
- `NETLIFY_SITE_ID_PROD`: production site

## CI Performance
Caching via `actions/cache` for pnpm dependencies.

## Preview Experience
Every PR posts a comment with a live Netlify preview link.
