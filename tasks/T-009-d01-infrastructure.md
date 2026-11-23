# T-009 D01_infrastructure: roads, canals, railroads, routes
**DRAFT, not approved** · brief B-020 (draft) · agent: coder · run in a new session

**Goal:** layer 6 for the web: dated transport lines to 1840.

**Input:** `data/raw/gis/atack-transport/` (Albers ESRI:102003), `research/roads_R7.csv`, `research/R6-layer-sources.md`.

**Do:**
1. Atack railroads (`InOpBy` ≤ 1840), canals (`OPENED` ≤ 1840), steamboat rivers (`START` ≤ 1840) → EPSG:4326,
   one `year_open` field, `date_quality` (approximate for railroads and steamboat `START`).
2. R7 roads: rows as attribute records with `year_open` = wagon-passable year, other dates kept for tooltips;
   geometry empty with a `todo` flag (hand-tracing is a later task).
3. Cite Atack (2015; 2016; 2017) in the notebook's first cell.

**Files:** `rx-pipeline/notebooks/D01_infrastructure.ipynb`; `web/data/infrastructure.topojson`. Nothing else.

**Done when:** feature counts by kind and decade printed; file < 10 MB; lines plot inside the extent.

**Why an agent:** format and reprojection only; Lara reviews counts.
