/**
 * KATA 2 (40 min): Idempotent matching consumer.
 *
 * On TaskPosted { category, zip }: pick an eligible Tasker from shared/fixtures
 * (serves the category, serves the zip, not busy), mark them busy, and produce
 * TaskerAssigned keyed by taskId.
 *
 * TODO:
 *  - autoCommit: false; commit AFTER processing. Mind the offset + 1.
 *  - Dedupe on eventId so a redelivery never double-assigns.
 *  - Decide what happens when nobody is eligible.
 *
 * Curveballs:
 *  - `npm run seed -- dupes` sends the same event twice. Prove no double assignment.
 *  - Crash after assigning but before committing. What happens on restart?
 *    Is your in-memory dedupe set enough? What would you use in production?
 */
import { makeKafka, makeProducer, onShutdown, TOPICS } from "../shared/kafka.js";
import { parseTaskEvent } from "../shared/events.js";
import { taskers } from "../shared/fixtures.js";

const kafka = makeKafka("kata2-matcher");
const producer = makeProducer(kafka);
const consumer = kafka.consumer({ groupId: "kata2-matcher" });

await Promise.all([producer.connect(), consumer.connect()]);
onShutdown(consumer, producer);
await consumer.subscribe({ topic: TOPICS.taskEvents, fromBeginning: true });

void taskers; // TODO: use me
void parseTaskEvent;

await consumer.run({
  autoCommit: false,
  eachMessage: async ({ topic, partition, message }) => {
    // TODO: parse, dedupe, match, produce TaskerAssigned, then commit.
    void topic; void partition; void message;
  },
});
