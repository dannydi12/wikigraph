import {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";
import {
  addGraphData,
  addHighlightedNodes,
  setGraphData,
  setHoveredNode,
  useAppDispatch,
  useAppSelector,
} from "../redux";
import { APIResponse, Data, Link, Node } from "../types/GraphTypes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { distinctByKey } from "./distinctByKey";
import { api } from "./api";

const useGraphUtils = (
  ref: ForceGraphMethods<NodeObject<Node>, LinkObject<Node, Link>> | undefined,
  graphNodes: NodeObject<Node>[]
) => {
  const dispatch = useAppDispatch();
  const {
    links,
    nodes,
    hoveredNodeId: hoveredNode,
    highlightedNodes,
  } = useAppSelector((state) => state.graph);

  const [zoomTo, setZoomTo] = useState('')

  // needs to be replaced
  const getLinks = async (title: string) => {
    const { data } = await api<APIResponse>({
      url: `/links/${encodeURIComponent(title)}`,
      method: "GET",
    });

    const newLinks = data.map((d) => ({
      source: d.from_title_id,
      target: d.to_title_id,
    }));
    const newNodes = data.map((d) => ({
      id: d.to_title_id,
      title: d.to_title,
    }));

    // add missing root node
    // if (!newNodes.some((node) => node.id === topic)) {
    //   newNodes.push({
    //     id: topic,
    //     title: topic,
    //   });
    // }

    return { nodes: newNodes, links: newLinks };
  };

  const handleHover = (node: NodeObject<Node> | null) => {
    dispatch(setHoveredNode(node?.id || null));
    const nodesToHighlight: any = {};

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
    console.log("node", node?.id, node?.x, node?.y);
    if (!node) {
      return;
    }

    // keeps last clicked node in the center of the page
    ref?.centerAt(node.x!, node.y!, 400);
  };

  useEffect(() => {
    if(zoomTo) {
      zoomToLastClicked(zoomTo)
      setZoomTo('')
    }
  }, [zoomTo])

  const handleClick = async (node: NodeObject<Node>, event: MouseEvent) => {
    // open wikipedia page if holding command or control keys
    if (event.metaKey || event.ctrlKey) {
      window.open(
        "https://wikipedia.com/wiki/" + node.title.split(" ").join("_"),
        "__blank"
      );
      return;
    }

    const { nodes: newNodes, links: newLinks } = await getLinks(node.id);

    dispatch(
      addGraphData({
        nodes: newNodes,
        links: newLinks,
      })
    );

    // wait for graph to finish animating + 200ms for safety
    setTimeout(() => {
      console.log("go!", node.x, node.y);
      setZoomTo(node.id)
      // zoomToLastClicked(node.id);
    }, 600);
  };

  const nodeCanvasObject = useCallback(
    (
      node: NodeObject<Node>,
      ctx: CanvasRenderingContext2D,
      globalScale: number
    ) => {
      const highlightNode = highlightedNodes[node.id];
      // console.log('high', highlightNode)
      const label = globalScale < 1 ? "" : node.title;
      const radius = Math.min(10 / globalScale, 2);
      const fontSize = 12 / globalScale;
      const textYOffset = 20 / globalScale; // Offset for text below the circle

      // Draw white outline circle
      // ctx.beginPath();
      // ctx.arc(node.x!, node.y!, radius + 0.2, 0, 2 * Math.PI, false);
      // ctx.fillStyle = "white";
      // ctx.fill();

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
