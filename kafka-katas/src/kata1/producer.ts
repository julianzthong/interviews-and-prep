/**
 * KATA 1 (30 min): Typed contract at the boundary, producer side.
 *
 * TODO:
 *  - Build a few valid TaskEvents using your union from shared/events.ts.
 *  - Send them to TOPICS.taskEvents keyed by taskId. Why key by taskId? Be ready to say.
 *  - Let the type system reject a malformed event at compile time.
 *
 * Curveball: add an optional field to TaskPosted without breaking a consumer
 * still running the old code. What makes a schema change safe?
 */
import { randomUUID } from "node:crypto";
import type { TaskEvent } from "../shared/events.js";
import {
  makeKafka,
  makeProducer,
  onShutdown,
  TOPICS,
} from "../shared/kafka.js";

const producer = makeProducer(makeKafka("kata1-producer"));
await producer.connect();
onShutdown(producer);

const events: TaskEvent[] = [
  {
    type: "TaskPosted",
    eventId: randomUUID(),
    taskId: "t1",
    occurredAt: new Date().toISOString(),
    category: "moving-help",
    zip: "94103",
  },
  {
    type: "TaskerAssigned",
    eventId: randomUUID(),
    taskId: "t1",
    occurredAt: new Date().toISOString(),
    taskerId: "tasker-7",
  },
  {
    type: "TaskCompleted",
    eventId: randomUUID(),
    taskId: "t1",
    occurredAt: new Date().toISOString(),
  },
];

await producer.send({
  topic: TOPICS.taskEvents,
  messages: events.map((e) => ({
    key: e.taskId,
    value: JSON.stringify(e),
  })),
});

await producer.disconnect();
