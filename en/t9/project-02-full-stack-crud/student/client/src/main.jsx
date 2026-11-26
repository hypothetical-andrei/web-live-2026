import React from "react";
import { createRoot } from "react-dom/client";
import NotesWorkspace from "./NotesWorkspace.jsx";
import { createNotesApi } from "./notes-api.js";
import "./styles.css";
createRoot(document.querySelector("#root")).render(<NotesWorkspace api={createNotesApi()} />);
