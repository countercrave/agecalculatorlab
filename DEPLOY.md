# Deploy — Age Calculator Lab

Everything you need is in this folder. **Upload the contents of this folder** (not the folder
itself) to your web root, so that `index.html` sits at the top level of the site.

161 calculators · 100 guides · 290 pages · about 26 MB

## Fix the current 502 before measuring SEO

During the August 20, 2026 review, the live `www` homepage returned **502 Bad Gateway — connection closed** in repeated external checks. A 502 is an origin, proxy, CDN or hosting problem; replacing the HTML files alone may not solve it.

Before or immediately after uploading, ask the hosting provider to confirm:

- the domain's A/AAAA records point to the active hosting account;
- the `www` hostname reaches the same working site as the preferred canonical host;
- any CDN or reverse proxy can connect to the origin over the configured HTTP/HTTPS port;
- the SSL mode matches the origin certificate and does not create a proxy loop;
- the web root is `public_html` (or the host's documented equivalent);
- server logs do not show repeated upstream, timeout or connection-closed errors.

Do not request indexing while the live URL is returning a 5xx response.

---

## The one rule that matters

Get this wrong and every page 404s:

```
✅  public_html/index.html          ← contents uploaded
❌  public_html/age-calculator-lab-2026/index.html   ← folder uploaded
```

If you unzip and see a folder, go *inside* it and upload what's there.

---

## By host

**cPanel / shared hosting (Hostinger, Bluehost, GoDaddy, Namecheap)**
File Manager → `public_html` → Upload the zip → Extract → move the contents up one level if
extraction created a folder. The included `.htaccess` handles the redirects, the 404 page and
cache headers automatically.

**Netlify** — drag this folder onto the deploy area, or connect a repo with the publish
directory set to this folder. `_redirects` is picked up automatically.

**Cloudflare Pages** — same as Netlify; `_redirects` works there too.

**Vercel** — drag or connect a repo. `vercel.json` is picked up automatically.

**GitHub Pages** — push the contents to your repo. Note that GitHub Pages ignores `.htaccess`,
`_redirects` and `vercel.json`, so the six legacy URLs will fall back to the HTML redirect pages,
which still work but are slower and pass link equity less cleanly.

**Nginx / VPS** — point the server root here. Add this to your server block:

```nginx
error_page 404 /404.html;
location = /how-old-am-i/              { return 301 /tools/age-calculator/; }
location = /dog-age-calculator/        { return 301 /tools/dog-age-calculator/; }
location = /age-difference-calculator/ { return 301 /tools/age-difference-calculator/; }
location = /corrected-age-calculator/  { return 301 /tools/corrected-age-calculator/; }
location = /privacy-policy/            { return 301 /privacy/; }
location = /terms-of-use/              { return 301 /terms/; }
```

---

## After it's live — check these six things

1. `https://www.agecalculatorlab.com/` loads and looks right.
2. A calculator computes — try `/tools/age-calculator/`, enter a date, press Calculate.
3. `/tools/business-days-calculator/` with a holiday calendar selected excludes holidays.
4. `/how-old-am-i/` loads as a complete calculator page.
5. `/sitemap.xml` loads and shows 283 URLs.
6. `/tools/age-calculator/` redirects to the homepage and `/dog-age-calculator/` redirects to `/tools/dog-age-calculator/`.
7. A made-up URL like `/does-not-exist/` shows the styled 404, not a host error page.

Then submit `https://www.agecalculatorlab.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools. In Search Console, run **URL Inspection → Test Live URL** for the homepage, `/how-old-am-i/`, `/tools/chronological-age-calculator/`, `/tools/age-difference-calculator/` and one guide. Request indexing only after each live test succeeds.

---

## HTTPS and the www prefix

Every canonical URL in the build points at `https://www.agecalculatorlab.com`. Two things
must be true or the canonicals will fight your live URLs:

- HTTPS is enabled (free via Let's Encrypt on most hosts).
- The non-www version redirects to www — not the other way round.

If you would rather run without the `www`, tell me and I'll regenerate the build with the
canonicals, sitemap and schema pointing at the apex domain. It is a one-line change on my side
and a site-wide problem if it is done by hand.

---

## What is deliberately not in this folder

Removed because it belongs to the build, not the server:

- `scripts/` — the old generator scripts. **`enhance-static.mjs` is stale and would destroy
  the site if run.** Kept out of the web root on purpose.
- `source-art/` — 3.5 MB of source artwork used to make thumbnails.
- `tools.json` / `articles.json` — build inputs. Nothing on the site loads them at runtime.
- `README.md`, `CHANGELOG-2026-08-16.md` — documentation.

All of these are in the full archive zip. Keep that somewhere safe; it is what you or I would
need to make future changes.

---

## Making changes later

Do not hand-edit 290 HTML files. `tools.json` and `articles.json` are the source of truth for
counts, navigation, the sitemap and every directory page. Change those and regenerate, or the
numbers drift apart again the way they had before this rebuild.

Last built and reviewed 20 August 2026.
