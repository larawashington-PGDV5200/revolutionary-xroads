# T-006 E01_base: topography, water, borders
**Approved by Lara 2026-11-23** · brief B-017 · agent: coder · run in a new session

**Goal:** layer 1 for the web: relief, water and period borders, clipped to where the pension data has activity.

**Input:** `data/raw/gis/etopo2022-30s/`, `natural-earth-10m-water/`, `newberry-ahcb-stateterr/`,
`newberry-ahcb-counties/`; `research/R6-layer-sources.md`; extent from `places` used in `residences`.

**Do:**
1. Extent = bounding box of places in `residences` + 1° margin; say if it falls outside the ETOPO subset.
2. ETOPO → hillshade PNG + bounds (lon/lat) for a deck.gl `BitmapLayer`; also a small elevation PNG
   (Terrarium encoding) in case `TerrainLayer` is used.
3. Natural Earth rivers, lakes, coast → clip; drop `featurecla = Reservoir`; simplify.
4. Newberry states and counties for 1784, 1790, 1800, 1810, 1820, 1830, 1840 snapshots.

**Files:** `rx-pipeline/notebooks/E01_base.ipynb`; `web/data/relief.png`, `relief_bounds.json`,
`water.topojson`, `borders.topojson`. Nothing in `data/raw/`.

**Done when:** all outputs EPSG:4326; each web file < 10 MB; a quick matplotlib overlay shows they line up.

**Why an agent:** GIS processing with no analysis choices; Lara reviews the overlay.

**Result (2026-11-23, coder):**
- New `rx-pipeline/notebooks/E01_base.ipynb` (ran top to bottom in `revx`, assertions pass). Writes `web/data/relief.png` (3.3 MB, 4006 × 2704, grey + alpha, ocean transparent), `relief_bounds.json`, `relief_terrarium.png` (1.5 MB, step 2; not in the Files list), `water.topojson` (0.6 MB), `borders.topojson` (3.2 MB). All EPSG:4326.
- Extent: places in `residences` + 1° = lon −124.58…−66.61, lat 24.91…47.44. **Falls outside the ETOPO subset** (west edge −100°) because of 3 places (OR, 2 × CA; 4 rows, 4 files). Working extent cut at −100° for all layers: 111,313 of 111,317 rows inside.
- Water: rivers 993, lakes 243, coast 139 features; dropped 46 reservoirs and 7 modern canals.
- Borders: snapshot = 31 Dec of each year; each Newberry shape version stored once with a `years` list. States 66 versions, counties 2,809. Per snapshot (states / counties): 1784 16/273, 1790 17/355, 1800 20/473, 1810 25/661, 1820 28/860, 1830 30/1,107, 1840 33/1,459.
- No new dependencies: NetCDF-3 read and TopoJSON write are small helpers in the notebook (one arc per ring, no shared arcs).
- Tested: files read back from `web/data/` and overlaid in matplotlib (full extent + Chesapeake zoom), and they line up. Assertions cover file size < 10 MB, bounds inside the extent and ETOPO subset, unique non-null keys, no reservoirs or canals, every snapshot non-empty, and a Terrarium round trip within 1 m.
