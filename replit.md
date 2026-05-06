# Portfolio Site

A personal developer portfolio for Necati DALAR with an admin editor, built as a pnpm monorepo with a React/Vite frontend and an Express API server.

## Run & Operate

- **Start app**: `PORT=5000 BASE_PATH=/ pnpm --filter @workspace/portfolio run dev` (the "Start application" workflow)
- **API server**: `pnpm --filter @workspace/api-server run dev` (port 8080)
- **Build all**: `pnpm run build`
- **Typecheck**: `pnpm run typecheck`
- **Required env vars**: `DATABASE_URL` (for DB; not yet used in routes)

## Stack

- **Runtime**: Node.js 24
- **Package manager**: pnpm (workspace monorepo)
- **Frontend**: React 19, Vite 7, Tailwind CSS, Wouter (routing), Framer Motion
- **Backend**: Express 5, Pino (logging), Drizzle ORM + PostgreSQL, Nodemailer
- **Validation**: Zod (shared via `@workspace/api-zod`)

## Where things live

- `artifacts/portfolio/` — main portfolio frontend (port 5000)
- `artifacts/api-server/` — Express API server (port 8080)
- `artifacts/mockup-sandbox/` — UI experimentation sandbox
- `lib/api-zod/` — shared Zod schemas
- `lib/api-client-react/` — shared React API client helpers
- `lib/db/` — Drizzle ORM DB client (`DATABASE_URL` required)
- `lib/db/src/schema/index.ts` — DB schema (currently empty)
- `artifacts/api-server/data/smtp-settings.json` — SMTP config (file-based)

## Architecture decisions

- Monorepo with `pnpm-workspace.yaml` covering `artifacts/*` and `lib/*`
- Portfolio data stored in **localStorage** via `loadSiteData/saveSiteData` (no DB calls yet)
- API server built with esbuild to `dist/index.mjs` (ESM output); nodemailer in `external` list
- Frontend uses `BASE_PATH` env var for Vite `base` config (supports subpath deployments)
- Vite proxy forwards `/api/*` → `http://localhost:8080`
- Portfolio must run on **port 5000** — port 21113 is permanently held by the Replit artifact router

## Product

- Public portfolio page (`/`) — hero, about, services, projects, technologies, rotating quotes, contact form
- Admin editor (`/admin`) — edit all content including technologies, quotes, and SMTP settings
- Contact form sends email via SMTP (configurable from admin panel)

## User preferences

- Name: Necati DALAR, Logo: `<ND/>`

## Gotchas

- Must use `pnpm` — the root `package.json` preinstall script blocks npm/yarn
- Portfolio **must** run on port 5000 — the Replit artifact router permanently holds port 21113
- `artifacts/portfolio: web` artifact workflow will always fail (port 21113 conflict) — use "Start application" instead
- `DATABASE_URL` is required by `lib/db` at import time even if DB is not yet used

## Pointers

- Vite config: `artifacts/portfolio/vite.config.ts`
- API routes: `artifacts/api-server/src/routes/`
- Site data types & defaults: `artifacts/portfolio/src/lib/siteData.ts`
- React/Vite setup: `.local/skills/repl_setup/references/react_vite.md`
