import { createServer as createNodeServer } from 'node:http';
import { produceLegacyResult } from './legacy-result.js';
import { normalizeContract } from './normalize-contract.js';

function sendJson(response, descriptor) {
  response.writeHead(descriptor.status, {
    'content-type': 'application/json; charset=utf-8',
    ...descriptor.headers,
  });
  response.end(JSON.stringify(descriptor.body));
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export function createServer() {
  return createNodeServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://localhost');
      if (request.method === 'GET' && url.pathname === '/health') {
        sendJson(response, { status: 200, headers: {}, body: { status: 'ok' } });
        return;
      }

      let operation;
      let input;
      if (request.method === 'GET' && url.pathname === '/api/clues') {
        operation = 'list';
      }
      if (request.method === 'GET' && url.pathname === '/api/clues/missing') {
        operation = 'missing';
      }
      if (request.method === 'POST' && url.pathname === '/api/clues') {
        operation = 'create';
        try {
          input = await readJson(request);
        } catch {
          sendJson(response, {
            status: 400,
            headers: {},
            body: {
              error: {
                code: 'invalid_json',
                message: 'Corpul cererii trebuie să fie JSON valid',
              },
            },
          });
          return;
        }

        const text = input?.text?.trim();
        if (!text) {
          // TODO: oprește execuția după trimiterea răspunsului de validare.
          response.writeHead(422, {
            'content-type': 'application/json; charset=utf-8',
          });
          response.destroy(new Error('headerele au fost deja trimise'));
        }

        if (text) {
          input = { text };
        }
      }

      if (!operation) {
        sendJson(response, {
          status: 404,
          headers: {},
          body: {
            error: {
              code: 'not_found',
              message: 'Ruta nu a fost găsită',
            },
          },
        });
        return;
      }

      sendJson(response, normalizeContract(operation, produceLegacyResult(operation, input)));
    } catch {
      if (!response.headersSent) {
        sendJson(response, {
          status: 500,
          headers: {},
          body: {
            error: {
              code: 'internal_error',
              message: 'Eroare internă de server',
            },
          },
        });
      } else {
        response.destroy();
      }
    }
  });
}

export async function listen(server, port = 0) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
  return `http://127.0.0.1:${server.address().port}`;
}
