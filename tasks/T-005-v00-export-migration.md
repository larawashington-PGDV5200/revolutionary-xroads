# T-005 V00_export: migration flows and paths
**Approved by Lara 2026-11-23** · brief B-016 · agent: coder · run in a new session

**Goal:** export layer 4 for the web: every documented move in the claims, as flows and as per-person paths.

**Input:** `data/processed/residences.parquet`, `households.parquet`, `places.parquet`; `rx-pipeline/schema.sql`;
PLAN §3, §4. Rules: all claim types count (S, W, R, BLW); each leg counts once; no decade bins.

**Do:**
1. `paths`: per NAID and person, ordered stops from `residences` (born, enlisted, removed_to, lived_since,
   married, now_resides) plus `households.served_state` as a `served` stop. Keep date, page, precision.
2. Legs = consecutive stops where the place changes (county where both ends have one, else state).
   Act cohort from `application_year`: 1818–19, 1820–31, 1832–35, 1836–47, 1848+.
3. `flows` (state → state, with county rows kept) and `nodes` (people_left, people_arrived, lat/lon from `places`).
4. Report legs per kind pair, people per cohort, and how many files have ≥2 stops.

**Files:** `rx-pipeline/notebooks/V00_export.ipynb`; `web/data/flows.json`, `nodes.json`, `paths.json`
(split by state if `paths.json` > 20 MB). Nothing else.

**Done when:** runs end to end on the `revx (.venv)` kernel; assertions pass (unique keys, every place_id in
`places`, leg totals = sum of flows); counts are in the notebook.

**Why an agent:** export of tables that already exist; Lara reviews the counts and the files.

**Result (coder, 2026-11-23):** `rx-pipeline/notebooks/V00_export.ipynb` runs end to end on `revx (.venv)` (nbconvert --execute); all assertions pass. Writes `web/data/flows.json` (4,892 rows), `nodes.json` (3,343 rows) and paths: 32.5 MB as one file, so split into `web/data/paths/<state>.json` (33 files, by the state of each person's last stop, largest NY 5.7 MB); `paths.json` is the index of parts.
Counts: 181,802 stops for 104,324 people in 75,031 S/W/R/BLWT files (70,853 `served` stops); 61,377 files with ≥2 stops. 39,229 legs (3,324 county-level, 1,485 within-state); 27,547 legs (70%) touch a `served` stop, counted in `flows.served_legs`. Tested: unique keys on stops, legs, people, flows, nodes; every place_id in `places`; state-flow legs = 39,229 and county-flow legs = 3,324; legs without `served` = 18,868 = the `moves` view for these claim types; JSON round trip matches the tables.
