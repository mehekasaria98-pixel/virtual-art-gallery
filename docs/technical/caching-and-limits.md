# Caching, performance and free-tier limits

The app is designed to stay within Vercel's free **Hobby** plan and to be polite to the museums' free APIs.

## Cache layers

| Layer | What | Lifetime | Set in |
|---|---|---|---|
| Vercel edge cache | `/api/artworks` responses | 1 h fresh; stale copies served for another 24 h while refreshing | `Cache-Control` in `src/app/api/artworks/route.ts` |
| Vercel edge cache | `/api/artworks/:source/:id` | 24 h, then 7 days stale-while-revalidate | the detail route |
| Next.js data cache | Every upstream `fetch` | 6 h by default; 24 h for Met objects and Wikidata | `fetchJson({ revalidate })` in `src/lib/http.ts` |
| ISR | Artwork detail pages | 24 h | `revalidate = 86400` in the page |
| Browser (TanStack Query) | Search pages | Fresh for 5 min, kept for 30 min | `src/app/providers.tsx` |

Because filter state is in the URL, the same search from different visitors is the same request, so it is served from the edge cache.

## Time budgets

| Setting | Value | Why |
|---|---|---|
| Per-request timeout | 6 s (Wikidata 6.5 s; each Met object 5 s) | One slow request mustn't use up the function's time |
| Per-source budget | 7 s | Ceiling for one source, including fan-out sub-requests |
| Soft deadline | 3.5 s | Answer with what has arrived. Late sources are fetched on the next scroll, by which time they're usually in the data cache. |
| `maxDuration` | 30 s (search), 20 s (detail) | Headroom within Hobby limits |
| Retries | 1, only on network errors, 5xx and 429; never on timeouts | Retrying a timeout would double the wait |

## Vercel Hobby plan

The app needs no paid features:

- no database
- no image optimisation: `images.unoptimized: true`, so museum CDN and IIIF images are used as-is and don't count against the image-optimisation quota
- no cron jobs
- no edge middleware

The main usage is function invocations and bandwidth for JSON responses, both reduced by edge caching. Check current Hobby limits at <https://vercel.com/docs/limits> because Vercel changes them from time to time. The Hobby plan is for personal, non-commercial projects.

## Upstream API etiquette

- All requests come from the server with a generic `User-Agent`. No personal data is ever sent.
- Wikidata rate-limits heavy use (HTTP 429). Results are cached for 24 h and queries are written to run in milliseconds.
- The Met needs one request per object, so its pages are capped at 9 objects. Objects are cached for 24 h.
- Keyed APIs have their own daily quotas. api.data.gov (Smithsonian), for example, allows about 1,000 requests per hour per key. Edge caching keeps the app well below these.

## Measured behaviour (local dev server, 2026-11-15)

| Search | Before soft deadline | After |
|---|---|---|
| `regions=africa` | 6–8 s (waiting for Cleveland) | 3.6 s |
| Romanticism + Europe + 1780–1860 (Wikidata planner fix) | 8 s, Wikidata timed out | 1.2 s |
| Repeat of any search (cached) | under 0.3 s | under 0.3 s |
