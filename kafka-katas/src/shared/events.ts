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

export type TaskEvent = { type: "TODO"; eventId: string; taskId: string; occurredAt: string };

export type ParseResult =
  | { ok: true; event: TaskEvent }
  | { ok: false; error: string };

export function parseTaskEvent(_raw: Buffer | null): ParseResult {
  return { ok: false, error: "parseTaskEvent not implemented (Kata 1)" };
}
