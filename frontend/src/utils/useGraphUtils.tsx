import {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";
import {
  addHighlightedNodes,
  setHoveredNode,
  setIsNewSearch,
  useAppDispatch,
  useAppSelector,
} from "../redux";
import { Link, Node } from "../types/GraphTypes";
import useGetLinks from "./getLinks";

const useGraphUtils = (
  ref: ForceGraphMethods<NodeObject<Node>, LinkObject<Node, Link>> | undefined,
  graphNodes: NodeObject<Node>[]
) => {
  const dispatch = useAppDispatch();
  const { links, isNewSearch } = useAppSelector((state) => state.graph);

  const { searchLinks } = useGetLinks();

  const handleHover = (node: NodeObject<Node> | null) => {
    dispatch(setHoveredNode(node?.id || null));
    const nodesToHighlight: { [x: string]: boolean } = {};

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

  const handleInitialZoom = () => {
    if (isNewSearch) {
      ref?.zoomToFit(1000, 100);
      dispatch(setIsNewSearch(false));
    }
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
    }, 600);
  };

  return {
    handleHover,
    handleClick,
    handleInitialZoom,
  };
};

export default useGraphUtils;
