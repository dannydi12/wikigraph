import {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";
import {
  addHighlightedNodes,
  setHoveredNode,
  useAppDispatch,
  useAppSelector,
} from "../redux";
import { Link, Node } from "../types/GraphTypes";
import { useCallback} from "react";
import useGetLinks from "./getLinks";

const useGraphUtils = (
  ref: ForceGraphMethods<NodeObject<Node>, LinkObject<Node, Link>> | undefined,
  graphNodes: NodeObject<Node>[]
) => {
  const dispatch = useAppDispatch();
  const {
    links,
    hoveredNodeId: hoveredNode,
    highlightedNodes,
  } = useAppSelector((state) => state.graph);

  const { searchLinks } = useGetLinks();

  const handleHover = (node: NodeObject<Node> | null) => {
    dispatch(setHoveredNode(node?.id || null));
    const nodesToHighlight: {[x: string]: boolean} = {};

    // clear highlighted nodes set if no node is hovered
    if (node === null) {
      dispatch(addHighlightedNodes(nodesToHighlight));
      return;
    }

    links.forEach((link) => {
      const source = link.source;
      const target = link.target;

      if (target === node?.id || source === node?.id) {
        nodesToHighlight[target] = true;
        nodesToHighlight[source] = true;
      }
    });

    dispatch(addHighlightedNodes(nodesToHighlight));
  };

  const zoomToLastClicked = (nodeId: string) => {
    const node = graphNodes.find((node) => node.id === nodeId);

    if (!node) {
      return;
    }

    // keeps last clicked node in the center of the page
    ref?.centerAt(node.x!, node.y!, 400);
  };

  const handleClick = async (node: NodeObject<Node>, event: MouseEvent) => {
    // open wikipedia page if holding command or control keys
    if (event.metaKey || event.ctrlKey) {
      window.open(
        "https://wikipedia.com/wiki/" + node.title.split(" ").join("_"),
        "__blank"
      );
      return;
    }

    await searchLinks({ title: node.id, type: "add" });

    // wait for graph to finish animating + 200ms for safety
    setTimeout(() => {
      zoomToLastClicked(node.id);
    }, 1000);
  };

  const nodeCanvasObject = useCallback(
    (
      node: NodeObject<Node>,
      ctx: CanvasRenderingContext2D,
      globalScale: number
    ) => {
      const highlightNode = highlightedNodes[node.id];
      const label = globalScale < 1 ? "" : node.title;
      const radius = Math.min(10 / globalScale, 2);
      const fontSize = 12 / globalScale;
      const textYOffset = 20 / globalScale; // Offset for text below the circle

      // Draw blue circle
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = highlightNode ? "orange" : "#3183ba";
      ctx.fill();

      // Draw text below the circle
      ctx.font = `${fontSize}px Inter`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.globalAlpha =
        highlightNode && hoveredNode !== node.id
          ? 1
          : Math.min(Math.max(globalScale - 3.5, 0) / 5, 1);
      ctx.fillStyle = "white";
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

  const decideLineColor = useCallback(
    (element: LinkObject<Node, Link>) => {
      const source = element.source as NodeObject<Node>;
      const target = element.target as NodeObject<Node>;

      const isHovered = source.id === hoveredNode || target.id === hoveredNode;

      return isHovered ? "#e2e2e242" : "#3f3f3f42";
    },
    [hoveredNode]
  );

  return {
    handleHover,
    decideLineColor,
    decideLineWidth,
    decideShowParticles,
    handleClick,
    nodeCanvasObject,
  };
};

export default useGraphUtils;
