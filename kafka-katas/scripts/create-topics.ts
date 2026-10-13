import { makeKafka, TOPICS } from "../src/shared/kafka.js";

// 3 partitions so keying and ordering actually matter.
const admin = makeKafka("kata-admin").admin();
await admin.connect();
const existing = new Set(await admin.listTopics());
const wanted = Object.values(TOPICS).filter((t) => !existing.has(t));
if (wanted.length) {
  await admin.createTopics({
    waitForLeaders: true,
    topics: wanted.map((topic) => ({ topic, numPartitions: 3, replicationFactor: 1 })),
  });
}
console.log("Topics ready:", Object.values(TOPICS).join(", "));
await admin.disconnect();
