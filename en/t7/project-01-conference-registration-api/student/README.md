# Conference Registration API

## Your task

Define the conference, session, attendee, and registration relationships in Sequelize. Implement the required reads while keeping foreign keys, registration fields, and query counts correct.

Change only `src/conference-model.js`. Read [the specification](../spec.md) for the exact requirements.

## Run and inspect

If a command starts a development server, leave it running and use another terminal for tests. Stop the server with Ctrl+C when finished.

```bash
npm install
npm start
npm test
```

The development server seeds an in-memory conference database. Inspect `/api/conferences/1/sessions` and create registrations under `/api/sessions/:sessionId/registrations`.

## Checks before and after your changes

The `student/` version is deliberately incomplete. Some checks fail until you implement the task; consult the specification for the expected starting state. In the completed version, the required checks should pass. Run tests in a separate terminal while a development server is running.

Start with `npm run test:baseline` to check the supplied infrastructure. `npm run test:objective` checks the work you implement; its initial failures are expected. After implementation, run `npm test` and the browser/build/integration checks required by the specification.
