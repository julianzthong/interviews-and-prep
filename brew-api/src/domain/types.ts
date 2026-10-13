export type State = Record<string, string | number | boolean>;

export type DeviceStatus = "online" | "offline";

export interface Device {
  deviceId: string;
  model: string;
  firmwareVersion: string;
  status: DeviceStatus;
  desired: State;
  reported: State;
  version: number;
  createdAt: string;
}
