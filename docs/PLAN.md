# Plan — "Veterans West" (rescoped 2026-11-10, replaces the D-005 plan)

## Focus
Map how Revolutionary War veterans **and their widows** moved west, using the HF pension files, on a
**historical map of the East with period borders**, overlaid with **reservations** (when established,
who lived there, outline). Read motive from two text sources: **newspaper land ads** (how often,
how prominent, how long they ran, what language sold the land) and **pension testimony** (keywords,
themes, sentiment). Window 1763–1840, east of the Mississippi.

**Native voices:** is missing from these datasets. R3 stays as a reading list and a limitations note, not a workstream.

## Gates (D-007, unchanged)
Brief approved before any subagent runs · `tasks/T-NNN` approved before any agent workstream ·
no ML/LLM model on project data until the researcher compares options and Lara approves.

---

## 1. Data we actually need

### HF (primary): Revolution Crossroads
| Dataset | Size | What we use | Value | Extra work | Verdict |
|---|---|---|---|---|---|
| `nara_revolutionary_war_pension_files` | 2.2M pages, ~78.7k files | title (served state, S/W/R/BLW, name), declaration-page residence, 1832 residence chain, widow marriage/residence, full text for C | **core** | in plan | **use** |
| `loc_chronicling_america_1770-1810` | 77.8k pages, 19.4k issues, 110 papers | `lccn`, date, page no., paper, place: ad metadata | core for B | low | **use** |
| `RevX_OCR_results` (`block_level`) | 19.0M blocks (all collections) | ad blocks: `block_type`, `block_text`, `block_bbox` → ad area as % of page | core for B (prominence) | medium: check `block_type` values + page size first | **use** |
| `RevX_NER_Entity_Occurrences` | 24M mentions | pension: place names (A8); chronam: place names in ads (ad destination) | medium; regex covers ~50k files without it | medium | **later** (B destinations; A8 optional) |
| `loc_chronicling_america_1770-1810_issues` | 19.4k issues | `page_count` per issue | low (pages table already has it) | low | skip unless needed |
| `si_us_revolutionary_era_collections`, `…pension_files_PDFs` | 12.7k objects; PDFs | — | none for this focus | — | **cut** |

### External (supplement only where HF has nothing)
| Source | Size | What it gives | Have it? | Verdict |
|---|---|---|---|---|
| Newberry AHCB state/territory boundaries | 101 shapes overlap 1783–1840 | **historical borders** by date | yes, `data/raw/gis/` | **use** (v1) |
| R4 reservations table (`research/reservations_R4.csv`) | 66 rows | name, nation (source + present-day), date established/ended, who lived there, boundary text | yes | **use** |
| USFS Royce layer (`data/raw/gis/usfs-tribal-ceded-lands/`) | 718 polygons, 299 dated pre-1841 | reserve outlines (~30 R4 rows) + cessions | yes | **use** |
| R1 treaties (`research/treaties_R1.csv`) | 47 rows | treaty dates for the timeline | yes | **keep, last** |
| Newberry counties | 5.8k shapes 1763–1840 | county-level points | yes | later, only if A2/A3 county coverage is good |
| **Cut:** NHGIS, Rumsey rasters, Native Land, BLM GLO patents, military-district land records, Myaamia Hub, Carleton KML, plat georeferencing, ASP/War Dept/Founders mining, *Cherokee Phoenix*, oral histories, Gwynne mapping | | | | scope creep: high work, off the core question |

### Reservations layer: what we need
One row per reservation: `id, name, nation_as_in_source, present_day_nation, date_established,
established_by, date_ended, inhabited_notes, source_type, confidence, source` + geometry.
- **Polygon (~30 rows):** confirmed Royce `CESSNUM` (R4b table). Confirm each against Royce's Schedule; flag polygons >1.5× treaty acres as `generalised`. Use R4 dates, not `CESSDATE1`.
- **Point (~27 rows):** no polygon (VA, New England, Maine, Oneida NY, Brothertown, Cornplanter, Catawba…). Placed at the village/county anchor, drawn as a symbol.
- **List only (9 rule-only rows):** Choctaw Art. XIV, Creek/Chickasaw allotments, Fort Jackson, Fort Meigs. In the table, not on the map.
- **No extrapolated outlines in v1–v2.** Later, only Nottawa Sape (PLSS), Penobscot, Passamaquoddy and Nottoway are worth drawing.
- Caveats kept from R4: Royce shapes are generalised; outlines are locators, not survey lines; Myaamia data needs permission before publishing.

## 2. Workstreams
**A — Pension → migration (core, coached).** Same pipeline (`rx-pipeline/`, raw → interim → processed, parquet, `method` + `snippet` on every signal).
| NB | Does | Output |
|---|---|---|
| A01_access (finish) | step 1 done (counts). Still to do: files table (NAID, title, page count); page index (no text); declaration pages with text. NER pull moved to later | `interim/files_raw`, `interim/pages_index`, `interim/pages_decl` |
| A02_profile | profile file types, text sources, sample pages read side by side | notes in NB |
| A03_clean | coalesce text; parse title → type S/W/R/BLW, name, served state | `interim/files.parquet` |
| A04_signals | A2 declaration state (+county); A3 1832 residence chain; **A4 "removed to"**; **A6 widow (W files): marriage date + place, veteran's death date, and the veteran's own declaration if he applied before he died**; application year | `interim/place_mentions.parquet` |
| A05_validate | 20 files per signal, hand-labelled: precision + coverage | `interim/validation.csv` |
| A06_outputs | one row per file: served, origin, moves, final residence, applicant (veteran/widow), confidence | `processed/veterans.parquet`, `processed/moves.parquet` |
Cut from A: A5 agency transfers, A9 Native-campaign flag. A7 bounty land and A8 NER places: later, optional.

**B — Land ads.** Step 1, measurable: identify land-sale blocks (prototype rule: acreage + sale wording, 22,435 blocks) → frequency by year/paper → **prominence** (block area ÷ page area, page number) → **run time** (same ad text repeated across issues of one paper: first/last date, issue count). Step 2, language: word/bigram frequency and keyness vs. all ads; code selling points (soil, water, timber, cleared land, safety, price, warrants, Native-land terms); destination named. Step 3: deeper language analysis (model gate).

**C — Pension testimony text.** Strip boilerplate → keywords, TF-IDF, bigrams → themes (topic model) → sentiment (model gate; prototype found lexicon sentiment too crude). Compare movers vs. non-movers, veterans vs. widows.

**D — Map layers.** Historical borders by year (Newberry) → reservations layer (above) → later: Royce cessions + R1 treaties on a timeline against ad frequency and arrivals.

Order: A → map base + reservations → B → C → treaties timeline. B and C cross with A on state and year.

### Agent tasks (`tasks/`, each needs approval + a brief)
| Task | Agent | Goal | When | Status |
|---|---|---|---|---|
| T-001 S2 profile news | data-analyst | profile news + NER-chronam; switch to remote `hf://` queries | before B | addendum pending |
| **T-002 reservation points** | researcher (historian checks dates) | add `lat, lon, coord_method` (`royce_centroid` / `county_anchor` / `village_anchor`) to ~60 R4 rows → `data/processed/reservations_points.csv` | v1, in parallel with A02–A04 | to draft |
| T-003 reservation outlines | researcher / coder | confirm Royce matches against the Schedule → `reservations.geojson` | after v1 | later |

## 3. v1 prototype (next milestone)
**Goal:** pension data cleaned and formatted, plus a first matplotlib version of the prototype 2 view, all in Python notebooks.
- **Data:** A02 → A03 → A04 (A2 declaration state + application year only) → A06-lite `processed/veterans.parquet` (NAID, type, served state, residence state, year, method, snippet). A3/A4/A6 come after v1.
- **Viz notebook `V01_migration.ipynb`** (geopandas + matplotlib):
  1. Flow map: served state → residence state, curved lines, width = files, on **Newberry state/territory borders at 1820 and 1832** (not modern outlines). Veterans and widows in separate colours or small multiples.
  2. Top-flows table (served, residence, files, S/W/R).
  3. Bar chart: share of files applying from another state, by type and application decade.
  4. **Reservations as points** on the flow map: ~60 R4 rows, filtered to those that existed in the snapshot year. Six dispersed allotment classes (Fort Jackson, Cherokee 640-acre, Choctaw ×2, Creek, Chickasaw) are left off. Coordinates come from the Royce candidate polygon's centroid where R4b names one, otherwise from the county or village anchor; a `coord_method` column records which. Agent task **T-002** (see Agent tasks).
- **Not in v1:** land ads, text analysis, reservation outlines, treaties.
- Done when: notebooks re-run end to end from HF; assertion cells pass; map uses period borders; counts sit close to prototype 2 (59,757 files with both states, ~52.8% moved) or the difference is explained.

## 4. Rough time (focused hours)
| Step | Mode | Est. |
|---|---|---|
| v1: finish A01, A02–A04 (A2) + A06-lite + V01 | coached | 13–18 h |
| v1 add-on: reservation points (T-002 coordinates, your review, plot in V01) | agent → review → coached | +3–4 h |
| A full signals (A3, A4, A6) + A05 | coached | 10–12 h |
| Reservations layer (confirm Royce matches, points, table) | agent task → review | 4–6 h |
| B land ads steps 1–2 | coached | 12–16 h |
| C testimony text (no models) | coached | 8–10 h |
| Model gate + B3/C sentiment/themes | researcher → Lara → coached | 8–12 h |
| Treaty timeline + final map | coached | 8–12 h |

## Verification
Assertion cells end every notebook (row counts, unique NAIDs, no null keys). Each signal reports coverage + precision. Historical claims and dates go through the historian before they reach a viz.

## Risks and caveats
Residence is where the applicant lived when applying (1818–1850s), not the first move · Maine ⊂ MA until 1820 · widow residence may postdate the veteran's death · news corpus skews to VA/DC/PA and post-1795 · `RevX_OCR_results` block types and page size still need checking before prominence works · in W files the "residence" is the widow's own, at the time she applied (often 1836–1850s, after the veteran died).
