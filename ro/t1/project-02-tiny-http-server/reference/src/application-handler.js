import { readJsonBody, sendJson } from './http-utils.js';

// Return true only when this handler owns the route so the outer server can keep its fallback behavior.
export async function handleApplicationRequest(request, response, url) {
  if (request.method === 'GET' && url.pathname === '/api/greetings') {
    const name = url.searchParams.get('name')?.trim();
    if (!name) {
      sendJson(response, 400, { error: 'name_required' });
      return true;
    }
    sendJson(response, 200, { message: `Hello, ${name}!`, source: 'query' });
    return true;
  }

  const greetingPrefix = '/api/greetings/';
  if (request.method === 'GET' && url.pathname.startsWith(greetingPrefix)) {
    const encodedName = url.pathname.slice(greetingPrefix.length);
    if (encodedName.includes('/')) {
      return false;
    }

    const name = decodeURIComponent(encodedName).trim();
    if (!name) {
      sendJson(response, 400, { error: 'name_required' });
      return true;
    }

    sendJson(response, 200, { message: `Hello, ${name}!`, source: 'path' });
    return true;
  }

  if (request.method === 'POST' && url.pathname === '/api/echo') {
    const mediaType = request.headers['content-type']?.split(';', 1)[0].trim().toLowerCase();
    if (mediaType !== 'application/json') {
      sendJson(response, 415, { error: 'json_required' });
      return true;
    }

    try {
      const body = await readJsonBody(request);
      sendJson(response, 201, body, { 'x-echoed-method': 'POST' });
    } catch {
      sendJson(response, 400, { error: 'invalid_json' });
    }
    return true;
  }

  return false;
}
