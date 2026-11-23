# T-006 E01_base: topography, water, borders
**DRAFT, not approved** · brief B-017 (draft) · agent: coder · run in a new session

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
