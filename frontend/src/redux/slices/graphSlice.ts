import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Data, Link, Node } from "../../types/GraphTypes";
import { distinctByKey } from "../../utils/distinctByKey";
import { randomSearchRecommendation } from "../../utils/randomeSearchRecommendation";
import { searchableSuggestions } from "../../utils/constants";

type InitialState = {
  loading: boolean;
  nodes: Node[];
  links: Link[];
  hoveredNodeId: string | null;
  highlightedNodes: { [x: string]: boolean };
  isNewSearch: boolean;
  currentSearch: string;
};

const initialState: InitialState = {
  loading: true,
  nodes: [],
  links: [],
  hoveredNodeId: null,
  highlightedNodes: {},
  isNewSearch: true,
  currentSearch: randomSearchRecommendation(searchableSuggestions),
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
    setIsNewSearch: (state, action: PayloadAction<boolean>) => {
      state.isNewSearch = action.payload;
    },
    setCurrentSearch: (state, action: PayloadAction<string>) => {
      state.currentSearch = action.payload;
    },
  },
});

export const {
  setGraphData,
  setHoveredNode,
  addHighlightedNodes,
  addGraphData,
  setIsNewSearch,
  setCurrentSearch,
} = graphSlice.actions;
export default graphSlice.reducer;
