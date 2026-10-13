/**
 * KATA 4 (40 min): Ordering and a typed state machine.
 *
 * Lifecycle: Posted -> Assigned -> Completed; Cancelled allowed from Posted or Assigned.
 *
 * TODO:
 *  - Add TaskCancelled to your union in shared/events.ts.
 *  - Hold per-task state in memory; reject illegal transitions (log, don't crash).
 *  - Encode legal transitions in the type system, e.g. a Record<State, State[]> map.
 *
 * Curveball: TaskCancelled arrives before the TaskerAssigned that preceded it.
 * Why can't that happen if everything is keyed by taskId?
 * What if the events came from two producers that keyed differently?
 */
import { makeKafka, onShutdown, TOPICS } from "../shared/kafka.js";

type TaskState = "Posted" | "Assigned" | "Completed" | "Cancelled";

// TODO: fill in legal transitions.
const transitions: Record<TaskState, TaskState[]> = {
  Posted: [],
  Assigned: [],
  Completed: [],
  Cancelled: [],
};
void transitions;

const consumer = makeKafka("kata4-lifecycle").consumer({ groupId: "kata4-lifecycle" });
await consumer.connect();
onShutdown(consumer);
await consumer.subscribe({ topic: TOPICS.taskEvents, fromBeginning: true });

await consumer.run({
  eachMessage: async ({ message }) => {
    // TODO
    void message;
  },
});
