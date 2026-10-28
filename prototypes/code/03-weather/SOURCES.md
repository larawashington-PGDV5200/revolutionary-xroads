# Sources — 03 Weather in print vs. memory

## Datasets (Hugging Face, Revolution Crossroads; CC0 / public domain)
| Dataset | Commit used | Fields used |
|---|---|---|
| `RevolutionCrossroads/loc_chronicling_america_1770-1810` | `0b97906ad32e269376872934820357fc333151d8` | `issue_date`, `newspaper_title`, `place_of_publication`, `RevX_OCR_text` → else `ca_ocr_text` |
| `RevolutionCrossroads/nara_revolutionary_war_pension_files` | `90f90867333c320af57a2ed1f43d5187c6685893` | `NAID`, `title`, `pageNumber`, `transcriptionText` → else `RevX_OCR_text` → else `fs_extractedText` |

## Method (`query.sql` + rules in `index.html`)
- Six weather types matched by regex (see `wtypes` in `query.sql`). Single words (snow, frost, froze, frozen, flood) match **lower-case only** to avoid surnames.
- Newspapers: % of each month's pages with a match (unit = page).
- Pensions: files whose ±320-character passage names a year 1760–1799 (unit = file; "remembered year").
- Excerpts: up to 500 random passages per type per source (pension sample prefers human transcriptions).
- **Impact categories** and **sentiment** are computed in the browser (`IMPACT_RULES`, `DISTRESS`/`RELIEF` lists) so they can be tuned. Sentiment = (relief − distress words) per 100 words; weather words aren't in the lists.

## Output (`data.js`)
`out_news_month` (1,880 rows), `out_pension_year` (89), `out_excerpts` (3,809).

## Known limits
- "Cold" in newspapers also matches **illness** ("a severe cold") in medicine ads.
- The lexicon sentiment is crude: most passages score 0 — treat it as a sketch, not a finding.
- Pension passages are memories written 1818–1850s; their years are what the witness said, not verified dates.
- Newspaper months with < 50 pages are greyed; coverage skew as in the other prototypes.
