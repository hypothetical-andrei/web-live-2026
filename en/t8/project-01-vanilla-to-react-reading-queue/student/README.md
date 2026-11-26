# Vanilla-to-React Reading Queue

## Your task

Rebuild the supplied reading queue in React. Preserve its add, filter, and update behavior, keep state in the right component, and synchronize the required data with storage.

Change only `src/App.jsx`. Read [the specification](../spec.md) for the exact requirements.

## Run and inspect

If a command starts a development server, leave it running and use another terminal for tests. Stop the server with Ctrl+C when finished.

Run `npm install`, `npm test`, and `npm run build`. Use `npm run dev` for the React application; open `/vanilla/` through Vite to inspect the imperative comparison. You implement the React application in `src/App.jsx`.

## Checks before and after your changes

The `student/` version is deliberately incomplete. Some checks fail until you implement the task; consult the specification for the expected starting state. In the completed version, the required checks should pass. Run tests in a separate terminal while a development server is running.

Start with `npm run test:baseline` to check the supplied infrastructure. `npm run test:objective` checks the work you implement; its initial failures are expected. After implementation, run `npm test` and the browser/build/integration checks required by the specification.
