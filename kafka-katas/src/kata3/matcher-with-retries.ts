/**
 * KATA 3 (40 min): Retries and DLQ.
 *
 * Start from your Kata 2 matcher. Make the handler fail transiently some of the
 * time (e.g. Math.random() < 0.3 throws).
 *
 * TODO:
 *  - Retry with exponential backoff, max 3 attempts.
 *  - After the last attempt, produce the original message to TOPICS.taskEventsDlq
 *    with headers: error, attempts, original-topic, original-partition, original-offset.
 *  - Then commit, so the partition moves on.
 *
 * Curveball: one poison message is stalling everything behind it.
 * Inline retry vs. a separate retry topic: when would you pick each?
 */
import { makeKafka, makeProducer, onShutdown, TOPICS } from "../shared/kafka.js";

const kafka = makeKafka("kata3-matcher");
const producer = makeProducer(kafka);
const consumer = kafka.consumer({ groupId: "kata3-matcher" });

await Promise.all([producer.connect(), consumer.connect()]);
onShutdown(consumer, producer);
await consumer.subscribe({ topic: TOPICS.taskEvents, fromBeginning: true });

void TOPICS.taskEventsDlq; // TODO: use me

await consumer.run({
  autoCommit: false,
  eachMessage: async ({ topic, partition, message }) => {
    // TODO
    void topic; void partition; void message;
  },
});
