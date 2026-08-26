/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const q = globalThis, st = q.ShadowRoot && (q.ShadyCSS === void 0 || q.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, rt = Symbol(), at = /* @__PURE__ */ new WeakMap();
let At = class {
  constructor(t, e, r) {
    if (this._$cssResult$ = !0, r !== rt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (st && t === void 0) {
      const r = e !== void 0 && e.length === 1;
      r && (t = at.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && at.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Tt = (s) => new At(typeof s == "string" ? s : s + "", void 0, rt), wt = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((r, i, n) => r + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + s[n + 1], s[0]);
  return new At(e, s, rt);
}, Dt = (s, t) => {
  if (st) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const r = document.createElement("style"), i = q.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = e.cssText, s.appendChild(r);
  }
}, ot = st ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const r of t.cssRules) e += r.cssText;
  return Tt(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Bt, defineProperty: Ut, getOwnPropertyDescriptor: Rt, getOwnPropertyNames: Ht, getOwnPropertySymbols: zt, getPrototypeOf: Nt } = Object, A = globalThis, ct = A.trustedTypes, Lt = ct ? ct.emptyScript : "", Q = A.reactiveElementPolyfillSupport, z = (s, t) => s, F = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Lt : null;
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
} }, it = (s, t) => !Bt(s, t), lt = { attribute: !0, type: String, converter: F, reflect: !1, useDefault: !1, hasChanged: it };
var mt, $t;
(mt = Symbol.metadata) != null || (Symbol.metadata = Symbol("metadata")), ($t = A.litPropertyMetadata) != null || (A.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let T = class extends HTMLElement {
  static addInitializer(t) {
    var e;
    this._$Ei(), ((e = this.l) != null ? e : this.l = []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = lt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(t, r, e);
      i !== void 0 && Ut(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, r) {
    var a;
    const { get: i, set: n } = (a = Rt(this.prototype, t)) != null ? a : { get() {
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
    return (e = this.elementProperties.get(t)) != null ? e : lt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(z("elementProperties"))) return;
    const t = Nt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(z("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(z("properties"))) {
      const e = this.properties, r = [...Ht(e), ...zt(e)];
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
      for (const i of r) e.unshift(ot(i));
    } else t !== void 0 && e.push(ot(t));
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
    return Dt(t, this.constructor.elementStyles), t;
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
      const o = r.getPropertyOptions(i), l = typeof o.converter == "function" ? { fromAttribute: o.converter } : ((n = o.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? o.converter : F;
      this._$Em = i;
      const d = l.fromAttribute(e, o.type);
      this[i] = (c = d != null ? d : (a = this._$Ej) == null ? void 0 : a.get(i)) != null ? c : d, this._$Em = null;
    }
  }
  requestUpdate(t, e, r, i = !1, n) {
    var a, c;
    if (t !== void 0) {
      const o = this.constructor;
      if (i === !1 && (n = this[t]), r != null || (r = o.getPropertyOptions(t)), !(((a = r.hasChanged) != null ? a : it)(n, e) || r.useDefault && r.reflect && n === ((c = this._$Ej) == null ? void 0 : c.get(t)) && !this.hasAttribute(o._$Eu(t, r)))) return;
      this.C(t, e, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: r, reflect: i, wrapped: n }, a) {
    var c, o, l;
    r && !((c = this._$Ej) != null ? c : this._$Ej = /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, (o = a != null ? a : e) != null ? o : this[t]), n !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && ((l = this._$Eq) != null ? l : this._$Eq = /* @__PURE__ */ new Set()).add(t));
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
        const { wrapped: o } = c, l = this[a];
        o !== !0 || this._$AL.has(a) || l === void 0 || this.C(a, void 0, c, l);
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
var bt;
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[z("elementProperties")] = /* @__PURE__ */ new Map(), T[z("finalized")] = /* @__PURE__ */ new Map(), Q == null || Q({ ReactiveElement: T }), ((bt = A.reactiveElementVersions) != null ? bt : A.reactiveElementVersions = []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = globalThis, dt = (s) => s, Z = N.trustedTypes, ht = Z ? Z.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Et = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, St = "?" + k, jt = `<${St}>`, O = document, L = () => O.createComment(""), j = (s) => s === null || typeof s != "object" && typeof s != "function", nt = Array.isArray, It = (s) => nt(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", X = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ut = /-->/g, pt = />/g, E = RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), _t = /'/g, ft = /"/g, xt = /^(?:script|style|textarea|title)$/i, Wt = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), p = Wt(1), B = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), gt = /* @__PURE__ */ new WeakMap(), S = O.createTreeWalker(O, 129);
function Ct(s, t) {
  if (!nt(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ht !== void 0 ? ht.createHTML(t) : t;
}
const Gt = (s, t) => {
  const e = s.length - 1, r = [];
  let i, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = H;
  for (let c = 0; c < e; c++) {
    const o = s[c];
    let l, d, h = -1, g = 0;
    for (; g < o.length && (a.lastIndex = g, d = a.exec(o), d !== null); ) g = a.lastIndex, a === H ? d[1] === "!--" ? a = ut : d[1] !== void 0 ? a = pt : d[2] !== void 0 ? (xt.test(d[2]) && (i = RegExp("</" + d[2], "g")), a = E) : d[3] !== void 0 && (a = E) : a === E ? d[0] === ">" ? (a = i != null ? i : H, h = -1) : d[1] === void 0 ? h = -2 : (h = a.lastIndex - d[2].length, l = d[1], a = d[3] === void 0 ? E : d[3] === '"' ? ft : _t) : a === ft || a === _t ? a = E : a === ut || a === pt ? a = H : (a = E, i = void 0);
    const m = a === E && s[c + 1].startsWith("/>") ? " " : "";
    n += a === H ? o + jt : h >= 0 ? (r.push(l), o.slice(0, h) + Et + o.slice(h) + k + m) : o + k + (h === -2 ? c : m);
  }
  return [Ct(s, n + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class I {
  constructor({ strings: t, _$litType$: e }, r) {
    let i;
    this.parts = [];
    let n = 0, a = 0;
    const c = t.length - 1, o = this.parts, [l, d] = Gt(t, e);
    if (this.el = I.createElement(l, r), S.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = S.nextNode()) !== null && o.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(Et)) {
          const g = d[a++], m = i.getAttribute(h).split(k), y = /([.?@])?(.*)/.exec(g);
          o.push({ type: 1, index: n, name: y[2], strings: m, ctor: y[1] === "." ? qt : y[1] === "?" ? Vt : y[1] === "@" ? Ft : J }), i.removeAttribute(h);
        } else h.startsWith(k) && (o.push({ type: 6, index: n }), i.removeAttribute(h));
        if (xt.test(i.tagName)) {
          const h = i.textContent.split(k), g = h.length - 1;
          if (g > 0) {
            i.textContent = Z ? Z.emptyScript : "";
            for (let m = 0; m < g; m++) i.append(h[m], L()), S.nextNode(), o.push({ type: 2, index: ++n });
            i.append(h[g], L());
          }
        }
      } else if (i.nodeType === 8) if (i.data === St) o.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(k, h + 1)) !== -1; ) o.push({ type: 7, index: n }), h += k.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const r = O.createElement("template");
    return r.innerHTML = t, r;
  }
}
function U(s, t, e = s, r) {
  var a, c, o;
  if (t === B) return t;
  let i = r !== void 0 ? (a = e._$Co) == null ? void 0 : a[r] : e._$Cl;
  const n = j(t) ? void 0 : t._$litDirective$;
  return (i == null ? void 0 : i.constructor) !== n && ((c = i == null ? void 0 : i._$AO) == null || c.call(i, !1), n === void 0 ? i = void 0 : (i = new n(s), i._$AT(s, e, r)), r !== void 0 ? ((o = e._$Co) != null ? o : e._$Co = [])[r] = i : e._$Cl = i), i !== void 0 && (t = U(s, i._$AS(s, t.values), i, r)), t;
}
class Kt {
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
    var l;
    const { el: { content: e }, parts: r } = this._$AD, i = ((l = t == null ? void 0 : t.creationScope) != null ? l : O).importNode(e, !0);
    S.currentNode = i;
    let n = S.nextNode(), a = 0, c = 0, o = r[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let d;
        o.type === 2 ? d = new W(n, n.nextSibling, this, t) : o.type === 1 ? d = new o.ctor(n, o.name, o.strings, this, t) : o.type === 6 && (d = new Zt(n, this, t)), this._$AV.push(d), o = r[++c];
      }
      a !== (o == null ? void 0 : o.index) && (n = S.nextNode(), a++);
    }
    return S.currentNode = O, i;
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
    t = U(this, t, e), j(t) ? t === _ || t == null || t === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : t !== this._$AH && t !== B && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : It(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== _ && j(this._$AH) ? this._$AA.nextSibling.data = t : this.T(O.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: r } = t, i = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = I.createElement(Ct(r.h, r.h[0]), this.options)), r);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === i) this._$AH.p(e);
    else {
      const a = new Kt(i, this), c = a.u(this.options);
      a.p(e), this.T(c), this._$AH = a;
    }
  }
  _$AC(t) {
    let e = gt.get(t.strings);
    return e === void 0 && gt.set(t.strings, e = new I(t)), e;
  }
  k(t) {
    nt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let r, i = 0;
    for (const n of t) i === e.length ? e.push(r = new W(this.O(L()), this.O(L()), this, this.options)) : r = e[i], r._$AI(n), i++;
    i < e.length && (this._$AR(r && r._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, e); t !== this._$AB; ) {
      const i = dt(t).nextSibling;
      dt(t).remove(), t = i;
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
    if (n === void 0) t = U(this, t, e, 0), a = !j(t) || t !== this._$AH && t !== B, a && (this._$AH = t);
    else {
      const c = t;
      let o, l;
      for (t = n[0], o = 0; o < n.length - 1; o++) l = U(this, c[r + o], e, o), l === B && (l = this._$AH[o]), a || (a = !j(l) || l !== this._$AH[o]), l === _ ? t = _ : t !== _ && (t += (l != null ? l : "") + n[o + 1]), this._$AH[o] = l;
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
class Vt extends J {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== _);
  }
}
class Ft extends J {
  constructor(t, e, r, i, n) {
    super(t, e, r, i, n), this.type = 5;
  }
  _$AI(t, e = this) {
    var a;
    if ((t = (a = U(this, t, e, 0)) != null ? a : _) === B) return;
    const r = this._$AH, i = t === _ && r !== _ || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, n = t !== _ && (r === _ || i);
    i && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e, r;
    typeof this._$AH == "function" ? this._$AH.call((r = (e = this.options) == null ? void 0 : e.host) != null ? r : this.element, t) : this._$AH.handleEvent(t);
  }
}
class Zt {
  constructor(t, e, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    U(this, t);
  }
}
const Y = N.litHtmlPolyfillSupport;
var yt;
Y == null || Y(I, W), ((yt = N.litHtmlVersions) != null ? yt : N.litHtmlVersions = []).push("3.3.3");
const Jt = (s, t, e) => {
  var n, a;
  const r = (n = e == null ? void 0 : e.renderBefore) != null ? n : t;
  let i = r._$litPart$;
  if (i === void 0) {
    const c = (a = e == null ? void 0 : e.renderBefore) != null ? a : null;
    r._$litPart$ = i = new W(t.insertBefore(L(), c), c, void 0, e != null ? e : {});
  }
  return i._$AI(s), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x = globalThis;
class D extends T {
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Jt(e, this.renderRoot, this.renderOptions);
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
    return B;
  }
}
var vt;
D._$litElement$ = !0, D.finalized = !0, (vt = x.litElementHydrateSupport) == null || vt.call(x, { LitElement: D });
const tt = x.litElementPolyfillSupport;
tt == null || tt({ LitElement: D });
var kt;
((kt = x.litElementVersions) != null ? kt : x.litElementVersions = []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Pt = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = { attribute: !0, type: String, converter: F, reflect: !1, hasChanged: it }, Xt = (s = Qt, t, e) => {
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
function M(s) {
  return (t, e) => typeof e == "object" ? Xt(s, t, e) : ((r, i, n) => {
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
  return M({ ...s, state: !0, attribute: !1 });
}
const Ot = ["backup.local", "hassio.local"];
function C(s) {
  return Ot.includes(s);
}
const Yt = {
  title: "Backups",
  loading: "Loading backups…",
  error: "Error",
  healthy: "Healthy",
  warning: "Warning",
  critical: "Critical",
  last_backup: "Last backup",
  count: "Backups",
  local_size: "Total Local Size",
  remote_size: "Total Remote Size",
  schedule: "Schedule",
  retention: "Retention",
  next: "Next",
  na: "n/a",
  change: "Change",
  name: "Name",
  type: "Type",
  created: "Created",
  file_size: "File Size (Mb)",
  location: "Location",
  actions: "Actions",
  automatic: "Automatic",
  manual: "Manual",
  restore: "Restore",
  delete: "Delete",
  readonly: "Read-only",
  backup_now: "Backup Now",
  open_location: "Open Backup Manager",
  backup_started: "Backup started",
  prev: "Prev",
  pager_next: "Next",
  retry: "Retry",
  creating: "Creating Backup…",
  restoring: "Restoring…",
  deleting: "Backup Deleted",
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
}, te = {
  card: Yt
}, ee = te;
function P(s) {
  const t = s.split(".").reduce((e, r) => {
    if (e && typeof e == "object" && r in e)
      return e[r];
  }, ee);
  return typeof t == "string" ? t : s;
}
const V = {
  greenHours: 48,
  amberDays: 7,
  freeGb: 1
}, se = 1024 ** 3;
function re(s) {
  if (!s) return null;
  const t = Date.now() - new Date(s).getTime();
  return Number.isNaN(t) ? null : t / 36e5;
}
function G(s, t = V) {
  if (s.last_job_failed || s.free_space && Math.min(...Object.values(s.free_space)) < t.freeGb * se)
    return "red";
  const e = re(s.last_backup);
  return e === null || e > t.amberDays * 24 ? "red" : e <= t.greenHours && (!s.has_remote_agent || s.remote_ok) ? "green" : "amber";
}
function ie(s) {
  return P(s === "green" ? "card.healthy" : s === "amber" ? "card.warning" : "card.critical");
}
async function ne(s, t) {
  await s.callWS({
    type: "backup/generate",
    agent_ids: t.agentIds && t.agentIds.length ? t.agentIds : Ot.slice(),
    name: t.name,
    password: t.password,
    include_homeassistant: !0,
    include_database: !0,
    include_all_addons: !t.partial
  });
}
async function ae(s, t) {
  await s.callWS({ type: "backup/delete", backup_id: t });
}
async function oe(s, t, e) {
  await s.callWS({
    type: "backup/restore",
    backup_id: t,
    agent_id: e != null ? e : "backup.local"
  });
}
async function ce(s) {
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
async function le(s) {
  const t = await s.callWS({ type: "backup/info" });
  return {
    info: he(t),
    backups: Array.isArray(t == null ? void 0 : t.backups) ? t.backups.map(ue) : []
  };
}
async function de(s) {
  const t = await s.callWS({ type: "backup/config/info" });
  return pe(t);
}
function he(s) {
  var h, g, m, y;
  const t = Array.isArray(s == null ? void 0 : s.backups) ? s.backups : [], e = (h = s == null ? void 0 : s.last_completed_automatic_backup) != null ? h : null, r = (g = s == null ? void 0 : s.last_attempted_automatic_backup) != null ? g : null, i = e != null ? e : t.length ? t.map((u) => u.date).sort().slice(-1)[0] : null, n = !!r && (!e || new Date(r).getTime() > new Date(e).getTime()), a = (m = s == null ? void 0 : s.state) != null ? m : "idle", c = ["creating_backup", "receiving_backup", "restoring_backup"].includes(
    a
  ), l = [...new Set(t.flatMap((u) => {
    var v;
    return Object.keys((v = u.agents) != null ? v : {});
  }))].some((u) => !C(u)), d = t.some(
    (u) => {
      var v;
      return Object.keys((v = u.agents) != null ? v : {}).some((Mt) => !C(Mt));
    }
  );
  return {
    last_backup: i,
    last_job_failed: n,
    backing_up: c,
    schedule: { state: a, next_run: (y = s == null ? void 0 : s.next_automatic_backup) != null ? y : null },
    has_remote_agent: l,
    remote_ok: d
  };
}
function ue(s) {
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
function pe(s) {
  var r, i, n, a;
  const t = (r = s == null ? void 0 : s.config) != null ? r : {}, e = (i = t == null ? void 0 : t.retention) != null ? i : null;
  return {
    retention: e ? { copies: (n = e.copies) != null ? n : null, days: (a = e.days) != null ? a : null } : null
  };
}
var _e = Object.defineProperty, fe = Object.getOwnPropertyDescriptor, R = (s, t, e, r) => {
  for (var i = r > 1 ? void 0 : r ? fe(t, e) : t, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (i = (r ? a(t, e, i) : a(i)) || i);
  return r && i && _e(t, e, i), i;
};
let w = class extends D {
  constructor() {
    super(...arguments), this.open = !1, this.title = "", this.message = "", this.confirmLabel = P("card.confirm"), this.confirmColor = "danger";
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
            <button class="cancel" @click="${this._cancel}">${P("card.cancel")}</button>
            <button class="confirm ${this.confirmColor}" @click="${this._confirm}">
              ${this.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    ` : p``;
  }
};
w.styles = wt`
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
R([
  M({ type: Boolean })
], w.prototype, "open", 2);
R([
  M()
], w.prototype, "title", 2);
R([
  M()
], w.prototype, "message", 2);
R([
  M()
], w.prototype, "confirmLabel", 2);
R([
  M()
], w.prototype, "confirmColor", 2);
w = R([
  Pt("backup-confirm-dialog")
], w);
var ge = Object.defineProperty, me = Object.getOwnPropertyDescriptor, $ = (s, t, e, r) => {
  for (var i = r > 1 ? void 0 : r ? me(t, e) : t, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (i = (r ? a(t, e, i) : a(i)) || i);
  return r && i && ge(t, e, i), i;
};
const K = 10;
let f = class extends D {
  constructor() {
    super(...arguments), this._state = { status: "idle" }, this._sortKey = "date", this._sortDir = "desc", this._page = 0, this._confirm = null, this._backupModalOpen = !1, this._backupPartial = !1, this._backupPassword = "", this._agents = [], this._backupAgentIds = [], this._banner = null;
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
    return await import("./editor-D9tXHJ6f.js"), document.createElement("backup-card-editor");
  }
  static getStubConfig() {
    return {};
  }
  async _fetch() {
    const { info: s, backups: t } = await le(this.hass);
    return { info: s, backups: t };
  }
  async _load() {
    if (this.hass) {
      this._state = { ...this._state, status: "loading" };
      try {
        const { info: s, backups: t } = await this._fetch();
        let e;
        if (this._isAdmin)
          try {
            e = await de(this.hass);
          } catch {
            e = void 0;
          }
        this._state = {
          status: "ready",
          info: s,
          backups: t,
          config: e,
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
    window.dispatchEvent(
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
        const s = await ce(this.hass);
        if (this._agents = s, this._backupAgentIds.length === 0) {
          const t = s.filter((e) => C(e.agent_id)).map((e) => e.agent_id);
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
    this._closeBackupModal(), this._showBanner(P("card.backup_started")), this._state = { ...this._state, status: "creating" };
    try {
      await ne(this.hass, { partial: s, password: t, agentIds: e });
      const { info: r, backups: i } = await this._fetch();
      this._state = { status: "ready", info: r, backups: i, rag: G(r, this._thresholds) };
    } catch (r) {
      this._setError(r);
    }
  }
  _showBanner(s) {
    this._banner = s, window.setTimeout(() => {
      this._banner === s && (this._banner = null);
    }, 3e3);
  }
  async _doConfirmedAction() {
    var e;
    if (!this.hass || !this._confirm) return;
    const { kind: s, slug: t } = this._confirm;
    this._state = {
      ...this._state,
      status: s === "restore" ? "restoring" : "deleting"
    }, this._confirm, this._confirm = null;
    try {
      if (s === "delete")
        await ae(this.hass, t);
      else {
        const n = ((e = this._state.backups) != null ? e : []).find((a) => a.slug === t);
        await oe(this.hass, t, n == null ? void 0 : n.agent_ids[0]);
      }
      const { info: r, backups: i } = await this._fetch();
      this._state = { status: "ready", info: r, backups: i, rag: G(r, this._thresholds) };
    } catch (r) {
      this._setError(r);
    }
  }
  render() {
    var c, o, l, d, h, g, m, y;
    if (!this._config) return p``;
    const s = this._state, t = P;
    if (s.status === "loading") return p`<p>${t("card.loading")}</p>`;
    if (s.status === "error")
      return p`<ha-card>
        <p class="error">${t("card.error")}: ${s.error}</p>
        <button @click="${() => void this._load()}">${t("card.retry")}</button>
      </ha-card>`;
    if (s.status === "idle" || !s.info) return p``;
    const e = s.status === "creating" || s.status === "restoring" || s.status === "deleting", r = this._sorted((c = s.backups) != null ? c : []), i = Math.max(1, Math.ceil(r.length / K)), n = Math.min(this._page, i - 1), a = r.slice(n * K, n * K + K);
    return p`
      <ha-card>
        ${this._banner ? p`<div class="banner">${this._banner}</div>` : ""}
        <div class="header">
          <h2>${(o = this._config.name) != null ? o : t("card.title")}</h2>
          <span class="rag rag-${s.rag}" role="status" aria-live="polite"
            >${ie(s.rag)}</span
          >
          <div class="spacer"></div>
          ${this._isAdmin ? p`              <button @click="${() => this._openBackupModal()}">${t("card.backup_now")}</button>
                <button @click="${() => this._navigate("/config/backup")}">${t("card.open_location")}</button>` : p`<span class="readonly">${t("card.readonly")}</span>`}
        </div>

        <div class="metrics">
          <div><span class="k">${t("card.last_backup")}</span><span>${s.info.last_backup ? new Date(s.info.last_backup).toLocaleString() : t("card.na")}</span></div>
          <div>
            <span class="k">${t("card.count")}</span
            ><span>${(d = (l = s.backups) == null ? void 0 : l.length) != null ? d : 0}</span>
          </div>
          <div>
            <span class="k">${t("card.local_size")}</span>
            <span>${et(this._totalLocal((h = s.backups) != null ? h : []))}</span>
          </div>
          <div>
            <span class="k">${t("card.remote_size")}</span>
            <span>${et(this._totalRemote((g = s.backups) != null ? g : []))}</span>
          </div>
          <div>
            <span class="k">${t("card.schedule")}</span>
            <span
              >${(m = s.info.schedule) != null && m.next_run ? `${t("card.next")}: ${new Date(s.info.schedule.next_run).toLocaleString()}` : t("card.na")}</span
            >
            ${this._isAdmin ? p`<button class="link" @click="${() => this._navigate("/config/backup")}"
                  >${t("card.change")}</button
                >` : ""}
          </div>
          ${(y = s.config) != null && y.retention ? p`<div>
                <span class="k">${t("card.retention")}</span>
                <span>${be(s.config.retention)}</span>
              </div>` : ""}
        </div>

        <table>
          <thead>
            <tr>
              <th @click="${() => this._toggleSort("name")}">${t("card.name")} ${this._arrow("name")}</th>
              <th @click="${() => this._toggleSort("date")}">${t("card.created")} ${this._arrow("date")}</th>
              <th @click="${() => this._toggleSort("size")}">${t("card.file_size")} ${this._arrow("size")}</th>
              <th>${t("card.location")}</th>
              <th>${t("card.type")}</th>
              ${this._isAdmin ? p`<th>${t("card.actions")}</th>` : ""}
            </tr>
          </thead>
          <tbody>
            ${a.map(
      (u) => p`
                <tr>
                  <td>${u.name}</td>
                  <td title="${u.date}">${$e(u.date)}</td>
                  <td>${et(u.size)}</td>
                  <td>${ye(u.agent_ids).map((v) => p`<span class="badge">${v}</span>`)}</td>
                  <td>${u.automatic ? t("card.automatic") : t("card.manual")}</td>
                  ${this._isAdmin ? p`<td>
                        <button class="link danger" @click="${() => this._confirm = { kind: "restore", slug: u.slug, name: u.name }}">${t("card.restore")}</button>
                        <button class="link danger" @click="${() => this._confirm = { kind: "delete", slug: u.slug, name: u.name }}">${t("card.delete")}</button>
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

        ${e ? p`<div class="overlay">${s.status === "restoring" ? t("card.restoring") : s.status === "deleting" ? t("card.deleting") : t("card.creating")}</div>` : ""}
      </ha-card>

      ${this._backupModalOpen ? p`<div class="overlay" @click="${(u) => {
      u.target === u.currentTarget && (this._backupModalOpen = !1);
    }}">
            <div class="modal" role="dialog" aria-modal="true">
              <h3>${t("card.modal_title")}</h3>
              <label class="row"
                ><input
                  type="checkbox"
                  .checked="${this._backupPartial}"
                  @change="${(u) => this._backupPartial = u.target.checked}"
                />
                <span>${t("card.partial")}</span></label
              >
              <label class="field"
                ><span class="k">${t("card.password")}</span
                ><input
                  type="password"
                  .value="${this._backupPassword}"
                  @input="${(u) => this._backupPassword = u.target.value}"
                /></label
              >
              <div class="agents">
                <span class="k">${t("card.target")}</span>
                ${this._agents.length ? p`${this._agents.map(
      (u) => p`<label class="row agent"
                          ><input
                            type="checkbox"
                            .checked="${this._backupAgentIds.includes(u.agent_id)}"
                            @change="${(v) => this._toggleAgent(u.agent_id, v.target.checked)}"
                          />
                          <span>${u.name}</span></label
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
  _totalLocal(s) {
    return s.filter((t) => t.agent_ids.some((e) => C(e))).reduce((t, e) => t + e.size, 0);
  }
  _totalRemote(s) {
    return s.filter((t) => t.agent_ids.some((e) => !C(e))).reduce((t, e) => t + e.size, 0);
  }
};
f.styles = wt`
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
$([
  M({ attribute: !1 })
], f.prototype, "hass", 2);
$([
  b()
], f.prototype, "_config", 2);
$([
  b()
], f.prototype, "_state", 2);
$([
  b()
], f.prototype, "_sortKey", 2);
$([
  b()
], f.prototype, "_sortDir", 2);
$([
  b()
], f.prototype, "_page", 2);
$([
  b()
], f.prototype, "_confirm", 2);
$([
  b()
], f.prototype, "_backupModalOpen", 2);
$([
  b()
], f.prototype, "_backupPartial", 2);
$([
  b()
], f.prototype, "_backupPassword", 2);
$([
  b()
], f.prototype, "_agents", 2);
$([
  b()
], f.prototype, "_backupAgentIds", 2);
$([
  b()
], f.prototype, "_banner", 2);
f = $([
  Pt("backup-card")
], f);
function $e(s) {
  const t = Date.now() - new Date(s).getTime(), e = Math.floor(t / 36e5);
  if (e < 1) return "just now";
  if (e < 24) return `${e}h ago`;
  const r = Math.floor(e / 24);
  return r < 30 ? `${r}d ago` : `${Math.floor(r / 30)}mo ago`;
}
function et(s) {
  return `${Math.round(s / 1024 ** 2)} MB`;
}
function be(s) {
  return s.copies != null && s.days != null ? `Keep ${s.copies} copies / ${s.days} days` : s.copies != null ? `Keep ${s.copies} copies` : s.days != null ? `Keep ${s.days} days` : "Unlimited";
}
function ye(s) {
  const t = s.some((i) => C(i)), e = s.some((i) => !C(i)), r = [];
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
  D as a,
  p as b,
  wt as i,
  P as l,
  M as n,
  b as r,
  Pt as t
};
