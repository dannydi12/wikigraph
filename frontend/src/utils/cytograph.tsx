import cytoscape from "cytoscape";
// import cytoscapeSpread from 'cytoscape-spread';
// import cytoscapeCola from 'cytoscape-cola';
import d3Force from "cytoscape-d3-force";
import { Node } from "./graph";

// const data = [
//   {
//     link_id: 123,
//     from_title_id: "my article",
//     to_title_id: "my article2",
//     to_title: "my article2",
//   },
//   {
//     link_id: 1234,
//     from_title_id: "my article2",
//     to_title_id: "my article3",
//     to_title: "my article3",
//   },
//   {
//     link_id: 1235,
//     from_title_id: "my article3",
//     to_title_id: "my article",
//     to_title: "my article",
//   },
// ];

export const graph = (ref: HTMLDivElement, data: Node[]) => {
  const links = data.map((d) => ({
    id: d.from_title_id + d.to_title_id,
    source: d.from_title_id,
    target: d.to_title_id,
  }));
  const nodes = data.map((d) => ({
    id: d.to_title_id,
    ...d,
  }));

  const linkData = links.map((link) => ({ data: { ...link } }));
  const nodeData = nodes.map((node) => ({ data: { ...node } }));
  const elements = [...nodeData, ...linkData];

  console.log(elements);

  cytoscape.use(d3Force);

  const cy = cytoscape({
    container: ref,
    wheelSensitivity: 0.2,

    elements: [],
    style: [
      /* ... */
    ],
    layout: {
      name: "d3-force",
      fixedAfterDragging: false,
      linkId: function id(d) {
        return d.id;
      },
      linkDistance: 80,
      manyBodyStrength: -300,
      ready: function () {},
      stop: function () {},
      tick: function (progress) {
        console.log("progress - ", progress);
      },
      randomize: true,
      infinite: true,
      animate: true, // whether to show the layout as it's running; special 'end' value makes the layout animate like a discrete layout
      // maxIterations: 0, // max iterations before the layout will bail out
      // maxSimulationTime: 0, // max length in ms to run the layout
      ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
      fit: false, // on every layout reposition of nodes, fit the viewport
      padding: 30, // padding around the simulation
      boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      /**d3-force API**/
      // alpha: 1, // sets the current alpha to the specified number in the range [0,1]
      // alphaMin: 0.001, // sets the minimum alpha to the specified number in the range [0,1]
      // alphaDecay: 1 - Math.pow(0.001, 1 / 300), // sets the alpha decay rate to the specified number in the range [0,1]
      // alphaTarget: 0, // sets the current target alpha to the specified number in the range [0,1]
      // velocityDecay: 0.4, // sets the velocity decay factor to the specified number in the range [0,1]
      // collideRadius: 1, // sets the radius accessor to the specified number or function
      // collideStrength: 0.7, // sets the force strength to the specified number in the range [0,1]
      // collideIterations: 1, // sets the number of iterations per application to the specified number
      // linkStrength: function strength(link) {
      //   return 1 / Math.min(count(link.source), count(link.target));
      // }, // sets the strength accessor to the specified number or function
      linkStrength: function strength() {
        return 1;
      },
      // linkIterations: 1, // sets the number of iterations per application to the specified number
      // manyBodyTheta: 0.9, // sets the Barnes–Hut approximation criterion to the specified number
      // manyBodyDistanceMin: 1, // sets the minimum distance between nodes over which this force is considered
      // manyBodyDistanceMax: Infinity, // sets the maximum distance between nodes over which this force is considered
      // xStrength: 0.1, // sets the strength accessor to the specified number or function
      // xX: 0, // sets the x-coordinate accessor to the specified number or function
      // yStrength: 0.1, // sets the strength accessor to the specified number or function
      // yY: 0, // sets the y-coordinate accessor to the specified number or function
      // radialStrength: 0.1, // sets the strength accessor to the specified number or function
      // radialRadius: 10, // sets the circle radius to the specified number or function
      // radialX: 0, // sets the x-coordinate of the circle center to the specified number
      // radialY: 0, // sets the y-coordinate of the circle center to the specified number
      // layout event callbacks
    },
    // initial viewport state:
    zoom: 1,
    pan: { x: 0, y: 0 },

    // interaction options:
    // minZoom: 1e-50,
    // maxZoom: 1e50,
    zoomingEnabled: true,
    userZoomingEnabled: true,
    panningEnabled: true,
    userPanningEnabled: true,
    boxSelectionEnabled: true,
    selectionType: "single",
    touchTapThreshold: 8,
    desktopTapThreshold: 4,
    autolock: false,
    autoungrabify: false,
    autounselectify: false,
    // multiClickDebounceTime: 250,
  });

  cy.add(elements);

  console.log("get");
  console.log(cy.getElementById("my article").position());

  cy.center()

  return () => {};
};
