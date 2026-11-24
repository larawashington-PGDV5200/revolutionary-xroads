import { FlowmapLayer } from '@flowmap.gl/layers';
import { PathLayer, ScatterplotLayer } from '@deck.gl/layers';
import { COLORS } from '../config.js';

export function migrationLayers(data, state, common) {
  const flows = state.cohort === 'all' ? data.flows : data.flows.filter((f) => f.act_cohort === state.cohort);

  const layers = [
    new FlowmapLayer({
      id: 'L4-flows',
      data: { locations: data.locations, flows },
      getLocationId: (loc) => loc.id,
      getLocationLat: (loc) => loc.lat,
      getLocationLon: (loc) => loc.lon,
      getFlowOriginId: (f) => f.from,
      getFlowDestId: (f) => f.to,
      getFlowMagnitude: (f) => f.people,
      darkMode: false,
      clusteringEnabled: false,
      colorScheme: 'Teal',
      pickable: true,
      ...common,
    }),
  ];

  if (state.person) {
    layers.push(
      new PathLayer({
        id: 'L4-path',
        data: [state.person],
        getPath: (p) => p.stops.map((s) => s.position),
        getColor: COLORS.path,
        getWidth: 3,
        widthUnits: 'pixels',
        ...common,
      }),
      new ScatterplotLayer({
        id: 'L4-stops',
        data: state.person.stops,
        getPosition: (s) => s.position,
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
