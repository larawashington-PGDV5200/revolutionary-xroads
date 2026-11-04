# Data notes

Dataset facts, caveats and exploratory findings. Read before any data work.

## Datasets (all CC0 / public domain; queried with DuckDB SQL on parquet)
| Dataset | Rows | Key fields |
|---|---|---|
| `loc_chronicling_america_1770-1810` | 77,793 pages, 19,445 issues, 105 titles, 48 places | lccn, newspaper_title, place_of_publication, issue_date, Page, ca_ocr_text, RevX_OCR_text |
| `nara_revolutionary_war_pension_files` | 2.2M pages, ~78.7k files | NAID, title (encodes S/W/R/BLW + name + state), pageNumber, transcriptionText (~39% files), RevX_OCR_text, fs_extractedText |
| `si_us_revolutionary_era_collections` | 12,667 objects | unitCode, title, date, indexed_names/places/topics/object_types, mediaURLs |
| `RevX_OCR_results` | 11.8M blocks | block_type, block_bbox (raw px, zero-indexed pages) |
| `RevX_NER_Entity_Occurrences` | 24M mentions | entity_type, entity_text_normalised, block_text, block_bbox, record_id (newspapers: `lccn_date_ed`) |
| Bucket `RevolutionCrossroads_VLM_OCR` | per-document folders | `.chunks.json` (blocks + page width/height), `.json` (section_hierarchy), `.parse_quality.json`, `images/` (crop of a block; filename = md5(block_id)) — skip `.tex` |

Download: `https://huggingface.co/datasets/RevolutionCrossroads/<name>/resolve/main/data/train-0000N-of-000NN.parquet`
(pension 12 shards ≈2.4 GB; news 6 shards ≈1.8 GB; NER chronam `parquet/collection=chronam/part-00000.parquet`).
Data lives in `data/` (raw/interim/processed; Documents is not iCloud-synced, checked 2026-11-03) — git-ignore it in the repo. DuckDB in a venv is fast (full-text regex over 2.2M pages ≈3 s).

## Data realities (always caveat)
- Newspapers skew to VA / DC / Alexandria / Philadelphia and to post-1795 (only ~2,600 pages 1770–74).
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
