# Multiple and nested includes

## Concept demonstrated

Load conference and attendees as sibling associations, then load each attendee’s profile inside the attendee include.

## What to observe

The HTTP session has Ana with a profile and Dan without one; CSS has no attendees. Assertions check both loaded data and the null/empty optional relationships.

## Run / inspect

```bash
npm ci
npm test
```

## Explanation and limits

An include array loads several relationships from the current model. An include inside one array entry goes one level deeper. Aliases must match the associations at each level. through.attributes hides junction fields from this view; it does not remove the junction or its constraints. The deliberately small graph is suitable for inspection; adding collections can multiply SQL rows.

## Variations

Predict the result if the nested profile include is removed.

## Validation

On 2026-11-11, clean offline npm ci and npm test passed on Node 24.5.0 with the locked dependencies. Checks use real SQLite; HTTP examples send real loopback requests.
