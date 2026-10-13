import { describe, it, expect } from "vitest";
import { TelemetryIngestor, type TelemetryMessage } from "../src/01-ingest";

const msg = (o: Partial<TelemetryMessage>): TelemetryMessage => ({
  messageId: "m1", deviceId: "d1", seq: 1, waterTempC: 90, state: "heating", ...o,
});

describe("01 TelemetryIngestor", () => {
  it("accepts a first message and exposes it as latest", () => {
    const ing = new TelemetryIngestor();
    expect(ing.ingest(msg({}))).toBe("accepted");
    expect(ing.latest("d1")?.messageId).toBe("m1");
  });

  it("returns undefined latest for an unknown device", () => {
    expect(new TelemetryIngestor().latest("nope")).toBeUndefined();
  });

  it("flags a redelivered messageId as duplicate and keeps latest unchanged", () => {
    const ing = new TelemetryIngestor();
    ing.ingest(msg({ messageId: "m1", seq: 1 }));
    ing.ingest(msg({ messageId: "m2", seq: 2, waterTempC: 93 }));
    expect(ing.ingest(msg({ messageId: "m1", seq: 1 }))).toBe("duplicate");
    expect(ing.latest("d1")?.waterTempC).toBe(93);
  });

  it("flags an out-of-order (older seq) message as stale", () => {
    const ing = new TelemetryIngestor();
    ing.ingest(msg({ messageId: "m5", seq: 5, waterTempC: 95 }));
    expect(ing.ingest(msg({ messageId: "m4", seq: 4, waterTempC: 80 }))).toBe("stale");
    expect(ing.latest("d1")?.seq).toBe(5);
  });

  it("treats an equal seq with a new messageId as stale", () => {
    const ing = new TelemetryIngestor();
    ing.ingest(msg({ messageId: "a", seq: 3 }));
    expect(ing.ingest(msg({ messageId: "b", seq: 3 }))).toBe("stale");
  });

  it("tracks sequence numbers per device independently", () => {
    const ing = new TelemetryIngestor();
    ing.ingest(msg({ messageId: "x", deviceId: "d1", seq: 10 }));
    expect(ing.ingest(msg({ messageId: "y", deviceId: "d2", seq: 1 }))).toBe("accepted");
    expect(ing.latest("d2")?.seq).toBe(1);
  });
});
