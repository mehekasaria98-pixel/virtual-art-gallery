# Module 4: TypeScript, JavaScript with safety labels

**3 lessons · about 30 minutes.**

---

## Lesson 4.1: Why types? ⏱ 10 min

**Goal:** understand what TypeScript adds to JavaScript.

**Learn (6 min):** [TypeScript in 5 minutes](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).

**Try (4 min):** open the [TypeScript Playground](https://www.typescriptlang.org/play/), clear the editor and paste:

```ts
function formatYear(year: number): string {
  return year < 0 ? `${-year} BCE` : `${year}`;
}
formatYear('1889');
```

A red underline appears: you passed text where a number was expected. TypeScript caught the mistake **before** the code ran.

**Check yourself:** what does `: number` after `year` mean?

---

## Lesson 4.2: Describing data with interfaces ⏱ 10 min

**Goal:** read the "shape" of the project's main data.

**Learn (6 min):** read the following sections of [Everyday types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html):
- "Object Types"
- "Union Types"
- "Interfaces"

**Try (4 min):** open `src/types/artwork.ts`:
- `interface Artwork { … }` lists every field an artwork has. For example, `title: string;` and `artist: string | null;`, which means text **or** nothing.
- `type SourceId = 'aic' | 'met' | …` is a **union**: the value must be one of those exact words.

**In this project:** every adapter promises to return `Artwork` objects. If one forgets a field, TypeScript complains, which is how five different museum formats stay consistent.

**Check yourself:** what does `string | null` allow?

---

## Lesson 4.3: Reading TypeScript errors ⏱ 10 min

**Goal:** don't panic at red squiggles.

**Learn (3 min):** in VS Code, hover over any red underline to read the message. The first line usually says "Type X is not assignable to type Y".

**Try (7 min)**
1. In `src/lib/journeys.ts`, find the first journey and change `from: 1780` to `from: '1780'` (add the quotes). Save.
2. Hover over the red underline and read the error.
3. In the terminal, run:

```bash
npm run typecheck
```

   It prints the same error, with the file name and line number.
4. Undo the change (**Ctrl+Z**), save, then run `npm run typecheck` again. It should print nothing, which means no errors.

**Check yourself:** where do you find the file and line number in an error message?

➡️ Next: [Module 5: Git & GitHub](module-05-git.md)
