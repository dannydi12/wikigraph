import cytoscape from "cytoscape";
// import cytoscapeSpread from 'cytoscape-spread';
// import cytoscapeCola from 'cytoscape-cola';
import d3Force from "cytoscape-d3-force";

export type Node = {
  link_id: number;
  from_title_id: string;
  to_title_id: string;
  to_title: string;
};

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

export const graph = (ref: HTMLDivElement, search: string, data: Node[]) => {
  const links = data.map((d) => ({
    id: d.from_title_id + d.to_title_id,
    source: d.from_title_id,
    target: d.to_title_id,
  }));
  const nodes = data.map((d) => ({
    id: d.to_title_id,
    ...d,
  }));

  nodes.push({ id: search });

  const linkData = links.map((link) => ({ id: link.id, data: { ...link } }));
  const nodeData = nodes.map((node) => ({ id: node.id, data: { ...node } }));
  const elements = [...nodeData, ...linkData];

  cytoscape.use(d3Force);

  const cy = cytoscape({
    container: ref,

    // demo your layout
    layout: {
      name: "d3-force",
      linkId: (node: (typeof nodes)[number]) => {
        return node.id;
      },
      linkDistance: 15,
      manyBodyStrength: -5000,
      ready: function () {},
      stop: function () {},
      tick: function (progress: number) {
        console.log("progress - ", progress);
      },
      animate: data.length < 200,
      randomize: true,
      infinite: true,
    } as any,

    minZoom: 0.01,
    maxZoom: 5,

    style: [
      {
        selector: "node",
        style: {
          content: "data(id)",
        },
      },

      {
        selector: "edge",
        style: {
          "curve-style": "bezier",
          "target-arrow-shape": "triangle",
        },
      },
    ],

    // zoomingEnabled: true,
    // userZoomingEnabled: true,
    // panningEnabled: true,
    // userPanningEnabled: true,
    // boxSelectionEnabled: true,
    // selectionType: "single",
    // touchTapThreshold: 8,
    // desktopTapThreshold: 4,
    // autolock: false,
    // autoungrabify: false,
    // autounselectify: false,
    // multiClickDebounceTime: 250,

    elements: elements,
    wheelSensitivity: 0.5,
  });

  return () => {};
};