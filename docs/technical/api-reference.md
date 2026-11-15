# Internal API reference

The app exposes three read-only JSON endpoints under `/api`. They need no authentication.

## `GET /api/artworks`

Searches all enabled sources at once and returns one merged list.

### Query parameters

All parameters are optional. Lists are comma-separated, and unknown values are ignored.

| Param | Type | Example | Meaning |
|---|---|---|---|
| `regions` | region IDs | `europe,east-asia` | Any of the listed regions |
| `from` | integer year | `1800`, `-500` | Start of the range. Negative = BCE. Clamped to −3000…current year. |
| `to` | integer year | `1899` | End of the range. If `from` is after `to`, they are swapped. |
| `styles` | style IDs | `romanticism,realism` | Any of the listed styles |
| `q` | string (max. 120 characters) | `sea` | Keyword |
| `sources` | source IDs | `aic,met` | Restrict to these sources. Empty = all enabled sources. |
| `pd` | `1` | `1` | Public-domain / CC0 images only |
| `sort` | `relevance` \| `oldest` \| `newest` | `oldest` | Order within each page |
| `cursor` | opaque string | | Value from the previous response, to get the next page |

- **Region IDs:** `africa`, `east-asia`, `south-asia`, `southeast-asia`, `west-central-asia`, `europe`, `north-america`, `latin-america`, `oceania`
- **Style IDs:** listed in `src/taxonomy/styles.ts`
- **Source IDs:** `aic`, `met`, `cma`, `vam`, `wikidata`, `harvard`, `europeana`, `smithsonian`

### Response

```jsonc
{
  "items": [
    {
      "key": "aic:28560", "source": "aic", "sourceId": "28560",
      "title": "The Bedroom", "artist": "Vincent van Gogh",
      "dateText": "1889", "yearStart": 1889, "yearEnd": 1889,
      "place": "Netherlands", "region": "europe", "styles": ["post-impressionism"],
      "medium": "Oil on canvas",
      "thumbUrl": "https://www.artic.edu/iiif/2/…/full/400,/0/default.jpg",
      "imageUrl": "https://www.artic.edu/iiif/2/…/full/843,/0/default.jpg",
      "sourceUrl": "https://www.artic.edu/artworks/28560",
      "credit": "Art Institute of Chicago — …", "isPublicDomain": true
    }
  ],
  "cursor": "eyJhaWMiOiIyIiwi…",   // null when every source has run out of results
  "sources": [
    { "id": "aic", "state": "ok", "count": 8, "total": 317 },
    { "id": "cma", "state": "timeout", "count": 0, "message": "Still loading; its works will appear as you scroll" },
    { "id": "harvard", "state": "disabled", "count": 0, "message": "Add HARVARD_API_KEY to enable" }
  ]
}
```

Each source reports one of these states:

| State | Meaning |
|---|---|
| `ok` | The source answered. |
| `timeout` | The source missed the deadline. It is retried on the next page. |
| `error` | The source failed. It is not queried again for this search. |
| `skipped` | The source can't answer this query (for example, the V&A when "public domain only" is on). |
| `disabled` | The source needs an API key that isn't configured. |
| `exhausted` | The source has no more results. |

### Behaviour

- **Merging:** each source is asked for 8 results per page. Results are interleaved across sources, then de-duplicated using normalised title + artist + year. If `sort` isn't `relevance`, the page is then sorted.
- **Soft deadline (3.5 s):** the response is sent with whatever has arrived by then. Sources that haven't finished keep their place in the cursor and are retried on the next page. If no source has answered by 3.5 s, the server keeps waiting, up to about 7 s.
- **Caching:** responses carry `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`. If every source failed, the response isn't cached.
- **Cursor format:** base64url-encoded JSON that maps each source ID to that source's own cursor. `null` means the source is exhausted; `""` means it should start from its first page.

## `GET /api/artworks/:source/:id`

Returns one artwork in the same shape, sometimes with a `description` field.

| Status | When |
|---|---|
| `404` | The source is unknown or disabled, or the artwork wasn't found |
| `502` | The upstream museum API failed |

Responses are cached at the edge for 24 h.

## `GET /api/sources`

Lists the sources and whether each one is enabled. API keys are never included.

```json
[{ "id": "aic", "name": "Art Institute of Chicago", "country": "United States", "homepage": "…", "needsKey": false, "enabled": true }]
```
