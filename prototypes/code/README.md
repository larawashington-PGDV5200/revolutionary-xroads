# Low-fi prototypes (exploration sketches, 2026-10-27)

Open any `index.html` directly in a browser (double-click). Needs internet for D3 + the US basemap (CDN).

| Folder | Question | Format |
|---|---|---|
| `01-reprints/` | How far and how fast did reprinted news spread? | cumulative step lines + median curve; dot timeline over a pages-per-year denominator; per-story paper × day strip |
| `02-migration-land/` | Where did veterans serve vs. apply from; where was land being sold? | origin–destination flow map (states); top-flows table; small-multiple bars of land ads by destination |
| `03-weather/` | How does weather appear in print vs. in memory? | aligned small-multiple bars (print by month, memory by year); dumbbell of impact categories; strip plot of tone; passage reader |

Each folder has `data.js` (generated), `query.sql` (exact SQL that made it) and `SOURCES.md` (datasets, commits, method, limits).
`_tools/` = `fetch.py` (download parquet) + `run.py` (DuckDB runner: `python run.py query.sql table=data.js`).
