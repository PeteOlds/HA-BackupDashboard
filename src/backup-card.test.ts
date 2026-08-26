// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import "./backup-card";
import { BackupCard } from "./backup-card";

const DEFAULT_PATH = "/config/backup/overview";

function makeReadyCard(extraConfig: Record<string, unknown> = {}): any {
  const el = document.createElement("backup-card") as any;
  el.hass = { user: { is_admin: true } };
  el._config = { ...extraConfig };
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

// A mock of HA's <home-assistant> root: the card is placed INSIDE this
// element's shadow root, and the `navigate` listener lives on the host
// (outside the shadow). This proves the event escapes HA's shadow boundary.
customElements.define(
  "ha-root-mock",
  class extends HTMLElement {
    captured: any = null;
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.shadowRoot!.innerHTML = `<div id="slot"></div>`;
      this.addEventListener("navigate", (e: any) => (this.captured = e.detail));
    }
  },
);

describe("BackupCard navigation", () => {
  it("dispatches a 'navigate' event on the element (not window), default route", () => {
    const el = new BackupCard() as any;
    const spy = vi.spyOn(el, "dispatchEvent");
    el._navigate("/config/backup/overview");
    expect(spy).toHaveBeenCalledTimes(1);
    const evt = spy.mock.calls[0][0] as CustomEvent;
    expect(evt.type).toBe("navigate");
    expect(evt.detail.path).toBe(DEFAULT_PATH);
    expect(evt.bubbles).toBe(true);
    expect(evt.composed).toBe(true);
    expect(evt.target).toBe(el);
  });

  it("uses the configured backup_path", () => {
    const el = makeReadyCard({ backup_path: "/config/backup/automations" }) as any;
    expect(el._backupPath).toBe("/config/backup/automations");
    const spy = vi.spyOn(el, "dispatchEvent");
    el._navigate(el._backupPath);
    expect((spy.mock.calls[0][0] as CustomEvent).detail.path).toBe(
      "/config/backup/automations",
    );
  });

  it("width is 75% and no longer full-bleed", () => {
    const css = BackupCard.styles.toString();
    expect(css).toContain("width: 75%");
    expect(css).not.toContain("100vw");
  });

  it("Open Backup Manager navigates to the default route", async () => {
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
    expect(captured?.path).toBe(DEFAULT_PATH);
    el.remove();
  });

  it("Schedule Change and Retention Change both navigate to the default route", async () => {
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
    expect(captured?.path).toBe(DEFAULT_PATH);
    el.remove();
  });

  it("reaches a root listener through a shadow boundary (all three buttons)", async () => {
    const root = document.createElement("ha-root-mock") as any;
    document.body.appendChild(root);
    const el = makeReadyCard();
    root.shadowRoot.querySelector("#slot").appendChild(el);
    await el.updateComplete;

    const openBtn = [...el.shadowRoot.querySelectorAll("button")].find((b) =>
      (b.textContent ?? "").includes("Open Backup Manager"),
    ) as HTMLButtonElement;
    const changes = [...el.shadowRoot.querySelectorAll("button.link")].filter((b) =>
      (b.textContent ?? "").trim().includes("Change"),
    ) as HTMLButtonElement[];

    expect(openBtn).toBeTruthy();
    expect(changes.length).toBeGreaterThanOrEqual(2);

    openBtn.click();
    expect(root.captured?.path).toBe(DEFAULT_PATH);
    changes[0].click();
    expect(root.captured?.path).toBe(DEFAULT_PATH);
    changes[1].click();
    expect(root.captured?.path).toBe(DEFAULT_PATH);

    el.remove();
    root.remove();
  });
});
