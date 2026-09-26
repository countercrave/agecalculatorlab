# Workspace Rules: Age Calculator Lab

## 1. Standard Site Header & Navigation (Mandatory)
Every new article, calculator, or page MUST strictly use the site-wide `<header class="site-header">` markup:
- Logo: `<a class="brand brand-image-link" href="../../" aria-label="Age Calculator Lab home"><img decoding="async" class="brand-logo brand-logo-nav" src="../../assets/age-calculator-lab-logo.png" alt="Age Calculator Lab — Calculate, Discover, Know" width="175" height="52" style="width:auto;max-width:180px;height:auto"></a>`
- Navigation structure: Include standard mobile menu button, Calculators mega-menu, Guides mega-menu, "Born in a year" link (`https://born-in.agecalculatorlab.com/born-in/`), Categories, Methodology, live search bar (`<div class="nav-search-wrap" id="nav-search-wrap">...</div>`), and the "Calculate age" CTA button (`<a class="nav-cta" href="../../#calculator">Calculate age</a>`).
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
