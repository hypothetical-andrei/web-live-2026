import { useState } from "react";
import { createRoot } from "react-dom/client";

function EditableRow({ item }) {
  const [draft, setDraft] = useState(item.title);
  return (
    <li>
      <label>
        {item.id}{" "}
        <input value={draft} onChange={(event) => setDraft(event.target.value)} />
      </label>
    </li>
  );
}
function App() {
  const [items, setItems] = useState([
    { id: "b", title: "Beta" },
    { id: "c", title: "Gamma" },
  ]);
  function prepend() {
    setItems((current) => [{ id: crypto.randomUUID(), title: "New" }, ...current]);
  }
  return (
    <main>
      <h1>Stable list identity</h1>
      <p>Edit a row, then prepend an item. The draft stays with its ID.</p>
      <button onClick={prepend}>Prepend item</button>
      <ul>
        {items.map((item) => (
          <EditableRow key={item.id} item={item} />
        ))}
      </ul>
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
