# Glossary

Plain-language definitions of every technical word used in this project, in alphabetical order.

| Term | Meaning |
|---|---|
| **Adapter** | In this project, a file that knows how to talk to one museum's API and translate its answer into our `Artwork` format (`src/lib/sources/`). |
| **Aggregator** | Code that collects answers from several adapters and combines them into one list (`src/lib/aggregate.ts`). |
| **API** | A "door for programs": a set of addresses you can send requests to and get data back from, usually as JSON. |
| **API key** | A secret code that identifies you to an API. Treat it like a password. |
| **Array** | An ordered list of values, for example `['Europe', 'Africa']`. |
| **async / await** | JavaScript keywords for waiting on something slow, such as a network request, without freezing the page. |
| **Back end** | The part of a website that runs on a server, not in your browser. |
| **Branch** | In Git, a separate line of work. `main` is the main branch. |
| **Browser** | The program you use to view websites: Chrome, Edge, Firefox, Safari. |
| **Build** | Turning source code into optimised files ready to serve (`npm run build`). |
| **Cache** | A stored copy of a recent answer, so it can be reused quickly instead of asked for again. |
| **CLI / terminal** | A text window where you type commands instead of clicking. On Windows: PowerShell or Windows Terminal. |
| **Client** | The browser side of a website. |
| **Commit** | A saved snapshot of your code in Git, with a message describing the change. |
| **Component** | A reusable piece of a page in React, such as `ArtworkCard`. |
| **CSS** | The language that styles a web page: colours, fonts and layout. |
| **CSS variable** | A named value in CSS, such as `--gallery-surface`, reused in many places. |
| **Dependency / package / library** | Code written by someone else that a project uses, for example Mantine. Listed in `package.json`. |
| **Deploy** | Put a new version of the website online. |
| **Environment variable** | A setting given to a program from outside its code. Often used for secret keys, for example `HARVARD_API_KEY`. |
| **Fetch** | The browser's (and Node's) built-in way to make a request to a URL. |
| **Framework** | A larger library that decides how a project is organised. Next.js is a framework. |
| **Front end** | The part of a website that runs in your browser. |
| **Function** | A named, reusable set of instructions that can take inputs and return an output. |
| **Git** | Software that records the history of changes to files. |
| **GitHub** | A website that hosts Git repositories online. |
| **Hook** | A React function whose name starts with `use…` and that gives a component extra abilities (state, effects, data). |
| **HTML** | The language that structures a web page's content. |
| **HTTP / HTTPS** | The rules browsers and servers use to send requests and responses. HTTPS is the encrypted version. |
| **IIIF** | A standard many museums use to serve images at any size (pronounced "triple-eye-eff"). |
| **ISR** | Incremental Static Regeneration: Next.js builds a page once, serves it quickly, and refreshes it now and then. |
| **JavaScript (JS)** | The programming language of the web. |
| **JSON** | A text format for data that looks like `{ "title": "Water Lilies" }`. |
| **JSX / TSX** | HTML-like markup written inside JavaScript or TypeScript, used by React. |
| **localStorage** | A small storage space inside your browser. Favourites are stored there. |
| **Markdown (.md)** | A simple way to write formatted text, used for these docs. |
| **Node.js** | A program that runs JavaScript outside the browser, on your computer or a server. |
| **npm** | Node's package manager: it downloads libraries and runs project commands (`npm install`, `npm run dev`). |
| **Object** | A group of named values, for example `{ title: 'Water Lilies', year: 1906 }`. |
| **Props** | The inputs you pass to a React component, like settings. |
| **Pull / push** | Download (pull) or upload (push) commits to GitHub. |
| **Repository (repo)** | A project folder tracked by Git, including its full history. |
| **Request / response** | A message asking for something, and the reply. |
| **Route** | A URL path that maps to a page or an API, for example `/explore`. |
| **Server** | A computer that answers requests. |
| **SPARQL** | The query language used to ask Wikidata questions. |
| **State** | Data a component remembers and that can change, such as whether a heart is filled. |
| **Taxonomy** | A system of categories. Here: regions, eras and styles (`src/taxonomy/`). |
| **Test** | Code that checks other code behaves correctly (`tests/`, run with `npm test`). |
| **Type** | A label saying what kind of data something is (text, number, `Artwork`…). TypeScript checks them. |
| **TypeScript (TS)** | JavaScript plus types. |
| **URL** | A web address, such as `https://example.com/explore?regions=africa`. The part after `?` is the **query string**. |
| **Vercel** | The hosting service that runs this website. |
| **VS Code** | Visual Studio Code, a free code editor. |
