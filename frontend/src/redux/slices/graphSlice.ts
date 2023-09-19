import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Data, Link, Node } from "../../types/GraphTypes";
import { distinctByKey } from "../../utils/distinctByKey";

type InitialState = {
  loading: boolean;
  nodes: Node[];
  links: Link[];
  hoveredNodeId: string | null;
  highlightedNodes: { [x: string]: boolean };
};

const initialState: InitialState = {
  loading: true,
  nodes: [],
  links: [],
  hoveredNodeId: null,
  highlightedNodes: {},
};

export const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    setGraphData: (state, action: PayloadAction<Data>) => {
      state.nodes = action.payload.nodes;
      state.links = action.payload.links;
    },
    addGraphData: (state, action: PayloadAction<Data>) => {
      state.nodes = distinctByKey(
        [...state.nodes, ...action.payload.nodes],
        "id"
      );
      state.links = [...state.links, ...action.payload.links];
    },
    setHoveredNode: (
      state,
      action: PayloadAction<InitialState["hoveredNodeId"]>
    ) => {
      state.hoveredNodeId = action.payload;
    },
    addHighlightedNodes: (
      state,
      action: PayloadAction<InitialState["highlightedNodes"]>
    ) => {
      state.highlightedNodes = action.payload;
    },
  },
});

export const {
  setGraphData,
  setHoveredNode,
  addHighlightedNodes,
  addGraphData,
} = graphSlice.actions;
export default graphSlice.reducer;
