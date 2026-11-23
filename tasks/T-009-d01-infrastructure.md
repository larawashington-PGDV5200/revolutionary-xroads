# T-009 D01_infrastructure: roads, canals, railroads, routes
**Approved by Lara 2026-11-23** · brief B-020 · agent: coder · run in a new session

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

**Result** (coder, 2026-11-23)
- Wrote `rx-pipeline/notebooks/D01_infrastructure.ipynb` (run top to bottom in kernel revx) and `web/data/infrastructure.topojson` (0.45 MB; one object `infrastructure`, 402 features, 379 with lines).
- Features: rail 120 (1,579 Atack segments ≤ 1840 dissolved by name × `InOpBy` × `ExactDate`; 3,161 mi), canal 113 Atack + 3 R7, steamboat 146 (24 tidal reaches dated 1787 marked `placeholder`), road 19 + route 1 from R7 (no geometry, `todo` = `hand-trace`).
- `year_open`: rail = `InOpBy` (approximate; `ExactDate` kept as `year_exact`), canal = `OPENED`, steamboat = `START` (approximate), R7 = wagon year where R7 states one (Wilderness 1796, Zane's 1804, Crown Point 1760), else R7 `year_open`; R7 dates kept for tooltips.
- Tested: assertion cell (counts per source, unique non-null `id`, Atack `year_open` ≤ 1840, rail miles match, file < 10 MB); file decoded back and plotted against the T-006 extent (residence places + 1°): 378 / 379 lines inside, Missouri River stretch reaches 48.2° N.
