import express from "express";
import { DeviceController } from "./controllers/deviceController";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { type DeviceRepository, InMemoryDeviceRepository } from "./repositories/deviceRepository";
import { deviceRoutes } from "./routes/deviceRoutes";
import { DeviceService } from "./services/deviceService";

// Composition root: wire dependencies by hand. Tests pass their own repo.
export function createApp(repo: DeviceRepository = new InMemoryDeviceRepository()) {
  const service = new DeviceService(repo);
  const controller = new DeviceController(service);

  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/devices", deviceRoutes(controller));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
