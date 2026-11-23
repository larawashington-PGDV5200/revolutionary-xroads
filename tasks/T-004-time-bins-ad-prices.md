# T-004 Time bins + ad price coverage (read-only profile)
**Approved by Lara 2026-11-22** · brief B-015 · agent: data-analyst
Rule for ranged moves (Lara): count each move once, in the bin of its "happened by" date (`move_before`); no duplicates across bins.

**Goal:** give the evidence to fix the slider bins (PLAN §3) and to say how many land ads can show $/acre (L3).

**Do:**
1. Moves (`schema.sql` view `moves` over `data/processed/`): distribution of `move_after`, `move_before`
   and range width; share of moves inside one decade, one 5-year bin, or spanning more; flows per decade
   under the "arrived by `move_before`" rule vs. range midpoint. Same for `households.application_year`
   (1818 / 1832 / 1836+ spikes).
2. Land-sale blocks (prototype rule, as in S2): count with acreage; with a price; with both; currency words
   (£, pounds, shillings, dollars, $) by year and state; 10 samples with both.
3. Recommend bins (decades vs 5-year vs Act-period) with the counts that back it.

**Files:** `rx-pipeline/notebooks/S3_profile_bins_prices.ipynb` (new). Nothing else.

**Done when:** notebook runs end to end; tables for 1–2; a 5-line recommendation at the end.

**Why an agent:** read-only profiling of tables that already exist; Lara reviews the numbers, not the code.
