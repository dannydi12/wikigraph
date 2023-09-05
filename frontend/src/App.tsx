import { createRef, useEffect, useState } from "react";
import { StyledApp } from "./App.styled";
import { chart } from "./utils/graph";
import { api } from "./utils/api";
import { Link } from "./types/Link";

function App() {
  const ref = createRef<HTMLCanvasElement>();
  const [links, setLinks] = useState<Link[]>([]);

  const getDeepLinks = async () => {
    const { data } = await api<Link[]>({
      url: "/links/deep/anarchy",
      method: "GET",
    });

    console.log('data?')
    setLinks(data);
  };

  useEffect(() => {
    if (!ref.current || !links.length) {
      return;
    }

    const { cleanup } = chart(ref.current, links);

    return () => {
      cleanup();
    };
  }, [links]);

  useEffect(() => {
    getDeepLinks();
  }, []);

  return (
    <StyledApp>
      <p>Hi!</p>
      <canvas width={928} height={680} ref={ref} />
    </StyledApp>
  );
}

export default App;
