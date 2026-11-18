# T-002 notes: reservation points (agent, 2026-11-17)

Output: `data/processed/reservations_points.csv` (66 rows; all R4 columns unchanged, plus `lat`, `lon`, `coord_method`, `coord_source`, `coord_note`). `reservations_R4.csv` and `data/raw/` were not touched. Nothing new was saved under `data/raw/`; the OSM and Wikipedia lookups were read-only queries and the values are copied into the CSV.

## Result
| coord_method | rows |
|---|---|
| royce_centroid | 32 |
| named_place | 21 |
| county_centroid | 6 |
| none | 7 |
| **with a point** | **59** |

All 59 points fall inside the stated `present_state` (point-in-polygon against the Newberry modern county polygons). `coord_method` and `coord_source` are filled for all 66 rows.

## Method
1. **Royce centroid.** From `S_USA.TRIBALCEDEDLANDS.shp` I took each polygon's interior point (`ST_PointOnSurface`), so a point never sits outside its polygon. Matches come from `research/R4-reservation-gis.md` and were re-checked against the layer's table (tribe, state, county, treaty date). Group rows (R4-047, 049, 050, 052) use the mean of their polygons' interior points; that point can fall between tracts. R4-041 is a proxy (see below).
2. **Named place.** Town, village or reservation named in the R4 row or boundary text, with coordinates from OpenStreetMap (Nominatim) or Wikipedia. A place is only used where R4 or the Royce layer anchors it.
3. **County centroid.** Centroid of the modern county polygon in the Newberry layer (`END_DATE` 2000). Coarse; used only where R4 names a county and no place.
4. **None.** No source locates it.
Precision is 4 decimals but the real accuracy is the method: Royce polygons are generalised (R4-reservation-gis.md), county centroids can be 20+ km off.

## Rows without a point
| id | reason |
|---|---|
| R4-012 | A region (land west of the Phelps-Gorham line), not a place. Its reserves are R4-013 to 023. |
| R4-056, 057, 063, 064, 065, 066 | Dispersed allotment classes (the 6 rows in `docs/DATA.md`). The only lead is the Carleton KML (R4-063/064), still unverified. |

## Weak points to review (all flagged in `coord_note`)
- **Proxy:** R4-041 (Armstrong Delaware reserve) uses Royce 259, the Wyandot tract it adjoins, not its own polygon.
- **Group means:** R4-047, 049, 050, 052.
- **Assignment among Royce polygons unsettled:** R4-061/062 (184 vs 185, both Jackson Co.), R4-040 (183 chosen because its 1807 date matches R4; 182 is the alternative), R4-053.
- **Livingston Co. four (R4-013 to 016):** named places used instead of Royce 30 to 33, because which polygon is which is unsettled. Each named place is within about 10 km of a Royce centroid.
- **Named place is the nearest anchor, not the reserve:** R4-007, 010, 029 (Indian Island, while the 1818 townships run up river), 042, 046 (cemetery named for the chief), 055.
- **Coarse county points:** R4-003, 004, 005 (mean of York and Lancaster), 024, 033.
- **Confirming:** R4-048 Royce 218 centroid is within 2 km of Twin Lakes, Marshall Co. (OSM), the place in R4's row title.
- Modern reservations used as the point for Pamunkey, Mattaponi, Schaghticoke, Pleasant Point and Indian Township, since R4 says continuous occupation. They are not surveyed 17th or 18th century boundaries.

## Royce matches that disagree with R4
| id | R4 | Royce | Reading |
|---|---|---|---|
| R4-008, 009 | 1788-09-12 / 1789-02-25 | 9, 10 dated 1794-11-10 (Canandaigua) | Royce dates the federal treaty, R4 the state treaty. Not a conflict in location; the date field should come from R4. |
| R4-019 | Erie Co. | 36 centroid is in Cattaraugus Co. (polygon spans Cattaraugus, Chautauqua, Erie) | County label differs; check R4's county. |
| R4-052 | 1831-02-08 | 246, 247 dated 1838-01-14 / 02-02 | Royce date is the sale of the tract. Date differs by design. |
| R4-053 | 1832-10-27 | 257 dated 1839-09-02 | Royce 257 (Munsee) carries a later date; match uncertain. |
| R4-049 | 16 tracts | 15 polygons (227 to 241) | One tract missing or merged. |
| Small | 1-day offsets on 1797, 1818, 1821, 1823, 1827 treaty dates | | R4 uses signing dates; Royce's are one day earlier. No change needed. |
No Royce match put a point in a different state from R4.

## Not done
The historian pass on `unverified` dates (the second half of T-002) was not in brief B-011. Dates are unchanged.

## Sources and licences
- USDA Forest Service, Office of Tribal Relations. 2018. *Indian Land Cessions in the United States* (Royce layer, S_USA.TRIBALCEDEDLANDS; table S_USA.TribalCededLandsTable). CC BY 4.0 per data.gov listing. Local: `data/raw/gis/usfs-tribal-ceded-lands/`.
- Newberry Library. 2010. *Atlas of Historical County Boundaries*, US_HistCounties_Gen001. Free reuse with citation. Local: `data/raw/gis/newberry-ahcb-counties/`. (Year is from the project's earlier R2 notes; check the layer's READ_ME before publishing.)
- OpenStreetMap contributors. 2026. Nominatim search, queried 2026-11-17. ODbL; attribute "(c) OpenStreetMap contributors".
- Wikipedia. 2026. Article coordinates for Oneida Castle, Stockbridge, Fort Meigs, Fort Wayne, Brothertown WI, Pleasant Point, Indian Township (queried 2026-11-17). CC BY-SA 4.0.
- Myaamia Center. n.d. *aacimwahkionkonci*, https://mc.miamioh.edu/aacimwahkionkonci/. Used only for Royce 252 (via R4-reservation-gis.md). Terms unclear; belongs to the Miami Tribe of Oklahoma.
