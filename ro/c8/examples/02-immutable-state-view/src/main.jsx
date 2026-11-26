import { useState } from "react";
import { createRoot } from "react-dom/client";

const initialTasks = [
  { id: 1, title: "Citește despre stare", done: false },
  { id: 2, title: "Derivă vizualizarea", done: true },
];
function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("all");
  const visible = tasks.filter(
    (task) => filter === "all" || task.done === (filter === "done"),
  );
  const remaining = tasks.filter((task) => !task.done).length;
  function toggle(id) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }
  return (
    <main>
      <h1>Sarcini</h1>
      <p>{remaining} rămase</p>
      <label>
        Arată{" "}
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">toate</option>
          <option value="open">deschise</option>
          <option value="done">finalizate</option>
        </select>
      </label>
      <ul>
        {visible.map((task) => (
          <li key={task.id}>
            <label>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggle(task.id)}
              />{" "}
              {task.title}
            </label>
          </li>
        ))}
      </ul>
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
