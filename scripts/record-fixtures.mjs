// Records small real responses from the keyless APIs into tests/fixtures/.
// Run with: npm run fixtures   (needs network; not run in CI)
import { writeFile, mkdir } from 'node:fs/promises';

const UA = { 'User-Agent': 'VirtualArtGallery/0.1 (open-source educational app)' };
const out = new URL('../tests/fixtures/', import.meta.url);
await mkdir(out, { recursive: true });

async function save(name, url, init) {
  const res = await fetch(url, { ...init, headers: { ...UA, ...(init?.headers ?? {}) } });
  const json = await res.json();
  await writeFile(new URL(name, out), JSON.stringify(json, null, 2));
  console.log(name, res.status);
}

await save(
  'aic-search.json',
  'https://api.artic.edu/api/v1/artworks/search',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: { bool: { filter: [{ exists: { field: 'image_id' } }, { terms: { style_ids: ['TM-7543'] } }] } },
      limit: 3,
      fields: 'id,title,artist_display,artist_title,date_display,date_start,date_end,place_of_origin,style_id,style_ids,style_title,image_id,is_public_domain,medium_display,credit_line',
    }),
  },
);
await save('met-search.json', 'https://collectionapi.metmuseum.org/public/collection/v1.1/search?hasImages=true&geoLocation=Japan&dateBegin=1700&dateEnd=1800&q=landscape&limit=3&offset=0');
await save('met-object.json', 'https://collectionapi.metmuseum.org/public/collection/v1/objects/45352');
await save('cma-search.json', 'https://openaccess-api.clevelandart.org/api/artworks/?culture=Nigeria&has_image=1&cc0=1&limit=2');
await save('vam-search.json', 'https://api.vam.ac.uk/v2/objects/search?q_place_name=India&year_made_from=1600&year_made_to=1700&images_exist=1&page_size=2');
await save('vam-object.json', 'https://api.vam.ac.uk/v2/museumobject/O1277507');
const sparql = `SELECT ?item ?itemLabel ?creatorLabel ?inception ?image ?countryLabel ?movement ?pd WHERE {
  ?item wdt:P31 wd:Q3305213; wdt:P135 wd:Q37068; wdt:P18 ?image; wdt:P571 ?inception.
  OPTIONAL { ?item wdt:P170 ?creator } OPTIONAL { ?item wdt:P495 ?country } OPTIONAL { ?item wdt:P135 ?movement }
  OPTIONAL { ?item wdt:P6216 ?pd }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". } } LIMIT 3`;
await save('wikidata-search.json', 'https://query.wikidata.org/sparql?query=' + encodeURIComponent(sparql), { headers: { Accept: 'application/sparql-results+json' } });
