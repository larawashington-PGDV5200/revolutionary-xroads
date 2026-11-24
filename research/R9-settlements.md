# R9: Dated settlements and a city tier, 1763-1840

Extent (`web/data/relief_bounds.json`): lon -100 to -66.617, lat 24.908 to 47.442. No model was run; metadata plus one 1.5 MB sample only (scratch folder, not in `data/raw/`).

## 1. Post offices: Blevins and Helbock (2021)

| Item | Finding |
|---|---|
| Licence | CC0 1.0 (Dataverse record, checked) |
| DOI / host | 10.7910/DVN/NUKCNA, Harvard Dataverse, v1.0 (30 Mar 2021) |
| Files | `us-post-offices.tab` 32.4 MB (file id 4491713; coordinates only where geocoded); `us-post-offices-random-coords.tab` 34.8 MB (id 4491714; avoid: random points in county); dictionary 5.5 KB (id 4491716) |
| Download | `https://dataverse.harvard.edu/api/access/datafile/4491713?format=original` (CSV, comma-separated, despite `.tab`); same pattern for 4491716 |
| Rows | 166,140 total; 112,521 geocoded (67.7%) |
| Dates | `Established`, `Discontinued` (years), `Continuous` flag. Discontinued can mean a rename. A closure of 10+ years makes a new record |
| Coordinates | `Latitude`, `Longitude` (= GNIS match). Matched by name + county + state to GNIS; fuzzy score `GNIS.Dist` (0.75-1), `GNIS.Feature.Class`. No metre precision; "not for locating an office within a town"; moves not recorded |
| Geocode bias | Geocoded offices have median life 38 yr vs 5 yr for ungeocoded, so short-lived frontier offices are missing. North Carolina is the lowest state (49%) |
| Rows established <= 1840 inside extent | **Not countable without the full 32 MB file (over the 5 MB cap).** Sample: the first 8,016 rows (names A to "Burwell", alphabetical) had 1,275 with Established <= 1840 (16%), 856 of them geocoded (67%), all 856 inside the extent. Naive scaling to 166k gives about 26k (all) and about 17k (geocoded), but alphabetical order and 19th-century growth make this a rough ceiling. A 10-second count after Lara downloads is needed |

Caveat: Established 1763-1840 only means "first record starts"; Helbock's early (pre-1790) coverage is thin. Check this before using 1763-1789.

## 2. Urban places >= 2,500: Gibson (1998)

| Item | Finding |
|---|---|
| Source | Gibson, Census Population Division Working Paper 27, tables 2-7 (1790-1840) at `https://www2.census.gov/library/working-papers/1998/demographics/pop-twps0027/tab02.txt` to `tab07.txt` (each under 1 MB; fixed-width text) |
| Licence | US federal government work, public domain (no licence statement on the page; confirm if Lara wants it recorded verbatim) |
| Fields | rank, place name with type and state, population. No coordinates, no founding date. Needs geocoding by name (GNIS or Wikidata); about 24 to 100 places per decade, so manual checking is feasible |
| Coverage | 1790: 24 places (last 2,584); 1800: 33 (last 2,503); 1810: 46 (last 2,540). These three are complete at >= 2,500. 1820: 61 and 1830: 90 places, probably complete at >= 2,500, but I did not check the tails. **1840: top 100 only, cut at 4,226**, so places of 2,500 to 4,226 are missing |
| Series | Uses the 1930 definition (2,500+, incorporated places). Includes districts and boroughs (e.g. Spring Garden, PA) which are parts of a city |

Gap: the 1840 list from 2,500 to 4,226 needs another table (the 1840 Census volume, or Historical Statistics of the United States). Not checked here.

## 3. UN Degree of Urbanisation

It classifies a modern 1 km grid by population density and contiguous cell size (urban centre >= 50,000; urban cluster >= 5,000; rural otherwise). It was designed for current census or satellite data, with the Global Human Settlement Layer as the usual input (the 2020 Degree of Urbanisation methodology, UN Statistical Commission). Its earliest GHSL epoch is 1975, so it cannot represent 1763-1840. Its thresholds also differ from the period Census definition. Skip it, except for a modern comparison, if Lara wants one.

## 4. Option for Lara to decide

Two layers: post offices as the dated "settled place" dots, and Gibson places as a labelled city tier drawn over them. Reasons: post offices have year ranges and coordinates, but no population; Gibson has population, but no coordinates and only the largest places.

| Target field | Post offices (`kind=post_office`) | Gibson (`kind=urban_2500`) |
|---|---|---|
| place | `Name` (or `OrigName`) + `State` | place name, state |
| lat, lon | `Latitude`, `Longitude`; drop rows without coordinates; keep `GNIS.Dist` as a quality flag | geocoded by hand or from GNIS (new step) |
| year_established | `Established` | first census year the place appears (a proxy, not a founding date; label it so) |
| year_discontinued | `Discontinued` (null if blank; note rename effect) | null |
| kind | `post_office` | `urban_2500` |
| population by decade | none | `pop_1790` ... `pop_1840` columns (null where below the cut) |

Open issues for Lara: (a) pre-1790 coverage; (b) the 1840 gap; (c) the model gate does not apply (no ML), but geocoding Gibson names is a new task needing an approved `tasks/T-NNN` file; (d) a manual step: she downloads the 32 MB CSV into `data/raw/blevins-post-offices/` (one folder per source, plus a `MANIFEST.md` row). I did not do this, to stay within the size cap.

## 5. Addendum (2026-11-24): hand coordinates for the city tier

Output: `research/urban_coords_override.csv` (14 rows: place, state, lat, lon, source, note). Points are the primary point of a GNIS Populated Place feature, read from the USGS GNIS map service (layer 3), unless marked otherwise. The GNIS web app is JavaScript-only, so I queried the service by `gaz_id`. One line per check:

- Gloucester MA: GNIS 615084, harbour/downtown. OK.
- St. Louis MO: GNIS 765765 ("Saint Louis", the reason the exact match failed). OK.
- Moyamensing PA: **unverified**. No GNIS feature. I used the Moyamensing Prison site (inside the township) as a landmark. Wikipedia's township point lies in Southwark, so I rejected it.
- Northern Liberties PA: GNIS 1202854. OK.
- Southwark PA: **unverified**. No GNIS feature. I used Gloria Dei Church (NRHP 66000682) as a landmark, with Wikipedia coordinates I did not check against NPS data.
- Beverly MA: GNIS 614200. OK.
- Cumberland RI: GNIS 1219346. OK as a point, but the 1840 town included Woonsocket's mill villages (set off 1867), so one point understates its spread.
- Bath ME: GNIS 561723. OK.
- Lynchburg VA, Petersburg VA, Portsmouth VA: GNIS 1479007, 1497087, 1497102. OK. Portsmouth's point is in Olde Towne.
- Wheeling (VA): GNIS 1548994 (filed under WV). OK. Virginia until 1863.
- Richmond VA (bad match): GNIS 1499957 replaces a Locale about 12 km east. The new point is still about 3 km north-west of Capitol Square.
- Fredericksburg VA (bad match): GNIS 1494947 replaces a School about 5 km off. OK.
- Roadside Thoughts' "GNIS GPS location" for Gloucester, Beverly and Bath is 2-3 km from the GNIS primary points, so I did not use it.
- Sherburne renamed Nantucket in 1795: **verified for the year**. Macy (1835, 146), a Nantucket author writing 40 years later, says: "This year, 1795, the name of the town was changed. It had hitherto been called Sherburne." The day (8 June 1795, the act signed by Governor Samuel Adams on Micajah Coffin's bill) is from secondary sources only. I did not find the act's chapter in the 1794-95 Acts and Resolves. One source disagrees: the Massachusetts Historical Commission (1984) gives 1793. I did not fetch that report (404); a search snippet quotes it. Keep 1795.

## Sources (Chicago author-date)

Blevins, Cameron. 2021. "US Post Offices: Data Biography." https://cblevins.github.io/us-post-offices/data-biography.

Blevins, Cameron, and Richard W. Helbock. 2021. *US Post Offices*. Harvard Dataverse, V1. https://doi.org/10.7910/DVN/NUKCNA.

Gibson, Campbell. 1998. *Population of the 100 Largest Cities and Other Urban Places in the United States: 1790 to 1990*. Population Division Working Paper No. 27. Washington, DC: US Census Bureau. https://www.census.gov/library/working-papers/1998/demo/POP-twps0027.html.

Macy, Obed. 1835. *The History of Nantucket*. Boston: Hilliard, Gray. Transcription at https://whalesite.org/anthology/1835_Macy_History_of_Nantucket_1st_ed.htm.

Massachusetts Historical Commission. 1984. *MHC Reconnaissance Survey Town Report: Nantucket*. Boston: MHC. https://www.sec.state.ma.us/divisions/mhc/preservation/survey/town-reports/nan.pdf (returned 404 on 2026-11-24; quoted from a search snippet).

United Nations Statistical Commission. 2020. *A Recommendation on the Method to Delineate Cities, Urban and Rural Areas for International Statistical Comparisons* (Degree of Urbanisation). New York: United Nations. (Cited from memory; not fetched this session.)

US Geological Survey. 2026. "Geographic Names Information System (GNIS)": geonames map service, Populated Places layer. Accessed 2026-11-24. https://carto.nationalmap.gov/arcgis/rest/services/geonames/MapServer/3.

Wikipedia contributors. 2026. "Moyamensing Prison"; "Gloria Dei (Old Swedes') Church"; "Woonsocket, Rhode Island"; "Wheeling, West Virginia." *Wikipedia*. Accessed 2026-11-24. https://en.wikipedia.org/wiki/Moyamensing_Prison; https://en.wikipedia.org/wiki/Gloria_Dei_(Old_Swedes%27)_Church; https://en.wikipedia.org/wiki/Woonsocket,_Rhode_Island; https://en.wikipedia.org/wiki/Wheeling,_West_Virginia.
