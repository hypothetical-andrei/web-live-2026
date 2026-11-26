import { useState } from "react";
import { createRoot } from "react-dom/client";

const initialTasks = [
  { id: 1, title: "Read about state", done: false },
  { id: 2, title: "Derive the view", done: true },
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
      <h1>Tasks</h1>
      <p>{remaining} remaining</p>
      <label>
        Show{" "}
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">all</option>
          <option value="open">open</option>
          <option value="done">done</option>
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
