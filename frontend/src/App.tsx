import { useCallback, useEffect, useState } from "react";
import { StyledApp } from "./App.styled";
import { api } from "./utils/api";
import ForceGraph2d, {
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";
import ForceGraph3d from "react-force-graph-3d";
import { APIResponse, Data, Link, Node } from "./types/GraphTypes";


function App() {
  const [data, setData] = useState<Data>({ nodes: [], links: [] });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [show3d, setShow3d] = useState(false)
  const [highlightedNodes, setHighlightedNodes] = useState(new Set<string>());

  const getLinks = async (title: string) => {
    const { data } = await api<APIResponse>({
      url: `/links/${title}`,
      method: "GET",
    });

    const links = data.map((d) => ({
      source: d.from_title_id,
      target: d.to_title_id,
    }));
    const nodes = data.map((d) => ({
      id: d.to_title_id,
      title: d.to_title,
    }));

    return { nodes, links };
  };

  function distinctByKey(array: Array<any>, key: string) {
    const seen = new Set();

    return array.filter((item) => {
      const value = item[key];

      if (!seen.has(value)) {
        seen.add(value);
        return true;
      }

      return false;
    });
  }

  const handleClick = useCallback(
    async (node: NodeObject<Node>, event: MouseEvent) => {
      // open wikipedia page if holding command or control keys
      if (event.metaKey || event.ctrlKey) {
        window.open(
          "https://wikipedia.com/wiki/" + node.title.split(" ").join("_"),
          "__blank"
        );
        return;
      }

      const { nodes, links } = await getLinks(node.id);

      setData({
        nodes: distinctByKey([...data.nodes, ...nodes], "id"),
        links: [...data.links, ...links],
      });
    },
    [data, setData]
  );

  useEffect(() => {
    const firstLoad = async () => {
      const { nodes, links } = await getLinks("anarchy");
      setData({ nodes, links });
    };

    firstLoad();
  }, []);

  const nodeCanvasObject = useCallback(
    (
      node: NodeObject<Node>,
      ctx: CanvasRenderingContext2D,
      globalScale: number
    ) => {
      const highlightNode = highlightedNodes.has(node.id);

      const label = node.title; // Change this to the property you want to use as the label
      const radius = Math.min(10 / globalScale, 2);
      const fontSize = 12 / globalScale;
      const textYOffset = 30 / globalScale; // Offset for text below the circle

      // Draw white/orange outline circle
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, radius + 0.2, 0, 2 * Math.PI, false);
      ctx.fillStyle = "white";
      ctx.fill();

      // Draw blue circle
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = highlightNode ? "orange" : "#3183ba";
      ctx.fill();

      // Draw text below the circle
      ctx.font = `${fontSize}px Inter`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.globalAlpha = highlightNode && hoveredNode !== node.id ? 1 : Math.min(Math.max(globalScale - 3.5, 0) / 5, 1);
      ctx.fillStyle = "black";
      ctx.fillText(label, node.x!, node.y! + textYOffset);

      ctx.globalAlpha = 1;
    },
    [highlightedNodes, hoveredNode]
  );

  const decideShowParticles = useCallback(
    (element: LinkObject<Node, Link>) => {
      const source = element.source as NodeObject<Node>;
      const target = element.target as NodeObject<Node>;

      const showParticles =
        source.id === hoveredNode || target.id === hoveredNode;

      return showParticles ? 2 : 0;
    },
    [hoveredNode]
  );

  const decideLineWidth = useCallback(
    (element: LinkObject<Node, Link>) => {
      const source = element.source as NodeObject<Node>;
      const target = element.target as NodeObject<Node>;

      const largeLine = source.id === hoveredNode || target.id === hoveredNode;

      return largeLine ? 4 : 1;
    },
    [hoveredNode]
  );

  const handleHover = (node: NodeObject<Node> | null) => {
    setHoveredNode(node?.id || null);
    const nodesToHighlight = new Set<string>();

    // clear highlighted nodes set if no node is hovered
    if (node === null) {
      setHighlightedNodes(nodesToHighlight);
      return;
    }

    data.links.forEach((link) => {
      const source = link.source as unknown as NodeObject<Node>;
      const target = link.target as unknown as NodeObject<Node>;

      if (target.id === node?.id || source.id === node?.id) {
        nodesToHighlight.add(target.id);
        nodesToHighlight.add(source.id);
      }
    });

    setHighlightedNodes(nodesToHighlight);
  };

  return (
    <StyledApp>
      {show3d ? <ForceGraph3d
        enableNodeDrag={false}
        onNodeClick={handleClick}
        graphData={data as any}
        nodeLabel={(n) => n.title}
        onNodeHover={handleHover}
        linkWidth={decideLineWidth}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={decideShowParticles}
      /> : 
      <ForceGraph2d
        enableNodeDrag={false}
        onNodeClick={handleClick}
        graphData={data}
        cooldownTime={400}
        nodeLabel={(n) => n.title}
        nodeCanvasObject={nodeCanvasObject}
        onNodeHover={handleHover}
        nodeRelSize={5}
        maxZoom={20}
        minZoom={0.2}
        linkWidth={decideLineWidth}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={decideShowParticles}
      />}
      
    </StyledApp>
  );
}

export default App;
