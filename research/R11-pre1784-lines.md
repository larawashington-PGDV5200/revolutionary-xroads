# R11: Pre-1784 lines, traced with uncertainty (agent research, 2026-11-24)

Scope: T-022 step 1 (brief B-035). Vertices are in `research/pre1784_lines_R11.csv` (107 rows, 7 lines; the addendum below adds 53 rows and 4 lines). Everything is inside the map extent in `web/data/relief_bounds.json`. No Native Land Digital or Whose Land data was used. Every coordinate is either a place the treaty names or a point on a river or divide the treaty names.

## How to read the CSV
- **method:** `described` means the treaty or deed names the point, or names the river the line follows and the vertex sits on that river. `extrapolated` means the vertex was computed from a bearing, or placed where a vaguely named stretch meets an anchor. **No `mapped` rows:** no published map was read for vertex positions in this pass (see Gaps). *(The addendum adds `mapped` rows, read from Royce's maps as digitised by USFS.)*
- **uncertainty_km:** my best estimate of how far the real line could be from the vertex. It covers both where the place is and what the treaty meant by it.
- **Segments (for C01):** suggestion: give each segment the larger uncertainty of its two ends and the weaker method. Where two `described` vertices sit on the same named river, follow the river geometry between them rather than a straight line. Straight lines are correct only where the text says "direct" or "strait" line: Kittanning to the West Branch; Tryon Mountain to Chiswell's Mine to the Kanawha; Lochaber to the Kanawha; Santa Savilla.
- **Coordinates** were placed from standard gazetteer knowledge of each named feature and rounded to 0.01°. I checked three against Wikipedia/GNIS-derived records (Unadilla mouth and source, Towanda Creek, Lycoming Creek), and those records are used only to locate the features. **The other coordinates have not been checked against GNIS one by one.** About 1–3 km of placement error is included in each uncertainty.

## Lines
**fort_stanwix_1768** (48 vertices). Source: the deed of 5 Nov 1768 between the Six Nations and the Crown (O'Callaghan 1857). The text gives the full course from the mouth of the Tennessee, up the south side of the Ohio and Allegheny to Kittanning, then a direct line to the "nearest Fork of the west branch of Susquehanna". From there it runs along the West Branch to opposite Tiadaghton, along that creek and the "North Side of Burnetts Hills" to Awandae (Towanda Creek), down to the East Branch, and up it to Oswegy (Owego). It then runs "East" to the Delaware, back to Tianaderha (Unadilla), up its West Branch, and ends at Canada Creek on Wood Creek, west of the carrying place at Fort Stanwix.
- *Tiadaghton is disputed.* Before 1784 the Six Nations read it as Lycoming Creek; settlers read it as Pine Creek, which would have given them more land. At Fort Stanwix in 1784 the Six Nations accepted Pine Creek (Wolf 1969, seen in search results only). The trace follows **Lycoming** as the Native reading in force for 1768–84 and gives that stretch 20–25 km of uncertainty. Seq 31 marks the Pine Creek alternative.
- *Weakest stretches:* the "Burnetts Hills" join (seq 35–36, 10 km) and the point "opposite" the Unadilla mouth on the Delaware (seq 43, 15 km).
- *The line ends at Wood Creek.* The deed gives no line north or west of Canada Creek, so the zone needs a closure there.
- *The south has no closure either.* The deed cedes the land south of the Ohio but names no southern line in Kentucky. The Cherokee also claimed that ground; see the Lochaber and Donelson entries.

**hard_labour_1768** (6). Source: Treaty of Hard Labour, 14 Oct 1768, Art. I (Saunders 1886–90). It restates the surveyed SC line of 1766 and NC line of 1767: Towatuhe on the Savannah, N 50° E to DeWitt's Corner, on to Waughoe on Reedy River, north to the Spanish oak on Tryon Mountain. From there a straight line runs to Chiswell's Mine and a straight line to the Kanawha mouth. Towatuhe and Waughoe are placed by running the stated bearing (10–12 km uncertainty). The Virginia legs were never run on the ground; Lochaber replaced them in 1770.

**lochaber_1770** (3). Source: Treaty of Lochaber, Art. 1 (VMHB 1902). The direction word in the line to the Kanawha is unreadable in the transcription ("**"). Folmsbee (1967) reads the start as the point where the Hard Labour line crosses 36° 30′, and the line as running "northward" to the Kanawha. I computed seq 1 from the Hard Labour Tryon–Chiswell line, so it is extrapolated (10 km).

**donelson_1771** (15). Source: Folmsbee (1967), a secondary account, on the 1771 Donelson–Cameron survey made with Cherokee guides. It ran from near Long Island to the headwaters of the Kentucky ("Louisa"), down that river to the Ohio and up the Ohio to the Kanawha. **Largest uncertainty in the file: seq 2, 30 km**, because no source read says which fork of the Kentucky the line struck. Seq 2–4 assume the North Fork. In practice this line, not Lochaber's straight run, was the Cherokee boundary until 1775.

**augusta_1763_creek** (7). Source: Treaty of Augusta, 10 Nov 1763, boundary article (Saunders 1890, 11:201; the Governors' reply on pp. 194–95 has the same course). The course: up the Savannah to Little River, to the fork of Little River, to the ends of the south branch of Briar Creek, down it to the Lower Creek Path, along the path to the Ogeechee, down the Ogeechee to just below the Mount Pleasant path, then a line across to Santa Savilla on the Altamaha. Every point here is a path crossing or a fork that I could not fix, so the uncertainties run 15–30 km. The article ends "Southward as far as Georgia extends", so the line has no southern end. It was surveyed in 1768 (De Vorsey 1966, not consulted).

**augusta_1773** (4). The Ceded Lands of the Cherokee and Creek. **Unverified:** the only boundary text found is a garbled OCR snippet (University of Utah n.d.) that I could not open (HTTP 418). It gives the line from the Lower Creek Path up the Ogeechee to its source. DeVorsey (2003) adds the Buffalo Lick. **Seq 4 (40 km) has no anchor in any source read.** It is an assumed join to the Savannah near Towatuhe, and it is flagged. Use it only if C01 needs a closure. Otherwise drop it. *(Superseded: see the addendum, `augusta_1773_royce7`.)*

**proclamation_1763** (24, all extrapolated). The Proclamation names no points, only a rule: lands "to the Westward of the Sources of the Rivers which fall into the Sea from the West and North West" (George III 1763). The line was never surveyed (R6). The trace follows the Atlantic-drainage divide through named gaps and summits that lie on it, from the Oneida Carry at Fort Stanwix to Rabun Gap. The km figures give the position of the divide only. **The legal reading is less certain than the km suggest**, so the line suits a reference stroke, not the zone edge. I stopped at both ends on purpose:
- *North of Rome:* the rule is ambiguous where the St. Lawrence drains to the sea, and Quebec's 45° boundary takes over.
- *South of Rabun Gap:* the rule is ambiguous on whether Gulf rivers count as falling "into the Sea". In Georgia the working line was the 1763 Augusta treaty line instead.

## Which lines bound the zone
From north to south, the zone's westernmost pre-1784 edge is:
- Fort Stanwix 1768, from Wood Creek to the Kanawha mouth;
- Donelson 1771, from the Kanawha mouth up the Ohio and Kentucky Rivers to Long Island (the Ohio below the Kentucky mouth is Six Nations cession only, and the Cherokee contested it);
- Lochaber 1770 along 36° 30′, then Hard Labour from Tryon Mountain to the Savannah;
- Augusta 1773 and 1763 in Georgia.

The Proclamation line lies east of all of these except in Georgia, so it does not bound the zone. *(The addendum moves this edge west for 1775–77.)*

## Gaps and unverified (why)
- **De Vorsey (1966) not consulted** (library book). It would tighten every southern vertex, which are mostly 10–30 km now, and would turn many `extrapolated` rows into `mapped`.
- **Later pre-1784 cessions not traced:** *(done in the addendum)* Henderson/Sycamore Shoals 1775 (private, voided by Virginia and NC), DeWitt's Corner and Long Island of Holston 1777, and Augusta 1783. These are pre-1784 losses, and by R10's logic they belong in the zone. The 1777 NC line is described in Royce (1899, 630), as quoted by TNGenWeb, so it could be traced next. *Decision for Lara:* does the zone mean "before 1775" or "before 1784"?
- **Florida lines left out:** Pensacola and Mobile 1765, and Picolata 1765. Spain held both Floridas from 1783, and later US cessions in Royce probably cover the same ground. *Unverified:* how much they overlap.
- **Coordinate checks:** most vertices have not been checked against GNIS (see above).

## Native nations (as named, with present-day nations)
- Six Nations, whose deed this is: Mohawk, Oneida, Onondaga, Cayuga, Seneca, Tuscarora. Today: the Haudenosaunee nations, including the Seneca Nation, the Oneida Indian Nation and the Six Nations of the Grand River.
- Shawnee, Delaware (Lenape) and Mingo lived on and hunted the Ohio lands the Six Nations ceded, and did not sign. Today: the Shawnee Tribe, the Absentee-Shawnee and Eastern Shawnee Tribes, the Delaware Tribe of Indians and the Delaware Nation.
- Cherokee (Hard Labour, Lochaber, Donelson, 1773). Today: the Cherokee Nation, the Eastern Band of Cherokee Indians and the United Keetoowah Band.
- Creek, Upper and Lower (1763, 1773). Today: the Muscogee (Creek) Nation and the Poarch Band of Creek Indians.
- Catawba (1763). Today: the Catawba Indian Nation.

**Native-authored perspective:** none newly found in this pass. In the record, the Cherokee guides on the Donelson survey and the Six Nations' Lycoming reading are Native positions, but both come to us through colonial texts. For voices, see R3.

---

## Addendum (2026-11-24): cessions of 1775–83, and northern New York

53 new rows in 4 new lines. `mapped` here means the vertex was read from Royce's own maps as digitised in the USFS layer (queried remotely with 0.03° simplification). **C01 should snap these to the full-resolution Royce edge already in `native_land.topojson`, not use my simplified points.** Royce coverage was checked by point and box queries on the USFS service. These points returned no polygon: Greenville SC, Pickens SC, Hawkins Co. TN north of the Holston, Lee Co. VA, Lincoln Co. KY, and Robertson Co. TN north of the Cumberland. A control point south of Nashville returned cession 3.

### New lines
**henderson_1775** (27: 23 described, 4 extrapolated). This is Henderson's main ("Great Grant") deed of 17 March 1775 at Sycamore Shoals. Text, from the deposition of Thomas Price: "beginning on the said Ohio River at the Mouth of the Kentucky … up the said River and the most Northwardly fork of the same to the head of a spring thereof, thence a south east [course] to the top of a ridge of Powells Mountain thence Westwardly along the ridge … unto a point from which a Northwest Course will hit or strike the head spring of the most Southwardly branch of the Cumberland River thence down the said River … to the Ohio River thence up the said River as it meanders to the beginning" (TNGenWeb n.d.). Royce (1887) maps it as cession No. 7.
- *Strongest:* the Kentucky and Cumberland river legs. The deed names "the most Northwardly fork", so the North Fork is now `described`. Donelson's seq 2–4 assumed the North Fork too.
- *Weakest:* the Powell's Mountain leg (seq 10–13, 8–20 km). The "south east" course from the North Fork head reaches the ridge only near its NE end at Norton (Wikipedia n.d.). The "most Southwardly branch" of the Cumberland is **unverified**. I read it as Yellow Creek at Cumberland Gap, because a NW course from the ridge's SW end at Tazewell TN leads there.
- *Royce overlap:* Royce 3 (1785) and 57 (1805) lie south of the Cumberland, so they barely overlap. "Including all its waters" could mean the deed took the whole Cumberland basin, but that land is in Royce anyway.
- *Status:* this was a private purchase. Virginia and North Carolina later voided Henderson's title but kept the land, so the Cherokee loss stands. *(Voiding dates are not checked in a source read this pass.)* Kentucky was also Six Nations cession land in 1768. Shawnee and the Chickamauga Cherokee did not accept either deal.
- *Path Deed (also 1775): not traced, on purpose.* Royce (1887) gives its course: "Begin on the Holston River, where the course of Powell's Mountain strikes the same; thence up the river to the crossing of the Virginia line; thence westerly along the line run by Donelson … to a point six (6) English miles east of Long Island … thence a direct course towards the mouth of the Great Kanawha until it reaches the top of the ridge of Powell's Mountain; thence westerly along said ridge to the beginning." Its start point is ambiguous. It also lies wholly inside the 1775 main deed plus the 1777 NC cession, so it never forms the zone edge.

**long_island_nc_1777** (11: 6 described, 2 extrapolated, 3 mapped). The North Carolina line of the Treaty of Long Island of Holston, 20 July 1777. The NC act quoted in Royce (1899, 630) gives the course: from the Virginia–Cherokee line where the VA–NC line meets it, a right line to the mouth of Cloud's Creek, then to Chimney Top Mountain, then to the mouth of Camp (McNamee's) Creek on the Nolichucky. From there it runs SE to the Great Iron Mountain, S to the French Broad / Nolichucky divide, SW along the ridges to the Blue Ridge, and along the divide to the SC line. The Hopewell treaty of 1785, Art. IV, restates the north half in substance: "thence to Campbell's line, near Cumberland gap; thence to the mouth of Claud's creek on Holstein; thence to the Chimney-top mountain; thence to Camp-creek, near the mouth of Big Limestone, on Nolichuckey" (Kappler 1904, 2:8). Royce (1887) maps the 1777 cession as No. 9.
- *Seq 1 is extrapolated (10 km).* Placing it at Cumberland Gap rests on Hopewell's "Campbell's line, near Cumberland gap". No text of Virginia's own 1777 line (Campbell's line) was found. Royce (1887) says only that the Cherokee gave up land "as low down on Holston River as the mouth of Cloud's Creek", and "the Chicamauga band … refused to give their assent".
- *Cloud's Creek* (5 km): a GNIS point at Cherokee Lake level (TopoQuest n.d.), but that it is the mouth is unconfirmed. *Camp Creek mouth* (6 km): placed from the Camp Creek community, not checked.
- *Royce's NC plate* (USFS cession 3) supplies the divide stretch (seq 6–8). The Blue Ridge points reuse the Proclamation divide vertices.

**dewitts_corner_1777** (5: 1 described, 1 extrapolated, 3 mapped). The Treaty of DeWitt's Corner, 20 May 1777 (SCDAH n.d.). In Art. I the Cherokee cede "all the Cherokee land Eastward of the Unacaye Mountain". In Art. II the line runs "South West and North East across the highest part of Ocunnee Mountain". The same line is restated in Hopewell 1785 ("along the same south-west over the top of the Oconee mountain till it shall strike Tugaloo river") and in the Creek Treaty of New York, 1790, Art. IV (Kappler 1904, 2:25). The text gives no coordinates, so seq 1–3 are read from Royce's map (USFS cessions 76 and 7, 8–10 km). Royce (1887) maps the 1777 cession as No. 8.
- *Royce overlap:* the sliver between the Oconee line and the Keowee is USFS cession 7 (Creek, 1790). C01's Royce subtraction removes it. The cession adds Greenville, Pickens and Anderson counties SC (as of today) to the zone.
- *Small gap:* about 14 km along the then-unsurveyed NC–SC line, between long_island_nc_1777 seq 11 (Caesars Head) and dewitts seq 1. Join them straight and flag the join as assumed.

**augusta_1773_royce7** (5, all mapped). **This resolves the R11 flag on augusta_1773 seq 4.** The 1773 boundary text is now read in Royce (1899, 639): "…along the ridge between the waters of Broad river and Oconee river up to the Buffaloe Lick, and from thence in a straight line to the tree marked by the Cherokees near the head of a branch falling into the Oconee river, and from thence along the said ridge twenty miles above the line already run by the Cherokees, and from thence across to Savannah river by a line parallel with that formerly marked by them". The OCR is quoted as printed, with errors corrected. The east edge of USFS cession 7 follows exactly this course, reaching the Savannah at about 34.32° N, −82.83°, near the Tugaloo–Seneca forks. Towatuhe (34.17° N) is not on it. **Recommend:** drop augusta_1773 seq 4 and its join. Run Buffalo Lick → this line → Savannah, and the closure becomes a cited `mapped` edge.

### Skipped, and why
- **Augusta 1783** (Cherokee 31 May; a few Creeks 1 Nov). Royce (1887, No. 10) gives "the country lying on the west side of the Tugaloo River, extending to and including the Upper Oconee River region". The Creek half covers the Oconee–Ogeechee strip. **USFS cession 7 (Creek, Treaty of New York, 7 Aug 1790) covers all of it:** Franklin, Hart, Stephens, Banks, Madison, Greene, Hancock, Washington and other counties. So the map shows it as "not yet ceded" until 1790. That matches the record, since the Creek Nation repudiated 1783 and the US recognised the line only in 1790. No rows.
- **Virginia's 1777 line (Campbell's line):** no course text found. It lies inside Henderson 1775 and NC 1777, except for its end at Cumberland Gap (used as long_island_nc_1777 seq 1).
- **Watauga and Nolichucky purchases (1772–75)** and **Long Island 1781:** both inside the 1777 NC cession. Royce (1887) lists no 1781 cession.
- **Chickasaw at French Lick, 1783:** *unverified*, not traced. Anything south of the Cumberland is in Royce 3 or 55 anyway.

### New zone edge (for C01)
1. Fort Stanwix 1768 from Wood Creek to the Kanawha mouth, then down the Ohio to the Cumberland mouth (fort_stanwix seq 15 → 2).
2. henderson_1775 seq 27 → 13: up the Cumberland to Cumberland Gap.
3. long_island_nc_1777 seq 1 → 11.
4. The assumed join, then dewitts_corner_1777 seq 1 → 4.
5. augusta_1773_royce7 seq 5 → 1, then augusta_1773 seq 2 → 1, then augusta_1763_creek seq 5 → 7.

Donelson, Lochaber, Hard Labour (in NC and SC north of the Savannah) and dewitts seq 5 become interior lines: keep them as `not_edge`. The new land comes to roughly central and south-east Kentucky, Tennessee north of the Cumberland, SW Virginia, NE Tennessee, the western NC strip and upstate SC. Area not computed.

### Largest uncertainties (new rows)
- henderson_1775 seq 13 (20 km): which Cumberland branch is meant.
- henderson_1775 seq 10 (15 km): the deed's bearing does not fit the ridge.
- dewitts seq 5 (12 km): inherited from Towatuhe.
- long_island seq 1, dewitts seq 1, and the NC–SC join (10 km each).

### Northern New York (summary for the note; Lara decided 2026-11-24 to cut at Wood Creek and leave the north open)
- **1768:** the Fort Stanwix deed ends at Canada Creek on Wood Creek. North of it no Crown cession was made, and the Mohawk village lands were to "effectually remain to them" (Royce 1899, 584).
- **In 1784** the land north of the Mohawk valley was claimed by:
  - the Mohawk (most had gone to Canada in the war, and New York held their valley lands);
  - the Oneida, to the west;
  - the Seven Nations of Canada, to the north. The 1796 treaty names the Caughnawaga (Kahnawake) and St. Regis (Akwesasne) chiefs.
- **Already alienated by colonial patents** before 1784: patents in the Mohawk, Hudson and Champlain corridors, and Totten and Crossfield's Purchase. That was a Mohawk deed of 1772 for about 1.1 million acres in the central Adirondacks, surveyed by Jessup in 1772 (NYS Archives n.d.). Its exact limits were not traced.
- **Taken after 1784** (none mapped by Royce except as noted):
  - Oneida to New York State, Fort Schuyler, September 1788: about 5 million acres minus a reserve (Hauptman 2001, as tabulated by Wikipedia; the treaty text was not read);
  - Onondaga, 1788;
  - Seven Nations of Canada, New York City, 31 May 1796 (7 Stat. 55; Kappler 2:45; Royce 1899, 656): "all claim … to lands within the state", except the St. Regis six-mile square, the mills and the Grass River meadows. USFS cession 28 covers only Franklin and St. Lawrence counties;
  - Mohawk, Albany, 29 March 1797 (7 Stat. 61; Royce 1899, 658): "cede to the state of New York all claim to land within the territorial limits of the state". This one has no polygon.
- The state had already sold Macomb's Purchase (1791) before the 1796 release.
- **Suggested note text:** "North of Wood Creek, Mohawk, Oneida and Seven Nations of Canada lands were taken by New York State treaties of 1788–1797, not mapped by Royce. Only scattered colonial patents there predate 1784."
- **Same issue elsewhere (unverified, not researched):** the zone also fills interior Maine (Passamaquoddy and Penobscot treaties with Massachusetts, which I believe date from 1794 onward, dates not checked) and Vermont (Abenaki land never ceded by treaty). Lara may want the same note or cut there.

### Native nations (as named)
- Cherokee: in Henderson, the "Cherokee Nation of Tribe of Indians" at Wataugah, and in 1777 the Overhill and Middle settlements. The Chicamauga band refused 1777. Today: Cherokee Nation, Eastern Band of Cherokee Indians, United Keetoowah Band.
- Creek (1790 overlap). Today: Muscogee (Creek) Nation and Poarch Band.
- Mohawk, Oneida, Onondaga, and the Seven Nations of Canada. Today:
  - Saint Regis Mohawk Tribe and the Mohawk Council of Akwesasne;
  - Mohawk Council of Kahnawà:ke;
  - Oneida Indian Nation and the Oneida Nation (Wisconsin);
  - Onondaga Nation.
- Shawnee: they hunted Kentucky and did not sign. Today: as above.

**Native-authored perspective:** none verified. Dragging Canoe's warning at Sycamore Shoals, that the land would be "dark and bloody", exists only in secondary retellings with differing wording. **Unverified:** no deposition was found. The Saint Regis Mohawk Tribe's present-day land-claim filings dispute the 1796 treaty; that is a lead, not opened.

### Sources added (Chicago author-date)
- Kappler, Charles J., comp. 1904. *Indian Affairs: Laws and Treaties*. Vol. 2. Washington, DC: GPO. Read via OSU, where the URL number is the start page: Treaty with the Cherokee, 28 Nov 1785, Art. IV, https://treaties.okstate.edu/treaties/treaty-with-the-cherokee-1785-0008; Treaty with the Creeks, 7 Aug 1790, Art. IV, https://treaties.okstate.edu/treaties/treaty-with-the-creeks-1790-0025; Treaty with the Seven Nations of Canada, 31 May 1796, https://treaties.okstate.edu/treaties/treaty-with-the-seven-nations-of-canada-1796-0045. (The CSV's end pages "2:8-11" and "2:25-29" are **not checked**; cite the start page only.)
- New York State Archives. n.d. "Plan of lands purchased for the benefit of Stephen Crossfield and Joseph Totten … surveyed by Ebinezer Jessup … 1772" and "Map Showing the Western Boundary Line of Totten and Crossfield's Purchase." https://digitalcollections.archives.nysed.gov/index.php/Detail/objects/10741. (Catalogue records only.)
- Royce, Charles C. 1887. "The Cherokee Nation of Indians." In *Fifth Annual Report of the Bureau of Ethnology, 1883–84*, 121–378. Washington, DC: GPO. Text: https://archive.org/stream/thecherokeenatio46493gut/46493.txt. (Printed page numbers not visible in the text file.)
- Royce, Charles C., comp. 1899. Pages 584, 630, 639, 656 and 658 read in the archive.org OCR: https://archive.org/stream/annualreportofbu218smit/annualreportofbu218smit_djvu.txt.
- South Carolina Department of Archives and History (SCDAH). n.d. "Transcription: Treaty of Dewitt's Corner, May 20, 1777." https://scdah.sc.gov/node/456.
- TNGenWeb. n.d. "Colonial Land Cessions." Quotes the Henderson deed from the deposition of Thomas Price, Henderson et al. Memorial, Thomas Jefferson Papers, Library of Congress. https://tngenweb.org/cessions/colonial2.html.
- TopoQuest. n.d. "Cloud Creek" (GNIS feature 1305985). https://topoquest.com/place-detail.php?id=1305985. Waymarking. n.d. "GA3395 lookout tower – Hawkins County, TN" (Chimney Top). https://www.waymarking.com/waymarks/wmB8K1_GA3395_lookout_tower_Hawkins_County_TN. Wikipedia. n.d. "Powell Mountain"; "Camp Creek, Tennessee"; "Aboriginal title in New York" (citing Hauptman 2001). These were used only to locate features or as pointers.
- USDA Forest Service. 2022. As in R10. Cessions 3, 7, 8, 28, 42 and 76 were queried. https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TribalCessionLands_01/MapServer/0.
