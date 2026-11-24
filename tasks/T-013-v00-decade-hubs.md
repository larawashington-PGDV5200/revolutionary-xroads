# T-013 V00: decade per leg, people-weighted state hubs
**Approved by Lara 2026-11-24 via master plan T-012** · brief B-025 · agent: coder

**Goal:** migration can share the decade slider, and state hubs sit where veterans lived.

**Why:** D-025 reverses D-016 (one timeline; Act spikes accepted). Hubs are now plain state centroids (mean of county centroids), not where people were.

**Do:**
1. Every leg gets `decade` (1770 … 1840; floor to 10): the leg's dated "removed to" / end year if the file states one, else the application year. Years > 1849 → `decade` 1840 with `late = true` counted separately; years < 1770 → 1770. Keep `decade_source` (`dated` / `application`).
2. `flows.json`: grain becomes from × to × decade (state and county levels as now); keep `act_cohort` as a field only if it doesn't explode size, else drop it. Keep legs, people, served_legs, claim_types.
3. `nodes.json`: place × decade, people_left, people_arrived. For state nodes add `hub_lat`, `hub_lon` = people-weighted mean of that state's county coordinates (people = everyone with a residence there, all decades). Keep `lat/lon`.
4. Assertion cells: counts per decade (and per `decade_source`), totals equal to the old totals, every state node has a hub inside its state polygon (or say which don't).

**Files:** `rx-pipeline/notebooks/V00_export.ipynb`; `web/data/flows.json`, `nodes.json`. Paths unchanged unless a field is needed. This file (Result).

**Done when:** both files written, < 3 MB each, totals unchanged, decade table printed.

**Why an agent:** mechanical re-aggregation; Lara reviews the counts.

**Result (coder, 2026-11-24):** `rx-pipeline/notebooks/V00_export.ipynb` re-run top to bottom on `revx (.venv)` (nbconvert --execute), no errors, all assertions pass. Legs get `decade_year`, `decade`, `decade_source` (`dated` = the to-stop's stated year, else `application`; `unknown` when the file has neither) and `late`. `flows.json` grain is now level × from × to × decade, with new `dated_legs`, `late_legs` and `act_cohorts` (legs per cohort as a tally, replacing the `act_cohort` string, so rows don't multiply). `nodes.json` is place × decade with `hub_lat`, `hub_lon`, `hub_people` on state nodes (null on counties). `paths/` unchanged.
- Moves per decade (dated / application): 1770 368 (368 / 0, 98 of them before 1770) · 1780 416 (416 / 0) · 1790 246 (246 / 0) · 1800 267 (267 / 0) · 1810 2,068 (1,954 / 114) · 1820 5,189 (4,593 / 596) · 1830 22,392 (13,056 / 9,336) · 1840 7,769 (3,160 / 4,609; 3,076 `late`). 514 legs have no year at all: `decade = null`, kept so the totals hold.
- Sizes: `flows.json` 1.10 MB (4,949 rows: 1,869 state, 3,080 county); `nodes.json` 0.69 MB (3,376 rows: 236 state, 3,140 county).
- Totals: 39,229 legs, 3,324 county-level, 27,547 served, the same as T-005. With decades pooled, distinct people match T-005 too (flows 38,683 state / 3,320 county; nodes 36,838 / 36,886 state, 6,329 / 16,467 county). Per decade people sum higher (38,911 on state flows), because someone who moved in two decades counts in both.
- Hubs: 31 of 33 fall inside their state (checked against every Newberry AHCB version of the state or territory). FL is 0.9 km offshore in Apalachee Bay (generalised coast). LA is 7.5 km across the Mississippi in MS (17 people on both banks). DC has no county residences, so it keeps its centroid (`hub_people = 0`).
- Caveat: an undated to-stop takes the application year, so undated `born → served` or `removed_to` legs land in the 1830s and 1840s.
- Web: `web/src/layers/L4-migration.js` still filters on `f.act_cohort`, which is gone. T-020 needs to switch it to `decade`.
- Tested: unique keys (flows on level/from/to/decade, nodes on level/place_id/decade); every place_id is in `places`; decades fall in 1770–1840 or are null (null only when there's no year); `late` legs sit in 1840; leg, served and pooled-people totals match the T-005 numbers; claim_types and act_cohorts each sum to legs; every state node has a hub and no county node does; JSON round trip; both files < 3 MB.
