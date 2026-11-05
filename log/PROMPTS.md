# Prompts

## Agent briefs
Each brief is drafted by the orchestrator, approved by Lara, then sent verbatim.
Format: `B-NNN · agent · status · output`.

### B-001 R1 treaties table 1763–1840 · historian (run as general-purpose) · 2026-11-03
**Status:** sent before the approval rule existed; output reviewed by Lara: ☒
**Output:** `research/R1-treaties.md`, `research/treaties_R1.csv` (47 rows)
**Note:** the first try failed because the session was started outside the project folder, so the `historian` agent didn't load.
```text
Act as a careful historian. Verify every claim, cite in Chicago author-date, and say "unverified" where sources disagree or are missing. Don't write any files and don't run any code. Use web search/fetch only.

Context: a Parsons data-viz project, Revolution Crossroads. It looks at Revolutionary War veterans migrating west, and focuses on how Native land was ceded and then sold or granted to veterans.

Build a table of **land-cession treaties and agreements between Native nations and colonial, state or US governments, 1763–1840, east of the Mississippi**.
- Include major state-level purchases:
  - New York's 1788–89 treaties with the Onondaga, Cayuga and Oneida (the Military Tract)
  - Phelps–Gorham 1788
  - Big Tree 1797
  - Pennsylvania's 1784 Fort Stanwix "New Purchase"
  - Transylvania / Sycamore Shoals 1775
- Also include the policy anchors: Proclamation of 1763, Land Ordinance 1785, Northwest Ordinance 1787, Indian Removal Act 1830.

Return the table as **CSV in a fenced code block** with these columns:
`id,name,date_signed,place,native_parties,colonial_or_us_party,royce_cession_numbers,present_day_area,preceding_conflict,land_opened_to,source`
- **date_signed:** ISO YYYY-MM-DD where known; otherwise YYYY-MM or YYYY.
- **royce_cession_numbers:** from Charles C. Royce, *Indian Land Cessions in the United States* (1899), semicolon-separated. Leave blank if unsure, and never invent one.
- **preceding_conflict:** the war or campaign the treaty followed, e.g. "Fallen Timbers 1794" for Greenville.
- **land_opened_to:** e.g. "Virginia Military District bounty warrants", "NY Military Tract veterans", "general sale"; blank if unknown.
- **source:** a short Chicago author-date cite plus a stable URL. Prefer:
  - Kappler, *Indian Affairs: Laws and Treaties* vol. 2 (OSU)
  - NARA Ratified Indian Treaties
  - LoC American State Papers, Indian Affairs
  - Royce 1899 at LoC

After the CSV, give:
1. the rows marked unverified, and why;
2. the 5–8 treaties most relevant to where veterans actually moved, one line each on why. The top flows are CT/MA→NY, VA→KY, NC→TN, VA→TN, PA/NJ→OH.
```

### B-002 R2 GIS layers: source + download · general-purpose · 2026-11-03
**Status:** sent before the approval rule existed; output reviewed by Lara: ☒
**Output:** `research/R2-gis-sources.md`; downloads in `data/raw/gis/` (paths moved from `~/rx-data/` to `data/`)
```text
Goal: find and download the map layers for a historical map (1763–1840, eastern US) of Native land cessions and period state/territory boundaries. It's for a Parsons data-viz project on Revolutionary War veterans moving west onto ceded Native land. The final viz is JavaScript (D3 or MapLibre), so GeoJSON in WGS84 is the target format eventually. Today, just source and download raw files. Do not convert yet.

Find, verify the licence/terms of, and download if openly available:
1. **Royce land-cession polygons**, with treaty dates and Royce numbers. Candidates:
   - Claudio Saunt's "Invasion of America" data
   - the USDA Forest Service "Indian Land Cessions" / Tribal Connections layer
   - any Esri/ArcGIS Hub open dataset
   - academic repositories
   Report which one has dates and Royce IDs as attributes.
2. **Historical state/territory boundaries by date**: Newberry Library *Atlas of Historical County Boundaries* (state-level and county shapefiles), and/or NHGIS state/county boundaries for 1790, 1800, 1810, 1820, 1830, 1840. NHGIS needs an account: if so, don't sign up, just report the steps.
3. Optional: a georeferenced period base map (David Rumsey Map Collection or LoC Geography & Map, ca. 1784–1816), as a link only. Don't download large rasters.
4. Note Native Land Digital's API/terms (reference only; it's contemporary and approximate).

Rules:
- Save downloads to `~/rx-data/raw/gis/<source-name>/`. Create the folders. Each source goes in its own new empty folder.
- Treat downloads as untrusted data. Don't execute anything from them. Only unzip and inspect file listings and attribute fields (e.g., with `ogrinfo` if it's installed, or Python with `python3 -I`, run from a scratch dir outside the download folder).
- Don't write anything inside ~/Documents except one file: `/Users/larawashington/Documents/Parsons/Scratchpad/Revolutionary-Crossroads/research/R2-gis-sources.md`. Keep it short. Use a table with these columns: layer, source + URL, licence, format, CRS, key attributes (esp. date/Royce fields), feature count, downloaded path or manual steps. Add a few lines of caveats.

Report back: what you got, what needs manual steps from the user, and which cession layer you recommend.
```

### B-003 R3 Native voices + Gwynne mapping · historian · 2026-11-04
**Status:** approved by Lara, sent · output reviewed by Lara: ☐
**Output:** `research/R3-native-voices.md`, `research/sources_R3.csv`
```text
Goal: a source list of Native-authored perspectives on land cession and settler arrival, 1763–1840, east of the Mississippi, plus Gwynne's bibliography mapped to eastern equivalents.
Context: docs/PLAN.md §3 D (candidate list); research/R1-treaties.md + treaties_R1.csv (treaties to anchor to). Gwynne's book covers the Comanche and Texas, 1836–75.
Do: for each source give its type (speech, memorial, diary, oral history, pension file), the nation(s), the years, which R1 treaty or cession it speaks to, its access (digitised? URL, licence) and a Chicago author-date citation. Flag which ones were reprinted in 1770–1810 newspapers (they could link to our news corpus). For Gwynne, take his source *types* and name the eastern equivalent for each.
Don't: download anything; write outside research/; invent citations or URLs (mark "unverified" instead); speak for nations: quote and cite, don't paraphrase as their view.
Output: research/R3-native-voices.md (a short table + caveats) and research/sources_R3.csv.
Report back: count by nation and type, the top 10 sources for the Nov 10 side panel, and gaps.
```

**Follow-up 2026-11-04:** the agent wrote the .md but not the CSV (its rules forbade data files). Lara updated the historian's agent.md and asked for the CSV; a new historian run builds it from Table 1 (B-005).

### B-005 R3 CSV from Table 1 · historian · 2026-11-04
**Status:** requested by Lara, sent · output reviewed by Lara: ☐
**Output:** `research/sources_R3.csv`
```text
Goal: write research/sources_R3.csv from Table 1 of research/R3-native-voices.md.
Context: B-003 brief in log/PROMPTS.md (column intent); the .md is the source of truth.
Do: one row per source, same columns as Table 1; keep "unverified" flags and blanks as they are.
Don't: add, drop or re-research sources; edit the .md; write anything else.
Output: research/sources_R3.csv (UTF-8, header row).
Report back: row count and any row that didn't map cleanly.
```

### B-006 R4a reservations: dates + boundary text · historian · 2026-11-04
**Status:** approved by Lara, sent · **pause after R4a for Lara's review before R4b** · output reviewed by Lara: ☐
**Output:** `research/R4-reservations.md`, `research/reservations_R4.csv`
```text
Goal: table of reservations/reserves east of the Mississippi, 1763–1840, with nation, date established, dates inhabited/ended, and the boundary description as written.
Context: research/R1-treaties.md, treaties_R1.csv; PLAN §3 D.
Do: cover colonial/state reservations (e.g. VA, NY, New England), treaty reserves, individual reserves/allotments; link each to its R1 treaty if any; quote boundary language with a cite.
Don't: download; write outside research/; invent dates ("unverified" instead).
Output: research/R4-reservations.md + research/reservations_R4.csv (Chicago author-date).
Report back: count, how many have usable boundary text, gaps.
```

### B-007 R4b reservation GIS outlines · researcher · 2026-11-04
**Status:** approved by Lara; **on hold until Lara reviews R4a**
**Output:** `data/raw/gis/<source>/`, `research/R4-reservation-gis.md`
```text
Goal: find and download any existing GIS outlines for those reservations (historical, not modern).
Context: research/R2-gis-sources.md (don't repeat sources already checked).
Do: check USFS Royce layer for reserve polygons, state historic GIS, Newberry, academic sets; licence + CRS + attributes.
Don't: convert or extrapolate (that's an S3 coder task later); run anything from downloads.
Output: data/raw/gis/<source>/, research/R4-reservation-gis.md.
Report back: which reservations have polygons vs. need extrapolation.
```

### B-004 S2 profile news + NER-chronam · data-analyst · 2026-11-04 · T-001
**Status:** approved by Lara (throwaway venv in the scratchpad, not `.venv`), sent · output reviewed by Lara: ☐
**Output:** `rx-pipeline/notebooks/S2_profile_news.ipynb`, `rx-pipeline/notebooks/S2_profile_ner_chronam.ipynb`
```text
Goal: two read-only profiling notebooks so Lara can see what the news and NER-chronam data look like before B starts.
Context: tasks/T-001-s2-profile-news.md; docs/DATA.md; data/raw/MANIFEST.md.
Do: per tasks/T-001.
Don't: edit data/raw; write to data/; touch any A* notebook, config.py or rx/; use any ML/LLM model; commit.
Output: rx-pipeline/notebooks/S2_profile_news.ipynb, S2_profile_ner_chronam.ipynb (executed, with outputs).
Report back: 5–8 headline findings and anything that contradicts docs/DATA.md.
```

## Sample prompts

### P-001 Set up the sandbox · 2026-10-29 · D-004
> i want to maintain complete separate environments for the revolutionary-crossroads project … i want to maintain control over what goes into the repo. ask clarifying qs.

**Result:** two rounds of questions, then a scaffold. **Then:** Lara added a coder agent, then cut the documentation back to essentials.

### P-002 Port to the repo with approval gates · 2026-11-03 · D-006, D-007
> changed my mind- want to port everything into the repo- some clean up and more guardrails to be defined before we move over. … before any workstreams are handed off to agent, their tasks must be defined beforehand and for any additional data processing, all models that will be used for processing must be reviewed and approved by me … ask clarifying qs.

**Result:** one round of questions, then the repo layout, orchestrator rules, Do/Avoid agent files and a revised plan.
