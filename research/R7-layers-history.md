# R7: History behind layers 2, 3 and 6 (agent research, 2026-11-22)

Scope: brief B-014. (a) Is Royce defensible for L2? (b) Land-ad currencies and federal land prices. (c) Roads and migration routes, in `research/roads_R7.csv` (23 rows).
**Status labels:** *verified* = read in a primary source or a reliable reference page; *partial* = the main fact was checked but a detail was not; *unverified* = sources disagree or are missing.

---

## (a) Layer 2: Royce "not yet ceded"

**Verdict: defensible only if the layer is renamed and patched.** It works as "land not yet ceded to the United States by treaty (Royce)". It does not work as "Native land, c. 1784". Royce is still the standard reference: Sutton (2002, 64) calls it "the standard atlas in the cartographic and legal history of Indian lands". But it maps the *coloniser's acquisitions*, not Native territory. The USFS service that serves the polygons says its maps "may not be used to determine title, ownership, legal descriptions or boundaries" (USDA Forest Service n.d.).

**Problems that matter for this project**
1. **Cessions to states and private buyers are missing.** R1 gives no Royce number to Fort Herkimer 1785, NY–Onondaga 1788, NY–Cayuga 1789 or Phelps–Gorham 1788. If they are missing from Royce, central New York (the Military Tract, the main veteran destination) would show as "not yet ceded" well after it was sold. New England has no Royce areas at all, so reserves such as Mashpee, Penobscot and Passamaquoddy disappear. *Unverified:* whether Royce includes any state-made cessions (NY, MA, GA, SC). Check the `CESSNUM` table before drawing anything.
2. **Pre-1784 cessions are missing** (Proclamation 1763, Fort Stanwix 1768, Hard Labour 1768, Lochaber 1770). So in 1784 the layer would wrongly show Kentucky and western Pennsylvania as uncut.
3. **The nation labels are anachronistic for 1784.** A polygon carries the names of the nations that *signed its cession*, sometimes decades later. Example: the Greenville 1795 signers would label Ohio land as it stood in 1784. Nations moved in between.
4. **The lines are late and translated.** Royce's staff drew them in the 1890s from treaty wording. Sutton (2002, 63): "In many instances treaties of land cession have suffered from poor translation into maps, and treaty wordings referring to tribal territory have been called into question." He adds that "the boundaries drawn on maps reflect interpretations by non-Indians, a criticism often asserted by Indians" (69).
5. **Overlaps.** The same ground can sit under several cessions by different nations. Draw each polygon until its own date and list every nation; don't merge them.
6. **Who signed, and how.** The layer can't show coercion or unauthorised signers. Use a quoted Native statement instead (below).

**Fixes, ranked**
1. Rename the layer to "Not yet ceded to the US (Royce 1899)" and add the caveat lines below.
2. Draw pre-1784 boundary lines as dated lines, not areas. South: De Vorsey (1966), who reconstructs the 1763–75 Southern Indian Boundary line by colony. North: the Fort Stanwix 1768 line, using the NPS source already in R1 (T1768FS). Cappon (1976) also has redrawn boundary maps for 1760–90 (plate numbers unverified).
3. Add the R1 state and private cessions as dated points or hand-drawn outlines flagged `not_royce`. Show the R4 reserves as points, so the seaboard isn't blank.
4. Use Native presence as a check, not as polygons. Tanner (1987) maps villages "for various dates … but without boundaries" (Sutton 2002, 65). Maps 14–16 ("Frontier in Transition" 1782–86 and 1787–94, plus Illinois 1774–94) fit c. 1784, but cover only the Great Lakes and Ohio. The Handbook of North American Indians vols. 14–15 has period territory maps, which are ethnographic and not political (not consulted).
5. A Native-directed model to cite: the Myaamia Center's *Aacimwahkionkonci* maps Myaamia homelands, treaty cessions and reserves as separate classes. The Center describes it as "building on years of tribally-directed research into Myaamia land ownership in Myaamionki" (Myaamia Center 2022). It covers the Miami only; © Miami Tribe of Oklahoma, so link to it and don't copy.
6. Prucha's *Atlas of American Indian Affairs* (1990) and the Indian Claims Commission "Indian Land Areas Judicially Established" map (adapted there) are also based on Royce or on litigation. They are not independent of the coloniser's record (Sutton 2002, 65).

**Native-authored statements to quote, not paraphrase** (already verified in R4):
- Onondaga Nation (2006): the 1788 treaty was made by "unauthorized individuals at an unauthorized location."
- Oneida (Stevens n.d.): "Through 26 transactions the State of New York acquired the remaining land except for 32 acres."

**Flag for R3:** R3 lists Lisa Brooks as Abenaki. Her ancestry claim is publicly disputed by leaders of the Abenaki nations of Odanak and Wôlinak. Don't label her work "Native-authored" on the page until Lara decides how to handle this.

**Caveat text for the page (3 lines)**
> Shaded land had not yet been ceded to the United States by treaty in the year shown (Royce 1899). It shows US treaty law, not where nations lived or how they shared land; US commissioners drew the lines, and Royce's staff mapped them a century later.
> Names are as the treaties wrote them; nations today may use other names. Colonial cessions before 1784 and sales to states and private buyers (New York, Massachusetts) are shown as lines or points, or are missing. Blank does not mean empty.
> Many cessions were contested: the Onondaga Nation calls its 1788 treaty the work of "unauthorized individuals at an unauthorized location."

---

## (b) Layer 3: currencies in land ads, 1770–1810

**How to convert.** Until about 1800, and later in some places, ads priced land in each state's *money of account*: pounds, shillings and pence, rated against the Spanish dollar. Convert with the state's par rating: $ per £ = 20 ÷ (shillings per dollar). These are pars fixed by law or custom. Market rates varied, and McCusker's monthly series stops in 1775 (Notre Dame FAQ, via search).

| Money of account | Shillings per $ | $ per £ | Used in | Status |
|---|---|---|---|---|
| New England / "lawful money" | 6s | 3.333 | NH, MA (incl. Maine), RI, CT; VT (but VT also kept accounts in York money into the 1820s, per Michener) | verified (Michener, citing McCusker 1978) |
| Virginia | 6s | 3.333 | VA, KY | partial: Notre Dame FAQ and an unsourced list. VA = 6s is standard but not read in McCusker |
| Pennsylvania | 7s 6d | 2.667 | PA, NJ | verified (Michener) |
| Maryland, Delaware | 7s 6d | 2.667 | MD, DE; DC ads (Georgetown) | partial: grouped with PA in secondary sources only |
| New York ("York money") | 8s | 2.500 | NY; East Jersey into the 1820s | verified (Michener) |
| North Carolina | 8s | 2.500 | NC, TN | partial: unsourced Wikipedia list |
| Georgia | 5s **or** 4s 8d | 4.000 or 4.286 | GA | **unverified:** sources conflict |
| South Carolina after 1783 | 4s 8d (?) | 4.286 (?) | SC | **unverified.** Colonial SC currency was 32s 6d per $ (0.615 $/£), and post-1783 accounts were reportedly on a sterling basis |
| Sterling | 4s 6d | 4.444 | British-priced ads | verified (Michener: Spanish dollar = 4s 6d at the British mint) |
| Proclamation money (1704) | 6s | 3.333 | ads that say "proclamation money" | verified as the legal limit (Michener) |

**Rules for `ads.json`.**
- Store `currency` exactly as the ad states it ("lawful money", "currency", "Pennsylvania money", "dollars", "sterling").
- Fill `usd_per_acre` only when both the price and the currency are stated, or the currency is clearly implied by the paper's state. Flag implied cases.
- Exclude or flag ads from 1776–1781 priced in Continental or state paper. In March 1780 Congress revalued the paper at 40:1 (date well known; JCC page not checked), so those prices are not comparable.
- Flag 1785–89 ads in states with depreciating state paper (e.g., Rhode Island).
- Alexandria, VA joined DC in 1801 but kept Virginia law. Read the currency from the ad.
- To compare across years, McCusker (1992; 2nd ed. 2001) gives a commodity price deflator (base 1860 = 100). Use it only if Lara wants "real" prices.
- The US dollar is the unit of account from the Coinage Act of 2 April 1792 (1 Stat. 246; page from memory, not checked).

### Federal land prices 1785–1820 (read in the statutes)

| Act | Minimum price | Minimum unit | Terms | Effective cash price* |
|---|---|---|---|---|
| Land Ordinance, 20 May 1785 (JCC 28:375–81) | $1/acre | township or 640-acre lot, at auction | paid at sale "in specie, or loan office certificates, reduced to specie value" or certificates of liquidated debt | well under $1 in specie, because depreciated certificates were accepted (secondary; not computed) |
| Act of 18 May 1796 (1 Stat. 464, ch. 29) | $2 | 640-acre section (and quarter townships) | 1/20 deposit; half within 30 days, rest within 1 year; 10% off the credit half if paid up front | $1.90 (derived) |
| Act of 10 May 1800 "Harrison" (2 Stat. 73, ch. 55) | $2 | 320-acre half section (west of the Muskingum) | 1/4 within 40 days, then 1/4 each at 2, 3 and 4 years; 6% interest; 8% a year discount for early payment | $1.64 (derived) |
| Act of 26 Mar 1804 (2 Stat. 277, ch. 35) | $2 (§§5, 12) | 160-acre quarter section (§10) | credit as 1800; no interest if instalments are paid on time (§11) | $1.64 (derived) |
| Act of 24 Apr 1820 (3 Stat. 566, ch. 51) | $1.25 | 80-acre half-quarter section | cash only; no credit after 1 Jul 1820 | $1.25 |

*Derived by me from the statute terms, not stated in the acts. The "$1.64 for 1804" in some secondary tables is this cash-discount price, not a statutory minimum. State land (VA treasury warrants, NY Military Tract, Georgia lotteries, PA) followed other rules and is not covered here.

---

## (c) Layer 6: roads and routes (`roads_R7.csv`)

23 rows: 5 verified, 15 partial, 3 unverified. The columns are endpoints, year authorised, year open, a `year_note` with conflicting dates, `native_path_basis` and `nations_on_route_as_named`. Blank means not found; nothing was guessed.

**Notes**
- Many "pioneer" roads were laid on Native paths. The CSV says so where a source does: Great Wagon Road, Wilderness Road, Avery's Trace, Natchez Trace, Federal Road, Unicoi, Chicago Road (Sauk Trail), and possibly Zane's Trace (Mingo Trail). The page can show this as continuity.
- Several roads were opened *under treaty or by force through nations' land*: Natchez Trace 1801 (Choctaw, Chickasaw), the Federal Road 1805/1811 (Creek), Unicoi 1813 (Cherokee). This ties L6 to L5. Harrell (2010) records that Benjamin Hawkins counted 3,726 westward travellers on the Federal Road between October 1811 and March 1812.
- "Opening year" means different things: blazed (Wilderness 1775), authorised (National Road 1806) or wagon-passable (Wilderness 1795/96, Zane's after 1804). Show the wagon year if L6 is about migration, and keep the others in the tooltip.
- Canals (rows 21–23) are here only to cross-check Atack's GIS. Atack should stay the L6 source for canals and railroads.
- **Gaps:** Fall Line and Upper roads (Carolinas), Cherokee Federal Road (GA–TN, 1805), Catskill Turnpike, Buffalo Trace and Vincennes Trace (IN), Michigan Territorial Road, Lake Erie steam navigation, and Maine roads. Removal routes belong to L5 (NPS trails).

**Unverified items (roads)**
- Wilderness Road wagon year: 1795 vs 1796.
- National Road: Columbus 1833 vs 1834; Vandalia c. 1839.
- Unicoi: charter 1812 vs 1813; opening c. 1817 vs 1819.
- Great Western Turnpike: 1798 vs 1799.
- Chicago Road completion: 1827, 1831 or 1836.
- Jackson's Military Road length; Braddock's Road endpoints.
- Forbes Road as the 1791 State Road.
- Genesee Road: the 1794 act date and 1798 Buffalo extension, seen only in search summaries.

---

## Unverified (all sections)
- Whether Royce includes any state-made cessions (check `CESSNUM`).
- Cappon (1976) plate numbers; whether Tanner maps 14–16 show villages.
- Currency: Georgia (5s vs 4s 8d), post-1783 South Carolina, North Carolina, Maryland/Delaware and Virginia par values. McCusker 1978 itself was not opened. Michener's EH.Net article (citing McCusker) is the source for NE, NY, PA and sterling.
- The 1780 40:1 revaluation page in JCC; Coinage Act page.
- The year of Michener's EH.Net article.

## Sources (Chicago author-date)
- Armao, Mildred Leedy. n.d. "The Untraveled History of the Wilderness Road." *Kentucky Ancestors*, Kentucky Historical Society. https://history.ky.gov/kentucky-ancestors/the-untraveled-history-of-the-wilderness-road.
- Britannica. n.d. "Erie Canal." https://www.britannica.com/topic/Erie-Canal.
- Cappon, Lester J., ed. 1976. *Atlas of Early American History: The Revolutionary Era, 1760–1790*. Princeton: Princeton University Press for the Newberry Library and the Institute of Early American History and Culture. (Not consulted.)
- Cleveland Historical. n.d. "Ohio and Erie Canal." https://clevelandhistorical.org/index.php/items/show/52.
- Crown Point Road Association. n.d. "The Crown Point Road: An Introduction." https://www.crownpointroad.org/home/?p=94.
- De Vorsey, Louis, Jr. 1966. *The Indian Boundary in the Southern Colonies, 1763–1775*. Chapel Hill: University of North Carolina Press. (Not consulted; catalogue only.)
- Encyclopedia of Alabama. n.d. "Jackson's Military Road." https://encyclopediaofalabama.org/?p=17375.
- Federal Highway Administration. n.d. "Maryland's Bank Road." Updated June 27, 2017. https://www.fhwa.dot.gov/infrastructure/bankroad.cfm.
- Federal Highway Administration. n.d. "The Rambler's Innovative Financing Tips No. 2, No. 3, and No. 4" (Zane's Trace). https://www.fhwa.dot.gov/infrastructure/zanestrace.cfm.
- Federal Highway Administration. n.d. "Philadelphia and Lancaster Turnpike Road, 1795" (Rakeman paintings). https://www.fhwa.dot.gov/rakeman/1795.htm.
- Greene, Nelson, ed. 1925. *History of the Mohawk Valley: Gateway to the West, 1614–1925*. Vol. 2, ch. 80. Chicago: S. J. Clarke. https://schenectadyhistory.org/resources/mvgw/history/080.html.
- Harrell, Kevin. 2010. "Federal Road in Alabama." *Encyclopedia of Alabama*. Updated 2023. https://encyclopediaofalabama.org/article/h-2999.
- Hulbert, Archer Butler. 1903. *The Old Glade (Forbes's) Road (Pennsylvania State Road)*. Cleveland: Arthur H. Clark. https://www.gutenberg.org/ebooks/41118. (Not opened in this pass.)
- Longfellow, Rickie. n.d. "The Cumberland Gap." FHWA Highway History. https://www.fhwa.dot.gov/infrastructure/back0204.cfm.
- McCusker, John J. 1978. *Money and Exchange in Europe and America, 1600–1775: A Handbook*. Chapel Hill: University of North Carolina Press for the Institute of Early American History and Culture. (Cited via Michener.)
- McCusker, John J. 1992. *How Much Is That in Real Money? A Historical Price Index for Use as a Deflator of Money Values in the Economy of the United States*. Worcester, MA: American Antiquarian Society. 2nd ed. 2001. https://search.worldcat.org/oclc/53347080.
- Michener, Ron. n.d. "Money in the American Colonies." *EH.Net Encyclopedia*, edited by Robert Whaples. https://eh.net/encyclopedia/money-in-the-american-colonies/.
- Michigan State University Libraries. n.d. "Michigan Road Maps" (exhibit). https://lib.msu.edu/exhibits/map/miroadmap1.
- Myaamia Center. 2022. "About." *Aacimwahkionkonci: Stories from the Land*. © Miami Tribe of Oklahoma. https://mc.miamioh.edu/aacimwahkionkonci/about.
- National Park Service. n.d. "Chronology of the Natchez Trace." Natchez Trace Parkway, Tupelo, MS. https://npshistory.com/publications/natr/brochures/chronology.pdf.
- National Park Service. n.d. "Cumberland Gap." https://www.nps.gov/places/cumberland-gap.htm.
- Onondaga Nation. 2006. "Three Fraudulent Treaties Took 99% of Onondaga Land." https://onondaganation.org/news/2006/three-fraudulent-treaties-took-99-of-onondaga-land. (Quote verified in R4.)
- Philadelphia Encyclopedia. n.d. "Main Line of Public Works." https://philadelphiaencyclopedia.org/essays/main-line-of-public-works/.
- Royce, Charles C., comp. 1899. *Indian Land Cessions in the United States*. Eighteenth Annual Report of the Bureau of American Ethnology, pt. 2. Washington, DC: GPO. https://lccn.loc.gov/13023487.
- Smith, David Ray. 2017. "Historic Trails." *Tennessee Encyclopedia*. Updated March 1, 2018. https://tennesseeencyclopedia.net/entries/historic-trails/.
- South Carolina Encyclopedia. n.d. "Great Wagon Road." https://scencyclopedia.org/sce/?p=6725.
- Stevens, Jennifer M. n.d. *Oneida Land Claims Time Line of New York State*. Oneida Nation. https://oneida-nsn.gov/wp-content/uploads/2016/04/ONEIDA-LAND-CLAIMS-TIME-LINE-OF-NEW-YORK-STATE-9.13.pdf. (Quote verified in R4.)
- Sutton, Imre. 2002. "Cartographic Review of Indian Land Tenure and Territoriality: A Schematic Approach." *American Indian Culture and Research Journal* 26 (2): 63–114. https://escholarship.org/uc/item/0m57b0pw.
- Tanner, Helen Hornbeck, ed. 1987. *Atlas of Great Lakes Indian History*. Cartography by Miklos Pinther. Norman: University of Oklahoma Press. (Not consulted; table of contents via catalogue.)
- US Congress. 1785. "An Ordinance for Ascertaining the Mode of Disposing of Lands in the Western Territory." May 20. *Journals of the Continental Congress* 28:375–81. Transcription: https://tngenweb.org/law/northwest1785.html.
- US Congress. 1796. "An Act Providing for the Sale of the Lands of the United States, in the Territory Northwest of the River Ohio." May 18. 1 Stat. 464. https://www.govinfo.gov/link/statute/1/464.
- US Congress. 1800. "An Act to Amend the Act Intituled 'An Act Providing for the Sale of the Lands …'" May 10. 2 Stat. 73. https://www.govinfo.gov/link/statute/2/73.
- US Congress. 1804. "An Act Making Provision for the Disposal of the Public Lands in the Indiana Territory." March 26. 2 Stat. 277. https://www.govinfo.gov/link/statute/2/277.
- US Congress. 1820. "An Act Making Further Provision for the Sale of the Public Lands." April 24. 3 Stat. 566. https://www.govinfo.gov/link/statute/3/566.
- USDA Forest Service. n.d. "EDW_TribalCessionLands_01" (map service, Royce cessions). https://apps.fs.usda.gov/arcx/rest/services/EDW/EDW_TribalCessionLands_01/MapServer.
