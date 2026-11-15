# Front end

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 App Router, React 19, TypeScript (strict, `noUncheckedIndexedAccess`) |
| Components | Mantine 7 (`@mantine/core`, `@mantine/hooks`); icons from `@tabler/icons-react` |
| Data fetching | TanStack Query 5 (`useInfiniteQuery` for search) |
| Guide page | `react-markdown` + `remark-gfm`, rendered at build time |
| Styling | Mantine theme (`src/theme.ts`) plus CSS variables in `globals.css` |

## Design language: "quiet gallery"

- **Palette.** Warm paper `#F7F4EF`, ink `#1C1B19` and one oxblood accent. Dark mode uses warm charcoal `#141312`. The tokens are CSS variables (`--gallery-surface`, `--gallery-muted`, `--gallery-border`, `--gallery-map-land`), switched by Mantine's `data-mantine-color-scheme` attribute.
- **Type.** Fraunces (serif) for headings and artwork titles; Inter for the interface. Both load through `next/font`, which self-hosts the files, so pages make no font requests to Google at runtime.
- **Layout.** The artwork comes first: a CSS-columns masonry grid, thin borders and generous white space.
- **Colour scheme.** Follows the operating system by default. The header toggle overrides it.

## Pages

| Route | Rendering | Notes |
|---|---|---|
| `/` | Client | Hero, Journeys (covers load when scrolled into view), region map, century strip, style chips |
| `/explore` | Client, inside `<Suspense>` | All filters and views; state lives in the URL |
| `/artwork/[source]/[id]` | Server component, ISR (24 h) | Calls the adapter directly; sets title and Open Graph image metadata |
| `/favourites` | Client | localStorage; JSON export and import |
| `/help` | Static, built from `docs/user-guide/*.md` | The in-app guide and the repository docs are the same files |

## Explore state

`useExploreState()` parses the URL with `parseQuery()` and writes changes back with `router.replace()`. Default values are left out, so links stay short. The keyword box waits 450 ms after typing stops before searching.

```
/explore?regions=europe&from=1800&to=1899&styles=romanticism&q=sea&pd=1&sort=oldest&view=timeline
```

## Component map

```
ExploreClient
├─ keyword input · Filters button (mobile) · Grid/Timeline/Map switch
├─ ActiveFilters (removable pills, Clear all)
├─ FilterPanel — a sidebar on desktop, a bottom drawer on mobile
│   ├─ RegionFilter → RegionMap (SVG) + chips
│   ├─ EraFilter → periods · century strip · decade chips · custom range
│   ├─ StyleFilter → search · "only matching" switch · chips grouped by family
│   └─ MoreFilters → sort · public-domain switch · sources with live status
└─ results: masonry grid | TimelineView | MapView, then LoadMore (infinite scroll)
```

## Responsiveness

| Width | Behaviour |
|---|---|
| < 36em (phones) | Map hidden (chips only); filters in a 90%-height bottom drawer with a "Show results" button; 2 columns |
| 36–62em | Map shown inside the drawer; 2–3 columns |
| ≥ 62em | Sticky 360 px filter sidebar that scrolls on its own; 3–4 columns |

The sidebar uses a plain `overflow-y: auto` box rather than Mantine's `ScrollArea`. `ScrollArea` lays its content out as a table, which let the SVG map grow to about 3,000 px wide.

## Accessibility

- Map regions are focusable buttons (`aria-pressed`, toggled with Enter or Space). Chips provide the same control at every width.
- Image alt text is the title plus the artist.
- Live regions announce the result count and the selected time range.
- Greyed-out styles stay usable, and a tooltip explains why they are greyed out.

## Favourites

`src/lib/favourites.ts` stores the full artwork records in localStorage under `atlas-of-art:favourites:v1`.

- It uses `useSyncExternalStore` and listens for `storage` events, so other open tabs stay in sync.
- Every storage access is wrapped in try/catch. If storage is unavailable (for example, in private browsing), favourites last for the current session only.
