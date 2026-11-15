# Testing

## Commands

```bash
npm test            # Vitest unit tests (no network)
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint (next/core-web-vitals + next/typescript)
npm run build       # production build, the same one Vercel runs
npm run fixtures    # re-record API fixtures (needs network)
```

## What is covered

| File | Covers |
|---|---|
| `tests/taxonomy.test.ts` | Century and decade arithmetic, BCE formatting, range overlap, region inference (including the whole-word rule), style ID mapping, compatibility ranking (Ukiyo-e above Cubism for 18th-century East Asia) |
| `tests/query.test.ts` | URL schema: parsing, dropping unknown values, swapping reversed ranges, clamping years, round-tripping |
| `tests/sources.test.ts` | Normalising **real recorded responses** from AIC, the Met, Cleveland, the V&A and Wikidata; AIC Elasticsearch and Wikidata SPARQL query building; the fan-out cursor helper |
| `tests/aggregate.test.ts` | Cursor encoding, de-duplication across sources, sorting with unknown dates last |

The fixtures in `tests/fixtures/` were recorded from the live APIs with `scripts/record-fixtures.mjs`. Re-record them when an API changes its format and a test starts failing.

## Not covered by automated tests

- **The Harvard, Europeana and Smithsonian adapters** have no fixture tests yet. Harvard is untested because no key was available. Add tests once you have keys.
- **Live API behaviour** (latency, rate limits). This was checked by hand with the smoke script described in [caching-and-limits.md](caching-and-limits.md).
- **The UI** was checked by hand in a browser at desktop and 375 px phone widths, in light and dark mode. There are no end-to-end tests yet. Playwright would be the natural next step.

## Manual checklist before a release

1. On Explore, choose a region, a century, then a decade, then a style. Results should change each time, and the URL should update.
2. Copy the URL into a new tab. The same filters should be applied.
3. Switch between the Grid, Timeline and Map views.
4. Open an artwork. Zoom works, "View at …" opens the museum page, and the related rows load.
5. Save a favourite, reload the page, then export and import favourites.
6. At phone width, open the Filters drawer and use "Show results".
7. Switch between dark and light mode.
8. Turn on "Public domain only". The V&A should show as *skipped*.
