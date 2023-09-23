import { FC, useEffect } from "react";
import { StyledApp } from "./App.styled";
import Graph from "./Graph/Graph";
import Search from "./Search/Search";
import { useAppSelector } from "./redux";
import useGetLinks from "./utils/getLinks";

const App: FC = () => {
  const { currentSearch, nodes, links } = useAppSelector(
    (state) => state.graph
  );

  const { searchLinks } = useGetLinks();

  useEffect(() => {
    searchLinks({ title: currentSearch, type: "set" });
  }, [currentSearch]);

  return (
    <StyledApp>
      <Search />
      <Graph graphData={{ links, nodes }} />
    </StyledApp>
  );
};

export default App;
