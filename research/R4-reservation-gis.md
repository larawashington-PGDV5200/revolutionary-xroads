# R4b: Existing GIS outlines for the R4 reservations (agent research, 2026-11-05)

Scope: historical outlines only, for the 66 rows in `research/reservations_R4.csv`. Sources already in R2 are not re-described. **Nothing new was downloaded.** The only usable polygons are already in `data/raw/gis/usfs-tribal-ceded-lands/` (and the Hub GeoJSON copy). Nothing was converted or run from the downloads; I read attributes with `ogrinfo` and `python3 -I`.

## Topline
- **The USFS/Royce layer does hold reserve polygons**, not just cessions. Royce numbered each reserve as its own area, and the layer keeps them. About 100 pre-1841 polygons are small reserve-sized shapes (Seneca 1797, Ohio 1817, Miami 1818/1826, Potawatomi 1832, Saginaw 1819, and others). Evidence: the Myaamia Center's reserve database lists the Six Mile Reserve (1818) as Royce no. 252, and 252 is a 25,294-acre polygon in this layer. The USFS table description says the 67 Royce maps show "cessions and reservations".
- **No other source gives historical outlines** for the R4 reservations. Newberry AHCB has no reserve polygons for them (only Quapaw, Cheyenne, Wahpeton and similar, all west of the Mississippi or after 1840). I found no state historic GIS, academic set or tribal set with polygons for the eastern reserves.
- **Matches below are my inference** from tribe, county, date, acreage and centroid. They are not confirmed against Royce's Schedule text. S3 must confirm each one (the Schedule entry for the treaty date lists the reserves).

## Caveats that apply to every Royce reserve polygon
- **Scale.** Royce drew small-scale state plates, and Saunt/USFS digitised them. Shapes are generalised, and the area often differs from the treaty acreage (e.g. Allegany: polygon 57,328 acres vs. about 30,000 in the treaty). Treat them as locators, not survey lines.
- **The date field is mixed.** `CESSDATE1` is the reserving treaty for the Seneca (1797) and Ohio (1817) reserves, but the *selling* treaty for some (NY Indians tract, 246/247 = 1838). Use the R4 treaty date for establishment, not `CESSDATE1`.
- **Mapping is one polygon to one Royce number**, not one to one with R4 rows. Some R4 rows are groups; some Royce polygons have no R4 row.
- **Not a legal document** (USFS disclaimer).

## Licence, CRS, attributes (this layer)
| Item | Value |
|---|---|
| Source | USFS Office of Tribal Relations, "Indian Land Cessions in the United States" (R2, already downloaded) |
| Licence | CC BY 4.0 (data.gov listing); no warranty |
| CRS | Shapefile .prj is NAD83 geographic (EPSG:4269), although the metadata says Lambert; Hub GeoJSON is WGS84 |
| Attributes | Polygons: `CESSNUM`, `CESSNUMSOR`. Table (join on `CESSNUM`): `CESSDATE1..5`, `SCHDTRB` (tribe), `PRESDAYTRB`, `STATE`, `COUNTY`, Royce/Kappler links |
| Path | `data/raw/gis/usfs-tribal-ceded-lands/shp/S_USA.TRIBALCEDEDLANDS.shp` |

## Reservation coverage
"Polygon" means a Royce reserve polygon probably exists. Acres are the polygon's own area (equal-area reprojection), for sanity checks against `size_as_written`.

| R4 id(s) | Reservation | Royce `CESSNUM` (candidate) | Polygon acres | Confidence / note |
|---|---|---|---|---|
| R4-008 | Onondaga | 9 | 78,458 | Probable. Date 1794 (Canandaigua), not 1788. Onondaga Co. |
| R4-009 | Cayuga | 10 | 86,881 | Probable. Cayuga/Seneca cos., 1794. |
| R4-013 to 016 | Canawaugus, Big Tree, Little Beard's, Squawky Hill | 30, 31, 32, 33 | 1,582 to 2,242 | Four polygons for four reserves (Livingston/Wyoming cos.). Which is which is not settled. |
| R4-017 | Gardeau | 34 | 21,147 | Probable (treaty about 17,900). |
| R4-018 | Caneadea | 35 | 11,955 | Probable (Allegany Co.). |
| R4-019, 020 | Cattaraugus tracts 1 and 2 | 36 (and 45 for the 1802 addition); 37 | 10,138; 3,321; 28,527 | Probable; 37 is the Chautauqua tract. |
| R4-021 | Allegany | 38 | 57,328 | Probable but oversized. Polygon follows the river strip. |
| R4-022 | Buffalo Creek | 39 | 98,341 | Probable (130 sq mi in treaty = about 83,000). |
| R4-023 | Tonawanda | 40 | 60,860 | Probable (71 sq mi = about 45,000). |
| R4-032 | Wyandot Grand Reserve | 259 | 148,018 | Probable (12 mi sq = about 92,000). |
| R4-033 | Wyandot, Broken Sword Cr. | 211 (also 212, 213 small Crawford Co. tracts) | 36,085; 965; 327 | Uncertain which. |
| R4-034 | Seneca on the Sandusky | 163 | 46,957 | Probable. |
| R4-035 | Wapaghkonetta | 165 | 81,652 | Probable. |
| R4-036 | Hog Creek | 166 | 19,792 | Probable. |
| R4-037 | Lewistown | 164 | 41,395 | Probable. |
| R4-038 | Ottawa, Blanchard's Fork | 167 | 19,610 | Probable. |
| R4-039 | Ottawa, Little Auglaize | 168 | 7,447 | Probable. |
| R4-040 | Ottawa, Roche de Boeuf / Wolf Rapids | 183 (and/or 182) | 9,439; 21,871 | Uncertain. Royce no. 182 and 183 both carry the "Ottawa on the Miami of Lake Erie" name. 169, 170 are other Ohio Ottawa tracts. |
| R4-043 | Miami Big Reserve | 258 | 498,037 | Probable (treaty about 500,000). |
| R4-044 | Other Miami reserves 1818 | among 251, 252, 253, 256, 197, 198, 196, 254 | 3,574 to 163,414 | Candidate set; 252 = Six Mile Reserve (confirmed by Myaamia Center). Others unmatched. |
| R4-045 | Richardville and Miami individual grants | none identified | none | 1826 grants appear as 192 to 195, 199, 255; not matched to R4. |
| R4-047 | Potawatomi 1832 bands | 200, 201, 204, 208, 209, 210, 218, 221 to 225 | 1,660 to 21,725 | Candidate set, Marshall/Kosciusko/Fulton cos. |
| R4-048 | Menominee's reserve | 223 or 218 | 6,250; 15,152 | Uncertain. |
| R4-049 | Saginaw 1819 | 227 to 241 (15 polygons) | 887 to 26,006 | R4 says 16 tracts; one polygon missing or merged. |
| R4-050 | Chicago 1821 reserves | 138, 188 (and others) | 20,209; 8,098 | Only two of five found. |
| R4-051 | Nottawa Sape | 189 | 70,751 | Probable; 139, 140 are other 1827 St. Joseph/Cass/Kalamazoo tracts. |
| R4-052 | NY Indians tract (Green Bay) | 246, 247 | 442,372; 58,465 | Probable. Dates are 1838 (sale). |
| R4-053, 054 | Stockbridge/Munsee, Brothertown (Lake Winnebago) | 257, 161 (162 is adjacent) | 28,757; 51,552 | Uncertain split between the two townships. |
| R4-058 | Moultrie Creek reservation | 173 | not measured | Probable. Royce 173 is the 1823 "Seminole" area; a spatial test at 28.5N shows a hit. |
| R4-059 to 062 | Four Apalachicola chiefs' reserves | 119, 176, 184, 185 | 3,233 to 5,462 | Four polygons for four reserves; names not matched. |
| R4-057 | Cherokee 640-acre reserves | partial: 104 (1819), 58, 59, 105 to 109 (1805, not R4's dates) | 1x2 to 6x5 minutes of arc | Individual reserves only partly mapped; most of the 1817/1819 list is not. |

### Reservations with no polygon in any source found (need extrapolation, or a point or symbol)
- **Oneida (NY), New Stockbridge, Brothertown (NY).** State treaties, so they are not in Royce. A spot test at the Oneida reserve centre fell in no polygon.
- **Pennsylvania:** Cornplanter Grant (R4-024).
- **Virginia colonial/state:** Pamunkey, Mattaponi, Gingaskin, Nottoway (R4-001 to 004). Nottoway has size+anchor text ("the Circle and the Square"), so it can be drawn. The others cannot.
- **Catawba Augusta tract** (R4-005) and **Brotherton NJ** (R4-006). Colonial, so not in Royce.
- **New England and Maine:** Mashpee, Eastern Pequot, Schaghticoke, Golden Hill, Penobscot, Passamaquoddy, Pleasant Point (R4-025 to 031). Maine and Massachusetts treaties were with the states, so Royce leaves them out. Only modern boundaries exist (Census AIANNH, EPA Region 1, which warns that Maine boundaries are disputed). Penobscot and Passamaquoddy have metes and bounds, so they can be drawn.
- **Meshingomesia** (R4-046), **Oneida WI** (R4-055): no polygon found.
- **Fort Jackson reserves, Choctaw Art. XIV and chiefs' reserves, Creek allotments, Chickasaw reservations** (R4-056, 063 to 066), and **Fort Meigs grants** (R4-042), **Armstrong Delaware reserve** (R4-041). Rule-only. Royce numbers some Choctaw reserves in Clarke Co., AL (62, 157) but those are from 1805, a different treaty.

Not in R4 but present in the layer (for later): Christian Indians 1788 (4, 5, 6), Big Spring Wyandot (171), Delaware on the Sandusky (150), Oil Spring (41 maybe), Ohio 1807/1808 tracts, Michigan 1807 and 1809 (89, 95, 96, 135 to 137, 214 to 217, 260), Cherokee 1805 and 1819 reserves in TN (58, 59, 104 to 109), Chickasaw 81, Sauk and Fox (51, 120).

## Other sources checked

| Source | What it has | Licence | Verdict |
|---|---|---|---|
| Newberry AHCB (R2) | Counties and territories. No eastern reserve polygons (only Quapaw, Cheyenne and similar, all west of the Mississippi or after 1840). | Free reuse, cite | Not useful for reserves. |
| Myaamia Center, Miami University, "aacimwahkionkonci" (https://mc.miamioh.edu/aacimwahkionkonci/) and "Myaamia Maps" Hub (https://myaamia-maps-miamioh.hub.arcgis.com) | Per-parcel records for Miami reserves (name, acreage, start date, **Royce number**, treaty text). The parcel page showed no coordinates or download. | Page says "© 2022 Miami Tribe of Oklahoma"; no licence or terms found | **Use as a crosswalk** for Royce numbers (252 confirmed). **Manual step:** the Hub may offer GIS layers; the fetch returned only the title, so Lara should open it and look, and ask the Myaamia Center about terms. The data belongs to the Tribe, so ask permission before publishing. |
| Carleton (2018), Choctaw Art. XIV claims KML, Indigenous Alabama (https://indigenousalabama.omeka.net/s/choctaw/item/445) | Search snippet describes a KML of all Article 14 claims, reservations granted, and 1830 house locations. | Unknown | **Unverified.** Fetching the item page returned 404. Not downloaded. Try the Omeka site search or contact the editors. If it exists, it is the only lead for R4-063/064. |
| Indiana State Library, Miami National Reserve maps / Treaty of St. Mary's plats (https://archives.isl.lib.in.us/repositories/2/resources/3186; https://digital.library.in.gov/Record/ISL_p16066coll68-151) | Scanned plats and maps, not vector. | Not checked | Georeferencing candidates for R4-043 to 045 only. |
| La Tourrette 1833, *Map of the Creek Territory in Alabama*; La Tourrette's Choctaw map (Indigenous Alabama item 461; Yale) | Section-level scans showing allotments | Not checked | Raster only. Would need georeferencing for R4-065. |
| Holland Land Company 1804 map (linked from Wikipedia, "Treaty of Big Tree") | Shows Seneca reservations | Not checked | Raster; a cross-check for the Royce Seneca polygons. |
| Hough 1861, NY Commissioners of Indian Affairs; NARA RG 75; NY State Archives | Boundary text for NY state treaties (R4 gap) | n/a | Text, not GIS (already flagged in R4). |
| GLIFWC Ceded Territory Boundary v2.1 (https://data.glifwc.org/geodata/dataset/ceded-territory-boundary-v2-1) | Ojibwe treaty-area cessions, 1836/1837/1842/1854 | Not checked | Cessions, not reserves; skip. |
| BIA AIAN-LAR, Census AIANNH, NYS civil boundaries, UConn MAGIC | **Modern** reservation boundaries | public domain / various | Excluded as modern. The modern Seneca (Cattaraugus, Allegany, Tonawanda), Penobscot and Mashpee outlines are a rough proxy at best; flag them if used. |
| Native Land (R2) | Contemporary, restricted | Restricted | Not used. |
| State historic GIS offices (NY, OH, IN, MI, WI, ME, CT, MA, VA) | Web search found no historical reservation layers. | n/a | Not exhaustive: I did not query each state's portal directly. |

## What Lara needs to do by hand
1. Open the Myaamia Maps Hub and check whether reserve polygons can be downloaded and under what terms. Ask the Myaamia Center for permission if you will publish them.
2. Look for the Carleton KML on the Indigenous Alabama site (or email the project); unconfirmed.
3. Nothing else needs an account.

## For S3 (not done here)
- Join `CESSNUM` to `TribalCededLandsTable` (one-to-many), then confirm each candidate match above against Royce's Schedule entry for the treaty date. The Royce Schedule is linked from each table row.
- Where a Royce polygon exists, still check it against `size_as_written`. A polygon more than about 1.5 times the treaty acreage should be flagged `generalised`.
- Extrapolate only the rows with no polygon and usable text (Nottoway, Penobscot, Passamaquoddy, Pleasant Point, Moultrie Creek, and similar). Flag each `extrapolated`.
- Keep the polygon and extrapolated layers separate, with a `source_type` field (`royce_polygon`, `extrapolated`, `point`).
