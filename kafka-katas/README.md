# Kafka + TypeScript Katas

Practice repo for an AI-allowed, TypeScript + Kafka coding round.
Domain: a Taskrabbit-style marketplace (tasks, Taskers, matching, onboarding).

## Setup (Kata 0)

Requires Docker and Node 20+.

```bash
npm install
npm run kafka:up     # single-node Kafka (KRaft) on localhost:9092
npm run topics       # creates task-events, task-events.dlq, tasker-events, smoke-test (3 partitions each)
npm run smoke        # should print "Round trip OK"
```

Give the broker ~10 seconds after `kafka:up` before running `topics`.
`npm run kafka:down` wipes everything for a clean rep.

## The katas

| # | Kata | Time | Run |
|---|------|------|-----|
| 0 | Setup and smoke test | 20 min | `npm run smoke` |
| 1 | Typed contract at the boundary | 30 min | `npm run kata1:produce` / `kata1:consume` |
| 2 | Idempotent matching consumer | 40 min | `npm run kata2` |
| 3 | Retries and DLQ | 40 min | `npm run kata3` |
| 4 | Ordering and state machine | 40 min | `npm run kata4` |
| 5 | Tasker onboarding pipeline (full mock) | 45 min | `npm run kata5` |

Each kata file opens with its spec, TODOs, and curveballs.
Kata 1 is where you write `src/shared/events.ts`; Katas 2 to 4 build on it.
Short on time? Do 0, 2, and 5.

## Test data

```bash
npm run seed            # a few valid TaskPosted events (one with no eligible Tasker)
npm run seed -- dupes   # the same event twice
npm run seed -- junk    # malformed payloads, including a null value
```

Topics keep their messages between reps. Use `fromBeginning` and a fresh `groupId`
to replay, or `npm run kafka:down && npm run kafka:up && npm run topics` to start clean.

## Rules for every rep

1. Set a timer.
2. Use AI exactly as you will on the day.
3. Restate the problem and sketch the event types before prompting.
4. Review every diff out loud. Narrating your review is the skill being graded.

## What to catch in AI-written code

- Offset committed before processing, or the `offset + 1` off-by-one
- Handlers that aren't idempotent under redelivery
- `as` casts in place of validation; `message.value` assumed non-null
- Unawaited promises, or errors swallowed silently
- Retry loops that block the partition forever
- Wrong partition key, which breaks per-entity ordering

## Questions to ask in the first five minutes

- Is the broker real or mocked?
- Can I assume at-least-once delivery?
- Is ordering required per task (or per Tasker)?
