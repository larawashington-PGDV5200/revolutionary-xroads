# T-011 Shared map extent; lighter relief with transparent Great Lakes
**Approved by Lara 2026-11-23** · brief B-024 · agent: coder

**Goal:** every map layer shares the topography extent; a lighter `relief.png` with the Great Lakes see-through.

**Why:** the layers stack on one footprint, so they share one maximum size (Lara: a hard line at −100° is accepted).
`relief.png` is 8.4 MB after T-010. Lakes Michigan, Huron and Erie have ETOPO values > 0, so they are shaded as land.

**Found (main session, 2026-11-23):** outside the relief bounds [−100, 24.908, −66.617, 47.442]:
Royce cessions 312 / 724 cross; infrastructure 8 / 402; rivers 3 / 993 (rounding at the edge). Removal routes, state cessions,
ads and reservations are inside. Migration nodes: 7 / 3,343 outside (OR, CA, TX): **left as they are** (Lara, option a).

**Do:**
1. E01: downsample `relief.png` by 2 (≈ 2003 × 1352) and update `width`, `height`, `cell_deg` in `relief_bounds.json`.
2. E01: make Natural Earth lake polygons (the set in `water.topojson`) transparent in `relief.png`.
3. E01: write the shared extent to `relief_bounds.json` as `extent` (= relief bounds); clip `water.topojson` to it.
4. C01: clip `royce_cessions` and `trail_of_tears` to that extent; report counts before/after (features entirely outside drop out).
5. D01: clip `infrastructure` to that extent.

**Files:** `rx-pipeline/notebooks/E01_base.ipynb`, `C01_native.ipynb`, `D01_infrastructure.ipynb`; `web/data/relief.png`,
`relief_bounds.json`, `water.topojson`, `native_land.topojson`, `removal_routes.topojson`, `infrastructure.topojson`. This file (Result).

**Done when:** every TopoJSON decodes in topojson-client with all coordinates inside the extent; `relief.png` < 3 MB with
Michigan, Huron and Erie transparent in the preview; count changes reported.

**Why an agent:** mechanical clip and re-run; Lara reviews the preview and counts.

**Result (coder, 2026-11-23):**
- Shared extent: E01 writes `extent` (= relief bounds [−100, 24.9083, −66.6167, 47.4417]) to `relief_bounds.json`; C01 and D01 read it from there. Crossing features are cut
  (`clipped_to_extent = true`); features wholly outside drop out; rows with no geometry stay. Borders were already inside; borders.topojson is byte-identical after the re-run.
- Counts before → after: water rivers 993 → 993, lakes 243 → 243, coast 139 → 139 (the 3 rivers + 1 coast line were only cut at the east edge);
  royce_cessions 724 → 450 (274 dropped, all ceded after 1840: CA, WA, NM, AZ, OR, MT, MN …; 38 cut, 8 of them ceded ≤ 1840; 7 no-polygon rows kept);
  state_cessions 5 → 5; pre1784_lines 2 → 2; trail_of_tears 2,006 → 2,006 (all inside); infrastructure 402 → 395 (7 steamboat stretches dropped: 6 in OR/WA, 1 on the upper Missouri; 1 Missouri stretch cut).
  Cut Royce areas keep the USFS `SHAPE_AREA`/`SHAPE_LEN`; cut lines keep Atack `miles`.
- relief.png: shade computed at full resolution, then 2 × 2 block mean of land cells (land if ≥ 2 of 4); 4006 × 2704 → 2003 × 1352, cell 0.01667°, bounds unchanged.
  Pixels whose centre falls inside a `water.topojson` lake polygon are transparent: 92,790 px, 81,416 of them shaded as land before (Erie, Huron, Michigan 100 % transparent now).
  Size 8.36 → 1.67 MB. `relief_bounds.json` records `downsample` and `lakes`. Terrarium PNG unchanged.
- Check: the T-010 topojson-client helper now also returns each object's decoded bbox; new `assert_inside` asserts it lies within the extent. E01 (water, borders), C01 (native_land,
  removal_routes) and D01 (infrastructure, helper added) all assert it. E01 also asserts relief.png < 3 MB, dims = half the grid, and Michigan/Huron/Erie pixels transparent in the written PNG.
- Tested: E01, C01, D01 re-run top to bottom in `revx`, in that order; all assertion cells pass. Independent node scan of all 5 TopoJSON files: 0 features outside the extent.
  Preview for Lara (session scratch folder, not in the repo): `T-011_relief_preview.png`.
