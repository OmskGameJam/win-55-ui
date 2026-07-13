import { defineComponent as V, ref as T, computed as j, openBlock as m, createElementBlock as b, normalizeStyle as D, normalizeClass as Ce, renderSlot as W, useModel as Ee, useSlots as At, watch as ue, nextTick as zt, onMounted as de, onUnmounted as fe, createBlock as z, Teleport as Qe, createElementVNode as k, createVNode as _, withCtx as $, unref as H, Fragment as O, createTextVNode as we, toDisplayString as oe, createCommentVNode as J, mergeModels as It, withModifiers as Ne, shallowRef as en, renderList as K, resolveDynamicComponent as tn, resolveComponent as nn, reactive as on } from "vue";
const ee = /* @__PURE__ */ V({
  __name: "Box",
  props: {
    type: {},
    extraStyles: {},
    extraClass: {}
  },
  setup(e, { expose: t }) {
    const n = e, l = T(null), o = j(() => ({
      "--img": `url(/win-55-ui/${n.type}.png)`,
      ...n.extraStyles
    }));
    return t({ el: l }), (r, s) => (m(), b("div", {
      ref_key: "rootRef",
      ref: l,
      class: Ce(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: D(o.value)
    }, [
      W(r.$slots, "default")
    ], 6));
  }
}), ln = { class: "balloon-tip-box" }, an = {
  key: 1,
  class: "balloon-wrapper"
}, rn = { class: "balloon-tip-box" }, Te = 8, sn = /* @__PURE__ */ V({
  __name: "Balloon",
  props: /* @__PURE__ */ It({
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
    const t = Ee(e, "shown");
    function n(g) {
      return "top" in g;
    }
    function l(g) {
      return n(g) ? g : { top: g.y, bottom: g.y, left: g.x, right: g.x };
    }
    const o = e, r = At(), s = j(() => o.side ?? "top"), a = j(() => o.bias), u = T(s.value), d = j(() => o.anchor ? u.value : s.value), f = j(() => {
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
    }), h = j(() => {
      let g = "", B = !1;
      switch (d.value) {
        case "top":
          g = "rotate(0deg)", a.value === "right" && (B = !0);
          break;
        case "bottom":
          g = "rotate(180deg)", a.value === "left" && (B = !0);
          break;
        case "left":
          g = "rotate(-90deg)";
          break;
        case "right":
          g = "rotate(90deg)", B = !0;
          break;
      }
      return B ? `${g} scaleX(-1)` : g;
    }), y = j(() => {
      const g = {};
      return a.value ? ((d.value === "top" || d.value === "bottom") && (a.value === "left" && (g.transform = "translateX(calc(-50% + 28px))"), a.value === "right" && (g.transform = "translateX(calc(50% - 28px))")), (d.value === "left" || d.value === "right") && (a.value === "up" && (g.transform = "translateY(calc(-50% + 28px))"), a.value === "down" && (g.transform = "translateY(calc(50% - 28px))")), g) : {};
    }), x = T(null), E = T(null), C = { top: "bottom", bottom: "top", left: "right", right: "left" }, S = {
      top: ["left", "right"],
      bottom: ["left", "right"],
      left: ["top", "bottom"],
      right: ["top", "bottom"]
    };
    function I(g, B, M) {
      const X = (B.left + B.right) / 2, A = (B.top + B.bottom) / 2;
      return g === "top" || g === "bottom" ? {
        top: g === "top" ? B.top - M.height : B.bottom,
        left: X - M.width / 2
      } : {
        left: g === "left" ? B.left - M.width : B.right,
        top: A - M.height / 2
      };
    }
    function F(g, B, M, X) {
      return g.top >= Te && g.left >= Te && g.top + B.height <= X - Te && g.left + B.width <= M - Te;
    }
    function L() {
      const g = x.value;
      if (!o.anchor || !g) return;
      const B = l(o.anchor), M = g.getBoundingClientRect(), X = window.innerWidth, A = window.innerHeight, N = o.side ?? "top", q = [
        N,
        C[N],
        ...S[N]
      ].find((U) => F(I(U, B, M), M, X, A)) ?? N;
      u.value = q, E.value = I(q, B, M);
    }
    ue(
      [() => o.anchor, t],
      async ([g, B]) => {
        !g || !B || (await zt(), L());
      },
      { deep: !0, immediate: !0 }
    );
    const P = () => {
      o.anchor && t.value && L();
    };
    return de(() => {
      window.addEventListener("resize", P), window.addEventListener("scroll", P, !0);
    }), fe(() => {
      window.removeEventListener("resize", P), window.removeEventListener("scroll", P, !0);
    }), (g, B) => e.anchor ? (m(), z(Qe, {
      key: 0,
      to: "body"
    }, [
      t.value ? (m(), b("div", {
        key: 0,
        ref_key: "anchoredRef",
        ref: x,
        class: "balloon-anchored",
        style: D({
          top: (E.value?.top ?? 0) + "px",
          left: (E.value?.left ?? 0) + "px"
        })
      }, [
        k("div", {
          class: "balloon-inner",
          style: D({ flexDirection: c.value })
        }, [
          k("div", {
            class: "balloon-box-wrapper",
            style: D(y.value)
          }, [
            _(ee, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: $(() => [
                H(r).content ? W(g.$slots, "content", { key: 0 }) : (m(), b(O, { key: 1 }, [
                  we(oe(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          k("div", ln, [
            k("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: D({ transform: h.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : J("", !0)
    ])) : (m(), b("div", an, [
      W(g.$slots, "default"),
      t.value ? (m(), b("div", {
        key: 0,
        class: "balloon",
        style: D(f.value)
      }, [
        k("div", {
          class: "balloon-inner",
          style: D({ flexDirection: c.value })
        }, [
          k("div", {
            class: "balloon-box-wrapper",
            style: D(y.value)
          }, [
            _(ee, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: $(() => [
                H(r).content ? W(g.$slots, "content", { key: 0 }) : (m(), b(O, { key: 1 }, [
                  we(oe(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          k("div", rn, [
            k("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: D({ transform: h.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : J("", !0)
    ]));
  }
}), cn = /* @__PURE__ */ V({
  __name: "BaseDropdown",
  props: {
    matchTriggerWidth: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = T(!1), l = T(null), o = T(null), r = T(null), s = () => {
      const f = o.value, c = r.value;
      if (!f || !c) return;
      const h = f.getBoundingClientRect(), y = window.innerHeight, x = c.offsetHeight;
      let E = h.bottom + window.scrollY;
      const C = h.left + window.scrollX;
      h.bottom + x > y && (E = h.top + window.scrollY - x), l.value = {
        top: E,
        left: C,
        width: t.matchTriggerWidth ? h.width : void 0
      };
    };
    ue(n, async (f) => {
      f && (await zt(), s());
    });
    const a = () => {
      n.value && s();
    }, u = (f) => {
      if (!n.value) return;
      const c = f.target;
      o.value?.contains(c) || r.value?.contains(c) || (n.value = !1);
    };
    de(() => {
      window.addEventListener("resize", a), window.addEventListener("scroll", a), document.addEventListener("click", u);
    }), fe(() => {
      window.removeEventListener("resize", a), window.removeEventListener("scroll", a), document.removeEventListener("click", u);
    });
    const d = () => {
      n.value = !n.value;
    };
    return (f, c) => (m(), b(O, null, [
      k("div", {
        ref_key: "triggerRef",
        ref: o,
        style: { display: "inline-block" },
        onClick: Ne(d, ["stop"])
      }, [
        W(f.$slots, "trigger")
      ], 512),
      (m(), z(Qe, { to: "body" }, [
        n.value ? (m(), b("div", {
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
          W(f.$slots, "items")
        ], 4)) : J("", !0)
      ]))
    ], 64));
  }
}), un = [10, 12, 14, 16, 24], dn = [
  { style: "Regular", size: 12 },
  { style: "Bold", size: 12 },
  { style: "Regular", size: 24 }
], fn = {
  BoldItalic: ["BoldItalic", "Bold", "Italic", "Regular"],
  Bold: ["Bold", "Regular"],
  Italic: ["Italic", "Regular"],
  Regular: ["Regular"]
};
function mt(e) {
  return dn.filter((t) => t.style === e).map((t) => t.size);
}
function hn(e, t) {
  const n = fn[e] ?? ["Regular"];
  for (const l of n)
    if (mt(l).includes(t))
      return { style: l, size: t };
  for (const l of n) {
    const o = mt(l);
    if (o.length > 0)
      return { style: l, size: Nt(t, o) };
  }
  return { style: "Regular", size: t };
}
function $t(e) {
  const { style: t, size: n } = e.shorthand ? gn(e.shorthand) : {
    style: mn(e.isBold, e.isItalic),
    size: Nt(e.fontSize ?? 12, un)
  }, { style: l, size: o } = hn(t, n), r = {
    fontFamily: `${l}${o}, Arial, sans`,
    fontSize: `${o * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (r.textShadow = `2px 2px 0 ${e.fontShadowColor}`), r;
}
function mn(e, t) {
  return e && t ? "BoldItalic" : e ? "Bold" : t ? "Italic" : "Regular";
}
function gn(e) {
  const t = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!t)
    throw new Error(`Invalid shorthand format: ${e}`);
  const n = t[1], l = parseInt(t[2], 10);
  return { style: n, size: l };
}
function Nt(e, t) {
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
function Ft(e, t) {
  if (e instanceof Text) {
    const o = e.nodeValue?.length ?? 0;
    return t <= o ? { node: e, offset: t, remaining: 0 } : { node: e, offset: o, remaining: t - o };
  }
  if (e instanceof Element) {
    const o = e.getAttribute("data-win55-emoji");
    if (o)
      return t <= 0 ? { node: e.parentNode ?? e, offset: We(e), remaining: 0 } : t <= o.length ? { node: e.parentNode ?? e, offset: We(e) + 1, remaining: 0 } : {
        node: e.parentNode ?? e,
        offset: We(e) + 1,
        remaining: t - o.length
      };
  }
  let n = t, l = {
    offset: e.childNodes.length,
    remaining: n
  };
  for (const o of Array.from(e.childNodes)) {
    const r = Ft(o, n);
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
function We(e) {
  return e.parentNode ? Array.prototype.indexOf.call(e.parentNode.childNodes, e) : 0;
}
function Ae(e, t, n = !1) {
  if (t === null || !e.isConnected)
    return;
  const l = Ft(e, t);
  if (!l)
    return;
  const o = document.createRange(), r = window.getSelection();
  n && e.focus({ preventScroll: !0 }), o.setStart(l.node, l.offset), o.collapse(!0), r?.removeAllRanges(), r?.addRange(o);
}
const Lt = "/win-55-ui/emoji", Ue = `${Lt}/emoji-registry.csv`;
let ze = null, qe = null, Ie = null;
function vn(e) {
  return e.replace(/\/$/, "");
}
function Mt(e) {
  return e.trim().replace(/\.gif$/i, "");
}
function pn(e) {
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
    const a = r.slice(0, s).trim(), u = Mt(r.slice(s + 1));
    a && u && (t[a] = u);
  }
  return t;
}
async function he(e = {}) {
  const t = e.registryUrl ?? Ue;
  return Ie && t === Ue ? Ie : ((!ze || qe !== t) && (qe = t, ze = fetch(t).then((n) => {
    if (!n.ok)
      throw new Error(
        `Could not load emoji registry from ${t}: ${n.status} ${n.statusText}`
      );
    return n.text();
  }).then(pn).then((n) => (t === Ue && (Ie = n), n))), ze);
}
function Go() {
  ze = null, qe = null, Ie = null;
}
async function qo(e, t = {}) {
  const l = (await he(t))[e];
  return l ? ie(l, t) : null;
}
function ie(e, t = {}) {
  return `${vn(t.basePath ?? Lt)}/${Mt(e)}.gif`;
}
async function Ko(e = {}) {
  return he(e);
}
async function Jo(e, t = {}) {
  const n = await he(t);
  return e in n;
}
he();
function yn(e) {
  return e.map((t) => {
    const n = parseInt(t.replace(/^#/, ""), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  });
}
function wn(e, t, n, l) {
  let o = 1 / 0, r = [0, 0, 0];
  for (const s of l) {
    const a = e - s[0], u = t - s[1], d = n - s[2], f = a * a + u * u + d * d;
    f < o && (o = f, r = s);
  }
  return r;
}
const xn = "win55-emoji", bn = "win55-emoji-image", Z = 15, Ke = 2, En = [
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
], kn = yn(En), gt = [
  "[\\u{1F1E6}-\\u{1F1FF}]{2}",
  "[0-9#*]\\uFE0F?\\u20E3",
  "\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?)*",
  "\\p{Emoji_Presentation}"
].join("|"), Cn = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION"
]), ve = /* @__PURE__ */ new WeakMap(), vt = /* @__PURE__ */ new WeakMap(), pt = /* @__PURE__ */ new Map();
function Sn(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Bn(e) {
  const t = vt.get(e);
  if (t)
    return t;
  const n = Object.keys(e).sort((r, s) => s.length - r.length).map(Sn), l = n.length > 0 ? `${n.join("|")}|${gt}` : gt, o = new RegExp(l, "gu");
  return vt.set(e, o), o;
}
function Ot(e) {
  return e.value === !1 ? null : typeof e.value == "object" ? e.value : {};
}
const Tn = "data-win55-richtext";
function Rn(e) {
  return Cn.has(e.tagName) || e.hasAttribute("data-win55-emoji");
}
function Dt(e) {
  let t = e.parentElement;
  for (; t; ) {
    const n = ve.get(t);
    if (n && Ot(n.binding))
      return !0;
    t = t.parentElement;
  }
  return !1;
}
function jn(e, t) {
  const n = [], l = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, {
    acceptNode(o) {
      const r = o.parentElement;
      return !r || Rn(r) || t && r.closest(`[${Tn}]`) || !o.nodeValue?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  for (; l.nextNode(); )
    n.push(l.currentNode);
  return n;
}
function An() {
  return `${Z * Ke}px`;
}
function zn(e, t, n, l, o) {
  const r = Math.min(1, Math.max(0, o)), s = e.getImageData(0, 0, t, n), a = s.data;
  for (let u = 0; u < a.length; u += 4) {
    const d = a[u], f = a[u + 1], c = a[u + 2];
    if (a[u + 3] < 80)
      a[u] = 0, a[u + 1] = 0, a[u + 2] = 0, a[u + 3] = 0;
    else {
      const [y, x, E] = wn(
        d,
        f,
        c,
        l
      ), C = Math.round(d + (y - d) * r), S = Math.round(f + (x - f) * r), I = Math.round(c + (E - c) * r);
      a[u] = C, a[u + 1] = S, a[u + 2] = I, a[u + 3] = 255;
    }
  }
  e.putImageData(s, 0, 0);
}
function In(e, t, n) {
  const l = e.getImageData(0, 0, t, n), o = new Uint8ClampedArray(l.data), r = l.data, s = (a, u) => (u * t + a) * 4;
  for (let a = 0; a < n; a++)
    for (let u = 0; u < t; u++) {
      const d = s(u, a), c = [
        u > 0 ? s(u - 1, a) : -1,
        u < t - 1 ? s(u + 1, a) : -1,
        a > 0 ? s(u, a - 1) : -1,
        a < n - 1 ? s(u, a + 1) : -1
      ].filter((h) => h !== -1).filter((h) => o[h + 3] > 127);
      if (o[d + 3] > 127 && c.length <= 1)
        r[d] = r[d + 1] = r[d + 2] = r[d + 3] = 0;
      else if (o[d + 3] === 0 && c.length >= 3) {
        const h = c[0];
        r[d] = o[h], r[d + 1] = o[h + 1], r[d + 2] = o[h + 2], r[d + 3] = 255;
      }
    }
  e.putImageData(l, 0, 0);
}
function $n(e) {
  const t = pt.get(e);
  if (t)
    return t;
  const n = Nn(e);
  return pt.set(e, n), n;
}
function Nn(e) {
  const t = document.createElement("canvas");
  t.width = Z, t.height = Z;
  const n = t.getContext("2d");
  if (!n)
    return "";
  const l = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif', o = Z * 4;
  n.textBaseline = "alphabetic", n.font = `${o}px ${l}`;
  const r = n.measureText(e), s = r.actualBoundingBoxLeft + r.actualBoundingBoxRight, a = r.actualBoundingBoxAscent + r.actualBoundingBoxDescent;
  if (s > 0 && a > 0) {
    const u = o * Math.min(Z / s, Z / a);
    n.font = `${u}px ${l}`;
    const d = n.measureText(e), f = d.actualBoundingBoxLeft + d.actualBoundingBoxRight, c = d.actualBoundingBoxAscent + d.actualBoundingBoxDescent, h = (Z - f) / 2 + d.actualBoundingBoxLeft, y = (Z - c) / 2 + d.actualBoundingBoxAscent;
    n.fillText(e, h, y - 0.5), zn(n, Z, Z, kn, 0.1), In(n, Z, Z), Hn(t);
  }
  return t.toDataURL("image/png");
}
function Fn(e, t, n) {
  const l = document.createElement("span"), o = document.createElement("img");
  return l.className = n.className ?? xn, l.contentEditable = "false", l.dataset.win55Emoji = e, l.role = "img", l.ariaLabel = e, l.style.setProperty("--win55-emoji-size", An()), o.src = t, o.alt = e, o.className = bn, o.draggable = !1, o.dataset.win55EmojiImg = "true", o.addEventListener("load", () => {
    const r = o.naturalWidth * Ke, s = o.naturalHeight * Ke;
    l.style.width = `${r}px`, l.style.height = `${s}px`, o.style.width = `${r}px`, o.style.height = `${s}px`;
  }, { once: !0 }), l.append(o), l;
}
function Ln(e, t, n, l) {
  const o = e.parentElement;
  if (!o)
    return;
  const r = window.getSelection(), s = r && r.rangeCount > 0 && r.isCollapsed ? r.getRangeAt(0) : null, a = s?.startContainer === e, u = !!(s && s.startContainer === o && s.startOffset === Array.prototype.indexOf.call(o.childNodes, e) + 1), d = a || u, f = u ? e.nodeValue?.length ?? 0 : a ? s?.startOffset ?? null : null, c = e.nodeValue ?? "";
  let h = 0, y = !1;
  const x = document.createDocumentFragment();
  let E = null, C = 0;
  const S = (F, L) => {
    E || (E = F, C = L);
  };
  t.lastIndex = 0;
  for (const F of c.matchAll(t)) {
    const L = F[0], P = F.index, g = n[L];
    if (P === void 0)
      continue;
    const B = g ? ie(g, l) : $n(L);
    if (!B)
      continue;
    y = !0;
    const M = document.createTextNode(c.slice(h, P));
    f !== null && f >= h && f <= P && S(M, f - h), x.append(M);
    const X = Fn(L, B, l);
    x.append(X), f !== null && f > P && f <= P + L.length && S(o, Array.prototype.indexOf.call(o.childNodes, e) + x.childNodes.length), h = P + L.length;
  }
  if (!y)
    return;
  const I = document.createTextNode(c.slice(h));
  if (f !== null && f >= h && S(I, f - h), x.append(I), e.replaceWith(x), d && E) {
    const F = document.createRange();
    F.setStart(E, C), F.collapse(!0), r?.removeAllRanges(), r?.addRange(F);
  }
}
function Pt(e, t, n, l) {
  const o = Bn(t);
  if (o)
    for (const r of jn(e, l))
      Ln(r, o, t, n);
}
const Ye = /* @__PURE__ */ new WeakMap();
async function _e(e, t = {}) {
  const n = (Ye.get(e) ?? 0) + 1;
  Ye.set(e, n);
  const l = await he(t);
  Ye.get(e) !== n || !e.isConnected || Pt(e, l, t, !1);
}
async function Mn(e, t) {
  const n = Ot(t.binding);
  if (!n)
    return;
  t.version += 1;
  const l = t.version, o = await he(n);
  ve.get(e)?.version !== l || !e.isConnected || Dt(e) || Pt(e, o, n, !0);
}
function Je(e, t) {
  t.renderQueued || (t.renderQueued = !0, t.renderFrame = window.requestAnimationFrame(() => {
    t.renderQueued = !1, t.renderFrame = null, Mn(e, t).catch((n) => {
      console.warn("[win-55-ui] Could not render custom emoji.", n);
    });
  }));
}
function On(e, t) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !t.clipboardData || Dt(e))
    return;
  const l = n.getRangeAt(0);
  if (!l.intersectsNode(e))
    return;
  const o = l.cloneContents(), r = ne(o);
  r && (t.clipboardData.setData("text/plain", r), t.preventDefault());
}
function Dn(e, t) {
  const n = new MutationObserver(() => {
    Je(e, t);
  });
  return n.observe(e, {
    characterData: !0,
    childList: !0,
    subtree: !0
  }), n;
}
const Pn = {
  mounted(e, t) {
    const n = {
      binding: t,
      copyHandler: (l) => On(e, l),
      observer: null,
      renderFrame: null,
      renderQueued: !1,
      version: 0
    };
    n.observer = Dn(e, n), ve.set(e, n), e.addEventListener("copy", n.copyHandler), Je(e, n);
  },
  updated(e, t) {
    const n = ve.get(e);
    n && (n.binding = t, Je(e, n));
  },
  unmounted(e) {
    const t = ve.get(e);
    t && (t.observer?.disconnect(), t.renderFrame !== null && window.cancelAnimationFrame(t.renderFrame), e.removeEventListener("copy", t.copyHandler)), ve.delete(e);
  }
};
function Hn(e) {
  const t = e.getContext("2d");
  if (!t) {
    console.warn("Unable to get 2D context from canvas");
    return;
  }
  const n = e.width, l = e.height, o = t.getImageData(0, 0, n, l), r = o.data, s = (c, h) => c < 0 || h < 0 || c >= n || h >= l ? 0 : r[(h * n + c) * 4 + 3], a = Array.from({ length: l }, () => Array(n).fill(!1)), u = [];
  for (let c = 0; c < n; c++)
    s(c, 0) === 0 && !a[0][c] && (a[0][c] = !0, u.push({ x: c, y: 0 })), s(c, l - 1) === 0 && !a[l - 1][c] && (a[l - 1][c] = !0, u.push({ x: c, y: l - 1 }));
  for (let c = 0; c < l; c++)
    s(0, c) === 0 && !a[c][0] && (a[c][0] = !0, u.push({ x: 0, y: c })), s(n - 1, c) === 0 && !a[c][n - 1] && (a[c][n - 1] = !0, u.push({ x: n - 1, y: c }));
  const d = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  for (; u.length; ) {
    const { x: c, y: h } = u.shift();
    for (const [y, x] of d) {
      const E = c + y, C = h + x;
      E >= 0 && E < n && C >= 0 && C < l && !a[C][E] && s(E, C) === 0 && (a[C][E] = !0, u.push({ x: E, y: C }));
    }
  }
  const f = Array.from({ length: l }, () => Array(n).fill(!1));
  for (let c = 0; c < l; c++)
    for (let h = 0; h < n; h++) {
      if (s(h, c) === 0) continue;
      let y = !1;
      for (const [x, E] of d) {
        const C = h + x, S = c + E;
        if (C < 0 || S < 0 || C >= n || S >= l) {
          y = !0;
          break;
        }
        if (s(C, S) === 0 && a[S][C]) {
          y = !0;
          break;
        }
      }
      y && (f[c][h] = !0);
    }
  for (let c = 0; c < l; c++)
    for (let h = 0; h < n; h++)
      if (f[c][h]) {
        const y = (c * n + h) * 4;
        r[y] = 0, r[y + 1] = 0, r[y + 2] = 0;
      }
  t.putImageData(o, 0, 0);
}
const Qo = Pn, yt = typeof Intl.Segmenter == "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function Ht(e) {
  return yt ? Array.from(yt.segment(e), (t) => t.segment) : Array.from(e);
}
function wt(e) {
  return Ht(e).length;
}
function Vn(e, t) {
  return Ht(e).slice(0, t).join("");
}
function Wn(e) {
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
  return r.remove(), a?.normalize(), Ae(e, l), s;
}
const xt = "/win-55-ui/emoji/emoji-categories.json";
let Xe = null;
async function Ze() {
  return Xe || (Xe = fetch(xt).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${xt}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), Xe;
}
async function Un(e) {
  const t = e.trim().toLowerCase();
  if (!t)
    return [];
  const n = await Ze(), l = [], o = /* @__PURE__ */ new Set();
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
async function Yn(e) {
  const t = e.trim().toLowerCase();
  if (!t)
    return;
  const l = (await Ze()).find((o) => o.shortcodes.some((r) => r.toLowerCase() === t));
  return l ? { emoji: l.emoji, code: l.code } : void 0;
}
const ye = T(!1), re = T({ x: 160, y: 120, width: 360, height: 420 }), et = en(null);
function bt(e) {
  et.value = e;
}
function _n() {
  ye.value = !0;
}
function Et() {
  ye.value = !1;
}
function Xn(e) {
  et.value?.insertEmoji(e);
}
let kt = 0;
function Gn(e) {
  const t = e[kt % e.length];
  return kt += 1, t;
}
const qn = {
  key: 0,
  class: "baseinput-emoji-wrapper"
}, Kn = ["src"], Jn = { class: "shortcode-suggestions" }, Qn = {
  key: 0,
  class: "shortcode-suggestion-ellipsis"
}, Zn = ["src"], eo = {
  key: 1,
  class: "shortcode-suggestion-ellipsis"
}, to = "546", Re = 5, no = 200, Zo = /* @__PURE__ */ V({
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
    ], o = e, r = n, s = T(null), a = j(() => s.value?.el ?? null);
    de(() => {
      a.value && o.modelValue && (a.value.innerText = o.modelValue);
    }), ue(() => o.modelValue, (i) => {
      if (a.value && ne(a.value) !== i) {
        const v = document.activeElement === a.value, p = v ? ke(a.value) : null;
        a.value.innerText = i ?? "", v && Ae(a.value, p);
      }
    });
    const u = () => {
      if (!a.value) return;
      let i = ne(a.value);
      if (o.multiline || (i = i.replace(/\n/g, "")), o.maxLength && wt(i) > o.maxLength) {
        i = Vn(i, o.maxLength), a.value.innerText = i;
        const v = document.createRange(), p = window.getSelection();
        v.selectNodeContents(a.value), v.collapse(!1), p?.removeAllRanges(), p?.addRange(v);
      }
      Wt(), r("update:modelValue", i), Me();
    }, d = /:([A-Za-z0-9_+-]*)$/, f = /:([A-Za-z0-9_+-]{2,}):$/, c = T(!1), h = T(null), y = T([]), x = T(0), E = T(null);
    let C = 0;
    const S = T(0);
    function I(i) {
      i < S.value ? S.value = i : i > S.value + Re - 1 && (S.value = i - Re + 1);
    }
    const F = j(() => {
      const i = S.value;
      return y.value.slice(i, i + Re).map((v, p) => ({ match: v, index: i + p }));
    }), L = j(() => S.value > 0), P = j(() => S.value + Re < y.value.length), g = () => {
      c.value = !1, h.value = null, y.value = [], x.value = 0, S.value = 0;
    }, B = (i, v) => {
      if (!a.value) return;
      const p = window.getSelection();
      if (!p || p.rangeCount === 0 || !p.isCollapsed) return;
      const w = p.getRangeAt(0), R = w.startContainer;
      if (!(R instanceof Text) || !a.value.contains(R)) return;
      const Y = w.startOffset, Q = Y - i;
      if (Q < 0) return;
      const le = R.nodeValue ?? "";
      Be(), R.nodeValue = le.slice(0, Q) + v + le.slice(Y), se(R, Q + v.length), ge(), u(), _e(a.value);
    }, M = () => {
      const i = y.value[x.value];
      !i || h.value === null || (B(1 + h.value.length, i.emoji), g());
    }, X = T(null), N = { insertEmoji: (i) => {
      if (!a.value) return;
      const w = (document.activeElement === a.value ? ke(a.value) : null) ?? X.value ?? wt(ne(a.value));
      Ae(a.value, w, !0);
      const R = window.getSelection();
      if (!R || R.rangeCount === 0 || !R.isCollapsed) return;
      const Y = R.getRangeAt(0);
      Be(), Y.deleteContents();
      const Q = document.createTextNode(i);
      Y.insertNode(Q), se(Q, Q.length), ge(), u(), _e(a.value);
    } }, G = T(!1), q = j(() => ye.value && et.value === N), U = j(() => o.showEmojiButton && (G.value || q.value)), te = T(l[0]), Fe = j(() => q.value ? to : te.value), Le = () => {
      te.value = Gn(l);
    };
    ue(U, (i) => {
      i && Le();
    });
    const Se = () => {
      G.value = !0, bt(N);
    }, ae = () => {
      bt(N), _n();
    }, Me = async () => {
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
      const w = (p.nodeValue ?? "").slice(0, v.startOffset), R = c.value ? h.value : null, Y = f.exec(w);
      if (Y) {
        if (R === Y[1]) {
          const ht = await Yn(Y[1]);
          ht && B(Y[0].length, ht.emoji);
        }
        g();
        return;
      }
      const le = d.exec(w)?.[1] ?? null;
      if (le === null || le.length < 2) {
        g();
        return;
      }
      const be = Wn(a.value);
      if (!be) {
        g();
        return;
      }
      const dt = ++C, ft = await Un(le);
      if (dt !== C || ft.length === 0) {
        dt === C && g();
        return;
      }
      h.value = le, y.value = ft, x.value = 0, S.value = 0, E.value = { top: be.top, bottom: be.bottom, left: be.left, right: be.right }, c.value = !0;
    }, Oe = [], De = [];
    let xe = null, me = null;
    const Pe = () => a.value ? { html: a.value.innerHTML, caret: ke(a.value) } : null, tt = (i) => {
      a.value && (a.value.innerHTML = i.html, Ae(a.value, i.caret, !0), u());
    }, Be = () => {
      xe || (xe = Pe()), De.length = 0;
    }, ge = () => {
      me !== null && (clearTimeout(me), me = null), xe && (Oe.push(xe), xe = null);
    }, Wt = () => {
      me !== null && clearTimeout(me), me = setTimeout(ge, no);
    }, Ut = () => {
      ge();
      const i = Oe.pop();
      if (!i) return;
      const v = Pe();
      v && De.push(v), tt(i);
    }, Yt = () => {
      const i = De.pop();
      if (!i) return;
      const v = Pe();
      v && Oe.push(v), tt(i);
    }, se = (i, v) => {
      const p = document.createRange(), w = window.getSelection();
      a.value?.focus({ preventScroll: !0 }), p.setStart(i, v), p.collapse(!0), w?.removeAllRanges(), w?.addRange(p);
    }, _t = (i) => i instanceof Text ? i.nodeValue?.length ?? 0 : i.childNodes.length, ce = (i) => i.parentNode ? Array.prototype.indexOf.call(i.parentNode.childNodes, i) : 0, He = (i, v) => i instanceof Text ? v > 0 ? null : i.previousSibling ?? (i.parentNode && i.parentNode !== a.value ? He(i.parentNode, ce(i.parentNode)) : null) : i.childNodes[v - 1] ?? (i.parentNode && i !== a.value ? He(i.parentNode, ce(i)) : null), Ve = (i, v) => i instanceof Text ? v < (i.nodeValue?.length ?? 0) ? null : i.nextSibling ?? (i.parentNode && i.parentNode !== a.value ? Ve(i.parentNode, ce(i.parentNode) + 1) : null) : i.childNodes[v] ?? (i.parentNode && i !== a.value ? Ve(i.parentNode, ce(i) + 1) : null), Xt = (i, v) => {
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
    }, nt = (i) => {
      if (i.cloneContents().querySelector?.("[data-win55-emoji]"))
        return !0;
      const p = i.startContainer instanceof Element ? i.startContainer : i.startContainer.parentElement, w = i.endContainer instanceof Element ? i.endContainer : i.endContainer.parentElement;
      return !!(p?.closest("[data-win55-emoji]") || w?.closest("[data-win55-emoji]"));
    }, ot = (i) => {
      if (!a.value) return;
      const v = i.startContainer, p = i.startOffset;
      i.deleteContents(), v.isConnected && a.value.contains(v) ? se(v, Math.min(p, _t(v))) : se(a.value, a.value.childNodes.length), u();
    }, Gt = (i) => {
      const v = document.createRange();
      return v.setStart(i.startContainer, i.startOffset), v.setEnd(i.endContainer, i.endOffset), v;
    }, qt = (i) => i instanceof HTMLElement && i.hasAttribute("data-win55-emoji"), Kt = (i, v, p) => {
      if (!a.value || i.collapsed || i.startContainer !== i.endContainer || !(i.startContainer instanceof Text))
        return !1;
      const w = i.startContainer, R = w.nodeValue?.length ?? 0;
      if (i.startOffset !== 0 || i.endOffset !== R)
        return !1;
      const Y = v === "backward" ? w.previousSibling : w.nextSibling;
      if (!qt(Y) || !w.parentNode)
        return !1;
      p();
      const Q = w.parentNode, le = ce(w);
      return w.remove(), se(Q, le), u(), !0;
    }, lt = (i, v, p) => {
      const w = p === "backward" ? He(i, v) : Ve(i, v);
      return Xt(w, p);
    }, at = (i, v, p, w) => {
      const R = lt(i, v, p);
      if (!R || !R.parentNode)
        return !1;
      w();
      const Y = R.parentNode, Q = ce(R);
      return R.remove(), se(Y, Q), u(), !0;
    }, Jt = (i, v, p) => {
      if (!a.value || !a.value.contains(i.startContainer))
        return "none";
      const w = Gt(i);
      return w.collapsed ? at(
        i.startContainer,
        i.startOffset,
        v,
        p
      ) ? "deleted" : "none" : nt(w) ? (p(), ot(w), "deleted") : Kt(w, v, p) ? "deleted" : ne(w.cloneContents()) ? "native" : "none";
    }, Qt = (i, v) => {
      if (!a.value) return !1;
      const p = window.getSelection();
      if (!p || p.rangeCount === 0)
        return !1;
      const w = p.getRangeAt(0);
      return a.value.contains(w.startContainer) ? p.isCollapsed ? at(
        w.startContainer,
        w.startOffset,
        i,
        v
      ) : nt(w) ? (v(), ot(w), !0) : !1 : !1;
    }, Zt = (i) => {
      if (i.shiftKey || i.ctrlKey || i.metaKey || i.altKey || i.key !== "ArrowLeft" && i.key !== "ArrowRight" || !a.value) return !1;
      const v = window.getSelection();
      if (!v || v.rangeCount === 0 || !v.isCollapsed) return !1;
      const p = v.getRangeAt(0);
      if (!a.value.contains(p.startContainer)) return !1;
      const w = i.key === "ArrowLeft" ? "backward" : "forward", R = lt(p.startContainer, p.startOffset, w);
      return !R || !R.parentNode ? !1 : (i.preventDefault(), se(R.parentNode, ce(R) + (w === "forward" ? 1 : 0)), !0);
    }, rt = (i) => {
      if (c.value) {
        if (i.key === "ArrowDown") {
          i.preventDefault(), x.value = (x.value + 1) % y.value.length, I(x.value);
          return;
        }
        if (i.key === "ArrowUp") {
          i.preventDefault(), x.value = (x.value - 1 + y.value.length) % y.value.length, I(x.value);
          return;
        }
        if (i.key === "Tab" || i.key === " " || i.key === "Enter") {
          i.preventDefault(), M();
          return;
        }
        if (i.key === "Escape") {
          i.preventDefault(), g();
          return;
        }
      }
      !o.multiline && i.key === "Enter" && i.preventDefault(), i.key === "Tab" && i.preventDefault(), Zt(i);
    }, it = (i) => {
      if (!a.value) return;
      if (i.inputType === "historyUndo" || i.inputType === "historyRedo") {
        i.preventDefault(), i.inputType === "historyUndo" ? Ut() : Yt();
        return;
      }
      if (Be(), i.inputType !== "deleteContentBackward" && i.inputType !== "deleteContentForward")
        return;
      if (ne(a.value) === "") {
        i.preventDefault(), a.value.focus({ preventScroll: !0 });
        return;
      }
      const v = i.inputType === "deleteContentBackward" ? "backward" : "forward", p = i.getTargetRanges();
      for (const w of p) {
        const R = Jt(
          w,
          v,
          () => i.preventDefault()
        );
        if (R === "deleted") {
          a.value.focus({ preventScroll: !0 });
          return;
        }
        if (R === "native")
          return;
      }
      Qt(v, () => i.preventDefault()) && a.value.focus({ preventScroll: !0 });
    }, st = (i) => {
      i.preventDefault();
      let v = i.clipboardData?.getData("text/plain") ?? "";
      if (o.multiline || (v = v.replace(/\n/g, " ")), !a.value) return;
      Be();
      const p = window.getSelection(), w = p?.getRangeAt(0);
      if (w) {
        w.deleteContents();
        const R = document.createTextNode(v);
        w.insertNode(R), w.collapse(!1), p?.removeAllRanges(), p?.addRange(w);
      }
      u(), ge(), _e(a.value);
    }, ct = () => {
      ge(), g(), G.value = !1, a.value && (X.value = ke(a.value)), a.value && ne(a.value) === "" && (a.value.innerHTML = "");
    }, ut = j(() => ({
      ...o.extraStyles,
      ...$t({ fontColor: "black" }),
      overflow: "auto",
      ...o.showEmojiButton ? { paddingRight: "34px" } : {}
    }));
    return t({ el: a }), (i, v) => (m(), b(O, null, [
      e.showEmojiButton ? (m(), b("div", qn, [
        _(ee, {
          ref_key: "boxRef",
          ref: s,
          type: e.boxType,
          contenteditable: !e.disabled,
          "extra-styles": ut.value,
          "data-placeholder": e.placeholder,
          role: "textbox",
          "aria-multiline": e.multiline,
          "aria-disabled": e.disabled,
          onInput: u,
          onKeydown: rt,
          onBeforeinput: it,
          onPaste: st,
          onFocus: Se,
          onBlur: ct
        }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"]),
        U.value ? (m(), b("img", {
          key: 0,
          src: H(ie)(Fe.value),
          width: "30",
          height: "30",
          class: "baseinput-emoji-button",
          "data-emoji-picker-trigger": "",
          onMousedown: v[0] || (v[0] = Ne(() => {
          }, ["prevent"])),
          onClick: Ne(ae, ["stop"])
        }, null, 40, Kn)) : J("", !0)
      ])) : (m(), z(ee, {
        key: 1,
        ref_key: "boxRef",
        ref: s,
        type: e.boxType,
        contenteditable: !e.disabled,
        "extra-styles": ut.value,
        "data-placeholder": e.placeholder,
        role: "textbox",
        "aria-multiline": e.multiline,
        "aria-disabled": e.disabled,
        onInput: u,
        onKeydown: rt,
        onBeforeinput: it,
        onPaste: st,
        onFocus: Se,
        onBlur: ct
      }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"])),
      c.value && E.value ? (m(), z(sn, {
        key: 2,
        shown: !0,
        anchor: E.value,
        side: "top"
      }, {
        content: $(() => [
          k("div", Jn, [
            L.value ? (m(), b("div", Qn, "...")) : J("", !0),
            (m(!0), b(O, null, K(F.value, ({ match: p, index: w }) => (m(), b("div", {
              key: p.shortcode,
              class: Ce(["shortcode-suggestion", { "shortcode-suggestion--selected": w === x.value }])
            }, [
              k("img", {
                src: H(ie)(p.code),
                width: "30",
                height: "30",
                class: "shortcode-suggestion-image"
              }, null, 8, Zn),
              k("span", null, ":" + oe(p.shortcode) + ":", 1)
            ], 2))), 128)),
            P.value ? (m(), b("div", eo, "...")) : J("", !0)
          ])
        ]),
        _: 1
      }, 8, ["anchor"])) : J("", !0)
    ], 64));
  }
}), $e = /* @__PURE__ */ V({
  __name: "Button",
  props: {
    baseType: { default: "panel-d-1" },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: t }) {
    const n = e, l = t, o = T(!1), r = T(!1), s = j(() => !n.disabled && o.value && r.value), a = j(() => n.disabled), u = (E) => {
      n.disabled || E.button !== 0 || (o.value = !0, r.value = !0);
    }, d = () => {
      n.disabled || (r.value = !0);
    }, f = () => {
      r.value = !1;
    }, c = (E) => {
      n.disabled || E.button !== 0 || (o.value && r.value && l("click"), o.value = !1);
    };
    de(() => {
      window.addEventListener("mouseup", c);
    }), fe(() => {
      window.removeEventListener("mouseup", c);
    });
    const h = j(() => ({
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
    return (E, C) => (m(), z(ee, {
      type: x.value,
      "extra-styles": h.value,
      "extra-class": e.extraClass,
      onMousedown: u,
      onMouseenter: d,
      onMouseleave: f
    }, {
      default: $(() => [
        k("div", {
          style: D(y.value)
        }, [
          W(E.$slots, "default")
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"]));
  }
}), oo = { style: { display: "flex", "align-items": "center" } }, lo = ["src", "alt"], ao = ["checked", "disabled", "value"], el = /* @__PURE__ */ V({
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
    return (r, s) => (m(), b("div", {
      class: Ce(["checkbox-container", { disabled: e.disabled }]),
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
      k("div", oo, [
        k("img", {
          draggable: "false",
          src: e.modelValue ? e.checkedIcon : e.uncheckedIcon,
          alt: e.modelValue ? "checked" : "unchecked"
        }, null, 8, lo)
      ]),
      k("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, ao),
      e.label ? (m(), b("span", {
        key: 0,
        style: D({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, oe(e.label), 5)) : J("", !0)
    ], 6));
  }
}), ro = /* @__PURE__ */ V({
  __name: "HDivider",
  setup(e) {
    return (t, n) => (m(), z(ee, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), tl = /* @__PURE__ */ V({
  __name: "MenuDropdown",
  setup(e) {
    return (t, n) => (m(), z(cn, null, {
      trigger: $(() => [
        W(t.$slots, "trigger")
      ]),
      items: $(() => [
        _(ee, { type: "panel-d-1" }, {
          default: $(() => [
            W(t.$slots, "items")
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), io = { style: { display: "flex", "align-items": "center" } }, so = ["src"], co = ["src"], uo = ["checked", "disabled", "value", "name"], nl = /* @__PURE__ */ V({
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
    return (s, a) => (m(), b("div", {
      class: Ce(["radio-container", { disabled: e.disabled }]),
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
      k("div", io, [
        o.value ? (m(), b("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, so)) : (m(), b("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, co))
      ]),
      k("input", {
        type: "radio",
        checked: o.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, uo),
      e.label ? (m(), b("span", {
        key: 0,
        style: D({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, oe(e.label), 5)) : J("", !0)
    ], 6));
  }
}), pe = /* @__PURE__ */ V({
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
      const o = $t(t);
      return t.element || (o.display = "contents"), o;
    });
    return (o, r) => (m(), z(tn(n.value), {
      style: D(l.value)
    }, {
      default: $(() => [
        W(o.$slots, "default")
      ]),
      _: 3
    }, 8, ["style"]));
  }
}), fo = { key: 1 }, ho = {
  key: 4,
  style: { "text-decoration": "underline" }
}, mo = {
  key: 5,
  style: { "text-decoration": "line-through" }
}, go = ["href"], vo = ["aria-label", "data-win55-emoji"], po = ["src", "alt"], yo = /* @__PURE__ */ V({
  __name: "RichTextNode",
  props: {
    node: {},
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    return (t, n) => {
      const l = nn("RichTextNode", !0);
      return e.node.type === "text" ? (m(), b(O, { key: 0 }, [
        we(oe(e.node.value), 1)
      ], 64)) : e.node.type === "break" ? (m(), b("br", fo)) : e.node.type === "bold" ? (m(), z(pe, {
        key: 2,
        "is-bold": ""
      }, {
        default: $(() => [
          (m(!0), b(O, null, K(e.node.children, (o, r) => (m(), z(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "italic" ? (m(), z(pe, {
        key: 3,
        "is-italic": ""
      }, {
        default: $(() => [
          (m(!0), b(O, null, K(e.node.children, (o, r) => (m(), z(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "underline" ? (m(), b("span", ho, [
        (m(!0), b(O, null, K(e.node.children, (o, r) => (m(), z(l, {
          key: r,
          node: o,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "strike" ? (m(), b("span", mo, [
        (m(!0), b(O, null, K(e.node.children, (o, r) => (m(), z(l, {
          key: r,
          node: o,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "color" ? (m(), z(pe, {
        key: 6,
        "font-color": e.node.value
      }, {
        default: $(() => [
          (m(!0), b(O, null, K(e.node.children, (o, r) => (m(), z(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-color"])) : e.node.type === "size" && e.allowSizes ? (m(), z(pe, {
        key: 7,
        "font-size": e.node.value
      }, {
        default: $(() => [
          (m(!0), b(O, null, K(e.node.children, (o, r) => (m(), z(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-size"])) : e.node.type === "size" ? (m(!0), b(O, { key: 8 }, K(e.node.children, (o, r) => (m(), z(l, {
        key: r,
        node: o,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "url" && e.allowLinks ? (m(), b("a", {
        key: 9,
        href: e.node.href,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "richtext-link"
      }, [
        (m(!0), b(O, null, K(e.node.children, (o, r) => (m(), z(l, {
          key: r,
          node: o,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ], 8, go)) : e.node.type === "url" ? (m(!0), b(O, { key: 10 }, K(e.node.children, (o, r) => (m(), z(l, {
        key: r,
        node: o,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "emoji" ? (m(), b("span", {
        key: 11,
        class: "win55-emoji",
        role: "img",
        "aria-label": e.node.emoji,
        "data-win55-emoji": e.node.emoji,
        style: { "--win55-emoji-size": "30px" }
      }, [
        k("img", {
          class: "win55-emoji-image",
          src: H(ie)(e.node.code),
          alt: e.node.emoji,
          draggable: "false"
        }, null, 8, po)
      ], 8, vo)) : J("", !0);
    };
  }
}), wo = {
  b: "bold",
  i: "italic",
  u: "underline",
  s: "strike",
  strike: "strike",
  color: "color",
  size: "size",
  url: "url"
}, xo = /* @__PURE__ */ new Set(["br"]), Ct = {
  normal: 12,
  big: 24
};
function Vt(e) {
  return e.map((t) => t.type === "text" ? t.value : t.type === "emoji" ? t.emoji : t.type === "break" ? `
` : Vt(t.children)).join("");
}
function St(e) {
  switch (e.tagType) {
    case "color":
      return { type: "color", value: e.value ?? "inherit", children: e.children };
    case "size": {
      const t = (e.value ?? "").trim().toLowerCase(), n = Ct[t], l = Number.parseInt(e.value ?? "", 10);
      return { type: "size", value: n ?? (Number.isFinite(l) ? l : Ct.normal), children: e.children };
    }
    case "url":
      return {
        type: "url",
        href: e.value ?? Vt(e.children).trim(),
        children: e.children
      };
    default:
      return { type: e.tagType, children: e.children };
  }
}
function bo(e, t) {
  for (let n = e.length - 1; n >= 0; n--)
    if (e[n].tagType === t) return n;
  return -1;
}
function Eo(e, t) {
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
function ko(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const Bt = /* @__PURE__ */ new WeakMap();
function Co(e) {
  const t = Bt.get(e);
  if (t !== void 0) return t;
  const n = Object.keys(e).sort((o, r) => r.length - o.length).map(ko), l = n.length > 0 ? new RegExp(n.join("|"), "gu") : null;
  return Bt.set(e, l), l;
}
function So(e, t) {
  if (!t) return [{ type: "text", value: e }];
  const n = Co(t);
  if (!n) return [{ type: "text", value: e }];
  const l = [];
  let o = 0, r;
  for (n.lastIndex = 0; r = n.exec(e); ) {
    const s = r[0], a = t[s];
    r.index > o && l.push({ type: "text", value: e.slice(o, r.index) }), l.push({ type: "emoji", emoji: s, code: a }), o = r.index + s.length;
  }
  return o < e.length && l.push({ type: "text", value: e.slice(o) }), l.length > 0 ? l : [{ type: "text", value: e }];
}
function Bo(e, t, n) {
  const l = [];
  for (const o of Eo(e, t))
    o.type === "text" ? l.push(...So(o.value, n)) : l.push(o);
  return l;
}
function To(e, t, n = null) {
  const l = [], o = [], r = /\[(\/?)(\w+)(?:=([^\]]*))?\]/g;
  let s = 0, a;
  const u = () => o.length ? o[o.length - 1].children : l, d = (f) => u().push(...Bo(f, t, n));
  for (; a = r.exec(e); ) {
    const [f, c, h, y] = a, x = h.toLowerCase();
    if (xo.has(x)) {
      d(e.slice(s, a.index)), s = a.index + f.length, u().push({ type: "break" });
      continue;
    }
    const E = wo[x];
    if (!E) continue;
    if (d(e.slice(s, a.index)), s = a.index + f.length, !c) {
      o.push({ tagType: E, value: y, children: [] });
      continue;
    }
    const C = bo(o, E);
    if (C === -1) {
      d(f);
      continue;
    }
    for (; o.length > C + 1; ) {
      const I = o.pop();
      o[o.length - 1].children.push(St(I));
    }
    const S = o.pop();
    u().push(St(S));
  }
  for (d(e.slice(s)); o.length; ) {
    const f = o.pop();
    (o.length ? o[o.length - 1].children : l).push(...f.children);
  }
  return l;
}
const Ro = {
  "data-win55-richtext": "",
  style: { display: "contents" }
}, ol = /* @__PURE__ */ V({
  __name: "RichText",
  props: {
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = At(), l = T(null), o = T(null);
    Ze().then((u) => {
      const d = /* @__PURE__ */ new Map();
      for (const f of u)
        for (const c of f.shortcodes)
          d.set(c.toLowerCase(), { emoji: f.emoji, code: f.code });
      l.value = d;
    }), he().then((u) => {
      o.value = u;
    });
    const r = j(() => {
      const u = l.value;
      return u ? { get: (d) => u.get(d) } : null;
    });
    function s(u) {
      return u.map((d) => typeof d.children == "string" ? d.children : Array.isArray(d.children) ? s(d.children) : "").join("");
    }
    const a = j(() => To(s(n.default?.() ?? []), r.value, o.value));
    return (u, d) => (m(), b("span", Ro, [
      (m(!0), b(O, null, K(a.value, (f, c) => (m(), z(yo, {
        key: c,
        node: f,
        "allow-links": t.allowLinks,
        "allow-sizes": t.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
    ]));
  }
});
function jo(e, t, n, l, o) {
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
  ], u = Tt(l), d = Tt(o), f = Math.floor(t / s), c = Math.floor(n / s);
  e.width = Math.floor(t * 2) / 2, e.height = Math.floor(n * 2) / 2;
  for (let h = 0; h < c; h++)
    for (let y = 0; y < f; y++) {
      const x = y * s, E = h * s, C = (y + h) / (f + c - 6), S = (a[h % 8][y % 8] + 0.5) / 64, I = C > S ? 1 : 0, F = Math.round(u.r * (1 - I) + d.r * I), L = Math.round(u.g * (1 - I) + d.g * I), P = Math.round(u.b * (1 - I) + d.b * I);
      r.fillStyle = `rgb(${F}, ${L}, ${P})`, r.fillRect(x, E, s, s);
    }
}
function Tt(e) {
  const t = e.replace("#", ""), n = parseInt(t, 16);
  return {
    r: n >> 16 & 255,
    g: n >> 8 & 255,
    b: n & 255
  };
}
const Ao = { style: { height: "0", overflow: "visible" } }, zo = { class: "titlebar-content" }, Io = { class: "titlebar-image" }, $o = ["src"], No = { class: "titlebar-text" }, Fo = { class: "titlebar-buttons" }, Lo = /* @__PURE__ */ V({
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
    const t = e, n = T(null);
    let l = null;
    function o(s, a) {
      const u = t.gradientColorA || "5555ff", d = t.gradientColorB || "0000aa";
      jo(s, s.width, s.height, u, d), a.fillStyle = "#555555", a.fillRect(0, s.height - 2, Math.floor(s.width / 2) * 2, 4);
    }
    function r() {
      const s = n.value;
      if (!s) return;
      const a = s.getContext("2d");
      if (!a) return;
      const u = s.getBoundingClientRect(), d = Math.floor(u.width * 2) / 2, f = Math.floor(u.height * 2) / 2;
      (s.width !== d || s.height !== f) && (s.width = d, s.height = f), o(s, a);
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
    }), (s, a) => (m(), b("div", null, [
      k("div", Ao, [
        k("canvas", {
          ref_key: "canvasRef",
          ref: n,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      k("div", zo, [
        k("div", Io, [
          k("img", {
            src: e.icon ?? "/win-55-ui/icons/program.png"
          }, null, 8, $o)
        ]),
        k("div", No, [
          _(pe, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: $(() => [
              we(oe(e.title), 1)
            ]),
            _: 1
          })
        ]),
        k("div", Fo, [
          W(s.$slots, "buttons"),
          e.placeholderButtons ? (m(), b(O, { key: 0 }, [
            _($e, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: $(() => [...a[0] || (a[0] = [
                k("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/o.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            _($e, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: $(() => [...a[1] || (a[1] = [
                k("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/_.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            a[3] || (a[3] = k("div", { style: { width: "2px" } }, null, -1)),
            _($e, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: $(() => [...a[2] || (a[2] = [
                k("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/x.png"
                }, null, -1)
              ])]),
              _: 1
            })
          ], 64)) : J("", !0)
        ])
      ])
    ]));
  }
}), ll = /* @__PURE__ */ V({
  __name: "Tooltip",
  props: {
    text: {},
    offsetX: {},
    offsetY: {}
  },
  setup(e) {
    const t = e, n = T(!1), l = on({ x: 0, y: 0 });
    let o = null;
    const r = () => {
      o = window.setTimeout(() => {
        n.value = !0;
      }, 400);
    }, s = () => {
      o !== null && (clearTimeout(o), o = null), n.value = !1;
    }, a = (d) => {
      l.x = d.clientX + (t.offsetX ?? 24), l.y = d.clientY + (t.offsetY ?? 24);
    }, u = j(() => ({
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
    }), (d, f) => (m(), b("span", {
      onMouseenter: r,
      onMouseleave: s,
      onMousemove: a,
      style: { position: "relative", display: "inline-block" }
    }, [
      W(d.$slots, "default"),
      n.value ? (m(), z(ee, {
        key: 0,
        style: D(u.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: $(() => [
          we(oe(t.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : J("", !0)
    ], 32));
  }
}), Mo = {
  class: "window-container",
  style: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%"
  }
}, je = 6, Oo = /* @__PURE__ */ V({
  __name: "Window",
  props: /* @__PURE__ */ It({
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
    const t = e, n = Ee(e, "x"), l = Ee(e, "y"), o = Ee(e, "width"), r = Ee(e, "height"), s = t.minWidth ?? 240, a = t.minHeight ?? 40, u = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableHorizontally ?? !1), d = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableVertically ?? !1);
    let f = !1, c = !1, h = "", y = "", x = 0, E = 0, C = 0, S = 0, I = 0, F = 0;
    const L = T("default");
    function P(A) {
      if (t.faux || h) return;
      const N = A.target;
      N.closest(".titlebar-image") || N.closest(".titlebar-buttons") || (f = !0, x = A.clientX, E = A.clientY, I = n.value, F = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", B), window.addEventListener("mouseup", M));
    }
    function g(A) {
      t.faux || h && (!u && !d || (c = !0, y = h, x = A.clientX, E = A.clientY, C = o.value, S = r.value, I = n.value, F = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", B), window.addEventListener("mouseup", M)));
    }
    function B(A) {
      if (t.faux) return;
      const N = A.clientX - x, G = A.clientY - E;
      if (f && (n.value = I + N, l.value = F + G), c) {
        const q = y;
        if (u && q.includes("e") && (o.value = Math.max(s, C + N)), d && q.includes("s") && (r.value = Math.max(a, S + G)), u && q.includes("w")) {
          const U = C - N, te = Math.max(s, U);
          o.value = te, n.value = I + (C - te);
        }
        if (d && q.includes("n")) {
          const U = S - G, te = Math.max(a, U);
          r.value = te, l.value = F + (S - te);
        }
      }
    }
    function M() {
      f = !1, c = !1, y = "", document.body.style.userSelect = "", window.removeEventListener("mousemove", B), window.removeEventListener("mouseup", M);
    }
    function X(A) {
      if (t.faux) {
        h = "", L.value = "default";
        return;
      }
      if (c) return;
      const N = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableHorizontally ?? !1), G = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableVertically ?? !1);
      if (!N && !G) {
        h = "", L.value = "default";
        return;
      }
      const U = A.currentTarget.getBoundingClientRect(), te = A.clientX - U.left, Fe = U.right - A.clientX, Le = A.clientY - U.top, Se = U.bottom - A.clientY;
      let ae = "";
      G && (Le < je ? ae += "n" : Se < je && (ae += "s")), N && (te < je ? ae += "w" : Fe < je && (ae += "e")), h = ae;
      const Me = {
        n: "ns-resize",
        s: "ns-resize",
        e: "ew-resize",
        w: "ew-resize",
        ne: "nesw-resize",
        sw: "nesw-resize",
        nw: "nwse-resize",
        se: "nwse-resize"
      };
      L.value = Me[ae] ?? "default";
    }
    return ue(() => [t.resizable, t.resizableHorizontally, t.resizableVertically], () => {
      const A = document.querySelector(`[data-v-${Math.random().toString(36).substr(2, 9)}]`);
      if (A) {
        const N = A.getBoundingClientRect(), G = N.left + N.width / 2, q = N.top + N.height / 2;
        X({
          currentTarget: A,
          clientX: G,
          clientY: q
        });
      }
    }, { immediate: !0 }), (A, N) => (m(), z(ee, {
      "extra-class": e.extraClass,
      "extra-styles": t.faux ? e.extraStyles : {
        position: "absolute",
        left: n.value + "px",
        top: l.value + "px",
        width: o.value + "px",
        height: r.value + "px",
        cursor: L.value,
        ...e.extraStyles
      },
      type: "panel-d-2",
      onMousemove: X,
      onMousedown: g
    }, {
      default: $(() => [
        k("div", Mo, [
          k("div", {
            class: "titlebar-wrapper",
            onMousedown: Ne(P, ["stop"]),
            style: { height: "34px" }
          }, [
            _(Lo, {
              title: e.title,
              icon: e.icon,
              "placeholder-buttons": e.placeholderButtons,
              disabled: e.disabled,
              "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
              "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
            }, {
              buttons: $(() => [
                W(A.$slots, "titlebar-buttons")
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
            W(A.$slots, "default")
          ], 4)
        ])
      ]),
      _: 3
    }, 8, ["extra-class", "extra-styles"]));
  }
}), Do = /* @__PURE__ */ V({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" }
  },
  setup(e) {
    return (t, n) => (m(), z(ee, {
      type: "border-groove",
      "extra-styles": { padding: "10px", margin: "10px" }
    }, {
      default: $(() => [
        k("div", {
          class: "label",
          style: D({ backgroundColor: e.backgroundColorHint })
        }, oe(e.label), 5),
        W(t.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }));
  }
}), Po = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [l, o] of t)
    n[l] = o;
  return n;
}, al = /* @__PURE__ */ Po(Do, [["__scopeId", "data-v-9a25af1b"]]), Rt = "/win-55-ui/emoji/emoji-by-category.json";
let Ge = null;
async function jt() {
  return Ge || (Ge = fetch(Rt).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${Rt}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), Ge;
}
const Ho = { class: "emoji-picker-body" }, Vo = { class: "emoji-picker-tabs" }, Wo = ["onClick"], Uo = { class: "emoji-picker-grid" }, Yo = ["src", "title", "onClick"], _o = "546", rl = /* @__PURE__ */ V({
  __name: "EmojiPickerWindow",
  setup(e) {
    const t = T(null), n = T([]), l = T(null), o = T(void 0), r = j(() => n.value.find((d) => d.category === l.value) ?? null);
    async function s() {
      if (Math.random() < 0.75) {
        o.value = ie(_o);
        return;
      }
      const f = (await jt()).flatMap((h) => h.emojis);
      if (f.length === 0) return;
      const c = f[Math.floor(Math.random() * f.length)];
      o.value = ie(c.code);
    }
    ue(ye, async (d) => {
      d && (s(), n.value.length === 0 && (n.value = await jt(), l.value = n.value[0]?.category ?? null));
    }, { immediate: !0 });
    function a(d) {
      l.value = d;
    }
    function u(d) {
      if (!ye.value) return;
      const f = d.target;
      t.value?.contains(f) || Et();
    }
    return de(() => {
      document.addEventListener("click", u);
    }), fe(() => {
      document.removeEventListener("click", u);
    }), (d, f) => (m(), z(Qe, { to: "body" }, [
      H(ye) ? (m(), b("div", {
        key: 0,
        ref_key: "rootRef",
        ref: t,
        style: { display: "contents" }
      }, [
        _(Oo, {
          x: H(re).x,
          "onUpdate:x": f[0] || (f[0] = (c) => H(re).x = c),
          y: H(re).y,
          "onUpdate:y": f[1] || (f[1] = (c) => H(re).y = c),
          width: H(re).width,
          "onUpdate:width": f[2] || (f[2] = (c) => H(re).width = c),
          height: H(re).height,
          "onUpdate:height": f[3] || (f[3] = (c) => H(re).height = c),
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
          "titlebar-buttons": $(() => [
            _($e, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              onClick: H(Et)
            }, {
              default: $(() => [...f[4] || (f[4] = [
                k("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/x.png"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]),
          default: $(() => [
            _(ee, {
              type: "textarea",
              "extra-styles": { width: "100%", height: "calc(100% - 2px)", marginTop: "2px", padding: "2px" }
            }, {
              default: $(() => [
                k("div", Ho, [
                  k("div", Vo, [
                    (m(!0), b(O, null, K(n.value, (c) => (m(), b("span", {
                      key: c.category,
                      class: Ce(["emoji-picker-tab", { "emoji-picker-tab--selected": c.category === l.value }]),
                      onClick: (h) => a(c.category)
                    }, [
                      _(pe, {
                        shorthand: c.category === l.value ? "Bold12" : "Regular12"
                      }, {
                        default: $(() => [
                          we(oe(c.category), 1)
                        ]),
                        _: 2
                      }, 1032, ["shorthand"])
                    ], 10, Wo))), 128))
                  ]),
                  _(ro),
                  k("div", Uo, [
                    (m(!0), b(O, null, K(r.value?.emojis ?? [], (c) => (m(), b("div", {
                      key: c.code,
                      class: "emoji-picker-grid-cell"
                    }, [
                      k("img", {
                        src: H(ie)(c.code),
                        title: c.shortcodes[0] ? `:${c.shortcodes[0]}:` : void 0,
                        class: "emoji-picker-grid-item",
                        onClick: (h) => H(Xn)(c.emoji)
                      }, null, 8, Yo)
                    ]))), 128))
                  ])
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["x", "y", "width", "height", "icon"])
      ], 512)) : J("", !0)
    ]));
  }
}), il = (e, t = 30, n = 48, l = 30) => {
  const o = T(
    Array.from({ length: e }, (u, d) => ({
      sin: Math.sin(0 + d * Math.PI * 2 / e),
      cos: Math.cos(0 + d * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let r, s = 0;
  const a = () => {
    const u = Date.now();
    if (u - s >= 1e3 / t) {
      const d = Array.from({ length: e }, (y, x) => ({
        sin: Math.sin(u / (1e3 + x * 200) + x * Math.PI * 2 / e),
        cos: Math.cos(u / (3e3 + x * 400) + x * Math.PI * 2 / e + Math.PI / 4)
      })), f = d.map((y) => n + y.sin * l), c = e * n, h = f.reduce((y, x) => y + x, 0);
      if (h > 0) {
        const y = c / h, x = d.map((E) => ({
          sin: ((n + E.sin * l) * y - n) / l,
          cos: E.cos
        }));
        o.value = x;
      } else
        o.value = d;
      s = u;
    }
    r = requestAnimationFrame(a);
  };
  return de(() => {
    r = requestAnimationFrame(a);
  }), fe(() => {
    cancelAnimationFrame(r);
  }), { values: o };
};
function sl(e) {
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
  sn as Balloon,
  cn as BaseDropdown,
  Zo as BaseInput,
  ee as Box,
  $e as Button,
  el as Checkbox,
  rl as EmojiPickerWindow,
  ro as HDivider,
  tl as MenuDropdown,
  al as NamedPanel,
  nl as RadioButton,
  ol as RichText,
  Lo as Titlebar,
  ll as Tooltip,
  pe as Typography,
  Oo as Window,
  et as activeTarget,
  Et as closePicker,
  Qo as customEmojiDirective,
  jo as drawAngledBayerDitherGradient,
  Pn as emojiDirective,
  qo as getEmojiGifPath,
  ie as getEmojiGifPathFromCode,
  Ko as getEmojiRegistry,
  ke as getSelectionOffset,
  ne as getTextWithCustomEmoji,
  Jo as hasEmoji,
  Xn as insertEmoji,
  he as loadEmojiRegistry,
  _n as openPicker,
  Gn as pickNextButtonIcon,
  ye as pickerOpen,
  re as pickerPosition,
  bt as registerActiveInput,
  sl as registerGlobalImageErrorHandler,
  Go as resetEmojiRegistryCache,
  Ae as restoreSelectionOffset,
  $t as typographyStyles,
  il as useSineWave
};
