# Sanity seeds

NDJSON files that import skeleton documents into the Sanity dataset, so
Dean can edit them in Studio rather than creating each one from scratch.

## Usage

After `npx sanity init` (or once the project is created in the Sanity
dashboard), import a seed:

```bash
# from /projects/sharp/studio/
npx sanity dataset import seed/series.ndjson production
```

The `--replace` flag overwrites docs that already exist by `_id`:

```bash
npx sanity dataset import seed/series.ndjson production --replace
```

## What's in here

- **`series.ndjson`** — the six ongoing series (Bartographer, Special
  Moments, Corridor, Home Architecture, Alpha Architect, Ripped or
  Stamped) with `slug`, `badge`, `pillar`, and `order` set per the
  inferences in `src/lib/series-seeds.ts`. `tagline` and `description`
  are empty except for Ripped or Stamped (where CLAUDE.md gives a
  one-line source). Dean fills the rest in Studio.

## Adding more seeds

Each line in an `.ndjson` is a complete JSON document. Document `_id`
must be unique. `_type` must match a schema in
`src/sanity/schemas/`. See the existing entries for shape.

Recommended `_id` convention: `<type>-<slug>` (e.g.
`series-bartographer`, `contributor-dean-draper`,
`tenpercent-2026-mckinney-shelter`). Stable IDs make `--replace`
imports safe.
