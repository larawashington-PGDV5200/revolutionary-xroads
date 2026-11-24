# T-016 S01: dated settlements (post offices + Census urban places)
**Approved by Lara 2026-11-24 via master plan T-012** · brief B-030 · agent: coder · source choice: research/R9-settlements.md

**Goal:** `settlements.json` for the "Settlement and routes" layer (D-026): every place dated, inside the extent.

**Do:**
1. Download Blevins & Helbock "US Post Offices" (CC0, Harvard Dataverse file 4491713, ~32 MB) to `data/raw/gis/us-post-offices/` with a README (citation, licence, date fetched).
2. Keep rows with coordinates and `Established` ≤ 1840 inside `relief_bounds.json` `extent`; fields: name, state, lat, lon, year_established, year_discontinued, `gnis_dist` (quality flag), kind = `post_office`.
3. Gibson (1998) Census Working Paper 27, tables for 1790–1840 (census.gov, public domain) → `research/urban_places_gibson.csv` (place, state, population per census year). Geocode by exact name + state match to the post-office file (no web geocoder, no ML); list unmatched names in the Result for hand coordinates. kind = `urban_2500`, year_established = first census with ≥ 2,500, population by decade.
   Caveat to record: the 1840 list stops at the top 100 (≥ 4,226); 1830 urban places are carried into 1840 if absent, flagged `carried`.
4. Assertion cells: counts by kind × decade, all coordinates inside the extent, no undated row. Markdown only to describe the data.

**Files:** `rx-pipeline/notebooks/S01_settlements.ipynb`; `web/data/settlements.json`; `data/raw/gis/us-post-offices/`; `research/urban_places_gibson.csv`. This file (Result).

**Done when:** `settlements.json` < 3 MB, counts printed, unmatched urban names listed.

**Why an agent:** download, filter, exact-match join; Lara reviews counts.

**Result (partial, 2026-11-24; blocked):**
- Step 3 done: `research/urban_places_gibson.csv` has 113 places (one row per place + state; `pop_1790` to `pop_1840`, `place_type`, `alt_name`, `gibson_label`, `gibson_note` = Gibson's "see notes" star). Parsed from Gibson tab02 to tab07 (census.gov). Checks: row count per year equals the table header (24, 33, 46, 61, 90, 100); smallest population per year is 2,584, 2,503, 2,540, 2,618, 2,623 and 4,226. Town→city renames are merged under one name (e.g. Boston town; city). Sherburne (Nantucket) 1790 and Alexandria VA 1790 vs DC 1800+ stay as separate rows, as Gibson lists them.
- Blocked at step 1: a permission deny rule stops writes to `data/raw/`, so the post-office file was not downloaded. Steps 2 to 4 and the notebook are not started. Nothing was saved elsewhere.
