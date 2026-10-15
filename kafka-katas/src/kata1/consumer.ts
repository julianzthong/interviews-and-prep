/**
 * KATA 1 (30 min): Typed contract at the boundary, consumer side.
 *
 * TODO:
 *  - Parse message.value with parseTaskEvent (Buffer | null -> unknown -> validated).
 *  - Narrow with an exhaustive switch on event.type, using assertNever in the default.
 *  - Invalid messages: log and skip. Test with `npm run seed -- junk`.
 *
 * Watch the AI for: `as` casts, missing null checks, `any`.
 */
import { assertNever, parseTaskEvent } from "../shared/events.js";
import { makeKafka, onShutdown, TOPICS } from "../shared/kafka.js";

const consumer = makeKafka("kata1-consumer").consumer({ groupId: "kata1" });
await consumer.connect();
onShutdown(consumer);
await consumer.subscribe({ topic: TOPICS.taskEvents, fromBeginning: true });

await consumer.run({
  eachMessage: async ({ partition, message }) => {
    const result = parseTaskEvent(message.value);
    if (!result.ok) {
      console.warn(`[p${partition} @${message.offset}] invalid:`, result.error);
      return;
    }

    switch (result.event.type) {
      case "TaskPosted":
        break;

      case "TaskerAssigned":
        break;

      case "TaskCompleted":
        break;

      default:
        assertNever(result.event);
    }
  },
});
