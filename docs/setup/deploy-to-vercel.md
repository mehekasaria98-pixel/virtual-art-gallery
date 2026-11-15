# Deploy to Vercel (free Hobby plan)

You need a GitHub account and a Vercel account; both are free. No API keys are needed for the first deployment.

## 1. Put the code on GitHub

If the repository isn't on GitHub yet:

1. Go to <https://github.com/new>.
2. Create an **empty** repository (no README, no .gitignore), for example `virtual-art-gallery`. Private is fine.
3. In this project folder, run (replace `YOUR-USERNAME`):

```bash
git remote add origin https://github.com/YOUR-USERNAME/virtual-art-gallery.git
```

```bash
git push -u origin main
```

If Git asks you to sign in, use the browser window it opens, or a GitHub personal access token as the password. Never paste a token into chat or into code.

## 2. Create the Vercel project

1. Go to <https://vercel.com/signup> and choose **Continue with GitHub**. Pick the **Hobby** plan when asked.
2. Allow Vercel access to your GitHub account. You can restrict it to the `virtual-art-gallery` repository.
3. On the Vercel dashboard, choose **Add New… → Project**.
4. Find `virtual-art-gallery` and click **Import**.
5. Check the settings. Vercel detects them automatically:

| Setting | Value |
|---|---|
| Framework Preset | **Next.js** |
| Root Directory | `./` |
| Build Command | `next build` (default) |
| Output Directory | default |
| Install Command | default (`npm install`) |
| Node.js version | 20.x or 22.x (Project → Settings → General) |

6. Leave **Environment Variables** empty for now.
7. Click **Deploy**. The build takes about 1–2 minutes.
8. When it finishes, click the preview image or **Visit**. Your site is live at `https://virtual-art-gallery-xxxx.vercel.app`.

## 3. Every change deploys itself

Each `git push` to `main` triggers a new production deployment. Pushes to other branches get their own preview URLs.

## 4. (Optional) Add the API keys

See [api-keys.md](api-keys.md). In short:

1. In Vercel, open **Project → Settings → Environment Variables**.
2. Add `HARVARD_API_KEY`, `EUROPEANA_API_KEY` and/or `SMITHSONIAN_API_KEY`. Tick the **Production** and **Preview** environments.
3. Open **Deployments**, click **⋯** on the latest deployment, then **Redeploy**. Environment variables only take effect on a new deployment.
4. On the site, open Explore → **Sources & sorting**. The new museums should no longer say "key needed".

## 5. (Optional) A custom domain

Open **Project → Settings → Domains** and add a domain you own. Vercel shows the DNS records to create at your domain registrar. HTTPS is set up automatically.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Build fails with `ENOENT … docs/user-guide` | The `docs/` folder must be committed. The Guide page is built from it. |
| Build fails on fonts | Fonts are downloaded at build time from Google Fonts. Retry the deployment; this is usually a temporary network issue. |
| A museum shows "key needed" after adding a key | Check the variable name is exactly right (no spaces), then **Redeploy**. |
| Searches are slow the first time | Normal: the first visitor waits for the museums, and later identical searches are served from Vercel's cache. |
| Wikidata shows red with "429" | Wikidata is rate-limiting. It recovers on its own within minutes. |

## Staying on the free plan

The app needs no paid Vercel features. Image optimisation is switched off, there is no database and there are no cron jobs. Keep an eye on **Usage** in the Vercel dashboard, and see [../technical/caching-and-limits.md](../technical/caching-and-limits.md). The Hobby plan is for personal, non-commercial use.
