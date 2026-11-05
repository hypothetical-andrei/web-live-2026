export function createUnavailableStore() {
  const unavailable = async () => {
    throw new Error("depozitul de notițe nu este implementat");
  };
  return {
    initialize: unavailable,
    list: unavailable,
    findById: unavailable,
    create: unavailable,
    update: unavailable,
    remove: unavailable,
    close: async () => {},
  };
}

export function createNoteStore({ storage: _storage, logging: _logging = false }) {
  // TODO: definește conexiunea/modelul Sequelize și implementează contractul depozitului.
  return createUnavailableStore();
}
