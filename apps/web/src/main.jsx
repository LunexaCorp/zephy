import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { configureLeafletIcons } from "./utils/leaflet-icons.js";
import {HelmetProvider} from "react-helmet-async";
import {BrowserRouter} from "react-router-dom";
configureLeafletIcons();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
