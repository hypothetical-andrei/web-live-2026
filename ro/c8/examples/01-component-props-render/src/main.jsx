import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const topics = [
  {
    id: "props",
    title: "Props",
    level: "fundamental",
    summary: "Date de intrare doar în citire de la părinte.",
  },
  {
    id: "state",
    title: "Stare",
    level: "fundamental",
    summary: "Date deținute de o componentă.",
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
    <section aria-label="Subiecte React">
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
      <h1>Arbore de componente React</h1>
      <TopicList items={topics} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
