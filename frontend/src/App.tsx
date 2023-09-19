import { FC, useEffect, useState } from "react";
import { StyledApp } from "./App.styled";
import { api } from "./utils/api";
import { APIResponse, Data } from "./types/GraphTypes";
import Graph from "./Graph/Graph";
import Search from "./Search/Search";
import { randomSearchRecommendation } from "./utils/randomeSearchRecommendation";
import { searchableSuggestions } from "./utils/constants";

const App: FC = () => {
  const [topic, setTopic] = useState(
    randomSearchRecommendation(searchableSuggestions)
  );
  const [data, setData] = useState<Data>({ nodes: [], links: [] });

  const getLinks = async (title: string) => {
    const { data } = await api<APIResponse>({
      url: `/links/${encodeURIComponent(title)}`,
      method: "GET",
    });

    const links = data.map((d) => ({
      source: d.from_title_id,
      target: d.to_title_id,
    }));
    const nodes = data.map((d) => ({
      id: d.to_title_id,
      title: d.to_title,
    }));

    // add missing root node
    if (!nodes.some((node) => node.id === topic)) {
      nodes.push({
        id: topic,
        title: topic,
      });
    }

    return { nodes, links };
  };

  useEffect(() => {
    const loadTopic = async () => {
      const { nodes, links } = await getLinks(topic);
      setData({ nodes, links });
    };

    loadTopic();
  }, [topic]);

  return (
    <StyledApp>
      <Search topic={topic} setTopic={setTopic} />
      <Graph data={data} getLinks={getLinks} setData={setData} topic={topic} />
    </StyledApp>
  );
};

export default App;
