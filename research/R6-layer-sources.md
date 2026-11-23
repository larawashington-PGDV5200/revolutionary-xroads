# R6: layer sources for L1 (base), L5 (removal) and L6 (transport)

Checked 2026-11-22. Raw only, nothing converted or clipped. Files in `data/raw/gis/`. Verdicts are the researcher's; Lara decides.

| Layer | Source | Licence (as found) | Coverage to 1840 | Date fields | Size | Fetched to | Verdict |
|---|---|---|---|---|---|---|---|
| L1 relief | NOAA NCEI, ETOPO 2022 30 arc-sec, ice-surface (NOAA NCEI 2022) | ERDDAP: "may be used and redistributed for free but is not intended for legal use"; no warranty. Federal work, but no explicit "public domain" text found. | Modern surface, not 1840. Fine for a hillshade (relief barely changes). | none | Global GeoTIFF **1.5 GB** (over limit). Server-side subset 24-50N, 100-64W: 4321 x 3121 px, **54 MB** NetCDF | `etopo2022-30s/etopo2022_30s_surface_lat24-50_lon-100--64.nc` | Usable. Extent is my guess; widen west if pensions reach TX or beyond. Unprocessed. |
| L1 water | Natural Earth 10m physical v5.0.0 (Kelso and Patterson, n.d.): `lakes`, `lakes_north_america`, `rivers_lake_centerlines`, `rivers_north_america`, `coastline` | Public domain, no permission or credit needed (terms page) | Modern lines. Drop modern reservoirs: `featurecla` = "Reservoir" (230 in `lakes`, 45 in the N. America file). Coastline has no 1840 changes. | none | 11 MB total | `natural-earth-10m-water/` (one folder per layer) | Usable. Use the `_north_america` rivers/lakes for detail. |
| L6 railroads | Atack, "Historical GIS database of U.S. Railroads" (Atack 2016, rev. 2023) | **No licence stated.** Page asks for the suggested citation and corrections to the author. | Earliest `InOpBy` 1830. 1,579 segments, about 3,161 mi open by 1840, in 23 states plus DC. None west of the Mississippi. | `InOpBy` (year in operation by), `ExactDate` (0 on every row <= 1840, so dates are not exact), `RRname`, `STATENAM` (1900 state borders) | 16 MB zip, 76,849 lines (1826-1911) | `atack-transport/RR1826-1911Modified103123/` | Usable, with the licence caveat. |
| L6 steamboat rivers | Atack, "Steamboat-navigated rivers" (Atack 2015) | No licence stated | 226 river lines, 146 with `START` <= 1840. Earliest is 1787, a floor for the series rather than a real first date. | `START`, `END` (2100 means still navigable, not a closure date), `Tidal`, `HEADNAV` | 4.8 MB | `atack-transport/SteamboatNavigatedRiverContigUSAprojection/` | Usable. Treat `START` as approximate. |
| L6 canals | Atack, "Nineteenth century U.S. canals" (Atack 2017) | No licence stated | 155 canals, 113 opened by 1840 (earliest 1790) | `OPENED`, `CLOSED`, `NAME` | 1 MB | `atack-transport/19thC_Canals_March2017/` | Usable. |
| L5/L6 Trail of Tears | NPS National Trails Intermountain Region, Trail of Tears NHT designated route (NPS 2021) | No licence field (IRMA `LicenseType` null); access level public, "available for public download and use". US federal work, so not copyrighted in the US (my reading, not NPS wording). | Removals 1830s (Cherokee 1838-39). 2,006 line features across TN, MO, AR, GA, AL, NC, KY, IL (and others); land ("Standard Terra Trail") and water routes. | No event dates. `TRTYPE`, `STATE`, `SOURCEDATE`. Dataset issued 2021-07-21. | 5 MB | `nps-trail-of-tears/` (3 GeoJSON pages + metadata.txt) | Usable. NPS warns it is a designated route, "does not always coincide with historic trail trace", digitised at 1:100,000, not for larger scales. One route only, so it does not say which nation or year. |
| L6 Natchez Trace | NPS Natchez Trace National Scenic Trail feature service (`NATT_TRANS_NSTTrail`, last edit 2017) | not checked | The scenic trail follows the modern parkway, **not** the historic Old Trace. | n/a | n/a | not fetched | Not a match. Hand-trace the Old Trace. The parkway boundary shapefiles are not the trace either. |
| 1763 Proclamation Line | No open vector found | n/a | Only scanned maps (Berkeley GeoData, MIT and Penn State catalogue records of 1763 maps; images). | n/a | n/a | none | Hand-trace. The line was never surveyed, so any version is an approximation. |
| Fort Stanwix 1768 line | No open vector found | n/a | Scanned maps: "Map of the frontiers of the northern colonies" (Princeton, Berkeley records); UK National Archives WO 78/302 (Guy Johnson). NPS describes the line: Fort Stanwix, south and west to the Ohio-Kanawha confluence, up the Kanawha, then south. Adjusted in 1773 in Pennsylvania. | n/a | n/a | none | Hand-trace, using the NPS description as a check. |
| (bonus) Post offices | Blevins and Helbock (2021), Harvard Dataverse doi:10.7910/DVN/NUKCNA | **CC0 1.0** (Dataverse API) | 1639-2000, lat/lon + establishment year | see data dictionary | `us-post-offices.tab` 32 MB (two larger files not needed) | not fetched (not in brief) | Open and small. Fetch on request. |

## Licence blockers
- **Atack (3 files): no licence stated.** Free academic use with citation is the norm, but nothing is written down. Fine for the project itself. Before publishing the viz, ask Jeremy Atack for permission to redistribute derived lines, or ship only a rendered image.
- **NPS Trail of Tears:** no explicit licence. Low risk (federal work). Cite NPS and the 1:100,000 limit.
- **ETOPO:** terms are permissive but not labelled public domain. Low risk. Cite NOAA.
- Natural Earth: no blocker.

## Left for hand-tracing
1. 1763 Proclamation Line.
2. Fort Stanwix 1768 line (and Hard Labor 1768, Lochaber 1770 if wanted).
3. Old Natchez Trace.
4. Named roads (National, Wilderness, Great Wagon, Genesee, Federal) from the PLAN historian list.

## Caveats
- Atack files are Albers (ESRI:102003). Natural Earth and NPS are WGS84. The ETOPO subset uses lon 0-360.
- The ETOPO subset is a server-side cut from ERDDAP, not a clip of a local file. The global 1.5 GB GeoTIFF is at ngdc.noaa.gov/mgg/global/relief/ETOPO2022/data/30s/30s_surface_elev_gtif/ if a different extent is wanted.
- Stray empty file `data/raw/gis/etopo2022-30s/t.out` (my redirect test). A delete rule blocked me from removing it.
- No steamboat or railroad data exists west of the Mississippi before 1840 in the railroad file, which is expected. The steamboat file does cover the big western rivers; not checked by name.

## References (Chicago author-date)
- Atack, Jeremy. 2015. "Historical Geographic Information Systems (GIS) Database of Steamboat-Navigated Rivers during the Nineteenth Century in the United States." Vanderbilt University. https://my.vanderbilt.edu/jeremyatack/data-downloads/.
- Atack, Jeremy. 2016. "Historical Geographic Information Systems (GIS) Database of U.S. Railroads." Rev. October 2023. Vanderbilt University. https://my.vanderbilt.edu/jeremyatack/data-downloads/.
- Atack, Jeremy. 2017. "Historical Geographic Information Systems (GIS) Database of Nineteenth Century U.S. Canals." Vanderbilt University. https://my.vanderbilt.edu/jeremyatack/data-downloads/.
- Atack, Jeremy. 2021. "Creating Historical Transportation Shapefiles." Rev. February. Vanderbilt University. https://cdn.vanderbilt.edu/t2-my/my-prd/wp-content/uploads/sites/133/2021/02/Creating-Historical-Transportation-Shapefiles-RevisedFeb2021.pdf.
- Blevins, Cameron, and Richard W. Helbock. 2021. "US Post Offices." Harvard Dataverse. https://doi.org/10.7910/DVN/NUKCNA.
- Kelso, Nathaniel Vaughn, and Tom Patterson. n.d. "Natural Earth." Version 5.0.0. https://www.naturalearthdata.com/about/terms-of-use/.
- National Park Service, National Trails Intermountain Region. 2021. "Trail of Tears National Historic Trail." NPS IRMA DataStore reference 2238914. https://irma.nps.gov/DataStore/Reference/Profile/2238914.
- NOAA National Centers for Environmental Information. 2022. "ETOPO 2022 15 Arc-Second Global Relief Model." https://doi.org/10.25921/fd45-gt74.
