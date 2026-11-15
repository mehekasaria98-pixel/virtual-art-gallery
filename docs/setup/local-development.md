# Local development

## Requirements

- **Node.js 20 or newer.** Check with `node -v`. On Windows you can install it with:

```bash
winget install OpenJS.NodeJS.LTS
```

- Git

## Run the app

```bash
npm install
```

```bash
npm run dev
```

Open <http://localhost:3000>.

Optional: copy `.env.example` to `.env.local` and add any keys (see [api-keys.md](api-keys.md)).

## Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm test` | Unit tests (Vitest, no network) |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run build` then `npm start` | Production build and server, as on Vercel |
| `npm run fixtures` | Re-record the API test fixtures from the live APIs |

## Project layout

See [../technical/architecture.md](../technical/architecture.md#directory-map).

## Tips

- API responses are cached by Next.js. Delete the `.next/cache` folder to force fresh museum data.
- To test a single museum, add `&sources=aic` (or `met`, `cma`, `vam`, `wikidata`) to an Explore or `/api/artworks` URL.
- Wikidata rate-limits rapid repeated queries. If it shows a red "429" status, wait a minute.
