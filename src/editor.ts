import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { BackupCardConfig, HomeAssistant } from "./types";
import { localize } from "./localize";

const NUMERIC_FIELDS: (keyof BackupCardConfig)[] = [
  "refresh_interval",
  "threshold_green_hours",
  "threshold_amber_days",
  "threshold_free_gb",
];

@customElement("backup-card-editor")
export class BackupCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: BackupCardConfig;

  public setConfig(config: BackupCardConfig): void {
    this._config = config;
  }

  private _update(field: keyof BackupCardConfig, raw: string): void {
    const config = { ...this._config } as BackupCardConfig;
    const value = raw.trim();
    if (field === "name") {
      if (value) config.name = value;
      else delete config.name;
    } else if (NUMERIC_FIELDS.includes(field)) {
      const num = Number(value);
      if (value !== "" && Number.isFinite(num) && num >= 0) {
        (config as Record<string, unknown>)[field] = num;
      } else {
        delete (config as Record<string, unknown>)[field];
      }
    }
    this._config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config } }),
    );
  }

  private _str(field: keyof BackupCardConfig): string {
    const v = this._config?.[field];
    return v == null ? "" : String(v);
  }

  protected render(): TemplateResult {
    if (!this._config) return html``;
    const L = localize;
    return html`
      <div class="card-config">
        <h3>${L("editor.title")}</h3>
        <ha-textfield
          label="${L("editor.name")}"
          .value="${this._str("name")}"
          @input="${(e: Event) =>
            this._update("name", (e.target as HTMLInputElement).value)}"
        ></ha-textfield>
        <ha-textfield
          type="number"
          label="${L("editor.refresh_interval")}"
          .value="${this._str("refresh_interval")}"
          @input="${(e: Event) =>
            this._update("refresh_interval", (e.target as HTMLInputElement).value)}"
        ></ha-textfield>
        <ha-textfield
          type="number"
          label="${L("editor.green_hours")}"
          .value="${this._str("threshold_green_hours")}"
          @input="${(e: Event) =>
            this._update("threshold_green_hours", (e.target as HTMLInputElement).value)}"
        ></ha-textfield>
        <ha-textfield
          type="number"
          label="${L("editor.amber_days")}"
          .value="${this._str("threshold_amber_days")}"
          @input="${(e: Event) =>
            this._update("threshold_amber_days", (e.target as HTMLInputElement).value)}"
        ></ha-textfield>
        <ha-textfield
          type="number"
          label="${L("editor.freegb")}"
          .value="${this._str("threshold_free_gb")}"
          @input="${(e: Event) =>
            this._update("threshold_free_gb", (e.target as HTMLInputElement).value)}"
        ></ha-textfield>
        <p class="hint">${L("editor.hint")}</p>
      </div>
    `;
  }

  static styles = css`
    .card-config {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 0.5rem 0;
    }
    h3 {
      margin: 0;
      font-size: 1rem;
    }
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.8rem;
    }
  `;
}
