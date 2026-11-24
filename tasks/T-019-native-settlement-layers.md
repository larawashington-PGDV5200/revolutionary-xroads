# T-019 Viz: Native layers as one colour family; settlement and routes layer (C5, C6)
**Approved by Lara 2026-11-24 via master plan T-012** · brief B-034 (part a) / later brief (part b) · agent: coder · after T-018

**Part a (now):**
1. Layer 2 title "Native land not yet ceded", subtitle "Shaded until the year a treaty ceded it to the United States (Royce 1899, from 1784)." Layer 5 title "Native land ceded".
2. Colours (D-028): held = madder `#9E3B2E` solid; ceded = same hue, hatched or outline only (no grey); reserves `#6B2219` dots; removal routes in the same family.
3. Destinations (`assigned_year` set): hidden before `assigned_year`; from then drawn as held with "assigned to <nation_assigned> (removal destination), <assigned_treaty>" in the tooltip. Null `cession_year` = never ceded (never in L5). Unverified rows get "date unverified" in the tooltip.
4. `before_1784` object: if geometry is present, draw a hatched zone whose hatching varies with an `uncertainty` property (sparser/fainter = less certain); its note reads from the feature. If geometry is null, show only the page note (R10 §3 wording).
5. Remove steamboat styling from L6.
**Part b (after T-016 settlements):** merge settlements into L6 "Settlement and routes": post offices as small dots appearing in `year_established` (gone after `year_discontinued`), urban places ≥ 2,500 larger, sized by population for the decade; railroads, canals, roads above.

**Files:** `web/src/layers/L2-*.js`, `L5-*.js`, `L6-*.js`, `config.js`, `data.js`, `ui.js`.

**Done when:** build passes; screenshots of 1800, 1830, 1840.

**Why an agent:** D-024.

**Update (orchestrator, 2026-11-24):** run part a and part b together (`web/data/settlements.json` is ready, T-016 Result). T-022 is rewriting `before_1784` in `native_land.topojson` in parallel: read `uncertainty` (low/medium/high) and `note` from the features; if the object still has null geometry when you test, test the null path and code the hatched path against the documented properties.
Also, small L4 fixes from T-018 review:
6. Flows always take their **origin** colour, also when a hub is isolated, so inbound flows show where people came from (resolves the T-018 question).
7. Replace the fixed 25-people default with "the largest 40 flows of the decade shown" (the select still offers fixed thresholds), so early decades aren't empty.
8. Remove `@flowmap.gl/*` from package.json if nothing imports it.

**Result (coder, 2026-11-24):** parts a and b and updates 6–8, in `web/src/config.js`, `data.js`, `ui.js`, `layers/L2-not-ceded.js`, `L4-migration.js`, `L5-reservations.js`, `L6-infrastructure.js`. Outside the list, kept small: `main.js` (default threshold, and tooltips handed to each layer), `style.css` (legend rules; the panel scrolls once it is taller than the window) and `package.json`/`package-lock.json` (step 8). `npm run build` passes. Checked in headless Chrome (1440×900) against the Vite dev server. Screenshots are in the coder's scratch folder (`t019/`).
- **Titles:** layer 2 is "Native land not yet ceded", layer 5 "Native land ceded", layer 6 "Settlement and routes". The L2 subtitle opens the new "02 · 05 Native land" legend.
- **Colours (D-028):** held = madder `#9E3B2E`, solid at alpha 150 with a 0.5 px line. Ceded = the same madder as a 45° hatch (deck.gl `FillStyleExtension`, procedural, sized in px) with a faint outline, no grey. Reserves are `#6B2219` dots with a white ring. The Trail of Tears is `#6B2219` at 2 px and is now hoverable. The NY state-cession points are `#6B2219` too.
- **Destinations:** a polygon is held when `cession_year` is null or later than the year, **and** `assigned_year` is null or not later than the year. It is ceded only when `cession_year` is set and not later than the year, so 144 and 248 never reach L5. Checked over every decade: no polygon is both held and ceded. Destinations drawn as held: 0 up to 1820, 8 in 1830, 34 in 1840. The tooltip reads "Assigned to <nation_assigned> (removal destination), <assigned_treaty>, <assigned_date>". If `assigned_verified` ≠ y it adds "date unverified", then the cession date (or "No cession to the United States in the USFS data") and the Royce area. Tested on 265 (verified) and Delaware 316 (unverified). The 5 rows with no `assigned_date` keep their USFS dates and say "date not found".
- **Before 1784:** drawn on L5 as a 135° hatch, so it reads apart from ceded (45°). Hatching by `uncertainty`: low = 1.5 px lines every 3 px at alpha 210; medium = 1 px every 6 px at 150; high = 1 px every 11 px at 95. A missing or unknown value draws as high. Nothing is special-cased by place; the hatch reads each feature. The tooltip shows `label`, `note` and the uncertainty. The legend shows the three hatches, the R10 §3 page text and the features' `page_note`. With no zone geometry, only the page note shows: its first sentence drops "in this hatched zone" ("Land was taken from…"). T-022 filled the zone during this task, so the real geometry was tested (18 pieces); the null path is coded but was only tested on the earlier file.
- **L6:** the steamboat colour and width are gone. Post offices are 1.1 px ink dots from `year_established` through `year_discontinued`, gone after it. Urban places are ink circles with a white ring, radius 2.5 px + 0.025 × √population of that census. They show only in a census that lists them; Raleigh (1820 only) drops out after 1820. The 10 places carried into 1840 use their 1830 figure, and the tooltip says so. Railroads, canals and roads are drawn above the dots. A legend shows the counts for the decade.
- **Dots drawn per decade (post offices / urban):** 1770: 3 / 0; 1780: 60 / 0; 1790: 101 / 24; 1800: 821 / 33; 1810: 1,843 / 46; 1820: 3,659 / 61; 1830: 7,166 / 90; 1840: 11,704 / 110. This matches T-016's open-at-each-census counts.
- **6:** every flow takes its origin's colour, also when a hub is isolated.
- **7:** by default the page shows "the largest 40 flows" of the decade, so every decade now has flows (the 1770s show 40 of 98). The select still offers 25+, 10+, 5+ and 1+. The note counts flows inside the extent, so totals can be up to 4 lower than in T-018 (the CA/OR flows).
- **8:** nothing imported `@flowmap.gl/*`, so I removed it with `npm uninstall`.
- **Tested:** screenshots of 1800, 1830 and 1840, a hovered destination (265, verified) and an unverified one (316), a close-up of L5 in 1800 (zone by uncertainty and ceded hatch) with a zone piece's note, and an urban hover (Bangor, 1840 census). Console: only the favicon 404.
- **Left:** overlapping Royce polygons stack their alpha in L2 (darker patches), as before. At 2,500 km per plane, the hatch is fine-grained in the overview and reads best zoomed in. The panel now scrolls at 900 px height. Layout and type wait for Lara's styling pass.
