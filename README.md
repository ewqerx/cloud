# remporia-web

Site for Remporia, a Minecraft 1.8.9 client. Vite + React 19 + React Router + shadcn/ui (Tailwind v4), with the React Compiler enabled.

```sh
bun install
bun dev        # local dev server
bun run build  # typecheck + production build to dist/
bun run lint
```

Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`
(repo Settings → Pages → Source must be **GitHub Actions**).

The auth API lives on a Cloudflare Worker (`src/lib/api.ts`). It only allows the production origin through CORS, so login fails on localhost.
