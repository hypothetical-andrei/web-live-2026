import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import NotesApp from "./NotesApp.jsx";
import { createNotesStore } from "./notes-store.js";
import "./styles.css";
createRoot(document.querySelector("#root")).render(<BrowserRouter><NotesApp store={createNotesStore()} /></BrowserRouter>);
