# Lecture Example — Effect Cleanup Timeline

## Concept demonstrated

Synchronization needs an owner, cleanup, and a latest-work identity; abort signaling alone does not guarantee that an old promise will never settle.

## Why this example is in the lecture

A rendered Vite app runs the synchronization from `useEffect`; changing its dependency triggers real cleanup and replacement setup.

## What to observe

- Starting new work aborts the previous controller.
- Each start receives a monotonically increasing identity.
- The latest promise publishes first.
- The old promise is deliberately resolved afterward but cannot publish.

## Run / inspect

```bash
npm install
npm run dev
npm run build
```

## Explanation

The effect creates one `AbortController` for its dependency value and returns cleanup that aborts that exact operation before another effect owns synchronization.

## Variations

- Add a control that unmounts the synchronized component and observe cleanup.
- Call the returned cleanup on unmount before either promise settles.

## Validation

Validated with a clean install and `npm run build`; switch from slow to fast work and inspect cleanup in the Vite application.
