/** KATA 0: if this prints the round-tripped message, your setup works. */
import { randomUUID } from "node:crypto";
import { makeKafka, makeProducer, TOPICS } from "../shared/kafka.js";

const kafka = makeKafka("kata-smoke");
const producer = makeProducer(kafka);
const consumer = kafka.consumer({ groupId: `smoke-${randomUUID()}` });
const id = randomUUID();

await Promise.all([producer.connect(), consumer.connect()]);
await consumer.subscribe({ topic: TOPICS.smoke, fromBeginning: false });

const received = new Promise<string>((resolve) => {
  void consumer.run({
    eachMessage: async ({ message }) => {
      const value = message.value?.toString() ?? "";
      if (value.includes(id)) resolve(value);
    },
  });
});

// Give the group a moment to get partitions assigned before producing.
await new Promise((r) => setTimeout(r, 3000));
await producer.send({ topic: TOPICS.smoke, messages: [{ key: id, value: JSON.stringify({ hello: "kafka", id }) }] });

const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("No message after 15s")), 15000));
try {
  console.log("Round trip OK:", await Promise.race([received, timeout]));
} finally {
  await Promise.allSettled([producer.disconnect(), consumer.disconnect()]);
}
