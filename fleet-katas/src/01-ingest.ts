// Kata 01: Telemetry ingest with dedupe and ordering (target: 25 min)
//
// Devices publish telemetry over MQTT with at-least-once delivery, so the
// same message can arrive twice and messages can arrive out of order.
//
// Rules:
//  - A messageId seen before returns "duplicate" (check this first).
//  - A message whose seq is <= the last accepted seq for that device
//    returns "stale" and does not replace the latest reading.
//  - Otherwise return "accepted" and make it that device's latest reading.
//  - Sequence numbers are tracked per device.

export interface TelemetryMessage {
  messageId: string;
  deviceId: string;
  seq: number;
  waterTempC: number;
  state: "idle" | "heating" | "brewing";
}

export type IngestResult = "accepted" | "duplicate" | "stale";

export class TelemetryIngestor {
  private readonly seenMessageIds = new Set<string>();
  private readonly latestByDevice = new Map<string, TelemetryMessage>();

  ingest(msg: TelemetryMessage): IngestResult {
    if (this.seenMessageIds.has(msg.messageId)){
      return "duplicate";
    }

    this.seenMessageIds.add(msg.messageId);

    const latest = this.latestByDevice.get(msg.deviceId);
    if (latest && msg.seq <= latest.seq) {
      return "stale";
    }

    this.latestByDevice.set(msg.deviceId, msg)
    return "accepted";
  }

  latest(deviceId: string): TelemetryMessage | undefined {
    return this.latestByDevice.get(deviceId);
  }
}
