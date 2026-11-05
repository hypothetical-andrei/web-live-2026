export function createUnavailableStore() {
  const unavailable = async () => {
    throw new Error("note store is not implemented");
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
  // TODO: define the Sequelize connection/model and implement the store contract.
  return createUnavailableStore();
}
