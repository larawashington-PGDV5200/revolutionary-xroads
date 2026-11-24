# Data notes

Dataset facts, caveats and exploratory findings. Read before any data work.

## Datasets (all CC0 / public domain; queried with DuckDB SQL on parquet)
Use column = scope after the 2026-11-10 rescope (`docs/PLAN.md` §1).

| Dataset | Rows | Key fields | Use |
|---|---|---|---|
| `loc_chronicling_america_1770-1810` | 77,793 pages, 19,445 issues (`lccn` + date + `edition_order`), 110 `lccn`s / 105 title strings — join on `lccn`, 48 places | lccn, newspaper_title, place_of_publication, issue_date, Page, ca_ocr_text, RevX_OCR_text | B: ad metadata |
| `nara_revolutionary_war_pension_files` | 2.2M pages, ~78.7k files | NAID, title (encodes S/W/R/BLW + name + state), pageNumber, transcriptionText (~39% files), RevX_OCR_text, fs_extractedText | **core** (A, C) |
| `si_us_revolutionary_era_collections` | 12,667 objects | unitCode, title, date, indexed_names/places/topics/object_types, mediaURLs | cut |
| `RevX_OCR_results` | 3 configs: `block_level` 19,046,610 blocks, `page_level` 2,286,632 pages, `file_level` 101,053 files, all collections (HF info 2026-11-10; the older 11.8M note was likely one subset — check `collection` counts) | filename, collection, page_number, block_id, block_type, block_text, block_markdown, block_bbox (raw px, zero-indexed pages), OCR_run_ID | B: ad blocks, text + area on page |
| `loc_chronicling_america_1770-1810_issues` | 19,445 issues | lccn, issue_date, edition_order, issue_id, page_count, iiif_manifest, pdf_url | skip unless needed |
| `nara_revolutionary_war_pension_files_PDFs` ("File-Level", rev `1b44f5d…`) | 78,745 files, one row each; same NAIDs, titles and page counts as the page table (checked 2026-11-10); ~8 s remote | NAID, title, numberOfPages, logicalDate (mostly blank), pdfURL, RevX_OCR_bucket; page fields as lists (pageNumber, transcriptionText, RevX_OCR_text, fs_extractedText, pageImageURL); plus PDFs in `media/pdfs/` | not needed for v1 (page-level work is simpler on the page table); option for per-file metadata or PDF links |
| `RevX_NER_Entity_Occurrences` | 24M mentions | entity_type, entity_text_normalised, block_text, block_bbox, record_id (newspapers: `lccn_date_ed`); `page` counts from 1, only `block_id`/`block_bbox` count from 0; entity types `geographic_location`, `named_place`, `person`, `organization`, `temporal_event`, `calendar_date`, `named_vessel`, `norp`, `named_event` (no GPE/LOC) | later (ad destinations; A8 optional) |
| Bucket `RevolutionCrossroads_VLM_OCR` | per-document folders | `.chunks.json` (blocks + page width/height), `.json` (section_hierarchy), `.parse_quality.json`, `images/` (crop of a block; filename = md5(block_id)) — skip `.tex` | B, only if page size isn't in the tables |

Access (2026-11-05): HF data is **queried remotely** with DuckDB over `hf://datasets/RevolutionCrossroads/<name>@<revision>/…`
(pins + file lists in `rx-pipeline/config.py`); only filtered tables are saved to `data/interim/`. No local raw copy of HF data.
Remote timings (pension, 12 shards): row/NAID counts 3 s, title table 0.5 s, full-text regex over 2.2M pages 83 s (needs internet).
`data/` (raw = GIS only, interim, processed) is git-ignored; Documents is not iCloud-synced (checked 2026-11-03).

## External data in scope (2026-11-10)
| Source | Size | Use |
|---|---|---|
| Newberry AHCB state/territory (`data/raw/gis/newberry-ahcb-stateterr/`) | 101 shapes overlap 1783–1840; starts 1783-09-03 | historical borders (v1: 1820, 1832) |
| R4 reservations (`research/reservations_R4.csv`) | 66 rows: 34 treaty reserves, 17 colonial/state, 13 individual-reserve rows, 2 Native-granted; NY 17, OH 11, IN 6, FL 5 | points (v1, T-002), outlines later (T-003) |
| USFS Royce layer (`data/raw/gis/usfs-tribal-ceded-lands/`) | 718 polygons, 299 dated pre-1841; EPSG:4269 | reserve centroids/outlines; cessions for the timeline |
| R1 treaties (`research/treaties_R1.csv`) | 47 rows (a selection) | treaty timeline, last |

R4 mapping: ~60 rows can be points; 6 dispersed allotment classes can't (Fort Jackson, Cherokee 640-acre, Choctaw Art. XIV + chiefs, Creek, Chickasaw). ~30 rows have a probable Royce polygon (inferred, not yet confirmed). 3 rows have no founding date (Mattaponi, Mashpee, Golden Hill).

## Pension file types: what each holds
- **S** (survivor): veteran's own declaration: residence at application, often the 1832-Act chain (born / lived at enlistment / lived since / now).
- **W** (widow, 1836/1838/1848 Acts): widow's residence at application (often 1836–1850s, after the veteran died; may be her own later move); marriage date + place (proof of marriage, family Bible pages); veteran's death date, sometimes place; witnesses' residences; children's births. If the veteran applied before he died, his own declaration is in the same file.
- **R** (rejected): same shape as S or W, claim denied. **BLW**: bounty-land warrant number, acres, Act.
- Prototype 2 treated a W file's residence as "applied from" without separating widow from veteran.

## File codes (full breakdown: `research/R5-file-codes.md`)
- Spelling variants are one code: `S.` / `S` / `S2904` = S; `B. L. Wt.` / `B.L.Wt.` / `Bl.Wt.` / `Wt.` = BLWt. Match with `(?![a-z])`, not `\b`: `S2904` has no word boundary between the S and the 2.
- Drop titles containing "Not Rev" / "Mot Rev" (54 files: mostly Old War, a few BLWt).
- Dis., N.A. Acc. 874/837, pre-1800 warrant cards and unnumbered titles hold no declaration, so they never feed the residence chain.
- Unverified: Ctf., S.F., W.F., the Old War sub-letters, Old Act Navy.

## Data realities (always caveat)
- Newspapers skew to VA / DC / Alexandria / Philadelphia and to post-1795 (3,720 pages 1770–74; thin 1784–86 gap).
- News OCR: `RevX_OCR_text` is null/blank on ~1.9% of pages, and its length runs 0.53–1.14× `ca_ocr_text` per page (5th–95th pct), so the two aren't interchangeable (S2, 2026-11-04).
- Native-term regexes need word boundaries: bare `cession` matches concession/succession/secession. The 1799–1806 "cession" bump is likely Louisiana, not Native land. "indian" and nation names (delaware, creek, miami, seneca) hit 15–51% of pages: candidate filters only (S2).
- Pension testimony was written 1818–1850s *about* 1775–83 → it is memory, shaped by what each Pension Act required as proof.
- NER names are strings, not resolved people ("John Smith" → 6 files). Show match confidence; never assert identity.
- Common false hits: surnames Snow/Frost/Flood/Snowden; "drought" = militia "draught"; Maine ⊂ Massachusetts until 1820.
- Keyword ad classification has false positives; reprinted diplomatic letters got tagged "school".

## Findings so far (exploratory, unverified)
- Ads: goods 42% of ad area; runaway ads largest median size (2.3% of page) and 18.6% of ad area in 1770s; shipping ads most often on p.1 (45%). Most ads run 1–2 issues; max ~200.
- Reprints: texts in 7–12 titles are news (e.g., Erskine–Canning letters, Dec 1809, 9 titles in ~3 weeks).
- Advertisers: ~7,500 signers of ≥3 ads; 1,711 name-match a pension veteran, 536 with consistent state. Better link = advertiser appearing *inside* others' files (P. G. Marsteller, Alexandria auctioneer, = 1780 Lancaster Co. paymaster in ≥5 files). SI overlaps: Adam Lynn (silversmith, NPG 1805 print), Samuel Blodget (DC lottery, NPG portrait).
- Migration: ~47% of veterans applied from a different state than served. Top: CT/MA→NY, VA→KY, NC→TN, VA→TN, PA/NJ→OH.
- Bounty land in ~22k files; 160 acres (1855 Act) dominant; "military land" ads appear from 1792.
- Weather: news cold peak Jan 1780 (hard winter) & Jan 1794; storm peak Dec 1780 (Great Hurricane lag); fever 1794–1800. Dark Day (19 May 1780): 0 newspaper hits, 117 pension files. Widows' files mention weather more (10% vs 7%) — used as calendar anchors for marriage/birth.
- Impact categories from testimony: bodily suffering; terrain/logistics; time anchor; captivity/release; livelihood/poverty; destroyed records; displacement.

## Prototype findings (2026-10-27, see prototypes/*/SOURCES.md for method + limits)
- Reprints: 21,428 stories in ≥3 papers within 120 days; median 3 papers, median spread 13 days, median pickup lag 7 days; max 10 papers (1809 Erskine–Canning letters, 1802 Callender-era attacks on Adams, 1776 Arnold/Canada). 1784–86 gap = corpus gap.
- Migration: 59,757 files with both states; 52.8% applied from another state. Declaration-page residence works for ~50k files.
- Land ads: 22,435 land-sale blocks; 519 military/bounty, only 99 Native title/cession. VA papers → OH/TN/KY land dominate; military-land ads cluster 1795–1810.
- Weather: news peaks 1772-10 storm (40% of pages — 1772 Caribbean hurricane), 1780-01 cold 31%, 1780-12 storm 24%. Pension passages: war & military 56% vs news 19%; travel & terrain 35% vs 13%; news more property/trade. Lexicon sentiment ≈ 0 median for both — too crude.
- Time anchor rule (isTimeAnchor, life event + "dated by" weather phrase): pension 4.5% of passages (58/1,275; 40 are Dark Day) vs news 0.2%. Some false positives (poems, floods destroying records).

## Pipeline A results (2026-11-22, A06–A08; rules validated in A07)
- Residences: 111,317 rows in 64,315 files (101,967 regex rows + 9,350 most-frequent-state fallback). Regex finds ≥1 place in 89.5% of files with a declaration.
- A07 hand labels (20 per kind × precision; labelled by Claude at Lara's request): residence rules 89–97% correct on decided rows, 83% row-weighted strict. Main errors: `now_resides` grabbing the residence at enlistment or a witness's town; windows running into a later place; non-unique county names (Antrim, Ireland → MI). About 1 in 5 state-level rows had a county in the text that wasn't captured.
- Households: served vs. final = 60,003 files, 53.7% moved (prototype 2: 59,757, 52.8%). Origin vs. final: 60,477, 54.3% moved, 11,176 moved west. Top flows: CT→NY 3,138 · MA→ME 2,671 · MA→NY 2,289 · VA→KY 1,675.
- Moves view: 18,910 moves in 14,235 files; 5,577 dated at both ends; only 1,040 end by 1810 (964 files), which is why ads join by place × period only.
- Reasons: "reasons for removing" statements in 2,079 transfer files (1,638 with a coded reason). Statement codes family, age_health, land_work and climate are 90–95% correct; poverty 75%, spouse 53%, pension_admin 15%. Declaration keywords near "moved" are mostly service narrative (conflict 0%, war_damage 11%, health 20%): keep them out of the viz.

## Settlements (S01, 2026-11-24)
- Post offices (Blevins and Helbock, CC0): only geocoded offices are drawn, which skews toward long-lived offices (13,469 of 20,008 established by 1840).
- Gibson (1998) urban places ≥ 2,500: the 1840 list stops at the top 100, and 10 places are carried from 1830 (`carried_1840`). 111 places drawn, 14 on hand coordinates (`research/urban_coords_override.csv`). Moyamensing and Southwark (Philadelphia districts) are unverified landmark points.

## Migration by decade (V00, 2026-11-24)
- An undated leg takes the application year. The 1830s and 1840s spike (22,392 and 7,769 legs) is partly filing date: 9,336 and 4,609 legs there are `application`, not dated. 514 legs have no year and are excluded and counted.
