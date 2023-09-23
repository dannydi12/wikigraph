import { LinkObject, NodeObject } from "react-force-graph-2d";
import { useAppSelector } from "../redux";
import { Link, Node } from "../types/GraphTypes";
import { useCallback } from "react";

const useGraphStyling = () => {
  const { hoveredNodeId: hoveredNode, highlightedNodes } = useAppSelector(
    (state) => state.graph
  );

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

  const decideStyle = (
    element: LinkObject<Node, Link>,
    activeStyle: any,
    inactiveStyle: any
  ) => {
    const source = element.source as NodeObject<Node>;
    const target = element.target as NodeObject<Node>;

    const isActive = source.id === hoveredNode || target.id === hoveredNode;

    return isActive ? activeStyle : inactiveStyle;
  };

  const decideShowParticles = useCallback(
    (element: LinkObject<Node, Link>) => decideStyle(element, 2, 0),
    [hoveredNode]
  );

  const decideLineWidth = useCallback(
    (element: LinkObject<Node, Link>) => decideStyle(element, 4, 1),
    [hoveredNode]
  );

  const decideLineColor = useCallback(
    (element: LinkObject<Node, Link>) =>
      decideStyle(element, "#e2e2e242", "#3f3f3f42"),
    [hoveredNode]
  );

  return {
    decideLineColor,
    decideLineWidth,
    decideShowParticles,
    nodeCanvasObject,
  };
};

export default useGraphStyling;
