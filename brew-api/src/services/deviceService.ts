import { ConflictError, NotFoundError } from "../domain/errors";
import type { Device, DeviceStatus, State } from "../domain/types";
import type { DeviceRepository } from "../repositories/deviceRepository";

// Business rules live here: no Express types, so it's testable on its own.
export class DeviceService {
  constructor(private readonly repo: DeviceRepository) {}

  async register(input: { deviceId: string; model: string; firmwareVersion: string }) {
    const existing = await this.repo.findById(input.deviceId);
    if (existing) {
      throw new ConflictError(`Device ${input.deviceId} is already registered`);
    }

    const device: Device = {
      ...input,
      status: "offline",
      desired: {},
      reported: {},
      version: 0,
      createdAt: new Date().toISOString(),
    };
    await this.repo.insert(device);
    return device;
  }

  async get(deviceId: string): Promise<Device> {
    const device = await this.repo.findById(deviceId);
    if (!device) {
      throw new NotFoundError(`Device ${deviceId} not found`);
    }
    return device;
  }

  list(filter: { status?: DeviceStatus }) {
    return this.repo.findAll(filter);
  }

  async setDesired(deviceId: string, patch: State, expectedVersion?: number) {
    const device = await this.get(deviceId);
    if (expectedVersion !== undefined && expectedVersion !== device.version) {
      throw new ConflictError(
        `Expected version ${expectedVersion}, current is ${device.version}`,
      );
    }

    const updated: Device = {
      ...device,
      desired: { ...device.desired, ...patch },
      version: device.version + 1,
    };
    await this.repo.update(updated);
    return updated;
  }

  async report(deviceId: string, patch: State) {
    const device = await this.get(deviceId);
    const updated: Device = {
      ...device,
      reported: { ...device.reported, ...patch },
      status: "online",
      version: device.version + 1,
    };
    await this.repo.update(updated);
    return updated;
  }

  delta(device: Device): State {
    const delta: State = {};
    for (const [key, value] of Object.entries(device.desired)) {
      if (device.reported[key] !== value) {
        delta[key] = value;
      }
    }
    return delta;
  }
}
