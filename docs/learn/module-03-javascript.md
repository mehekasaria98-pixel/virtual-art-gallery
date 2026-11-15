# Module 3: JavaScript, making things happen

**6 lessons · about 60 minutes.** JavaScript is the programming language behind everything interactive on the web. TypeScript, React and Next.js are all built on it.

> **Where to practise:** in any browser tab, press **F12** and open the **Console** tab. You can type JavaScript there and press Enter to run it immediately.

---

## Lesson 3.1: Values and variables ⏱ 10 min

**Goal:** store and name pieces of data.

**Learn (6 min):** [Variables (javascript.info)](https://javascript.info/variables).

**Try (4 min):** in the Console, type each line and press Enter:

```js
const title = 'Water Lilies';
const year = 1906;
let favourites = 0;
favourites = favourites + 1;
`${title} was painted in ${year}`;
```

**In this project:** `src/taxonomy/eras.ts` begins with `export const MIN_YEAR = -3000;`. That's a variable that never changes (`const`), shared with other files (`export`).

**Check yourself:** when would you use `let` instead of `const`?

---

## Lesson 3.2: Functions ⏱ 10 min

**Goal:** package instructions so they can be reused.

**Learn (7 min)**
- [Functions (javascript.info)](https://javascript.info/function-basics)
- [Arrow functions (javascript.info)](https://javascript.info/arrow-functions-basics)

**Try (3 min):** in the Console:

```js
function formatYear(year) {
  return year < 0 ? `${-year} BCE` : `${year}`;
}
formatYear(-500);
formatYear(1889);
```

**In this project:** that is almost exactly `formatYear` in `src/taxonomy/eras.ts`. Find it with **Ctrl+P**, type `eras.ts`, then **Ctrl+F** and search for `formatYear`.

**Check yourself:** what does `return` do?

---

## Lesson 3.3: Objects and arrays ⏱ 10 min

**Goal:** group data together.

**Learn (7 min)**
- [Objects (javascript.info)](https://javascript.info/object): read up to "Property existence test"
- [Arrays (javascript.info)](https://javascript.info/array): read up to "Loops"

**Try (3 min):**

```js
const art = { title: 'The Bedroom', artist: 'Vincent van Gogh', year: 1889 };
art.artist;
const regions = ['europe', 'africa', 'east-asia'];
regions.length;
regions[0];
```

**In this project:** `src/lib/journeys.ts` contains `JOURNEYS`. It is an **array** of **objects**, each with `id`, `title`, `subtitle` and `query`. The home page's Journey cards are drawn from it.

**Check yourself:** how do you get the second item of an array?

---

## Lesson 3.4: Decisions and lists (if, map, filter) ⏱ 10 min

**Goal:** make choices and transform lists.

**Learn (7 min)**
- [Conditional branching (javascript.info)](https://javascript.info/ifelse)
- [Array methods (javascript.info)](https://javascript.info/array-methods): read only the `map` and `filter` sections

**Try (3 min):**

```js
const works = [{ title: 'A', year: 1700 }, { title: 'B', year: 1850 }, { title: 'C', year: 1910 }];
works.filter((w) => w.year >= 1800);
works.map((w) => w.title);
```

**In this project:** `src/components/home/HomeBrowse.tsx` uses `CENTURIES.filter(...)` to choose which centuries to show, then `.map(...)` to turn each one into a chip.

**Check yourself:** `filter` returns how many items compared with the original? What about `map`?

---

## Lesson 3.5: JSON, data as text ⏱ 10 min

**Goal:** read the format every API speaks.

**Learn (4 min):** [JSON (javascript.info)](https://javascript.info/json): read up to "JSON.stringify options".

**Try (6 min)**
1. Open this museum API URL in your browser: <https://api.artic.edu/api/v1/artworks/search?q=hokusai&limit=2&fields=id,title,artist_display,date_display>
2. Tick "Pretty-print" if your browser offers it. Find the `data` array and each artwork's `title`.
3. Now open `tests/fixtures/met-object.json` in VS Code. This is one real answer from the Met's API, saved for the tests.

**Check yourself:** JSON looks like JavaScript objects. What is one difference? (Hint: the quotes around the names.)

---

## Lesson 3.6: Waiting for the network (async/await and fetch) ⏱ 10 min

**Goal:** understand how code waits for a museum to answer.

**Learn (7 min)**
- [Async/await (javascript.info)](https://javascript.info/async-await): read up to "Error handling"
- skim [Fetch (javascript.info)](https://javascript.info/fetch)

**Try (3 min):** paste this into the Console and press Enter:

```js
const res = await fetch('https://api.artic.edu/api/v1/artworks/search?q=monet&limit=3&fields=title');
const json = await res.json();
json.data.map((a) => a.title);
```

You just did what the back end does: asked a museum for data and read the answer.

**In this project:** `fetchJson` in `src/lib/http.ts` is a careful version of the same thing. It adds a time limit, one retry and caching.

**Check yourself:** why do we need `await`?

➡️ Next: [Module 4: TypeScript](module-04-typescript.md)
