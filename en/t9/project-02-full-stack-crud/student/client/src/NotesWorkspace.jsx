import React, { useEffect, useRef, useState } from "react";

// Keep these primitives: the completed workspace must own one abortable/latest
// server refresh lifecycle plus separate local form/submission state.
void [useEffect, useRef, useState];

export default function NotesWorkspace({ api: _api }) {
  return <main><h1>Full-stack notes</h1><p role="status">Client CRUD workspace not implemented.</p></main>;
}
