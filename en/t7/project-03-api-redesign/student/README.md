# Registration API Redesign

## Your task

Replace the action-based registration routes with the specified resource URLs. Validate filters and pagination, and make repeated membership requests produce the required stable result.

Change only `src/registration-router.js`. Read [the specification](../spec.md) for the exact requirements.

## Run and inspect

If a command starts a development server, leave it running and use another terminal for tests. Stop the server with Ctrl+C when finished.

Run `npm install`, `npm test`, then `npm start` (default port `3000`). The API is mounted at `/api/sessions/:sessionId/registrations`; `public/index.html` compares its resource contract with the deliberately unmounted naive action router.

## Checks before and after your changes

The `student/` version is deliberately incomplete. Some checks fail until you implement the task; consult the specification for the expected starting state. In the completed version, the required checks should pass. Run tests in a separate terminal while a development server is running.

Start with `npm run test:baseline` to check the supplied infrastructure. `npm run test:objective` checks the work you implement; its initial failures are expected. After implementation, run `npm test` and the browser/build/integration checks required by the specification.
