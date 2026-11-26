import React from "react";
import { createRoot } from "react-dom/client";
import SearchPanel from "./SearchPanel.jsx";
import { demoSearch } from "./demo-search.js";
import "./styles.css";
createRoot(document.querySelector("#root")).render(<SearchPanel search={demoSearch} debounceMs={300} minimumLength={2} onUnexpectedError={console.error} />);
