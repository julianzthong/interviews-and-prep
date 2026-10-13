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
import { makeKafka, makeProducer, onShutdown } from "../shared/kafka.js";

const producer = makeProducer(makeKafka("kata1-producer"));
await producer.connect();
onShutdown(producer);

// TODO: produce your events here.

await producer.disconnect();
