# web/: the deck.gl page

```sh
cd web
npm install
npm run dev
npm run build
```

| File | Does |
|---|---|
| `src/main.js` | state → layers → `deck.setProps`; tooltip, hover/click/Esc, particle redraw loop |
| `src/config.js` | camera, stack order, gap, years, Pension Acts, colours, hub palette, flow settings |
| `src/data.js` | loads `data/`, TopoJSON → GeoJSON, place coords, `loadPerson` |
| `src/stack.js` | explode/collapse via model matrix |
| `src/frames.js` | plane outlines, plane numbers 01–06, dotted corner guides |
| `src/focus.js` | hover focus: one layer full strength, the others faded |
| `src/ui.js` | toggles, explode button, decade slider with Act ticks and legs strip, migration legend and threshold |
| `src/layers/L1…L6` | one file per stack level |

`data/` is written by the `rx-pipeline` notebooks. Deploy: `.github/workflows/pages.yml` (Settings → Pages → Source: GitHub Actions).
