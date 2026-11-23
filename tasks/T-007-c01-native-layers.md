# T-007 C01_native: land not yet ceded, cessions, reserves
**DRAFT, not approved** · brief B-018 (draft) · agent: coder · run in a new session

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
