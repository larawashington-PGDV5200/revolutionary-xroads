# Plan: "Revolution Migration" (rescoped 2026-11-17, replaces the 2026-11-10 "Veterans West" plan)

## Thesis
Revolutionary War veterans and their households moved west after the war. Their pension
applications (1818–1850s) record **when, where and why** they moved. Newspaper land ads from the
same places and periods show, as **visual artifacts**, how that land was sold. Native reservations,
drawn as a dated layer, show the **countermovement** of Native peoples, pushed onto shrinking
reserves as this migration colonised their land.

- **Core:** pension files → households, residences, moves, reasons.
- **Context:** land ads, joined by **place × period** only (no household-level link).
- **Layer:** reservations (points, later outlines) by date established and ended. Not joined to any table.
- Window 1763–1840, east of the Mississippi. Grain: **county** (state where no county is given).

## Gates (D-007, unchanged)
Brief approved before any subagent runs · `tasks/T-NNN` approved before any agent workstream ·
no ML/LLM model on project data until the researcher compares options and Lara approves.

---

## 1. Sources
| Source | Used for | Verdict |
|---|---|---|
| HF `nara_revolutionary_war_pension_files` (page dataset, remote) | titles, every applicant declaration page, text | **core** |
| HF `loc_chronicling_america_1770-1810` (pages) | paper, place, date, page no., `jpeg2000_url` / `pdf_url` for ad images | **use** |
| HF `RevX_OCR_results` `block_level` | ad blocks: text, `block_type`, `block_bbox` → area and image crop | **use** |
| HF `loc_chronicling_america_1770-1810_issues` | IIIF manifest (for image crops), `page_count` | use only for images |
| Newberry AHCB counties + states (`data/raw/gis/`) | `places` lookup (county names, dates, centroids) and period borders | **use** |
| R4 reservations (`research/reservations_R4.csv`) + T-002 points | reservation layer | **use** |
| USFS Royce layer | reservation outlines only (T-003, later) | later |
| **Cut:** `RevX_NER_Entity_Occurrences` (replaced by matching text against `places`), sentiment scores, cession/nation joins, witnesses, service table, name links between ads and households, SI collections, PDFs dataset | | |

OCR has no confidence column in the HF tables. Quality = text source used (transcription > RevX OCR > FamilySearch) plus the A05 validation samples.

## 2. Data model (parquet storage + DuckDB views)
Parquet in `data/interim/` and `data/processed/`, one file per table. `rx-pipeline/schema.sql`
defines the DuckDB views over them. No `.duckdb` file, no second copy.
Rule: store the finest grain the source **states**; derive everything else.

| Table | Grain | Key columns |
|---|---|---|
| **`households`** (fact) | 1 per NAID | NAID, claim_type (S/W/R/BLW), claim_nos[], blw_acres, veteran_name, widow_name, served_state, enlist_place_id, birth_year, birth_place_id, marriage_date, marriage_place_id, veteran_death_year, application_year, origin_place_id, final_place_id, n_moves, moved_west, first_move_after, first_move_before, reason_codes[], text_source, confidence |
| **`residences`** | 1 per place statement in a file | NAID, seq, person (veteran/widow), place_id, kind (born / enlisted / lived / removed_to / now_resides / married / died), date_from, date_to, precision, page, method, snippet |
| **`reasons`** | 1 per reason found in a file | NAID, reason_code (land, family, poverty, health, bounty, war_damage, …), page, snippet, method |
| **`ads`** | 1 per ad run (same text, same paper) | ad_id, lccn, paper, pub_place_id, first_date, last_date, n_issues, page_no, area_pct, ad_type, acres, price, price_per_acre, features[], image_url, text |
| **`ad_places`** (bridge) | ad × place named in the ad | ad_id, place_id, acres, price |
| **`places`** (shared lookup) | 1 per county (or state) | place_id, county, state, state_as_of, lat, lon, newberry_id, region (east / trans-Appalachian) |

Views (in `schema.sql`):
- `moves`: consecutive pairs in `residences` per NAID (from_place, to_place, move_after, move_before).
- **`place_period`** (the viz table): place × year or decade → households arriving (from move ranges), land ads run, ad types, papers, links to ad images.

Relocation time is a **range** (`move_after` … `move_before`), never a single date.
Theme and reason codebook: `docs/CODEBOOK.md` (hand-written, not a table).

## 3. Workstreams

**A: Pension → households (core, coached).** `rx-pipeline/`, raw (remote) → interim → processed.
| NB | Does | Output |
|---|---|---|
| A01_access (revise) | files table done; page index done; **declaration pages: every applicant declaration, not just the first** (declaration formula + the 2 pages after each; first "personally appeared" page as fallback); **new:** `reason_pages` | `interim/files_raw`, `pages_index`, `pages_decl`, `reason_pages` |
| A02_profile | profile text sources; read sample declarations side by side (S, W, R) | notes in NB |
| A03_clean | parse titles → claim_type, claim_nos[], blw_acres, name, served_state; coalesce text | `interim/files.parquet` |
| A04_places | build the `places` lookup from Newberry counties: names, period spellings, abbreviations, centroids | `processed/places.parquet` |
| A05_residences | regex: "now resides in", the 1832-Act chain, "removed to", widow marriage + residence; match to `places` | `interim/residences.parquet` |
| A06_reasons | sworn "reasons for removing" statements (pension transfers, 2,079 files) + reason keywords near a move on declaration pages; keyword codebook v0 → model gate for a better pass later | `interim/reasons.parquet` |
| A07_validate | 20 files per pattern, hand-labelled: precision + coverage | `interim/validation.csv` |
| A08_outputs | `households` + `schema.sql` views (`moves`, `place_period`) | `processed/households.parquet`, `residences`, `reasons` |

**B: Land ads (visual artifacts).** Identify land-sale blocks (prototype rule: acreage + sale
wording, 22,435 blocks) → group repeats into runs → acres, price, features, places named (matched to
`places`) → area % and image crop URL. Output `processed/ads.parquet`, `ad_places.parquet`.
No household link: ads join households only through `place_period`.

**C: Map layers.** Newberry period borders (by snapshot year) → reservation points (T-002) filtered
by date established and ended → outlines later (T-003).

**V: Viz.** Map of moves (origin → destination county, by period) · reservation layer on the same
timeline · click a county and period → households arriving + reasons, and the land ads run there
(images). Order: **A → C → V1 → B → V2**.

### Agent tasks (`tasks/`, each needs approval + a brief)
| Task | Agent | Goal | When | Status |
|---|---|---|---|---|
| T-001 S2 profile news | data-analyst | profile news; remote `hf://` queries; drop the NER-chronam part | before B | revise |
| **T-002 reservation points** | researcher (historian checks dates) | add `lat, lon, coord_method` to ~60 R4 rows → `data/processed/reservations_points.csv` | in parallel with A02–A05 | to draft |
| T-003 reservation outlines | researcher / coder | confirm Royce matches → `reservations.geojson` | after V1 | later |

## 4. v1 milestone
**Goal:** `households` + `residences` (state and county) and a first matplotlib map, in notebooks.
- Data: A01 revision → A03 → A04 → A05 (declaration residence + 1832 chain) → A08-lite.
- `V01_migration.ipynb`: origin → destination flows on Newberry borders (1820, 1832); veterans vs. widows; share who moved, by application decade; reservation points by date.
- Not in v1: ads, reasons, outlines.
- Done when: notebooks re-run end to end from HF; assertion cells pass; counts sit near prototype 2 (59,757 files with both states, ~52.8% moved) or the difference is explained.

## 5. Rough time (focused hours)
| Step | Mode | Est. |
|---|---|---|
| v1: A01 revision, A02–A05, A08-lite, V01 | coached | 16–22 h |
| T-002 reservation points + review | agent → review | 3–4 h |
| A06 reasons (keywords) + A07 validation | coached | 8–10 h |
| B land ads → `ads`, `ad_places`, images | coached | 10–14 h |
| Model gate + better reason codes | researcher → Lara → coached | 6–10 h |
| V2: place × period view with ads + final map | coached | 10–14 h |

## Verification
Assertion cells end every notebook (row counts, unique keys, no null keys, every `place_id` in
`places`). Each pattern reports coverage + precision. Historical claims and dates go through the historian.

## Risks and caveats
- Residence is stated at application (1818–1850s). Move dates are ranges, often wide (≈1783 → application).
- Ads run 1770–1810 and skew to VA/DC/PA: place × period shows **co-occurrence, not cause**.
- In W files the widow's residence is her own, at the time she applied, often after the veteran died.
- Maine ⊂ MA until 1820. County names change and split: `places` must be matched with dates.
- OCR has no confidence column. Handwritten OCR quality is unmeasured until A07.
- Reservations are a layer only. They show the countermovement visually, not as a measured relation.
