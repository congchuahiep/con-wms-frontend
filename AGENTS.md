<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

# Con-WMS Frontend

Next.js 16 (App Router) + React 19 + Tailwind v4 + Base UI + TanStack Query + Valibot. Bun lockfile, `bun dev` / `bun run build`. WMS for small construction company, Vietnamese-only UI.

## Commands

- `bun dev` / `bun run build` / `bun start` — dev/build/start (package.json scripts use `next dev` etc., bun is the package manager — `bun.lock` present)
- `bun run lint` → `biome check` ; `bun run format` → `biome format --write` (Biome 2.5.6, 2-space indent, `noUnknownAtRules` off, organizeImports on)
- No test runner configured yet — do not invent one.
- No `opencode.json` — instructions live here.

## Architecture

- Path alias `@/*` → `src/*` (`tsconfig.json:22`). Imports always via `@/`.
- `src/app/` — App Router. `(app)/` = protected routes, `(auth)/login` = public. Auth guard is `src/proxy.ts` (Next.js 16 `proxy`, formerly middleware) — checks `access_token` cookie, redirects to `/login`.
- `src/features/<domain>/` — vertical slices: `types.ts` + `schemas.ts` (Valibot) + `services.ts` (TanStack Query hooks) + `index.ts` barrel. Domains: `auth`, `warehouse`, `material-category`, `unit-conversion`, `inbound-note`, `stock`, etc.
- `src/configs/` — `api.ts` (3 Axios clients), `endpoints.ts` (endpoint map), `querykeys.ts`, `env.ts`, `cookie.ts`.
- `src/components/ui/` — shadcn `base-nova` style, `mist` baseColor, `hugeicons` icon library (`components.json`). Add via `shadcn add`.
- `src/hooks/` — `usePost`, `usePartialUpdate`, `use-data-table`, etc.
- `src/providers/` — `query-provider.tsx`, `map-provider.tsx` (Google Maps).
- `src/utils/` — `classify-error.ts`, `format.ts`, `form-errors.ts`.

## API / Auth — BFF + Proxy Pattern (critical)

Three Axios instances in `src/configs/api.ts`:

| Client | Base | Usage |
|--------|------|-------|
| `bffApi` | `/api` | `bffEndpoints` — login/register/logout, no auth |
| `authApi` | `/api/proxy` | `authEndpoints` — all authenticated calls, browser auto-sends httpOnly cookie |
| `internalApi` | `env.API_URL` (Django) | `internalEndpoints` — server-only (route handlers) |

- `ApiClient` call shape: `authApi.get((ep) => ep.warehouses.list)` — endpoint is a function receiving the endpoint map.
- Django URLs require trailing `/` — `authEndpoints` paths include it, `internalEndpoints` too; proxy handler appends it.
- `proxy.ts:matcher` excludes `api`, `_next/static`, `_next/image`, `favicon.ico`, `*.png`, `*.svg`.
- Public paths: `/login`, `/register`, `/forgot-password`.

## Conventions

- Validation: Valibot (`WarehouseSchema` etc.) + `usePost`/`usePartialUpdate` hooks wire schema → mutation.
- Data fetching: TanStack Query only — keys in `src/configs/querykeys.ts` (`warehouseKeys.list()` etc.), invalidate via `warehouseKeys.all` on mutations.
- Error handling: `classifyError` interceptor throws typed errors; `neverthrow` for Result types.
- Styling: `clsx` + `tailwind-merge` via `src/lib/utils.ts:cn()`. Tailwind v4 with `@tailwindcss/postcss`.
- Language: all UI strings in Vietnamese.

## Adding a Feature

Follow existing `features/warehouse` shape. Define `types.ts`, `schemas.ts`, `services.ts`, add endpoints to `src/configs/endpoints.ts` (correct bucket), add query keys to `src/configs/querykeys.ts`, export via `index.ts`.

## Local Skills

`.agents/skills/` has `feature-design` (data layer spec before coding) and `page-design` (UI spec) — use for new features/pages. Also `valibot`, `formisch`, `shadcn`.
