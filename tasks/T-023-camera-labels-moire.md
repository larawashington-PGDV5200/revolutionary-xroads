# T-023 Viz: camera fit, plane names, no moiré
**Approved by Lara 2026-11-24** · brief B-043 · agent: coder (D-024: agents write viz code this pass)

**Goal:** the stack moves smoothly and frames itself, planes are labelled by name, and layer 5 stops shimmering in motion.

**Do:**
1. Collapse → camera eases (~800 ms, alongside `animateStack`) to pitch 0, bearing 0, fitted to `extent` with padding. Explode → back to `INITIAL_VIEW`. While collapsed, refit on window resize.
2. 3D interaction best practice: controller inertia, smooth scroll zoom, zoom clamp, grab/grabbing cursor, "Reset view" button + R key, double-click zoom. All transitions instant under `prefers-reduced-motion`.
3. Plane labels by name: "01 Topography", "02 Native land", … from `STACK` labels (frames.js).
4. Layer 2 title: "Native land, as of {year}" in the legend (follows the slider); plane label "Native land". Reverses the D-028 title "Native land not yet ceded" (Lara).
5. Layer 5: replace pixel hatches (ceded; before-1784 levels) with flat madder tints; uncertainty = 3 alpha steps; legend swatches to match.

**Files:** `web/src/**`, `web/index.html`. Not `web/data`.

**Done when:** `npm run build` passes; collapse animates to a fitted top-down view and refits on resize; explode returns to the three-quarter view; planes read "01 Topography" etc.; layer 2 has the new title; layer 5 shows no shimmer when dragged. Screenshots in scratch.

**Why an agent:** D-024; Lara reviews in the browser.

**Result (coder, 2026-11-24):** all five steps in `web/src/**` and `web/index.html`; `npm run build` passes.
- Camera (`camera.js`, new): Collapse eases the view to pitch 0 / bearing 0, fitted to `extent`, over `EXPLODE_MS` with the same easing as `animateStack`. The orbit offset `position` goes to 0, so the fit centres on plane 01. Padding clears the panel, the plane label and the timeline. Explode eases back to `INITIAL_VIEW`. While collapsed, a resize refits at once. Wired in `main.js`; `ui.js` tells the camera when the stack button is pressed.
- Motion: inertia 300 ms, smooth scroll zoom, zoom clamp 2–9 (`INITIAL_VIEW`), double-click zoom, keyboard on, grab/grabbing cursor. "Reset view" button next to Explode, and the R key (ignored while typing in a control); both go to the view that fits the current state. Under `prefers-reduced-motion` the stack and camera move instantly, with no inertia or smooth zoom (`stack.js`, `camera.js`).
- Planes read "01 Topography" … "06 Settlement and routes" (`frames.js`). In `STACK`, L2 is now "Native land". The legend title "Native land, as of {year}" follows the slider (`NATIVE.l2Title`, `ui.js`).
- L5: `FillStyleExtension` hatches are gone. Ceded is a flat madder tint (alpha 80). The before-1784 levels are flat tints at alpha 120 / 70 / 30. Legend swatches and text now match ("the tint fades", "shaded zone").
- Also outside the list: `style.css` gets one rule for the button row.
- Tested in headless Chrome (1440×900) against `vite preview`. Exploded view: names are on the planes and the title reads "as of 1790", then "as of 1820" after the slider moves. Collapsed view: top-down, the extent fills the space between the panel and the timeline. Resized to 1100×760 while collapsed: it refits. Dragged while collapsed, then R: back to the fitted view. Explode returns to the three-quarter view. L5 close-up, alone and zoomed, before and during a drag: flat fills, no pattern. Console shows only the favicon 404. Not verified: the ease itself (software rendering is too slow to catch a mid-transition frame) and reduced motion in the browser. Lara to check both in a real browser.

**Result, follow-up B-044 (coder, 2026-11-24):** layer 5 reads apart from layer 2, and plane names no longer clip. `npm run build` passes.
- L5 ceded: a thin outline only (1.25 px, darker madder `#7A2A20`, `COLORS.cededLine`/`cededWidth`). The fill is 1/255, just so hover still works. Collapsed, the interior shows the relief and the edges still read beside the solid held fill. `COLORS.ceded` is removed.
- Before-1784 zone: a pale warm neutral (`#B09476`, `COLORS.taken`), outside the madder family. There are still 3 alpha steps, now low 180 / medium 120 / high 70. "High" was 30 and could not be seen. The dashed "left open" outline takes the same neutral.
- Legend: the ceded swatch is an outline box labelled "ceded (outline)" (new `.sw i.outline` rule in `style.css`). The zone swatches use the new tint and alphas.
- Plane names: each name now ends 6 px left of the plane's SW corner (a pixel offset, no longer 2.5 % of the extent). `labelModes` (`frames.js`) measures the text against the side panel and the screen edge. Each name shows in full, as the number only ("06"), as the number just inside the corner, or not at all when the corner itself is hidden. `main.js` tracks the view (`onViewStateChange`) and re-renders only when a mode changes, and again on resize.
- Files: `config.js`, `layers/L5-reservations.js`, `ui.js`, `style.css`, `frames.js`, `main.js`.
- Tested in headless Chrome against `vite preview`, with screenshots in scratch `t023b/` (`before-*` and `after-*`). Checked: exploded and collapsed at 1440×900, collapsed and zoomed, L5 alone, L1+L5 and L1+L2+L5 collapsed, and the legend. For names: 1000×760 at the default zoom (06 and 05 shorten to numbers), one step in (03–01 sit inside their corners, 04–06 are hidden behind the panel) and collapsed ("01 Topography" in full). Console shows only the favicon 404. Not verified: hover tooltips on the outline-only ceded areas (the 1/255 fill is the same approach as the "left open" layer).
