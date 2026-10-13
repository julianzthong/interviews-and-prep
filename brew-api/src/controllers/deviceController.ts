import type { Request, Response } from "express";
import { z } from "zod";
import { parse } from "../middleware/validate";
import type { DeviceService } from "../services/deviceService";

const stateSchema = z.record(z.union([z.string(), z.number(), z.boolean()]));

const registerSchema = z.object({
  deviceId: z.string().min(1),
  model: z.string().min(1),
  firmwareVersion: z.string().regex(/^\d+\.\d+\.\d+$/, "must be semver like 1.2.3"),
});

const listQuerySchema = z.object({
  status: z.enum(["online", "offline"]).optional(),
});

const setDesiredSchema = z.object({
  patch: stateSchema,
  expectedVersion: z.number().int().nonnegative().optional(),
});

const reportSchema = z.object({
  patch: stateSchema,
});

// Controllers are thin: parse input, call the service, shape the response.
export class DeviceController {
  constructor(private readonly service: DeviceService) {}

  list = async (req: Request, res: Response) => {
    const filter = parse(listQuerySchema, req.query);
    const devices = await this.service.list(filter);
    res.json({ devices });
  };

  register = async (req: Request, res: Response) => {
    const input = parse(registerSchema, req.body);
    const device = await this.service.register(input);
    res.status(201).location(`/devices/${device.deviceId}`).json(device);
  };

  get = async (req: Request, res: Response) => {
    const device = await this.service.get(req.params.deviceId!);
    res.json({ ...device, delta: this.service.delta(device) });
  };

  setDesired = async (req: Request, res: Response) => {
    const { patch, expectedVersion } = parse(setDesiredSchema, req.body);
    const device = await this.service.setDesired(req.params.deviceId!, patch, expectedVersion);
    res.json({ ...device, delta: this.service.delta(device) });
  };

  report = async (req: Request, res: Response) => {
    const { patch } = parse(reportSchema, req.body);
    const device = await this.service.report(req.params.deviceId!, patch);
    res.json({ ...device, delta: this.service.delta(device) });
  };
}
