import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Link, Route, Routes, useParams } from "react-router-dom";

function NoteDetail() {
  const { noteId } = useParams();
  return <p id="route-state">Rută de detaliu a notiței: {noteId}</p>;
}

function RoutedFixture() {
  return <main>
    <h1>Notițe rutate</h1>
    <nav><Link to="/notes">Notițe</Link></nav>
    <Routes>
      <Route path="/" element={<p id="route-state">Ruta principală</p>} />
      <Route path="/notes" element={<p id="route-state">Ruta listei de notițe</p>} />
      <Route path="/notes/:noteId" element={<NoteDetail />} />
      <Route path="*" element={<p id="route-state">Ruta clientului nu a fost găsită</p>} />
    </Routes>
  </main>;
}

createRoot(document.querySelector("#root")).render(<BrowserRouter><RoutedFixture /></BrowserRouter>);
