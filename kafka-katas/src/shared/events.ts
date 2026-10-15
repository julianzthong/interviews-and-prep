/**
 * KATA 1: this file is yours to write. Later katas import from it.
 *
 * TODO:
 *  1. Replace the placeholder below with a discriminated union `TaskEvent`
 *     covering TaskPosted, TaskerAssigned, TaskCompleted (Kata 4 adds TaskCancelled).
 *     Every event carries: type, eventId, taskId, occurredAt (ISO string).
 *     TaskPosted also carries: category, zip.
 *     TaskerAssigned also carries: taskerId.
 *  2. Implement `parseTaskEvent`: take the raw Kafka value (Buffer | null),
 *     JSON.parse to `unknown`, validate (zod is installed), return a typed result.
 *     No `as TaskEvent` casts.
 *  3. Add an `assertNever(x: never)` helper for exhaustive switches.
 */

import { z } from "zod";

const eventBase = {
  eventId: z.string(),
  taskId: z.string(),
  occurredAt: z.string(),
};

const TaskPostedSchema = z.object({
  type: z.literal("TaskPosted"),
  ...eventBase,
  category: z.string(),
  zip: z.string(),
});

const TaskerAssignedSchema = z.object({
  type: z.literal("TaskerAssigned"),
  ...eventBase,
  taskerId: z.string(),
});

const TaskCompletedSchema = z.object({
  type: z.literal("TaskCompleted"),
  ...eventBase,
});

const TaskEventSchema = z.discriminatedUnion("type", [
  TaskPostedSchema,
  TaskerAssignedSchema,
  TaskCompletedSchema,
]);

export type TaskEvent = TaskPosted | TaskerAssigned | TaskCompleted;

export type TaskPosted = {
  type: "TaskPosted";
  eventId: string;
  taskId: string;
  occurredAt: string;
  category: string;
  zip: string;
};

export type TaskerAssigned = {
  type: "TaskerAssigned";
  eventId: string;
  taskId: string;
  occurredAt: string;
  taskerId: string;
};

export type TaskCompleted = {
  type: "TaskCompleted";
  eventId: string;
  taskId: string;
  occurredAt: string;
};

export type ParseResult =
  | { ok: true; event: TaskEvent }
  | { ok: false; error: string };

export function parseTaskEvent(_raw: Buffer | null): ParseResult {
  if (_raw === null) return { ok: false, error: "Message is null" };
  let json: JSON;

  try {
    json = JSON.parse(_raw.toString());
  } catch {
    return { ok: false, error: "Invalid JSON" };
  }

  const event = TaskEventSchema.safeParse(json);

  if (!event.success) {
    return {
      ok: false,
      error: event.error.toString(),
    };
  }

  return {
    ok: true,
    event: event.data,
  };
}

export function assertNever(x: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(x)}`);
}
