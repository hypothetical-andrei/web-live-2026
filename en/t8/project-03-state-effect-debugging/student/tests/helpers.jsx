import React from "react";
import { render } from "@testing-library/react";
import SearchPanel from "../src/SearchPanel.jsx";
export function deferredSearch() { const calls = []; const search = (query, options) => new Promise((resolve, reject) => calls.push({ query, options, resolve, reject })); return { search, calls }; }
export function renderPanel({ search, debounceMs = 100, minimumLength = 2, onUnexpectedError = () => {} }) { return render(<SearchPanel search={search} debounceMs={debounceMs} minimumLength={minimumLength} onUnexpectedError={onUnexpectedError} />); }
