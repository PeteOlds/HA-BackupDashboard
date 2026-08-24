import { describe, it, expect, vi } from "vitest";
import { generateBackup, deleteBackup, restoreBackup, fetchAgentsInfo, getBackupInfo } from "./websocket";

function fakeHass() {
  const calls: Record<string, unknown>[] = [];
  return {
    calls,
    callWS: vi.fn(async (msg: Record<string, unknown>) => {
      calls.push(msg);
      if (msg.type === "backup/agents/info") return { agents: [{ agent_id: "backup.local", name: "Local" }] };
      if (msg.type === "backup/info") {
        return {
          backups: [],
          last_completed_automatic_backup: null,
          last_attempted_automatic_backup: null,
          next_automatic_backup: null,
          agent_errors: {},
        };
      }
      return {};
    }),
  };
}

describe("websocket backup API", () => {
  it("generateBackup defaults to all local agents", async () => {
    const h = fakeHass();
    await generateBackup(h as any, {});
    expect(h.calls[0]).toMatchObject({
      type: "backup/generate",
      agent_ids: ["backup.local", "hassio.local"],
      include_all_addons: true,
    });
  });

  it("generateBackup honours chosen agent ids", async () => {
    const h = fakeHass();
    await generateBackup(h as any, { agentIds: ["remote1"], partial: true });
    expect(h.calls[0]).toMatchObject({
      type: "backup/generate",
      agent_ids: ["remote1"],
      include_all_addons: false,
    });
  });

  it("deleteBackup targets backup_id", async () => {
    const h = fakeHass();
    await deleteBackup(h as any, "abc");
    expect(h.calls[0]).toMatchObject({ type: "backup/delete", backup_id: "abc" });
  });

  it("restoreBackup passes backup_id and agent_id", async () => {
    const h = fakeHass();
    await restoreBackup(h as any, "abc", "backup.local");
    expect(h.calls[0]).toMatchObject({
      type: "backup/restore",
      backup_id: "abc",
      agent_id: "backup.local",
    });
  });

  it("fetchAgentsInfo returns agents", async () => {
    const h = fakeHass();
    const agents = await fetchAgentsInfo(h as any);
    expect(agents).toEqual([{ agent_id: "backup.local", name: "Local" }]);
  });

  it("getBackupInfo normalises HA response", async () => {
    const h = fakeHass();
    const { info, backups } = await getBackupInfo(h as any);
    expect(backups).toEqual([]);
    expect(info.last_backup).toBeNull();
  });
});
