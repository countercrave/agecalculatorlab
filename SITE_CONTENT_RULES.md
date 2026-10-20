# Site Content Rules — Age Calculator Lab

These rules apply to every page published or edited on agecalculatorlab.com
and its subdomains. They exist because each rule below was broken at least
once and caught late. Check this file before any content publish.

## Rule 1 — Inventory counts must match ground truth, everywhere

Ground truth (as of 2026-10-20):

- Main site: **168 tools, 167 guides/articles** (source: count of page files in `tools/` and `articles/` — never a tally of search-index type labels; the index once double-listed 5 articles and produced a wrong 172 that spread across the site)
- Days subdomain: **215 pages** (source: days sitemap.xml)
- Born-in subdomain: **128 URLs** (source: born-in sitemap)

Counts are hard-coded in static HTML in MANY places. When the inventory
changes, update ALL of these in the SAME pull request:

- Homepage: hero/finder text, "Browse All N Guides" banner, stat blocks
- Nav dropdown on every page (incl. the days cross-link — see Rule 2)
- Tools directory page (`/tools/`) and search filter pills
- Categories index AND every category page (11) — headings and buttons
- Articles index (`/articles/`) eyebrow and headings
- About page
- 404 page buttons
- JSON-LD schema (ItemList counts, descriptions)
- `sitemap.xml` and `search-index.json`

Before merging, run a full-site sweep for the OLD numbers (e.g. search the
live sitemap URLs for `\d+ (calculators|tools|guides|articles)`) and confirm
zero stale values remain. A count fix is not done until the sweep is clean.

Also: `search-index.json` must never contain duplicate URLs — one entry per page.

## Rule 2 — Cross-subdomain counts describe the OTHER site's inventory

The nav link "Browse all N tools →" pointing to days.agecalculatorlab.com
must use the DAYS tool count, verified against the days sitemap/directory —
never the main-site count, and never a guessed number.

## Rule 3 — No fabricated numbers

No invented ratings, review counts, user counts, accuracy percentages, or
statistics anywhere (pages, schema, or meta). Accuracy ranges may be stated
only when the page's own content supports them (e.g. a cited model range in
the article itself). Wellness/pet/face-age outputs are educational
estimates and must be labelled as such.

## Rule 4 — No template commentary

Tool pages must carry real method content, not filler about the page
itself ("This page is designed around…", "The calculator stays first…").
The standard per tool page (R17): actual inputs, the method/formula, one
worked example verified against the calculator's own logic, an edge case,
and honest limits.

## Rule 5 — Unique titles and meta descriptions

Every page gets a unique title and meta description written for its own
search intent. Duplicate meta descriptions across pages are a defect
(found and fixed on 78 days pages, 2026-10-20). OG/Twitter tags and
JSON-LD headline/description must mirror the page title/meta.

## Rule 6 — Verify live

A change is not done when the PR merges. It is done when the change is
confirmed on the live site.
