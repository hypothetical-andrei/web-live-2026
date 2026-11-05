// Selectează o vedere a colecției înainte să o codifici: filtrează, sortează o copie,
// apoi extrage o pagină limitată. Parametrii sunt șiruri neverificate, nu numere
// JavaScript.
export function selectTasks(tasks, query) {
  const allowed = ["q", "sort", "order", "offset", "limit"];
  if (Object.keys(query).some((key) => !allowed.includes(key))) return null;
  if (Object.values(query).some((value) => typeof value !== "string")) return null;
  const { q = "", sort = "title", order = "asc", offset = "0", limit = "2" } = query;
  if (sort !== "title" || !["asc", "desc"].includes(order)) return null;
  if (!/^(0|[1-9]\d*)$/.test(offset) || !/^[1-9]\d*$/.test(limit)) return null;
  const start = Number(offset);
  const size = Number(limit);
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(size) || size > 20)
    return null;

  const matching = tasks.filter((task) =>
    task.title.toLowerCase().includes(q.toLowerCase()),
  );
  const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  const direction = order === "asc" ? 1 : -1;
  // Folosește ID-ul pentru departajare stabilă; nu reordona colecția stocată.
  const sorted = [...matching].sort(
    (a, b) => direction * compare(a.title, b.title) || compare(a.id, b.id),
  );
  return {
    data: sorted.slice(start, start + size),
    meta: { total: matching.length, offset: start, limit: size },
  };
}

export function nextPageLink(originalUrl, meta) {
  if (meta.offset + meta.limit >= meta.total) return null;
  const url = new URL(originalUrl, "http://example.invalid");
  url.searchParams.set("offset", String(meta.offset + meta.limit));
  url.searchParams.set("limit", String(meta.limit));
  return `<${url.pathname}${url.search}>; rel="next"`;
}

export function toCsv(tasks) {
  const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
  return (
    "id,title\r\n" +
    tasks.map((task) => [task.id, task.title].map(quote).join(",") + "\r\n").join("")
  );
}
