# Module 7: Next.js & Mantine, the framework and the building blocks

**4 lessons · about 40 minutes.** This project uses Next.js **15**. The official docs show the newest version, but the ideas in these lessons are the same.

---

## Lesson 7.1: Pages are folders ⏱ 10 min

**Goal:** understand how URLs map to files.

**Learn (6 min):** [Layouts and pages (Next.js docs)](https://nextjs.org/docs/app/getting-started/layouts-and-pages).

**Try (4 min):** match each URL to its file:

| URL | File |
|---|---|
| `/` | `src/app/page.tsx` |
| `/explore` | `src/app/explore/page.tsx` |
| `/favourites` | `src/app/favourites/page.tsx` |
| `/artwork/met/45352` | `src/app/artwork/[source]/[id]/page.tsx` |

The square brackets mean "any value": here `source` = `met` and `id` = `45352`.

**In this project:** `src/app/layout.tsx` wraps **every** page with the header, footer, fonts and theme.

**Check yourself:** what file would you create to make a new page at `/about`?

---

## Lesson 7.2: Server and client components ⏱ 10 min

**Goal:** know where each piece of code runs.

**Learn (7 min):** [Server and client components (Next.js docs)](https://nextjs.org/docs/app/getting-started/server-and-client-components): read up to "Examples".

**Try (3 min):**
- Open `src/app/explore/page.tsx`. It has no `'use client'` line, so it is a **server** component.
- It shows `ExploreClient`. Open `src/components/explore/ExploreClient.tsx`: its first line is `'use client';`, so it runs in the browser, where clicks and scrolling happen.
- `src/app/artwork/[source]/[id]/page.tsx` is a server component that asks the museum *before* the page reaches you.

**Check yourself:** why does a component with buttons and filters need `'use client'`?

---

## Lesson 7.3: API routes, our own back end ⏱ 10 min

**Goal:** see the server side of the project.

**Learn (5 min):** [Route handlers (Next.js docs)](https://nextjs.org/docs/app/getting-started/route-handlers).

**Try (5 min)**
1. With `npm run dev` running, open:
   - <http://localhost:3000/api/sources>
   - <http://localhost:3000/api/artworks?regions=africa>

   This is the raw JSON the Explore page receives.
2. Open `src/app/api/artworks/route.ts`. The `GET` function is only about 15 lines long, because the real work happens in `searchAll` (Module 8).

**Check yourself:** the folder is `src/app/api/artworks/`. What URL does it answer?

---

## Lesson 7.4: Mantine, ready-made components ⏱ 10 min

**Goal:** use and customise library components.

**Learn (5 min):** browse [Mantine: getting started](https://mantine.dev/getting-started/) and the [Chip component](https://mantine.dev/core/chip/) page (the filter chips are Mantine Chips).

**Try (5 min)**
1. Open `src/theme.ts`. Here the project defines its "quiet gallery" look:
   - the `oxblood` colour scale
   - the fonts
   - `primaryColor: 'oxblood'`
2. Temporarily change `primaryColor: 'oxblood'` to `primaryColor: 'teal'` and save. Buttons and selected chips turn teal.
3. Change it back.

**Check yourself:** why use a component library instead of writing every button yourself?

➡️ Next: [Module 8: How this project gets its art](module-08-data.md)
