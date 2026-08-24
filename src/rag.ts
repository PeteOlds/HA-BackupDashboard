import { BackupInfo, RagStatus, RagThresholds } from "./types";

export const DEFAULT_THRESHOLDS: RagThresholds = {
  greenHours: 48,
  amberDays: 7,
  freeGb: 1,
};

const GB = 1024 ** 3;

export function hoursSince(iso: string | null): number | null {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms)) return null;
  return ms / 3_600_000;
}

export function computeRag(
  info: BackupInfo,
  thresholds: RagThresholds = DEFAULT_THRESHOLDS,
): RagStatus {
  if (info.last_job_failed) return "red";

  if (info.free_space) {
    const freeBytes = Math.min(...Object.values(info.free_space));
    if (freeBytes < thresholds.freeGb * GB) return "red";
  }

  const ageH = hoursSince(info.last_backup);
  if (ageH === null) return "red";
  if (ageH > thresholds.amberDays * 24) return "red";

  const withinGreen = ageH <= thresholds.greenHours;
  if (withinGreen && (!info.has_remote_agent || info.remote_ok)) return "green";

  return "amber";
}

export function ragLabel(r: RagStatus): string {
  return r === "green" ? "Healthy" : r === "amber" ? "Warning" : "Critical";
}
