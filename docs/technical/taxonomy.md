# Taxonomy: regions, eras and styles

The taxonomy is plain TypeScript data in `src/taxonomy/`. It is the only place that knows art history and geography. The adapters read from it, and the UI renders it.

## Regions (`regions.ts`)

| ID | Label | Examples |
|---|---|---|
| `africa` | Africa | Egypt, Nigeria, Mali, Congo, Ethiopia, South Africa |
| `east-asia` | East Asia | China, Japan, Korea, Mongolia, Tibet |
| `south-asia` | South Asia | India, Pakistan, Bangladesh, Nepal, Sri Lanka |
| `southeast-asia` | Southeast Asia | Indonesia, Thailand, Cambodia, Vietnam, Myanmar |
| `west-central-asia` | West & Central Asia | Iran, Türkiye, Iraq, Syria, Afghanistan, Uzbekistan |
| `europe` | Europe | France, Italy, Netherlands, Germany, UK, Russia |
| `north-america` | North America | United States, Canada |
| `latin-america` | Latin America & Caribbean | Mexico, Peru, Brazil, Cuba, Guatemala |
| `oceania` | Oceania | Australia, Aotearoa New Zealand, Papua New Guinea |

Each `Region` holds:

- **Per-source vocabulary:**
  - `met`: Met `geoLocation` values
  - `aic`: Art Institute `place_of_origin` values
  - `cma`: Cleveland culture substrings
  - `vam`: V&A place names
  - `harvard`: Harvard culture names
  - `europeana`: Europeana country facet values
  - `smithsonian`: Smithsonian place terms
  - `wikidataCountries`: QIDs for P495 (country of origin), including historical states such as the Dutch Republic and the Ottoman Empire
- **`keywords`:** used by `inferRegion()` to tag a result from free text (for example "Japan, Edo period" → `east-asia`). Matching is on whole words, so "Danish" does not match the keyword "dan".

When several regions are selected, adapters that need one request per place use only the first term of each region, which keeps the number of upstream requests small.

## Eras (`eras.ts`)

- **Years** are integers; negative means BCE. The supported range runs from 3000 BCE to the current year.
- **Centuries** follow art-historical convention: the 19th century is 1800–1899. Before 500 BCE, dating is coarse, so the century strip groups time into:
  - the 3rd millennium BCE
  - the 2nd millennium BCE
  - 1000–501 BCE
- **Decades** are derived for any CE century (`decadesOf(19)` → 1800s … 1890s).
- **Named periods** are presets that set a year range: Ancient, Medieval, Renaissance, Early modern, 19th century, Modern and Contemporary.
- A work matches a range when the two year ranges **overlap** (`overlaps()`), because museums date most works as ranges.

## Styles (`styles.ts`)

There are 43 styles in six families. "Modern art" is split into its individual movements, and non-Western traditions are first-class rather than grouped under a single "world art" label.

| Family | Styles |
|---|---|
| European traditions | Gothic, Early Renaissance, High Renaissance, Northern Renaissance, Mannerism, Baroque, Rococo, Neoclassicism, Romanticism, Realism, Pre-Raphaelite, Impressionism, Post-Impressionism, Symbolism, Art Nouveau |
| Modern movements | Fauvism, Expressionism, Cubism, Futurism, Dada, Constructivism & Bauhaus, Surrealism, Abstract Expressionism, Pop Art, Minimalism |
| Asian traditions | Chinese literati painting, Shan shui landscape, Kanō & Rinpa schools, Ukiyo-e, Nihonga, Persian miniature, Mughal painting, Rajput & Pahari painting, Bengal School, Gutai |
| African & diasporic | Ancient Egyptian, West & Central African sculpture, Kingdom of Benin court art, Harlem Renaissance, African modernism |
| The Americas | Pre-Columbian, Hudson River School, Mexican Muralism, Brazilian Modernismo |
| Contemporary | Contemporary art |

Each `Style` has these fields:

| Field | Purpose |
|---|---|
| `from` / `to` | Typical active years. Used for compatibility hints, not for hard filtering. |
| `regions` | Where the style is mainly found. |
| `aic` | Art Institute of Chicago style term IDs, checked against the category-terms API. |
| `wikidata` | Movement QIDs (P135). Each was checked by counting paintings with images that use it (for example, Romanticism `Q37068` has 918). |
| `keywords` | Words sent to keyword-based APIs. |

Some styles have no reliable upstream ID and rely only on keywords, so their results are less precise. Examples are Chinese literati painting, Persian miniature, the Bengal School and West & Central African sculpture.

## Compatibility (`compat.ts`)

`rankStyles(regions, from, to)` scores every style against the current selection:

- A style is **compatible** when two conditions both hold:
  - its active years overlap the selected range;
  - no region is chosen, or the style is global, or it shares a chosen region.
- Incompatible styles get a readable `reason`, shown as a tooltip (for example "Active 1907 – 1925, outside your era").
- The list is sorted so the best fits appear first.

Incompatible styles are greyed out, not hidden, because cross-cultural influence is real (Japonisme, for example). Users can switch on "Only styles matching my era and region" to hide them.
