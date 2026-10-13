import { describe, it, expect } from "vitest";
import { withRetry } from "../src/04-retry";

const recorder = () => {
  const delays: number[] = [];
  return { delays, sleep: async (ms: number) => { delays.push(ms); } };
};

describe("04 withRetry", () => {
  it("returns immediately when the first attempt succeeds", async () => {
    const { delays, sleep } = recorder();
    const out = await withRetry(async () => "ok", { maxAttempts: 3, baseDelayMs: 100, maxDelayMs: 1000, sleep });
    expect(out).toBe("ok");
    expect(delays).toEqual([]);
  });

  it("retries with exponential backoff until success", async () => {
    const { delays, sleep } = recorder();
    let n = 0;
    const out = await withRetry(
      async () => { if (++n < 3) throw new Error("flaky"); return n; },
      { maxAttempts: 5, baseDelayMs: 100, maxDelayMs: 10_000, sleep, random: () => 1 },
    );
    expect(out).toBe(3);
    expect(delays).toEqual([100, 200]);
  });

  it("caps delays at maxDelayMs and rethrows the last error", async () => {
    const { delays, sleep } = recorder();
    let n = 0;
    await expect(
      withRetry(async () => { throw new Error(`fail ${++n}`); },
        { maxAttempts: 5, baseDelayMs: 100, maxDelayMs: 300, sleep, random: () => 1 }),
    ).rejects.toThrow("fail 5");
    expect(n).toBe(5);
    expect(delays).toEqual([100, 200, 300, 300]);
  });

  it("applies full jitter by scaling the delay with random()", async () => {
    const { delays, sleep } = recorder();
    let n = 0;
    await withRetry(
      async () => { if (++n < 2) throw new Error("x"); return n; },
      { maxAttempts: 3, baseDelayMs: 100, maxDelayMs: 1000, sleep, random: () => 0.5 },
    );
    expect(delays).toEqual([50]);
  });

  it("does not retry errors marked non-retryable", async () => {
    const { delays, sleep } = recorder();
    let n = 0;
    await expect(
      withRetry(async () => { n++; throw new Error("400 bad request"); }, {
        maxAttempts: 5, baseDelayMs: 100, maxDelayMs: 1000, sleep,
        isRetryable: (e) => !(e instanceof Error && e.message.startsWith("400")),
      }),
    ).rejects.toThrow("400 bad request");
    expect(n).toBe(1);
    expect(delays).toEqual([]);
  });
});
