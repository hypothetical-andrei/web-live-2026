import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createSafeStorage } from "./storage.js";
import "./styles.css";
let nextId = 3;
createRoot(document.querySelector("#root")).render(<StrictMode><App storage={createSafeStorage(localStorage)} initialItems={[{ id: "1", title: "Semantica HTTP", read: false }, { id: "2", title: "Gândire relațională", read: true }]} createItemId={() => String(nextId++)} /></StrictMode>);
