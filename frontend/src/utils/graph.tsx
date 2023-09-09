import * as d3 from "d3";

type Node = d3.SimulationNodeDatum & {
  link_id: number;
  from_title_id: string;
  to_title_id: string;
  to_title: string;
};

type Link = d3.SimulationLinkDatum<Node> & {
  id: number;
  source: string;
  target: string;
};

type Data = {
  links: Link[];
  nodes: Node[];
};

export const data: Data = {
  links: [
    { id: 1, source: "my hgee", target: "my article2" },
    { id: 2, source: "my asdfsdfrticle", target: "my article3" },
  ],
  nodes: [
    {
      link_id: 123,
      from_title_id: "my article",
      to_title_id: "my article2",
      to_title: "my article2",
      x: 0,
      y: 0,
    },
    {
      link_id: 1234,
      from_title_id: "my article2",
      to_title_id: "my article3",
      to_title: "my article3",
      x: 0,
      y: 0,
    },
    {
      link_id: 1235,
      from_title_id: "my article3",
      to_title_id: "my article",
      to_title: "my article",
      x: 0,
      y: 0,
    },
  ],
};

function forceSimulation(width: number, height: number) {
  return d3
    .forceSimulation()
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("charge", d3.forceManyBody())
    .force(
      "link",
      d3.forceLink<Node, Link>().id((d) => d.id)
    );
}

function findNode(nodes: Node[], x: number, y: number, radius: number) {
  const rSq = radius * radius;
  let i;
  for (i = nodes.length - 1; i >= 0; --i) {
    const node = nodes[i],
      dx = x - node.x!,
      dy = y - node.y!,
      distSq = dx * dx + dy * dy;
    if (distSq < rSq) {
      return node;
    }
  }
  // No node selected
  return undefined;
}

export const graph = (ref: HTMLCanvasElement, data: Node[]) => {
  const w2 = ref.width / 2,
    h2 = ref.height / 2,
    nodeRadius = 5;

  const ctx = ref.getContext("2d") as CanvasRenderingContext2D;
  const canvas = ctx.canvas;

  // const simulation = forceSimulation(ref.width, ref.height);

  // The simulation will alter the input data objects so make
  // copies to protect the originals.
  // const nodes = data.nodes.map((d) => ({...d}));
  // const edges = data.links.map((d) => ({...d}));

  const links = data.map((d) => ({
    id: d.from_title_id + d.to_title_id,
    source: d.from_title_id,
    target: d.to_title_id,
  }));
  const nodes = data.map((d) => ({
    id: d.to_title_id,
    ...d,
  }));

  console.log(nodes, links)

  d3.select(canvas)
    .call(
      d3
        .drag()
        // Must set this in order to drag nodes. New in v5?
        .container(canvas)
        .subject(dragSubject)
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded)
    )
    .call(
      d3
        .zoom()
        .scaleExtent([1 / 10, 8])
        .on("zoom", zoomed)
    );

    const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    // .force("center", d3.forceCenter(ref.width / 2, ref.height / 2))
    .force("charge", d3.forceManyBody())
    .force("x", d3.forceX())
    .force("y", d3.forceY());


  simulation.nodes(nodes).on("tick", simulationUpdate);

  simulation.force("link").links(links);

  let transform = d3.zoomIdentity;
  function zoomed(event) {
    transform = event.transform;
    simulationUpdate();
  }

  /** Find the node that was clicked, if any, and return it. */
  function dragSubject(event) {
    const x = transform.invertX(event.x),
      y = transform.invertY(event.y);
    const node = findNode(nodes, x, y, nodeRadius);
    console.log('is node', node)
    if (node) {
      node.x = transform.applyX(node.x);
      node.y = transform.applyY(node.y);
    }
    // else: No node selected, drag container
    return node;
  }

  function dragStarted(event) {
    if (!event.active) {
      simulation.alphaTarget(0.3).restart();
    }
    event.subject.fx = transform.invertX(event.x);
    event.subject.fy = transform.invertY(event.y);
  }

  function dragged(event) {
    event.subject.fx = transform.invertX(event.x);
    event.subject.fy = transform.invertY(event.y);
  }

  function dragEnded(event) {
    if (!event.active) {
      simulation.alphaTarget(0.3);
    }
    event.subject.fx = null;
    event.subject.fy = null;
  }

  function simulationUpdate() {
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    ctx.save();
    ctx.clearRect(0, 0, ref.width, ref.height);
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);
    // Draw edges
    links.forEach(function (d) {
      ctx.beginPath();
      ctx.moveTo(d.source.x, d.source.y);
      ctx.lineTo(d.target.x, d.target.y);
      ctx.lineWidth = Math.sqrt(d.value);
      ctx.strokeStyle = "#aaa";
      ctx.stroke();
    });
    // Draw nodes
    nodes.forEach(function (d, i) {
      ctx.beginPath();
      // Node fill
      ctx.moveTo(d.x + nodeRadius, d.y);
      ctx.arc(d.x, d.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = color("same");
      ctx.fill();
      // Node outline
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
    ctx.restore();
  }

  return canvas;
};

// =============================
// export const chart = (ref: HTMLCanvasElement, data) => {
//   // Specify the color scale.
//   const color = d3.scaleOrdinal(d3.schemeCategory10);

//   // The force simulation mutates links and nodes, so create a copy
//   // so that re-evaluating this cell produces the same result.
// const links = data.map((d) => ({
//   id: d.link_id,
//   source: d.from_title_id,
//   target: d.to_title_id,
// }));
// const nodes: Data["nodes"] = data.map((d) => ({
//   id: d.to_title_id,
//   ...d,
// }));

//   const context = ref.getContext("2d");
//   const width = ref.width;
//   const height = ref.height;

//   if (!context) {
//     return;
//   }

//   // Create a simulation with several forces.
  // const simulation = d3
  //   .forceSimulation(nodes)
  //   .force(
  //     "link",
  //     d3.forceLink(links).id((d) => d.id)
  //   )
  //   .force("charge", d3.forceManyBody())
  //   .force("x", d3.forceX())
  //   .force("y", d3.forceY());

  // simulation.nodes(nodes).on("tick", ticked);

  // simulation.force("link").links(links);

//   d3.select(ref).call(
//     d3
//       .drag()
//       .container(ref)
//       .subject(dragsubject)
//       .on("start", dragstarted)
//       .on("drag", dragged)
//       .on("end", dragended)
//   );

//   function ticked() {
//     context.clearRect(0, 0, width, height);

//     // draw links
//     context.beginPath();
//     links.forEach(drawLink);
//     context.strokeStyle = "#999999af";
//     context.lineWidth = 2;
//     context.stroke();

//     // draw nodes
//     context.beginPath();
//     nodes.forEach(drawNode);
//     context.fill();
//     context.fillStyle = color("same");
//     context.strokeStyle = "#fff";
//     context.lineWidth = 1.5;
//     context.stroke();
//   }

//   function dragsubject(event) {
//     return simulation.find(event.x, event.y);
//   }

//   function dragstarted(event) {
//     if (!event.active) simulation.alphaTarget(0.3).restart();
//     event.subject.fx = event.subject.x;
//     event.subject.fy = event.subject.y;
//   }

//   function dragged(event) {
//     event.subject.fx = event.x;
//     event.subject.fy = event.y;
//   }

//   function dragended(event) {
//     if (!event.active) simulation.alphaTarget(0);
//     event.subject.fx = null;
//     event.subject.fy = null;
//   }

//   function drawLink(d) {
//     context.moveTo(d.source.x, d.source.y);
//     context.lineTo(d.target.x, d.target.y);
//   }

//   function drawNode(d) {
//     context.moveTo(d.x + 5, d.y);
//     context.arc(d.x, d.y, 5, 0, 2 * Math.PI + 1);
//   }
//   return {
//     cleanup: () => context.clearRect(0, 0, width, height),
//   };
// };
