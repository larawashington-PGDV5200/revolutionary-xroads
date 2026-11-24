# R11: Pre-1784 lines, traced with uncertainty (agent research, 2026-11-24)

Scope: T-022 step 1 (brief B-035). Vertices are in `research/pre1784_lines_R11.csv` (107 rows, 7 lines). Everything is inside the map extent in `web/data/relief_bounds.json`. No Native Land Digital or Whose Land data was used. Every coordinate is either a place the treaty names or a point on a river or divide the treaty names.

## How to read the CSV
- **method:** `described` means the treaty or deed names the point, or names the river the line follows and the vertex sits on that river. `extrapolated` means the vertex was computed from a bearing, or placed where a vaguely named stretch meets an anchor. **No `mapped` rows:** no published map was read for vertex positions in this pass (see Gaps).
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

**augusta_1773** (4). The Ceded Lands of the Cherokee and Creek. **Unverified:** the only boundary text found is a garbled OCR snippet (University of Utah n.d.) that I could not open (HTTP 418). It gives the line from the Lower Creek Path up the Ogeechee to its source. DeVorsey (2003) adds the Buffalo Lick. **Seq 4 (40 km) has no anchor in any source read.** It is an assumed join to the Savannah near Towatuhe, and it is flagged. Use it only if C01 needs a closure. Otherwise drop it.

**proclamation_1763** (24, all extrapolated). The Proclamation names no points, only a rule: lands "to the Westward of the Sources of the Rivers which fall into the Sea from the West and North West" (George III 1763). The line was never surveyed (R6). The trace follows the Atlantic-drainage divide through named gaps and summits that lie on it, from the Oneida Carry at Fort Stanwix to Rabun Gap. The km figures give the position of the divide only. **The legal reading is less certain than the km suggest**, so the line suits a reference stroke, not the zone edge. I stopped at both ends on purpose:
- *North of Rome:* the rule is ambiguous where the St. Lawrence drains to the sea, and Quebec's 45° boundary takes over.
- *South of Rabun Gap:* the rule is ambiguous on whether Gulf rivers count as falling "into the Sea". In Georgia the working line was the 1763 Augusta treaty line instead.

## Which lines bound the zone
From north to south, the zone's westernmost pre-1784 edge is:
- Fort Stanwix 1768, from Wood Creek to the Kanawha mouth;
- Donelson 1771, from the Kanawha mouth up the Ohio and Kentucky Rivers to Long Island (the Ohio below the Kentucky mouth is Six Nations cession only, and the Cherokee contested it);
- Lochaber 1770 along 36° 30′, then Hard Labour from Tryon Mountain to the Savannah;
- Augusta 1773 and 1763 in Georgia.

The Proclamation line lies east of all of these except in Georgia, so it does not bound the zone.

## Gaps and unverified (why)
- **De Vorsey (1966) not consulted** (library book). It would tighten every southern vertex, which are mostly 10–30 km now, and would turn many `extrapolated` rows into `mapped`.
- **Later pre-1784 cessions not traced:** Henderson/Sycamore Shoals 1775 (private, voided by Virginia and NC), DeWitt's Corner and Long Island of Holston 1777, and Augusta 1783. These are pre-1784 losses, and by R10's logic they belong in the zone. The 1777 NC line is described in Royce (1899, 630), as quoted by TNGenWeb, so it could be traced next. *Decision for Lara:* does the zone mean "before 1775" or "before 1784"?
- **Florida lines left out:** Pensacola and Mobile 1765, and Picolata 1765. Spain held both Floridas from 1783, and later US cessions in Royce probably cover the same ground. *Unverified:* how much they overlap.
- **Coordinate checks:** most vertices have not been checked against GNIS (see above).

## Native nations (as named, with present-day nations)
- Six Nations, whose deed this is: Mohawk, Oneida, Onondaga, Cayuga, Seneca, Tuscarora. Today: the Haudenosaunee nations, including the Seneca Nation, the Oneida Indian Nation and the Six Nations of the Grand River.
- Shawnee, Delaware (Lenape) and Mingo lived on and hunted the Ohio lands the Six Nations ceded, and did not sign. Today: the Shawnee Tribe, the Absentee-Shawnee and Eastern Shawnee Tribes, the Delaware Tribe of Indians and the Delaware Nation.
- Cherokee (Hard Labour, Lochaber, Donelson, 1773). Today: the Cherokee Nation, the Eastern Band of Cherokee Indians and the United Keetoowah Band.
- Creek, Upper and Lower (1763, 1773). Today: the Muscogee (Creek) Nation and the Poarch Band of Creek Indians.
- Catawba (1763). Today: the Catawba Indian Nation.

**Native-authored perspective:** none newly found in this pass. In the record, the Cherokee guides on the Donelson survey and the Six Nations' Lycoming reading are Native positions, but both come to us through colonial texts. For voices, see R3.

## Sources (Chicago author-date)
- DeVorsey, Louis, Jr. 2003. "Indian Trails." *New Georgia Encyclopedia*. Last edited February 20, 2026. https://www.georgiaencyclopedia.org/articles/history-archaeology/indian-trails.
- De Vorsey, Louis, Jr. 1966. *The Indian Boundary in the Southern Colonies, 1763–1775*. Chapel Hill: University of North Carolina Press. (Not consulted.)
- Folmsbee, Stanley J. 1967. "Annotations Relating Ramsey's Annals of Tennessee to Present Day Knowledge." In J. G. M. Ramsey, *The Annals of Tennessee*, reprint, 754–55. Knoxville: East Tennessee Historical Society. As transcribed by TNGenWeb, "Colonial Land Cessions." https://tngenweb.org/cessions/colonial2.html.
- George III. 1763. "By the King, A Proclamation" (Royal Proclamation, 7 October 1763). Avalon Project, Yale Law School. https://avalon.law.yale.edu/18th_century/proc1763.asp.
- O'Callaghan, E. B., ed. 1857. "Deed Determining the Boundary Line between the Whites and the Indians" (Fort Stanwix, 5 November 1768). In *Documents Relative to the Colonial History of the State of New York*, 8:111–37 (page range as given by the portal). Albany: Weed, Parsons. Transcription: University of Nebraska–Lincoln, Treaties Portal. https://treatiesportal.unl.edu/earlytreaties/treaty.00007.html.
- Royce, Charles C., comp. 1899. *Indian Land Cessions in the United States*. 18th Annual Report of the Bureau of American Ethnology, pt. 2. Washington, DC: GPO. https://lccn.loc.gov/13023487. (p. 630 seen as quoted by TNGenWeb only.)
- Saunders, William L., ed. 1886–90. "Treaty of Hard Labour, 14 October 1768." In *The Colonial Records of North Carolina*, 7:851–55. Raleigh: P. M. Hale. Transcription: Encyclopedia Virginia. https://encyclopediavirginia.org/primary-documents/the-treaty-of-hard-labor-october-14-1768/.
- Saunders, William L., ed. 1890. "Journal of the Congress of the Four Southern Governors ... at Augusta, 1763." In *The Colonial Records of North Carolina*, 11:156–207 (boundary article p. 201). Documenting the American South. https://docsouth.unc.edu/csr/index.php/document/csr11-0084.
- University of Utah. n.d. OCR text, item 362990. J. Willard Marriott Digital Library. https://collections.lib.utah.edu/details?id=362990. (Search snippet only; page returned HTTP 418; item not identified.)
- VMHB (*Virginia Magazine of History and Biography*). 1902. "Treaty of Lochaber, 18 October 1770." Vol. 9: 360–64. Transcription: Encyclopedia Virginia. https://encyclopediavirginia.org/primary-documents/the-treaty-of-lochaber-october-18-1770/.
- Wolf, George D. 1969. *The Fair Play Settlers of the West Branch Valley, 1769–1784*. Harrisburg: Pennsylvania Historical and Museum Commission. https://www.gutenberg.org/ebooks/22471. (Seen in search results only; the Lycoming/Pine Creek reading rests on it and on Wikipedia, "Fair Play Men", so treat it as unverified until the book is read.)
- Wikipedia. n.d. "Unadilla River," "Towanda Creek," "Lycoming Creek." Used only to locate these features (GNIS-derived coordinates), not as historical evidence. https://en.wikipedia.org/wiki/Unadilla_River; https://en.wikipedia.org/wiki/Towanda_Creek; https://en.wikipedia.org/wiki/Lycoming_Creek.
