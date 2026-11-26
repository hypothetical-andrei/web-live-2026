import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createSafeStorage } from "./storage.js";
import "./styles.css";
let nextId = 3;
createRoot(document.querySelector("#root")).render(<StrictMode><App storage={createSafeStorage(localStorage)} initialItems={[{ id: "1", title: "HTTP Semantics", read: false }, { id: "2", title: "Relational Thinking", read: true }]} createItemId={() => String(nextId++)} /></StrictMode>);
