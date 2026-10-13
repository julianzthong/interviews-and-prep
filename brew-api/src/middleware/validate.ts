import type { z } from "zod";
import { ValidationError } from "../domain/errors";

// Parse untrusted input at the boundary. Everything past this point is typed.
export function parse<T extends z.ZodTypeAny>(schema: T, input: unknown): z.infer<T> {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(result.error.flatten());
  }
  return result.data;
}
