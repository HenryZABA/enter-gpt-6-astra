# Enter GitHub import

- Source branch: `main`
- Project root: repository root (`.`)
- Framework: React + Vite
- Install: `pnpm install --frozen-lockfile` (pnpm 9 or later)
- Build: `pnpm run build`
- Output: `dist`
- Entry: `dist/index.html`

Production builds use one React plugin. Enter development tooling remains enabled in development mode. No server process is required for this frontend. Existing external previews and font URLs require network access.

Optional analytics configuration is documented in `.env.example`; no secrets are included.
