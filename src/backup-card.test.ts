// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import "./backup-card";
import { BackupCard } from "./backup-card";

function makeReadyCard(): any {
  const el = document.createElement("backup-card") as any;
  el.hass = { user: { is_admin: true } };
  el._config = {};
  el._state = {
    status: "ready",
    info: {
      last_backup: null,
      last_job_failed: false,
      backing_up: false,
      schedule: { state: "disabled", next_run: null },
    },
    backups: [],
    config: { retention: { copies: 3, days: 7 } },
    rag: "healthy",
  };
  return el;
}

describe("BackupCard navigation", () => {
  it("dispatches a 'navigate' event on the element (not window)", () => {
    const el = new BackupCard() as any;
    const spy = vi.spyOn(el, "dispatchEvent");
    el._navigate("/config/backup");
    expect(spy).toHaveBeenCalledTimes(1);
    const evt = spy.mock.calls[0][0] as CustomEvent;
    expect(evt.type).toBe("navigate");
    expect(evt.detail.path).toBe("/config/backup");
    expect(evt.bubbles).toBe(true);
    expect(evt.composed).toBe(true);
    expect(evt.target).toBe(el);
  });

  it("width is 75% and no longer full-bleed", () => {
    const css = BackupCard.styles.toString();
    expect(css).toContain("width: 75%");
    expect(css).not.toContain("100vw");
  });

  it("Open Backup Manager navigates to /config/backup", async () => {
    const el = makeReadyCard();
    document.body.appendChild(el);
    await el.updateComplete;
    let captured: any = null;
    document.body.addEventListener("navigate", (e: any) => (captured = e.detail));
    const btn = [...el.shadowRoot.querySelectorAll("button")].find((b) =>
      (b.textContent ?? "").includes("Open Backup Manager"),
    );
    expect(btn).toBeTruthy();
    (btn as HTMLButtonElement).click();
    expect(captured?.path).toBe("/config/backup");
    el.remove();
  });

  it("Schedule Change and Retention Change both navigate", async () => {
    const el = makeReadyCard();
    document.body.appendChild(el);
    await el.updateComplete;
    const changes = [...el.shadowRoot.querySelectorAll("button.link")].filter((b) =>
      (b.textContent ?? "").trim().includes("Change"),
    );
    // schedule + retention
    expect(changes.length).toBeGreaterThanOrEqual(2);
    let captured: any = null;
    document.body.addEventListener("navigate", (e: any) => (captured = e.detail));
    (changes[0] as HTMLButtonElement).click();
    expect(captured?.path).toBe("/config/backup");
    el.remove();
  });
});
