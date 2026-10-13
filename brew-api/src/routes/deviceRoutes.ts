import { Router } from "express";
import type { DeviceController } from "../controllers/deviceController";
import { asyncHandler } from "../middleware/asyncHandler";

export function deviceRoutes(controller: DeviceController): Router {
  const router = Router();

  router.get("/", asyncHandler(controller.list));
  router.post("/", asyncHandler(controller.register));
  router.get("/:deviceId", asyncHandler(controller.get));
  router.put("/:deviceId/desired", asyncHandler(controller.setDesired));
  router.post("/:deviceId/reported", asyncHandler(controller.report));

  return router;
}
