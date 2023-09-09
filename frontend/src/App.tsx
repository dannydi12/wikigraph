import { createRef, useEffect, useState } from "react";
import { StyledApp } from "./App.styled";
import { data, graph } from "./utils/graph";
import { api } from "./utils/api";
import { Link } from "./types/Link";
import { useWindowSize } from "usehooks-ts";

function App() {
  const ref = createRef<HTMLCanvasElement>();
  const { width, height } = useWindowSize();
  const [links, setLinks] = useState<Link[]>([]);

  const getDeepLinks = async () => {
    const { data } = await api<Link[]>({
      url: "/links/deep/abbot of melrose",
      method: "GET",
    });

    console.log('data?')
    setLinks(data);
  };

  useEffect(() => {
    if (!ref.current || !links.length) {
      return;
    }

    graph(ref.current, links);
  }, [links]);

  useEffect(() => {
    getDeepLinks();
  }, []);


  return (
    <StyledApp>
      <canvas width={width} height={height} ref={ref} />
    </StyledApp>
  );
}

export default App;
