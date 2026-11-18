# T-001 S2 — profile news for land ads (read-only, remote) · rev. 2
Approved by Lara 2026-11-04 (rev. 1, brief B-004) · **rev. 2 approved by Lara 2026-11-17, brief B-010** · agent: data-analyst

**What changed (rev. 2):** news now feeds only workstream B (land ads as visual artifacts, by place × period).
Local raw copies were deleted (D-008), so all queries run remotely over `hf://` at the pinned revisions.
NER-chronam is cut (PLAN §1) and so is the Native-term section.

**Goal:** profile what B needs from two remote sources:
1. `loc_chronicling_america_1770-1810` pages (pin in `rx-pipeline/config.py`): rows, nulls, pages per year and
   per place, titles, OCR source mix and text length (keep rev. 1 sections 1–6, now remote); **plus** the
   image fields B will use (`jpeg2000_url`, `pdf_url`, page no.): present, null, URL pattern.
2. `RevX_OCR_results` `block_level`, news collection only: block count, `block_type` counts, `block_bbox`
   format, and how a block joins to a page (filename → `lccn` + date + edition + page; pages zero-indexed).
   Whether page width/height exist anywhere in the tables (needed for area %).
3. Land-sale blocks by the prototype rule (`prototypes/code/02-migration-land/query.sql` line 51:
   acreage + sale wording), run on `block_level` text: count by year, by place, by `block_type`; 10 sample blocks.

**Files:** `rx-pipeline/notebooks/S2_profile_news.ipynb` (rewrite in place). Nothing else.
`S2_profile_ner_chronam.ipynb` was deleted by Lara (2026-11-17).

**Environment:** throwaway venv in the session scratchpad (pandas, pyarrow, duckdb, jupyter/nbconvert).
Nothing installed into the project `.venv`. Nothing written to `data/`. Pin `RevX_OCR_results` to one
revision and state it in the notebook (don't edit `config.py`; propose the pin in the findings).

**Done when:** the notebook runs top to bottom from HF and is saved with outputs; assertion cells pass;
it ends with a findings cell that lists anything contradicting `docs/DATA.md`.

**Why an agent:** read-only orientation on data Lara will code herself in B; frees her for A01–A05.
