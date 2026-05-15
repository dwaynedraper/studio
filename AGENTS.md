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

## Brand grammar is locked

See `/projects/sharp/CLAUDE.md` and `/projects/sharp/docs/design-language.md` (§9.5 Studio's dialect). Don't improvise on colors, voice, footer architecture, or the tagline.
