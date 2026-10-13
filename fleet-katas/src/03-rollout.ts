// Kata 03: Staged OTA rollout with abort threshold (target: 35 min)
//
// Rules:
//  - stages are cumulative percentages of the fleet, e.g. [10, 50, 100].
//    Stage i covers devices up to ceil(pct / 100 * fleetSize), in the
//    order given, skipping devices already attempted in earlier stages.
//  - Update all devices within a stage concurrently.
//  - update() resolving false, or throwing, counts as a failure.
//  - After each stage, if (failures in that stage / devices in that stage)
//    * 100 > failureThresholdPct, stop and return ABORTED with
//    abortedAtStage = the stage index. Untouched devices are never updated.
//  - Otherwise continue; return COMPLETED after the last stage.

export interface RolloutConfig {
  targetVersion: string;
  stages: number[];
  failureThresholdPct: number;
}

export type UpdateFn = (deviceId: string, version: string) => Promise<boolean>;

export interface RolloutResult {
  status: "COMPLETED" | "ABORTED";
  updated: string[];
  failed: string[];
  abortedAtStage?: number;
}

export async function runRollout(
  deviceIds: string[],
  config: RolloutConfig,
  update: UpdateFn,
): Promise<RolloutResult> {
  // we keep track of the updated and failed deviceIds
  const updated: string[] = [];
  const failed: string[] = [];
  let previousEnd = 0;

  for (const [stageIndex, percentage] of config.stages.entries()) {
    const stageEnd = Math.ceil((percentage / 100) * deviceIds.length);
    const stageDevices = deviceIds.slice(previousEnd, stageEnd);
    previousEnd = stageEnd;

    if (stageDevices.length === 0) {
      continue;
    }

    const outcomes = await Promise.all(
      stageDevices.map(async (deviceId) => {
        try {
          const success = await update(deviceId, config.targetVersion);
          return { deviceId, success };
        } catch {
          return { deviceId, success: false };
        }
      }),
    );

    for (const outcome of outcomes) {
      if (outcome.success) {
        updated.push(outcome.deviceId);
      } else {
        failed.push(outcome.deviceId);
      }
    }

    const stageFailures = outcomes.filter((outcome) => !outcome.success).length;
    const failureRatePct = (stageFailures / stageDevices.length) * 100;

    if (failureRatePct > config.failureThresholdPct) {
      return {
        status: "ABORTED",
        updated: updated,
        failed: failed,
        abortedAtStage: stageIndex,
      };
    }
  }

  return {
    status: "COMPLETED",
    updated: updated,
    failed: failed,
  };
}
