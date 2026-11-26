export function createSafeStorage(storage, onError = console.error) {
  return { getItem(key) { try { return storage.getItem(key); } catch (error) { onError(error); return null; } }, setItem(key, value) { try { storage.setItem(key, value); } catch (error) { onError(error); } } };
}
