import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "../src/app";

let app: ReturnType<typeof createApp>;

const register = (deviceId = "kettle-1") =>
  request(app).post("/devices").send({ deviceId, model: "stagg-ekg-pro", firmwareVersion: "1.0.0" });

beforeEach(() => {
  app = createApp();
});

describe("health and routing", () => {
  it("GET /health returns ok", async () => {
    await request(app).get("/health").expect(200, { status: "ok" });
  });

  it("returns a JSON 404 for unknown routes", async () => {
    const res = await request(app).get("/nope").expect(404);
    expect(res.body.error).toMatch(/not found/);
  });

  it("returns 400 for a malformed JSON body", async () => {
    await request(app)
      .post("/devices")
      .set("Content-Type", "application/json")
      .send("{not json")
      .expect(400);
  });
});

describe("POST /devices", () => {
  it("registers a device and returns 201 with a Location header", async () => {
    const res = await register().expect(201);
    expect(res.headers.location).toBe("/devices/kettle-1");
    expect(res.body).toMatchObject({ deviceId: "kettle-1", status: "offline", version: 0 });
  });

  it("rejects a duplicate registration with 409", async () => {
    await register();
    await register().expect(409);
  });

  it("rejects an invalid body with 400 and validation details", async () => {
    const res = await request(app)
      .post("/devices")
      .send({ deviceId: "", model: "x", firmwareVersion: "v1" })
      .expect(400);
    expect(res.body.details.fieldErrors).toHaveProperty("firmwareVersion");
  });
});

describe("GET /devices", () => {
  it("lists devices sorted by id and filters by status", async () => {
    await register("b");
    await register("a");
    await request(app).post("/devices/b/reported").send({ patch: { tempC: 90 } });

    const all = await request(app).get("/devices").expect(200);
    expect(all.body.devices.map((d: { deviceId: string }) => d.deviceId)).toEqual(["a", "b"]);

    const online = await request(app).get("/devices?status=online").expect(200);
    expect(online.body.devices).toHaveLength(1);
  });

  it("rejects an invalid status filter", async () => {
    await request(app).get("/devices?status=sleeping").expect(400);
  });
});

describe("shadow endpoints", () => {
  it("returns 404 for an unknown device", async () => {
    await request(app).get("/devices/ghost").expect(404);
  });

  it("tracks desired vs reported and exposes the delta", async () => {
    await register();
    await request(app)
      .put("/devices/kettle-1/desired")
      .send({ patch: { targetTempC: 94 } })
      .expect(200);

    let res = await request(app).get("/devices/kettle-1").expect(200);
    expect(res.body.delta).toEqual({ targetTempC: 94 });

    res = await request(app)
      .post("/devices/kettle-1/reported")
      .send({ patch: { targetTempC: 94 } })
      .expect(200);
    expect(res.body.delta).toEqual({});
    expect(res.body.status).toBe("online");
    expect(res.body.version).toBe(2);
  });

  it("returns 409 when expectedVersion is stale, including version 0", async () => {
    await register();
    await request(app).put("/devices/kettle-1/desired").send({ patch: { a: 1 } });
    await request(app)
      .put("/devices/kettle-1/desired")
      .send({ patch: { a: 2 }, expectedVersion: 0 })
      .expect(409);
  });
});
