import { defineComponent as P, ref as S, computed as j, openBlock as m, createElementBlock as b, normalizeStyle as O, normalizeClass as Se, renderSlot as V, useModel as Ee, useSlots as zt, watch as ue, nextTick as $t, onMounted as de, onUnmounted as fe, createBlock as A, Teleport as Qe, createElementVNode as k, createVNode as U, withCtx as z, unref as _, Fragment as M, createTextVNode as we, toDisplayString as oe, createCommentVNode as G, mergeModels as Ft, withModifiers as Le, shallowRef as un, renderList as X, resolveDynamicComponent as dn, resolveComponent as fn, reactive as hn } from "vue";
const Z = /* @__PURE__ */ P({
  __name: "Box",
  props: {
    type: {},
    extraStyles: {},
    extraClass: {}
  },
  setup(e, { expose: t }) {
    const n = e, a = S(null), o = j(() => ({
      "--img": `url(/win-55-ui/${n.type}.png)`,
      ...n.extraStyles
    }));
    return t({ el: a }), (l, s) => (m(), b("div", {
      ref_key: "rootRef",
      ref: a,
      class: Se(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: O(o.value)
    }, [
      V(l.$slots, "default")
    ], 6));
  }
}), mn = { class: "balloon-tip-box" }, gn = {
  key: 1,
  class: "balloon-wrapper"
}, vn = { class: "balloon-tip-box" }, Re = 8, pn = /* @__PURE__ */ P({
  __name: "Balloon",
  props: /* @__PURE__ */ Ft({
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
    function a(g) {
      return n(g) ? g : { top: g.y, bottom: g.y, left: g.x, right: g.x };
    }
    const o = e, l = zt(), s = j(() => o.side ?? "top"), i = j(() => o.bias), d = S(s.value), u = j(() => o.anchor ? d.value : s.value), f = j(() => {
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
    }), h = j(() => {
      let g = "", T = !1;
      switch (u.value) {
        case "top":
          g = "rotate(0deg)", i.value === "right" && (T = !0);
          break;
        case "bottom":
          g = "rotate(180deg)", i.value === "left" && (T = !0);
          break;
        case "left":
          g = "rotate(-90deg)";
          break;
        case "right":
          g = "rotate(90deg)", T = !0;
          break;
      }
      return T ? `${g} scaleX(-1)` : g;
    }), y = j(() => {
      const g = {};
      return i.value ? ((u.value === "top" || u.value === "bottom") && (i.value === "left" && (g.transform = "translateX(calc(-50% + 28px))"), i.value === "right" && (g.transform = "translateX(calc(50% - 28px))")), (u.value === "left" || u.value === "right") && (i.value === "up" && (g.transform = "translateY(calc(-50% + 28px))"), i.value === "down" && (g.transform = "translateY(calc(50% - 28px))")), g) : {};
    }), w = S(null), E = S(null), C = { top: "bottom", bottom: "top", left: "right", right: "left" }, B = {
      top: ["left", "right"],
      bottom: ["left", "right"],
      left: ["top", "bottom"],
      right: ["top", "bottom"]
    };
    function I(g, T, L) {
      const q = (T.left + T.right) / 2, N = (T.top + T.bottom) / 2;
      return g === "top" || g === "bottom" ? {
        top: g === "top" ? T.top - L.height : T.bottom,
        left: q - L.width / 2
      } : {
        left: g === "left" ? T.left - L.width : T.right,
        top: N - L.height / 2
      };
    }
    function $(g, T, L, q) {
      return g.top >= Re && g.left >= Re && g.top + T.height <= q - Re && g.left + T.width <= L - Re;
    }
    function F() {
      const g = w.value;
      if (!o.anchor || !g) return;
      const T = a(o.anchor), L = g.getBoundingClientRect(), q = window.innerWidth, N = window.innerHeight, H = o.side ?? "top", K = [
        H,
        C[H],
        ...B[H]
      ].find((ee) => $(I(ee, T, L), L, q, N)) ?? H;
      d.value = K, E.value = I(K, T, L);
    }
    ue(
      [() => o.anchor, t],
      async ([g, T]) => {
        !g || !T || (await $t(), F());
      },
      { deep: !0, immediate: !0 }
    );
    const D = () => {
      o.anchor && t.value && F();
    };
    return de(() => {
      window.addEventListener("resize", D), window.addEventListener("scroll", D, !0);
    }), fe(() => {
      window.removeEventListener("resize", D), window.removeEventListener("scroll", D, !0);
    }), (g, T) => e.anchor ? (m(), A(Qe, {
      key: 0,
      to: "body"
    }, [
      t.value ? (m(), b("div", {
        key: 0,
        ref_key: "anchoredRef",
        ref: w,
        class: "balloon-anchored",
        style: O({
          top: (E.value?.top ?? 0) + "px",
          left: (E.value?.left ?? 0) + "px"
        })
      }, [
        k("div", {
          class: "balloon-inner",
          style: O({ flexDirection: c.value })
        }, [
          k("div", {
            class: "balloon-box-wrapper",
            style: O(y.value)
          }, [
            U(Z, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: z(() => [
                _(l).content ? V(g.$slots, "content", { key: 0 }) : (m(), b(M, { key: 1 }, [
                  we(oe(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          k("div", mn, [
            k("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: O({ transform: h.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : G("", !0)
    ])) : (m(), b("div", gn, [
      V(g.$slots, "default"),
      t.value ? (m(), b("div", {
        key: 0,
        class: "balloon",
        style: O(f.value)
      }, [
        k("div", {
          class: "balloon-inner",
          style: O({ flexDirection: c.value })
        }, [
          k("div", {
            class: "balloon-box-wrapper",
            style: O(y.value)
          }, [
            U(Z, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: z(() => [
                _(l).content ? V(g.$slots, "content", { key: 0 }) : (m(), b(M, { key: 1 }, [
                  we(oe(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          k("div", vn, [
            k("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: O({ transform: h.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : G("", !0)
    ]));
  }
}), yn = /* @__PURE__ */ P({
  __name: "BaseDropdown",
  props: {
    matchTriggerWidth: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = S(!1), a = S(null), o = S(null), l = S(null), s = () => {
      const f = o.value, c = l.value;
      if (!f || !c) return;
      const h = f.getBoundingClientRect(), y = window.innerHeight, w = c.offsetHeight;
      let E = h.bottom + window.scrollY;
      const C = h.left + window.scrollX;
      h.bottom + w > y && (E = h.top + window.scrollY - w), a.value = {
        top: E,
        left: C,
        width: t.matchTriggerWidth ? h.width : void 0
      };
    };
    ue(n, async (f) => {
      f && (await $t(), s());
    });
    const i = () => {
      n.value && s();
    }, d = (f) => {
      if (!n.value) return;
      const c = f.target;
      o.value?.contains(c) || l.value?.contains(c) || (n.value = !1);
    };
    de(() => {
      window.addEventListener("resize", i), window.addEventListener("scroll", i), document.addEventListener("click", d);
    }), fe(() => {
      window.removeEventListener("resize", i), window.removeEventListener("scroll", i), document.removeEventListener("click", d);
    });
    const u = () => {
      n.value = !n.value;
    };
    return (f, c) => (m(), b(M, null, [
      k("div", {
        ref_key: "triggerRef",
        ref: o,
        style: { display: "inline-block" },
        onClick: Le(u, ["stop"])
      }, [
        V(f.$slots, "trigger")
      ], 512),
      (m(), A(Qe, { to: "body" }, [
        n.value ? (m(), b("div", {
          key: 0,
          ref_key: "dropdownRef",
          ref: l,
          style: O({
            position: "absolute",
            top: (a.value?.top ?? 0) + "px",
            left: (a.value?.left ?? 0) + "px",
            width: e.matchTriggerWidth ? (a.value?.width ?? "auto") + "px" : "auto"
          })
        }, [
          V(f.$slots, "items")
        ], 4)) : G("", !0)
      ]))
    ], 64));
  }
}), Lt = [
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
], wn = [8, 10, 12, 16, 18, 24], Mt = "Standard", xn = {
  BoldItalic: ["BoldItalic", "Bold", "Italic", "Regular"],
  Bold: ["Bold", "Regular"],
  Italic: ["Italic", "Regular"],
  Regular: ["Regular"]
};
function gt(e, t) {
  return Lt.filter((n) => n.fontName === e && n.style === t).map((n) => n.size);
}
function bn(e, t, n) {
  const a = Lt.some((l) => l.fontName === e) ? e : Mt, o = xn[t] ?? ["Regular"];
  for (const l of o)
    if (gt(a, l).includes(n))
      return { fontName: a, style: l, size: n };
  for (const l of o) {
    const s = gt(a, l);
    if (s.length > 0)
      return { fontName: a, style: l, size: Dt(n, s) };
  }
  return { fontName: a, style: "Regular", size: n };
}
function Ot(e) {
  const { style: t, size: n } = e.shorthand ? kn(e.shorthand) : {
    style: En(e.isBold, e.isItalic),
    size: Dt(e.fontSize ?? 12, wn)
  }, { fontName: a, style: o, size: l } = bn(e.fontName ?? Mt, t, n), s = {
    fontFamily: `${a}-${o}-${l}, ${a}-${o}-${l}-TofuMaker, Arial, sans`,
    fontSize: `${l * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (s.textShadow = `2px 2px 0 ${e.fontShadowColor}`), s;
}
function En(e, t) {
  return e && t ? "BoldItalic" : e ? "Bold" : t ? "Italic" : "Regular";
}
function kn(e) {
  const t = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!t)
    throw new Error(`Invalid shorthand format: ${e}`);
  const n = t[1], a = parseInt(t[2], 10);
  return { style: n, size: a };
}
function Dt(e, t) {
  if (t.length === 0)
    throw new Error("Array cannot be empty");
  return t.reduce((n, a) => {
    const o = Math.abs(a - e), l = Math.abs(n - e);
    return o < l ? a : n;
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
  const a = document.createRange();
  return a.selectNodeContents(e), a.setEnd(n.startContainer, n.startOffset), ne(a.cloneContents()).length;
}
function Pt(e, t) {
  if (e instanceof Text) {
    const o = e.nodeValue?.length ?? 0;
    return t <= o ? { node: e, offset: t, remaining: 0 } : { node: e, offset: o, remaining: t - o };
  }
  if (e instanceof Element) {
    const o = e.getAttribute("data-win55-emoji");
    if (o)
      return t <= 0 ? { node: e.parentNode ?? e, offset: Ve(e), remaining: 0 } : t <= o.length ? { node: e.parentNode ?? e, offset: Ve(e) + 1, remaining: 0 } : {
        node: e.parentNode ?? e,
        offset: Ve(e) + 1,
        remaining: t - o.length
      };
  }
  let n = t, a = {
    offset: e.childNodes.length,
    remaining: n
  };
  for (const o of Array.from(e.childNodes)) {
    const l = Pt(o, n);
    if (l && l.remaining === 0)
      return l;
    l && (n = l.remaining, a = l);
  }
  return {
    node: e,
    offset: e.childNodes.length,
    remaining: a.remaining
  };
}
function Ve(e) {
  return e.parentNode ? Array.prototype.indexOf.call(e.parentNode.childNodes, e) : 0;
}
function Ie(e, t, n = !1) {
  if (t === null || !e.isConnected)
    return;
  const a = Pt(e, t);
  if (!a)
    return;
  const o = document.createRange(), l = window.getSelection();
  n && e.focus({ preventScroll: !0 }), o.setStart(a.node, a.offset), o.collapse(!0), l?.removeAllRanges(), l?.addRange(o);
}
const Ht = "/win-55-ui/emoji", We = `${Ht}/emoji-registry.csv`, Ce = [
  "[\\u{1F1E6}-\\u{1F1FF}]{2}",
  "[0-9#*]\\uFE0F?\\u20E3",
  "\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?)*",
  "\\p{Emoji_Presentation}"
].join("|");
let ze = null, qe = null, $e = null;
function Cn(e) {
  return e.replace(/\/$/, "");
}
function _t(e) {
  return e.trim().replace(/\.gif$/i, "");
}
function Sn(e) {
  const t = {}, n = e.replace(/^\uFEFF/, "").split(/\r?\n/);
  for (const [a, o] of n.entries()) {
    const l = o.trim();
    if (!l || a === 0 && l.toLowerCase() === "emoji,code")
      continue;
    const s = l.indexOf(",");
    if (s === -1) {
      console.warn(`[win-55-ui] Skipping emoji registry row ${a + 1}: missing comma`);
      continue;
    }
    const i = l.slice(0, s).trim(), d = _t(l.slice(s + 1));
    i && d && (t[i] = d);
  }
  return t;
}
async function he(e = {}) {
  const t = e.registryUrl ?? We;
  return $e && t === We ? $e : ((!ze || qe !== t) && (qe = t, ze = fetch(t).then((n) => {
    if (!n.ok)
      throw new Error(
        `Could not load emoji registry from ${t}: ${n.status} ${n.statusText}`
      );
    return n.text();
  }).then(Sn).then((n) => (t === We && ($e = n), n))), ze);
}
function ol() {
  ze = null, qe = null, $e = null;
}
async function Bn(e, t = {}) {
  const a = (await he(t))[e];
  return a ? ae(a, t) : null;
}
function ae(e, t = {}) {
  return `${Cn(t.basePath ?? Ht)}/${_t(e)}.gif`;
}
async function ll(e = {}) {
  return he(e);
}
async function al(e, t = {}) {
  const n = await he(t);
  return e in n;
}
he();
function Tn(e) {
  return e.map((t) => {
    const n = parseInt(t.replace(/^#/, ""), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  });
}
function Rn(e, t, n, a) {
  let o = 1 / 0, l = [0, 0, 0];
  for (const s of a) {
    const i = e - s[0], d = t - s[1], u = n - s[2], f = i * i + d * d + u * u;
    f < o && (o = f, l = s);
  }
  return l;
}
function Vt() {
  return typeof navigator < "u" && /firefox/i.test(navigator.userAgent);
}
const jn = "win55-emoji", Nn = "win55-emoji-image", Q = 15, Ke = 2, vt = Vt(), An = [
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
], In = Tn(An), pt = Ce, zn = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION"
]), ve = /* @__PURE__ */ new WeakMap(), yt = /* @__PURE__ */ new WeakMap(), wt = /* @__PURE__ */ new Map();
function $n(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Fn(e) {
  const t = yt.get(e);
  if (t)
    return t;
  const n = Object.keys(e).sort((l, s) => s.length - l.length).map($n), a = n.length > 0 ? `${n.join("|")}|${pt}` : pt, o = new RegExp(a, "gu");
  return yt.set(e, o), o;
}
function Wt(e) {
  return e.value === !1 ? null : typeof e.value == "object" ? e.value : {};
}
const Ln = "data-win55-richtext";
function Mn(e) {
  return zn.has(e.tagName) || e.hasAttribute("data-win55-emoji");
}
function Ut(e) {
  let t = e.parentElement;
  for (; t; ) {
    const n = ve.get(t);
    if (n && Wt(n.binding))
      return !0;
    t = t.parentElement;
  }
  return !1;
}
function On(e, t) {
  const n = [], a = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, {
    acceptNode(o) {
      const l = o.parentElement;
      return !l || Mn(l) || t && l.closest(`[${Ln}]`) || !o.nodeValue?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  for (; a.nextNode(); )
    n.push(a.currentNode);
  return n;
}
function Dn() {
  return `${Q * Ke}px`;
}
function Pn(e, t, n, a, o) {
  const l = Math.min(1, Math.max(0, o)), s = e.getImageData(0, 0, t, n), i = s.data;
  for (let d = 0; d < i.length; d += 4) {
    const u = i[d], f = i[d + 1], c = i[d + 2];
    if (i[d + 3] < 80)
      i[d] = 0, i[d + 1] = 0, i[d + 2] = 0, i[d + 3] = 0;
    else {
      const [y, w, E] = Rn(
        u,
        f,
        c,
        a
      ), C = Math.round(u + (y - u) * l), B = Math.round(f + (w - f) * l), I = Math.round(c + (E - c) * l);
      i[d] = C, i[d + 1] = B, i[d + 2] = I, i[d + 3] = 255;
    }
  }
  e.putImageData(s, 0, 0);
}
function Hn(e, t, n) {
  const a = e.getImageData(0, 0, t, n), o = new Uint8ClampedArray(a.data), l = a.data, s = (i, d) => (d * t + i) * 4;
  for (let i = 0; i < n; i++)
    for (let d = 0; d < t; d++) {
      const u = s(d, i), c = [
        d > 0 ? s(d - 1, i) : -1,
        d < t - 1 ? s(d + 1, i) : -1,
        i > 0 ? s(d, i - 1) : -1,
        i < n - 1 ? s(d, i + 1) : -1
      ].filter((h) => h !== -1).filter((h) => o[h + 3] > 127);
      if (o[u + 3] > 127 && c.length <= 1)
        l[u] = l[u + 1] = l[u + 2] = l[u + 3] = 0;
      else if (o[u + 3] === 0 && c.length >= 3) {
        const h = c[0];
        l[u] = o[h], l[u + 1] = o[h + 1], l[u + 2] = o[h + 2], l[u + 3] = 255;
      }
    }
  e.putImageData(a, 0, 0);
}
function Ze(e) {
  const t = wt.get(e);
  if (t)
    return t;
  const n = _n(e);
  return wt.set(e, n), n;
}
function _n(e) {
  const t = document.createElement("canvas");
  t.width = Q, t.height = Q;
  const n = t.getContext("2d");
  if (!n)
    return "";
  const a = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif', o = Q * 4;
  n.textBaseline = "alphabetic", n.font = `${o}px ${a}`;
  const l = n.measureText(e), s = l.actualBoundingBoxLeft + l.actualBoundingBoxRight, i = l.actualBoundingBoxAscent + l.actualBoundingBoxDescent;
  if (s > 0 && i > 0) {
    const d = o * Math.min(Q / s, Q / i);
    n.font = `${d}px ${a}`;
    const u = n.measureText(e), f = u.actualBoundingBoxLeft + u.actualBoundingBoxRight, c = u.actualBoundingBoxAscent + u.actualBoundingBoxDescent, h = (Q - f) / 2 + u.actualBoundingBoxLeft, y = (Q - c) / 2 + u.actualBoundingBoxAscent;
    n.fillText(e, h, y - 0.5), Pn(n, Q, Q, In, 0.1), Hn(n, Q, Q), qn(t);
  }
  return t.toDataURL("image/png");
}
function Vn(e, t, n) {
  const a = document.createElement("span"), o = document.createElement("img");
  return a.className = n.className ?? jn, a.contentEditable = "false", a.dataset.win55Emoji = e, a.role = "img", a.ariaLabel = e, a.style.setProperty("--win55-emoji-size", Dn()), o.src = t, o.alt = e, o.className = Nn, o.draggable = !1, o.dataset.win55EmojiImg = "true", o.addEventListener("load", () => {
    const l = o.naturalWidth * Ke, s = o.naturalHeight * Ke;
    a.style.width = `${l}px`, a.style.height = `${s}px`, o.style.width = `${l}px`, o.style.height = `${s}px`;
  }, { once: !0 }), a.append(o), a;
}
function Wn(e, t, n, a) {
  const o = e.parentElement;
  if (!o)
    return;
  const l = window.getSelection(), s = l && l.rangeCount > 0 && l.isCollapsed ? l.getRangeAt(0) : null, i = s?.startContainer === e, d = !!(s && s.startContainer === o && s.startOffset === Array.prototype.indexOf.call(o.childNodes, e) + 1), u = i || d, f = d ? e.nodeValue?.length ?? 0 : i ? s?.startOffset ?? null : null, c = e.nodeValue ?? "";
  let h = 0, y = !1;
  const w = document.createDocumentFragment();
  let E = null, C = 0;
  const B = ($, F) => {
    E || (E = $, C = F);
  };
  t.lastIndex = 0;
  for (const $ of c.matchAll(t)) {
    const F = $[0], D = $.index, g = n[F];
    if (D === void 0)
      continue;
    const T = g ? ae(g, a) : Ze(F);
    if (!T)
      continue;
    y = !0;
    const L = c.slice(h, D);
    if (vt || L.length > 0) {
      const N = document.createTextNode(L);
      f !== null && f >= h && f <= D && B(N, f - h), w.append(N);
    } else f !== null && f >= h && f <= D && B(o, Array.prototype.indexOf.call(o.childNodes, e) + w.childNodes.length);
    const q = Vn(F, T, a);
    w.append(q), f !== null && f > D && f <= D + F.length && B(o, Array.prototype.indexOf.call(o.childNodes, e) + w.childNodes.length), h = D + F.length;
  }
  if (!y)
    return;
  const I = c.slice(h);
  if (vt || I.length > 0) {
    const $ = document.createTextNode(I);
    f !== null && f >= h && B($, f - h), w.append($);
  } else f !== null && f >= h && B(o, Array.prototype.indexOf.call(o.childNodes, e) + w.childNodes.length);
  if (e.replaceWith(w), u && E) {
    const $ = document.createRange();
    $.setStart(E, C), $.collapse(!0), l?.removeAllRanges(), l?.addRange($);
  }
}
function Yt(e, t, n, a) {
  const o = Fn(t);
  if (o)
    for (const l of On(e, a))
      Wn(l, o, t, n);
}
const Ue = /* @__PURE__ */ new WeakMap();
async function Ye(e, t = {}) {
  const n = (Ue.get(e) ?? 0) + 1;
  Ue.set(e, n);
  const a = await he(t);
  Ue.get(e) !== n || !e.isConnected || Yt(e, a, t, !1);
}
async function Un(e, t) {
  const n = Wt(t.binding);
  if (!n)
    return;
  t.version += 1;
  const a = t.version, o = await he(n);
  ve.get(e)?.version !== a || !e.isConnected || Ut(e) || Yt(e, o, n, !0);
}
function Je(e, t) {
  t.renderQueued || (t.renderQueued = !0, t.renderFrame = window.requestAnimationFrame(() => {
    t.renderQueued = !1, t.renderFrame = null, Un(e, t).catch((n) => {
      console.warn("[win-55-ui] Could not render custom emoji.", n);
    });
  }));
}
function Yn(e, t) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !t.clipboardData || Ut(e))
    return;
  const a = n.getRangeAt(0);
  if (!a.intersectsNode(e))
    return;
  const o = a.cloneContents(), l = ne(o);
  l && (t.clipboardData.setData("text/plain", l), t.preventDefault());
}
function Xn(e, t) {
  const n = new MutationObserver(() => {
    Je(e, t);
  });
  return n.observe(e, {
    characterData: !0,
    childList: !0,
    subtree: !0
  }), n;
}
const Gn = {
  mounted(e, t) {
    const n = {
      binding: t,
      copyHandler: (a) => Yn(e, a),
      observer: null,
      renderFrame: null,
      renderQueued: !1,
      version: 0
    };
    n.observer = Xn(e, n), ve.set(e, n), e.addEventListener("copy", n.copyHandler), Je(e, n);
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
function qn(e) {
  const t = e.getContext("2d");
  if (!t) {
    console.warn("Unable to get 2D context from canvas");
    return;
  }
  const n = e.width, a = e.height, o = t.getImageData(0, 0, n, a), l = o.data, s = (c, h) => c < 0 || h < 0 || c >= n || h >= a ? 0 : l[(h * n + c) * 4 + 3], i = Array.from({ length: a }, () => Array(n).fill(!1)), d = [];
  for (let c = 0; c < n; c++)
    s(c, 0) === 0 && !i[0][c] && (i[0][c] = !0, d.push({ x: c, y: 0 })), s(c, a - 1) === 0 && !i[a - 1][c] && (i[a - 1][c] = !0, d.push({ x: c, y: a - 1 }));
  for (let c = 0; c < a; c++)
    s(0, c) === 0 && !i[c][0] && (i[c][0] = !0, d.push({ x: 0, y: c })), s(n - 1, c) === 0 && !i[c][n - 1] && (i[c][n - 1] = !0, d.push({ x: n - 1, y: c }));
  const u = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  for (; d.length; ) {
    const { x: c, y: h } = d.shift();
    for (const [y, w] of u) {
      const E = c + y, C = h + w;
      E >= 0 && E < n && C >= 0 && C < a && !i[C][E] && s(E, C) === 0 && (i[C][E] = !0, d.push({ x: E, y: C }));
    }
  }
  const f = Array.from({ length: a }, () => Array(n).fill(!1));
  for (let c = 0; c < a; c++)
    for (let h = 0; h < n; h++) {
      if (s(h, c) === 0) continue;
      let y = !1;
      for (const [w, E] of u) {
        const C = h + w, B = c + E;
        if (C < 0 || B < 0 || C >= n || B >= a) {
          y = !0;
          break;
        }
        if (s(C, B) === 0 && i[B][C]) {
          y = !0;
          break;
        }
      }
      y && (f[c][h] = !0);
    }
  for (let c = 0; c < a; c++)
    for (let h = 0; h < n; h++)
      if (f[c][h]) {
        const y = (c * n + h) * 4;
        l[y] = 0, l[y + 1] = 0, l[y + 2] = 0;
      }
  t.putImageData(o, 0, 0);
}
const il = Gn, xt = typeof Intl.Segmenter == "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function Xt(e) {
  return xt ? Array.from(xt.segment(e), (t) => t.segment) : Array.from(e);
}
function bt(e) {
  return Xt(e).length;
}
function Kn(e, t) {
  return Xt(e).slice(0, t).join("");
}
function Jn(e) {
  const t = window.getSelection();
  if (!t || t.rangeCount === 0 || !t.isCollapsed)
    return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.startContainer))
    return null;
  const a = ke(e), o = n.cloneRange();
  o.collapse(!0);
  const l = document.createElement("span");
  l.textContent = "​", o.insertNode(l);
  const s = l.getBoundingClientRect(), i = l.parentNode;
  return l.remove(), i?.normalize(), Ie(e, a), s;
}
const Et = "/win-55-ui/emoji/emoji-categories.json";
let Xe = null;
async function et() {
  return Xe || (Xe = fetch(Et).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${Et}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), Xe;
}
async function Qn(e) {
  const t = e.trim().toLowerCase();
  if (!t)
    return [];
  const n = await et(), a = [], o = /* @__PURE__ */ new Set();
  for (const l of n) {
    const s = l.shortcodes.find((i) => i.toLowerCase().startsWith(t));
    s && (a.push({ emoji: l.emoji, code: l.code, shortcode: s }), o.add(l.code));
  }
  for (const l of n) {
    if (o.has(l.code))
      continue;
    const s = l.tags.find((i) => i.toLowerCase().startsWith(t));
    s && (a.push({ emoji: l.emoji, code: l.code, shortcode: l.shortcodes[0] ?? s }), o.add(l.code));
  }
  return a;
}
async function Gt(e) {
  const t = e.trim().toLowerCase();
  if (!t)
    return;
  const a = (await et()).find((o) => o.shortcodes.some((l) => l.toLowerCase() === t));
  return a ? { emoji: a.emoji, code: a.code } : void 0;
}
const ye = S(!1), re = S({ x: 160, y: 120, width: 360, height: 420 }), tt = un(null);
function kt(e) {
  tt.value = e;
}
function Zn() {
  ye.value = !0;
}
function Ct() {
  ye.value = !1;
}
function eo(e) {
  tt.value?.insertEmoji(e);
}
let St = 0;
function to(e) {
  const t = e[St % e.length];
  return St += 1, t;
}
const no = {
  key: 0,
  class: "baseinput-emoji-wrapper"
}, oo = ["src"], lo = { class: "shortcode-suggestions" }, ao = {
  key: 0,
  class: "shortcode-suggestion-ellipsis"
}, io = ["src"], ro = {
  key: 1,
  class: "shortcode-suggestion-ellipsis"
}, so = "546", je = 5, co = 200, rl = /* @__PURE__ */ P({
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
    const a = [
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
    ], o = e, l = n, s = S(null), i = j(() => s.value?.el ?? null);
    de(() => {
      i.value && o.modelValue && (i.value.innerText = o.modelValue);
    }), ue(() => o.modelValue, (r) => {
      if (i.value && ne(i.value) !== r) {
        const v = document.activeElement === i.value, p = v ? ke(i.value) : null;
        i.value.innerText = r ?? "", v && Ie(i.value, p);
      }
    });
    const d = () => {
      if (!i.value) return;
      let r = ne(i.value);
      if (o.multiline || (r = r.replace(/\n/g, "")), o.maxLength && bt(r) > o.maxLength) {
        r = Kn(r, o.maxLength), i.value.innerText = r;
        const v = document.createRange(), p = window.getSelection();
        v.selectNodeContents(i.value), v.collapse(!1), p?.removeAllRanges(), p?.addRange(v);
      }
      Qt(), l("update:modelValue", r), Jt();
    }, u = /:([A-Za-z0-9_+-]*)$/, f = /:([A-Za-z0-9_+-]{2,}):$/, c = S(!1), h = S(null), y = S([]), w = S(0), E = S(null);
    let C = 0;
    const B = S(0);
    function I(r) {
      r < B.value ? B.value = r : r > B.value + je - 1 && (B.value = r - je + 1);
    }
    const $ = j(() => {
      const r = B.value;
      return y.value.slice(r, r + je).map((v, p) => ({ match: v, index: r + p }));
    }), F = j(() => B.value > 0), D = j(() => B.value + je < y.value.length), g = () => {
      c.value = !1, h.value = null, y.value = [], w.value = 0, B.value = 0;
    }, T = (r, v) => {
      if (!i.value) return;
      const p = window.getSelection();
      if (!p || p.rangeCount === 0 || !p.isCollapsed) return;
      const x = p.getRangeAt(0), R = x.startContainer;
      if (!(R instanceof Text) || !i.value.contains(R)) return;
      const W = x.startOffset, J = W - r;
      if (J < 0) return;
      const le = R.nodeValue ?? "";
      Te(), R.nodeValue = le.slice(0, J) + v + le.slice(W), se(R, J + v.length), ge(), d(), Ye(i.value);
    }, L = () => {
      const r = y.value[w.value];
      !r || h.value === null || (T(1 + h.value.length, r.emoji), g());
    }, q = S(null), H = { insertEmoji: (r) => {
      if (!i.value) return;
      const x = (document.activeElement === i.value ? ke(i.value) : null) ?? q.value ?? bt(ne(i.value));
      Ie(i.value, x, !0);
      const R = window.getSelection();
      if (!R || R.rangeCount === 0 || !R.isCollapsed) return;
      const W = R.getRangeAt(0);
      Te(), W.deleteContents();
      const J = document.createTextNode(r);
      W.insertNode(J), se(J, J.length), ge(), d(), Ye(i.value);
    } }, Y = S(!1), K = j(() => ye.value && tt.value === H), ee = j(() => o.showEmojiButton && (Y.value || K.value)), te = S(a[0]), Me = j(() => K.value ? so : te.value), ie = () => {
      te.value = to(a);
    };
    ue(ee, (r) => {
      r && ie();
    });
    const Be = () => {
      Y.value = !0, kt(H);
    }, Kt = () => {
      kt(H), Zn();
    }, Jt = async () => {
      if (!i.value) {
        g();
        return;
      }
      const r = window.getSelection();
      if (!r || r.rangeCount === 0 || !r.isCollapsed) {
        g();
        return;
      }
      const v = r.getRangeAt(0), p = v.startContainer;
      if (!(p instanceof Text) || !i.value.contains(p)) {
        g();
        return;
      }
      const x = (p.nodeValue ?? "").slice(0, v.startOffset), R = c.value ? h.value : null, W = f.exec(x);
      if (W) {
        if (R === W[1]) {
          const mt = await Gt(W[1]);
          mt && T(W[0].length, mt.emoji);
        }
        g();
        return;
      }
      const le = u.exec(x)?.[1] ?? null;
      if (le === null || le.length < 2) {
        g();
        return;
      }
      const be = Jn(i.value);
      if (!be) {
        g();
        return;
      }
      const ft = ++C, ht = await Qn(le);
      if (ft !== C || ht.length === 0) {
        ft === C && g();
        return;
      }
      h.value = le, y.value = ht, w.value = 0, B.value = 0, E.value = { top: be.top, bottom: be.bottom, left: be.left, right: be.right }, c.value = !0;
    }, Oe = [], De = [];
    let xe = null, me = null;
    const Pe = () => i.value ? { html: i.value.innerHTML, caret: ke(i.value) } : null, nt = (r) => {
      i.value && (i.value.innerHTML = r.html, Ie(i.value, r.caret, !0), d());
    }, Te = () => {
      xe || (xe = Pe()), De.length = 0;
    }, ge = () => {
      me !== null && (clearTimeout(me), me = null), xe && (Oe.push(xe), xe = null);
    }, Qt = () => {
      me !== null && clearTimeout(me), me = setTimeout(ge, co);
    }, Zt = () => {
      ge();
      const r = Oe.pop();
      if (!r) return;
      const v = Pe();
      v && De.push(v), nt(r);
    }, en = () => {
      const r = De.pop();
      if (!r) return;
      const v = Pe();
      v && Oe.push(v), nt(r);
    }, se = (r, v) => {
      const p = document.createRange(), x = window.getSelection();
      i.value?.focus({ preventScroll: !0 }), p.setStart(r, v), p.collapse(!0), x?.removeAllRanges(), x?.addRange(p);
    }, tn = (r) => r instanceof Text ? r.nodeValue?.length ?? 0 : r.childNodes.length, ce = (r) => r.parentNode ? Array.prototype.indexOf.call(r.parentNode.childNodes, r) : 0, He = (r, v) => r instanceof Text ? v > 0 ? null : r.previousSibling ?? (r.parentNode && r.parentNode !== i.value ? He(r.parentNode, ce(r.parentNode)) : null) : r.childNodes[v - 1] ?? (r.parentNode && r !== i.value ? He(r.parentNode, ce(r)) : null), _e = (r, v) => r instanceof Text ? v < (r.nodeValue?.length ?? 0) ? null : r.nextSibling ?? (r.parentNode && r.parentNode !== i.value ? _e(r.parentNode, ce(r.parentNode) + 1) : null) : r.childNodes[v] ?? (r.parentNode && r !== i.value ? _e(r.parentNode, ce(r) + 1) : null), nn = (r, v) => {
      let p = r;
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
    }, ot = (r) => {
      if (r.cloneContents().querySelector?.("[data-win55-emoji]"))
        return !0;
      const p = r.startContainer instanceof Element ? r.startContainer : r.startContainer.parentElement, x = r.endContainer instanceof Element ? r.endContainer : r.endContainer.parentElement;
      return !!(p?.closest("[data-win55-emoji]") || x?.closest("[data-win55-emoji]"));
    }, lt = (r) => {
      if (!i.value) return;
      const v = r.startContainer, p = r.startOffset;
      r.deleteContents(), v.isConnected && i.value.contains(v) ? se(v, Math.min(p, tn(v))) : se(i.value, i.value.childNodes.length), d();
    }, on = (r) => {
      const v = document.createRange();
      return v.setStart(r.startContainer, r.startOffset), v.setEnd(r.endContainer, r.endOffset), v;
    }, ln = (r) => r instanceof HTMLElement && r.hasAttribute("data-win55-emoji"), an = (r, v, p) => {
      if (!i.value || r.collapsed || r.startContainer !== r.endContainer || !(r.startContainer instanceof Text))
        return !1;
      const x = r.startContainer, R = x.nodeValue?.length ?? 0;
      if (r.startOffset !== 0 || r.endOffset !== R)
        return !1;
      const W = v === "backward" ? x.previousSibling : x.nextSibling;
      if (!ln(W) || !x.parentNode)
        return !1;
      p();
      const J = x.parentNode, le = ce(x);
      return x.remove(), se(J, le), d(), !0;
    }, at = (r, v, p) => {
      const x = p === "backward" ? He(r, v) : _e(r, v);
      return nn(x, p);
    }, it = (r, v, p, x) => {
      const R = at(r, v, p);
      if (!R || !R.parentNode)
        return !1;
      x();
      const W = R.parentNode, J = ce(R);
      return R.remove(), se(W, J), d(), !0;
    }, rn = (r, v, p) => {
      if (!i.value || !i.value.contains(r.startContainer))
        return "none";
      const x = on(r);
      return x.collapsed ? it(
        r.startContainer,
        r.startOffset,
        v,
        p
      ) ? "deleted" : "none" : ot(x) ? (p(), lt(x), "deleted") : an(x, v, p) ? "deleted" : ne(x.cloneContents()) ? "native" : "none";
    }, sn = (r, v) => {
      if (!i.value) return !1;
      const p = window.getSelection();
      if (!p || p.rangeCount === 0)
        return !1;
      const x = p.getRangeAt(0);
      return i.value.contains(x.startContainer) ? p.isCollapsed ? it(
        x.startContainer,
        x.startOffset,
        r,
        v
      ) : ot(x) ? (v(), lt(x), !0) : !1 : !1;
    }, cn = (r) => {
      if (!Vt() || r.shiftKey || r.ctrlKey || r.metaKey || r.altKey || r.key !== "ArrowLeft" && r.key !== "ArrowRight" || !i.value) return !1;
      const v = window.getSelection();
      if (!v || v.rangeCount === 0 || !v.isCollapsed) return !1;
      const p = v.getRangeAt(0);
      if (!i.value.contains(p.startContainer)) return !1;
      const x = r.key === "ArrowLeft" ? "backward" : "forward", R = at(p.startContainer, p.startOffset, x);
      return !R || !R.parentNode ? !1 : (r.preventDefault(), se(R.parentNode, ce(R) + (x === "forward" ? 1 : 0)), !0);
    }, rt = (r) => {
      if (c.value) {
        if (r.key === "ArrowDown") {
          r.preventDefault(), w.value = (w.value + 1) % y.value.length, I(w.value);
          return;
        }
        if (r.key === "ArrowUp") {
          r.preventDefault(), w.value = (w.value - 1 + y.value.length) % y.value.length, I(w.value);
          return;
        }
        if (r.key === "Tab" || r.key === " " || r.key === "Enter") {
          r.preventDefault(), L();
          return;
        }
        if (r.key === "Escape") {
          r.preventDefault(), g();
          return;
        }
      }
      !o.multiline && r.key === "Enter" && r.preventDefault(), r.key === "Tab" && r.preventDefault(), cn(r);
    }, st = (r) => {
      if (!i.value) return;
      if (r.inputType === "historyUndo" || r.inputType === "historyRedo") {
        r.preventDefault(), r.inputType === "historyUndo" ? Zt() : en();
        return;
      }
      if (Te(), r.inputType !== "deleteContentBackward" && r.inputType !== "deleteContentForward")
        return;
      if (ne(i.value) === "") {
        r.preventDefault(), i.value.focus({ preventScroll: !0 });
        return;
      }
      const v = r.inputType === "deleteContentBackward" ? "backward" : "forward", p = r.getTargetRanges();
      for (const x of p) {
        const R = rn(
          x,
          v,
          () => r.preventDefault()
        );
        if (R === "deleted") {
          i.value.focus({ preventScroll: !0 });
          return;
        }
        if (R === "native")
          return;
      }
      sn(v, () => r.preventDefault()) && i.value.focus({ preventScroll: !0 });
    }, ct = (r) => {
      r.preventDefault();
      let v = r.clipboardData?.getData("text/plain") ?? "";
      if (o.multiline || (v = v.replace(/\n/g, " ")), !i.value) return;
      Te();
      const p = window.getSelection(), x = p?.getRangeAt(0);
      if (x) {
        x.deleteContents();
        const R = document.createTextNode(v);
        x.insertNode(R), x.collapse(!1), p?.removeAllRanges(), p?.addRange(x);
      }
      d(), ge(), Ye(i.value);
    }, ut = () => {
      ge(), g(), Y.value = !1, i.value && (q.value = ke(i.value)), i.value && ne(i.value) === "" && (i.value.innerHTML = "");
    }, dt = j(() => ({
      ...o.extraStyles,
      ...Ot({ fontColor: "black" }),
      overflow: "auto",
      ...o.showEmojiButton ? { paddingRight: "34px" } : {}
    }));
    return t({ el: i }), (r, v) => (m(), b(M, null, [
      e.showEmojiButton ? (m(), b("div", no, [
        U(Z, {
          ref_key: "boxRef",
          ref: s,
          type: e.boxType,
          contenteditable: !e.disabled,
          "extra-styles": dt.value,
          "data-placeholder": e.placeholder,
          role: "textbox",
          "aria-multiline": e.multiline,
          "aria-disabled": e.disabled,
          onInput: d,
          onKeydown: rt,
          onBeforeinput: st,
          onPaste: ct,
          onFocus: Be,
          onBlur: ut
        }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"]),
        ee.value ? (m(), b("img", {
          key: 0,
          src: _(ae)(Me.value),
          width: "30",
          height: "30",
          class: "baseinput-emoji-button",
          "data-emoji-picker-trigger": "",
          onMousedown: v[0] || (v[0] = Le(() => {
          }, ["prevent"])),
          onClick: Le(Kt, ["stop"])
        }, null, 40, oo)) : G("", !0)
      ])) : (m(), A(Z, {
        key: 1,
        ref_key: "boxRef",
        ref: s,
        type: e.boxType,
        contenteditable: !e.disabled,
        "extra-styles": dt.value,
        "data-placeholder": e.placeholder,
        role: "textbox",
        "aria-multiline": e.multiline,
        "aria-disabled": e.disabled,
        onInput: d,
        onKeydown: rt,
        onBeforeinput: st,
        onPaste: ct,
        onFocus: Be,
        onBlur: ut
      }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"])),
      c.value && E.value ? (m(), A(pn, {
        key: 2,
        shown: !0,
        anchor: E.value,
        side: "top"
      }, {
        content: z(() => [
          k("div", lo, [
            F.value ? (m(), b("div", ao, "...")) : G("", !0),
            (m(!0), b(M, null, X($.value, ({ match: p, index: x }) => (m(), b("div", {
              key: p.shortcode,
              class: Se(["shortcode-suggestion", { "shortcode-suggestion--selected": x === w.value }])
            }, [
              k("img", {
                src: _(ae)(p.code),
                width: "30",
                height: "30",
                class: "shortcode-suggestion-image"
              }, null, 8, io),
              k("span", null, ":" + oe(p.shortcode) + ":", 1)
            ], 2))), 128)),
            D.value ? (m(), b("div", ro, "...")) : G("", !0)
          ])
        ]),
        _: 1
      }, 8, ["anchor"])) : G("", !0)
    ], 64));
  }
}), Fe = /* @__PURE__ */ P({
  __name: "Button",
  props: {
    baseType: { default: "panel-d-1" },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: t }) {
    const n = e, a = t, o = S(!1), l = S(!1), s = j(() => !n.disabled && o.value && l.value), i = j(() => n.disabled), d = (E) => {
      n.disabled || E.button !== 0 || (o.value = !0, l.value = !0);
    }, u = () => {
      n.disabled || (l.value = !0);
    }, f = () => {
      l.value = !1;
    }, c = (E) => {
      n.disabled || E.button !== 0 || (o.value && l.value && a("click"), o.value = !1);
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
      cursor: i.value ? "not-allowed" : "default",
      ...n.extraStyles
    })), y = j(() => ({
      transform: s.value ? "translate(2px, 2px)" : "translate(0, 0)",
      opacity: i.value ? 0.5 : 1
    })), w = j(() => s.value ? "indent" : n.baseType);
    return (E, C) => (m(), A(Z, {
      type: w.value,
      "extra-styles": h.value,
      "extra-class": e.extraClass,
      onMousedown: d,
      onMouseenter: u,
      onMouseleave: f
    }, {
      default: z(() => [
        k("div", {
          style: O(y.value)
        }, [
          V(E.$slots, "default")
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"]));
  }
}), uo = { style: { display: "flex", "align-items": "center" } }, fo = ["src", "alt"], ho = ["checked", "disabled", "value"], sl = /* @__PURE__ */ P({
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
    const n = e, a = t, o = () => {
      n.disabled || a("update:modelValue", !n.modelValue);
    };
    return (l, s) => (m(), b("div", {
      class: Se(["checkbox-container", { disabled: e.disabled }]),
      style: O({
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
      k("div", uo, [
        k("img", {
          draggable: "false",
          src: e.modelValue ? e.checkedIcon : e.uncheckedIcon,
          alt: e.modelValue ? "checked" : "unchecked"
        }, null, 8, fo)
      ]),
      k("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, ho),
      e.label ? (m(), b("span", {
        key: 0,
        style: O({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, oe(e.label), 5)) : G("", !0)
    ], 6));
  }
}), mo = /* @__PURE__ */ P({
  __name: "HDivider",
  setup(e) {
    return (t, n) => (m(), A(Z, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), cl = /* @__PURE__ */ P({
  __name: "MenuDropdown",
  setup(e) {
    return (t, n) => (m(), A(yn, null, {
      trigger: z(() => [
        V(t.$slots, "trigger")
      ]),
      items: z(() => [
        U(Z, { type: "panel-d-1" }, {
          default: z(() => [
            V(t.$slots, "items")
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), go = { style: { display: "flex", "align-items": "center" } }, vo = ["src"], po = ["src"], yo = ["checked", "disabled", "value", "name"], ul = /* @__PURE__ */ P({
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
    const n = e, a = t, o = j(() => n.modelValue === n.value), l = (s) => {
      s.preventDefault(), !n.disabled && (o.value || a("update:modelValue", n.value));
    };
    return (s, i) => (m(), b("div", {
      class: Se(["radio-container", { disabled: e.disabled }]),
      style: O({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: e.disabled ? 0.5 : 1,
        cursor: e.disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        marginBottom: "2px"
      }),
      onClick: l
    }, [
      k("div", go, [
        o.value ? (m(), b("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, vo)) : (m(), b("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, po))
      ]),
      k("input", {
        type: "radio",
        checked: o.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, yo),
      e.label ? (m(), b("span", {
        key: 0,
        style: O({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, oe(e.label), 5)) : G("", !0)
    ], 6));
  }
}), pe = /* @__PURE__ */ P({
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
    const t = e, n = j(() => t.element ?? "span"), a = j(() => {
      const o = Ot(t);
      return t.element || (o.display = "contents"), o;
    });
    return (o, l) => (m(), A(dn(n.value), {
      style: O(a.value)
    }, {
      default: z(() => [
        V(o.$slots, "default")
      ]),
      _: 3
    }, 8, ["style"]));
  }
}), wo = { key: 1 }, xo = {
  key: 4,
  style: { "text-decoration": "underline" }
}, bo = {
  key: 5,
  style: { "text-decoration": "line-through" }
}, Eo = ["href"], ko = ["aria-label", "data-win55-emoji"], Co = ["src", "alt"], So = /* @__PURE__ */ P({
  __name: "RichTextNode",
  props: {
    node: {},
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    function t(n, a) {
      return n ? ae(n) : Ze(a);
    }
    return (n, a) => {
      const o = fn("RichTextNode", !0);
      return e.node.type === "text" ? (m(), b(M, { key: 0 }, [
        we(oe(e.node.value), 1)
      ], 64)) : e.node.type === "break" ? (m(), b("br", wo)) : e.node.type === "bold" ? (m(), A(pe, {
        key: 2,
        "is-bold": ""
      }, {
        default: z(() => [
          (m(!0), b(M, null, X(e.node.children, (l, s) => (m(), A(o, {
            key: s,
            node: l,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "italic" ? (m(), A(pe, {
        key: 3,
        "is-italic": ""
      }, {
        default: z(() => [
          (m(!0), b(M, null, X(e.node.children, (l, s) => (m(), A(o, {
            key: s,
            node: l,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "underline" ? (m(), b("span", xo, [
        (m(!0), b(M, null, X(e.node.children, (l, s) => (m(), A(o, {
          key: s,
          node: l,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "strike" ? (m(), b("span", bo, [
        (m(!0), b(M, null, X(e.node.children, (l, s) => (m(), A(o, {
          key: s,
          node: l,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "color" ? (m(), A(pe, {
        key: 6,
        "font-color": e.node.value
      }, {
        default: z(() => [
          (m(!0), b(M, null, X(e.node.children, (l, s) => (m(), A(o, {
            key: s,
            node: l,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-color"])) : e.node.type === "size" && e.allowSizes ? (m(), A(pe, {
        key: 7,
        "font-size": e.node.value
      }, {
        default: z(() => [
          (m(!0), b(M, null, X(e.node.children, (l, s) => (m(), A(o, {
            key: s,
            node: l,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-size"])) : e.node.type === "size" ? (m(!0), b(M, { key: 8 }, X(e.node.children, (l, s) => (m(), A(o, {
        key: s,
        node: l,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "url" && e.allowLinks ? (m(), b("a", {
        key: 9,
        href: e.node.href,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "richtext-link"
      }, [
        (m(!0), b(M, null, X(e.node.children, (l, s) => (m(), A(o, {
          key: s,
          node: l,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ], 8, Eo)) : e.node.type === "url" ? (m(!0), b(M, { key: 10 }, X(e.node.children, (l, s) => (m(), A(o, {
        key: s,
        node: l,
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
          src: t(e.node.code, e.node.emoji),
          alt: e.node.emoji,
          draggable: "false"
        }, null, 8, Co)
      ], 8, ko)) : G("", !0);
    };
  }
}), Bo = {
  b: "bold",
  i: "italic",
  u: "underline",
  s: "strike",
  strike: "strike",
  color: "color",
  size: "size",
  url: "url"
}, To = /* @__PURE__ */ new Set(["br"]), Bt = {
  normal: 12,
  big: 24
};
function qt(e) {
  return e.map((t) => t.type === "text" ? t.value : t.type === "emoji" ? t.emoji : t.type === "break" ? `
` : qt(t.children)).join("");
}
function Tt(e) {
  switch (e.tagType) {
    case "color":
      return { type: "color", value: e.value ?? "inherit", children: e.children };
    case "size": {
      const t = (e.value ?? "").trim().toLowerCase(), n = Bt[t], a = Number.parseInt(e.value ?? "", 10);
      return { type: "size", value: n ?? (Number.isFinite(a) ? a : Bt.normal), children: e.children };
    }
    case "url":
      return {
        type: "url",
        href: e.value ?? qt(e.children).trim(),
        children: e.children
      };
    default:
      return { type: e.tagType, children: e.children };
  }
}
function Ro(e, t) {
  for (let n = e.length - 1; n >= 0; n--)
    if (e[n].tagType === t) return n;
  return -1;
}
function jo(e, t) {
  if (!e) return [];
  if (!t) return [{ type: "text", value: e }];
  const n = [], a = /:([a-zA-Z0-9_+-]+):/g;
  let o = 0, l;
  for (; l = a.exec(e); ) {
    const s = t.get(l[1].toLowerCase());
    s && (l.index > o && n.push({ type: "text", value: e.slice(o, l.index) }), n.push({ type: "emoji", emoji: s.emoji, code: s.code }), o = l.index + l[0].length);
  }
  return o < e.length && n.push({ type: "text", value: e.slice(o) }), n.length > 0 ? n : [{ type: "text", value: e }];
}
function No(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const Rt = /* @__PURE__ */ new WeakMap(), Ao = new RegExp(Ce, "gu");
function Io(e) {
  if (!e) return Ao;
  const t = Rt.get(e);
  if (t) return t;
  const n = Object.keys(e).sort((l, s) => s.length - l.length).map(No), a = n.length > 0 ? `${n.join("|")}|${Ce}` : Ce, o = new RegExp(a, "gu");
  return Rt.set(e, o), o;
}
function zo(e, t) {
  const n = Io(t), a = [];
  let o = 0, l;
  for (n.lastIndex = 0; l = n.exec(e); ) {
    const s = l[0], i = t?.[s];
    l.index > o && a.push({ type: "text", value: e.slice(o, l.index) }), a.push({ type: "emoji", emoji: s, code: i }), o = l.index + s.length;
  }
  return o < e.length && a.push({ type: "text", value: e.slice(o) }), a.length > 0 ? a : [{ type: "text", value: e }];
}
function $o(e, t, n) {
  const a = [];
  for (const o of jo(e, t))
    o.type === "text" ? a.push(...zo(o.value, n)) : a.push(o);
  return a;
}
function Fo(e, t, n = null) {
  const a = [], o = [], l = /\[(\/?)(\w+)(?:=([^\]]*))?\]/g;
  let s = 0, i;
  const d = () => o.length ? o[o.length - 1].children : a, u = (f) => d().push(...$o(f, t, n));
  for (; i = l.exec(e); ) {
    const [f, c, h, y] = i, w = h.toLowerCase();
    if (To.has(w)) {
      u(e.slice(s, i.index)), s = i.index + f.length, d().push({ type: "break" });
      continue;
    }
    const E = Bo[w];
    if (!E) continue;
    if (u(e.slice(s, i.index)), s = i.index + f.length, !c) {
      o.push({ tagType: E, value: y, children: [] });
      continue;
    }
    const C = Ro(o, E);
    if (C === -1) {
      u(f);
      continue;
    }
    for (; o.length > C + 1; ) {
      const I = o.pop();
      o[o.length - 1].children.push(Tt(I));
    }
    const B = o.pop();
    d().push(Tt(B));
  }
  for (u(e.slice(s)); o.length; ) {
    const f = o.pop();
    (o.length ? o[o.length - 1].children : a).push(...f.children);
  }
  return a;
}
const Lo = {
  "data-win55-richtext": "",
  style: { display: "contents" }
}, dl = /* @__PURE__ */ P({
  __name: "RichText",
  props: {
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = zt(), a = S(null), o = S(null);
    et().then((d) => {
      const u = /* @__PURE__ */ new Map();
      for (const f of d)
        for (const c of f.shortcodes)
          u.set(c.toLowerCase(), { emoji: f.emoji, code: f.code });
      a.value = u;
    }), he().then((d) => {
      o.value = d;
    });
    const l = j(() => {
      const d = a.value;
      return d ? { get: (u) => d.get(u) } : null;
    });
    function s(d) {
      return d.map((u) => typeof u.children == "string" ? u.children : Array.isArray(u.children) ? s(u.children) : "").join("");
    }
    const i = j(() => Fo(s(n.default?.() ?? []), l.value, o.value));
    return (d, u) => (m(), b("span", Lo, [
      (m(!0), b(M, null, X(i.value, (f, c) => (m(), A(So, {
        key: c,
        node: f,
        "allow-links": t.allowLinks,
        "allow-sizes": t.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
    ]));
  }
});
function Mo(e, t, n, a, o) {
  const l = e.getContext("2d");
  if (!l) return;
  l.clearRect(0, 0, e.width, e.height);
  const s = 2, i = [
    [0, 48, 12, 60, 3, 51, 15, 63],
    [32, 16, 44, 28, 35, 19, 47, 31],
    [8, 56, 4, 52, 11, 59, 7, 55],
    [40, 24, 36, 20, 43, 27, 39, 23],
    [2, 50, 14, 62, 1, 49, 13, 61],
    [34, 18, 46, 30, 33, 17, 45, 29],
    [10, 58, 6, 54, 9, 57, 5, 53],
    [42, 26, 38, 22, 41, 25, 37, 21]
  ], d = jt(a), u = jt(o), f = Math.floor(t / s), c = Math.floor(n / s);
  e.width = Math.floor(t * 2) / 2, e.height = Math.floor(n * 2) / 2;
  for (let h = 0; h < c; h++)
    for (let y = 0; y < f; y++) {
      const w = y * s, E = h * s, C = (y + h) / (f + c - 6), B = (i[h % 8][y % 8] + 0.5) / 64, I = C > B ? 1 : 0, $ = Math.round(d.r * (1 - I) + u.r * I), F = Math.round(d.g * (1 - I) + u.g * I), D = Math.round(d.b * (1 - I) + u.b * I);
      l.fillStyle = `rgb(${$}, ${F}, ${D})`, l.fillRect(w, E, s, s);
    }
}
function jt(e) {
  const t = e.replace("#", ""), n = parseInt(t, 16);
  return {
    r: n >> 16 & 255,
    g: n >> 8 & 255,
    b: n & 255
  };
}
const Oo = { style: { height: "0", overflow: "visible" } }, Do = { class: "titlebar-content" }, Po = { class: "titlebar-image" }, Ho = ["src"], _o = { class: "titlebar-text" }, Vo = { class: "titlebar-buttons" }, Wo = /* @__PURE__ */ P({
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
    const t = e, n = S(null);
    let a = null;
    function o(s, i) {
      const d = t.gradientColorA || "5555ff", u = t.gradientColorB || "0000aa";
      Mo(s, s.width, s.height, d, u), i.fillStyle = "#555555", i.fillRect(0, s.height - 2, Math.floor(s.width / 2) * 2, 4);
    }
    function l() {
      const s = n.value;
      if (!s) return;
      const i = s.getContext("2d");
      if (!i) return;
      const d = s.getBoundingClientRect(), u = Math.floor(d.width * 2) / 2, f = Math.floor(d.height * 2) / 2;
      (s.width !== u || s.height !== f) && (s.width = u, s.height = f), o(s, i);
    }
    return ue(() => [t.gradientColorA, t.gradientColorB], () => {
      if (n.value) {
        const s = n.value.getContext("2d");
        s && o(n.value, s);
      }
    }), de(() => {
      l(), n.value && (a = new ResizeObserver(() => {
        l();
      }), a.observe(n.value));
    }), fe(() => {
      a?.disconnect();
    }), (s, i) => (m(), b("div", null, [
      k("div", Oo, [
        k("canvas", {
          ref_key: "canvasRef",
          ref: n,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      k("div", Do, [
        k("div", Po, [
          k("img", {
            src: e.icon ?? "/win-55-ui/icons/program.png"
          }, null, 8, Ho)
        ]),
        k("div", _o, [
          U(pe, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: z(() => [
              we(oe(e.title), 1)
            ]),
            _: 1
          })
        ]),
        k("div", Vo, [
          V(s.$slots, "buttons"),
          e.placeholderButtons ? (m(), b(M, { key: 0 }, [
            U(Fe, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: z(() => [...i[0] || (i[0] = [
                k("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/o.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            U(Fe, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: z(() => [...i[1] || (i[1] = [
                k("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/_.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            i[3] || (i[3] = k("div", { style: { width: "2px" } }, null, -1)),
            U(Fe, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: z(() => [...i[2] || (i[2] = [
                k("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/x.png"
                }, null, -1)
              ])]),
              _: 1
            })
          ], 64)) : G("", !0)
        ])
      ])
    ]));
  }
}), fl = /* @__PURE__ */ P({
  __name: "Tooltip",
  props: {
    text: {},
    offsetX: {},
    offsetY: {}
  },
  setup(e) {
    const t = e, n = S(!1), a = hn({ x: 0, y: 0 });
    let o = null;
    const l = () => {
      o = window.setTimeout(() => {
        n.value = !0;
      }, 400);
    }, s = () => {
      o !== null && (clearTimeout(o), o = null), n.value = !1;
    }, i = (u) => {
      a.x = u.clientX + (t.offsetX ?? 24), a.y = u.clientY + (t.offsetY ?? 24);
    }, d = j(() => ({
      position: "fixed",
      left: `${a.x}px`,
      top: `${a.y}px`,
      pointerEvents: "none",
      // now TS understands it's valid
      whiteSpace: "nowrap",
      zIndex: 1e3
    }));
    return fe(() => {
      o !== null && clearTimeout(o);
    }), (u, f) => (m(), b("span", {
      onMouseenter: l,
      onMouseleave: s,
      onMousemove: i,
      style: { position: "relative", display: "inline-block" }
    }, [
      V(u.$slots, "default"),
      n.value ? (m(), A(Z, {
        key: 0,
        style: O(d.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: z(() => [
          we(oe(t.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : G("", !0)
    ], 32));
  }
}), Uo = {
  class: "window-container",
  style: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%"
  }
}, Ne = 6, Yo = /* @__PURE__ */ P({
  __name: "Window",
  props: /* @__PURE__ */ Ft({
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
    const t = e, n = Ee(e, "x"), a = Ee(e, "y"), o = Ee(e, "width"), l = Ee(e, "height"), s = t.minWidth ?? 240, i = t.minHeight ?? 40, d = j(() => (t.resizable ?? !1) || (t.resizableHorizontally ?? !1)), u = j(() => (t.resizable ?? !1) || (t.resizableVertically ?? !1));
    let f = !1, c = !1, h = "", y = "", w = 0, E = 0, C = 0, B = 0, I = 0, $ = 0;
    const F = S("default");
    function D(N) {
      if (t.faux || h) return;
      const H = N.target;
      H.closest(".titlebar-image") || H.closest(".titlebar-buttons") || (f = !0, w = N.clientX, E = N.clientY, I = n.value, $ = a.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", T), window.addEventListener("mouseup", L));
    }
    function g(N) {
      t.faux || h && (!d.value && !u.value || (c = !0, y = h, w = N.clientX, E = N.clientY, C = o.value, B = l.value, I = n.value, $ = a.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", T), window.addEventListener("mouseup", L)));
    }
    function T(N) {
      if (t.faux) return;
      const H = N.clientX - w, Y = N.clientY - E;
      if (f && (n.value = I + H, a.value = $ + Y), c) {
        const K = y;
        if (d.value && K.includes("e") && (o.value = Math.max(s, C + H)), u.value && K.includes("s") && (l.value = Math.max(i, B + Y)), d.value && K.includes("w")) {
          const ee = C - H, te = Math.max(s, ee);
          o.value = te, n.value = I + (C - te);
        }
        if (u.value && K.includes("n")) {
          const ee = B - Y, te = Math.max(i, ee);
          l.value = te, a.value = $ + (B - te);
        }
      }
    }
    function L() {
      f = !1, c = !1, y = "", document.body.style.userSelect = "", window.removeEventListener("mousemove", T), window.removeEventListener("mouseup", L);
    }
    function q(N) {
      if (t.faux) {
        h = "", F.value = "default";
        return;
      }
      if (c) return;
      if (!d.value && !u.value) {
        h = "", F.value = "default";
        return;
      }
      const Y = N.currentTarget.getBoundingClientRect(), K = N.clientX - Y.left, ee = Y.right - N.clientX, te = N.clientY - Y.top, Me = Y.bottom - N.clientY;
      let ie = "";
      u.value && (te < Ne ? ie += "n" : Me < Ne && (ie += "s")), d.value && (K < Ne ? ie += "w" : ee < Ne && (ie += "e")), h = ie;
      const Be = {
        n: "ns-resize",
        s: "ns-resize",
        e: "ew-resize",
        w: "ew-resize",
        ne: "nesw-resize",
        sw: "nesw-resize",
        nw: "nwse-resize",
        se: "nwse-resize"
      };
      F.value = Be[ie] ?? "default";
    }
    return (N, H) => (m(), A(Z, {
      "extra-class": e.extraClass,
      "extra-styles": t.faux ? e.extraStyles : {
        position: "absolute",
        left: n.value + "px",
        top: a.value + "px",
        width: o.value + "px",
        height: l.value + "px",
        cursor: F.value,
        ...e.extraStyles
      },
      type: "panel-d-2",
      onMousemove: q,
      onMousedown: g
    }, {
      default: z(() => [
        k("div", Uo, [
          k("div", {
            class: "titlebar-wrapper",
            onMousedown: Le(D, ["stop"]),
            style: { height: "34px" }
          }, [
            U(Wo, {
              title: e.title,
              icon: e.icon,
              "placeholder-buttons": e.placeholderButtons,
              disabled: e.disabled,
              "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
              "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
            }, {
              buttons: z(() => [
                V(N.$slots, "titlebar-buttons")
              ]),
              _: 3
            }, 8, ["title", "icon", "placeholder-buttons", "disabled", "gradient-color-a", "gradient-color-b"])
          ], 32),
          k("div", {
            class: "inner-container",
            style: O({
              flex: "1",
              overflowX: t.overflowX ?? "auto",
              overflowY: t.overflowY ?? "auto",
              marginTop: "4px",
              boxSizing: "border-box"
            })
          }, [
            V(N.$slots, "default")
          ], 4)
        ])
      ]),
      _: 3
    }, 8, ["extra-class", "extra-styles"]));
  }
}), Xo = /* @__PURE__ */ P({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" }
  },
  setup(e) {
    return (t, n) => (m(), A(Z, {
      type: "border-groove",
      "extra-styles": { padding: "10px", margin: "10px" }
    }, {
      default: z(() => [
        k("div", {
          class: "label",
          style: O({ backgroundColor: e.backgroundColorHint })
        }, oe(e.label), 5),
        V(t.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }));
  }
}), Go = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [a, o] of t)
    n[a] = o;
  return n;
}, hl = /* @__PURE__ */ Go(Xo, [["__scopeId", "data-v-9a25af1b"]]), Nt = "/win-55-ui/emoji/emoji-by-category.json";
let Ge = null;
async function At() {
  return Ge || (Ge = fetch(Nt).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${Nt}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), Ge;
}
const qo = { class: "emoji-picker-body" }, Ko = { class: "emoji-picker-tabs" }, Jo = ["onClick"], Qo = { class: "emoji-picker-grid" }, Zo = ["src", "title", "onClick"], el = "546", ml = /* @__PURE__ */ P({
  __name: "EmojiPickerWindow",
  setup(e) {
    const t = S(null), n = S([]), a = S(null), o = S(void 0), l = j(() => n.value.find((u) => u.category === a.value) ?? null);
    async function s() {
      if (Math.random() < 0.75) {
        o.value = ae(el);
        return;
      }
      const f = (await At()).flatMap((h) => h.emojis);
      if (f.length === 0) return;
      const c = f[Math.floor(Math.random() * f.length)];
      o.value = ae(c.code);
    }
    ue(ye, async (u) => {
      u && (s(), n.value.length === 0 && (n.value = await At(), a.value = n.value[0]?.category ?? null));
    }, { immediate: !0 });
    function i(u) {
      a.value = u;
    }
    function d(u) {
      if (!ye.value) return;
      const f = u.target;
      t.value?.contains(f) || Ct();
    }
    return de(() => {
      document.addEventListener("click", d);
    }), fe(() => {
      document.removeEventListener("click", d);
    }), (u, f) => (m(), A(Qe, { to: "body" }, [
      _(ye) ? (m(), b("div", {
        key: 0,
        ref_key: "rootRef",
        ref: t,
        style: { display: "contents" }
      }, [
        U(Yo, {
          x: _(re).x,
          "onUpdate:x": f[0] || (f[0] = (c) => _(re).x = c),
          y: _(re).y,
          "onUpdate:y": f[1] || (f[1] = (c) => _(re).y = c),
          width: _(re).width,
          "onUpdate:width": f[2] || (f[2] = (c) => _(re).width = c),
          height: _(re).height,
          "onUpdate:height": f[3] || (f[3] = (c) => _(re).height = c),
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
          "titlebar-buttons": z(() => [
            U(Fe, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              onClick: _(Ct)
            }, {
              default: z(() => [...f[4] || (f[4] = [
                k("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/x.png"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]),
          default: z(() => [
            U(Z, {
              type: "textarea",
              "extra-styles": { width: "100%", height: "calc(100% - 2px)", marginTop: "2px", padding: "2px" }
            }, {
              default: z(() => [
                k("div", qo, [
                  k("div", Ko, [
                    (m(!0), b(M, null, X(n.value, (c) => (m(), b("span", {
                      key: c.category,
                      class: Se(["emoji-picker-tab", { "emoji-picker-tab--selected": c.category === a.value }]),
                      onClick: (h) => i(c.category)
                    }, [
                      U(pe, {
                        shorthand: c.category === a.value ? "Bold12" : "Regular12"
                      }, {
                        default: z(() => [
                          we(oe(c.category), 1)
                        ]),
                        _: 2
                      }, 1032, ["shorthand"])
                    ], 10, Jo))), 128))
                  ]),
                  U(mo),
                  k("div", Qo, [
                    (m(!0), b(M, null, X(l.value?.emojis ?? [], (c) => (m(), b("div", {
                      key: c.code,
                      class: "emoji-picker-grid-cell"
                    }, [
                      k("img", {
                        src: _(ae)(c.code),
                        title: c.shortcodes[0] ? `:${c.shortcodes[0]}:` : void 0,
                        class: "emoji-picker-grid-item",
                        onClick: (h) => _(eo)(c.emoji)
                      }, null, 8, Zo)
                    ]))), 128))
                  ])
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["x", "y", "width", "height", "icon"])
      ], 512)) : G("", !0)
    ]));
  }
}), tl = ["src", "alt", "width", "height"], It = 15, Ae = 2, gl = /* @__PURE__ */ P({
  __name: "Emoji",
  props: {
    emoji: {}
  },
  setup(e) {
    const t = e, n = new RegExp(`^(?:${Ce})$`, "u"), a = S(""), o = S(t.emoji), l = S(It * Ae), s = S(It * Ae);
    async function i(u) {
      if (n.test(u)) {
        o.value = u;
        const c = await Bn(u);
        a.value = c ?? Ze(u);
        return;
      }
      const f = await Gt(u);
      if (f) {
        o.value = f.emoji, a.value = ae(f.code);
        return;
      }
      console.warn(`[win-55-ui] Emoji: could not resolve "${u}" as an emoji or a shortcode alias.`), o.value = u, a.value = "";
    }
    ue(() => t.emoji, (u) => {
      i(u);
    }, { immediate: !0 });
    function d(u) {
      const f = u.target;
      l.value = f.naturalWidth * Ae, s.value = f.naturalHeight * Ae;
    }
    return (u, f) => (m(), b("img", {
      class: "win55-emoji-standalone",
      src: a.value,
      alt: o.value,
      width: l.value,
      height: s.value,
      draggable: "false",
      onLoad: d
    }, null, 40, tl));
  }
}), vl = (e, t = 30, n = 48, a = 30) => {
  const o = S(
    Array.from({ length: e }, (d, u) => ({
      sin: Math.sin(0 + u * Math.PI * 2 / e),
      cos: Math.cos(0 + u * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let l, s = 0;
  const i = () => {
    const d = Date.now();
    if (d - s >= 1e3 / t) {
      const u = Array.from({ length: e }, (y, w) => ({
        sin: Math.sin(d / (1e3 + w * 200) + w * Math.PI * 2 / e),
        cos: Math.cos(d / (3e3 + w * 400) + w * Math.PI * 2 / e + Math.PI / 4)
      })), f = u.map((y) => n + y.sin * a), c = e * n, h = f.reduce((y, w) => y + w, 0);
      if (h > 0) {
        const y = c / h, w = u.map((E) => ({
          sin: ((n + E.sin * a) * y - n) / a,
          cos: E.cos
        }));
        o.value = w;
      } else
        o.value = u;
      s = d;
    }
    l = requestAnimationFrame(i);
  };
  return de(() => {
    l = requestAnimationFrame(i);
  }), fe(() => {
    cancelAnimationFrame(l);
  }), { values: o };
};
function pl(e) {
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
  pn as Balloon,
  yn as BaseDropdown,
  rl as BaseInput,
  Z as Box,
  Fe as Button,
  sl as Checkbox,
  gl as Emoji,
  ml as EmojiPickerWindow,
  mo as HDivider,
  cl as MenuDropdown,
  hl as NamedPanel,
  ul as RadioButton,
  dl as RichText,
  Wo as Titlebar,
  fl as Tooltip,
  pe as Typography,
  Yo as Window,
  tt as activeTarget,
  Ct as closePicker,
  il as customEmojiDirective,
  Mo as drawAngledBayerDitherGradient,
  Gn as emojiDirective,
  Bn as getEmojiGifPath,
  ae as getEmojiGifPathFromCode,
  ll as getEmojiRegistry,
  ke as getSelectionOffset,
  ne as getTextWithCustomEmoji,
  al as hasEmoji,
  eo as insertEmoji,
  he as loadEmojiRegistry,
  Zn as openPicker,
  to as pickNextButtonIcon,
  ye as pickerOpen,
  re as pickerPosition,
  kt as registerActiveInput,
  pl as registerGlobalImageErrorHandler,
  ol as resetEmojiRegistryCache,
  Ie as restoreSelectionOffset,
  Ot as typographyStyles,
  vl as useSineWave
};
