import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes, useParams } from "react-router-dom";

function NoteDetail() {
  const { noteId } = useParams();
  return <p id="route-state">Note detail route: {noteId}</p>;
}

function RoutedFixture() {
  return <main>
    <h1>Routed notes</h1>
    <nav><Link to="/notes">Notes</Link></nav>
    <Routes>
      <Route path="/" element={<p id="route-state">Home route</p>} />
      <Route path="/notes" element={<p id="route-state">Notes list route</p>} />
      <Route path="/notes/:noteId" element={<NoteDetail />} />
      <Route path="*" element={<p id="route-state">Client route not found</p>} />
    </Routes>
  </main>;
}

createRoot(document.querySelector("#root")).render(<BrowserRouter><RoutedFixture /></BrowserRouter>);
