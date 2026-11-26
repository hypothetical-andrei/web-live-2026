import { fireEvent, getByRole, getByText } from "@testing-library/dom";
import { expect, it } from "vitest";
import { mountReadingQueue } from "../vanilla/reading-queue.js";
it("supplied vanilla evidence adds, filters, toggles, removes, and persists", () => {
  const root = document.createElement("div"); document.body.append(root); const writes = [];
  const queue = mountReadingQueue(root, { storage: { getItem: () => null, setItem: (_key, value) => writes.push(value) }, initialItems: [{ id: "1", title: "HTTP", read: false }], createItemId: () => "2" });
  fireEvent.input(getByRole(root, "textbox", { name: /book title/i }), { target: { value: " React " } }); fireEvent.submit(root.querySelector("form")); expect(queue.getItems()).toHaveLength(2);
  fireEvent.click(getByText(root, "Remaining (2)")); fireEvent.click(root.querySelector('[data-toggle="1"]')); expect(getByText(root, "Remaining (1)")).toBeTruthy(); fireEvent.click(root.querySelector('[data-remove="2"]')); expect(queue.getItems()).toHaveLength(1); expect(writes.length).toBe(3);
});
