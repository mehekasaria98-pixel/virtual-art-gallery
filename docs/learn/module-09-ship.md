# Module 9: Testing, deploying and your first feature

**5 lessons · about 50 minutes.** By the end of this module you'll have changed the website and published the change yourself.

---

## Lesson 9.1: Automatic tests ⏱ 10 min

**Goal:** run the tests and read one.

**Learn (4 min):** skim [Getting started (Vitest)](https://vitest.dev/guide/).

**Try (6 min)**
1. Run:

```bash
npm test
```

   You should see `Tests  29 passed`.
2. Open `tests/taxonomy.test.ts` and find `expect(centuryRange(19)).toEqual({ from: 1800, to: 1899 });`. In plain words: "the 19th century should be 1800 to 1899."
3. **Break it on purpose.** In `src/taxonomy/eras.ts`, inside `centuryRange`, change `n * 100 - 1` to `n * 100`. Run `npm test` and watch the test fail. Then undo the change and run the tests again.

**Check yourself:** why is it useful that tests run in under a second?

---

## Lesson 9.2: Deploying with Vercel ⏱ 10 min

**Goal:** put the website online.

**Learn (3 min):** skim [Getting started with Vercel](https://vercel.com/docs/getting-started-with-vercel).

**Try (7 min):** follow [docs/setup/deploy-to-vercel.md](../setup/deploy-to-vercel.md):
1. Sign up with GitHub (Hobby plan).
2. Choose **Add New → Project** and import `virtual-art-gallery`.
3. Click **Deploy**.

**Check yourself:** what happens on Vercel after you `git push` to `main`?

---

## Lesson 9.3: Secrets and environment variables ⏱ 10 min

**Goal:** add an API key safely.

**Learn (3 min):** [Environment variables (Vercel docs)](https://vercel.com/docs/environment-variables). Then read [docs/setup/api-keys.md](../setup/api-keys.md).

**Try (7 min)**
1. Request a free key from [api.data.gov](https://api.data.gov/signup/) for the Smithsonian. It is shown instantly.
2. In the project folder, create a file named `.env.local` containing:

```
SMITHSONIAN_API_KEY=paste-your-key-here
```

3. Stop and restart `npm run dev`. In Explore → **Sources & sorting**, the Smithsonian no longer says "key needed".
4. Run `git status`. Notice that `.env.local` is **not** listed: `.gitignore` keeps it out of Git, so the key can never be pushed to GitHub.
5. Add the same variable in Vercel (**Settings → Environment Variables**), then **Redeploy**.

**Never** paste a key into code, a commit, a chat or a screenshot.

**Check yourself:** why is `.env.local` in `.gitignore`?

---

## Lesson 9.4: Your first feature, a new Journey ⏱ 10 min

**Goal:** make a real change and publish it.

**Try (10 min)**
1. Create a branch:

```bash
git switch -c add-journey
```

2. Open `src/lib/journeys.ts` and add this object inside the `JOURNEYS` array, after the last entry (mind the commas):

```ts
{ id: 'baroque-drama', title: 'Baroque drama', subtitle: 'Light and shadow, 1600–1730', query: { styles: ['baroque'], from: 1600, to: 1730 }, coverSource: 'aic' },
```

3. Run `npm run dev` and check the home page: there's a new card. Click it.
4. Run the checks:

```bash
npm run typecheck
```

```bash
npm test
```

5. Commit, switch back to `main`, merge your branch and push:

```bash
git add src/lib/journeys.ts
```

```bash
git commit -m "feat: add Baroque drama journey"
```

```bash
git switch main
```

```bash
git merge add-journey
```

```bash
git push
```

6. Wait about 2 minutes, then open your Vercel site. Your Journey is live. 🎉

**Check yourself:** list the six steps from editing a file to the live site.

---

## Lesson 9.5: Where to go from here ⏱ 10 min

**Goal:** plan your next steps.

Ideas to practise on this project, from easiest to hardest:

| Idea | Files to look at |
|---|---|
| Change the site name "Atlas of Art" | `src/components/layout/SiteShell.tsx`, `src/app/layout.tsx` |
| Add a new style | `src/taxonomy/styles.ts` (copy an existing entry) |
| Add a named period, such as "Edo period" | `NAMED_PERIODS` in `src/taxonomy/eras.ts` |
| Add a "medium" filter (painting, sculpture…) | `src/lib/query.ts`, the adapters, a new filter component |
| Add a new museum | Follow "Adding a source" in [data-sources.md](../technical/data-sources.md) |

Longer free courses for going deeper:
- [MDN: Learn web development](https://developer.mozilla.org/en-US/docs/Learn_web_development): the full beginner curriculum
- [javascript.info](https://javascript.info/hello-world): the whole JavaScript tutorial
- [react.dev/learn](https://react.dev/learn): the full React tutorial
- [Next.js Learn](https://nextjs.org/learn): build a full dashboard app step by step
- [freeCodeCamp](https://www.freecodecamp.org/learn): free interactive certificates
- [GitHub Skills](https://skills.github.com/): interactive Git and GitHub courses

**Tip:** when you're stuck, describe what you expected, what happened, and the exact error message. That habit makes problems much easier to solve, whether you ask a person or an AI assistant.
