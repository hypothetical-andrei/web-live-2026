# Query API

## Your task

Validate the API query parameters and translate the accepted values into Sequelize query options. Support the specified filtering, search, sorting, selected fields, and result limits.

Change only `src/note-query.js`. Read [the specification](../spec.md) for the exact requirements.

## Run and inspect

If a command starts a development server, leave it running and use another terminal for tests. Stop the server with Ctrl+C when finished.

```bash
npm install
npm start
npm test
```

Try `/api/notes?archived=false&sort=title_asc&fields=title,owner`. The development server uses an in-memory deterministic database.

## Checks before and after your changes

The `student/` version is deliberately incomplete. Some checks fail until you implement the task; consult the specification for the expected starting state. In the completed version, the required checks should pass. Run tests in a separate terminal while a development server is running.

Start with `npm run test:baseline` to check the supplied infrastructure. `npm run test:objective` checks the work you implement; its initial failures are expected. After implementation, run `npm test` and the browser/build/integration checks required by the specification.
