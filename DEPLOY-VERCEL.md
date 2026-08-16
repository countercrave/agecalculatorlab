# Publishing to Vercel

Fresh deploy. 161 calculators · 100 guides · 284 pages · 282 sitemap URLs · 28 MB.

This is a **finished static site**. No build step, no framework, no dependencies, no `package.json`.
Vercel just serves the files.

---

## Option A — Vercel CLI (fastest, no GitHub needed)

Open a terminal in this folder:

```bash
npm i -g vercel      # once
vercel login         # once
vercel --prod
```

When it asks:

| Prompt | Answer |
|---|---|
| Set up and deploy? | **Y** |
| Which scope? | your account |
| Link to existing project? | **N** (first time) |
| Project name? | `agecalculatorlab` |
| In which directory is your code located? | **`./`** |
| Want to modify these settings? | **N** |
| Build Command | **leave empty** |
| Output Directory | **leave empty** (serves the root) |
| Development Command | **leave empty** |

If it ever auto-detects a framework, choose **Other**. There is nothing to build.

---

## Option B — GitHub → Vercel (better for future updates)

```bash
git init
git add -A
git commit -m "Age Calculator Lab 2026 rebuild"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/agecalculatorlab.git
git push -u origin main
```

Then in Vercel: **Add New → Project → Import** the repo, and set:

- **Framework Preset:** Other
- **Build Command:** *(empty)*
- **Output Directory:** *(empty)*
- **Install Command:** *(empty)*
- **Root Directory:** `./`

Every future `git push` redeploys automatically.

> Confirm `vercel.json` and `.gitignore` are staged before pushing. `git status` should list
> `vercel.json`. Some git configurations skip dotfiles, and `vercel.json` carries the
> trailing-slash and caching rules.

---

## The prompt to give Antigravity

Open this folder as a project, then paste:

```
This folder is a finished static website: 284 pre-built HTML files, no build step, no
framework, no package.json, no dependencies.

Do NOT modify, reformat, minify, or "optimise" any file. Do NOT add a framework, a
build pipeline, a package.json, or a bundler. Do NOT touch vercel.json.

Deploy it to Vercel as a production deployment:
1. Run: vercel --prod
2. When prompted, set the project name to agecalculatorlab, the root directory to ./,
   and leave Build Command, Output Directory and Install Command empty. If it asks for
   a framework preset, choose Other.
3. Report the production URL when it finishes.
4. Then fetch these five URLs on the live site and tell me the HTTP status of each:
   /  /tools/age-calculator/  /articles/  /sitemap.xml  /does-not-exist/
   The last one should be 404 and should render the site's own styled 404 page.

If any step suggests running a build, stop and tell me instead of proceeding.
```

**Why the negative instructions are there.** An agent asked to deploy a website will often try to
help: minify the CSS, add a build pipeline, install a framework it recognises, prettify the JSON-LD.
Each would break something here — `style.css` has a deliberately ordered cascade where the
dark-mode block must stay after the light-mode rules, and the schema blocks across 284 pages can be
invalidated by a reformatter. The site is finished. It needs transport, not improvement.

---

## Domain setup — the part that matters most

Every canonical URL, sitemap entry and schema block in this build points at
**`https://www.agecalculatorlab.com`** — with the `www`.

In **Vercel → Project → Settings → Domains**:

1. Add `www.agecalculatorlab.com` and make it the **primary** domain.
2. Add `agecalculatorlab.com` and set it to **redirect to** `www.agecalculatorlab.com`.

That direction matters. If Vercel is left on its default — apex primary, www redirecting to it —
then every canonical tag on the site will point at a URL that redirects, which is a
self-inflicted SEO problem across all 284 pages.

HTTPS is automatic on Vercel; no action needed.

> If you would rather run on the bare `agecalculatorlab.com`, say so and I will regenerate the
> build with canonicals, sitemap, schema and `llms.txt` pointing there. It is one change on my
> side and a site-wide inconsistency if done by hand.

---

## What `vercel.json` does

- `trailingSlash: true` — every internal link and canonical in this build ends in `/`. Without
  this, Vercel would strip the slash and redirect, so canonicals would point at redirecting URLs.
- Cache headers — one year immutable on `/assets/` and on images, so the 261 thumbnails and the
  CSS/JS are served from cache on repeat visits.
- Security headers — `nosniff`, `SAMEORIGIN`, a sane referrer policy, and permissions locked down
  for geolocation, microphone and camera, none of which this site uses.

`cleanUrls` is deliberately **off**. Nothing on the site links to a bare `.html` file, so enabling
it would only add surprise redirects with no benefit.

---

## After it goes live — six checks

1. `https://www.agecalculatorlab.com/` loads and looks right
2. `/tools/age-calculator/` — enter a date, press Calculate, get a result
3. `/tools/business-days-calculator/` — pick a holiday calendar, confirm holidays are excluded
4. `/sitemap.xml` loads and shows 282 URLs
5. `/does-not-exist/` shows the site's styled 404, not Vercel's default
6. `agecalculatorlab.com` (no www) redirects to the www version — **not** the reverse

Then submit `https://www.agecalculatorlab.com/sitemap.xml` in Google Search Console.

---

## Making changes later

Do not hand-edit 284 HTML files. `tools.json` and `articles.json` in the full archive are the
source of truth for counts, navigation, the sitemap and every directory page. Change those and
regenerate, or the numbers drift apart the way they had before this rebuild.

Last built 16 August 2026.
