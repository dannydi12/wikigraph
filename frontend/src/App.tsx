import { createRef, useEffect, useState } from "react";
import { StyledApp } from "./App.styled";
import { chart } from "./utils/graph";
import { api } from "./utils/api";
import { Link } from "./types/Link";

function App() {
  const ref = createRef<HTMLDivElement>();
  const [links, setLinks] = useState<Link[]>([]);

  const getDeepLinks = async () => {
    const { data } = await api<Link[]>({
      url: "/links/anarchy",
      method: "GET",
    });

    setLinks(data);
  };

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const { cleanup } = chart(ref.current);

    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    getDeepLinks();
  }, []);

  return (
    <StyledApp>
      <p>Hi!</p>
      <div ref={ref} />
    </StyledApp>
  );
}

export default App;
