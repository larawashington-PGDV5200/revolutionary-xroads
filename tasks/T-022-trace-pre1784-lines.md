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

**Decision (Lara, 2026-11-24):** interior Maine and Vermont treated like northern NY (option 2): left open with a note (MAINE_VT_OPEN = True); notes marked unverified. Lara will do a full pass of the Native zones later. Tester re-run deferred.

**Result (coder, re-run with the 1775–83 lines, 2026-11-24):**
- **Lines (§3):** now **146 segments**: 143 from R11 (11 lines, 155 vertices, augusta_1773 seq 4 dropped) and 3 joins (`line = join`).
  - The 11 `mapped` vertices are snapped to the nearest vertex of the full-resolution USFS Royce edge (cessions 3, 76 and 7), moving at most 1.23 km. DeWitt's seq 2–3 go to vertices shared by cessions 7 and 76, as R11 says. R11's own points stay in `lat_r11` / `lon_r11`.
  - Where both ends are mapped on one cession, the segment follows Royce's edge (8 segments). The new river runs (Kentucky, Cumberland, Savannah) follow NE 10m. The Tugaloo stays straight because NE misses it by 14 km.
  - Kappler citations now give the start page only.
  - Roles: `zone_edge` (84), `interior` (inside the edge polygon: all of Donelson, Lochaber and Hard Labour, plus 4 Augusta 1763, 10 Henderson and DeWitt's seq 4–5), `not_edge` (outside it: Fort Stanwix 1–2 and Henderson 11–13, which lie west of the NC 1777 line), and `reference` (Proclamation).
- **Zone edge:** Fort Stanwix from Wood Creek to the Cumberland mouth → Henderson up the Cumberland to Cumberland Gap → NC 1777 → assumed NC–SC join (14 km, `closure_assumed`, 10 km band) → DeWitt's seq 1–4 → join down the Savannah → augusta_1773_royce7 seq 5–1 → Buffalo Lick tie (two placements of one anchor) → augusta_1773 seq 3–1 → Augusta 1763 seq 5–7.
- **Left open:** there is no due-north closure any more. Zone land in New York north of Canada Creek (43.24° N) is cut out and becomes `open:north_ny` (32,930 km²) in a new object, `before_1784_open`, with the addendum's note and citation (start pages only). Every zone piece also carries `north_open`. With `MAINE_VT_OPEN = True` (Lara, 2026-11-24), the whole District of Maine (82,226 km²) and the Vermont Republic (24,151 km²) are open too. Their notes are marked unverified, and no source draws an "interior" line.
- **Zone:** **713,533 km²** in 16 pieces (was 764,053 in 18):

  | bucket | before | after |
  |---|---|---|
  | high | 49,593 (6 pieces) | 8,733 (2) |
  | medium | 5,153 (5) | 5,935 (4) |
  | low | 709,312 (7) | 698,861 (10) |

  Before the open cuts the zone is 852,849 km², so the 1775–77 lines add about 88,800 km².
- **Closures still assumed:** (1) due south from Santa Savilla, 2,689 km², high; (2) the NC–SC join, 114 km² band, low. The 43.24° N cut in New York is a drawing convention for the open edge, not a source line.
- **Checks:** all earlier asserts still run. New asserts cover the joins, start-page citations, mapped vertices on Royce vertices, the interior roles, no zone in the open areas, open-area notes and flags, and zone + open = the zone before the cut. `reservations.json` and `removal_routes.topojson` are byte-identical. `native_land.topojson` grows from 2.16 to 2.31 MB.
- **Tested:** C01 re-run top to bottom in `revx` (nbconvert), with no errors and every assertion passing. The preview is in the session scratch folder: `T-022_before1784_rerun_preview.png`.
