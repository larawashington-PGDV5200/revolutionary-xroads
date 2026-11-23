# R8. State ratings of the Spanish dollar, 1770–1810 (B-021)

Purpose: convert land-ad prices in pounds, shillings and pence to US dollars per acre (PLAN §3a).
Table: `research/currency_rates_R8.csv`. It replaces the R7 currency table, which this checks.

## Topline
- **Confirmed** (read in sources from c. 1775 and 1797): New England and Virginia 6s; New York and North Carolina 8s; New Jersey, Pennsylvania, Delaware and Maryland 7s 6d; sterling 4s 6d. These match R7 and PLAN §3a.
- **New: South Carolina and Georgia were 4s 8d after the war** ($4.2857 per £). Pike (1797) and Parker (1822) both group "South Carolina and Georgia" at 4s 8d. South Carolina was 32s 6d before the war ($0.6154 per £).
- **Georgia from 1786** is 4s 8d: the 1786 paper-money act declared "four shillings and eight pence ... equal to one dollar" (Coleman 1958, ch. 13). Georgia before 1786 is still unverified.
- **Tennessee** stays unverified. R7 gave it North Carolina's 8s, but Daboll (1817) may group it with Virginia at 6s (the OCR is scrambled).
- McCusker (1978) itself was **not opened**, again. It is cited only through Michener (2003).

## Method
1. **Rating.** $ per £ = 20 ÷ shillings per dollar. These are par ratings set by law or custom, not market rates. Rates did not change inside a state between 1783 and 1810, except South Carolina in 1783 and Georgia (by 1786).
2. **How I checked it.** Pike (1797) gives no shillings-per-dollar list. Instead it gives rules for converting each currency into New England money. I worked the rating back from each rule:
   - New Jersey group: "deduct one fifth" → 7.5 × 4/5 = 6.
   - New York group: "deduct one fourth" → 8 × 3/4 = 6.
   - South Carolina and Georgia: "multiply by 9, and divide by 7" → 4.667 × 9/7 = 6.
   - English money: "add one third" → 4.5 × 4/3 = 6.
   - Canada and Nova Scotia: "add one fifth" → 5 × 6/5 = 6.

   Pike's coin table has a "Dollar" row with 6s, 8s, 7s 6d and 4s 8d. Parker (1822) states the same four ratings directly.
3. **Which state to use.** Use the paper's state, unless the ad names a currency.
   - "Sterling" in a South Carolina or Georgia ad after 1783 probably means the local 4s 8d money. Butler describes the 1783 rating as "four shillings and eight pence sterling" (Butler n.d.). Convert it at 4.2857, not at British sterling's 4.4444, and flag it `sc_ga_sterling`. Pre-war South Carolina ads that say "sterling" are true sterling (4.4444). Ads that say "currency" are 32s 6d (0.6154).
   - "Proclamation money" is 6s (3.3333) wherever it appears, including North Carolina.
   - Kentucky before 1792 is Virginia. Maine is Massachusetts. Tennessee before 1796 is North Carolina.
4. **1776–81: flag, don't convert.** Continental and state paper fell fast. On 18 March 1780 Congress made silver receivable "at the rate of one Spanish milled dollar in lieu of 40 dollars of the bills now in circulation" (US Continental Congress 1910, 264). The official depreciation tables could convert these prices, but they differ by state and month. That is out of scope for v1.
5. **1785–89: flag only where state paper is documented.**
   - Georgia: £30,000 in bills issued from 1786. The assembly admitted 33⅓% depreciation by January 1789 (Coleman 1958).
   - North Carolina: state paper printed in 1783 and 1785 (Fulghum n.d.). The rate is not known.
   - Rhode Island: carried over from R7, not rechecked.
   - Other states: not checked.

   Convert ads that say "specie", "hard money" or "silver" at par, and set `price_flag = state_paper_period`.
6. **When dollars replaced pounds.**
   - **Federal accounts:** from the Coinage Act of 2 April 1792, §20. It covers "accounts in the public offices and all proceedings in the courts of the United States" (1 Stat. 246; the transcription read gives no page for §20). It did not bind state accounts or private trade.
   - **State accounts:** the years each state switched were **not found** in a source I could read. Claims like "until 1793" (Wikipedia) and "New York 1797" (a 1997 list-serv post) are unverified.
   - **In practice:** arithmetic books still taught pound-to-dollar conversion in 1817–22. The project's own T-004 profile finds dollars dominate priced ads from 1802. Use the data, ad by ad.

## Unverified and why
- **Georgia 1770–85:** sources disagree. A 5s rating appears only in an unsourced Wikipedia list and in a caption on a 1778 note ("forty Spanish dollars, i.e. ten Georgia pounds"). McCusker (1978, 227–28, via Michener) calls Georgia money "an exception". Jefferson's 1784 *Notes* reportedly give Georgia at 60 pence (5s), but Founders Online and the TCP text would not load, so it is not read.
- **South Carolina 1783 start date:** taken from a search excerpt of Butler (Act No. 1162, ratified 12 March 1783). The page itself returned 403. The 4s 8d rate is verified by 1797.
- **South Carolina 1776–82:** no wartime par was read.
- **Delaware and North Carolina 1770–82:** no colonial-era source was read. The 1797 rating is assumed to hold back to 1770 (marked partial).
- **Tennessee:** ambiguous OCR in Daboll (1817), and Pike (1797) does not name it.
- **Vermont:** named as New England only in Parker (1822). York money was also used (Michener, via R7).
- **Kentucky:** only Daboll (1817), which is after the period.
- **Pike page numbers** are approximate (OCR running heads).

## Change to PLAN §3a
1. Add a rate for SC and GA from 1783 (GA verified from 1786): **4s 8d = $4.2857 per £**. Add pre-war SC currency at 32s 6d = $0.6154.
2. In SC and GA ads after 1783, convert "sterling" at 4s 8d, not 4s 6d, and flag it.
3. Leave TN, pre-1786 GA and SC 1776–82 unconverted (flag `rate_unverified`).
4. Use the R8 CSV as the lookup by (state, year). Flag rows override rating rows.
5. Replace "Rates marked partial in R7 … need a historian check" with "see R8".

## Sources (Chicago author-date)
- Butler, Nic. n.d. "Cash and Credit in South Carolina before the U.S. Dollar." *Charleston Time Machine*. Charleston County Public Library. https://www.ccpl.org/charleston-time-machine/cash-and-credit-south-carolina-us-dollar. (403 error; read via search excerpt only.)
- Coleman, Kenneth. 1958. *The American Revolution in Georgia, 1763–1789*. Athens: University of Georgia Press. Reissued 2021, Georgia Open History Library, CC BY-NC-SA 4.0. Chap. 13, "Economic Affairs, 1782–1789." https://ugapress.manifoldapp.org/projects/the-american-revolution-in-georgia-1763-1789.
- Daboll, Nathan. 1817. *Daboll's Schoolmaster's Assistant, Improved and Enlarged*. Imprint not checked. https://archive.org/details/dabollsschoolmas00dabo. (OCR, "Reduction of Currencies", c. pp. 89–91.)
- Fulghum, Neil. n.d. "A Brief History of North Carolina Money." *Historic Moneys in the North Carolina Collection*. UNC-Chapel Hill Libraries. https://exhibits.lib.unc.edu/exhibits/show/historicmoneys/numishist.
- McCusker, John J. 1978. *Money and Exchange in Europe and America, 1600–1775: A Handbook*. Chapel Hill: University of North Carolina Press for the Institute of Early American History and Culture. (Not opened; cited via Michener.)
- Michener, Ron. 2003. "Money in the American Colonies." *EH.Net Encyclopedia*, edited by Robert Whaples. 8 June 2003, revised 13 January 2011. https://eh.net/encyclopedia/money-in-the-american-colonies/.
- [Parker, Benjamin, publisher.] 1822. *The Teachers Assistant or A System of Practical Arithmetic*. Richmond, VA: Benjamin Parker, 122–23. Transcribed in "The Value of Money in 1822," https://www.peele.info/history/vmoney.htm. (Original not seen.)
- Pike, Nicolas. 1797. *A New and Complete System of Arithmetic, Composed for the Use of the Citizens of the United States*. 2nd ed., revised by Ebenezer Adams. Worcester, MA: Isaiah Thomas. https://archive.org/details/newandcompletesy00pikerich. ("Reduction of Coins," c. pp. 111–121; coin table c. pp. 385–390.)
- US Congress. 1792. "An Act Establishing a Mint, and Regulating the Coins of the United States." 2 April 1792, ch. 16, §20. 1 Stat. 246. Transcription: https://constitution.org/1-Law/uslaw/coinage1792.txt.
- US Continental Congress. 1910. *Journals of the Continental Congress, 1774–1789*. Vol. 16, *1780, January 1–May 5*. Edited by Gaillard Hunt. Washington, DC: Government Printing Office. 18 March 1780, 264. https://archive.org/details/journalsofcontin16unit.
- Wikipedia. "Early American Currency." Accessed 23 November 2026. https://en.wikipedia.org/wiki/Early_American_currency. (Its state list is unsourced; used only as a lead.)
