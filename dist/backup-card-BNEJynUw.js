/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis, et = K.ShadowRoot && (K.ShadyCSS === void 0 || K.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, st = Symbol(), nt = /* @__PURE__ */ new WeakMap();
let kt = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== st) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (et && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = nt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && nt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Mt = (s) => new kt(typeof s == "string" ? s : s + "", void 0, st), At = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((r, i, n) => r + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + s[n + 1], s[0]);
  return new kt(e, s, st);
}, Tt = (s, t) => {
  if (et) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const r = document.createElement("style"), i = K.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = e.cssText, s.appendChild(r);
  }
}, at = et ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const r of t.cssRules) e += r.cssText;
  return Mt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Dt, defineProperty: Ut, getOwnPropertyDescriptor: Bt, getOwnPropertyNames: Ht, getOwnPropertySymbols: Nt, getPrototypeOf: Rt } = Object, v = globalThis, ot = v.trustedTypes, zt = ot ? ot.emptyScript : "", Q = v.reactiveElementPolyfillSupport, N = (s, t) => s, F = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? zt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, rt = (s, t) => !Dt(s, t), ct = { attribute: !0, type: String, converter: F, reflect: !1, useDefault: !1, hasChanged: rt };
var ft, mt;
(ft = Symbol.metadata) != null || (Symbol.metadata = Symbol("metadata")), (mt = v.litPropertyMetadata) != null || (v.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let P = class extends HTMLElement {
  static addInitializer(t) {
    var e;
    this._$Ei(), ((e = this.l) != null ? e : this.l = []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ct) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(t, r, e);
      i !== void 0 && Ut(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    var a;
    const { get: i, set: n } = (a = Bt(this.prototype, t)) != null ? a : { get() {
      return this[e];
    }, set(c) {
      this[e] = c;
    } };
    return { get: i, set(c) {
      const o = i == null ? void 0 : i.call(this);
      n == null || n.call(this, c), this.requestUpdate(t, o, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    var e;
    return (e = this.elementProperties.get(t)) != null ? e : ct;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const t = Rt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const e = this.properties, r = [...Ht(e), ...Nt(e)];
      for (const i of r) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [r, i] of e) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, r] of this.elementProperties) {
      const i = this._$Eu(e, r);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const i of r) e.unshift(at(i));
    } else t !== void 0 && e.push(at(t));
    return e;
  }
  static _$Eu(t, e) {
    const r = e.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e, r;
    ((e = this._$EO) != null ? e : this._$EO = /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && ((r = t.hostConnected) == null || r.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const r of e.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    var e;
    const t = (e = this.shadowRoot) != null ? e : this.attachShadow(this.constructor.shadowRootOptions);
    return Tt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t, e;
    (t = this.renderRoot) != null || (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((r) => {
      var i;
      return (i = r.hostConnected) == null ? void 0 : i.call(r);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var r;
      return (r = e.hostDisconnected) == null ? void 0 : r.call(e);
    });
  }
  attributeChangedCallback(t, e, r) {
    this._$AK(t, r);
  }
  _$ET(t, e) {
    var n;
    const r = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, r);
    if (i !== void 0 && r.reflect === !0) {
      const a = (((n = r.converter) == null ? void 0 : n.toAttribute) !== void 0 ? r.converter : F).toAttribute(e, r.type);
      this._$Em = t, a == null ? this.removeAttribute(i) : this.setAttribute(i, a), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n, a, c;
    const r = this.constructor, i = r._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const o = r.getPropertyOptions(i), h = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? o.converter : F;
      this._$Em = i;
      const d = h.fromAttribute(e, o.type);
      this[i] = (c = d != null ? d : (a = this._$Ej) == null ? void 0 : a.get(i)) != null ? c : d, this._$Em = null;
    }
  }
  requestUpdate(t, e, r, i = !1, n) {
    var a, c;
    if (t !== void 0) {
      const o = this.constructor;
      if (i === !1 && (n = this[t]), r != null || (r = o.getPropertyOptions(t)), !(((a = r.hasChanged) != null ? a : rt)(n, e) || r.useDefault && r.reflect && n === ((c = this._$Ej) == null ? void 0 : c.get(t)) && !this.hasAttribute(o._$Eu(t, r)))) return;
      this.C(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: r, reflect: i, wrapped: n }, a) {
    var c, o, h;
    r && !((c = this._$Ej) != null ? c : this._$Ej = /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, (o = a != null ? a : e) != null ? o : this[t]), n !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && ((h = this._$Eq) != null ? h : this._$Eq = /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var r, i;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if ((r = this.renderRoot) != null || (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [a, c] of this._$Ep) this[a] = c;
        this._$Ep = void 0;
      }
      const n = this.constructor.elementProperties;
      if (n.size > 0) for (const [a, c] of n) {
        const { wrapped: o } = c, h = this[a];
        o !== !0 || this._$AL.has(a) || h === void 0 || this.C(a, void 0, c, h);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((n) => {
        var a;
        return (a = n.hostUpdate) == null ? void 0 : a.call(n);
      }), this.update(e)) : this._$EM();
    } catch (n) {
      throw t = !1, this._$EM(), n;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((r) => {
      var i;
      return (i = r.hostUpdated) == null ? void 0 : i.call(r);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
var $t;
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[N("elementProperties")] = /* @__PURE__ */ new Map(), P[N("finalized")] = /* @__PURE__ */ new Map(), Q == null || Q({ ReactiveElement: P }), (($t = v.reactiveElementVersions) != null ? $t : v.reactiveElementVersions = []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, lt = (s) => s, Z = R.trustedTypes, ht = Z ? Z.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, wt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, Et = "?" + y, jt = `<${Et}>`, x = document, z = () => x.createComment(""), j = (s) => s === null || typeof s != "object" && typeof s != "function", it = Array.isArray, Lt = (s) => it(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", X = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, dt = /-->/g, ut = />/g, w = RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pt = /'/g, _t = /"/g, St = /^(?:script|style|textarea|title)$/i, It = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), p = It(1), T = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), gt = /* @__PURE__ */ new WeakMap(), E = x.createTreeWalker(x, 129);
function xt(s, t) {
  if (!it(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ht !== void 0 ? ht.createHTML(t) : t;
}
const Wt = (s, t) => {
  const e = s.length - 1, r = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = H;
  for (let c = 0; c < e; c++) {
    const o = s[c];
    let h, d, u = -1, g = 0;
    for (; g < o.length && (a.lastIndex = g, d = a.exec(o), d !== null); ) g = a.lastIndex, a === H ? d[1] === "!--" ? a = dt : d[1] !== void 0 ? a = ut : d[2] !== void 0 ? (St.test(d[2]) && (i = RegExp("</" + d[2], "g")), a = w) : d[3] !== void 0 && (a = w) : a === w ? d[0] === ">" ? (a = i != null ? i : H, u = -1) : d[1] === void 0 ? u = -2 : (u = a.lastIndex - d[2].length, h = d[1], a = d[3] === void 0 ? w : d[3] === '"' ? _t : pt) : a === _t || a === pt ? a = w : a === dt || a === ut ? a = H : (a = w, i = void 0);
    const l = a === w && s[c + 1].startsWith("/>") ? " " : "";
    n += a === H ? o + jt : u >= 0 ? (r.push(h), o.slice(0, u) + wt + o.slice(u) + y + l) : o + y + (u === -2 ? c : l);
  }
  return [xt(s, n + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class L {
  constructor({ strings: t, _$litType$: e }, r) {
    let i;
    this.parts = [];
    let n = 0, a = 0;
    const c = t.length - 1, o = this.parts, [h, d] = Wt(t, e);
    if (this.el = L.createElement(h, r), E.currentNode = this.el.content, e === 2 || e === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (i = E.nextNode()) !== null && o.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const u of i.getAttributeNames()) if (u.endsWith(wt)) {
          const g = d[a++], l = i.getAttribute(u).split(y), $ = /([.?@])?(.*)/.exec(g);
          o.push({ type: 1, index: n, name: $[2], strings: l, ctor: $[1] === "." ? qt : $[1] === "?" ? Kt : $[1] === "@" ? Vt : J }), i.removeAttribute(u);
        } else u.startsWith(y) && (o.push({ type: 6, index: n }), i.removeAttribute(u));
        if (St.test(i.tagName)) {
          const u = i.textContent.split(y), g = u.length - 1;
          if (g > 0) {
            i.textContent = Z ? Z.emptyScript : "";
            for (let l = 0; l < g; l++) i.append(u[l], z()), E.nextNode(), o.push({ type: 2, index: ++n });
            i.append(u[g], z());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Et) o.push({ type: 2, index: n });
      else {
        let u = -1;
        for (; (u = i.data.indexOf(y, u + 1)) !== -1; ) o.push({ type: 7, index: n }), u += y.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const r = x.createElement("template");
    return r.innerHTML = t, r;
  }
}
function D(s, t, e = s, r) {
  var a, c, o;
  if (t === T) return t;
  let i = r !== void 0 ? (a = e._$Co) == null ? void 0 : a[r] : e._$Cl;
  const n = j(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((c = i == null ? void 0 : i._$AO) == null || c.call(i, !1), n === void 0 ? i = void 0 : (i = new n(s), i._$AT(s, e, r)), r !== void 0 ? ((o = e._$Co) != null ? o : e._$Co = [])[r] = i : e._$Cl = i), i !== void 0 && (t = D(s, i._$AS(s, t.values), i, r)), t;
}
class Gt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    var h;
    const { el: { content: e }, parts: r } = this._$AD, i = ((h = t == null ? void 0 : t.creationScope) != null ? h : x).importNode(e, !0);
    E.currentNode = i;
    let n = E.nextNode(), a = 0, c = 0, o = r[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let d;
        o.type === 2 ? d = new W(n, n.nextSibling, this, t) : o.type === 1 ? d = new o.ctor(n, o.name, o.strings, this, t) : o.type === 6 && (d = new Ft(n, this, t)), this._$AV.push(d), o = r[++c];
      }
      a !== (o == null ? void 0 : o.index) && (n = E.nextNode(), a++);
    }
    return E.currentNode = x, i;
  }
  p(t) {
    let e = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, e), e += r.strings.length - 2) : r._$AI(t[e])), e++;
  }
}
class W {
  get _$AU() {
    var t, e;
    return (e = (t = this._$AM) == null ? void 0 : t._$AU) != null ? e : this._$Cv;
  }
  constructor(t, e, r, i) {
    var n;
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = r, this.options = i, this._$Cv = (n = i == null ? void 0 : i.isConnected) != null ? n : !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = D(this, t, e), j(t) ? t === _ || t == null || t === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : t !== this._$AH && t !== T && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Lt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== _ && j(this._$AH) ? this._$AA.nextSibling.data = t : this.T(x.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: r } = t, i = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = L.createElement(xt(r.h, r.h[0]), this.options)), r);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(e);
    else {
      const a = new Gt(i, this), c = a.u(this.options);
      a.p(e), this.T(c), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = gt.get(t.strings);
    return e === void 0 && gt.set(t.strings, e = new L(t)), e;
  }
  k(t) {
    it(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let r, i = 0;
    for (const n of t) i === e.length ? e.push(r = new W(this.O(z()), this.O(z()), this, this.options)) : r = e[i], r._$AI(n), i++;
    i < e.length && (this._$AR(r && r._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = lt(t).nextSibling;
      lt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class J {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, r, i, n) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = _;
  }
  _$AI(t, e = this, r, i) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) t = D(this, t, e, 0), a = !j(t) || t !== this._$AH && t !== T, a && (this._$AH = t);
    else {
      const c = t;
      let o, h;
      for (t = n[0], o = 0; o < n.length - 1; o++) h = D(this, c[r + o], e, o), h === T && (h = this._$AH[o]), a || (a = !j(h) || h !== this._$AH[o]), h === _ ? t = _ : t !== _ && (t += (h != null ? h : "") + n[o + 1]), this._$AH[o] = h;
    }
    a && !i && this.j(t);
  }
  j(t) {
    t === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t != null ? t : "");
  }
}
class qt extends J {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === _ ? void 0 : t;
  }
}
class Kt extends J {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== _);
  }
}
class Vt extends J {
  constructor(t, e, r, i, n) {
    super(t, e, r, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    var a;
    if ((t = (a = D(this, t, e, 0)) != null ? a : _) === T) return;
    const r = this._$AH, i = t === _ && r !== _ || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, n = t !== _ && (r === _ || i);
    i && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e, r;
    typeof this._$AH == "function" ? this._$AH.call((r = (e = this.options) == null ? void 0 : e.host) != null ? r : this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ft {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    D(this, t);
  }
}
const Y = R.litHtmlPolyfillSupport;
var bt;
Y == null || Y(L, W), ((bt = R.litHtmlVersions) != null ? bt : R.litHtmlVersions = []).push("3.3.3");
const Zt = (s, t, e) => {
  var n, a;
  const r = (n = e == null ? void 0 : e.renderBefore) != null ? n : t;
  let i = r._$litPart$;
  if (i === void 0) {
    const c = (a = e == null ? void 0 : e.renderBefore) != null ? a : null;
    r._$litPart$ = i = new W(t.insertBefore(z(), c), c, void 0, e != null ? e : {});
  }
  return i._$AI(s), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const S = globalThis;
class O extends P {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e, r;
    const t = super.createRenderRoot();
    return (r = (e = this.renderOptions).renderBefore) != null || (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Zt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return T;
  }
}
var yt;
O._$litElement$ = !0, O.finalized = !0, (yt = S.litElementHydrateSupport) == null || yt.call(S, { LitElement: O });
const tt = S.litElementPolyfillSupport;
tt == null || tt({ LitElement: O });
var vt;
((vt = S.litElementVersions) != null ? vt : S.litElementVersions = []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ct = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Jt = { attribute: !0, type: String, converter: F, reflect: !1, hasChanged: rt }, Qt = (s = Jt, t, e) => {
  const { kind: r, metadata: i } = e;
  let n = globalThis.litPropertyMetadata.get(i);
  if (n === void 0 && globalThis.litPropertyMetadata.set(i, n = /* @__PURE__ */ new Map()), r === "setter" && ((s = Object.create(s)).wrapped = !0), n.set(e.name, s), r === "accessor") {
    const { name: a } = e;
    return { set(c) {
      const o = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(a, o, s, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(a, void 0, s, c), c;
    } };
  }
  if (r === "setter") {
    const { name: a } = e;
    return function(c) {
      const o = this[a];
      t.call(this, c), this.requestUpdate(a, o, s, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function C(s) {
  return (t, e) => typeof e == "object" ? Qt(s, t, e) : ((r, i, n) => {
    const a = i.hasOwnProperty(n);
    return i.constructor.createProperty(n, r), a ? Object.getOwnPropertyDescriptor(i, n) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function b(s) {
  return C({ ...s, state: !0, attribute: !1 });
}
const Pt = ["backup.local", "hassio.local"];
function I(s) {
  return Pt.includes(s);
}
const Xt = {
  title: "Backups",
  loading: "Loading backups…",
  error: "Error",
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
  last_backup: "Last backup",
  count: "Backups",
  schedule: "Schedule",
  next: "Next",
  na: "n/a",
  change: "Change",
  name: "Name",
  type: "Type",
  created: "Created",
  size: "Size",
  location: "Location",
  actions: "Actions",
  automatic: "Automatic",
  manual: "Manual",
  restore: "Restore",
  delete: "Delete",
  readonly: "Read-only",
  backup_now: "Backup Now",
  open_location: "Open Backup Manager",
  prev: "Prev",
  pager_next: "Next",
  retry: "Retry",
  creating: "Creating Backup…",
  restoring: "Restoring…",
  cancel: "Cancel",
  create: "Create",
  partial: "Partial backup",
  password: "Password (optional)",
  modal_title: "Backup Now",
  target: "Target location(s)",
  no_agents: "No backup agents available",
  confirm: "Confirm",
  confirm_msg: "This action cannot be undone. Are you sure?",
  confirm_restore_title: "Restore backup",
  confirm_delete_title: "Delete backup",
  editor: {
    title: "Backup Card",
    name: "Title (optional)",
    refresh_interval: "Refresh interval (seconds, 0 to disable)",
    green_hours: "Green threshold (hours since last backup)",
    amber_days: "Amber threshold (days since last backup)",
    freegb: "Free-space warning (GB, 0 to ignore)",
    hint: "Leave a threshold blank to use the default. Changes apply when you save the card."
  }
}, Yt = {
  card: Xt
}, te = Yt;
function M(s) {
  const t = s.split(".").reduce((e, r) => {
    if (e && typeof e == "object" && r in e)
      return e[r];
  }, te);
  return typeof t == "string" ? t : s;
}
const V = {
  greenHours: 48,
  amberDays: 7,
  freeGb: 1
}, ee = 1024 ** 3;
function se(s) {
  if (!s) return null;
  const t = Date.now() - new Date(s).getTime();
  return Number.isNaN(t) ? null : t / 36e5;
}
function G(s, t = V) {
  if (s.last_job_failed || s.free_space && Math.min(...Object.values(s.free_space)) < t.freeGb * ee)
    return "red";
  const e = se(s.last_backup);
  return e === null || e > t.amberDays * 24 ? "red" : e <= t.greenHours && (!s.has_remote_agent || s.remote_ok) ? "green" : "amber";
}
function re(s) {
  return M(s === "green" ? "card.healthy" : s === "amber" ? "card.warning" : "card.critical");
}
async function ie(s, t) {
  await s.callWS({
    type: "backup/generate",
    agent_ids: t.agentIds && t.agentIds.length ? t.agentIds : Pt.slice(),
    name: t.name,
    password: t.password,
    include_homeassistant: !0,
    include_database: !0,
    include_all_addons: !t.partial
  });
}
async function ne(s, t) {
  await s.callWS({ type: "backup/delete", backup_id: t });
}
async function ae(s, t, e) {
  await s.callWS({
    type: "backup/restore",
    backup_id: t,
    agent_id: e != null ? e : "backup.local"
  });
}
async function oe(s) {
  var e;
  const t = await s.callWS({ type: "backup/agents/info" });
  return ((e = t == null ? void 0 : t.agents) != null ? e : []).map((r) => {
    var i;
    return {
      agent_id: r.agent_id,
      name: (i = r.name) != null ? i : r.agent_id
    };
  });
}
async function ce(s) {
  const t = await s.callWS({ type: "backup/info" });
  return {
    info: le(t),
    backups: Array.isArray(t == null ? void 0 : t.backups) ? t.backups.map(he) : []
  };
}
function le(s) {
  var u, g, l, $;
  const t = Array.isArray(s == null ? void 0 : s.backups) ? s.backups : [], e = (u = s == null ? void 0 : s.last_completed_automatic_backup) != null ? u : null, r = (g = s == null ? void 0 : s.last_attempted_automatic_backup) != null ? g : null, i = e != null ? e : t.length ? t.map((A) => A.date).sort().slice(-1)[0] : null, n = !!r && (!e || new Date(r).getTime() > new Date(e).getTime()), a = (l = s == null ? void 0 : s.state) != null ? l : "idle", c = ["creating_backup", "receiving_backup", "restoring_backup"].includes(
    a
  ), h = [...new Set(t.flatMap((A) => {
    var B;
    return Object.keys((B = A.agents) != null ? B : {});
  }))].some((A) => !I(A)), d = t.some(
    (A) => {
      var B;
      return Object.keys((B = A.agents) != null ? B : {}).some((Ot) => !I(Ot));
    }
  );
  return {
    last_backup: i,
    last_job_failed: n,
    backing_up: c,
    schedule: { state: a, next_run: ($ = s == null ? void 0 : s.next_automatic_backup) != null ? $ : null },
    has_remote_agent: h,
    remote_ok: d
  };
}
function he(s) {
  var i, n, a;
  const t = (i = s.agents) != null ? i : {}, e = Object.values(t).map((c) => {
    var o;
    return (o = c.size) != null ? o : 0;
  }), r = e.length ? Math.max(...e) : 0;
  return {
    slug: s.backup_id,
    name: (n = s.name) != null ? n : s.backup_id,
    date: (a = s.date) != null ? a : (/* @__PURE__ */ new Date()).toISOString(),
    size: r,
    agent_ids: Object.keys(t),
    automatic: !!s.with_automatic_settings
  };
}
var de = Object.defineProperty, ue = Object.getOwnPropertyDescriptor, U = (s, t, e, r) => {
  for (var i = r > 1 ? void 0 : r ? ue(t, e) : t, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (i = (r ? a(t, e, i) : a(i)) || i);
  return r && i && de(t, e, i), i;
};
let k = class extends O {
  constructor() {
    super(...arguments), this.open = !1, this.title = "", this.message = "", this.confirmLabel = M("card.confirm"), this.confirmColor = "danger";
  }
  _cancel() {
    this.dispatchEvent(new CustomEvent("cancel"));
  }
  _confirm() {
    this.dispatchEvent(new CustomEvent("confirm"));
  }
  render() {
    return this.open ? p`
      <div
        class="overlay"
        @click="${(s) => {
      s.target === s.currentTarget && this._cancel();
    }}"
      >
        <div class="dialog" role="alertdialog" aria-modal="true">
          <h3>${this.title}</h3>
          <p>${this.message}</p>
          <div class="actions">
            <button class="cancel" @click="${this._cancel}">${M("card.cancel")}</button>
            <button class="confirm ${this.confirmColor}" @click="${this._confirm}">
              ${this.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    ` : p``;
  }
};
k.styles = At`
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
U([
  C({ type: Boolean })
], k.prototype, "open", 2);
U([
  C()
], k.prototype, "title", 2);
U([
  C()
], k.prototype, "message", 2);
U([
  C()
], k.prototype, "confirmLabel", 2);
U([
  C()
], k.prototype, "confirmColor", 2);
k = U([
  Ct("backup-confirm-dialog")
], k);
var pe = Object.defineProperty, _e = Object.getOwnPropertyDescriptor, m = (s, t, e, r) => {
  for (var i = r > 1 ? void 0 : r ? _e(t, e) : t, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (i = (r ? a(t, e, i) : a(i)) || i);
  return r && i && pe(t, e, i), i;
};
const q = 10;
let f = class extends O {
  constructor() {
    super(...arguments), this._state = { status: "idle" }, this._sortKey = "date", this._sortDir = "desc", this._page = 0, this._confirm = null, this._backupModalOpen = !1, this._backupPartial = !1, this._backupPassword = "", this._agents = [], this._backupAgentIds = [];
  }
  connectedCallback() {
    var t, e;
    super.connectedCallback();
    const s = (e = (t = this._config) == null ? void 0 : t.refresh_interval) != null ? e : 30;
    s > 0 && this._pollTimer === void 0 && (this._pollTimer = window.setInterval(() => void this._refresh(), s * 1e3));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._pollTimer !== void 0 && (window.clearInterval(this._pollTimer), this._pollTimer = void 0);
  }
  setConfig(s) {
    this._config = s;
  }
  getCardSize() {
    return 8;
  }
  get _isAdmin() {
    var s, t, e;
    return (e = (t = (s = this.hass) == null ? void 0 : s.user) == null ? void 0 : t.is_admin) != null ? e : !1;
  }
  get _thresholds() {
    var s, t, e, r, i, n;
    return {
      greenHours: (t = (s = this._config) == null ? void 0 : s.threshold_green_hours) != null ? t : V.greenHours,
      amberDays: (r = (e = this._config) == null ? void 0 : e.threshold_amber_days) != null ? r : V.amberDays,
      freeGb: (n = (i = this._config) == null ? void 0 : i.threshold_free_gb) != null ? n : V.freeGb
    };
  }
  updated(s) {
    s.has("hass") && this.hass && this._state.status === "idle" && this._load();
  }
  static async getConfigElement() {
    return await import("./editor-wwdutBVg.js"), document.createElement("backup-card-editor");
  }
  static getStubConfig() {
    return {};
  }
  async _fetch() {
    const { info: s, backups: t } = await ce(this.hass);
    return { info: s, backups: t };
  }
  async _load() {
    if (this.hass) {
      this._state = { ...this._state, status: "loading" };
      try {
        const { info: s, backups: t } = await this._fetch();
        this._state = {
          status: "ready",
          info: s,
          backups: t,
          rag: G(s, this._thresholds)
        };
      } catch (s) {
        this._setError(s);
      }
    }
  }
  _setError(s) {
    this._state = {
      status: "error",
      error: s instanceof Error ? s.message : String(s)
    };
  }
  // Lightweight refresh used by the poll timer; never clobbers an in-flight
  // action (creating/restoring) or an error state, and swallows transient
  // poll failures to avoid UI flicker.
  async _refresh() {
    if (!(!this.hass || this._state.status !== "ready"))
      try {
        const { info: s, backups: t } = await this._fetch();
        this._state = {
          ...this._state,
          info: s,
          backups: t,
          rag: G(s, this._thresholds)
        };
      } catch {
      }
  }
  _navigate(s) {
    this.dispatchEvent(
      new CustomEvent("navigate", { detail: { path: s }, bubbles: !0, composed: !0 })
    );
  }
  _sorted(s) {
    const t = this._sortDir === "asc" ? 1 : -1, e = this._sortKey;
    return [...s].sort((r, i) => {
      let n = 0;
      return e === "name" ? n = r.name.localeCompare(i.name) : e === "date" ? n = new Date(r.date).getTime() - new Date(i.date).getTime() : e === "size" && (n = r.size - i.size), n * t;
    });
  }
  _toggleSort(s) {
    this._sortKey === s ? this._sortDir = this._sortDir === "asc" ? "desc" : "asc" : (this._sortKey = s, this._sortDir = s === "name" ? "asc" : "desc"), this._page = 0;
  }
  _openBackupModal() {
    this._backupModalOpen = !0, this._loadAgents();
  }
  async _loadAgents() {
    if (this.hass)
      try {
        const s = await oe(this.hass);
        if (this._agents = s, this._backupAgentIds.length === 0) {
          const t = s.filter((e) => I(e.agent_id)).map((e) => e.agent_id);
          this._backupAgentIds = t.length ? t : s.length ? [s[0].agent_id] : [];
        }
      } catch {
        this._agents = [];
      }
  }
  _toggleAgent(s, t) {
    const e = new Set(this._backupAgentIds);
    t ? e.add(s) : e.delete(s), this._backupAgentIds = [...e];
  }
  _closeBackupModal() {
    this._backupModalOpen = !1, this._backupAgentIds = [];
  }
  async _doBackup() {
    if (!this.hass) return;
    const s = this._backupPartial, t = this._backupPassword || void 0, e = this._backupAgentIds;
    this._closeBackupModal(), this._state = { ...this._state, status: "creating" };
    try {
      await ie(this.hass, { partial: s, password: t, agentIds: e });
      const { info: r, backups: i } = await this._fetch();
      this._state = { status: "ready", info: r, backups: i, rag: G(r, this._thresholds) };
    } catch (r) {
      this._setError(r);
    }
  }
  async _doConfirmedAction() {
    var e;
    if (!this.hass || !this._confirm) return;
    const { kind: s, slug: t } = this._confirm;
    this._state = {
      ...this._state,
      status: s === "restore" ? "restoring" : "creating"
    }, this._confirm, this._confirm = null;
    try {
      if (s === "delete")
        await ne(this.hass, t);
      else {
        const n = ((e = this._state.backups) != null ? e : []).find((a) => a.slug === t);
        await ae(this.hass, t, n == null ? void 0 : n.agent_ids[0]);
      }
      const { info: r, backups: i } = await this._fetch();
      this._state = { status: "ready", info: r, backups: i, rag: G(r, this._thresholds) };
    } catch (r) {
      this._setError(r);
    }
  }
  render() {
    var c, o, h, d, u, g;
    if (!this._config) return p``;
    const s = this._state, t = M;
    if (s.status === "loading") return p`<p>${t("card.loading")}</p>`;
    if (s.status === "error")
      return p`<ha-card>
        <p class="error">${t("card.error")}: ${s.error}</p>
        <button @click="${() => void this._load()}">${t("card.retry")}</button>
      </ha-card>`;
    if (s.status === "idle" || !s.info) return p``;
    const e = s.status === "creating" || s.status === "restoring", r = this._sorted((c = s.backups) != null ? c : []), i = Math.max(1, Math.ceil(r.length / q)), n = Math.min(this._page, i - 1), a = r.slice(n * q, n * q + q);
    return p`
      <ha-card>
        <div class="header">
          <span class="rag rag-${s.rag}" role="status" aria-live="polite"
            >${re(s.rag)}</span
          >
          <h2>${(o = this._config.name) != null ? o : t("card.title")}</h2>
          <div class="spacer"></div>
          ${this._isAdmin ? p`              <button @click="${() => this._openBackupModal()}">${t("card.backup_now")}</button>
                <button @click="${() => this._navigate("/config/backup")}">${t("card.open_location")}</button>` : p`<span class="readonly">${t("card.readonly")}</span>`}
        </div>

        <div class="metrics">
          <div><span class="k">${t("card.last_backup")}</span><span>${(h = s.info.last_backup) != null ? h : t("card.na")}</span></div>
          <div>
            <span class="k">${t("card.count")}</span
            ><span>${(u = (d = s.backups) == null ? void 0 : d.length) != null ? u : 0}</span>
          </div>
          <div>
            <span class="k">${t("card.schedule")}</span>
            <span
              >${(g = s.info.schedule) != null && g.next_run ? `${t("card.next")}: ${new Date(s.info.schedule.next_run).toLocaleString()}` : t("card.na")}</span
            >
            ${this._isAdmin ? p`<button class="link" @click="${() => this._navigate("/config/backup")}"
                  >${t("card.change")}</button
                >` : ""}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th @click="${() => this._toggleSort("name")}">${t("card.name")} ${this._arrow("name")}</th>
              <th>${t("card.type")}</th>
              <th @click="${() => this._toggleSort("date")}">${t("card.created")} ${this._arrow("date")}</th>
              <th @click="${() => this._toggleSort("size")}">${t("card.size")} ${this._arrow("size")}</th>
              <th>${t("card.location")}</th>
              ${this._isAdmin ? p`<th>${t("card.actions")}</th>` : ""}
            </tr>
          </thead>
          <tbody>
            ${a.map(
      (l) => p`
                <tr>
                  <td>${l.name}</td>
                  <td>${l.automatic ? t("card.automatic") : t("card.manual")}</td>
                  <td title="${l.date}">${ge(l.date)}</td>
                  <td>${fe(l.size)}</td>
                  <td>${me(l.agent_ids).map(($) => p`<span class="badge">${$}</span>`)}</td>
                  ${this._isAdmin ? p`<td>
                        <button class="link danger" @click="${() => this._confirm = { kind: "restore", slug: l.slug, name: l.name }}">${t("card.restore")}</button>
                        <button class="link danger" @click="${() => this._confirm = { kind: "delete", slug: l.slug, name: l.name }}">${t("card.delete")}</button>
                      </td>` : ""}
                </tr>
              `
    )}
          </tbody>
        </table>

        <div class="pager">
          <button ?disabled="${n === 0}" @click="${() => this._page = n - 1}">${t("card.prev")}</button>
          <span>${n + 1} / ${i}</span>
          <button ?disabled="${n >= i - 1}" @click="${() => this._page = n + 1}">${t("card.pager_next")}</button>
        </div>

        ${e ? p`<div class="overlay">${s.status === "restoring" ? t("card.restoring") : t("card.creating")}</div>` : ""}
      </ha-card>

      ${this._backupModalOpen ? p`<div class="overlay" @click="${(l) => {
      l.target === l.currentTarget && (this._backupModalOpen = !1);
    }}">
            <div class="modal" role="dialog" aria-modal="true">
              <h3>${t("card.modal_title")}</h3>
              <label><input type="checkbox" .checked="${this._backupPartial}" @change="${(l) => this._backupPartial = l.target.checked}"
                /> ${t("card.partial")}</label>
              <label>${t("card.password")}<input type="password" .value="${this._backupPassword}" @input="${(l) => this._backupPassword = l.target.value}"
                /></label>
              <div class="agents">
                <span class="k">${t("card.target")}</span>
                ${this._agents.length ? p`${this._agents.map(
      (l) => p`<label class="agent"
                          ><input
                            type="checkbox"
                            .checked="${this._backupAgentIds.includes(l.agent_id)}"
                            @change="${($) => this._toggleAgent(l.agent_id, $.target.checked)}"
                          />
                          ${l.name}</label
                        >`
    )}` : p`<span class="hint">${t("card.no_agents")}</span>`}
              </div>
              <div class="actions">
                <button @click="${() => this._closeBackupModal()}">${t("card.cancel")}</button>
                <button class="primary" @click="${() => void this._doBackup()}">${t("card.create")}</button>
              </div>
            </div>
          </div>` : ""}

      <backup-confirm-dialog
        .open="${this._confirm !== null}"
        title="${this._confirm ? this._confirm.kind === "restore" ? t("card.confirm_restore_title") : t("card.confirm_delete_title") : ""}"
        message="${this._confirm ? t("card.confirm_msg") : ""}"
        confirmLabel="${t("card.confirm")}"
        confirmColor="danger"
        @confirm="${() => void this._doConfirmedAction()}"
        @cancel="${() => this._confirm = null}"
      ></backup-confirm-dialog>
    `;
  }
  _arrow(s) {
    return this._sortKey !== s ? "" : this._sortDir === "asc" ? "▲" : "▼";
  }
};
f.styles = At`
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
    .modal label { display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.85rem; }
    .actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.5rem; }
    .modal .primary, .overlay > div.primary { color: #fff; }
    @media (max-width: 480px) {
      .metrics { flex-direction: column; }
      table th:nth-child(4), table td:nth-child(4) { display: none; }
    }
  `;
m([
  C({ attribute: !1 })
], f.prototype, "hass", 2);
m([
  b()
], f.prototype, "_config", 2);
m([
  b()
], f.prototype, "_state", 2);
m([
  b()
], f.prototype, "_sortKey", 2);
m([
  b()
], f.prototype, "_sortDir", 2);
m([
  b()
], f.prototype, "_page", 2);
m([
  b()
], f.prototype, "_confirm", 2);
m([
  b()
], f.prototype, "_backupModalOpen", 2);
m([
  b()
], f.prototype, "_backupPartial", 2);
m([
  b()
], f.prototype, "_backupPassword", 2);
m([
  b()
], f.prototype, "_agents", 2);
m([
  b()
], f.prototype, "_backupAgentIds", 2);
f = m([
  Ct("backup-card")
], f);
function ge(s) {
  const t = Date.now() - new Date(s).getTime(), e = Math.floor(t / 36e5);
  if (e < 1) return "just now";
  if (e < 24) return `${e}h ago`;
  const r = Math.floor(e / 24);
  return r < 30 ? `${r}d ago` : `${Math.floor(r / 30)}mo ago`;
}
function fe(s) {
  return s >= 1024 ** 3 ? `${(s / 1024 ** 3).toFixed(1)} GB` : `${Math.round(s / 1024 ** 2)} MB`;
}
function me(s) {
  const t = s.some((i) => I(i)), e = s.some((i) => !I(i)), r = [];
  return t && r.push("Local"), e && r.push("Remote"), r.length ? r : ["Local"];
}
window.customCards = window.customCards || [];
window.customCards.push({
  type: "backup-card",
  name: "Backup Card",
  description: "Monitor and manage Home Assistant backups from your dashboard.",
  editor_type: "custom"
});
export {
  f as B,
  O as a,
  p as b,
  At as i,
  M as l,
  C as n,
  b as r,
  Ct as t
};
