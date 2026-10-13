// Kata 04: Retry with exponential backoff and full jitter (target: 20 min)
//
// Rules:
//  - Call fn up to maxAttempts times in total.
//  - Before retry n (n = 1, 2, ...), sleep for
//      min(maxDelayMs, baseDelayMs * 2^(n-1)) * random()
//  - If isRetryable is given and returns false for an error, rethrow
//    immediately without sleeping.
//  - After the final attempt fails, rethrow the last error.
//  - sleep defaults to a real setTimeout; random defaults to Math.random.

export interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  sleep?: (ms: number) => Promise<void>;
  random?: () => number;
  isRetryable?: (err: unknown) => boolean;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  opts: RetryOptions,
): Promise<T> {
  if (!Number.isInteger(opts.maxAttempts) || opts.maxAttempts === 0) {
    throw new RangeError("maxAttempts must be a number");
  }

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (opts.isRetryable && !opts.isRetryable(error)) {
        throw error;
      }

      if (attempt === opts.maxAttempts) {
        throw error;
      }

      const retryNumber = attempt;
      const backoff = Math.min(
        opts.maxDelayMs,
        opts.baseDelayMs * 2 ** (retryNumber - 1),
      );
      const random = opts.random ?? Math.random;
      const delay = backoff * random();

      const defaultSleep = (ms: number) =>
        new Promise<void>((resolve) => setTimeout(resolve, ms));

      const sleep = opts.sleep ?? defaultSleep;
      await sleep(delay);
    }
  }

  throw new Error("Unreachable");
}
