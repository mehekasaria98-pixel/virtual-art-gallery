# Module 1: The web and your tools

**4 lessons · about 40 minutes.** By the end of this module, Atlas of Art will be running on your own computer.

---

## Lesson 1.1: What happens when you open a website ⏱ 10 min

**Goal:** understand requests, responses, servers and browsers.

**Learn (7 min)**
- Read [How the web works (MDN)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works).
- Re-read sections 1–4 of [This project, explained](00-the-project-explained.md).

**Try (3 min)**
1. Open any website. Press **F12** (or right-click → **Inspect**) to open the browser's Developer Tools.
2. Click the **Network** tab, then reload the page. Every line is one request your browser made. Click one and look at its **Headers** and **Response**.

**Check yourself:** what is the difference between a request and a response? Which side is the "server"?

---

## Lesson 1.2: Install VS Code and open the project ⏱ 10 min

**Goal:** get a proper code editor and look around the project.

**Learn (3 min):** watch the first [VS Code introductory video](https://code.visualstudio.com/docs/introvideos/basics).

**Try (7 min)**
1. Download and install [VS Code](https://code.visualstudio.com/download).
2. Open it, choose **File → Open Folder…** and pick `virtual-art-gallery`.
3. In the left sidebar (the **Explorer**), open these files, one at a time:
   - `README.md`
   - `package.json`
   - `src/app/page.tsx`
4. In `README.md`, press **Ctrl+Shift+V** to see it formatted.

**In this project:** compare what you see in the sidebar with the folder tour in [section 7 of the explainer](00-the-project-explained.md#7-a-tour-of-the-folders).

**Check yourself:** which folder holds the web pages? Which holds the documentation?

---

## Lesson 1.3: The terminal ⏱ 10 min

**Goal:** feel comfortable typing a few commands.

**Learn (5 min):** read the start of the [Command line crash course (MDN)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line), up to "Basic built-in terminal commands".

**Try (5 min):** in VS Code, open **Terminal → New Terminal**. A panel opens at the bottom, already inside the project folder. Type each command and press Enter:

| Command | What it does |
|---|---|
| `pwd` | Shows which folder you're in |
| `ls` | Lists the files in that folder |
| `cd src` | Moves into the `src` folder |
| `cd ..` | Moves back up one folder |
| `node -v` | Shows your Node.js version. Anything 20 or higher is fine. |

If `node -v` says "not recognized", close VS Code completely and open it again. Node was installed recently, and the terminal needs restarting to find it.

**Check yourself:** how do you go "up" one folder?

---

## Lesson 1.4: Run Atlas of Art on your computer ⏱ 10 min

**Goal:** see the site running locally.

**Learn (3 min):** skim [what npm is](https://docs.npmjs.com/about-npm/). In short, npm downloads the libraries a project depends on and runs the project's commands.

**Try (7 min):** in the VS Code terminal, run these two commands:

```bash
npm install
```

```bash
npm run dev
```

1. `npm install` downloads everything listed in `package.json` into `node_modules/`. It takes about a minute, and you only need to run it again when the libraries change.
2. `npm run dev` starts a **development server**. Wait until you see `Local: http://localhost:3000`.
3. Hold **Ctrl** and click that link, or type it into your browser.
4. Click around: Explore, a Journey, an artwork.
5. To stop the server, click in the terminal and press **Ctrl+C**.

**In this project:** open `package.json`. The `"scripts"` section lists every `npm run …` command available. `dev`, `build` and `test` are the main ones.

**Check yourself:** what does `localhost` mean? (Answer: "this computer". The server is running on your own machine.)

➡️ Next: [Module 2: HTML & CSS](module-02-html-css.md)
