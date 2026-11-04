# Revolutionary Crossroads

Where did Revolutionary War veterans go after the war, and on what/whose land did they settle?
A data-visualization project mapping veterans' moves west onto ceded Native land, 1763–1840, alongside the newspaper ads that sold that land and the treaties that opened it.

Parsons School of Design, MS Data Visualization: Major Studio 1.

## Data
- [Revolution Crossroads](https://huggingface.co/RevolutionCrossroads) (CC0): Revolutionary War pension files (NARA), Chronicling America newspapers 1770–1810 (LoC), Smithsonian collections, OCR and named-entity tables.
- Land cessions: USFS *Indian Land Cessions in the United States*, after Royce 1899 (CC BY 4.0).
- Historical boundaries: Newberry Library, *Atlas of Historical County Boundaries*.

Dataset notes and caveats: [`docs/DATA.md`](docs/DATA.md). Sources: [`research/`](research/).

## Status
Data pipeline in progress. Plan: [`docs/PLAN.md`](docs/PLAN.md).

## Prototypes (Oct 2026)
Early sketches to explore the data, built by Claude ([D-002](log/DECISIONS.md)).

| How reprinted news spread | Where veterans served vs. applied from, and land for sale | Weather in print vs. in memory |
|---|---|---|
| ![Reprints](/prototypes/01a-reprints-overview%20copy.png) | ![Migration and land](/prototypes/02-migration-all-layers-min200.png) | ![Weather](/prototypes/03weather-overview.png) |

Code: [`prototypes/code/`](prototypes/code/).

## AI use
Built with Claude Code and Claude Opus 5.5. Details are in [`AI-USE.md`](AI-USE.md): agents, approval gates and the models used.
Decisions and why: [`log/DECISIONS.md`](log/DECISIONS.md) · Prompts and agent briefs: [`log/PROMPTS.md`](log/PROMPTS.md) · Decision map: [`diagram/decisions.mmd`](diagram/decisions.mmd)

## Structure
```
docs/        plan, data notes
research/    sourced research (treaties, GIS layers)
log/         decisions, prompts, agent briefs
diagram/     decision input/output map
prototypes/  early sketches
.claude/     agent and hook config
data/        local only (git-ignored)
```