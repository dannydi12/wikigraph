import * as d3 from "d3";

type Data = {
  links: {
    id: number;
    source: string;
    target: string;
  }[];
  nodes: {
    link_id: number;
    from_title_id: string;
    to_title_id: string;
    to_title: string;
    vx?: number;
    vy?: number;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
  }[];
};

const data: Data = {
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
    },
    {
      link_id: 1234,
      from_title_id: "my article2",
      to_title_id: "my article3",
      to_title: "my article3",
    },
    {
      link_id: 1235,
      from_title_id: "my article3",
      to_title_id: "my article",
      to_title: "my article",
    },
  ],
};

export const chart = (ref: HTMLCanvasElement, data) => {
  // Specify the color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // The force simulation mutates links and nodes, so create a copy
  // so that re-evaluating this cell produces the same result.
  const links = data.map((d) => ({
    id: d.link_id,
    source: d.from_title_id,
    target: d.to_title_id,
  }));
  const nodes: Data["nodes"] = data.map((d) => ({
    id: d.to_title_id,
    ...d,
  }));

  const context = ref.getContext("2d");
  const width = ref.width;
  const height = ref.height;

  if (!context) {
    return;
  }

  // Create a simulation with several forces.
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody())
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  simulation.nodes(nodes).on("tick", ticked);

  simulation.force("link").links(links);

  d3.select(ref).call(
    d3
      .drag()
      .container(ref)
      .subject(dragsubject)
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
  );

  function ticked() {
    context.clearRect(0, 0, width, height);

    // draw links
    context.beginPath();
    links.forEach(drawLink);
    context.strokeStyle = "#999999af";
    context.lineWidth = 2;
    context.stroke();

    // draw nodes
    context.beginPath();
    nodes.forEach(drawNode);
    context.fill();
    context.fillStyle = color("same");
    context.strokeStyle = "#fff";
    context.lineWidth = 1.5;
    context.stroke();
  }

  function dragsubject(event) {
    return simulation.find(event.x, event.y);
  }

  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  function drawLink(d) {
    context.moveTo(d.source.x, d.source.y);
    context.lineTo(d.target.x, d.target.y);
  }

  function drawNode(d) {
    context.moveTo(d.x + 5, d.y);
    context.arc(d.x, d.y, 5, 0, 2 * Math.PI + 1);
  }
  return {
    cleanup: () => context.clearRect(0, 0, width, height),
  };
};
