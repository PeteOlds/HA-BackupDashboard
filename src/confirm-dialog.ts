import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { localize } from "./localize";

@customElement("backup-confirm-dialog")
export class BackupConfirmDialog extends LitElement {
  @property({ type: Boolean }) public open = false;

  @property() public title = "";

  @property() public message = "";

  @property() public confirmLabel = localize("card.confirm");

  @property() public confirmColor: "danger" | "primary" = "danger";

  private _cancel(): void {
    this.dispatchEvent(new CustomEvent("cancel"));
  }

  private _confirm(): void {
    this.dispatchEvent(new CustomEvent("confirm"));
  }

  protected render(): TemplateResult {
    if (!this.open) return html``;
    return html`
      <div
        class="overlay"
        @click="${(e: Event) => {
          if (e.target === e.currentTarget) this._cancel();
        }}"
      >
        <div class="dialog" role="alertdialog" aria-modal="true">
          <h3>${this.title}</h3>
          <p>${this.message}</p>
          <div class="actions">
            <button class="cancel" @click="${this._cancel}">${localize("card.cancel")}</button>
            <button class="confirm ${this.confirmColor}" @click="${this._confirm}">
              ${this.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  static styles = css`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    .dialog {
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #000);
      padding: 1rem 1.25rem;
      border-radius: 8px;
      max-width: 90vw;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    button {
      cursor: pointer;
      padding: 0.4rem 0.9rem;
      border-radius: 4px;
      border: 1px solid var(--divider-color, #888);
      background: transparent;
      color: inherit;
    }
    .confirm.danger {
      background: var(--error-color);
      color: #fff;
      border-color: var(--error-color);
    }
    .confirm.primary {
      background: var(--primary-color);
      color: #fff;
      border-color: var(--primary-color);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "backup-confirm-dialog": BackupConfirmDialog;
  }
}
