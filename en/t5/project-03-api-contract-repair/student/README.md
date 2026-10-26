# Meeting API Repair — runnable project

## Your task

Repair the meeting API so every request gets the documented response. Correct status codes, response bodies, validation, and error handling without changing the data store.

Change only `src/meeting-router.js`. Read [the specification](../spec.md) for the exact requirements.

## Run and inspect

If a command starts a development server, leave it running and use another terminal for tests. Stop the server with Ctrl+C when finished.

Run `npm ci`, `npm start`, and open the printed loopback URL. The store resets on restart. Meeting `m2` is already accepted; `m1` is pending.

Run `npm run test:baseline`, `npm run test:regression`, and `npm run test:objective`. All checks pass in the reference. In the starter, four objective tests fail; baseline and regression checks pass. The missing-meeting request is intentionally unfinished until repaired. Use a timeout for manual requests, such as `curl --max-time 2`.

Edit only `src/meeting-router.js`. Do not change the tests, store, app, or dependencies.

## Checks before and after your changes

The `student/` version is deliberately incomplete. Some checks fail until you implement the task; consult the specification for the expected starting state. In the completed version, the required checks should pass. Run tests in a separate terminal while a development server is running.

Start with `npm run test:baseline` to check the supplied infrastructure. `npm run test:objective` checks the work you implement; its initial failures are expected. After implementation, run `npm test` and the browser/build/integration checks required by the specification.
