import { defineComponent as H, ref as R, computed as j, openBlock as v, createElementBlock as E, normalizeStyle as D, normalizeClass as ze, renderSlot as V, useModel as pe, useSlots as Et, watch as de, nextTick as Ct, onMounted as fe, onUnmounted as he, createBlock as I, Teleport as kt, createElementVNode as k, createVNode as ne, withCtx as F, unref as ye, Fragment as P, createTextVNode as xe, toDisplayString as oe, createCommentVNode as J, mergeModels as St, withModifiers as je, shallowRef as Kt, renderList as _, resolveDynamicComponent as Jt, resolveComponent as _t, reactive as Qt } from "vue";
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
    return t({ el: l }), (r, i) => (v(), E("div", {
      ref_key: "rootRef",
      ref: l,
      class: ze(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
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
    const o = e, r = Et(), i = j(() => o.side ?? "top"), a = j(() => o.bias), c = R(i.value), d = j(() => o.anchor ? c.value : i.value), p = j(() => {
      const h = {};
      switch (i.value) {
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
      let h = "", B = !1;
      switch (d.value) {
        case "top":
          h = "rotate(0deg)", a.value === "right" && (B = !0);
          break;
        case "bottom":
          h = "rotate(180deg)", a.value === "left" && (B = !0);
          break;
        case "left":
          h = "rotate(-90deg)";
          break;
        case "right":
          h = "rotate(90deg)", B = !0;
          break;
      }
      return B ? `${h} scaleX(-1)` : h;
    }), w = j(() => {
      const h = {};
      return a.value ? ((d.value === "top" || d.value === "bottom") && (a.value === "left" && (h.transform = "translateX(calc(-50% + 28px))"), a.value === "right" && (h.transform = "translateX(calc(50% - 28px))")), (d.value === "left" || d.value === "right") && (a.value === "up" && (h.transform = "translateY(calc(-50% + 28px))"), a.value === "down" && (h.transform = "translateY(calc(50% - 28px))")), h) : {};
    }), x = R(null), b = R(null), C = { top: "bottom", bottom: "top", left: "right", right: "left" }, S = {
      top: ["left", "right"],
      bottom: ["left", "right"],
      left: ["top", "bottom"],
      right: ["top", "bottom"]
    };
    function z(h, B, M) {
      const U = (B.left + B.right) / 2, A = (B.top + B.bottom) / 2;
      return h === "top" || h === "bottom" ? {
        top: h === "top" ? B.top - M.height : B.bottom,
        left: U - M.width / 2
      } : {
        left: h === "left" ? B.left - M.width : B.right,
        top: A - M.height / 2
      };
    }
    function L(h, B, M, U) {
      return h.top >= ke && h.left >= ke && h.top + B.height <= U - ke && h.left + B.width <= M - ke;
    }
    function $() {
      const h = x.value;
      if (!o.anchor || !h) return;
      const B = l(o.anchor), M = h.getBoundingClientRect(), U = window.innerWidth, A = window.innerHeight, N = o.side ?? "top", G = [
        N,
        C[N],
        ...S[N]
      ].find((W) => L(z(W, B, M), M, U, A)) ?? N;
      c.value = G, b.value = z(G, B, M);
    }
    de(
      [() => o.anchor, t],
      async ([h, B]) => {
        !h || !B || (await Ct(), $());
      },
      { deep: !0, immediate: !0 }
    );
    const O = () => {
      o.anchor && t.value && $();
    };
    return fe(() => {
      window.addEventListener("resize", O), window.addEventListener("scroll", O, !0);
    }), he(() => {
      window.removeEventListener("resize", O), window.removeEventListener("scroll", O, !0);
    }), (h, B) => e.anchor ? (v(), I(kt, {
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
            style: D(w.value)
          }, [
            ne(ee, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: F(() => [
                ye(r).content ? V(h.$slots, "content", { key: 0 }) : (v(), E(P, { key: 1 }, [
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
      ], 4)) : J("", !0)
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
            style: D(w.value)
          }, [
            ne(ee, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: F(() => [
                ye(r).content ? V(h.$slots, "content", { key: 0 }) : (v(), E(P, { key: 1 }, [
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
      ], 4)) : J("", !0)
    ]));
  }
}), on = /* @__PURE__ */ H({
  __name: "BaseDropdown",
  props: {
    matchTriggerWidth: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = R(!1), l = R(null), o = R(null), r = R(null), i = () => {
      const p = o.value, u = r.value;
      if (!p || !u) return;
      const f = p.getBoundingClientRect(), w = window.innerHeight, x = u.offsetHeight;
      let b = f.bottom + window.scrollY;
      const C = f.left + window.scrollX;
      f.bottom + x > w && (b = f.top + window.scrollY - x), l.value = {
        top: b,
        left: C,
        width: t.matchTriggerWidth ? f.width : void 0
      };
    };
    de(n, async (p) => {
      p && (await Ct(), i());
    });
    const a = () => {
      n.value && i();
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
      (v(), I(kt, { to: "body" }, [
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
        ], 4)) : J("", !0)
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
      return { style: l, size: Tt(t, o) };
  }
  return { style: "Regular", size: t };
}
function Bt(e) {
  const { style: t, size: n } = e.shorthand ? un(e.shorthand) : {
    style: cn(e.isBold, e.isItalic),
    size: Tt(e.fontSize ?? 12, ln)
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
function Tt(e, t) {
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
function Te(e, t, n = !1) {
  if (t === null || !e.isConnected)
    return;
  const l = Rt(e, t);
  if (!l)
    return;
  const o = document.createRange(), r = window.getSelection();
  n && e.focus({ preventScroll: !0 }), o.setStart(l.node, l.offset), o.collapse(!0), r?.removeAllRanges(), r?.addRange(o);
}
const At = "/win-55-ui/emoji", He = `${At}/emoji-registry.csv`;
let Re = null, Xe = null, Ae = null;
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
    const i = r.indexOf(",");
    if (i === -1) {
      console.warn(`[win-55-ui] Skipping emoji registry row ${l + 1}: missing comma`);
      continue;
    }
    const a = r.slice(0, i).trim(), c = jt(r.slice(i + 1));
    a && c && (t[a] = c);
  }
  return t;
}
async function se(e = {}) {
  const t = e.registryUrl ?? He;
  return Ae && t === He ? Ae : ((!Re || Xe !== t) && (Xe = t, Re = fetch(t).then((n) => {
    if (!n.ok)
      throw new Error(
        `Could not load emoji registry from ${t}: ${n.status} ${n.statusText}`
      );
    return n.text();
  }).then(fn).then((n) => (t === He && (Ae = n), n))), Re);
}
function Fo() {
  Re = null, Xe = null, Ae = null;
}
async function Lo(e, t = {}) {
  const l = (await se(t))[e];
  return l ? be(l, t) : null;
}
function be(e, t = {}) {
  return `${dn(t.basePath ?? At)}/${jt(e)}.gif`;
}
async function $o(e = {}) {
  return se(e);
}
async function Mo(e, t = {}) {
  const n = await se(t);
  return e in n;
}
se();
function hn(e) {
  return e.map((t) => {
    const n = parseInt(t.replace(/^#/, ""), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  });
}
function gn(e, t, n, l) {
  let o = 1 / 0, r = [0, 0, 0];
  for (const i of l) {
    const a = e - i[0], c = t - i[1], d = n - i[2], p = a * a + c * c + d * d;
    p < o && (o = p, r = i);
  }
  return r;
}
const mn = "win55-emoji", pn = "win55-emoji-image", K = 15, Ge = 2, vn = [
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
], wn = hn(vn), ut = [
  "[\\u{1F1E6}-\\u{1F1FF}]{2}",
  "[0-9#*]\\uFE0F?\\u20E3",
  "\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?)*",
  "\\p{Emoji_Presentation}"
].join("|"), yn = /* @__PURE__ */ new Set([
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
  const n = Object.keys(e).sort((r, i) => i.length - r.length).map(xn), l = n.length > 0 ? `${n.join("|")}|${ut}` : ut, o = new RegExp(l, "gu");
  return dt.set(e, o), o;
}
function zt(e) {
  return e.value === !1 ? null : typeof e.value == "object" ? e.value : {};
}
const En = "data-win55-richtext";
function Cn(e) {
  return yn.has(e.tagName) || e.hasAttribute("data-win55-emoji");
}
function It(e) {
  let t = e.parentElement;
  for (; t; ) {
    const n = ue.get(t);
    if (n && zt(n.binding))
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
  return `${K * Ge}px`;
}
function Bn(e, t, n, l, o) {
  const r = Math.min(1, Math.max(0, o)), i = e.getImageData(0, 0, t, n), a = i.data;
  for (let c = 0; c < a.length; c += 4) {
    const d = a[c], p = a[c + 1], u = a[c + 2];
    if (a[c + 3] < 80)
      a[c] = 0, a[c + 1] = 0, a[c + 2] = 0, a[c + 3] = 0;
    else {
      const [w, x, b] = gn(
        d,
        p,
        u,
        l
      ), C = Math.round(d + (w - d) * r), S = Math.round(p + (x - p) * r), z = Math.round(u + (b - u) * r);
      a[c] = C, a[c + 1] = S, a[c + 2] = z, a[c + 3] = 255;
    }
  }
  e.putImageData(i, 0, 0);
}
function Tn(e, t, n) {
  const l = e.getImageData(0, 0, t, n), o = new Uint8ClampedArray(l.data), r = l.data, i = (a, c) => (c * t + a) * 4;
  for (let a = 0; a < n; a++)
    for (let c = 0; c < t; c++) {
      const d = i(c, a), u = [
        c > 0 ? i(c - 1, a) : -1,
        c < t - 1 ? i(c + 1, a) : -1,
        a > 0 ? i(c, a - 1) : -1,
        a < n - 1 ? i(c, a + 1) : -1
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
  t.width = K, t.height = K;
  const n = t.getContext("2d");
  if (!n)
    return "";
  const l = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif', o = K * 4;
  n.textBaseline = "alphabetic", n.font = `${o}px ${l}`;
  const r = n.measureText(e), i = r.actualBoundingBoxLeft + r.actualBoundingBoxRight, a = r.actualBoundingBoxAscent + r.actualBoundingBoxDescent;
  if (i > 0 && a > 0) {
    const c = o * Math.min(K / i, K / a);
    n.font = `${c}px ${l}`;
    const d = n.measureText(e), p = d.actualBoundingBoxLeft + d.actualBoundingBoxRight, u = d.actualBoundingBoxAscent + d.actualBoundingBoxDescent, f = (K - p) / 2 + d.actualBoundingBoxLeft, w = (K - u) / 2 + d.actualBoundingBoxAscent;
    n.fillText(e, f, w - 0.5), Bn(n, K, K, wn, 0.1), Tn(n, K, K), $n(t);
  }
  return t.toDataURL("image/png");
}
function jn(e, t, n) {
  const l = document.createElement("span"), o = document.createElement("img");
  return l.className = n.className ?? mn, l.contentEditable = "false", l.dataset.win55Emoji = e, l.role = "img", l.ariaLabel = e, l.style.setProperty("--win55-emoji-size", Sn()), o.src = t, o.alt = e, o.className = pn, o.draggable = !1, o.dataset.win55EmojiImg = "true", o.addEventListener("load", () => {
    const r = o.naturalWidth * Ge, i = o.naturalHeight * Ge;
    l.style.width = `${r}px`, l.style.height = `${i}px`, o.style.width = `${r}px`, o.style.height = `${i}px`;
  }, { once: !0 }), l.append(o), l;
}
function zn(e, t, n, l) {
  const o = e.parentElement;
  if (!o)
    return;
  const r = window.getSelection(), i = r && r.rangeCount > 0 && r.isCollapsed ? r.getRangeAt(0) : null, a = i?.startContainer === e, c = !!(i && i.startContainer === o && i.startOffset === Array.prototype.indexOf.call(o.childNodes, e) + 1), d = a || c, p = c ? e.nodeValue?.length ?? 0 : a ? i?.startOffset ?? null : null, u = e.nodeValue ?? "";
  let f = 0, w = !1;
  const x = document.createDocumentFragment();
  let b = null, C = 0;
  const S = (L, $) => {
    b || (b = L, C = $);
  };
  t.lastIndex = 0;
  for (const L of u.matchAll(t)) {
    const $ = L[0], O = L.index, h = n[$];
    if (O === void 0)
      continue;
    const B = h ? be(h, l) : Rn($);
    if (!B)
      continue;
    w = !0;
    const M = document.createTextNode(u.slice(f, O));
    p !== null && p >= f && p <= O && S(M, p - f), x.append(M);
    const U = jn($, B, l);
    x.append(U), p !== null && p > O && p <= O + $.length && S(o, Array.prototype.indexOf.call(o.childNodes, e) + x.childNodes.length), f = O + $.length;
  }
  if (!w)
    return;
  const z = document.createTextNode(u.slice(f));
  if (p !== null && p >= f && S(z, p - f), x.append(z), e.replaceWith(x), d && b) {
    const L = document.createRange();
    L.setStart(b, C), L.collapse(!0), r?.removeAllRanges(), r?.addRange(L);
  }
}
function Nt(e, t, n, l) {
  const o = bn(t);
  if (o)
    for (const r of kn(e, l))
      zn(r, o, t, n);
}
const Ve = /* @__PURE__ */ new WeakMap();
async function We(e, t = {}) {
  const n = (Ve.get(e) ?? 0) + 1;
  Ve.set(e, n);
  const l = await se(t);
  Ve.get(e) !== n || !e.isConnected || Nt(e, l, t, !1);
}
async function In(e, t) {
  const n = zt(t.binding);
  if (!n)
    return;
  t.version += 1;
  const l = t.version, o = await se(n);
  ue.get(e)?.version !== l || !e.isConnected || It(e) || Nt(e, o, n, !0);
}
function qe(e, t) {
  t.renderQueued || (t.renderQueued = !0, t.renderFrame = window.requestAnimationFrame(() => {
    t.renderQueued = !1, t.renderFrame = null, In(e, t).catch((n) => {
      console.warn("[win-55-ui] Could not render custom emoji.", n);
    });
  }));
}
function Nn(e, t) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !t.clipboardData || It(e))
    return;
  const l = n.getRangeAt(0);
  if (!l.intersectsNode(e))
    return;
  const o = l.cloneContents(), r = Z(o);
  r && (t.clipboardData.setData("text/plain", r), t.preventDefault());
}
function Fn(e, t) {
  const n = new MutationObserver(() => {
    qe(e, t);
  });
  return n.observe(e, {
    characterData: !0,
    childList: !0,
    subtree: !0
  }), n;
}
const Ln = {
  mounted(e, t) {
    const n = {
      binding: t,
      copyHandler: (l) => Nn(e, l),
      observer: null,
      renderFrame: null,
      renderQueued: !1,
      version: 0
    };
    n.observer = Fn(e, n), ue.set(e, n), e.addEventListener("copy", n.copyHandler), qe(e, n);
  },
  updated(e, t) {
    const n = ue.get(e);
    n && (n.binding = t, qe(e, n));
  },
  unmounted(e) {
    const t = ue.get(e);
    t && (t.observer?.disconnect(), t.renderFrame !== null && window.cancelAnimationFrame(t.renderFrame), e.removeEventListener("copy", t.copyHandler)), ue.delete(e);
  }
};
function $n(e) {
  const t = e.getContext("2d");
  if (!t) {
    console.warn("Unable to get 2D context from canvas");
    return;
  }
  const n = e.width, l = e.height, o = t.getImageData(0, 0, n, l), r = o.data, i = (u, f) => u < 0 || f < 0 || u >= n || f >= l ? 0 : r[(f * n + u) * 4 + 3], a = Array.from({ length: l }, () => Array(n).fill(!1)), c = [];
  for (let u = 0; u < n; u++)
    i(u, 0) === 0 && !a[0][u] && (a[0][u] = !0, c.push({ x: u, y: 0 })), i(u, l - 1) === 0 && !a[l - 1][u] && (a[l - 1][u] = !0, c.push({ x: u, y: l - 1 }));
  for (let u = 0; u < l; u++)
    i(0, u) === 0 && !a[u][0] && (a[u][0] = !0, c.push({ x: 0, y: u })), i(n - 1, u) === 0 && !a[u][n - 1] && (a[u][n - 1] = !0, c.push({ x: n - 1, y: u }));
  const d = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  for (; c.length; ) {
    const { x: u, y: f } = c.shift();
    for (const [w, x] of d) {
      const b = u + w, C = f + x;
      b >= 0 && b < n && C >= 0 && C < l && !a[C][b] && i(b, C) === 0 && (a[C][b] = !0, c.push({ x: b, y: C }));
    }
  }
  const p = Array.from({ length: l }, () => Array(n).fill(!1));
  for (let u = 0; u < l; u++)
    for (let f = 0; f < n; f++) {
      if (i(f, u) === 0) continue;
      let w = !1;
      for (const [x, b] of d) {
        const C = f + x, S = u + b;
        if (C < 0 || S < 0 || C >= n || S >= l) {
          w = !0;
          break;
        }
        if (i(C, S) === 0 && a[S][C]) {
          w = !0;
          break;
        }
      }
      w && (p[u][f] = !0);
    }
  for (let u = 0; u < l; u++)
    for (let f = 0; f < n; f++)
      if (p[u][f]) {
        const w = (u * n + f) * 4;
        r[w] = 0, r[w + 1] = 0, r[w + 2] = 0;
      }
  t.putImageData(o, 0, 0);
}
const Do = Ln, ht = typeof Intl.Segmenter == "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function Ft(e) {
  return ht ? Array.from(ht.segment(e), (t) => t.segment) : Array.from(e);
}
function gt(e) {
  return Ft(e).length;
}
function Mn(e, t) {
  return Ft(e).slice(0, t).join("");
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
  const i = r.getBoundingClientRect(), a = r.parentNode;
  return r.remove(), a?.normalize(), Te(e, l), i;
}
const mt = "/win-55-ui/emoji/emoji-categories.json";
let Ye = null;
async function Ke() {
  return Ye || (Ye = fetch(mt).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${mt}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), Ye;
}
async function On(e) {
  const t = e.trim().toLowerCase();
  if (!t)
    return [];
  const n = await Ke(), l = [], o = /* @__PURE__ */ new Set();
  for (const r of n) {
    const i = r.shortcodes.find((a) => a.toLowerCase().startsWith(t));
    i && (l.push({ emoji: r.emoji, code: r.code, shortcode: i }), o.add(r.code));
  }
  for (const r of n) {
    if (o.has(r.code))
      continue;
    const i = r.tags.find((a) => a.toLowerCase().startsWith(t));
    i && (l.push({ emoji: r.emoji, code: r.code, shortcode: r.shortcodes[0] ?? i }), o.add(r.code));
  }
  return l;
}
async function Pn(e) {
  const t = e.trim().toLowerCase();
  if (!t)
    return;
  const l = (await Ke()).find((o) => o.shortcodes.some((r) => r.toLowerCase() === t));
  return l ? { emoji: l.emoji, code: l.code } : void 0;
}
const Lt = R(!1);
R({ x: 160, y: 120, width: 360, height: 420 });
const $t = Kt(null);
function pt(e) {
  $t.value = e;
}
function Hn() {
  Lt.value = !0;
}
let vt = 0;
function Vn(e) {
  const t = e[vt % e.length];
  return vt += 1, t;
}
const Wn = {
  key: 0,
  class: "baseinput-emoji-wrapper"
}, Yn = ["src"], Un = { class: "shortcode-suggestions" }, Xn = {
  key: 0,
  class: "shortcode-suggestion-ellipsis"
}, Gn = ["src"], qn = {
  key: 1,
  class: "shortcode-suggestion-ellipsis"
}, Kn = "546", Se = 5, Jn = 200, Oo = /* @__PURE__ */ H({
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
    ], o = e, r = n, i = R(null), a = j(() => i.value?.el ?? null);
    fe(() => {
      a.value && o.modelValue && (a.value.innerText = o.modelValue);
    }), de(() => o.modelValue, (s) => {
      if (a.value && Z(a.value) !== s) {
        const g = document.activeElement === a.value, m = g ? ve(a.value) : null;
        a.value.innerText = s ?? "", g && Te(a.value, m);
      }
    });
    const c = () => {
      if (!a.value) return;
      let s = Z(a.value);
      if (o.multiline || (s = s.replace(/\n/g, "")), o.maxLength && gt(s) > o.maxLength) {
        s = Mn(s, o.maxLength), a.value.innerText = s;
        const g = document.createRange(), m = window.getSelection();
        g.selectNodeContents(a.value), g.collapse(!1), m?.removeAllRanges(), m?.addRange(g);
      }
      Dt(), r("update:modelValue", s), Fe();
    }, d = /:([A-Za-z0-9_+-]*)$/, p = /:([A-Za-z0-9_+-]{2,}):$/, u = R(!1), f = R(null), w = R([]), x = R(0), b = R(null);
    let C = 0;
    const S = R(0);
    function z(s) {
      s < S.value ? S.value = s : s > S.value + Se - 1 && (S.value = s - Se + 1);
    }
    const L = j(() => {
      const s = S.value;
      return w.value.slice(s, s + Se).map((g, m) => ({ match: g, index: s + m }));
    }), $ = j(() => S.value > 0), O = j(() => S.value + Se < w.value.length), h = () => {
      u.value = !1, f.value = null, w.value = [], x.value = 0, S.value = 0;
    }, B = (s, g) => {
      if (!a.value) return;
      const m = window.getSelection();
      if (!m || m.rangeCount === 0 || !m.isCollapsed) return;
      const y = m.getRangeAt(0), T = y.startContainer;
      if (!(T instanceof Text) || !a.value.contains(T)) return;
      const Y = y.startOffset, q = Y - s;
      if (q < 0) return;
      const te = T.nodeValue ?? "";
      Ce(), T.nodeValue = te.slice(0, q) + g + te.slice(Y), ae(T, q + g.length), ce(), c(), We(a.value);
    }, M = () => {
      const s = w.value[x.value];
      !s || f.value === null || (B(1 + f.value.length, s.emoji), h());
    }, U = R(null), N = { insertEmoji: (s) => {
      if (!a.value) return;
      const y = (document.activeElement === a.value ? ve(a.value) : null) ?? U.value ?? gt(Z(a.value));
      Te(a.value, y, !0);
      const T = window.getSelection();
      if (!T || T.rangeCount === 0 || !T.isCollapsed) return;
      const Y = T.getRangeAt(0);
      Ce(), Y.deleteContents();
      const q = document.createTextNode(s);
      Y.insertNode(q), ae(q, q.length), ce(), c(), We(a.value);
    } }, X = R(!1), G = j(() => Lt.value && $t.value === N), W = j(() => o.showEmojiButton && (X.value || G.value)), Q = R(l[0]), Ie = j(() => G.value ? Kn : Q.value), Ne = () => {
      Q.value = Vn(l);
    };
    de(W, (s) => {
      s && Ne();
    });
    const Ee = () => {
      X.value = !0, pt(N);
    }, le = () => {
      pt(N), Hn();
    }, Fe = async () => {
      if (!a.value) {
        h();
        return;
      }
      const s = window.getSelection();
      if (!s || s.rangeCount === 0 || !s.isCollapsed) {
        h();
        return;
      }
      const g = s.getRangeAt(0), m = g.startContainer;
      if (!(m instanceof Text) || !a.value.contains(m)) {
        h();
        return;
      }
      const y = (m.nodeValue ?? "").slice(0, g.startOffset), T = u.value ? f.value : null, Y = p.exec(y);
      if (Y) {
        if (T === Y[1]) {
          const it = await Pn(Y[1]);
          it && B(Y[0].length, it.emoji);
        }
        h();
        return;
      }
      const te = d.exec(y)?.[1] ?? null;
      if (te === null || te.length < 2) {
        h();
        return;
      }
      const me = Dn(a.value);
      if (!me) {
        h();
        return;
      }
      const rt = ++C, st = await On(te);
      if (rt !== C || st.length === 0) {
        rt === C && h();
        return;
      }
      f.value = te, w.value = st, x.value = 0, S.value = 0, b.value = { top: me.top, bottom: me.bottom, left: me.left, right: me.right }, u.value = !0;
    }, Le = [], $e = [];
    let ge = null, ie = null;
    const Me = () => a.value ? { html: a.value.innerHTML, caret: ve(a.value) } : null, Je = (s) => {
      a.value && (a.value.innerHTML = s.html, Te(a.value, s.caret, !0), c());
    }, Ce = () => {
      ge || (ge = Me()), $e.length = 0;
    }, ce = () => {
      ie !== null && (clearTimeout(ie), ie = null), ge && (Le.push(ge), ge = null);
    }, Dt = () => {
      ie !== null && clearTimeout(ie), ie = setTimeout(ce, Jn);
    }, Ot = () => {
      ce();
      const s = Le.pop();
      if (!s) return;
      const g = Me();
      g && $e.push(g), Je(s);
    }, Pt = () => {
      const s = $e.pop();
      if (!s) return;
      const g = Me();
      g && Le.push(g), Je(s);
    }, ae = (s, g) => {
      const m = document.createRange(), y = window.getSelection();
      a.value?.focus({ preventScroll: !0 }), m.setStart(s, g), m.collapse(!0), y?.removeAllRanges(), y?.addRange(m);
    }, Ht = (s) => s instanceof Text ? s.nodeValue?.length ?? 0 : s.childNodes.length, re = (s) => s.parentNode ? Array.prototype.indexOf.call(s.parentNode.childNodes, s) : 0, De = (s, g) => s instanceof Text ? g > 0 ? null : s.previousSibling ?? (s.parentNode && s.parentNode !== a.value ? De(s.parentNode, re(s.parentNode)) : null) : s.childNodes[g - 1] ?? (s.parentNode && s !== a.value ? De(s.parentNode, re(s)) : null), Oe = (s, g) => s instanceof Text ? g < (s.nodeValue?.length ?? 0) ? null : s.nextSibling ?? (s.parentNode && s.parentNode !== a.value ? Oe(s.parentNode, re(s.parentNode) + 1) : null) : s.childNodes[g] ?? (s.parentNode && s !== a.value ? Oe(s.parentNode, re(s) + 1) : null), Vt = (s, g) => {
      let m = s;
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
    }, _e = (s) => {
      if (s.cloneContents().querySelector?.("[data-win55-emoji]"))
        return !0;
      const m = s.startContainer instanceof Element ? s.startContainer : s.startContainer.parentElement, y = s.endContainer instanceof Element ? s.endContainer : s.endContainer.parentElement;
      return !!(m?.closest("[data-win55-emoji]") || y?.closest("[data-win55-emoji]"));
    }, Qe = (s) => {
      if (!a.value) return;
      const g = s.startContainer, m = s.startOffset;
      s.deleteContents(), g.isConnected && a.value.contains(g) ? ae(g, Math.min(m, Ht(g))) : ae(a.value, a.value.childNodes.length), c();
    }, Wt = (s) => {
      const g = document.createRange();
      return g.setStart(s.startContainer, s.startOffset), g.setEnd(s.endContainer, s.endOffset), g;
    }, Yt = (s) => s instanceof HTMLElement && s.hasAttribute("data-win55-emoji"), Ut = (s, g, m) => {
      if (!a.value || s.collapsed || s.startContainer !== s.endContainer || !(s.startContainer instanceof Text))
        return !1;
      const y = s.startContainer, T = y.nodeValue?.length ?? 0;
      if (s.startOffset !== 0 || s.endOffset !== T)
        return !1;
      const Y = g === "backward" ? y.previousSibling : y.nextSibling;
      if (!Yt(Y) || !y.parentNode)
        return !1;
      m();
      const q = y.parentNode, te = re(y);
      return y.remove(), ae(q, te), c(), !0;
    }, Ze = (s, g, m) => {
      const y = m === "backward" ? De(s, g) : Oe(s, g);
      return Vt(y, m);
    }, et = (s, g, m, y) => {
      const T = Ze(s, g, m);
      if (!T || !T.parentNode)
        return !1;
      y();
      const Y = T.parentNode, q = re(T);
      return T.remove(), ae(Y, q), c(), !0;
    }, Xt = (s, g, m) => {
      if (!a.value || !a.value.contains(s.startContainer))
        return "none";
      const y = Wt(s);
      return y.collapsed ? et(
        s.startContainer,
        s.startOffset,
        g,
        m
      ) ? "deleted" : "none" : _e(y) ? (m(), Qe(y), "deleted") : Ut(y, g, m) ? "deleted" : Z(y.cloneContents()) ? "native" : "none";
    }, Gt = (s, g) => {
      if (!a.value) return !1;
      const m = window.getSelection();
      if (!m || m.rangeCount === 0)
        return !1;
      const y = m.getRangeAt(0);
      return a.value.contains(y.startContainer) ? m.isCollapsed ? et(
        y.startContainer,
        y.startOffset,
        s,
        g
      ) : _e(y) ? (g(), Qe(y), !0) : !1 : !1;
    }, qt = (s) => {
      if (s.shiftKey || s.ctrlKey || s.metaKey || s.altKey || s.key !== "ArrowLeft" && s.key !== "ArrowRight" || !a.value) return !1;
      const g = window.getSelection();
      if (!g || g.rangeCount === 0 || !g.isCollapsed) return !1;
      const m = g.getRangeAt(0);
      if (!a.value.contains(m.startContainer)) return !1;
      const y = s.key === "ArrowLeft" ? "backward" : "forward", T = Ze(m.startContainer, m.startOffset, y);
      return !T || !T.parentNode ? !1 : (s.preventDefault(), ae(T.parentNode, re(T) + (y === "forward" ? 1 : 0)), !0);
    }, tt = (s) => {
      if (u.value) {
        if (s.key === "ArrowDown") {
          s.preventDefault(), x.value = (x.value + 1) % w.value.length, z(x.value);
          return;
        }
        if (s.key === "ArrowUp") {
          s.preventDefault(), x.value = (x.value - 1 + w.value.length) % w.value.length, z(x.value);
          return;
        }
        if (s.key === "Tab" || s.key === " " || s.key === "Enter") {
          s.preventDefault(), M();
          return;
        }
        if (s.key === "Escape") {
          s.preventDefault(), h();
          return;
        }
      }
      !o.multiline && s.key === "Enter" && s.preventDefault(), s.key === "Tab" && s.preventDefault(), qt(s);
    }, nt = (s) => {
      if (!a.value) return;
      if (s.inputType === "historyUndo" || s.inputType === "historyRedo") {
        s.preventDefault(), s.inputType === "historyUndo" ? Ot() : Pt();
        return;
      }
      if (Ce(), s.inputType !== "deleteContentBackward" && s.inputType !== "deleteContentForward")
        return;
      if (Z(a.value) === "") {
        s.preventDefault(), a.value.focus({ preventScroll: !0 });
        return;
      }
      const g = s.inputType === "deleteContentBackward" ? "backward" : "forward", m = s.getTargetRanges();
      for (const y of m) {
        const T = Xt(
          y,
          g,
          () => s.preventDefault()
        );
        if (T === "deleted") {
          a.value.focus({ preventScroll: !0 });
          return;
        }
        if (T === "native")
          return;
      }
      Gt(g, () => s.preventDefault()) && a.value.focus({ preventScroll: !0 });
    }, ot = (s) => {
      s.preventDefault();
      let g = s.clipboardData?.getData("text/plain") ?? "";
      if (o.multiline || (g = g.replace(/\n/g, " ")), !a.value) return;
      Ce();
      const m = window.getSelection(), y = m?.getRangeAt(0);
      if (y) {
        y.deleteContents();
        const T = document.createTextNode(g);
        y.insertNode(T), y.collapse(!1), m?.removeAllRanges(), m?.addRange(y);
      }
      c(), ce(), We(a.value);
    }, lt = () => {
      ce(), h(), X.value = !1, a.value && (U.value = ve(a.value)), a.value && Z(a.value) === "" && (a.value.innerHTML = "");
    }, at = j(() => ({
      ...o.extraStyles,
      ...Bt({ fontColor: "black" }),
      overflow: "auto",
      ...o.showEmojiButton ? { paddingRight: "34px" } : {}
    }));
    return t({ el: a }), (s, g) => (v(), E(P, null, [
      e.showEmojiButton ? (v(), E("div", Wn, [
        ne(ee, {
          ref_key: "boxRef",
          ref: i,
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
          src: ye(be)(Ie.value),
          width: "30",
          height: "30",
          class: "baseinput-emoji-button",
          "data-emoji-picker-trigger": "",
          onMousedown: g[0] || (g[0] = je(() => {
          }, ["prevent"])),
          onClick: je(le, ["stop"])
        }, null, 40, Yn)) : J("", !0)
      ])) : (v(), I(ee, {
        key: 1,
        ref_key: "boxRef",
        ref: i,
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
      u.value && b.value ? (v(), I(nn, {
        key: 2,
        shown: !0,
        anchor: b.value,
        side: "top"
      }, {
        content: F(() => [
          k("div", Un, [
            $.value ? (v(), E("div", Xn, "...")) : J("", !0),
            (v(!0), E(P, null, _(L.value, ({ match: m, index: y }) => (v(), E("div", {
              key: m.shortcode,
              class: ze(["shortcode-suggestion", { "shortcode-suggestion--selected": y === x.value }])
            }, [
              k("img", {
                src: ye(be)(m.code),
                width: "30",
                height: "30",
                class: "shortcode-suggestion-image"
              }, null, 8, Gn),
              k("span", null, ":" + oe(m.shortcode) + ":", 1)
            ], 2))), 128)),
            O.value ? (v(), E("div", qn, "...")) : J("", !0)
          ])
        ]),
        _: 1
      }, 8, ["anchor"])) : J("", !0)
    ], 64));
  }
}), Ue = /* @__PURE__ */ H({
  __name: "Button",
  props: {
    baseType: { default: "panel-d-1" },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: t }) {
    const n = e, l = t, o = R(!1), r = R(!1), i = j(() => !n.disabled && o.value && r.value), a = j(() => n.disabled), c = (b) => {
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
    })), w = j(() => ({
      transform: i.value ? "translate(2px, 2px)" : "translate(0, 0)",
      opacity: a.value ? 0.5 : 1
    })), x = j(() => i.value ? "indent" : n.baseType);
    return (b, C) => (v(), I(ee, {
      type: x.value,
      "extra-styles": f.value,
      "extra-class": e.extraClass,
      onMousedown: c,
      onMouseenter: d,
      onMouseleave: p
    }, {
      default: F(() => [
        k("div", {
          style: D(w.value)
        }, [
          V(b.$slots, "default")
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"]));
  }
}), _n = { style: { display: "flex", "align-items": "center" } }, Qn = ["src", "alt"], Zn = ["checked", "disabled", "value"], Po = /* @__PURE__ */ H({
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
    return (r, i) => (v(), E("div", {
      class: ze(["checkbox-container", { disabled: e.disabled }]),
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
      k("div", _n, [
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
      }, oe(e.label), 5)) : J("", !0)
    ], 6));
  }
}), Ho = /* @__PURE__ */ H({
  __name: "HDivider",
  setup(e) {
    return (t, n) => (v(), I(ee, {
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
    return (t, n) => (v(), I(on, null, {
      trigger: F(() => [
        V(t.$slots, "trigger")
      ]),
      items: F(() => [
        ne(ee, { type: "panel-d-1" }, {
          default: F(() => [
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
    const n = e, l = t, o = j(() => n.modelValue === n.value), r = (i) => {
      i.preventDefault(), !n.disabled && (o.value || l("update:modelValue", n.value));
    };
    return (i, a) => (v(), E("div", {
      class: ze(["radio-container", { disabled: e.disabled }]),
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
      }, oe(e.label), 5)) : J("", !0)
    ], 6));
  }
}), we = /* @__PURE__ */ H({
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
      const o = Bt(t);
      return t.element || (o.display = "contents"), o;
    });
    return (o, r) => (v(), I(Jt(n.value), {
      style: D(l.value)
    }, {
      default: F(() => [
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
}, so = ["href"], io = ["aria-label", "data-win55-emoji"], co = ["src", "alt"], uo = /* @__PURE__ */ H({
  __name: "RichTextNode",
  props: {
    node: {},
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    return (t, n) => {
      const l = _t("RichTextNode", !0);
      return e.node.type === "text" ? (v(), E(P, { key: 0 }, [
        xe(oe(e.node.value), 1)
      ], 64)) : e.node.type === "break" ? (v(), E("br", lo)) : e.node.type === "bold" ? (v(), I(we, {
        key: 2,
        "is-bold": ""
      }, {
        default: F(() => [
          (v(!0), E(P, null, _(e.node.children, (o, r) => (v(), I(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "italic" ? (v(), I(we, {
        key: 3,
        "is-italic": ""
      }, {
        default: F(() => [
          (v(!0), E(P, null, _(e.node.children, (o, r) => (v(), I(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "underline" ? (v(), E("span", ao, [
        (v(!0), E(P, null, _(e.node.children, (o, r) => (v(), I(l, {
          key: r,
          node: o,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "strike" ? (v(), E("span", ro, [
        (v(!0), E(P, null, _(e.node.children, (o, r) => (v(), I(l, {
          key: r,
          node: o,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "color" ? (v(), I(we, {
        key: 6,
        "font-color": e.node.value
      }, {
        default: F(() => [
          (v(!0), E(P, null, _(e.node.children, (o, r) => (v(), I(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-color"])) : e.node.type === "size" && e.allowSizes ? (v(), I(we, {
        key: 7,
        "font-size": e.node.value
      }, {
        default: F(() => [
          (v(!0), E(P, null, _(e.node.children, (o, r) => (v(), I(l, {
            key: r,
            node: o,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-size"])) : e.node.type === "size" ? (v(!0), E(P, { key: 8 }, _(e.node.children, (o, r) => (v(), I(l, {
        key: r,
        node: o,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "url" && e.allowLinks ? (v(), E("a", {
        key: 9,
        href: e.node.href,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "richtext-link"
      }, [
        (v(!0), E(P, null, _(e.node.children, (o, r) => (v(), I(l, {
          key: r,
          node: o,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ], 8, so)) : e.node.type === "url" ? (v(!0), E(P, { key: 10 }, _(e.node.children, (o, r) => (v(), I(l, {
        key: r,
        node: o,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "emoji" ? (v(), E("span", {
        key: 11,
        class: "win55-emoji",
        role: "img",
        "aria-label": e.node.emoji,
        "data-win55-emoji": e.node.emoji,
        style: { "--win55-emoji-size": "30px" }
      }, [
        k("img", {
          class: "win55-emoji-image",
          src: ye(be)(e.node.code),
          alt: e.node.emoji,
          draggable: "false"
        }, null, 8, co)
      ], 8, io)) : J("", !0);
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
}, ho = /* @__PURE__ */ new Set(["br"]), wt = {
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
      const t = (e.value ?? "").trim().toLowerCase(), n = wt[t], l = Number.parseInt(e.value ?? "", 10);
      return { type: "size", value: n ?? (Number.isFinite(l) ? l : wt.normal), children: e.children };
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
    const i = t.get(r[1].toLowerCase());
    i && (r.index > o && n.push({ type: "text", value: e.slice(o, r.index) }), n.push({ type: "emoji", emoji: i.emoji, code: i.code }), o = r.index + r[0].length);
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
function wo(e, t) {
  if (!t) return [{ type: "text", value: e }];
  const n = vo(t);
  if (!n) return [{ type: "text", value: e }];
  const l = [];
  let o = 0, r;
  for (n.lastIndex = 0; r = n.exec(e); ) {
    const i = r[0], a = t[i];
    r.index > o && l.push({ type: "text", value: e.slice(o, r.index) }), l.push({ type: "emoji", emoji: i, code: a }), o = r.index + i.length;
  }
  return o < e.length && l.push({ type: "text", value: e.slice(o) }), l.length > 0 ? l : [{ type: "text", value: e }];
}
function yo(e, t, n) {
  const l = [];
  for (const o of mo(e, t))
    o.type === "text" ? l.push(...wo(o.value, n)) : l.push(o);
  return l;
}
function xo(e, t, n = null) {
  const l = [], o = [], r = /\[(\/?)(\w+)(?:=([^\]]*))?\]/g;
  let i = 0, a;
  const c = () => o.length ? o[o.length - 1].children : l, d = (p) => c().push(...yo(p, t, n));
  for (; a = r.exec(e); ) {
    const [p, u, f, w] = a, x = f.toLowerCase();
    if (ho.has(x)) {
      d(e.slice(i, a.index)), i = a.index + p.length, c().push({ type: "break" });
      continue;
    }
    const b = fo[x];
    if (!b) continue;
    if (d(e.slice(i, a.index)), i = a.index + p.length, !u) {
      o.push({ tagType: b, value: w, children: [] });
      continue;
    }
    const C = go(o, b);
    if (C === -1) {
      d(p);
      continue;
    }
    for (; o.length > C + 1; ) {
      const z = o.pop();
      o[o.length - 1].children.push(yt(z));
    }
    const S = o.pop();
    c().push(yt(S));
  }
  for (d(e.slice(i)); o.length; ) {
    const p = o.pop();
    (o.length ? o[o.length - 1].children : l).push(...p.children);
  }
  return l;
}
const bo = {
  "data-win55-richtext": "",
  style: { display: "contents" }
}, Yo = /* @__PURE__ */ H({
  __name: "RichText",
  props: {
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = Et(), l = R(null), o = R(null);
    Ke().then((c) => {
      const d = /* @__PURE__ */ new Map();
      for (const p of c)
        for (const u of p.shortcodes)
          d.set(u.toLowerCase(), { emoji: p.emoji, code: p.code });
      l.value = d;
    }), se().then((c) => {
      o.value = c;
    });
    const r = j(() => {
      const c = l.value;
      return c ? { get: (d) => c.get(d) } : null;
    });
    function i(c) {
      return c.map((d) => typeof d.children == "string" ? d.children : Array.isArray(d.children) ? i(d.children) : "").join("");
    }
    const a = j(() => xo(i(n.default?.() ?? []), r.value, o.value));
    return (c, d) => (v(), E("span", bo, [
      (v(!0), E(P, null, _(a.value, (p, u) => (v(), I(uo, {
        key: u,
        node: p,
        "allow-links": t.allowLinks,
        "allow-sizes": t.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
    ]));
  }
});
function Eo(e, t, n, l, o) {
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
  ], c = bt(l), d = bt(o), p = Math.floor(t / i), u = Math.floor(n / i);
  e.width = Math.floor(t * 2) / 2, e.height = Math.floor(n * 2) / 2;
  for (let f = 0; f < u; f++)
    for (let w = 0; w < p; w++) {
      const x = w * i, b = f * i, C = (w + f) / (p + u - 6), S = (a[f % 8][w % 8] + 0.5) / 64, z = C > S ? 1 : 0, L = Math.round(c.r * (1 - z) + d.r * z), $ = Math.round(c.g * (1 - z) + d.g * z), O = Math.round(c.b * (1 - z) + d.b * z);
      r.fillStyle = `rgb(${L}, ${$}, ${O})`, r.fillRect(x, b, i, i);
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
const Co = { style: { height: "0", overflow: "visible" } }, ko = { class: "titlebar-content" }, So = { class: "titlebar-image" }, Bo = ["src"], To = { class: "titlebar-text" }, Ro = { class: "titlebar-buttons" }, Ao = /* @__PURE__ */ H({
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
    function o(i, a) {
      const c = t.gradientColorA || "5555ff", d = t.gradientColorB || "0000aa";
      Eo(i, i.width, i.height, c, d), a.fillStyle = "#555555", a.fillRect(0, i.height - 2, Math.floor(i.width / 2) * 2, 4);
    }
    function r() {
      const i = n.value;
      if (!i) return;
      const a = i.getContext("2d");
      if (!a) return;
      const c = i.getBoundingClientRect(), d = Math.floor(c.width * 2) / 2, p = Math.floor(c.height * 2) / 2;
      (i.width !== d || i.height !== p) && (i.width = d, i.height = p), o(i, a);
    }
    return de(() => [t.gradientColorA, t.gradientColorB], () => {
      if (n.value) {
        const i = n.value.getContext("2d");
        i && o(n.value, i);
      }
    }), fe(() => {
      r(), n.value && (l = new ResizeObserver(() => {
        r();
      }), l.observe(n.value));
    }), he(() => {
      l?.disconnect();
    }), (i, a) => (v(), E("div", null, [
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
          }, null, 8, Bo)
        ]),
        k("div", To, [
          ne(we, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: F(() => [
              xe(oe(e.title), 1)
            ]),
            _: 1
          })
        ]),
        k("div", Ro, [
          V(i.$slots, "buttons"),
          e.placeholderButtons ? (v(), E(P, { key: 0 }, [
            ne(Ue, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: F(() => [...a[0] || (a[0] = [
                k("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/o.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            ne(Ue, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: F(() => [...a[1] || (a[1] = [
                k("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/_.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            a[3] || (a[3] = k("div", { style: { width: "2px" } }, null, -1)),
            ne(Ue, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: F(() => [...a[2] || (a[2] = [
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
}), Uo = /* @__PURE__ */ H({
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
    }, i = () => {
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
      onMouseleave: i,
      onMousemove: a,
      style: { position: "relative", display: "inline-block" }
    }, [
      V(d.$slots, "default"),
      n.value ? (v(), I(ee, {
        key: 0,
        style: D(c.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: F(() => [
          xe(oe(t.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : J("", !0)
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
}, Be = 6, Xo = /* @__PURE__ */ H({
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
    const t = e, n = pe(e, "x"), l = pe(e, "y"), o = pe(e, "width"), r = pe(e, "height"), i = t.minWidth ?? 240, a = t.minHeight ?? 40, c = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableHorizontally ?? !1), d = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableVertically ?? !1);
    let p = !1, u = !1, f = "", w = "", x = 0, b = 0, C = 0, S = 0, z = 0, L = 0;
    const $ = R("default");
    function O(A) {
      if (t.faux || f) return;
      const N = A.target;
      N.closest(".titlebar-image") || N.closest(".titlebar-buttons") || (p = !0, x = A.clientX, b = A.clientY, z = n.value, L = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", B), window.addEventListener("mouseup", M));
    }
    function h(A) {
      t.faux || f && (!c && !d || (u = !0, w = f, x = A.clientX, b = A.clientY, C = o.value, S = r.value, z = n.value, L = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", B), window.addEventListener("mouseup", M)));
    }
    function B(A) {
      if (t.faux) return;
      const N = A.clientX - x, X = A.clientY - b;
      if (p && (n.value = z + N, l.value = L + X), u) {
        const G = w;
        if (c && G.includes("e") && (o.value = Math.max(i, C + N)), d && G.includes("s") && (r.value = Math.max(a, S + X)), c && G.includes("w")) {
          const W = C - N, Q = Math.max(i, W);
          o.value = Q, n.value = z + (C - Q);
        }
        if (d && G.includes("n")) {
          const W = S - X, Q = Math.max(a, W);
          r.value = Q, l.value = L + (S - Q);
        }
      }
    }
    function M() {
      p = !1, u = !1, w = "", document.body.style.userSelect = "", window.removeEventListener("mousemove", B), window.removeEventListener("mouseup", M);
    }
    function U(A) {
      if (t.faux) {
        f = "", $.value = "default";
        return;
      }
      if (u) return;
      const N = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableHorizontally ?? !1), X = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableVertically ?? !1);
      if (!N && !X) {
        f = "", $.value = "default";
        return;
      }
      const W = A.currentTarget.getBoundingClientRect(), Q = A.clientX - W.left, Ie = W.right - A.clientX, Ne = A.clientY - W.top, Ee = W.bottom - A.clientY;
      let le = "";
      X && (Ne < Be ? le += "n" : Ee < Be && (le += "s")), N && (Q < Be ? le += "w" : Ie < Be && (le += "e")), f = le;
      const Fe = {
        n: "ns-resize",
        s: "ns-resize",
        e: "ew-resize",
        w: "ew-resize",
        ne: "nesw-resize",
        sw: "nesw-resize",
        nw: "nwse-resize",
        se: "nwse-resize"
      };
      $.value = Fe[le] ?? "default";
    }
    return de(() => [t.resizable, t.resizableHorizontally, t.resizableVertically], () => {
      const A = document.querySelector(`[data-v-${Math.random().toString(36).substr(2, 9)}]`);
      if (A) {
        const N = A.getBoundingClientRect(), X = N.left + N.width / 2, G = N.top + N.height / 2;
        U({
          currentTarget: A,
          clientX: X,
          clientY: G
        });
      }
    }, { immediate: !0 }), (A, N) => (v(), I(ee, {
      "extra-class": e.extraClass,
      "extra-styles": t.faux ? e.extraStyles : {
        position: "absolute",
        left: n.value + "px",
        top: l.value + "px",
        width: o.value + "px",
        height: r.value + "px",
        cursor: $.value,
        ...e.extraStyles
      },
      type: "panel-d-2",
      onMousemove: U,
      onMousedown: h
    }, {
      default: F(() => [
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
              buttons: F(() => [
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
}), zo = /* @__PURE__ */ H({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" }
  },
  setup(e) {
    return (t, n) => (v(), I(ee, {
      type: "border-groove",
      "extra-styles": { padding: "10px", margin: "10px" }
    }, {
      default: F(() => [
        k("div", {
          class: "label",
          style: D({ backgroundColor: e.backgroundColorHint })
        }, oe(e.label), 5),
        V(t.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }));
  }
}), Io = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [l, o] of t)
    n[l] = o;
  return n;
}, Go = /* @__PURE__ */ Io(zo, [["__scopeId", "data-v-9a25af1b"]]), qo = (e, t = 30, n = 48, l = 30) => {
  const o = R(
    Array.from({ length: e }, (c, d) => ({
      sin: Math.sin(0 + d * Math.PI * 2 / e),
      cos: Math.cos(0 + d * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let r, i = 0;
  const a = () => {
    const c = Date.now();
    if (c - i >= 1e3 / t) {
      const d = Array.from({ length: e }, (w, x) => ({
        sin: Math.sin(c / (1e3 + x * 200) + x * Math.PI * 2 / e),
        cos: Math.cos(c / (3e3 + x * 400) + x * Math.PI * 2 / e + Math.PI / 4)
      })), p = d.map((w) => n + w.sin * l), u = e * n, f = p.reduce((w, x) => w + x, 0);
      if (f > 0) {
        const w = u / f, x = d.map((b) => ({
          sin: ((n + b.sin * l) * w - n) / l,
          cos: b.cos
        }));
        o.value = x;
      } else
        o.value = d;
      i = c;
    }
    r = requestAnimationFrame(a);
  };
  return fe(() => {
    r = requestAnimationFrame(a);
  }), he(() => {
    cancelAnimationFrame(r);
  }), { values: o };
};
function Ko(e) {
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
  Ue as Button,
  Po as Checkbox,
  Ho as HDivider,
  Vo as MenuDropdown,
  Go as NamedPanel,
  Wo as RadioButton,
  Yo as RichText,
  Ao as Titlebar,
  Uo as Tooltip,
  we as Typography,
  Xo as Window,
  Do as customEmojiDirective,
  Eo as drawAngledBayerDitherGradient,
  Ln as emojiDirective,
  Lo as getEmojiGifPath,
  be as getEmojiGifPathFromCode,
  $o as getEmojiRegistry,
  ve as getSelectionOffset,
  Z as getTextWithCustomEmoji,
  Mo as hasEmoji,
  se as loadEmojiRegistry,
  Ko as registerGlobalImageErrorHandler,
  Fo as resetEmojiRegistryCache,
  Te as restoreSelectionOffset,
  Bt as typographyStyles,
  qo as useSineWave
};
