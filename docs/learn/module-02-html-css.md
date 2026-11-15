# Module 2: HTML & CSS, the content and the look

**4 lessons · about 40 minutes.**

---

## Lesson 2.1: HTML, the structure of a page ⏱ 10 min

**Goal:** read basic HTML tags.

**Learn (6 min):** read [Basic HTML syntax (MDN)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax).

**Try (4 min)**
1. Run the site (`npm run dev`) and open it in your browser.
2. Right-click the big heading on the home page and choose **Inspect**. You'll see something like `<h1 …>Five thousand years of art…</h1>`.
3. Hover over different lines in the Elements panel and watch them light up on the page.

**In this project:** we rarely write raw HTML. React components such as `<Title order={1}>` (in `src/app/page.tsx`) *produce* HTML such as `<h1>` for us.

**Check yourself:** what is the difference between `<h1>` and `<p>`?

---

## Lesson 2.2: CSS, the look ⏱ 10 min

**Goal:** understand selectors and properties.

**Learn (6 min):** read [What is CSS? (MDN)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/What_is_CSS).

**Try (4 min):** in Developer Tools (F12), select an artwork card. In the **Styles** panel on the right, find the `.artwork-card` rule. Untick `border-radius` and watch the corners change. This only changes your screen, temporarily.

**In this project:** open `src/app/globals.css` and find `.artwork-card { … }` and `.artwork-card:hover { … }`. That's why cards lift slightly when you hover over them.

**Check yourself:** in `.artwork-card { border: 1px solid … }`, which part is the *selector* and which is the *property*?

---

## Lesson 2.3: Responsive design (phones to desktops) ⏱ 10 min

**Goal:** understand how one site adapts to every screen size.

**Learn (6 min):** read the first half of [Responsive design (MDN)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design), up to "Media queries".

**Try (4 min)**
1. With Developer Tools open, press **Ctrl+Shift+M** to turn on the device toolbar.
2. Pick "iPhone" and look at the Explore page:
   - the filters move into a **Filters** button
   - the grid becomes 2 columns
   - the header shows a ☰ menu

**In this project:** in `globals.css`, the `.masonry` rules use `@media (min-width: 48em)` to show more columns on wider screens. Mantine props such as `visibleFrom="md"` (in `ExploreClient.tsx`) hide or show parts at different widths.

**Check yourself:** what does `@media (min-width: 48em)` mean in plain words?

---

## Lesson 2.4: CSS variables and dark mode ⏱ 10 min

**Goal:** see how one switch changes every colour.

**Learn (5 min):** read [Using CSS custom properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties), up to "Inheritance of custom properties".

**Try (5 min)**
1. In `src/app/globals.css`, look at the two blocks:
   - `:root[data-mantine-color-scheme='light'] { … }`
   - `:root[data-mantine-color-scheme='dark'] { … }`

   They define the same variable names (`--gallery-surface`, `--gallery-border` and so on) with different values.
2. With `npm run dev` running, change `--gallery-surface: #fffdf9;` to `--gallery-surface: #fde8e8;` and save. The cards turn pink in light mode.
3. Change it back. Alternatively, press **Ctrl+Z** in the file and save.

**Check yourself:** why is a variable better than typing the same colour in 20 places?

➡️ Next: [Module 3: JavaScript](module-03-javascript.md)
