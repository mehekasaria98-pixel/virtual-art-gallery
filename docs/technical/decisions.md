# Architecture decision records

Short records of the main choices, why they were made, and what would make us revisit them.

## ADR-1: Next.js on Vercel Hobby

**Decision.** Use Next.js 15 (App Router) with TypeScript, deployed to Vercel's free plan.

**Why.**
- Vercel runs Next.js natively, with no configuration.
- Route handlers give us a server-side proxy for free. That proxy keeps API keys hidden, avoids each museum's different CORS rules and enables edge caching.
- Server components let artwork pages render on the server (good for sharing and search engines) and use ISR caching.

**Alternatives considered.** A Vite single-page app with separate Vercel functions would also work, but it needs more wiring for the same result.

## ADR-2: No database

**Decision.** No Supabase or other database. Favourites are stored in `localStorage`.

**Why.**
- All artwork data already lives in the museums' APIs, and taxonomy is static code.
- You chose not to have accounts.
- With no database there is nothing to pay for, back up or secure.

**Revisit if.** You want accounts, favourites that sync across devices, shared collections, or a pre-built search index. Supabase (free tier) would then hold users, collections and an optional cached index.

## ADR-3: Mantine as the component library

**Decision.** Mantine 7.

**Why.** It ships ready-made versions of the controls this app depends on:
- range slider
- chips
- segmented control
- drawer
- accordion
- tooltips
- dark mode

It is tree-shaken and needs no Tailwind setup. `optimizePackageImports` keeps the bundle small.

**Alternatives considered.** shadcn/ui with Tailwind gives a smaller bundle but needs more hand-built filter controls.

## ADR-4: Server-side federated search with adapters

**Decision.** One adapter per museum behind a common `SourceAdapter` interface, with an aggregator that interleaves their results.

**Why.**
- Each API is very different: Elasticsearch, Solr-like REST, SPARQL, one place per request, ID-only search.
- Adapters keep that variety contained in one file per museum.
- Adding a source means adding one file.

## ADR-5: Taxonomy as code, with per-API vocabulary

**Decision.** Regions and styles carry every API's own terms and IDs.

**Why.** Art-historical judgement (for example, what counts as Romanticism or which countries make up West Asia) should live in one place where it can be reviewed, not be scattered across adapters.

## ADR-6: Soft deadline over waiting for every source

**Decision.** Respond after 3.5 s with whatever has arrived. Slow sources are included on the next page.

**Why.** Cleveland's API sometimes took 5–15 s. Waiting for it made every first page slow, even though four other museums had already answered.

## ADR-7: No image optimisation

**Decision.** `images.unoptimized: true`, using the museums' own CDN and IIIF sizes.

**Why.** Museum images are already sized for the web. Proxying them through Vercel's image optimiser would use up the Hobby quota quickly.
