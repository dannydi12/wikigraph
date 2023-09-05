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

export const chart = (ref: HTMLDivElement, data) => {
  // Specify the dimensions of the chart.
  const width = 928;
  const height = 680;

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
  console.log(
    "here0",
    nodes.find((node) => node.to_title_id === "society")
  );

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
  console.log("here1");
  // Create the SVG container.
  const svg = d3
    .select(ref)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "max-width: 100%; height: auto;");
  console.log("here2");

  // Add a line for each link, and a circle for each node.
  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    // .attr("stroke-width", (d) => Math.sqrt(d.value));
    .attr("stroke-width", 2);
  console.log("here3");

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 5)
    // .attr("fill", (d) => color(d.group));
    .attr("fill", (d) => color("same"));
  console.log("here4");

  // node.append("title").text((d) => d.from_title_id);

  // TODO
  // node.append('p')
  // .text((d) => d.id)
  // .style('opacity', 1); // Initially hide labels

  // Add a drag behavior.
  node.call(
    d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  );
  console.log("here5");

  // Set the position attributes of links and nodes each time the simulation ticks.
  // simulation.on("tick", () => {
  //   link
  //     .attr("x1", (d) => d.source.x)
  //     .attr("y1", (d) => d.source.y)
  //     .attr("x2", (d) => d.target.x)
  //     .attr("y2", (d) => d.target.y);

  //   node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  // });
  console.log("here6");

  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(
    event: d3.D3DragEvent<SVGCircleElement, unknown, Data["nodes"][number]>
  ) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(
    event: d3.D3DragEvent<SVGCircleElement, unknown, Data["nodes"][number]>
  ) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(
    event: d3.D3DragEvent<SVGCircleElement, unknown, Data["nodes"][number]>
  ) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  // TODO
  // const handleZoom = (event: d3.D3ZoomEvent<SVGCircleElement, any>) => {
  //   const { transform } = event;

  //   // Apply zoom transformations to your graph elements
  //   svg
  //     .selectAll("circle")
  //     .attr("cx", (d) => d.x * transform.k)
  //     .attr("cy", (d) => d.y * transform.k)
  //     .attr("r", (d) => 5 * transform.k); // Adjust the radius as needed

  //   // Gradually show/hide labels based on zoom level
  //   svg.selectAll("text").style("opacity", (d) => (transform.k > 1.5 ? 1 : 0)); // Adjust the zoom threshold as needed
  // };
  console.log("here7");

  // When this is re-run, stop the previous simulation (cleanup)
  return {
    node: svg.node(),
    simulation,
    cleanup: () => d3.select(ref).selectAll("svg").remove(),
  };
};
