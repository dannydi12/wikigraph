// import React, { useEffect, useState } from 'react';
// import Sigma from 'react-sigma';
// import { Graph } from 'graphology';
// import ForceAtlas2 from '@react-sigma/layout-forceatlas2';

import { useEffect, useState } from "react";
import Graph from "graphology";
import {
  ControlsContainer,
  SigmaContainer,
  useLoadGraph,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import { LayoutForceAtlas2Control, useWorkerLayoutForceAtlas2 } from "@react-sigma/layout-forceatlas2";

const MyGraph = () => {
  const loadGraph = useLoadGraph()
  const { stop, start, kill } = useWorkerLayoutForceAtlas2({});



  useEffect(() => {
    const graph = new Graph()
    // Create a simple graph with some nodes and edges
    graph.addNode('A');
    graph.addNode('B');
    graph.addNode('C');
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'A');

    loadGraph(graph);

    // Start the layout algorithm
    start();

    // Clean up when the component unmounts
    return () => {
      kill();
    };
  }, []);

  return (
    <SigmaContainer>
      <ControlsContainer position={"bottom-right"}>
        <LayoutForceAtlas2Control
          // settings={{ outputReducer: (key, attr) => {console.log(key, attr); return } }}
        />
      </ControlsContainer>
    </SigmaContainer>
  );
};

export default MyGraph;