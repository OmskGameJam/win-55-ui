import { defineComponent as H, ref as B, computed as j, openBlock as h, createElementBlock as S, normalizeStyle as Y, normalizeClass as Re, renderSlot as X, useModel as Ce, useSlots as Zt, watch as me, nextTick as st, onMounted as ae, onUnmounted as ie, createBlock as F, Teleport as We, createElementVNode as T, createVNode as K, withCtx as O, unref as U, Fragment as _, createTextVNode as xe, toDisplayString as oe, createCommentVNode as q, mergeModels as en, withModifiers as He, shallowRef as zn, renderList as J, inject as An, provide as $n, watchEffect as ot, withDirectives as ct, reactive as lt, resolveDynamicComponent as tn, resolveComponent as Ln } from "vue";
const ee = /* @__PURE__ */ H({
  __name: "Box",
  props: {
    type: {},
    extraStyles: {},
    extraClass: {}
  },
  setup(e, { expose: t }) {
    const n = e, l = B(null), o = j(() => ({
      "--img": `url(/win-55-ui/${n.type}.png)`,
      ...n.extraStyles
    }));
    return t({ el: l }), (r, s) => (h(), S("div", {
      ref_key: "rootRef",
      ref: l,
      class: Re(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: Y(o.value)
    }, [
      X(r.$slots, "default")
    ], 6));
  }
}), Fn = { class: "balloon-tip-box" }, Mn = {
  key: 1,
  class: "balloon-wrapper"
}, On = { class: "balloon-tip-box" }, Ie = 8, Pn = /* @__PURE__ */ H({
  __name: "Balloon",
  props: /* @__PURE__ */ en({
    text: {},
    side: {},
    bias: {},
    anchor: {}
  }, {
    shown: { type: Boolean, default: !1 },
    shownModifiers: {}
  }),
  emits: ["update:shown"],
  setup(e) {
    const t = Ce(e, "shown");
    function n(g) {
      return "top" in g;
    }
    function l(g) {
      return n(g) ? g : { top: g.y, bottom: g.y, left: g.x, right: g.x };
    }
    const o = e, r = Zt(), s = j(() => o.side ?? "top"), a = j(() => o.bias), d = B(s.value), u = j(() => o.anchor ? d.value : s.value), f = j(() => {
      const g = {};
      switch (s.value) {
        case "top":
          g.bottom = "100%", g.left = "50%", g.transform = "translateX(-50%)";
          break;
        case "bottom":
          g.top = "100%", g.left = "50%", g.transform = "translateX(-50%)";
          break;
        case "left":
          g.right = "100%", g.top = "50%", g.transform = "translateY(-50%)";
          break;
        case "right":
          g.left = "100%", g.top = "50%", g.transform = "translateY(-50%)";
          break;
      }
      return g;
    }), c = j(() => {
      switch (u.value) {
        case "top":
          return "column";
        case "bottom":
          return "column-reverse";
        case "left":
          return "row";
        case "right":
          return "row-reverse";
      }
    }), m = j(() => {
      let g = "", I = !1;
      switch (u.value) {
        case "top":
          g = "rotate(0deg)", a.value === "right" && (I = !0);
          break;
        case "bottom":
          g = "rotate(180deg)", a.value === "left" && (I = !0);
          break;
        case "left":
          g = "rotate(-90deg)";
          break;
        case "right":
          g = "rotate(90deg)", I = !0;
          break;
      }
      return I ? `${g} scaleX(-1)` : g;
    }), b = j(() => {
      const g = {};
      return a.value ? ((u.value === "top" || u.value === "bottom") && (a.value === "left" && (g.transform = "translateX(calc(-50% + 28px))"), a.value === "right" && (g.transform = "translateX(calc(50% - 28px))")), (u.value === "left" || u.value === "right") && (a.value === "up" && (g.transform = "translateY(calc(-50% + 28px))"), a.value === "down" && (g.transform = "translateY(calc(50% - 28px))")), g) : {};
    }), x = B(null), w = B(null), C = { top: "bottom", bottom: "top", left: "right", right: "left" }, R = {
      top: ["left", "right"],
      bottom: ["left", "right"],
      left: ["top", "bottom"],
      right: ["top", "bottom"]
    };
    function N(g, I, D) {
      const z = (I.left + I.right) / 2, V = (I.top + I.bottom) / 2;
      return g === "top" || g === "bottom" ? {
        top: g === "top" ? I.top - D.height : I.bottom,
        left: z - D.width / 2
      } : {
        left: g === "left" ? I.left - D.width : I.right,
        top: V - D.height / 2
      };
    }
    function M(g, I, D, z) {
      return g.top >= Ie && g.left >= Ie && g.top + I.height <= z - Ie && g.left + I.width <= D - Ie;
    }
    function E() {
      const g = x.value;
      if (!o.anchor || !g) return;
      const I = l(o.anchor), D = g.getBoundingClientRect(), z = window.innerWidth, V = window.innerHeight, y = o.side ?? "top", P = [
        y,
        C[y],
        ...R[y]
      ].find((W) => M(N(W, I, D), D, z, V)) ?? y;
      d.value = P, w.value = N(P, I, D);
    }
    me(
      [() => o.anchor, t],
      async ([g, I]) => {
        !g || !I || (await st(), E());
      },
      { deep: !0, immediate: !0 }
    );
    const L = () => {
      o.anchor && t.value && E();
    };
    return ae(() => {
      window.addEventListener("resize", L), window.addEventListener("scroll", L, !0);
    }), ie(() => {
      window.removeEventListener("resize", L), window.removeEventListener("scroll", L, !0);
    }), (g, I) => e.anchor ? (h(), F(We, {
      key: 0,
      to: "body"
    }, [
      t.value ? (h(), S("div", {
        key: 0,
        ref_key: "anchoredRef",
        ref: x,
        class: "balloon-anchored",
        style: Y({
          top: (w.value?.top ?? 0) + "px",
          left: (w.value?.left ?? 0) + "px"
        })
      }, [
        T("div", {
          class: "balloon-inner",
          style: Y({ flexDirection: c.value })
        }, [
          T("div", {
            class: "balloon-box-wrapper",
            style: Y(b.value)
          }, [
            K(ee, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: O(() => [
                U(r).content ? X(g.$slots, "content", { key: 0 }) : (h(), S(_, { key: 1 }, [
                  xe(oe(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          T("div", Fn, [
            T("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: Y({ transform: m.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : q("", !0)
    ])) : (h(), S("div", Mn, [
      X(g.$slots, "default"),
      t.value ? (h(), S("div", {
        key: 0,
        class: "balloon",
        style: Y(f.value)
      }, [
        T("div", {
          class: "balloon-inner",
          style: Y({ flexDirection: c.value })
        }, [
          T("div", {
            class: "balloon-box-wrapper",
            style: Y(b.value)
          }, [
            K(ee, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: O(() => [
                U(r).content ? X(g.$slots, "content", { key: 0 }) : (h(), S(_, { key: 1 }, [
                  xe(oe(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          T("div", On, [
            T("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: Y({ transform: m.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : q("", !0)
    ]));
  }
}), Dn = /* @__PURE__ */ H({
  __name: "BaseDropdown",
  props: {
    matchTriggerWidth: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = B(!1), l = B(null), o = B(null), r = B(null), s = () => {
      const f = o.value, c = r.value;
      if (!f || !c) return;
      const m = f.getBoundingClientRect(), b = window.innerHeight, x = c.offsetHeight;
      let w = m.bottom + window.scrollY;
      const C = m.left + window.scrollX;
      m.bottom + x > b && (w = m.top + window.scrollY - x), l.value = {
        top: w,
        left: C,
        width: t.matchTriggerWidth ? m.width : void 0
      };
    };
    me(n, async (f) => {
      f && (await st(), s());
    });
    const a = () => {
      n.value && s();
    }, d = (f) => {
      if (!n.value) return;
      const c = f.target;
      o.value?.contains(c) || r.value?.contains(c) || (n.value = !1);
    };
    ae(() => {
      window.addEventListener("resize", a), window.addEventListener("scroll", a), document.addEventListener("click", d);
    }), ie(() => {
      window.removeEventListener("resize", a), window.removeEventListener("scroll", a), document.removeEventListener("click", d);
    });
    const u = () => {
      n.value = !n.value;
    };
    return (f, c) => (h(), S(_, null, [
      T("div", {
        ref_key: "triggerRef",
        ref: o,
        style: { display: "inline-block" },
        onClick: He(u, ["stop"])
      }, [
        X(f.$slots, "trigger")
      ], 512),
      (h(), F(We, { to: "body" }, [
        n.value ? (h(), S("div", {
          key: 0,
          ref_key: "dropdownRef",
          ref: r,
          style: Y({
            position: "absolute",
            top: (l.value?.top ?? 0) + "px",
            left: (l.value?.left ?? 0) + "px",
            width: e.matchTriggerWidth ? (l.value?.width ?? "auto") + "px" : "auto"
          })
        }, [
          X(f.$slots, "items")
        ], 4)) : q("", !0)
      ]))
    ], 64));
  }
}), nn = [
  { fontName: "Standard", style: "Regular", size: 8 },
  { fontName: "Standard", style: "Bold", size: 8 },
  { fontName: "Standard", style: "Italic", size: 8 },
  { fontName: "Standard", style: "BoldItalic", size: 8 },
  { fontName: "Standard", style: "Regular", size: 10 },
  { fontName: "Standard", style: "Bold", size: 10 },
  { fontName: "Standard", style: "Italic", size: 10 },
  { fontName: "Standard", style: "BoldItalic", size: 10 },
  { fontName: "Standard", style: "Regular", size: 12 },
  { fontName: "Standard", style: "Bold", size: 12 },
  { fontName: "Standard", style: "Italic", size: 12 },
  { fontName: "Standard", style: "BoldItalic", size: 12 },
  { fontName: "Standard", style: "Regular", size: 16 },
  { fontName: "Standard", style: "Bold", size: 16 },
  { fontName: "Standard", style: "Italic", size: 16 },
  { fontName: "Standard", style: "BoldItalic", size: 16 },
  { fontName: "Standard", style: "Regular", size: 18 },
  { fontName: "Standard", style: "Bold", size: 18 },
  { fontName: "Standard", style: "Italic", size: 18 },
  { fontName: "Standard", style: "BoldItalic", size: 18 },
  { fontName: "Standard", style: "Regular", size: 24 },
  { fontName: "Standard", style: "Bold", size: 24 },
  { fontName: "Standard", style: "Italic", size: 24 },
  { fontName: "Standard", style: "BoldItalic", size: 24 }
], _n = [8, 10, 12, 16, 18, 24], on = "Standard", Hn = {
  BoldItalic: ["BoldItalic", "Bold", "Italic", "Regular"],
  Bold: ["Bold", "Regular"],
  Italic: ["Italic", "Regular"],
  Regular: ["Regular"]
};
function Bt(e, t) {
  return nn.filter((n) => n.fontName === e && n.style === t).map((n) => n.size);
}
function Vn(e, t, n) {
  const l = nn.some((r) => r.fontName === e) ? e : on, o = Hn[t] ?? ["Regular"];
  for (const r of o)
    if (Bt(l, r).includes(n))
      return { fontName: l, style: r, size: n };
  for (const r of o) {
    const s = Bt(l, r);
    if (s.length > 0)
      return { fontName: l, style: r, size: rn(n, s) };
  }
  return { fontName: l, style: "Regular", size: n };
}
function ln(e) {
  const { style: t, size: n } = e.shorthand ? Wn(e.shorthand) : {
    style: Un(e.isBold, e.isItalic),
    size: rn(e.fontSize ?? 12, _n)
  }, { fontName: l, style: o, size: r } = Vn(e.fontName ?? on, t, n), s = {
    fontFamily: `${l}-${o}-${r}, ${l}-${o}-${r}-TofuMaker, Arial, sans`,
    fontSize: `${r * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (s.textShadow = `2px 2px 0 ${e.fontShadowColor}`), s;
}
function Un(e, t) {
  return e && t ? "BoldItalic" : e ? "Bold" : t ? "Italic" : "Regular";
}
function Wn(e) {
  const t = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!t)
    throw new Error(`Invalid shorthand format: ${e}`);
  const n = t[1], l = parseInt(t[2], 10);
  return { style: n, size: l };
}
function rn(e, t) {
  if (t.length === 0)
    throw new Error("Array cannot be empty");
  return t.reduce((n, l) => {
    const o = Math.abs(l - e), r = Math.abs(n - e);
    return o < r ? l : n;
  });
}
function ne(e) {
  if (e instanceof Text)
    return e.nodeValue ?? "";
  if (!(e instanceof Element || e instanceof DocumentFragment))
    return Array.from(e.childNodes).map(ne).join("");
  if (e instanceof Element) {
    const t = e.getAttribute("data-win55-emoji");
    if (t)
      return t;
    if (e.tagName === "BR")
      return `
`;
  }
  return Array.from(e.childNodes).map(ne).join("");
}
function ke(e) {
  const t = window.getSelection();
  if (!t || t.rangeCount === 0 || !t.isCollapsed)
    return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.startContainer))
    return null;
  const l = document.createRange();
  return l.selectNodeContents(e), l.setEnd(n.startContainer, n.startOffset), ne(l.cloneContents()).length;
}
function an(e, t) {
  if (e instanceof Text) {
    const o = e.nodeValue?.length ?? 0;
    return t <= o ? { node: e, offset: t, remaining: 0 } : { node: e, offset: o, remaining: t - o };
  }
  if (e instanceof Element) {
    const o = e.getAttribute("data-win55-emoji");
    if (o)
      return t <= 0 ? { node: e.parentNode ?? e, offset: Je(e), remaining: 0 } : t <= o.length ? { node: e.parentNode ?? e, offset: Je(e) + 1, remaining: 0 } : {
        node: e.parentNode ?? e,
        offset: Je(e) + 1,
        remaining: t - o.length
      };
  }
  let n = t, l = {
    offset: e.childNodes.length,
    remaining: n
  };
  for (const o of Array.from(e.childNodes)) {
    const r = an(o, n);
    if (r && r.remaining === 0)
      return r;
    r && (n = r.remaining, l = r);
  }
  return {
    node: e,
    offset: e.childNodes.length,
    remaining: l.remaining
  };
}
function Je(e) {
  return e.parentNode ? Array.prototype.indexOf.call(e.parentNode.childNodes, e) : 0;
}
function Le(e, t, n = !1) {
  if (t === null || !e.isConnected)
    return;
  const l = an(e, t);
  if (!l)
    return;
  const o = document.createRange(), r = window.getSelection();
  n && e.focus({ preventScroll: !0 }), o.setStart(l.node, l.offset), o.collapse(!0), r?.removeAllRanges(), r?.addRange(o);
}
const sn = "/win-55-ui/emoji", Qe = `${sn}/emoji-registry.csv`, Se = [
  "[\\u{1F1E6}-\\u{1F1FF}]{2}",
  "[0-9#*]\\uFE0F?\\u20E3",
  "\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?)*",
  "\\p{Emoji_Presentation}"
].join("|");
let Fe = null, rt = null, Me = null;
function Yn(e) {
  return e.replace(/\/$/, "");
}
function cn(e) {
  return e.trim().replace(/\.gif$/i, "");
}
function Xn(e) {
  const t = {}, n = e.replace(/^\uFEFF/, "").split(/\r?\n/);
  for (const [l, o] of n.entries()) {
    const r = o.trim();
    if (!r || l === 0 && r.toLowerCase() === "emoji,code")
      continue;
    const s = r.indexOf(",");
    if (s === -1) {
      console.warn(`[win-55-ui] Skipping emoji registry row ${l + 1}: missing comma`);
      continue;
    }
    const a = r.slice(0, s).trim(), d = cn(r.slice(s + 1));
    a && d && (t[a] = d);
  }
  return t;
}
async function he(e = {}) {
  const t = e.registryUrl ?? Qe;
  return Me && t === Qe ? Me : ((!Fe || rt !== t) && (rt = t, Fe = fetch(t).then((n) => {
    if (!n.ok)
      throw new Error(
        `Could not load emoji registry from ${t}: ${n.status} ${n.statusText}`
      );
    return n.text();
  }).then(Xn).then((n) => (t === Qe && (Me = n), n))), Fe);
}
function Ol() {
  Fe = null, rt = null, Me = null;
}
async function Gn(e, t = {}) {
  const l = (await he(t))[e];
  return l ? re(l, t) : null;
}
function re(e, t = {}) {
  return `${Yn(t.basePath ?? sn)}/${cn(e)}.gif`;
}
async function Pl(e = {}) {
  return he(e);
}
async function Dl(e, t = {}) {
  const n = await he(t);
  return e in n;
}
he();
function Kn(e) {
  return e.map((t) => {
    const n = parseInt(t.replace(/^#/, ""), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  });
}
function qn(e, t, n, l) {
  let o = 1 / 0, r = [0, 0, 0];
  for (const s of l) {
    const a = e - s[0], d = t - s[1], u = n - s[2], f = a * a + d * d + u * u;
    f < o && (o = f, r = s);
  }
  return r;
}
function un() {
  return typeof navigator < "u" && /firefox/i.test(navigator.userAgent);
}
const Jn = "win55-emoji", Qn = "win55-emoji-image", Z = 15, at = 2, jt = un(), Zn = [
  "#000000",
  "#020202",
  "#2E2E2E",
  "#700000",
  "#007000",
  "#000070",
  "#700070",
  "#007070",
  "#BB0202",
  "#F72E2E",
  "#BB7E02",
  "#02BB02",
  "#2EF72E",
  "#F7F22E",
  "#0202BB",
  "#2E2EF7",
  "#BB02BB",
  "#F72EF7",
  "#02BBBB",
  "#2EF7F7",
  "#8F8F8F",
  "#C4C4C4",
  "#D7D7D7",
  "#FFC4C4",
  "#C4FFC4",
  "#FFFFC4",
  "#C4C4FF",
  "#FFC4FF",
  "#C4FFFF",
  "#FAFAFA",
  "#FFFFFF",
  "#000000"
], eo = Kn(Zn), It = Se, to = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION"
]), pe = /* @__PURE__ */ new WeakMap(), Nt = /* @__PURE__ */ new WeakMap(), zt = /* @__PURE__ */ new Map();
function no(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function oo(e) {
  const t = Nt.get(e);
  if (t)
    return t;
  const n = Object.keys(e).sort((r, s) => s.length - r.length).map(no), l = n.length > 0 ? `${n.join("|")}|${It}` : It, o = new RegExp(l, "gu");
  return Nt.set(e, o), o;
}
function dn(e) {
  return e.value === !1 ? null : typeof e.value == "object" ? e.value : {};
}
const lo = "data-win55-richtext";
function ro(e) {
  return to.has(e.tagName) || e.hasAttribute("data-win55-emoji");
}
function fn(e) {
  let t = e.parentElement;
  for (; t; ) {
    const n = pe.get(t);
    if (n && dn(n.binding))
      return !0;
    t = t.parentElement;
  }
  return !1;
}
function ao(e, t) {
  const n = [], l = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, {
    acceptNode(o) {
      const r = o.parentElement;
      return !r || ro(r) || t && r.closest(`[${lo}]`) || !o.nodeValue?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  for (; l.nextNode(); )
    n.push(l.currentNode);
  return n;
}
function io() {
  return `${Z * at}px`;
}
function so(e, t, n, l, o) {
  const r = Math.min(1, Math.max(0, o)), s = e.getImageData(0, 0, t, n), a = s.data;
  for (let d = 0; d < a.length; d += 4) {
    const u = a[d], f = a[d + 1], c = a[d + 2];
    if (a[d + 3] < 80)
      a[d] = 0, a[d + 1] = 0, a[d + 2] = 0, a[d + 3] = 0;
    else {
      const [b, x, w] = qn(
        u,
        f,
        c,
        l
      ), C = Math.round(u + (b - u) * r), R = Math.round(f + (x - f) * r), N = Math.round(c + (w - c) * r);
      a[d] = C, a[d + 1] = R, a[d + 2] = N, a[d + 3] = 255;
    }
  }
  e.putImageData(s, 0, 0);
}
function co(e, t, n) {
  const l = e.getImageData(0, 0, t, n), o = new Uint8ClampedArray(l.data), r = l.data, s = (a, d) => (d * t + a) * 4;
  for (let a = 0; a < n; a++)
    for (let d = 0; d < t; d++) {
      const u = s(d, a), c = [
        d > 0 ? s(d - 1, a) : -1,
        d < t - 1 ? s(d + 1, a) : -1,
        a > 0 ? s(d, a - 1) : -1,
        a < n - 1 ? s(d, a + 1) : -1
      ].filter((m) => m !== -1).filter((m) => o[m + 3] > 127);
      if (o[u + 3] > 127 && c.length <= 1)
        r[u] = r[u + 1] = r[u + 2] = r[u + 3] = 0;
      else if (o[u + 3] === 0 && c.length >= 3) {
        const m = c[0];
        r[u] = o[m], r[u + 1] = o[m + 1], r[u + 2] = o[m + 2], r[u + 3] = 255;
      }
    }
  e.putImageData(l, 0, 0);
}
function ut(e) {
  const t = zt.get(e);
  if (t)
    return t;
  const n = uo(e);
  return zt.set(e, n), n;
}
function uo(e) {
  const t = document.createElement("canvas");
  t.width = Z, t.height = Z;
  const n = t.getContext("2d");
  if (!n)
    return "";
  const l = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif', o = Z * 4;
  n.textBaseline = "alphabetic", n.font = `${o}px ${l}`;
  const r = n.measureText(e), s = r.actualBoundingBoxLeft + r.actualBoundingBoxRight, a = r.actualBoundingBoxAscent + r.actualBoundingBoxDescent;
  if (s > 0 && a > 0) {
    const d = o * Math.min(Z / s, Z / a);
    n.font = `${d}px ${l}`;
    const u = n.measureText(e), f = u.actualBoundingBoxLeft + u.actualBoundingBoxRight, c = u.actualBoundingBoxAscent + u.actualBoundingBoxDescent, m = (Z - f) / 2 + u.actualBoundingBoxLeft, b = (Z - c) / 2 + u.actualBoundingBoxAscent;
    n.fillText(e, m, b - 0.5), so(n, Z, Z, eo, 0.1), co(n, Z, Z), yo(t);
  }
  return t.toDataURL("image/png");
}
function fo(e, t, n) {
  const l = document.createElement("span"), o = document.createElement("img");
  return l.className = n.className ?? Jn, l.contentEditable = "false", l.dataset.win55Emoji = e, l.role = "img", l.ariaLabel = e, l.style.setProperty("--win55-emoji-size", io()), o.src = t, o.alt = e, o.className = Qn, o.draggable = !1, o.dataset.win55EmojiImg = "true", o.addEventListener("load", () => {
    const r = o.naturalWidth * at, s = o.naturalHeight * at;
    l.style.width = `${r}px`, l.style.height = `${s}px`, o.style.width = `${r}px`, o.style.height = `${s}px`;
  }, { once: !0 }), l.append(o), l;
}
function mo(e, t, n, l) {
  const o = e.parentElement;
  if (!o)
    return;
  const r = window.getSelection(), s = r && r.rangeCount > 0 && r.isCollapsed ? r.getRangeAt(0) : null, a = s?.startContainer === e, d = !!(s && s.startContainer === o && s.startOffset === Array.prototype.indexOf.call(o.childNodes, e) + 1), u = a || d, f = d ? e.nodeValue?.length ?? 0 : a ? s?.startOffset ?? null : null, c = e.nodeValue ?? "";
  let m = 0, b = !1;
  const x = document.createDocumentFragment();
  let w = null, C = 0;
  const R = (M, E) => {
    w || (w = M, C = E);
  };
  t.lastIndex = 0;
  for (const M of c.matchAll(t)) {
    const E = M[0], L = M.index, g = n[E];
    if (L === void 0)
      continue;
    const I = g ? re(g, l) : ut(E);
    if (!I)
      continue;
    b = !0;
    const D = c.slice(m, L);
    if (jt || D.length > 0) {
      const V = document.createTextNode(D);
      f !== null && f >= m && f <= L && R(V, f - m), x.append(V);
    } else f !== null && f >= m && f <= L && R(o, Array.prototype.indexOf.call(o.childNodes, e) + x.childNodes.length);
    const z = fo(E, I, l);
    x.append(z), f !== null && f > L && f <= L + E.length && R(o, Array.prototype.indexOf.call(o.childNodes, e) + x.childNodes.length), m = L + E.length;
  }
  if (!b)
    return;
  const N = c.slice(m);
  if (jt || N.length > 0) {
    const M = document.createTextNode(N);
    f !== null && f >= m && R(M, f - m), x.append(M);
  } else f !== null && f >= m && R(o, Array.prototype.indexOf.call(o.childNodes, e) + x.childNodes.length);
  if (e.replaceWith(x), u && w) {
    const M = document.createRange();
    M.setStart(w, C), M.collapse(!0), r?.removeAllRanges(), r?.addRange(M);
  }
}
function mn(e, t, n, l) {
  const o = oo(t);
  if (o)
    for (const r of ao(e, l))
      mo(r, o, t, n);
}
const Ze = /* @__PURE__ */ new WeakMap();
async function et(e, t = {}) {
  const n = (Ze.get(e) ?? 0) + 1;
  Ze.set(e, n);
  const l = await he(t);
  Ze.get(e) !== n || !e.isConnected || mn(e, l, t, !1);
}
async function ho(e, t) {
  const n = dn(t.binding);
  if (!n)
    return;
  t.version += 1;
  const l = t.version, o = await he(n);
  pe.get(e)?.version !== l || !e.isConnected || fn(e) || mn(e, o, n, !0);
}
function it(e, t) {
  t.renderQueued || (t.renderQueued = !0, t.renderFrame = window.requestAnimationFrame(() => {
    t.renderQueued = !1, t.renderFrame = null, ho(e, t).catch((n) => {
      console.warn("[win-55-ui] Could not render custom emoji.", n);
    });
  }));
}
function go(e, t) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !t.clipboardData || fn(e))
    return;
  const l = n.getRangeAt(0);
  if (!l.intersectsNode(e))
    return;
  const o = l.cloneContents(), r = ne(o);
  r && (t.clipboardData.setData("text/plain", r), t.preventDefault());
}
function vo(e, t) {
  const n = new MutationObserver(() => {
    it(e, t);
  });
  return n.observe(e, {
    characterData: !0,
    childList: !0,
    subtree: !0
  }), n;
}
const po = {
  mounted(e, t) {
    const n = {
      binding: t,
      copyHandler: (l) => go(e, l),
      observer: null,
      renderFrame: null,
      renderQueued: !1,
      version: 0
    };
    n.observer = vo(e, n), pe.set(e, n), e.addEventListener("copy", n.copyHandler), it(e, n);
  },
  updated(e, t) {
    const n = pe.get(e);
    n && (n.binding = t, it(e, n));
  },
  unmounted(e) {
    const t = pe.get(e);
    t && (t.observer?.disconnect(), t.renderFrame !== null && window.cancelAnimationFrame(t.renderFrame), e.removeEventListener("copy", t.copyHandler)), pe.delete(e);
  }
};
function yo(e) {
  const t = e.getContext("2d");
  if (!t) {
    console.warn("Unable to get 2D context from canvas");
    return;
  }
  const n = e.width, l = e.height, o = t.getImageData(0, 0, n, l), r = o.data, s = (c, m) => c < 0 || m < 0 || c >= n || m >= l ? 0 : r[(m * n + c) * 4 + 3], a = Array.from({ length: l }, () => Array(n).fill(!1)), d = [];
  for (let c = 0; c < n; c++)
    s(c, 0) === 0 && !a[0][c] && (a[0][c] = !0, d.push({ x: c, y: 0 })), s(c, l - 1) === 0 && !a[l - 1][c] && (a[l - 1][c] = !0, d.push({ x: c, y: l - 1 }));
  for (let c = 0; c < l; c++)
    s(0, c) === 0 && !a[c][0] && (a[c][0] = !0, d.push({ x: 0, y: c })), s(n - 1, c) === 0 && !a[c][n - 1] && (a[c][n - 1] = !0, d.push({ x: n - 1, y: c }));
  const u = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  for (; d.length; ) {
    const { x: c, y: m } = d.shift();
    for (const [b, x] of u) {
      const w = c + b, C = m + x;
      w >= 0 && w < n && C >= 0 && C < l && !a[C][w] && s(w, C) === 0 && (a[C][w] = !0, d.push({ x: w, y: C }));
    }
  }
  const f = Array.from({ length: l }, () => Array(n).fill(!1));
  for (let c = 0; c < l; c++)
    for (let m = 0; m < n; m++) {
      if (s(m, c) === 0) continue;
      let b = !1;
      for (const [x, w] of u) {
        const C = m + x, R = c + w;
        if (C < 0 || R < 0 || C >= n || R >= l) {
          b = !0;
          break;
        }
        if (s(C, R) === 0 && a[R][C]) {
          b = !0;
          break;
        }
      }
      b && (f[c][m] = !0);
    }
  for (let c = 0; c < l; c++)
    for (let m = 0; m < n; m++)
      if (f[c][m]) {
        const b = (c * n + m) * 4;
        r[b] = 0, r[b + 1] = 0, r[b + 2] = 0;
      }
  t.putImageData(o, 0, 0);
}
const _l = po, At = typeof Intl.Segmenter == "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function hn(e) {
  return At ? Array.from(At.segment(e), (t) => t.segment) : Array.from(e);
}
function $t(e) {
  return hn(e).length;
}
function wo(e, t) {
  return hn(e).slice(0, t).join("");
}
function xo(e) {
  const t = window.getSelection();
  if (!t || t.rangeCount === 0 || !t.isCollapsed)
    return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.startContainer))
    return null;
  const l = ke(e), o = n.cloneRange();
  o.collapse(!0);
  const r = document.createElement("span");
  r.textContent = "​", o.insertNode(r);
  const s = r.getBoundingClientRect(), a = r.parentNode;
  return r.remove(), a?.normalize(), Le(e, l), s;
}
const Lt = "/win-55-ui/emoji/emoji-categories.json";
let tt = null;
async function dt() {
  return tt || (tt = fetch(Lt).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${Lt}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), tt;
}
async function bo(e) {
  const t = e.trim().toLowerCase();
  if (!t)
    return [];
  const n = await dt(), l = [], o = /* @__PURE__ */ new Set();
  for (const r of n) {
    const s = r.shortcodes.find((a) => a.toLowerCase().startsWith(t));
    s && (l.push({ emoji: r.emoji, code: r.code, shortcode: s }), o.add(r.code));
  }
  for (const r of n) {
    if (o.has(r.code))
      continue;
    const s = r.tags.find((a) => a.toLowerCase().startsWith(t));
    s && (l.push({ emoji: r.emoji, code: r.code, shortcode: r.shortcodes[0] ?? s }), o.add(r.code));
  }
  return l;
}
async function gn(e) {
  const t = e.trim().toLowerCase();
  if (!t)
    return;
  const l = (await dt()).find((o) => o.shortcodes.some((r) => r.toLowerCase() === t));
  return l ? { emoji: l.emoji, code: l.code } : void 0;
}
const we = B(!1), se = B({ x: 160, y: 120, width: 360, height: 420 }), ft = zn(null);
function Ft(e) {
  ft.value = e;
}
function Eo() {
  we.value = !0;
}
function Mt() {
  we.value = !1;
}
function Co(e) {
  ft.value?.insertEmoji(e);
}
let Ot = 0;
function ko(e) {
  const t = e[Ot % e.length];
  return Ot += 1, t;
}
const So = {
  key: 0,
  class: "baseinput-emoji-wrapper"
}, Ro = ["src"], To = { class: "shortcode-suggestions" }, Bo = {
  key: 0,
  class: "shortcode-suggestion-ellipsis"
}, jo = ["src"], Io = {
  key: 1,
  class: "shortcode-suggestion-ellipsis"
}, No = "546", Ne = 5, zo = 200, Hl = /* @__PURE__ */ H({
  __name: "BaseInput",
  props: {
    modelValue: {},
    placeholder: { default: "" },
    disabled: { type: Boolean, default: !1 },
    maxLength: { default: void 0 },
    boxType: { default: "textarea" },
    extraStyles: { default: void 0 },
    multiline: { type: Boolean, default: !1 },
    showEmojiButton: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { expose: t, emit: n }) {
    const l = [
      "338",
      // :smile:
      "814",
      // :notes:
      "199",
      // :barber:
      "51F",
      // :jack_o_lantern:
      "B60"
      // :sparkles:
    ], o = e, r = n, s = B(null), a = j(() => s.value?.el ?? null);
    ae(() => {
      a.value && o.modelValue && (a.value.innerText = o.modelValue);
    }), me(() => o.modelValue, (i) => {
      if (a.value && ne(a.value) !== i) {
        const v = document.activeElement === a.value, p = v ? ke(a.value) : null;
        a.value.innerText = i ?? "", v && Le(a.value, p);
      }
    });
    const d = () => {
      if (!a.value) return;
      let i = ne(a.value);
      if (o.multiline || (i = i.replace(/\n/g, "")), o.maxLength && $t(i) > o.maxLength) {
        i = wo(i, o.maxLength), a.value.innerText = i;
        const v = document.createRange(), p = window.getSelection();
        v.selectNodeContents(a.value), v.collapse(!1), p?.removeAllRanges(), p?.addRange(v);
      }
      bn(), r("update:modelValue", i), xn();
    }, u = /:([A-Za-z0-9_+-]*)$/, f = /:([A-Za-z0-9_+-]{2,}):$/, c = B(!1), m = B(null), b = B([]), x = B(0), w = B(null);
    let C = 0;
    const R = B(0);
    function N(i) {
      i < R.value ? R.value = i : i > R.value + Ne - 1 && (R.value = i - Ne + 1);
    }
    const M = j(() => {
      const i = R.value;
      return b.value.slice(i, i + Ne).map((v, p) => ({ match: v, index: i + p }));
    }), E = j(() => R.value > 0), L = j(() => R.value + Ne < b.value.length), g = () => {
      c.value = !1, m.value = null, b.value = [], x.value = 0, R.value = 0;
    }, I = (i, v) => {
      if (!a.value) return;
      const p = window.getSelection();
      if (!p || p.rangeCount === 0 || !p.isCollapsed) return;
      const k = p.getRangeAt(0), $ = k.startContainer;
      if (!($ instanceof Text) || !a.value.contains($)) return;
      const G = k.startOffset, Q = G - i;
      if (Q < 0) return;
      const le = $.nodeValue ?? "";
      je(), $.nodeValue = le.slice(0, Q) + v + le.slice(G), de($, Q + v.length), ve(), d(), et(a.value);
    }, D = () => {
      const i = b.value[x.value];
      !i || m.value === null || (I(1 + m.value.length, i.emoji), g());
    }, z = B(null), y = { insertEmoji: (i) => {
      if (!a.value) return;
      const k = (document.activeElement === a.value ? ke(a.value) : null) ?? z.value ?? $t(ne(a.value));
      Le(a.value, k, !0);
      const $ = window.getSelection();
      if (!$ || $.rangeCount === 0 || !$.isCollapsed) return;
      const G = $.getRangeAt(0);
      je(), G.deleteContents();
      const Q = document.createTextNode(i);
      G.insertNode(Q), de(Q, Q.length), ve(), d(), et(a.value);
    } }, A = B(!1), P = j(() => we.value && ft.value === y), W = j(() => o.showEmojiButton && (A.value || P.value)), ue = B(l[0]), te = j(() => P.value ? No : ue.value), Te = () => {
      ue.value = ko(l);
    };
    me(W, (i) => {
      i && Te();
    });
    const Be = () => {
      A.value = !0, Ft(y);
    }, wn = () => {
      Ft(y), Eo();
    }, xn = async () => {
      if (!a.value) {
        g();
        return;
      }
      const i = window.getSelection();
      if (!i || i.rangeCount === 0 || !i.isCollapsed) {
        g();
        return;
      }
      const v = i.getRangeAt(0), p = v.startContainer;
      if (!(p instanceof Text) || !a.value.contains(p)) {
        g();
        return;
      }
      const k = (p.nodeValue ?? "").slice(0, v.startOffset), $ = c.value ? m.value : null, G = f.exec(k);
      if (G) {
        if ($ === G[1]) {
          const Tt = await gn(G[1]);
          Tt && I(G[0].length, Tt.emoji);
        }
        g();
        return;
      }
      const le = u.exec(k)?.[1] ?? null;
      if (le === null || le.length < 2) {
        g();
        return;
      }
      const Ee = xo(a.value);
      if (!Ee) {
        g();
        return;
      }
      const St = ++C, Rt = await bo(le);
      if (St !== C || Rt.length === 0) {
        St === C && g();
        return;
      }
      m.value = le, b.value = Rt, x.value = 0, R.value = 0, w.value = { top: Ee.top, bottom: Ee.bottom, left: Ee.left, right: Ee.right }, c.value = !0;
    }, Ye = [], Xe = [];
    let be = null, ge = null;
    const Ge = () => a.value ? { html: a.value.innerHTML, caret: ke(a.value) } : null, gt = (i) => {
      a.value && (a.value.innerHTML = i.html, Le(a.value, i.caret, !0), d());
    }, je = () => {
      be || (be = Ge()), Xe.length = 0;
    }, ve = () => {
      ge !== null && (clearTimeout(ge), ge = null), be && (Ye.push(be), be = null);
    }, bn = () => {
      ge !== null && clearTimeout(ge), ge = setTimeout(ve, zo);
    }, En = () => {
      ve();
      const i = Ye.pop();
      if (!i) return;
      const v = Ge();
      v && Xe.push(v), gt(i);
    }, Cn = () => {
      const i = Xe.pop();
      if (!i) return;
      const v = Ge();
      v && Ye.push(v), gt(i);
    }, de = (i, v) => {
      const p = document.createRange(), k = window.getSelection();
      a.value?.focus({ preventScroll: !0 }), p.setStart(i, v), p.collapse(!0), k?.removeAllRanges(), k?.addRange(p);
    }, kn = (i) => i instanceof Text ? i.nodeValue?.length ?? 0 : i.childNodes.length, fe = (i) => i.parentNode ? Array.prototype.indexOf.call(i.parentNode.childNodes, i) : 0, Ke = (i, v) => i instanceof Text ? v > 0 ? null : i.previousSibling ?? (i.parentNode && i.parentNode !== a.value ? Ke(i.parentNode, fe(i.parentNode)) : null) : i.childNodes[v - 1] ?? (i.parentNode && i !== a.value ? Ke(i.parentNode, fe(i)) : null), qe = (i, v) => i instanceof Text ? v < (i.nodeValue?.length ?? 0) ? null : i.nextSibling ?? (i.parentNode && i.parentNode !== a.value ? qe(i.parentNode, fe(i.parentNode) + 1) : null) : i.childNodes[v] ?? (i.parentNode && i !== a.value ? qe(i.parentNode, fe(i) + 1) : null), Sn = (i, v) => {
      let p = i;
      for (; p; ) {
        if (p instanceof HTMLElement && p.hasAttribute("data-win55-emoji"))
          return p;
        if (p instanceof Text) {
          if ((p.nodeValue ?? "").length > 0)
            return null;
          p = v === "backward" ? p.previousSibling : p.nextSibling;
          continue;
        }
        if (p.childNodes.length > 0) {
          p = v === "backward" ? p.childNodes[p.childNodes.length - 1] : p.childNodes[0];
          continue;
        }
        return null;
      }
      return null;
    }, vt = (i) => {
      if (i.cloneContents().querySelector?.("[data-win55-emoji]"))
        return !0;
      const p = i.startContainer instanceof Element ? i.startContainer : i.startContainer.parentElement, k = i.endContainer instanceof Element ? i.endContainer : i.endContainer.parentElement;
      return !!(p?.closest("[data-win55-emoji]") || k?.closest("[data-win55-emoji]"));
    }, pt = (i) => {
      if (!a.value) return;
      const v = i.startContainer, p = i.startOffset;
      i.deleteContents(), v.isConnected && a.value.contains(v) ? de(v, Math.min(p, kn(v))) : de(a.value, a.value.childNodes.length), d();
    }, Rn = (i) => {
      const v = document.createRange();
      return v.setStart(i.startContainer, i.startOffset), v.setEnd(i.endContainer, i.endOffset), v;
    }, Tn = (i) => i instanceof HTMLElement && i.hasAttribute("data-win55-emoji"), Bn = (i, v, p) => {
      if (!a.value || i.collapsed || i.startContainer !== i.endContainer || !(i.startContainer instanceof Text))
        return !1;
      const k = i.startContainer, $ = k.nodeValue?.length ?? 0;
      if (i.startOffset !== 0 || i.endOffset !== $)
        return !1;
      const G = v === "backward" ? k.previousSibling : k.nextSibling;
      if (!Tn(G) || !k.parentNode)
        return !1;
      p();
      const Q = k.parentNode, le = fe(k);
      return k.remove(), de(Q, le), d(), !0;
    }, yt = (i, v, p) => {
      const k = p === "backward" ? Ke(i, v) : qe(i, v);
      return Sn(k, p);
    }, wt = (i, v, p, k) => {
      const $ = yt(i, v, p);
      if (!$ || !$.parentNode)
        return !1;
      k();
      const G = $.parentNode, Q = fe($);
      return $.remove(), de(G, Q), d(), !0;
    }, jn = (i, v, p) => {
      if (!a.value || !a.value.contains(i.startContainer))
        return "none";
      const k = Rn(i);
      return k.collapsed ? wt(
        i.startContainer,
        i.startOffset,
        v,
        p
      ) ? "deleted" : "none" : vt(k) ? (p(), pt(k), "deleted") : Bn(k, v, p) ? "deleted" : ne(k.cloneContents()) ? "native" : "none";
    }, In = (i, v) => {
      if (!a.value) return !1;
      const p = window.getSelection();
      if (!p || p.rangeCount === 0)
        return !1;
      const k = p.getRangeAt(0);
      return a.value.contains(k.startContainer) ? p.isCollapsed ? wt(
        k.startContainer,
        k.startOffset,
        i,
        v
      ) : vt(k) ? (v(), pt(k), !0) : !1 : !1;
    }, Nn = (i) => {
      if (!un() || i.shiftKey || i.ctrlKey || i.metaKey || i.altKey || i.key !== "ArrowLeft" && i.key !== "ArrowRight" || !a.value) return !1;
      const v = window.getSelection();
      if (!v || v.rangeCount === 0 || !v.isCollapsed) return !1;
      const p = v.getRangeAt(0);
      if (!a.value.contains(p.startContainer)) return !1;
      const k = i.key === "ArrowLeft" ? "backward" : "forward", $ = yt(p.startContainer, p.startOffset, k);
      return !$ || !$.parentNode ? !1 : (i.preventDefault(), de($.parentNode, fe($) + (k === "forward" ? 1 : 0)), !0);
    }, xt = (i) => {
      if (c.value) {
        if (i.key === "ArrowDown") {
          i.preventDefault(), x.value = (x.value + 1) % b.value.length, N(x.value);
          return;
        }
        if (i.key === "ArrowUp") {
          i.preventDefault(), x.value = (x.value - 1 + b.value.length) % b.value.length, N(x.value);
          return;
        }
        if (i.key === "Tab" || i.key === " " || i.key === "Enter") {
          i.preventDefault(), D();
          return;
        }
        if (i.key === "Escape") {
          i.preventDefault(), g();
          return;
        }
      }
      !o.multiline && i.key === "Enter" && i.preventDefault(), i.key === "Tab" && i.preventDefault(), Nn(i);
    }, bt = (i) => {
      if (!a.value) return;
      if (i.inputType === "historyUndo" || i.inputType === "historyRedo") {
        i.preventDefault(), i.inputType === "historyUndo" ? En() : Cn();
        return;
      }
      if (je(), i.inputType !== "deleteContentBackward" && i.inputType !== "deleteContentForward")
        return;
      if (ne(a.value) === "") {
        i.preventDefault(), a.value.focus({ preventScroll: !0 });
        return;
      }
      const v = i.inputType === "deleteContentBackward" ? "backward" : "forward", p = i.getTargetRanges();
      for (const k of p) {
        const $ = jn(
          k,
          v,
          () => i.preventDefault()
        );
        if ($ === "deleted") {
          a.value.focus({ preventScroll: !0 });
          return;
        }
        if ($ === "native")
          return;
      }
      In(v, () => i.preventDefault()) && a.value.focus({ preventScroll: !0 });
    }, Et = (i) => {
      i.preventDefault();
      let v = i.clipboardData?.getData("text/plain") ?? "";
      if (o.multiline || (v = v.replace(/\n/g, " ")), !a.value) return;
      je();
      const p = window.getSelection(), k = p?.getRangeAt(0);
      if (k) {
        k.deleteContents();
        const $ = document.createTextNode(v);
        k.insertNode($), k.collapse(!1), p?.removeAllRanges(), p?.addRange(k);
      }
      d(), ve(), et(a.value);
    }, Ct = () => {
      ve(), g(), A.value = !1, a.value && (z.value = ke(a.value)), a.value && ne(a.value) === "" && (a.value.innerHTML = "");
    }, kt = j(() => ({
      ...o.extraStyles,
      ...ln({ fontColor: "black" }),
      overflow: "auto",
      ...o.showEmojiButton ? { paddingRight: "34px" } : {}
    }));
    return t({ el: a }), (i, v) => (h(), S(_, null, [
      e.showEmojiButton ? (h(), S("div", So, [
        K(ee, {
          ref_key: "boxRef",
          ref: s,
          type: e.boxType,
          contenteditable: !e.disabled,
          "extra-styles": kt.value,
          "data-placeholder": e.placeholder,
          role: "textbox",
          "aria-multiline": e.multiline,
          "aria-disabled": e.disabled,
          onInput: d,
          onKeydown: xt,
          onBeforeinput: bt,
          onPaste: Et,
          onFocus: Be,
          onBlur: Ct
        }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"]),
        W.value ? (h(), S("img", {
          key: 0,
          src: U(re)(te.value),
          width: "30",
          height: "30",
          class: "baseinput-emoji-button",
          "data-emoji-picker-trigger": "",
          onMousedown: v[0] || (v[0] = He(() => {
          }, ["prevent"])),
          onClick: He(wn, ["stop"])
        }, null, 40, Ro)) : q("", !0)
      ])) : (h(), F(ee, {
        key: 1,
        ref_key: "boxRef",
        ref: s,
        type: e.boxType,
        contenteditable: !e.disabled,
        "extra-styles": kt.value,
        "data-placeholder": e.placeholder,
        role: "textbox",
        "aria-multiline": e.multiline,
        "aria-disabled": e.disabled,
        onInput: d,
        onKeydown: xt,
        onBeforeinput: bt,
        onPaste: Et,
        onFocus: Be,
        onBlur: Ct
      }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"])),
      c.value && w.value ? (h(), F(Pn, {
        key: 2,
        shown: !0,
        anchor: w.value,
        side: "top"
      }, {
        content: O(() => [
          T("div", To, [
            E.value ? (h(), S("div", Bo, "...")) : q("", !0),
            (h(!0), S(_, null, J(M.value, ({ match: p, index: k }) => (h(), S("div", {
              key: p.shortcode,
              class: Re(["shortcode-suggestion", { "shortcode-suggestion--selected": k === x.value }])
            }, [
              T("img", {
                src: U(re)(p.code),
                width: "30",
                height: "30",
                class: "shortcode-suggestion-image"
              }, null, 8, jo),
              T("span", null, ":" + oe(p.shortcode) + ":", 1)
            ], 2))), 128)),
            L.value ? (h(), S("div", Io, "...")) : q("", !0)
          ])
        ]),
        _: 1
      }, 8, ["anchor"])) : q("", !0)
    ], 64));
  }
}), Pt = "/win-55-ui/cursors/manifest.json", Dt = "/win-55-ui/cursors/scheme.json";
let Oe = null, Pe = null;
async function vn() {
  return Oe || (Oe = fetch(Pt).then((e) => {
    if (!e.ok)
      throw new Error(`Could not load cursor manifest from ${Pt}: ${e.status} ${e.statusText}`);
    return e.json();
  })), Oe;
}
async function Ao() {
  return Pe || (Pe = fetch(Dt).then((e) => {
    if (!e.ok)
      throw new Error(`Could not load cursor scheme index from ${Dt}: ${e.status} ${e.statusText}`);
    return e.json();
  })), Pe;
}
function Vl() {
  Oe = null, Pe = null;
}
const _t = 2, Ht = "windows-default";
function Vt(e, t, n, l) {
  const o = e[n]?.roles[l];
  if (!o) return;
  const r = t[o];
  if (!(!r || r.hotspotX === null || r.hotspotY === null))
    return o;
}
async function Ve(e, t) {
  const [n, l] = await Promise.all([Ao(), vn()]);
  return Vt(n, l, e, t) ?? (e === Ht ? void 0 : Vt(n, l, Ht, t));
}
const pn = /* @__PURE__ */ Symbol("win55ui:cursor-context"), ce = "--win55-cursor", De = "--win55-scheme";
function $o(e) {
  $n(pn, e);
}
function Lo() {
  return An(pn, void 0);
}
const mt = "__win55CursorContext";
function Fo(e, t) {
  e[mt] = t;
}
function Mo(e) {
  delete e[mt];
}
let Ue;
function Oo(e) {
  Ue = e;
}
function Po(e) {
  Ue === e && (Ue = void 0);
}
function Do(e) {
  let t = e;
  for (; t; ) {
    const n = t[mt];
    if (n) return n;
    t = t.parentElement;
  }
  return Ue;
}
async function _o(e, t, n) {
  if (!t) {
    e.style.removeProperty("cursor"), e.style.removeProperty(ce);
    return;
  }
  const l = n ? await n.resolveRole(t) : await Ve("windows-default", t);
  if (!l) {
    e.style.removeProperty("cursor"), e.style.removeProperty(ce);
    return;
  }
  e.style.cursor = "none", e.style.setProperty(ce, l);
}
const ze = /* @__PURE__ */ new WeakMap(), ht = {
  mounted(e, t) {
    const n = B(t.value);
    let l = () => {
    };
    ze.set(e, { role: n, stop: () => l() }), st(() => {
      const o = Do(e);
      l = ot(() => {
        _o(e, n.value, o);
      });
    });
  },
  updated(e, t) {
    if (t.value === t.oldValue) return;
    const n = ze.get(e);
    n && (n.role.value = t.value);
  },
  unmounted(e) {
    ze.get(e)?.stop(), ze.delete(e);
  }
}, _e = /* @__PURE__ */ H({
  __name: "Button",
  props: {
    baseType: { default: "panel-d-1" },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: t }) {
    const n = ht, l = e, o = t, r = B(!1), s = B(!1), a = j(() => !l.disabled && r.value && s.value), d = j(() => l.disabled), u = (C) => {
      l.disabled || C.button !== 0 || (r.value = !0, s.value = !0);
    }, f = () => {
      l.disabled || (s.value = !0);
    }, c = () => {
      s.value = !1;
    }, m = (C) => {
      l.disabled || C.button !== 0 || (r.value && s.value && o("click"), r.value = !1);
    };
    ae(() => {
      window.addEventListener("mouseup", m);
    }), ie(() => {
      window.removeEventListener("mouseup", m);
    });
    const b = j(() => ({
      userSelect: "none",
      width: "fit-content",
      paddingBottom: "4px",
      paddingRight: "4px",
      ...l.extraStyles
    })), x = j(() => ({
      transform: a.value ? "translate(2px, 2px)" : "translate(0, 0)",
      opacity: d.value ? 0.5 : 1
    })), w = j(() => a.value ? "indent" : l.baseType);
    return (C, R) => ct((h(), F(ee, {
      type: w.value,
      "extra-styles": b.value,
      "extra-class": e.extraClass,
      onMousedown: u,
      onMouseenter: f,
      onMouseleave: c
    }, {
      default: O(() => [
        T("div", {
          style: Y(x.value)
        }, [
          X(C.$slots, "default")
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"])), [
      [U(n), d.value ? "not-allowed" : "default"]
    ]);
  }
}), Ho = { style: { display: "flex", "align-items": "center" } }, Vo = ["src", "alt"], Uo = ["checked", "disabled", "value"], Wo = { key: 0 }, Ul = /* @__PURE__ */ H({
  __name: "Checkbox",
  props: {
    modelValue: { type: Boolean },
    label: { default: void 0 },
    disabled: { type: Boolean, default: !1 },
    value: { default: void 0 },
    checkedIcon: { default: "/win-55-ui/whole-components/checkbox-checked.png" },
    uncheckedIcon: { default: "/win-55-ui/whole-components/checkbox-unchecked.png" }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = ht, l = e, o = t, r = () => {
      l.disabled || o("update:modelValue", !l.modelValue);
    };
    return (s, a) => ct((h(), S("div", {
      class: Re(["checkbox-container", { disabled: e.disabled }]),
      style: Y({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: e.disabled ? 0.5 : 1,
        userSelect: "none",
        marginBottom: "2px"
      }),
      onClick: r
    }, [
      T("div", Ho, [
        T("img", {
          draggable: "false",
          src: e.modelValue ? e.checkedIcon : e.uncheckedIcon,
          alt: e.modelValue ? "checked" : "unchecked"
        }, null, 8, Vo)
      ]),
      T("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, Uo),
      e.label ? (h(), S("span", Wo, oe(e.label), 1)) : q("", !0)
    ], 6)), [
      [U(n), e.disabled ? "not-allowed" : "link"]
    ]);
  }
}), Ut = 2, Wt = 120, Yo = 'textarea, [contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"], input:not([type]), input[type="text" i], input[type="search" i], input[type="url" i], input[type="tel" i], input[type="email" i], input[type="password" i], input[type="number" i]', Xo = /* @__PURE__ */ H({
  __name: "CursorOverlay",
  setup(e) {
    const t = {
      pointer: "link",
      text: "text",
      "vertical-text": "text",
      move: "move",
      "all-scroll": "move",
      grab: "move",
      grabbing: "move",
      "not-allowed": "not-allowed",
      "no-drop": "not-allowed",
      wait: "wait",
      progress: "progress",
      help: "help",
      crosshair: "crosshair",
      cell: "crosshair",
      "ns-resize": "ns-resize",
      "n-resize": "ns-resize",
      "s-resize": "ns-resize",
      "row-resize": "ns-resize",
      "ew-resize": "ew-resize",
      "e-resize": "ew-resize",
      "w-resize": "ew-resize",
      "col-resize": "ew-resize",
      "nesw-resize": "nesw-resize",
      "ne-resize": "nesw-resize",
      "sw-resize": "nesw-resize",
      "nwse-resize": "nwse-resize",
      "nw-resize": "nwse-resize",
      "se-resize": "nwse-resize"
    }, n = B(), l = B();
    let o = {}, r = "", s = 0, a = 0, d = !1, u = 0, f = 0, c;
    const m = /* @__PURE__ */ new Map();
    function b(y) {
      return Math.round(y / Ut) * Ut;
    }
    function x() {
      const y = `translate(${b(u - s)}px, ${b(f - a)}px)`;
      n.value && (n.value.style.transform = y), l.value && (l.value.style.transform = y);
    }
    function w(y) {
      const A = n.value, P = l.value;
      if (!A && !P || y === d) return;
      d = y;
      const W = y ? "visible" : "hidden";
      A && (A.style.visibility = W), P && (P.style.visibility = W);
    }
    function C(y, A) {
      y && (A ? (y.src = A, y.style.display = "") : (y.style.display = "none", y.removeAttribute("src")));
    }
    function R(y) {
      if (y === r) {
        w(y !== "");
        return;
      }
      if (r = y, !y) {
        w(!1);
        return;
      }
      const A = o[y];
      C(n.value, A?.hasNormal ? `/win-55-ui/cursors/${y}/normal.gif` : void 0), C(l.value, A?.hasInvert ? `/win-55-ui/cursors/${y}/invert.gif` : void 0), s = (A?.hotspotX ?? 0) * _t, a = (A?.hotspotY ?? 0) * _t, w(!0), x();
    }
    function N(y) {
      const A = y.split(",").pop().trim().split(/\s+/)[0];
      return t[A] ?? "default";
    }
    function M(y) {
      for (let A = y; A; A = A.parentElement) {
        const P = A.style.cursor;
        if (P && P !== "none") return N(P);
      }
      return y.closest("a[href], area[href]") ? "link" : y.closest(Yo) ? "text" : y.closest(":disabled") ? "not-allowed" : "default";
    }
    function E(y) {
      if (!y) return;
      if (y.closest('[data-win55-cursor="off"]')) {
        R("");
        return;
      }
      const A = getComputedStyle(y), P = A.getPropertyValue(ce).trim();
      if (P) {
        R(P);
        return;
      }
      const W = A.getPropertyValue(De).trim() || "windows-default", ue = M(y), te = `${W} ${ue}`, Te = m.get(te);
      if (Te !== void 0) {
        R(Te);
        return;
      }
      Ve(W, ue).then((Be) => {
        m.set(te, Be ?? ""), E(document.elementFromPoint(u, f));
      });
    }
    function L(y) {
      u = y.clientX, f = y.clientY, r && x();
    }
    function g(y) {
      L(y);
    }
    function I(y) {
      y.target instanceof Element && (u = y.clientX, f = y.clientY, E(y.target));
    }
    function D(y) {
      y.relatedTarget === null && w(!1);
    }
    function z() {
      E(document.elementFromPoint(u, f));
    }
    function V() {
      document.hidden ? (c !== void 0 && (clearInterval(c), c = void 0), w(!1)) : (c === void 0 && (c = window.setInterval(z, Wt)), z());
    }
    return ae(async () => {
      window.addEventListener("pointermove", L, { passive: !0 }), "onpointerrawupdate" in window && window.addEventListener("pointerrawupdate", g, { passive: !0 }), document.addEventListener("pointerover", I, { passive: !0 }), document.addEventListener("pointerout", D, { passive: !0 }), document.addEventListener("visibilitychange", V), c = window.setInterval(z, Wt), o = await vn(), r = "", z();
    }), ie(() => {
      window.removeEventListener("pointermove", L), window.removeEventListener("pointerrawupdate", g), document.removeEventListener("pointerover", I), document.removeEventListener("pointerout", D), document.removeEventListener("visibilitychange", V), c !== void 0 && clearInterval(c);
    }), (y, A) => (h(), F(We, { to: "body" }, [
      T("img", {
        ref_key: "invertImg",
        ref: l,
        alt: "",
        style: { position: "fixed", top: "0", left: "0", visibility: "hidden", "pointer-events": "none", "z-index": "2147483647", "image-rendering": "pixelated", "mix-blend-mode": "difference" }
      }, null, 512),
      T("img", {
        ref_key: "normalImg",
        ref: n,
        alt: "",
        style: { position: "fixed", top: "0", left: "0", visibility: "hidden", "pointer-events": "none", "z-index": "2147483647", "image-rendering": "pixelated" }
      }, null, 512)
    ]));
  }
}), Wl = /* @__PURE__ */ H({
  __name: "CursorContext",
  props: {
    element: {},
    scheme: {},
    role: {},
    root: { type: Boolean }
  },
  setup(e, { expose: t }) {
    const n = e, l = j(() => n.element ?? "span"), o = Lo(), r = j(() => n.scheme ?? o?.scheme.value ?? "windows-default"), s = j(() => n.role ?? o?.role.value), a = lt(/* @__PURE__ */ new Set()), d = lt(/* @__PURE__ */ new Set());
    function u(E) {
      a.add(E), E.finally(() => a.delete(E));
    }
    function f(E) {
      d.add(E), E.finally(() => d.delete(E));
    }
    const c = j(() => a.size > 0 || o?.hasBusy.value === !0), m = j(() => d.size > 0 || o?.hasProgress.value === !0);
    function b(E) {
      return E !== void 0 && E !== "default" ? E : c.value ? "wait" : m.value ? "progress" : E;
    }
    function x(E) {
      return Ve(r.value, b(E) ?? "default");
    }
    const w = {
      scheme: r,
      role: s,
      hasBusy: c,
      hasProgress: m,
      resolveRole: x,
      addBusy: u,
      addProgress: f
    };
    $o(w), t({ addBusy: u, addProgress: f, resolveRole: x });
    const C = B();
    ae(() => {
      C.value && Fo(C.value, w), n.root && Oo(w);
    }), ie(() => {
      if (C.value && Mo(C.value), !n.root) return;
      Po(w);
      const E = document.documentElement;
      E.style.cursor = "", E.style.removeProperty(ce), E.style.removeProperty(De);
    });
    const R = j(() => b(s.value)), N = B();
    ot(() => {
      const E = R.value;
      if (!E) {
        N.value = void 0;
        return;
      }
      Ve(r.value, E).then((L) => {
        N.value = L;
      });
    });
    const M = j(() => {
      const E = {};
      if (n.element || (E.display = "contents"), !n.root) {
        const L = E;
        L.cursor = "none", n.scheme && (L[De] = r.value), N.value && (L[ce] = N.value);
      }
      return E;
    });
    return ot(() => {
      if (!n.root) return;
      const E = document.documentElement;
      E.style.cursor = "none", E.style.setProperty(De, r.value), N.value ? E.style.setProperty(ce, N.value) : E.style.removeProperty(ce);
    }), (E, L) => (h(), S(_, null, [
      (h(), F(tn(l.value), {
        style: Y(M.value),
        ref_key: "rootEl",
        ref: C
      }, {
        default: O(() => [
          X(E.$slots, "default")
        ]),
        _: 3
      }, 8, ["style"])),
      e.root ? (h(), F(Xo, { key: 0 })) : q("", !0)
    ], 64));
  }
}), Go = /* @__PURE__ */ H({
  __name: "HDivider",
  setup(e) {
    return (t, n) => (h(), F(ee, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), Yl = /* @__PURE__ */ H({
  __name: "MenuDropdown",
  setup(e) {
    return (t, n) => (h(), F(Dn, null, {
      trigger: O(() => [
        X(t.$slots, "trigger")
      ]),
      items: O(() => [
        K(ee, { type: "panel-d-1" }, {
          default: O(() => [
            X(t.$slots, "items")
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), Ko = { style: { display: "flex", "align-items": "center" } }, qo = ["src"], Jo = ["src"], Qo = ["checked", "disabled", "value", "name"], Zo = { key: 0 }, Xl = /* @__PURE__ */ H({
  __name: "RadioButton",
  props: {
    modelValue: {},
    value: {},
    label: { default: void 0 },
    disabled: { type: Boolean, default: !1 },
    name: { default: void 0 },
    checkedIcon: { default: "/win-55-ui/whole-components/radio-checked.png" },
    uncheckedIcon: { default: "/win-55-ui/whole-components/radio-unchecked.png" }
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = ht, l = e, o = t, r = j(() => l.modelValue === l.value), s = (a) => {
      a.preventDefault(), !l.disabled && (r.value || o("update:modelValue", l.value));
    };
    return (a, d) => ct((h(), S("div", {
      class: Re(["radio-container", { disabled: e.disabled }]),
      style: Y({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: e.disabled ? 0.5 : 1,
        userSelect: "none",
        marginBottom: "2px"
      }),
      onClick: s
    }, [
      T("div", Ko, [
        r.value ? (h(), S("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, qo)) : (h(), S("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, Jo))
      ]),
      T("input", {
        type: "radio",
        checked: r.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, Qo),
      e.label ? (h(), S("span", Zo, oe(e.label), 1)) : q("", !0)
    ], 6)), [
      [U(n), e.disabled ? "not-allowed" : "link"]
    ]);
  }
}), ye = /* @__PURE__ */ H({
  __name: "Typography",
  props: {
    element: { default: void 0 },
    fontSize: {},
    isBold: { type: Boolean },
    isItalic: { type: Boolean },
    fontColor: {},
    shorthand: {},
    fontShadowColor: {},
    fontName: {}
  },
  setup(e) {
    const t = e, n = j(() => t.element ?? "span"), l = j(() => {
      const o = ln(t);
      return t.element || (o.display = "contents"), o;
    });
    return (o, r) => (h(), F(tn(n.value), {
      style: Y(l.value)
    }, {
      default: O(() => [
        X(o.$slots, "default")
      ]),
      _: 3
    }, 8, ["style"]));
  }
}), el = { key: 1 }, tl = {
  key: 4,
  style: { "text-decoration": "underline" }
}, nl = {
  key: 5,
  style: { "text-decoration": "line-through" }
}, ol = ["href"], ll = ["aria-label", "data-win55-emoji"], rl = ["src", "alt"], al = /* @__PURE__ */ H({
  __name: "RichTextNode",
  props: {
    node: {},
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    function t(n, l) {
      return n ? re(n) : ut(l);
    }
    return (n, l) => {
      const o = Ln("RichTextNode", !0);
      return e.node.type === "text" ? (h(), S(_, { key: 0 }, [
        xe(oe(e.node.value), 1)
      ], 64)) : e.node.type === "break" ? (h(), S("br", el)) : e.node.type === "bold" ? (h(), F(ye, {
        key: 2,
        "is-bold": ""
      }, {
        default: O(() => [
          (h(!0), S(_, null, J(e.node.children, (r, s) => (h(), F(o, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "italic" ? (h(), F(ye, {
        key: 3,
        "is-italic": ""
      }, {
        default: O(() => [
          (h(!0), S(_, null, J(e.node.children, (r, s) => (h(), F(o, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "underline" ? (h(), S("span", tl, [
        (h(!0), S(_, null, J(e.node.children, (r, s) => (h(), F(o, {
          key: s,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "strike" ? (h(), S("span", nl, [
        (h(!0), S(_, null, J(e.node.children, (r, s) => (h(), F(o, {
          key: s,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "color" ? (h(), F(ye, {
        key: 6,
        "font-color": e.node.value
      }, {
        default: O(() => [
          (h(!0), S(_, null, J(e.node.children, (r, s) => (h(), F(o, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-color"])) : e.node.type === "size" && e.allowSizes ? (h(), F(ye, {
        key: 7,
        "font-size": e.node.value
      }, {
        default: O(() => [
          (h(!0), S(_, null, J(e.node.children, (r, s) => (h(), F(o, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-size"])) : e.node.type === "size" ? (h(!0), S(_, { key: 8 }, J(e.node.children, (r, s) => (h(), F(o, {
        key: s,
        node: r,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "url" && e.allowLinks ? (h(), S("a", {
        key: 9,
        href: e.node.href,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "richtext-link"
      }, [
        (h(!0), S(_, null, J(e.node.children, (r, s) => (h(), F(o, {
          key: s,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ], 8, ol)) : e.node.type === "url" ? (h(!0), S(_, { key: 10 }, J(e.node.children, (r, s) => (h(), F(o, {
        key: s,
        node: r,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "emoji" ? (h(), S("span", {
        key: 11,
        class: "win55-emoji",
        role: "img",
        "aria-label": e.node.emoji,
        "data-win55-emoji": e.node.emoji,
        style: { "--win55-emoji-size": "30px" }
      }, [
        T("img", {
          class: "win55-emoji-image",
          src: t(e.node.code, e.node.emoji),
          alt: e.node.emoji,
          draggable: "false"
        }, null, 8, rl)
      ], 8, ll)) : q("", !0);
    };
  }
}), il = {
  b: "bold",
  i: "italic",
  u: "underline",
  s: "strike",
  strike: "strike",
  color: "color",
  size: "size",
  url: "url"
}, sl = /* @__PURE__ */ new Set(["br"]), Yt = {
  normal: 12,
  big: 24
};
function yn(e) {
  return e.map((t) => t.type === "text" ? t.value : t.type === "emoji" ? t.emoji : t.type === "break" ? `
` : yn(t.children)).join("");
}
function Xt(e) {
  switch (e.tagType) {
    case "color":
      return { type: "color", value: e.value ?? "inherit", children: e.children };
    case "size": {
      const t = (e.value ?? "").trim().toLowerCase(), n = Yt[t], l = Number.parseInt(e.value ?? "", 10);
      return { type: "size", value: n ?? (Number.isFinite(l) ? l : Yt.normal), children: e.children };
    }
    case "url":
      return {
        type: "url",
        href: e.value ?? yn(e.children).trim(),
        children: e.children
      };
    default:
      return { type: e.tagType, children: e.children };
  }
}
function cl(e, t) {
  for (let n = e.length - 1; n >= 0; n--)
    if (e[n].tagType === t) return n;
  return -1;
}
function ul(e, t) {
  if (!e) return [];
  if (!t) return [{ type: "text", value: e }];
  const n = [], l = /:([a-zA-Z0-9_+-]+):/g;
  let o = 0, r;
  for (; r = l.exec(e); ) {
    const s = t.get(r[1].toLowerCase());
    s && (r.index > o && n.push({ type: "text", value: e.slice(o, r.index) }), n.push({ type: "emoji", emoji: s.emoji, code: s.code }), o = r.index + r[0].length);
  }
  return o < e.length && n.push({ type: "text", value: e.slice(o) }), n.length > 0 ? n : [{ type: "text", value: e }];
}
function dl(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const Gt = /* @__PURE__ */ new WeakMap(), fl = new RegExp(Se, "gu");
function ml(e) {
  if (!e) return fl;
  const t = Gt.get(e);
  if (t) return t;
  const n = Object.keys(e).sort((r, s) => s.length - r.length).map(dl), l = n.length > 0 ? `${n.join("|")}|${Se}` : Se, o = new RegExp(l, "gu");
  return Gt.set(e, o), o;
}
function hl(e, t) {
  const n = ml(t), l = [];
  let o = 0, r;
  for (n.lastIndex = 0; r = n.exec(e); ) {
    const s = r[0], a = t?.[s];
    r.index > o && l.push({ type: "text", value: e.slice(o, r.index) }), l.push({ type: "emoji", emoji: s, code: a }), o = r.index + s.length;
  }
  return o < e.length && l.push({ type: "text", value: e.slice(o) }), l.length > 0 ? l : [{ type: "text", value: e }];
}
function gl(e, t, n) {
  const l = [];
  for (const o of ul(e, t))
    o.type === "text" ? l.push(...hl(o.value, n)) : l.push(o);
  return l;
}
function vl(e, t, n = null) {
  const l = [], o = [], r = /\[(\/?)(\w+)(?:=([^\]]*))?\]/g;
  let s = 0, a;
  const d = () => o.length ? o[o.length - 1].children : l, u = (f) => d().push(...gl(f, t, n));
  for (; a = r.exec(e); ) {
    const [f, c, m, b] = a, x = m.toLowerCase();
    if (sl.has(x)) {
      u(e.slice(s, a.index)), s = a.index + f.length, d().push({ type: "break" });
      continue;
    }
    const w = il[x];
    if (!w) continue;
    if (u(e.slice(s, a.index)), s = a.index + f.length, !c) {
      o.push({ tagType: w, value: b, children: [] });
      continue;
    }
    const C = cl(o, w);
    if (C === -1) {
      u(f);
      continue;
    }
    for (; o.length > C + 1; ) {
      const N = o.pop();
      o[o.length - 1].children.push(Xt(N));
    }
    const R = o.pop();
    d().push(Xt(R));
  }
  for (u(e.slice(s)); o.length; ) {
    const f = o.pop();
    (o.length ? o[o.length - 1].children : l).push(...f.children);
  }
  return l;
}
const pl = {
  "data-win55-richtext": "",
  style: { display: "contents" }
}, Gl = /* @__PURE__ */ H({
  __name: "RichText",
  props: {
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = Zt(), l = B(null), o = B(null);
    dt().then((d) => {
      const u = /* @__PURE__ */ new Map();
      for (const f of d)
        for (const c of f.shortcodes)
          u.set(c.toLowerCase(), { emoji: f.emoji, code: f.code });
      l.value = u;
    }), he().then((d) => {
      o.value = d;
    });
    const r = j(() => {
      const d = l.value;
      return d ? { get: (u) => d.get(u) } : null;
    });
    function s(d) {
      return d.map((u) => typeof u.children == "string" ? u.children : Array.isArray(u.children) ? s(u.children) : "").join("");
    }
    const a = j(() => vl(s(n.default?.() ?? []), r.value, o.value));
    return (d, u) => (h(), S("span", pl, [
      (h(!0), S(_, null, J(a.value, (f, c) => (h(), F(al, {
        key: c,
        node: f,
        "allow-links": t.allowLinks,
        "allow-sizes": t.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
    ]));
  }
});
function yl(e, t, n, l, o) {
  const r = e.getContext("2d");
  if (!r) return;
  r.clearRect(0, 0, e.width, e.height);
  const s = 2, a = [
    [0, 48, 12, 60, 3, 51, 15, 63],
    [32, 16, 44, 28, 35, 19, 47, 31],
    [8, 56, 4, 52, 11, 59, 7, 55],
    [40, 24, 36, 20, 43, 27, 39, 23],
    [2, 50, 14, 62, 1, 49, 13, 61],
    [34, 18, 46, 30, 33, 17, 45, 29],
    [10, 58, 6, 54, 9, 57, 5, 53],
    [42, 26, 38, 22, 41, 25, 37, 21]
  ], d = Kt(l), u = Kt(o), f = Math.floor(t / s), c = Math.floor(n / s);
  e.width = Math.floor(t * 2) / 2, e.height = Math.floor(n * 2) / 2;
  for (let m = 0; m < c; m++)
    for (let b = 0; b < f; b++) {
      const x = b * s, w = m * s, C = (b + m) / (f + c - 6), R = (a[m % 8][b % 8] + 0.5) / 64, N = C > R ? 1 : 0, M = Math.round(d.r * (1 - N) + u.r * N), E = Math.round(d.g * (1 - N) + u.g * N), L = Math.round(d.b * (1 - N) + u.b * N);
      r.fillStyle = `rgb(${M}, ${E}, ${L})`, r.fillRect(x, w, s, s);
    }
}
function Kt(e) {
  const t = e.replace("#", ""), n = parseInt(t, 16);
  return {
    r: n >> 16 & 255,
    g: n >> 8 & 255,
    b: n & 255
  };
}
const wl = { style: { height: "0", overflow: "visible" } }, xl = { class: "titlebar-content" }, bl = { class: "titlebar-image" }, El = ["src"], Cl = { class: "titlebar-text" }, kl = { class: "titlebar-buttons" }, Sl = /* @__PURE__ */ H({
  __name: "Titlebar",
  props: {
    title: {},
    icon: {},
    placeholderButtons: { type: Boolean },
    disabled: { type: Boolean },
    gradientColorA: {},
    gradientColorB: {}
  },
  setup(e) {
    const t = e, n = B(null);
    let l = null;
    function o(s, a) {
      const d = t.gradientColorA || "5555ff", u = t.gradientColorB || "0000aa";
      yl(s, s.width, s.height, d, u), a.fillStyle = "#555555", a.fillRect(0, s.height - 2, Math.floor(s.width / 2) * 2, 4);
    }
    function r() {
      const s = n.value;
      if (!s) return;
      const a = s.getContext("2d");
      if (!a) return;
      const d = s.getBoundingClientRect(), u = Math.floor(d.width * 2) / 2, f = Math.floor(d.height * 2) / 2;
      (s.width !== u || s.height !== f) && (s.width = u, s.height = f), o(s, a);
    }
    return me(() => [t.gradientColorA, t.gradientColorB], () => {
      if (n.value) {
        const s = n.value.getContext("2d");
        s && o(n.value, s);
      }
    }), ae(() => {
      r(), n.value && (l = new ResizeObserver(() => {
        r();
      }), l.observe(n.value));
    }), ie(() => {
      l?.disconnect();
    }), (s, a) => (h(), S("div", null, [
      T("div", wl, [
        T("canvas", {
          ref_key: "canvasRef",
          ref: n,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      T("div", xl, [
        T("div", bl, [
          T("img", {
            src: e.icon ?? "/win-55-ui/icons/program.png"
          }, null, 8, El)
        ]),
        T("div", Cl, [
          K(ye, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: O(() => [
              xe(oe(e.title), 1)
            ]),
            _: 1
          })
        ]),
        T("div", kl, [
          X(s.$slots, "buttons"),
          e.placeholderButtons ? (h(), S(_, { key: 0 }, [
            K(_e, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: O(() => [...a[0] || (a[0] = [
                T("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/o.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            K(_e, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: O(() => [...a[1] || (a[1] = [
                T("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/_.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            a[3] || (a[3] = T("div", { style: { width: "2px" } }, null, -1)),
            K(_e, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: O(() => [...a[2] || (a[2] = [
                T("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/x.png"
                }, null, -1)
              ])]),
              _: 1
            })
          ], 64)) : q("", !0)
        ])
      ])
    ]));
  }
}), Kl = /* @__PURE__ */ H({
  __name: "Tooltip",
  props: {
    text: {},
    offsetX: {},
    offsetY: {}
  },
  setup(e) {
    const t = e, n = B(!1), l = lt({ x: 0, y: 0 });
    let o = null;
    const r = () => {
      o = window.setTimeout(() => {
        n.value = !0;
      }, 400);
    }, s = () => {
      o !== null && (clearTimeout(o), o = null), n.value = !1;
    }, a = (u) => {
      l.x = u.clientX + (t.offsetX ?? 24), l.y = u.clientY + (t.offsetY ?? 24);
    }, d = j(() => ({
      position: "fixed",
      left: `${l.x}px`,
      top: `${l.y}px`,
      pointerEvents: "none",
      // now TS understands it's valid
      whiteSpace: "nowrap",
      zIndex: 1e3
    }));
    return ie(() => {
      o !== null && clearTimeout(o);
    }), (u, f) => (h(), S("span", {
      onMouseenter: r,
      onMouseleave: s,
      onMousemove: a,
      style: { position: "relative", display: "inline-block" }
    }, [
      X(u.$slots, "default"),
      n.value ? (h(), F(ee, {
        key: 0,
        style: Y(d.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: O(() => [
          xe(oe(t.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : q("", !0)
    ], 32));
  }
}), Rl = {
  class: "window-container",
  style: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%"
  }
}, Ae = 6, Tl = /* @__PURE__ */ H({
  __name: "Window",
  props: /* @__PURE__ */ en({
    extraStyles: {},
    extraClass: {},
    minWidth: {},
    minHeight: {},
    resizable: { type: Boolean },
    resizableHorizontally: { type: Boolean },
    resizableVertically: { type: Boolean },
    title: {},
    icon: {},
    placeholderButtons: { type: Boolean },
    disabled: { type: Boolean },
    gradientColorA: {},
    gradientColorB: {},
    faux: { type: Boolean },
    overflowX: {},
    overflowY: {}
  }, {
    x: { default: 100 },
    xModifiers: {},
    y: { default: 100 },
    yModifiers: {},
    width: { default: 320 },
    widthModifiers: {},
    height: { default: 220 },
    heightModifiers: {}
  }),
  emits: ["update:x", "update:y", "update:width", "update:height"],
  setup(e) {
    const t = e, n = Ce(e, "x"), l = Ce(e, "y"), o = Ce(e, "width"), r = Ce(e, "height"), s = t.minWidth ?? 240, a = t.minHeight ?? 40, d = j(() => (t.resizable ?? !1) || (t.resizableHorizontally ?? !1)), u = j(() => (t.resizable ?? !1) || (t.resizableVertically ?? !1));
    let f = !1, c = !1, m = "", b = "", x = 0, w = 0, C = 0, R = 0, N = 0, M = 0;
    function E(z) {
      if (t.faux || m) return;
      const V = z.target;
      V.closest(".titlebar-image") || V.closest(".titlebar-buttons") || (f = !0, x = z.clientX, w = z.clientY, N = n.value, M = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", g), window.addEventListener("mouseup", I));
    }
    function L(z) {
      t.faux || m && (!d.value && !u.value || (c = !0, b = m, x = z.clientX, w = z.clientY, C = o.value, R = r.value, N = n.value, M = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", g), window.addEventListener("mouseup", I)));
    }
    function g(z) {
      if (t.faux) return;
      const V = z.clientX - x, y = z.clientY - w;
      if (f && (n.value = N + V, l.value = M + y), c) {
        const A = b;
        if (d.value && A.includes("e") && (o.value = Math.max(s, C + V)), u.value && A.includes("s") && (r.value = Math.max(a, R + y)), d.value && A.includes("w")) {
          const P = C - V, W = Math.max(s, P);
          o.value = W, n.value = N + (C - W);
        }
        if (u.value && A.includes("n")) {
          const P = R - y, W = Math.max(a, P);
          r.value = W, l.value = M + (R - W);
        }
      }
    }
    function I() {
      f = !1, c = !1, b = "", document.body.style.userSelect = "", window.removeEventListener("mousemove", g), window.removeEventListener("mouseup", I);
    }
    function D(z) {
      if (t.faux) {
        m = "";
        return;
      }
      if (c) return;
      if (!d.value && !u.value) {
        m = "";
        return;
      }
      const y = z.currentTarget.getBoundingClientRect(), A = z.clientX - y.left, P = y.right - z.clientX, W = z.clientY - y.top, ue = y.bottom - z.clientY;
      let te = "";
      u.value && (W < Ae ? te += "n" : ue < Ae && (te += "s")), d.value && (A < Ae ? te += "w" : P < Ae && (te += "e")), m = te;
    }
    return (z, V) => (h(), F(ee, {
      "extra-class": e.extraClass,
      "extra-styles": t.faux ? e.extraStyles : {
        position: "absolute",
        left: n.value + "px",
        top: l.value + "px",
        width: o.value + "px",
        height: r.value + "px",
        ...e.extraStyles
      },
      type: "panel-d-2",
      onMousemove: D,
      onMousedown: L
    }, {
      default: O(() => [
        T("div", Rl, [
          T("div", {
            class: "titlebar-wrapper",
            onMousedown: He(E, ["stop"]),
            style: { height: "34px" }
          }, [
            K(Sl, {
              title: e.title,
              icon: e.icon,
              "placeholder-buttons": e.placeholderButtons,
              disabled: e.disabled,
              "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
              "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
            }, {
              buttons: O(() => [
                X(z.$slots, "titlebar-buttons")
              ]),
              _: 3
            }, 8, ["title", "icon", "placeholder-buttons", "disabled", "gradient-color-a", "gradient-color-b"])
          ], 32),
          T("div", {
            class: "inner-container",
            style: Y({
              flex: "1",
              overflowX: t.overflowX ?? "auto",
              overflowY: t.overflowY ?? "auto",
              marginTop: "4px",
              boxSizing: "border-box"
            })
          }, [
            X(z.$slots, "default")
          ], 4)
        ])
      ]),
      _: 3
    }, 8, ["extra-class", "extra-styles"]));
  }
}), Bl = /* @__PURE__ */ H({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" }
  },
  setup(e) {
    return (t, n) => (h(), F(ee, {
      type: "border-groove",
      "extra-styles": { padding: "10px", margin: "10px" }
    }, {
      default: O(() => [
        T("div", {
          class: "label",
          style: Y({ backgroundColor: e.backgroundColorHint })
        }, oe(e.label), 5),
        X(t.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }));
  }
}), jl = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [l, o] of t)
    n[l] = o;
  return n;
}, ql = /* @__PURE__ */ jl(Bl, [["__scopeId", "data-v-9a25af1b"]]), qt = "/win-55-ui/emoji/emoji-by-category.json";
let nt = null;
async function Jt() {
  return nt || (nt = fetch(qt).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${qt}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), nt;
}
const Il = { class: "emoji-picker-body" }, Nl = { class: "emoji-picker-tabs" }, zl = ["onClick"], Al = { class: "emoji-picker-grid" }, $l = ["src", "title", "onClick"], Ll = "546", Jl = /* @__PURE__ */ H({
  __name: "EmojiPickerWindow",
  setup(e) {
    const t = B(null), n = B([]), l = B(null), o = B(void 0), r = j(() => n.value.find((u) => u.category === l.value) ?? null);
    async function s() {
      if (Math.random() < 0.75) {
        o.value = re(Ll);
        return;
      }
      const f = (await Jt()).flatMap((m) => m.emojis);
      if (f.length === 0) return;
      const c = f[Math.floor(Math.random() * f.length)];
      o.value = re(c.code);
    }
    me(we, async (u) => {
      u && (s(), n.value.length === 0 && (n.value = await Jt(), l.value = n.value[0]?.category ?? null));
    }, { immediate: !0 });
    function a(u) {
      l.value = u;
    }
    function d(u) {
      if (!we.value) return;
      const f = u.target;
      t.value?.contains(f) || Mt();
    }
    return ae(() => {
      document.addEventListener("click", d);
    }), ie(() => {
      document.removeEventListener("click", d);
    }), (u, f) => (h(), F(We, { to: "body" }, [
      U(we) ? (h(), S("div", {
        key: 0,
        ref_key: "rootRef",
        ref: t,
        style: { display: "contents" }
      }, [
        K(Tl, {
          x: U(se).x,
          "onUpdate:x": f[0] || (f[0] = (c) => U(se).x = c),
          y: U(se).y,
          "onUpdate:y": f[1] || (f[1] = (c) => U(se).y = c),
          width: U(se).width,
          "onUpdate:width": f[2] || (f[2] = (c) => U(se).width = c),
          height: U(se).height,
          "onUpdate:height": f[3] || (f[3] = (c) => U(se).height = c),
          resizable: "",
          title: "Emoji Picker",
          icon: o.value,
          "min-width": 240,
          "min-height": 200,
          "overflow-x": "hidden",
          "overflow-y": "hidden",
          "extra-class": "emoji-picker-window",
          "extra-styles": { zIndex: 1200 }
        }, {
          "titlebar-buttons": O(() => [
            K(_e, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              onClick: U(Mt)
            }, {
              default: O(() => [...f[4] || (f[4] = [
                T("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/x.png"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]),
          default: O(() => [
            K(ee, {
              type: "textarea",
              "extra-styles": { width: "100%", height: "calc(100% - 2px)", marginTop: "2px", padding: "2px" }
            }, {
              default: O(() => [
                T("div", Il, [
                  T("div", Nl, [
                    (h(!0), S(_, null, J(n.value, (c) => (h(), S("span", {
                      key: c.category,
                      class: Re(["emoji-picker-tab", { "emoji-picker-tab--selected": c.category === l.value }]),
                      onClick: (m) => a(c.category)
                    }, [
                      K(ye, {
                        shorthand: c.category === l.value ? "Bold12" : "Regular12"
                      }, {
                        default: O(() => [
                          xe(oe(c.category), 1)
                        ]),
                        _: 2
                      }, 1032, ["shorthand"])
                    ], 10, zl))), 128))
                  ]),
                  K(Go),
                  T("div", Al, [
                    (h(!0), S(_, null, J(r.value?.emojis ?? [], (c) => (h(), S("div", {
                      key: c.code,
                      class: "emoji-picker-grid-cell"
                    }, [
                      T("img", {
                        src: U(re)(c.code),
                        title: c.shortcodes[0] ? `:${c.shortcodes[0]}:` : void 0,
                        class: "emoji-picker-grid-item",
                        onClick: (m) => U(Co)(c.emoji)
                      }, null, 8, $l)
                    ]))), 128))
                  ])
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["x", "y", "width", "height", "icon"])
      ], 512)) : q("", !0)
    ]));
  }
}), Fl = ["src", "alt", "width", "height"], Qt = 15, $e = 2, Ql = /* @__PURE__ */ H({
  __name: "Emoji",
  props: {
    emoji: {}
  },
  setup(e) {
    const t = e, n = new RegExp(`^(?:${Se})$`, "u"), l = B(""), o = B(t.emoji), r = B(Qt * $e), s = B(Qt * $e);
    async function a(u) {
      if (n.test(u)) {
        o.value = u;
        const c = await Gn(u);
        l.value = c ?? ut(u);
        return;
      }
      const f = await gn(u);
      if (f) {
        o.value = f.emoji, l.value = re(f.code);
        return;
      }
      console.warn(`[win-55-ui] Emoji: could not resolve "${u}" as an emoji or a shortcode alias.`), o.value = u, l.value = "";
    }
    me(() => t.emoji, (u) => {
      a(u);
    }, { immediate: !0 });
    function d(u) {
      const f = u.target;
      r.value = f.naturalWidth * $e, s.value = f.naturalHeight * $e;
    }
    return (u, f) => (h(), S("img", {
      class: "win55-emoji-standalone",
      src: l.value,
      alt: o.value,
      width: r.value,
      height: s.value,
      draggable: "false",
      onLoad: d
    }, null, 40, Fl));
  }
}), Zl = (e, t = 20, n = 48, l = 30) => {
  const o = B(
    Array.from({ length: e }, (u, f) => ({
      sin: Math.sin(0 + f * Math.PI * 2 / e),
      cos: Math.cos(0 + f * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let r = 0, s = 0;
  const a = t > 0 ? 1e3 / t : 0, d = () => {
    r = requestAnimationFrame(d);
    const u = Date.now();
    if (u - s < a) return;
    s = u;
    const f = Array.from({ length: e }, (x, w) => ({
      sin: Math.sin(u / (1e3 + w * 200) + w * Math.PI * 2 / e),
      cos: Math.cos(u / (3e3 + w * 400) + w * Math.PI * 2 / e + Math.PI / 4)
    })), c = f.map((x) => n + x.sin * l), m = e * n, b = c.reduce((x, w) => x + w, 0);
    if (b > 0) {
      const x = m / b;
      o.value = f.map((w) => ({
        sin: ((n + w.sin * l) * x - n) / l,
        cos: w.cos
      }));
    } else
      o.value = f;
  };
  return ae(() => {
    r = requestAnimationFrame(d);
  }), ie(() => {
    cancelAnimationFrame(r);
  }), { values: o };
};
function er(e) {
  document.addEventListener(
    "error",
    (t) => {
      const n = t.target;
      n instanceof HTMLImageElement && e(n, t);
    },
    !0
    // IMPORTANT: use capture phase since error doesn't bubble
  );
}
export {
  Pn as Balloon,
  Dn as BaseDropdown,
  Hl as BaseInput,
  ee as Box,
  _e as Button,
  pn as CURSOR_CONTEXT_KEY,
  Ul as Checkbox,
  Wl as CursorContext,
  Ql as Emoji,
  Jl as EmojiPickerWindow,
  Go as HDivider,
  Yl as MenuDropdown,
  ql as NamedPanel,
  Xl as RadioButton,
  Gl as RichText,
  Sl as Titlebar,
  Kl as Tooltip,
  ye as Typography,
  Tl as Window,
  ft as activeTarget,
  Mt as closePicker,
  ht as cursorDirective,
  _l as customEmojiDirective,
  yl as drawAngledBayerDitherGradient,
  po as emojiDirective,
  Gn as getEmojiGifPath,
  re as getEmojiGifPathFromCode,
  Pl as getEmojiRegistry,
  ke as getSelectionOffset,
  ne as getTextWithCustomEmoji,
  Dl as hasEmoji,
  Co as insertEmoji,
  vn as loadCursorsManifest,
  he as loadEmojiRegistry,
  Ao as loadSchemeIndex,
  Eo as openPicker,
  ko as pickNextButtonIcon,
  we as pickerOpen,
  se as pickerPosition,
  $o as provideCursorContext,
  Ft as registerActiveInput,
  er as registerGlobalImageErrorHandler,
  Vl as resetCursorsCache,
  Ol as resetEmojiRegistryCache,
  Ve as resolveCursor,
  Le as restoreSelectionOffset,
  ln as typographyStyles,
  Lo as useCursorContext,
  Zl as useSineWave
};
