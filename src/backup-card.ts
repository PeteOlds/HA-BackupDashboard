import { LitElement, html, css, TemplateResult, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  BackupCardConfig,
  BackupEntry,
  BackupInfo,
  BackupAgent,
  BackupConfig,
  BackupRetention,
  CardState,
  RagStatus,
  RagThresholds,
  HomeAssistant,
  isLocalAgent,
} from "./types";
import { computeRag, DEFAULT_THRESHOLDS, ragLabel } from "./rag";
import { localize } from "./localize";
import {
  getBackupInfo,
  generateBackup,
  deleteBackup,
  restoreBackup,
  fetchAgentsInfo,
  fetchConfigInfo,
} from "./websocket";
import "./confirm-dialog";

type SortKey = "name" | "date" | "size";
type ConfirmTarget = { kind: "delete" | "restore"; slug: string; name: string } | null;

const PAGE_SIZE = 10;

@customElement("backup-card")
export class BackupCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: BackupCardConfig;

  @state() private _state: CardState = { status: "idle" };

  @state() private _sortKey: SortKey = "date";

  @state() private _sortDir: "asc" | "desc" = "desc";

  @state() private _page = 0;

  @state() private _confirm: ConfirmTarget = null;

  @state() private _backupModalOpen = false;

  @state() private _backupPartial = false;

  @state() private _backupPassword = "";

  @state() private _agents: BackupAgent[] = [];

  @state() private _backupAgentIds: string[] = [];

  @state() private _banner: string | null = null;

  private _pollTimer?: number;

  public connectedCallback(): void {
    super.connectedCallback();
    const sec = this._config?.refresh_interval ?? 30;
    if (sec > 0 && this._pollTimer === undefined) {
      this._pollTimer = window.setInterval(() => void this._refresh(), sec * 1000);
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._pollTimer !== undefined) {
      window.clearInterval(this._pollTimer);
      this._pollTimer = undefined;
    }
  }

  public setConfig(config: BackupCardConfig): void {
    this._config = config;
  }

  public getCardSize(): number {
    return 8;
  }

  private get _isAdmin(): boolean {
    return this.hass?.user?.is_admin ?? false;
  }

  private get _thresholds(): RagThresholds {
    return {
      greenHours: this._config?.threshold_green_hours ?? DEFAULT_THRESHOLDS.greenHours,
      amberDays: this._config?.threshold_amber_days ?? DEFAULT_THRESHOLDS.amberDays,
      freeGb: this._config?.threshold_free_gb ?? DEFAULT_THRESHOLDS.freeGb,
    };
  }

  protected updated(changed: PropertyValues): void {
    if (changed.has("hass") && this.hass && this._state.status === "idle") {
      void this._load();
    }
  }

  public static async getConfigElement(): Promise<HTMLElement> {
    await import("./editor");
    return document.createElement("backup-card-editor");
  }

  public static getStubConfig(): BackupCardConfig {
    return {};
  }

  private async _fetch(): Promise<{ info: BackupInfo; backups: BackupEntry[] }> {
    const { info, backups } = await getBackupInfo(this.hass!);
    return { info, backups };
  }

  private async _load(): Promise<void> {
    if (!this.hass) return;
    this._state = { ...this._state, status: "loading" };
    try {
      const { info, backups } = await this._fetch();
      let config: BackupConfig | undefined;
      if (this._isAdmin) {
        try {
          config = await fetchConfigInfo(this.hass);
        } catch {
          config = undefined;
        }
      }
      this._state = {
        status: "ready",
        info,
        backups,
        config,
        rag: computeRag(info, this._thresholds),
      };
    } catch (err) {
      this._setError(err);
    }
  }

  private _setError(err: unknown): void {
    this._state = {
      status: "error",
      error: err instanceof Error ? err.message : String(err),
    };
  }

  // Lightweight refresh used by the poll timer; never clobbers an in-flight
  // action (creating/restoring) or an error state, and swallows transient
  // poll failures to avoid UI flicker.
  private async _refresh(): Promise<void> {
    if (!this.hass || this._state.status !== "ready") return;
    try {
      const { info, backups } = await this._fetch();
      this._state = {
        ...this._state,
        info,
        backups,
        rag: computeRag(info, this._thresholds),
      };
    } catch {
      /* transient poll error — keep last known state */
    }
  }

  private _navigate(path: string): void {
    window.dispatchEvent(
      new CustomEvent("navigate", { detail: { path }, bubbles: true, composed: true }),
    );
  }

  private _sorted(backups: BackupEntry[]): BackupEntry[] {
    const dir = this._sortDir === "asc" ? 1 : -1;
    const key = this._sortKey;
    return [...backups].sort((a, b) => {
      let r = 0;
      if (key === "name") r = a.name.localeCompare(b.name);
      else if (key === "date") r = new Date(a.date).getTime() - new Date(b.date).getTime();
      else if (key === "size") r = a.size - b.size;
      return r * dir;
    });
  }

  private _toggleSort(key: SortKey): void {
    if (this._sortKey === key) {
      this._sortDir = this._sortDir === "asc" ? "desc" : "asc";
    } else {
      this._sortKey = key;
      this._sortDir = key === "name" ? "asc" : "desc";
    }
    this._page = 0;
  }

  private _openBackupModal(): void {
    this._backupModalOpen = true;
    void this._loadAgents();
  }

  private async _loadAgents(): Promise<void> {
    if (!this.hass) return;
    try {
      const agents = await fetchAgentsInfo(this.hass);
      this._agents = agents;
      if (this._backupAgentIds.length === 0) {
        const local = agents.filter((a) => isLocalAgent(a.agent_id)).map((a) => a.agent_id);
        this._backupAgentIds = local.length ? local : agents.length ? [agents[0].agent_id] : [];
      }
    } catch {
      this._agents = [];
    }
  }

  private _toggleAgent(id: string, checked: boolean): void {
    const set = new Set(this._backupAgentIds);
    if (checked) set.add(id);
    else set.delete(id);
    this._backupAgentIds = [...set];
  }

  private _closeBackupModal(): void {
    this._backupModalOpen = false;
    this._backupAgentIds = [];
  }

  private async _doBackup(): Promise<void> {
    if (!this.hass) return;
    const partial = this._backupPartial;
    const password = this._backupPassword || undefined;
    const agentIds = this._backupAgentIds;
    this._closeBackupModal();
    this._showBanner(localize("card.backup_started"));
    this._state = { ...this._state, status: "creating" };
    try {
      await generateBackup(this.hass, { partial, password, agentIds });
      const { info, backups } = await this._fetch();
      this._state = { status: "ready", info, backups, rag: computeRag(info, this._thresholds) };
    } catch (err) {
      this._setError(err);
    }
  }

  private _showBanner(msg: string): void {
    this._banner = msg;
    window.setTimeout(() => {
      if (this._banner === msg) this._banner = null;
    }, 3000);
  }

  private async _doConfirmedAction(): Promise<void> {
    if (!this.hass || !this._confirm) return;
    const { kind, slug } = this._confirm;
    this._state = {
      ...this._state,
      status: kind === "restore" ? "restoring" : "deleting",
    };
    const target = this._confirm;
    this._confirm = null;
    try {
      if (kind === "delete") {
        await deleteBackup(this.hass, slug);
      } else {
        const entry = (this._state.backups ?? []).find((b) => b.slug === slug);
        await restoreBackup(this.hass, slug, entry?.agent_ids[0]);
      }
      const { info, backups } = await this._fetch();
      this._state = { status: "ready", info, backups, rag: computeRag(info, this._thresholds) };
      void target;
    } catch (err) {
      this._setError(err);
    }
  }

  protected render(): TemplateResult | void {
    if (!this._config) return html``;
    const s = this._state;
    const L = localize;

    if (s.status === "loading") return html`<p>${L("card.loading")}</p>`;
    if (s.status === "error") {
      return html`<ha-card>
        <p class="error">${L("card.error")}: ${s.error}</p>
        <button @click="${() => void this._load()}">${L("card.retry")}</button>
      </ha-card>`;
    }
    if (s.status === "idle" || !s.info) return html``;

    const busy = s.status === "creating" || s.status === "restoring" || s.status === "deleting";
    const sorted = this._sorted(s.backups ?? []);
    const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    const page = Math.min(this._page, pages - 1);
    const slice = sorted.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

    return html`
      <ha-card>
        ${this._banner
          ? html`<div class="banner">${this._banner}</div>`
          : ""}
        <div class="header">
          <h2>${this._config.name ?? L("card.title")}</h2>
          <span class="rag rag-${s.rag}" role="status" aria-live="polite"
            >${ragLabel(s.rag as RagStatus)}</span
          >
          <div class="spacer"></div>
          ${this._isAdmin
            ? html`              <button @click="${() => this._openBackupModal()}">${L("card.backup_now")}</button>
                <button @click="${() => this._navigate("/config/backup")}">${L("card.open_location")}</button>`
            : html`<span class="readonly">${L("card.readonly")}</span>`}
        </div>

        <div class="metrics">
          <div><span class="k">${L("card.last_backup")}</span><span>${
            s.info.last_backup ? new Date(s.info.last_backup).toLocaleString() : L("card.na")
          }</span></div>
          <div>
            <span class="k">${L("card.count")}</span
            ><span>${s.backups?.length ?? 0}</span>
          </div>
          <div>
            <span class="k">${L("card.local_size")}</span>
            <span>${formatMb(this._totalLocal(s.backups ?? []))}</span>
          </div>
          <div>
            <span class="k">${L("card.remote_size")}</span>
            <span>${formatMb(this._totalRemote(s.backups ?? []))}</span>
          </div>
          <div>
            <span class="k">${L("card.schedule")}</span>
            <span
              >${s.info.schedule?.next_run
                ? `${L("card.next")}: ${new Date(s.info.schedule.next_run).toLocaleString()}`
                : L("card.na")}</span
            >
            ${this._isAdmin
              ? html`<button class="link" @click="${() => this._navigate("/config/backup")}"
                  >${L("card.change")}</button
                >`
              : ""}
          </div>
          ${s.config?.retention
            ? html`<div>
                <span class="k">${L("card.retention")}</span>
                <span>${formatRetention(s.config.retention)}</span>
              </div>`
            : ""}
        </div>

        <table>
          <thead>
            <tr>
              <th @click="${() => this._toggleSort("name")}">${L("card.name")} ${this._arrow("name")}</th>
              <th @click="${() => this._toggleSort("date")}">${L("card.created")} ${this._arrow("date")}</th>
              <th @click="${() => this._toggleSort("size")}">${L("card.file_size")} ${this._arrow("size")}</th>
              <th>${L("card.location")}</th>
              <th>${L("card.type")}</th>
              ${this._isAdmin ? html`<th>${L("card.actions")}</th>` : ""}
            </tr>
          </thead>
          <tbody>
            ${slice.map(
              (b) => html`
                <tr>
                  <td>${b.name}</td>
                  <td title="${b.date}">${relativeTime(b.date)}</td>
                  <td>${formatMb(b.size)}</td>
                  <td>${(locationBadges(b.agent_ids)).map((l) => html`<span class="badge">${l}</span>`)}</td>
                  <td>${b.automatic ? L("card.automatic") : L("card.manual")}</td>
                  ${this._isAdmin
                    ? html`<td>
                        <button class="link danger" @click="${() => (this._confirm = { kind: "restore", slug: b.slug, name: b.name })}">${L("card.restore")}</button>
                        <button class="link danger" @click="${() => (this._confirm = { kind: "delete", slug: b.slug, name: b.name })}">${L("card.delete")}</button>
                      </td>`
                    : ""}
                </tr>
              `,
            )}
          </tbody>
        </table>

        <div class="pager">
          <button ?disabled="${page === 0}" @click="${() => (this._page = page - 1)}">${L("card.prev")}</button>
          <span>${page + 1} / ${pages}</span>
          <button ?disabled="${page >= pages - 1}" @click="${() => (this._page = page + 1)}">${L("card.pager_next")}</button>
        </div>

        ${busy
          ? html`<div class="overlay">${
              s.status === "restoring"
                ? L("card.restoring")
                : s.status === "deleting"
                  ? L("card.deleting")
                  : L("card.creating")
            }</div>`
          : ""}
      </ha-card>

      ${this._backupModalOpen
        ? html`<div class="overlay" @click="${(e: Event) => { if (e.target === e.currentTarget) this._backupModalOpen = false; }}">
            <div class="modal" role="dialog" aria-modal="true">
              <h3>${L("card.modal_title")}</h3>
              <label class="row"
                ><input
                  type="checkbox"
                  .checked="${this._backupPartial}"
                  @change="${(e: Event) => (this._backupPartial = (e.target as HTMLInputElement).checked)}"
                />
                <span>${L("card.partial")}</span></label
              >
              <label class="field"
                ><span class="k">${L("card.password")}</span
                ><input
                  type="password"
                  .value="${this._backupPassword}"
                  @input="${(e: Event) => (this._backupPassword = (e.target as HTMLInputElement).value)}"
                /></label
              >
              <div class="agents">
                <span class="k">${L("card.target")}</span>
                ${this._agents.length
                  ? html`${this._agents.map(
                      (a) => html`<label class="row agent"
                          ><input
                            type="checkbox"
                            .checked="${this._backupAgentIds.includes(a.agent_id)}"
                            @change="${(e: Event) => this._toggleAgent(a.agent_id, (e.target as HTMLInputElement).checked)}"
                          />
                          <span>${a.name}</span></label
                        >`,
                    )}`
                  : html`<span class="hint">${L("card.no_agents")}</span>`}
              </div>
              <div class="actions">
                <button @click="${() => this._closeBackupModal()}">${L("card.cancel")}</button>
                <button class="primary" @click="${() => void this._doBackup()}">${L("card.create")}</button>
              </div>
            </div>
          </div>`
        : ""}

      <backup-confirm-dialog
        .open="${this._confirm !== null}"
        title="${this._confirm ? (this._confirm.kind === "restore" ? L("card.confirm_restore_title") : L("card.confirm_delete_title")) : ""}"
        message="${this._confirm ? L("card.confirm_msg") : ""}"
        confirmLabel="${L("card.confirm")}"
        confirmColor="danger"
        @confirm="${() => void this._doConfirmedAction()}"
        @cancel="${() => (this._confirm = null)}"
      ></backup-confirm-dialog>
    `;
  }

  private _arrow(key: SortKey): string {
    if (this._sortKey !== key) return "";
    return this._sortDir === "asc" ? "▲" : "▼";
  }

  private _totalLocal(backups: BackupEntry[]): number {
    return backups
      .filter((b) => b.agent_ids.some((id) => isLocalAgent(id)))
      .reduce((sum, b) => sum + b.size, 0);
  }

  private _totalRemote(backups: BackupEntry[]): number {
    return backups
      .filter((b) => b.agent_ids.some((id) => !isLocalAgent(id)))
      .reduce((sum, b) => sum + b.size, 0);
  }

  static styles = css`
    :host {
      display: block;
      width: 100vw;
      max-width: 100vw;
      margin-left: calc(50% - 50vw);
    }
    .header { display: flex; align-items: center; gap: 0.5rem; }
    .spacer { flex: 1; }
    .rag-red { color: var(--error-color); font-weight: 600; }
    .rag-amber { color: var(--warning-color); font-weight: 600; }
    .rag-green { color: var(--success-color); font-weight: 600; }
    .error { color: var(--error-color); }
    .readonly { color: var(--secondary-text-color); font-style: italic; }
    .metrics { display: flex; gap: 1rem; flex-wrap: wrap; margin: 0.5rem 0; }
    .metrics .k { display: block; font-size: 0.75rem; color: var(--secondary-text-color); }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.3rem 0.4rem; border-bottom: 1px solid var(--divider-color); }
    th { cursor: pointer; user-select: none; }
    .badge { display: inline-block; margin-right: 0.25rem; padding: 0 0.4rem; border-radius: 0.5rem; background: var(--secondary-background-color); font-size: 0.75rem; }
    .link { background: none; border: none; color: var(--primary-color); cursor: pointer; padding: 0; margin-right: 0.5rem; }
    .link.danger { color: var(--error-color); }
    button { cursor: pointer; padding: 0.35rem 0.8rem; border-radius: 4px; border: 1px solid var(--divider-color); background: transparent; color: var(--primary-text-color); }
    .primary { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }
    .pager { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
    .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; }
    .modal { background: var(--card-background-color); color: var(--primary-text-color); padding: 1rem 1.25rem; border-radius: 8px; display: flex; flex-direction: column; gap: 0.5rem; max-width: 90vw; }
    .modal label { font-size: 0.85rem; }
    .modal label.row { display: flex; flex-direction: row; align-items: center; gap: 0.5rem; }
    .modal label.field { display: flex; flex-direction: column; gap: 0.2rem; }
    .modal label.field input { width: 100%; box-sizing: border-box; padding: 0.4rem; border: 1px solid var(--divider-color); border-radius: 4px; background: var(--card-background-color); color: var(--primary-text-color); }
    .actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
    .banner { background: var(--success-color); color: #fff; padding: 0.5rem 0.75rem; border-radius: 4px; margin-bottom: 0.5rem; }
    .modal .primary, .overlay > div.primary { color: #fff; }
    @media (max-width: 480px) {
      .metrics { flex-direction: column; }
      table th:nth-child(3), table td:nth-child(3) { display: none; }
    }
  `;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

function formatMb(bytes: number): string {
  return `${Math.round(bytes / 1024 ** 2)} MB`;
}

function formatRetention(r: BackupRetention): string {
  if (r.copies != null && r.days != null) return `Keep ${r.copies} copies / ${r.days} days`;
  if (r.copies != null) return `Keep ${r.copies} copies`;
  if (r.days != null) return `Keep ${r.days} days`;
  return "Unlimited";
}

function locationBadges(ids: string[]): string[] {
  const local = ids.some((id) => isLocalAgent(id));
  const remote = ids.some((id) => !isLocalAgent(id));
  const out: string[] = [];
  if (local) out.push("Local");
  if (remote) out.push("Remote");
  return out.length ? out : ["Local"];
}

declare global {
  interface HTMLElementTagNameMap {
    "backup-card": BackupCard;
  }
  interface Window {
    customCards?: {
      type: string;
      name: string;
      description: string;
      editor_type?: "custom" | "separate" | "none";
    }[];
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "backup-card",
  name: "Backup Card",
  description: "Monitor and manage Home Assistant backups from your dashboard.",
  editor_type: "custom",
});
