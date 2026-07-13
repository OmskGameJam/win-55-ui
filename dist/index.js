import { defineComponent as H, ref as R, computed as A, openBlock as g, createElementBlock as b, normalizeStyle as D, normalizeClass as Ce, renderSlot as W, useModel as Ee, useSlots as It, watch as ue, nextTick as $t, onMounted as de, onUnmounted as fe, createBlock as z, Teleport as Ze, createElementVNode as k, createVNode as _, withCtx as $, unref as V, Fragment as O, createTextVNode as we, toDisplayString as oe, createCommentVNode as J, mergeModels as Nt, withModifiers as Ne, shallowRef as ln, renderList as K, resolveDynamicComponent as an, resolveComponent as rn, reactive as sn } from "vue";
const ee = /* @__PURE__ */ H({
  __name: "Box",
  props: {
    type: {},
    extraStyles: {},
    extraClass: {}
  },
  setup(e, { expose: t }) {
    const n = e, l = R(null), o = A(() => ({
      "--img": `url(/win-55-ui/${n.type}.png)`,
      ...n.extraStyles
    }));
    return t({ el: l }), (i, s) => (g(), b("div", {
      ref_key: "rootRef",
      ref: l,
      class: Ce(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: D(o.value)
    }, [
      W(i.$slots, "default")
    ], 6));
  }
}), cn = { class: "balloon-tip-box" }, un = {
  key: 1,
  class: "balloon-wrapper"
}, dn = { class: "balloon-tip-box" }, Re = 8, fn = /* @__PURE__ */ H({
  __name: "Balloon",
  props: /* @__PURE__ */ Nt({
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
    function n(m) {
      return "top" in m;
    }
    function l(m) {
      return n(m) ? m : { top: m.y, bottom: m.y, left: m.x, right: m.x };
    }
    const o = e, i = It(), s = A(() => o.side ?? "top"), a = A(() => o.bias), u = R(s.value), d = A(() => o.anchor ? u.value : s.value), f = A(() => {
      const m = {};
      switch (s.value) {
        case "top":
          m.bottom = "100%", m.left = "50%", m.transform = "translateX(-50%)";
          break;
        case "bottom":
          m.top = "100%", m.left = "50%", m.transform = "translateX(-50%)";
          break;
        case "left":
          m.right = "100%", m.top = "50%", m.transform = "translateY(-50%)";
          break;
        case "right":
          m.left = "100%", m.top = "50%", m.transform = "translateY(-50%)";
          break;
      }
      return m;
    }), c = A(() => {
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
    }), h = A(() => {
      let m = "", T = !1;
      switch (d.value) {
        case "top":
          m = "rotate(0deg)", a.value === "right" && (T = !0);
          break;
        case "bottom":
          m = "rotate(180deg)", a.value === "left" && (T = !0);
          break;
        case "left":
          m = "rotate(-90deg)";
          break;
        case "right":
          m = "rotate(90deg)", T = !0;
          break;
      }
      return T ? `${m} scaleX(-1)` : m;
    }), y = A(() => {
      const m = {};
      return a.value ? ((d.value === "top" || d.value === "bottom") && (a.value === "left" && (m.transform = "translateX(calc(-50% + 28px))"), a.value === "right" && (m.transform = "translateX(calc(50% - 28px))")), (d.value === "left" || d.value === "right") && (a.value === "up" && (m.transform = "translateY(calc(-50% + 28px))"), a.value === "down" && (m.transform = "translateY(calc(50% - 28px))")), m) : {};
    }), w = R(null), E = R(null), C = { top: "bottom", bottom: "top", left: "right", right: "left" }, S = {
      top: ["left", "right"],
      bottom: ["left", "right"],
      left: ["top", "bottom"],
      right: ["top", "bottom"]
    };
    function I(m, T, M) {
      const X = (T.left + T.right) / 2, B = (T.top + T.bottom) / 2;
      return m === "top" || m === "bottom" ? {
        top: m === "top" ? T.top - M.height : T.bottom,
        left: X - M.width / 2
      } : {
        left: m === "left" ? T.left - M.width : T.right,
        top: B - M.height / 2
      };
    }
    function F(m, T, M, X) {
      return m.top >= Re && m.left >= Re && m.top + T.height <= X - Re && m.left + T.width <= M - Re;
    }
    function L() {
      const m = w.value;
      if (!o.anchor || !m) return;
      const T = l(o.anchor), M = m.getBoundingClientRect(), X = window.innerWidth, B = window.innerHeight, N = o.side ?? "top", q = [
        N,
        C[N],
        ...S[N]
      ].find((U) => F(I(U, T, M), M, X, B)) ?? N;
      u.value = q, E.value = I(q, T, M);
    }
    ue(
      [() => o.anchor, t],
      async ([m, T]) => {
        !m || !T || (await $t(), L());
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
    }), (m, T) => e.anchor ? (g(), z(Ze, {
      key: 0,
      to: "body"
    }, [
      t.value ? (g(), b("div", {
        key: 0,
        ref_key: "anchoredRef",
        ref: w,
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
                V(i).content ? W(m.$slots, "content", { key: 0 }) : (g(), b(O, { key: 1 }, [
                  we(oe(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          k("div", cn, [
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
    ])) : (g(), b("div", un, [
      W(m.$slots, "default"),
      t.value ? (g(), b("div", {
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
                V(i).content ? W(m.$slots, "content", { key: 0 }) : (g(), b(O, { key: 1 }, [
                  we(oe(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          k("div", dn, [
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
}), hn = /* @__PURE__ */ H({
  __name: "BaseDropdown",
  props: {
    matchTriggerWidth: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = R(!1), l = R(null), o = R(null), i = R(null), s = () => {
      const f = o.value, c = i.value;
      if (!f || !c) return;
      const h = f.getBoundingClientRect(), y = window.innerHeight, w = c.offsetHeight;
      let E = h.bottom + window.scrollY;
      const C = h.left + window.scrollX;
      h.bottom + w > y && (E = h.top + window.scrollY - w), l.value = {
        top: E,
        left: C,
        width: t.matchTriggerWidth ? h.width : void 0
      };
    };
    ue(n, async (f) => {
      f && (await $t(), s());
    });
    const a = () => {
      n.value && s();
    }, u = (f) => {
      if (!n.value) return;
      const c = f.target;
      o.value?.contains(c) || i.value?.contains(c) || (n.value = !1);
    };
    de(() => {
      window.addEventListener("resize", a), window.addEventListener("scroll", a), document.addEventListener("click", u);
    }), fe(() => {
      window.removeEventListener("resize", a), window.removeEventListener("scroll", a), document.removeEventListener("click", u);
    });
    const d = () => {
      n.value = !n.value;
    };
    return (f, c) => (g(), b(O, null, [
      k("div", {
        ref_key: "triggerRef",
        ref: o,
        style: { display: "inline-block" },
        onClick: Ne(d, ["stop"])
      }, [
        W(f.$slots, "trigger")
      ], 512),
      (g(), z(Ze, { to: "body" }, [
        n.value ? (g(), b("div", {
          key: 0,
          ref_key: "dropdownRef",
          ref: i,
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
}), gn = [10, 12, 14, 16, 24], mn = [
  { style: "Regular", size: 12 },
  { style: "Bold", size: 12 },
  { style: "Regular", size: 24 }
], pn = {
  BoldItalic: ["BoldItalic", "Bold", "Italic", "Regular"],
  Bold: ["Bold", "Regular"],
  Italic: ["Italic", "Regular"],
  Regular: ["Regular"]
};
function mt(e) {
  return mn.filter((t) => t.style === e).map((t) => t.size);
}
function vn(e, t) {
  const n = pn[e] ?? ["Regular"];
  for (const l of n)
    if (mt(l).includes(t))
      return { style: l, size: t };
  for (const l of n) {
    const o = mt(l);
    if (o.length > 0)
      return { style: l, size: Lt(t, o) };
  }
  return { style: "Regular", size: t };
}
function Ft(e) {
  const { style: t, size: n } = e.shorthand ? wn(e.shorthand) : {
    style: yn(e.isBold, e.isItalic),
    size: Lt(e.fontSize ?? 12, gn)
  }, { style: l, size: o } = vn(t, n), i = {
    fontFamily: `${l}${o}, Arial, sans`,
    fontSize: `${o * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (i.textShadow = `2px 2px 0 ${e.fontShadowColor}`), i;
}
function yn(e, t) {
  return e && t ? "BoldItalic" : e ? "Bold" : t ? "Italic" : "Regular";
}
function wn(e) {
  const t = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!t)
    throw new Error(`Invalid shorthand format: ${e}`);
  const n = t[1], l = parseInt(t[2], 10);
  return { style: n, size: l };
}
function Lt(e, t) {
  if (t.length === 0)
    throw new Error("Array cannot be empty");
  return t.reduce((n, l) => {
    const o = Math.abs(l - e), i = Math.abs(n - e);
    return o < i ? l : n;
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
function Mt(e, t) {
  if (e instanceof Text) {
    const o = e.nodeValue?.length ?? 0;
    return t <= o ? { node: e, offset: t, remaining: 0 } : { node: e, offset: o, remaining: t - o };
  }
  if (e instanceof Element) {
    const o = e.getAttribute("data-win55-emoji");
    if (o)
      return t <= 0 ? { node: e.parentNode ?? e, offset: Ue(e), remaining: 0 } : t <= o.length ? { node: e.parentNode ?? e, offset: Ue(e) + 1, remaining: 0 } : {
        node: e.parentNode ?? e,
        offset: Ue(e) + 1,
        remaining: t - o.length
      };
  }
  let n = t, l = {
    offset: e.childNodes.length,
    remaining: n
  };
  for (const o of Array.from(e.childNodes)) {
    const i = Mt(o, n);
    if (i && i.remaining === 0)
      return i;
    i && (n = i.remaining, l = i);
  }
  return {
    node: e,
    offset: e.childNodes.length,
    remaining: l.remaining
  };
}
function Ue(e) {
  return e.parentNode ? Array.prototype.indexOf.call(e.parentNode.childNodes, e) : 0;
}
function Ae(e, t, n = !1) {
  if (t === null || !e.isConnected)
    return;
  const l = Mt(e, t);
  if (!l)
    return;
  const o = document.createRange(), i = window.getSelection();
  n && e.focus({ preventScroll: !0 }), o.setStart(l.node, l.offset), o.collapse(!0), i?.removeAllRanges(), i?.addRange(o);
}
const Ot = "/win-55-ui/emoji", Ye = `${Ot}/emoji-registry.csv`, Fe = [
  "[\\u{1F1E6}-\\u{1F1FF}]{2}",
  "[0-9#*]\\uFE0F?\\u20E3",
  "\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?)*",
  "\\p{Emoji_Presentation}"
].join("|");
let ze = null, Ke = null, Ie = null;
function xn(e) {
  return e.replace(/\/$/, "");
}
function Dt(e) {
  return e.trim().replace(/\.gif$/i, "");
}
function bn(e) {
  const t = {}, n = e.replace(/^\uFEFF/, "").split(/\r?\n/);
  for (const [l, o] of n.entries()) {
    const i = o.trim();
    if (!i || l === 0 && i.toLowerCase() === "emoji,code")
      continue;
    const s = i.indexOf(",");
    if (s === -1) {
      console.warn(`[win-55-ui] Skipping emoji registry row ${l + 1}: missing comma`);
      continue;
    }
    const a = i.slice(0, s).trim(), u = Dt(i.slice(s + 1));
    a && u && (t[a] = u);
  }
  return t;
}
async function he(e = {}) {
  const t = e.registryUrl ?? Ye;
  return Ie && t === Ye ? Ie : ((!ze || Ke !== t) && (Ke = t, ze = fetch(t).then((n) => {
    if (!n.ok)
      throw new Error(
        `Could not load emoji registry from ${t}: ${n.status} ${n.statusText}`
      );
    return n.text();
  }).then(bn).then((n) => (t === Ye && (Ie = n), n))), ze);
}
function Qo() {
  ze = null, Ke = null, Ie = null;
}
async function Zo(e, t = {}) {
  const l = (await he(t))[e];
  return l ? re(l, t) : null;
}
function re(e, t = {}) {
  return `${xn(t.basePath ?? Ot)}/${Dt(e)}.gif`;
}
async function el(e = {}) {
  return he(e);
}
async function tl(e, t = {}) {
  const n = await he(t);
  return e in n;
}
he();
function En(e) {
  return e.map((t) => {
    const n = parseInt(t.replace(/^#/, ""), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  });
}
function kn(e, t, n, l) {
  let o = 1 / 0, i = [0, 0, 0];
  for (const s of l) {
    const a = e - s[0], u = t - s[1], d = n - s[2], f = a * a + u * u + d * d;
    f < o && (o = f, i = s);
  }
  return i;
}
function Pt() {
  return typeof navigator < "u" && /firefox/i.test(navigator.userAgent);
}
const Cn = "win55-emoji", Sn = "win55-emoji-image", Z = 15, Je = 2, pt = Pt(), Tn = [
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
], Rn = En(Tn), vt = Fe, Bn = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION"
]), pe = /* @__PURE__ */ new WeakMap(), yt = /* @__PURE__ */ new WeakMap(), wt = /* @__PURE__ */ new Map();
function jn(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function An(e) {
  const t = yt.get(e);
  if (t)
    return t;
  const n = Object.keys(e).sort((i, s) => s.length - i.length).map(jn), l = n.length > 0 ? `${n.join("|")}|${vt}` : vt, o = new RegExp(l, "gu");
  return yt.set(e, o), o;
}
function Ht(e) {
  return e.value === !1 ? null : typeof e.value == "object" ? e.value : {};
}
const zn = "data-win55-richtext";
function In(e) {
  return Bn.has(e.tagName) || e.hasAttribute("data-win55-emoji");
}
function Vt(e) {
  let t = e.parentElement;
  for (; t; ) {
    const n = pe.get(t);
    if (n && Ht(n.binding))
      return !0;
    t = t.parentElement;
  }
  return !1;
}
function $n(e, t) {
  const n = [], l = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, {
    acceptNode(o) {
      const i = o.parentElement;
      return !i || In(i) || t && i.closest(`[${zn}]`) || !o.nodeValue?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  for (; l.nextNode(); )
    n.push(l.currentNode);
  return n;
}
function Nn() {
  return `${Z * Je}px`;
}
function Fn(e, t, n, l, o) {
  const i = Math.min(1, Math.max(0, o)), s = e.getImageData(0, 0, t, n), a = s.data;
  for (let u = 0; u < a.length; u += 4) {
    const d = a[u], f = a[u + 1], c = a[u + 2];
    if (a[u + 3] < 80)
      a[u] = 0, a[u + 1] = 0, a[u + 2] = 0, a[u + 3] = 0;
    else {
      const [y, w, E] = kn(
        d,
        f,
        c,
        l
      ), C = Math.round(d + (y - d) * i), S = Math.round(f + (w - f) * i), I = Math.round(c + (E - c) * i);
      a[u] = C, a[u + 1] = S, a[u + 2] = I, a[u + 3] = 255;
    }
  }
  e.putImageData(s, 0, 0);
}
function Ln(e, t, n) {
  const l = e.getImageData(0, 0, t, n), o = new Uint8ClampedArray(l.data), i = l.data, s = (a, u) => (u * t + a) * 4;
  for (let a = 0; a < n; a++)
    for (let u = 0; u < t; u++) {
      const d = s(u, a), c = [
        u > 0 ? s(u - 1, a) : -1,
        u < t - 1 ? s(u + 1, a) : -1,
        a > 0 ? s(u, a - 1) : -1,
        a < n - 1 ? s(u, a + 1) : -1
      ].filter((h) => h !== -1).filter((h) => o[h + 3] > 127);
      if (o[d + 3] > 127 && c.length <= 1)
        i[d] = i[d + 1] = i[d + 2] = i[d + 3] = 0;
      else if (o[d + 3] === 0 && c.length >= 3) {
        const h = c[0];
        i[d] = o[h], i[d + 1] = o[h + 1], i[d + 2] = o[h + 2], i[d + 3] = 255;
      }
    }
  e.putImageData(l, 0, 0);
}
function Wt(e) {
  const t = wt.get(e);
  if (t)
    return t;
  const n = Mn(e);
  return wt.set(e, n), n;
}
function Mn(e) {
  const t = document.createElement("canvas");
  t.width = Z, t.height = Z;
  const n = t.getContext("2d");
  if (!n)
    return "";
  const l = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif', o = Z * 4;
  n.textBaseline = "alphabetic", n.font = `${o}px ${l}`;
  const i = n.measureText(e), s = i.actualBoundingBoxLeft + i.actualBoundingBoxRight, a = i.actualBoundingBoxAscent + i.actualBoundingBoxDescent;
  if (s > 0 && a > 0) {
    const u = o * Math.min(Z / s, Z / a);
    n.font = `${u}px ${l}`;
    const d = n.measureText(e), f = d.actualBoundingBoxLeft + d.actualBoundingBoxRight, c = d.actualBoundingBoxAscent + d.actualBoundingBoxDescent, h = (Z - f) / 2 + d.actualBoundingBoxLeft, y = (Z - c) / 2 + d.actualBoundingBoxAscent;
    n.fillText(e, h, y - 0.5), Fn(n, Z, Z, Rn, 0.1), Ln(n, Z, Z), Un(t);
  }
  return t.toDataURL("image/png");
}
function On(e, t, n) {
  const l = document.createElement("span"), o = document.createElement("img");
  return l.className = n.className ?? Cn, l.contentEditable = "false", l.dataset.win55Emoji = e, l.role = "img", l.ariaLabel = e, l.style.setProperty("--win55-emoji-size", Nn()), o.src = t, o.alt = e, o.className = Sn, o.draggable = !1, o.dataset.win55EmojiImg = "true", o.addEventListener("load", () => {
    const i = o.naturalWidth * Je, s = o.naturalHeight * Je;
    l.style.width = `${i}px`, l.style.height = `${s}px`, o.style.width = `${i}px`, o.style.height = `${s}px`;
  }, { once: !0 }), l.append(o), l;
}
function Dn(e, t, n, l) {
  const o = e.parentElement;
  if (!o)
    return;
  const i = window.getSelection(), s = i && i.rangeCount > 0 && i.isCollapsed ? i.getRangeAt(0) : null, a = s?.startContainer === e, u = !!(s && s.startContainer === o && s.startOffset === Array.prototype.indexOf.call(o.childNodes, e) + 1), d = a || u, f = u ? e.nodeValue?.length ?? 0 : a ? s?.startOffset ?? null : null, c = e.nodeValue ?? "";
  let h = 0, y = !1;
  const w = document.createDocumentFragment();
  let E = null, C = 0;
  const S = (F, L) => {
    E || (E = F, C = L);
  };
  t.lastIndex = 0;
  for (const F of c.matchAll(t)) {
    const L = F[0], P = F.index, m = n[L];
    if (P === void 0)
      continue;
    const T = m ? re(m, l) : Wt(L);
    if (!T)
      continue;
    y = !0;
    const M = c.slice(h, P);
    if (pt || M.length > 0) {
      const B = document.createTextNode(M);
      f !== null && f >= h && f <= P && S(B, f - h), w.append(B);
    } else f !== null && f >= h && f <= P && S(o, Array.prototype.indexOf.call(o.childNodes, e) + w.childNodes.length);
    const X = On(L, T, l);
    w.append(X), f !== null && f > P && f <= P + L.length && S(o, Array.prototype.indexOf.call(o.childNodes, e) + w.childNodes.length), h = P + L.length;
  }
  if (!y)
    return;
  const I = c.slice(h);
  if (pt || I.length > 0) {
    const F = document.createTextNode(I);
    f !== null && f >= h && S(F, f - h), w.append(F);
  } else f !== null && f >= h && S(o, Array.prototype.indexOf.call(o.childNodes, e) + w.childNodes.length);
  if (e.replaceWith(w), d && E) {
    const F = document.createRange();
    F.setStart(E, C), F.collapse(!0), i?.removeAllRanges(), i?.addRange(F);
  }
}
function Ut(e, t, n, l) {
  const o = An(t);
  if (o)
    for (const i of $n(e, l))
      Dn(i, o, t, n);
}
const _e = /* @__PURE__ */ new WeakMap();
async function Xe(e, t = {}) {
  const n = (_e.get(e) ?? 0) + 1;
  _e.set(e, n);
  const l = await he(t);
  _e.get(e) !== n || !e.isConnected || Ut(e, l, t, !1);
}
async function Pn(e, t) {
  const n = Ht(t.binding);
  if (!n)
    return;
  t.version += 1;
  const l = t.version, o = await he(n);
  pe.get(e)?.version !== l || !e.isConnected || Vt(e) || Ut(e, o, n, !0);
}
function Qe(e, t) {
  t.renderQueued || (t.renderQueued = !0, t.renderFrame = window.requestAnimationFrame(() => {
    t.renderQueued = !1, t.renderFrame = null, Pn(e, t).catch((n) => {
      console.warn("[win-55-ui] Could not render custom emoji.", n);
    });
  }));
}
function Hn(e, t) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !t.clipboardData || Vt(e))
    return;
  const l = n.getRangeAt(0);
  if (!l.intersectsNode(e))
    return;
  const o = l.cloneContents(), i = ne(o);
  i && (t.clipboardData.setData("text/plain", i), t.preventDefault());
}
function Vn(e, t) {
  const n = new MutationObserver(() => {
    Qe(e, t);
  });
  return n.observe(e, {
    characterData: !0,
    childList: !0,
    subtree: !0
  }), n;
}
const Wn = {
  mounted(e, t) {
    const n = {
      binding: t,
      copyHandler: (l) => Hn(e, l),
      observer: null,
      renderFrame: null,
      renderQueued: !1,
      version: 0
    };
    n.observer = Vn(e, n), pe.set(e, n), e.addEventListener("copy", n.copyHandler), Qe(e, n);
  },
  updated(e, t) {
    const n = pe.get(e);
    n && (n.binding = t, Qe(e, n));
  },
  unmounted(e) {
    const t = pe.get(e);
    t && (t.observer?.disconnect(), t.renderFrame !== null && window.cancelAnimationFrame(t.renderFrame), e.removeEventListener("copy", t.copyHandler)), pe.delete(e);
  }
};
function Un(e) {
  const t = e.getContext("2d");
  if (!t) {
    console.warn("Unable to get 2D context from canvas");
    return;
  }
  const n = e.width, l = e.height, o = t.getImageData(0, 0, n, l), i = o.data, s = (c, h) => c < 0 || h < 0 || c >= n || h >= l ? 0 : i[(h * n + c) * 4 + 3], a = Array.from({ length: l }, () => Array(n).fill(!1)), u = [];
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
    for (const [y, w] of d) {
      const E = c + y, C = h + w;
      E >= 0 && E < n && C >= 0 && C < l && !a[C][E] && s(E, C) === 0 && (a[C][E] = !0, u.push({ x: E, y: C }));
    }
  }
  const f = Array.from({ length: l }, () => Array(n).fill(!1));
  for (let c = 0; c < l; c++)
    for (let h = 0; h < n; h++) {
      if (s(h, c) === 0) continue;
      let y = !1;
      for (const [w, E] of d) {
        const C = h + w, S = c + E;
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
        i[y] = 0, i[y + 1] = 0, i[y + 2] = 0;
      }
  t.putImageData(o, 0, 0);
}
const nl = Wn, xt = typeof Intl.Segmenter == "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function Yt(e) {
  return xt ? Array.from(xt.segment(e), (t) => t.segment) : Array.from(e);
}
function bt(e) {
  return Yt(e).length;
}
function Yn(e, t) {
  return Yt(e).slice(0, t).join("");
}
function _n(e) {
  const t = window.getSelection();
  if (!t || t.rangeCount === 0 || !t.isCollapsed)
    return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.startContainer))
    return null;
  const l = ke(e), o = n.cloneRange();
  o.collapse(!0);
  const i = document.createElement("span");
  i.textContent = "​", o.insertNode(i);
  const s = i.getBoundingClientRect(), a = i.parentNode;
  return i.remove(), a?.normalize(), Ae(e, l), s;
}
const Et = "/win-55-ui/emoji/emoji-categories.json";
let Ge = null;
async function et() {
  return Ge || (Ge = fetch(Et).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${Et}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), Ge;
}
async function Xn(e) {
  const t = e.trim().toLowerCase();
  if (!t)
    return [];
  const n = await et(), l = [], o = /* @__PURE__ */ new Set();
  for (const i of n) {
    const s = i.shortcodes.find((a) => a.toLowerCase().startsWith(t));
    s && (l.push({ emoji: i.emoji, code: i.code, shortcode: s }), o.add(i.code));
  }
  for (const i of n) {
    if (o.has(i.code))
      continue;
    const s = i.tags.find((a) => a.toLowerCase().startsWith(t));
    s && (l.push({ emoji: i.emoji, code: i.code, shortcode: i.shortcodes[0] ?? s }), o.add(i.code));
  }
  return l;
}
async function Gn(e) {
  const t = e.trim().toLowerCase();
  if (!t)
    return;
  const l = (await et()).find((o) => o.shortcodes.some((i) => i.toLowerCase() === t));
  return l ? { emoji: l.emoji, code: l.code } : void 0;
}
const ye = R(!1), ie = R({ x: 160, y: 120, width: 360, height: 420 }), tt = ln(null);
function kt(e) {
  tt.value = e;
}
function qn() {
  ye.value = !0;
}
function Ct() {
  ye.value = !1;
}
function Kn(e) {
  tt.value?.insertEmoji(e);
}
let St = 0;
function Jn(e) {
  const t = e[St % e.length];
  return St += 1, t;
}
const Qn = {
  key: 0,
  class: "baseinput-emoji-wrapper"
}, Zn = ["src"], eo = { class: "shortcode-suggestions" }, to = {
  key: 0,
  class: "shortcode-suggestion-ellipsis"
}, no = ["src"], oo = {
  key: 1,
  class: "shortcode-suggestion-ellipsis"
}, lo = "546", Be = 5, ao = 200, ol = /* @__PURE__ */ H({
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
    ], o = e, i = n, s = R(null), a = A(() => s.value?.el ?? null);
    de(() => {
      a.value && o.modelValue && (a.value.innerText = o.modelValue);
    }), ue(() => o.modelValue, (r) => {
      if (a.value && ne(a.value) !== r) {
        const p = document.activeElement === a.value, v = p ? ke(a.value) : null;
        a.value.innerText = r ?? "", p && Ae(a.value, v);
      }
    });
    const u = () => {
      if (!a.value) return;
      let r = ne(a.value);
      if (o.multiline || (r = r.replace(/\n/g, "")), o.maxLength && bt(r) > o.maxLength) {
        r = Yn(r, o.maxLength), a.value.innerText = r;
        const p = document.createRange(), v = window.getSelection();
        p.selectNodeContents(a.value), p.collapse(!1), v?.removeAllRanges(), v?.addRange(p);
      }
      Xt(), i("update:modelValue", r), Oe();
    }, d = /:([A-Za-z0-9_+-]*)$/, f = /:([A-Za-z0-9_+-]{2,}):$/, c = R(!1), h = R(null), y = R([]), w = R(0), E = R(null);
    let C = 0;
    const S = R(0);
    function I(r) {
      r < S.value ? S.value = r : r > S.value + Be - 1 && (S.value = r - Be + 1);
    }
    const F = A(() => {
      const r = S.value;
      return y.value.slice(r, r + Be).map((p, v) => ({ match: p, index: r + v }));
    }), L = A(() => S.value > 0), P = A(() => S.value + Be < y.value.length), m = () => {
      c.value = !1, h.value = null, y.value = [], w.value = 0, S.value = 0;
    }, T = (r, p) => {
      if (!a.value) return;
      const v = window.getSelection();
      if (!v || v.rangeCount === 0 || !v.isCollapsed) return;
      const x = v.getRangeAt(0), j = x.startContainer;
      if (!(j instanceof Text) || !a.value.contains(j)) return;
      const Y = x.startOffset, Q = Y - r;
      if (Q < 0) return;
      const le = j.nodeValue ?? "";
      Te(), j.nodeValue = le.slice(0, Q) + p + le.slice(Y), se(j, Q + p.length), me(), u(), Xe(a.value);
    }, M = () => {
      const r = y.value[w.value];
      !r || h.value === null || (T(1 + h.value.length, r.emoji), m());
    }, X = R(null), N = { insertEmoji: (r) => {
      if (!a.value) return;
      const x = (document.activeElement === a.value ? ke(a.value) : null) ?? X.value ?? bt(ne(a.value));
      Ae(a.value, x, !0);
      const j = window.getSelection();
      if (!j || j.rangeCount === 0 || !j.isCollapsed) return;
      const Y = j.getRangeAt(0);
      Te(), Y.deleteContents();
      const Q = document.createTextNode(r);
      Y.insertNode(Q), se(Q, Q.length), me(), u(), Xe(a.value);
    } }, G = R(!1), q = A(() => ye.value && tt.value === N), U = A(() => o.showEmojiButton && (G.value || q.value)), te = R(l[0]), Le = A(() => q.value ? lo : te.value), Me = () => {
      te.value = Jn(l);
    };
    ue(U, (r) => {
      r && Me();
    });
    const Se = () => {
      G.value = !0, kt(N);
    }, ae = () => {
      kt(N), qn();
    }, Oe = async () => {
      if (!a.value) {
        m();
        return;
      }
      const r = window.getSelection();
      if (!r || r.rangeCount === 0 || !r.isCollapsed) {
        m();
        return;
      }
      const p = r.getRangeAt(0), v = p.startContainer;
      if (!(v instanceof Text) || !a.value.contains(v)) {
        m();
        return;
      }
      const x = (v.nodeValue ?? "").slice(0, p.startOffset), j = c.value ? h.value : null, Y = f.exec(x);
      if (Y) {
        if (j === Y[1]) {
          const gt = await Gn(Y[1]);
          gt && T(Y[0].length, gt.emoji);
        }
        m();
        return;
      }
      const le = d.exec(x)?.[1] ?? null;
      if (le === null || le.length < 2) {
        m();
        return;
      }
      const be = _n(a.value);
      if (!be) {
        m();
        return;
      }
      const ft = ++C, ht = await Xn(le);
      if (ft !== C || ht.length === 0) {
        ft === C && m();
        return;
      }
      h.value = le, y.value = ht, w.value = 0, S.value = 0, E.value = { top: be.top, bottom: be.bottom, left: be.left, right: be.right }, c.value = !0;
    }, De = [], Pe = [];
    let xe = null, ge = null;
    const He = () => a.value ? { html: a.value.innerHTML, caret: ke(a.value) } : null, nt = (r) => {
      a.value && (a.value.innerHTML = r.html, Ae(a.value, r.caret, !0), u());
    }, Te = () => {
      xe || (xe = He()), Pe.length = 0;
    }, me = () => {
      ge !== null && (clearTimeout(ge), ge = null), xe && (De.push(xe), xe = null);
    }, Xt = () => {
      ge !== null && clearTimeout(ge), ge = setTimeout(me, ao);
    }, Gt = () => {
      me();
      const r = De.pop();
      if (!r) return;
      const p = He();
      p && Pe.push(p), nt(r);
    }, qt = () => {
      const r = Pe.pop();
      if (!r) return;
      const p = He();
      p && De.push(p), nt(r);
    }, se = (r, p) => {
      const v = document.createRange(), x = window.getSelection();
      a.value?.focus({ preventScroll: !0 }), v.setStart(r, p), v.collapse(!0), x?.removeAllRanges(), x?.addRange(v);
    }, Kt = (r) => r instanceof Text ? r.nodeValue?.length ?? 0 : r.childNodes.length, ce = (r) => r.parentNode ? Array.prototype.indexOf.call(r.parentNode.childNodes, r) : 0, Ve = (r, p) => r instanceof Text ? p > 0 ? null : r.previousSibling ?? (r.parentNode && r.parentNode !== a.value ? Ve(r.parentNode, ce(r.parentNode)) : null) : r.childNodes[p - 1] ?? (r.parentNode && r !== a.value ? Ve(r.parentNode, ce(r)) : null), We = (r, p) => r instanceof Text ? p < (r.nodeValue?.length ?? 0) ? null : r.nextSibling ?? (r.parentNode && r.parentNode !== a.value ? We(r.parentNode, ce(r.parentNode) + 1) : null) : r.childNodes[p] ?? (r.parentNode && r !== a.value ? We(r.parentNode, ce(r) + 1) : null), Jt = (r, p) => {
      let v = r;
      for (; v; ) {
        if (v instanceof HTMLElement && v.hasAttribute("data-win55-emoji"))
          return v;
        if (v instanceof Text) {
          if ((v.nodeValue ?? "").length > 0)
            return null;
          v = p === "backward" ? v.previousSibling : v.nextSibling;
          continue;
        }
        if (v.childNodes.length > 0) {
          v = p === "backward" ? v.childNodes[v.childNodes.length - 1] : v.childNodes[0];
          continue;
        }
        return null;
      }
      return null;
    }, ot = (r) => {
      if (r.cloneContents().querySelector?.("[data-win55-emoji]"))
        return !0;
      const v = r.startContainer instanceof Element ? r.startContainer : r.startContainer.parentElement, x = r.endContainer instanceof Element ? r.endContainer : r.endContainer.parentElement;
      return !!(v?.closest("[data-win55-emoji]") || x?.closest("[data-win55-emoji]"));
    }, lt = (r) => {
      if (!a.value) return;
      const p = r.startContainer, v = r.startOffset;
      r.deleteContents(), p.isConnected && a.value.contains(p) ? se(p, Math.min(v, Kt(p))) : se(a.value, a.value.childNodes.length), u();
    }, Qt = (r) => {
      const p = document.createRange();
      return p.setStart(r.startContainer, r.startOffset), p.setEnd(r.endContainer, r.endOffset), p;
    }, Zt = (r) => r instanceof HTMLElement && r.hasAttribute("data-win55-emoji"), en = (r, p, v) => {
      if (!a.value || r.collapsed || r.startContainer !== r.endContainer || !(r.startContainer instanceof Text))
        return !1;
      const x = r.startContainer, j = x.nodeValue?.length ?? 0;
      if (r.startOffset !== 0 || r.endOffset !== j)
        return !1;
      const Y = p === "backward" ? x.previousSibling : x.nextSibling;
      if (!Zt(Y) || !x.parentNode)
        return !1;
      v();
      const Q = x.parentNode, le = ce(x);
      return x.remove(), se(Q, le), u(), !0;
    }, at = (r, p, v) => {
      const x = v === "backward" ? Ve(r, p) : We(r, p);
      return Jt(x, v);
    }, it = (r, p, v, x) => {
      const j = at(r, p, v);
      if (!j || !j.parentNode)
        return !1;
      x();
      const Y = j.parentNode, Q = ce(j);
      return j.remove(), se(Y, Q), u(), !0;
    }, tn = (r, p, v) => {
      if (!a.value || !a.value.contains(r.startContainer))
        return "none";
      const x = Qt(r);
      return x.collapsed ? it(
        r.startContainer,
        r.startOffset,
        p,
        v
      ) ? "deleted" : "none" : ot(x) ? (v(), lt(x), "deleted") : en(x, p, v) ? "deleted" : ne(x.cloneContents()) ? "native" : "none";
    }, nn = (r, p) => {
      if (!a.value) return !1;
      const v = window.getSelection();
      if (!v || v.rangeCount === 0)
        return !1;
      const x = v.getRangeAt(0);
      return a.value.contains(x.startContainer) ? v.isCollapsed ? it(
        x.startContainer,
        x.startOffset,
        r,
        p
      ) : ot(x) ? (p(), lt(x), !0) : !1 : !1;
    }, on = (r) => {
      if (!Pt() || r.shiftKey || r.ctrlKey || r.metaKey || r.altKey || r.key !== "ArrowLeft" && r.key !== "ArrowRight" || !a.value) return !1;
      const p = window.getSelection();
      if (!p || p.rangeCount === 0 || !p.isCollapsed) return !1;
      const v = p.getRangeAt(0);
      if (!a.value.contains(v.startContainer)) return !1;
      const x = r.key === "ArrowLeft" ? "backward" : "forward", j = at(v.startContainer, v.startOffset, x);
      return !j || !j.parentNode ? !1 : (r.preventDefault(), se(j.parentNode, ce(j) + (x === "forward" ? 1 : 0)), !0);
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
          r.preventDefault(), M();
          return;
        }
        if (r.key === "Escape") {
          r.preventDefault(), m();
          return;
        }
      }
      !o.multiline && r.key === "Enter" && r.preventDefault(), r.key === "Tab" && r.preventDefault(), on(r);
    }, st = (r) => {
      if (!a.value) return;
      if (r.inputType === "historyUndo" || r.inputType === "historyRedo") {
        r.preventDefault(), r.inputType === "historyUndo" ? Gt() : qt();
        return;
      }
      if (Te(), r.inputType !== "deleteContentBackward" && r.inputType !== "deleteContentForward")
        return;
      if (ne(a.value) === "") {
        r.preventDefault(), a.value.focus({ preventScroll: !0 });
        return;
      }
      const p = r.inputType === "deleteContentBackward" ? "backward" : "forward", v = r.getTargetRanges();
      for (const x of v) {
        const j = tn(
          x,
          p,
          () => r.preventDefault()
        );
        if (j === "deleted") {
          a.value.focus({ preventScroll: !0 });
          return;
        }
        if (j === "native")
          return;
      }
      nn(p, () => r.preventDefault()) && a.value.focus({ preventScroll: !0 });
    }, ct = (r) => {
      r.preventDefault();
      let p = r.clipboardData?.getData("text/plain") ?? "";
      if (o.multiline || (p = p.replace(/\n/g, " ")), !a.value) return;
      Te();
      const v = window.getSelection(), x = v?.getRangeAt(0);
      if (x) {
        x.deleteContents();
        const j = document.createTextNode(p);
        x.insertNode(j), x.collapse(!1), v?.removeAllRanges(), v?.addRange(x);
      }
      u(), me(), Xe(a.value);
    }, ut = () => {
      me(), m(), G.value = !1, a.value && (X.value = ke(a.value)), a.value && ne(a.value) === "" && (a.value.innerHTML = "");
    }, dt = A(() => ({
      ...o.extraStyles,
      ...Ft({ fontColor: "black" }),
      overflow: "auto",
      ...o.showEmojiButton ? { paddingRight: "34px" } : {}
    }));
    return t({ el: a }), (r, p) => (g(), b(O, null, [
      e.showEmojiButton ? (g(), b("div", Qn, [
        _(ee, {
          ref_key: "boxRef",
          ref: s,
          type: e.boxType,
          contenteditable: !e.disabled,
          "extra-styles": dt.value,
          "data-placeholder": e.placeholder,
          role: "textbox",
          "aria-multiline": e.multiline,
          "aria-disabled": e.disabled,
          onInput: u,
          onKeydown: rt,
          onBeforeinput: st,
          onPaste: ct,
          onFocus: Se,
          onBlur: ut
        }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"]),
        U.value ? (g(), b("img", {
          key: 0,
          src: V(re)(Le.value),
          width: "30",
          height: "30",
          class: "baseinput-emoji-button",
          "data-emoji-picker-trigger": "",
          onMousedown: p[0] || (p[0] = Ne(() => {
          }, ["prevent"])),
          onClick: Ne(ae, ["stop"])
        }, null, 40, Zn)) : J("", !0)
      ])) : (g(), z(ee, {
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
        onInput: u,
        onKeydown: rt,
        onBeforeinput: st,
        onPaste: ct,
        onFocus: Se,
        onBlur: ut
      }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"])),
      c.value && E.value ? (g(), z(fn, {
        key: 2,
        shown: !0,
        anchor: E.value,
        side: "top"
      }, {
        content: $(() => [
          k("div", eo, [
            L.value ? (g(), b("div", to, "...")) : J("", !0),
            (g(!0), b(O, null, K(F.value, ({ match: v, index: x }) => (g(), b("div", {
              key: v.shortcode,
              class: Ce(["shortcode-suggestion", { "shortcode-suggestion--selected": x === w.value }])
            }, [
              k("img", {
                src: V(re)(v.code),
                width: "30",
                height: "30",
                class: "shortcode-suggestion-image"
              }, null, 8, no),
              k("span", null, ":" + oe(v.shortcode) + ":", 1)
            ], 2))), 128)),
            P.value ? (g(), b("div", oo, "...")) : J("", !0)
          ])
        ]),
        _: 1
      }, 8, ["anchor"])) : J("", !0)
    ], 64));
  }
}), $e = /* @__PURE__ */ H({
  __name: "Button",
  props: {
    baseType: { default: "panel-d-1" },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: t }) {
    const n = e, l = t, o = R(!1), i = R(!1), s = A(() => !n.disabled && o.value && i.value), a = A(() => n.disabled), u = (E) => {
      n.disabled || E.button !== 0 || (o.value = !0, i.value = !0);
    }, d = () => {
      n.disabled || (i.value = !0);
    }, f = () => {
      i.value = !1;
    }, c = (E) => {
      n.disabled || E.button !== 0 || (o.value && i.value && l("click"), o.value = !1);
    };
    de(() => {
      window.addEventListener("mouseup", c);
    }), fe(() => {
      window.removeEventListener("mouseup", c);
    });
    const h = A(() => ({
      userSelect: "none",
      width: "fit-content",
      paddingBottom: "4px",
      paddingRight: "4px",
      cursor: a.value ? "not-allowed" : "default",
      ...n.extraStyles
    })), y = A(() => ({
      transform: s.value ? "translate(2px, 2px)" : "translate(0, 0)",
      opacity: a.value ? 0.5 : 1
    })), w = A(() => s.value ? "indent" : n.baseType);
    return (E, C) => (g(), z(ee, {
      type: w.value,
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
}), io = { style: { display: "flex", "align-items": "center" } }, ro = ["src", "alt"], so = ["checked", "disabled", "value"], ll = /* @__PURE__ */ H({
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
    return (i, s) => (g(), b("div", {
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
      k("div", io, [
        k("img", {
          draggable: "false",
          src: e.modelValue ? e.checkedIcon : e.uncheckedIcon,
          alt: e.modelValue ? "checked" : "unchecked"
        }, null, 8, ro)
      ]),
      k("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, so),
      e.label ? (g(), b("span", {
        key: 0,
        style: D({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, oe(e.label), 5)) : J("", !0)
    ], 6));
  }
}), co = /* @__PURE__ */ H({
  __name: "HDivider",
  setup(e) {
    return (t, n) => (g(), z(ee, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), al = /* @__PURE__ */ H({
  __name: "MenuDropdown",
  setup(e) {
    return (t, n) => (g(), z(hn, null, {
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
}), uo = { style: { display: "flex", "align-items": "center" } }, fo = ["src"], ho = ["src"], go = ["checked", "disabled", "value", "name"], il = /* @__PURE__ */ H({
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
    const n = e, l = t, o = A(() => n.modelValue === n.value), i = (s) => {
      s.preventDefault(), !n.disabled && (o.value || l("update:modelValue", n.value));
    };
    return (s, a) => (g(), b("div", {
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
      onClick: i
    }, [
      k("div", uo, [
        o.value ? (g(), b("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, fo)) : (g(), b("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, ho))
      ]),
      k("input", {
        type: "radio",
        checked: o.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, go),
      e.label ? (g(), b("span", {
        key: 0,
        style: D({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, oe(e.label), 5)) : J("", !0)
    ], 6));
  }
}), ve = /* @__PURE__ */ H({
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
    const t = e, n = A(() => t.element ?? "span"), l = A(() => {
      const o = Ft(t);
      return t.element || (o.display = "contents"), o;
    });
    return (o, i) => (g(), z(an(n.value), {
      style: D(l.value)
    }, {
      default: $(() => [
        W(o.$slots, "default")
      ]),
      _: 3
    }, 8, ["style"]));
  }
}), mo = { key: 1 }, po = {
  key: 4,
  style: { "text-decoration": "underline" }
}, vo = {
  key: 5,
  style: { "text-decoration": "line-through" }
}, yo = ["href"], wo = ["aria-label", "data-win55-emoji"], xo = ["src", "alt"], bo = /* @__PURE__ */ H({
  __name: "RichTextNode",
  props: {
    node: {},
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    function t(n, l) {
      return n ? re(n) : Wt(l);
    }
    return (n, l) => {
      const o = rn("RichTextNode", !0);
      return e.node.type === "text" ? (g(), b(O, { key: 0 }, [
        we(oe(e.node.value), 1)
      ], 64)) : e.node.type === "break" ? (g(), b("br", mo)) : e.node.type === "bold" ? (g(), z(ve, {
        key: 2,
        "is-bold": ""
      }, {
        default: $(() => [
          (g(!0), b(O, null, K(e.node.children, (i, s) => (g(), z(o, {
            key: s,
            node: i,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "italic" ? (g(), z(ve, {
        key: 3,
        "is-italic": ""
      }, {
        default: $(() => [
          (g(!0), b(O, null, K(e.node.children, (i, s) => (g(), z(o, {
            key: s,
            node: i,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "underline" ? (g(), b("span", po, [
        (g(!0), b(O, null, K(e.node.children, (i, s) => (g(), z(o, {
          key: s,
          node: i,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "strike" ? (g(), b("span", vo, [
        (g(!0), b(O, null, K(e.node.children, (i, s) => (g(), z(o, {
          key: s,
          node: i,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "color" ? (g(), z(ve, {
        key: 6,
        "font-color": e.node.value
      }, {
        default: $(() => [
          (g(!0), b(O, null, K(e.node.children, (i, s) => (g(), z(o, {
            key: s,
            node: i,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-color"])) : e.node.type === "size" && e.allowSizes ? (g(), z(ve, {
        key: 7,
        "font-size": e.node.value
      }, {
        default: $(() => [
          (g(!0), b(O, null, K(e.node.children, (i, s) => (g(), z(o, {
            key: s,
            node: i,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-size"])) : e.node.type === "size" ? (g(!0), b(O, { key: 8 }, K(e.node.children, (i, s) => (g(), z(o, {
        key: s,
        node: i,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "url" && e.allowLinks ? (g(), b("a", {
        key: 9,
        href: e.node.href,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "richtext-link"
      }, [
        (g(!0), b(O, null, K(e.node.children, (i, s) => (g(), z(o, {
          key: s,
          node: i,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ], 8, yo)) : e.node.type === "url" ? (g(!0), b(O, { key: 10 }, K(e.node.children, (i, s) => (g(), z(o, {
        key: s,
        node: i,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "emoji" ? (g(), b("span", {
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
        }, null, 8, xo)
      ], 8, wo)) : J("", !0);
    };
  }
}), Eo = {
  b: "bold",
  i: "italic",
  u: "underline",
  s: "strike",
  strike: "strike",
  color: "color",
  size: "size",
  url: "url"
}, ko = /* @__PURE__ */ new Set(["br"]), Tt = {
  normal: 12,
  big: 24
};
function _t(e) {
  return e.map((t) => t.type === "text" ? t.value : t.type === "emoji" ? t.emoji : t.type === "break" ? `
` : _t(t.children)).join("");
}
function Rt(e) {
  switch (e.tagType) {
    case "color":
      return { type: "color", value: e.value ?? "inherit", children: e.children };
    case "size": {
      const t = (e.value ?? "").trim().toLowerCase(), n = Tt[t], l = Number.parseInt(e.value ?? "", 10);
      return { type: "size", value: n ?? (Number.isFinite(l) ? l : Tt.normal), children: e.children };
    }
    case "url":
      return {
        type: "url",
        href: e.value ?? _t(e.children).trim(),
        children: e.children
      };
    default:
      return { type: e.tagType, children: e.children };
  }
}
function Co(e, t) {
  for (let n = e.length - 1; n >= 0; n--)
    if (e[n].tagType === t) return n;
  return -1;
}
function So(e, t) {
  if (!e) return [];
  if (!t) return [{ type: "text", value: e }];
  const n = [], l = /:([a-zA-Z0-9_+-]+):/g;
  let o = 0, i;
  for (; i = l.exec(e); ) {
    const s = t.get(i[1].toLowerCase());
    s && (i.index > o && n.push({ type: "text", value: e.slice(o, i.index) }), n.push({ type: "emoji", emoji: s.emoji, code: s.code }), o = i.index + i[0].length);
  }
  return o < e.length && n.push({ type: "text", value: e.slice(o) }), n.length > 0 ? n : [{ type: "text", value: e }];
}
function To(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const Bt = /* @__PURE__ */ new WeakMap(), Ro = new RegExp(Fe, "gu");
function Bo(e) {
  if (!e) return Ro;
  const t = Bt.get(e);
  if (t) return t;
  const n = Object.keys(e).sort((i, s) => s.length - i.length).map(To), l = n.length > 0 ? `${n.join("|")}|${Fe}` : Fe, o = new RegExp(l, "gu");
  return Bt.set(e, o), o;
}
function jo(e, t) {
  const n = Bo(t), l = [];
  let o = 0, i;
  for (n.lastIndex = 0; i = n.exec(e); ) {
    const s = i[0], a = t?.[s];
    i.index > o && l.push({ type: "text", value: e.slice(o, i.index) }), l.push({ type: "emoji", emoji: s, code: a }), o = i.index + s.length;
  }
  return o < e.length && l.push({ type: "text", value: e.slice(o) }), l.length > 0 ? l : [{ type: "text", value: e }];
}
function Ao(e, t, n) {
  const l = [];
  for (const o of So(e, t))
    o.type === "text" ? l.push(...jo(o.value, n)) : l.push(o);
  return l;
}
function zo(e, t, n = null) {
  const l = [], o = [], i = /\[(\/?)(\w+)(?:=([^\]]*))?\]/g;
  let s = 0, a;
  const u = () => o.length ? o[o.length - 1].children : l, d = (f) => u().push(...Ao(f, t, n));
  for (; a = i.exec(e); ) {
    const [f, c, h, y] = a, w = h.toLowerCase();
    if (ko.has(w)) {
      d(e.slice(s, a.index)), s = a.index + f.length, u().push({ type: "break" });
      continue;
    }
    const E = Eo[w];
    if (!E) continue;
    if (d(e.slice(s, a.index)), s = a.index + f.length, !c) {
      o.push({ tagType: E, value: y, children: [] });
      continue;
    }
    const C = Co(o, E);
    if (C === -1) {
      d(f);
      continue;
    }
    for (; o.length > C + 1; ) {
      const I = o.pop();
      o[o.length - 1].children.push(Rt(I));
    }
    const S = o.pop();
    u().push(Rt(S));
  }
  for (d(e.slice(s)); o.length; ) {
    const f = o.pop();
    (o.length ? o[o.length - 1].children : l).push(...f.children);
  }
  return l;
}
const Io = {
  "data-win55-richtext": "",
  style: { display: "contents" }
}, rl = /* @__PURE__ */ H({
  __name: "RichText",
  props: {
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = It(), l = R(null), o = R(null);
    et().then((u) => {
      const d = /* @__PURE__ */ new Map();
      for (const f of u)
        for (const c of f.shortcodes)
          d.set(c.toLowerCase(), { emoji: f.emoji, code: f.code });
      l.value = d;
    }), he().then((u) => {
      o.value = u;
    });
    const i = A(() => {
      const u = l.value;
      return u ? { get: (d) => u.get(d) } : null;
    });
    function s(u) {
      return u.map((d) => typeof d.children == "string" ? d.children : Array.isArray(d.children) ? s(d.children) : "").join("");
    }
    const a = A(() => zo(s(n.default?.() ?? []), i.value, o.value));
    return (u, d) => (g(), b("span", Io, [
      (g(!0), b(O, null, K(a.value, (f, c) => (g(), z(bo, {
        key: c,
        node: f,
        "allow-links": t.allowLinks,
        "allow-sizes": t.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
    ]));
  }
});
function $o(e, t, n, l, o) {
  const i = e.getContext("2d");
  if (!i) return;
  i.clearRect(0, 0, e.width, e.height);
  const s = 2, a = [
    [0, 48, 12, 60, 3, 51, 15, 63],
    [32, 16, 44, 28, 35, 19, 47, 31],
    [8, 56, 4, 52, 11, 59, 7, 55],
    [40, 24, 36, 20, 43, 27, 39, 23],
    [2, 50, 14, 62, 1, 49, 13, 61],
    [34, 18, 46, 30, 33, 17, 45, 29],
    [10, 58, 6, 54, 9, 57, 5, 53],
    [42, 26, 38, 22, 41, 25, 37, 21]
  ], u = jt(l), d = jt(o), f = Math.floor(t / s), c = Math.floor(n / s);
  e.width = Math.floor(t * 2) / 2, e.height = Math.floor(n * 2) / 2;
  for (let h = 0; h < c; h++)
    for (let y = 0; y < f; y++) {
      const w = y * s, E = h * s, C = (y + h) / (f + c - 6), S = (a[h % 8][y % 8] + 0.5) / 64, I = C > S ? 1 : 0, F = Math.round(u.r * (1 - I) + d.r * I), L = Math.round(u.g * (1 - I) + d.g * I), P = Math.round(u.b * (1 - I) + d.b * I);
      i.fillStyle = `rgb(${F}, ${L}, ${P})`, i.fillRect(w, E, s, s);
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
const No = { style: { height: "0", overflow: "visible" } }, Fo = { class: "titlebar-content" }, Lo = { class: "titlebar-image" }, Mo = ["src"], Oo = { class: "titlebar-text" }, Do = { class: "titlebar-buttons" }, Po = /* @__PURE__ */ H({
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
      const u = t.gradientColorA || "5555ff", d = t.gradientColorB || "0000aa";
      $o(s, s.width, s.height, u, d), a.fillStyle = "#555555", a.fillRect(0, s.height - 2, Math.floor(s.width / 2) * 2, 4);
    }
    function i() {
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
      i(), n.value && (l = new ResizeObserver(() => {
        i();
      }), l.observe(n.value));
    }), fe(() => {
      l?.disconnect();
    }), (s, a) => (g(), b("div", null, [
      k("div", No, [
        k("canvas", {
          ref_key: "canvasRef",
          ref: n,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      k("div", Fo, [
        k("div", Lo, [
          k("img", {
            src: e.icon ?? "/win-55-ui/icons/program.png"
          }, null, 8, Mo)
        ]),
        k("div", Oo, [
          _(ve, {
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
        k("div", Do, [
          W(s.$slots, "buttons"),
          e.placeholderButtons ? (g(), b(O, { key: 0 }, [
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
}), sl = /* @__PURE__ */ H({
  __name: "Tooltip",
  props: {
    text: {},
    offsetX: {},
    offsetY: {}
  },
  setup(e) {
    const t = e, n = R(!1), l = sn({ x: 0, y: 0 });
    let o = null;
    const i = () => {
      o = window.setTimeout(() => {
        n.value = !0;
      }, 400);
    }, s = () => {
      o !== null && (clearTimeout(o), o = null), n.value = !1;
    }, a = (d) => {
      l.x = d.clientX + (t.offsetX ?? 24), l.y = d.clientY + (t.offsetY ?? 24);
    }, u = A(() => ({
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
    }), (d, f) => (g(), b("span", {
      onMouseenter: i,
      onMouseleave: s,
      onMousemove: a,
      style: { position: "relative", display: "inline-block" }
    }, [
      W(d.$slots, "default"),
      n.value ? (g(), z(ee, {
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
}), Ho = {
  class: "window-container",
  style: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%"
  }
}, je = 6, Vo = /* @__PURE__ */ H({
  __name: "Window",
  props: /* @__PURE__ */ Nt({
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
    const t = e, n = Ee(e, "x"), l = Ee(e, "y"), o = Ee(e, "width"), i = Ee(e, "height"), s = t.minWidth ?? 240, a = t.minHeight ?? 40, u = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableHorizontally ?? !1), d = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableVertically ?? !1);
    let f = !1, c = !1, h = "", y = "", w = 0, E = 0, C = 0, S = 0, I = 0, F = 0;
    const L = R("default");
    function P(B) {
      if (t.faux || h) return;
      const N = B.target;
      N.closest(".titlebar-image") || N.closest(".titlebar-buttons") || (f = !0, w = B.clientX, E = B.clientY, I = n.value, F = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", T), window.addEventListener("mouseup", M));
    }
    function m(B) {
      t.faux || h && (!u && !d || (c = !0, y = h, w = B.clientX, E = B.clientY, C = o.value, S = i.value, I = n.value, F = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", T), window.addEventListener("mouseup", M)));
    }
    function T(B) {
      if (t.faux) return;
      const N = B.clientX - w, G = B.clientY - E;
      if (f && (n.value = I + N, l.value = F + G), c) {
        const q = y;
        if (u && q.includes("e") && (o.value = Math.max(s, C + N)), d && q.includes("s") && (i.value = Math.max(a, S + G)), u && q.includes("w")) {
          const U = C - N, te = Math.max(s, U);
          o.value = te, n.value = I + (C - te);
        }
        if (d && q.includes("n")) {
          const U = S - G, te = Math.max(a, U);
          i.value = te, l.value = F + (S - te);
        }
      }
    }
    function M() {
      f = !1, c = !1, y = "", document.body.style.userSelect = "", window.removeEventListener("mousemove", T), window.removeEventListener("mouseup", M);
    }
    function X(B) {
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
      const U = B.currentTarget.getBoundingClientRect(), te = B.clientX - U.left, Le = U.right - B.clientX, Me = B.clientY - U.top, Se = U.bottom - B.clientY;
      let ae = "";
      G && (Me < je ? ae += "n" : Se < je && (ae += "s")), N && (te < je ? ae += "w" : Le < je && (ae += "e")), h = ae;
      const Oe = {
        n: "ns-resize",
        s: "ns-resize",
        e: "ew-resize",
        w: "ew-resize",
        ne: "nesw-resize",
        sw: "nesw-resize",
        nw: "nwse-resize",
        se: "nwse-resize"
      };
      L.value = Oe[ae] ?? "default";
    }
    return ue(() => [t.resizable, t.resizableHorizontally, t.resizableVertically], () => {
      const B = document.querySelector(`[data-v-${Math.random().toString(36).substr(2, 9)}]`);
      if (B) {
        const N = B.getBoundingClientRect(), G = N.left + N.width / 2, q = N.top + N.height / 2;
        X({
          currentTarget: B,
          clientX: G,
          clientY: q
        });
      }
    }, { immediate: !0 }), (B, N) => (g(), z(ee, {
      "extra-class": e.extraClass,
      "extra-styles": t.faux ? e.extraStyles : {
        position: "absolute",
        left: n.value + "px",
        top: l.value + "px",
        width: o.value + "px",
        height: i.value + "px",
        cursor: L.value,
        ...e.extraStyles
      },
      type: "panel-d-2",
      onMousemove: X,
      onMousedown: m
    }, {
      default: $(() => [
        k("div", Ho, [
          k("div", {
            class: "titlebar-wrapper",
            onMousedown: Ne(P, ["stop"]),
            style: { height: "34px" }
          }, [
            _(Po, {
              title: e.title,
              icon: e.icon,
              "placeholder-buttons": e.placeholderButtons,
              disabled: e.disabled,
              "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
              "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
            }, {
              buttons: $(() => [
                W(B.$slots, "titlebar-buttons")
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
            W(B.$slots, "default")
          ], 4)
        ])
      ]),
      _: 3
    }, 8, ["extra-class", "extra-styles"]));
  }
}), Wo = /* @__PURE__ */ H({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" }
  },
  setup(e) {
    return (t, n) => (g(), z(ee, {
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
}), Uo = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [l, o] of t)
    n[l] = o;
  return n;
}, cl = /* @__PURE__ */ Uo(Wo, [["__scopeId", "data-v-9a25af1b"]]), At = "/win-55-ui/emoji/emoji-by-category.json";
let qe = null;
async function zt() {
  return qe || (qe = fetch(At).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${At}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), qe;
}
const Yo = { class: "emoji-picker-body" }, _o = { class: "emoji-picker-tabs" }, Xo = ["onClick"], Go = { class: "emoji-picker-grid" }, qo = ["src", "title", "onClick"], Ko = "546", ul = /* @__PURE__ */ H({
  __name: "EmojiPickerWindow",
  setup(e) {
    const t = R(null), n = R([]), l = R(null), o = R(void 0), i = A(() => n.value.find((d) => d.category === l.value) ?? null);
    async function s() {
      if (Math.random() < 0.75) {
        o.value = re(Ko);
        return;
      }
      const f = (await zt()).flatMap((h) => h.emojis);
      if (f.length === 0) return;
      const c = f[Math.floor(Math.random() * f.length)];
      o.value = re(c.code);
    }
    ue(ye, async (d) => {
      d && (s(), n.value.length === 0 && (n.value = await zt(), l.value = n.value[0]?.category ?? null));
    }, { immediate: !0 });
    function a(d) {
      l.value = d;
    }
    function u(d) {
      if (!ye.value) return;
      const f = d.target;
      t.value?.contains(f) || Ct();
    }
    return de(() => {
      document.addEventListener("click", u);
    }), fe(() => {
      document.removeEventListener("click", u);
    }), (d, f) => (g(), z(Ze, { to: "body" }, [
      V(ye) ? (g(), b("div", {
        key: 0,
        ref_key: "rootRef",
        ref: t,
        style: { display: "contents" }
      }, [
        _(Vo, {
          x: V(ie).x,
          "onUpdate:x": f[0] || (f[0] = (c) => V(ie).x = c),
          y: V(ie).y,
          "onUpdate:y": f[1] || (f[1] = (c) => V(ie).y = c),
          width: V(ie).width,
          "onUpdate:width": f[2] || (f[2] = (c) => V(ie).width = c),
          height: V(ie).height,
          "onUpdate:height": f[3] || (f[3] = (c) => V(ie).height = c),
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
              onClick: V(Ct)
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
                k("div", Yo, [
                  k("div", _o, [
                    (g(!0), b(O, null, K(n.value, (c) => (g(), b("span", {
                      key: c.category,
                      class: Ce(["emoji-picker-tab", { "emoji-picker-tab--selected": c.category === l.value }]),
                      onClick: (h) => a(c.category)
                    }, [
                      _(ve, {
                        shorthand: c.category === l.value ? "Bold12" : "Regular12"
                      }, {
                        default: $(() => [
                          we(oe(c.category), 1)
                        ]),
                        _: 2
                      }, 1032, ["shorthand"])
                    ], 10, Xo))), 128))
                  ]),
                  _(co),
                  k("div", Go, [
                    (g(!0), b(O, null, K(i.value?.emojis ?? [], (c) => (g(), b("div", {
                      key: c.code,
                      class: "emoji-picker-grid-cell"
                    }, [
                      k("img", {
                        src: V(re)(c.code),
                        title: c.shortcodes[0] ? `:${c.shortcodes[0]}:` : void 0,
                        class: "emoji-picker-grid-item",
                        onClick: (h) => V(Kn)(c.emoji)
                      }, null, 8, qo)
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
}), dl = (e, t = 30, n = 48, l = 30) => {
  const o = R(
    Array.from({ length: e }, (u, d) => ({
      sin: Math.sin(0 + d * Math.PI * 2 / e),
      cos: Math.cos(0 + d * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let i, s = 0;
  const a = () => {
    const u = Date.now();
    if (u - s >= 1e3 / t) {
      const d = Array.from({ length: e }, (y, w) => ({
        sin: Math.sin(u / (1e3 + w * 200) + w * Math.PI * 2 / e),
        cos: Math.cos(u / (3e3 + w * 400) + w * Math.PI * 2 / e + Math.PI / 4)
      })), f = d.map((y) => n + y.sin * l), c = e * n, h = f.reduce((y, w) => y + w, 0);
      if (h > 0) {
        const y = c / h, w = d.map((E) => ({
          sin: ((n + E.sin * l) * y - n) / l,
          cos: E.cos
        }));
        o.value = w;
      } else
        o.value = d;
      s = u;
    }
    i = requestAnimationFrame(a);
  };
  return de(() => {
    i = requestAnimationFrame(a);
  }), fe(() => {
    cancelAnimationFrame(i);
  }), { values: o };
};
function fl(e) {
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
  fn as Balloon,
  hn as BaseDropdown,
  ol as BaseInput,
  ee as Box,
  $e as Button,
  ll as Checkbox,
  ul as EmojiPickerWindow,
  co as HDivider,
  al as MenuDropdown,
  cl as NamedPanel,
  il as RadioButton,
  rl as RichText,
  Po as Titlebar,
  sl as Tooltip,
  ve as Typography,
  Vo as Window,
  tt as activeTarget,
  Ct as closePicker,
  nl as customEmojiDirective,
  $o as drawAngledBayerDitherGradient,
  Wn as emojiDirective,
  Zo as getEmojiGifPath,
  re as getEmojiGifPathFromCode,
  el as getEmojiRegistry,
  ke as getSelectionOffset,
  ne as getTextWithCustomEmoji,
  tl as hasEmoji,
  Kn as insertEmoji,
  he as loadEmojiRegistry,
  qn as openPicker,
  Jn as pickNextButtonIcon,
  ye as pickerOpen,
  ie as pickerPosition,
  kt as registerActiveInput,
  fl as registerGlobalImageErrorHandler,
  Qo as resetEmojiRegistryCache,
  Ae as restoreSelectionOffset,
  Ft as typographyStyles,
  dl as useSineWave
};
