export function normalizeContract(operation, legacyResult) {
  if (operation === 'list') {
    const headers = Object.fromEntries(
      Object.entries(legacyResult.headers).filter(
        ([name]) => name.toLowerCase() !== 'content-type',
      ),
    );
    return {
      status: legacyResult.status,
      headers,
      body: legacyResult.body,
    };
  }
  if (operation === 'create') {
    return {
      status: legacyResult.status,
      headers: { ...legacyResult.headers },
      body: legacyResult.body,
    };
  }
  if (operation === 'missing') {
    return {
      status: 404,
      headers: {},
      body: {
        error: {
          code: 'clue_not_found',
          message: 'Indiciul nu a fost găsit',
        },
      },
    };
  }
  throw new Error(`operație necunoscută: ${operation}`);
}
