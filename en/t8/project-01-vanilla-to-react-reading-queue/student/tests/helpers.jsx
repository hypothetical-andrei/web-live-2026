import React from "react";
import { render } from "@testing-library/react";
import ReadingQueue from "../src/App.jsx";
export const fixtures = [{ id: "a", title: "HTTP", read: false }, { id: "b", title: "SQLite", read: true }];
export function memoryStorage(value = null) { let stored = value; const writes = []; return { getItem: () => stored, setItem: (_key, next) => { stored = next; writes.push(next); }, writes, value: () => stored }; }
export function renderQueue(options = {}) { const storage = options.storage ?? memoryStorage(); let next = 0; const view = render(<ReadingQueue storage={storage} initialItems={options.initialItems ?? fixtures} createItemId={options.createItemId ?? (() => `new-${++next}`)} />); return { ...view, storage }; }
