# Plan — Prototype 2 → "Veterans West, Native Land" (working plan, D-005)

## Context
Prototype 2 shows served-state → applied-from-state flows plus land ads, but it uses only two text
signals, modern state outlines, and a thin Native flag (99 of 22,435 land ads). New focus: **Native
land sold to veterans** — how it was advertised, which treaties opened it, Native perspectives — on a
**historical map** with **territory/cession layers**, plus topline text analysis of veterans' testimony.
All data processing moves to **Python notebooks** (pandas), porting the prototype SQL, with Lara
coached through writing it. Research runs via agents in parallel. Window 1763–1840, east of the Mississippi.

## Gates (D-007) — apply to every step below
- **Brief:** no subagent runs until Lara approves its brief (logged in `log/PROMPTS.md`).
- **Task:** no workstream goes to an agent until its `tasks/T-NNN-*.md` is approved.
- **Model:** no ML/LLM model processes project data until the researcher has compared options
  (Hugging Face / Ollama: size, speed, accuracy, licence, local) and Lara approves. Choices TBD when reached.

---

## 1. Pipeline architecture (all workstreams share it)

```
rx-pipeline/                      ← in repo, code only
  config.py                       paths, HF dataset names + pinned commits, column lists
  rx/                             small shared module (DRY across notebooks)
    text.py                       coalesce_text(), normalise whitespace, boilerplate strip (later)
    places.py                     normalise_state()  ← port of normst() macro in prototypes/02/query.sql
    io.py                         read/write parquet by stage
  notebooks/
    A00_setup.ipynb … A06_outputs.ipynb   (B*, C*, D*, E* added later, same pattern)
  data_dictionary.md              one table per output: column, type, meaning, source signal

data/                             ← in project; git-ignored in the repo — data only
  raw/        downloaded parquet, never edited (column-projected, pinned commit)
  interim/    cleaned per-stage tables (re-creatable)
  processed/  final tables other workstreams read
```

Principles
- **Stages are one-way**: raw → interim → processed. Each notebook reads the previous stage's
  parquet and writes its own; any notebook can be re-run alone. No notebook edits raw.
- **Parquet between stages**, not CSV (keeps dtypes, lists, fast). CSV only for hand-label sheets.
- **Stable join keys** so workstreams combine later: `NAID` (pension file), `lccn`+`date`+`block_id`
  (news ad), `state`/`county` codes + `year` (map), `cession_id` (Royce number, from D).
- **pandas where it fits, chunked where it doesn't**: per-file tables (~78.7k rows) fit pandas
  easily; the 2.2M-page text table (~2.4 GB) doesn't fit comfortably. Process **one shard at a time**
  (12 shards), filter to relevant pages/columns, then concat the small results. Optional: DuckDB
  inside Python as a fast filter step (`duckdb.sql(...).df()` → pandas) — decide in A00.
- **Download only what's needed**: `pd.read_parquet(url, columns=[...])` via `huggingface_hub`
  pinned to the commits in `prototypes/02-migration-land/SOURCES.md` (pension `90f9086…`).
- Every extracted signal carries `method` + `snippet` columns so any value can be traced to text.

## 2. Workstream A — notebook sequence (coached)

| NB | Does | Output (stage) | You learn |
|---|---|---|---|
| A00_setup | venv, Jupyter, `config.py`, `rx/` stubs, folder layout | — | project structure, imports |
| A01_download | fetch pension shards (6 cols) + NER `collection=pension` + titles; size/row checks | `raw/` | HF hub, parquet, column projection |
| A02_profile | rows, nulls, pages/file, text-source mix (human / Chandra / FamilySearch), file types S/W/R/BLW, title patterns, sample pages read side-by-side | notes in NB | **knowing the data** — the core of this phase |
| A03_clean | coalesce text, normalise whitespace, OCR-source flag; parse `title` → type, number, name, served state (A1) | `interim/pages_*.parquet`, `interim/files.parquet` | `.str.extract`, regex, dtypes |
| A04_signals | one function per signal → long table `place_mentions` (NAID, page, signal, place_raw, state, county, year, method, snippet): A2 declaration state+**county**; **A3 1832-Act residence chain** (born / living at enlistment / lived since / now); A4 "removed to"; A5 agency transfers; A6 widow marriage place; A7 BLW warrant/acres/Act; A8 NER pension places; A9 campaigns vs. Native nations | `interim/place_mentions.parquet` | chunked processing, `groupby`, long vs. wide data |
| A05_validate | draw 50 files/signal, label by hand (CSV), compute precision + coverage | `interim/validation.csv` | why precision ≠ coverage |
| A06_outputs | resolve per veteran: served, origin, ordered moves, final residence, confidence, Native-campaign flag | `processed/veterans.parquet`, `processed/moves.parquet` + data dictionary | one-row-per-entity tables, joins |

Watch: 1832 Act only covers S/R files filed after 1832; Maine ⊂ MA until 1820; "Continental" line;
use human transcriptions (~39% of files) where precision matters.

## 3. Other workstreams (same pipeline, later)
- **B Land ads (Native lens)**: NER chronam blocks → widen Native terms (nation names, "old fields", "Indian boundary", treaty names, "secure from the Indians") → code ad descriptions (soil, water, timber, prior clearing, safety, price, warrants) → link destination to Royce cession → years since cession. Reprinted Native speeches via prototype 1 reprint clusters. Out: `processed/land_ads.parquet`.
- **C Testimony text analysis** (feeds prototype 3's tone panel): strip boilerplate → word/bigram frequency + keyness vs. newspapers → TF-IDF; embeddings, topic clusters, UMAP "vector view" and emotion scores **after the model gate** → emotion validated on 100 hand-labelled passages → cross with A9 flag. Out: `processed/passages.parquet`.
- **D Research (agents)**: treaties 1763–1840 (Kappler; NARA RG 11; LoC *Century of Lawmaking* — American State Papers Indian Affairs, Royce 1899); GIS layers (Royce cessions polygons, Newberry county/territory boundaries, NHGIS 1790–1810, Tanner atlas, Native Land Digital as caveated reference, Rumsey/LoC period maps); Native voices (ASP speeches, Founders Online, War Dept Papers, Aupaumut, Cherokee memorials, *Cherokee Phoenix*, Zeisberger diaries, Indian-Pioneer Papers, Doris Duke oral histories, Yale Indian Papers, NYPL Schuyler papers, DPLA; Native veterans' own pension files); Gwynne's bibliography mapped to eastern equivalents (his book is Comanche/Texas 1836–75). **Reservations (R4, added 2026-11-04)**: reserves and reservations east of the Mississippi 1763–1840 (colonial/state reservations, treaty reserves, individual reserves and allotments) with date established, date(s) inhabited and nation; boundaries from GIS where they exist, otherwise **extrapolated** from treaty and survey descriptions and flagged by `boundary_method` (surveyed / described / extrapolated). Out: `processed/treaties.csv`, `processed/cessions.geojson`, `processed/reservations.csv` + `reservations.geojson`, `sources.md` (Chicago author-date via historian agent).
- **E Map design**: historical borders base, Native territories overlay + reservations by year established (same layer group; extrapolated borders drawn dashed), cession layer by treaty year, veteran destinations, land ads, A9 points; time slider; lag cession → ad → veteran arrival; paired ad/Native-speech panel. Final build in JS (D3, or MapLibre if raster base map).

## 4. HF data vs. external
| Need | In HF | Outside |
|---|---|---|
| Service, residence chain, moves | Pension text, NER pension | — |
| Bounty land location | BLW mentions | BLM GLO patents, VA Military District, KY Land Office, NY Military Tract |
| Land ads, Native speeches in print | Newspapers | originals in ASP / Founders / War Dept |
| Treaties, cessions, historical borders | — | Kappler, Royce, NARA, Newberry, NHGIS, Tanner |
| Native-authored perspective | Native veterans' files, reprinted speeches | Cherokee Phoenix, memorials, oral histories |

## 5. Milestone: rough prototype by Mon Nov 10

**Goal for Nov 10:** most cleaning done; one rough prototype showing where workstreams overlap.
**Split:** Lara builds Workstream A coached → its notebooks become the template → agents replicate
it for B, C and D from approved tasks (same `config.py`, `rx/` module, stage folders, assertion cells). Lara reviews.

**Scope cut for A (to fit the week):** signals A1 served, A2 declaration state+county, A3 1832-Act
residence chain, A8 NER places, A9 Native-campaign flag. Defer A4–A7. Validate 20 files per signal, not 50.

**Prototype content (overlaps):** historical state/territory base (1790–1810) + Native territories + reservations (dated; extrapolated outlines marked) + Royce cessions by
treaty year + veteran moves from A (state level, county where A2/A3 have it) + Native-flagged land
ads from B + side panel: ad excerpt / pension excerpt (A9) / Native speech for the same place.
C shows as one small panel: top distinctive words in testimony, A9-flagged vs. not.
Build: low-fi agent-built sketch from `processed/` tables (same as Oct 27 prototypes, D-002);
your own JS build comes later. *(Flip this if you'd rather type it.)*

### Day plan
| Day | Lara (coached) | Agents in parallel | Check-in |
|---|---|---|---|
| Tue 3 | A00 setup, A01 download pension + NER-pension | ✅ **R1** treaties table (47 rows, some unverified) · ✅ **R2** GIS sources (USFS Royce layer CC BY 4.0, Newberry boundaries; NHGIS manual) · ✅ **S1** news, NER-chronam, GIS in `data/raw/` · *R1/R2 ran before the gates; Lara reviews outputs* | end of day: setup works, raw files listed |
| Wed 4 | A02 profile — read the data | **R3** Native-voices source list + Gwynne mapping (historian) · **S2** profile notebooks for news/NER-chronam (read-only, for your review) · *briefs approved first* | ✅ **#1**: what the pension data looks like; settle pandas-only vs. DuckDB filter |
| Thu 5 | A03 clean + title parse → **template locked**; write + approve `tasks/` for B, C, S3 | **S3** GIS prep: reproject, simplify, date-stamp cessions → `cessions.geojson`, `borders_1790/1800/1810.geojson` · **R4** reservations: dates + boundaries (historian + researcher; brief approved first) | ✅ **#2**: review template + brief before agents copy it |
| Fri 6 | A04 signals (A1, A2, A3, A8, A9) | **B** clean + Native flag + cession link (coder, approved task) · **C** clean + boilerplate strip + word frequency, no models (coder, approved task) | — |
| Sat-Sun 7-8 | A05 validate (20/signal) + A06 outputs + data dictionary | B/C finish; agent runs assertion cells on all `processed/` tables | ✅ **#3**: all processed tables, coverage + precision numbers |
| Mon 9 | review prototype; pick 3 overlap stories | prototype sketch from `processed/` | ✅ **#4**: rough prototype review |
| Tue 10 | **milestone** | — | — |

**Risks:** A04 regex work is the longest step (slip → cut A8 or A9); A3 coverage unknown until A02;
Royce layer found (R2, USFS, CC BY 4.0) but it starts in 1784 — pre-1784 cessions need points by date or hand-drawn shapes;
pension download ~2.4 GB with columns kept, so start A01 early; reservation outlines may be mostly extrapolated — show method on the map, never as surveyed fact.

## 6. After the milestone: full sequence, tools, rough time
Estimates assume coached data work (you type, Claude reviews via `coach-me` / `code-tutor`) and
agent-run research (you review). Hours are focused work; ~6–8 h/week ≈ 6–8 weeks total.

| Step | Work | Tools | Mode | Est. |
|---|---|---|---|---|
| 1 | A00–A01 setup + download | Python venv, JupyterLab/VS Code, pandas, pyarrow, huggingface_hub | coached | 3–4 h |
| 2 | A02 profile — know the data | pandas, notebook display | coached | 4–5 h |
| 2′ | **in parallel**: D treaties table + GIS layer sourcing | historian + general-purpose agents, WebSearch | agent → review | 3–4 h review |
| 3 | A03 clean + title parse | pandas `.str`, `re` | coached | 3–4 h |
| 4 | A04 signals A2–A9 | pandas, `re`, chunked loop (opt. duckdb) | coached | 8–10 h |
| 4′ | **in parallel**: D Native-voices source list + Gwynne mapping | historian agent | agent → review | 3–4 h review |
| 5 | A05 validate + A06 outputs + data dictionary | pandas, CSV hand-labelling | coached | 5–6 h |
| — | **Workstream A total** | | | **~23–29 h** |
| 6 | B land ads (Native lens) + cession link | pandas, geopandas, shapely | coached | 12–16 h |
| 7 | C text analysis | scikit-learn, nltk; embedding / topic / emotion models TBD via model gate | coached | 15–20 h |
| 8 | D GIS prep (reproject, simplify, date-stamp) | geopandas, mapshaper | coached | 5–8 h |
| 9 | E map sketch on historical base | D3 / MapLibre | coached | 8–12 h |

Order logic: A first (B, C and E all key on NAID/places); D research starts day one because B3 and E
need cession geometry; B before C because B reuses A's place normaliser and D's cessions.

## Verification
- Each notebook ends with assertion cells: row counts, unique NAIDs, no nulls in keys, value ranges.
- Each signal: coverage % + hand-checked precision (A05) recorded in the data dictionary.
- Spot-check 10 A3 residence chains against scanned page images.
- Re-run A03→A06 from `raw/` end to end; outputs must be identical.
- Historical claims and treaty dates through the historian agent before they reach a viz.
