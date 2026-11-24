# T-015 D01: routes only (no rivers), MVP filters baked in
**Approved by Lara 2026-11-24 via master plan T-012** · brief B-027 · agent: coder

**Goal:** `infrastructure.topojson` holds only railroads, canals and named roads/routes.

**Why:** D-027: steamboat rivers leave the layer; canals stay as trade routes.

**Do:** drop `kind = steamboat`; rail year = `year_exact` if set and ≤ `year_open`, else `year_open` (PLAN §6); drop R7 canals with an `atack_match`; keep the extent assert and topojson-client check. Report counts by kind × decade.

**Files:** `rx-pipeline/notebooks/D01_infrastructure.ipynb`; `web/data/infrastructure.topojson`. This file (Result).

**Done when:** no steamboat features; counts printed; checks pass.

**Why an agent:** mechanical filter.

## Result (2026-11-24, coder)
**Changed** (`rx-pipeline/notebooks/D01_infrastructure.ipynb`, re-run top to bottom on kernel `revx`; `web/data/infrastructure.topojson` rewritten, 0.16 MB, 253 features):
- Steamboat rivers dropped: §3 is now a one-line note (D-027); the Atack 2015 file is no longer read; header, plot and checks updated.
- Rail year: `year_open` = `year_exact` if set and ≤ `InOpBy`, else `InOpBy`. 117 of 120 features use `ExactDate` (`date_quality` = `exact (ExactDate)`); 3 keep `InOpBy` (1 no ExactDate, 2 with ExactDate later than InOpBy). `InOpBy` kept as `year_inopby`.
- R7-21 Erie, R7-22 Ohio and Erie, R7-23 Main Line dropped (each has an `atack_match`; drawn once, from Atack).
- Extent clip, extent assert and topojson-client check unchanged.

**Counts, kind × decade of `year_open`**

| decade | canal before/after | rail before/after | road | route | steamboat before/after | total before/after |
|---|---|---|---|---|---|---|
| 1750s | 0/0 | 0/0 | 2 | 0 | 0/– | 2/2 |
| 1760s | 0/0 | 0/0 | 1 | 0 | 0/– | 1/1 |
| 1780s | 0/0 | 0/0 | 1 | 0 | 24/– | 25/1 |
| 1790s | 1/1 | 0/0 | 3 | 0 | 1/– | 5/4 |
| 1800s | 4/4 | 0/0 | 3 | 0 | 4/– | 11/7 |
| 1810s | 3/3 | 0/0 | 2 | 0 | 28/– | 33/5 |
| 1820s | 39/38 | 0/4 | 1 | 0 | 32/– | 72/43 |
| 1830s | 62/60 | 47/87 | 0 | 0 | 43/– | 152/147 |
| 1840s | 7/7 | 73/29 | 0 | 0 | 7/– | 87/36 |
| undated | 0/0 | 0/0 | 6 | 1 | 0/– | 7/7 |
| **total** | 116/113 | 120/120 | 19 | 1 | 139/0 | 395/253 |

Road and route counts are unchanged. Canal −3 = the R7 duplicates.

**Tested:** all of §9 passes. No `steamboat` kind and no `atack_match` rows. The rail-year rule is re-derived from the decoded file. Ids are unique, kind and name are never null, and all 233 lines lie inside the extent. topojson-client decodes 253 features with 20 nulls (all R7) and 0 bad lines.

**Note for web:** `L6-infrastructure.js` still has a `steamboat` line-width case. It is now dead code and harmless; it was not touched, since web/src was out of scope.
