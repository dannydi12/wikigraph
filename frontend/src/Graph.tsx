import { useEffect } from "react";
import Graph, { MultiDirectedGraph } from "graphology";
import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  SigmaContainer,
  ZoomControl,
  useLoadGraph,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import {
  useLayoutForceAtlas2,
  LayoutForceAtlas2Control,
} from "@react-sigma/layout-forceatlas2";

import forceAtlas2 from "graphology-layout-forceatlas2";
// import forceLayout from "graphology-layout-force";

export const LoadGraph = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph({ multi: true });
    const order = 500;
    const probability = 0.003;

    for (let i = 0; i < order; i++) {
      graph.addNode(i, {
        label: "hi",
        size: 5,
        color: "#000",
        x: Math.random(),
        y: Math.random(),
      });
    }
    for (let i = 0; i < order; i++) {
      for (let j = i + 1; j < order; j++) {
        if (Math.random() < probability) graph.addDirectedEdge(i, j);
        if (Math.random() < probability) graph.addDirectedEdge(j, i);
      }
    }

    // const positions = forceLayout(graph, {});

    // console.log("positions", positions);

    console.log(graph);

    forceAtlas2.assign(graph, 1000);
    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

export const DisplayGraph = () => {
  return (
    <SigmaContainer
      style={{ height: "100vh", width: "100%" }}
      graph={MultiDirectedGraph}
      settings={{}}
    >
      <LoadGraph />
      <ControlsContainer position={"bottom-right"}>
        <ZoomControl />
        <FullScreenControl />
        <LayoutForceAtlas2Control
          settings={{ settings: { barnesHutOptimize: true, gravity: 1,  } }}
        />
      </ControlsContainer>
      <ControlsContainer position={"top-right"}>
        <SearchControl style={{ width: "200px" }} />
      </ControlsContainer>
    </SigmaContainer>
  );
};
