# T-008 B01_ads: land ads for the MVP
**DRAFT, not approved** · brief B-019 (draft) · agent: coder · run in a new session

**Goal:** layer 3 for the MVP: number of land ads per place named in the ad, 1770–1810.

**Input:** `config.DATASETS["ocr_blocks"]` (pinned) and `["news"]`; `rx-pipeline/notebooks/S3_profile_bins_prices.ipynb`
(land-sale rule, price regex); `data/processed/places.parquet`; PLAN §3a.

**Do:**
1. Land-sale blocks by the S3 rule; collapse repeats into ad runs (same text, same paper).
2. Match places named in the ad text to `places` (state-aware, dated); unmatched → paper's own place, flagged.
3. MVP output: place × decade → n_ads, n_runs, papers.
4. Also save per-ad fields for later (acres, price_as_stated, currency_as_stated, page, bbox, image URL);
   $/acre per §3a only after B-021 returns, otherwise leave null.

**Files:** `rx-pipeline/notebooks/B01_ads.ipynb`; `data/interim/ads.parquet`; `web/data/ads_places.json`. Nothing else.

**Done when:** runs remotely at the pinned revisions; assertions pass; match rate and the top 20 places printed;
10 sample ads with their matched place for Lara to check.

**Why an agent:** rules already set in S2/S3; Lara reviews matches and counts.
