import {
  BackupAgent,
  BackupConfig,
  BackupEntry,
  BackupInfo,
  HomeAssistant,
  isLocalAgent,
  LOCAL_AGENTS,
} from "./types";

// Shapes verified against HA frontend `src/data/backup.ts` (DESIGN.md §9).
// `slug` in our model maps to HA's `backup_id`.

// REQ-ACT-01 — trigger an immediate backup
export async function generateBackup(
  hass: HomeAssistant,
  opts: { agentIds?: string[]; name?: string; password?: string; partial?: boolean },
): Promise<void> {
  await hass.callWS({
    type: "backup/generate",
    agent_ids: opts.agentIds && opts.agentIds.length ? opts.agentIds : LOCAL_AGENTS.slice(),
    name: opts.name,
    password: opts.password,
    include_homeassistant: true,
    include_database: true,
    include_all_addons: !opts.partial,
  });
}

// REQ-ACT-03 — delete a selected backup
export async function deleteBackup(hass: HomeAssistant, slug: string): Promise<void> {
  await hass.callWS({ type: "backup/delete", backup_id: slug });
}

// REQ-ACT-05 — restore from a selected backup (destructive; caller confirms)
export async function restoreBackup(
  hass: HomeAssistant,
  slug: string,
  agentId?: string,
): Promise<void> {
  await hass.callWS({
    type: "backup/restore",
    backup_id: slug,
    agent_id: agentId ?? "backup.local",
  });
}

// REQ-ACT-06 — remote agent list (telemetry / labels)
export async function fetchAgentsInfo(hass: HomeAssistant): Promise<BackupAgent[]> {
  const data = await hass.callWS<any>({ type: "backup/agents/info" });
  return (data?.agents ?? []).map((a: any) => ({
    agent_id: a.agent_id,
    name: a.name ?? a.agent_id,
  }));
}

// Telemetry — PRD §5.1 (monitoring). `backup/info` returns both the health
// summary and the full backup list, so a single call serves the card.
export async function getBackupInfo(
  hass: HomeAssistant,
): Promise<{ info: BackupInfo; backups: BackupEntry[] }> {
  const data = await hass.callWS<any>({ type: "backup/info" });
  return {
    info: normaliseInfo(data),
    backups: Array.isArray(data?.backups) ? data.backups.map(normaliseBackup) : [],
  };
}

// REQ-ACT-02 — fetch backup retention/schedule config for display.
export async function fetchConfigInfo(hass: HomeAssistant): Promise<BackupConfig> {
  const data = await hass.callWS<any>({ type: "backup/config/info" });
  return normaliseConfig(data);
}

function normaliseInfo(data: any): BackupInfo {
  const backups: any[] = Array.isArray(data?.backups) ? data.backups : [];
  const completed = data?.last_completed_automatic_backup ?? null;
  const attempted = data?.last_attempted_automatic_backup ?? null;
  const lastBackup =
    completed ??
    (backups.length
      ? backups.map((b) => b.date).sort().slice(-1)[0]
      : null);
  const lastJobFailed =
    Boolean(attempted) &&
    (!completed || new Date(attempted).getTime() > new Date(completed).getTime());
  const state: string = data?.state ?? "idle";
  const backingUp = ["creating_backup", "receiving_backup", "restoring_backup"].includes(
    state,
  );
  const remoteIds = new Set(backups.flatMap((b) => Object.keys(b.agents ?? {})));
  const hasRemote = [...remoteIds].some((id) => !isLocalAgent(id));
  const remoteOk = backups.some((b) =>
    Object.keys(b.agents ?? {}).some((id) => !isLocalAgent(id)),
  );
  return {
    last_backup: lastBackup,
    last_job_failed: lastJobFailed,
    backing_up: backingUp,
    schedule: { state, next_run: data?.next_automatic_backup ?? null },
    has_remote_agent: hasRemote,
    remote_ok: remoteOk,
  };
}

function normaliseBackup(b: any): BackupEntry {
  const agents = b.agents ?? {};
  const sizes = Object.values(agents).map((a: any) => a.size ?? 0);
  const size = sizes.length ? Math.max(...sizes) : 0;
  return {
    slug: b.backup_id,
    name: b.name ?? b.backup_id,
    date: b.date ?? new Date().toISOString(),
    size,
    agent_ids: Object.keys(agents),
    automatic: Boolean(b.with_automatic_settings),
  };
}

function normaliseConfig(data: any): BackupConfig {
  const config = data?.config ?? {};
  const retention = config?.retention ?? null;
  return {
    retention: retention
      ? { copies: retention.copies ?? null, days: retention.days ?? null }
      : null,
  };
}
