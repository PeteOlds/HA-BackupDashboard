import { i as d, n as _, r as u, a as f, b as o, l as c, t as p } from "./backup-card-DlmGLsOo.js";
var g = Object.defineProperty, m = Object.getOwnPropertyDescriptor, h = (e, t, r, a) => {
  for (var i = a > 1 ? void 0 : a ? m(t, r) : t, l = e.length - 1, n; l >= 0; l--)
    (n = e[l]) && (i = (a ? n(t, r, i) : n(i)) || i);
  return a && i && g(t, r, i), i;
};
const v = [
  "refresh_interval",
  "threshold_green_hours",
  "threshold_amber_days",
  "threshold_free_gb"
];
let s = class extends f {
  setConfig(e) {
    this._config = e;
  }
  _update(e, t) {
    const r = { ...this._config }, a = t.trim();
    if (e === "name")
      a ? r.name = a : delete r.name;
    else if (v.includes(e)) {
      const i = Number(a);
      a !== "" && Number.isFinite(i) && i >= 0 ? r[e] = i : delete r[e];
    }
    this._config = r, this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: r } })
    );
  }
  _str(e) {
    var r;
    const t = (r = this._config) == null ? void 0 : r[e];
    return t == null ? "" : String(t);
  }
  render() {
    if (!this._config) return o``;
    const e = c;
    return o`
      <div class="card-config">
        <h3>${e("editor.title")}</h3>
        <ha-textfield
          label="${e("editor.name")}"
          .value="${this._str("name")}"
          @input="${(t) => this._update("name", t.target.value)}"
        ></ha-textfield>
        <ha-textfield
          type="number"
          label="${e("editor.refresh_interval")}"
          .value="${this._str("refresh_interval")}"
          @input="${(t) => this._update("refresh_interval", t.target.value)}"
        ></ha-textfield>
        <ha-textfield
          type="number"
          label="${e("editor.green_hours")}"
          .value="${this._str("threshold_green_hours")}"
          @input="${(t) => this._update("threshold_green_hours", t.target.value)}"
        ></ha-textfield>
        <ha-textfield
          type="number"
          label="${e("editor.amber_days")}"
          .value="${this._str("threshold_amber_days")}"
          @input="${(t) => this._update("threshold_amber_days", t.target.value)}"
        ></ha-textfield>
        <ha-textfield
          type="number"
          label="${e("editor.freegb")}"
          .value="${this._str("threshold_free_gb")}"
          @input="${(t) => this._update("threshold_free_gb", t.target.value)}"
        ></ha-textfield>
        <p class="hint">${e("editor.hint")}</p>
      </div>
    `;
  }
};
s.styles = d`
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
h([
  _({ attribute: !1 })
], s.prototype, "hass", 2);
h([
  u()
], s.prototype, "_config", 2);
s = h([
  p("backup-card-editor")
], s);
export {
  s as BackupCardEditor
};
