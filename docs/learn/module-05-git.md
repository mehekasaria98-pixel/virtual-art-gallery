# Module 5: Git & GitHub, saving your history

**4 lessons · about 40 minutes.**

---

## Lesson 5.1: What is version control? ⏱ 10 min

**Goal:** understand why programmers use Git.

**Learn (6 min):** [About version control (Pro Git book)](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control).

**Try (4 min):** in the VS Code terminal, run:

```bash
git log --oneline
```

You'll see this project's history, one commit per line. For example:
- `a169792 chore: scaffold Next.js 15 + TypeScript + Mantine project`
- `ec3545d feat: gallery UI for exploring art by region, era and style`

Press **q** to exit if the list fills the screen.

**Check yourself:** what is a "commit"?

---

## Lesson 5.2: Making a commit ⏱ 10 min

**Goal:** save your own snapshot.

**Learn (5 min):** read the start of [Recording changes (Pro Git)](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository), up to "Ignoring Files".

**Try (5 min)**
1. Open `docs/learn/my-notes.md` (create it if needed) and write one sentence about what you've learned so far. Save it.
2. Run these commands one at a time:

```bash
git status
```

```bash
git add docs/learn/my-notes.md
```

```bash
git commit -m "docs: add my learning notes"
```

```bash
git log --oneline -3
```

Your commit is now at the top. You can also use VS Code's **Source Control** panel (the branching icon on the left) to do the same thing with buttons.

**In this project:** commit messages start with a type (`feat:` for a new feature, `fix:` for a bug fix, `docs:` for documentation, `test:` for tests, `chore:` for setup) and then say *what changed*.

**Check yourself:** what is the difference between `git add` and `git commit`?

---

## Lesson 5.3: Branches ⏱ 10 min

**Goal:** experiment safely without touching `main`.

**Learn (6 min):** [Branches in a nutshell (Pro Git)](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell): read the first few diagrams.

**Try (4 min):**

```bash
git switch -c my-experiment
```

```bash
git branch
```

```bash
git switch main
```

Branches are free and safe to create. You can delete a branch you no longer need with `git branch -d my-experiment`.

**Check yourself:** why would you make a branch before trying a big change?

---

## Lesson 5.4: GitHub, push and pull ⏱ 10 min

**Goal:** connect your computer with GitHub.

**Learn (5 min):** [What is GitHub?](https://docs.github.com/en/get-started/start-your-journey/what-is-github)

**Try (5 min)**
1. Open your repository on GitHub: `https://github.com/mehekasaria98-pixel/virtual-art-gallery`. Click **commits** to see the same history as `git log`.
2. Upload your notes commit from Lesson 5.2:

```bash
git push
```

3. Refresh GitHub. Your commit appears there.
4. If you ever edit a file on GitHub's website, bring that change down to your computer with:

```bash
git pull
```

**Important:** a push to `main` also triggers a new Vercel deployment once Vercel is connected (Module 9).

**Check yourself:** which command uploads, and which downloads?

➡️ Next: [Module 6: React](module-06-react.md)
