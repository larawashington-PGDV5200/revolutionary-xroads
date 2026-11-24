// L4 Migration (the main layer): every documented move, state → state, plus one veteran's path.
import { FlowmapLayer } from '@flowmap.gl/layers';
import { PathLayer, ScatterplotLayer } from '@deck.gl/layers';
import { COLORS } from '../config.js';
import { ___ } from '../blank.js';

const FLOWS_READY = true;  // ✏️ flip once b1–b2 are filled
const PATH_READY = true;   // ✏️ flip once b3 is filled

export function migrationLayers(data, state, common) {
  const layers = [];

  // ✏️ b1 Filter flows by Pension Act cohort (the dropdown sets state.cohort).
  //   'all' → every flow; otherwise keep flows whose act_cohort === state.cohort.
  //   Note: the same from → to pair appears once per cohort. FlowmapLayer adds them up for you.
  const flows = state.cohort === 'all' ? data.flows : data.flows.filter((f) => f.act_cohort === state.cohort);

  // ✏️ b2 FlowmapLayer draws width ∝ people and circles ∝ people leaving/arriving.
  //   It needs two lists, joined by id:
  //     locations: data.locations  → { id, lat, lon }
  //     flows:     your filtered list → { from, to, people }
  //   and accessors that tell it which field is which:
  //     getLocationId:  loc => loc.id      getLocationLat / getLocationLon: loc => loc.lat / loc.lon
  //     getFlowOriginId: f => f.from       getFlowDestId: f => f.to
  //     getFlowMagnitude: f => f.people
  //   darkMode: false (we're on white). clusteringEnabled: false (states are few enough).
  if (FLOWS_READY) {
    layers.push(new FlowmapLayer({
      id: 'L4-flows',
      data: { locations: data.locations, flows },
      getLocationId: loc => loc.id,
      getLocationLat: loc => loc.lat,
      getLocationLon: loc => loc.lon,
      getFlowOriginId: f => f.from,
      getFlowDestId: f => f.to,
      getFlowMagnitude: f => f.people,
      darkMode: false,
      clusteringEnabled: false,
      colorScheme: 'Teal',
      pickable: true,
      ...common,
    }));
  }

  // ✏️ b3 One veteran's path: state.person (set in main.js) = { name, stops: [{ position, kind, date }] }.
  //   PathLayer draws one line per object, through getPath's list of [lon, lat].
  //     data: [state.person]                 getPath: p => p.stops.map(s => s.position)
  //   ScatterplotLayer draws one circle per stop:
  //     data: state.person.stops             getPosition: s => s.position
  //   radiusUnits: 'pixels' keeps the dots the same size at every zoom.
  if (PATH_READY && state.person) {
    layers.push(
      new PathLayer({
        id: 'L4-path',
        data: [state.person],
        getPath: p => p.stops.map(s => s.position),
        getColor: COLORS.path,
        getWidth: 3,
        widthUnits: 'pixels',
        ...common,
      }),
      new ScatterplotLayer({
        id: 'L4-stops',
        data: state.person.stops,
        getPosition: s => s.position,
        getFillColor: COLORS.path,
        getRadius: 5,
        radiusUnits: 'pixels',
        pickable: true,
        ...common,
      }),
    );
  }

  return layers;
}
