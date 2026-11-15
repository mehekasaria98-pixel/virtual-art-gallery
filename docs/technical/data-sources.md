# Data sources

All sources are free. Five need no registration; three need a free key and switch on automatically when their environment variable is set (see [../setup/api-keys.md](../setup/api-keys.md)).

The endpoints, parameters and field names below were checked against the live APIs on **2026-11-15**, except where marked *unverified*.

| Source | Based in | Key | Licence of images | Best for |
|---|---|---|---|---|
| [Art Institute of Chicago](https://api.artic.edu/docs/) | USA | None | CC0 for public-domain works | European & American painting, style-tagged works, Indian painting |
| [The Metropolitan Museum of Art](https://metmuseum.github.io/) | USA | None | CC0 (Open Access) for public-domain works | Africa, Egypt, Asia, Islamic world, Europe |
| [Cleveland Museum of Art](https://openaccess-api.clevelandart.org/) | USA | None | CC0 | Asia, Africa, Egypt, Europe |
| [Victoria and Albert Museum](https://developers.vam.ac.uk/) | UK | None | © V&A, free for non-commercial use | South Asia, East Asia, decorative arts |
| [Wikidata Query Service](https://query.wikidata.org/) | Global | None | Varies (Wikimedia Commons); public-domain flag used when present | Art movements, modern artists worldwide |
| [Harvard Art Museums](https://github.com/harvardartmuseums/api-docs) | USA | `HARVARD_API_KEY` | Non-commercial | Asia, Europe |
| [Europeana](https://pro.europeana.eu/page/search) | EU | `EUROPEANA_API_KEY` | Varies; `reusability=open` for open licences | European museums |
| [Smithsonian Open Access](https://edan.si.edu/openaccess/apidocs/) | USA | `SMITHSONIAN_API_KEY` | CC0 where marked | National Museum of African Art, Asian and American art |

> **Africa and coverage.** At the time of writing we found no stable, open JSON API run by a museum based in Africa. African art therefore comes from the Met, Cleveland, the Art Institute, Wikidata and (with a key) the Smithsonian's National Museum of African Art. The same applies to many museums in Asia and Latin America. Adding a new source is one file; see "Adding a source" below.

## How each adapter works

### Art Institute of Chicago (`aic.ts`)
- `POST https://api.artic.edu/api/v1/artworks/search` with an Elasticsearch body. Region, era, style and keyword combine in **one request**.
- Filters: `exists image_id`, `is_public_domain`, `range date_start/date_end` (overlap with the chosen range), `terms place_of_origin.keyword`.
- Styles: `terms style_ids` (term IDs such as `TM-7543` Impressionism) **or** a phrase match of the style keyword in titles and terms. AIC does not tag every work with a style. For example, ukiyo-e prints are matched by keyword.
- Images: IIIF, `https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg`.
- Pagination: `page` + `limit`, capped at about 1,000 results per search.

### The Met (`met.ts`)
- **The v1 search endpoint was retired on 2026-10-01.** We use `GET /public/collection/v1.1/search` (paginated with `offset` and `limit`). It returns object IDs only.
- Each ID is fetched from `/public/collection/v1/objects/{id}` (cached 24 h), so pages are kept to 9 objects or fewer.
- `geoLocation` accepts **one** place per request (a pipe-separated list returns nothing), so the adapter fans out over up to 3 (place × style keyword) sub-queries. `dateBegin` and `dateEnd` must be sent together.
- Images: `primaryImageSmall`.

### Cleveland Museum of Art (`cma.ts`)
- `GET /api/artworks/?culture=…&created_after=…&created_before=…&has_image=1&cc0=1&skip=…&limit=…`
- `culture` is a substring match ("Africa" matches "Africa, West Africa, Nigeria…"), one value per request, so it fans out like the Met.
- The API can be slow (we observed 1–15 s, and occasional 504s), so it often finishes after the soft deadline and its results arrive on the next page.
- The `fields=` parameter returned HTTP 500 for some field combinations in testing, so it is not used.

### V&A (`vam.ts`)
- `GET https://api.vam.ac.uk/v2/objects/search?q=…&q_place_name=…&year_made_from=…&year_made_to=…&images_exist=1&page=…&page_size=…`
- Detail: `/v2/museumobject/{systemNumber}`.
- Images: IIIF via `_iiif_image_base_url`. V&A images are **not** public domain, so the source is skipped when "Public domain only" is on.

### Wikidata (`wikidata.ts`)
- SPARQL against `https://query.wikidata.org/sparql`. The query finds paintings, sculptures, prints, woodblock prints and drawings (`P31`) that have an image (`P18`), optionally filtered by:
  - movement (`P135`), using the QIDs in `styles.ts`
  - country of origin (`P495`), using the QIDs in `regions.ts`
  - inception year (`P571`)
  - copyright status public domain (`P6216 = Q19652`)
- **Performance:** the query sets `hint:Query hint:optimizer "None"` and writes patterns most-selective-first. Without this, the query planner sometimes started from "all paintings" and timed out after 60 s or more. With it, typical queries take under 100 ms.
- Keyword search is not supported (label search over SPARQL is too slow). Neither is sorting with no style or region filter. In both cases the source reports `skipped`.
- Images: `Special:FilePath/{file}?width=500` from Wikimedia Commons.
- Requests send a generic `User-Agent` (`VirtualArtGallery/0.1 (open-source educational app)`) and contain no personal data. The service rate-limits heavy use (HTTP 429). Results are cached for 24 h.

### Harvard Art Museums (`harvard.ts`): *unverified until a key is added*
- `GET https://api.harvardartmuseums.org/object?apikey=…&hasimage=1&culture=A|B&keyword=…&q=datebegin:<=… AND dateend:>=…&sort=…&size=…&page=…`
- Works with `imagepermissionlevel = 2` (no image allowed) are dropped.

### Europeana (`europeana.ts`): response shape checked with the public demo key
- `GET https://api.europeana.eu/record/v2/search.json?wskey=…&query=…&qf=TYPE:IMAGE&qf=COUNTRY:(…)&qf=YEAR:[a TO b]&reusability=open&cursor=…`
- Only queried when no region is chosen or Europe is chosen.

### Smithsonian (`smithsonian.ts`): response shape checked with api.data.gov's `DEMO_KEY`
- `GET https://api.si.edu/openaccess/api/v1.0/search?q=online_media_type:Images AND (unit_code:NMAfA OR …) AND (place:"Nigeria" OR …)&rows=…&start=…&api_key=…`
- Restricted to the art units: NMAfA, SAAM, FSG/NMAA, HMSG, CHNDM and NPG. Date filtering uses the decade strings the index stores (for example `"1850s"`) for ranges of up to 300 years.

## Normalised record

Every adapter returns the same `Artwork` shape (`src/types/artwork.ts`):

| Field | Notes |
|---|---|
| `key` | `${source}:${sourceId}`, unique across sources |
| `title`, `artist`, `dateText` | As the museum writes them |
| `yearStart`, `yearEnd` | Numeric; negative = BCE |
| `place`, `region` | Free-text place plus our inferred `RegionId` (`inferRegion`) |
| `styles` | Our `StyleId`s, from upstream IDs (AIC, Wikidata) or keyword inference |
| `thumbUrl`, `imageUrl` | HTTPS image URLs (grid / detail) |
| `sourceUrl`, `credit`, `isPublicDomain` | Attribution and licence |

## Adding a source

1. Create `src/lib/sources/<id>.ts` exporting a `SourceAdapter` (`meta`, `enabled`, optional `unsupported`, `search`, `get`). Use `fetchJson` and, for one-value-per-request filters, `fanOut` + `pairs` from `types.ts`.
2. Add the ID to `SourceId` in `src/types/artwork.ts`, `SOURCE_IDS` in `src/lib/query.ts`, `SOURCE_NAMES` in `src/lib/sourceNames.ts`, and register the adapter in `src/lib/sources/index.ts`.
3. If the API needs vocabulary for regions or styles, add a field to `Region` / `Style` in `src/taxonomy/`.
4. Record a fixture (`scripts/record-fixtures.mjs`) and add a normalisation test in `tests/sources.test.ts`.
5. Document it here and in `.env.example` if it needs a key.
