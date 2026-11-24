# T-018 Viz: migration layer redesign (C4)
**Approved by Lara 2026-11-24 via master plan T-012** · brief B-033 · agent: coder · after T-017

**Goal:** a readable, directional migration layer with hub isolation and tooltips.

**Do:**
1. Hubs at `hub_lat/hub_lon` (state nodes). Default: draw only flows ≥ 25 people for the decade shown; a small control lowers the threshold.
2. Colour: the 8 hubs with most people out (all decades) each get a distinct hue; others share a neutral. A flow takes its origin hub's colour. No reds (reserved for Native layers). Check the palette with the dataviz skill's validator (`~/.claude/skills/dataviz` or the plugin path; read its palette reference) for distinguishability on the earth-toned relief.
3. Direction: no arrowheads. Flows taper wide at origin → thin at destination, plus slow particles drifting origin → destination (vector-field feel; flowmap.gl animation or a TripsLayer). No particles under `prefers-reduced-motion`.
4. Hover a hub → only its in- and out-flows shown (in = destination-colour, out = origin colour), others hidden; tooltip: state name, people out, people in, top 3 destinations and top 3 origins, for the decade shown. Click keeps the selection; Esc clears.
5. The per-person path stays as click detail.
6. Legend entry for hub colours and the taper (wide end = leaving).

**Files:** `web/src/layers/L4-migration.js`, plus `config.js`, `main.js`, `ui.js`, `style.css` as needed.

**Done when:** build passes; screenshots of 1790s, 1830s, a hovered hub with tooltip.

**Why an agent:** D-024.

**Added (orchestrator, 2026-11-24, from T-017 screenshots):**
7. Default camera: planes overlap too much head-on. Set a three-quarter view like the reference plate (bearing ≈ −25°, pitch ≈ 45–55°) and frame it so each exploded plane is visibly separate on screen; keep T-017's drag behaviour.
8. Update `web/README.md` (no cohort menu; list `frames.js`, `focus.js`).
9. Fix the stale-hover issue from T-017 (focus stays after one jump off a plane): clear focus on `onHover` with no object and on pointer leave of the canvas.

**Result (coder, 2026-11-24):** steps 1–9 in `web/src/layers/L4-migration.js`, `config.js`, `main.js`, `ui.js`, `style.css` and `web/README.md`. `npm run build` passes. Checked in headless Chrome (1440×900) against the Vite dev server. Screenshots are in the coder's scratch folder (`t018/`).
1. Hubs: at `hub_lat/hub_lon`. By default only flows of 25+ people in the decade shown are drawn. A select in the new legend lowers this to 10, 5 or 1. Every state with a move in that decade stays as a hoverable dot even when its flows are under the threshold. Only moves between two different states are drawn. California and Oregon Territory are outside the shared extent, so their 4 one-person flows aren't drawn.
2. Colour: the top 8 states by people out over all decades are MA, CT, VA, NC, PA, NY, NJ and NH. They take `HUB_PALETTE` in rank order: navy, mustard, forest, lavender, cerulean, violet, leaf green, mint. The order was picked so that neighbours (MA/CT, NY/NJ, VA/NC) get far-apart hues. Every other state is warm grey `#a9a59f`. There are no reds, oranges or plums, so nothing clashes with the Native layers or L2. The palette was found by search and checked with the dataviz skill's `validate_palette.py --pairs all` on white and on the relief at 50 % (`#d0c6b8`): **all checks pass**. Worst pair for normal vision is ΔE 17.7 (floor 15); worst colour-blind pair is ΔE 10.2 (target 8). Contrast is a WARN: mustard, lavender and mint fall under 3:1, and more hues do on the relief. The skill's relief rule applies, so each hub carries a direct label (its abbreviation), and the legend and tooltip name the states.
3. Direction: each flow is a curved band (a quadratic Bézier bent to the right of travel, so A→B and B→A don't overlap). It is 5 km × √people wide at the origin and tapers to 15 % of that at the destination, with no arrowheads. A 1 px centre line keeps small flows visible. Darker dots drift from origin to destination at a constant 90 km/s, 1–8 dots per flow (√people / 3). They are a custom per-frame `ScatterplotLayer`, not flowmap.gl, because flowmap.gl draws arrowheads and colours by magnitude, not by origin. With `prefers-reduced-motion` there are no dots and no redraw loop.
4. Hover a hub: only its in- and out-flows show, at any size. Out-flows take the origin colour and in-flows the destination colour, so per the spec both are the hovered state's colour, and the taper tells in from out. The tooltip shows the state name, people out, people in, top 3 destinations and top 3 origins for the decade. Click keeps the selection (a second click on the same hub lets go), and Esc clears it. Hubs and their labels are drawn above every plane, and the invisible plane fills now come first. Without that, the fills of the planes above would catch the pick wherever planes overlap on screen.
5. The per-person path stays. It is now ink, not red, because reds are kept for the Native layers.
6. Legend ("04 Migration" in the panel): hub swatches, a taper glyph ("wide end = leaving, thin end = arriving"), "width ∝ √people", the threshold select, a count of flows shown, and a note when nothing reaches the threshold.
7. Camera: bearing −25°, pitch 52°, zoom 2.85. `GAP_M` went from 300 km to 800 km, because at a 45–55° pitch a 2,500 km-deep plane hides a 300 km gap. At 800 km every plane's frame and contents read as separate, with some overlap of contents left. Full separation would need about 1,750 km per gap. The page now opens exploded (`stack.t = 1` in `main.js`), and drag behaviour is unchanged.
8. `web/README.md`: the cohort menu is gone, and `frames.js` and `focus.js` are listed.
9. Stale hover: `onHover` with no object now clears the map focus and the hovered hub, and so does `pointerleave` on `#map`.
- Tested: 1790 at 25+ shows hubs only, and the note says the largest flow is 22. At 5+ it shows 17 of 73 flows. 1830 shows 115 of 468. Hovering VA gives the isolation and the tooltip "Virginia … People out: 3,067 · in: 898 · To: Kentucky 869, North Carolina 564, Tennessee 473 · From: Pennsylvania 253, Maryland 176, North Carolina 124". Click kept it after the pointer moved away, and Esc cleared it. Hover → move onto the panel left all layers at full strength. Reduced motion: two frames 1 s apart were identical with `reduce` and different without it. Console: only the favicon 404.
- Left: 1770–1800 have no flow of 25+ (largest 37), so the default 1790 view shows hubs and the note only. Collapsed, the map sits low on screen, because the camera orbits the middle of the 4,000 km-tall exploded stack. `@flowmap.gl/*` is no longer imported but is still in `package.json`; I didn't remove it.
