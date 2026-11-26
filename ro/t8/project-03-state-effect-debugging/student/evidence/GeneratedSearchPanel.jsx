import React, { useEffect, useState } from "react";

// Dovadă fragilă păstrată: date oglindite, dependență instabilă, fără protecție pentru curățare/abandonare/cea mai recentă cerere.
export default function GeneratedSearchPanel({ search, debounceMs = 300, minimumLength = 2 }) {
  const [query, setQuery] = useState(""); const [results, setResults] = useState([]); const [filteredResults, setFilteredResults] = useState([]); const options = { limit: 5 };
  useEffect(() => { if (query.trim().length < minimumLength) return; setTimeout(async () => { try { const next = await search(query.trim(), options); setResults(next); setFilteredResults(next.filter((item) => item.title)); } catch { /* Codul generat pierde silențios eșecurile. */ } }, debounceMs); }, [query, search, debounceMs, minimumLength, options]);
  return <section><h1>Căutare în curs</h1><label htmlFor="generated-query">Caută subiecte</label><input id="generated-query" value={query} onChange={(event) => setQuery(event.target.value)} /><p role="status">{filteredResults.length} rezultate.</p><ul>{results.map((result) => <li key={result.id}>{result.title}</li>)}</ul></section>;
}
