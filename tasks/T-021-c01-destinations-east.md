# T-021 C01: removal destinations dated as assignments; "before 1784" zone
**Approved by Lara 2026-11-24 via master plan T-012** · brief B-031 · agent: coder · sources: research/R10-native-gaps.md, research/destinations_R10.csv

**Goal:** layers 2 and 5 show removal as relocation, and the east carries an honest "not mapped" zone.

**Why:** Royce polygons used as removal destinations carry the granting treaty as their first date, so L5 marks them "ceded" in the year nations were assigned them, and before that they read as Cherokee/Creek land (R10 §2).

**Do:**
1. Join `destinations_R10.csv` to `royce_cessions` on cessnum. Add `assigned_year`, `nation_assigned`, `assigned_verified` (y/n), `assigned_treaty`. For these polygons set `cession_year` to the next real cession date to the US in the USFS data (often after 1840), not the granting treaty; keep the old value as `cession_year_usfs`. Rows with blank `assigned_date` keep USFS dates and get a `todo` note.
2. Check `prior_occupants` spatially: list Royce polygons ceded before `assigned_year` that overlap each destination (area share). Report, don't change.
3. New object `before_1784` in `native_land.topojson`: land inside the extent east of the 1763 Proclamation / 1768 Fort Stanwix lines (`pre1784_lines`; use whichever line lies further west at each latitude, per R10 §3), minus every Royce polygon; clipped to the land mask E01 uses (NE land, read remotely as E01 does). One feature, label "Taken before 1784: not mapped by Royce".
4. Flag USFS area 492 `present_day_nation` ("Santee Sioux" on a Cherokee polygon) as `attr_flag`, don't change it.
5. Keep all T-010/T-011 checks; assertion: no destination polygon has `cession_year` ≤ `assigned_year`.

**Files:** `rx-pipeline/notebooks/C01_native.ipynb`; `web/data/native_land.topojson`. This file (Result).

**Done when:** checks pass; counts of re-dated polygons (verified/unverified); preview PNG of 1830 and 1840 (held / assigned / ceded / before-1784) in scratch.

**Why an agent:** join, geometry ops; Lara reviews preview.

**Result (coder, 2026-11-24):**
- **Step 1, re-dated (§1c, new):** all 42 `destinations_R10.csv` rows join `royce_cessions` (0 missing). New fields: `assigned_year`, `assigned_date`, `nation_assigned`, `assigned_verified`, `assigned_treaty`, `assigned_kappler`, `assigned_note`, `prior_occupants_r10`, `is_destination`, `redated`, `cession_year_usfs`, `cession_date_usfs`, `todo_note`, `attr_flag`. Rule: `cession_year`/`cession_date` = the first USFS date in a later year than `assigned_year` (so Castor Hill 26/28 Oct 1832 and the Kickapoo 25 Nov 1832 supplement are skipped as the same grant).
  - next USFS cession: **35** (22 verified, 13 unverified); 32 of them now fall after 1840. Still ≤ 1840: Miami 329, 330 → 1840-11-27 (R10: may be the 1840 treaty that sited the tract, not a cession; unverified) and Winnebago 267 → 1837-10-31 (verified grant; the 1837 date is unchecked). Delaware 316, 317, 425, 488 keep 1854 (their USFS first date already is the later cession).
  - no later USFS date: **2**, `cession_year` = null, `year_flag = no_later_usfs_cession`: 144 (unverified; USFS 1827 against the 1828 treaty) and 248 (verified, New York Indians).
  - no `assigned_date`: **5** (502, 504, 430, 417, 418, all unverified): USFS dates kept, `todo = true` + `todo_note`.
  - `cession_year` changed on 33 polygons; geometry and arcs unchanged (byte-equal arcs vs. the previous file).
- **Step 2, prior occupants (§1d, report only):** 37 dated destinations with a polygon; 34 are covered 100 % by earlier-ceded Royce areas, mostly Osage 123 (1825) in OK/KS, Kansa 124 (1825) in KS, Osage 97 (1818) under 144/492, 143 under 492, Prairie du Chien 151–153 (1830) under 265 and 267. 3 have none: Shawnee 318, 319, 320 (assigned 1825, the same year as Osage 123 / Kansa 124 were ceded, so they are not "before"). Full table in the notebook.
- **Step 3, `before_1784` (§3b, new): not drawn.** The `pre1784_lines` are still placeholders with no geometry (T-007 §3; R6: no open vector, hand-trace is a later task), so there is no west bound. C01 writes the one feature with the label, `geometry = null`, `todo = true`, `flag = no_geometry`; the code (`east_of` per line, union = "further west at each latitude", minus all Royce, clipped to E01's land mask read remotely from Natural Earth) fills it on re-run once the lines have geometry; it has a self-test. Diagnostic: land outside every Royce polygon = 1,735,516 km² in 464 parts; the largest (1,686,527 km²) runs from the seaboard round the Gulf into Texas, so it cannot stand in for the zone.
- **Step 4:** `attr_flag` set on 492 only (USFS `PRESDAYTRB` "Santee Sioux Nation, Nebraska" on a Cherokee polygon); value not changed.
- **Step 5, checks:** new asserts: no destination has `cession_year` ≤ `assigned_year`; non-redated rows keep USFS values; todo rows have a note; only 492 has `attr_flag`; `before_1784` is one feature with the label (null only while the lines are null). T-010 topojson-client check (counts, rings, nulls) and T-011 extent assert extended to `before_1784` and pass. Counts: royce_cessions 450, state_cessions 5, pre1784_lines 2, before_1784 1. native_land.topojson 1.67 → 1.82 MB (new attributes). reservations.json and removal_routes.topojson byte-identical.
- **For the web (not changed here):** null `cession_year` must read as "never ceded"; in JS `null <= year` is true, so L5's filter would show 144 and 248 as ceded. Destinations before `assigned_year` should not be drawn as "held" (the older polygons cover them).
- Tested: C01 re-run top to bottom in `revx`; all assertion cells pass, no errors. Preview (1830 and 1840: held / assigned / ceded / land outside Royce) in the session scratch folder: `T-021_native_1830_1840_preview.png`.
