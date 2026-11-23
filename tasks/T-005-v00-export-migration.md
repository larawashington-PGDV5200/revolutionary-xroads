# T-005 V00_export: migration flows and paths
**DRAFT, not approved** · brief B-016 (draft) · agent: coder · run in a new session

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
