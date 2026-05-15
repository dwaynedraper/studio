# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Known Next.js 16 breaking changes already wired into this repo

- **`middleware.ts` is now `proxy.ts`.** The exported function is `proxy`, not `middleware`. Same matcher config, same `NextRequest`/`NextResponse` API. The Auth.js v5 integration uses `export { auth as proxy } from '@/auth'`.
- **`next build` no longer runs the linter.** Run `npm run lint` separately or via CI.
- **Turbopack is the default bundler.** No webpack config needed.

## Stack notes

- Tailwind v4 with `@import "tailwindcss";` and `@theme inline { ... }` — no `tailwind.config.js`.
- Theme tokens live in `src/app/globals.css`. Studio's dialect (soft 10px corners, terracotta-heavy surfaces) is encoded there.
- Sanity v3 mounts at `/studio/[[...tool]]/page.tsx` via `next-sanity`. Config in `sanity.config.ts` at repo root.
- Auth.js v5 (`next-auth@beta`) — see `src/auth.ts`. Discord provider only.
- Postgres via `DATABASE_URL` — uses raw `pg` client, no ORM, for the small reaction + user surface area.

## Never run `npx sanity init` in this project

Sanity is already configured. `npx sanity init` (and `npx sanity@latest init`) is a project-creation tool — running it again silently overwrites the project's customizations with vanilla scaffolds and creates duplicate folders that nothing imports. Damage previously observed:

- `sanity.config.ts` — loses `basePath: '/studio'`, name/title, and the singleton enforcement (templates filter, action filter, newDocumentOptions filter)
- `src/sanity/env.ts` — loses `apiToken`, `webhookSecret`, `isSanityConfigured`, `assertSanityConfigured`, and the graceful no-throw-on-missing semantics that let `next build` collect pages
- `src/sanity/structure.ts` — loses the custom sidebar that puts Site settings as a singleton at the top
- Creates parallel empty folders `src/sanity/schemaTypes/` and `src/sanity/lib/` next to the real `src/sanity/schemas/` and `src/sanity/`
- Creates a bogus `src/app/sanitystudio/` route alongside the real `/studio` mount

If env vars need updating, edit `.env.local` directly. If schema changes are needed, edit files in `src/sanity/schemas/`. There is no scenario where re-running init is the right move.

## Brand grammar is locked

See `/projects/sharp/CLAUDE.md` and `/projects/sharp/docs/design-language.md` (§9.5 Studio's dialect). Don't improvise on colors, voice, footer architecture, or the tagline.
