# Lecture Example — Sequelize CRUD through Express

This Notes API performs create, ordered read, partial update, and delete operations against SQLite. Every persistence promise is awaited before the response is completed. Central Express error middleware maps Sequelize validation to `400`, uniqueness conflicts to `409`, and hides unexpected details.

```bash
npm install
npm test
npm start
```

```bash
curl -i -X POST http://localhost:3000/api/notes -H 'content-type: application/json' -d '{"title":"Stored note"}'
curl -i http://localhost:3000/api/notes
curl -i -X PATCH http://localhost:3000/api/notes/1 -H 'content-type: application/json' -d '{"archived":true}'
curl -i -X DELETE http://localhost:3000/api/notes/1
```

This example isolates awaiting model operations and mapping errors. It uses an in-memory database; file-backed storage and startup policy are discussed in lecture sections 7 and 15–17. The list/create routes serialize model instances automatically here to keep CRUD visible; example 05 then replaces that with explicit public fields. A malformed JSON body maps to 400 rather than a persistence 500. This is not a complete HTTP input-validation implementation.

Revalidated on 2026-10-26: clean npm ci and npm test pass on Node 24.5.0 against real Sequelize/SQLite operations; HTTP examples also use actual loopback requests.

### Direct execution and console output

Run `npm start` after `npm ci`. The console explains the steps and observed results. Server examples accept `PORT` (default 3000); startup output lists requests to try. SQLite is in memory and resets on restart.
