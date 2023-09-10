import { createRef, useEffect, useState } from "react";
import { StyledApp } from "./App.styled";
import { graph } from "./utils/cytograph";
import { api } from "./utils/api";
import { Link } from "./types/Link";
import { useWindowSize } from "usehooks-ts";

function App() {
  const ref = createRef<HTMLDivElement>();
  const [links, setLinks] = useState<Link[]>([]);

  const getDeepLinks = async () => {
    const { data } = await api<Link[]>({
      // url: "/links/deep/united states",
      url: "/links/anarchy",
      method: "GET",
    });

    setLinks(data);
  };

  useEffect(() => {
    if (!ref.current || !links.length) {
      return;
    }

  const cleanup = graph(ref.current, 'anarchy', links);

  return () => {
    console.log('cleanup')
    cleanup()
  };
  }, [links]);

  useEffect(() => {
    getDeepLinks();
  }, []);

  return (
    <StyledApp>
      <div id="graph" ref={ref} />
    </StyledApp>
  );
}

export default App;
