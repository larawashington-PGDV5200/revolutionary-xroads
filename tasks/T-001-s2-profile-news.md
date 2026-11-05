# T-001 S2 — profile news + NER-chronam (read-only)
Approved by Lara 2026-11-04 · agent: data-analyst · brief B-004

**Goal:** profile `data/raw/news/*.parquet` (6 shards) and `data/raw/ner_chronam/part-00000.parquet`:
rows, nulls, date range by year, titles and places, OCR source mix (`RevX_OCR_text` vs. `ca_ocr_text`),
text length, `entity_type` counts, top places (GPE/LOC), how NER `record_id` joins to news
`lccn` + date + edition, and blocks with Native terms (the prototype list in `prototypes/`) by year.
End each notebook with assertion cells and a findings cell.

**Files:** `rx-pipeline/notebooks/S2_profile_news.ipynb`, `rx-pipeline/notebooks/S2_profile_ner_chronam.ipynb`. Nothing else.

**Environment:** a throwaway venv in the session scratchpad (pandas, pyarrow, duckdb, jupyter/nbconvert).
Don't install anything into the project `.venv` (Lara builds it in A00).

**Done when:** both notebooks run top to bottom and are saved with outputs; the assertion cells pass;
each notebook ends with a findings cell.

**Why an agent:** read-only orientation on data Lara will code herself later in B; frees her for A00–A02.
