import type { Device, DeviceStatus } from "../domain/types";

// The interface is what services depend on. Swapping the in-memory version
// for a Postgres one wouldn't touch any service or controller code.
export interface DeviceRepository {
  findById(deviceId: string): Promise<Device | undefined>;
  findAll(filter?: { status?: DeviceStatus }): Promise<Device[]>;
  insert(device: Device): Promise<void>;
  update(device: Device): Promise<void>;
}

export class InMemoryDeviceRepository implements DeviceRepository {
  private readonly devices = new Map<string, Device>();

  async findById(deviceId: string): Promise<Device | undefined> {
    const device = this.devices.get(deviceId);
    return device ? structuredClone(device) : undefined;
  }

  async findAll(filter: { status?: DeviceStatus } = {}): Promise<Device[]> {
    return [...this.devices.values()]
      .filter((d) => filter.status === undefined || d.status === filter.status)
      .sort((a, b) => a.deviceId.localeCompare(b.deviceId))
      .map((d) => structuredClone(d));
  }

  async insert(device: Device): Promise<void> {
    this.devices.set(device.deviceId, structuredClone(device));
  }

  async update(device: Device): Promise<void> {
    this.devices.set(device.deviceId, structuredClone(device));
  }
}
