export const initialNotes = [
  { id: "1", title: "URL state", body: "The address identifies the current screen." },
  { id: "2", title: "Controlled forms", body: "React state owns editable values." },
];
export function createNotesStore(seed = initialNotes) {
  let notes = structuredClone(seed); let nextId = 3;
  return {
    list: () => structuredClone(notes),
    get: (id) => structuredClone(notes.find((note) => note.id === String(id)) ?? null),
    create(input) { const note = { id: String(nextId++), ...structuredClone(input) }; notes = [...notes, note]; return structuredClone(note); },
    update(id, input) { const index = notes.findIndex((note) => note.id === String(id)); if (index < 0) return null; const note = { ...notes[index], ...structuredClone(input), id: notes[index].id }; notes = notes.map((current, position) => position === index ? note : current); return structuredClone(note); },
  };
}
