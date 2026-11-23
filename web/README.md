# web/: the deck.gl page

```sh
cd web
npm install      # first time only
npm run dev      # http://localhost:5173, reloads on save
npm run build    # → dist/ (data/ copied in), what GitHub Pages serves
```

- `data/` is written by the `rx-pipeline` notebooks (T-005 to T-009). Don't edit it by hand. Fetch it as `fetch('data/…')`.
- `src/` is a skeleton with blanks (`___`, tagged ✏️ a1, b2 …) for Lara to fill in (Lara, 2026-11-23: exception to "Lara writes all viz code"). Search `✏️ a` for every blank in step a.

| File | Does | Blanks |
|---|---|---|
| `main.js` | state → layers → `deck.setProps`; tooltip; demo veteran | none |
| `config.js` | camera, stack order, gap, years, colours | a1 |
| `data.js` | loads `data/`, TopoJSON → GeoJSON, place coords, `loadPerson` | none |
| `stack.js` | lifts each layer with a model matrix; explode animation | d1 |
| `ui.js` | toggles, explode button, cohort menu, year slider | none |
| `layers/L1…L6` | one file per stack level; `READY` flags switch a layer on | a2–a3, b1–b3, c1–c9 |
- Packages: `@deck.gl/*` 9.4 (core, layers, geo-layers for `TerrainLayer`, extensions), `@flowmap.gl/layers` 9.5 (flows), `topojson-client` (TopoJSON → GeoJSON).
- Deploy: `.github/workflows/pages.yml` builds on push to `main`. One-time setup: Settings → Pages → Source: GitHub Actions.

## MVP build order
a. Scene: relief + borders · b. Flows · c. The other four layers · d. Explode/collapse · e. Slider
