import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function loadResult(query, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => resolve(`Result for ${query}`),
      query === "slow" ? 900 : 250,
    );
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}
function App() {
  const [query, setQuery] = useState("slow");
  const [status, setStatus] = useState("idle");
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    loadResult(query, controller.signal)
      .then(setStatus)
      .catch((error) => {
        if (error.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, [query]);
  return (
    <main>
      <h1>Effect cleanup</h1>
      <button onClick={() => setQuery("slow")}>Slow request</button>
      <button onClick={() => setQuery("fast")}>Fast request</button>
      <p aria-live="polite">{status}</p>
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
