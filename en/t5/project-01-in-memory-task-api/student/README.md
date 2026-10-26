# In-memory Task API

## Your task

Implement the task API routes for listing, creating, reading, updating, and deleting tasks. Validate requests and use the supplied repository to store the data.

Change only `src/task-router.js`. Read [the specification](../spec.md) for the exact requirements.

## Run and inspect

If a command starts a development server, leave it running and use another terminal for tests. Stop the server with Ctrl+C when finished.

Install and run:

```bash
npm install
npm start
```

The server prints its loopback URL. Open `/` for the resource summary or use `curl` against `/api/tasks`.

Run all checks with `npm test`; focused scripts are `test:baseline`, `test:objective`, and `test:regression`.

## Checks before and after your changes

The `student/` version is deliberately incomplete. Some checks fail until you implement the task; consult the specification for the expected starting state. In the completed version, the required checks should pass. Run tests in a separate terminal while a development server is running.

Start with `npm run test:baseline` to check the supplied infrastructure. `npm run test:objective` checks the work you implement; its initial failures are expected. After implementation, run `npm test` and the browser/build/integration checks required by the specification.
