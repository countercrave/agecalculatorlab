# Workspace Rules: Age Calculator Lab

## 1. Standard Site Header & Navigation (Mandatory)
Every new article, calculator, or page MUST strictly use the site-wide `<header class="site-header">` markup:
- Logo: `<a class="brand brand-image-link" href="../../" aria-label="Age Calculator Lab home"><img decoding="async" class="brand-logo brand-logo-nav" src="../../assets/age-calculator-lab-logo.png" alt="Age Calculator Lab — Calculate, Discover, Know" width="175" height="52" style="width:auto;max-width:180px;height:auto"></a>`
- Navigation structure: Include standard mobile menu button, Calculators mega-menu, Days & Dates mega-menu (`https://days.agecalculatorlab.com/`), Guides mega-menu, "Born in a year" link (`https://born-in.agecalculatorlab.com/born-in/`), Categories, Methodology, live search bar (`<div class="nav-search-wrap" id="nav-search-wrap">...</div>`), and the "Calculate age" CTA button (`<a class="nav-cta" href="../../#calculator">Calculate age</a>`).
- Never write simplified, unstyled, or ad-hoc header tags.

## 2. Standard Author Profile & Bio Card (Mandatory)
- Author Image: Always reference `assets/navjeet-kamboj.webp` (e.g. `../../assets/navjeet-kamboj.webp`).
- Structure: Always use the official `.author-card` with `.author-img`, `.author-name`, `.author-meta`, and `.author-bio`.
- Never use broken paths or placeholder calendar icons for author attribution.

## 3. Zero Text-Overlap & Visual Quality Rule (Mandatory)
Whenever generating images, SVGs, infographics, diagrams, or editing UI layout components (HTML/CSS):
1. **No Text Collisions / Overlaps:**
   - Text elements must **NEVER** overlap or collide with images, icons, graphics, borders, or adjacent text blocks.
   - Maintain strict bounding box separation, safe padding (`>= 16px` inner breathing room), and appropriate `line-height` (`1.4`–`1.6`).
   - Multi-column layouts (decision trees, bento grids, comparison cards) must stack gracefully on mobile (`390px` / `768px`).
2. **Strict Contrast & Legibility:**
   - **Dark Backgrounds** (`#042F2A`, `#075433`): Scope all headings and text to bright white (`#FFFFFF !important`) or high-contrast mint (`#D3E5DE`, `#9FE7BD`).
   - **Light Backgrounds** (`#FFFFFF`, `#F8FCFA`): Use standard deep forest ink (`#042F2A`, `#0D2B23`).
3. **Mandatory Visual Inspection:**
   - Render and inspect browser screenshots across desktop and mobile before marking visual tasks complete.

## 4. Preserve Calculator-First Identity
- Deep green palette (`#075433`, `#042F2A`), coral accents (`#FF754D`, `#FF9A77`), serif display typography (*Fraunces*), and clean sans-serif body (*Inter*).

## 5. Site-Wide Number Reconciliation & Evergreen Footers (Mandatory)
1. **Never Hardcode Numbers in Footers:**
   - In `<footer class="footer">` or `.footer-brand-panel`, never hardcode counts of tools or guides (e.g. "164 focused calculators and 126 practical guides...").
   - Always use the clean, evergreen bio:
     `<p>Practical, verified calculators and guides for age, dates, milestones and planning. No registration required.</p>`
   - In the footer guides column, always use:
     `<a class="footer-guides-all" href="../../articles/">Browse all guides →</a>` (without hardcoded numbers).
2. **Strict Site-Wide Data Reconciliation:**
   - Whenever any new calculator or article is published:
     - Audit and synchronize `search-index.json`, `assets/search-index.json`, `assets/app.js` (`SITE_SEARCH_INDEX`), `llms.txt`, and `sitemap.xml`.
     - Update category hub counts and the main directory headers/eyebrows where live counts are intentionally displayed.
