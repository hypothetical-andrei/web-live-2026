import React, { useEffect, useState } from "react";

// Preserved weak evidence: mirrored data, unstable dependency, no cleanup/abort/latest guard.
export default function GeneratedSearchPanel({ search, debounceMs = 300, minimumLength = 2 }) {
  const [query, setQuery] = useState(""); const [results, setResults] = useState([]); const [filteredResults, setFilteredResults] = useState([]); const options = { limit: 5 };
  useEffect(() => { if (query.trim().length < minimumLength) return; setTimeout(async () => { try { const next = await search(query.trim(), options); setResults(next); setFilteredResults(next.filter((item) => item.title)); } catch { /* Generated code silently loses failures. */ } }, debounceMs); }, [query, search, debounceMs, minimumLength, options]);
  return <section><h1>Course search</h1><label htmlFor="generated-query">Search topics</label><input id="generated-query" value={query} onChange={(event) => setQuery(event.target.value)} /><p role="status">{filteredResults.length} results.</p><ul>{results.map((result) => <li key={result.id}>{result.title}</li>)}</ul></section>;
}
