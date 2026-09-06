import { defineComponent as H, ref as B, computed as j, openBlock as g, createElementBlock as C, normalizeStyle as Y, normalizeClass as Be, renderSlot as X, useModel as ke, useSlots as nn, watch as me, nextTick as ut, onMounted as ae, onUnmounted as ie, createBlock as $, Teleport as Xe, createElementVNode as T, createVNode as K, withCtx as M, unref as U, Fragment as _, createTextVNode as xe, toDisplayString as oe, createCommentVNode as q, mergeModels as on, withModifiers as Ue, shallowRef as Ln, renderList as J, inject as Fn, provide as Mn, watchEffect as Fe, withDirectives as dt, reactive as at, resolveDynamicComponent as ln, resolveComponent as On } from "vue";
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
    return t({ el: l }), (r, s) => (g(), C("div", {
      ref_key: "rootRef",
      ref: l,
      class: Be(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: Y(o.value)
    }, [
      X(r.$slots, "default")
    ], 6));
  }
}), Pn = { class: "balloon-tip-box" }, Dn = {
  key: 1,
  class: "balloon-wrapper"
}, _n = { class: "balloon-tip-box" }, Ne = 8, Hn = /* @__PURE__ */ H({
  __name: "Balloon",
  props: /* @__PURE__ */ on({
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
    const t = ke(e, "shown");
    function n(m) {
      return "top" in m;
    }
    function l(m) {
      return n(m) ? m : { top: m.y, bottom: m.y, left: m.x, right: m.x };
    }
    const o = e, r = nn(), s = j(() => o.side ?? "top"), a = j(() => o.bias), d = B(s.value), u = j(() => o.anchor ? d.value : s.value), f = j(() => {
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
      let m = "", R = !1;
      switch (u.value) {
        case "top":
          m = "rotate(0deg)", a.value === "right" && (R = !0);
          break;
        case "bottom":
          m = "rotate(180deg)", a.value === "left" && (R = !0);
          break;
        case "left":
          m = "rotate(-90deg)";
          break;
        case "right":
          m = "rotate(90deg)", R = !0;
          break;
      }
      return R ? `${m} scaleX(-1)` : m;
    }), b = j(() => {
      const m = {};
      return a.value ? ((u.value === "top" || u.value === "bottom") && (a.value === "left" && (m.transform = "translateX(calc(-50% + 28px))"), a.value === "right" && (m.transform = "translateX(calc(50% - 28px))")), (u.value === "left" || u.value === "right") && (a.value === "up" && (m.transform = "translateY(calc(-50% + 28px))"), a.value === "down" && (m.transform = "translateY(calc(50% - 28px))")), m) : {};
    }), x = B(null), w = B(null), k = { top: "bottom", bottom: "top", left: "right", right: "left" }, S = {
      top: ["left", "right"],
      bottom: ["left", "right"],
      left: ["top", "bottom"],
      right: ["top", "bottom"]
    };
    function z(m, R, D) {
      const N = (R.left + R.right) / 2, V = (R.top + R.bottom) / 2;
      return m === "top" || m === "bottom" ? {
        top: m === "top" ? R.top - D.height : R.bottom,
        left: N - D.width / 2
      } : {
        left: m === "left" ? R.left - D.width : R.right,
        top: V - D.height / 2
      };
    }
    function F(m, R, D, N) {
      return m.top >= Ne && m.left >= Ne && m.top + R.height <= N - Ne && m.left + R.width <= D - Ne;
    }
    function L() {
      const m = x.value;
      if (!o.anchor || !m) return;
      const R = l(o.anchor), D = m.getBoundingClientRect(), N = window.innerWidth, V = window.innerHeight, y = o.side ?? "top", P = [
        y,
        k[y],
        ...S[y]
      ].find((W) => F(z(W, R, D), D, N, V)) ?? y;
      d.value = P, w.value = z(P, R, D);
    }
    me(
      [() => o.anchor, t],
      async ([m, R]) => {
        !m || !R || (await ut(), L());
      },
      { deep: !0, immediate: !0 }
    );
    const O = () => {
      o.anchor && t.value && L();
    };
    return ae(() => {
      window.addEventListener("resize", O), window.addEventListener("scroll", O, !0);
    }), ie(() => {
      window.removeEventListener("resize", O), window.removeEventListener("scroll", O, !0);
    }), (m, R) => e.anchor ? (g(), $(Xe, {
      key: 0,
      to: "body"
    }, [
      t.value ? (g(), C("div", {
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
              default: M(() => [
                U(r).content ? X(m.$slots, "content", { key: 0 }) : (g(), C(_, { key: 1 }, [
                  xe(oe(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          T("div", Pn, [
            T("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: Y({ transform: h.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : q("", !0)
    ])) : (g(), C("div", Dn, [
      X(m.$slots, "default"),
      t.value ? (g(), C("div", {
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
              default: M(() => [
                U(r).content ? X(m.$slots, "content", { key: 0 }) : (g(), C(_, { key: 1 }, [
                  xe(oe(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          T("div", _n, [
            T("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: Y({ transform: h.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : q("", !0)
    ]));
  }
}), Vn = /* @__PURE__ */ H({
  __name: "BaseDropdown",
  props: {
    matchTriggerWidth: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = B(!1), l = B(null), o = B(null), r = B(null), s = () => {
      const f = o.value, c = r.value;
      if (!f || !c) return;
      const h = f.getBoundingClientRect(), b = window.innerHeight, x = c.offsetHeight;
      let w = h.bottom + window.scrollY;
      const k = h.left + window.scrollX;
      h.bottom + x > b && (w = h.top + window.scrollY - x), l.value = {
        top: w,
        left: k,
        width: t.matchTriggerWidth ? h.width : void 0
      };
    };
    me(n, async (f) => {
      f && (await ut(), s());
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
    return (f, c) => (g(), C(_, null, [
      T("div", {
        ref_key: "triggerRef",
        ref: o,
        style: { display: "inline-block" },
        onClick: Ue(u, ["stop"])
      }, [
        X(f.$slots, "trigger")
      ], 512),
      (g(), $(Xe, { to: "body" }, [
        n.value ? (g(), C("div", {
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
}), rn = [
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
], Un = [8, 10, 12, 16, 18, 24], an = "Standard", Wn = {
  BoldItalic: ["BoldItalic", "Bold", "Italic", "Regular"],
  Bold: ["Bold", "Regular"],
  Italic: ["Italic", "Regular"],
  Regular: ["Regular"]
};
function It(e, t) {
  return rn.filter((n) => n.fontName === e && n.style === t).map((n) => n.size);
}
function Yn(e, t, n) {
  const l = rn.some((r) => r.fontName === e) ? e : an, o = Wn[t] ?? ["Regular"];
  for (const r of o)
    if (It(l, r).includes(n))
      return { fontName: l, style: r, size: n };
  for (const r of o) {
    const s = It(l, r);
    if (s.length > 0)
      return { fontName: l, style: r, size: cn(n, s) };
  }
  return { fontName: l, style: "Regular", size: n };
}
function sn(e) {
  const { style: t, size: n } = e.shorthand ? Gn(e.shorthand) : {
    style: Xn(e.isBold, e.isItalic),
    size: cn(e.fontSize ?? 12, Un)
  }, { fontName: l, style: o, size: r } = Yn(e.fontName ?? an, t, n), s = {
    fontFamily: `${l}-${o}-${r}, ${l}-${o}-${r}-TofuMaker, Arial, sans`,
    fontSize: `${r * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (s.textShadow = `2px 2px 0 ${e.fontShadowColor}`), s;
}
function Xn(e, t) {
  return e && t ? "BoldItalic" : e ? "Bold" : t ? "Italic" : "Regular";
}
function Gn(e) {
  const t = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!t)
    throw new Error(`Invalid shorthand format: ${e}`);
  const n = t[1], l = parseInt(t[2], 10);
  return { style: n, size: l };
}
function cn(e, t) {
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
function Se(e) {
  const t = window.getSelection();
  if (!t || t.rangeCount === 0 || !t.isCollapsed)
    return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.startContainer))
    return null;
  const l = document.createRange();
  return l.selectNodeContents(e), l.setEnd(n.startContainer, n.startOffset), ne(l.cloneContents()).length;
}
function un(e, t) {
  if (e instanceof Text) {
    const o = e.nodeValue?.length ?? 0;
    return t <= o ? { node: e, offset: t, remaining: 0 } : { node: e, offset: o, remaining: t - o };
  }
  if (e instanceof Element) {
    const o = e.getAttribute("data-win55-emoji");
    if (o)
      return t <= 0 ? { node: e.parentNode ?? e, offset: et(e), remaining: 0 } : t <= o.length ? { node: e.parentNode ?? e, offset: et(e) + 1, remaining: 0 } : {
        node: e.parentNode ?? e,
        offset: et(e) + 1,
        remaining: t - o.length
      };
  }
  let n = t, l = {
    offset: e.childNodes.length,
    remaining: n
  };
  for (const o of Array.from(e.childNodes)) {
    const r = un(o, n);
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
function et(e) {
  return e.parentNode ? Array.prototype.indexOf.call(e.parentNode.childNodes, e) : 0;
}
function Me(e, t, n = !1) {
  if (t === null || !e.isConnected)
    return;
  const l = un(e, t);
  if (!l)
    return;
  const o = document.createRange(), r = window.getSelection();
  n && e.focus({ preventScroll: !0 }), o.setStart(l.node, l.offset), o.collapse(!0), r?.removeAllRanges(), r?.addRange(o);
}
const dn = "/win-55-ui/emoji", tt = `${dn}/emoji-registry.csv`, Te = [
  "[\\u{1F1E6}-\\u{1F1FF}]{2}",
  "[0-9#*]\\uFE0F?\\u20E3",
  "\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?)*",
  "\\p{Emoji_Presentation}"
].join("|");
let Oe = null, it = null, Pe = null;
function Kn(e) {
  return e.replace(/\/$/, "");
}
function fn(e) {
  return e.trim().replace(/\.gif$/i, "");
}
function qn(e) {
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
    const a = r.slice(0, s).trim(), d = fn(r.slice(s + 1));
    a && d && (t[a] = d);
  }
  return t;
}
async function he(e = {}) {
  const t = e.registryUrl ?? tt;
  return Pe && t === tt ? Pe : ((!Oe || it !== t) && (it = t, Oe = fetch(t).then((n) => {
    if (!n.ok)
      throw new Error(
        `Could not load emoji registry from ${t}: ${n.status} ${n.statusText}`
      );
    return n.text();
  }).then(qn).then((n) => (t === tt && (Pe = n), n))), Oe);
}
function Hl() {
  Oe = null, it = null, Pe = null;
}
async function Jn(e, t = {}) {
  const l = (await he(t))[e];
  return l ? re(l, t) : null;
}
function re(e, t = {}) {
  return `${Kn(t.basePath ?? dn)}/${fn(e)}.gif`;
}
async function Vl(e = {}) {
  return he(e);
}
async function Ul(e, t = {}) {
  const n = await he(t);
  return e in n;
}
he();
function Qn(e) {
  return e.map((t) => {
    const n = parseInt(t.replace(/^#/, ""), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  });
}
function Zn(e, t, n, l) {
  let o = 1 / 0, r = [0, 0, 0];
  for (const s of l) {
    const a = e - s[0], d = t - s[1], u = n - s[2], f = a * a + d * d + u * u;
    f < o && (o = f, r = s);
  }
  return r;
}
function mn() {
  return typeof navigator < "u" && /firefox/i.test(navigator.userAgent);
}
const eo = "win55-emoji", to = "win55-emoji-image", Z = 15, st = 2, Nt = mn(), no = [
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
], oo = Qn(no), zt = Te, lo = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION"
]), pe = /* @__PURE__ */ new WeakMap(), At = /* @__PURE__ */ new WeakMap(), $t = /* @__PURE__ */ new Map();
function ro(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function ao(e) {
  const t = At.get(e);
  if (t)
    return t;
  const n = Object.keys(e).sort((r, s) => s.length - r.length).map(ro), l = n.length > 0 ? `${n.join("|")}|${zt}` : zt, o = new RegExp(l, "gu");
  return At.set(e, o), o;
}
function hn(e) {
  return e.value === !1 ? null : typeof e.value == "object" ? e.value : {};
}
const io = "data-win55-richtext";
function so(e) {
  return lo.has(e.tagName) || e.hasAttribute("data-win55-emoji");
}
function gn(e) {
  let t = e.parentElement;
  for (; t; ) {
    const n = pe.get(t);
    if (n && hn(n.binding))
      return !0;
    t = t.parentElement;
  }
  return !1;
}
function co(e, t) {
  const n = [], l = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, {
    acceptNode(o) {
      const r = o.parentElement;
      return !r || so(r) || t && r.closest(`[${io}]`) || !o.nodeValue?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  for (; l.nextNode(); )
    n.push(l.currentNode);
  return n;
}
function uo() {
  return `${Z * st}px`;
}
function fo(e, t, n, l, o) {
  const r = Math.min(1, Math.max(0, o)), s = e.getImageData(0, 0, t, n), a = s.data;
  for (let d = 0; d < a.length; d += 4) {
    const u = a[d], f = a[d + 1], c = a[d + 2];
    if (a[d + 3] < 80)
      a[d] = 0, a[d + 1] = 0, a[d + 2] = 0, a[d + 3] = 0;
    else {
      const [b, x, w] = Zn(
        u,
        f,
        c,
        l
      ), k = Math.round(u + (b - u) * r), S = Math.round(f + (x - f) * r), z = Math.round(c + (w - c) * r);
      a[d] = k, a[d + 1] = S, a[d + 2] = z, a[d + 3] = 255;
    }
  }
  e.putImageData(s, 0, 0);
}
function mo(e, t, n) {
  const l = e.getImageData(0, 0, t, n), o = new Uint8ClampedArray(l.data), r = l.data, s = (a, d) => (d * t + a) * 4;
  for (let a = 0; a < n; a++)
    for (let d = 0; d < t; d++) {
      const u = s(d, a), c = [
        d > 0 ? s(d - 1, a) : -1,
        d < t - 1 ? s(d + 1, a) : -1,
        a > 0 ? s(d, a - 1) : -1,
        a < n - 1 ? s(d, a + 1) : -1
      ].filter((h) => h !== -1).filter((h) => o[h + 3] > 127);
      if (o[u + 3] > 127 && c.length <= 1)
        r[u] = r[u + 1] = r[u + 2] = r[u + 3] = 0;
      else if (o[u + 3] === 0 && c.length >= 3) {
        const h = c[0];
        r[u] = o[h], r[u + 1] = o[h + 1], r[u + 2] = o[h + 2], r[u + 3] = 255;
      }
    }
  e.putImageData(l, 0, 0);
}
function ft(e) {
  const t = $t.get(e);
  if (t)
    return t;
  const n = ho(e);
  return $t.set(e, n), n;
}
function ho(e) {
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
    const u = n.measureText(e), f = u.actualBoundingBoxLeft + u.actualBoundingBoxRight, c = u.actualBoundingBoxAscent + u.actualBoundingBoxDescent, h = (Z - f) / 2 + u.actualBoundingBoxLeft, b = (Z - c) / 2 + u.actualBoundingBoxAscent;
    n.fillText(e, h, b - 0.5), fo(n, Z, Z, oo, 0.1), mo(n, Z, Z), bo(t);
  }
  return t.toDataURL("image/png");
}
function go(e, t, n) {
  const l = document.createElement("span"), o = document.createElement("img");
  return l.className = n.className ?? eo, l.contentEditable = "false", l.dataset.win55Emoji = e, l.role = "img", l.ariaLabel = e, l.style.setProperty("--win55-emoji-size", uo()), o.src = t, o.alt = e, o.className = to, o.draggable = !1, o.dataset.win55EmojiImg = "true", o.addEventListener("load", () => {
    const r = o.naturalWidth * st, s = o.naturalHeight * st;
    l.style.width = `${r}px`, l.style.height = `${s}px`, o.style.width = `${r}px`, o.style.height = `${s}px`;
  }, { once: !0 }), l.append(o), l;
}
function vo(e, t, n, l) {
  const o = e.parentElement;
  if (!o)
    return;
  const r = window.getSelection(), s = r && r.rangeCount > 0 && r.isCollapsed ? r.getRangeAt(0) : null, a = s?.startContainer === e, d = !!(s && s.startContainer === o && s.startOffset === Array.prototype.indexOf.call(o.childNodes, e) + 1), u = a || d, f = d ? e.nodeValue?.length ?? 0 : a ? s?.startOffset ?? null : null, c = e.nodeValue ?? "";
  let h = 0, b = !1;
  const x = document.createDocumentFragment();
  let w = null, k = 0;
  const S = (F, L) => {
    w || (w = F, k = L);
  };
  t.lastIndex = 0;
  for (const F of c.matchAll(t)) {
    const L = F[0], O = F.index, m = n[L];
    if (O === void 0)
      continue;
    const R = m ? re(m, l) : ft(L);
    if (!R)
      continue;
    b = !0;
    const D = c.slice(h, O);
    if (Nt || D.length > 0) {
      const V = document.createTextNode(D);
      f !== null && f >= h && f <= O && S(V, f - h), x.append(V);
    } else f !== null && f >= h && f <= O && S(o, Array.prototype.indexOf.call(o.childNodes, e) + x.childNodes.length);
    const N = go(L, R, l);
    x.append(N), f !== null && f > O && f <= O + L.length && S(o, Array.prototype.indexOf.call(o.childNodes, e) + x.childNodes.length), h = O + L.length;
  }
  if (!b)
    return;
  const z = c.slice(h);
  if (Nt || z.length > 0) {
    const F = document.createTextNode(z);
    f !== null && f >= h && S(F, f - h), x.append(F);
  } else f !== null && f >= h && S(o, Array.prototype.indexOf.call(o.childNodes, e) + x.childNodes.length);
  if (e.replaceWith(x), u && w) {
    const F = document.createRange();
    F.setStart(w, k), F.collapse(!0), r?.removeAllRanges(), r?.addRange(F);
  }
}
function vn(e, t, n, l) {
  const o = ao(t);
  if (o)
    for (const r of co(e, l))
      vo(r, o, t, n);
}
const nt = /* @__PURE__ */ new WeakMap();
async function ot(e, t = {}) {
  const n = (nt.get(e) ?? 0) + 1;
  nt.set(e, n);
  const l = await he(t);
  nt.get(e) !== n || !e.isConnected || vn(e, l, t, !1);
}
async function po(e, t) {
  const n = hn(t.binding);
  if (!n)
    return;
  t.version += 1;
  const l = t.version, o = await he(n);
  pe.get(e)?.version !== l || !e.isConnected || gn(e) || vn(e, o, n, !0);
}
function ct(e, t) {
  t.renderQueued || (t.renderQueued = !0, t.renderFrame = window.requestAnimationFrame(() => {
    t.renderQueued = !1, t.renderFrame = null, po(e, t).catch((n) => {
      console.warn("[win-55-ui] Could not render custom emoji.", n);
    });
  }));
}
function yo(e, t) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !t.clipboardData || gn(e))
    return;
  const l = n.getRangeAt(0);
  if (!l.intersectsNode(e))
    return;
  const o = l.cloneContents(), r = ne(o);
  r && (t.clipboardData.setData("text/plain", r), t.preventDefault());
}
function wo(e, t) {
  const n = new MutationObserver(() => {
    ct(e, t);
  });
  return n.observe(e, {
    characterData: !0,
    childList: !0,
    subtree: !0
  }), n;
}
const xo = {
  mounted(e, t) {
    const n = {
      binding: t,
      copyHandler: (l) => yo(e, l),
      observer: null,
      renderFrame: null,
      renderQueued: !1,
      version: 0
    };
    n.observer = wo(e, n), pe.set(e, n), e.addEventListener("copy", n.copyHandler), ct(e, n);
  },
  updated(e, t) {
    const n = pe.get(e);
    n && (n.binding = t, ct(e, n));
  },
  unmounted(e) {
    const t = pe.get(e);
    t && (t.observer?.disconnect(), t.renderFrame !== null && window.cancelAnimationFrame(t.renderFrame), e.removeEventListener("copy", t.copyHandler)), pe.delete(e);
  }
};
function bo(e) {
  const t = e.getContext("2d");
  if (!t) {
    console.warn("Unable to get 2D context from canvas");
    return;
  }
  const n = e.width, l = e.height, o = t.getImageData(0, 0, n, l), r = o.data, s = (c, h) => c < 0 || h < 0 || c >= n || h >= l ? 0 : r[(h * n + c) * 4 + 3], a = Array.from({ length: l }, () => Array(n).fill(!1)), d = [];
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
    const { x: c, y: h } = d.shift();
    for (const [b, x] of u) {
      const w = c + b, k = h + x;
      w >= 0 && w < n && k >= 0 && k < l && !a[k][w] && s(w, k) === 0 && (a[k][w] = !0, d.push({ x: w, y: k }));
    }
  }
  const f = Array.from({ length: l }, () => Array(n).fill(!1));
  for (let c = 0; c < l; c++)
    for (let h = 0; h < n; h++) {
      if (s(h, c) === 0) continue;
      let b = !1;
      for (const [x, w] of u) {
        const k = h + x, S = c + w;
        if (k < 0 || S < 0 || k >= n || S >= l) {
          b = !0;
          break;
        }
        if (s(k, S) === 0 && a[S][k]) {
          b = !0;
          break;
        }
      }
      b && (f[c][h] = !0);
    }
  for (let c = 0; c < l; c++)
    for (let h = 0; h < n; h++)
      if (f[c][h]) {
        const b = (c * n + h) * 4;
        r[b] = 0, r[b + 1] = 0, r[b + 2] = 0;
      }
  t.putImageData(o, 0, 0);
}
const Wl = xo, Lt = typeof Intl.Segmenter == "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function pn(e) {
  return Lt ? Array.from(Lt.segment(e), (t) => t.segment) : Array.from(e);
}
function Ft(e) {
  return pn(e).length;
}
function Eo(e, t) {
  return pn(e).slice(0, t).join("");
}
function Co(e) {
  const t = window.getSelection();
  if (!t || t.rangeCount === 0 || !t.isCollapsed)
    return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.startContainer))
    return null;
  const l = Se(e), o = n.cloneRange();
  o.collapse(!0);
  const r = document.createElement("span");
  r.textContent = "​", o.insertNode(r);
  const s = r.getBoundingClientRect(), a = r.parentNode;
  return r.remove(), a?.normalize(), Me(e, l), s;
}
const Mt = "/win-55-ui/emoji/emoji-categories.json";
let lt = null;
async function mt() {
  return lt || (lt = fetch(Mt).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${Mt}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), lt;
}
async function ko(e) {
  const t = e.trim().toLowerCase();
  if (!t)
    return [];
  const n = await mt(), l = [], o = /* @__PURE__ */ new Set();
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
async function yn(e) {
  const t = e.trim().toLowerCase();
  if (!t)
    return;
  const l = (await mt()).find((o) => o.shortcodes.some((r) => r.toLowerCase() === t));
  return l ? { emoji: l.emoji, code: l.code } : void 0;
}
const we = B(!1), se = B({ x: 160, y: 120, width: 360, height: 420 }), ht = Ln(null);
function Ot(e) {
  ht.value = e;
}
function So() {
  we.value = !0;
}
function Pt() {
  we.value = !1;
}
function Ro(e) {
  ht.value?.insertEmoji(e);
}
let Dt = 0;
function To(e) {
  const t = e[Dt % e.length];
  return Dt += 1, t;
}
const Bo = {
  key: 0,
  class: "baseinput-emoji-wrapper"
}, jo = ["src"], Io = { class: "shortcode-suggestions" }, No = {
  key: 0,
  class: "shortcode-suggestion-ellipsis"
}, zo = ["src"], Ao = {
  key: 1,
  class: "shortcode-suggestion-ellipsis"
}, $o = "546", ze = 5, Lo = 200, Yl = /* @__PURE__ */ H({
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
        const v = document.activeElement === a.value, p = v ? Se(a.value) : null;
        a.value.innerText = i ?? "", v && Me(a.value, p);
      }
    });
    const d = () => {
      if (!a.value) return;
      let i = ne(a.value);
      if (o.multiline || (i = i.replace(/\n/g, "")), o.maxLength && Ft(i) > o.maxLength) {
        i = Eo(i, o.maxLength), a.value.innerText = i;
        const v = document.createRange(), p = window.getSelection();
        v.selectNodeContents(a.value), v.collapse(!1), p?.removeAllRanges(), p?.addRange(v);
      }
      kn(), r("update:modelValue", i), Cn();
    }, u = /:([A-Za-z0-9_+-]*)$/, f = /:([A-Za-z0-9_+-]{2,}):$/, c = B(!1), h = B(null), b = B([]), x = B(0), w = B(null);
    let k = 0;
    const S = B(0);
    function z(i) {
      i < S.value ? S.value = i : i > S.value + ze - 1 && (S.value = i - ze + 1);
    }
    const F = j(() => {
      const i = S.value;
      return b.value.slice(i, i + ze).map((v, p) => ({ match: v, index: i + p }));
    }), L = j(() => S.value > 0), O = j(() => S.value + ze < b.value.length), m = () => {
      c.value = !1, h.value = null, b.value = [], x.value = 0, S.value = 0;
    }, R = (i, v) => {
      if (!a.value) return;
      const p = window.getSelection();
      if (!p || p.rangeCount === 0 || !p.isCollapsed) return;
      const E = p.getRangeAt(0), A = E.startContainer;
      if (!(A instanceof Text) || !a.value.contains(A)) return;
      const G = E.startOffset, Q = G - i;
      if (Q < 0) return;
      const le = A.nodeValue ?? "";
      Ie(), A.nodeValue = le.slice(0, Q) + v + le.slice(G), de(A, Q + v.length), ve(), d(), ot(a.value);
    }, D = () => {
      const i = b.value[x.value];
      !i || h.value === null || (R(1 + h.value.length, i.emoji), m());
    }, N = B(null), y = { insertEmoji: (i) => {
      if (!a.value) return;
      const E = (document.activeElement === a.value ? Se(a.value) : null) ?? N.value ?? Ft(ne(a.value));
      Me(a.value, E, !0);
      const A = window.getSelection();
      if (!A || A.rangeCount === 0 || !A.isCollapsed) return;
      const G = A.getRangeAt(0);
      Ie(), G.deleteContents();
      const Q = document.createTextNode(i);
      G.insertNode(Q), de(Q, Q.length), ve(), d(), ot(a.value);
    } }, I = B(!1), P = j(() => we.value && ht.value === y), W = j(() => o.showEmojiButton && (I.value || P.value)), ue = B(l[0]), te = j(() => P.value ? $o : ue.value), je = () => {
      ue.value = To(l);
    };
    me(W, (i) => {
      i && je();
    });
    const be = () => {
      I.value = !0, Ot(y);
    }, Ge = () => {
      Ot(y), So();
    }, Cn = async () => {
      if (!a.value) {
        m();
        return;
      }
      const i = window.getSelection();
      if (!i || i.rangeCount === 0 || !i.isCollapsed) {
        m();
        return;
      }
      const v = i.getRangeAt(0), p = v.startContainer;
      if (!(p instanceof Text) || !a.value.contains(p)) {
        m();
        return;
      }
      const E = (p.nodeValue ?? "").slice(0, v.startOffset), A = c.value ? h.value : null, G = f.exec(E);
      if (G) {
        if (A === G[1]) {
          const jt = await yn(G[1]);
          jt && R(G[0].length, jt.emoji);
        }
        m();
        return;
      }
      const le = u.exec(E)?.[1] ?? null;
      if (le === null || le.length < 2) {
        m();
        return;
      }
      const Ce = Co(a.value);
      if (!Ce) {
        m();
        return;
      }
      const Tt = ++k, Bt = await ko(le);
      if (Tt !== k || Bt.length === 0) {
        Tt === k && m();
        return;
      }
      h.value = le, b.value = Bt, x.value = 0, S.value = 0, w.value = { top: Ce.top, bottom: Ce.bottom, left: Ce.left, right: Ce.right }, c.value = !0;
    }, Ke = [], qe = [];
    let Ee = null, ge = null;
    const Je = () => a.value ? { html: a.value.innerHTML, caret: Se(a.value) } : null, pt = (i) => {
      a.value && (a.value.innerHTML = i.html, Me(a.value, i.caret, !0), d());
    }, Ie = () => {
      Ee || (Ee = Je()), qe.length = 0;
    }, ve = () => {
      ge !== null && (clearTimeout(ge), ge = null), Ee && (Ke.push(Ee), Ee = null);
    }, kn = () => {
      ge !== null && clearTimeout(ge), ge = setTimeout(ve, Lo);
    }, Sn = () => {
      ve();
      const i = Ke.pop();
      if (!i) return;
      const v = Je();
      v && qe.push(v), pt(i);
    }, Rn = () => {
      const i = qe.pop();
      if (!i) return;
      const v = Je();
      v && Ke.push(v), pt(i);
    }, de = (i, v) => {
      const p = document.createRange(), E = window.getSelection();
      a.value?.focus({ preventScroll: !0 }), p.setStart(i, v), p.collapse(!0), E?.removeAllRanges(), E?.addRange(p);
    }, Tn = (i) => i instanceof Text ? i.nodeValue?.length ?? 0 : i.childNodes.length, fe = (i) => i.parentNode ? Array.prototype.indexOf.call(i.parentNode.childNodes, i) : 0, Qe = (i, v) => i instanceof Text ? v > 0 ? null : i.previousSibling ?? (i.parentNode && i.parentNode !== a.value ? Qe(i.parentNode, fe(i.parentNode)) : null) : i.childNodes[v - 1] ?? (i.parentNode && i !== a.value ? Qe(i.parentNode, fe(i)) : null), Ze = (i, v) => i instanceof Text ? v < (i.nodeValue?.length ?? 0) ? null : i.nextSibling ?? (i.parentNode && i.parentNode !== a.value ? Ze(i.parentNode, fe(i.parentNode) + 1) : null) : i.childNodes[v] ?? (i.parentNode && i !== a.value ? Ze(i.parentNode, fe(i) + 1) : null), Bn = (i, v) => {
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
    }, yt = (i) => {
      if (i.cloneContents().querySelector?.("[data-win55-emoji]"))
        return !0;
      const p = i.startContainer instanceof Element ? i.startContainer : i.startContainer.parentElement, E = i.endContainer instanceof Element ? i.endContainer : i.endContainer.parentElement;
      return !!(p?.closest("[data-win55-emoji]") || E?.closest("[data-win55-emoji]"));
    }, wt = (i) => {
      if (!a.value) return;
      const v = i.startContainer, p = i.startOffset;
      i.deleteContents(), v.isConnected && a.value.contains(v) ? de(v, Math.min(p, Tn(v))) : de(a.value, a.value.childNodes.length), d();
    }, jn = (i) => {
      const v = document.createRange();
      return v.setStart(i.startContainer, i.startOffset), v.setEnd(i.endContainer, i.endOffset), v;
    }, In = (i) => i instanceof HTMLElement && i.hasAttribute("data-win55-emoji"), Nn = (i, v, p) => {
      if (!a.value || i.collapsed || i.startContainer !== i.endContainer || !(i.startContainer instanceof Text))
        return !1;
      const E = i.startContainer, A = E.nodeValue?.length ?? 0;
      if (i.startOffset !== 0 || i.endOffset !== A)
        return !1;
      const G = v === "backward" ? E.previousSibling : E.nextSibling;
      if (!In(G) || !E.parentNode)
        return !1;
      p();
      const Q = E.parentNode, le = fe(E);
      return E.remove(), de(Q, le), d(), !0;
    }, xt = (i, v, p) => {
      const E = p === "backward" ? Qe(i, v) : Ze(i, v);
      return Bn(E, p);
    }, bt = (i, v, p, E) => {
      const A = xt(i, v, p);
      if (!A || !A.parentNode)
        return !1;
      E();
      const G = A.parentNode, Q = fe(A);
      return A.remove(), de(G, Q), d(), !0;
    }, zn = (i, v, p) => {
      if (!a.value || !a.value.contains(i.startContainer))
        return "none";
      const E = jn(i);
      return E.collapsed ? bt(
        i.startContainer,
        i.startOffset,
        v,
        p
      ) ? "deleted" : "none" : yt(E) ? (p(), wt(E), "deleted") : Nn(E, v, p) ? "deleted" : ne(E.cloneContents()) ? "native" : "none";
    }, An = (i, v) => {
      if (!a.value) return !1;
      const p = window.getSelection();
      if (!p || p.rangeCount === 0)
        return !1;
      const E = p.getRangeAt(0);
      return a.value.contains(E.startContainer) ? p.isCollapsed ? bt(
        E.startContainer,
        E.startOffset,
        i,
        v
      ) : yt(E) ? (v(), wt(E), !0) : !1 : !1;
    }, $n = (i) => {
      if (!mn() || i.shiftKey || i.ctrlKey || i.metaKey || i.altKey || i.key !== "ArrowLeft" && i.key !== "ArrowRight" || !a.value) return !1;
      const v = window.getSelection();
      if (!v || v.rangeCount === 0 || !v.isCollapsed) return !1;
      const p = v.getRangeAt(0);
      if (!a.value.contains(p.startContainer)) return !1;
      const E = i.key === "ArrowLeft" ? "backward" : "forward", A = xt(p.startContainer, p.startOffset, E);
      return !A || !A.parentNode ? !1 : (i.preventDefault(), de(A.parentNode, fe(A) + (E === "forward" ? 1 : 0)), !0);
    }, Et = (i) => {
      if (c.value) {
        if (i.key === "ArrowDown") {
          i.preventDefault(), x.value = (x.value + 1) % b.value.length, z(x.value);
          return;
        }
        if (i.key === "ArrowUp") {
          i.preventDefault(), x.value = (x.value - 1 + b.value.length) % b.value.length, z(x.value);
          return;
        }
        if (i.key === "Tab" || i.key === " " || i.key === "Enter") {
          i.preventDefault(), D();
          return;
        }
        if (i.key === "Escape") {
          i.preventDefault(), m();
          return;
        }
      }
      !o.multiline && i.key === "Enter" && i.preventDefault(), i.key === "Tab" && i.preventDefault(), $n(i);
    }, Ct = (i) => {
      if (!a.value) return;
      if (i.inputType === "historyUndo" || i.inputType === "historyRedo") {
        i.preventDefault(), i.inputType === "historyUndo" ? Sn() : Rn();
        return;
      }
      if (Ie(), i.inputType !== "deleteContentBackward" && i.inputType !== "deleteContentForward")
        return;
      if (ne(a.value) === "") {
        i.preventDefault(), a.value.focus({ preventScroll: !0 });
        return;
      }
      const v = i.inputType === "deleteContentBackward" ? "backward" : "forward", p = i.getTargetRanges();
      for (const E of p) {
        const A = zn(
          E,
          v,
          () => i.preventDefault()
        );
        if (A === "deleted") {
          a.value.focus({ preventScroll: !0 });
          return;
        }
        if (A === "native")
          return;
      }
      An(v, () => i.preventDefault()) && a.value.focus({ preventScroll: !0 });
    }, kt = (i) => {
      i.preventDefault();
      let v = i.clipboardData?.getData("text/plain") ?? "";
      if (o.multiline || (v = v.replace(/\n/g, " ")), !a.value) return;
      Ie();
      const p = window.getSelection(), E = p?.getRangeAt(0);
      if (E) {
        E.deleteContents();
        const A = document.createTextNode(v);
        E.insertNode(A), E.collapse(!1), p?.removeAllRanges(), p?.addRange(E);
      }
      d(), ve(), ot(a.value);
    }, St = () => {
      ve(), m(), I.value = !1, a.value && (N.value = Se(a.value)), a.value && ne(a.value) === "" && (a.value.innerHTML = "");
    }, Rt = j(() => ({
      ...o.extraStyles,
      ...sn({ fontColor: "black" }),
      overflow: "auto",
      ...o.showEmojiButton ? { paddingRight: "34px" } : {}
    }));
    return t({ el: a }), (i, v) => (g(), C(_, null, [
      e.showEmojiButton ? (g(), C("div", Bo, [
        K(ee, {
          ref_key: "boxRef",
          ref: s,
          type: e.boxType,
          contenteditable: !e.disabled,
          "extra-styles": Rt.value,
          "data-placeholder": e.placeholder,
          role: "textbox",
          "aria-multiline": e.multiline,
          "aria-disabled": e.disabled,
          onInput: d,
          onKeydown: Et,
          onBeforeinput: Ct,
          onPaste: kt,
          onFocus: be,
          onBlur: St
        }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"]),
        W.value ? (g(), C("img", {
          key: 0,
          src: U(re)(te.value),
          width: "30",
          height: "30",
          class: "baseinput-emoji-button",
          "data-emoji-picker-trigger": "",
          onMousedown: v[0] || (v[0] = Ue(() => {
          }, ["prevent"])),
          onClick: Ue(Ge, ["stop"])
        }, null, 40, jo)) : q("", !0)
      ])) : (g(), $(ee, {
        key: 1,
        ref_key: "boxRef",
        ref: s,
        type: e.boxType,
        contenteditable: !e.disabled,
        "extra-styles": Rt.value,
        "data-placeholder": e.placeholder,
        role: "textbox",
        "aria-multiline": e.multiline,
        "aria-disabled": e.disabled,
        onInput: d,
        onKeydown: Et,
        onBeforeinput: Ct,
        onPaste: kt,
        onFocus: be,
        onBlur: St
      }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"])),
      c.value && w.value ? (g(), $(Hn, {
        key: 2,
        shown: !0,
        anchor: w.value,
        side: "top"
      }, {
        content: M(() => [
          T("div", Io, [
            L.value ? (g(), C("div", No, "...")) : q("", !0),
            (g(!0), C(_, null, J(F.value, ({ match: p, index: E }) => (g(), C("div", {
              key: p.shortcode,
              class: Be(["shortcode-suggestion", { "shortcode-suggestion--selected": E === x.value }])
            }, [
              T("img", {
                src: U(re)(p.code),
                width: "30",
                height: "30",
                class: "shortcode-suggestion-image"
              }, null, 8, zo),
              T("span", null, ":" + oe(p.shortcode) + ":", 1)
            ], 2))), 128)),
            O.value ? (g(), C("div", Ao, "...")) : q("", !0)
          ])
        ]),
        _: 1
      }, 8, ["anchor"])) : q("", !0)
    ], 64));
  }
}), _t = "/win-55-ui/cursors/manifest.json", Ht = "/win-55-ui/cursors/scheme.json";
let De = null, _e = null;
async function wn() {
  return De || (De = fetch(_t).then((e) => {
    if (!e.ok)
      throw new Error(`Could not load cursor manifest from ${_t}: ${e.status} ${e.statusText}`);
    return e.json();
  })), De;
}
async function Fo() {
  return _e || (_e = fetch(Ht).then((e) => {
    if (!e.ok)
      throw new Error(`Could not load cursor scheme index from ${Ht}: ${e.status} ${e.statusText}`);
    return e.json();
  })), _e;
}
function Xl() {
  De = null, _e = null;
}
const Vt = 2, Ut = "windows-default";
function Wt(e, t, n, l) {
  const o = e[n]?.roles[l];
  if (!o) return;
  const r = t[o];
  if (!(!r || r.hotspotX === null || r.hotspotY === null))
    return o;
}
async function We(e, t) {
  const [n, l] = await Promise.all([Fo(), wn()]);
  return Wt(n, l, e, t) ?? (e === Ut ? void 0 : Wt(n, l, Ut, t));
}
const xn = /* @__PURE__ */ Symbol("win55ui:cursor-context"), ce = "--win55-cursor", He = "--win55-scheme", Re = "--win55-cursor-native", bn = B(!1);
function Yt(e) {
  bn.value = e;
}
function Mo() {
  return bn.value;
}
function Oo(e) {
  Mn(xn, e);
}
function Po() {
  return Fn(xn, void 0);
}
const gt = "__win55CursorContext";
function Do(e, t) {
  e[gt] = t;
}
function _o(e) {
  delete e[gt];
}
let Ye;
function Ho(e) {
  Ye = e;
}
function Vo(e) {
  Ye === e && (Ye = void 0);
}
function Uo(e) {
  let t = e;
  for (; t; ) {
    const n = t[gt];
    if (n) return n;
    t = t.parentElement;
  }
  return Ye;
}
async function Wo(e, t, n) {
  if (!t) {
    e.style.removeProperty("cursor"), e.style.removeProperty(ce);
    return;
  }
  const l = n ? await n.resolveRole(t) : await We("windows-default", t);
  if (!l) {
    e.style.removeProperty("cursor"), e.style.removeProperty(ce);
    return;
  }
  e.style.cursor = "none", e.style.setProperty(ce, l);
}
const Ae = /* @__PURE__ */ new WeakMap(), vt = {
  mounted(e, t) {
    const n = B(t.value);
    let l = () => {
    };
    Ae.set(e, { role: n, stop: () => l() }), ut(() => {
      const o = Uo(e);
      l = Fe(() => {
        Wo(e, n.value, o);
      });
    });
  },
  updated(e, t) {
    if (t.value === t.oldValue) return;
    const n = Ae.get(e);
    n && (n.role.value = t.value);
  },
  unmounted(e) {
    Ae.get(e)?.stop(), Ae.delete(e);
  }
}, Ve = /* @__PURE__ */ H({
  __name: "Button",
  props: {
    baseType: { default: "panel-d-1" },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: t }) {
    const n = vt, l = e, o = t, r = B(!1), s = B(!1), a = j(() => !l.disabled && r.value && s.value), d = j(() => l.disabled), u = (k) => {
      l.disabled || k.button !== 0 || (r.value = !0, s.value = !0);
    }, f = () => {
      l.disabled || (s.value = !0);
    }, c = () => {
      s.value = !1;
    }, h = (k) => {
      l.disabled || k.button !== 0 || (r.value && s.value && o("click"), r.value = !1);
    };
    ae(() => {
      window.addEventListener("mouseup", h);
    }), ie(() => {
      window.removeEventListener("mouseup", h);
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
    return (k, S) => dt((g(), $(ee, {
      type: w.value,
      "extra-styles": b.value,
      "extra-class": e.extraClass,
      onMousedown: u,
      onMouseenter: f,
      onMouseleave: c
    }, {
      default: M(() => [
        T("div", {
          style: Y(x.value)
        }, [
          X(k.$slots, "default")
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"])), [
      [U(n), d.value ? "not-allowed" : "default"]
    ]);
  }
}), Yo = { style: { display: "flex", "align-items": "center" } }, Xo = ["src", "alt"], Go = ["checked", "disabled", "value"], Ko = { key: 0 }, Gl = /* @__PURE__ */ H({
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
    const n = vt, l = e, o = t, r = () => {
      l.disabled || o("update:modelValue", !l.modelValue);
    };
    return (s, a) => dt((g(), C("div", {
      class: Be(["checkbox-container", { disabled: e.disabled }]),
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
      T("div", Yo, [
        T("img", {
          draggable: "false",
          src: e.modelValue ? e.checkedIcon : e.uncheckedIcon,
          alt: e.modelValue ? "checked" : "unchecked"
        }, null, 8, Xo)
      ]),
      T("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, Go),
      e.label ? (g(), C("span", Ko, oe(e.label), 1)) : q("", !0)
    ], 6)), [
      [U(n), e.disabled ? "not-allowed" : "link"]
    ]);
  }
}), Xt = 2, Gt = 120, qo = 'textarea, [contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"], input:not([type]), input[type="text" i], input[type="search" i], input[type="url" i], input[type="tel" i], input[type="email" i], input[type="password" i], input[type="number" i]', Jo = /* @__PURE__ */ H({
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
    const h = /* @__PURE__ */ new Map();
    function b(y) {
      return Math.round(y / Xt) * Xt;
    }
    function x() {
      const y = `translate(${b(u - s)}px, ${b(f - a)}px)`;
      n.value && (n.value.style.transform = y), l.value && (l.value.style.transform = y);
    }
    function w(y) {
      const I = n.value, P = l.value;
      if (!I && !P || y === d) return;
      d = y;
      const W = y ? "visible" : "hidden";
      I && (I.style.visibility = W), P && (P.style.visibility = W);
    }
    function k(y, I) {
      y && (I ? (y.src = I, y.style.display = "") : (y.style.display = "none", y.removeAttribute("src")));
    }
    function S(y) {
      if (y === r) {
        w(y !== "");
        return;
      }
      if (r = y, !y) {
        w(!1);
        return;
      }
      const I = o[y];
      k(n.value, I?.hasNormal ? `/win-55-ui/cursors/${y}/normal.gif` : void 0), k(l.value, I?.hasInvert ? `/win-55-ui/cursors/${y}/invert.gif` : void 0), s = (I?.hotspotX ?? 0) * Vt, a = (I?.hotspotY ?? 0) * Vt, w(!0), x();
    }
    function z(y) {
      const I = y.split(",").pop().trim().split(/\s+/)[0];
      return t[I] ?? "default";
    }
    function F(y) {
      for (let I = y; I; I = I.parentElement) {
        const P = I.style.cursor;
        if (P && P !== "none") return z(P);
      }
      return y.closest("a[href], area[href]") ? "link" : y.closest(qo) ? "text" : y.closest(":disabled") ? "not-allowed" : "default";
    }
    function L(y) {
      if (!y) return;
      const I = getComputedStyle(y), P = I.getPropertyValue(Re).trim();
      if (P && P !== "none" || y.closest('[data-win55-cursor="off"]')) {
        S("");
        return;
      }
      const W = I.getPropertyValue(ce).trim();
      if (W) {
        S(W);
        return;
      }
      const ue = I.getPropertyValue(He).trim() || "windows-default", te = F(y), je = `${ue} ${te}`, be = h.get(je);
      if (be !== void 0) {
        S(be);
        return;
      }
      We(ue, te).then((Ge) => {
        h.set(je, Ge ?? ""), L(document.elementFromPoint(u, f));
      });
    }
    function O(y) {
      u = y.clientX, f = y.clientY, r && x();
    }
    function m(y) {
      O(y);
    }
    function R(y) {
      y.target instanceof Element && (u = y.clientX, f = y.clientY, L(y.target));
    }
    function D(y) {
      y.relatedTarget === null && w(!1);
    }
    function N() {
      L(document.elementFromPoint(u, f));
    }
    function V() {
      document.hidden ? (c !== void 0 && (clearInterval(c), c = void 0), w(!1)) : (c === void 0 && (c = window.setInterval(N, Gt)), N());
    }
    return ae(async () => {
      window.addEventListener("pointermove", O, { passive: !0 }), "onpointerrawupdate" in window && window.addEventListener("pointerrawupdate", m, { passive: !0 }), document.addEventListener("pointerover", R, { passive: !0 }), document.addEventListener("pointerout", D, { passive: !0 }), document.addEventListener("visibilitychange", V), c = window.setInterval(N, Gt), o = await wn(), r = "", N();
    }), ie(() => {
      window.removeEventListener("pointermove", O), window.removeEventListener("pointerrawupdate", m), document.removeEventListener("pointerover", R), document.removeEventListener("pointerout", D), document.removeEventListener("visibilitychange", V), c !== void 0 && clearInterval(c);
    }), (y, I) => (g(), $(Xe, { to: "body" }, [
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
}), Kl = /* @__PURE__ */ H({
  __name: "CursorContext",
  props: {
    element: {},
    scheme: {},
    role: {},
    disabled: { type: Boolean },
    root: { type: Boolean },
    disableAll: { type: Boolean }
  },
  setup(e, { expose: t }) {
    const n = e, l = j(() => n.element ?? "span"), o = Po(), r = j(() => n.scheme ?? o?.scheme.value ?? "windows-default"), s = j(() => n.role ?? o?.role.value), a = j(() => Mo() || (n.disabled ?? o?.disabled.value ?? !1)), d = j(() => a.value ? "auto" : n.disabled === !1 ? "none" : void 0), u = at(/* @__PURE__ */ new Set()), f = at(/* @__PURE__ */ new Set());
    function c(m) {
      u.add(m), m.finally(() => u.delete(m));
    }
    function h(m) {
      f.add(m), m.finally(() => f.delete(m));
    }
    const b = j(() => u.size > 0 || o?.hasBusy.value === !0), x = j(() => f.size > 0 || o?.hasProgress.value === !0);
    function w(m) {
      return m !== void 0 && m !== "default" ? m : b.value ? "wait" : x.value ? "progress" : m;
    }
    function k(m) {
      return We(r.value, w(m) ?? "default");
    }
    const S = {
      scheme: r,
      role: s,
      disabled: a,
      hasBusy: b,
      hasProgress: x,
      resolveRole: k,
      addBusy: c,
      addProgress: h
    };
    Oo(S), t({ addBusy: c, addProgress: h, resolveRole: k });
    const z = B();
    ae(() => {
      z.value && Do(z.value, S), n.root && Ho(S);
    }), ie(() => {
      if (z.value && _o(z.value), !n.root) return;
      Vo(S), Yt(!1);
      const m = document.documentElement;
      m.style.cursor = "", m.style.removeProperty(ce), m.style.removeProperty(He), m.style.removeProperty(Re);
    });
    const F = j(() => w(s.value)), L = B();
    Fe(() => {
      const m = F.value;
      if (!m) {
        L.value = void 0;
        return;
      }
      We(r.value, m).then((R) => {
        L.value = R;
      });
    });
    const O = j(() => {
      const m = {};
      if (n.element || (m.display = "contents"), !n.root) {
        const R = m;
        R.cursor = "none", n.scheme && (R[He] = r.value), L.value && (R[ce] = L.value), d.value && (R[Re] = d.value);
      }
      return m;
    });
    return n.root && Fe(() => Yt(n.disableAll === !0)), Fe(() => {
      if (!n.root) return;
      const m = document.documentElement;
      m.style.cursor = "none", m.style.setProperty(He, r.value), L.value ? m.style.setProperty(ce, L.value) : m.style.removeProperty(ce), d.value ? m.style.setProperty(Re, d.value) : m.style.removeProperty(Re);
    }), (m, R) => (g(), C(_, null, [
      (g(), $(ln(l.value), {
        style: Y(O.value),
        ref_key: "rootEl",
        ref: z
      }, {
        default: M(() => [
          X(m.$slots, "default")
        ]),
        _: 3
      }, 8, ["style"])),
      e.root ? (g(), $(Jo, { key: 0 })) : q("", !0)
    ], 64));
  }
}), Qo = /* @__PURE__ */ H({
  __name: "HDivider",
  setup(e) {
    return (t, n) => (g(), $(ee, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), ql = /* @__PURE__ */ H({
  __name: "MenuDropdown",
  setup(e) {
    return (t, n) => (g(), $(Vn, null, {
      trigger: M(() => [
        X(t.$slots, "trigger")
      ]),
      items: M(() => [
        K(ee, { type: "panel-d-1" }, {
          default: M(() => [
            X(t.$slots, "items")
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), Zo = { style: { display: "flex", "align-items": "center" } }, el = ["src"], tl = ["src"], nl = ["checked", "disabled", "value", "name"], ol = { key: 0 }, Jl = /* @__PURE__ */ H({
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
    const n = vt, l = e, o = t, r = j(() => l.modelValue === l.value), s = (a) => {
      a.preventDefault(), !l.disabled && (r.value || o("update:modelValue", l.value));
    };
    return (a, d) => dt((g(), C("div", {
      class: Be(["radio-container", { disabled: e.disabled }]),
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
      T("div", Zo, [
        r.value ? (g(), C("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, el)) : (g(), C("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, tl))
      ]),
      T("input", {
        type: "radio",
        checked: r.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, nl),
      e.label ? (g(), C("span", ol, oe(e.label), 1)) : q("", !0)
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
      const o = sn(t);
      return t.element || (o.display = "contents"), o;
    });
    return (o, r) => (g(), $(ln(n.value), {
      style: Y(l.value)
    }, {
      default: M(() => [
        X(o.$slots, "default")
      ]),
      _: 3
    }, 8, ["style"]));
  }
}), ll = { key: 1 }, rl = {
  key: 4,
  style: { "text-decoration": "underline" }
}, al = {
  key: 5,
  style: { "text-decoration": "line-through" }
}, il = ["href"], sl = ["aria-label", "data-win55-emoji"], cl = ["src", "alt"], ul = /* @__PURE__ */ H({
  __name: "RichTextNode",
  props: {
    node: {},
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    function t(n, l) {
      return n ? re(n) : ft(l);
    }
    return (n, l) => {
      const o = On("RichTextNode", !0);
      return e.node.type === "text" ? (g(), C(_, { key: 0 }, [
        xe(oe(e.node.value), 1)
      ], 64)) : e.node.type === "break" ? (g(), C("br", ll)) : e.node.type === "bold" ? (g(), $(ye, {
        key: 2,
        "is-bold": ""
      }, {
        default: M(() => [
          (g(!0), C(_, null, J(e.node.children, (r, s) => (g(), $(o, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "italic" ? (g(), $(ye, {
        key: 3,
        "is-italic": ""
      }, {
        default: M(() => [
          (g(!0), C(_, null, J(e.node.children, (r, s) => (g(), $(o, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "underline" ? (g(), C("span", rl, [
        (g(!0), C(_, null, J(e.node.children, (r, s) => (g(), $(o, {
          key: s,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "strike" ? (g(), C("span", al, [
        (g(!0), C(_, null, J(e.node.children, (r, s) => (g(), $(o, {
          key: s,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "color" ? (g(), $(ye, {
        key: 6,
        "font-color": e.node.value
      }, {
        default: M(() => [
          (g(!0), C(_, null, J(e.node.children, (r, s) => (g(), $(o, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-color"])) : e.node.type === "size" && e.allowSizes ? (g(), $(ye, {
        key: 7,
        "font-size": e.node.value
      }, {
        default: M(() => [
          (g(!0), C(_, null, J(e.node.children, (r, s) => (g(), $(o, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-size"])) : e.node.type === "size" ? (g(!0), C(_, { key: 8 }, J(e.node.children, (r, s) => (g(), $(o, {
        key: s,
        node: r,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "url" && e.allowLinks ? (g(), C("a", {
        key: 9,
        href: e.node.href,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "richtext-link"
      }, [
        (g(!0), C(_, null, J(e.node.children, (r, s) => (g(), $(o, {
          key: s,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ], 8, il)) : e.node.type === "url" ? (g(!0), C(_, { key: 10 }, J(e.node.children, (r, s) => (g(), $(o, {
        key: s,
        node: r,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "emoji" ? (g(), C("span", {
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
        }, null, 8, cl)
      ], 8, sl)) : q("", !0);
    };
  }
}), dl = {
  b: "bold",
  i: "italic",
  u: "underline",
  s: "strike",
  strike: "strike",
  color: "color",
  size: "size",
  url: "url"
}, fl = /* @__PURE__ */ new Set(["br"]), Kt = {
  normal: 12,
  big: 24
};
function En(e) {
  return e.map((t) => t.type === "text" ? t.value : t.type === "emoji" ? t.emoji : t.type === "break" ? `
` : En(t.children)).join("");
}
function qt(e) {
  switch (e.tagType) {
    case "color":
      return { type: "color", value: e.value ?? "inherit", children: e.children };
    case "size": {
      const t = (e.value ?? "").trim().toLowerCase(), n = Kt[t], l = Number.parseInt(e.value ?? "", 10);
      return { type: "size", value: n ?? (Number.isFinite(l) ? l : Kt.normal), children: e.children };
    }
    case "url":
      return {
        type: "url",
        href: e.value ?? En(e.children).trim(),
        children: e.children
      };
    default:
      return { type: e.tagType, children: e.children };
  }
}
function ml(e, t) {
  for (let n = e.length - 1; n >= 0; n--)
    if (e[n].tagType === t) return n;
  return -1;
}
function hl(e, t) {
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
function gl(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const Jt = /* @__PURE__ */ new WeakMap(), vl = new RegExp(Te, "gu");
function pl(e) {
  if (!e) return vl;
  const t = Jt.get(e);
  if (t) return t;
  const n = Object.keys(e).sort((r, s) => s.length - r.length).map(gl), l = n.length > 0 ? `${n.join("|")}|${Te}` : Te, o = new RegExp(l, "gu");
  return Jt.set(e, o), o;
}
function yl(e, t) {
  const n = pl(t), l = [];
  let o = 0, r;
  for (n.lastIndex = 0; r = n.exec(e); ) {
    const s = r[0], a = t?.[s];
    r.index > o && l.push({ type: "text", value: e.slice(o, r.index) }), l.push({ type: "emoji", emoji: s, code: a }), o = r.index + s.length;
  }
  return o < e.length && l.push({ type: "text", value: e.slice(o) }), l.length > 0 ? l : [{ type: "text", value: e }];
}
function wl(e, t, n) {
  const l = [];
  for (const o of hl(e, t))
    o.type === "text" ? l.push(...yl(o.value, n)) : l.push(o);
  return l;
}
function xl(e, t, n = null) {
  const l = [], o = [], r = /\[(\/?)(\w+)(?:=([^\]]*))?\]/g;
  let s = 0, a;
  const d = () => o.length ? o[o.length - 1].children : l, u = (f) => d().push(...wl(f, t, n));
  for (; a = r.exec(e); ) {
    const [f, c, h, b] = a, x = h.toLowerCase();
    if (fl.has(x)) {
      u(e.slice(s, a.index)), s = a.index + f.length, d().push({ type: "break" });
      continue;
    }
    const w = dl[x];
    if (!w) continue;
    if (u(e.slice(s, a.index)), s = a.index + f.length, !c) {
      o.push({ tagType: w, value: b, children: [] });
      continue;
    }
    const k = ml(o, w);
    if (k === -1) {
      u(f);
      continue;
    }
    for (; o.length > k + 1; ) {
      const z = o.pop();
      o[o.length - 1].children.push(qt(z));
    }
    const S = o.pop();
    d().push(qt(S));
  }
  for (u(e.slice(s)); o.length; ) {
    const f = o.pop();
    (o.length ? o[o.length - 1].children : l).push(...f.children);
  }
  return l;
}
const bl = {
  "data-win55-richtext": "",
  style: { display: "contents" }
}, Ql = /* @__PURE__ */ H({
  __name: "RichText",
  props: {
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = nn(), l = B(null), o = B(null);
    mt().then((d) => {
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
    const a = j(() => xl(s(n.default?.() ?? []), r.value, o.value));
    return (d, u) => (g(), C("span", bl, [
      (g(!0), C(_, null, J(a.value, (f, c) => (g(), $(ul, {
        key: c,
        node: f,
        "allow-links": t.allowLinks,
        "allow-sizes": t.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
    ]));
  }
});
function El(e, t, n, l, o) {
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
  ], d = Qt(l), u = Qt(o), f = Math.floor(t / s), c = Math.floor(n / s);
  e.width = Math.floor(t * 2) / 2, e.height = Math.floor(n * 2) / 2;
  for (let h = 0; h < c; h++)
    for (let b = 0; b < f; b++) {
      const x = b * s, w = h * s, k = (b + h) / (f + c - 6), S = (a[h % 8][b % 8] + 0.5) / 64, z = k > S ? 1 : 0, F = Math.round(d.r * (1 - z) + u.r * z), L = Math.round(d.g * (1 - z) + u.g * z), O = Math.round(d.b * (1 - z) + u.b * z);
      r.fillStyle = `rgb(${F}, ${L}, ${O})`, r.fillRect(x, w, s, s);
    }
}
function Qt(e) {
  const t = e.replace("#", ""), n = parseInt(t, 16);
  return {
    r: n >> 16 & 255,
    g: n >> 8 & 255,
    b: n & 255
  };
}
const Cl = { style: { height: "0", overflow: "visible" } }, kl = { class: "titlebar-content" }, Sl = { class: "titlebar-image" }, Rl = ["src"], Tl = { class: "titlebar-text" }, Bl = { class: "titlebar-buttons" }, jl = /* @__PURE__ */ H({
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
      El(s, s.width, s.height, d, u), a.fillStyle = "#555555", a.fillRect(0, s.height - 2, Math.floor(s.width / 2) * 2, 4);
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
    }), (s, a) => (g(), C("div", null, [
      T("div", Cl, [
        T("canvas", {
          ref_key: "canvasRef",
          ref: n,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      T("div", kl, [
        T("div", Sl, [
          T("img", {
            src: e.icon ?? "/win-55-ui/icons/program.png"
          }, null, 8, Rl)
        ]),
        T("div", Tl, [
          K(ye, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: M(() => [
              xe(oe(e.title), 1)
            ]),
            _: 1
          })
        ]),
        T("div", Bl, [
          X(s.$slots, "buttons"),
          e.placeholderButtons ? (g(), C(_, { key: 0 }, [
            K(Ve, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: M(() => [...a[0] || (a[0] = [
                T("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/o.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            K(Ve, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: M(() => [...a[1] || (a[1] = [
                T("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/_.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            a[3] || (a[3] = T("div", { style: { width: "2px" } }, null, -1)),
            K(Ve, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: M(() => [...a[2] || (a[2] = [
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
}), Zl = /* @__PURE__ */ H({
  __name: "Tooltip",
  props: {
    text: {},
    offsetX: {},
    offsetY: {}
  },
  setup(e) {
    const t = e, n = B(!1), l = at({ x: 0, y: 0 });
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
    }), (u, f) => (g(), C("span", {
      onMouseenter: r,
      onMouseleave: s,
      onMousemove: a,
      style: { position: "relative", display: "inline-block" }
    }, [
      X(u.$slots, "default"),
      n.value ? (g(), $(ee, {
        key: 0,
        style: Y(d.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: M(() => [
          xe(oe(t.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : q("", !0)
    ], 32));
  }
}), Il = {
  class: "window-container",
  style: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%"
  }
}, $e = 6, Nl = /* @__PURE__ */ H({
  __name: "Window",
  props: /* @__PURE__ */ on({
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
    const t = e, n = ke(e, "x"), l = ke(e, "y"), o = ke(e, "width"), r = ke(e, "height"), s = t.minWidth ?? 240, a = t.minHeight ?? 40, d = j(() => (t.resizable ?? !1) || (t.resizableHorizontally ?? !1)), u = j(() => (t.resizable ?? !1) || (t.resizableVertically ?? !1));
    let f = !1, c = !1, h = "", b = "", x = 0, w = 0, k = 0, S = 0, z = 0, F = 0;
    function L(N) {
      if (t.faux || h) return;
      const V = N.target;
      V.closest(".titlebar-image") || V.closest(".titlebar-buttons") || (f = !0, x = N.clientX, w = N.clientY, z = n.value, F = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", m), window.addEventListener("mouseup", R));
    }
    function O(N) {
      t.faux || h && (!d.value && !u.value || (c = !0, b = h, x = N.clientX, w = N.clientY, k = o.value, S = r.value, z = n.value, F = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", m), window.addEventListener("mouseup", R)));
    }
    function m(N) {
      if (t.faux) return;
      const V = N.clientX - x, y = N.clientY - w;
      if (f && (n.value = z + V, l.value = F + y), c) {
        const I = b;
        if (d.value && I.includes("e") && (o.value = Math.max(s, k + V)), u.value && I.includes("s") && (r.value = Math.max(a, S + y)), d.value && I.includes("w")) {
          const P = k - V, W = Math.max(s, P);
          o.value = W, n.value = z + (k - W);
        }
        if (u.value && I.includes("n")) {
          const P = S - y, W = Math.max(a, P);
          r.value = W, l.value = F + (S - W);
        }
      }
    }
    function R() {
      f = !1, c = !1, b = "", document.body.style.userSelect = "", window.removeEventListener("mousemove", m), window.removeEventListener("mouseup", R);
    }
    function D(N) {
      if (t.faux) {
        h = "";
        return;
      }
      if (c) return;
      if (!d.value && !u.value) {
        h = "";
        return;
      }
      const y = N.currentTarget.getBoundingClientRect(), I = N.clientX - y.left, P = y.right - N.clientX, W = N.clientY - y.top, ue = y.bottom - N.clientY;
      let te = "";
      u.value && (W < $e ? te += "n" : ue < $e && (te += "s")), d.value && (I < $e ? te += "w" : P < $e && (te += "e")), h = te;
    }
    return (N, V) => (g(), $(ee, {
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
      onMousedown: O
    }, {
      default: M(() => [
        T("div", Il, [
          T("div", {
            class: "titlebar-wrapper",
            onMousedown: Ue(L, ["stop"]),
            style: { height: "34px" }
          }, [
            K(jl, {
              title: e.title,
              icon: e.icon,
              "placeholder-buttons": e.placeholderButtons,
              disabled: e.disabled,
              "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
              "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
            }, {
              buttons: M(() => [
                X(N.$slots, "titlebar-buttons")
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
            X(N.$slots, "default")
          ], 4)
        ])
      ]),
      _: 3
    }, 8, ["extra-class", "extra-styles"]));
  }
}), zl = /* @__PURE__ */ H({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" }
  },
  setup(e) {
    return (t, n) => (g(), $(ee, {
      type: "border-groove",
      "extra-styles": { padding: "10px", margin: "10px" }
    }, {
      default: M(() => [
        T("div", {
          class: "label",
          style: Y({ backgroundColor: e.backgroundColorHint })
        }, oe(e.label), 5),
        X(t.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }));
  }
}), Al = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [l, o] of t)
    n[l] = o;
  return n;
}, er = /* @__PURE__ */ Al(zl, [["__scopeId", "data-v-9a25af1b"]]), Zt = "/win-55-ui/emoji/emoji-by-category.json";
let rt = null;
async function en() {
  return rt || (rt = fetch(Zt).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${Zt}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), rt;
}
const $l = { class: "emoji-picker-body" }, Ll = { class: "emoji-picker-tabs" }, Fl = ["onClick"], Ml = { class: "emoji-picker-grid" }, Ol = ["src", "title", "onClick"], Pl = "546", tr = /* @__PURE__ */ H({
  __name: "EmojiPickerWindow",
  setup(e) {
    const t = B(null), n = B([]), l = B(null), o = B(void 0), r = j(() => n.value.find((u) => u.category === l.value) ?? null);
    async function s() {
      if (Math.random() < 0.75) {
        o.value = re(Pl);
        return;
      }
      const f = (await en()).flatMap((h) => h.emojis);
      if (f.length === 0) return;
      const c = f[Math.floor(Math.random() * f.length)];
      o.value = re(c.code);
    }
    me(we, async (u) => {
      u && (s(), n.value.length === 0 && (n.value = await en(), l.value = n.value[0]?.category ?? null));
    }, { immediate: !0 });
    function a(u) {
      l.value = u;
    }
    function d(u) {
      if (!we.value) return;
      const f = u.target;
      t.value?.contains(f) || Pt();
    }
    return ae(() => {
      document.addEventListener("click", d);
    }), ie(() => {
      document.removeEventListener("click", d);
    }), (u, f) => (g(), $(Xe, { to: "body" }, [
      U(we) ? (g(), C("div", {
        key: 0,
        ref_key: "rootRef",
        ref: t,
        style: { display: "contents" }
      }, [
        K(Nl, {
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
          "titlebar-buttons": M(() => [
            K(Ve, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              onClick: U(Pt)
            }, {
              default: M(() => [...f[4] || (f[4] = [
                T("img", {
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
                T("div", $l, [
                  T("div", Ll, [
                    (g(!0), C(_, null, J(n.value, (c) => (g(), C("span", {
                      key: c.category,
                      class: Be(["emoji-picker-tab", { "emoji-picker-tab--selected": c.category === l.value }]),
                      onClick: (h) => a(c.category)
                    }, [
                      K(ye, {
                        shorthand: c.category === l.value ? "Bold12" : "Regular12"
                      }, {
                        default: M(() => [
                          xe(oe(c.category), 1)
                        ]),
                        _: 2
                      }, 1032, ["shorthand"])
                    ], 10, Fl))), 128))
                  ]),
                  K(Qo),
                  T("div", Ml, [
                    (g(!0), C(_, null, J(r.value?.emojis ?? [], (c) => (g(), C("div", {
                      key: c.code,
                      class: "emoji-picker-grid-cell"
                    }, [
                      T("img", {
                        src: U(re)(c.code),
                        title: c.shortcodes[0] ? `:${c.shortcodes[0]}:` : void 0,
                        class: "emoji-picker-grid-item",
                        onClick: (h) => U(Ro)(c.emoji)
                      }, null, 8, Ol)
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
}), Dl = ["src", "alt", "width", "height"], tn = 15, Le = 2, nr = /* @__PURE__ */ H({
  __name: "Emoji",
  props: {
    emoji: {}
  },
  setup(e) {
    const t = e, n = new RegExp(`^(?:${Te})$`, "u"), l = B(""), o = B(t.emoji), r = B(tn * Le), s = B(tn * Le);
    async function a(u) {
      if (n.test(u)) {
        o.value = u;
        const c = await Jn(u);
        l.value = c ?? ft(u);
        return;
      }
      const f = await yn(u);
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
      r.value = f.naturalWidth * Le, s.value = f.naturalHeight * Le;
    }
    return (u, f) => (g(), C("img", {
      class: "win55-emoji-standalone",
      src: l.value,
      alt: o.value,
      width: r.value,
      height: s.value,
      draggable: "false",
      onLoad: d
    }, null, 40, Dl));
  }
}), or = (e, t = 20, n = 48, l = 30) => {
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
    })), c = f.map((x) => n + x.sin * l), h = e * n, b = c.reduce((x, w) => x + w, 0);
    if (b > 0) {
      const x = h / b;
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
function lr(e) {
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
  Hn as Balloon,
  Vn as BaseDropdown,
  Yl as BaseInput,
  ee as Box,
  Ve as Button,
  xn as CURSOR_CONTEXT_KEY,
  Gl as Checkbox,
  Kl as CursorContext,
  nr as Emoji,
  tr as EmojiPickerWindow,
  Qo as HDivider,
  ql as MenuDropdown,
  er as NamedPanel,
  Jl as RadioButton,
  Ql as RichText,
  jl as Titlebar,
  Zl as Tooltip,
  ye as Typography,
  Nl as Window,
  ht as activeTarget,
  Pt as closePicker,
  vt as cursorDirective,
  Wl as customEmojiDirective,
  El as drawAngledBayerDitherGradient,
  xo as emojiDirective,
  Jn as getEmojiGifPath,
  re as getEmojiGifPathFromCode,
  Vl as getEmojiRegistry,
  Se as getSelectionOffset,
  ne as getTextWithCustomEmoji,
  Ul as hasEmoji,
  Ro as insertEmoji,
  wn as loadCursorsManifest,
  he as loadEmojiRegistry,
  Fo as loadSchemeIndex,
  So as openPicker,
  To as pickNextButtonIcon,
  we as pickerOpen,
  se as pickerPosition,
  Oo as provideCursorContext,
  Ot as registerActiveInput,
  lr as registerGlobalImageErrorHandler,
  Xl as resetCursorsCache,
  Hl as resetEmojiRegistryCache,
  We as resolveCursor,
  Me as restoreSelectionOffset,
  sn as typographyStyles,
  Po as useCursorContext,
  or as useSineWave
};
