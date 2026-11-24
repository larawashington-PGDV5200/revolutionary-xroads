# T-022 Trace the 1763 Proclamation and 1768 Fort Stanwix lines, with uncertainty
**Approved by Lara 2026-11-24** ("trace but add variation to the hatching to show extra uncertainty and add note for extrapolated data") · briefs B-035 (historian) → B-036 (coder)

**Goal:** real geometry for `pre1784_lines`, so C01 can fill the "Taken before 1784" zone, with uncertainty carried per segment.

**Step 1 (historian):** `research/pre1784_lines_R11.csv`: line (proclamation_1763 / fort_stanwix_1768 / southern treaty lines De Vorsey maps), seq, lat, lon, anchor (named place/river/treaty call), source (Chicago author-date, page/plate), method (`described` = treaty or survey names the point; `mapped` = read from a published map; `extrapolated` = joined between anchors, e.g. along a divide), uncertainty_km (best estimate). Short notes in `research/R11-pre1784-lines.md`.
**Step 2 (coder, C01):** build the lines from R11 (segments keep `method` and `uncertainty_km`); re-run C01 so `before_1784` fills. Split the zone into pieces by the uncertainty of the bounding segment and add `uncertainty` (low/medium/high) + a `note` naming extrapolated stretches ("Line extrapolated between <a> and <b>; position uncertain by ~N km"). Keep every check.

**Files:** step 1 `research/` only; step 2 `rx-pipeline/notebooks/C01_native.ipynb`, `web/data/native_land.topojson`, this file (Result).

**Done when:** lines and zone in the preview with uncertainty visible; assertions pass.

**Why an agent:** sourced digitising; Lara reviews the preview.

**Result (coder, step 2, 2026-11-24):**
- **Lines (§3, `pre1784_lines`):** the two placeholders are replaced by **100 segments** (one feature per pair of R11 vertices, 7 lines, 107 vertices). Each segment takes the weaker `method` and the larger `uncertainty_km` of its ends, with a 3 km floor, plus a bucket `uncertainty` (low ≤ 10 km < medium ≤ 25 km < high), `path`, `citation`, `role` (`zone_edge` / `zone_edge_part` / `not_edge` / `reference`) and `zone_edge`. There are 42 river segments, all where both ends are `described`. They follow Natural Earth 10m rivers, read remotely: Ohio, Allegheny, W. Branch Susquehanna, Susquehanna and Kentucky, and every vertex is within 3 km of the NE line. Lycoming, Towanda, Unadilla, Little River and the North Fork Kentucky are not in NE 10m, and any segment with an extrapolated end stays straight. In both cases `path` gives the reason. The Proclamation is `role = reference` only.
- **Zone (§3b, `before_1784`):** the edge is Fort Stanwix (Wood Creek → Kanawha) → Donelson (Ohio, Kentucky, Long Island) → Lochaber (36° 30′) → Hard Labour (from the Lochaber corner to Tryon Mountain, then on to Towatuhe) → join → Augusta 1773 → Augusta 1763 to Santa Savilla. The zone is cut to the US of 1784 (E01 `borders.topojson`, 1784 snapshot), which removes Canada and Spanish Florida. It is also cut to E01's land mask, with every Royce polygon removed. Total **764,053 km²**, in **18 pieces**:
  - high: 49,593 km², 6 pieces (6.5 %). 35,619 km² of this is the two closure regions.
  - medium: 5,153 km², 5 pieces (0.7 %).
  - low: 709,312 km², 7 pieces (92.8 %). This includes the interior piece, 700,814 km².
  - Pieces are bands of ± `uncertainty_km` along each run of edge segments with the same line and bucket; overlaps go to the higher bucket. Every piece has `note` and `page_note` ("Cessions of 1775–83 (Henderson, DeWitt's Corner, Long Island of Holston, Augusta 1783) are not yet drawn."), and every extrapolated edge stretch is named in a note.
- **Closures assumed (all `closure_assumed = true`, all high), for Lara to check:**
  1. *North:* due north from Canada Creek on Wood Creek to the 1783 boundary. Northern New York, 32,930 km². This may be too large, because parts of it went to New York State after 1784.
  2. *South:* due south from Santa Savilla to the Georgia–Florida boundary, read from "Southward as far as Georgia extends". 2,689 km².
  3. *augusta_1773 seq 4 kept:* without it the 1773 Ceded Lands cannot close. Its segment and the 2 km join from Towatuhe are flagged and given 40 km bands, 3,811 km² together. If `USE_A73_SEQ4 = False`, the zone closes from Towatuhe to the Little River mouth instead and is 760,121 km², about 3,900 km² smaller. That join stays straight because the NE Savannah snap fails.
- **Checks:** the new asserts cover:
  - segments: count = vertices − lines; ends on the R11 vertices; method/uncertainty rule; bucket; year and citation; edge ids; reference role; only `augusta_1773:03-04` flagged.
  - pieces: no null geometry; they tile the zone (< 0.002 %); the label, note and page note; buckets; closures are high; no Royce overlap; inside the land mask, the US of 1784 and the edge polygon.
  - round trip: within 2 quantization steps.
  - all T-010/T-011 checks still run: topojson-client counts (pre1784_lines 100 lines, before_1784 18 features, 0 nulls, 0 bad rings) and the extent assert.
- **Side effects:** `native_land.topojson` grows from 1.82 to 2.16 MB. Its quantization bbox now reaches −66.98° (Maine), so Royce arcs are re-quantized (max deviation 0.0002°); Royce/state objects are otherwise unchanged. `reservations.json` and `removal_routes.topojson` are byte-identical. `east_of` (T-021) is replaced by the explicit edge chain.
- **Tested:** C01 re-run top to bottom in `revx`, with no errors and every assertion cell passing. Preview (zone by uncertainty + lines, with zooms on PA–NY and SC–GA) in the session scratch folder: `T-022_before1784_uncertainty_preview.png`.

**Decision (Lara, 2026-11-24):** northern NY option 2: cut the zone at Wood Creek; drop the assumed due-north closure; leave the north open with a note: "Northern New York: taken by New York State treaties 1788–97, not mapped by Royce" (wording finalised from the B-038 historian summary). Apply in the C01 re-run with the 1775–83 lines.
