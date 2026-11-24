# T-012 Refinement pass 1: master plan (orchestrator)
**Status: awaiting Lara's approval.** Once approved, the orchestrator (main session) writes and dispatches every
sub-brief below without asking again, logs each verbatim in `log/PROMPTS.md`, and creates its `tasks/T-0NN` file.
Lara reviews the result, not each brief. Lara commits and pushes; agents never do.

**Before work starts:** Lara commits the current uncommitted `web/` changes, so agents build on a clean tree
(`coached viz finished` is the last commit; 16 files are modified since).

## Decisions this plan makes (scribe records them)
- **D-024 Agents now write the viz code** for this pass (Lara, 2026-11-24). Exception to "Lara writes the viz code".
- **D-025 Migration joins the decade timeline** (reverses D-016). One slider for every layer. A leg's decade =
  its dated "removed to" year if stated, else the application year. Spikes after 1818 and 1832 are accepted and
  explained by Act markers on the timeline (1818, 1820, 1832, 1836, 1838). The cohort dropdown goes.
- **D-026 Settlement layer returns** (reverses D-019) and **replaces infrastructure as its own layer**: settlements
  and transport merge into one top layer, "Settlement and routes".
- **D-027 Rivers leave layer 6.** Steamboat rivers are dropped; railroads, canals and named roads/trade routes stay.
  (Assumption: canals count as trade routes. Tell me if they should go too.) Layer 1 keeps its rivers and coast.
- **D-028 Native layers become one colour family.** Layer 2 = land still held (solid). Layer 5 = the same polygons
  once ceded (same hue, hatched/outline, no grey), reserves as dark dots of that hue.

## Answers to your questions
| Question | Answer |
|---|---|
| Is migration by state? | Yes. Flows are state → state (D-017); counties exist in `nodes.json` but are not drawn. |
| How are hubs placed? Are they cities? | No. Each hub sits at the state's centroid from `places` (mean of county centroids). Not a city. Fix below: place each hub at the people-weighted centre of that state's pension residences, and show its county dots on hover. |
| Fewer reservations in 1840 than 1830? | Real, not a bug: 37 active in 1830, 27 in 1840. 17 reserves ended 1831–40 under removal (Ohio reserves 1831, Buffalo Creek 1838, Miami 1840 …). But R4 is a selection, and it leaves out the western lands nations were removed **to** (Indian Territory). So the layer shows loss but not relocation. Fix below (historian + researcher). |
| No data at all for the east? | Royce maps only federal cessions from 1784. Colonial and state-era loss east of the 1763/1768 lines isn't in it, and New England has nothing. Fix below: draw that zone as "taken before 1784 (colonial and state cessions, not mapped by Royce)", bounded by the lines we already have, plus a researcher check for any reusable colonial-cession dataset. |
| White gaps in the grey relief | 40 % of `relief.png` is transparent: ocean and Canada, but also land cells with ETOPO ≤ 0 (coastal lowlands, delta) and the "land if ≥ 2 of 4" downsample rule. Fix: fill from a land mask (Natural Earth land), not elevation. |
| Weird borders on the coast | Newberry borders are legal lines that run into bays, sounds and lakes, so they don't match Natural Earth's coast. Fix: clip borders to the same land mask. |

## Workstreams
Order: A and B (data) run in parallel; C (viz) starts after A1 and B1 land; D verifies; E logs.

### A. Data (coder, notebooks; Lara reviews counts)
- **A1 · V00 re-export (T-013):** add `decade` per leg (rule in D-025) to `flows.json` and `nodes.json`; add a
  people-weighted `hub_lat/hub_lon` per state; keep county nodes. Report counts per decade.
- **A2 · E01 base fix (T-014):** land mask from Natural Earth land; fill relief holes; clip borders to land; earth-toned
  hillshade (ramp below). Drop nothing else.
- **A3 · D01 trim (T-015):** drop steamboat rivers from `infrastructure.topojson`; apply the PLAN §6 MVP filters in data
  (rail year rule, R7 canal duplicates).
- **A4 · S01 settlements (T-016, after B2):** new notebook → `settlements.json` (place, lat, lon, year established,
  year discontinued, kind, source), clipped to the extent, every row dated.

### B. Research (researcher / historian; findings to `research/`)
- **B1 · Settlement source (researcher):** compare (a) Blevins & Helbock "US Post Offices" (Harvard Dataverse:
  establishment/discontinuance dates, geocoded) (b) Census urban places ≥ 2,500 by decade 1790–1840 (Gibson 1998)
  (c) the UN Degree of Urbanisation. My recommendation: (a) for "settled" points plus (b) for a "city" tier. The UN
  rule (≥ 50,000 people at ≥ 1,500/km²) is a modern grid method and would leave almost no 1790–1840 cities, so we
  use the period Census threshold and say so on the page. Licence, coverage and file size for each.
- **B2 · Native gaps (historian + researcher):** (1) a name for layer 2 that is accurate: Royce shows land not yet
  ceded, not original territory. Candidates: "Native land before cession", "Native homelands, not yet ceded".
  (2) Indian Territory removal destinations 1830–40: source and dates. (3) Any reusable colonial-cession data for
  the east; if none, wording for the "before 1784" zone.

### C. Viz (coder; frontend-design guidance applied; tester checks)
- **C1 · Camera (T-017):** horizontal drag = rotate bearing; vertical drag = pitch (range ~20°–85°, no longer locked
  at 60°). Default gap ≈ 2.5× today (`GAP_M` 120 km → ~300 km), camera framed so all six layers fit.
- **C2 · Stack guides (T-017):** a faint perimeter outline on each layer plane; a number beside each plane
  (01–06, it is a real bottom-to-top sequence); dotted vertical guides at the four corners linking the planes.
  Dots are a fixed count per gap, so they spread apart as the stack explodes and close up as it collapses.
- **C3 · Focus on hover (T-017):** hover a layer (its plane, its features, or its row in the side list) → that layer at
  full strength, the others fade to ~15 %. Leaving restores all.
- **C4 · Migration (T-018):**
  - Noise: draw only flows above a minimum (start at ≥ 25 people, a slider can lower it); hubs at the weighted centre.
  - Hover a hub → only its in and out flows, others hidden; tooltip: place name, people out, people in, top 3
    destinations and origins for the decade shown.
  - Colour: the 8 biggest origin hubs (by people out) each get their own hue; the rest share a neutral. Flows take
    the origin hub's colour. Red family is reserved for the Native layers. The palette is checked with the dataviz
    skill's validator.
  - Direction: drop the arrowheads. Flows taper from wide at the origin to thin at the destination, with a slow
    particle drift along each flow (vector-field style, flowmap.gl's animation mode). Particles stop with reduced motion.
  - Per-person path stays as the click detail.
- **C5 · Native layers (T-019):** apply D-028; rename layer 2 from B2; add the "before 1784" zone; add Indian
  Territory destinations if B2 finds a source; removal routes keep the same hue family.
- **C6 · Settlement and routes layer (T-019, after A4):** settlements as points that appear in the year they were
  established (cities larger), railroads, canals and roads on top. Replaces the current L6.
- **C7 · One timeline (T-020):** a single decade slider 1770–1840 for all layers; Pension Act ticks labelled on the
  track; the cohort dropdown is removed; a small count of moves per decade drawn above the track so the 1818 and
  1832 spikes read against their Acts.
- **C8 · Base colour (T-014 output used here):** relief in earth tones: loam `#CDBB9A` lit, umber `#5E4A33` shade,
  water slate `#8FA3A8`. Native family: madder `#9E3B2E` (held), same hue hatched (ceded), `#6B2219` (reserves).
  Full styling (type, layout panel, legend in the spirit of your reference) waits for your styling pass.

### D. Verify (tester)
Run `npm run build`, open the page, check each "Done when" in T-013–T-020 with screenshots; failures go back to
the coder (up to 3 loops), then to Lara.

### E. End of session (scribe)
D-024 to D-028, the sub-briefs, and PLAN.md updates (§3 Time, layer table, Sources).

## Not in this pass
Typography and page layout (your styling pass), land-ad changes, $/acre, the data fixes listed in PLAN §6.

## Done when
The deployed page shows: earth-toned gap-free relief with clean coastal borders; six outlined, numbered layers
with dotted guides; drag rotates and tilts; hover focuses one layer; migration on the shared decade timeline with
Act labels, coloured hubs, hover isolation, tooltips and tapered animated flows; one red family across the two
Native layers with the east explained; a dated settlement-and-routes layer with no rivers.
