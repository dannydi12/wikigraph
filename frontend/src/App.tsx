import { createRef, useEffect } from "react";
import { StyledApp } from "./App.styled";
import { chart } from "./utils/graph";

function App() {
  const ref = createRef<HTMLDivElement>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const { node, simulation, cleanup } = chart(ref.current);

    return () => {
      cleanup()
    };
  }, []);

  return (
    <StyledApp>
      <p>Hi!</p>
      <div ref={ref} />
    </StyledApp>
  );
}

export default App;
