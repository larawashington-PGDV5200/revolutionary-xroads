# Sources — 02 Migration & land

## Datasets (Hugging Face, Revolution Crossroads; CC0 / public domain)
| Dataset | Commit used | Fields used |
|---|---|---|
| `RevolutionCrossroads/nara_revolutionary_war_pension_files` | `90f90867333c320af57a2ed1f43d5187c6685893` | `NAID`, `title`, `pageNumber`, `transcriptionText` → else `RevX_OCR_text` → else `fs_extractedText` |
| `RevolutionCrossroads/RevX_NER_Entity_Occurrences` (config `chronam`) | `54b6ea35ae2eaeacc70988606d9bab689e3e2ec1` | `record_id`, `block_id`, `block_text` (one block ≈ one ad) |
| `RevolutionCrossroads/loc_chronicling_america_1770-1810` | `0b97906ad32e269376872934820357fc333151d8` | `lccn`, `newspaper_title`, `place_of_publication` |
| Basemap: `us-atlas@3` `states-10m.json` (jsDelivr CDN) | v3 | modern state outlines |

Original institutions: National Archives (Series NAID 300022, M804), Library of Congress *Chronicling America*.

## Method (`query.sql`)
- **State served** = last comma-segment of the NARA file title (e.g. "…, Samuel Willington, Mass."); multi-state titles → first state. "Continental" excluded.
- **State applied from** = first "State of X" on the first page containing "personally appeared" (49,679 files); fallback = most frequent "State of X" in the file (14,336). 14,730 files have neither.
- **Bounty-land destinations** = files mentioning bounty land / land warrant that also name a western place (a mention, not proof the land was there).
- **Land ads** = blocks with acreage/tract wording + sale wording (22,435). Flags: `military` (military/bounty land, warrants) 519; `native` (Indian title/claim/lands, ceded, cession, Greenville) 99. Destination keywords → KY, OH, TN, IN, MS, LA, NY-west.

## Output (`data.js`)
`out_flows` (served × lived × S/W/R counts), `out_landflows` (paper state × land destination × year), `out_bl`, `out_landads` (423 flagged excerpts).

## Known limits
- Residence is the state of the **court/declaration**, usually where the applicant lived when applying (1818–1850s), not where they first moved.
- MA→ME is partly administrative: Maine was part of Massachusetts until 1820.
- Modern state outlines are anachronistic; OH/IN/TN/MS were territories or Native land for much of 1790–1810.
- Land-ad destinations depend on the ad naming the place; the *Kentucky Gazette* inflates KY.
- Veteran lines and land-ad lines use **separate width scales** (stated on the page).
