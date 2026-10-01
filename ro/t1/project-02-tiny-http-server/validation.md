# Validation Record — Tiny HTTP Server

## Reference validation

- [x] Clean dependency install succeeds.
- [ ] Documented start command was not revalidated in this managed sandbox because direct loopback binding raised `listen EPERM` on `127.0.0.1`.
- [x] Baseline checks pass.
- [x] Objective checks pass.
- [x] Regression checks pass.
- [x] Observable completion criteria are satisfied by the automated route checks and the inspected reference behavior.

### Commands / results

- `npm install` — up to date, audited 1 package, 0 vulnerabilities.
- `npm test` — 8/8 passed:
  2 baseline checks, 2 objective checks, 4 regression checks.
- `npm start` — blocked in this managed sandbox with `listen EPERM: operation not permitted 127.0.0.1`.

Automated coverage in the passing reference suite included:

- file serving for `/` and `/assets/site.css`;
- query-based processing for `GET /api/greetings?name=...`;
- path-based processing for `GET /api/greetings/<name>`;
- body-based processing for `POST /api/echo`;
- fallback and post-failure health behavior.

## Student validation

- [x] Student version was copied/derived from the validated reference.
- [x] Clean dependency install succeeds.
- [x] Required baseline behavior works.
- [x] Unrelated regression checks pass.
- [x] Objective checks fail or remain incomplete exactly as documented.
- [x] No accidental solution leakage was found.
- [x] Reference/student delta matches `derivation.md`.

### Commands / results

- `npm install` — up to date, audited 1 package, 0 vulnerabilities.
- `npm run test:baseline` — 2/2 passed.
- `npm run test:regression` — 4/4 passed.
- `npm run test:objective` — 0/2 passed.
  Both failing checks showed the missing path route returning the supplied
  `404 { "error": "not_found" }` fallback instead of the expected handled
  response.
- `diff -qr reference student` — differs intentionally in:
  `README.md` and `src/application-handler.js`.
- Leakage search — the removed path-route implementation is absent outside the
  reference; tests disclose only the public behavior contract.

## Exceptions

Direct `npm start` validation could not be completed inside this managed
sandbox because direct loopback binding raised `listen EPERM`. The automated
test suites still exercised the route contract successfully in this
environment.
