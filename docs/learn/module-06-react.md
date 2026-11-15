# Module 6: React, building pages from components

**5 lessons · about 50 minutes.** React lets you build a page from small, reusable pieces called **components**. Each piece is a function that returns markup.

---

## Lesson 6.1: Components and JSX ⏱ 10 min

**Goal:** read a React component.

**Learn (7 min)**
- [Your first component (react.dev)](https://react.dev/learn/your-first-component)
- [Writing markup with JSX (react.dev)](https://react.dev/learn/writing-markup-with-jsx)

**Try (3 min)**
1. Open `src/app/page.tsx`. `export default function HomePage() { return ( … ) }` is a component, and everything inside `return ( … )` is JSX.
2. With `npm run dev` running, change the text `Start exploring` to `Begin your tour` and save. The button updates in the browser instantly.
3. Change it back.

**Check yourself:** why must a component's name start with a capital letter?

---

## Lesson 6.2: Props, giving components inputs ⏱ 10 min

**Goal:** pass data into a component.

**Learn (6 min):** [Passing props to a component (react.dev)](https://react.dev/learn/passing-props-to-a-component).

**Try (4 min):** open `src/components/gallery/ArtworkCard.tsx`:
- `export function ArtworkCard({ artwork, width })` receives two props.
- Inside, `{artwork.title}` puts the title into the markup.
- In `src/components/explore/ExploreClient.tsx`, search for `<ArtworkCard key={a.key} artwork={a} />`. That is where the prop is given.

**Check yourself:** where does `ArtworkCard` get the artwork to show?

---

## Lesson 6.3: Lists and keys ⏱ 10 min

**Goal:** render many items from an array.

**Learn (7 min):** [Rendering lists (react.dev)](https://react.dev/learn/rendering-lists).

**Try (3 min):** in `src/app/page.tsx`, find `{JOURNEYS.map((j) => ( <JourneyCard key={j.id} journey={j} /> ))}`. One line of code draws all 12 Journey cards.

**In this project:** every list uses a unique `key` (here `j.id`; for artworks `a.key`, which looks like `met:45352`). That lets React tell items apart.

**Check yourself:** what would happen to the home page if you deleted one object from `JOURNEYS`?

---

## Lesson 6.4: State, a component's memory ⏱ 10 min

**Goal:** understand how the page changes when you interact with it.

**Learn (7 min):** [State: a component's memory (react.dev)](https://react.dev/learn/state-a-components-memory).

**Try (3 min):** in `ArtworkCard.tsx`, find `const [broken, setBroken] = useState(false);`:
- `broken` remembers whether the image failed to load.
- `onError={() => setBroken(true)}` updates it, and the card then hides itself.

**In this project:** the Explore filters are a special kind of state. They live in the **URL**, not in `useState`, so links can be shared. See `src/hooks/useExploreState.ts`.

**Check yourself:** what does calling `setBroken(true)` cause React to do?

---

## Lesson 6.5: Effects and hooks ⏱ 10 min

**Goal:** recognise `use…` functions.

**Learn (7 min):** read the first part of [Synchronizing with effects (react.dev)](https://react.dev/learn/synchronizing-with-effects), up to "How to write an Effect".

**Try (3 min):** open `src/components/gallery/LoadMore.tsx`. The `useEffect` says: "when the bottom of the list scrolls into view and there are more results, fetch the next page." That is how infinite scrolling works.

**In this project:** hooks you'll see include:
- `useState`, `useEffect` and `useMemo` (from React)
- `useDisclosure` and `useIntersection` (from Mantine)
- `useInfiniteQuery` (from TanStack Query)
- our own: `useExploreState`, `useArtworkSearch` and `useFavourites`

**Check yourself:** what do all hooks have in common in their names?

➡️ Next: [Module 7: Next.js & Mantine](module-07-nextjs.md)
