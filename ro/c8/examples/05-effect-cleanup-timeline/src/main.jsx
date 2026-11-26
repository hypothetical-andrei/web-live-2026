import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

function loadResult(query, signal) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => resolve(`Rezultat pentru ${query}`),
      query === "slow" ? 900 : 250,
    );
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Anulat", "AbortError"));
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
      <h1>Curățarea efectului</h1>
      <button onClick={() => setQuery("slow")}>Cerere lentă</button>
      <button onClick={() => setQuery("fast")}>Cerere rapidă</button>
      <p aria-live="polite">{status}</p>
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
