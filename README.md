# Sharp Sighted Studio · sharpsighted.studio

The Human-pillar community channel of Sharp Sighted. A networking site for
a small creative collective: the journal, the series, the 10% archive, the
cross-network feed.

> See `/projects/sharp/CLAUDE.md` for the brand bible and
> `/projects/sharp/docs/studio-architecture.md` for the full build spec.

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript, Turbopack)
- **Styling:** Tailwind v4 (`@import "tailwindcss"`, `@theme inline`)
- **Type:** Playfair Display (serif) + Montserrat (sans), via `next/font`
- **CMS:** Sanity v3 mounted at `/studio` (added in build step 2)
- **Auth:** Auth.js v5 with Discord OAuth (added in build step 3)
- **DB:** Postgres (Vercel Postgres or Neon) for reactions, users, feed cache
- **Analytics:** Plausible + Vercel Speed Insights

## Local development

```bash
npm install
cp .env.example .env.local   # then fill values
npm run dev
```

The dev server runs at <http://localhost:3000>. Sanity Studio (once
configured) mounts at <http://localhost:3000/studio>.

## Repo layout

```
src/
  app/                 Next.js App Router routes
    layout.tsx         Root layout — fonts, JSON-LD, nav, footer, toast
    globals.css        Tailwind v4 entry + Studio's design-language tokens
    providers.tsx      Theme provider (dark/light, ss_theme key)
    page.tsx           Homepage (currently placeholder; step 10 assembles it)
    not-found.tsx      Friendly 404 with all four property links
    robots.ts          Permissive robots
    sitemap.ts         Static routes today; Sanity-driven later
    icon.tsx           32x32 terracotta aperture favicon
    opengraph-image.tsx  1200x630 canonical OG card
  components/
    Nav.tsx            Fixed top nav with theme toggle
    Footer.tsx         All four properties + Switch site
    HubReturnToast.tsx Brand-agnostic cyan return toast (copied from photos)
  lib/
    plausible.ts       Tiny window.plausible wrapper
public/
  llms.txt             Plain-text Studio summary for AI crawlers
```

## Studio's visual dialect

Studio diverges from the other Sharp Sighted properties in three deliberate
ways (see `design-language.md` §9.5):

- **Corner radius 10px** on cards, buttons, surfaces (`--radius`). The
  other sites use hard 0px editorial corners.
- **Terracotta `#A0462A` heavy** — `--surface-warm`, `--accent`, and the
  `.surface-warm` helper carry the page. Cyan is reserved for the footer
  wordmark and the hub-return toast.
- **Generous section padding** — `6rem` on mobile, `8rem` on desktop via
  the `.section` utility class.

Everything else — Playfair Display + Montserrat, eyebrow → headline → body
rhythm, footer architecture, the closing tagline — matches the rest of the
brand.

## Build order

See `/projects/sharp/docs/studio-architecture.md` §20. Currently complete:

- [x] Step 1 — Scaffold (this commit)
- [ ] Step 2 — Sanity setup
- [ ] Step 3 — Auth.js + Discord
- [ ] Step 4 — Static pages
- [ ] Step 5 — Series pages
- [ ] Step 6 — Journal
- [ ] Step 7 — Reactions
- [ ] Step 8 — 10% archive
- [ ] Step 9 — Social feed
- [ ] Step 10 — Homepage assembly
- [ ] Step 11 — SEO
- [ ] Step 12 — Plausible
- [ ] Step 13 — Polish
- [ ] Step 14 — Deploy

## Deployment

Vercel via Namecheap DNS. The apex is `sharpsighted.studio`; `www`
redirects to apex. Dean handles DNS swap once preview is signed off.

## Note for Claude Code

This project follows the same Next.js 16 patterns as `/projects/sharp/landing/`,
`/projects/sharp/photos/`, and `/projects/sharp/media/`. Breaking changes
from older Next.js (most notably `middleware.ts` → `proxy.ts`) are documented
in `AGENTS.md`. Always check `node_modules/next/dist/docs/` before
generating Next.js code; train cutoff is too far behind.

---

*Stay Sharp. Stay Seen. Stay Human.*
