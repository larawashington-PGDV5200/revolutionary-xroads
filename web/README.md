# web/: the deck.gl page

```sh
cd web
npm install
npm run dev
npm run build
```

| File | Does |
|---|---|
| `src/main.js` | state → layers → `deck.setProps`; tooltip |
| `src/config.js` | camera, stack order, gap, years, colours |
| `src/data.js` | loads `data/`, TopoJSON → GeoJSON, place coords, `loadPerson` |
| `src/stack.js` | explode/collapse via model matrix |
| `src/ui.js` | toggles, explode button, cohort menu, year slider |
| `src/layers/L1…L6` | one file per stack level |

`data/` is written by the `rx-pipeline` notebooks. Deploy: `.github/workflows/pages.yml` (Settings → Pages → Source: GitHub Actions).
