# T-014 E01: land mask, gap-free earth-toned relief, borders clipped to land
**Approved by Lara 2026-11-24 via master plan T-012** · brief B-026 · agent: coder

**Goal:** relief with no white holes on land, in earth tones; state/county borders that stop at the coast.

**Why:** ~40 % of `relief.png` is transparent, including low land (ETOPO ≤ 0, deltas, the ≥ 2 of 4 downsample rule). Newberry borders run into bays and lakes, so they look wrong against the coast.

**Do:**
1. Download Natural Earth 10m land (`ne_10m_land`, public domain) to `data/raw/gis/natural-earth-10m-land/`.
2. Land mask = NE land minus the NE lakes already in `water.topojson`; land pixels are never transparent, whatever their elevation. Ocean and lakes transparent.
3. Colour the hillshade as RGBA: lit `#CDBB9A` (loam) → shade `#5E4A33` (umber), keeping the T-010 stretch. Size < 3 MB.
4. Clip `borders.topojson` states and counties to the land mask (keep attributes and years); keep the T-010/T-011 topojson-client checks and extent assert.

**Files:** `rx-pipeline/notebooks/E01_base.ipynb`; `web/data/relief.png`, `relief_bounds.json`, `borders.topojson`; `data/raw/gis/natural-earth-10m-land/`. This file (Result).

**Done when:** 0 transparent pixels inside the land mask; coast-only preview shows borders ending at the shore; all checks pass; preview PNG in scratch.

**Why an agent:** raster/vector processing; Lara reviews the preview.

**Result (coder, 2026-11-24):**
- **Deviation, step 1:** writing to `data/raw/` is blocked by a permission deny rule, so nothing was downloaded there. E01 reads `ne_10m_land` (NE v5, public domain) remotely from `https://naciscdn.org/naturalearth/10m/physical/ne_10m_land.zip` via GDAL `/vsizip//vsicurl/` (bbox read, < 1 s, nothing saved). If Lara places the shapefile at `data/raw/gis/natural-earth-10m-land/ne_10m_land/ne_10m_land.shp`, E01 uses that copy instead.
- Land mask (§3b) = NE land (9 polygons in the extent) minus the `water.topojson` lakes; a pixel is opaque when its centre lies in the mask. Hillshade now clamps z < 0 to 0 before shading and averages all 4 cells per 2 × 2 block (the T-011 "≥ 2 of 4 cells z > 0" rule is gone). Same z_factor 5 and p1–p99 stretch (shade 0.471–0.858, unchanged).
- Transparent pixels inside the land mask: **3,915 → 0** (mostly the Mississippi delta and coastal marsh). Opaque pixels outside it (ETOPO land the NE coast calls water): 5,790 → 0. Land-mask pixels: 1,622,922 (59.9 %). Lakes stay transparent (Erie, Huron, Michigan, Ontario, Superior 100 %).
- Colour: RGBA, linear umber `#5E4A33` (shade) → loam `#CDBB9A` (lit); recorded in `relief_bounds.json` (`colour`, `land_mask`, `hillshade.below_sea_level`). relief.png 1.67 → **2.80 MB**, 2003 × 1352.
- Borders (orchestrator decision 2026-11-24, within T-012/T-014): clipped to `BORDER_MASK` = NE land minus the **five Great Lakes only** (ocean + Superior, Michigan, Huron, Erie, Ontario), not small inland lakes. Relief transparency is unchanged (all NE lakes transparent). Shapes fully inside the mask are untouched; attributes and `years` unchanged. States 66 → 66 (47 cut), counties 2,809 → 2,809 (445 cut), none dropped.
  Holes before → after: states 3 → 2, counties 23 → 22 (a first pass that cut out every NE lake gave 553 / 598 holes and was dropped). Rings: states 2,056 → 2,239, counties 5,820 → 6,047. borders.topojson 3.24 → 3.03 MB. Small lakes (e.g. Pontchartrain) are see-through in the relief, and county lines cross them.
- Checks (new in §6): RGBA; 0 transparent pixels in the mask and 0 opaque outside; every opaque colour on the ramp (±1); decoded shade std > 20; every border within `BORDER_MASK` + 0.01°. T-010 topojson-client check and T-011 extent assert unchanged and pass.
- Tested: E01 re-run top to bottom in `revx`; all assertion cells pass. `water.topojson` and `relief_terrarium.png` byte-identical (md5). Re-run after the border-mask change. Preview (relief + 1840 borders + coast, with before/after zooms of Chesapeake, Mississippi delta, Huron/Erie) in the session scratch folder: `T-014_relief_borders_preview.png`.
