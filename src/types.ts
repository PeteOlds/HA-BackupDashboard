// Local `hass` type so we don't couple to home-assistant-js-websocket internals.
export interface HomeAssistant {
  user: HassUser;
  locale?: { language: string };
  callWS<T>(message: Record<string, unknown>): Promise<T>;
}

export interface HassUser {
  id: string;
  name: string;
  is_admin: boolean;
}

export interface BackupCardConfig {
  name?: string;
  threshold_green_hours?: number;
  threshold_amber_days?: number;
  threshold_free_gb?: number;
  refresh_interval?: number;
}

export type RagStatus = "green" | "amber" | "red";

export interface RagThresholds {
  greenHours: number;
  amberDays: number;
  freeGb: number;
}

export interface BackupAgent {
  agent_id: string;
  name: string;
}

// Local agent IDs in Home Assistant (verified against HA frontend source).
export const LOCAL_AGENTS = ["backup.local", "hassio.local"];

export function isLocalAgent(id: string): boolean {
  return LOCAL_AGENTS.includes(id);
}

export interface BackupEntry {
  slug: string;
  name: string;
  date: string;
  size: number;
  agent_ids: string[];
  automatic: boolean;
}

export interface BackupSchedule {
  state: string;
  next_run: string | null;
}

export interface BackupRetention {
  copies: number | null;
  days: number | null;
}

export interface BackupConfig {
  retention: BackupRetention | null;
}

export interface BackupInfo {
  last_backup: string | null;
  last_job_failed: boolean;
  backing_up: boolean;
  schedule?: BackupSchedule;
  free_space?: Record<string, number>;
  has_remote_agent?: boolean;
  remote_ok?: boolean;
}

export interface CardState {
  status: "idle" | "loading" | "ready" | "creating" | "restoring" | "deleting" | "error";
  error?: string;
  info?: BackupInfo;
  backups?: BackupEntry[];
  config?: BackupConfig;
  rag?: RagStatus;
}
