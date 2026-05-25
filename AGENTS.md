# StuStay Monorepo

This is a bun workspace monorepo with Turborepo.

## Structure

- `apps/mobile/` — Expo (React Native) mobile app (@stustay/mobile)
- `apps/web/` — SvelteKit backend + admin dashboard (@stustay/web)
- `packages/shared/` — Shared TypeScript types and constants (@stustay/shared)

## Commands

- `bun run mobile` — Start Expo dev server
- `bun run web` — Start SvelteKit dev server
- `bun run dev` — Run all dev servers with Turborepo
- `bun run build` — Build all packages
- `bun run typecheck` — Type-check all packages
- `bun run db:up` — Start dev Postgres (Docker, port 5433)
- `bun run db:migrate` — Sync schema to DB (`drizzle-kit push`). Use `db:generate` + `db:migrate:sql` for versioned SQL migrations.
- `bun run db:seed` — Seed demo users and listings

## Mobile

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

- Routes live in `apps/mobile/src/app/` (not a root `app/` folder)
- Start from repo root: `bun run mobile` (runs Expo with cache clear from `apps/mobile`)
- Use **Expo Go** built for SDK 56 (update the app on your phone if native module errors appear)

## Web

SvelteKit with Drizzle ORM + PostgreSQL. API routes under `src/routes/api/`, admin dashboard under `src/routes/admin/`.
