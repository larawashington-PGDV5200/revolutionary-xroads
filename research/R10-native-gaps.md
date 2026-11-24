# R10: Native layer gaps (layer 2 title, removal destinations, the east) (agent research, 2026-11-24)

Scope: T-012 B2 and D-028. Builds on R1, R3, R4 and R7. *Verified* means read in Kappler (OSU), the USFS service or a named page. *Unverified* means not opened, or sources disagree; the reason is given each time. No Royce number was guessed. Every cessnum below came back from the USFS service or is already in `web/data/native_land.topojson`.

---

## 1. Layer 2 title

Royce shows land **not yet ceded to the United States, year by year, from 1784**. That rules out "pre-Revolution", because Royce starts after the war. It also rules out "territories" and "homelands", because the lines are US treaty lines (R7 §a). There is a second reason to avoid "homelands": some polygons are **removal destinations**, not homelands (see §2). Royce areas in Oklahoma and Kansas carry the names of nations that only arrived in 1828–40.

| # | Title | Subtitle (one line) |
|---|---|---|
| **A (recommended)** | **Native land not yet ceded** | Shaded until the year a treaty ceded it to the United States (Royce 1899, from 1784). |
| B | Native land still held, 1784–1840 | Land no treaty had yet signed over to the United States, by year; US commissioners drew the lines. |
| C | Before cession: Native land by treaty line | Each area stays shaded until its US cession treaty; colonial losses before 1784 are drawn separately. |

**Why A.** It is short, it says exactly what the data are, and it pairs with layer 5 under D-028: layer 2 is the land "not yet ceded", layer 5 is the same polygons "ceded". B's "held" is close to how Lara put it, but Royce does not show who held or used the land, only that the US had no cession yet. C is accurate but long.

**Avoid "unceded".** Today "unceded" means land that was never ceded at all. That is a present-day claim, and here it would be misread.

---

## 2. Removal destinations, 1830–40

### Finding: the polygons are already in the project, but dated wrong for this purpose
`native_land.topojson` already holds the USFS Royce polygons for Indian Territory and Kansas, because C01 kept every dated row. The USFS query for OK returns 38 features. These matter for 1828–40:

| cessnum | nation as named (USFS `schdtrb`) | first USFS date | what that date is (Kappler) |
|---|---|---|---|
| 486, 487 | Creek | 1833-02-13 | Treaty with the Creeks, Fort Gibson, **14 Feb 1833**. It **defined and guaranteed** the Creek country west (Art. II–III). It was not a loss of that land |
| 404 | Creek; Seminole | 1833-02-13 | Same treaty. Art. IV gives "the Seminole Indians of Florida" a home on Creek land |
| 489, 492 | Cherokee | 1833-02-13 | Treaty with the Western Cherokee, Fort Gibson, 14 Feb 1833 (Kappler 2:385). It re-guarantees the 7 million acres and the outlet |
| 490 | Cherokee | 1835-12-28 | New Echota, 29 Dec 1835. This area is in Kansas |
| 144 | Cherokee nation west of Mississippi river | 1827-05-05 | **Unverified.** The Western Cherokee treaty is **6 May 1828** (Kappler 2:288), and the Royce OCR also says May 1828. The USFS year looks wrong |
| 367, 368, 485 | Chickasaw; Choctaw | 1855-06-21 | 1855 Leased District cession, after our window |
| 480, 481 | Seminole | 1856-08-06 / 1866-03-20 | Separate Seminole land existed only from 1856 |
| 498–505 | Seneca, Mixed Seneca and Shawnee, Quapaw, Ottawa, Peoria, Wea and others | 1832-12-28 (503, 505: 1833-05-12) | Seneca and Shawnee treaty, 29 Dec 1832; Quapaw treaty, 13 May 1833. These are the north-east corner reserves |

This causes **three problems on the current map**:
1. **Anachronism.** Before 1828–33 these polygons show as "not yet ceded" under Cherokee, Creek or Choctaw names. From 1784 to the 1820s that ground was Osage, Quapaw, Wichita and Caddo country. Royce 94 (Quapaw, 1818), 97 and 123 (Osage, 1818 and 1825) and 124 (Kansa, 1825) overlap it.
2. **Backwards meaning.** For 486, 487, 404, 489 and 492, the first date is the 1833 treaty that **assigned** the land. Layer 5 would flip it to "ceded" in the very year the nations received it. The same is true in Kansas and Iowa (see the Addendum).
3. **No Choctaw core.** No Royce polygon covers the main Choctaw Nation in the west within 1784–1840. The nearest are the 1855 Chickasaw–Choctaw areas, because Royce maps cessions and that land was not ceded in Royce's sense. *Unverified:* whether any Choctaw polygon dated 1820/1830 exists west of Arkansas. The OK query returned none.

The project's dates also run **one day early** against Kappler in every case checked: 13 vs 14 Feb 1833, 28 vs 29 Dec 1832, 25 vs 26 Sep 1833, 6 vs 7 Nov 1825, 14 vs 15 Jan 1838. This supports the PLAN §6 "look one day early" check. Separately, USFS lists "Santee Sioux Nation, Nebraska" as `presdaytrb` for Cherokee area 492. That looks like an attribute error.

### Recommended source
- **Geometry:** the USFS Royce polygons already in hand (USDA Forest Service 2022; **CC BY 4.0** per data.gov). Add a small hand table, now built as `research/destinations_R10.csv` (see the Addendum), and draw each area as "assigned to a removed nation" from that date. Before that date, the older Osage, Quapaw and Kansa polygons show.
- **Check:** "Map Showing the Lands Assigned to Emigrant Indians West of Arkansas & Missouri" (US Topographical Bureau 1836). It shows each assigned tract in 1836 with population and acreage. It is a US government work, so public domain, but the LoC page returned 403 and the rights statement was not read. It is a scan: use it to check the table, not as geometry.
- **Not suitable:** Newberry AHCB gives only the outer "Indian Territory" outline (from 26 May 1824). Its own chronology says it does not draw individual nations (Will 2010). No public GIS of 1830s nation-by-nation assigned lands was found.

### Destinations, with dates (Kappler pages are the OSU URL numbers)
"Moved" gives the years people actually went, from the cited source; often only removal began in the window.

| Nation (as the treaty names it) | Assigning treaty (verified) | What it gives (quoted) | Moved | Nations today |
|---|---|---|---|---|
| Western Cherokee | Washington, 6 May 1828; 7 Stat. 311; Kappler 2:288 | 7 million acres, "guarantee it to them forever", "a perpetual outlet, West" | from Arkansas, 1828 (OHS n.d.) | Cherokee Nation; United Keetoowah Band |
| Cherokee | New Echota, 29 Dec 1835 (proclaimed 23 May 1836); 7 Stat. 478; Kappler 2:439 | 7 million acres plus about 800,000 acres; remove "within two years from the ratification" | forced removal 1838–39 (OHS n.d.) | Cherokee Nation; United Keetoowah Band; Eastern Band of Cherokee Indians (stayed in NC) |
| Choctaw | Dancing Rabbit Creek, 27 Sep 1830; 7 Stat. 333; Kappler 2:310 (western land first granted at Doak's Stand, 18 Oct 1820, per Will 2010) | "a tract of country west of the Mississippi River, in fee simple" | Art. III: autumns of 1831–33; began 1831 (OHS n.d.) | Choctaw Nation of Oklahoma; Mississippi Band of Choctaw Indians; Jena Band of Choctaw Indians |
| Creek (Muskogee) | Fort Gibson, 14 Feb 1833; 7 Stat. 417; Kappler 2:388 | "the Muskogee or Creek country west of the Mississippi"; fee-simple patent | first party late 1827; parties 1834, 1835; forced removal 1836–37 (Haveman 2009) | Muscogee (Creek) Nation; Poarch Band of Creek Indians (stayed in AL) |
| Seminole | Payne's Landing, 9 May 1832; 7 Stat. 368; Kappler 2:344 | "emigrate to the country assigned to the Creeks"; remove within 3 years | first group 1836; most by 1839; about 3,612 there by 1842 (Frank n.d.) | Seminole Nation of Oklahoma; Seminole Tribe of Florida; Miccosukee Tribe |
| Chickasaw | Pontotoc, 20 Oct 1832; 7 Stat. 381; Kappler 2:356. Doaksville, 17 Jan 1837; 11 Stat. 573; Kappler 2:486 | 1832: "procure a home ... west of the Mississippi"; 1837: "Chickasaw district of the Choctaw Nation" | "Most Chickasaws removed to Indian Territory from 1837-1851" (Chickasaw Nation n.d.) | Chickasaw Nation |
| Shawnee (Missouri bands) | St. Louis, 7 Nov 1825; 7 Stat. 284; Kappler 2:262 | "fifty (50) miles square, situated west of the State of Missouri" | Ohio bands' 1831 treaties (Kappler 2:327, 2:331) **not opened** | Shawnee Tribe; Absentee-Shawnee Tribe; Eastern Shawnee Tribe |
| Seneca of Sandusky; mixed band of Seneca and Shawnee | Washington, 28 Feb 1831; 7 Stat. 348; Kappler 2:325. Regranted at Cowskin River, 29 Dec 1832; 7 Stat. 411; Kappler 2:383 | 1831: land "adjacent to the northern boundary of the lands heretofore granted to the Cherokee"; 1832: 60,000 acres east of the Neosho in two patents | | Seneca-Cayuga Nation |
| Quapaw | 13 May 1833; 7 Stat. 424; Kappler 2:395 | "one hundred and fifty sections of land west of the State line of Missouri and between the lands of the Senecas and Shawnees" | | Quapaw Nation |
| Ottawa (Blanchard's Fork; Roche de Boeuf) | 30 Aug 1831; 7 Stat. 359; Kappler 2:335 | "a tract of land to contain thirty-four thousand acres" next to the Shawnee on the Kansas River | | Ottawa Tribe of Oklahoma |
| Kaskaskia and Peoria; Piankashaw and Wea | Castor Hill, 27 and 29 Oct 1832; 7 Stat. 403, 410; Kappler 2:376, 2:382 | 150 sections "west of the State of Missouri, on the waters of Osage river"; 250 sections in the same survey | | Peoria Tribe of Indians of Oklahoma |
| Delaware | James's Fork, 24 Sep 1829; 7 Stat. 327; Kappler 2:304 | "the country in the fork of the Kansas and Missouri Rivers" plus an outlet | | Delaware Tribe of Indians; Delaware Nation |
| Kickapoo | Castor Hill, 24 Oct 1832; 7 Stat. 391; Kappler 2:365 | "a country to reside in, southwest of the Missouri river" | Illinois Kickapoo to Kansas, 1833 (OHS n.d.) | Kickapoo Tribe in Kansas; Kickapoo Tribe of Oklahoma; Kickapoo Traditional Tribe of Texas |
| Winnebago | Fort Armstrong, 15 Sep 1832; 7 Stat. 370; Kappler 2:345 | "the tract of country on the west side of the Mississippi, known, at present, as the Neutral ground"; leave the ceded land by 1 June 1833 | | Ho-Chunk Nation; Winnebago Tribe of Nebraska |
| United Nation of Chippewa, Ottawa and Potawatomi | Chicago, 26 Sep 1833; 7 Stat. 431; Kappler 2:402 | at least 5 million acres "west of the Mississippi", starting at Boyer's River on the east side of the Missouri (south-west Iowa) | Indiana Potawatomi: Trail of Death, 4 Sep–4 Nov 1838, 859 people, 660 miles, "more than forty people died" (CPN n.d.) | Citizen Potawatomi Nation; Prairie Band Potawatomi Nation; Pokagon Band; others |
| New York Indians (Seneca, Onondaga, Cayuga, Tuscarora, Oneida, St. Regis, Stockbridge, Munsee, Brothertown) | Buffalo Creek, 15 Jan 1838 (proclaimed 4 Apr 1840); 7 Stat. 550; Kappler 2:502 | 1,824,000 acres "directly west of the State of Missouri"; remove within 5 years | few moved; the date is **unverified** (none found) | as R4 |
| Miami | Forks of the Wabash, 6 Nov 1838; 7 Stat. 569; Kappler 2:519 | "a country west of the Mississippi river, to remove to and settle on" (no place named) | 1846, outside the window (OHS n.d.) | Miami Tribe of Oklahoma |

**Not opened** (named so C01 can check them): Seminole 1833 (2:394), Creeks 1832 (2:341), Ohio Shawnee and Lewistown band 1831 (2:331, 2:327), the Kickapoo supplement of 26 Nov 1832, Swan Creek Chippewa 1836, Potawatomi 1836 treaties (2:450–471), Miami 1840 (2:531).

**Unverified, because sources conflict.** The OHS timeline says that in 1832 the Sauk and Fox ceded land "for land in Kansas" and the Prairie Band Potawatomi ceded Indiana land "for land in Kansas". The 1832 and 1833 treaties above point instead to Iowa and Missouri-border lands, with the Kansas moves later (Sauk and Fox after 1842; Council Bluffs Potawatomi after 1846). Don't use OHS for northern destination places; use Kappler.

### Native-authored and Native-published perspectives (quote, don't paraphrase)
- Chickasaw Nation (n.d.): "In 1837, we signed the Treaty of Doaksville with the Choctaw Nation and purchased the right..."; and it says this let the Nation, "unlike other tribes, ... pay for our own removal."
- Citizen Potawatomi Nation Cultural Heritage Center (n.d.): "more than forty people died during what the Potawatomi came to call the Trail of Death."
- Already in R3: Harkins, Choctaw (R3-19, M3); Cherokee Memorial 1829 (R3-18); Ross 1836 (R3-21); Black Hawk 1833 (R3-20, mediated).
- R3's gaps still stand: no Seminole voice and no 1830s Chickasaw voice from the period. The Chickasaw page above is present-day.

---

## 3. The east: colonial-era cessions before 1784

**Verdict: no reusable, dated GIS of colonial-era cessions was found.** Royce's schedule starts in 1784 and covers federal cessions only (USDA Forest Service 2022). What exists is scanned maps and printed lists that would have to be digitised:
- **Lines:** De Vorsey (1966) for the southern line, 1763–75, and the Fort Stanwix 1768 line (R1, R7). The project already has these. Hart (1906), "Native American Delimitations, 1763–1770", is a scanned map on Maps ETC (USF); its terms are **not checked**. Cappon (1976) has not been consulted.
- **Pennsylvania:** a 1933 Bureau of Land Records list of the 33 "treaties and purchases" up to 1792, and Hunter (1982), a reconstruction of the early purchases (spatial data not confirmed). Both would need digitising.
- **New England and New York:** deeds and petitions exist as documents (Yale Indian Papers Project / Native Northeast Portal), not geodata. The NYS "Indian Territories" GIS layer shows present-day reservations, so it is not usable here.
- **Paullin (1932), Richmond DSL digital edition:** "most maps ... have been georectified". Which plates show Indian boundary lines is **unverified**, because the plate list didn't load. No reuse terms are stated. Treat it as a reference only.
- **Royce 1899 itself:** Cyrus Thomas's introduction narrates colonial deeds and treaties colony by colony, for example the Pennsylvania deeds of 1682–83, the 1730 Cumming treaty and the 1763 Augusta treaty (read in the archive.org OCR). It is a text source for the zone's caption or tooltip, not a map.

**How to draw the zone.** Bound it on the west by the westernmost pre-1784 line already in the data: Fort Stanwix 1768 in the north, the southern line in the south. Draw it **only where no Royce polygon lies**: Royce does map later federal cessions east of the 1763 line, such as Cherokee land at Hopewell in 1785 and Creek land in Georgia. Keep the R4 reserves and the `not_royce` NY state-cession points on top. The NY Military Tract and Phelps–Gorham lie **west** of the 1768 line, so the zone must not cover them.

**Page text (2 sentences):**
> Land in this hatched zone was taken from Native nations before 1784 by colonial governments, private deeds and Crown treaties such as Fort Stanwix (1768); Royce maps only cessions to the United States from 1784, so these losses are not drawn here. Native communities did not leave with the land: the dots mark reserves and towns that remained, from Mashpee to Pamunkey to Catawba.

Short label for the zone: **"Taken before 1784: not mapped by Royce"**.

Optional Native voice for the zone (verified in R4): the Mashpee council, 1833, in Apess (1835): "Resolved, That we, as a tribe, will rule ourselves."

---

## Addendum (B-029a, 2026-11-24): destination table
`research/destinations_R10.csv` has **42 rows**: 15 in Indian Territory, 25 in Kansas, 2 in Iowa. **23 are verified (y), 19 are not (n).**
- **y means** the assigning treaty was read in Kappler, and the USFS first date and state match it. Royce schedule area numbers are cited where the archive.org OCR is legible (Royce 1899, 648 ff.).
- **Key finding.** In Kansas and Iowa, as in Indian Territory, the USFS first date is usually the treaty that **granted** the land: Shawnee 1825, Ottawa 1831, Kaskaskia–Peoria 1832, Iowa 1836, New York Indians 1838, Chicago 1833, Winnebago 1832. The current layer 5 marks these as "ceded" in the year they were assigned.
- **n rows:**
  - 144: the USFS year is 1827 against the 1828 treaty.
  - 498–502 and 504: unclear which areas are the 1832 grant and which are the 1831 grants ceded by it.
  - Kickapoo 325, 436, 437: dated to an unopened 26 Nov 1832 supplement.
  - Delaware 316, 317, 425, 488: the USFS first date is the 1854 cession. Delaware 430: relationship unclear.
  - Swan Creek Chippewa 417, 418: the treaty was not opened.
  - Miami 329, 330: the 1838 treaty names no place.
- **Not in the table:**
  - The Choctaw core (no Royce polygon found).
  - Chickasaw (a district inside Choctaw land; no polygon before 1855).
  - The Indiana Potawatomi Kansas reserve (the 1846 polygons 433 and 434 are outside the window).
  - Delaware–Wyandot 263 (1842).
- **`prior_occupants`** is by region only: the earlier Osage, Quapaw, Kansa or 1830 Prairie du Chien cessions, as Royce names them. No spatial overlap was computed; C01 should check it.
- **1836 map check: not done.** The LoC item returned 403, and the other copies are images or bot-blocked. A UALR exhibit lists the tribes shown (Choctaw, Cherokee, Creek, Osage, Quapaw, Shawnee, Pawnee, Sacs and Foxes, Kansas, Delaware, Kickapoo, Potawatomi, Otoe, Omaha), but the map itself has not been seen. Lara or C01 should compare it by eye.

---

## Unverified (summary)
- Royce 144: the USFS date of 1827 against the 6 May 1828 treaty.
- Whether any Royce polygon covers the Choctaw core west of Arkansas, 1820–40.
- Which of 498–502 and 504 is the 1832 grant and which the 1831 grants ceded by it.
- Rights text of the LoC 1836 map (403); terms for Maps ETC and the Richmond atlas. The 1836 map comparison has not been done.
- When the New York Indians actually moved to the Kansas tract; when the Winnebago moved to the Neutral Ground.
- Northern destination claims in the OHS timeline (they conflict with Kappler, see §2).
- The 19 n rows in `destinations_R10.csv`.

## Sources (Chicago author-date)
- Apess, William. 1835. *Indian Nullification of the Unconstitutional Laws of Massachusetts Relative to the Marshpee Tribe*. Boston: Jonathan Howe. https://www.gutenberg.org/ebooks/12486.
- Cappon, Lester J., ed. 1976. *Atlas of Early American History: The Revolutionary Era, 1760–1790*. Princeton: Princeton University Press. (Not consulted.)
- Chickasaw Nation. n.d. "Removal." https://chickasaw.net/Our-Nation/History/Removal.
- Citizen Potawatomi Nation Cultural Heritage Center. n.d. "Trail of Death." https://www.potawatomiheritage.com/?p=1298.
- De Vorsey, Louis, Jr. 1966. *The Indian Boundary in the Southern Colonies, 1763–1775*. Chapel Hill: University of North Carolina Press. (Not consulted.)
- Frank, Andrew K. n.d. "Seminole (tribe)." *The Encyclopedia of Oklahoma History and Culture*. Oklahoma Historical Society. https://www.okhistory.org/publications/enc/entry?entry=SE011.
- Hart, Albert Bushnell, ed. 1906. "Native American Delimitations, 1763–1770." In *The American Nation*, vol. 8. Via Maps ETC, University of South Florida. https://etc.usf.edu/maps/pages/2400/2421/2421.htm. (Seen in search results only; terms not checked.)
- Haveman, Christopher. 2009. "Creek Indian Removal." *Encyclopedia of Alabama*. Updated July 16, 2024. https://encyclopediaofalabama.org/article/creek-indian-removal/.
- Hunter, Charles E. 1982. *Reconstruction of Pennsylvania's Early Indian Land Purchases (Including the Pre-Penn Deeds, and a Recapitulation of the Post-1718 Purchases)*. tDAR record. https://core.tdar.org/document/118566. (Not opened.)
- Kappler, Charles J., comp. 1904. *Indian Affairs: Laws and Treaties*. Vol. 2, *Treaties*. Washington, DC: GPO. Pages read: 262, 288, 304, 310, 325, 335, 344, 345, 356, 365, 376, 382, 383, 385, 388, 395, 402, 439, 468, 486, 502, 519. Others are listed as not opened. https://treaties.okstate.edu/.
- Library of Congress. n.d. "Indian Territory." *Native American Spaces: Cartographic Resources at the Library of Congress*. https://guides.loc.gov/native-american-spaces/cartographic-resources/indian-territory.
- Oklahoma Historical Society. n.d. "Timeline of American Indian Removal." https://www.okhistory.org/research/airemoval.
- Paullin, Charles O., and John K. Wright. 1932. *Atlas of the Historical Geography of the United States*. Digital edition, edited by Robert K. Nelson et al. University of Richmond Digital Scholarship Lab. https://dsl.richmond.edu/historicalatlas/. (Plate list not reached.)
- Royce, Charles C., comp. 1899. *Indian Land Cessions in the United States*. With an introduction by Cyrus Thomas. 18th Annual Report of the Bureau of American Ethnology, pt. 2. Washington, DC: GPO. https://lccn.loc.gov/13023487. OCR text used: https://archive.org/stream/annualreportofbu218smit/annualreportofbu218smit_djvu.txt.
- University of Arkansas at Little Rock. n.d. "American Indian Removal – Object #3." *Primary Sources* exhibit. https://ualrexhibits.org/primarysources/?p=301. (Seen in search results only.)
- US Topographical Bureau. 1836. "Map Showing the Lands Assigned to Emigrant Indians West of Arkansas & Missouri." February 23. In H. Doc. 181, 24th Cong., 1st sess. (per the University of Missouri record). https://www.loc.gov/item/99446197/. (LoC page returned 403; details from the LoC guide and search results.)
- USDA Forest Service. 2022. "Tribal Lands Ceded to the United States (Feature Layer)." First published 2017; updated August 29, 2022. CC BY 4.0. https://catalog.data.gov/dataset/tribal-lands-ceded-to-the-united-states-feature-layer. Service: https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TribalCessionLands_01/MapServer/0.
- Will, Robert. 2010. *Oklahoma: Consolidated Chronology of State and County Boundaries*. Atlas of Historical County Boundaries, edited by John H. Long. Chicago: Newberry Library. https://publications.newberry.org/ahcb/documents/OK_Consolidated_Chronology.htm.
- Yale Indian Papers Project. n.d. https://campuspress.yale.edu/yipp/about_yipp.
