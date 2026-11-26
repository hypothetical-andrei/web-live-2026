# Deep-Link Failure Repair

## Your task

Repair the production server so opening a React route directly loads the application. Preserve API errors and genuine missing-file responses instead of returning HTML for every request.

Change only `server/create-production-app.js`. Read [the specification](../spec.md) for the exact requirements.

## Run and inspect

If a command starts a development server, leave it running and use another terminal for tests. Stop the server with Ctrl+C when finished.

This production fixture separates real files, API routes, and eligible SPA navigations. The client is already built; the exercise concerns Express delivery policy.

```sh
npm install
npm test
npm start
```

With the server running, compare `/notes/42`, `/assets/app-a1b2c3.js`, `/assets/missing.js`, and `/api/missing` using explicit `Accept` headers. Set `CLIENT_DIRECTORY` to exercise another built directory; the default is `client-dist`.

## Checks before and after your changes

The `student/` version is deliberately incomplete. Some checks fail until you implement the task; consult the specification for the expected starting state. In the completed version, the required checks should pass. Run tests in a separate terminal while a development server is running.

Start with `npm run test:baseline` to check the supplied infrastructure. `npm run test:objective` checks the work you implement; its initial failures are expected. After implementation, run `npm test` and the browser/build/integration checks required by the specification.
