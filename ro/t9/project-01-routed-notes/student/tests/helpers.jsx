import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import NotesApp from "../src/NotesApp.jsx";
import { createNotesStore } from "../src/notes-store.js";
export function LocationProbe() { const location = useLocation(); return <output aria-label="Calea curentă">{location.pathname}</output>; }
export function NavigationProbe() { const navigate = useNavigate(); return <><button onClick={() => navigate(-1)}>Înapoi în istoric</button><button onClick={() => navigate("/notes/2/edit")}>Editează a doua notiță</button></>; }
export function renderApp({ store = createNotesStore(), entries = ["/notes"], index } = {}) { return { store, ...render(<MemoryRouter initialEntries={entries} initialIndex={index}><LocationProbe /><NavigationProbe /><NotesApp store={store} /></MemoryRouter>) }; }
