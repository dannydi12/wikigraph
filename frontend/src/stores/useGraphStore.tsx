import { create } from "zustand";
import { Data, Link, Node } from "../types/GraphTypes";

type GraphStore = {
  links: Link[];
  nodes: Node[];
  setGraphData: (data: Data) => void;
};

export const useGraphStore = create<GraphStore>((set) => ({
  links: [],
  nodes: [],
  setGraphData: ({ links, nodes }) => set(() => ({ links, nodes })),
}));
