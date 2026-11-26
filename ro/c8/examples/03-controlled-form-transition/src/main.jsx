import { useState } from "react";
import { createRoot } from "react-dom/client";

function App() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  function submit(event) {
    event.preventDefault();
    const normalized = title.trim();
    if (!normalized) return setError("Introduceți un titlu.");
    setNotes((current) => [...current, { id: crypto.randomUUID(), title: normalized }]);
    setTitle("");
    setError("");
  }
  return (
    <main>
      <h1>Formular controlat pentru notițe</h1>
      <form onSubmit={submit}>
        <label>
          Titlu <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <button type="submit">Adaugă notița</button>
        {error && <p role="alert">{error}</p>}
      </form>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.title}</li>
        ))}
      </ul>
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
