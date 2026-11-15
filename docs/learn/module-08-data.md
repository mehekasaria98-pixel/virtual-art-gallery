# Module 8: How this project gets its art

**4 lessons · about 40 minutes.** This module is all about *this* project's own code.

---

## Lesson 8.1: APIs and HTTP in more depth ⏱ 10 min

**Goal:** read a URL with a query string and an HTTP status code.

**Learn (6 min):** read [An overview of HTTP (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview), up to "HTTP flow".

**Try (4 min):** take apart this URL:

```
/api/artworks?regions=east-asia&from=1700&to=1799&styles=ukiyo-e
```

| Part | Meaning |
|---|---|
| `/api/artworks` | the route |
| `?` | start of the query string |
| `regions=east-asia` | one name=value pair |
| `&` | separator between pairs |

Common status codes:

| Code | Meaning |
|---|---|
| `200` | OK |
| `404` | Not found |
| `429` | Too many requests |
| `500` / `502` | Server error |

**In this project:** `src/lib/query.ts` turns that query string into a `SearchQuery` object (`parseQuery`), and turns the object back into a query string (`toSearchParams`).

**Check yourself:** what would `from=-500` mean here?

---

## Lesson 8.2: The taxonomy, the art-history brain ⏱ 10 min

**Goal:** see how regions, eras and styles are defined.

**Learn (4 min):** read [docs/technical/taxonomy.md](../technical/taxonomy.md).

**Try (6 min):**
1. Open `src/taxonomy/regions.ts` and look at the `africa` entry. It lists how each museum names places: `met: ['Africa', 'Nigeria', 'Egypt']`, `aic: [...]`, `cma: [...]` and so on.
2. Open `src/taxonomy/styles.ts`, find `ukiyo-e`, and read its fields:
   - `from: 1670, to: 1900`
   - `regions: ['east-asia']`
   - `aic: ['TM-5310']`
   - `wikidata: ['Q185905']`
   - `keywords`
3. Open `src/taxonomy/compat.ts`. `rankStyles` decides which style chips are greyed out.

**Check yourself:** why does each region list several different names?

---

## Lesson 8.3: Adapters, one translator per museum ⏱ 10 min

**Goal:** follow one museum from request to `Artwork`.

**Learn (4 min):** read the "Art Institute of Chicago" section of [docs/technical/data-sources.md](../technical/data-sources.md).

**Try (6 min):** open `src/lib/sources/aic.ts`:
1. `buildAicQuery(q)` turns our search into the Art Institute's own query format.
2. `search(...)` sends it using `fetchJson`.
3. `normaliseAic(a)` turns each answer into our `Artwork`. Look at how `thumbUrl` is built from `image_id`.

Now skim `src/lib/sources/met.ts` and compare: the same three jobs, but a very different museum API.

**Check yourself:** if a new museum were added, which folder would its file go in?

---

## Lesson 8.4: The aggregator and caching ⏱ 10 min

**Goal:** understand how five answers become one list, quickly.

**Learn (5 min):** read [docs/technical/caching-and-limits.md](../technical/caching-and-limits.md).

**Try (5 min):** open `src/lib/aggregate.ts` and find `searchAll`:
1. It starts every adapter at once.
2. It waits at most `SOFT_DEADLINE_MS` (3.5 seconds).
3. It mixes the results (`interleave`), removes duplicates (`dedupe`) and sorts them (`sortItems`).
4. It records a status for each museum: `ok`, `timeout`, `skipped` and so on. These are the coloured dots in Explore → **Sources & sorting**.

**In this project:** visit the same `/api/artworks?...` URL twice. The second time is much faster, because the answer is cached.

**Check yourself:** what happens to a museum that answers after 3.5 seconds?

➡️ Next: [Module 9: Testing, deploying and your first feature](module-09-ship.md)
