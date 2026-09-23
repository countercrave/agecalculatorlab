# Workspace Rules: Age Calculator Lab

## 1. Zero Text-Overlap & Visual Quality Rule (Mandatory)

Whenever generating images, SVGs, infographics, diagrams, or editing UI layout components (HTML/CSS):

1. **No Text Collisions / Overlaps:**
   - Text elements must **NEVER** overlap or collide with images, icons, graphics, borders, or adjacent text blocks.
   - Maintain strict bounding box separation, safe padding (`>= 16px` inner breathing room), and appropriate `line-height` (`1.4`–`1.6`).
   - For responsive multi-column layouts (e.g. decision trees, bento grids, comparison cards), ensure elements stack gracefully on mobile (`max-width: 768px` and `390px`) without text truncation or colliding cards.

2. **Strict Contrast & Legibility:**
   - **Dark Backgrounds** (e.g. `#042F2A`, `#075433`): All headings, subtext, and labels must be explicitly scoped to bright white (`#FFFFFF`) or high-contrast soft mint (`#D3E5DE`, `#9FE7BD`). Never allow generic cascading heading rules (`.article-body h3` / `h3`) to default text to dark green/ink over dark surfaces.
   - **Light Backgrounds** (e.g. `#FFFFFF`, `#F8FCFA`): Use standard deep forest ink (`#042F2A`, `#0D2B23`) with WCAG AAA readability.

3. **Mandatory Visual Inspection Before Completion:**
   - Never finalize or present a visual change to the user without first rendering and inspecting a browser screenshot across desktop and mobile viewports.
   - Verify every heading, subtitle, card verdict, and graphic caption for 100% clarity and zero visual overlap.

4. **Preserve Calculator-First Identity:**
   - Keep the established deep green palette (`#075433`, `#042F2A`), coral accents (`#FF754D`, `#FF9A77`), serif display typography (*Fraunces*), and clean sans-serif body (*Inter*).
