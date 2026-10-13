# brew-api

A small TypeScript + Express API for a fleet of connected brewers, built in
the layered shape most interview codebases use. Practice by **extending** it,
the way a live round usually works: "here's a service, add a feature."

```bash
npm install
npm test            # base suite should pass (11 tests, 11 skipped)
npm run dev         # http://localhost:3000
npm run typecheck
```

## How it's organized

```
src/
  app.ts                      composition root: wires repo -> service -> controller
  server.ts                   starts the HTTP server
  routes/deviceRoutes.ts      URL -> controller method
  controllers/                parse + validate input, call service, shape response
  services/                   business rules (no Express types)
  repositories/               data access behind an interface (in-memory for now)
  middleware/
    asyncHandler.ts           forwards async errors to Express 4's error middleware
    validate.ts               zod parsing at the boundary -> 400 on bad input
    errorHandler.ts           HttpError -> status code; unknown errors -> 500
  domain/                     types and HTTP-aware error classes
```

A request flows: **route -> asyncHandler -> controller -> service -> repository**.
Errors flow back: a service throws `NotFoundError`, the asyncHandler forwards it,
and the errorHandler turns it into a 404 JSON response.

## Endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/health` | |
| GET | `/devices?status=online` | sorted by deviceId |
| POST | `/devices` | `{ deviceId, model, firmwareVersion }` -> 201, 409 if exists |
| GET | `/devices/:id` | includes `delta` |
| PUT | `/devices/:id/desired` | `{ patch, expectedVersion? }` -> 409 on stale version |
| POST | `/devices/:id/reported` | `{ patch }`, marks device online |

## Exercises

Tests are in `test/exercises.test.ts`. Change `describe.skip` to `describe` for
the one you're on. Time-box each, talk out loud, and touch every layer
properly instead of putting logic in the controller.

**1. DELETE /devices/:deviceId (15 min).** Return 204 on success, 404 if it doesn't
exist. Add `delete` to the repository interface and the in-memory version.

**2. Telemetry ingest (30 min).** `POST /devices/:id/telemetry` with
`{ messageId, seq, waterTempC }`. Reuse your kata 01 dedupe logic.
- New message: 202 `{ "result": "accepted" }`, and the device becomes `online`.
- Seen messageId: 200 `{ "result": "duplicate" }`.
- seq <= last accepted for that device: 200 `{ "result": "stale" }`.
- Unknown device: 404. Invalid body (e.g. negative seq): 400.
- `GET /devices/:id/telemetry/latest` returns the newest accepted reading, or 404.

**3. Cursor pagination on GET /devices (25 min).** Add `limit` (default 50, must be
1 to 100) and `cursor` (the last deviceId of the previous page). Respond with
`{ devices, nextCursor }`, where `nextCursor` is `null` on the last page.
Query params arrive as strings, so look at `z.coerce`.

## Questions to answer out loud

- Why keep Express types out of the service layer?
- What breaks if you remove `asyncHandler`? (Try it.)
- Two requests call `setDesired` at the same moment. The in-memory repo is safe
  here; would a Postgres repository with read-then-write be? How do you fix it?
- Why cursor pagination instead of `?page=3`, for a table that's being written to?
- Where would authentication go, and how would a device prove which device it is?
