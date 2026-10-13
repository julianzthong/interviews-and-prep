# fleet-katas

TypeScript practice problems for a connected-device backend interview.
Each kata has a stub in `src/` and tests in `test/`. Write the code yourself:
no AI help, a timer running, and talk out loud as if someone's watching.

```bash
npm install
npm run test:watch   # re-runs tests on save
npm run typecheck
```

Run a single kata with `npx vitest run 01`.

| # | Kata | Target | What it practices |
|---|------|--------|-------------------|
| 01 | Telemetry ingest | 25 min | Dedupe, out-of-order messages, per-device state |
| 02 | Device shadow | 30 min | Desired/reported/delta, optimistic concurrency, defensive copies |
| 03 | Staged rollout | 35 min | Async concurrency with Promise.all, error handling, abort logic |
| 04 | Retry with backoff | 20 min | Generics, async control flow, dependency injection for testability |
| 05 | HTTP API (stretch) | 40 min | Express wiring, status codes, validation |

## Kata 05 (stretch, no tests): wrap the shadow in an API

Add Express and expose `ShadowStore` over HTTP:

- `GET /devices/:id/shadow` returns the shadow plus its delta.
- `PUT /devices/:id/shadow/desired` takes `{ patch, expectedVersion? }`.
  Return 409 on a version conflict and 400 on an invalid body.
- `POST /devices/:id/shadow/reported` takes `{ patch }`.

## After each kata, answer these out loud

These are the follow-ups an interviewer will ask once your tests pass.

- **01:** The dedupe set grows forever. How do you bound it? What breaks if a
  device reboots and its seq resets to 0? How does this change with 10 instances
  of the service behind a load balancer?
- **02:** Where does this state live in production, and how do you make the
  version check atomic in Postgres? Who wins if the app and device write at once?
- **03:** What if one device's update hangs forever? How do you bound concurrency
  for a 100k-device stage? How do you resume a rollout after the service restarts?
- **04:** Why jitter? Which errors should never be retried? What happens to a
  fleet of devices that all retry at the same moment after an outage?
