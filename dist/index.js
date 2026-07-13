import { defineComponent as H, ref as R, computed as j, openBlock as v, createElementBlock as E, normalizeStyle as D, normalizeClass as Ie, renderSlot as V, useModel as pe, useSlots as Et, watch as de, nextTick as Ct, onMounted as fe, onUnmounted as he, createBlock as F, Teleport as kt, createElementVNode as k, createVNode as ne, withCtx as L, unref as we, Fragment as P, createTextVNode as xe, toDisplayString as oe, createCommentVNode as K, mergeModels as St, withModifiers as je, shallowRef as qt, renderList as Q, resolveDynamicComponent as Kt, resolveComponent as Jt, reactive as Qt } from "vue";
const ee = /* @__PURE__ */ H({
  __name: "Box",
  props: {
    type: {},
    extraStyles: {},
    extraClass: {}
  },
  setup(e, { expose: t }) {
    const n = e, l = R(null), o = j(() => ({
      "--img": `url(/win-55-ui/${n.type}.png)`,
      ...n.extraStyles
    }));
    return t({ el: l }), (r, s) => (v(), E("div", {
      ref_key: "rootRef",
      ref: l,
      class: Ie(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: D(o.value)
    }, [
      V(r.$slots, "default")
    ], 6));
  }
}), Zt = { class: "balloon-tip-box" }, en = {
  key: 1,
  class: "balloon-wrapper"
}, tn = { class: "balloon-tip-box" }, ke = 8, nn = /* @__PURE__ */ H({
  __name: "Balloon",
  props: /* @__PURE__ */ St({
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
    const o = e, r = Et(), s = j(() => o.side ?? "top"), a = j(() => o.bias), c = R(s.value), d = j(() => o.anchor ? c.value : s.value), p = j(() => {
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
    }), x = R(null), b = R(null), C = { top: "bottom", bottom: "top", left: "right", right: "left" }, S = {
      top: ["left", "right"],
      bottom: ["left", "right"],
      left: ["top", "bottom"],
      right: ["top", "bottom"]
    };
    function I(h, T, z) {
      const Y = (T.left + T.right) / 2, A = (T.top + T.bottom) / 2;
      return h === "top" || h === "bottom" ? {
        top: h === "top" ? T.top - z.height : T.bottom,
        left: Y - z.width / 2
      } : {
        left: h === "left" ? T.left - z.width : T.right,
        top: A - z.height / 2
      };
    }
    function $(h, T, z, Y) {
      return h.top >= ke && h.left >= ke && h.top + T.height <= Y - ke && h.left + T.width <= z - ke;
    }
    function M() {
      const h = x.value;
      if (!o.anchor || !h) return;
      const T = l(o.anchor), z = h.getBoundingClientRect(), Y = window.innerWidth, A = window.innerHeight, N = o.side ?? "top", X = [
        N,
        C[N],
        ...S[N]
      ].find((W) => $(I(W, T, z), z, Y, A)) ?? N;
      c.value = X, b.value = I(X, T, z);
    }
    de(
      [() => o.anchor, t],
      async ([h, T]) => {
        !h || !T || (await Ct(), M());
      },
      { deep: !0, immediate: !0 }
    );
    const O = () => {
      o.anchor && t.value && M();
    };
    return fe(() => {
      window.addEventListener("resize", O), window.addEventListener("scroll", O, !0);
    }), he(() => {
      window.removeEventListener("resize", O), window.removeEventListener("scroll", O, !0);
    }), (h, T) => e.anchor ? (v(), F(kt, {
      key: 0,
      to: "body"
    }, [
      t.value ? (v(), E("div", {
        key: 0,
        ref_key: "anchoredRef",
        ref: x,
        class: "balloon-anchored",
        style: D({
          top: (b.value?.top ?? 0) + "px",
          left: (b.value?.left ?? 0) + "px"
        })
      }, [
        k("div", {
          class: "balloon-inner",
          style: D({ flexDirection: u.value })
        }, [
          k("div", {
            class: "balloon-box-wrapper",
            style: D(y.value)
          }, [
            ne(ee, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: L(() => [
                we(r).content ? V(h.$slots, "content", { key: 0 }) : (v(), E(P, { key: 1 }, [
                  xe(oe(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          k("div", Zt, [
            k("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: D({ transform: f.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : K("", !0)
    ])) : (v(), E("div", en, [
      V(h.$slots, "default"),
      t.value ? (v(), E("div", {
        key: 0,
        class: "balloon",
        style: D(p.value)
      }, [
        k("div", {
          class: "balloon-inner",
          style: D({ flexDirection: u.value })
        }, [
          k("div", {
            class: "balloon-box-wrapper",
            style: D(y.value)
          }, [
            ne(ee, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: L(() => [
                we(r).content ? V(h.$slots, "content", { key: 0 }) : (v(), E(P, { key: 1 }, [
                  xe(oe(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          k("div", tn, [
            k("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: D({ transform: f.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : K("", !0)
    ]));
  }
}), on = /* @__PURE__ */ H({
  __name: "BaseDropdown",
  props: {
    matchTriggerWidth: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = R(!1), l = R(null), o = R(null), r = R(null), s = () => {
      const p = o.value, u = r.value;
      if (!p || !u) return;
      const f = p.getBoundingClientRect(), y = window.innerHeight, x = u.offsetHeight;
      let b = f.bottom + window.scrollY;
      const C = f.left + window.scrollX;
      f.bottom + x > y && (b = f.top + window.scrollY - x), l.value = {
        top: b,
        left: C,
        width: t.matchTriggerWidth ? f.width : void 0
      };
    };
    de(n, async (p) => {
      p && (await Ct(), s());
    });
    const a = () => {
      n.value && s();
    }, c = (p) => {
      if (!n.value) return;
      const u = p.target;
      o.value?.contains(u) || r.value?.contains(u) || (n.value = !1);
    };
    fe(() => {
      window.addEventListener("resize", a), window.addEventListener("scroll", a), document.addEventListener("click", c);
    }), he(() => {
      window.removeEventListener("resize", a), window.removeEventListener("scroll", a), document.removeEventListener("click", c);
    });
    const d = () => {
      n.value = !n.value;
    };
    return (p, u) => (v(), E(P, null, [
      k("div", {
        ref_key: "triggerRef",
        ref: o,
        style: { display: "inline-block" },
        onClick: je(d, ["stop"])
      }, [
        V(p.$slots, "trigger")
      ], 512),
      (v(), F(kt, { to: "body" }, [
        n.value ? (v(), E("div", {
          key: 0,
          ref_key: "dropdownRef",
          ref: r,
          style: D({
            position: "absolute",
            top: (l.value?.top ?? 0) + "px",
            left: (l.value?.left ?? 0) + "px",
            width: e.matchTriggerWidth ? (l.value?.width ?? "auto") + "px" : "auto"
          })
        }, [
          V(p.$slots, "items")
        ], 4)) : K("", !0)
      ]))
    ], 64));
  }
}), ln = [10, 12, 14, 16, 24], an = [
  { style: "Regular", size: 12 },
  { style: "Bold", size: 12 },
  { style: "Regular", size: 24 }
], rn = {
  BoldItalic: ["BoldItalic", "Bold", "Italic", "Regular"],
  Bold: ["Bold", "Regular"],
  Italic: ["Italic", "Regular"],
  Regular: ["Regular"]
};
function ct(e) {
  return an.filter((t) => t.style === e).map((t) => t.size);
}
function sn(e, t) {
  const n = rn[e] ?? ["Regular"];
  for (const l of n)
    if (ct(l).includes(t))
      return { style: l, size: t };
  for (const l of n) {
    const o = ct(l);
    if (o.length > 0)
      return { style: l, size: Bt(t, o) };
  }
  return { style: "Regular", size: t };
}
function Tt(e) {
  const { style: t, size: n } = e.shorthand ? un(e.shorthand) : {
    style: cn(e.isBold, e.isItalic),
    size: Bt(e.fontSize ?? 12, ln)
  }, { style: l, size: o } = sn(t, n), r = {
    fontFamily: `${l}${o}, Arial, sans`,
    fontSize: `${o * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (r.textShadow = `2px 2px 0 ${e.fontShadowColor}`), r;
}
function cn(e, t) {
  return e && t ? "BoldItalic" : e ? "Bold" : t ? "Italic" : "Regular";
}
function un(e) {
  const t = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!t)
    throw new Error(`Invalid shorthand format: ${e}`);
  const n = t[1], l = parseInt(t[2], 10);
  return { style: n, size: l };
}
function Bt(e, t) {
  if (t.length === 0)
    throw new Error("Array cannot be empty");
  return t.reduce((n, l) => {
    const o = Math.abs(l - e), r = Math.abs(n - e);
    return o < r ? l : n;
  });
}
function Z(e) {
  if (e instanceof Text)
    return e.nodeValue ?? "";
  if (!(e instanceof Element || e instanceof DocumentFragment))
    return Array.from(e.childNodes).map(Z).join("");
  if (e instanceof Element) {
    const t = e.getAttribute("data-win55-emoji");
    if (t)
      return t;
    if (e.tagName === "BR")
      return `
`;
  }
  return Array.from(e.childNodes).map(Z).join("");
}
function ve(e) {
  const t = window.getSelection();
  if (!t || t.rangeCount === 0 || !t.isCollapsed)
    return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.startContainer))
    return null;
  const l = document.createRange();
  return l.selectNodeContents(e), l.setEnd(n.startContainer, n.startOffset), Z(l.cloneContents()).length;
}
function Rt(e, t) {
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
    const r = Rt(o, n);
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
function Be(e, t, n = !1) {
  if (t === null || !e.isConnected)
    return;
  const l = Rt(e, t);
  if (!l)
    return;
  const o = document.createRange(), r = window.getSelection();
  n && e.focus({ preventScroll: !0 }), o.setStart(l.node, l.offset), o.collapse(!0), r?.removeAllRanges(), r?.addRange(o);
}
const At = "/win-55-ui/emoji", He = `${At}/emoji-registry.csv`;
let Re = null, Ue = null, Ae = null;
function dn(e) {
  return e.replace(/\/$/, "");
}
function jt(e) {
  return e.trim().replace(/\.gif$/i, "");
}
function fn(e) {
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
    const a = r.slice(0, s).trim(), c = jt(r.slice(s + 1));
    a && c && (t[a] = c);
  }
  return t;
}
async function ie(e = {}) {
  const t = e.registryUrl ?? He;
  return Ae && t === He ? Ae : ((!Re || Ue !== t) && (Ue = t, Re = fetch(t).then((n) => {
    if (!n.ok)
      throw new Error(
        `Could not load emoji registry from ${t}: ${n.status} ${n.statusText}`
      );
    return n.text();
  }).then(fn).then((n) => (t === He && (Ae = n), n))), Re);
}
function Lo() {
  Re = null, Ue = null, Ae = null;
}
async function $o(e, t = {}) {
  const l = (await ie(t))[e];
  return l ? be(l, t) : null;
}
function be(e, t = {}) {
  return `${dn(t.basePath ?? At)}/${jt(e)}.gif`;
}
async function Mo(e = {}) {
  return ie(e);
}
async function zo(e, t = {}) {
  const n = await ie(t);
  return e in n;
}
ie();
function hn(e) {
  return e.map((t) => {
    const n = parseInt(t.replace(/^#/, ""), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  });
}
function gn(e, t, n, l) {
  let o = 1 / 0, r = [0, 0, 0];
  for (const s of l) {
    const a = e - s[0], c = t - s[1], d = n - s[2], p = a * a + c * c + d * d;
    p < o && (o = p, r = s);
  }
  return r;
}
const mn = "win55-emoji", pn = "win55-emoji-image", q = 15, Xe = 2, vn = [
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
], yn = hn(vn), ut = [
  "[\\u{1F1E6}-\\u{1F1FF}]{2}",
  "[0-9#*]\\uFE0F?\\u20E3",
  "\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?)*",
  "\\p{Emoji_Presentation}"
].join("|"), wn = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION"
]), ue = /* @__PURE__ */ new WeakMap(), dt = /* @__PURE__ */ new WeakMap(), ft = /* @__PURE__ */ new Map();
function xn(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function bn(e) {
  const t = dt.get(e);
  if (t)
    return t;
  const n = Object.keys(e).sort((r, s) => s.length - r.length).map(xn), l = n.length > 0 ? `${n.join("|")}|${ut}` : ut, o = new RegExp(l, "gu");
  return dt.set(e, o), o;
}
function It(e) {
  return e.value === !1 ? null : typeof e.value == "object" ? e.value : {};
}
const En = "data-win55-richtext";
function Cn(e) {
  return wn.has(e.tagName) || e.hasAttribute("data-win55-emoji");
}
function Nt(e) {
  let t = e.parentElement;
  for (; t; ) {
    const n = ue.get(t);
    if (n && It(n.binding))
      return !0;
    t = t.parentElement;
  }
  return !1;
}
function kn(e, t) {
  const n = [], l = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, {
    acceptNode(o) {
      const r = o.parentElement;
      return !r || Cn(r) || t && r.closest(`[${En}]`) || !o.nodeValue?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  for (; l.nextNode(); )
    n.push(l.currentNode);
  return n;
}
function Sn() {
  return `${q * Xe}px`;
}
function Tn(e, t, n, l, o) {
  const r = Math.min(1, Math.max(0, o)), s = e.getImageData(0, 0, t, n), a = s.data;
  for (let c = 0; c < a.length; c += 4) {
    const d = a[c], p = a[c + 1], u = a[c + 2];
    if (a[c + 3] < 80)
      a[c] = 0, a[c + 1] = 0, a[c + 2] = 0, a[c + 3] = 0;
    else {
      const [y, x, b] = gn(
        d,
        p,
        u,
        l
      ), C = Math.round(d + (y - d) * r), S = Math.round(p + (x - p) * r), I = Math.round(u + (b - u) * r);
      a[c] = C, a[c + 1] = S, a[c + 2] = I, a[c + 3] = 255;
    }
  }
  e.putImageData(s, 0, 0);
}
function Bn(e, t, n) {
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
function Rn(e) {
  const t = ft.get(e);
  if (t)
    return t;
  const n = An(e);
  return ft.set(e, n), n;
}
function An(e) {
  const t = document.createElement("canvas");
  t.width = q, t.height = q;
  const n = t.getContext("2d");
  if (!n)
    return "";
  const l = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif', o = q * 4;
  n.textBaseline = "alphabetic", n.font = `${o}px ${l}`;
  const r = n.measureText(e), s = r.actualBoundingBoxLeft + r.actualBoundingBoxRight, a = r.actualBoundingBoxAscent + r.actualBoundingBoxDescent;
  if (s > 0 && a > 0) {
    const c = o * Math.min(q / s, q / a);
    n.font = `${c}px ${l}`;
    const d = n.measureText(e), p = d.actualBoundingBoxLeft + d.actualBoundingBoxRight, u = d.actualBoundingBoxAscent + d.actualBoundingBoxDescent, f = (q - p) / 2 + d.actualBoundingBoxLeft, y = (q - u) / 2 + d.actualBoundingBoxAscent;
    n.fillText(e, f, y - 0.5), Tn(n, q, q, yn, 0.1), Bn(n, q, q), Mn(t);
  }
  return t.toDataURL("image/png");
}
function jn(e, t, n) {
  const l = document.createElement("span"), o = document.createElement("img");
  return l.className = n.className ?? mn, l.contentEditable = "false", l.dataset.win55Emoji = e, l.role = "img", l.ariaLabel = e, l.style.setProperty("--win55-emoji-size", Sn()), o.src = t, o.alt = e, o.className = pn, o.draggable = !1, o.dataset.win55EmojiImg = "true", o.addEventListener("load", () => {
    const r = o.naturalWidth * Xe, s = o.naturalHeight * Xe;
    l.style.width = `${r}px`, l.style.height = `${s}px`, o.style.width = `${r}px`, o.style.height = `${s}px`;
  }, { once: !0 }), l.append(o), l;
}
function In(e, t, n, l) {
  const o = e.parentElement;
  if (!o)
    return;
  const r = window.getSelection(), s = r && r.rangeCount > 0 && r.isCollapsed ? r.getRangeAt(0) : null, a = s?.startContainer === e, c = !!(s && s.startContainer === o && s.startOffset === Array.prototype.indexOf.call(o.childNodes, e) + 1), d = a || c, p = c ? e.nodeValue?.length ?? 0 : a ? s?.startOffset ?? null : null, u = e.nodeValue ?? "";
  let f = 0, y = !1;
  const x = document.createDocumentFragment();
  let b = null, C = 0;
  const S = ($, M) => {
    b || (b = $, C = M);
  };
  t.lastIndex = 0;
  for (const $ of u.matchAll(t)) {
    const M = $[0], O = $.index, h = n[M];
    if (O === void 0)
      continue;
    const T = h ? be(h, l) : Rn(M);
    if (!T)
      continue;
    y = !0;
    const z = document.createTextNode(u.slice(f, O));
    p !== null && p >= f && p <= O && S(z, p - f), x.append(z);
    const Y = jn(M, T, l);
    x.append(Y), p !== null && p > O && p <= O + M.length && S(o, Array.prototype.indexOf.call(o.childNodes, e) + x.childNodes.length), f = O + M.length;
  }
  if (!y)
    return;
  const I = document.createTextNode(u.slice(f));
  if (p !== null && p >= f && S(I, p - f), x.append(I), e.replaceWith(x), d && b) {
    const $ = document.createRange();
    $.setStart(b, C), $.collapse(!0), r?.removeAllRanges(), r?.addRange($);
  }
}
function Ft(e, t, n, l) {
  const o = bn(t);
  if (o)
    for (const r of kn(e, l))
      In(r, o, t, n);
}
const Ve = /* @__PURE__ */ new WeakMap();
async function We(e, t = {}) {
  const n = (Ve.get(e) ?? 0) + 1;
  Ve.set(e, n);
  const l = await ie(t);
  Ve.get(e) !== n || !e.isConnected || Ft(e, l, t, !1);
}
async function Nn(e, t) {
  const n = It(t.binding);
  if (!n)
    return;
  t.version += 1;
  const l = t.version, o = await ie(n);
  ue.get(e)?.version !== l || !e.isConnected || Nt(e) || Ft(e, o, n, !0);
}
function Ge(e, t) {
  t.renderQueued || (t.renderQueued = !0, t.renderFrame = window.requestAnimationFrame(() => {
    t.renderQueued = !1, t.renderFrame = null, Nn(e, t).catch((n) => {
      console.warn("[win-55-ui] Could not render custom emoji.", n);
    });
  }));
}
function Fn(e, t) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !t.clipboardData || Nt(e))
    return;
  const l = n.getRangeAt(0);
  if (!l.intersectsNode(e))
    return;
  const o = l.cloneContents(), r = Z(o);
  r && (t.clipboardData.setData("text/plain", r), t.preventDefault());
}
function Ln(e, t) {
  const n = new MutationObserver(() => {
    Ge(e, t);
  });
  return n.observe(e, {
    characterData: !0,
    childList: !0,
    subtree: !0
  }), n;
}
const $n = {
  mounted(e, t) {
    const n = {
      binding: t,
      copyHandler: (l) => Fn(e, l),
      observer: null,
      renderFrame: null,
      renderQueued: !1,
      version: 0
    };
    n.observer = Ln(e, n), ue.set(e, n), e.addEventListener("copy", n.copyHandler), Ge(e, n);
  },
  updated(e, t) {
    const n = ue.get(e);
    n && (n.binding = t, Ge(e, n));
  },
  unmounted(e) {
    const t = ue.get(e);
    t && (t.observer?.disconnect(), t.renderFrame !== null && window.cancelAnimationFrame(t.renderFrame), e.removeEventListener("copy", t.copyHandler)), ue.delete(e);
  }
};
function Mn(e) {
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
    for (const [y, x] of d) {
      const b = u + y, C = f + x;
      b >= 0 && b < n && C >= 0 && C < l && !a[C][b] && s(b, C) === 0 && (a[C][b] = !0, c.push({ x: b, y: C }));
    }
  }
  const p = Array.from({ length: l }, () => Array(n).fill(!1));
  for (let u = 0; u < l; u++)
    for (let f = 0; f < n; f++) {
      if (s(f, u) === 0) continue;
      let y = !1;
      for (const [x, b] of d) {
        const C = f + x, S = u + b;
        if (C < 0 || S < 0 || C >= n || S >= l) {
          y = !0;
          break;
        }
        if (s(C, S) === 0 && a[S][C]) {
          y = !0;
          break;
        }
      }
      y && (p[u][f] = !0);
    }
  for (let u = 0; u < l; u++)
    for (let f = 0; f < n; f++)
      if (p[u][f]) {
        const y = (u * n + f) * 4;
        r[y] = 0, r[y + 1] = 0, r[y + 2] = 0;
      }
  t.putImageData(o, 0, 0);
}
const Do = $n, ht = typeof Intl.Segmenter == "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function Lt(e) {
  return ht ? Array.from(ht.segment(e), (t) => t.segment) : Array.from(e);
}
function gt(e) {
  return Lt(e).length;
}
function zn(e, t) {
  return Lt(e).slice(0, t).join("");
}
function Dn(e) {
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
  return r.remove(), a?.normalize(), Be(e, l), s;
}
const mt = "/win-55-ui/emoji/emoji-categories.json";
let _e = null;
async function qe() {
  return _e || (_e = fetch(mt).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${mt}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), _e;
}
async function On(e) {
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
async function Pn(e) {
  const t = e.trim().toLowerCase();
  if (!t)
    return;
  const l = (await qe()).find((o) => o.shortcodes.some((r) => r.toLowerCase() === t));
  return l ? { emoji: l.emoji, code: l.code } : void 0;
}
const $t = R(!1);
R({ x: 160, y: 120, width: 360, height: 420 });
const Mt = qt(null);
function pt(e) {
  Mt.value = e;
}
function Hn() {
  $t.value = !0;
}
let vt = 0;
function Vn(e) {
  const t = e[vt % e.length];
  return vt += 1, t;
}
const Wn = {
  key: 0,
  class: "baseinput-emoji-wrapper"
}, _n = ["src"], Yn = { class: "shortcode-suggestions" }, Un = {
  key: 0,
  class: "shortcode-suggestion-ellipsis"
}, Xn = ["src"], Gn = {
  key: 1,
  class: "shortcode-suggestion-ellipsis"
}, qn = "546", Se = 5, Kn = 200, Oo = /* @__PURE__ */ H({
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
    ], o = e, r = n, s = R(null), a = j(() => s.value?.el ?? null);
    fe(() => {
      a.value && o.modelValue && (a.value.innerText = o.modelValue);
    }), de(() => o.modelValue, (i) => {
      if (a.value && Z(a.value) !== i) {
        const g = document.activeElement === a.value, m = g ? ve(a.value) : null;
        a.value.innerText = i ?? "", g && Be(a.value, m);
      }
    });
    const c = () => {
      if (!a.value) return;
      let i = Z(a.value);
      if (o.multiline || (i = i.replace(/\n/g, "")), o.maxLength && gt(i) > o.maxLength) {
        i = zn(i, o.maxLength), a.value.innerText = i;
        const g = document.createRange(), m = window.getSelection();
        g.selectNodeContents(a.value), g.collapse(!1), m?.removeAllRanges(), m?.addRange(g);
      }
      Dt(), r("update:modelValue", i), Le();
    }, d = /:([A-Za-z0-9_+-]*)$/, p = /:([A-Za-z0-9_+-]{2,}):$/, u = R(!1), f = R(null), y = R([]), x = R(0), b = R(null);
    let C = 0;
    const S = R(0);
    function I(i) {
      i < S.value ? S.value = i : i > S.value + Se - 1 && (S.value = i - Se + 1);
    }
    const $ = j(() => {
      const i = S.value;
      return y.value.slice(i, i + Se).map((g, m) => ({ match: g, index: i + m }));
    }), M = j(() => S.value > 0), O = j(() => S.value + Se < y.value.length), h = () => {
      u.value = !1, f.value = null, y.value = [], x.value = 0, S.value = 0;
    }, T = (i, g) => {
      if (!a.value) return;
      const m = window.getSelection();
      if (!m || m.rangeCount === 0 || !m.isCollapsed) return;
      const w = m.getRangeAt(0), B = w.startContainer;
      if (!(B instanceof Text) || !a.value.contains(B)) return;
      const _ = w.startOffset, G = _ - i;
      if (G < 0) return;
      const te = B.nodeValue ?? "";
      Ce(), B.nodeValue = te.slice(0, G) + g + te.slice(_), ae(B, G + g.length), ce(), c(), We(a.value);
    }, z = () => {
      const i = y.value[x.value];
      !i || f.value === null || (T(1 + f.value.length, i.emoji), h());
    }, Y = R(null), N = { insertEmoji: (i) => {
      if (!a.value) return;
      const w = (document.activeElement === a.value ? ve(a.value) : null) ?? Y.value ?? gt(Z(a.value));
      Be(a.value, w, !0);
      const B = window.getSelection();
      if (!B || B.rangeCount === 0 || !B.isCollapsed) return;
      const _ = B.getRangeAt(0);
      Ce(), _.deleteContents();
      const G = document.createTextNode(i);
      _.insertNode(G), ae(G, G.length), ce(), c(), We(a.value);
    } }, U = R(!1), X = j(() => $t.value && Mt.value === N), W = j(() => o.showEmojiButton && (U.value || X.value)), J = R(l[0]), Ne = j(() => X.value ? qn : J.value), Fe = () => {
      J.value = Vn(l);
    };
    de(W, (i) => {
      i && Fe();
    });
    const Ee = () => {
      U.value = !0, pt(N);
    }, le = () => {
      pt(N), Hn();
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
      const w = (m.nodeValue ?? "").slice(0, g.startOffset), B = u.value ? f.value : null, _ = p.exec(w);
      if (_) {
        if (B === _[1]) {
          const st = await Pn(_[1]);
          st && T(_[0].length, st.emoji);
        }
        h();
        return;
      }
      const te = d.exec(w)?.[1] ?? null;
      if (te === null || te.length < 2) {
        h();
        return;
      }
      const me = Dn(a.value);
      if (!me) {
        h();
        return;
      }
      const rt = ++C, it = await On(te);
      if (rt !== C || it.length === 0) {
        rt === C && h();
        return;
      }
      f.value = te, y.value = it, x.value = 0, S.value = 0, b.value = { top: me.top, bottom: me.bottom, left: me.left, right: me.right }, u.value = !0;
    }, $e = [], Me = [];
    let ge = null, se = null;
    const ze = () => a.value ? { html: a.value.innerHTML, caret: ve(a.value) } : null, Ke = (i) => {
      a.value && (a.value.innerHTML = i.html, Be(a.value, i.caret, !0), c());
    }, Ce = () => {
      ge || (ge = ze()), Me.length = 0;
    }, ce = () => {
      se !== null && (clearTimeout(se), se = null), ge && ($e.push(ge), ge = null);
    }, Dt = () => {
      se !== null && clearTimeout(se), se = setTimeout(ce, Kn);
    }, Ot = () => {
      ce();
      const i = $e.pop();
      if (!i) return;
      const g = ze();
      g && Me.push(g), Ke(i);
    }, Pt = () => {
      const i = Me.pop();
      if (!i) return;
      const g = ze();
      g && $e.push(g), Ke(i);
    }, ae = (i, g) => {
      const m = document.createRange(), w = window.getSelection();
      a.value?.focus({ preventScroll: !0 }), m.setStart(i, g), m.collapse(!0), w?.removeAllRanges(), w?.addRange(m);
    }, Ht = (i) => i instanceof Text ? i.nodeValue?.length ?? 0 : i.childNodes.length, re = (i) => i.parentNode ? Array.prototype.indexOf.call(i.parentNode.childNodes, i) : 0, De = (i, g) => i instanceof Text ? g > 0 ? null : i.previousSibling ?? (i.parentNode && i.parentNode !== a.value ? De(i.parentNode, re(i.parentNode)) : null) : i.childNodes[g - 1] ?? (i.parentNode && i !== a.value ? De(i.parentNode, re(i)) : null), Oe = (i, g) => i instanceof Text ? g < (i.nodeValue?.length ?? 0) ? null : i.nextSibling ?? (i.parentNode && i.parentNode !== a.value ? Oe(i.parentNode, re(i.parentNode) + 1) : null) : i.childNodes[g] ?? (i.parentNode && i !== a.value ? Oe(i.parentNode, re(i) + 1) : null), Vt = (i, g) => {
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
    }, Je = (i) => {
      if (i.cloneContents().querySelector?.("[data-win55-emoji]"))
        return !0;
      const m = i.startContainer instanceof Element ? i.startContainer : i.startContainer.parentElement, w = i.endContainer instanceof Element ? i.endContainer : i.endContainer.parentElement;
      return !!(m?.closest("[data-win55-emoji]") || w?.closest("[data-win55-emoji]"));
    }, Qe = (i) => {
      if (!a.value) return;
      const g = i.startContainer, m = i.startOffset;
      i.deleteContents(), g.isConnected && a.value.contains(g) ? ae(g, Math.min(m, Ht(g))) : ae(a.value, a.value.childNodes.length), c();
    }, Wt = (i) => {
      const g = document.createRange();
      return g.setStart(i.startContainer, i.startOffset), g.setEnd(i.endContainer, i.endOffset), g;
    }, _t = (i) => i instanceof HTMLElement && i.hasAttribute("data-win55-emoji"), Yt = (i, g, m) => {
      if (!a.value || i.collapsed || i.startContainer !== i.endContainer || !(i.startContainer instanceof Text))
        return !1;
      const w = i.startContainer, B = w.nodeValue?.length ?? 0;
      if (i.startOffset !== 0 || i.endOffset !== B)
        return !1;
      const _ = g === "backward" ? w.previousSibling : w.nextSibling;
      if (!_t(_) || !w.parentNode)
        return !1;
      m();
      const G = w.parentNode, te = re(w);
      return w.remove(), ae(G, te), c(), !0;
    }, Ze = (i, g, m) => {
      const w = m === "backward" ? De(i, g) : Oe(i, g);
      return Vt(w, m);
    }, et = (i, g, m, w) => {
      const B = Ze(i, g, m);
      if (!B || !B.parentNode)
        return !1;
      w();
      const _ = B.parentNode, G = re(B);
      return B.remove(), ae(_, G), c(), !0;
    }, Ut = (i, g, m) => {
      if (!a.value || !a.value.contains(i.startContainer))
        return "none";
      const w = Wt(i);
      return w.collapsed ? et(
        i.startContainer,
        i.startOffset,
        g,
        m
      ) ? "deleted" : "none" : Je(w) ? (m(), Qe(w), "deleted") : Yt(w, g, m) ? "deleted" : Z(w.cloneContents()) ? "native" : "none";
    }, Xt = (i, g) => {
      if (!a.value) return !1;
      const m = window.getSelection();
      if (!m || m.rangeCount === 0)
        return !1;
      const w = m.getRangeAt(0);
      return a.value.contains(w.startContainer) ? m.isCollapsed ? et(
        w.startContainer,
        w.startOffset,
        i,
        g
      ) : Je(w) ? (g(), Qe(w), !0) : !1 : !1;
    }, Gt = (i) => {
      if (i.shiftKey || i.ctrlKey || i.metaKey || i.altKey || i.key !== "ArrowLeft" && i.key !== "ArrowRight" || !a.value) return !1;
      const g = window.getSelection();
      if (!g || g.rangeCount === 0 || !g.isCollapsed) return !1;
      const m = g.getRangeAt(0);
      if (!a.value.contains(m.startContainer)) return !1;
      const w = i.key === "ArrowLeft" ? "backward" : "forward", B = Ze(m.startContainer, m.startOffset, w);
      return !B || !B.parentNode ? !1 : (i.preventDefault(), ae(B.parentNode, re(B) + (w === "forward" ? 1 : 0)), !0);
    }, tt = (i) => {
      if (u.value) {
        if (i.key === "ArrowDown") {
          i.preventDefault(), x.value = (x.value + 1) % y.value.length, I(x.value);
          return;
        }
        if (i.key === "ArrowUp") {
          i.preventDefault(), x.value = (x.value - 1 + y.value.length) % y.value.length, I(x.value);
          return;
        }
        if (i.key === "Tab" || i.key === " " || i.key === "Enter") {
          i.preventDefault(), z();
          return;
        }
        if (i.key === "Escape") {
          i.preventDefault(), h();
          return;
        }
      }
      !o.multiline && i.key === "Enter" && i.preventDefault(), i.key === "Tab" && i.preventDefault(), Gt(i);
    }, nt = (i) => {
      if (!a.value) return;
      if (i.inputType === "historyUndo" || i.inputType === "historyRedo") {
        i.preventDefault(), i.inputType === "historyUndo" ? Ot() : Pt();
        return;
      }
      if (Ce(), i.inputType !== "deleteContentBackward" && i.inputType !== "deleteContentForward")
        return;
      if (Z(a.value) === "") {
        i.preventDefault(), a.value.focus({ preventScroll: !0 });
        return;
      }
      const g = i.inputType === "deleteContentBackward" ? "backward" : "forward", m = i.getTargetRanges();
      for (const w of m) {
        const B = Ut(
          w,
          g,
          () => i.preventDefault()
        );
        if (B === "deleted") {
          a.value.focus({ preventScroll: !0 });
          return;
        }
        if (B === "native")
          return;
      }
      Xt(g, () => i.preventDefault()) && a.value.focus({ preventScroll: !0 });
    }, ot = (i) => {
      i.preventDefault();
      let g = i.clipboardData?.getData("text/plain") ?? "";
      if (o.multiline || (g = g.replace(/\n/g, " ")), !a.value) return;
      Ce();
      const m = window.getSelection(), w = m?.getRangeAt(0);
      if (w) {
        w.deleteContents();
        const B = document.createTextNode(g);
        w.insertNode(B), w.collapse(!1), m?.removeAllRanges(), m?.addRange(w);
      }
      c(), ce(), We(a.value);
    }, lt = () => {
      ce(), h(), U.value = !1, a.value && (Y.value = ve(a.value)), a.value && Z(a.value) === "" && (a.value.innerHTML = "");
    }, at = j(() => ({
      ...o.extraStyles,
      ...Tt({ fontColor: "black" }),
      overflow: "auto",
      ...o.showEmojiButton ? { paddingRight: "34px" } : {}
    }));
    return t({ el: a }), (i, g) => (v(), E(P, null, [
      e.showEmojiButton ? (v(), E("div", Wn, [
        ne(ee, {
          ref_key: "boxRef",
          ref: s,
          type: e.boxType,
          contenteditable: !e.disabled,
          "extra-styles": at.value,
          "data-placeholder": e.placeholder,
          role: "textbox",
          "aria-multiline": e.multiline,
          "aria-disabled": e.disabled,
          onInput: c,
          onKeydown: tt,
          onBeforeinput: nt,
          onPaste: ot,
          onFocus: Ee,
          onBlur: lt
        }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"]),
        W.value ? (v(), E("img", {
          key: 0,
          src: we(be)(Ne.value),
          width: "30",
          height: "30",
          class: "baseinput-emoji-button",
          "data-emoji-picker-trigger": "",
          onMousedown: g[0] || (g[0] = je(() => {
          }, ["prevent"])),
          onClick: je(le, ["stop"])
        }, null, 40, _n)) : K("", !0)
      ])) : (v(), F(ee, {
        key: 1,
        ref_key: "boxRef",
        ref: s,
        type: e.boxType,
        contenteditable: !e.disabled,
        "extra-styles": at.value,
        "data-placeholder": e.placeholder,
        role: "textbox",
        "aria-multiline": e.multiline,
        "aria-disabled": e.disabled,
        onInput: c,
        onKeydown: tt,
        onBeforeinput: nt,
        onPaste: ot,
        onFocus: Ee,
        onBlur: lt
      }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"])),
      u.value && b.value ? (v(), F(nn, {
        key: 2,
        shown: !0,
        anchor: b.value,
        side: "top"
      }, {
        content: L(() => [
          k("div", Yn, [
            M.value ? (v(), E("div", Un, "...")) : K("", !0),
            (v(!0), E(P, null, Q($.value, ({ match: m, index: w }) => (v(), E("div", {
              key: m.shortcode,
              class: Ie(["shortcode-suggestion", { "shortcode-suggestion--selected": w === x.value }])
            }, [
              k("img", {
                src: we(be)(m.code),
                width: "30",
                height: "30",
                class: "shortcode-suggestion-image"
              }, null, 8, Xn),
              k("span", null, ":" + oe(m.shortcode) + ":", 1)
            ], 2))), 128)),
            O.value ? (v(), E("div", Gn, "...")) : K("", !0)
          ])
        ]),
        _: 1
      }, 8, ["anchor"])) : K("", !0)
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
    const n = e, l = t, o = R(!1), r = R(!1), s = j(() => !n.disabled && o.value && r.value), a = j(() => n.disabled), c = (b) => {
      n.disabled || b.button !== 0 || (o.value = !0, r.value = !0);
    }, d = () => {
      n.disabled || (r.value = !0);
    }, p = () => {
      r.value = !1;
    }, u = (b) => {
      n.disabled || b.button !== 0 || (o.value && r.value && l("click"), o.value = !1);
    };
    fe(() => {
      window.addEventListener("mouseup", u);
    }), he(() => {
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
    })), x = j(() => s.value ? "indent" : n.baseType);
    return (b, C) => (v(), F(ee, {
      type: x.value,
      "extra-styles": f.value,
      "extra-class": e.extraClass,
      onMousedown: c,
      onMouseenter: d,
      onMouseleave: p
    }, {
      default: L(() => [
        k("div", {
          style: D(y.value)
        }, [
          V(b.$slots, "default")
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"]));
  }
}), Jn = { style: { display: "flex", "align-items": "center" } }, Qn = ["src", "alt"], Zn = ["checked", "disabled", "value"], Po = /* @__PURE__ */ H({
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
    return (r, s) => (v(), E("div", {
      class: Ie(["checkbox-container", { disabled: e.disabled }]),
      style: D({
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
      k("div", Jn, [
        k("img", {
          draggable: "false",
          src: e.modelValue ? e.checkedIcon : e.uncheckedIcon,
          alt: e.modelValue ? "checked" : "unchecked"
        }, null, 8, Qn)
      ]),
      k("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, Zn),
      e.label ? (v(), E("span", {
        key: 0,
        style: D({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, oe(e.label), 5)) : K("", !0)
    ], 6));
  }
}), Ho = /* @__PURE__ */ H({
  __name: "HDivider",
  setup(e) {
    return (t, n) => (v(), F(ee, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), Vo = /* @__PURE__ */ H({
  __name: "MenuDropdown",
  setup(e) {
    return (t, n) => (v(), F(on, null, {
      trigger: L(() => [
        V(t.$slots, "trigger")
      ]),
      items: L(() => [
        ne(ee, { type: "panel-d-1" }, {
          default: L(() => [
            V(t.$slots, "items")
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), eo = { style: { display: "flex", "align-items": "center" } }, to = ["src"], no = ["src"], oo = ["checked", "disabled", "value", "name"], Wo = /* @__PURE__ */ H({
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
    return (s, a) => (v(), E("div", {
      class: Ie(["radio-container", { disabled: e.disabled }]),
      style: D({
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
      k("div", eo, [
        o.value ? (v(), E("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, to)) : (v(), E("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, no))
      ]),
      k("input", {
        type: "radio",
        checked: o.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, oo),
      e.label ? (v(), E("span", {
        key: 0,
        style: D({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, oe(e.label), 5)) : K("", !0)
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
      const o = Tt(t);
      return t.element || (o.display = "contents"), o;
    });
    return (o, r) => (v(), F(Kt(n.value), {
      style: D(l.value)
    }, {
      default: L(() => [
        V(o.$slots, "default")
      ]),
      _: 3
    }, 8, ["style"]));
  }
}), lo = { key: 1 }, ao = {
  key: 4,
  style: { "text-decoration": "underline" }
}, ro = {
  key: 5,
  style: { "text-decoration": "line-through" }
}, io = ["href"], so = ["aria-label", "data-win55-emoji"], co = ["src", "alt"], uo = /* @__PURE__ */ H({
  __name: "RichTextNode",
  props: {
    node: {},
    allowLinks: { type: Boolean, default: !1 }
  },
  setup(e) {
    return (t, n) => {
      const l = Jt("RichTextNode", !0);
      return e.node.type === "text" ? (v(), E(P, { key: 0 }, [
        xe(oe(e.node.value), 1)
      ], 64)) : e.node.type === "break" ? (v(), E("br", lo)) : e.node.type === "bold" ? (v(), F(ye, {
        key: 2,
        "is-bold": ""
      }, {
        default: L(() => [
          (v(!0), E(P, null, Q(e.node.children, (o, r) => (v(), F(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks
          }, null, 8, ["node", "allow-links"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "italic" ? (v(), F(ye, {
        key: 3,
        "is-italic": ""
      }, {
        default: L(() => [
          (v(!0), E(P, null, Q(e.node.children, (o, r) => (v(), F(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks
          }, null, 8, ["node", "allow-links"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "underline" ? (v(), E("span", ao, [
        (v(!0), E(P, null, Q(e.node.children, (o, r) => (v(), F(l, {
          key: r,
          node: o,
          "allow-links": e.allowLinks
        }, null, 8, ["node", "allow-links"]))), 128))
      ])) : e.node.type === "strike" ? (v(), E("span", ro, [
        (v(!0), E(P, null, Q(e.node.children, (o, r) => (v(), F(l, {
          key: r,
          node: o,
          "allow-links": e.allowLinks
        }, null, 8, ["node", "allow-links"]))), 128))
      ])) : e.node.type === "color" ? (v(), F(ye, {
        key: 6,
        "font-color": e.node.value
      }, {
        default: L(() => [
          (v(!0), E(P, null, Q(e.node.children, (o, r) => (v(), F(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks
          }, null, 8, ["node", "allow-links"]))), 128))
        ]),
        _: 1
      }, 8, ["font-color"])) : e.node.type === "size" ? (v(), F(ye, {
        key: 7,
        "font-size": e.node.value
      }, {
        default: L(() => [
          (v(!0), E(P, null, Q(e.node.children, (o, r) => (v(), F(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks
          }, null, 8, ["node", "allow-links"]))), 128))
        ]),
        _: 1
      }, 8, ["font-size"])) : e.node.type === "url" && e.allowLinks ? (v(), E("a", {
        key: 8,
        href: e.node.href,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "richtext-link"
      }, [
        (v(!0), E(P, null, Q(e.node.children, (o, r) => (v(), F(l, {
          key: r,
          node: o,
          "allow-links": e.allowLinks
        }, null, 8, ["node", "allow-links"]))), 128))
      ], 8, io)) : e.node.type === "url" ? (v(!0), E(P, { key: 9 }, Q(e.node.children, (o, r) => (v(), F(l, {
        key: r,
        node: o,
        "allow-links": e.allowLinks
      }, null, 8, ["node", "allow-links"]))), 128)) : e.node.type === "emoji" ? (v(), E("span", {
        key: 10,
        class: "win55-emoji",
        role: "img",
        "aria-label": e.node.emoji,
        "data-win55-emoji": e.node.emoji,
        style: { "--win55-emoji-size": "30px" }
      }, [
        k("img", {
          class: "win55-emoji-image",
          src: we(be)(e.node.code),
          alt: e.node.emoji,
          draggable: "false"
        }, null, 8, co)
      ], 8, so)) : K("", !0);
    };
  }
}), fo = {
  b: "bold",
  i: "italic",
  u: "underline",
  s: "strike",
  strike: "strike",
  color: "color",
  size: "size",
  url: "url"
}, ho = /* @__PURE__ */ new Set(["br"]), yt = {
  normal: 12,
  big: 24
};
function zt(e) {
  return e.map((t) => t.type === "text" ? t.value : t.type === "emoji" ? t.emoji : t.type === "break" ? `
` : zt(t.children)).join("");
}
function wt(e) {
  switch (e.tagType) {
    case "color":
      return { type: "color", value: e.value ?? "inherit", children: e.children };
    case "size": {
      const t = (e.value ?? "").trim().toLowerCase(), n = yt[t], l = Number.parseInt(e.value ?? "", 10);
      return { type: "size", value: n ?? (Number.isFinite(l) ? l : yt.normal), children: e.children };
    }
    case "url":
      return {
        type: "url",
        href: e.value ?? zt(e.children).trim(),
        children: e.children
      };
    default:
      return { type: e.tagType, children: e.children };
  }
}
function go(e, t) {
  for (let n = e.length - 1; n >= 0; n--)
    if (e[n].tagType === t) return n;
  return -1;
}
function mo(e, t) {
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
function po(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const xt = /* @__PURE__ */ new WeakMap();
function vo(e) {
  const t = xt.get(e);
  if (t !== void 0) return t;
  const n = Object.keys(e).sort((o, r) => r.length - o.length).map(po), l = n.length > 0 ? new RegExp(n.join("|"), "gu") : null;
  return xt.set(e, l), l;
}
function yo(e, t) {
  if (!t) return [{ type: "text", value: e }];
  const n = vo(t);
  if (!n) return [{ type: "text", value: e }];
  const l = [];
  let o = 0, r;
  for (n.lastIndex = 0; r = n.exec(e); ) {
    const s = r[0], a = t[s];
    r.index > o && l.push({ type: "text", value: e.slice(o, r.index) }), l.push({ type: "emoji", emoji: s, code: a }), o = r.index + s.length;
  }
  return o < e.length && l.push({ type: "text", value: e.slice(o) }), l.length > 0 ? l : [{ type: "text", value: e }];
}
function wo(e, t, n) {
  const l = [];
  for (const o of mo(e, t))
    o.type === "text" ? l.push(...yo(o.value, n)) : l.push(o);
  return l;
}
function xo(e, t, n = null) {
  const l = [], o = [], r = /\[(\/?)(\w+)(?:=([^\]]*))?\]/g;
  let s = 0, a;
  const c = () => o.length ? o[o.length - 1].children : l, d = (p) => c().push(...wo(p, t, n));
  for (; a = r.exec(e); ) {
    const [p, u, f, y] = a, x = f.toLowerCase();
    if (ho.has(x)) {
      d(e.slice(s, a.index)), s = a.index + p.length, c().push({ type: "break" });
      continue;
    }
    const b = fo[x];
    if (!b) continue;
    if (d(e.slice(s, a.index)), s = a.index + p.length, !u) {
      o.push({ tagType: b, value: y, children: [] });
      continue;
    }
    const C = go(o, b);
    if (C === -1) {
      d(p);
      continue;
    }
    for (; o.length > C + 1; ) {
      const I = o.pop();
      o[o.length - 1].children.push(wt(I));
    }
    const S = o.pop();
    c().push(wt(S));
  }
  for (d(e.slice(s)); o.length; ) {
    const p = o.pop();
    (o.length ? o[o.length - 1].children : l).push(...p.children);
  }
  return l;
}
const bo = {
  "data-win55-richtext": "",
  style: { display: "contents" }
}, _o = /* @__PURE__ */ H({
  __name: "RichText",
  props: {
    allowLinks: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = Et(), l = R(null), o = R(null);
    qe().then((c) => {
      const d = /* @__PURE__ */ new Map();
      for (const p of c)
        for (const u of p.shortcodes)
          d.set(u.toLowerCase(), { emoji: p.emoji, code: p.code });
      l.value = d;
    }), ie().then((c) => {
      o.value = c;
    });
    const r = j(() => {
      const c = l.value;
      return c ? { get: (d) => c.get(d) } : null;
    });
    function s(c) {
      return c.map((d) => typeof d.children == "string" ? d.children : Array.isArray(d.children) ? s(d.children) : "").join("");
    }
    const a = j(() => xo(s(n.default?.() ?? []), r.value, o.value));
    return (c, d) => (v(), E("span", bo, [
      (v(!0), E(P, null, Q(a.value, (p, u) => (v(), F(uo, {
        key: u,
        node: p,
        "allow-links": t.allowLinks
      }, null, 8, ["node", "allow-links"]))), 128))
    ]));
  }
});
function Eo(e, t, n, l, o) {
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
  ], c = bt(l), d = bt(o), p = Math.floor(t / s), u = Math.floor(n / s);
  e.width = Math.floor(t * 2) / 2, e.height = Math.floor(n * 2) / 2;
  for (let f = 0; f < u; f++)
    for (let y = 0; y < p; y++) {
      const x = y * s, b = f * s, C = (y + f) / (p + u - 6), S = (a[f % 8][y % 8] + 0.5) / 64, I = C > S ? 1 : 0, $ = Math.round(c.r * (1 - I) + d.r * I), M = Math.round(c.g * (1 - I) + d.g * I), O = Math.round(c.b * (1 - I) + d.b * I);
      r.fillStyle = `rgb(${$}, ${M}, ${O})`, r.fillRect(x, b, s, s);
    }
}
function bt(e) {
  const t = e.replace("#", ""), n = parseInt(t, 16);
  return {
    r: n >> 16 & 255,
    g: n >> 8 & 255,
    b: n & 255
  };
}
const Co = { style: { height: "0", overflow: "visible" } }, ko = { class: "titlebar-content" }, So = { class: "titlebar-image" }, To = ["src"], Bo = { class: "titlebar-text" }, Ro = { class: "titlebar-buttons" }, Ao = /* @__PURE__ */ H({
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
    const t = e, n = R(null);
    let l = null;
    function o(s, a) {
      const c = t.gradientColorA || "5555ff", d = t.gradientColorB || "0000aa";
      Eo(s, s.width, s.height, c, d), a.fillStyle = "#555555", a.fillRect(0, s.height - 2, Math.floor(s.width / 2) * 2, 4);
    }
    function r() {
      const s = n.value;
      if (!s) return;
      const a = s.getContext("2d");
      if (!a) return;
      const c = s.getBoundingClientRect(), d = Math.floor(c.width * 2) / 2, p = Math.floor(c.height * 2) / 2;
      (s.width !== d || s.height !== p) && (s.width = d, s.height = p), o(s, a);
    }
    return de(() => [t.gradientColorA, t.gradientColorB], () => {
      if (n.value) {
        const s = n.value.getContext("2d");
        s && o(n.value, s);
      }
    }), fe(() => {
      r(), n.value && (l = new ResizeObserver(() => {
        r();
      }), l.observe(n.value));
    }), he(() => {
      l?.disconnect();
    }), (s, a) => (v(), E("div", null, [
      k("div", Co, [
        k("canvas", {
          ref_key: "canvasRef",
          ref: n,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      k("div", ko, [
        k("div", So, [
          k("img", {
            src: e.icon ?? "/win-55-ui/icons/program.png"
          }, null, 8, To)
        ]),
        k("div", Bo, [
          ne(ye, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: L(() => [
              xe(oe(e.title), 1)
            ]),
            _: 1
          })
        ]),
        k("div", Ro, [
          V(s.$slots, "buttons"),
          e.placeholderButtons ? (v(), E(P, { key: 0 }, [
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
          ], 64)) : K("", !0)
        ])
      ])
    ]));
  }
}), Yo = /* @__PURE__ */ H({
  __name: "Tooltip",
  props: {
    text: {},
    offsetX: {},
    offsetY: {}
  },
  setup(e) {
    const t = e, n = R(!1), l = Qt({ x: 0, y: 0 });
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
    return he(() => {
      o !== null && clearTimeout(o);
    }), (d, p) => (v(), E("span", {
      onMouseenter: r,
      onMouseleave: s,
      onMousemove: a,
      style: { position: "relative", display: "inline-block" }
    }, [
      V(d.$slots, "default"),
      n.value ? (v(), F(ee, {
        key: 0,
        style: D(c.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: L(() => [
          xe(oe(t.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : K("", !0)
    ], 32));
  }
}), jo = {
  class: "window-container",
  style: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%"
  }
}, Te = 6, Uo = /* @__PURE__ */ H({
  __name: "Window",
  props: /* @__PURE__ */ St({
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
    let p = !1, u = !1, f = "", y = "", x = 0, b = 0, C = 0, S = 0, I = 0, $ = 0;
    const M = R("default");
    function O(A) {
      if (t.faux || f) return;
      const N = A.target;
      N.closest(".titlebar-image") || N.closest(".titlebar-buttons") || (p = !0, x = A.clientX, b = A.clientY, I = n.value, $ = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", T), window.addEventListener("mouseup", z));
    }
    function h(A) {
      t.faux || f && (!c && !d || (u = !0, y = f, x = A.clientX, b = A.clientY, C = o.value, S = r.value, I = n.value, $ = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", T), window.addEventListener("mouseup", z)));
    }
    function T(A) {
      if (t.faux) return;
      const N = A.clientX - x, U = A.clientY - b;
      if (p && (n.value = I + N, l.value = $ + U), u) {
        const X = y;
        if (c && X.includes("e") && (o.value = Math.max(s, C + N)), d && X.includes("s") && (r.value = Math.max(a, S + U)), c && X.includes("w")) {
          const W = C - N, J = Math.max(s, W);
          o.value = J, n.value = I + (C - J);
        }
        if (d && X.includes("n")) {
          const W = S - U, J = Math.max(a, W);
          r.value = J, l.value = $ + (S - J);
        }
      }
    }
    function z() {
      p = !1, u = !1, y = "", document.body.style.userSelect = "", window.removeEventListener("mousemove", T), window.removeEventListener("mouseup", z);
    }
    function Y(A) {
      if (t.faux) {
        f = "", M.value = "default";
        return;
      }
      if (u) return;
      const N = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableHorizontally ?? !1), U = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableVertically ?? !1);
      if (!N && !U) {
        f = "", M.value = "default";
        return;
      }
      const W = A.currentTarget.getBoundingClientRect(), J = A.clientX - W.left, Ne = W.right - A.clientX, Fe = A.clientY - W.top, Ee = W.bottom - A.clientY;
      let le = "";
      U && (Fe < Te ? le += "n" : Ee < Te && (le += "s")), N && (J < Te ? le += "w" : Ne < Te && (le += "e")), f = le;
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
    return de(() => [t.resizable, t.resizableHorizontally, t.resizableVertically], () => {
      const A = document.querySelector(`[data-v-${Math.random().toString(36).substr(2, 9)}]`);
      if (A) {
        const N = A.getBoundingClientRect(), U = N.left + N.width / 2, X = N.top + N.height / 2;
        Y({
          currentTarget: A,
          clientX: U,
          clientY: X
        });
      }
    }, { immediate: !0 }), (A, N) => (v(), F(ee, {
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
      onMousemove: Y,
      onMousedown: h
    }, {
      default: L(() => [
        k("div", jo, [
          k("div", {
            class: "titlebar-wrapper",
            onMousedown: je(O, ["stop"]),
            style: { height: "34px" }
          }, [
            ne(Ao, {
              title: e.title,
              icon: e.icon,
              "placeholder-buttons": e.placeholderButtons,
              disabled: e.disabled,
              "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
              "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
            }, {
              buttons: L(() => [
                V(A.$slots, "titlebar-buttons")
              ]),
              _: 3
            }, 8, ["title", "icon", "placeholder-buttons", "disabled", "gradient-color-a", "gradient-color-b"])
          ], 32),
          k("div", {
            class: "inner-container",
            style: D({
              flex: "1",
              overflowX: t.overflowX ?? "auto",
              overflowY: t.overflowY ?? "auto",
              margin: "2px",
              marginTop: "0",
              boxSizing: "border-box"
            })
          }, [
            V(A.$slots, "default")
          ], 4)
        ])
      ]),
      _: 3
    }, 8, ["extra-class", "extra-styles"]));
  }
}), Io = /* @__PURE__ */ H({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" }
  },
  setup(e) {
    return (t, n) => (v(), F(ee, {
      type: "border-groove",
      "extra-styles": { padding: "10px", margin: "10px" }
    }, {
      default: L(() => [
        k("div", {
          class: "label",
          style: D({ backgroundColor: e.backgroundColorHint })
        }, oe(e.label), 5),
        V(t.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }));
  }
}), No = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [l, o] of t)
    n[l] = o;
  return n;
}, Xo = /* @__PURE__ */ No(Io, [["__scopeId", "data-v-9a25af1b"]]), Go = (e, t = 30, n = 48, l = 30) => {
  const o = R(
    Array.from({ length: e }, (c, d) => ({
      sin: Math.sin(0 + d * Math.PI * 2 / e),
      cos: Math.cos(0 + d * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let r, s = 0;
  const a = () => {
    const c = Date.now();
    if (c - s >= 1e3 / t) {
      const d = Array.from({ length: e }, (y, x) => ({
        sin: Math.sin(c / (1e3 + x * 200) + x * Math.PI * 2 / e),
        cos: Math.cos(c / (3e3 + x * 400) + x * Math.PI * 2 / e + Math.PI / 4)
      })), p = d.map((y) => n + y.sin * l), u = e * n, f = p.reduce((y, x) => y + x, 0);
      if (f > 0) {
        const y = u / f, x = d.map((b) => ({
          sin: ((n + b.sin * l) * y - n) / l,
          cos: b.cos
        }));
        o.value = x;
      } else
        o.value = d;
      s = c;
    }
    r = requestAnimationFrame(a);
  };
  return fe(() => {
    r = requestAnimationFrame(a);
  }), he(() => {
    cancelAnimationFrame(r);
  }), { values: o };
};
function qo(e) {
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
  nn as Balloon,
  on as BaseDropdown,
  Oo as BaseInput,
  ee as Box,
  Ye as Button,
  Po as Checkbox,
  Ho as HDivider,
  Vo as MenuDropdown,
  Xo as NamedPanel,
  Wo as RadioButton,
  _o as RichText,
  Ao as Titlebar,
  Yo as Tooltip,
  ye as Typography,
  Uo as Window,
  Do as customEmojiDirective,
  Eo as drawAngledBayerDitherGradient,
  $n as emojiDirective,
  $o as getEmojiGifPath,
  be as getEmojiGifPathFromCode,
  Mo as getEmojiRegistry,
  ve as getSelectionOffset,
  Z as getTextWithCustomEmoji,
  zo as hasEmoji,
  ie as loadEmojiRegistry,
  qo as registerGlobalImageErrorHandler,
  Lo as resetEmojiRegistryCache,
  Be as restoreSelectionOffset,
  Tt as typographyStyles,
  Go as useSineWave
};
