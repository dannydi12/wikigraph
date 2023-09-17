import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@fontsource/inter";
import "@fontsource/inter/800.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@react-sigma/core/lib/react-sigma.min.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
