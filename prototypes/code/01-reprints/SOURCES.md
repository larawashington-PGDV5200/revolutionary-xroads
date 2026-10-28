# Sources — 01 Reprinted news

## Datasets (Hugging Face, Revolution Crossroads; CC0 / public domain)
| Dataset | Commit used | Fields used |
|---|---|---|
| `RevolutionCrossroads/RevX_NER_Entity_Occurrences` (config `chronam`) | `54b6ea35ae2eaeacc70988606d9bab689e3e2ec1` | `record_id` (= `lccn_issue-date_edition`), `block_id`, `block_type`, `block_text` |
| `RevolutionCrossroads/loc_chronicling_america_1770-1810` | `0b97906ad32e269376872934820357fc333151d8` | `lccn`, `newspaper_title`, `place_of_publication`, `issue_date` |

Original institutions: Library of Congress, *Chronicling America* (NEH/LoC National Digital Newspaper Program); text = Chandra OCR 2 layout blocks (DataLab), entity rows = gemma-4-12b-it extraction (Revolution Crossroads).

## Method (`query.sql`)
1. Units = Chandra layout **Text blocks ≥ 300 characters that contain at least one named entity** (1.07 M blocks). Blocks without any entity are not in this source.
2. Text normalised to lower-case letters; two blocks match if they share an identical 80-character window at offset 0/80/160/240.
3. Dropped: windows shared by > 40 blocks, windows whose printings are > 365 days apart, and legal formulae ("in testimony whereof", "be it enacted", …).
4. Matches grouped into stories (connected components). Kept: printed in ≥ 3 different papers within 120 days of the first printing; ≤ 4 printings per paper; not ad-like (for sale, reward, lottery…).
5. `kind`: keyword rule on the first 300–400 characters (official/political · foreign · other).

## Output (`data.js`)
`out_papers` (110), `out_story` (21,428 stories; `rows` = `[paperId, day offsets…]`), `out_year` (pages & papers per year).

## Known limits
- Exact-window matching misses reprints whose OCR differs → spread is **under-counted**.
- "First printing" = first in *this corpus*, not necessarily the true origin.
- Coverage skews VA/DC/PA and post-1795; gaps 1784–86. Read every pattern against the grey pages-per-year bars.
- No link to pensions / Smithsonian is drawn: nothing in the reprint data supports one without stretching.
