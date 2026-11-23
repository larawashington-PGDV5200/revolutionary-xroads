# T-010 Fix TopoJSON nesting (E01, C01) and hillshade contrast (E01)
**Approved by Lara 2026-11-23** · brief B-023 · agent: coder

**Goal:** the web files decode correctly in `topojson-client`, and the relief reads as relief.

**Found (2026-11-23, main session, testing the deck.gl skeleton):**
- The TopoJSON writers drop one level of arc nesting. E01 `to_topojson`: Polygon rings come out as
  `[3, 4]` instead of `[[3], [4]]`, and MultiPolygon as `[[3], [4]]` instead of `[[[3]], [[4]]]`.
  C01 `topo_encode` does the same for Polygon/MultiPolygon, and for MultiLineString (`[1, 2, 3]` instead of
  `[[1], [2], [3]]`). Affected: `borders.topojson` (all), `water.topojson` lakes, `native_land.topojson`
  royce_cessions, `removal_routes.topojson` (625 MultiLineStrings). Lines in E01 and all of D01 are fine.
  The notebooks' own decoders share the bug, so their round-trip checks passed.
- `relief.png` is nearly flat grey: z_factor 1 on 30″ cells leaves the eastern US with almost no shading.

**Do:**
1. Fix the writers (and the notebook decoders) in E01 and C01 to the TopoJSON spec; re-run both notebooks.
2. Add a check that decodes every output with the reference implementation (`web/node_modules/topojson-client`,
   via `node`) and asserts every ring has ≥ 4 closed positions and every line ≥ 2 positions.
3. Hillshade: add vertical exaggeration (z_factor) and, if needed, a contrast stretch; record the values in
   `relief_bounds.json`. Save a small preview PNG for Lara in the scratch folder (not in the repo).

**Files:** `rx-pipeline/notebooks/E01_base.ipynb`, `rx-pipeline/notebooks/C01_native.ipynb`;
`web/data/borders.topojson`, `water.topojson`, `relief.png`, `relief_bounds.json`, `relief_terrarium.png`,
`native_land.topojson`, `reservations.json`, `removal_routes.topojson`. This task file (Result section).

**Done when:** the topojson-client check passes for all four TopoJSON files; feature counts unchanged from
T-006/T-007; Appalachians, Ozarks and the Adirondacks are clearly visible in the preview; files < 10 MB.

**Why an agent:** a mechanical format fix and a re-run; Lara reviews the preview.

**Result (coder, 2026-11-23):**
- Fixed: E01 `to_topojson` + `read_topojson` and C01 `topo_encode` + `topo_decode` now nest arcs per the spec (Polygon `[[a0], [a1]]`,
  MultiPolygon `[[[a0], [a1]], …]`, C01 MultiLineString `[[a], [b]]`). C01's self-test now asserts the nesting and covers a MultiPolygon.
- Check: new helper `topojson_client_check` (in both notebooks) decodes each file with `web/node_modules/topojson-client` via `node -e`;
  the assertion cells require the same feature counts, no bad rings (≥ 4 positions, closed), no bad lines (≥ 2 positions), nulls only where intended.
  Before the fix the same decoder broke borders 66/66 states + 2,809/2,809 counties, lakes 243/243, Royce 717/717 polygons, trail 625/2,006 segments.
- Counts unchanged (before = after): states 66, counties 2,809; rivers 993, lakes 243, coast 139; royce_cessions 724 (717 polygons, 7 null),
  state_cessions 5, pre1784_lines 2; trail_of_tears 2,006; reservations 66 (file byte-identical). Royce is 724, not T-007's 299, because of the
  later no-cutoff change (`WINDOW_END = 9999`, commit 409297b).
- Hillshade: `Z_FACTOR = 5`, linear stretch between the 1st and 99th percentile of land cells (shade 0.471–0.858 → 0–255). Both are in
  `relief_bounds.json` → `hillshade`. Land grey went from 169–190 (p1–p99) to 0–255, median 155. Terrarium PNG is unchanged and not exaggerated.
- Sizes: relief.png 8.4 MB (was 3.3 MB, more contrast compresses less; still < 10 MB), borders 3.2, water 0.6, native_land 2.7, removal_routes 4.0 MB.
- Tested: both notebooks ran top to bottom in `revx`; all assertion cells pass. Preview of `relief.png` for Lara is in the session scratch folder (not in the repo).
