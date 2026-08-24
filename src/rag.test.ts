import { describe, it, expect } from "vitest";
import { computeRag, DEFAULT_THRESHOLDS } from "./rag";
import { BackupInfo, RagThresholds } from "./types";

function info(partial: Partial<BackupInfo> = {}): BackupInfo {
  return {
    last_backup: null,
    last_job_failed: false,
    backing_up: false,
    ...partial,
  };
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

describe("computeRag", () => {
  it("is green when recent and remote ok", () => {
    expect(
      computeRag(info({ last_backup: hoursAgo(2), has_remote_agent: true, remote_ok: true })),
    ).toBe("green");
  });

  it("is amber when local only but remote required", () => {
    expect(
      computeRag(info({ last_backup: hoursAgo(2), has_remote_agent: true, remote_ok: false })),
    ).toBe("amber");
  });

  it("is amber in the 49h-71h window", () => {
    expect(computeRag(info({ last_backup: hoursAgo(60) }))).toBe("amber");
  });

  it("is red when older than 7 days", () => {
    expect(computeRag(info({ last_backup: hoursAgo(200) }))).toBe("red");
  });

  it("is red on a failed job", () => {
    expect(computeRag(info({ last_backup: hoursAgo(1), last_job_failed: true }))).toBe("red");
  });

  it("is red on low free space", () => {
    expect(
      computeRag(info({ last_backup: hoursAgo(1), free_space: { local: 0.5 * 1024 ** 3 } })),
    ).toBe("red");
  });

  it("is red when no backup has ever run", () => {
    expect(computeRag(info({ last_backup: null }))).toBe("red");
  });

  it("honours configurable thresholds", () => {
    const t: RagThresholds = { greenHours: 12, amberDays: 3, freeGb: 2 };
    expect(computeRag(info({ last_backup: hoursAgo(20) }), t)).toBe("amber");
    expect(computeRag(info({ last_backup: hoursAgo(100) }), t)).toBe("red");
    expect(computeRag(info({ last_backup: null }), t)).toBe("red");
    expect(
      computeRag(
        info({ last_backup: hoursAgo(1), has_remote_agent: true, remote_ok: true }),
        t,
      ),
    ).toBe("green");
  });

  it("uses default thresholds when none supplied", () => {
    expect(computeRag(info({ last_backup: hoursAgo(1) }))).toBe("green");
    expect(computeRag(info({ last_backup: hoursAgo(1) }))).toBe(
      computeRag(info({ last_backup: hoursAgo(1) }), DEFAULT_THRESHOLDS),
    );
  });
});
