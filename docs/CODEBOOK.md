# Reason codebook (v0, keywords)

Used by `A06_reasons`. Keyword rules only: no model until the model gate (CLAUDE.md rule 3).
Precision figures come from the A07 hand labels (20 rows per code, 2026-11-22).

## Reason statements ("reasons for removing", pension transfers)
| code | means | keywords (word boundaries) | example |
|---|---|---|---|
| family | moved to live with or near children or relatives | child(ren), son(s), daughter(s), son-in-law, grand…, relatives, relations, kindred, friends, brother(s), sister(s), family, connexion(s) | "to reside with his son" |
| age_health | old age or infirmity | aged, old age, old, infirm…, feeble, blind, palsied, sick…, health, helpless, decrepit | "my wife & self are old & helpless" |
| poverty | could not support themselves | poor, poverty, support, maintain, destitute, means, indigent, livelihood, dependent | "unable to maintain himself without their aid" |
| land_work | land, a farm, cheaper living or work | land(s), farm, cheap, employment, business, work, trade, settle, prospects | "where lands are cheap & he wishes to get some land for a farm" |
| spouse | death, wish or health of a spouse | husband, wife, married, marriage | "his wife is dead and he wishes to reside with his son" |
| pension_admin | easier or cheaper to draw the pension there | agent, agency, certificate, draw his/her pension | "more convenient & less expensive to draw her pension there" |
| climate | climate or health of the place | climate, healthier, sickly | "the climate of illinois was too cold for his age" |

A statement can carry several codes.

## Declaration hits near a move (older, broader lists)
Codes `land`, `family`, `poverty`, `health`, `war_damage` and `conflict` are counted only when "removed / moved / emigrated" falls in the same 300-character snippet.

**A07 verdict:** most of these hits are service narrative ("the army moved…", "burnt by the British"), not reasons. Precision: health 20%, war_damage 10%, conflict 0%. Keep them out of the viz.
