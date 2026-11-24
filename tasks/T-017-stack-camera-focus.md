# T-017 Viz: camera, stack guides, layer focus, one timeline (C1–C3, C7)
**Approved by Lara 2026-11-24 via master plan T-012** · brief B-032 · agent: coder (D-024: agents write viz code this pass)

**Goal:** the stack can be turned and tilted, reads as six distinct planes linked by guides, focuses one layer on hover, and every layer runs on one decade slider.

**Do:**
1. Camera (C1): left-drag horizontal = bearing, vertical = pitch; pitch range ~20°–85° (unlock `minPitch/maxPitch`). Default `GAP_M` ≈ 300 km (was 120 km); initial view frames all six exploded planes.
2. Plane frames (C2): a faint outline of the shared `extent` (relief_bounds.json) on each plane, at that plane's height; a number 01–06 beside each plane's front-left corner (bottom = 01).
3. Vertical guides (C2): dotted vertical lines at the four extent corners from plane 01 to plane 06. Fixed number of dots per gap (≈ 12), so dots spread as the stack explodes and close as it collapses (they follow `stack.t`).
4. Focus (C3): hovering a plane (an invisible pickable fill of its frame), any of its features, or its row in the layer list → that layer full opacity, the others ~15 %; leaving restores. Smooth 200 ms transition; none with `prefers-reduced-motion`.
5. One timeline (C7): a single decade slider 1770–1840 drives all layers (remove the cohort dropdown). Labelled ticks for the Pension Acts 1818, 1820, 1832, 1836, 1838 on the track. A small bar strip above the track: migration legs per decade from `flows.json` (state level, `decade`); legs with `decade = null` are excluded and their count is stated in a note under the strip.
6. Data load: switch L4 to the new `flows.json`/`nodes.json` shape (`decade`, `hub_lat/hub_lon`) just enough that it renders for the selected decade; full L4 redesign is T-018.
7. L1: draw lakes above the borders (covers county lines crossing small lakes); remove nothing else.
Design (frontend-design guidance): the guides are the one memorable element; everything else stays quiet. Sentence case, no all-caps labels, no decorative chrome. Full styling comes later (Lara).

**Files:** `web/src/**`, `web/index.html`. Not `web/data`.

**Done when:** `npm run build` passes; in the browser: drag turns and tilts; guides stretch with explode/collapse; hover fades the other layers; one slider moves every layer; Act ticks and the decade strip show. Screenshots (exploded, collapsed, hover focus) in scratch.

**Why an agent:** D-024; Lara reviews in the browser.

**Result (coder, 2026-11-24):** all seven steps in `web/src/**` and `web/index.html`; `npm run build` passes; checked in headless Chrome against `vite preview` (screenshots in the coder's scratch folder).
1. Camera: `config.js` pitch 20°–85° (start 60°, bearing 0), `GAP_M` 300 km, zoom 3.6, `position: [0, 0, 2.5 × GAP_M]` so the camera orbits the middle of the exploded stack and frames all six planes. Left-drag turns and tilts (`dragMode: 'rotate'`); right- or shift-drag pans.
2. Plane frames: new `src/frames.js`. A faint outline of `relief_bounds.json` `extent` on each plane, and its number 01–06 beside the south-west (front-left) corner. Numbers 02–06 fade in as the stack opens, so they don't pile on 01 when collapsed. The hovered plane's frame and number turn dark.
3. Guides: dotted verticals at the four extent corners, 12 dots per gap, positions × `stack.t`, so they spread and close with explode/collapse (hidden when fully collapsed).
4. Focus: new `src/focus.js`. Each plane has an invisible pickable fill (alpha 1/255, since alpha 0 isn't picked). Hovering the fill, a feature, or the layer's row in the side list sets that layer to full opacity and the others to 15 %, via `clone({ opacity })`, so each layer's own opacity (relief 0.5) is kept. 200 ms linear fade, instant with `prefers-reduced-motion`. Map and list are tracked separately, and the list wins, so moving from the canvas to the list doesn't clear focus.
5. One timeline: cohort dropdown removed (`COHORTS` → `ACTS`). The slider is 1770–1840 by decade. Act ticks for 1818, 1820, 1832, 1836 and 1838 sit on the track, with labels on two staggered rows (1818/1820 and 1836/1838 are two years apart). The bar strip shows state-level legs per decade (selected decade dark). The note says 514 undated legs are not shown. The label reads e.g. "1830 · moves 1830–39: 22,392 · borders as of 1830". The slider got a minimal custom track and thumb so the strip and ticks line up with the thumb.
6. L4: flows filtered on `decade === state.year`; hubs at `hub_lat/hub_lon` (centroid fallback). Nothing else changed (T-018).
7. L1: lakes are drawn last, above the county and state lines.
- Tested (Chrome 1440×900): collapsed and exploded views; drag turns and tilts, and the clamp holds at 20° and 85°; the guides stretch and close; hovering the list row (Migration) and plane 01 on the map fades the rest, and moving off restores it; the slider at 1830 moves every layer and highlights the 1830s bar. Console: no errors besides a 404 for the missing favicon. Reduced motion was not tested in the browser.
- Left: `web/README.md` still mentions the cohort menu, and its file table lacks `frames.js`/`focus.js` (not in this task's files). A jump straight off a plane can keep focus for one hover event until the pointer moves again; deck reports the last pick.
