# Portfolio Site

A personal developer portfolio with an admin editor, built as a pnpm monorepo with a React/Vite frontend and an Express API server.

## Run & Operate

- **Start app**: `PORT=21113 BASE_PATH=/ pnpm --filter @workspace/portfolio run dev`
- **Build all**: `pnpm run build`
- **Typecheck**: `pnpm run typecheck`
- **Required env vars**: `PORT`, `BASE_PATH`, `DATABASE_URL` (for DB; not yet used in routes)

## Stack

- **Runtime**: Node.js 24
- **Package manager**: pnpm (workspace monorepo)
- **Frontend**: React 19, Vite 7, Tailwind CSS, Wouter (routing), Framer Motion
- **Backend**: Express 5, Pino (logging), Drizzle ORM + PostgreSQL
- **Validation**: Zod (shared via `@workspace/api-zod`)

## Where things live

- `artifacts/portfolio/` — main portfolio frontend (port 21113)
- `artifacts/api-server/` — Express API server
- `artifacts/mockup-sandbox/` — UI experimentation sandbox
- `lib/api-zod/` — shared Zod schemas (OpenAPI-generated)
- `lib/api-client-react/` — shared React API client helpers
- `lib/db/` — Drizzle ORM DB client (`DATABASE_URL` required)
- `lib/db/src/schema/index.ts` — DB schema (currently empty)
- `.replit` — workflow and port config

## Architecture decisions

- Monorepo with `pnpm-workspace.yaml` covering `artifacts/*` and `lib/*`
- Portfolio data stored in **localStorage** via `loadSiteData/saveSiteData` (no DB calls yet)
- API server built with esbuild to `dist/index.mjs` (ESM output)
- Frontend uses `BASE_PATH` env var for Vite `base` config (supports subpath deployments)
- Replit-specific plugins (`cartographer`, `devBanner`) loaded only when `REPL_ID` is set and not in production

## Product

- Public portfolio page (`/`) showcasing hero, about, services, projects, and contact info
- Admin editor (`/admin`) to edit all site content, saved to browser localStorage

## User preferences

_Populate as you build_

## Gotchas

- Must use `pnpm` — the root `package.json` preinstall script blocks npm/yarn
- `PORT` and `BASE_PATH` are required env vars for the portfolio Vite config or it will throw on startup
- `DATABASE_URL` is required by `lib/db` at import time even if DB is not yet used

## Pointers

- Vite config: `artifacts/portfolio/vite.config.ts`
- API routes: `artifacts/api-server/src/routes/`
- Site data types & defaults: `artifacts/portfolio/src/lib/siteData.ts`
