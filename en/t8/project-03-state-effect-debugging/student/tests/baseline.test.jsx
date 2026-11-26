import React from "react";
import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import GeneratedSearchPanel from "../evidence/GeneratedSearchPanel.jsx";
import { deferredSearch } from "./helpers.jsx";
beforeEach(() => vi.useFakeTimers()); afterEach(() => vi.useRealTimers());
it("preserved generated evidence allows an older response to replace newer results", async () => { const pending = deferredSearch(); const view = render(<GeneratedSearchPanel search={pending.search} debounceMs={100} minimumLength={2} />); const input = view.getByRole("textbox"); fireEvent.change(input, { target: { value: "old" } }); await act(() => vi.advanceTimersByTimeAsync(100)); fireEvent.change(input, { target: { value: "new" } }); await act(() => vi.advanceTimersByTimeAsync(100)); const oldCall = pending.calls.find((call) => call.query === "old"); const newCall = pending.calls.findLast((call) => call.query === "new"); await act(async () => newCall.resolve([{ id: "n", title: "New result" }])); expect(view.getByText("New result")).toBeInTheDocument(); await act(async () => oldCall.resolve([{ id: "o", title: "Old result" }])); expect(view.getByText("Old result")).toBeInTheDocument(); });
