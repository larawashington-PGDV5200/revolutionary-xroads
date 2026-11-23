# Plan: "Revolution Migration": an exploded axonometric (revised 2026-11-22, replaces the 2026-11-17 notebook-map v1)

## Thesis
Revolutionary War veterans and their households moved after the war. Their pension claims record **where
they lived and where they went**. Read as evidence (every claim counts: S, W, R and BLW), they show how
human migration laid down the settlements, roads and markets of a new country. The same movement pushed
Native nations off their land and onto shrinking reserves (**hypothesis: shown as co-location in time and
place, not measured as cause**).

**Why the pension files are late evidence:** most claims were filed 35–55 years after the war, under the
1818 and 1832 Acts, so by then most men had already moved. The 1832 declaration asks where he was born,
where he lived when he enlisted, where he has lived since, and where he lives now. That chain is the
migration record.

## Final output
An interactive web page: an **exploded axonometric stack** of six map layers on a shared footprint
(reference images: Shanghai/Beijing urban-systems analyses). One **time slider** along the bottom drives
every dated layer. Interactions: explode or collapse the stack; click a layer to bring it flat and full-size
for detail (hover, click); toggle layers on and off.

| # | Layer | Story it tells | Shows |
|---|---|---|---|
| 1 | Topography | the ground people crossed (it changes little 1763–1840) | hillshade, rivers, lakes, coast; period state borders as thin lines |
| 2 | Land not yet ceded to the US | who held the land at the war's end | Royce areas not yet ceded, nation as the treaty names it; pre-1784 lines; NY state cessions as points; a note on what is missing |
| 3 | Land ads | where land was sold, and for how much | MVP: circles at the place the ad names, sized by number of ads. Later: acres, $/acre, ad image, paper + date |
| 4 | **Migration** (main) | where veterans' households went | all-at-once flow map of every documented move: circle = people leaving a place, flow width = people moving; Pension Acts as markers/filters; click a veteran to see his path (born → enlisted/served → interim → applied from) |
| 5 | Reservations and cessions | the countermovement | cessions by date (Royce); reservations by date established/ended; removal routes 1830s |
| 6 | Infrastructure effect | what the movement built | roads, canals, railroads by opening year; named migration routes |

Order is bottom → top: ground → who was there → land offered → people moved → who was pushed out → what got built.
Each layer is a visual overlay on the same footprint. **No table joins** across layers 2, 3, 5, 6 and the
households (D-012 still holds for joins).

## Gates (D-007, unchanged)
Brief approved before any subagent runs · `tasks/T-NNN` approved before any agent workstream ·
no ML/LLM model on project data until the researcher compares options and Lara approves.

---

## 1. Sources (consolidated: one high-quality source per need)
**Status:** have = in `data/` · verify = candidate, researcher confirms licence/coverage (B-013).

| L | Source | What we take | Licence | Status |
|---|---|---|---|---|
| 4 | HF `nara_revolutionary_war_pension_files` → `households`, `residences`, `moves` | origin → destination flows, by time bin; all claim types | CC0 | **have** (A01–A08) |
| 3 | HF `loc_chronicling_america_1770-1810` + `RevX_OCR_results` (`block_level`) + `_issues` (IIIF) | land-sale blocks: text, paper, date, place named, acres, price, bbox → image crop | CC0 | have (remote) |
| 1, all | Newberry AHCB states + counties | period borders per bin; `places` centroids | free, cite | **have** |
| 2, 5 | USFS Royce cession polygons (+ table) | cession date, nation as named; "not yet ceded as of year X" for L2 | CC BY 4.0 | **have** |
| 2, 5 | R1 treaties, R4 reservations + T-002 points | labels, reserve dates and points | ours | **have** |
| 1 | NOAA ETOPO 2022 (30″) | elevation → one hillshade image (ERDDAP subset lat 24–50, lon −100…−64) | permissive | **have** |
| 1 | Natural Earth 10m rivers, lakes, coast | water lines (drop `featurecla = Reservoir`) | public domain | **have** |
| 6 | Atack, Vanderbilt historical transport GIS | railroads (open by 1830–40, none west of the Mississippi), canals, steamboat rivers, by opening year ≤ 1840 | no licence stated; cite (Atack 2015; 2016; 2017). Lara emails him the finished project | **have** |
| 5, 6 | NPS National Historic Trails GIS | Trail of Tears (one route, undated); Old Natchez Trace not in NPS data → hand-trace | federal | **have** |
| 6 | Named roads (National, Wilderness, Great Wagon, Genesee, Federal) | historian list (dates, endpoints) → hand-traced lines | ours | research |
| 3 | McCusker (1978; 1992), currency tables | £ (state currency) → $ for $/acre; federal benchmarks ($2 in 1796, $1.25 in 1820) | citation | research |

**Not used:** Native Land Digital (contemporary, approximate, no storing allowed), Whose Land (built on
Native Land, Canada-focused, contemporary, no reuse terms; checked 2026-11-22), NHGIS (no
redistribution), Rumsey rasters (NC licence; reference only), SI collections, NER, sentiment.

## 2. Native research: back in scope (relaxes D-012)
D-012 cut cession and nation **joins**. Layers 2 and 5 need Native land as **layers**, so this research
comes back, kept narrow:
- **L2 (accepted 2026-11-23, R7):** "Land not yet ceded to the US (Royce 1899)". Royce areas with a
  cession date after the year shown. Additions: pre-1784 lines as dated lines (De Vorsey 1966 south,
  Fort Stanwix 1768 north); R1 state cessions (NY 1785–89, Phelps–Gorham) as dated points flagged
  `not_royce`; R4 reserves as points; overlapping cessions kept as separate polygons listing every nation.
  Tanner (1987) only as a cross-check. Empty areas stay empty and the note says why.
  Checked 2026-11-23: Royce has no NY state cessions 1785–89 and no New England areas.
- **L5:** the same polygons switch to "ceded" in their year; reservations appear and end; removal routes.
- Keep every data point (R1, R3, R4, R7) for narrative work later, even if the MVP doesn't draw it.
- Optional: one cited Native voice per period from R3 as an annotation (quote, never paraphrase).

**Page text (draft):**
1. Shaded land had not been ceded to the United States by treaty in the year shown. US treaty
   commissioners drew these boundaries; Royce's staff mapped them in 1899.
2. Nation names follow the treaties. Cessions before 1784 and sales to states and private buyers appear as
   lines or points, or not at all. Unshaded land has no record in this source.
3. Many cessions were contested. The Onondaga Nation calls its 1788 treaty with New York the work of
   "unauthorized individuals at an unauthorized location."

## 3. Time
**Migration (L4): all at once, Pension Acts as markers (Lara, 2026-11-23).** T-004 (S3) showed the
data can't date most moves: of 5,577 moves dated at both ends the median range is 65 years, only 4.8%
fit one decade, and 81% of moves ending 1763–1840 end at the application year. So L4 shows every
documented move from the claims once (every consecutive pair of places in a person's file, not only origin → final), with the Acts (1818, 1820, 1832, 1836, 1848) as markers and as
a filter by application cohort. The 1,121 moves with a dated "removed to" can be shown as dated detail.
**Dated layers (2, 5, 6):** keep a year slider (decades), since cessions, reserves and roads have real dates.

**Map extent:** residence places + 1°, west edge cut at −100° (ETOPO limit; drops 3 places, 4 rows:
Clatsop OR, Butte CA, Calaveras CA; Lara, 2026-11-23). **Flow grain:** state to state on the map; click a
state for its counties.

## 3a. Land price method (L3)
Standard unit: **US dollars per acre, nominal** (dollars dominate priced ads from 1802; federal minimums
are in dollars). Display only where an ad states acres and a price.
1. Keep `price_as_stated`, `currency_as_stated`, `acres` per ad.
2. Per-acre price stated → use it. Otherwise total ÷ acres. Ranges keep min and max.
3. £/s/d → decimal £ → $ at the state's rating of the Spanish dollar: $ per £ = 20 ÷ shillings per dollar
   (New England and VA 6s = $3.33; PA, NJ, MD, DE 7s 6d = $2.67; NY and NC 8s = $2.50; sterling 4s 6d =
   $4.44). The state is the paper's state unless the ad names another currency. Source: McCusker (1978) via R7.
4. Flag, don't convert: Continental/state paper 1776–81 and depreciated state paper 1785–89.
5. Benchmarks on the same scale: federal minimums $1 (1785), $2 (1796), $1.25 (1820).
No inflation adjustment in v1. Rates: see R8 (`research/currency_rates_R8.csv`), which adds SC/GA 4s 8d.
**On hold (Lara, 2026-11-23):** no $/acre for now; ads show acres and price as printed. Only ~800 ads have both.

## 4. Data model
Pipeline A tables stay as they are (`households`, `residences`, `reasons`, `places` + views `moves`,
`place_period`; see `rx-pipeline/schema.sql`). Rule: store the finest grain the source states.
New, small, one file per layer for the web (GeoJSON/TopoJSON or JSON, in `web/data/`):

| File | Grain | Key fields |
|---|---|---|
| `flows.json` | from × to × Act cohort, over every documented leg (state; county where both known) | from, to, act_cohort, legs, people, claim_types |
| `paths.json` + `paths/<state>.json` | person × stop, ordered; split by last stop's state (index + 33 files) | NAID, person, seq, place_id, state, kind (born / enlisted / served / removed_to / lived_since / married / now_resides), date, page |
| `nodes.json` | place × Act cohort | place_id, lat, lon, people_left, people_arrived |
| `ads_places.json` (MVP) | place × decade | n_ads, n_runs, n_ads_fallback, papers |
| `ads.json` (after V1) | ad run | ad_id, paper, date, place_id, acres, price_as_stated, currency_as_stated, usd_per_acre, price_flag, image_url, text |
| `native_land.topojson` | Royce polygon (every dated row, incl. after 1840) | cessnum, nation_as_named, cession_date |
| `reservations.json` | reserve | name, nation, start, end, lat, lon, coord_method |
| `infrastructure.topojson` | line or point | kind (road/canal/rail/steamboat/route), name, year_open, year_exact, source |
| `removal_routes.topojson` | NPS segment, undated | all NPS columns |
| `relief.png`, `water.topojson` | static | — |

## 5. Build: deck.gl (Lara, 2026-11-22)
- **deck.gl**, pitched and rotated view; each layer is lifted to its own height (z offset via
  `modelMatrix`) to explode the stack; collapse = animate the offsets to 0. Real 3D relief for L1
  (`TerrainLayer` or a hillshade `BitmapLayer`).
- Flows: `@flowmap.gl/layers` (width ∝ people, circles ∝ people leaving) or `ArcLayer`; optional linked
  `d3-sankey` panel (origin state → destination state) for the selected bin.
- Other layers: `GeoJsonLayer` (Royce, borders, routes), `ScatterplotLayer` (ads, reservations), ad image in a side panel.
- Vite for dev, GitHub Pages to host.

## 5a. Notebooks (data only)
A01–A08 stay as Lara worked them (coached). The remaining data gets its own **streamlined** notebooks,
**written by agents** (Lara, 2026-11-23; exception to D-009):
no learning exercises, markdown only to describe the data (source, grain, counts, caveats).
| NB | Does | Output → `web/data/` |
|---|---|---|
| B01_ads | land-sale blocks → ad runs, place, acres, price as printed, page image URL | `ads_places.json` (+ `data/interim/ads.parquet`) |
| C01_native | Royce + R1 + R4/T-002 + pre-1784 lines + NPS Trail of Tears → cession, line, reserve and route layers | `native_land.topojson`, `reservations.json`, `removal_routes.topojson` |
| D01_infrastructure | Atack + R7 roads (wagon-passable year; other dates in tooltips) → dated lines | `infrastructure.topojson` |
| E01_base | ETOPO + Natural Earth + Newberry → relief, water, borders | `relief.png`, `water.topojson`, `borders.topojson` |
| V00_export | `residences` + `households` → every documented leg, flows and nodes by Act cohort, per-person paths | `flows.json`, `nodes.json`, `paths.json` |
Each needs a `tasks/T-NNN` before an agent writes it.

## 6. Workstreams and order
| Step | What | Who | Status |
|---|---|---|---|
| A | pension → households, residences, moves, reasons | Lara (coached) / Claude (D-013) | **done** |
| T-004 | time-bin profile + ad price/acre coverage | data-analyst | done (B-015) |
| B-013 | verify and fetch L1, L6, NPS sources | researcher | done |
| B-014 | L2 wording, pre-1784 lines, ad currency → $, road list | historian | done |
| Data | T-005 V00_export, T-006 E01, T-007 C01, T-008 B01, T-009 D01 (§5a) | coder per task, Lara reviews | **done; data frozen for MVP** (2026-11-23) |
| B-021 | currency rates check (VA, MD, DE, NC, GA, SC) | historian | done (R8) |
| **MVP** | deck.gl stack, all six layers with real data; L4 all moves + one veteran's path; L3 circles by number of ads; decade slider for L2/5/6; explode/collapse; plain styling | Lara | **now** |
| V1 | detail views, annotations, design pass, T-003 outlines | Lara | next |
| Fixes | data fixes below | agents per task, Lara approves | after V1 |

### MVP: decisions applied as filters in the viz (no data rerun)
- L4: homes only by default (flows minus `served_legs`; paths skip `served` stops); served legs as a toggle.
- L3: ads naming no place (`n_ads_fallback`) drawn as an outline ring at the paper's place.
- L6: rail year = `year_exact` if set and ≤ `year_open`, else `year_open`; hide tidal reaches
  (`date_quality` placeholder); drop R7 canals that have an `atack_match`.
- L5: drop the 31 NPS segments with `DATAACCESS = Internal NPS Only`.

### Data fixes after V1 (decided 2026-11-23; each needs a task or brief)
1. **Historian (one brief):** USFS cession dates vs Royce 1899 (look one day early); the 5 NY state-cession
   points (2 guessed counties); PA 1784/85 deed points; Wilderness Road wagon year (1795 or 1796).
2. **C01:** +1 day on shifted USFS dates if confirmed; add PA 1784/85 deeds as `not_royce` points; drop the
   31 internal NPS segments; trim the web routes file to name, route, segment type, source.
3. **D01:** clip lines to −100°; rail `year_open` rule above; tidal flag; drop R7 canal duplicates.
4. **V00:** `served` as a person field, not a stop (residence-only legs).
5. **B01 matcher:** old spellings (Culpepper, Berkley), plural "counties", "in this State" = paper's state,
   join OCR blocks that start mid-ad, town → county list (researcher finds a historical gazetteer first);
   count an ad in **every** place it names (sheriff lists explained on the page). Then choose the circle style.
6. **B01 later:** per-ad IIIF crops (page sizes from `.chunks.json`), `ads.json`; $/acre from R8 if un-held.
7. **Lara:** ask Atack about a licence before publishing derived lines.

## Verification
Assertion cells end every notebook. Each export states counts per bin. Historical claims, dates and
currency conversions go through the historian. Every layer carries a source line on the page.

## Risks and caveats
- Move dates are ranges (≈1783 → application). In W files the residence is the widow's, often after the veteran died.
- Ads run 1770–1810 and skew to VA/DC/PA, while most dated moves end after 1810: L3 and L4 overlap little in time.
- Many ads give no price; currencies vary by state until c. 1800: $/acre only where both are stated.
- Royce lines are the colonisers' lines. Missing Native territory is shown as missing, not guessed.
- Layers co-locate; they don't prove the migration caused the cessions or the infrastructure.
