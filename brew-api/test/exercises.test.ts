// Exercise tests. Change `describe.skip` to `describe` for the one you're
// working on. See README.md for the spec of each exercise.
import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app";

let app: ReturnType<typeof createApp>;

const register = (deviceId: string) =>
  request(app).post("/devices").send({ deviceId, model: "aiden", firmwareVersion: "1.0.0" });

beforeEach(() => {
  app = createApp();
});

describe.skip("Exercise 1: DELETE /devices/:deviceId", () => {
  it("deletes a device and returns 204", async () => {
    await register("k1");
    await request(app).delete("/devices/k1").expect(204);
    await request(app).get("/devices/k1").expect(404);
  });

  it("returns 404 for an unknown device", async () => {
    await request(app).delete("/devices/ghost").expect(404);
  });
});

describe.skip("Exercise 2: POST /devices/:deviceId/telemetry", () => {
  const send = (deviceId: string, body: object) =>
    request(app).post(`/devices/${deviceId}/telemetry`).send(body);

  it("accepts new telemetry with 202 and marks the device online", async () => {
    await register("k1");
    const res = await send("k1", { messageId: "m1", seq: 1, waterTempC: 91 }).expect(202);
    expect(res.body).toEqual({ result: "accepted" });

    const device = await request(app).get("/devices/k1");
    expect(device.body.status).toBe("online");
  });

  it("returns 200 duplicate for a redelivered messageId", async () => {
    await register("k1");
    await send("k1", { messageId: "m1", seq: 1, waterTempC: 91 });
    const res = await send("k1", { messageId: "m1", seq: 1, waterTempC: 91 }).expect(200);
    expect(res.body).toEqual({ result: "duplicate" });
  });

  it("returns 200 stale for an out-of-order seq and keeps the newer reading", async () => {
    await register("k1");
    await send("k1", { messageId: "m2", seq: 2, waterTempC: 95 });
    const res = await send("k1", { messageId: "m1", seq: 1, waterTempC: 80 }).expect(200);
    expect(res.body).toEqual({ result: "stale" });

    const latest = await request(app).get("/devices/k1/telemetry/latest").expect(200);
    expect(latest.body).toMatchObject({ messageId: "m2", waterTempC: 95 });
  });

  it("returns 404 for telemetry from an unregistered device", async () => {
    await send("ghost", { messageId: "m1", seq: 1, waterTempC: 91 }).expect(404);
  });

  it("returns 404 for latest telemetry when none has been received", async () => {
    await register("k1");
    await request(app).get("/devices/k1/telemetry/latest").expect(404);
  });

  it("validates the body", async () => {
    await register("k1");
    await send("k1", { messageId: "m1", seq: -1 }).expect(400);
  });
});

describe.skip("Exercise 3: cursor pagination on GET /devices", () => {
  it("pages through devices with limit and cursor", async () => {
    for (const id of ["a", "b", "c", "d", "e"]) await register(id);

    const page1 = await request(app).get("/devices?limit=2").expect(200);
    expect(page1.body.devices.map((d: { deviceId: string }) => d.deviceId)).toEqual(["a", "b"]);
    expect(page1.body.nextCursor).toBe("b");

    const page2 = await request(app).get(`/devices?limit=2&cursor=${page1.body.nextCursor}`);
    expect(page2.body.devices.map((d: { deviceId: string }) => d.deviceId)).toEqual(["c", "d"]);

    const page3 = await request(app).get(`/devices?limit=2&cursor=${page2.body.nextCursor}`);
    expect(page3.body.devices.map((d: { deviceId: string }) => d.deviceId)).toEqual(["e"]);
    expect(page3.body.nextCursor).toBeNull();
  });

  it("defaults the limit to 50", async () => {
    for (let i = 0; i < 55; i++) await register(`d${String(i).padStart(2, "0")}`);
    const res = await request(app).get("/devices").expect(200);
    expect(res.body.devices).toHaveLength(50);
    expect(res.body.nextCursor).toBe("d49");
  });

  it("rejects a limit outside 1 to 100", async () => {
    await request(app).get("/devices?limit=0").expect(400);
    await request(app).get("/devices?limit=500").expect(400);
  });
});
