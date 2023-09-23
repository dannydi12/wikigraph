import {
  addGraphData,
  setGraphData,
  useAppDispatch,
  useAppSelector,
} from "../redux";
import { APIResponse } from "../types/GraphTypes";
import { api } from "./api";

type LinkSearch = {
  title: string;
  type: "set" | "add";
};

const useGetLinks = () => {
  const dispatch = useAppDispatch();
  const currentSearch = useAppSelector((state) => state.graph.currentSearch);

  const searchLinks = async ({ title, type }: LinkSearch) => {
    try {
      const { data } = await api<APIResponse>({
        url: `/links/${encodeURIComponent(title)}`,
        method: "GET",
      });

      const newLinks = data.map((link) => ({
        source: link.from_title_id,
        target: link.to_title_id,
      }));
      const newNodes = data.map((node) => ({
        id: node.to_title_id,
        title: node.to_title,
      }));

      // add missing root node
      if (!newNodes.some((node) => node.id === currentSearch)) {
        newNodes.push({
          id: currentSearch,
          title: currentSearch,
        });
      }

      if (type === "set") {
        dispatch(setGraphData({ nodes: newNodes, links: newLinks }));
      }

      if (type === "add") {
        dispatch(addGraphData({ nodes: newNodes, links: newLinks }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return { searchLinks };
};

export default useGetLinks;
