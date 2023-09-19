import { FC, useEffect, useState } from "react";
import { StyledApp } from "./App.styled";
import { api } from "./utils/api";
import { APIResponse, Data } from "./types/GraphTypes";
import Graph from "./Graph/Graph";
import Search from "./Search/Search";
import { randomSearchRecommendation } from "./utils/randomeSearchRecommendation";
import { searchableSuggestions } from "./utils/constants";
import { setGraphData, useAppDispatch, useAppSelector } from "./redux";

const App: FC = () => {
  const [topic, setTopic] = useState(
    randomSearchRecommendation(searchableSuggestions)
  );
  const links = useAppSelector((state) => state.graph.links);
  const nodes = useAppSelector((state) => state.graph.nodes);
  const dispatch = useAppDispatch();

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
    if (!newNodes.some((node) => node.id === topic)) {
      newNodes.push({
        id: topic,
        title: topic,
      });
    }

    return { nodes: newNodes, links: newLinks };
  };

  useEffect(() => {
    const loadTopic = async () => {
      const { nodes: newNodes, links: newLinks } = await getLinks(topic);
      dispatch(setGraphData({ nodes: newNodes, links: newLinks }));
    };

    loadTopic();
  }, [topic]);

  return (
    <StyledApp>
      <Search topic={topic} setTopic={setTopic} />
      <Graph
        graphData={{ links, nodes }}
        getLinks={getLinks}
        setData={(v) => dispatch(setGraphData(v))}
        topic={topic}
      />
    </StyledApp>
  );
};

export default App;
