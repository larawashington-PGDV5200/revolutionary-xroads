# T-002 Reservation points
**Approved by Lara 2026-11-17 (agent may write to `data/processed/`)** · briefs B-011 (approved), B-012 (review again after B-011) · agent: researcher (coordinates) → historian (checks dates) · runs in parallel with A02–A05

**Goal:** give each mappable R4 reservation a point location, so the reservation layer (PLAN §3 C, v1 map)
can be drawn by date established and ended.

**Input:** `research/reservations_R4.csv` (66 rows), `research/R4-reservations.md`,
`research/R4-reservation-gis.md`, Royce layer in `data/raw/gis/usfs-tribal-ceded-lands/` (read only).

**Do:**
- Copy every R4 column unchanged; add `lat`, `lon` (WGS84, 4 decimals), `coord_method`, `coord_source`, `coord_note`.
- `coord_method` values: `royce_centroid` (polygon matched, give Royce no.) · `named_place` (town, village,
  mission or county seat named in the source) · `county_centroid` · `none` (dispersed allotment classes: the
  6 rows in `docs/DATA.md`, R4 mapping note).
- Prefer the place named in the boundary text; fall back to county; never guess a point without a source.
- Historian pass: check `date_established` / `date_ended` on rows flagged `unverified` and the 3 rows with
  no founding date; mark each `verified` or leave `unverified` with a reason. Don't change dates silently.

**Files:** `data/processed/reservations_points.csv` (new), `research/T-002-notes.md` (method, gaps, sources,
Chicago author-date). Nothing else; `reservations_R4.csv` stays untouched.

**Done when:** 66 rows out; ~60 have `lat`/`lon`; every row has a `coord_method` and `coord_source`; all
points fall inside the stated `present_state`; the notes list the rows without a point and why.

**Why an agent:** lookup work across gazetteers and the Royce layer; no project code; Lara reviews the result.
