import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const topics = [
  {
    id: "props",
    title: "Props",
    level: "fundamental",
    summary: "Read-only input from a parent.",
  },
  {
    id: "state",
    title: "State",
    level: "fundamental",
    summary: "Data owned by a component.",
  },
];

function TopicCard({ title, level, children }) {
  return (
    <article>
      <h2>{title}</h2>
      <p>{children}</p>
      <small>{level}</small>
    </article>
  );
}
function TopicList({ items }) {
  return (
    <section aria-label="React topics">
      {items.map((topic) => (
        <TopicCard key={topic.id} title={topic.title} level={topic.level}>
          {topic.summary}
        </TopicCard>
      ))}
    </section>
  );
}
function App() {
  return (
    <main>
      <h1>React component tree</h1>
      <TopicList items={topics} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
