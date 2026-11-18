# R5 — M804 pension file codes

What the code after "File" in each HF pension title means, how it's spelled, and whether to keep it for the migration study.

- **Meanings** come from historian brief B-009 (2026-11-10). It read NARS 1974, pp. 6–12. Each row is marked ✅ verified (with page) or ❓ unverified.
- **Counts** come from a grouping of all 78,745 titles in `data/interim/files_raw.parquet` (2026-11-17). They're rough: a few OCR typos land in the wrong group. A03's own counts differ a little (S 36,105 · W 25,599 · R 11,146 · BLWT 3,241).
- **Not Rev** is the number of files in the group whose title also says "Not Rev" or "Mot Rev". These get dropped whatever their code.

## Main series (95% of files)

| Code | Files | Not Rev | Spellings seen | Meaning | Act / series | Keep? | Status |
|---|---|---|---|---|---|---|---|
| **S** | 36,076 | 0 | `S.` 33,242 · `S` 2,824 (e.g. `S2904`, no space) · `S-` · `S .` · `S:` · `S;` | Survivor: the veteran applied himself. Holds his own declaration. | Mostly Acts of 1818 and 1832 | Keep | ✅ NARS 1974, 6–7 |
| **W** | 25,588 | 0 | `W.` 22,828 · `W` 2,752 · `W .` · `W-` | Widow applied. May also hold the veteran's own approved papers. | Acts of 1836, 1838, 1848 and later | Keep. Split the widow's residence from the veteran's. | ✅ NARS 1974, 7 |
| **R** | 11,145 | 1 | `R.` 10,167 · `R` 970 · `R-` · `R .` | Rejected. Only the *latest* claim was rejected, so an earlier approved claim may be inside. Applicant can be veteran, widow or heir. | Any | Keep. Check who the declarant is. | ✅ NARS 1974, 7 |
| **B. L. Wt.** (bounty-land warrant) | 3,146 | 11 | `B. L. Wt.` 1,850 · `B.L.Wt.` 1,045 · `B.L. Wt.` 79 · `B. L. Wt` 38 · `B.L.Wt` 28 · `B L Wt` 19 · `Bl.Wt.` / `Bl. Wt.` · `B.L.W.` · `BLWT` · OCR typos (`B. L. Ut.`, `B. L. Mt.`, `B. T. Wt.`) | Approved bounty-land warrant. The number reads warrant–acres–Act, e.g. `B. L. Wt. 2673-300` = warrant 2673, 300 acres. Warrants issued before Nov 1800 are cards marked "No Papers". | 16 Sep 1776 resolution; Acts of 1855 and 1856 | Medium. Post-1800 files may hold an application and residence. Pre-1800 cards hold none. | ✅ NARS 1974, 8–9 |
| **Wt.** | 19 | 1 | `Wt.` 17 · `Wt` 2 | Same as B. L. Wt. with the "B. L." left off. A third part like `-1855` or `-55` is the Act year. `-50` (1850 Act) is a guess. | As above | As above | ✅ pattern, NARS 1974, 8–9. ❓ `-50` |

## Rare codes (about 1%)

| Code | Files | Not Rev | Spellings seen | Meaning | Act / series | Keep? | Status |
|---|---|---|---|---|---|---|---|
| **B. L. Reg. / B. L. Rej.** | 106 | 3 | `B. L. Reg.` 19 · `B. L.` 11 · `B. L. Rej.` 9 · `B L Reg.` 8 · `B.L.` 7 · `Rej. B. L.` 5 · `Rej.` 5 · `B. L. R.` 3 · `Bl Reg.` · `Reg.` · `Bounty Land Register` · `Rejected B.L.` | Rejected bounty-land application. "Reg." = register (the number is the register entry); Reg. and Rej. label the same type. | Act of 3 Mar 1855 | Low–medium. Applied 1855 or later, so the residence is decades after any move. | ✅ NARS 1974, 9 |
| **Old War** / **O. W.** (Ind., Inv., Rej., Wid. Rej., Jno File) | 60 | 32 | `Old War Ind. File` 16 · `Old War Inv. File` 8 · `Old War Rej.` 3 · `O. W. Jno File` 2 · `O. W. Inv. Rej.` 2 · `O.W.J.F.` … | NARA's separate Old Wars series: Regular Army, Navy or Marine service 1783–1861. **Not Revolutionary War.** The sub-letters (Inv. = invalid, Wid. = widow, Rej. = rejected, Ind. = index?, J.F./Jno File) are standard usage but no source confirms them. | Old Wars series, NARA ID 1105306 (index T316) | Drop if "Not Rev". Others: check by hand, since one man can have both Rev and Old War claims. | ✅ series, NARA n.d. ❓ sub-letters |
| **Ctf.** / **Sur Ctf.** / **Wid Ctf.** | 26 | 0 | `Ctf.` 6 · `Ctf. No.` 5 · `Sur. Ctf` 2 · `Wid Ctf.` 2 · `S. Ctf.` · `Sur. Certificate No` … | Probably a pension certificate number, used where no S/W file number was given. Sur = survivor, Wid = widow. | Unknown | Keep for now. Check a sample by hand before treating Sur as S and Wid as W. | ❓ no source |
| **S. F.** | 25 | 0 | `S. F.` 18 · `S.F.` 6 · `S F` | Not covered by B-009. Maybe "survivor file". | Unknown | Keep for now, check by hand | ❓ not researched |
| **W. F.** | 8 | 0 | `W. F.` 4 · `W. File` 2 · `W.F.` 2 | Not covered by B-009. Maybe "widow file". | Unknown | Keep for now, check by hand | ❓ not researched |
| **N.A. Acc. No. 874 / 837** | 13 | 0 | `N. A. Acc. No.` 3 · `N.A.Acc. No.` 2 · `See N.A. Acc. No.` · `Acc. No.` … (`874050014` = 874 + file 050014) | A pointer to a separate RG 15 series (from the Adjutant General's Office, 1941) that isn't filmed in M804. Mostly heirs' claims; "Half Pay / Not Half Pay". 837 = heirs of Virginia State Navy officers. | Act of 5 Jul 1832 (Virginia half pay and arrears) | Low. Heirs' claims, probably no veteran declaration. Use as a single point at most. | ✅ NARS 1974, 10 |
| **Dis.** | 2 | 0 | `Dis.` 2 | Disability (invalid) pension from before 1800. Papers burned in the War Department fire of 8 Nov 1800, so the file holds cards only ("Dis. No Papers"). | Invalid-pension acts of 1789 and 1792 | No declaration. Residence is 1792–95 at best. | ✅ NARS 1974, 7–8 |
| **Old Act Navy Ind. Rej.** | 1 | 1 | — | Probably a Navy pension filed under the older navy acts (Navy Pension Fund, 1799–1800). | Possibly Navy Pension Fund | Drop (this one says "Not Rev") | ❓ no source |

## Titles with no code

| Group | Files | What they are | Keep? |
|---|---|---|---|
| No "File" in the title | 1,785 | 1,445 microfilm roll headers + NARA's introduction, 303 "selected / nonselected records" sheets, 36 single items (affidavits, a discharge certificate, frakturs, a diary) | Leave out roll headers and admin sheets (no applicant). Keep single items for reading. |
| `[BLANK]` / `[ILLEGIBLE]` number | 623 | Real claims whose number wasn't transcribed | Keep |
| "for <name>" or a surname where the code should be | 97 | Unnumbered titles, e.g. "File for Samuel Stocker". May be cross-reference or summary cards. | Keep only if the pages hold a declaration. ❓ |
| Leftover / unparsed | 25 | Typos and stray labels (`P.`, `Wid. Orig.`, `Red. &`, `W;`, `R:`) | Check by hand |

## Rules that follow
1. Treat spelling variants as one code. Don't use `\b` after the letter: `S2904` has no word boundary between S and 2. Use `(?![a-z])` instead.
2. Drop any title containing "Not Rev" or "Mot Rev" (54 files).
3. Files with no declaration (Dis., N.A. Acc., pre-1800 warrant cards, unnumbered titles) never feed the "applied-from" residence chain. Use them as single points, if at all.
4. When parsing, skip the "SELECTED / NONSELECTED RECORDS" divider sheets. Files over 10 pages were filmed with the key documents first; M805 has only those, M804 has everything (NARS 1974, 11–12).

## Sources
- National Archives and Records Service (NARS). 1974. *Pamphlet Describing M804: Revolutionary War Pension and Bounty-Land-Warrant Application Files.* Washington, DC: General Services Administration. https://www.archives.gov/files/research/microfilm/m804.pdf.
- National Archives and Records Administration (NARA). n.d. "Military Records: Pensions." Accessed November 10, 2026. https://www.archives.gov/research/military/army/pensions.
- Background only (secondary, agrees on S/W/R/BLWt/Dis.): Graves, Will. n.d. "Southern Campaigns Revolutionary War Pension Statements." https://revwarapps.org/Originals.html.
