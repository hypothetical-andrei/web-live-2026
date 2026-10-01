import { after, before } from 'node:test';
import { createServer, listen } from '../src/server.js';

export function useServer() {
  let server;
  let baseUrl;

  before(async () => {
    server = createServer();
    baseUrl = await listen(server);
  });

  after(() => new Promise((resolve) => server.close(resolve)));

  return () => baseUrl;
}

export async function read(response) {
  return {
    status: response.status,
    location: response.headers.get('location'),
    contentType: response.headers.get('content-type')?.split(';', 1)[0] ?? null,
    body: await response.json(),
  };
}
