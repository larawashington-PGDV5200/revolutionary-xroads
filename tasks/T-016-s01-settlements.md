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

**Change (orchestrator, 2026-11-24):** `data/raw` is write-protected by design. Read the post-office file remotely (DuckDB/pandas over the Dataverse URL), as E01 reads Natural Earth; save nothing to `data/raw`. Step 1 becomes: record the URL, licence and fetch date in the notebook's first cell.

**Result (2026-11-24, done):**
- Step 1 (as changed): the post-office file is read remotely with DuckDB from `https://dataverse.harvard.edu/api/access/datafile/4491713?format=original` (CC0, fetched 2026-11-24, ~3 s); URL, licence and date are in the notebook's first cell. Nothing was written to `data/raw/`.
- Step 2: 166,140 rows (ID unique, 112,521 geocoded) → 20,008 established 1600–1840 → 13,470 geocoded → **13,469 inside the extent** (1 in FL outside). 17 rows with a 3-digit `Established` (185, 190 ...; truncated, all western) are dropped as undatable; 44 have no year. Kept: 954 with `gnis_dist` < 1, 444 with none.
- Step 3: `research/urban_places_gibson.csv` now has **111 places**. Merged, with a new `merge_note` column: Sherburne → **Nantucket, MA** (Gibson's 1790 name; renamed 1795) and Alexandria DC → **Alexandria, VA** (DC 1801–1846). Per-year counts still equal Gibson's headers (24, 33, 46, 61, 90, 100). Join: exact upper-case name + state against `Name` (`AltName` only if no `Name` hit), geocoded offices only; with several hits, the office open in the most census years the place is listed, then the earliest. **99 of 111 matched.** 10 places are carried into 1840 (`carried_1840`): Middletown CT, Norwich CT, Annapolis, Hagerstown, Natchez, New Bern, Elizabeth NJ, Trenton, Chillicothe, Fredericksburg.
- **Unmatched (12, need hand coordinates):** Gloucester MA, St. Louis MO (file spells it differently or not at all), Moyamensing PA, Northern Liberties PA, Southwark PA (Philadelphia districts, no office of that name), Beverly MA, Cumberland RI (name only in other states), Bath ME, Lynchburg VA, Petersburg VA, Portsmouth VA (office in the file, not geocoded), Wheeling VA (WV in the file).
- Matches to check: Richmond VA (GNIS *Locale*, ~12 km east of the centre), Fredericksburg VA (GNIS *School*, ~5 km off), Elizabeth NJ (office from 1855), Middleborough MA and Pittsburgh PA (`AltName` matches).
- Step 4: `web/data/settlements.json` = **2.27 MB**, 13,568 rows (`{meta, settlements}`). New places by decade of `year_established` (post_office / urban_2500): 1630: 1/0; 1690: 1/0; 1760: 1/0; 1770: 59/0; 1780: 39/0; 1790: 566/20; 1800: 1,136/9; 1810: 1,774/12; 1820: 3,929/15; 1830: 5,396/27; 1840 (one year): 567/16. Open at each census, 1790–1840: post offices 101, 821, 1,843, 3,659, 7,166, 11,704; urban places 20, 29, 41, 56, 82, 98.
- Tested: `rx-pipeline/notebooks/S01_settlements.ipynb` run end to end on the revx kernel (nbconvert --execute), no errors. Assertion cells: size < 3 MB, unique non-null `id`, row count = filtered offices + matched urban places, no undated row and all years 1600–1840, all coordinates inside the extent, each urban `po_id` exists in the source, `carried_1840` consistent with `pop`, unmatched list matches `meta.unmatched_urban`.

**Result update (2026-11-24, hand coordinates applied):**
- S01 now reads `research/urban_coords_override.csv` (R9 §5) in a new §2b. Overrides win over the exact-name match: the 12 unmatched places plus Richmond VA and Fredericksburg VA (bad matches) take the hand points. New urban fields: `coord_source` (`post_office` 97 / `override` 14), `coord_ref` (GNIS id or landmark; the office for matches), `unverified` (true only for Moyamensing PA and Southwark PA, landmark points). Overridden rows have `po_id` and `gnis_dist` null. `meta.unmatched_urban` is now empty; `meta.overridden_urban` lists the 14.
- **All 111 Gibson places are drawn.** `web/data/settlements.json` = **2.28 MB**, 13,580 rows (13,469 post offices + 111 urban). Urban places at each census, 1790–1840: **24, 33, 46, 61, 90, 110** (1840 = Gibson's 100 + 10 carried). New urban places by decade: 1790: 24; 1800: 9; 1810: 13; 1820: 15; 1830: 30; 1840: 20. Post-office counts unchanged.
- Tested: re-run top to bottom on the revx kernel (nbconvert --execute), no errors. New assertions: every Gibson place in the output, row count = offices + 111, every override row is a Gibson place and is applied, matched `po_id`s exist in the source, override `po_id`s null, `unverified` = exactly Moyamensing and Southwark, all coordinates inside the extent, `unmatched_urban` empty.
