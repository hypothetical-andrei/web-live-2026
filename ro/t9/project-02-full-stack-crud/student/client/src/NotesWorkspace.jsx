import React, { useEffect, useRef, useState } from "react";

// Păstrați aceste primitive: spațiul de lucru finalizat trebuie să dețină un singur ciclu de
// reîmprospătare a serverului abandonabil/pentru cea mai recentă cerere și stare locală separată pentru formular/trimitere.
void [useEffect, useRef, useState];

export default function NotesWorkspace({ api: _api }) {
  return <main><h1>Notițe full-stack</h1><p role="status">Spațiul de lucru CRUD al clientului nu este implementat.</p></main>;
}
