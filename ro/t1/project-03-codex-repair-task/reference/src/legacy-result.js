export function produceLegacyResult(operation, input) {
  if (operation === 'list') {
    return {
      status: 200,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
      body: { data: [{ id: 'clue-1', text: 'crumbs' }] },
    };
  }
  if (operation === 'create') {
    return {
      status: 201,
      headers: { location: '/api/clues/clue-2' },
      body: { data: { id: 'clue-2', text: input.text } },
    };
  }
  if (operation === 'missing') {
    return {
      status: 200,
      headers: {},
      body: { clue: null, message: 'Indiciu lipsă' },
    };
  }
  throw new Error(`operație necunoscută: ${operation}`);
}
