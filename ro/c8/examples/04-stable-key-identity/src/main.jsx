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
    setItems((current) => [{ id: crypto.randomUUID(), title: "Nou" }, ...current]);
  }
  return (
    <main>
      <h1>Identitate stabilă în listă</h1>
      <p>
        Editați un rând, apoi adăugați un element la început. Ciorna rămâne asociată
        ID-ului.
      </p>
      <button onClick={prepend}>Adaugă la început</button>
      <ul>
        {items.map((item) => (
          <EditableRow key={item.id} item={item} />
        ))}
      </ul>
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
