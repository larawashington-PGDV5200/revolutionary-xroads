# T-007 C01_native: land not yet ceded, cessions, reserves
**Approved by Lara 2026-11-23** · brief B-018 · agent: coder · run in a new session

**Goal:** layers 2 and 5 for the web, built from Royce, R1, R4/T-002 and R7, per PLAN §2.

**Input:** `data/raw/gis/usfs-tribal-ceded-lands/` (shapefile + table, not the Hub GeoJSON);
`research/treaties_R1.csv`, `data/processed/reservations_points.csv`, `research/R7-layers-history.md`;
`data/raw/gis/nps-trail-of-tears/`.

**Do:**
1. Royce polygons with every `CESSDATE1..5` and `SCHDTRB`; keep overlapping cessions as separate polygons.
   Field `cession_year` = earliest date; keep all dates.
2. R1 state cessions with no Royce number (NY 1785–89, Phelps–Gorham) → dated points, `source = not_royce`.
3. Pre-1784 lines (Proclamation 1763, Fort Stanwix 1768): empty placeholder features with a `todo` flag;
   hand-tracing is a later task.
4. Reserves from `reservations_points.csv` (start, end, coord_method). Trail of Tears route, undated, flagged.
5. Keep every source column; nothing dropped for narrative use later.

**Files:** `rx-pipeline/notebooks/C01_native.ipynb`; `web/data/native_land.topojson`, `reservations.json`,
`removal_routes.topojson`. Nothing else.

**Done when:** polygon count matches the Royce rows ≤ 1840; every feature has a source and a year (or `null`
+ flag); counts by decade printed.

**Why an agent:** joins and format work on sources already checked by the historian; Lara reviews counts.

**Result (coder, 2026-11-23):** `C01_native.ipynb` written and run top to bottom (revx kernel); it writes the three files.
- `native_land.topojson` (1.2 MB): `royce_cessions` 299 = Royce table rows with earliest date ≤ 1840 (294 polygons + 5 rows with no USFS polygon,
  null geometry, `flag = no_geometry`: 47, 65, 128, 129, 130); `state_cessions` 5 points (`not_royce`, NY 1785–89 + Phelps–Gorham, county centroids, 2 inferred);
  `pre1784_lines` 2 placeholders (`todo`). Royce by decade: 1780s 6, 1790s 36, 1800s 55, 1810s 71, 1820s 47, 1830s 84.
- `reservations.json`: 66 reserves, 59 with a point; `start_year`/`end_year` + flags parsed from the text dates.
- `removal_routes.topojson` (4.0 MB): 2,006 NPS segments, `year = null`, `year_flag = undated`.
- Tested: assertion cell (counts, unique non-null keys, source + year-or-flag on every feature, all source columns kept, geometry round trip within 2 quantization steps).
- Open: USFS cession dates are one day earlier than R1/Kappler in all 56 comparable cases (kept as stored); scope ≤ 1840 leaves later-ceded western areas blank in L2; `web/data/` is git-ignored by the `data/` rule.
