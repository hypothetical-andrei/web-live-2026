import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import NotesApp from "../src/NotesApp.jsx";
import { createNotesStore } from "../src/notes-store.js";
export function LocationProbe() { const location = useLocation(); return <output aria-label="Current path">{location.pathname}</output>; }
export function NavigationProbe() { const navigate = useNavigate(); return <><button onClick={() => navigate(-1)}>History back</button><button onClick={() => navigate("/notes/2/edit")}>Edit second</button></>; }
export function renderApp({ store = createNotesStore(), entries = ["/notes"], index } = {}) { return { store, ...render(<MemoryRouter initialEntries={entries} initialIndex={index}><LocationProbe /><NavigationProbe /><NotesApp store={store} /></MemoryRouter>) }; }
