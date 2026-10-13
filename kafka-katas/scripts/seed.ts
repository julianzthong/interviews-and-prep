/**
 * Publishes raw JSON test messages to task-events, including deliberately bad ones.
 * Usage: npm run seed            -> a few valid TaskPosted events
 *        npm run seed -- dupes   -> the same event twice (Kata 2 curveball)
 *        npm run seed -- junk    -> malformed payloads (Kata 1 validation)
 */
import { randomUUID } from "node:crypto";
import { makeKafka, makeProducer, TOPICS } from "../src/shared/kafka.js";

const mode = process.argv[2] ?? "valid";
const producer = makeProducer(makeKafka("kata-seed"));
await producer.connect();

const posted = (category: string, zip: string) => {
  const taskId = `task-${randomUUID().slice(0, 8)}`;
  return {
    key: taskId,
    value: JSON.stringify({
      type: "TaskPosted", eventId: randomUUID(), taskId,
      occurredAt: new Date().toISOString(), category, zip,
    }),
  };
};

let messages: { key: string | null; value: string | null }[];
if (mode === "dupes") {
  const m = posted("furniture-assembly", "94103");
  messages = [m, m];
} else if (mode === "junk") {
  messages = [
    { key: "junk-1", value: "not json" },
    { key: "junk-2", value: JSON.stringify({ type: "TaskPosted" }) },
    { key: "junk-3", value: JSON.stringify({ type: "Nope", eventId: "x", taskId: "y", occurredAt: "z" }) },
    { key: "junk-4", value: null },
  ];
} else {
  messages = [
    posted("furniture-assembly", "94103"),
    posted("mounting", "94110"),
    posted("moving-help", "94103"),
    posted("handyman", "99999"), // nobody serves this zip
  ];
}

await producer.send({ topic: TOPICS.taskEvents, messages });
console.log(`Seeded ${messages.length} message(s) [${mode}] to ${TOPICS.taskEvents}`);
await producer.disconnect();
