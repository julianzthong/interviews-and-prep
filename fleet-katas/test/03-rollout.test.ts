import { describe, it, expect } from "vitest";
import { runRollout } from "../src/03-rollout";

const fleet = (n: number) => Array.from({ length: n }, (_, i) => `d${i}`);
const cfg = { targetVersion: "2.0.0", stages: [10, 50, 100], failureThresholdPct: 20 };

describe("03 runRollout", () => {
  it("completes when every device updates", async () => {
    const calls: string[] = [];
    const res = await runRollout(fleet(10), cfg, async (id, v) => {
      calls.push(`${id}@${v}`);
      return true;
    });
    expect(res.status).toBe("COMPLETED");
    expect(res.updated).toHaveLength(10);
    expect(res.failed).toEqual([]);
    expect(calls).toHaveLength(10);
    expect(new Set(calls).size).toBe(10); // no device updated twice
  });

  it("aborts after the first stage when it exceeds the threshold", async () => {
    let calls = 0;
    const res = await runRollout(fleet(10), { ...cfg, failureThresholdPct: 0 }, async (id) => {
      calls++;
      return id !== "d0";
    });
    expect(res.status).toBe("ABORTED");
    expect(res.abortedAtStage).toBe(0);
    expect(res.failed).toEqual(["d0"]);
    expect(calls).toBe(1); // 10% of 10 devices = 1
  });

  it("continues when a stage's failure rate is within the threshold", async () => {
    // stage 1 covers d1..d4 (cumulative 50%); 1 failure of 4 = 25% <= 50%
    const res = await runRollout(fleet(10), { ...cfg, failureThresholdPct: 50 }, async (id) => id !== "d3");
    expect(res.status).toBe("COMPLETED");
    expect(res.failed).toEqual(["d3"]);
    expect(res.updated).toHaveLength(9);
  });

  it("aborts at a later stage and never touches the remaining devices", async () => {
    const touched: string[] = [];
    const res = await runRollout(fleet(10), cfg, async (id) => {
      touched.push(id);
      return !["d1", "d2"].includes(id); // stage 1: 2 of 4 fail = 50% > 20%
    });
    expect(res.status).toBe("ABORTED");
    expect(res.abortedAtStage).toBe(1);
    expect(touched.sort()).toEqual(["d0", "d1", "d2", "d3", "d4"]);
  });

  it("counts a thrown error as a failure", async () => {
    const res = await runRollout(fleet(10), { ...cfg, failureThresholdPct: 0 }, async () => {
      throw new Error("download timed out");
    });
    expect(res.status).toBe("ABORTED");
    expect(res.failed).toEqual(["d0"]);
  });

  it("rounds stage sizes up so tiny fleets still get a canary", async () => {
    let calls = 0;
    await runRollout(fleet(3), { ...cfg, failureThresholdPct: 0 }, async () => {
      calls++;
      return false;
    });
    expect(calls).toBe(1);
  });

  it("updates devices within a stage concurrently", async () => {
    let inFlight = 0;
    let maxInFlight = 0;
    await runRollout(fleet(10), cfg, async () => {
      inFlight++;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((r) => setTimeout(r, 10));
      inFlight--;
      return true;
    });
    expect(maxInFlight).toBeGreaterThan(1);
  });
});
