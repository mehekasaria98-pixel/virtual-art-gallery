# Optional API keys

The site works without any keys, using the Art Institute of Chicago, the Met, the Cleveland Museum of Art, the V&A and Wikidata.

Three more sources switch on automatically when you add their free key:

| Source | Adds | Environment variable |
|---|---|---|
| Harvard Art Museums | Asian, European and American art | `HARVARD_API_KEY` |
| Europeana | Thousands of European museums | `EUROPEANA_API_KEY` |
| Smithsonian Open Access | National Museum of African Art, Asian and American art | `SMITHSONIAN_API_KEY` |

Keys are only ever used on the server. They are never sent to visitors' browsers.

> **Keep keys secret.** Don't commit them to Git, paste them into issues or chat, or put them in front-end code. Store them only in `.env.local` (which Git ignores) and in Vercel's Environment Variables.

## Harvard Art Museums

1. Go to <https://harvardartmuseums.org/collections/api>.
2. Click **Send a request** and fill in the form (name, email, a short description such as "Personal art-history website using open collections").
3. Your key arrives by email, usually within minutes.
4. Set it as `HARVARD_API_KEY`.

Terms: non-commercial use only. The adapter drops works whose images Harvard doesn't allow to be shown.

## Europeana

1. Go to <https://pro.europeana.eu/page/get-api>.
2. Fill in the request form. Choose **Search API** if you're asked which API you need.
3. Your key (the "wskey") arrives by email.
4. Set it as `EUROPEANA_API_KEY`.

Europeana is only queried when no region is chosen or **Europe** is chosen.

## Smithsonian (api.data.gov)

1. Go to <https://api.data.gov/signup/>.
2. Enter your name and email. The key is shown on screen and emailed to you.
3. Set it as `SMITHSONIAN_API_KEY`.

The default limit is about 1,000 requests per hour, which is plenty with the app's caching.

## Adding the keys

**Locally:** create a file called `.env.local` in the project root (next to `package.json`):

```
HARVARD_API_KEY=your-key-here
EUROPEANA_API_KEY=your-key-here
SMITHSONIAN_API_KEY=your-key-here
```

Then restart `npm run dev`.

**On Vercel:**
1. Open **Project → Settings → Environment Variables**.
2. Add each variable. Tick the **Production** and **Preview** environments.
3. **Redeploy** the latest deployment. Variables only take effect on a new deployment.

## Checking it worked

On the site, open Explore → **Sources & sorting**. Each keyed museum should show a checkbox instead of "key needed". After a search, it should show a green dot with a count. You can also visit `/api/sources`; `"enabled": true` means the key was picked up.

> **Note:** the Harvard adapter was written from Harvard's API documentation and hasn't been tested with a real key yet. The Europeana and Smithsonian adapters were checked only against their public demo keys. If a source shows a red dot after you add its key, hover over the dot to see the error message.
