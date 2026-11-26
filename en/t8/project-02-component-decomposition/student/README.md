# Component Decomposition

## Your task

Split the supplied large dashboard into the required smaller components. Pass data and callbacks through props and preserve the page's existing behavior.

Change only `src/WorkshopDashboard.jsx`, `src/components/*.jsx`. Read [the specification](../spec.md) for the exact requirements.

## Run and inspect

If a command starts a development server, leave it running and use another terminal for tests. Stop the server with Ctrl+C when finished.

Run `npm install`, `npm test`, and `npm run build`; use `npm run dev` for the dashboard. `evidence/OversizedWorkshopDashboard.jsx` is preserved complete comparison input and is never mounted by the supplied entry.

## Checks before and after your changes

The `student/` version is deliberately incomplete. Some checks fail until you implement the task; consult the specification for the expected starting state. In the completed version, the required checks should pass. Run tests in a separate terminal while a development server is running.

Start with `npm run test:baseline` to check the supplied infrastructure. `npm run test:objective` checks the work you implement; its initial failures are expected. After implementation, run `npm test` and the browser/build/integration checks required by the specification.
