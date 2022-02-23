import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "animate.css";
import App from "./Components/App";
import { CookiesProvider } from "react-cookie";

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
