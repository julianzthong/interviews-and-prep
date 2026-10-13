/**
 * KATA 5 (45 min, do it twice): Tasker onboarding pipeline. Closest to the real round.
 *
 * Topic: TOPICS.taskerEvents, keyed by taskerId.
 * Events (define your own union, e.g. in src/kata5/events.ts):
 *   TaskerApplied { taskerId }
 *   BackgroundCheckCompleted { taskerId, passed: boolean }
 *   CategoryApproved { taskerId, category }
 *
 * Rule: when a Tasker has a passed background check AND at least one approved
 * category, emit TaskerActivated exactly once.
 *
 * Curveballs (draw these blind):
 *  - Duplicate CategoryApproved events.
 *  - Background check fails after a category was already approved.
 *  - New rule: some categories (say "handyman") need a second check.
 *  - "How would you observe this in production?"
 *    (consumer lag, DLQ rate, time from TaskerApplied to TaskerActivated)
 *
 * You write the producer for test data too. That's part of the rep.
 */
import { makeKafka, makeProducer, onShutdown, TOPICS } from "../shared/kafka.js";

const kafka = makeKafka("kata5-onboarding");
const producer = makeProducer(kafka);
const consumer = kafka.consumer({ groupId: "kata5-onboarding" });

await Promise.all([producer.connect(), consumer.connect()]);
onShutdown(consumer, producer);
await consumer.subscribe({ topic: TOPICS.taskerEvents, fromBeginning: true });

await consumer.run({
  autoCommit: false,
  eachMessage: async ({ topic, partition, message }) => {
    // TODO
    void topic; void partition; void message;
  },
});
