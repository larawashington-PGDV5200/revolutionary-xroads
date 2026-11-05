# R4: Reservations and reserves east of the Mississippi, 1763–1840 (agent research, 2026-11-03)

Table: `research/reservations_R4.csv`, 66 rows. This is a **selection**, not a full list. "Class" rows (individual reserves under one treaty article, e.g. Choctaw Art. XIV) are one row per rule, not one row per person.

**Sources.** Treaty text comes from Kappler vol. 2 at OSU (treaties.okstate.edu; the URL number is the Kappler page). State and colonial texts come from *Colonial Records of North Carolina* (DocSouth), Maine's 1843 printing of the Penobscot treaties, and the Passamaquoddy Tribe's transcription of the 1794 treaty. Where no primary text was found, secondary sources are named in the row and the gap is listed under `unverified`. Royce numbers are left out on purpose, because no reserve was matched to a Royce area in this pass.

**Columns.** `nation_as_in_source` uses the source's spelling; `present_day_nation` gives today's successor nations where known. `r1_treaty_id` joins to `treaties_R1.csv`; 34 rows link. `date_ended` is the treaty or act that ended the reserve; actual departure was often later. Commas are left out of numbers (e.g. `23000`).

## Boundary text: what can be mapped
`boundary_text_quality` grades the quoted text, not the land on the ground:

| quality | rows | what it means for S3/E |
|---|---|---|
| surveyed (PLSS) | 1 | Nottawa Sape 1827, given by township and range; can be drawn from the survey grid |
| metes-and-bounds | 13 | Lines run between named points: Canandaigua Seneca land, Gardeau, Cattaraugus ×2, Penobscot, Passamaquoddy ×2, Miami Big Reserve, NY Indians tract 1831, Moultrie Creek, and three Apalachicola chiefs' reserves. Can be extrapolated with medium confidence. |
| size+anchor | 23 | A size plus a centre or village (e.g. "twelve miles square ... the centre of which shall be ... fort Ferree"). Can be drawn as an idealised square with the outline flagged `extrapolated`. |
| size-only | 8 | Size only (e.g. Allegany "forty-two square miles, at or near the Allegenny river"). Can be drawn only as a point or a symbol sized by area. |
| rule-only | 9 | A rule rather than a place (e.g. "one mile square, to include his improvements"). Not mappable without land-office location records. |
| none | 12 | No boundary text found. |

**Usable boundary text: 36 rows** have a primary-source quote that can be mapped (14 lines or surveys, plus 22 size+anchor). The Nottoway row is size+anchor from a secondary paraphrase only.

## Native-authored and Native-published perspectives used
- Oneida: Stevens, *Oneida Land Claims Time Line* (Oneida Nation of Wisconsin): 270,000-acre 1788 reserve; "Through 26 transactions the State of New York acquired the remaining land except for 32 acres."
- Onondaga Nation (2006), "Three Fraudulent Treaties Took 99% of Onondaga Land": the 1788 treaty was made by "unauthorized individuals at an unauthorized location."
- Reynolds (2009), Oneida Nation historical note on Stockbridge-Munsee and Brothertown moves.
- Mashpee 1833 council resolution in Apess (Pequot) 1835: "Resolved, That we, as a tribe, will rule ourselves."
- Passamaquoddy Tribe's own transcription of the 1794 treaty.
- Cayuga Nation history page (dates the final sale 1805, not 1807).
- Signers recorded in the 1818 Penobscot treaty (Gov. John Etien, Lt. Gov. John Neptune and others). Menominee's (Potawatomi) 1837 protest that signatures on the 1836 cession were forged is known from secondary sources only; the petition itself is in R3 territory.

## Unverified (details in the CSV `unverified` column)
- **Conflicting dates or sizes:** Nottoway (c. 1705 vs. 1713; 41,000 vs. 23,000 acres); Golden Hill (1639 vs. 1659); Brotherton NJ sale (1801 vs. 1802); Cayuga final sale (1805 vs. 1807); New Stockbridge size (6 vs. 7 miles square); Cornplanter Grant acreage.
- **End dates assumed but not checked against the deed:** the 1826 sale of the Genesee River Seneca reserves; the 1833 end of Nottawa Sape; the 1836 Potawatomi cessions; what happened to Buffalo Creek, Tonawanda, Allegany and Cattaraugus after the contested 1838 treaty.
- **Founding dates not found:** Mashpee, Mattaponi, Golden Hill; Pamunkey's 1646 rests on one secondary source.
- **Catawba:** the day of the 1840 Nation Ford treaty, and whether South Carolina ever ratified it.
- **Oneida 1838 (WI):** the party names ("First Christian and Orchard") are not in the fetched treaty text.

## Gaps (not covered; next pass)
- **Not in the table:** Tuscarora (NY), Shinnecock, Poospatuck/Unkechaug, Montaukett, Mohegan, Mashantucket, Narragansett, Gay Head/Aquinnah, Chappaquiddick, Christiantown, Herring Pond, Hassanamisco, Conestoga Manor (PA, 1763 massacre), Choptank (MD), Chickahominy and Nansemond (VA), and Cherokee reserves in North Carolina that led to Qualla.
- **Treaty texts not checked:** 1807 Treaty of Detroit reserves; the Cherokee 1819 continuation of the 640-acre reserves; the Miami 1826, 1834 and 1838 reductions; Apalachicola cessions of 1832–33.
- **New York state treaties:** no reserve boundary text found online. It is in Hough 1861, *Proceedings of the Commissioners of Indian Affairs*; NARA RG 75 and the New York State Archives also hold the originals.
- **Not matched to Royce areas.** The Royce schedule lists most reserve cessions (e.g. 1831 Ohio, 1837 Saginaw); match `CESSNUM` in S3 before drawing anything.
- **Individual reserves (Cherokee, Creek, Choctaw, Chickasaw, Fort Meigs, Miami):** locations are in ASP *Public Lands* and the GLO tract books, not in the treaties.

## Sources (Chicago author-date)
- Apess, William. 1835. *Indian Nullification of the Unconstitutional Laws of Massachusetts Relative to the Marshpee Tribe*. Boston: Jonathan Howe. https://www.gutenberg.org/ebooks/12486.
- Cayuga Nation. n.d. "History and Culture." https://cayuganation-nsn.gov/about/history-and-culture/.
- Connecticut Department of Energy and Environmental Protection. n.d. "Tribal Affairs." https://portal.ct.gov/deep/environmental-justice/tribal-affairs.
- Dartmouth College. n.d. "Edgepillock (Brotherton)." *The Occom Circle*. https://collections.dartmouth.edu/occom/html/ctx/placeography/place0551.ocp.html.
- Encyclopedia Virginia. n.d. "Articles of Peace (1677)." https://encyclopediavirginia.org/primary-documents/articles-of-peace-1677/.
- Finger Lakes Times. n.d. "Looking Back: A Quick Primer on Treaties with the Cayugas." https://www.fltimes.com/lifestyle/looking-back-a-quick-primer-on-treaties-with-the-cayugas/article_ab0c4632-fcd1-52ae-9c90-9a4afe449358.html.
- Kappler, Charles J., comp. 1904. *Indian Affairs: Laws and Treaties*. Vol. 2, *Treaties*. Washington, DC: Government Printing Office. Pages 34, 107, 140, 145, 171, 185, 198, 203, 283, 310, 319, 325, 327, 331, 335, 341, 367, 377, 418, 482, 502, 517, 531, 534, 1027. https://treaties.okstate.edu/.
- Maine. 1843. "Indian Treaties." In *Acts and Resolves Passed by the Twenty-Third Legislature of the State of Maine*, 253–66. Augusta: Wm. R. Smith. https://lldc.mainelegislature.org/Open/Laws/1843/Laws1843_s0253-0266_IndianTreaties.pdf.
- Nerney, Sarah. 2011. "The Gingaskins of Virginia." *The UncommonWealth* (Library of Virginia), November 16. https://uncommonwealth.lva.virginia.gov/blog/2011/11/16/the-gingaskins-of-virginia.
- North Carolina. 1890. "Journal of the Congress of the Four Southern Governors ... at Augusta, 1763." In *Colonial Records of North Carolina*, edited by William L. Saunders, 11:156–207. https://docsouth.unc.edu/csr/index.php/document/csr11-0084.
- Onondaga Nation. 2006. "Three Fraudulent Treaties Took 99% of Onondaga Land." November 20. https://onondaganation.org/news/2006/three-fraudulent-treaties-took-99-of-onondaga-land.
- Passamaquoddy Tribe. n.d. "Treaty between the Passamaquoddy Tribe & the Commonwealth of Massachusetts 1794." https://www.passamaquoddy.com/?p=1422.
- Pennsylvania State Historic Preservation Office. n.d. "Cornplanter Grant." https://pahistoricpreservation.com/cornplanter-grant-native-american/.
- Reynolds, Nicolas. 2009. "The New York Indians: The Oneida Nation, the Stockbridge-Munsee and the Brothertown Indians." *Weekly Historical Note* 1 (20). Oneida Nation. https://oneida-nsn.gov/wp-content/uploads/2016/04/Vol.-1-No.-20-The-Stockbridge-and-Brothertown.pdf.
- South Carolina Encyclopedia. n.d. "Catawba." https://www.scencyclopedia.org/sce/?p=3042.
- Stevens, Jennifer M. n.d. *Oneida Land Claims Time Line of New York State*. Oneida Cultural Heritage Department. https://oneida-nsn.gov/wp-content/uploads/2016/04/ONEIDA-LAND-CLAIMS-TIME-LINE-OF-NEW-YORK-STATE-9.13.pdf.
- Stockbridge-Munsee Community. n.d. "Tribal History Timeline." https://mohican-nsn.gov/tribal-history-timeline/.
- Virginia Places. n.d. "Native American Reservations in Virginia" and "Nottoway Reservation: The Circle and Square." https://virginiaplaces.org/nativeamerican/reservation.html; https://virginiaplaces.org/nativeamerican/reservationnotto.html.
- Wikipedia. n.d. "Indian Mills, New Jersey"; "Potawatomi Trail of Death"; "Schaghticoke people." Used only to locate leads; confirm before citing.
