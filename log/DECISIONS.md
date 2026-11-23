# Decisions

Format: what was decided, why, what was rejected, and in → out (feeds the diagram).
D-001–D-003 were written after the fact (2026-10-30).

## D-001 Choose three directions · 2026-10-27
**Why:** exploring potential project directions.
**Rejected:** newspaper ads (they stay local), advertiser↔veteran links (name matches unreliable)
**In → out:** datasets, exploration → directions

## D-002 Claude builds quick prototypes of all three · 2026-10-27
**Why:** see the real shape of the data before committing; the final build is written separately.
**Rejected:** hand-building one direction first (too slow to compare)
**In → out:** directions → prototypes

## D-003 Prototypes go in the repo · 2026-10-28
**Why:** shows the process from the start; screenshots make the README readable.
**In → out:** prototypes → repo README

## D-004 Agent sandbox outside the repo · 2026-10-30
**Why:** course requires documented, iterative AI use; Lara controls what reaches the repo and writes viz code herself unless a coder task is briefed.
**Rejected:** full transcripts (too noisy), agents writing to the repo, a separate git history for the sandbox
**In → out:** course brief → sandbox
**Prompt:** P-001

## D-005 Prototype 2 becomes "Veterans West, Native Land" · 2026-11-03
**Why:** the prototype used modern state outlines and a thin Native flag (99 of 22,435 land ads); the real story is Native land sold to veterans, on a historical map with cession layers.
**Rejected:** extending the SQL prototype; data work moves to Python notebooks Lara writes, coached.
**In → out:** prototypes, data notes → plan (`docs/PLAN.md`), research R1/R2

## D-006 Move everything into the repo · 2026-11-03
**Why:** agents need to run from the repo folder (project agents only load there); one home is simpler than syncing a sandbox.
**Rejected:** keeping a separate sandbox and copying finished files over.
**Kept from D-004:** raw logs and data stay local (git-ignored); Lara copies the files over by hand, then commits and pushes herself.
**In → out:** sandbox, plan → repo

## D-007 Approval gates for agents and models · 2026-11-03
**Why:** Lara keeps control of what agents do and what processes the data, and every step is documented.
**Gates:** brief approved before any subagent runs; task defined before any workstream handoff; any ML/LLM processing model compared (HF/Ollama) and approved first.
**In → out:** course brief, R1/R2 run without approval → orchestrator rules (`CLAUDE.md`)
**Prompt:** P-002

## D-008 Query HF data remotely; save only filtered tables · 2026-11-04
**Why:** no need to hold full copies locally; interim tables stay small. DuckDB fetches and filters, pandas does the logic.
**Rejected:** keeping full local copies of the HF datasets.
**Done:** local news and NER-chronam copies deleted. Lara approved; pending her run (agents can't write to `data/`).
**In → out:** HF datasets, `docs/DATA.md` → filtered tables in `data/interim/`

## D-009 A00 code written by Claude; A01+ coached · 2026-11-04
**Why:** Lara asked Claude to give the A00 setup code; from A01 on she writes the notebooks herself, coached (as in D-005).
**In → out:** plan, D-005 → A00 setup, A01+ notebooks

## D-010 Reservations added to the territories stage · 2026-11-04
**Why:** Lara asked for reservations (with dates established and inhabited, and land outlines) alongside the Native territories overlay, at the same stage as D/E. Outlines may be extrapolated from boundary text; those are flagged by `boundary_method`.
**Rejected:** ? (ask Lara)
**In → out:** plan, R4a/R4b → plan D/E (reservations layer)
**Prompt:** P-003

## D-011 Historian may write data files · 2026-11-04
**Why:** the R3 run wrote the .md but not the CSV because its rules forbade data files; Lara updated its `agent.md` (B-005).
**In → out:** R3 gap → historian `agent.md`

## D-012 Rescope to "Revolution Migration" · 2026-11-17
**Why:** the grain was too fine and the joins too many. Households and their moves (when, where, why) from the pension files are the core. Land ads become visual artifacts joined by place × period only, and reservations become a dated layer showing the countermovement.
**Rejected:** NER, sentiment, cession joins, witnesses, service table, name links between ads and households; a household-level ad link (only 964 files have a move ending by 1810).
**In → out:** "Veterans West" plan → `docs/PLAN.md` (6 tables + 2 views, county grain, parquet + DuckDB)

## D-013 A06–A08 written and A07 labelled by Claude · 2026-11-22
**Why:** Lara asked Claude to finish the A notebooks and do the validation itself, to keep moving. This is an exception to D-009 (coached notebooks) and to the model gate (D-007): Claude, an LLM, read and labelled 460 sampled snippets.
**Scope:** labels are only for measuring rule precision (`interim/validation.csv`, column `labeller`). They don't feed any table. No model labels the full data.
**Result:** residence rules 89–97% correct (decided rows); reason-statement codes family / age_health / land_work / climate ≥ 90%; declaration-near-move codes dropped from the viz.
**Rejected:** Lara hand-labelling (time).
**In → out:** guide answer keys → `A06_reasons`, `A07_validate`, `A08_outputs`, `rx-pipeline/schema.sql`, `docs/CODEBOOK.md`

## D-014 Final output is an exploded axonometric of 6 layers · 2026-11-23
**Why:** Lara has a clear picture of the final viz (reference images: exploded axonometric urban-systems analyses); the layers tell the narrative of time. She chose deck.gl over D3 + CSS 3D.
**Decided:** interactive web page, built in deck.gl; one time slider (see `docs/PLAN.md`).
**Rejected:** the 2026-11-17 notebook-map plan (replaced); D3 + CSS 3D.
**In → out:** D-012 plan → `docs/PLAN.md` (revised 2026-11-22)
**Prompt:** P-004

## D-015 Native research back in scope, as layers only · 2026-11-23
**Why:** layers 2 and 5 need Native territory to show the hypothesis (effect of migration on Native nations).
**Decided:** relaxes D-012; layers only, no joins. L2 = "land not yet ceded to the US (Royce 1899)" with R7 fixes; empty areas are disclaimed.
**Rejected:** Whose Land (Canada-focused, built on Native Land, contemporary, no reuse terms) and Native Land.
**In → out:** D-012, R1/R4/R7 → layers 2 and 5 (T-007)

## D-016 Migration shows every documented move, no decade bins · 2026-11-23
**Why:** S3 profile: median range is 65 years and 81% of claims end at the application year, so bins would flatten it. Lara: every person should be traceable to every documented place (born, served, interim moves, applied from).
**Decided:** all claim types at once; Pension Acts as markers/filter; per-person paths. The decade slider applies only to the dated layers 2, 5 and 6.
**Rejected:** decade bins for migration.
**In → out:** S3, claims table → T-005 flows, nodes, paths

## D-017 Map extent follows the data; flows are state→state with county drill-down · 2026-11-23
**Why:** Lara: "wherever there's activity"; state flows stay readable, county-to-county would be too dense.
**Decided:** extent = wherever the data has activity (including trans-Mississippi, e.g. MO/AR/IA).
**In → out:** pension data → map footprint, flows

## D-018 Land ads: MVP is circles by number of ads · 2026-11-23
**Why:** only 3.1% of land-sale blocks state both acres and price (S3); MVP focus.
**Decided:** $/acre comes later, in nominal USD per PLAN §3a, only where a price is stated. Chart removed.
**In → out:** land ads → T-008 `ads_places.json`

## D-019 Settlement / post-office layer cut · 2026-11-23
**Why:** Lara's call, keeping the layer set lean.
**In → out:** plan → 6 layers

## D-020 Atack transport GIS used with citation · 2026-11-23
**Why:** Lara: citing it doesn't inhibit using or drawing lines from his data.
**Decided:** cite him; Lara emails him about the project afterwards.
**In → out:** R6 → layer 6 (T-009)

## D-021 Agents write the remaining data notebooks · 2026-11-23
**Why:** A01–A08 were worked through for learning; the remaining notebooks prioritise efficiency.
**Decided:** T-005 to T-009 are streamlined, with markdown only to describe the data. Exception to D-009 (coached notebooks).
**In → out:** D-009, tasks T-005–T-009 → V00, E01, C01, B01, D01
**Prompt:** B-016 to B-020

## D-022 Lisa Brooks not labelled Native-authored · 2026-11-23
**Why:** her identity is disputed by Odanak and Wôlinak leaders.
**In → out:** R3 → source labels

## D-023 OCR pin added to config.py; revx (.venv) kernel registered · 2026-11-23
**Why:** the pin keeps remote queries reproducible; the old kernel launched a pipx Python without duckdb.
**In → out:** B-010 findings → `rx-pipeline/config.py`, kernels
