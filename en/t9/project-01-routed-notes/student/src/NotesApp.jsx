import React, { useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";

// Keep these router/form primitives: the completed app must derive page and
// note identity from the URL while keeping editable values local.
// void [useState, Link, Navigate, useNavigate, useParams];

export default function NotesApp({ store: _store }) {
  return <Routes><Route path="*" element={<main><h1>Routed notes not implemented</h1><p role="status">Add the routes and shared note form described in spec.md.</p></main>} /></Routes>;
}
