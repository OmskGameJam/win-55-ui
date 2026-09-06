import { defineComponent as H, ref as I, computed as B, openBlock as h, createElementBlock as S, normalizeStyle as W, normalizeClass as Le, renderSlot as Y, useModel as xe, useSlots as vn, watch as ue, nextTick as pt, onMounted as oe, onUnmounted as le, createBlock as F, Teleport as qe, createElementVNode as N, createVNode as K, withCtx as M, unref as D, Fragment as V, createTextVNode as ke, toDisplayString as ne, createCommentVNode as q, mergeModels as yt, withModifiers as Ge, shallowRef as Kn, renderList as J, inject as qn, provide as Jn, watchEffect as ft, withDirectives as Oe, reactive as mt, resolveDynamicComponent as gn, resolveComponent as Zn } from "vue";
const ee = /* @__PURE__ */ H({
  __name: "Box",
  props: {
    type: {},
    extraStyles: {},
    extraClass: {}
  },
  setup(e, { expose: n }) {
    const t = e, l = I(null), o = B(() => ({
      "--img": `url(/win-55-ui/${t.type}.png)`,
      ...t.extraStyles
    }));
    return n({ el: l }), (r, i) => (h(), S("div", {
      ref_key: "rootRef",
      ref: l,
      class: Le(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: W(o.value)
    }, [
      Y(r.$slots, "default")
    ], 6));
  }
}), Qn = { class: "balloon-tip-box" }, eo = {
  key: 1,
  class: "balloon-wrapper"
}, to = { class: "balloon-tip-box" }, _e = 8, no = /* @__PURE__ */ H({
  __name: "Balloon",
  props: /* @__PURE__ */ yt({
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
    const n = xe(e, "shown");
    function t(v) {
      return "top" in v;
    }
    function l(v) {
      return t(v) ? v : { top: v.y, bottom: v.y, left: v.x, right: v.x };
    }
    const o = e, r = vn(), i = B(() => o.side ?? "top"), a = B(() => o.bias), f = I(i.value), d = B(() => o.anchor ? f.value : i.value), u = B(() => {
      const v = {};
      switch (i.value) {
        case "top":
          v.bottom = "100%", v.left = "50%", v.transform = "translateX(-50%)";
          break;
        case "bottom":
          v.top = "100%", v.left = "50%", v.transform = "translateX(-50%)";
          break;
        case "left":
          v.right = "100%", v.top = "50%", v.transform = "translateY(-50%)";
          break;
        case "right":
          v.left = "100%", v.top = "50%", v.transform = "translateY(-50%)";
          break;
      }
      return v;
    }), c = B(() => {
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
    }), m = B(() => {
      let v = "", j = !1;
      switch (d.value) {
        case "top":
          v = "rotate(0deg)", a.value === "right" && (j = !0);
          break;
        case "bottom":
          v = "rotate(180deg)", a.value === "left" && (j = !0);
          break;
        case "left":
          v = "rotate(-90deg)";
          break;
        case "right":
          v = "rotate(90deg)", j = !0;
          break;
      }
      return j ? `${v} scaleX(-1)` : v;
    }), y = B(() => {
      const v = {};
      return a.value ? ((d.value === "top" || d.value === "bottom") && (a.value === "left" && (v.transform = "translateX(calc(-50% + 28px))"), a.value === "right" && (v.transform = "translateX(calc(50% - 28px))")), (d.value === "left" || d.value === "right") && (a.value === "up" && (v.transform = "translateY(calc(-50% + 28px))"), a.value === "down" && (v.transform = "translateY(calc(50% - 28px))")), v) : {};
    }), x = I(null), b = I(null), k = { top: "bottom", bottom: "top", left: "right", right: "left" }, T = {
      top: ["left", "right"],
      bottom: ["left", "right"],
      left: ["top", "bottom"],
      right: ["top", "bottom"]
    };
    function w(v, j, U) {
      const E = (j.left + j.right) / 2, P = (j.top + j.bottom) / 2;
      return v === "top" || v === "bottom" ? {
        top: v === "top" ? j.top - U.height : j.bottom,
        left: E - U.width / 2
      } : {
        left: v === "left" ? j.left - U.width : j.right,
        top: P - U.height / 2
      };
    }
    function R(v, j, U, E) {
      return v.top >= _e && v.left >= _e && v.top + j.height <= E - _e && v.left + j.width <= U - _e;
    }
    function A() {
      const v = x.value;
      if (!o.anchor || !v) return;
      const j = l(o.anchor), U = v.getBoundingClientRect(), E = window.innerWidth, P = window.innerHeight, $ = o.side ?? "top", _ = [
        $,
        k[$],
        ...T[$]
      ].find((X) => R(w(X, j, U), U, E, P)) ?? $;
      f.value = _, b.value = w(_, j, U);
    }
    ue(
      [() => o.anchor, n],
      async ([v, j]) => {
        !v || !j || (await pt(), A());
      },
      { deep: !0, immediate: !0 }
    );
    const L = () => {
      o.anchor && n.value && A();
    };
    return oe(() => {
      window.addEventListener("resize", L), window.addEventListener("scroll", L, !0);
    }), le(() => {
      window.removeEventListener("resize", L), window.removeEventListener("scroll", L, !0);
    }), (v, j) => e.anchor ? (h(), F(qe, {
      key: 0,
      to: "body"
    }, [
      n.value ? (h(), S("div", {
        key: 0,
        ref_key: "anchoredRef",
        ref: x,
        class: "balloon-anchored",
        style: W({
          top: (b.value?.top ?? 0) + "px",
          left: (b.value?.left ?? 0) + "px"
        })
      }, [
        N("div", {
          class: "balloon-inner",
          style: W({ flexDirection: c.value })
        }, [
          N("div", {
            class: "balloon-box-wrapper",
            style: W(y.value)
          }, [
            K(ee, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: M(() => [
                D(r).content ? Y(v.$slots, "content", { key: 0 }) : (h(), S(V, { key: 1 }, [
                  ke(ne(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          N("div", Qn, [
            N("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: W({ transform: m.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : q("", !0)
    ])) : (h(), S("div", eo, [
      Y(v.$slots, "default"),
      n.value ? (h(), S("div", {
        key: 0,
        class: "balloon",
        style: W(u.value)
      }, [
        N("div", {
          class: "balloon-inner",
          style: W({ flexDirection: c.value })
        }, [
          N("div", {
            class: "balloon-box-wrapper",
            style: W(y.value)
          }, [
            K(ee, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: M(() => [
                D(r).content ? Y(v.$slots, "content", { key: 0 }) : (h(), S(V, { key: 1 }, [
                  ke(ne(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          N("div", to, [
            N("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: W({ transform: m.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : q("", !0)
    ]));
  }
}), oo = /* @__PURE__ */ H({
  __name: "BaseDropdown",
  props: /* @__PURE__ */ yt({
    matchTriggerWidth: { type: Boolean, default: !1 }
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const n = e, t = xe(e, "open"), l = I(null), o = I(null), r = I(null), i = () => {
      const u = o.value, c = r.value;
      if (!u || !c) return;
      const m = u.getBoundingClientRect(), y = window.innerHeight, x = c.offsetHeight;
      let b = m.bottom + window.scrollY;
      const k = m.left + window.scrollX;
      m.bottom + x > y && (b = m.top + window.scrollY - x), l.value = {
        top: b,
        left: k,
        width: n.matchTriggerWidth ? m.width : void 0
      };
    };
    ue(t, async (u) => {
      u && (await pt(), i());
    });
    const a = () => {
      t.value && i();
    }, f = (u) => {
      if (!t.value) return;
      const c = u.target;
      o.value?.contains(c) || r.value?.contains(c) || (t.value = !1);
    };
    oe(() => {
      window.addEventListener("resize", a), window.addEventListener("scroll", a), document.addEventListener("click", f);
    }), le(() => {
      window.removeEventListener("resize", a), window.removeEventListener("scroll", a), document.removeEventListener("click", f);
    });
    const d = () => {
      t.value = !t.value;
    };
    return (u, c) => (h(), S(V, null, [
      N("div", {
        ref_key: "triggerRef",
        ref: o,
        style: { display: "inline-block" },
        onClick: Ge(d, ["stop"])
      }, [
        Y(u.$slots, "trigger")
      ], 512),
      (h(), F(qe, { to: "body" }, [
        t.value ? (h(), S("div", {
          key: 0,
          ref_key: "dropdownRef",
          ref: r,
          style: W({
            position: "absolute",
            top: (l.value?.top ?? 0) + "px",
            left: (l.value?.left ?? 0) + "px",
            width: e.matchTriggerWidth ? (l.value?.width ?? "auto") + "px" : "auto"
          })
        }, [
          Y(u.$slots, "items")
        ], 4)) : q("", !0)
      ]))
    ], 64));
  }
}), pn = [
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
], lo = [8, 10, 12, 16, 18, 24], yn = "Standard", ro = {
  BoldItalic: ["BoldItalic", "Bold", "Italic", "Regular"],
  Bold: ["Bold", "Regular"],
  Italic: ["Italic", "Regular"],
  Regular: ["Regular"]
};
function Vt(e, n) {
  return pn.filter((t) => t.fontName === e && t.style === n).map((t) => t.size);
}
function ao(e, n, t) {
  const l = pn.some((r) => r.fontName === e) ? e : yn, o = ro[n] ?? ["Regular"];
  for (const r of o)
    if (Vt(l, r).includes(t))
      return { fontName: l, style: r, size: t };
  for (const r of o) {
    const i = Vt(l, r);
    if (i.length > 0)
      return { fontName: l, style: r, size: xn(t, i) };
  }
  return { fontName: l, style: "Regular", size: t };
}
function wn(e) {
  const { style: n, size: t } = e.shorthand ? so(e.shorthand) : {
    style: io(e.isBold, e.isItalic),
    size: xn(e.fontSize ?? 12, lo)
  }, { fontName: l, style: o, size: r } = ao(e.fontName ?? yn, n, t), i = {
    fontFamily: `${l}-${o}-${r}, ${l}-${o}-${r}-TofuMaker, Arial, sans`,
    fontSize: `${r * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (i.textShadow = `2px 2px 0 ${e.fontShadowColor}`), i;
}
function io(e, n) {
  return e && n ? "BoldItalic" : e ? "Bold" : n ? "Italic" : "Regular";
}
function so(e) {
  const n = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!n)
    throw new Error(`Invalid shorthand format: ${e}`);
  const t = n[1], l = parseInt(n[2], 10);
  return { style: t, size: l };
}
function xn(e, n) {
  if (n.length === 0)
    throw new Error("Array cannot be empty");
  return n.reduce((t, l) => {
    const o = Math.abs(l - e), r = Math.abs(t - e);
    return o < r ? l : t;
  });
}
function te(e) {
  if (e instanceof Text)
    return e.nodeValue ?? "";
  if (!(e instanceof Element || e instanceof DocumentFragment))
    return Array.from(e.childNodes).map(te).join("");
  if (e instanceof Element) {
    const n = e.getAttribute("data-win55-emoji");
    if (n)
      return n;
    if (e.tagName === "BR")
      return `
`;
  }
  return Array.from(e.childNodes).map(te).join("");
}
function Be(e) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !n.isCollapsed)
    return null;
  const t = n.getRangeAt(0);
  if (!e.contains(t.startContainer))
    return null;
  const l = document.createRange();
  return l.selectNodeContents(e), l.setEnd(t.startContainer, t.startOffset), te(l.cloneContents()).length;
}
function bn(e, n) {
  if (e instanceof Text) {
    const o = e.nodeValue?.length ?? 0;
    return n <= o ? { node: e, offset: n, remaining: 0 } : { node: e, offset: o, remaining: n - o };
  }
  if (e instanceof Element) {
    const o = e.getAttribute("data-win55-emoji");
    if (o)
      return n <= 0 ? { node: e.parentNode ?? e, offset: rt(e), remaining: 0 } : n <= o.length ? { node: e.parentNode ?? e, offset: rt(e) + 1, remaining: 0 } : {
        node: e.parentNode ?? e,
        offset: rt(e) + 1,
        remaining: n - o.length
      };
  }
  let t = n, l = {
    offset: e.childNodes.length,
    remaining: t
  };
  for (const o of Array.from(e.childNodes)) {
    const r = bn(o, t);
    if (r && r.remaining === 0)
      return r;
    r && (t = r.remaining, l = r);
  }
  return {
    node: e,
    offset: e.childNodes.length,
    remaining: l.remaining
  };
}
function rt(e) {
  return e.parentNode ? Array.prototype.indexOf.call(e.parentNode.childNodes, e) : 0;
}
function Ue(e, n, t = !1) {
  if (n === null || !e.isConnected)
    return;
  const l = bn(e, n);
  if (!l)
    return;
  const o = document.createRange(), r = window.getSelection();
  t && e.focus({ preventScroll: !0 }), o.setStart(l.node, l.offset), o.collapse(!0), r?.removeAllRanges(), r?.addRange(o);
}
const En = "/win-55-ui/emoji", at = `${En}/emoji-registry.csv`, Ne = [
  "[\\u{1F1E6}-\\u{1F1FF}]{2}",
  "[0-9#*]\\uFE0F?\\u20E3",
  "\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?)*",
  "\\p{Emoji_Presentation}"
].join("|");
let We = null, ht = null, Ye = null;
function co(e) {
  return e.replace(/\/$/, "");
}
function Cn(e) {
  return e.trim().replace(/\.gif$/i, "");
}
function uo(e) {
  const n = {}, t = e.replace(/^\uFEFF/, "").split(/\r?\n/);
  for (const [l, o] of t.entries()) {
    const r = o.trim();
    if (!r || l === 0 && r.toLowerCase() === "emoji,code")
      continue;
    const i = r.indexOf(",");
    if (i === -1) {
      console.warn(`[win-55-ui] Skipping emoji registry row ${l + 1}: missing comma`);
      continue;
    }
    const a = r.slice(0, i).trim(), f = Cn(r.slice(i + 1));
    a && f && (n[a] = f);
  }
  return n;
}
async function ge(e = {}) {
  const n = e.registryUrl ?? at;
  return Ye && n === at ? Ye : ((!We || ht !== n) && (ht = n, We = fetch(n).then((t) => {
    if (!t.ok)
      throw new Error(
        `Could not load emoji registry from ${n}: ${t.status} ${t.statusText}`
      );
    return t.text();
  }).then(uo).then((t) => (n === at && (Ye = t), t))), We);
}
function mr() {
  We = null, ht = null, Ye = null;
}
async function fo(e, n = {}) {
  const l = (await ge(n))[e];
  return l ? se(l, n) : null;
}
function se(e, n = {}) {
  return `${co(n.basePath ?? En)}/${Cn(e)}.gif`;
}
async function hr(e = {}) {
  return ge(e);
}
async function vr(e, n = {}) {
  const t = await ge(n);
  return e in t;
}
ge();
function mo(e) {
  return e.map((n) => {
    const t = parseInt(n.replace(/^#/, ""), 16);
    return [t >> 16 & 255, t >> 8 & 255, t & 255];
  });
}
function ho(e, n, t, l) {
  let o = 1 / 0, r = [0, 0, 0];
  for (const i of l) {
    const a = e - i[0], f = n - i[1], d = t - i[2], u = a * a + f * f + d * d;
    u < o && (o = u, r = i);
  }
  return r;
}
function kn() {
  return typeof navigator < "u" && /firefox/i.test(navigator.userAgent);
}
const vo = "win55-emoji", go = "win55-emoji-image", Q = 15, vt = 2, Ht = kn(), po = [
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
], yo = mo(po), Ut = Ne, wo = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION"
]), be = /* @__PURE__ */ new WeakMap(), Wt = /* @__PURE__ */ new WeakMap(), Yt = /* @__PURE__ */ new Map();
function xo(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function bo(e) {
  const n = Wt.get(e);
  if (n)
    return n;
  const t = Object.keys(e).sort((r, i) => i.length - r.length).map(xo), l = t.length > 0 ? `${t.join("|")}|${Ut}` : Ut, o = new RegExp(l, "gu");
  return Wt.set(e, o), o;
}
function Sn(e) {
  return e.value === !1 ? null : typeof e.value == "object" ? e.value : {};
}
const Eo = "data-win55-richtext";
function Co(e) {
  return wo.has(e.tagName) || e.hasAttribute("data-win55-emoji");
}
function Rn(e) {
  let n = e.parentElement;
  for (; n; ) {
    const t = be.get(n);
    if (t && Sn(t.binding))
      return !0;
    n = n.parentElement;
  }
  return !1;
}
function ko(e, n) {
  const t = [], l = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, {
    acceptNode(o) {
      const r = o.parentElement;
      return !r || Co(r) || n && r.closest(`[${Eo}]`) || !o.nodeValue?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  for (; l.nextNode(); )
    t.push(l.currentNode);
  return t;
}
function So() {
  return `${Q * vt}px`;
}
function Ro(e, n, t, l, o) {
  const r = Math.min(1, Math.max(0, o)), i = e.getImageData(0, 0, n, t), a = i.data;
  for (let f = 0; f < a.length; f += 4) {
    const d = a[f], u = a[f + 1], c = a[f + 2];
    if (a[f + 3] < 80)
      a[f] = 0, a[f + 1] = 0, a[f + 2] = 0, a[f + 3] = 0;
    else {
      const [y, x, b] = ho(
        d,
        u,
        c,
        l
      ), k = Math.round(d + (y - d) * r), T = Math.round(u + (x - u) * r), w = Math.round(c + (b - c) * r);
      a[f] = k, a[f + 1] = T, a[f + 2] = w, a[f + 3] = 255;
    }
  }
  e.putImageData(i, 0, 0);
}
function To(e, n, t) {
  const l = e.getImageData(0, 0, n, t), o = new Uint8ClampedArray(l.data), r = l.data, i = (a, f) => (f * n + a) * 4;
  for (let a = 0; a < t; a++)
    for (let f = 0; f < n; f++) {
      const d = i(f, a), c = [
        f > 0 ? i(f - 1, a) : -1,
        f < n - 1 ? i(f + 1, a) : -1,
        a > 0 ? i(f, a - 1) : -1,
        a < t - 1 ? i(f, a + 1) : -1
      ].filter((m) => m !== -1).filter((m) => o[m + 3] > 127);
      if (o[d + 3] > 127 && c.length <= 1)
        r[d] = r[d + 1] = r[d + 2] = r[d + 3] = 0;
      else if (o[d + 3] === 0 && c.length >= 3) {
        const m = c[0];
        r[d] = o[m], r[d + 1] = o[m + 1], r[d + 2] = o[m + 2], r[d + 3] = 255;
      }
    }
  e.putImageData(l, 0, 0);
}
function wt(e) {
  const n = Yt.get(e);
  if (n)
    return n;
  const t = Bo(e);
  return Yt.set(e, t), t;
}
function Bo(e) {
  const n = document.createElement("canvas");
  n.width = Q, n.height = Q;
  const t = n.getContext("2d");
  if (!t)
    return "";
  const l = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif', o = Q * 4;
  t.textBaseline = "alphabetic", t.font = `${o}px ${l}`;
  const r = t.measureText(e), i = r.actualBoundingBoxLeft + r.actualBoundingBoxRight, a = r.actualBoundingBoxAscent + r.actualBoundingBoxDescent;
  if (i > 0 && a > 0) {
    const f = o * Math.min(Q / i, Q / a);
    t.font = `${f}px ${l}`;
    const d = t.measureText(e), u = d.actualBoundingBoxLeft + d.actualBoundingBoxRight, c = d.actualBoundingBoxAscent + d.actualBoundingBoxDescent, m = (Q - u) / 2 + d.actualBoundingBoxLeft, y = (Q - c) / 2 + d.actualBoundingBoxAscent;
    t.fillText(e, m, y - 0.5), Ro(t, Q, Q, yo, 0.1), To(t, Q, Q), Lo(n);
  }
  return n.toDataURL("image/png");
}
function Io(e, n, t) {
  const l = document.createElement("span"), o = document.createElement("img");
  return l.className = t.className ?? vo, l.contentEditable = "false", l.dataset.win55Emoji = e, l.role = "img", l.ariaLabel = e, l.style.setProperty("--win55-emoji-size", So()), o.src = n, o.alt = e, o.className = go, o.draggable = !1, o.dataset.win55EmojiImg = "true", o.addEventListener("load", () => {
    const r = o.naturalWidth * vt, i = o.naturalHeight * vt;
    l.style.width = `${r}px`, l.style.height = `${i}px`, o.style.width = `${r}px`, o.style.height = `${i}px`;
  }, { once: !0 }), l.append(o), l;
}
function No(e, n, t, l) {
  const o = e.parentElement;
  if (!o)
    return;
  const r = window.getSelection(), i = r && r.rangeCount > 0 && r.isCollapsed ? r.getRangeAt(0) : null, a = i?.startContainer === e, f = !!(i && i.startContainer === o && i.startOffset === Array.prototype.indexOf.call(o.childNodes, e) + 1), d = a || f, u = f ? e.nodeValue?.length ?? 0 : a ? i?.startOffset ?? null : null, c = e.nodeValue ?? "";
  let m = 0, y = !1;
  const x = document.createDocumentFragment();
  let b = null, k = 0;
  const T = (R, A) => {
    b || (b = R, k = A);
  };
  n.lastIndex = 0;
  for (const R of c.matchAll(n)) {
    const A = R[0], L = R.index, v = t[A];
    if (L === void 0)
      continue;
    const j = v ? se(v, l) : wt(A);
    if (!j)
      continue;
    y = !0;
    const U = c.slice(m, L);
    if (Ht || U.length > 0) {
      const P = document.createTextNode(U);
      u !== null && u >= m && u <= L && T(P, u - m), x.append(P);
    } else u !== null && u >= m && u <= L && T(o, Array.prototype.indexOf.call(o.childNodes, e) + x.childNodes.length);
    const E = Io(A, j, l);
    x.append(E), u !== null && u > L && u <= L + A.length && T(o, Array.prototype.indexOf.call(o.childNodes, e) + x.childNodes.length), m = L + A.length;
  }
  if (!y)
    return;
  const w = c.slice(m);
  if (Ht || w.length > 0) {
    const R = document.createTextNode(w);
    u !== null && u >= m && T(R, u - m), x.append(R);
  } else u !== null && u >= m && T(o, Array.prototype.indexOf.call(o.childNodes, e) + x.childNodes.length);
  if (e.replaceWith(x), d && b) {
    const R = document.createRange();
    R.setStart(b, k), R.collapse(!0), r?.removeAllRanges(), r?.addRange(R);
  }
}
function Tn(e, n, t, l) {
  const o = bo(n);
  if (o)
    for (const r of ko(e, l))
      No(r, o, n, t);
}
const it = /* @__PURE__ */ new WeakMap();
async function st(e, n = {}) {
  const t = (it.get(e) ?? 0) + 1;
  it.set(e, t);
  const l = await ge(n);
  it.get(e) !== t || !e.isConnected || Tn(e, l, n, !1);
}
async function jo(e, n) {
  const t = Sn(n.binding);
  if (!t)
    return;
  n.version += 1;
  const l = n.version, o = await ge(t);
  be.get(e)?.version !== l || !e.isConnected || Rn(e) || Tn(e, o, t, !0);
}
function gt(e, n) {
  n.renderQueued || (n.renderQueued = !0, n.renderFrame = window.requestAnimationFrame(() => {
    n.renderQueued = !1, n.renderFrame = null, jo(e, n).catch((t) => {
      console.warn("[win-55-ui] Could not render custom emoji.", t);
    });
  }));
}
function Ao(e, n) {
  const t = window.getSelection();
  if (!t || t.rangeCount === 0 || !n.clipboardData || Rn(e))
    return;
  const l = t.getRangeAt(0);
  if (!l.intersectsNode(e))
    return;
  const o = l.cloneContents(), r = te(o);
  r && (n.clipboardData.setData("text/plain", r), n.preventDefault());
}
function $o(e, n) {
  const t = new MutationObserver(() => {
    gt(e, n);
  });
  return t.observe(e, {
    characterData: !0,
    childList: !0,
    subtree: !0
  }), t;
}
const zo = {
  mounted(e, n) {
    const t = {
      binding: n,
      copyHandler: (l) => Ao(e, l),
      observer: null,
      renderFrame: null,
      renderQueued: !1,
      version: 0
    };
    t.observer = $o(e, t), be.set(e, t), e.addEventListener("copy", t.copyHandler), gt(e, t);
  },
  updated(e, n) {
    const t = be.get(e);
    t && (t.binding = n, gt(e, t));
  },
  unmounted(e) {
    const n = be.get(e);
    n && (n.observer?.disconnect(), n.renderFrame !== null && window.cancelAnimationFrame(n.renderFrame), e.removeEventListener("copy", n.copyHandler)), be.delete(e);
  }
};
function Lo(e) {
  const n = e.getContext("2d");
  if (!n) {
    console.warn("Unable to get 2D context from canvas");
    return;
  }
  const t = e.width, l = e.height, o = n.getImageData(0, 0, t, l), r = o.data, i = (c, m) => c < 0 || m < 0 || c >= t || m >= l ? 0 : r[(m * t + c) * 4 + 3], a = Array.from({ length: l }, () => Array(t).fill(!1)), f = [];
  for (let c = 0; c < t; c++)
    i(c, 0) === 0 && !a[0][c] && (a[0][c] = !0, f.push({ x: c, y: 0 })), i(c, l - 1) === 0 && !a[l - 1][c] && (a[l - 1][c] = !0, f.push({ x: c, y: l - 1 }));
  for (let c = 0; c < l; c++)
    i(0, c) === 0 && !a[c][0] && (a[c][0] = !0, f.push({ x: 0, y: c })), i(t - 1, c) === 0 && !a[c][t - 1] && (a[c][t - 1] = !0, f.push({ x: t - 1, y: c }));
  const d = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  for (; f.length; ) {
    const { x: c, y: m } = f.shift();
    for (const [y, x] of d) {
      const b = c + y, k = m + x;
      b >= 0 && b < t && k >= 0 && k < l && !a[k][b] && i(b, k) === 0 && (a[k][b] = !0, f.push({ x: b, y: k }));
    }
  }
  const u = Array.from({ length: l }, () => Array(t).fill(!1));
  for (let c = 0; c < l; c++)
    for (let m = 0; m < t; m++) {
      if (i(m, c) === 0) continue;
      let y = !1;
      for (const [x, b] of d) {
        const k = m + x, T = c + b;
        if (k < 0 || T < 0 || k >= t || T >= l) {
          y = !0;
          break;
        }
        if (i(k, T) === 0 && a[T][k]) {
          y = !0;
          break;
        }
      }
      y && (u[c][m] = !0);
    }
  for (let c = 0; c < l; c++)
    for (let m = 0; m < t; m++)
      if (u[c][m]) {
        const y = (c * t + m) * 4;
        r[y] = 0, r[y + 1] = 0, r[y + 2] = 0;
      }
  n.putImageData(o, 0, 0);
}
const gr = zo, Xt = typeof Intl.Segmenter == "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function Bn(e) {
  return Xt ? Array.from(Xt.segment(e), (n) => n.segment) : Array.from(e);
}
function Gt(e) {
  return Bn(e).length;
}
function Oo(e, n) {
  return Bn(e).slice(0, n).join("");
}
function Fo(e) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !n.isCollapsed)
    return null;
  const t = n.getRangeAt(0);
  if (!e.contains(t.startContainer))
    return null;
  const l = Be(e), o = t.cloneRange();
  o.collapse(!0);
  const r = document.createElement("span");
  r.textContent = "​", o.insertNode(r);
  const i = r.getBoundingClientRect(), a = r.parentNode;
  return r.remove(), a?.normalize(), Ue(e, l), i;
}
const Kt = "/win-55-ui/emoji/emoji-categories.json";
let ct = null;
async function xt() {
  return ct || (ct = fetch(Kt).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${Kt}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), ct;
}
async function Mo(e) {
  const n = e.trim().toLowerCase();
  if (!n)
    return [];
  const t = await xt(), l = [], o = /* @__PURE__ */ new Set();
  for (const r of t) {
    const i = r.shortcodes.find((a) => a.toLowerCase().startsWith(n));
    i && (l.push({ emoji: r.emoji, code: r.code, shortcode: i }), o.add(r.code));
  }
  for (const r of t) {
    if (o.has(r.code))
      continue;
    const i = r.tags.find((a) => a.toLowerCase().startsWith(n));
    i && (l.push({ emoji: r.emoji, code: r.code, shortcode: r.shortcodes[0] ?? i }), o.add(r.code));
  }
  return l;
}
async function In(e) {
  const n = e.trim().toLowerCase();
  if (!n)
    return;
  const l = (await xt()).find((o) => o.shortcodes.some((r) => r.toLowerCase() === n));
  return l ? { emoji: l.emoji, code: l.code } : void 0;
}
const Ce = I(!1), ce = I({ x: 160, y: 120, width: 360, height: 420 }), bt = Kn(null);
function qt(e) {
  bt.value = e;
}
function Po() {
  Ce.value = !0;
}
function Jt() {
  Ce.value = !1;
}
function _o(e) {
  bt.value?.insertEmoji(e);
}
let Zt = 0;
function Do(e) {
  const n = e[Zt % e.length];
  return Zt += 1, n;
}
const Vo = {
  key: 0,
  class: "baseinput-emoji-wrapper"
}, Ho = ["src"], Uo = { class: "shortcode-suggestions" }, Wo = {
  key: 0,
  class: "shortcode-suggestion-ellipsis"
}, Yo = ["src"], Xo = {
  key: 1,
  class: "shortcode-suggestion-ellipsis"
}, Go = "546", De = 5, Ko = 200, pr = /* @__PURE__ */ H({
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
  setup(e, { expose: n, emit: t }) {
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
    ], o = e, r = t, i = I(null), a = B(() => i.value?.el ?? null);
    oe(() => {
      a.value && o.modelValue && (a.value.innerText = o.modelValue);
    }), ue(() => o.modelValue, (s) => {
      if (a.value && te(a.value) !== s) {
        const g = document.activeElement === a.value, p = g ? Be(a.value) : null;
        a.value.innerText = s ?? "", g && Ue(a.value, p);
      }
    });
    const f = () => {
      if (!a.value) return;
      let s = te(a.value);
      if (o.multiline || (s = s.replace(/\n/g, "")), o.maxLength && Gt(s) > o.maxLength) {
        s = Oo(s, o.maxLength), a.value.innerText = s;
        const g = document.createRange(), p = window.getSelection();
        g.selectNodeContents(a.value), g.collapse(!1), p?.removeAllRanges(), p?.addRange(g);
      }
      Mn(), r("update:modelValue", s), Fn();
    }, d = /:([A-Za-z0-9_+-]*)$/, u = /:([A-Za-z0-9_+-]{2,}):$/, c = I(!1), m = I(null), y = I([]), x = I(0), b = I(null);
    let k = 0;
    const T = I(0);
    function w(s) {
      s < T.value ? T.value = s : s > T.value + De - 1 && (T.value = s - De + 1);
    }
    const R = B(() => {
      const s = T.value;
      return y.value.slice(s, s + De).map((g, p) => ({ match: g, index: s + p }));
    }), A = B(() => T.value > 0), L = B(() => T.value + De < y.value.length), v = () => {
      c.value = !1, m.value = null, y.value = [], x.value = 0, T.value = 0;
    }, j = (s, g) => {
      if (!a.value) return;
      const p = window.getSelection();
      if (!p || p.rangeCount === 0 || !p.isCollapsed) return;
      const C = p.getRangeAt(0), z = C.startContainer;
      if (!(z instanceof Text) || !a.value.contains(z)) return;
      const G = C.startOffset, Z = G - s;
      if (Z < 0) return;
      const ie = z.nodeValue ?? "";
      Pe(), z.nodeValue = ie.slice(0, Z) + g + ie.slice(G), me(z, Z + g.length), ye(), f(), st(a.value);
    }, U = () => {
      const s = y.value[x.value];
      !s || m.value === null || (j(1 + m.value.length, s.emoji), v());
    }, E = I(null), $ = { insertEmoji: (s) => {
      if (!a.value) return;
      const C = (document.activeElement === a.value ? Be(a.value) : null) ?? E.value ?? Gt(te(a.value));
      Ue(a.value, C, !0);
      const z = window.getSelection();
      if (!z || z.rangeCount === 0 || !z.isCollapsed) return;
      const G = z.getRangeAt(0);
      Pe(), G.deleteContents();
      const Z = document.createTextNode(s);
      G.insertNode(Z), me(Z, Z.length), ye(), f(), st(a.value);
    } }, O = I(!1), _ = B(() => Ce.value && bt.value === $), X = B(() => o.showEmojiButton && (O.value || _.value)), re = I(l[0]), de = B(() => _.value ? Go : re.value), ae = () => {
      re.value = Do(l);
    };
    ue(X, (s) => {
      s && ae();
    });
    const Me = () => {
      O.value = !0, qt($);
    }, fe = () => {
      qt($), Po();
    }, Fn = async () => {
      if (!a.value) {
        v();
        return;
      }
      const s = window.getSelection();
      if (!s || s.rangeCount === 0 || !s.isCollapsed) {
        v();
        return;
      }
      const g = s.getRangeAt(0), p = g.startContainer;
      if (!(p instanceof Text) || !a.value.contains(p)) {
        v();
        return;
      }
      const C = (p.nodeValue ?? "").slice(0, g.startOffset), z = c.value ? m.value : null, G = u.exec(C);
      if (G) {
        if (z === G[1]) {
          const Dt = await In(G[1]);
          Dt && j(G[0].length, Dt.emoji);
        }
        v();
        return;
      }
      const ie = d.exec(C)?.[1] ?? null;
      if (ie === null || ie.length < 2) {
        v();
        return;
      }
      const Te = Fo(a.value);
      if (!Te) {
        v();
        return;
      }
      const Pt = ++k, _t = await Mo(ie);
      if (Pt !== k || _t.length === 0) {
        Pt === k && v();
        return;
      }
      m.value = ie, y.value = _t, x.value = 0, T.value = 0, b.value = { top: Te.top, bottom: Te.bottom, left: Te.left, right: Te.right }, c.value = !0;
    }, et = [], tt = [];
    let Re = null, pe = null;
    const nt = () => a.value ? { html: a.value.innerHTML, caret: Be(a.value) } : null, It = (s) => {
      a.value && (a.value.innerHTML = s.html, Ue(a.value, s.caret, !0), f());
    }, Pe = () => {
      Re || (Re = nt()), tt.length = 0;
    }, ye = () => {
      pe !== null && (clearTimeout(pe), pe = null), Re && (et.push(Re), Re = null);
    }, Mn = () => {
      pe !== null && clearTimeout(pe), pe = setTimeout(ye, Ko);
    }, Pn = () => {
      ye();
      const s = et.pop();
      if (!s) return;
      const g = nt();
      g && tt.push(g), It(s);
    }, _n = () => {
      const s = tt.pop();
      if (!s) return;
      const g = nt();
      g && et.push(g), It(s);
    }, me = (s, g) => {
      const p = document.createRange(), C = window.getSelection();
      a.value?.focus({ preventScroll: !0 }), p.setStart(s, g), p.collapse(!0), C?.removeAllRanges(), C?.addRange(p);
    }, Dn = (s) => s instanceof Text ? s.nodeValue?.length ?? 0 : s.childNodes.length, he = (s) => s.parentNode ? Array.prototype.indexOf.call(s.parentNode.childNodes, s) : 0, ot = (s, g) => s instanceof Text ? g > 0 ? null : s.previousSibling ?? (s.parentNode && s.parentNode !== a.value ? ot(s.parentNode, he(s.parentNode)) : null) : s.childNodes[g - 1] ?? (s.parentNode && s !== a.value ? ot(s.parentNode, he(s)) : null), lt = (s, g) => s instanceof Text ? g < (s.nodeValue?.length ?? 0) ? null : s.nextSibling ?? (s.parentNode && s.parentNode !== a.value ? lt(s.parentNode, he(s.parentNode) + 1) : null) : s.childNodes[g] ?? (s.parentNode && s !== a.value ? lt(s.parentNode, he(s) + 1) : null), Vn = (s, g) => {
      let p = s;
      for (; p; ) {
        if (p instanceof HTMLElement && p.hasAttribute("data-win55-emoji"))
          return p;
        if (p instanceof Text) {
          if ((p.nodeValue ?? "").length > 0)
            return null;
          p = g === "backward" ? p.previousSibling : p.nextSibling;
          continue;
        }
        if (p.childNodes.length > 0) {
          p = g === "backward" ? p.childNodes[p.childNodes.length - 1] : p.childNodes[0];
          continue;
        }
        return null;
      }
      return null;
    }, Nt = (s) => {
      if (s.cloneContents().querySelector?.("[data-win55-emoji]"))
        return !0;
      const p = s.startContainer instanceof Element ? s.startContainer : s.startContainer.parentElement, C = s.endContainer instanceof Element ? s.endContainer : s.endContainer.parentElement;
      return !!(p?.closest("[data-win55-emoji]") || C?.closest("[data-win55-emoji]"));
    }, jt = (s) => {
      if (!a.value) return;
      const g = s.startContainer, p = s.startOffset;
      s.deleteContents(), g.isConnected && a.value.contains(g) ? me(g, Math.min(p, Dn(g))) : me(a.value, a.value.childNodes.length), f();
    }, Hn = (s) => {
      const g = document.createRange();
      return g.setStart(s.startContainer, s.startOffset), g.setEnd(s.endContainer, s.endOffset), g;
    }, Un = (s) => s instanceof HTMLElement && s.hasAttribute("data-win55-emoji"), Wn = (s, g, p) => {
      if (!a.value || s.collapsed || s.startContainer !== s.endContainer || !(s.startContainer instanceof Text))
        return !1;
      const C = s.startContainer, z = C.nodeValue?.length ?? 0;
      if (s.startOffset !== 0 || s.endOffset !== z)
        return !1;
      const G = g === "backward" ? C.previousSibling : C.nextSibling;
      if (!Un(G) || !C.parentNode)
        return !1;
      p();
      const Z = C.parentNode, ie = he(C);
      return C.remove(), me(Z, ie), f(), !0;
    }, At = (s, g, p) => {
      const C = p === "backward" ? ot(s, g) : lt(s, g);
      return Vn(C, p);
    }, $t = (s, g, p, C) => {
      const z = At(s, g, p);
      if (!z || !z.parentNode)
        return !1;
      C();
      const G = z.parentNode, Z = he(z);
      return z.remove(), me(G, Z), f(), !0;
    }, Yn = (s, g, p) => {
      if (!a.value || !a.value.contains(s.startContainer))
        return "none";
      const C = Hn(s);
      return C.collapsed ? $t(
        s.startContainer,
        s.startOffset,
        g,
        p
      ) ? "deleted" : "none" : Nt(C) ? (p(), jt(C), "deleted") : Wn(C, g, p) ? "deleted" : te(C.cloneContents()) ? "native" : "none";
    }, Xn = (s, g) => {
      if (!a.value) return !1;
      const p = window.getSelection();
      if (!p || p.rangeCount === 0)
        return !1;
      const C = p.getRangeAt(0);
      return a.value.contains(C.startContainer) ? p.isCollapsed ? $t(
        C.startContainer,
        C.startOffset,
        s,
        g
      ) : Nt(C) ? (g(), jt(C), !0) : !1 : !1;
    }, Gn = (s) => {
      if (!kn() || s.shiftKey || s.ctrlKey || s.metaKey || s.altKey || s.key !== "ArrowLeft" && s.key !== "ArrowRight" || !a.value) return !1;
      const g = window.getSelection();
      if (!g || g.rangeCount === 0 || !g.isCollapsed) return !1;
      const p = g.getRangeAt(0);
      if (!a.value.contains(p.startContainer)) return !1;
      const C = s.key === "ArrowLeft" ? "backward" : "forward", z = At(p.startContainer, p.startOffset, C);
      return !z || !z.parentNode ? !1 : (s.preventDefault(), me(z.parentNode, he(z) + (C === "forward" ? 1 : 0)), !0);
    }, zt = (s) => {
      if (c.value) {
        if (s.key === "ArrowDown") {
          s.preventDefault(), x.value = (x.value + 1) % y.value.length, w(x.value);
          return;
        }
        if (s.key === "ArrowUp") {
          s.preventDefault(), x.value = (x.value - 1 + y.value.length) % y.value.length, w(x.value);
          return;
        }
        if (s.key === "Tab" || s.key === " " || s.key === "Enter") {
          s.preventDefault(), U();
          return;
        }
        if (s.key === "Escape") {
          s.preventDefault(), v();
          return;
        }
      }
      !o.multiline && s.key === "Enter" && s.preventDefault(), s.key === "Tab" && s.preventDefault(), Gn(s);
    }, Lt = (s) => {
      if (!a.value) return;
      if (s.inputType === "historyUndo" || s.inputType === "historyRedo") {
        s.preventDefault(), s.inputType === "historyUndo" ? Pn() : _n();
        return;
      }
      if (Pe(), s.inputType !== "deleteContentBackward" && s.inputType !== "deleteContentForward")
        return;
      if (te(a.value) === "") {
        s.preventDefault(), a.value.focus({ preventScroll: !0 });
        return;
      }
      const g = s.inputType === "deleteContentBackward" ? "backward" : "forward", p = s.getTargetRanges();
      for (const C of p) {
        const z = Yn(
          C,
          g,
          () => s.preventDefault()
        );
        if (z === "deleted") {
          a.value.focus({ preventScroll: !0 });
          return;
        }
        if (z === "native")
          return;
      }
      Xn(g, () => s.preventDefault()) && a.value.focus({ preventScroll: !0 });
    }, Ot = (s) => {
      s.preventDefault();
      let g = s.clipboardData?.getData("text/plain") ?? "";
      if (o.multiline || (g = g.replace(/\n/g, " ")), !a.value) return;
      Pe();
      const p = window.getSelection(), C = p?.getRangeAt(0);
      if (C) {
        C.deleteContents();
        const z = document.createTextNode(g);
        C.insertNode(z), C.collapse(!1), p?.removeAllRanges(), p?.addRange(C);
      }
      f(), ye(), st(a.value);
    }, Ft = () => {
      ye(), v(), O.value = !1, a.value && (E.value = Be(a.value)), a.value && te(a.value) === "" && (a.value.innerHTML = "");
    }, Mt = B(() => ({
      ...o.extraStyles,
      ...wn({ fontColor: "black" }),
      overflow: "auto",
      ...o.showEmojiButton ? { paddingRight: "34px" } : {}
    }));
    return n({ el: a }), (s, g) => (h(), S(V, null, [
      e.showEmojiButton ? (h(), S("div", Vo, [
        K(ee, {
          ref_key: "boxRef",
          ref: i,
          type: e.boxType,
          contenteditable: !e.disabled,
          "extra-styles": Mt.value,
          "data-placeholder": e.placeholder,
          role: "textbox",
          "aria-multiline": e.multiline,
          "aria-disabled": e.disabled,
          onInput: f,
          onKeydown: zt,
          onBeforeinput: Lt,
          onPaste: Ot,
          onFocus: Me,
          onBlur: Ft
        }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"]),
        X.value ? (h(), S("img", {
          key: 0,
          src: D(se)(de.value),
          width: "30",
          height: "30",
          class: "baseinput-emoji-button",
          "data-emoji-picker-trigger": "",
          onMousedown: g[0] || (g[0] = Ge(() => {
          }, ["prevent"])),
          onClick: Ge(fe, ["stop"])
        }, null, 40, Ho)) : q("", !0)
      ])) : (h(), F(ee, {
        key: 1,
        ref_key: "boxRef",
        ref: i,
        type: e.boxType,
        contenteditable: !e.disabled,
        "extra-styles": Mt.value,
        "data-placeholder": e.placeholder,
        role: "textbox",
        "aria-multiline": e.multiline,
        "aria-disabled": e.disabled,
        onInput: f,
        onKeydown: zt,
        onBeforeinput: Lt,
        onPaste: Ot,
        onFocus: Me,
        onBlur: Ft
      }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"])),
      c.value && b.value ? (h(), F(no, {
        key: 2,
        shown: !0,
        anchor: b.value,
        side: "top"
      }, {
        content: M(() => [
          N("div", Uo, [
            A.value ? (h(), S("div", Wo, "...")) : q("", !0),
            (h(!0), S(V, null, J(R.value, ({ match: p, index: C }) => (h(), S("div", {
              key: p.shortcode,
              class: Le(["shortcode-suggestion", { "shortcode-suggestion--selected": C === x.value }])
            }, [
              N("img", {
                src: D(se)(p.code),
                width: "30",
                height: "30",
                class: "shortcode-suggestion-image"
              }, null, 8, Yo),
              N("span", null, ":" + ne(p.shortcode) + ":", 1)
            ], 2))), 128)),
            L.value ? (h(), S("div", Xo, "...")) : q("", !0)
          ])
        ]),
        _: 1
      }, 8, ["anchor"])) : q("", !0)
    ], 64));
  }
}), qo = "/win-55-ui/cursors/manifest.json", Jo = "/win-55-ui/cursors/scheme.json";
let Je = {}, Et = {};
const Se = I(0);
let ut = null;
async function Qt(e) {
  const n = await fetch(e);
  if (!n.ok) throw new Error(`Could not load ${e}: ${n.status} ${n.statusText}`);
  return n.json();
}
function Ze() {
  return ut || (ut = Promise.all([
    Qt(qo),
    Qt(Jo)
  ]).then(([e, n]) => {
    Je = e, Et = n, Se.value++;
  })), ut;
}
async function yr() {
  return await Ze(), Et;
}
const en = 2, Zo = "/win-55-ui/cursors", tn = "windows-default", Qo = {
  default: "default",
  link: "pointer",
  text: "text",
  "vertical-text": "vertical-text",
  move: "move",
  "not-allowed": "not-allowed",
  wait: "wait",
  progress: "progress",
  help: "help",
  crosshair: "crosshair",
  handwriting: "cell",
  "ns-resize": "ns-resize",
  "ew-resize": "ew-resize",
  "nesw-resize": "nesw-resize",
  "nwse-resize": "nwse-resize"
};
function nn(e, n) {
  const t = Et[e]?.roles[n];
  if (!t) return;
  const l = Je[t];
  if (!(!l || l.hotspotX === null || l.hotspotY === null))
    return t;
}
function je(e, n) {
  return Se.value, nn(e, n) ?? (e === tn ? void 0 : nn(tn, n));
}
function Nn(e) {
  return Se.value, Je[e];
}
function Ae(e, n) {
  const t = Qo[n], l = je(e, n), o = l ? Je[l] : void 0;
  return !l || !o ? t : `url("${Zo}/${l}/native.gif") ${o.hotspotX ?? 0} ${o.hotspotY ?? 0}, ${t ?? "default"}`;
}
function Ie(e, n) {
  const t = Ae(e, n);
  return t?.startsWith("url(") || n === "default" ? t : Ae(e, "default") ?? t;
}
function we(e, n) {
  if (!e) return n;
  const t = e.lastIndexOf(",");
  return t === -1 ? e : `${e.slice(0, t)}, ${n}`;
}
const jn = /* @__PURE__ */ Symbol("win55ui:cursor-context"), Fe = "--win55-cursor", Ct = "--win55-scheme", kt = "--win55-cursor-native-link", St = "--win55-cursor-native-text", Rt = "--win55-cursor-native-notallowed", el = "a[href], area[href]", An = 'textarea, [contenteditable]:not([contenteditable="false"]), input:not([type]), input[type="text" i], input[type="search" i], input[type="url" i], input[type="tel" i], input[type="email" i], input[type="password" i], input[type="number" i]', $e = "--win55-cursor-native", ze = [
  $e,
  kt,
  St,
  Rt
], on = ["cursor", Ct, Fe, ...ze], $n = I(!1);
function ln(e) {
  $n.value = e;
}
function tl() {
  return $n.value;
}
function nl(e) {
  Jn(jn, e);
}
function ol() {
  return qn(jn, void 0);
}
const Tt = "__win55CursorContext";
function ll(e, n) {
  e[Tt] = n;
}
function rl(e) {
  delete e[Tt];
}
let Ke;
function al(e) {
  Ke = e;
}
function il(e) {
  Ke === e && (Ke = void 0);
}
function sl(e) {
  let n = e;
  for (; n; ) {
    const t = n[Tt];
    if (t) return t;
    n = n.parentElement;
  }
  return Ke;
}
function Bt(e) {
  e.style.removeProperty("cursor"), e.style.removeProperty(Fe);
  for (const n of ze) e.style.removeProperty(n);
}
function cl(e, n, t) {
  const l = (t?.mode.value ?? "native") === "native";
  if (Bt(e), !n) return;
  if (l) {
    const r = t ? t.resolveRoleCss(n) : Ae("windows-default", n);
    if (!r) return;
    const i = t ? t.nativeBaseCss.value : Ie("windows-default", "default"), a = we(r, i ?? "default");
    e.style.setProperty("cursor", a, "important");
    for (const f of ze) e.style.setProperty(f, a);
    return;
  }
  const o = t ? t.resolveRole(n) : je("windows-default", n);
  o && (e.style.cursor = "none", e.style.setProperty(Fe, o));
}
const ve = /* @__PURE__ */ new WeakMap();
function zn(e) {
  return e.strong ?? e.weak;
}
function ul(e) {
  const n = ve.get(e);
  if (!n) return;
  n.rev.value;
  const t = zn(n);
  if (!t) {
    Bt(e);
    return;
  }
  cl(e, t.role.value, t.context);
}
function dl(e, n, t) {
  Ze();
  let l = ve.get(e);
  if (l || (l = { rev: I(0) }, ve.set(e, l)), l[n]) {
    const r = n === "strong" ? "v-cursor" : "v-cursor-weak";
    throw new Error(
      `[win-55-ui] two ${r} directives on one element. A reusable component must set its own cursor with v-cursor-weak so a consumer's v-cursor overrides it; two of the same strength on one element is unsupported. Element: ${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""}`
    );
  }
  const o = { role: I(t), context: void 0 };
  l[n] = o, l.rev.value++, pt(() => {
    const r = ve.get(e);
    !r || r[n] !== o || (o.context = sl(e), r.stop ? o === zn(r) && r.rev.value++ : r.stop = ft(() => ul(e)));
  });
}
function fl(e, n) {
  const t = ve.get(e);
  if (t) {
    if (t[n] = void 0, !t.strong && !t.weak) {
      t.stop?.(), ve.delete(e), Bt(e);
      return;
    }
    t.rev.value++;
  }
}
function Ln(e) {
  return {
    mounted(n, t) {
      dl(n, e, t.value);
    },
    updated(n, t) {
      if (t.value === t.oldValue) return;
      const l = ve.get(n)?.[e];
      l && (l.role.value = t.value);
    },
    unmounted(n) {
      fl(n, e);
    }
  };
}
const ml = Ln("strong"), Qe = Ln("weak"), Xe = /* @__PURE__ */ H({
  __name: "Button",
  props: {
    baseType: { default: "panel-d-1" },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: n }) {
    const t = Qe, l = e, o = n, r = I(!1), i = I(!1), a = B(() => !l.disabled && r.value && i.value), f = B(() => l.disabled), d = (k) => {
      l.disabled || k.button !== 0 || (r.value = !0, i.value = !0);
    }, u = () => {
      l.disabled || (i.value = !0);
    }, c = () => {
      i.value = !1;
    }, m = (k) => {
      l.disabled || k.button !== 0 || (r.value && i.value && o("click"), r.value = !1);
    };
    oe(() => {
      window.addEventListener("mouseup", m);
    }), le(() => {
      window.removeEventListener("mouseup", m);
    });
    const y = B(() => ({
      userSelect: "none",
      width: "fit-content",
      paddingBottom: "4px",
      paddingRight: "4px",
      ...l.extraStyles
    })), x = B(() => ({
      transform: a.value ? "translate(2px, 2px)" : "translate(0, 0)",
      opacity: f.value ? 0.5 : 1
    })), b = B(() => a.value ? "indent" : l.baseType);
    return (k, T) => Oe((h(), F(ee, {
      type: b.value,
      "extra-styles": y.value,
      "extra-class": e.extraClass,
      onMousedown: d,
      onMouseenter: u,
      onMouseleave: c
    }, {
      default: M(() => [
        N("div", {
          style: W(x.value)
        }, [
          Y(k.$slots, "default")
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"])), [
      [D(t), f.value ? "not-allowed" : "default"]
    ]);
  }
}), hl = { style: { display: "flex", "align-items": "center" } }, vl = ["src", "alt"], gl = ["checked", "disabled", "value"], pl = { key: 0 }, wr = /* @__PURE__ */ H({
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
  setup(e, { emit: n }) {
    const t = Qe, l = e, o = n, r = () => {
      l.disabled || o("update:modelValue", !l.modelValue);
    };
    return (i, a) => Oe((h(), S("div", {
      class: Le(["checkbox-container", { disabled: e.disabled }]),
      style: W({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: e.disabled ? 0.5 : 1,
        userSelect: "none",
        marginBottom: "2px"
      }),
      onClick: r
    }, [
      N("div", hl, [
        N("img", {
          draggable: "false",
          src: e.modelValue ? e.checkedIcon : e.uncheckedIcon,
          alt: e.modelValue ? "checked" : "unchecked"
        }, null, 8, vl)
      ]),
      N("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, gl),
      e.label ? (h(), S("span", pl, ne(e.label), 1)) : q("", !0)
    ], 6)), [
      [D(t), e.disabled ? "not-allowed" : "link"]
    ]);
  }
}), rn = 120;
function yl({ onMove: e, onIdentity: n, onLeave: t }) {
  let l = 0, o = 0, r;
  function i(m) {
    l = m.clientX, o = m.clientY, e(l, o);
  }
  function a(m) {
    i(m);
  }
  function f(m) {
    m.target instanceof Element && (l = m.clientX, o = m.clientY, n(m.target));
  }
  function d(m) {
    m.relatedTarget === null && t();
  }
  function u() {
    n(document.elementFromPoint(l, o));
  }
  function c() {
    document.hidden ? (r !== void 0 && (clearInterval(r), r = void 0), t()) : (r === void 0 && (r = window.setInterval(u, rn)), u());
  }
  oe(() => {
    window.addEventListener("pointermove", i, { passive: !0 }), "onpointerrawupdate" in window && window.addEventListener("pointerrawupdate", a, { passive: !0 }), document.addEventListener("pointerover", f, { passive: !0 }), document.addEventListener("pointerout", d, { passive: !0 }), document.addEventListener("visibilitychange", c), r = window.setInterval(u, rn);
  }), le(() => {
    window.removeEventListener("pointermove", i), window.removeEventListener("pointerrawupdate", a), document.removeEventListener("pointerover", f), document.removeEventListener("pointerout", d), document.removeEventListener("visibilitychange", c), r !== void 0 && clearInterval(r);
  });
}
const wl = /\/win-55-ui\/cursors\/([^/"')]+)\/native\.gif/;
function xl(e) {
  const n = getComputedStyle(e);
  let t = "";
  return e.closest(":disabled") ? t = n.getPropertyValue(Rt) : e.matches(el) ? t = n.getPropertyValue(kt) : e.matches(An) && (t = n.getPropertyValue(St)), t = t.trim(), t && t !== "none" ? t : n.getPropertyValue($e).trim();
}
function bl() {
  let e = null, n = "", t = "", l = "default", o = [], r = 0, i, a = [];
  function f() {
    i !== void 0 && (clearTimeout(i), i = void 0), a = [], e && (e.style.removeProperty("cursor"), e = null);
  }
  function d(m) {
    return t.replace("native.gif", `native-${m}.gif`);
  }
  function u() {
    const m = e;
    if (!m || !m.isConnected) {
      f();
      return;
    }
    const y = (r + o.length - 1) % o.length;
    m.style.setProperty("cursor", `${d(r)}, ${d(y)}, ${l}`, "important");
    const x = o[r] || 60;
    r = (r + 1) % o.length, i = window.setTimeout(u, x);
  }
  function c(m) {
    if (!(m instanceof HTMLElement) || !m.isConnected) return;
    const y = xl(m), x = wl.exec(y)?.[1], b = x ? Nn(x)?.nativeFrameDelays : void 0;
    if (!x || !b || b.length < 2) {
      f();
      return;
    }
    if (m === e && x === n) return;
    f();
    const k = y.indexOf(",", y.indexOf(")") + 1);
    t = (k === -1 ? y : y.slice(0, k)).trim(), l = k === -1 ? "default" : y.slice(k + 1).trim(), a = [];
    for (let T = 0; T < b.length; T++) {
      const w = new Image();
      w.src = `/win-55-ui/cursors/${x}/native-${T}.gif`, w.decode().catch(() => {
      }), a.push(w);
    }
    e = m, n = x, o = b, r = 0, u();
  }
  return le(f), { evaluate: c, stop: f };
}
const an = 2, El = /* @__PURE__ */ H({
  __name: "CursorOverlay",
  setup(e) {
    const n = bl(), t = I(), l = I();
    let o = "", r = 0, i = 0, a = !1, f = 0, d = 0;
    function u(w) {
      return Math.round(w / an) * an;
    }
    function c() {
      const w = `translate(${u(f - r)}px, ${u(d - i)}px)`;
      t.value && (t.value.style.transform = w), l.value && (l.value.style.transform = w);
    }
    function m(w) {
      const R = t.value, A = l.value;
      if (!R && !A || w === a) return;
      a = w;
      const L = w ? "visible" : "hidden";
      R && (R.style.visibility = L), A && (A.style.visibility = L);
    }
    function y(w, R) {
      w && (R ? (w.src = R, w.style.display = "") : (w.style.display = "none", w.removeAttribute("src")));
    }
    function x(w) {
      if (w === o) {
        m(w !== "");
        return;
      }
      if (o = w, !w) {
        m(!1);
        return;
      }
      const R = Nn(w);
      y(t.value, R?.hasNormal ? `/win-55-ui/cursors/${w}/normal.gif` : void 0), y(l.value, R?.hasInvert ? `/win-55-ui/cursors/${w}/invert.gif` : void 0), r = (R?.hotspotX ?? 0) * en, i = (R?.hotspotY ?? 0) * en, m(!0), c();
    }
    function b(w) {
      return w.closest("a[href], area[href]") ? "link" : w.closest(An) ? "text" : w.closest(":disabled") ? "not-allowed" : "default";
    }
    function k(w) {
      if (!w) return;
      if (w.closest('[data-win55-cursor="off"]')) {
        x(""), n.stop();
        return;
      }
      const R = getComputedStyle(w);
      if (R.getPropertyValue($e).trim() !== "none") {
        x(""), n.evaluate(w);
        return;
      }
      n.stop();
      const A = R.getPropertyValue(Fe).trim();
      if (A) {
        x(A);
        return;
      }
      const L = R.getPropertyValue(Ct).trim() || "windows-default";
      x(je(L, b(w)) ?? "");
    }
    function T() {
      x(""), n.stop();
    }
    return yl({
      onMove: (w, R) => {
        f = w, d = R, o && c();
      },
      onIdentity: k,
      onLeave: T
    }), ue(Se, () => k(document.elementFromPoint(f, d))), oe(() => {
      Ze();
    }), (w, R) => (h(), F(qe, { to: "body" }, [
      N("img", {
        ref_key: "invertImg",
        ref: l,
        alt: "",
        style: { position: "fixed", top: "0", left: "0", visibility: "hidden", "pointer-events": "none", "z-index": "2147483647", "image-rendering": "pixelated", "mix-blend-mode": "difference" }
      }, null, 512),
      N("img", {
        ref_key: "normalImg",
        ref: t,
        alt: "",
        style: { position: "fixed", top: "0", left: "0", visibility: "hidden", "pointer-events": "none", "z-index": "2147483647", "image-rendering": "pixelated" }
      }, null, 512)
    ]));
  }
}), xr = /* @__PURE__ */ H({
  __name: "CursorContext",
  props: {
    element: {},
    scheme: {},
    role: {},
    disabled: { type: Boolean },
    mode: {},
    root: { type: Boolean },
    disableAll: { type: Boolean }
  },
  setup(e, { expose: n }) {
    const t = e, l = B(() => t.element ?? "span"), o = ol(), r = B(() => t.scheme ?? o?.scheme.value ?? "windows-default"), i = B(() => t.role ?? o?.role.value), a = B(() => tl() || (t.disabled ?? o?.disabled.value ?? !1)), f = B(() => t.mode ?? o?.mode.value ?? "native"), d = mt(/* @__PURE__ */ new Set()), u = mt(/* @__PURE__ */ new Set());
    function c(E) {
      d.add(E), E.finally(() => d.delete(E));
    }
    function m(E) {
      u.add(E), E.finally(() => u.delete(E));
    }
    const y = B(() => d.size > 0 || o?.hasBusy.value === !0), x = B(() => u.size > 0 || o?.hasProgress.value === !0);
    function b(E) {
      return E !== void 0 && E !== "default" ? E : y.value ? "wait" : x.value ? "progress" : E;
    }
    function k(E) {
      return je(r.value, b(E) ?? "default");
    }
    function T(E) {
      return Ae(r.value, b(E) ?? "default");
    }
    const w = B(() => {
      if (a.value) return "auto";
      Se.value;
      const E = Ie(r.value, "default") ?? "default", P = o?.nativeBaseCss.value;
      return !P || P === "auto" ? E : t.root || t.scheme !== void 0 ? we(E, P) : P;
    }), R = {
      scheme: r,
      mode: f,
      role: i,
      disabled: a,
      hasBusy: y,
      hasProgress: x,
      resolveRole: k,
      resolveRoleCss: T,
      nativeBaseCss: w,
      addBusy: c,
      addProgress: m
    };
    nl(R), n({ addBusy: c, addProgress: m, resolveRole: k, resolveRoleCss: T }), Ze();
    const A = I();
    oe(() => {
      A.value && ll(A.value, R), t.root && al(R);
    }), le(() => {
      if (A.value && rl(A.value), !!t.root) {
        il(R), ln(!1);
        for (const E of on) document.documentElement.style.removeProperty(E);
      }
    });
    const L = B(() => b(i.value)), v = B(
      () => t.root || t.scheme !== void 0 || t.disabled === !1 || a.value || L.value !== void 0
    ), j = B(() => {
      Se.value;
      const E = r.value, P = L.value, $ = {};
      if ((t.root || t.scheme) && ($[Ct] = E), f.value === "immersive") {
        $.cursor = "none", $[$e] = a.value ? "auto" : "none";
        const _ = P ? je(E, P) : void 0;
        return _ && ($[Fe] = _), $;
      }
      if (!v.value) return $;
      if (a.value) {
        for (const _ of ze) $[_] = "auto";
        return $;
      }
      const O = w.value;
      if (P) {
        const _ = we(Ae(E, P), O);
        for (const X of ze) $[X] = _;
        return $;
      }
      return $[$e] = O, $[kt] = we(Ie(E, "link"), O), $[St] = we(Ie(E, "text"), O), $[Rt] = we(Ie(E, "not-allowed"), O), $;
    }), U = B(() => {
      const E = {};
      return t.element || (E.display = "contents"), t.root || Object.assign(E, j.value), E;
    });
    return t.root && (ft(() => ln(t.disableAll === !0)), ft(() => {
      const E = j.value, P = document.documentElement.style;
      for (const $ of on)
        E[$] !== void 0 ? P.setProperty($, E[$]) : P.removeProperty($);
    })), (E, P) => (h(), S(V, null, [
      (h(), F(gn(l.value), {
        style: W(U.value),
        ref_key: "rootEl",
        ref: A
      }, {
        default: M(() => [
          Y(E.$slots, "default")
        ]),
        _: 3
      }, 8, ["style"])),
      e.root ? (h(), F(El, { key: 0 })) : q("", !0)
    ], 64));
  }
}), Cl = /* @__PURE__ */ H({
  __name: "HDivider",
  setup(e) {
    return (n, t) => (h(), F(ee, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), br = /* @__PURE__ */ H({
  __name: "MenuDropdown",
  setup(e) {
    return (n, t) => (h(), F(oo, null, {
      trigger: M(() => [
        Y(n.$slots, "trigger")
      ]),
      items: M(() => [
        K(ee, { type: "panel-d-1" }, {
          default: M(() => [
            Y(n.$slots, "items")
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), kl = { style: { display: "flex", "align-items": "center" } }, Sl = ["src"], Rl = ["src"], Tl = ["checked", "disabled", "value", "name"], Bl = { key: 0 }, Er = /* @__PURE__ */ H({
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
  setup(e, { emit: n }) {
    const t = Qe, l = e, o = n, r = B(() => l.modelValue === l.value), i = (a) => {
      a.preventDefault(), !l.disabled && (r.value || o("update:modelValue", l.value));
    };
    return (a, f) => Oe((h(), S("div", {
      class: Le(["radio-container", { disabled: e.disabled }]),
      style: W({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: e.disabled ? 0.5 : 1,
        userSelect: "none",
        marginBottom: "2px"
      }),
      onClick: i
    }, [
      N("div", kl, [
        r.value ? (h(), S("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, Sl)) : (h(), S("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, Rl))
      ]),
      N("input", {
        type: "radio",
        checked: r.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, Tl),
      e.label ? (h(), S("span", Bl, ne(e.label), 1)) : q("", !0)
    ], 6)), [
      [D(t), e.disabled ? "not-allowed" : "link"]
    ]);
  }
}), Ee = /* @__PURE__ */ H({
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
    const n = e, t = B(() => n.element ?? "span"), l = B(() => {
      const o = wn(n);
      return n.element || (o.display = "contents"), o;
    });
    return (o, r) => (h(), F(gn(t.value), {
      style: W(l.value)
    }, {
      default: M(() => [
        Y(o.$slots, "default")
      ]),
      _: 3
    }, 8, ["style"]));
  }
}), Il = { key: 1 }, Nl = {
  key: 4,
  style: { "text-decoration": "underline" }
}, jl = {
  key: 5,
  style: { "text-decoration": "line-through" }
}, Al = ["href"], $l = ["aria-label", "data-win55-emoji"], zl = ["src", "alt"], Ll = /* @__PURE__ */ H({
  __name: "RichTextNode",
  props: {
    node: {},
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    function n(t, l) {
      return t ? se(t) : wt(l);
    }
    return (t, l) => {
      const o = Zn("RichTextNode", !0);
      return e.node.type === "text" ? (h(), S(V, { key: 0 }, [
        ke(ne(e.node.value), 1)
      ], 64)) : e.node.type === "break" ? (h(), S("br", Il)) : e.node.type === "bold" ? (h(), F(Ee, {
        key: 2,
        "is-bold": ""
      }, {
        default: M(() => [
          (h(!0), S(V, null, J(e.node.children, (r, i) => (h(), F(o, {
            key: i,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "italic" ? (h(), F(Ee, {
        key: 3,
        "is-italic": ""
      }, {
        default: M(() => [
          (h(!0), S(V, null, J(e.node.children, (r, i) => (h(), F(o, {
            key: i,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "underline" ? (h(), S("span", Nl, [
        (h(!0), S(V, null, J(e.node.children, (r, i) => (h(), F(o, {
          key: i,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "strike" ? (h(), S("span", jl, [
        (h(!0), S(V, null, J(e.node.children, (r, i) => (h(), F(o, {
          key: i,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "color" ? (h(), F(Ee, {
        key: 6,
        "font-color": e.node.value
      }, {
        default: M(() => [
          (h(!0), S(V, null, J(e.node.children, (r, i) => (h(), F(o, {
            key: i,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-color"])) : e.node.type === "size" && e.allowSizes ? (h(), F(Ee, {
        key: 7,
        "font-size": e.node.value
      }, {
        default: M(() => [
          (h(!0), S(V, null, J(e.node.children, (r, i) => (h(), F(o, {
            key: i,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-size"])) : e.node.type === "size" ? (h(!0), S(V, { key: 8 }, J(e.node.children, (r, i) => (h(), F(o, {
        key: i,
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
        (h(!0), S(V, null, J(e.node.children, (r, i) => (h(), F(o, {
          key: i,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ], 8, Al)) : e.node.type === "url" ? (h(!0), S(V, { key: 10 }, J(e.node.children, (r, i) => (h(), F(o, {
        key: i,
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
        N("img", {
          class: "win55-emoji-image",
          src: n(e.node.code, e.node.emoji),
          alt: e.node.emoji,
          draggable: "false"
        }, null, 8, zl)
      ], 8, $l)) : q("", !0);
    };
  }
}), Ol = {
  b: "bold",
  i: "italic",
  u: "underline",
  s: "strike",
  strike: "strike",
  color: "color",
  size: "size",
  url: "url"
}, Fl = /* @__PURE__ */ new Set(["br"]), sn = {
  normal: 12,
  big: 24
};
function On(e) {
  return e.map((n) => n.type === "text" ? n.value : n.type === "emoji" ? n.emoji : n.type === "break" ? `
` : On(n.children)).join("");
}
function cn(e) {
  switch (e.tagType) {
    case "color":
      return { type: "color", value: e.value ?? "inherit", children: e.children };
    case "size": {
      const n = (e.value ?? "").trim().toLowerCase(), t = sn[n], l = Number.parseInt(e.value ?? "", 10);
      return { type: "size", value: t ?? (Number.isFinite(l) ? l : sn.normal), children: e.children };
    }
    case "url":
      return {
        type: "url",
        href: e.value ?? On(e.children).trim(),
        children: e.children
      };
    default:
      return { type: e.tagType, children: e.children };
  }
}
function Ml(e, n) {
  for (let t = e.length - 1; t >= 0; t--)
    if (e[t].tagType === n) return t;
  return -1;
}
function Pl(e, n) {
  if (!e) return [];
  if (!n) return [{ type: "text", value: e }];
  const t = [], l = /:([a-zA-Z0-9_+-]+):/g;
  let o = 0, r;
  for (; r = l.exec(e); ) {
    const i = n.get(r[1].toLowerCase());
    i && (r.index > o && t.push({ type: "text", value: e.slice(o, r.index) }), t.push({ type: "emoji", emoji: i.emoji, code: i.code }), o = r.index + r[0].length);
  }
  return o < e.length && t.push({ type: "text", value: e.slice(o) }), t.length > 0 ? t : [{ type: "text", value: e }];
}
function _l(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const un = /* @__PURE__ */ new WeakMap(), Dl = new RegExp(Ne, "gu");
function Vl(e) {
  if (!e) return Dl;
  const n = un.get(e);
  if (n) return n;
  const t = Object.keys(e).sort((r, i) => i.length - r.length).map(_l), l = t.length > 0 ? `${t.join("|")}|${Ne}` : Ne, o = new RegExp(l, "gu");
  return un.set(e, o), o;
}
function Hl(e, n) {
  const t = Vl(n), l = [];
  let o = 0, r;
  for (t.lastIndex = 0; r = t.exec(e); ) {
    const i = r[0], a = n?.[i];
    r.index > o && l.push({ type: "text", value: e.slice(o, r.index) }), l.push({ type: "emoji", emoji: i, code: a }), o = r.index + i.length;
  }
  return o < e.length && l.push({ type: "text", value: e.slice(o) }), l.length > 0 ? l : [{ type: "text", value: e }];
}
function Ul(e, n, t) {
  const l = [];
  for (const o of Pl(e, n))
    o.type === "text" ? l.push(...Hl(o.value, t)) : l.push(o);
  return l;
}
function Wl(e, n, t = null) {
  const l = [], o = [], r = /\[(\/?)(\w+)(?:=([^\]]*))?\]/g;
  let i = 0, a;
  const f = () => o.length ? o[o.length - 1].children : l, d = (u) => f().push(...Ul(u, n, t));
  for (; a = r.exec(e); ) {
    const [u, c, m, y] = a, x = m.toLowerCase();
    if (Fl.has(x)) {
      d(e.slice(i, a.index)), i = a.index + u.length, f().push({ type: "break" });
      continue;
    }
    const b = Ol[x];
    if (!b) continue;
    if (d(e.slice(i, a.index)), i = a.index + u.length, !c) {
      o.push({ tagType: b, value: y, children: [] });
      continue;
    }
    const k = Ml(o, b);
    if (k === -1) {
      d(u);
      continue;
    }
    for (; o.length > k + 1; ) {
      const w = o.pop();
      o[o.length - 1].children.push(cn(w));
    }
    const T = o.pop();
    f().push(cn(T));
  }
  for (d(e.slice(i)); o.length; ) {
    const u = o.pop();
    (o.length ? o[o.length - 1].children : l).push(...u.children);
  }
  return l;
}
const Yl = {
  "data-win55-richtext": "",
  style: { display: "contents" }
}, Cr = /* @__PURE__ */ H({
  __name: "RichText",
  props: {
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    const n = Qe, t = e, l = vn(), o = I(null), r = I(null);
    xt().then((d) => {
      const u = /* @__PURE__ */ new Map();
      for (const c of d)
        for (const m of c.shortcodes)
          u.set(m.toLowerCase(), { emoji: c.emoji, code: c.code });
      o.value = u;
    }), ge().then((d) => {
      r.value = d;
    });
    const i = B(() => {
      const d = o.value;
      return d ? { get: (u) => d.get(u) } : null;
    });
    function a(d) {
      return d.map((u) => typeof u.children == "string" ? u.children : Array.isArray(u.children) ? a(u.children) : "").join("");
    }
    const f = B(() => Wl(a(l.default?.() ?? []), i.value, r.value));
    return (d, u) => Oe((h(), S("span", Yl, [
      (h(!0), S(V, null, J(f.value, (c, m) => (h(), F(Ll, {
        key: m,
        node: c,
        "allow-links": t.allowLinks,
        "allow-sizes": t.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
    ])), [
      [D(n), "text"]
    ]);
  }
});
function Xl(e, n, t, l, o) {
  const r = e.getContext("2d");
  if (!r) return;
  r.clearRect(0, 0, e.width, e.height);
  const i = 2, a = [
    [0, 48, 12, 60, 3, 51, 15, 63],
    [32, 16, 44, 28, 35, 19, 47, 31],
    [8, 56, 4, 52, 11, 59, 7, 55],
    [40, 24, 36, 20, 43, 27, 39, 23],
    [2, 50, 14, 62, 1, 49, 13, 61],
    [34, 18, 46, 30, 33, 17, 45, 29],
    [10, 58, 6, 54, 9, 57, 5, 53],
    [42, 26, 38, 22, 41, 25, 37, 21]
  ], f = dn(l), d = dn(o), u = Math.floor(n / i), c = Math.floor(t / i);
  e.width = Math.floor(n * 2) / 2, e.height = Math.floor(t * 2) / 2;
  for (let m = 0; m < c; m++)
    for (let y = 0; y < u; y++) {
      const x = y * i, b = m * i, k = (y + m) / (u + c - 6), T = (a[m % 8][y % 8] + 0.5) / 64, w = k > T ? 1 : 0, R = Math.round(f.r * (1 - w) + d.r * w), A = Math.round(f.g * (1 - w) + d.g * w), L = Math.round(f.b * (1 - w) + d.b * w);
      r.fillStyle = `rgb(${R}, ${A}, ${L})`, r.fillRect(x, b, i, i);
    }
}
function dn(e) {
  const n = e.replace("#", ""), t = parseInt(n, 16);
  return {
    r: t >> 16 & 255,
    g: t >> 8 & 255,
    b: t & 255
  };
}
const Gl = { style: { height: "0", overflow: "visible" } }, Kl = { class: "titlebar-content" }, ql = { class: "titlebar-image" }, Jl = ["src"], Zl = { class: "titlebar-text" }, Ql = { class: "titlebar-buttons" }, er = /* @__PURE__ */ H({
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
    const n = e, t = I(null);
    let l = null;
    function o(i, a) {
      const f = n.gradientColorA || "5555ff", d = n.gradientColorB || "0000aa";
      Xl(i, i.width, i.height, f, d), a.fillStyle = "#555555", a.fillRect(0, i.height - 2, Math.floor(i.width / 2) * 2, 4);
    }
    function r() {
      const i = t.value;
      if (!i) return;
      const a = i.getContext("2d");
      if (!a) return;
      const f = i.getBoundingClientRect(), d = Math.floor(f.width * 2) / 2, u = Math.floor(f.height * 2) / 2;
      (i.width !== d || i.height !== u) && (i.width = d, i.height = u), o(i, a);
    }
    return ue(() => [n.gradientColorA, n.gradientColorB], () => {
      if (t.value) {
        const i = t.value.getContext("2d");
        i && o(t.value, i);
      }
    }), oe(() => {
      r(), t.value && (l = new ResizeObserver(() => {
        r();
      }), l.observe(t.value));
    }), le(() => {
      l?.disconnect();
    }), (i, a) => (h(), S("div", null, [
      N("div", Gl, [
        N("canvas", {
          ref_key: "canvasRef",
          ref: t,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      N("div", Kl, [
        N("div", ql, [
          N("img", {
            src: e.icon ?? "/win-55-ui/icons/program.png"
          }, null, 8, Jl)
        ]),
        N("div", Zl, [
          K(Ee, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: M(() => [
              ke(ne(e.title), 1)
            ]),
            _: 1
          })
        ]),
        N("div", Ql, [
          Y(i.$slots, "buttons"),
          e.placeholderButtons ? (h(), S(V, { key: 0 }, [
            K(Xe, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: M(() => [...a[0] || (a[0] = [
                N("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/o.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            K(Xe, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: M(() => [...a[1] || (a[1] = [
                N("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/_.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            a[3] || (a[3] = N("div", { style: { width: "2px" } }, null, -1)),
            K(Xe, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: M(() => [...a[2] || (a[2] = [
                N("img", {
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
}), kr = /* @__PURE__ */ H({
  __name: "Tooltip",
  props: {
    text: {},
    offsetX: {},
    offsetY: {}
  },
  setup(e) {
    const n = e, t = I(!1), l = mt({ x: 0, y: 0 });
    let o = null;
    const r = () => {
      o = window.setTimeout(() => {
        t.value = !0;
      }, 400);
    }, i = () => {
      o !== null && (clearTimeout(o), o = null), t.value = !1;
    }, a = (d) => {
      l.x = d.clientX + (n.offsetX ?? 24), l.y = d.clientY + (n.offsetY ?? 24);
    }, f = B(() => ({
      position: "fixed",
      left: `${l.x}px`,
      top: `${l.y}px`,
      pointerEvents: "none",
      // now TS understands it's valid
      whiteSpace: "nowrap",
      zIndex: 1e3
    }));
    return le(() => {
      o !== null && clearTimeout(o);
    }), (d, u) => (h(), S("span", {
      onMouseenter: r,
      onMouseleave: i,
      onMousemove: a,
      style: { position: "relative", display: "inline-block" }
    }, [
      Y(d.$slots, "default"),
      t.value ? (h(), F(ee, {
        key: 0,
        style: W(f.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: M(() => [
          ke(ne(n.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : q("", !0)
    ], 32));
  }
}), tr = {
  class: "window-container",
  style: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%"
  }
}, Ve = 6, nr = /* @__PURE__ */ H({
  __name: "Window",
  props: /* @__PURE__ */ yt({
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
    const n = ml, t = e, l = xe(e, "x"), o = xe(e, "y"), r = xe(e, "width"), i = xe(e, "height"), a = t.minWidth ?? 240, f = t.minHeight ?? 40, d = B(() => (t.resizable ?? !1) || (t.resizableHorizontally ?? !1)), u = B(() => (t.resizable ?? !1) || (t.resizableVertically ?? !1));
    let c = !1, m = !1;
    const y = I("");
    let x = "";
    const b = {
      n: "ns-resize",
      s: "ns-resize",
      e: "ew-resize",
      w: "ew-resize",
      ne: "nesw-resize",
      sw: "nesw-resize",
      nw: "nwse-resize",
      se: "nwse-resize"
    }, k = B(() => b[y.value] ?? "");
    let T = 0, w = 0, R = 0, A = 0, L = 0, v = 0;
    function j(O) {
      if (t.faux || y.value) return;
      const _ = O.target;
      _.closest(".titlebar-image") || _.closest(".titlebar-buttons") || (c = !0, T = O.clientX, w = O.clientY, L = l.value, v = o.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", E), window.addEventListener("mouseup", P));
    }
    function U(O) {
      t.faux || y.value && (!d.value && !u.value || (m = !0, x = y.value, T = O.clientX, w = O.clientY, R = r.value, A = i.value, L = l.value, v = o.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", E), window.addEventListener("mouseup", P)));
    }
    function E(O) {
      if (t.faux) return;
      const _ = O.clientX - T, X = O.clientY - w;
      if (c && (l.value = L + _, o.value = v + X), m) {
        const re = x;
        if (d.value && re.includes("e") && (r.value = Math.max(a, R + _)), u.value && re.includes("s") && (i.value = Math.max(f, A + X)), d.value && re.includes("w")) {
          const de = R - _, ae = Math.max(a, de);
          r.value = ae, l.value = L + (R - ae);
        }
        if (u.value && re.includes("n")) {
          const de = A - X, ae = Math.max(f, de);
          i.value = ae, o.value = v + (A - ae);
        }
      }
    }
    function P() {
      c = !1, m = !1, x = "", y.value = "", document.body.style.userSelect = "", window.removeEventListener("mousemove", E), window.removeEventListener("mouseup", P);
    }
    function $(O) {
      if (t.faux) {
        y.value = "";
        return;
      }
      if (m) return;
      if (!d.value && !u.value) {
        y.value = "";
        return;
      }
      const X = O.currentTarget.getBoundingClientRect(), re = O.clientX - X.left, de = X.right - O.clientX, ae = O.clientY - X.top, Me = X.bottom - O.clientY;
      let fe = "";
      u.value && (ae < Ve ? fe += "n" : Me < Ve && (fe += "s")), d.value && (re < Ve ? fe += "w" : de < Ve && (fe += "e")), y.value = fe;
    }
    return (O, _) => Oe((h(), F(ee, {
      "extra-class": e.extraClass,
      "extra-styles": t.faux ? e.extraStyles : {
        position: "absolute",
        left: l.value + "px",
        top: o.value + "px",
        width: r.value + "px",
        height: i.value + "px",
        ...e.extraStyles
      },
      type: "panel-d-2",
      onMousemove: $,
      onMousedown: U
    }, {
      default: M(() => [
        N("div", tr, [
          N("div", {
            class: "titlebar-wrapper",
            onMousedown: Ge(j, ["stop"]),
            style: { height: "34px" }
          }, [
            K(er, {
              title: e.title,
              icon: e.icon,
              "placeholder-buttons": e.placeholderButtons,
              disabled: e.disabled,
              "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
              "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
            }, {
              buttons: M(() => [
                Y(O.$slots, "titlebar-buttons")
              ]),
              _: 3
            }, 8, ["title", "icon", "placeholder-buttons", "disabled", "gradient-color-a", "gradient-color-b"])
          ], 32),
          N("div", {
            class: "inner-container",
            style: W({
              flex: "1",
              overflowX: t.overflowX ?? "auto",
              overflowY: t.overflowY ?? "auto",
              marginTop: "4px",
              boxSizing: "border-box"
            })
          }, [
            Y(O.$slots, "default")
          ], 4)
        ])
      ]),
      _: 3
    }, 8, ["extra-class", "extra-styles"])), [
      [D(n), k.value]
    ]);
  }
}), or = /* @__PURE__ */ H({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" }
  },
  setup(e) {
    return (n, t) => (h(), F(ee, {
      type: "border-groove",
      "extra-styles": { padding: "10px", margin: "10px" }
    }, {
      default: M(() => [
        N("div", {
          class: "label",
          style: W({ backgroundColor: e.backgroundColorHint })
        }, ne(e.label), 5),
        Y(n.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }));
  }
}), lr = (e, n) => {
  const t = e.__vccOpts || e;
  for (const [l, o] of n)
    t[l] = o;
  return t;
}, Sr = /* @__PURE__ */ lr(or, [["__scopeId", "data-v-9a25af1b"]]), fn = "/win-55-ui/emoji/emoji-by-category.json";
let dt = null;
async function mn() {
  return dt || (dt = fetch(fn).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${fn}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), dt;
}
const rr = { class: "emoji-picker-body" }, ar = { class: "emoji-picker-tabs" }, ir = ["onClick"], sr = { class: "emoji-picker-grid" }, cr = ["src", "title", "onClick"], ur = "546", Rr = /* @__PURE__ */ H({
  __name: "EmojiPickerWindow",
  setup(e) {
    const n = I(null), t = I([]), l = I(null), o = I(void 0), r = B(() => t.value.find((d) => d.category === l.value) ?? null);
    async function i() {
      if (Math.random() < 0.75) {
        o.value = se(ur);
        return;
      }
      const u = (await mn()).flatMap((m) => m.emojis);
      if (u.length === 0) return;
      const c = u[Math.floor(Math.random() * u.length)];
      o.value = se(c.code);
    }
    ue(Ce, async (d) => {
      d && (i(), t.value.length === 0 && (t.value = await mn(), l.value = t.value[0]?.category ?? null));
    }, { immediate: !0 });
    function a(d) {
      l.value = d;
    }
    function f(d) {
      if (!Ce.value) return;
      const u = d.target;
      n.value?.contains(u) || Jt();
    }
    return oe(() => {
      document.addEventListener("click", f);
    }), le(() => {
      document.removeEventListener("click", f);
    }), (d, u) => (h(), F(qe, { to: "body" }, [
      D(Ce) ? (h(), S("div", {
        key: 0,
        ref_key: "rootRef",
        ref: n,
        style: { display: "contents" }
      }, [
        K(nr, {
          x: D(ce).x,
          "onUpdate:x": u[0] || (u[0] = (c) => D(ce).x = c),
          y: D(ce).y,
          "onUpdate:y": u[1] || (u[1] = (c) => D(ce).y = c),
          width: D(ce).width,
          "onUpdate:width": u[2] || (u[2] = (c) => D(ce).width = c),
          height: D(ce).height,
          "onUpdate:height": u[3] || (u[3] = (c) => D(ce).height = c),
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
          "titlebar-buttons": M(() => [
            K(Xe, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              onClick: D(Jt)
            }, {
              default: M(() => [...u[4] || (u[4] = [
                N("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/x.png"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]),
          default: M(() => [
            K(ee, {
              type: "textarea",
              "extra-styles": { width: "100%", height: "calc(100% - 2px)", marginTop: "2px", padding: "2px" }
            }, {
              default: M(() => [
                N("div", rr, [
                  N("div", ar, [
                    (h(!0), S(V, null, J(t.value, (c) => (h(), S("span", {
                      key: c.category,
                      class: Le(["emoji-picker-tab", { "emoji-picker-tab--selected": c.category === l.value }]),
                      onClick: (m) => a(c.category)
                    }, [
                      K(Ee, {
                        shorthand: c.category === l.value ? "Bold12" : "Regular12"
                      }, {
                        default: M(() => [
                          ke(ne(c.category), 1)
                        ]),
                        _: 2
                      }, 1032, ["shorthand"])
                    ], 10, ir))), 128))
                  ]),
                  K(Cl),
                  N("div", sr, [
                    (h(!0), S(V, null, J(r.value?.emojis ?? [], (c) => (h(), S("div", {
                      key: c.code,
                      class: "emoji-picker-grid-cell"
                    }, [
                      N("img", {
                        src: D(se)(c.code),
                        title: c.shortcodes[0] ? `:${c.shortcodes[0]}:` : void 0,
                        class: "emoji-picker-grid-item",
                        onClick: (m) => D(_o)(c.emoji)
                      }, null, 8, cr)
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
}), dr = ["src", "alt", "width", "height"], hn = 15, He = 2, Tr = /* @__PURE__ */ H({
  __name: "Emoji",
  props: {
    emoji: {}
  },
  setup(e) {
    const n = e, t = new RegExp(`^(?:${Ne})$`, "u"), l = I(""), o = I(n.emoji), r = I(hn * He), i = I(hn * He);
    async function a(d) {
      if (t.test(d)) {
        o.value = d;
        const c = await fo(d);
        l.value = c ?? wt(d);
        return;
      }
      const u = await In(d);
      if (u) {
        o.value = u.emoji, l.value = se(u.code);
        return;
      }
      console.warn(`[win-55-ui] Emoji: could not resolve "${d}" as an emoji or a shortcode alias.`), o.value = d, l.value = "";
    }
    ue(() => n.emoji, (d) => {
      a(d);
    }, { immediate: !0 });
    function f(d) {
      const u = d.target;
      r.value = u.naturalWidth * He, i.value = u.naturalHeight * He;
    }
    return (d, u) => (h(), S("img", {
      class: "win55-emoji-standalone",
      src: l.value,
      alt: o.value,
      width: r.value,
      height: i.value,
      draggable: "false",
      onLoad: f
    }, null, 40, dr));
  }
}), Br = (e, n = 20, t = 48, l = 30) => {
  const o = I(
    Array.from({ length: e }, (d, u) => ({
      sin: Math.sin(0 + u * Math.PI * 2 / e),
      cos: Math.cos(0 + u * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let r = 0, i = 0;
  const a = n > 0 ? 1e3 / n : 0, f = () => {
    r = requestAnimationFrame(f);
    const d = Date.now();
    if (d - i < a) return;
    i = d;
    const u = Array.from({ length: e }, (x, b) => ({
      sin: Math.sin(d / (1e3 + b * 200) + b * Math.PI * 2 / e),
      cos: Math.cos(d / (3e3 + b * 400) + b * Math.PI * 2 / e + Math.PI / 4)
    })), c = u.map((x) => t + x.sin * l), m = e * t, y = c.reduce((x, b) => x + b, 0);
    if (y > 0) {
      const x = m / y;
      o.value = u.map((b) => ({
        sin: ((t + b.sin * l) * x - t) / l,
        cos: b.cos
      }));
    } else
      o.value = u;
  };
  return oe(() => {
    r = requestAnimationFrame(f);
  }), le(() => {
    cancelAnimationFrame(r);
  }), { values: o };
};
function Ir(e) {
  document.addEventListener(
    "error",
    (n) => {
      const t = n.target;
      t instanceof HTMLImageElement && e(t, n);
    },
    !0
    // IMPORTANT: use capture phase since error doesn't bubble
  );
}
export {
  no as Balloon,
  oo as BaseDropdown,
  pr as BaseInput,
  ee as Box,
  Xe as Button,
  jn as CURSOR_CONTEXT_KEY,
  wr as Checkbox,
  xr as CursorContext,
  Tr as Emoji,
  Rr as EmojiPickerWindow,
  Cl as HDivider,
  br as MenuDropdown,
  Sr as NamedPanel,
  Er as RadioButton,
  Cr as RichText,
  er as Titlebar,
  kr as Tooltip,
  Ee as Typography,
  nr as Window,
  bt as activeTarget,
  Jt as closePicker,
  ml as cursorDirective,
  Qe as cursorWeakDirective,
  gr as customEmojiDirective,
  Xl as drawAngledBayerDitherGradient,
  zo as emojiDirective,
  fo as getEmojiGifPath,
  se as getEmojiGifPathFromCode,
  hr as getEmojiRegistry,
  Be as getSelectionOffset,
  te as getTextWithCustomEmoji,
  vr as hasEmoji,
  _o as insertEmoji,
  ge as loadEmojiRegistry,
  yr as loadSchemeIndex,
  Po as openPicker,
  Do as pickNextButtonIcon,
  Ce as pickerOpen,
  ce as pickerPosition,
  nl as provideCursorContext,
  qt as registerActiveInput,
  Ir as registerGlobalImageErrorHandler,
  mr as resetEmojiRegistryCache,
  Ue as restoreSelectionOffset,
  wn as typographyStyles,
  ol as useCursorContext,
  Br as useSineWave
};
