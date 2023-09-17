import { FC, useEffect, useState } from "react";
import { StyledApp } from "./App.styled";
import { api } from "./utils/api";
import { APIResponse, Data } from "./types/GraphTypes";
import Graph from "./Graph/Graph";

const App: FC = () => {
  const [data, setData] = useState<Data>({ nodes: [], links: [] });

  const getLinks = async (title: string) => {
    const { data } = await api<APIResponse>({
      url: `/links/${title}`,
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

    return { nodes, links };
  };

  useEffect(() => {
    const firstLoad = async () => {
      const { nodes, links } = await getLinks("wikipedia");
      setData({ nodes, links });
    };

    firstLoad();
  }, []);

  return (
    <StyledApp>
      <Graph data={data} getLinks={getLinks} setData={setData} />
    </StyledApp>
  );
};

export default App;
