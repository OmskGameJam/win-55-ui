import { defineComponent as H, ref as A, computed as j, openBlock as p, createElementBlock as E, normalizeStyle as z, normalizeClass as Ie, renderSlot as V, useModel as pe, useSlots as bt, watch as ue, nextTick as xt, onMounted as de, onUnmounted as fe, createBlock as F, Teleport as Et, createElementVNode as k, createVNode as ne, withCtx as L, unref as we, Fragment as P, createTextVNode as be, toDisplayString as oe, createCommentVNode as q, mergeModels as Ct, withModifiers as je, shallowRef as Ut, renderList as Z, resolveDynamicComponent as Xt, resolveComponent as Gt, reactive as qt } from "vue";
const te = /* @__PURE__ */ H({
  __name: "Box",
  props: {
    type: {},
    extraStyles: {},
    extraClass: {}
  },
  setup(e, { expose: t }) {
    const n = e, l = A(null), o = j(() => ({
      "--img": `url(/win-55-ui/${n.type}.png)`,
      ...n.extraStyles
    }));
    return t({ el: l }), (r, s) => (p(), E("div", {
      ref_key: "rootRef",
      ref: l,
      class: Ie(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: z(o.value)
    }, [
      V(r.$slots, "default")
    ], 6));
  }
}), Jt = { class: "balloon-tip-box" }, Kt = {
  key: 1,
  class: "balloon-wrapper"
}, Qt = { class: "balloon-tip-box" }, ke = 8, Zt = /* @__PURE__ */ H({
  __name: "Balloon",
  props: /* @__PURE__ */ Ct({
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
    const t = pe(e, "shown");
    function n(h) {
      return "top" in h;
    }
    function l(h) {
      return n(h) ? h : { top: h.y, bottom: h.y, left: h.x, right: h.x };
    }
    const o = e, r = bt(), s = j(() => o.side ?? "top"), a = j(() => o.bias), c = A(s.value), d = j(() => o.anchor ? c.value : s.value), v = j(() => {
      const h = {};
      switch (s.value) {
        case "top":
          h.bottom = "100%", h.left = "50%", h.transform = "translateX(-50%)";
          break;
        case "bottom":
          h.top = "100%", h.left = "50%", h.transform = "translateX(-50%)";
          break;
        case "left":
          h.right = "100%", h.top = "50%", h.transform = "translateY(-50%)";
          break;
        case "right":
          h.left = "100%", h.top = "50%", h.transform = "translateY(-50%)";
          break;
      }
      return h;
    }), u = j(() => {
      switch (d.value) {
        case "top":
          return "column";
        case "bottom":
          return "column-reverse";
        case "left":
          return "row";
        case "right":
          return "row-reverse";
      }
    }), f = j(() => {
      let h = "", T = !1;
      switch (d.value) {
        case "top":
          h = "rotate(0deg)", a.value === "right" && (T = !0);
          break;
        case "bottom":
          h = "rotate(180deg)", a.value === "left" && (T = !0);
          break;
        case "left":
          h = "rotate(-90deg)";
          break;
        case "right":
          h = "rotate(90deg)", T = !0;
          break;
      }
      return T ? `${h} scaleX(-1)` : h;
    }), y = j(() => {
      const h = {};
      return a.value ? ((d.value === "top" || d.value === "bottom") && (a.value === "left" && (h.transform = "translateX(calc(-50% + 28px))"), a.value === "right" && (h.transform = "translateX(calc(50% - 28px))")), (d.value === "left" || d.value === "right") && (a.value === "up" && (h.transform = "translateY(calc(-50% + 28px))"), a.value === "down" && (h.transform = "translateY(calc(50% - 28px))")), h) : {};
    }), w = A(null), b = A(null), C = { top: "bottom", bottom: "top", left: "right", right: "left" }, S = {
      top: ["left", "right"],
      bottom: ["left", "right"],
      left: ["top", "bottom"],
      right: ["top", "bottom"]
    };
    function B(h, T, $) {
      const J = (T.left + T.right) / 2, R = (T.top + T.bottom) / 2;
      return h === "top" || h === "bottom" ? {
        top: h === "top" ? T.top - $.height : T.bottom,
        left: J - $.width / 2
      } : {
        left: h === "left" ? T.left - $.width : T.right,
        top: R - $.height / 2
      };
    }
    function D(h, T, $, J) {
      return h.top >= ke && h.left >= ke && h.top + T.height <= J - ke && h.left + T.width <= $ - ke;
    }
    function M() {
      const h = w.value;
      if (!o.anchor || !h) return;
      const T = l(o.anchor), $ = h.getBoundingClientRect(), J = window.innerWidth, R = window.innerHeight, I = o.side ?? "top", U = [
        I,
        C[I],
        ...S[I]
      ].find((W) => D(B(W, T, $), $, J, R)) ?? I;
      c.value = U, b.value = B(U, T, $);
    }
    ue(
      [() => o.anchor, t],
      async ([h, T]) => {
        !h || !T || (await xt(), M());
      },
      { deep: !0, immediate: !0 }
    );
    const _ = () => {
      o.anchor && t.value && M();
    };
    return de(() => {
      window.addEventListener("resize", _), window.addEventListener("scroll", _, !0);
    }), fe(() => {
      window.removeEventListener("resize", _), window.removeEventListener("scroll", _, !0);
    }), (h, T) => e.anchor ? (p(), F(Et, {
      key: 0,
      to: "body"
    }, [
      t.value ? (p(), E("div", {
        key: 0,
        ref_key: "anchoredRef",
        ref: w,
        class: "balloon-anchored",
        style: z({
          top: (b.value?.top ?? 0) + "px",
          left: (b.value?.left ?? 0) + "px"
        })
      }, [
        k("div", {
          class: "balloon-inner",
          style: z({ flexDirection: u.value })
        }, [
          k("div", {
            class: "balloon-box-wrapper",
            style: z(y.value)
          }, [
            ne(te, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: L(() => [
                we(r).content ? V(h.$slots, "content", { key: 0 }) : (p(), E(P, { key: 1 }, [
                  be(oe(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          k("div", Jt, [
            k("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: z({ transform: f.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : q("", !0)
    ])) : (p(), E("div", Kt, [
      V(h.$slots, "default"),
      t.value ? (p(), E("div", {
        key: 0,
        class: "balloon",
        style: z(v.value)
      }, [
        k("div", {
          class: "balloon-inner",
          style: z({ flexDirection: u.value })
        }, [
          k("div", {
            class: "balloon-box-wrapper",
            style: z(y.value)
          }, [
            ne(te, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: L(() => [
                we(r).content ? V(h.$slots, "content", { key: 0 }) : (p(), E(P, { key: 1 }, [
                  be(oe(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          k("div", Qt, [
            k("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: z({ transform: f.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : q("", !0)
    ]));
  }
}), en = /* @__PURE__ */ H({
  __name: "BaseDropdown",
  props: {
    matchTriggerWidth: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = A(!1), l = A(null), o = A(null), r = A(null), s = () => {
      const v = o.value, u = r.value;
      if (!v || !u) return;
      const f = v.getBoundingClientRect(), y = window.innerHeight, w = u.offsetHeight;
      let b = f.bottom + window.scrollY;
      const C = f.left + window.scrollX;
      f.bottom + w > y && (b = f.top + window.scrollY - w), l.value = {
        top: b,
        left: C,
        width: t.matchTriggerWidth ? f.width : void 0
      };
    };
    ue(n, async (v) => {
      v && (await xt(), s());
    });
    const a = () => {
      n.value && s();
    }, c = (v) => {
      if (!n.value) return;
      const u = v.target;
      o.value?.contains(u) || r.value?.contains(u) || (n.value = !1);
    };
    de(() => {
      window.addEventListener("resize", a), window.addEventListener("scroll", a), document.addEventListener("click", c);
    }), fe(() => {
      window.removeEventListener("resize", a), window.removeEventListener("scroll", a), document.removeEventListener("click", c);
    });
    const d = () => {
      n.value = !n.value;
    };
    return (v, u) => (p(), E(P, null, [
      k("div", {
        ref_key: "triggerRef",
        ref: o,
        style: { display: "inline-block" },
        onClick: je(d, ["stop"])
      }, [
        V(v.$slots, "trigger")
      ], 512),
      (p(), F(Et, { to: "body" }, [
        n.value ? (p(), E("div", {
          key: 0,
          ref_key: "dropdownRef",
          ref: r,
          style: z({
            position: "absolute",
            top: (l.value?.top ?? 0) + "px",
            left: (l.value?.left ?? 0) + "px",
            width: e.matchTriggerWidth ? (l.value?.width ?? "auto") + "px" : "auto"
          })
        }, [
          V(v.$slots, "items")
        ], 4)) : q("", !0)
      ]))
    ], 64));
  }
}), tn = [10, 12, 14, 16, 24], nn = [
  { style: "Regular", size: 12 },
  { style: "Bold", size: 12 },
  { style: "Regular", size: 24 }
], on = {
  BoldItalic: ["BoldItalic", "Bold", "Italic", "Regular"],
  Bold: ["Bold", "Regular"],
  Italic: ["Italic", "Regular"],
  Regular: ["Regular"]
};
function st(e) {
  return nn.filter((t) => t.style === e).map((t) => t.size);
}
function ln(e, t) {
  const n = on[e] ?? ["Regular"];
  for (const l of n)
    if (st(l).includes(t))
      return { style: l, size: t };
  for (const l of n) {
    const o = st(l);
    if (o.length > 0)
      return { style: l, size: St(t, o) };
  }
  return { style: "Regular", size: t };
}
function kt(e) {
  const { style: t, size: n } = e.shorthand ? rn(e.shorthand) : {
    style: an(e.isBold, e.isItalic),
    size: St(e.fontSize ?? 12, tn)
  }, { style: l, size: o } = ln(t, n), r = {
    fontFamily: `${l}${o}, Arial, sans`,
    fontSize: `${o * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (r.textShadow = `2px 2px 0 ${e.fontShadowColor}`), r;
}
function an(e, t) {
  return e && t ? "BoldItalic" : e ? "Bold" : t ? "Italic" : "Regular";
}
function rn(e) {
  const t = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!t)
    throw new Error(`Invalid shorthand format: ${e}`);
  const n = t[1], l = parseInt(t[2], 10);
  return { style: n, size: l };
}
function St(e, t) {
  if (t.length === 0)
    throw new Error("Array cannot be empty");
  return t.reduce((n, l) => {
    const o = Math.abs(l - e), r = Math.abs(n - e);
    return o < r ? l : n;
  });
}
function ee(e) {
  if (e instanceof Text)
    return e.nodeValue ?? "";
  if (!(e instanceof Element || e instanceof DocumentFragment))
    return Array.from(e.childNodes).map(ee).join("");
  if (e instanceof Element) {
    const t = e.getAttribute("data-win55-emoji");
    if (t)
      return t;
    if (e.tagName === "BR")
      return `
`;
  }
  return Array.from(e.childNodes).map(ee).join("");
}
function ve(e) {
  const t = window.getSelection();
  if (!t || t.rangeCount === 0 || !t.isCollapsed)
    return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.startContainer))
    return null;
  const l = document.createRange();
  return l.selectNodeContents(e), l.setEnd(n.startContainer, n.startOffset), ee(l.cloneContents()).length;
}
function Bt(e, t) {
  if (e instanceof Text) {
    const o = e.nodeValue?.length ?? 0;
    return t <= o ? { node: e, offset: t, remaining: 0 } : { node: e, offset: o, remaining: t - o };
  }
  if (e instanceof Element) {
    const o = e.getAttribute("data-win55-emoji");
    if (o)
      return t <= 0 ? { node: e.parentNode ?? e, offset: Pe(e), remaining: 0 } : t <= o.length ? { node: e.parentNode ?? e, offset: Pe(e) + 1, remaining: 0 } : {
        node: e.parentNode ?? e,
        offset: Pe(e) + 1,
        remaining: t - o.length
      };
  }
  let n = t, l = {
    offset: e.childNodes.length,
    remaining: n
  };
  for (const o of Array.from(e.childNodes)) {
    const r = Bt(o, n);
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
function Pe(e) {
  return e.parentNode ? Array.prototype.indexOf.call(e.parentNode.childNodes, e) : 0;
}
function Te(e, t, n = !1) {
  if (t === null || !e.isConnected)
    return;
  const l = Bt(e, t);
  if (!l)
    return;
  const o = document.createRange(), r = window.getSelection();
  n && e.focus({ preventScroll: !0 }), o.setStart(l.node, l.offset), o.collapse(!0), r?.removeAllRanges(), r?.addRange(o);
}
const Tt = "/win-55-ui/emoji", He = `${Tt}/emoji-registry.csv`;
let Re = null, Ue = null, Ae = null;
function sn(e) {
  return e.replace(/\/$/, "");
}
function Rt(e) {
  return e.trim().replace(/\.gif$/i, "");
}
function cn(e) {
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
    const a = r.slice(0, s).trim(), c = Rt(r.slice(s + 1));
    a && c && (t[a] = c);
  }
  return t;
}
async function he(e = {}) {
  const t = e.registryUrl ?? He;
  return Ae && t === He ? Ae : ((!Re || Ue !== t) && (Ue = t, Re = fetch(t).then((n) => {
    if (!n.ok)
      throw new Error(
        `Could not load emoji registry from ${t}: ${n.status} ${n.statusText}`
      );
    return n.text();
  }).then(cn).then((n) => (t === He && (Ae = n), n))), Re);
}
function So() {
  Re = null, Ue = null, Ae = null;
}
async function Bo(e, t = {}) {
  const l = (await he(t))[e];
  return l ? xe(l, t) : null;
}
function xe(e, t = {}) {
  return `${sn(t.basePath ?? Tt)}/${Rt(e)}.gif`;
}
async function To(e = {}) {
  return he(e);
}
async function Ro(e, t = {}) {
  const n = await he(t);
  return e in n;
}
he();
function un(e) {
  return e.map((t) => {
    const n = parseInt(t.replace(/^#/, ""), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  });
}
function dn(e, t, n, l) {
  let o = 1 / 0, r = [0, 0, 0];
  for (const s of l) {
    const a = e - s[0], c = t - s[1], d = n - s[2], v = a * a + c * c + d * d;
    v < o && (o = v, r = s);
  }
  return r;
}
const fn = "win55-emoji", hn = "win55-emoji-image", G = 15, Xe = 2, gn = [
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
], mn = un(gn), ct = [
  "[\\u{1F1E6}-\\u{1F1FF}]{2}",
  "[0-9#*]\\uFE0F?\\u20E3",
  "\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?)*",
  "\\p{Emoji_Presentation}"
].join("|"), pn = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION"
]), ce = /* @__PURE__ */ new WeakMap(), ut = /* @__PURE__ */ new WeakMap(), dt = /* @__PURE__ */ new Map();
function vn(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function yn(e) {
  const t = ut.get(e);
  if (t)
    return t;
  const n = Object.keys(e).sort((r, s) => s.length - r.length).map(vn), l = n.length > 0 ? `${n.join("|")}|${ct}` : ct, o = new RegExp(l, "gu");
  return ut.set(e, o), o;
}
function At(e) {
  return e.value === !1 ? null : typeof e.value == "object" ? e.value : {};
}
function wn(e) {
  return pn.has(e.tagName) || e.hasAttribute("data-win55-emoji");
}
function jt(e) {
  let t = e.parentElement;
  for (; t; ) {
    const n = ce.get(t);
    if (n && At(n.binding))
      return !0;
    t = t.parentElement;
  }
  return !1;
}
function bn(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, {
    acceptNode(l) {
      const o = l.parentElement;
      return !o || wn(o) || !l.nodeValue?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  for (; n.nextNode(); )
    t.push(n.currentNode);
  return t;
}
function xn() {
  return `${G * Xe}px`;
}
function En(e, t, n, l, o) {
  const r = Math.min(1, Math.max(0, o)), s = e.getImageData(0, 0, t, n), a = s.data;
  for (let c = 0; c < a.length; c += 4) {
    const d = a[c], v = a[c + 1], u = a[c + 2];
    if (a[c + 3] < 80)
      a[c] = 0, a[c + 1] = 0, a[c + 2] = 0, a[c + 3] = 0;
    else {
      const [y, w, b] = dn(
        d,
        v,
        u,
        l
      ), C = Math.round(d + (y - d) * r), S = Math.round(v + (w - v) * r), B = Math.round(u + (b - u) * r);
      a[c] = C, a[c + 1] = S, a[c + 2] = B, a[c + 3] = 255;
    }
  }
  e.putImageData(s, 0, 0);
}
function Cn(e, t, n) {
  const l = e.getImageData(0, 0, t, n), o = new Uint8ClampedArray(l.data), r = l.data, s = (a, c) => (c * t + a) * 4;
  for (let a = 0; a < n; a++)
    for (let c = 0; c < t; c++) {
      const d = s(c, a), u = [
        c > 0 ? s(c - 1, a) : -1,
        c < t - 1 ? s(c + 1, a) : -1,
        a > 0 ? s(c, a - 1) : -1,
        a < n - 1 ? s(c, a + 1) : -1
      ].filter((f) => f !== -1).filter((f) => o[f + 3] > 127);
      if (o[d + 3] > 127 && u.length <= 1)
        r[d] = r[d + 1] = r[d + 2] = r[d + 3] = 0;
      else if (o[d + 3] === 0 && u.length >= 3) {
        const f = u[0];
        r[d] = o[f], r[d + 1] = o[f + 1], r[d + 2] = o[f + 2], r[d + 3] = 255;
      }
    }
  e.putImageData(l, 0, 0);
}
function kn(e) {
  const t = dt.get(e);
  if (t)
    return t;
  const n = Sn(e);
  return dt.set(e, n), n;
}
function Sn(e) {
  const t = document.createElement("canvas");
  t.width = G, t.height = G;
  const n = t.getContext("2d");
  if (!n)
    return "";
  const l = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif', o = G * 4;
  n.textBaseline = "alphabetic", n.font = `${o}px ${l}`;
  const r = n.measureText(e), s = r.actualBoundingBoxLeft + r.actualBoundingBoxRight, a = r.actualBoundingBoxAscent + r.actualBoundingBoxDescent;
  if (s > 0 && a > 0) {
    const c = o * Math.min(G / s, G / a);
    n.font = `${c}px ${l}`;
    const d = n.measureText(e), v = d.actualBoundingBoxLeft + d.actualBoundingBoxRight, u = d.actualBoundingBoxAscent + d.actualBoundingBoxDescent, f = (G - v) / 2 + d.actualBoundingBoxLeft, y = (G - u) / 2 + d.actualBoundingBoxAscent;
    n.fillText(e, f, y - 0.5), En(n, G, G, mn, 0.1), Cn(n, G, G), Fn(t);
  }
  return t.toDataURL("image/png");
}
function Bn(e, t, n) {
  const l = document.createElement("span"), o = document.createElement("img");
  return l.className = n.className ?? fn, l.contentEditable = "false", l.dataset.win55Emoji = e, l.role = "img", l.ariaLabel = e, l.style.setProperty("--win55-emoji-size", xn()), o.src = t, o.alt = e, o.className = hn, o.draggable = !1, o.dataset.win55EmojiImg = "true", o.addEventListener("load", () => {
    const r = o.naturalWidth * Xe, s = o.naturalHeight * Xe;
    l.style.width = `${r}px`, l.style.height = `${s}px`, o.style.width = `${r}px`, o.style.height = `${s}px`;
  }, { once: !0 }), l.append(o), l;
}
function Tn(e, t, n, l) {
  const o = e.parentElement;
  if (!o)
    return;
  const r = window.getSelection(), s = r && r.rangeCount > 0 && r.isCollapsed ? r.getRangeAt(0) : null, a = s?.startContainer === e, c = !!(s && s.startContainer === o && s.startOffset === Array.prototype.indexOf.call(o.childNodes, e) + 1), d = a || c, v = c ? e.nodeValue?.length ?? 0 : a ? s?.startOffset ?? null : null, u = e.nodeValue ?? "";
  let f = 0, y = !1;
  const w = document.createDocumentFragment();
  let b = null, C = 0;
  const S = (B, D) => {
    b || (b = B, C = D);
  };
  t.lastIndex = 0;
  for (const B of u.matchAll(t)) {
    const D = B[0], M = B.index, _ = n[D];
    if (M === void 0)
      continue;
    if (y = !0, M > f) {
      const $ = document.createTextNode(u.slice(f, M));
      v !== null && v >= f && v <= M && S($, v - f), w.append($);
    }
    const h = _ ? xe(_, l) : kn(D);
    if (!h)
      continue;
    const T = Bn(D, h, l);
    w.append(T), v !== null && v > M && v <= M + D.length && S(o, Array.prototype.indexOf.call(o.childNodes, e) + w.childNodes.length), f = M + D.length;
  }
  if (y) {
    if (f < u.length) {
      const B = document.createTextNode(u.slice(f));
      v !== null && v >= f && S(B, v - f), w.append(B);
    } else v !== null && v >= f && S(o, Array.prototype.indexOf.call(o.childNodes, e) + w.childNodes.length);
    if (e.replaceWith(w), d && b) {
      const B = document.createRange();
      B.setStart(b, C), B.collapse(!0), r?.removeAllRanges(), r?.addRange(B);
    }
  }
}
function It(e, t, n) {
  const l = yn(t);
  if (l)
    for (const o of bn(e))
      Tn(o, l, t, n);
}
const Ve = /* @__PURE__ */ new WeakMap();
async function We(e, t = {}) {
  const n = (Ve.get(e) ?? 0) + 1;
  Ve.set(e, n);
  const l = await he(t);
  Ve.get(e) !== n || !e.isConnected || It(e, l, t);
}
async function Rn(e, t) {
  const n = At(t.binding);
  if (!n)
    return;
  t.version += 1;
  const l = t.version, o = await he(n);
  ce.get(e)?.version !== l || !e.isConnected || jt(e) || It(e, o, n);
}
function Ge(e, t) {
  t.renderQueued || (t.renderQueued = !0, t.renderFrame = window.requestAnimationFrame(() => {
    t.renderQueued = !1, t.renderFrame = null, Rn(e, t).catch((n) => {
      console.warn("[win-55-ui] Could not render custom emoji.", n);
    });
  }));
}
function An(e, t) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !t.clipboardData || jt(e))
    return;
  const l = n.getRangeAt(0);
  if (!l.intersectsNode(e))
    return;
  const o = l.cloneContents(), r = ee(o);
  r && (t.clipboardData.setData("text/plain", r), t.preventDefault());
}
function jn(e, t) {
  const n = new MutationObserver(() => {
    Ge(e, t);
  });
  return n.observe(e, {
    characterData: !0,
    childList: !0,
    subtree: !0
  }), n;
}
const In = {
  mounted(e, t) {
    const n = {
      binding: t,
      copyHandler: (l) => An(e, l),
      observer: null,
      renderFrame: null,
      renderQueued: !1,
      version: 0
    };
    n.observer = jn(e, n), ce.set(e, n), e.addEventListener("copy", n.copyHandler), Ge(e, n);
  },
  updated(e, t) {
    const n = ce.get(e);
    n && (n.binding = t, Ge(e, n));
  },
  unmounted(e) {
    const t = ce.get(e);
    t && (t.observer?.disconnect(), t.renderFrame !== null && window.cancelAnimationFrame(t.renderFrame), e.removeEventListener("copy", t.copyHandler)), ce.delete(e);
  }
};
function Fn(e) {
  const t = e.getContext("2d");
  if (!t) {
    console.warn("Unable to get 2D context from canvas");
    return;
  }
  const n = e.width, l = e.height, o = t.getImageData(0, 0, n, l), r = o.data, s = (u, f) => u < 0 || f < 0 || u >= n || f >= l ? 0 : r[(f * n + u) * 4 + 3], a = Array.from({ length: l }, () => Array(n).fill(!1)), c = [];
  for (let u = 0; u < n; u++)
    s(u, 0) === 0 && !a[0][u] && (a[0][u] = !0, c.push({ x: u, y: 0 })), s(u, l - 1) === 0 && !a[l - 1][u] && (a[l - 1][u] = !0, c.push({ x: u, y: l - 1 }));
  for (let u = 0; u < l; u++)
    s(0, u) === 0 && !a[u][0] && (a[u][0] = !0, c.push({ x: 0, y: u })), s(n - 1, u) === 0 && !a[u][n - 1] && (a[u][n - 1] = !0, c.push({ x: n - 1, y: u }));
  const d = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  for (; c.length; ) {
    const { x: u, y: f } = c.shift();
    for (const [y, w] of d) {
      const b = u + y, C = f + w;
      b >= 0 && b < n && C >= 0 && C < l && !a[C][b] && s(b, C) === 0 && (a[C][b] = !0, c.push({ x: b, y: C }));
    }
  }
  const v = Array.from({ length: l }, () => Array(n).fill(!1));
  for (let u = 0; u < l; u++)
    for (let f = 0; f < n; f++) {
      if (s(f, u) === 0) continue;
      let y = !1;
      for (const [w, b] of d) {
        const C = f + w, S = u + b;
        if (C < 0 || S < 0 || C >= n || S >= l) {
          y = !0;
          break;
        }
        if (s(C, S) === 0 && a[S][C]) {
          y = !0;
          break;
        }
      }
      y && (v[u][f] = !0);
    }
  for (let u = 0; u < l; u++)
    for (let f = 0; f < n; f++)
      if (v[u][f]) {
        const y = (u * n + f) * 4;
        r[y] = 0, r[y + 1] = 0, r[y + 2] = 0;
      }
  t.putImageData(o, 0, 0);
}
const Ao = In, ft = typeof Intl.Segmenter == "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function Ft(e) {
  return ft ? Array.from(ft.segment(e), (t) => t.segment) : Array.from(e);
}
function ht(e) {
  return Ft(e).length;
}
function Nn(e, t) {
  return Ft(e).slice(0, t).join("");
}
function Ln(e) {
  const t = window.getSelection();
  if (!t || t.rangeCount === 0 || !t.isCollapsed)
    return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.startContainer))
    return null;
  const l = ve(e), o = n.cloneRange();
  o.collapse(!0);
  const r = document.createElement("span");
  r.textContent = "​", o.insertNode(r);
  const s = r.getBoundingClientRect(), a = r.parentNode;
  return r.remove(), a?.normalize(), Te(e, l), s;
}
const gt = "/win-55-ui/emoji/emoji-categories.json";
let _e = null;
async function qe() {
  return _e || (_e = fetch(gt).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${gt}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), _e;
}
async function Mn(e) {
  const t = e.trim().toLowerCase();
  if (!t)
    return [];
  const n = await qe(), l = [], o = /* @__PURE__ */ new Set();
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
async function $n(e) {
  const t = e.trim().toLowerCase();
  if (!t)
    return;
  const l = (await qe()).find((o) => o.shortcodes.some((r) => r.toLowerCase() === t));
  return l ? { emoji: l.emoji, code: l.code } : void 0;
}
const Nt = A(!1);
A({ x: 160, y: 120, width: 360, height: 420 });
const Lt = Ut(null);
function mt(e) {
  Lt.value = e;
}
function zn() {
  Nt.value = !0;
}
let pt = 0;
function Dn(e) {
  const t = e[pt % e.length];
  return pt += 1, t;
}
const On = {
  key: 0,
  class: "baseinput-emoji-wrapper"
}, Pn = ["src"], Hn = { class: "shortcode-suggestions" }, Vn = {
  key: 0,
  class: "shortcode-suggestion-ellipsis"
}, Wn = ["src"], _n = {
  key: 1,
  class: "shortcode-suggestion-ellipsis"
}, Yn = "546", Se = 5, Un = 200, jo = /* @__PURE__ */ H({
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
    ], o = e, r = n, s = A(null), a = j(() => s.value?.el ?? null);
    de(() => {
      a.value && o.modelValue && (a.value.innerText = o.modelValue);
    }), ue(() => o.modelValue, (i) => {
      if (a.value && ee(a.value) !== i) {
        const g = document.activeElement === a.value, m = g ? ve(a.value) : null;
        a.value.innerText = i ?? "", g && Te(a.value, m);
      }
    });
    const c = () => {
      if (!a.value) return;
      let i = ee(a.value);
      if (o.multiline || (i = i.replace(/\n/g, "")), o.maxLength && ht(i) > o.maxLength) {
        i = Nn(i, o.maxLength), a.value.innerText = i;
        const g = document.createRange(), m = window.getSelection();
        g.selectNodeContents(a.value), g.collapse(!1), m?.removeAllRanges(), m?.addRange(g);
      }
      $t(), r("update:modelValue", i), Le();
    }, d = /:([A-Za-z0-9_+-]*)$/, v = /:([A-Za-z0-9_+-]{2,}):$/, u = A(!1), f = A(null), y = A([]), w = A(0), b = A(null);
    let C = 0;
    const S = A(0);
    function B(i) {
      i < S.value ? S.value = i : i > S.value + Se - 1 && (S.value = i - Se + 1);
    }
    const D = j(() => {
      const i = S.value;
      return y.value.slice(i, i + Se).map((g, m) => ({ match: g, index: i + m }));
    }), M = j(() => S.value > 0), _ = j(() => S.value + Se < y.value.length), h = () => {
      u.value = !1, f.value = null, y.value = [], w.value = 0, S.value = 0;
    }, T = (i, g) => {
      if (!a.value) return;
      const m = window.getSelection();
      if (!m || m.rangeCount === 0 || !m.isCollapsed) return;
      const x = m.getRangeAt(0), N = x.startContainer;
      if (!(N instanceof Text) || !a.value.contains(N)) return;
      const O = x.startOffset, X = O - i;
      if (X < 0) return;
      const K = N.nodeValue ?? "";
      Ce(), N.nodeValue = K.slice(0, X) + g + K.slice(O), ie(N, X + g.length), re(), c(), We(a.value);
    }, $ = () => {
      const i = y.value[w.value];
      !i || f.value === null || (T(1 + f.value.length, i.emoji), h());
    }, J = A(null), I = { insertEmoji: (i) => {
      if (!a.value) return;
      const x = (document.activeElement === a.value ? ve(a.value) : null) ?? J.value ?? ht(ee(a.value));
      Te(a.value, x, !0);
      const N = window.getSelection();
      if (!N || N.rangeCount === 0 || !N.isCollapsed) return;
      const O = N.getRangeAt(0);
      Ce(), O.deleteContents();
      const X = document.createTextNode(i);
      O.insertNode(X), ie(X, X.length), re(), c(), We(a.value);
    } }, Y = A(!1), U = j(() => Nt.value && Lt.value === I), W = j(() => o.showEmojiButton && (Y.value || U.value)), Q = A(l[0]), Fe = j(() => U.value ? Yn : Q.value), Ne = () => {
      Q.value = Dn(l);
    };
    ue(W, (i) => {
      i && Ne();
    });
    const Ee = () => {
      Y.value = !0, mt(I);
    }, le = () => {
      mt(I), zn();
    }, Le = async () => {
      if (!a.value) {
        h();
        return;
      }
      const i = window.getSelection();
      if (!i || i.rangeCount === 0 || !i.isCollapsed) {
        h();
        return;
      }
      const g = i.getRangeAt(0), m = g.startContainer;
      if (!(m instanceof Text) || !a.value.contains(m)) {
        h();
        return;
      }
      const x = (m.nodeValue ?? "").slice(0, g.startOffset), N = u.value ? f.value : null, O = v.exec(x);
      if (O) {
        if (N === O[1]) {
          const it = await $n(O[1]);
          it && T(O[0].length, it.emoji);
        }
        h();
        return;
      }
      const K = d.exec(x)?.[1] ?? null;
      if (K === null || K.length < 2) {
        h();
        return;
      }
      const me = Ln(a.value);
      if (!me) {
        h();
        return;
      }
      const at = ++C, rt = await Mn(K);
      if (at !== C || rt.length === 0) {
        at === C && h();
        return;
      }
      f.value = K, y.value = rt, w.value = 0, S.value = 0, b.value = { top: me.top, bottom: me.bottom, left: me.left, right: me.right }, u.value = !0;
    }, Me = [], $e = [];
    let ge = null, ae = null;
    const ze = () => a.value ? { html: a.value.innerHTML, caret: ve(a.value) } : null, Je = (i) => {
      a.value && (a.value.innerHTML = i.html, Te(a.value, i.caret, !0), c());
    }, Ce = () => {
      ge || (ge = ze()), $e.length = 0;
    }, re = () => {
      ae !== null && (clearTimeout(ae), ae = null), ge && (Me.push(ge), ge = null);
    }, $t = () => {
      ae !== null && clearTimeout(ae), ae = setTimeout(re, Un);
    }, zt = () => {
      re();
      const i = Me.pop();
      if (!i) return;
      const g = ze();
      g && $e.push(g), Je(i);
    }, Dt = () => {
      const i = $e.pop();
      if (!i) return;
      const g = ze();
      g && Me.push(g), Je(i);
    }, ie = (i, g) => {
      const m = document.createRange(), x = window.getSelection();
      a.value?.focus({ preventScroll: !0 }), m.setStart(i, g), m.collapse(!0), x?.removeAllRanges(), x?.addRange(m);
    }, Ot = (i) => i instanceof Text ? i.nodeValue?.length ?? 0 : i.childNodes.length, se = (i) => i.parentNode ? Array.prototype.indexOf.call(i.parentNode.childNodes, i) : 0, De = (i, g) => i instanceof Text ? g > 0 ? null : i.previousSibling ?? (i.parentNode && i.parentNode !== a.value ? De(i.parentNode, se(i.parentNode)) : null) : i.childNodes[g - 1] ?? (i.parentNode && i !== a.value ? De(i.parentNode, se(i)) : null), Oe = (i, g) => i instanceof Text ? g < (i.nodeValue?.length ?? 0) ? null : i.nextSibling ?? (i.parentNode && i.parentNode !== a.value ? Oe(i.parentNode, se(i.parentNode) + 1) : null) : i.childNodes[g] ?? (i.parentNode && i !== a.value ? Oe(i.parentNode, se(i) + 1) : null), Pt = (i, g) => {
      let m = i;
      for (; m; ) {
        if (m instanceof HTMLElement && m.hasAttribute("data-win55-emoji"))
          return m;
        if (m instanceof Text) {
          if ((m.nodeValue ?? "").length > 0)
            return null;
          m = g === "backward" ? m.previousSibling : m.nextSibling;
          continue;
        }
        if (m.childNodes.length > 0) {
          m = g === "backward" ? m.childNodes[m.childNodes.length - 1] : m.childNodes[0];
          continue;
        }
        return null;
      }
      return null;
    }, Ke = (i) => {
      if (i.cloneContents().querySelector?.("[data-win55-emoji]"))
        return !0;
      const m = i.startContainer instanceof Element ? i.startContainer : i.startContainer.parentElement, x = i.endContainer instanceof Element ? i.endContainer : i.endContainer.parentElement;
      return !!(m?.closest("[data-win55-emoji]") || x?.closest("[data-win55-emoji]"));
    }, Qe = (i) => {
      if (!a.value) return;
      const g = i.startContainer, m = i.startOffset;
      i.deleteContents(), g.isConnected && a.value.contains(g) ? ie(g, Math.min(m, Ot(g))) : ie(a.value, a.value.childNodes.length), c();
    }, Ht = (i) => {
      const g = document.createRange();
      return g.setStart(i.startContainer, i.startOffset), g.setEnd(i.endContainer, i.endOffset), g;
    }, Vt = (i) => i instanceof HTMLElement && i.hasAttribute("data-win55-emoji"), Wt = (i, g, m) => {
      if (!a.value || i.collapsed || i.startContainer !== i.endContainer || !(i.startContainer instanceof Text))
        return !1;
      const x = i.startContainer, N = x.nodeValue?.length ?? 0;
      if (i.startOffset !== 0 || i.endOffset !== N)
        return !1;
      const O = g === "backward" ? x.previousSibling : x.nextSibling;
      if (!Vt(O) || !x.parentNode)
        return !1;
      m();
      const X = x.parentNode, K = se(x);
      return x.remove(), ie(X, K), c(), !0;
    }, Ze = (i, g, m, x) => {
      const N = m === "backward" ? De(i, g) : Oe(i, g), O = Pt(N, m);
      if (!O || !O.parentNode)
        return !1;
      x();
      const X = O.parentNode, K = se(O);
      return O.remove(), ie(X, K), c(), !0;
    }, _t = (i, g, m) => {
      if (!a.value || !a.value.contains(i.startContainer))
        return "none";
      const x = Ht(i);
      return x.collapsed ? Ze(
        i.startContainer,
        i.startOffset,
        g,
        m
      ) ? "deleted" : "none" : Ke(x) ? (m(), Qe(x), "deleted") : Wt(x, g, m) ? "deleted" : ee(x.cloneContents()) ? "native" : "none";
    }, Yt = (i, g) => {
      if (!a.value) return !1;
      const m = window.getSelection();
      if (!m || m.rangeCount === 0)
        return !1;
      const x = m.getRangeAt(0);
      return a.value.contains(x.startContainer) ? m.isCollapsed ? Ze(
        x.startContainer,
        x.startOffset,
        i,
        g
      ) : Ke(x) ? (g(), Qe(x), !0) : !1 : !1;
    }, et = (i) => {
      if (u.value) {
        if (i.key === "ArrowDown") {
          i.preventDefault(), w.value = (w.value + 1) % y.value.length, B(w.value);
          return;
        }
        if (i.key === "ArrowUp") {
          i.preventDefault(), w.value = (w.value - 1 + y.value.length) % y.value.length, B(w.value);
          return;
        }
        if (i.key === "Tab" || i.key === " " || i.key === "Enter") {
          i.preventDefault(), $();
          return;
        }
        if (i.key === "Escape") {
          i.preventDefault(), h();
          return;
        }
      }
      !o.multiline && i.key === "Enter" && i.preventDefault(), i.key === "Tab" && i.preventDefault();
    }, tt = (i) => {
      if (!a.value) return;
      if (i.inputType === "historyUndo" || i.inputType === "historyRedo") {
        i.preventDefault(), i.inputType === "historyUndo" ? zt() : Dt();
        return;
      }
      if (Ce(), i.inputType !== "deleteContentBackward" && i.inputType !== "deleteContentForward")
        return;
      if (ee(a.value) === "") {
        i.preventDefault(), a.value.focus({ preventScroll: !0 });
        return;
      }
      const g = i.inputType === "deleteContentBackward" ? "backward" : "forward", m = i.getTargetRanges();
      for (const x of m) {
        const N = _t(
          x,
          g,
          () => i.preventDefault()
        );
        if (N === "deleted") {
          a.value.focus({ preventScroll: !0 });
          return;
        }
        if (N === "native")
          return;
      }
      Yt(g, () => i.preventDefault()) && a.value.focus({ preventScroll: !0 });
    }, nt = (i) => {
      i.preventDefault();
      let g = i.clipboardData?.getData("text/plain") ?? "";
      if (o.multiline || (g = g.replace(/\n/g, " ")), !a.value) return;
      Ce();
      const m = window.getSelection(), x = m?.getRangeAt(0);
      if (x) {
        x.deleteContents();
        const N = document.createTextNode(g);
        x.insertNode(N), x.collapse(!1), m?.removeAllRanges(), m?.addRange(x);
      }
      c(), re(), We(a.value);
    }, ot = () => {
      re(), h(), Y.value = !1, a.value && (J.value = ve(a.value)), a.value && ee(a.value) === "" && (a.value.innerHTML = "");
    }, lt = j(() => ({
      ...o.extraStyles,
      ...kt({ fontColor: "black" }),
      overflow: "auto",
      ...o.showEmojiButton ? { paddingRight: "34px" } : {}
    }));
    return t({ el: a }), (i, g) => (p(), E(P, null, [
      e.showEmojiButton ? (p(), E("div", On, [
        ne(te, {
          ref_key: "boxRef",
          ref: s,
          type: e.boxType,
          contenteditable: !e.disabled,
          "extra-styles": lt.value,
          "data-placeholder": e.placeholder,
          role: "textbox",
          "aria-multiline": e.multiline,
          "aria-disabled": e.disabled,
          onInput: c,
          onKeydown: et,
          onBeforeinput: tt,
          onPaste: nt,
          onFocus: Ee,
          onBlur: ot
        }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"]),
        W.value ? (p(), E("img", {
          key: 0,
          src: we(xe)(Fe.value),
          width: "30",
          height: "30",
          class: "baseinput-emoji-button",
          "data-emoji-picker-trigger": "",
          onMousedown: g[0] || (g[0] = je(() => {
          }, ["prevent"])),
          onClick: je(le, ["stop"])
        }, null, 40, Pn)) : q("", !0)
      ])) : (p(), F(te, {
        key: 1,
        ref_key: "boxRef",
        ref: s,
        type: e.boxType,
        contenteditable: !e.disabled,
        "extra-styles": lt.value,
        "data-placeholder": e.placeholder,
        role: "textbox",
        "aria-multiline": e.multiline,
        "aria-disabled": e.disabled,
        onInput: c,
        onKeydown: et,
        onBeforeinput: tt,
        onPaste: nt,
        onFocus: Ee,
        onBlur: ot
      }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"])),
      u.value && b.value ? (p(), F(Zt, {
        key: 2,
        shown: !0,
        anchor: b.value,
        side: "top"
      }, {
        content: L(() => [
          k("div", Hn, [
            M.value ? (p(), E("div", Vn, "...")) : q("", !0),
            (p(!0), E(P, null, Z(D.value, ({ match: m, index: x }) => (p(), E("div", {
              key: m.shortcode,
              class: Ie(["shortcode-suggestion", { "shortcode-suggestion--selected": x === w.value }])
            }, [
              k("img", {
                src: we(xe)(m.code),
                width: "30",
                height: "30",
                class: "shortcode-suggestion-image"
              }, null, 8, Wn),
              k("span", null, ":" + oe(m.shortcode) + ":", 1)
            ], 2))), 128)),
            _.value ? (p(), E("div", _n, "...")) : q("", !0)
          ])
        ]),
        _: 1
      }, 8, ["anchor"])) : q("", !0)
    ], 64));
  }
}), Ye = /* @__PURE__ */ H({
  __name: "Button",
  props: {
    baseType: { default: "panel-d-1" },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: t }) {
    const n = e, l = t, o = A(!1), r = A(!1), s = j(() => !n.disabled && o.value && r.value), a = j(() => n.disabled), c = (b) => {
      n.disabled || b.button !== 0 || (o.value = !0, r.value = !0);
    }, d = () => {
      n.disabled || (r.value = !0);
    }, v = () => {
      r.value = !1;
    }, u = (b) => {
      n.disabled || b.button !== 0 || (o.value && r.value && l("click"), o.value = !1);
    };
    de(() => {
      window.addEventListener("mouseup", u);
    }), fe(() => {
      window.removeEventListener("mouseup", u);
    });
    const f = j(() => ({
      userSelect: "none",
      width: "fit-content",
      paddingBottom: "4px",
      paddingRight: "4px",
      cursor: a.value ? "not-allowed" : "default",
      ...n.extraStyles
    })), y = j(() => ({
      transform: s.value ? "translate(2px, 2px)" : "translate(0, 0)",
      opacity: a.value ? 0.5 : 1
    })), w = j(() => s.value ? "indent" : n.baseType);
    return (b, C) => (p(), F(te, {
      type: w.value,
      "extra-styles": f.value,
      "extra-class": e.extraClass,
      onMousedown: c,
      onMouseenter: d,
      onMouseleave: v
    }, {
      default: L(() => [
        k("div", {
          style: z(y.value)
        }, [
          V(b.$slots, "default")
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"]));
  }
}), Xn = { style: { display: "flex", "align-items": "center" } }, Gn = ["src", "alt"], qn = ["checked", "disabled", "value"], Io = /* @__PURE__ */ H({
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
    const n = e, l = t, o = () => {
      n.disabled || l("update:modelValue", !n.modelValue);
    };
    return (r, s) => (p(), E("div", {
      class: Ie(["checkbox-container", { disabled: e.disabled }]),
      style: z({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: e.disabled ? 0.5 : 1,
        cursor: e.disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        marginBottom: "2px"
      }),
      onClick: o
    }, [
      k("div", Xn, [
        k("img", {
          draggable: "false",
          src: e.modelValue ? e.checkedIcon : e.uncheckedIcon,
          alt: e.modelValue ? "checked" : "unchecked"
        }, null, 8, Gn)
      ]),
      k("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, qn),
      e.label ? (p(), E("span", {
        key: 0,
        style: z({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, oe(e.label), 5)) : q("", !0)
    ], 6));
  }
}), Fo = /* @__PURE__ */ H({
  __name: "HDivider",
  setup(e) {
    return (t, n) => (p(), F(te, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), No = /* @__PURE__ */ H({
  __name: "MenuDropdown",
  setup(e) {
    return (t, n) => (p(), F(en, null, {
      trigger: L(() => [
        V(t.$slots, "trigger")
      ]),
      items: L(() => [
        ne(te, { type: "panel-d-1" }, {
          default: L(() => [
            V(t.$slots, "items")
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), Jn = { style: { display: "flex", "align-items": "center" } }, Kn = ["src"], Qn = ["src"], Zn = ["checked", "disabled", "value", "name"], Lo = /* @__PURE__ */ H({
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
    const n = e, l = t, o = j(() => n.modelValue === n.value), r = (s) => {
      s.preventDefault(), !n.disabled && (o.value || l("update:modelValue", n.value));
    };
    return (s, a) => (p(), E("div", {
      class: Ie(["radio-container", { disabled: e.disabled }]),
      style: z({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: e.disabled ? 0.5 : 1,
        cursor: e.disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        marginBottom: "2px"
      }),
      onClick: r
    }, [
      k("div", Jn, [
        o.value ? (p(), E("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, Kn)) : (p(), E("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, Qn))
      ]),
      k("input", {
        type: "radio",
        checked: o.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, Zn),
      e.label ? (p(), E("span", {
        key: 0,
        style: z({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, oe(e.label), 5)) : q("", !0)
    ], 6));
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
    fontShadowColor: {}
  },
  setup(e) {
    const t = e, n = j(() => t.element ?? "span"), l = j(() => {
      const o = kt(t);
      return t.element || (o.display = "contents"), o;
    });
    return (o, r) => (p(), F(Xt(n.value), {
      style: z(l.value)
    }, {
      default: L(() => [
        V(o.$slots, "default")
      ]),
      _: 3
    }, 8, ["style"]));
  }
}), eo = { key: 1 }, to = {
  key: 4,
  style: { "text-decoration": "underline" }
}, no = {
  key: 5,
  style: { "text-decoration": "line-through" }
}, oo = ["href"], lo = ["aria-label", "data-win55-emoji"], ao = ["src", "alt"], ro = /* @__PURE__ */ H({
  __name: "RichTextNode",
  props: {
    node: {},
    allowLinks: { type: Boolean, default: !1 }
  },
  setup(e) {
    return (t, n) => {
      const l = Gt("RichTextNode", !0);
      return e.node.type === "text" ? (p(), E(P, { key: 0 }, [
        be(oe(e.node.value), 1)
      ], 64)) : e.node.type === "break" ? (p(), E("br", eo)) : e.node.type === "bold" ? (p(), F(ye, {
        key: 2,
        "is-bold": ""
      }, {
        default: L(() => [
          (p(!0), E(P, null, Z(e.node.children, (o, r) => (p(), F(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks
          }, null, 8, ["node", "allow-links"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "italic" ? (p(), F(ye, {
        key: 3,
        "is-italic": ""
      }, {
        default: L(() => [
          (p(!0), E(P, null, Z(e.node.children, (o, r) => (p(), F(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks
          }, null, 8, ["node", "allow-links"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "underline" ? (p(), E("span", to, [
        (p(!0), E(P, null, Z(e.node.children, (o, r) => (p(), F(l, {
          key: r,
          node: o,
          "allow-links": e.allowLinks
        }, null, 8, ["node", "allow-links"]))), 128))
      ])) : e.node.type === "strike" ? (p(), E("span", no, [
        (p(!0), E(P, null, Z(e.node.children, (o, r) => (p(), F(l, {
          key: r,
          node: o,
          "allow-links": e.allowLinks
        }, null, 8, ["node", "allow-links"]))), 128))
      ])) : e.node.type === "color" ? (p(), F(ye, {
        key: 6,
        "font-color": e.node.value
      }, {
        default: L(() => [
          (p(!0), E(P, null, Z(e.node.children, (o, r) => (p(), F(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks
          }, null, 8, ["node", "allow-links"]))), 128))
        ]),
        _: 1
      }, 8, ["font-color"])) : e.node.type === "size" ? (p(), F(ye, {
        key: 7,
        "font-size": e.node.value
      }, {
        default: L(() => [
          (p(!0), E(P, null, Z(e.node.children, (o, r) => (p(), F(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks
          }, null, 8, ["node", "allow-links"]))), 128))
        ]),
        _: 1
      }, 8, ["font-size"])) : e.node.type === "url" && e.allowLinks ? (p(), E("a", {
        key: 8,
        href: e.node.href,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "richtext-link"
      }, [
        (p(!0), E(P, null, Z(e.node.children, (o, r) => (p(), F(l, {
          key: r,
          node: o,
          "allow-links": e.allowLinks
        }, null, 8, ["node", "allow-links"]))), 128))
      ], 8, oo)) : e.node.type === "url" ? (p(!0), E(P, { key: 9 }, Z(e.node.children, (o, r) => (p(), F(l, {
        key: r,
        node: o,
        "allow-links": e.allowLinks
      }, null, 8, ["node", "allow-links"]))), 128)) : e.node.type === "emoji" ? (p(), E("span", {
        key: 10,
        class: "win55-emoji",
        role: "img",
        "aria-label": e.node.emoji,
        "data-win55-emoji": e.node.emoji,
        style: { "--win55-emoji-size": "30px" }
      }, [
        k("img", {
          class: "win55-emoji-image",
          src: we(xe)(e.node.code),
          alt: e.node.emoji,
          draggable: "false"
        }, null, 8, ao)
      ], 8, lo)) : q("", !0);
    };
  }
}), io = {
  b: "bold",
  i: "italic",
  u: "underline",
  s: "strike",
  strike: "strike",
  color: "color",
  size: "size",
  url: "url"
}, so = /* @__PURE__ */ new Set(["br"]), vt = {
  normal: 12,
  big: 24
};
function Mt(e) {
  return e.map((t) => t.type === "text" ? t.value : t.type === "emoji" ? t.emoji : t.type === "break" ? `
` : Mt(t.children)).join("");
}
function yt(e) {
  switch (e.tagType) {
    case "color":
      return { type: "color", value: e.value ?? "inherit", children: e.children };
    case "size": {
      const t = (e.value ?? "").trim().toLowerCase(), n = vt[t], l = Number.parseInt(e.value ?? "", 10);
      return { type: "size", value: n ?? (Number.isFinite(l) ? l : vt.normal), children: e.children };
    }
    case "url":
      return {
        type: "url",
        href: e.value ?? Mt(e.children).trim(),
        children: e.children
      };
    default:
      return { type: e.tagType, children: e.children };
  }
}
function co(e, t) {
  for (let n = e.length - 1; n >= 0; n--)
    if (e[n].tagType === t) return n;
  return -1;
}
function uo(e, t) {
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
function fo(e, t) {
  const n = [], l = [], o = /\[(\/?)(\w+)(?:=([^\]]*))?\]/g;
  let r = 0, s;
  const a = () => l.length ? l[l.length - 1].children : n, c = (d) => a().push(...uo(d, t));
  for (; s = o.exec(e); ) {
    const [d, v, u, f] = s, y = u.toLowerCase();
    if (so.has(y)) {
      c(e.slice(r, s.index)), r = s.index + d.length, a().push({ type: "break" });
      continue;
    }
    const w = io[y];
    if (!w) continue;
    if (c(e.slice(r, s.index)), r = s.index + d.length, !v) {
      l.push({ tagType: w, value: f, children: [] });
      continue;
    }
    const b = co(l, w);
    if (b === -1) {
      c(d);
      continue;
    }
    for (; l.length > b + 1; ) {
      const S = l.pop();
      l[l.length - 1].children.push(yt(S));
    }
    const C = l.pop();
    a().push(yt(C));
  }
  for (c(e.slice(r)); l.length; ) {
    const d = l.pop();
    (l.length ? l[l.length - 1].children : n).push(...d.children);
  }
  return n;
}
const Mo = /* @__PURE__ */ H({
  __name: "RichText",
  props: {
    allowLinks: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = bt(), l = A(null);
    qe().then((a) => {
      const c = /* @__PURE__ */ new Map();
      for (const d of a)
        for (const v of d.shortcodes)
          c.set(v.toLowerCase(), { emoji: d.emoji, code: d.code });
      l.value = c;
    });
    const o = j(() => {
      const a = l.value;
      return a ? { get: (c) => a.get(c) } : null;
    });
    function r(a) {
      return a.map((c) => typeof c.children == "string" ? c.children : Array.isArray(c.children) ? r(c.children) : "").join("");
    }
    const s = j(() => fo(r(n.default?.() ?? []), o.value));
    return (a, c) => (p(!0), E(P, null, Z(s.value, (d, v) => (p(), F(ro, {
      key: v,
      node: d,
      "allow-links": t.allowLinks
    }, null, 8, ["node", "allow-links"]))), 128));
  }
});
function ho(e, t, n, l, o) {
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
  ], c = wt(l), d = wt(o), v = Math.floor(t / s), u = Math.floor(n / s);
  e.width = Math.floor(t * 2) / 2, e.height = Math.floor(n * 2) / 2;
  for (let f = 0; f < u; f++)
    for (let y = 0; y < v; y++) {
      const w = y * s, b = f * s, C = (y + f) / (v + u - 6), S = (a[f % 8][y % 8] + 0.5) / 64, B = C > S ? 1 : 0, D = Math.round(c.r * (1 - B) + d.r * B), M = Math.round(c.g * (1 - B) + d.g * B), _ = Math.round(c.b * (1 - B) + d.b * B);
      r.fillStyle = `rgb(${D}, ${M}, ${_})`, r.fillRect(w, b, s, s);
    }
}
function wt(e) {
  const t = e.replace("#", ""), n = parseInt(t, 16);
  return {
    r: n >> 16 & 255,
    g: n >> 8 & 255,
    b: n & 255
  };
}
const go = { style: { height: "0", overflow: "visible" } }, mo = { class: "titlebar-content" }, po = { class: "titlebar-image" }, vo = ["src"], yo = { class: "titlebar-text" }, wo = { class: "titlebar-buttons" }, bo = /* @__PURE__ */ H({
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
    const t = e, n = A(null);
    let l = null;
    function o(s, a) {
      const c = t.gradientColorA || "5555ff", d = t.gradientColorB || "0000aa";
      ho(s, s.width, s.height, c, d), a.fillStyle = "#555555", a.fillRect(0, s.height - 2, Math.floor(s.width / 2) * 2, 4);
    }
    function r() {
      const s = n.value;
      if (!s) return;
      const a = s.getContext("2d");
      if (!a) return;
      const c = s.getBoundingClientRect(), d = Math.floor(c.width * 2) / 2, v = Math.floor(c.height * 2) / 2;
      (s.width !== d || s.height !== v) && (s.width = d, s.height = v), o(s, a);
    }
    return ue(() => [t.gradientColorA, t.gradientColorB], () => {
      if (n.value) {
        const s = n.value.getContext("2d");
        s && o(n.value, s);
      }
    }), de(() => {
      r(), n.value && (l = new ResizeObserver(() => {
        r();
      }), l.observe(n.value));
    }), fe(() => {
      l?.disconnect();
    }), (s, a) => (p(), E("div", null, [
      k("div", go, [
        k("canvas", {
          ref_key: "canvasRef",
          ref: n,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      k("div", mo, [
        k("div", po, [
          k("img", {
            src: e.icon ?? "/win-55-ui/icons/program.png"
          }, null, 8, vo)
        ]),
        k("div", yo, [
          ne(ye, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: L(() => [
              be(oe(e.title), 1)
            ]),
            _: 1
          })
        ]),
        k("div", wo, [
          V(s.$slots, "buttons"),
          e.placeholderButtons ? (p(), E(P, { key: 0 }, [
            ne(Ye, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: L(() => [...a[0] || (a[0] = [
                k("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/o.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            ne(Ye, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: L(() => [...a[1] || (a[1] = [
                k("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/_.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            a[3] || (a[3] = k("div", { style: { width: "2px" } }, null, -1)),
            ne(Ye, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: L(() => [...a[2] || (a[2] = [
                k("img", {
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
}), $o = /* @__PURE__ */ H({
  __name: "Tooltip",
  props: {
    text: {},
    offsetX: {},
    offsetY: {}
  },
  setup(e) {
    const t = e, n = A(!1), l = qt({ x: 0, y: 0 });
    let o = null;
    const r = () => {
      o = window.setTimeout(() => {
        n.value = !0;
      }, 400);
    }, s = () => {
      o !== null && (clearTimeout(o), o = null), n.value = !1;
    }, a = (d) => {
      l.x = d.clientX + (t.offsetX ?? 24), l.y = d.clientY + (t.offsetY ?? 24);
    }, c = j(() => ({
      position: "fixed",
      left: `${l.x}px`,
      top: `${l.y}px`,
      pointerEvents: "none",
      // now TS understands it's valid
      whiteSpace: "nowrap",
      zIndex: 1e3
    }));
    return fe(() => {
      o !== null && clearTimeout(o);
    }), (d, v) => (p(), E("span", {
      onMouseenter: r,
      onMouseleave: s,
      onMousemove: a,
      style: { position: "relative", display: "inline-block" }
    }, [
      V(d.$slots, "default"),
      n.value ? (p(), F(te, {
        key: 0,
        style: z(c.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: L(() => [
          be(oe(t.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : q("", !0)
    ], 32));
  }
}), xo = {
  class: "window-container",
  style: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%"
  }
}, Be = 6, zo = /* @__PURE__ */ H({
  __name: "Window",
  props: /* @__PURE__ */ Ct({
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
    const t = e, n = pe(e, "x"), l = pe(e, "y"), o = pe(e, "width"), r = pe(e, "height"), s = t.minWidth ?? 240, a = t.minHeight ?? 40, c = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableHorizontally ?? !1), d = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableVertically ?? !1);
    let v = !1, u = !1, f = "", y = "", w = 0, b = 0, C = 0, S = 0, B = 0, D = 0;
    const M = A("default");
    function _(R) {
      if (t.faux || f) return;
      const I = R.target;
      I.closest(".titlebar-image") || I.closest(".titlebar-buttons") || (v = !0, w = R.clientX, b = R.clientY, B = n.value, D = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", T), window.addEventListener("mouseup", $));
    }
    function h(R) {
      t.faux || f && (!c && !d || (u = !0, y = f, w = R.clientX, b = R.clientY, C = o.value, S = r.value, B = n.value, D = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", T), window.addEventListener("mouseup", $)));
    }
    function T(R) {
      if (t.faux) return;
      const I = R.clientX - w, Y = R.clientY - b;
      if (v && (n.value = B + I, l.value = D + Y), u) {
        const U = y;
        if (c && U.includes("e") && (o.value = Math.max(s, C + I)), d && U.includes("s") && (r.value = Math.max(a, S + Y)), c && U.includes("w")) {
          const W = C - I, Q = Math.max(s, W);
          o.value = Q, n.value = B + (C - Q);
        }
        if (d && U.includes("n")) {
          const W = S - Y, Q = Math.max(a, W);
          r.value = Q, l.value = D + (S - Q);
        }
      }
    }
    function $() {
      v = !1, u = !1, y = "", document.body.style.userSelect = "", window.removeEventListener("mousemove", T), window.removeEventListener("mouseup", $);
    }
    function J(R) {
      if (t.faux) {
        f = "", M.value = "default";
        return;
      }
      if (u) return;
      const I = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableHorizontally ?? !1), Y = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableVertically ?? !1);
      if (!I && !Y) {
        f = "", M.value = "default";
        return;
      }
      const W = R.currentTarget.getBoundingClientRect(), Q = R.clientX - W.left, Fe = W.right - R.clientX, Ne = R.clientY - W.top, Ee = W.bottom - R.clientY;
      let le = "";
      Y && (Ne < Be ? le += "n" : Ee < Be && (le += "s")), I && (Q < Be ? le += "w" : Fe < Be && (le += "e")), f = le;
      const Le = {
        n: "ns-resize",
        s: "ns-resize",
        e: "ew-resize",
        w: "ew-resize",
        ne: "nesw-resize",
        sw: "nesw-resize",
        nw: "nwse-resize",
        se: "nwse-resize"
      };
      M.value = Le[le] ?? "default";
    }
    return ue(() => [t.resizable, t.resizableHorizontally, t.resizableVertically], () => {
      const R = document.querySelector(`[data-v-${Math.random().toString(36).substr(2, 9)}]`);
      if (R) {
        const I = R.getBoundingClientRect(), Y = I.left + I.width / 2, U = I.top + I.height / 2;
        J({
          currentTarget: R,
          clientX: Y,
          clientY: U
        });
      }
    }, { immediate: !0 }), (R, I) => (p(), F(te, {
      "extra-class": e.extraClass,
      "extra-styles": t.faux ? e.extraStyles : {
        position: "absolute",
        left: n.value + "px",
        top: l.value + "px",
        width: o.value + "px",
        height: r.value + "px",
        cursor: M.value,
        ...e.extraStyles
      },
      type: "panel-d-2",
      onMousemove: J,
      onMousedown: h
    }, {
      default: L(() => [
        k("div", xo, [
          k("div", {
            class: "titlebar-wrapper",
            onMousedown: je(_, ["stop"]),
            style: { height: "34px" }
          }, [
            ne(bo, {
              title: e.title,
              icon: e.icon,
              "placeholder-buttons": e.placeholderButtons,
              disabled: e.disabled,
              "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
              "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
            }, {
              buttons: L(() => [
                V(R.$slots, "titlebar-buttons")
              ]),
              _: 3
            }, 8, ["title", "icon", "placeholder-buttons", "disabled", "gradient-color-a", "gradient-color-b"])
          ], 32),
          k("div", {
            class: "inner-container",
            style: z({
              flex: "1",
              overflowX: t.overflowX ?? "auto",
              overflowY: t.overflowY ?? "auto",
              margin: "2px",
              marginTop: "0",
              boxSizing: "border-box"
            })
          }, [
            V(R.$slots, "default")
          ], 4)
        ])
      ]),
      _: 3
    }, 8, ["extra-class", "extra-styles"]));
  }
}), Eo = /* @__PURE__ */ H({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" }
  },
  setup(e) {
    return (t, n) => (p(), F(te, {
      type: "border-groove",
      "extra-styles": { padding: "10px", margin: "10px" }
    }, {
      default: L(() => [
        k("div", {
          class: "label",
          style: z({ backgroundColor: e.backgroundColorHint })
        }, oe(e.label), 5),
        V(t.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }));
  }
}), Co = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [l, o] of t)
    n[l] = o;
  return n;
}, Do = /* @__PURE__ */ Co(Eo, [["__scopeId", "data-v-9a25af1b"]]), Oo = (e, t = 30, n = 48, l = 30) => {
  const o = A(
    Array.from({ length: e }, (c, d) => ({
      sin: Math.sin(0 + d * Math.PI * 2 / e),
      cos: Math.cos(0 + d * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let r, s = 0;
  const a = () => {
    const c = Date.now();
    if (c - s >= 1e3 / t) {
      const d = Array.from({ length: e }, (y, w) => ({
        sin: Math.sin(c / (1e3 + w * 200) + w * Math.PI * 2 / e),
        cos: Math.cos(c / (3e3 + w * 400) + w * Math.PI * 2 / e + Math.PI / 4)
      })), v = d.map((y) => n + y.sin * l), u = e * n, f = v.reduce((y, w) => y + w, 0);
      if (f > 0) {
        const y = u / f, w = d.map((b) => ({
          sin: ((n + b.sin * l) * y - n) / l,
          cos: b.cos
        }));
        o.value = w;
      } else
        o.value = d;
      s = c;
    }
    r = requestAnimationFrame(a);
  };
  return de(() => {
    r = requestAnimationFrame(a);
  }), fe(() => {
    cancelAnimationFrame(r);
  }), { values: o };
};
function Po(e) {
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
  Zt as Balloon,
  en as BaseDropdown,
  jo as BaseInput,
  te as Box,
  Ye as Button,
  Io as Checkbox,
  Fo as HDivider,
  No as MenuDropdown,
  Do as NamedPanel,
  Lo as RadioButton,
  Mo as RichText,
  bo as Titlebar,
  $o as Tooltip,
  ye as Typography,
  zo as Window,
  Ao as customEmojiDirective,
  ho as drawAngledBayerDitherGradient,
  In as emojiDirective,
  Bo as getEmojiGifPath,
  xe as getEmojiGifPathFromCode,
  To as getEmojiRegistry,
  ve as getSelectionOffset,
  ee as getTextWithCustomEmoji,
  Ro as hasEmoji,
  he as loadEmojiRegistry,
  Po as registerGlobalImageErrorHandler,
  So as resetEmojiRegistryCache,
  Te as restoreSelectionOffset,
  kt as typographyStyles,
  Oo as useSineWave
};
