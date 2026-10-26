# Middleware Pipeline

## Your task

Build an ordered list of Express middleware for report requests. Assign a request ID, measure duration, validate input, and record one completion log without running later handlers after rejection.

Change only `src/report-pipeline.js`. Read [the specification](../spec.md) for the exact requirements.

## Run and inspect

If a command starts a development server, leave it running and use another terminal for tests. Stop the server with Ctrl+C when finished.

```bash
npm install
npm start
npm test
```

The server prints a loopback URL. Send JSON reports to `POST /api/reports` and inspect `X-Request-Id`, `X-Response-Time-Ms`, and the structured completion log.

## Checks before and after your changes

The `student/` version is deliberately incomplete. Some checks fail until you implement the task; consult the specification for the expected starting state. In the completed version, the required checks should pass. Run tests in a separate terminal while a development server is running.

Start with `npm run test:baseline` to check the supplied infrastructure. `npm run test:objective` checks the work you implement; its initial failures are expected. After implementation, run `npm test` and the browser/build/integration checks required by the specification.
