# Lecture Example — Serialization at the REST boundary

The database model stores timestamps and an internal review field, but the public REST representation deliberately exposes only `id`, `title`, `archived`, and a resource link. The serializer starts from `instance.get({ plain: true })` and constructs an explicit API contract rather than returning the live model instance.

```bash
npm install
npm test
npm start
curl -i http://localhost:3000/api/notes/1
```

Changing the table does not automatically change the API. Update the serializer only when the public representation should change.

Revalidated on 2026-10-26: clean npm ci and npm test pass on Node 24.5.0 against real Sequelize/SQLite operations; HTTP examples also use actual loopback requests.

### Direct execution and console output

Run `npm start` after `npm ci`. The console explains the steps and observed results. Server examples accept `PORT` (default 3000); startup output lists requests to try. SQLite is in memory and resets on restart.
