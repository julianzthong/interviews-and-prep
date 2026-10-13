import { describe, it, expect } from "vitest";
import { ShadowStore, VersionConflictError } from "../src/02-shadow";

describe("02 ShadowStore", () => {
  it("returns an empty shadow at version 0 for a new device", () => {
    expect(new ShadowStore().get("d1")).toEqual({ desired: {}, reported: {}, version: 0 });
  });

  it("merges desired patches and bumps the version each write", () => {
    const s = new ShadowStore();
    s.setDesired("d1", { targetTempC: 94 });
    const sh = s.setDesired("d1", { mode: "pourover" });
    expect(sh.desired).toEqual({ targetTempC: 94, mode: "pourover" });
    expect(sh.version).toBe(2);
  });

  it("computes delta as desired keys whose value differs from reported", () => {
    const s = new ShadowStore();
    s.setDesired("d1", { targetTempC: 94, mode: "pourover" });
    s.report("d1", { targetTempC: 90, mode: "pourover", firmware: "1.2.0" });
    expect(s.delta("d1")).toEqual({ targetTempC: 94 });
  });

  it("clears the delta once the device reports the desired values", () => {
    const s = new ShadowStore();
    s.setDesired("d1", { targetTempC: 94 });
    const sh = s.report("d1", { targetTempC: 94 });
    expect(s.delta("d1")).toEqual({});
    expect(sh.version).toBe(2);
  });

  it("rejects a desired write with a stale expectedVersion", () => {
    const s = new ShadowStore();
    s.setDesired("d1", { targetTempC: 94 }); // v1
    s.report("d1", { targetTempC: 94 });     // v2
    expect(() => s.setDesired("d1", { targetTempC: 96 }, 1)).toThrow(VersionConflictError);
    expect(s.get("d1").desired.targetTempC).toBe(94);
  });

  it("accepts a desired write with the current expectedVersion", () => {
    const s = new ShadowStore();
    s.setDesired("d1", { targetTempC: 94 });
    expect(s.setDesired("d1", { targetTempC: 96 }, 1).desired.targetTempC).toBe(96);
  });

  it("returns copies so callers cannot mutate stored state", () => {
    const s = new ShadowStore();
    s.setDesired("d1", { targetTempC: 94 });
    s.get("d1").desired.targetTempC = 0;
    expect(s.get("d1").desired.targetTempC).toBe(94);
  });
});
