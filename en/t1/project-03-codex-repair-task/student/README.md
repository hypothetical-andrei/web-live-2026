# Codex HTTP Repair Task

Run `npm install`, then use the separate test scripts to distinguish working
infrastructure from repair-specific failures. Start the service with `npm
start` and inspect responses with `curl -i`.

Inspect these three cases:

- `GET /api/clues` currently returns the right clue data but the wrong
  `Content-Type`;
- `POST /api/clues` with `{"text":"   "}` currently commits a `422` response
  and then crashes the connection because processing keeps going;
- `GET /api/clues/missing` currently returns the wrong public contract.

The bounded repair surface is `src/server.js` plus
`src/normalize-contract.js`. Do not rewrite the deliberately naive legacy
producer.
