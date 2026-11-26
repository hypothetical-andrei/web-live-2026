import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import GeneratedSearchPanel from "../evidence/GeneratedSearchPanel.jsx";
import { deferredSearch } from "./helpers.jsx";
beforeEach(() => vi.useFakeTimers()); afterEach(() => vi.useRealTimers());
it("dovada generată păstrată permite unui răspuns vechi să înlocuiască rezultatele noi", async () => { const pending = deferredSearch(); const view = render(<GeneratedSearchPanel search={pending.search} debounceMs={100} minimumLength={2} />); const input = view.getByRole("textbox"); fireEvent.change(input, { target: { value: "vechi" } }); await act(() => vi.advanceTimersByTimeAsync(100)); fireEvent.change(input, { target: { value: "nou" } }); await act(() => vi.advanceTimersByTimeAsync(100)); const oldCall = pending.calls.find((call) => call.query === "vechi"); const newCall = pending.calls.findLast((call) => call.query === "nou"); await act(async () => newCall.resolve([{ id: "n", title: "Rezultat nou" }])); expect(view.getByText("Rezultat nou")).toBeInTheDocument(); await act(async () => oldCall.resolve([{ id: "o", title: "Rezultat vechi" }])); expect(view.getByText("Rezultat vechi")).toBeInTheDocument(); });
