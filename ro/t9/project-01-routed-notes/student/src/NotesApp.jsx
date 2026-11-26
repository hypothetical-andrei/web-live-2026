import React, { useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";

// Păstrați aceste primitive de ruter/formular: aplicația finalizată trebuie să derive pagina și
// identitatea notiței din URL, păstrând local valorile editabile.
// void [useState, Link, Navigate, useNavigate, useParams];

export default function NotesApp({ store: _store }) {
  return <Routes><Route path="*" element={<main><h1>Notițele cu rutare nu sunt implementate</h1><p role="status">Adăugați rutele și formularul comun pentru notițe descris în spec.md.</p></main>} /></Routes>;
}
