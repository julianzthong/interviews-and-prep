// Kata 02: Device shadow with optimistic concurrency (target: 30 min)
//
// The app writes desired state; the device writes reported state.
//
// Rules:
//  - get() on an unknown device returns { desired: {}, reported: {}, version: 0 }.
//  - setDesired() merges the patch into desired and increments version.
//    If expectedVersion is given and doesn't match the current version,
//    throw VersionConflictError and change nothing.
//  - report() merges the patch into reported and increments version.
//  - delta() returns the desired keys whose value differs from reported.
//  - Returned shadows must be copies: callers can't mutate stored state.

export type State = Record<string, string | number | boolean>;

export interface Shadow {
  desired: State;
  reported: State;
  version: number;
}

export class VersionConflictError extends Error {}

export class ShadowStore {
  private readonly shadows = new Map<string, Shadow>();

  get(deviceId: string): Shadow {
    const shadow = this.shadows.get(deviceId);

    if (!shadow) {
      return { desired: {}, reported: {}, version: 0 };
    }

    return {
      desired: { ...shadow.desired },
      reported: { ...shadow.reported },
      version: shadow.version,
    };
  }

  setDesired(deviceId: string, patch: State, expectedVersion?: number): Shadow {
    const currentShadow = this.get(deviceId);

    if (
      expectedVersion !== undefined &&
      expectedVersion !== currentShadow.version
    ) {
      throw new VersionConflictError("There is a version conflict");
    }

    const updatedShadow: Shadow = {
      desired: {
        ...currentShadow.desired,
        ...patch,
      },
      reported: currentShadow.reported,
      version: currentShadow.version + 1,
    };

    this.shadows.set(deviceId, updatedShadow);

    return this.get(deviceId);
  }

  report(deviceId: string, patch: State): Shadow {
    const currentShadow = this.get(deviceId);

    const updatedShadow: Shadow = {
      desired: currentShadow.desired,
      reported: {
        ...currentShadow.reported,
        ...patch,
      },
      version: currentShadow.version + 1,
    };

    this.shadows.set(deviceId, updatedShadow);

    return this.get(deviceId);
  }

  delta(deviceId: string): State {
    const delta: State = {};
    const shadow = this.get(deviceId);

    for (const [key, desiredValue] of Object.entries(shadow.desired)) {
      if (shadow.reported[key] !== desiredValue) {
        delta[key] = desiredValue;
      }
    }

    return delta;
  }
}
