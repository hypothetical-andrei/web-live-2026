export const responses = {
  created: {
    status: 201,
    headers: {
      "content-type": "application/json",
      location: "/api/notes/n-7",
    },
    body: { data: { id: "n-7", text: "Read diff" } },
  },
  invalid: {
    status: 400,
    headers: { "content-type": "application/json" },
    body: { error: { code: "text_required", message: "Text is required" } },
  },
  missing: {
    status: 404,
    headers: { "content-type": "application/json" },
    body: { error: { code: "note_not_found", message: "Note not found" } },
  },
};
