# Lecture Example — Express request flow

## Concept demonstrated

An Express request traverses middleware and one matching route before response completion, while static resources and API resources can share the same application.

## Why this example is in the lecture

One HTML file, one API route, and one observer make mounting order visible without introducing CRUD or validation.

## What to observe

- The observer runs before both static and API handlers.
- Only the `/api/ping` route creates the JSON response.
- The `finish` event occurs after the route has produced its response.
- `/` and `/api/ping` are different resources served by one app.

## Run / inspect

```bash
npm ci
npm test
npm start
```

Leave the server running and open http://127.0.0.1:3000/ in a browser. In another terminal, run `curl http://127.0.0.1:3000/api/ping`. Watch the before/route/finish events in the server terminal. Stop with Ctrl+C. To choose another port, use `PORT=3001 npm start`.

## Explanation

`app.js` records a before/finish pair around downstream handling. `express.static` owns the page; the explicit route owns API JSON. The check starts an ephemeral loopback server and verifies both resources and their event order.

## Variations

- Move `express.static` after the not-found middleware and inspect the page failure.
- Add a second observer after the static mount and compare which requests reach it.

## Validation

Validated with `npm install` and `npm test`; both resources and exact middleware/finish sequences pass.

Revalidated on 2026-10-26: clean install and real HTTP checks pass on Node 24.5.0.
