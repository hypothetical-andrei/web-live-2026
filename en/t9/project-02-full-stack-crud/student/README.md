# Full-Stack Notes CRUD

## Your task

Build the React interface for the supplied notes API. Load, create, edit, delete, and refresh notes; update displayed server data only after the API confirms the result.

Change only `client/src/NotesWorkspace.jsx`. Read [the specification](../spec.md) for the exact requirements.

## Run and inspect

If a command starts a development server, leave it running and use another terminal for tests. Stop the server with Ctrl+C when finished.

Run `npm install`, `npm test`, and `npm run build`. Start the API with `npm start` and Vite with `npm run dev`; the proxy connects `/api` to port 3000. The client objective is isolated in `client/src/NotesWorkspace.jsx`.

The supplied Express backend uses Sequelize with SQLite. `npm start` stores notes in `data/notes.sqlite`; set `SQLITE_STORAGE` to choose another file. Startup creates missing tables and seeds an empty database without resetting existing notes. Stop the server with Ctrl+C to close its database connection. Tests use isolated databases; `npm run test:server` checks persistence across reopen, validation and test-only reset. Use Node.js LTS (24 recommended).

## Checks before and after your changes

The `student/` version is deliberately incomplete. Some checks fail until you implement the task; consult the specification for the expected starting state. In the completed version, the required checks should pass. Run tests in a separate terminal while a development server is running.

Start with `npm run test:baseline` to check the supplied infrastructure. `npm run test:objective` checks the work you implement; its initial failures are expected. After implementation, run `npm test` and the browser/build/integration checks required by the specification.
