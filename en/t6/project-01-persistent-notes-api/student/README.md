# Persistent Notes API

## Your task

Implement the supplied note-store interface using Sequelize and SQLite. Save changes before reporting success, preserve notes across restarts, and close the database when finished.

Change only `src/note-store.js`. Read [the specification](../spec.md) for the exact requirements.

## Run and inspect

If a command starts a development server, leave it running and use another terminal for tests. Stop the server with Ctrl+C when finished.

In the initial student version, `npm start` stops at the unfinished store initialization. Run the baseline tests first; start the real API after implementing the store.

```bash
npm install
npm start
npm test
```

By default the server uses `notes.sqlite` in the project directory. Set `NOTES_STORAGE` to another file and `RESET_DB=true` only when an intentional reset is required. Tests use isolated temporary or in-memory databases.

## Checks before and after your changes

The `student/` version is deliberately incomplete. Some checks fail until you implement the task; consult the specification for the expected starting state. In the completed version, the required checks should pass. Run tests in a separate terminal while a development server is running.

Start with `npm run test:baseline` to check the supplied infrastructure. `npm run test:objective` checks the work you implement; its initial failures are expected. After implementation, run `npm test` and the browser/build/integration checks required by the specification.
