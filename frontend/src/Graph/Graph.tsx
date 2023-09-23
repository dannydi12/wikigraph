import { FC, useEffect, useState, useRef } from "react";
import ForceGraph2d, {
  LinkObject,
  NodeObject,
  ForceGraphMethods,
} from "react-force-graph-2d";
import ForceGraph3d from "react-force-graph-3d";
import { Data, Link, Node } from "../types/GraphTypes";
import useGraphUtils from "../utils/useGraphUtils";
import { setIsNewSearch, useAppDispatch, useAppSelector } from "../redux";

type Props = {
  graphData: Data;
};

type GraphElement = ForceGraphMethods<NodeObject<Node>, LinkObject<Node, Link>>;

const Graph: FC<Props> = ({ graphData }) => {
  const ref = useRef<GraphElement>();
  const dispatch = useAppDispatch();

  const isNewSearch = useAppSelector((state) => state.graph.isNewSearch);

  const [show3d, setShow3d] = useState(false);
  const [data, setData] = useState<Data>({ nodes: [], links: [] });

  useEffect(() => {
    if (isNewSearch) {
      setData({
        nodes: graphData.nodes.map((node) => Object.assign({}, node)),
        links: graphData.links.map((link) => Object.assign({}, link)),
      });
      return;
    }

    setData({
      nodes: [
        ...data.nodes,
        ...graphData.nodes
          .slice(data.nodes.length - 1)
          .map((node) => Object.assign({}, node)),
      ],
      links: [
        ...data.links,
        ...graphData.links
          .slice(data.links.length - 1)
          .map((link) => Object.assign({}, link)),
      ],
    });
  }, [graphData.nodes.length, graphData.links.length]);

  const {
    handleHover,
    decideLineColor,
    decideLineWidth,
    decideShowParticles,
    handleClick,
    nodeCanvasObject,
  } = useGraphUtils(ref.current, data.nodes);

  const handleInitialZoom = () => {
    if (isNewSearch) {
      ref.current?.zoomToFit(1000, 100);
      dispatch(setIsNewSearch(false));
    }
  };

  if (show3d) {
    return (
      <ForceGraph3d
        enableNodeDrag={false}
        onNodeClick={handleClick}
        graphData={data as any}
        nodeLabel={(n) => n.title}
        onNodeHover={handleHover}
        linkWidth={decideLineWidth}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={decideShowParticles}
      />
    );
  }

  return (
    <ForceGraph2d
      ref={ref}
      enableNodeDrag={false}
      onNodeClick={handleClick}
      graphData={data}
      cooldownTime={400}
      nodeLabel={(n) => n.title}
      linkColor={decideLineColor}
      linkDirectionalParticleColor={() => "white"}
      nodeCanvasObject={nodeCanvasObject}
      onNodeHover={handleHover}
      nodeRelSize={5}
      maxZoom={20}
      minZoom={0.2}
      linkWidth={decideLineWidth}
      linkDirectionalParticles={4}
      linkDirectionalParticleWidth={decideShowParticles}
      onEngineStop={handleInitialZoom}
    />
  );
};

export default Graph;
