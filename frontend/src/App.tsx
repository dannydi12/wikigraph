import { FC, useEffect } from "react";
import { StyledApp } from "./App.styled";
import Graph from "./Graph/Graph";
import Search from "./Search/Search";
import { useAppSelector } from "./redux";
import useGetLinks from "./utils/getLinks";
import Footer from "./Footer/Footer";

const App: FC = () => {
  const currentSearch = useAppSelector((state) => state.graph.currentSearch);

  const { searchLinks } = useGetLinks();

  useEffect(() => {
    searchLinks({ title: currentSearch, type: "set" });
  }, [currentSearch]);

  return (
    <StyledApp>
      <Search />
      <Graph />
      <Footer />
    </StyledApp>
  );
};

export default App;
