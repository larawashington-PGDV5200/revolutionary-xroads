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

## Sample prompts

### P-001 Set up the sandbox · 2026-10-29 · D-004
> i want to maintain complete separate environments for the revolutionary-crossroads project … i want to maintain control over what goes into the repo. ask clarifying qs.

**Result:** two rounds of questions, then a scaffold. **Then:** Lara added a coder agent, then cut the documentation back to essentials.

### P-002 Port to the repo with approval gates · 2026-11-03 · D-006, D-007
> changed my mind- want to port everything into the repo- some clean up and more guardrails to be defined before we move over. … before any workstreams are handed off to agent, their tasks must be defined beforehand and for any additional data processing, all models that will be used for processing must be reviewed and approved by me … ask clarifying qs.

**Result:** one round of questions, then the repo layout, orchestrator rules, Do/Avoid agent files and a revised plan.
