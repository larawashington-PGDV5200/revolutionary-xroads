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
