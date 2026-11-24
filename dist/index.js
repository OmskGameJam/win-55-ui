import { defineComponent as oe, computed as E, ref as F, onMounted as be, onBeforeUnmount as Yt, openBlock as S, createElementBlock as O, normalizeClass as He, withDirectives as Ne, createElementVNode as D, vShow as $t, createCommentVNode as ce, withModifiers as dt, normalizeStyle as K, reactive as ft, watch as ge, useModel as Ae, unref as G, Fragment as ne, createBlock as Q, renderSlot as fe, mergeModels as xt, useSlots as Eo, nextTick as Cn, onUnmounted as Me, Teleport as bt, createVNode as re, withCtx as J, createTextVNode as st, toDisplayString as $e, inject as Co, provide as So, shallowRef as Jo, renderList as me, mergeProps as jt, watchEffect as _t, getCurrentInstance as Qo, withKeys as Zo, Transition as el, resolveDynamicComponent as ko, resolveComponent as tl } from "vue";
const nl = ["src"], ol = ["src"], ll = {
  key: 0,
  class: "sb-nubs"
}, sl = ["src"], rl = ["src"], nn = 32, al = 500, il = 50, ul = 28, cl = /* @__PURE__ */ oe({
  __name: "ScrollBar",
  props: {
    orientation: {},
    scrollPos: {},
    viewportSize: {},
    contentSize: {}
  },
  emits: ["scroll-to", "scroll-by"],
  setup(e, { emit: n }) {
    const t = e, o = n, l = E(() => t.orientation === "vertical"), r = E(() => t.viewportSize < 84), s = E(() => l.value ? "up" : "left"), a = E(() => l.value ? "down" : "right"), c = (P, Y) => `/win-55-ui/whole-components/scrollbar-buttons/btn-${P}${Y ? "-pressed" : ""}.png`, u = F(null), f = F(0);
    let d = null;
    function v() {
      const P = u.value;
      P && (f.value = l.value ? P.offsetHeight : P.offsetWidth);
    }
    be(() => {
      v(), d = new ResizeObserver(v), u.value && d.observe(u.value);
    });
    const g = E(() => t.contentSize - t.viewportSize), w = E(() => g.value > 0), x = (P) => Math.round(P / 2) * 2, T = E(() => {
      if (!w.value) return 0;
      const P = x(f.value * t.viewportSize / t.contentSize);
      return Math.min(f.value, Math.max(ul, P));
    }), B = E(() => {
      const P = f.value - T.value;
      return !w.value || P <= 0 ? 0 : Math.min(P, Math.max(0, x(t.scrollPos / g.value * P)));
    }), b = E(() => T.value > 50), $ = E(
      () => l.value ? { height: `${T.value}px`, transform: `translateY(${B.value}px)` } : { width: `${T.value}px`, transform: `translateX(${B.value}px)` }
    );
    let k = 0;
    function m() {
      clearTimeout(k);
    }
    function I(P) {
      m(), P(), k = window.setTimeout(function Y() {
        P(), k = window.setTimeout(Y, il);
      }, al);
    }
    Yt(() => {
      m(), d?.disconnect();
    });
    const L = F(null);
    function V(P, Y) {
      P.button === 0 && (P.currentTarget.setPointerCapture(P.pointerId), L.value = Y, I(() => o("scroll-by", Y === "start" ? -nn : nn)));
    }
    function y() {
      L.value = null, m();
    }
    const R = (P) => l.value ? P.clientY : P.clientX;
    let p = 0, A = !1;
    function H(P) {
      const ae = u.value.getBoundingClientRect();
      return l.value ? P.clientY - ae.top : P.clientX - ae.left;
    }
    function Z(P) {
      P.button !== 0 || !w.value || (u.value.setPointerCapture(P.pointerId), A = !0, p = H(P), I(() => {
        const Y = Math.max(2, t.viewportSize - nn);
        p < B.value ? o("scroll-by", -Y) : p > B.value + T.value && o("scroll-by", Y);
      }));
    }
    function ue(P) {
      A && (p = H(P));
    }
    function de() {
      A = !1, m();
    }
    let le = null;
    function ee(P) {
      P.button === 0 && (P.currentTarget.setPointerCapture(P.pointerId), le = { start: R(P), startScroll: t.scrollPos });
    }
    function j(P) {
      if (!le) return;
      const Y = f.value - T.value;
      Y <= 0 || o("scroll-to", le.startScroll + (R(P) - le.start) * g.value / Y);
    }
    function U() {
      le = null;
    }
    return (P, Y) => (S(), O("div", {
      class: He(["win55-scrollbar", e.orientation]),
      "aria-hidden": "true"
    }, [
      r.value ? ce("", !0) : (S(), O("div", {
        key: 0,
        class: "sb-button",
        onPointerdown: Y[0] || (Y[0] = (ae) => V(ae, "start")),
        onPointerup: y,
        onPointercancel: y
      }, [
        Ne(D("img", {
          src: c(s.value, !1),
          draggable: "false"
        }, null, 8, nl), [
          [$t, L.value !== "start"]
        ]),
        Ne(D("img", {
          src: c(s.value, !0),
          draggable: "false"
        }, null, 8, ol), [
          [$t, L.value === "start"]
        ])
      ], 32)),
      D("div", {
        ref_key: "trackRef",
        ref: u,
        class: "sb-track",
        onPointerdown: Z,
        onPointermove: ue,
        onPointerup: de,
        onPointercancel: de
      }, [
        w.value ? (S(), O("div", {
          key: 0,
          class: "sb-thumb",
          style: K($.value),
          onPointerdown: dt(ee, ["stop"]),
          onPointermove: j,
          onPointerup: U,
          onPointercancel: U
        }, [
          b.value ? (S(), O("div", ll)) : ce("", !0)
        ], 36)) : ce("", !0)
      ], 544),
      r.value ? ce("", !0) : (S(), O("div", {
        key: 1,
        class: "sb-button",
        onPointerdown: Y[1] || (Y[1] = (ae) => V(ae, "end")),
        onPointerup: y,
        onPointercancel: y
      }, [
        Ne(D("img", {
          src: c(a.value, !1),
          draggable: "false"
        }, null, 8, sl), [
          [$t, L.value !== "end"]
        ]),
        Ne(D("img", {
          src: c(a.value, !0),
          draggable: "false"
        }, null, 8, rl), [
          [$t, L.value === "end"]
        ])
      ], 32))
    ], 2));
  }
}), qe = (e, n) => {
  const t = e.__vccOpts || e;
  for (const [o, l] of n)
    t[o] = l;
  return t;
}, jn = /* @__PURE__ */ qe(cl, [["__scopeId", "data-v-402ffbb6"]]), on = 28;
function Ht(e) {
  return e === "hidden" || e === "scroll" || e === "auto";
}
function dl(e, n) {
  if (Ht(e) === Ht(n)) return { x: e, y: n };
  const t = (o) => o === "clip" ? "hidden" : o === "visible" ? "auto" : o;
  return { x: t(e), y: t(n) };
}
function Ve(e, n) {
  return Math.min(n, Math.max(0, Math.round(e / 2) * 2));
}
const fl = 4, vl = 100;
function ml(e, n, t) {
  const o = F(null), l = F(null), r = E(
    () => dl(e.overflowX ?? e.overflow ?? "visible", e.overflowY ?? e.overflow ?? "visible")
  ), s = E(() => Ht(r.value.x) || Ht(r.value.y)), a = F(r.value.y === "scroll"), c = F(r.value.x === "scroll"), u = ft({ top: 0, left: 0, clientW: 0, clientH: 0, scrollW: 0, scrollH: 0 }), f = E(() => s.value ? {
    display: "grid",
    gridTemplateColumns: a.value ? `minmax(0, 1fr) ${on}px` : "minmax(0, 1fr)",
    gridTemplateRows: c.value ? `minmax(0, 1fr) ${on}px` : "minmax(0, 1fr)"
  } : { overflowX: e.overflowX ?? e.overflow, overflowY: e.overflowY ?? e.overflow }), d = E(() => ({
    overflowX: r.value.x,
    overflowY: r.value.y
  }));
  function v(y) {
    u.top = y.scrollTop, u.left = y.scrollLeft, u.clientW = y.clientWidth, u.clientH = y.clientHeight, u.scrollW = y.scrollWidth, u.scrollH = y.scrollHeight;
  }
  function g(y) {
    const R = Ve(y.scrollTop, y.scrollHeight - y.clientHeight), p = Ve(y.scrollLeft, y.scrollWidth - y.clientWidth);
    Math.abs(R - y.scrollTop) > 0.01 && (y.scrollTop = R), Math.abs(p - y.scrollLeft) > 0.01 && (y.scrollLeft = p);
  }
  let w = null, x = null, T = 0, B = 0;
  function b() {
    T || (T = requestAnimationFrame(() => {
      T = 0, $();
    }));
  }
  function $() {
    const y = o.value, R = l.value;
    if (!y || !R) return;
    R.style.display = "none";
    const p = y.scrollHeight, A = y.scrollWidth, H = y.clientHeight, Z = y.clientWidth, ue = on, { x: de, y: le } = r.value, ee = e.forgiveVerticalOverflow ? fl : 0, j = Z + (a.value ? ue : 0), U = H + (c.value ? ue : 0);
    let P = le === "scroll", Y = de === "scroll";
    le === "auto" && p - ee > U && (P = !0), de === "auto" && A > j - (P ? ue : 0) && (Y = !0), le === "auto" && !P && p - ee > U - (Y ? ue : 0) && (P = !0);
    const ae = P !== a.value;
    a.value = P, ae && de === "auto" || (c.value = Y);
    const Ee = (p - H) % 2 !== 0, pe = (A - Z) % 2 !== 0;
    (Ee || pe) && (R.style.top = Ee ? `${p}px` : "0px", R.style.left = pe ? `${A}px` : "0px", R.style.display = "block"), x?.takeRecords();
    for (const we of Array.from(y.children)) w?.observe(we);
    g(y), v(y);
  }
  function k() {
    clearTimeout(B);
    const y = o.value;
    y && (g(y), v(y));
  }
  function m() {
    const y = o.value;
    if (!y) return;
    v(y);
    const R = Ve(y.scrollTop, y.scrollHeight - y.clientHeight), p = Ve(y.scrollLeft, y.scrollWidth - y.clientWidth);
    n.value !== R && (n.value = R), t.value !== p && (t.value = p), clearTimeout(B), B = window.setTimeout(k, vl);
  }
  function I(y, R) {
    const p = o.value;
    p && (y === "y" ? p.scrollTop = Ve(R, p.scrollHeight - p.clientHeight) : p.scrollLeft = Ve(R, p.scrollWidth - p.clientWidth));
  }
  function L(y, R) {
    const p = o.value;
    p && I(y, (y === "y" ? p.scrollTop : p.scrollLeft) + R);
  }
  function V(y) {
    const R = o.value, p = y === "y" ? n : t;
    if (!R || p.value === void 0) return;
    const A = y === "y" ? R.scrollTop : R.scrollLeft, H = y === "y" ? R.scrollHeight - R.clientHeight : R.scrollWidth - R.clientWidth;
    if (Ve(A, H) === p.value) return;
    I(y, p.value);
    const Z = Ve(p.value, H);
    p.value !== Z && (p.value = Z);
  }
  return ge(n, () => V("y")), ge(t, () => V("x")), ge([r, () => e.forgiveVerticalOverflow], $, { flush: "post" }), ge(
    o,
    (y, R, p) => {
      y && (w = new ResizeObserver(b), w.observe(y), x = new MutationObserver(b), x.observe(y, { childList: !0, subtree: !0, characterData: !0, attributes: !0 }), $(), V("y"), V("x"), p(() => {
        w?.disconnect(), x?.disconnect(), w = null, x = null, clearTimeout(B), cancelAnimationFrame(T), T = 0;
      }));
    },
    { flush: "post" }
  ), {
    wrapperRef: o,
    spacerRef: l,
    scrollMode: s,
    showV: a,
    showH: c,
    metrics: u,
    rootStyle: f,
    wrapperStyle: d,
    onScroll: m,
    snapNow: k,
    scrollToAxis: I,
    scrollByAxis: L
  };
}
const hl = {
  key: 2,
  class: "win55-sb-corner"
}, pl = /* @__PURE__ */ oe({
  __name: "Box",
  props: /* @__PURE__ */ xt({
    type: {},
    overflow: {},
    overflowX: {},
    overflowY: {},
    forgiveVerticalOverflow: { type: Boolean },
    extraStyles: {},
    extraClass: {}
  }, {
    scrollTop: {},
    scrollTopModifiers: {},
    scrollLeft: {},
    scrollLeftModifiers: {}
  }),
  emits: ["update:scrollTop", "update:scrollLeft"],
  setup(e, { expose: n }) {
    const t = e, o = Ae(e, "scrollTop"), l = Ae(e, "scrollLeft"), r = F(null), {
      wrapperRef: s,
      spacerRef: a,
      scrollMode: c,
      showV: u,
      showH: f,
      metrics: d,
      rootStyle: v,
      wrapperStyle: g,
      onScroll: w,
      snapNow: x,
      scrollToAxis: T,
      scrollByAxis: B
    } = ml(t, o, l), b = E(() => ({
      "--img": `url(/win-55-ui/${t.type}.png)`,
      ...v.value,
      ...t.extraStyles
    }));
    return n({ el: r, scrollEl: s, verticalBarVisible: u }), ($, k) => (S(), O("div", {
      ref_key: "rootRef",
      ref: r,
      class: He(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: K(b.value)
    }, [
      G(c) ? (S(), O(ne, { key: 0 }, [
        G(u) ? (S(), Q(jn, {
          key: 0,
          class: "win55-sb-v",
          orientation: "vertical",
          "scroll-pos": G(d).top,
          "viewport-size": G(d).clientH,
          "content-size": G(d).scrollH,
          onScrollTo: k[0] || (k[0] = (m) => G(T)("y", m)),
          onScrollBy: k[1] || (k[1] = (m) => G(B)("y", m))
        }, null, 8, ["scroll-pos", "viewport-size", "content-size"])) : ce("", !0),
        G(f) ? (S(), Q(jn, {
          key: 1,
          class: "win55-sb-h",
          orientation: "horizontal",
          "scroll-pos": G(d).left,
          "viewport-size": G(d).clientW,
          "content-size": G(d).scrollW,
          onScrollTo: k[2] || (k[2] = (m) => G(T)("x", m)),
          onScrollBy: k[3] || (k[3] = (m) => G(B)("x", m))
        }, null, 8, ["scroll-pos", "viewport-size", "content-size"])) : ce("", !0),
        G(u) && G(f) ? (S(), O("div", hl)) : ce("", !0),
        D("div", {
          ref_key: "wrapperRef",
          ref: s,
          class: "win55-scroll-wrapper",
          style: K(G(g)),
          onScroll: k[4] || (k[4] = //@ts-ignore
          (...m) => G(w) && G(w)(...m)),
          onScrollend: k[5] || (k[5] = //@ts-ignore
          (...m) => G(x) && G(x)(...m))
        }, [
          fe($.$slots, "default", {}, void 0, !0),
          D("div", {
            ref_key: "spacerRef",
            ref: a,
            class: "win55-scroll-spacer",
            "aria-hidden": "true"
          }, null, 512)
        ], 36)
      ], 64)) : fe($.$slots, "default", { key: 1 }, void 0, !0)
    ], 6));
  }
}), xe = /* @__PURE__ */ qe(pl, [["__scopeId", "data-v-e2b0476a"]]), gl = { class: "balloon-tip-box" }, wl = {
  key: 1,
  class: "balloon-wrapper"
}, yl = { class: "balloon-tip-box" }, Mt = 8, xl = /* @__PURE__ */ oe({
  __name: "Balloon",
  props: /* @__PURE__ */ xt({
    text: {},
    side: { default: "top" },
    bias: {},
    anchor: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const n = Ae(e, "open");
    function t(m) {
      return "top" in m;
    }
    function o(m) {
      return t(m) ? m : { top: m.y, bottom: m.y, left: m.x, right: m.x };
    }
    const l = e, r = Eo(), s = E(() => l.bias), a = F(l.side), c = E(() => l.anchor ? a.value : l.side), u = E(() => {
      const m = {};
      switch (l.side) {
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
    }), f = E(() => {
      switch (c.value) {
        case "top":
          return "column";
        case "bottom":
          return "column-reverse";
        case "left":
          return "row";
        case "right":
          return "row-reverse";
      }
    }), d = E(() => {
      let m = "", I = !1;
      switch (c.value) {
        case "top":
          m = "rotate(0deg)", s.value === "right" && (I = !0);
          break;
        case "bottom":
          m = "rotate(180deg)", s.value === "left" && (I = !0);
          break;
        case "left":
          m = "rotate(-90deg)";
          break;
        case "right":
          m = "rotate(90deg)", I = !0;
          break;
      }
      return I ? `${m} scaleX(-1)` : m;
    }), v = E(() => {
      const m = {};
      return s.value ? ((c.value === "top" || c.value === "bottom") && (s.value === "left" && (m.transform = "translateX(calc(-50% + 28px))"), s.value === "right" && (m.transform = "translateX(calc(50% - 28px))")), (c.value === "left" || c.value === "right") && (s.value === "up" && (m.transform = "translateY(calc(-50% + 28px))"), s.value === "down" && (m.transform = "translateY(calc(50% - 28px))")), m) : {};
    }), g = F(null), w = F(null), x = { top: "bottom", bottom: "top", left: "right", right: "left" }, T = {
      top: ["left", "right"],
      bottom: ["left", "right"],
      left: ["top", "bottom"],
      right: ["top", "bottom"]
    };
    function B(m, I, L) {
      const V = (I.left + I.right) / 2, y = (I.top + I.bottom) / 2;
      return m === "top" || m === "bottom" ? {
        top: m === "top" ? I.top - L.height : I.bottom,
        left: V - L.width / 2
      } : {
        left: m === "left" ? I.left - L.width : I.right,
        top: y - L.height / 2
      };
    }
    function b(m, I, L, V) {
      return m.top >= Mt && m.left >= Mt && m.top + I.height <= V - Mt && m.left + I.width <= L - Mt;
    }
    function $() {
      const m = g.value;
      if (!l.anchor || !m) return;
      const I = o(l.anchor), L = m.getBoundingClientRect(), V = window.innerWidth, y = window.innerHeight, R = l.side, A = [
        R,
        x[R],
        ...T[R]
      ].find((H) => b(B(H, I, L), L, V, y)) ?? R;
      a.value = A, w.value = B(A, I, L);
    }
    ge(
      [() => l.anchor, n],
      async ([m, I]) => {
        !m || !I || (await Cn(), $());
      },
      { deep: !0, immediate: !0 }
    );
    const k = () => {
      l.anchor && n.value && $();
    };
    return be(() => {
      window.addEventListener("resize", k), window.addEventListener("scroll", k, !0);
    }), Me(() => {
      window.removeEventListener("resize", k), window.removeEventListener("scroll", k, !0);
    }), (m, I) => e.anchor ? (S(), Q(bt, {
      key: 0,
      to: "body"
    }, [
      n.value ? (S(), O("div", {
        key: 0,
        ref_key: "anchoredRef",
        ref: g,
        class: "balloon-anchored",
        style: K({
          top: (w.value?.top ?? 0) + "px",
          left: (w.value?.left ?? 0) + "px"
        })
      }, [
        D("div", {
          class: "balloon-inner",
          style: K({ flexDirection: f.value })
        }, [
          D("div", {
            class: "balloon-box-wrapper",
            style: K(v.value)
          }, [
            re(xe, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: J(() => [
                G(r).content ? fe(m.$slots, "content", { key: 0 }) : (S(), O(ne, { key: 1 }, [
                  st($e(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          D("div", gl, [
            D("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: K({ transform: d.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : ce("", !0)
    ])) : (S(), O("div", wl, [
      fe(m.$slots, "default"),
      n.value ? (S(), O("div", {
        key: 0,
        class: "balloon",
        style: K(u.value)
      }, [
        D("div", {
          class: "balloon-inner",
          style: K({ flexDirection: f.value })
        }, [
          D("div", {
            class: "balloon-box-wrapper",
            style: K(v.value)
          }, [
            re(xe, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: J(() => [
                G(r).content ? fe(m.$slots, "content", { key: 0 }) : (S(), O(ne, { key: 1 }, [
                  st($e(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          D("div", yl, [
            D("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: K({ transform: d.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : ce("", !0)
    ]));
  }
}), Fn = /* @__PURE__ */ Symbol("win55-dropdown"), bl = 200, El = /* @__PURE__ */ oe({
  __name: "BaseDropdown",
  props: /* @__PURE__ */ xt({
    matchTriggerWidth: { type: Boolean, default: !1 }
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const n = e, t = Ae(e, "open"), o = F(null), l = Co(Fn, null), r = l !== null, s = /* @__PURE__ */ new Set();
    let a = null;
    So(Fn, {
      registerChild: (k) => (s.add(k), () => s.delete(k)),
      claimActive: (k) => (a && a !== k && a(), a = k, () => {
        a === k && (a = null);
      })
    });
    const c = F(null), u = F(null), f = () => {
      const k = c.value, m = u.value;
      if (!k || !m) return;
      const I = k.getBoundingClientRect(), L = window.innerHeight, V = m.offsetHeight;
      let y, R;
      if (r) {
        const p = m.offsetWidth;
        y = I.top + window.scrollY, R = I.right + window.scrollX, I.top + V > L && (y = Math.max(0, L - V) + window.scrollY), I.right + p > window.innerWidth && (R = I.left + window.scrollX - p);
      } else
        y = I.bottom + window.scrollY, R = I.left + window.scrollX, I.bottom + V > L && (y = I.top + window.scrollY - V);
      o.value = {
        top: y,
        left: R,
        width: n.matchTriggerWidth ? I.width : void 0
      };
    };
    let d = null;
    ge(t, async (k) => {
      k ? (d = l?.claimActive(() => {
        t.value = !1;
      }) ?? null, await Cn(), f()) : (d?.(), d = null);
    });
    const v = (k) => !!c.value?.contains(k) || !!u.value?.contains(k) || [...s].some((m) => m.containsTarget(k)), g = l?.registerChild({ containsTarget: v });
    let w;
    const x = () => {
      !r || t.value || (w = setTimeout(() => {
        t.value = !0;
      }, bl));
    }, T = () => clearTimeout(w), B = () => {
      t.value && f();
    }, b = (k) => {
      t.value && (v(k.target) || (t.value = !1));
    };
    be(() => {
      window.addEventListener("resize", B), window.addEventListener("scroll", B), document.addEventListener("click", b);
    }), Me(() => {
      window.removeEventListener("resize", B), window.removeEventListener("scroll", B), document.removeEventListener("click", b), clearTimeout(w), d?.(), g?.();
    });
    const $ = () => {
      t.value = r ? !0 : !t.value;
    };
    return (k, m) => (S(), O(ne, null, [
      D("div", {
        ref_key: "triggerRef",
        ref: c,
        style: K({ display: r ? "block" : "inline-block" }),
        onClick: dt($, ["stop"]),
        onMouseenter: x,
        onMouseleave: T
      }, [
        fe(k.$slots, "trigger")
      ], 36),
      (S(), Q(bt, { to: "body" }, [
        t.value ? (S(), O("div", {
          key: 0,
          ref_key: "dropdownRef",
          ref: u,
          style: K({
            position: "absolute",
            top: (o.value?.top ?? 0) + "px",
            left: (o.value?.left ?? 0) + "px",
            width: e.matchTriggerWidth ? (o.value?.width ?? "auto") + "px" : "auto"
          })
        }, [
          fe(k.$slots, "items")
        ], 4)) : ce("", !0)
      ]))
    ], 64));
  }
}), To = [
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
], Cl = [8, 10, 12, 16, 18, 24], Ro = "Standard", Sl = {
  BoldItalic: ["BoldItalic", "Bold", "Italic", "Regular"],
  Bold: ["Bold", "Regular"],
  Italic: ["Italic", "Regular"],
  Regular: ["Regular"]
};
function Dn(e, n) {
  return To.filter((t) => t.fontName === e && t.style === n).map((t) => t.size);
}
function kl(e, n, t) {
  const o = To.some((r) => r.fontName === e) ? e : Ro, l = Sl[n] ?? ["Regular"];
  for (const r of l)
    if (Dn(o, r).includes(t))
      return { fontName: o, style: r, size: t };
  for (const r of l) {
    const s = Dn(o, r);
    if (s.length > 0)
      return { fontName: o, style: r, size: Mo(t, s) };
  }
  return { fontName: o, style: "Regular", size: t };
}
function $o(e) {
  const { style: n, size: t } = e.shorthand ? Rl(e.shorthand) : {
    style: Tl(e.isBold, e.isItalic),
    size: Mo(e.fontSize ?? 12, Cl)
  }, { fontName: o, style: l, size: r } = kl(e.fontName ?? Ro, n, t), s = {
    fontFamily: `${o}-${l}-${r}, ${o}-${l}-${r}-TofuMaker`,
    fontSize: `${r * 2}px`,
    lineHeight: `${r * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (s.textShadow = `2px 2px 0 ${e.fontShadowColor}`), s;
}
function Tl(e, n) {
  return e && n ? "BoldItalic" : e ? "Bold" : n ? "Italic" : "Regular";
}
function Rl(e) {
  const n = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!n)
    throw new Error(`Invalid shorthand format: ${e}`);
  const t = n[1], o = parseInt(n[2], 10);
  return { style: t, size: o };
}
function Mo(e, n) {
  if (n.length === 0)
    throw new Error("Array cannot be empty");
  return n.reduce((t, o) => {
    const l = Math.abs(o - e), r = Math.abs(t - e);
    return l < r ? o : t;
  });
}
function Pe(e) {
  if (e instanceof Text)
    return e.nodeValue ?? "";
  if (!(e instanceof Element || e instanceof DocumentFragment))
    return Array.from(e.childNodes).map(Pe).join("");
  if (e instanceof Element) {
    const n = e.getAttribute("data-win55-emoji");
    if (n)
      return n;
    if (e.tagName === "BR")
      return `
`;
  }
  return Array.from(e.childNodes).map(Pe).join("");
}
function ot(e) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !n.isCollapsed)
    return null;
  const t = n.getRangeAt(0);
  if (!e.contains(t.startContainer))
    return null;
  const o = document.createRange();
  return o.selectNodeContents(e), o.setEnd(t.startContainer, t.startOffset), Pe(o.cloneContents()).length;
}
function Io(e, n) {
  if (e instanceof Text) {
    const l = e.nodeValue?.length ?? 0;
    return n <= l ? { node: e, offset: n, remaining: 0 } : { node: e, offset: l, remaining: n - l };
  }
  if (e instanceof Element) {
    if (e.tagName === "BR")
      return {
        node: e.parentNode ?? e,
        offset: It(e) + (n > 0 ? 1 : 0),
        remaining: Math.max(0, n - 1)
      };
    const l = e.getAttribute("data-win55-emoji");
    if (l)
      return n <= 0 ? { node: e.parentNode ?? e, offset: It(e), remaining: 0 } : n <= l.length ? { node: e.parentNode ?? e, offset: It(e) + 1, remaining: 0 } : {
        node: e.parentNode ?? e,
        offset: It(e) + 1,
        remaining: n - l.length
      };
  }
  let t = n, o = {
    offset: e.childNodes.length,
    remaining: t
  };
  for (const l of Array.from(e.childNodes)) {
    const r = Io(l, t);
    if (r && r.remaining === 0)
      return r;
    r && (t = r.remaining, o = r);
  }
  return {
    node: e,
    offset: e.childNodes.length,
    remaining: o.remaining
  };
}
function It(e) {
  return e.parentNode ? Array.prototype.indexOf.call(e.parentNode.childNodes, e) : 0;
}
function vt(e, n, t = !1) {
  if (n === null || !e.isConnected)
    return;
  const o = Io(e, n);
  if (!o)
    return;
  const l = document.createRange(), r = window.getSelection();
  t && e.focus({ preventScroll: !0 }), l.setStart(o.node, o.offset), l.collapse(!0), r?.removeAllRanges(), r?.addRange(l);
}
const _n = typeof Intl.Segmenter == "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function Sn(e) {
  return _n ? Array.from(_n.segment(e), (n) => n.segment) : Array.from(e);
}
function Bo(e) {
  return Sn(e).length;
}
function $l(e, n) {
  return Sn(e).slice(0, n).join("");
}
function Ml(e, n, t = null) {
  const o = Sn(e);
  let l = 0;
  return { value: o.filter((s, a) => {
    const c = n(s);
    return !c && t !== null && a < t && l++, c;
  }).join(""), caret: t === null ? null : t - l };
}
const ln = new RegExp("\\p{Extended_Pictographic}|\\p{Regional_Indicator}|‍|️|⃣", "u");
function Il(e, n, t) {
  return !(n && (n.lastIndex = 0, !n.test(e)) || t && (t.lastIndex = 0, t.test(e)));
}
const Bl = { class: "baseinput-wrapper" }, Nl = ["contenteditable", "data-placeholder", "aria-multiline", "aria-disabled"], No = /* @__PURE__ */ oe({
  __name: "BaseInput",
  props: {
    modelValue: {},
    placeholder: { default: "" },
    disabled: { type: Boolean, default: !1 },
    maxLength: { default: void 0 },
    boxType: { default: "textarea" },
    extraStyles: { default: void 0 },
    contentStyles: { default: void 0 },
    multiline: { type: Boolean, default: !1 },
    wrap: { type: Boolean, default: !0 },
    allow: { default: void 0 },
    deny: { default: void 0 }
  },
  emits: ["update:modelValue", "input", "keydown", "beforeinput", "paste", "focus", "blur"],
  setup(e, { expose: n, emit: t }) {
    const o = e, l = t, r = F(null), s = F(null);
    be(() => {
      s.value && o.modelValue && (s.value.innerText = o.modelValue);
    }), ge(() => o.modelValue, (g) => {
      if (s.value && Pe(s.value) !== g) {
        const w = document.activeElement === s.value, x = w ? ot(s.value) : null;
        s.value.innerText = g ?? "", w && vt(s.value, x);
      }
    });
    const a = () => {
      if (!s.value) return;
      let g = Pe(s.value);
      if (o.multiline || (g = g.replace(/\n/g, "")), o.allow || o.deny) {
        const w = document.activeElement === s.value ? ot(s.value) : null, x = Ml(
          g,
          (T) => T === `
` || Il(T, o.allow, o.deny),
          w
        );
        x.value !== g && (g = x.value, s.value.innerText = g, w !== null && vt(s.value, x.caret));
      }
      if (o.maxLength && Bo(g) > o.maxLength) {
        g = $l(g, o.maxLength), s.value.innerText = g;
        const w = document.createRange(), x = window.getSelection();
        w.selectNodeContents(s.value), w.collapse(!1), x?.removeAllRanges(), x?.addRange(w);
      }
      l("update:modelValue", g);
    }, c = () => {
      a(), l("input");
    }, u = (g) => {
      l("keydown", g), !o.multiline && g.key === "Enter" && g.preventDefault(), g.key === "Tab" && g.preventDefault();
    }, f = (g) => {
      if (l("paste", g), g.defaultPrevented) return;
      g.preventDefault();
      let w = g.clipboardData?.getData("text/plain") ?? "";
      o.multiline || (w = w.replace(/\n/g, " "));
      const x = window.getSelection(), T = x?.rangeCount ? x.getRangeAt(0) : null;
      if (T) {
        T.deleteContents();
        const B = document.createTextNode(w);
        T.insertNode(B), T.collapse(!1), x?.removeAllRanges(), x?.addRange(T);
      }
      c();
    }, d = () => {
      s.value && Pe(s.value) === "" && (s.value.innerHTML = ""), l("blur");
    }, v = () => ({
      ...$o({ fontColor: "black" }),
      minHeight: "100%",
      ...o.wrap ? {} : { whiteSpace: "nowrap", width: "max-content", minWidth: "100%" },
      ...o.contentStyles
    });
    return n({ el: s, boxRef: r, syncValue: a }), (g, w) => (S(), O("div", Bl, [
      re(xe, {
        ref_key: "boxRef",
        ref: r,
        type: e.boxType,
        overflow: "auto",
        "forgive-vertical-overflow": "",
        "extra-styles": e.extraStyles
      }, {
        default: J(() => [
          D("div", {
            ref_key: "el",
            ref: s,
            contenteditable: !e.disabled,
            style: K(v()),
            "data-placeholder": e.placeholder,
            role: "textbox",
            "aria-multiline": e.multiline,
            "aria-disabled": e.disabled,
            onInput: c,
            onKeydown: u,
            onBeforeinput: w[0] || (w[0] = (x) => l("beforeinput", x)),
            onPaste: f,
            onFocus: w[1] || (w[1] = (x) => l("focus")),
            onBlur: d
          }, null, 44, Nl)
        ]),
        _: 1
      }, 8, ["type", "extra-styles"]),
      fe(g.$slots, "default")
    ]));
  }
}), Ao = "/win-55-ui/emoji", sn = `${Ao}/emoji-registry.csv`, mt = [
  "[\\u{1F1E6}-\\u{1F1FF}]{2}",
  "[0-9#*]\\uFE0F?\\u20E3",
  "\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?)*",
  "\\p{Emoji_Presentation}"
].join("|");
let Ft = null, wn = null, Dt = null;
function Al(e) {
  return e.replace(/\/$/, "");
}
function Lo(e) {
  return e.trim().replace(/\.gif$/i, "");
}
function Ll(e) {
  const n = {}, t = e.replace(/^\uFEFF/, "").split(/\r?\n/);
  for (const [o, l] of t.entries()) {
    const r = l.trim();
    if (!r || o === 0 && r.toLowerCase() === "emoji,code")
      continue;
    const s = r.indexOf(",");
    if (s === -1) {
      console.warn(`[win-55-ui] Skipping emoji registry row ${o + 1}: missing comma`);
      continue;
    }
    const a = r.slice(0, s).trim(), c = Lo(r.slice(s + 1));
    a && c && (n[a] = c);
  }
  return n;
}
async function Je(e = {}) {
  const n = e.registryUrl ?? sn;
  return Dt && n === sn ? Dt : ((!Ft || wn !== n) && (wn = n, Ft = fetch(n).then((t) => {
    if (!t.ok)
      throw new Error(
        `Could not load emoji registry from ${n}: ${t.status} ${t.statusText}`
      );
    return t.text();
  }).then(Ll).then((t) => (n === sn && (Dt = t), t))), Ft);
}
function Ca() {
  Ft = null, wn = null, Dt = null;
}
async function Pl(e, n = {}) {
  const o = (await Je(n))[e];
  return o ? _e(o, n) : null;
}
function _e(e, n = {}) {
  return `${Al(n.basePath ?? Ao)}/${Lo(e)}.gif`;
}
async function Sa(e = {}) {
  return Je(e);
}
async function ka(e, n = {}) {
  const t = await Je(n);
  return e in t;
}
Je();
function Ol(e) {
  return e.map((n) => {
    const t = parseInt(n.replace(/^#/, ""), 16);
    return [t >> 16 & 255, t >> 8 & 255, t & 255];
  });
}
function zl(e, n, t, o) {
  let l = 1 / 0, r = [0, 0, 0];
  for (const s of o) {
    const a = e - s[0], c = n - s[1], u = t - s[2], f = a * a + c * c + u * u;
    f < l && (l = f, r = s);
  }
  return r;
}
function Po() {
  return typeof navigator < "u" && /firefox/i.test(navigator.userAgent);
}
const jl = "win55-emoji", Fl = "win55-emoji-image", Ce = 15, yn = 2, Hn = Po(), Dl = [
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
], _l = Ol(Dl), Vn = mt, Hl = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION"
]), tt = /* @__PURE__ */ new WeakMap(), Wn = /* @__PURE__ */ new WeakMap(), Un = /* @__PURE__ */ new Map();
function Vl(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Wl(e) {
  const n = Wn.get(e);
  if (n)
    return n;
  const t = Object.keys(e).sort((r, s) => s.length - r.length).map(Vl), o = t.length > 0 ? `${t.join("|")}|${Vn}` : Vn, l = new RegExp(o, "gu");
  return Wn.set(e, l), l;
}
function Oo(e) {
  return e.value === !1 ? null : typeof e.value == "object" ? e.value : {};
}
const Ul = "data-win55-richtext";
function Yl(e) {
  return Hl.has(e.tagName) || e.hasAttribute("data-win55-emoji");
}
function zo(e) {
  let n = e.parentElement;
  for (; n; ) {
    const t = tt.get(n);
    if (t && Oo(t.binding))
      return !0;
    n = n.parentElement;
  }
  return !1;
}
function Xl(e, n) {
  const t = [], o = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, {
    acceptNode(l) {
      const r = l.parentElement;
      return !r || Yl(r) || n && r.closest(`[${Ul}]`) || !l.nodeValue?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  for (; o.nextNode(); )
    t.push(o.currentNode);
  return t;
}
function Gl() {
  return `${Ce * yn}px`;
}
function Kl(e, n, t, o, l) {
  const r = Math.min(1, Math.max(0, l)), s = e.getImageData(0, 0, n, t), a = s.data;
  for (let c = 0; c < a.length; c += 4) {
    const u = a[c], f = a[c + 1], d = a[c + 2];
    if (a[c + 3] < 80)
      a[c] = 0, a[c + 1] = 0, a[c + 2] = 0, a[c + 3] = 0;
    else {
      const [g, w, x] = zl(
        u,
        f,
        d,
        o
      ), T = Math.round(u + (g - u) * r), B = Math.round(f + (w - f) * r), b = Math.round(d + (x - d) * r);
      a[c] = T, a[c + 1] = B, a[c + 2] = b, a[c + 3] = 255;
    }
  }
  e.putImageData(s, 0, 0);
}
function ql(e, n, t) {
  const o = e.getImageData(0, 0, n, t), l = new Uint8ClampedArray(o.data), r = o.data, s = (a, c) => (c * n + a) * 4;
  for (let a = 0; a < t; a++)
    for (let c = 0; c < n; c++) {
      const u = s(c, a), d = [
        c > 0 ? s(c - 1, a) : -1,
        c < n - 1 ? s(c + 1, a) : -1,
        a > 0 ? s(c, a - 1) : -1,
        a < t - 1 ? s(c, a + 1) : -1
      ].filter((v) => v !== -1).filter((v) => l[v + 3] > 127);
      if (l[u + 3] > 127 && d.length <= 1)
        r[u] = r[u + 1] = r[u + 2] = r[u + 3] = 0;
      else if (l[u + 3] === 0 && d.length >= 3) {
        const v = d[0];
        r[u] = l[v], r[u + 1] = l[v + 1], r[u + 2] = l[v + 2], r[u + 3] = 255;
      }
    }
  e.putImageData(o, 0, 0);
}
function kn(e) {
  const n = Un.get(e);
  if (n)
    return n;
  const t = Jl(e);
  return Un.set(e, t), t;
}
function Jl(e) {
  const n = document.createElement("canvas");
  n.width = Ce, n.height = Ce;
  const t = n.getContext("2d");
  if (!t)
    return "";
  const o = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif', l = Ce * 4;
  t.textBaseline = "alphabetic", t.font = `${l}px ${o}`;
  const r = t.measureText(e), s = r.actualBoundingBoxLeft + r.actualBoundingBoxRight, a = r.actualBoundingBoxAscent + r.actualBoundingBoxDescent;
  if (s > 0 && a > 0) {
    const c = l * Math.min(Ce / s, Ce / a);
    t.font = `${c}px ${o}`;
    const u = t.measureText(e), f = u.actualBoundingBoxLeft + u.actualBoundingBoxRight, d = u.actualBoundingBoxAscent + u.actualBoundingBoxDescent, v = (Ce - f) / 2 + u.actualBoundingBoxLeft, g = (Ce - d) / 2 + u.actualBoundingBoxAscent;
    t.fillText(e, v, g - 0.5), Kl(t, Ce, Ce, _l, 0.1), ql(t, Ce, Ce), ls(n);
  }
  return n.toDataURL("image/png");
}
function Ql(e, n, t) {
  const o = document.createElement("span"), l = document.createElement("img");
  return o.className = t.className ?? jl, o.contentEditable = "false", o.dataset.win55Emoji = e, o.role = "img", o.ariaLabel = e, o.style.setProperty("--win55-emoji-size", Gl()), l.src = n, l.alt = e, l.className = Fl, l.draggable = !1, l.dataset.win55EmojiImg = "true", l.addEventListener("load", () => {
    const r = l.naturalWidth * yn, s = l.naturalHeight * yn;
    o.style.width = `${r}px`, o.style.height = `${s}px`, l.style.width = `${r}px`, l.style.height = `${s}px`;
  }, { once: !0 }), o.append(l), o;
}
function Zl(e, n, t, o) {
  const l = e.parentElement;
  if (!l)
    return;
  const r = window.getSelection(), s = r && r.rangeCount > 0 && r.isCollapsed ? r.getRangeAt(0) : null, a = s?.startContainer === e, c = !!(s && s.startContainer === l && s.startOffset === Array.prototype.indexOf.call(l.childNodes, e) + 1), u = a || c, f = c ? e.nodeValue?.length ?? 0 : a ? s?.startOffset ?? null : null, d = e.nodeValue ?? "";
  let v = 0, g = !1;
  const w = document.createDocumentFragment();
  let x = null, T = 0;
  const B = ($, k) => {
    x || (x = $, T = k);
  };
  n.lastIndex = 0;
  for (const $ of d.matchAll(n)) {
    const k = $[0], m = $.index, I = t[k];
    if (m === void 0)
      continue;
    const L = I ? _e(I, o) : kn(k);
    if (!L)
      continue;
    g = !0;
    const V = d.slice(v, m);
    if (Hn || V.length > 0) {
      const R = document.createTextNode(V);
      f !== null && f >= v && f <= m && B(R, f - v), w.append(R);
    } else f !== null && f >= v && f <= m && B(l, Array.prototype.indexOf.call(l.childNodes, e) + w.childNodes.length);
    const y = Ql(k, L, o);
    w.append(y), f !== null && f > m && f <= m + k.length && B(l, Array.prototype.indexOf.call(l.childNodes, e) + w.childNodes.length), v = m + k.length;
  }
  if (!g)
    return;
  const b = d.slice(v);
  if (Hn || b.length > 0) {
    const $ = document.createTextNode(b);
    f !== null && f >= v && B($, f - v), w.append($);
  } else f !== null && f >= v && B(l, Array.prototype.indexOf.call(l.childNodes, e) + w.childNodes.length);
  if (e.replaceWith(w), u && x) {
    const $ = document.createRange();
    $.setStart(x, T), $.collapse(!0), r?.removeAllRanges(), r?.addRange($);
  }
}
function jo(e, n, t, o) {
  const l = Wl(n);
  if (l)
    for (const r of Xl(e, o))
      Zl(r, l, n, t);
}
const rn = /* @__PURE__ */ new WeakMap();
async function an(e, n = {}) {
  const t = (rn.get(e) ?? 0) + 1;
  rn.set(e, t);
  const o = await Je(n);
  rn.get(e) !== t || !e.isConnected || jo(e, o, n, !1);
}
async function es(e, n) {
  const t = Oo(n.binding);
  if (!t)
    return;
  n.version += 1;
  const o = n.version, l = await Je(t);
  tt.get(e)?.version !== o || !e.isConnected || zo(e) || jo(e, l, t, !0);
}
function xn(e, n) {
  n.renderQueued || (n.renderQueued = !0, n.renderFrame = window.requestAnimationFrame(() => {
    n.renderQueued = !1, n.renderFrame = null, es(e, n).catch((t) => {
      console.warn("[win-55-ui] Could not render custom emoji.", t);
    });
  }));
}
function ts(e, n) {
  const t = window.getSelection();
  if (!t || t.rangeCount === 0 || !n.clipboardData || zo(e))
    return;
  const o = t.getRangeAt(0);
  if (!o.intersectsNode(e))
    return;
  const l = o.cloneContents(), r = Pe(l);
  r && (n.clipboardData.setData("text/plain", r), n.preventDefault());
}
function ns(e, n) {
  const t = new MutationObserver(() => {
    xn(e, n);
  });
  return t.observe(e, {
    characterData: !0,
    childList: !0,
    subtree: !0
  }), t;
}
const os = {
  mounted(e, n) {
    const t = {
      binding: n,
      copyHandler: (o) => ts(e, o),
      observer: null,
      renderFrame: null,
      renderQueued: !1,
      version: 0
    };
    t.observer = ns(e, t), tt.set(e, t), e.addEventListener("copy", t.copyHandler), xn(e, t);
  },
  updated(e, n) {
    const t = tt.get(e);
    t && (t.binding = n, xn(e, t));
  },
  unmounted(e) {
    const n = tt.get(e);
    n && (n.observer?.disconnect(), n.renderFrame !== null && window.cancelAnimationFrame(n.renderFrame), e.removeEventListener("copy", n.copyHandler)), tt.delete(e);
  }
};
function ls(e) {
  const n = e.getContext("2d");
  if (!n) {
    console.warn("Unable to get 2D context from canvas");
    return;
  }
  const t = e.width, o = e.height, l = n.getImageData(0, 0, t, o), r = l.data, s = (d, v) => d < 0 || v < 0 || d >= t || v >= o ? 0 : r[(v * t + d) * 4 + 3], a = Array.from({ length: o }, () => Array(t).fill(!1)), c = [];
  for (let d = 0; d < t; d++)
    s(d, 0) === 0 && !a[0][d] && (a[0][d] = !0, c.push({ x: d, y: 0 })), s(d, o - 1) === 0 && !a[o - 1][d] && (a[o - 1][d] = !0, c.push({ x: d, y: o - 1 }));
  for (let d = 0; d < o; d++)
    s(0, d) === 0 && !a[d][0] && (a[d][0] = !0, c.push({ x: 0, y: d })), s(t - 1, d) === 0 && !a[d][t - 1] && (a[d][t - 1] = !0, c.push({ x: t - 1, y: d }));
  const u = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  for (; c.length; ) {
    const { x: d, y: v } = c.shift();
    for (const [g, w] of u) {
      const x = d + g, T = v + w;
      x >= 0 && x < t && T >= 0 && T < o && !a[T][x] && s(x, T) === 0 && (a[T][x] = !0, c.push({ x, y: T }));
    }
  }
  const f = Array.from({ length: o }, () => Array(t).fill(!1));
  for (let d = 0; d < o; d++)
    for (let v = 0; v < t; v++) {
      if (s(v, d) === 0) continue;
      let g = !1;
      for (const [w, x] of u) {
        const T = v + w, B = d + x;
        if (T < 0 || B < 0 || T >= t || B >= o) {
          g = !0;
          break;
        }
        if (s(T, B) === 0 && a[B][T]) {
          g = !0;
          break;
        }
      }
      g && (f[d][v] = !0);
    }
  for (let d = 0; d < o; d++)
    for (let v = 0; v < t; v++)
      if (f[d][v]) {
        const g = (d * t + v) * 4;
        r[g] = 0, r[g + 1] = 0, r[g + 2] = 0;
      }
  n.putImageData(l, 0, 0);
}
const Ta = os;
function ss(e) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !n.isCollapsed)
    return null;
  const t = n.getRangeAt(0);
  if (!e.contains(t.startContainer))
    return null;
  const o = ot(e), l = t.cloneRange();
  l.collapse(!0);
  const r = document.createElement("span");
  r.textContent = "​", l.insertNode(r);
  const s = r.getBoundingClientRect(), a = r.parentNode;
  return r.remove(), a?.normalize(), vt(e, o), s;
}
const Yn = "/win-55-ui/emoji/emoji-categories.json";
let un = null;
async function Tn() {
  return un || (un = fetch(Yn).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${Yn}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), un;
}
async function rs(e) {
  const n = e.trim().toLowerCase();
  if (!n)
    return [];
  const t = await Tn(), o = [], l = /* @__PURE__ */ new Set();
  for (const r of t) {
    const s = r.shortcodes.find((a) => a.toLowerCase().startsWith(n));
    s && (o.push({ emoji: r.emoji, code: r.code, shortcode: s }), l.add(r.code));
  }
  for (const r of t) {
    if (l.has(r.code))
      continue;
    const s = r.tags.find((a) => a.toLowerCase().startsWith(n));
    s && (o.push({ emoji: r.emoji, code: r.code, shortcode: r.shortcodes[0] ?? s }), l.add(r.code));
  }
  return o;
}
async function Fo(e) {
  const n = e.trim().toLowerCase();
  if (!n)
    return;
  const o = (await Tn()).find((l) => l.shortcodes.some((r) => r.toLowerCase() === n));
  return o ? { emoji: o.emoji, code: o.code } : void 0;
}
const lt = F(!1), We = F({ x: 160, y: 120, width: 360, height: 420 }), Rn = Jo(null);
function Xn(e) {
  Rn.value = e;
}
function as() {
  lt.value = !0;
}
function Gn() {
  lt.value = !1;
}
function is(e) {
  Rn.value?.insertEmoji(e);
}
let Kn = 0;
function us(e) {
  const n = e[Kn % e.length];
  return Kn += 1, n;
}
const cs = ["src"], ds = { class: "shortcode-suggestions" }, fs = {
  key: 0,
  class: "shortcode-suggestion-ellipsis"
}, vs = ["src"], ms = {
  key: 1,
  class: "shortcode-suggestion-ellipsis"
}, hs = "546", Bt = 5, ps = 200, gs = /* @__PURE__ */ oe({
  __name: "RichInput",
  props: {
    modelValue: {},
    placeholder: { default: "" },
    disabled: { type: Boolean, default: !1 },
    maxLength: { default: void 0 },
    boxType: { default: "textarea" },
    extraStyles: { default: void 0 },
    multiline: { type: Boolean, default: !1 },
    wrap: { type: Boolean, default: !0 },
    showEmojiButton: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { expose: n, emit: t }) {
    const o = [
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
    ], l = e, r = t, s = F(null), a = E(() => s.value?.el ?? null), c = () => {
      Ye(), P();
    }, u = () => {
      s.value?.syncValue(), c();
    }, f = /:([A-Za-z0-9_+-]*)$/, d = /:([A-Za-z0-9_+-]{2,}):$/, v = F(!1), g = F(null), w = F([]), x = F(0), T = F(null);
    let B = 0;
    const b = F(0);
    function $(i) {
      i < b.value ? b.value = i : i > b.value + Bt - 1 && (b.value = i - Bt + 1);
    }
    const k = E(() => {
      const i = b.value;
      return w.value.slice(i, i + Bt).map((C, M) => ({ match: C, index: i + M }));
    }), m = E(() => b.value > 0), I = E(() => b.value + Bt < w.value.length), L = () => {
      v.value = !1, g.value = null, w.value = [], x.value = 0, b.value = 0;
    }, V = (i, C) => {
      if (!a.value) return;
      const M = window.getSelection();
      if (!M || M.rangeCount === 0 || !M.isCollapsed) return;
      const z = M.getRangeAt(0), W = z.startContainer;
      if (!(W instanceof Text) || !a.value.contains(W)) return;
      const se = z.startOffset, ie = se - i;
      if (ie < 0) return;
      const ve = W.nodeValue ?? "";
      ke(), W.nodeValue = ve.slice(0, ie) + C + ve.slice(se), X(W, ie + C.length), Te(), u(), an(a.value);
    }, y = () => {
      const i = w.value[x.value];
      !i || g.value === null || (V(1 + g.value.length, i.emoji), L());
    }, R = F(null), A = { insertEmoji: (i) => {
      if (!a.value) return;
      const z = (document.activeElement === a.value ? ot(a.value) : null) ?? R.value ?? Bo(Pe(a.value));
      vt(a.value, z, !0);
      const W = window.getSelection();
      if (!W || W.rangeCount === 0 || !W.isCollapsed) return;
      const se = W.getRangeAt(0);
      ke(), se.deleteContents();
      const ie = document.createTextNode(i);
      se.insertNode(ie), X(ie, ie.length), Te(), u(), an(a.value);
    } }, H = F(!1), Z = E(() => lt.value && Rn.value === A), ue = E(() => l.showEmojiButton && (H.value || Z.value)), de = F(o[0]), le = E(() => Z.value ? hs : de.value), ee = () => {
      de.value = us(o);
    };
    ge(ue, (i) => {
      i && ee();
    });
    const j = () => {
      H.value = !0, Xn(A);
    }, U = () => {
      Xn(A), as();
    }, P = async () => {
      if (!a.value) {
        L();
        return;
      }
      const i = window.getSelection();
      if (!i || i.rangeCount === 0 || !i.isCollapsed) {
        L();
        return;
      }
      const C = i.getRangeAt(0), M = C.startContainer;
      if (!(M instanceof Text) || !a.value.contains(M)) {
        L();
        return;
      }
      const z = (M.nodeValue ?? "").slice(0, C.startOffset), W = v.value ? g.value : null, se = d.exec(z);
      if (se) {
        if (W === se[1]) {
          const zn = await Fo(se[1]);
          zn && V(se[0].length, zn.emoji);
        }
        L();
        return;
      }
      const ve = f.exec(z)?.[1] ?? null;
      if (ve === null || ve.length < 2) {
        L();
        return;
      }
      const je = ss(a.value);
      if (!je) {
        L();
        return;
      }
      const Qe = ++B, On = await rs(ve);
      if (Qe !== B || On.length === 0) {
        Qe === B && L();
        return;
      }
      g.value = ve, w.value = On, x.value = 0, b.value = 0, T.value = { top: je.top, bottom: je.bottom, left: je.left, right: je.right }, v.value = !0;
    }, Y = [], ae = [];
    let Ee = null, pe = null;
    const we = () => a.value ? { html: a.value.innerHTML, caret: ot(a.value) } : null, Oe = (i) => {
      a.value && (a.value.innerHTML = i.html, vt(a.value, i.caret, !0), u());
    }, ke = () => {
      Ee || (Ee = we()), ae.length = 0;
    }, Te = () => {
      pe !== null && (clearTimeout(pe), pe = null), Ee && (Y.push(Ee), Ee = null);
    }, Ye = () => {
      pe !== null && clearTimeout(pe), pe = setTimeout(Te, ps);
    }, Re = () => {
      Te();
      const i = Y.pop();
      if (!i) return;
      const C = we();
      C && ae.push(C), Oe(i);
    }, _ = () => {
      const i = ae.pop();
      if (!i) return;
      const C = we();
      C && Y.push(C), Oe(i);
    }, X = (i, C) => {
      const M = document.createRange(), z = window.getSelection();
      a.value?.focus({ preventScroll: !0 }), M.setStart(i, C), M.collapse(!0), z?.removeAllRanges(), z?.addRange(M);
    }, te = (i) => i instanceof Text ? i.nodeValue?.length ?? 0 : i.childNodes.length, q = (i) => i.parentNode ? Array.prototype.indexOf.call(i.parentNode.childNodes, i) : 0, he = (i, C) => i instanceof Text ? C > 0 ? null : i.previousSibling ?? (i.parentNode && i.parentNode !== a.value ? he(i.parentNode, q(i.parentNode)) : null) : i.childNodes[C - 1] ?? (i.parentNode && i !== a.value ? he(i.parentNode, q(i)) : null), ye = (i, C) => i instanceof Text ? C < (i.nodeValue?.length ?? 0) ? null : i.nextSibling ?? (i.parentNode && i.parentNode !== a.value ? ye(i.parentNode, q(i.parentNode) + 1) : null) : i.childNodes[C] ?? (i.parentNode && i !== a.value ? ye(i.parentNode, q(i) + 1) : null), Ie = (i, C) => {
      let M = i;
      for (; M; ) {
        if (M instanceof HTMLElement && M.hasAttribute("data-win55-emoji"))
          return M;
        if (M instanceof Text) {
          if ((M.nodeValue ?? "").length > 0)
            return null;
          M = C === "backward" ? M.previousSibling : M.nextSibling;
          continue;
        }
        if (M.childNodes.length > 0) {
          M = C === "backward" ? M.childNodes[M.childNodes.length - 1] : M.childNodes[0];
          continue;
        }
        return null;
      }
      return null;
    }, Be = (i) => {
      if (i.cloneContents().querySelector?.("[data-win55-emoji]"))
        return !0;
      const M = i.startContainer instanceof Element ? i.startContainer : i.startContainer.parentElement, z = i.endContainer instanceof Element ? i.endContainer : i.endContainer.parentElement;
      return !!(M?.closest("[data-win55-emoji]") || z?.closest("[data-win55-emoji]"));
    }, ze = (i) => {
      if (!a.value) return;
      const C = i.startContainer, M = i.startOffset;
      i.deleteContents(), C.isConnected && a.value.contains(C) ? X(C, Math.min(M, te(C))) : X(a.value, a.value.childNodes.length), u();
    }, at = (i) => {
      const C = document.createRange();
      return C.setStart(i.startContainer, i.startOffset), C.setEnd(i.endContainer, i.endOffset), C;
    }, Kt = (i) => i instanceof HTMLElement && i.hasAttribute("data-win55-emoji"), qt = (i, C, M) => {
      if (!a.value || i.collapsed || i.startContainer !== i.endContainer || !(i.startContainer instanceof Text))
        return !1;
      const z = i.startContainer, W = z.nodeValue?.length ?? 0;
      if (i.startOffset !== 0 || i.endOffset !== W)
        return !1;
      const se = C === "backward" ? z.previousSibling : z.nextSibling;
      if (!Kt(se) || !z.parentNode)
        return !1;
      M();
      const ie = z.parentNode, ve = q(z);
      return z.remove(), X(ie, ve), u(), !0;
    }, St = (i, C, M) => {
      const z = M === "backward" ? he(i, C) : ye(i, C);
      return Ie(z, M);
    }, kt = (i, C, M, z) => {
      const W = St(i, C, M);
      if (!W || !W.parentNode)
        return !1;
      z();
      const se = W.parentNode, ie = q(W);
      return W.remove(), X(se, ie), u(), !0;
    }, Tt = (i, C, M) => {
      if (!a.value || !a.value.contains(i.startContainer))
        return "none";
      const z = at(i);
      return z.collapsed ? kt(
        i.startContainer,
        i.startOffset,
        C,
        M
      ) ? "deleted" : "none" : Be(z) ? (M(), ze(z), "deleted") : qt(z, C, M) ? "deleted" : Pe(z.cloneContents()) ? "native" : "none";
    }, Jt = (i, C) => {
      if (!a.value) return !1;
      const M = window.getSelection();
      if (!M || M.rangeCount === 0)
        return !1;
      const z = M.getRangeAt(0);
      return a.value.contains(z.startContainer) ? M.isCollapsed ? kt(
        z.startContainer,
        z.startOffset,
        i,
        C
      ) : Be(z) ? (C(), ze(z), !0) : !1 : !1;
    }, Qt = (i) => {
      if (!Po() || i.shiftKey || i.ctrlKey || i.metaKey || i.altKey || i.key !== "ArrowLeft" && i.key !== "ArrowRight" || !a.value) return !1;
      const C = window.getSelection();
      if (!C || C.rangeCount === 0 || !C.isCollapsed) return !1;
      const M = C.getRangeAt(0);
      if (!a.value.contains(M.startContainer)) return !1;
      const z = i.key === "ArrowLeft" ? "backward" : "forward", W = St(M.startContainer, M.startOffset, z);
      return !W || !W.parentNode ? !1 : (i.preventDefault(), X(W.parentNode, q(W) + (z === "forward" ? 1 : 0)), !0);
    }, Rt = (i) => {
      if (v.value) {
        if (i.key === "ArrowDown") {
          i.preventDefault(), x.value = (x.value + 1) % w.value.length, $(x.value);
          return;
        }
        if (i.key === "ArrowUp") {
          i.preventDefault(), x.value = (x.value - 1 + w.value.length) % w.value.length, $(x.value);
          return;
        }
        if (i.key === "Tab" || i.key === " " || i.key === "Enter") {
          i.preventDefault(), y();
          return;
        }
        if (i.key === "Escape") {
          i.preventDefault(), L();
          return;
        }
      }
      Qt(i);
    }, Zt = (i) => {
      if (!a.value) return;
      if (i.inputType === "historyUndo" || i.inputType === "historyRedo") {
        i.preventDefault(), i.inputType === "historyUndo" ? Re() : _();
        return;
      }
      if (ke(), i.inputType !== "deleteContentBackward" && i.inputType !== "deleteContentForward")
        return;
      if (Pe(a.value) === "") {
        i.preventDefault(), a.value.focus({ preventScroll: !0 });
        return;
      }
      const C = i.inputType === "deleteContentBackward" ? "backward" : "forward", M = i.getTargetRanges();
      for (const z of M) {
        const W = Tt(
          z,
          C,
          () => i.preventDefault()
        );
        if (W === "deleted") {
          a.value.focus({ preventScroll: !0 });
          return;
        }
        if (W === "native")
          return;
      }
      Jt(C, () => i.preventDefault()) && a.value.focus({ preventScroll: !0 });
    }, en = (i) => {
      i.preventDefault();
      let C = i.clipboardData?.getData("text/plain") ?? "";
      if (l.multiline || (C = C.replace(/\n/g, " ")), !a.value) return;
      ke();
      const M = window.getSelection(), z = M?.getRangeAt(0);
      if (z) {
        z.deleteContents();
        const W = document.createTextNode(C);
        z.insertNode(W), z.collapse(!1), M?.removeAllRanges(), M?.addRange(z);
      }
      u(), Te(), an(a.value);
    }, tn = () => {
      Te(), L(), H.value = !1, a.value && (R.value = ot(a.value));
    }, h = E(() => l.showEmojiButton ? { paddingRight: "34px" } : void 0), N = E(() => s.value?.boxRef?.verticalBarVisible ? { right: "38px" } : void 0);
    return n({ el: a }), (i, C) => (S(), O(ne, null, [
      re(No, {
        ref_key: "baseRef",
        ref: s,
        "model-value": e.modelValue,
        placeholder: e.placeholder,
        disabled: e.disabled,
        "max-length": e.maxLength,
        "box-type": e.boxType,
        "extra-styles": e.extraStyles,
        "content-styles": h.value,
        multiline: e.multiline,
        wrap: e.wrap,
        "onUpdate:modelValue": C[1] || (C[1] = (M) => r("update:modelValue", M)),
        onInput: c,
        onKeydown: Rt,
        onBeforeinput: Zt,
        onPaste: en,
        onFocus: j,
        onBlur: tn
      }, {
        default: J(() => [
          ue.value ? (S(), O("img", {
            key: 0,
            src: G(_e)(le.value),
            style: K(N.value),
            width: "30",
            height: "30",
            class: "baseinput-emoji-button",
            "data-emoji-picker-trigger": "",
            onMousedown: C[0] || (C[0] = dt(() => {
            }, ["prevent"])),
            onClick: dt(U, ["stop"])
          }, null, 44, cs)) : ce("", !0)
        ]),
        _: 1
      }, 8, ["model-value", "placeholder", "disabled", "max-length", "box-type", "extra-styles", "content-styles", "multiline", "wrap"]),
      v.value && T.value ? (S(), Q(xl, {
        key: 0,
        open: !0,
        anchor: T.value,
        side: "top"
      }, {
        content: J(() => [
          D("div", ds, [
            m.value ? (S(), O("div", fs, "...")) : ce("", !0),
            (S(!0), O(ne, null, me(k.value, ({ match: M, index: z }) => (S(), O("div", {
              key: M.shortcode,
              class: He(["shortcode-suggestion", { "shortcode-suggestion--selected": z === x.value }])
            }, [
              D("img", {
                src: G(_e)(M.code),
                width: "30",
                height: "30",
                class: "shortcode-suggestion-image"
              }, null, 8, vs),
              D("span", null, ":" + $e(M.shortcode) + ":", 1)
            ], 2))), 128)),
            I.value ? (S(), O("div", ms, "...")) : ce("", !0)
          ])
        ]),
        _: 1
      }, 8, ["anchor"])) : ce("", !0)
    ], 64));
  }
}), cn = /* @__PURE__ */ oe({
  __name: "SimpleStringInput",
  props: {
    modelValue: {},
    placeholder: {},
    disabled: { type: Boolean },
    maxLength: {},
    boxType: {},
    extraStyles: {},
    contentStyles: {},
    multiline: { type: Boolean },
    wrap: { type: Boolean },
    allow: {},
    deny: {}
  },
  emits: ["update:modelValue", "input", "keydown", "beforeinput", "paste", "focus", "blur"],
  setup(e, { emit: n }) {
    const t = e, o = n, l = E(() => {
      if (!t.deny) return ln;
      const r = [.../* @__PURE__ */ new Set([...ln.flags, ...t.deny.flags, "u"])].join("");
      return new RegExp(`${ln.source}|${t.deny.source}`, r);
    });
    return (r, s) => (S(), Q(No, jt(t, {
      deny: l.value,
      "onUpdate:modelValue": s[0] || (s[0] = (a) => o("update:modelValue", a)),
      onInput: s[1] || (s[1] = (a) => o("input")),
      onKeydown: s[2] || (s[2] = (a) => o("keydown", a)),
      onBeforeinput: s[3] || (s[3] = (a) => o("beforeinput", a)),
      onPaste: s[4] || (s[4] = (a) => o("paste", a)),
      onFocus: s[5] || (s[5] = (a) => o("focus")),
      onBlur: s[6] || (s[6] = (a) => o("blur"))
    }), {
      default: J(() => [
        fe(r.$slots, "default")
      ]),
      _: 3
    }, 16, ["deny"]));
  }
}), ws = "/win-55-ui/cursors/manifest.json", ys = "/win-55-ui/cursors/scheme.json";
let Xt = {}, $n = {};
const rt = F(0);
let dn = null;
async function qn(e) {
  const n = await fetch(e);
  if (!n.ok) throw new Error(`Could not load ${e}: ${n.status} ${n.statusText}`);
  return n.json();
}
function Gt() {
  return dn || (dn = Promise.all([
    qn(ws),
    qn(ys)
  ]).then(([e, n]) => {
    Xt = e, $n = n, rt.value++;
  })), dn;
}
async function Ra() {
  return await Gt(), $n;
}
const Jn = 2, xs = "/win-55-ui/cursors", Qn = "windows-default", bs = {
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
function Zn(e, n) {
  const t = $n[e]?.roles[n];
  if (!t) return;
  const o = Xt[t];
  if (!(!o || o.hotspotX === null || o.hotspotY === null))
    return t;
}
function ht(e, n) {
  return rt.value, Zn(e, n) ?? (e === Qn ? void 0 : Zn(Qn, n));
}
function Do(e) {
  return rt.value, Xt[e];
}
function pt(e, n) {
  const t = bs[n], o = ht(e, n), l = o ? Xt[o] : void 0;
  return !o || !l ? t : `url("${xs}/${o}/native.gif") ${l.hotspotX ?? 0} ${l.hotspotY ?? 0}, ${t ?? "default"}`;
}
function ut(e, n) {
  const t = pt(e, n);
  return t?.startsWith("url(") || n === "default" ? t : pt(e, "default") ?? t;
}
function et(e, n) {
  if (!e) return n;
  const t = e.lastIndexOf(",");
  return t === -1 ? e : `${e.slice(0, t)}, ${n}`;
}
const _o = /* @__PURE__ */ Symbol("win55ui:cursor-context"), Et = "--win55-cursor", Mn = "--win55-scheme", In = "--win55-cursor-native-link", Bn = "--win55-cursor-native-text", Nn = "--win55-cursor-native-notallowed", Es = "a[href], area[href]", Ho = 'textarea, [contenteditable]:not([contenteditable="false"]), input:not([type]), input[type="text" i], input[type="search" i], input[type="url" i], input[type="tel" i], input[type="email" i], input[type="password" i], input[type="number" i]', gt = "--win55-cursor-native", wt = [
  gt,
  In,
  Bn,
  Nn
], eo = ["cursor", Mn, Et, ...wt], Vo = F(!1);
function to(e) {
  Vo.value = e;
}
function Cs() {
  return Vo.value;
}
function Ss(e) {
  So(_o, e);
}
function ks() {
  return Co(_o, void 0);
}
const An = "__win55CursorContext";
function Ts(e, n) {
  e[An] = n;
}
function Rs(e) {
  delete e[An];
}
let Vt;
function $s(e) {
  Vt = e;
}
function Ms(e) {
  Vt === e && (Vt = void 0);
}
function Is(e) {
  let n = e;
  for (; n; ) {
    const t = n[An];
    if (t) return t;
    n = n.parentElement;
  }
  return Vt;
}
function Ln(e) {
  e.style.removeProperty("cursor"), e.style.removeProperty(Et);
  for (const n of wt) e.style.removeProperty(n);
}
function Bs(e, n, t) {
  const o = (t?.mode.value ?? "native") === "native";
  if (Ln(e), !n) return;
  if (o) {
    const r = t ? t.resolveRoleCss(n) : pt("windows-default", n);
    if (!r) return;
    const s = t ? t.nativeBaseCss.value : ut("windows-default", "default"), a = et(r, s ?? "default");
    e.style.setProperty("cursor", a, "important");
    for (const c of wt) e.style.setProperty(c, a);
    return;
  }
  const l = t ? t.resolveRole(n) : ht("windows-default", n);
  l && (e.style.cursor = "none", e.style.setProperty(Et, l));
}
const Ke = /* @__PURE__ */ new WeakMap();
function Wo(e) {
  return e.strong ?? e.weak;
}
function Ns(e) {
  const n = Ke.get(e);
  if (!n) return;
  n.rev.value;
  const t = Wo(n);
  if (!t) {
    Ln(e);
    return;
  }
  Bs(e, t.role.value, t.context);
}
function As(e, n, t) {
  Gt();
  let o = Ke.get(e);
  if (o || (o = { rev: F(0) }, Ke.set(e, o)), o[n]) {
    const r = n === "strong" ? "v-cursor" : "v-cursor-weak";
    throw new Error(
      `[win-55-ui] two ${r} directives on one element. A reusable component must set its own cursor with v-cursor-weak so a consumer's v-cursor overrides it; two of the same strength on one element is unsupported. Element: ${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""}`
    );
  }
  const l = { role: F(t), context: void 0 };
  o[n] = l, o.rev.value++, Cn(() => {
    const r = Ke.get(e);
    !r || r[n] !== l || (l.context = Is(e), r.stop ? l === Wo(r) && r.rev.value++ : r.stop = _t(() => Ns(e)));
  });
}
function Ls(e, n) {
  const t = Ke.get(e);
  if (t) {
    if (t[n] = void 0, !t.strong && !t.weak) {
      t.stop?.(), Ke.delete(e), Ln(e);
      return;
    }
    t.rev.value++;
  }
}
function Uo(e) {
  return {
    mounted(n, t) {
      As(n, e, t.value);
    },
    updated(n, t) {
      if (t.value === t.oldValue) return;
      const o = Ke.get(n)?.[e];
      o && (o.role.value = t.value);
    },
    unmounted(n) {
      Ls(n, e);
    }
  };
}
const Ps = Uo("strong"), Ct = Uo("weak"), De = /* @__PURE__ */ oe({
  __name: "Button",
  props: {
    boxType: { default: "panel-d-1" },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 },
    contentStyles: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: n }) {
    const t = Ct, o = e, l = n, r = F(!1), s = F(!1), a = E(() => !o.disabled && r.value && s.value), c = E(() => o.disabled), u = (T) => {
      o.disabled || T.button !== 0 || (r.value = !0, s.value = !0);
    }, f = () => {
      o.disabled || (s.value = !0);
    }, d = () => {
      s.value = !1;
    }, v = (T) => {
      o.disabled || T.button !== 0 || (r.value && s.value && l("click"), r.value = !1);
    };
    be(() => {
      window.addEventListener("mouseup", v);
    }), Me(() => {
      window.removeEventListener("mouseup", v);
    });
    const g = E(() => ({
      userSelect: "none",
      width: "fit-content",
      paddingBottom: "4px",
      paddingRight: "4px",
      ...o.extraStyles
    })), w = E(() => ({
      transform: a.value ? "translate(2px, 2px)" : "translate(0, 0)",
      opacity: c.value ? 0.5 : 1
    })), x = E(() => a.value ? "indent" : o.boxType);
    return (T, B) => Ne((S(), Q(xe, {
      type: x.value,
      "extra-styles": g.value,
      "extra-class": e.extraClass,
      onMousedown: u,
      onMouseenter: f,
      onMouseleave: d
    }, {
      default: J(() => [
        D("div", {
          style: K([w.value, e.contentStyles])
        }, [
          fe(T.$slots, "default")
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"])), [
      [G(t), c.value ? "not-allowed" : "default"]
    ]);
  }
}), Os = ["src"], zs = ["src"], js = { class: "number-input-spin" }, Fs = ["src"], Ds = ["src"], Xe = 36, it = 6, Ze = 10, _s = /* @__PURE__ */ oe({
  __name: "NumberInput",
  props: {
    placeholder: {},
    disabled: { type: Boolean },
    maxLength: {},
    boxType: {},
    extraStyles: {},
    contentStyles: {},
    multiline: { type: Boolean },
    wrap: { type: Boolean },
    deny: {},
    modelValue: {},
    variant: { default: "plain" },
    step: { default: 1 },
    min: { default: void 0 },
    max: { default: void 0 }
  },
  emits: ["update:modelValue", "input", "keydown", "beforeinput", "paste", "focus", "blur"],
  setup(e, { emit: n }) {
    const t = Ze + it * 2, o = Xe / 2, l = Xe, r = Xe, s = /[0-9.-]/, a = {
      up: "/win-55-ui/mini-buttons/up.png",
      down: "/win-55-ui/mini-buttons/down.png",
      plus: "/win-55-ui/mini-buttons/plus.png",
      minus: "/win-55-ui/mini-buttons/minus.png"
    }, c = e, u = n, f = E(() => ({
      placeholder: c.placeholder,
      disabled: c.disabled,
      maxLength: c.maxLength,
      boxType: c.boxType,
      multiline: c.multiline,
      wrap: c.wrap,
      deny: c.deny
    })), d = (R) => Math.floor(R / 2) * 2, v = E(() => c.variant === "touchspin" ? l - it * 2 : t - it * 2), g = E(() => c.variant === "touchspin" ? r - it * 2 : o - it * 2), w = E(() => c.variant === "updown" ? { width: "100%", height: `${Xe}px` } : c.variant === "touchspin" ? { height: `${Xe}px` } : { ...c.extraStyles }), x = E(() => ({
      position: "relative",
      height: `${Xe}px`,
      ...c.extraStyles
    })), T = E(() => c.variant !== "updown" ? c.contentStyles ?? {} : { paddingRight: `${t}px`, ...c.contentStyles }), B = E(() => ({
      display: "flex",
      alignItems: "stretch",
      height: `${Xe}px`,
      ...c.extraStyles
    })), b = E(() => ({
      width: `${c.variant === "touchspin" ? l : t}px`,
      height: `${c.variant === "touchspin" ? r : o}px`,
      paddingBottom: 0,
      paddingRight: 0
    })), $ = {
      position: "relative",
      width: "100%",
      height: "100%"
    }, k = (R) => {
      const p = d((v.value - Ze) / 2), A = c.variant === "touchspin" ? d((g.value - Ze) / 2) : R === "down" ? g.value - Ze : 0;
      return {
        position: "absolute",
        left: `${p}px`,
        top: `${A}px`,
        width: `${Ze}px`,
        height: `${Ze}px`,
        display: "block",
        imageRendering: "pixelated"
      };
    }, m = E(() => {
      const R = Number.parseFloat(c.modelValue);
      return Number.isFinite(R) ? R : 0;
    }), I = (R) => Math.min(
      c.max ?? 1 / 0,
      Math.max(c.min ?? -1 / 0, R)
    ), L = (R) => String(Number(R.toFixed(10))), V = (R) => {
      const p = I(m.value + c.step * R);
      u("update:modelValue", L(p));
    }, y = (R) => c.disabled ? !1 : I(m.value + c.step * R) !== m.value;
    return (R, p) => e.variant === "touchspin" ? (S(), O("div", {
      key: 0,
      class: "number-input-touchspin",
      style: K(B.value)
    }, [
      re(De, {
        "extra-styles": b.value,
        "content-styles": $,
        disabled: !y(-1),
        "aria-label": "Decrease",
        onClick: p[0] || (p[0] = (A) => V(-1))
      }, {
        default: J(() => [
          D("img", {
            src: a.minus,
            alt: "",
            draggable: "false",
            style: K(k("minus"))
          }, null, 12, Os)
        ]),
        _: 1
      }, 8, ["extra-styles", "disabled"]),
      re(cn, jt({ class: "number-input-field" }, f.value, {
        "model-value": e.modelValue,
        allow: s,
        "extra-styles": w.value,
        "content-styles": T.value,
        "onUpdate:modelValue": p[1] || (p[1] = (A) => u("update:modelValue", A)),
        onInput: p[2] || (p[2] = (A) => u("input")),
        onKeydown: p[3] || (p[3] = (A) => u("keydown", A)),
        onBeforeinput: p[4] || (p[4] = (A) => u("beforeinput", A)),
        onPaste: p[5] || (p[5] = (A) => u("paste", A)),
        onFocus: p[6] || (p[6] = (A) => u("focus")),
        onBlur: p[7] || (p[7] = (A) => u("blur"))
      }), null, 16, ["model-value", "extra-styles", "content-styles"]),
      re(De, {
        "extra-styles": b.value,
        "content-styles": $,
        disabled: !y(1),
        "aria-label": "Increase",
        onClick: p[8] || (p[8] = (A) => V(1))
      }, {
        default: J(() => [
          D("img", {
            src: a.plus,
            alt: "",
            draggable: "false",
            style: K(k("plus"))
          }, null, 12, zs)
        ]),
        _: 1
      }, 8, ["extra-styles", "disabled"])
    ], 4)) : e.variant === "updown" ? (S(), O("div", {
      key: 1,
      class: "number-input-updown",
      style: K(x.value)
    }, [
      re(cn, jt(f.value, {
        "model-value": e.modelValue,
        allow: s,
        "extra-styles": w.value,
        "content-styles": T.value,
        "onUpdate:modelValue": p[9] || (p[9] = (A) => u("update:modelValue", A)),
        onInput: p[10] || (p[10] = (A) => u("input")),
        onKeydown: p[11] || (p[11] = (A) => u("keydown", A)),
        onBeforeinput: p[12] || (p[12] = (A) => u("beforeinput", A)),
        onPaste: p[13] || (p[13] = (A) => u("paste", A)),
        onFocus: p[14] || (p[14] = (A) => u("focus")),
        onBlur: p[15] || (p[15] = (A) => u("blur"))
      }), null, 16, ["model-value", "extra-styles", "content-styles"]),
      D("div", js, [
        re(De, {
          "extra-styles": b.value,
          "content-styles": $,
          disabled: !y(1),
          "aria-label": "Increase",
          onClick: p[16] || (p[16] = (A) => V(1))
        }, {
          default: J(() => [
            D("img", {
              src: a.up,
              alt: "",
              draggable: "false",
              style: K(k("up"))
            }, null, 12, Fs)
          ]),
          _: 1
        }, 8, ["extra-styles", "disabled"]),
        re(De, {
          "extra-styles": b.value,
          "content-styles": $,
          disabled: !y(-1),
          "aria-label": "Decrease",
          onClick: p[17] || (p[17] = (A) => V(-1))
        }, {
          default: J(() => [
            D("img", {
              src: a.down,
              alt: "",
              draggable: "false",
              style: K(k("down"))
            }, null, 12, Ds)
          ]),
          _: 1
        }, 8, ["extra-styles", "disabled"])
      ])
    ], 4)) : (S(), Q(cn, jt({ key: 2 }, f.value, {
      "model-value": e.modelValue,
      allow: s,
      "extra-styles": w.value,
      "content-styles": T.value,
      "onUpdate:modelValue": p[18] || (p[18] = (A) => u("update:modelValue", A)),
      onInput: p[19] || (p[19] = (A) => u("input")),
      onKeydown: p[20] || (p[20] = (A) => u("keydown", A)),
      onBeforeinput: p[21] || (p[21] = (A) => u("beforeinput", A)),
      onPaste: p[22] || (p[22] = (A) => u("paste", A)),
      onFocus: p[23] || (p[23] = (A) => u("focus")),
      onBlur: p[24] || (p[24] = (A) => u("blur"))
    }), null, 16, ["model-value", "extra-styles", "content-styles"]));
  }
}), $a = /* @__PURE__ */ qe(_s, [["__scopeId", "data-v-80b4dfd3"]]), fn = 160, Hs = ["data-side"], Vs = {
  class: "combo-list-rows",
  role: "listbox"
}, Ws = ["onClick"], vn = 14, no = 24, Nt = 2, mn = 2, Us = /* @__PURE__ */ oe({
  __name: "ComboBox",
  props: {
    modelValue: {},
    placeholder: { default: "" },
    disabled: { type: Boolean, default: !1 },
    maxLength: { default: void 0 },
    boxType: { default: "textarea" },
    extraStyles: { default: void 0 },
    showEmojiButton: { type: Boolean, default: !1 },
    data: { default: void 0 }
  },
  emits: ["update:modelValue", "select"],
  setup(e, { emit: n }) {
    const t = 5 * no + Nt * 2, o = e, l = n, r = Qo(), s = () => !!r?.vnode.props?.onSelect, a = (j) => Math.floor(j / 2) * 2, c = (j) => Math.ceil(j / 2) * 2, u = () => document.documentElement.clientHeight, f = F(null), d = F(36), v = F(null), g = F(null), w = F(!1), x = F(null);
    let T = null, B = null;
    const b = E(() => (o.data ?? []).map((j) => ({
      label: typeof j == "string" ? j : j.key,
      item: j
    }))), $ = E(() => b.value.length * no + Nt * 2), k = (j, U, P) => {
      if (P <= j) return { side: "down", height: P };
      if (t <= j) return { side: "down", height: t };
      if (P <= U) return { side: "up", height: P };
      if (t <= U) return { side: "up", height: t };
      const Y = j >= U ? "down" : "up", ae = Math.max(j, U);
      return { side: Y, height: Math.min(P, Math.max(0, a(ae + mn))) };
    }, m = () => {
      const j = f.value, U = v.value;
      if (!j || !U) return null;
      const P = j.getBoundingClientRect(), Y = U.getBoundingClientRect(), { side: ae, height: Ee } = k(
        u() - P.bottom,
        P.top,
        $.value
      ), pe = {
        // The list spans the whole row, including the drop button.
        left: Y.left + window.scrollX,
        width: a(Y.width),
        height: Ee
      };
      return ae === "down" ? { side: ae, top: P.bottom + window.scrollY, ...pe } : { side: ae, bottom: u() - P.top - window.scrollY, ...pe };
    }, I = () => {
      w.value && (x.value = m());
    }, L = () => {
      const j = f.value?.getBoundingClientRect().height;
      j && (d.value = c(j)), I();
    }, V = () => {
      B !== null && (clearTimeout(B), B = null);
    }, y = () => {
      w.value || (V(), x.value = null);
    }, R = () => {
      w.value = !1, V(), B = setTimeout(() => {
        w.value || (x.value = null);
      }, fn + 32);
    }, p = () => {
      o.disabled || b.value.length === 0 || (V(), x.value = m(), w.value = !0);
    }, A = () => {
      w.value ? R() : p();
    }, H = (j) => {
      typeof j.item == "string" ? (l("select", j.item), s() || l("update:modelValue", j.item)) : l("select", j.item), R();
    }, Z = (j) => {
      if (!w.value) return;
      const U = j.target;
      v.value?.contains(U) || g.value?.contains(U) || R();
    };
    be(() => {
      f.value && (T = new ResizeObserver(L), T.observe(f.value), L()), window.addEventListener("resize", I), window.addEventListener("scroll", I), document.addEventListener("click", Z);
    }), Yt(() => {
      T?.disconnect(), T = null, V(), window.removeEventListener("resize", I), window.removeEventListener("scroll", I), document.removeEventListener("click", Z);
    }), ge(b, () => {
      b.value.length === 0 ? R() : I();
    }), ge(() => o.disabled, (j) => {
      j && R();
    });
    const ue = E(() => ({
      width: `${d.value}px`,
      height: `${d.value}px`,
      paddingBottom: 0,
      paddingRight: 0
    })), de = {
      position: "relative",
      width: "100%",
      height: "100%"
    }, le = E(() => {
      const j = d.value - 12, U = a((j - vn) / 2);
      return {
        position: "absolute",
        left: `${U}px`,
        top: `${U}px`,
        width: `${vn}px`,
        height: `${vn}px`,
        display: "block",
        imageRendering: "pixelated"
      };
    }), ee = E(() => {
      const j = x.value;
      if (!j) return {};
      const U = j.height - Nt, P = j.side === "down" ? -U : U, Y = j.side === "down" ? -mn : mn;
      return {
        position: "absolute",
        left: `${j.left}px`,
        width: `${j.width}px`,
        height: `${j.height}px`,
        ...j.side === "down" ? { top: `${j.top}px` } : { bottom: `${j.bottom}px` },
        "--combo-list-slide": `${fn}ms`,
        "--combo-list-start": `${P}px`,
        "--combo-list-end": `${Y}px`,
        "--combo-list-border": `${Nt}px`
      };
    });
    return (j, U) => (S(), O(ne, null, [
      D("div", {
        ref_key: "rootRef",
        ref: v,
        class: "combo-box",
        style: K(e.extraStyles),
        onKeydown: Zo(R, ["esc"])
      }, [
        D("div", {
          ref_key: "fieldRef",
          ref: f,
          class: "combo-box-field"
        }, [
          re(gs, {
            "model-value": e.modelValue,
            placeholder: e.placeholder,
            disabled: e.disabled,
            "max-length": e.maxLength,
            "box-type": e.boxType,
            "show-emoji-button": e.showEmojiButton,
            "onUpdate:modelValue": U[0] || (U[0] = (P) => l("update:modelValue", P))
          }, null, 8, ["model-value", "placeholder", "disabled", "max-length", "box-type", "show-emoji-button"])
        ], 512),
        re(De, {
          "extra-styles": ue.value,
          "content-styles": de,
          disabled: e.disabled,
          "aria-label": "Toggle options",
          onClick: A
        }, {
          default: J(() => [
            D("img", {
              src: "/win-55-ui/mini-buttons/down-lg.png",
              alt: "",
              draggable: "false",
              style: K(le.value)
            }, null, 4)
          ]),
          _: 1
        }, 8, ["extra-styles", "disabled"])
      ], 36),
      (S(), Q(bt, { to: "body" }, [
        x.value ? (S(), O("div", {
          key: 0,
          ref_key: "listRef",
          ref: g,
          class: "combo-list",
          "data-side": x.value.side,
          style: K(ee.value)
        }, [
          re(el, {
            name: "combo-list",
            appear: "",
            duration: G(fn),
            onAfterLeave: y
          }, {
            default: J(() => [
              w.value ? (S(), Q(xe, {
                key: 0,
                type: "none",
                overflow: "auto"
              }, {
                default: J(() => [
                  D("div", Vs, [
                    (S(!0), O(ne, null, me(b.value, (P, Y) => (S(), O("div", {
                      key: Y,
                      class: "combo-list-row",
                      role: "option",
                      onClick: (ae) => H(P)
                    }, $e(P.label), 9, Ws))), 128))
                  ])
                ]),
                _: 1
              })) : ce("", !0)
            ]),
            _: 1
          }, 8, ["duration"])
        ], 12, Hs)) : ce("", !0)
      ]))
    ], 64));
  }
}), Ma = /* @__PURE__ */ qe(Us, [["__scopeId", "data-v-48dca222"]]), Ys = { style: { display: "flex", "align-items": "center" } }, Xs = ["src", "alt"], Gs = ["checked", "disabled", "value"], Ks = { key: 0 }, Ia = /* @__PURE__ */ oe({
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
    const t = Ct, o = e, l = n, r = () => {
      o.disabled || l("update:modelValue", !o.modelValue);
    };
    return (s, a) => Ne((S(), O("div", {
      class: He(["checkbox-container", { disabled: e.disabled }]),
      style: K({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: e.disabled ? 0.5 : 1,
        userSelect: "none",
        marginBottom: "2px"
      }),
      onClick: r
    }, [
      D("div", Ys, [
        D("img", {
          draggable: "false",
          src: e.modelValue ? e.checkedIcon : e.uncheckedIcon,
          alt: e.modelValue ? "checked" : "unchecked"
        }, null, 8, Xs)
      ]),
      D("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, Gs),
      e.label ? (S(), O("span", Ks, $e(e.label), 1)) : ce("", !0)
    ], 6)), [
      [G(t), e.disabled ? "not-allowed" : "link"]
    ]);
  }
}), oo = 120;
function qs({ onMove: e, onIdentity: n, onLeave: t }) {
  let o = 0, l = 0, r;
  function s(v) {
    o = v.clientX, l = v.clientY, e(o, l);
  }
  function a(v) {
    s(v);
  }
  function c(v) {
    v.target instanceof Element && (o = v.clientX, l = v.clientY, n(v.target));
  }
  function u(v) {
    v.relatedTarget === null && t();
  }
  function f() {
    n(document.elementFromPoint(o, l));
  }
  function d() {
    document.hidden ? (r !== void 0 && (clearInterval(r), r = void 0), t()) : (r === void 0 && (r = window.setInterval(f, oo)), f());
  }
  be(() => {
    window.addEventListener("pointermove", s, { passive: !0 }), "onpointerrawupdate" in window && window.addEventListener("pointerrawupdate", a, { passive: !0 }), document.addEventListener("pointerover", c, { passive: !0 }), document.addEventListener("pointerout", u, { passive: !0 }), document.addEventListener("visibilitychange", d), r = window.setInterval(f, oo);
  }), Me(() => {
    window.removeEventListener("pointermove", s), window.removeEventListener("pointerrawupdate", a), document.removeEventListener("pointerover", c), document.removeEventListener("pointerout", u), document.removeEventListener("visibilitychange", d), r !== void 0 && clearInterval(r);
  });
}
const Js = /\/win-55-ui\/cursors\/([^/"')]+)\/native\.gif/;
function Qs(e) {
  const n = getComputedStyle(e);
  let t = "";
  return e.closest(":disabled") ? t = n.getPropertyValue(Nn) : e.matches(Es) ? t = n.getPropertyValue(In) : e.matches(Ho) && (t = n.getPropertyValue(Bn)), t = t.trim(), t && t !== "none" ? t : n.getPropertyValue(gt).trim();
}
function Zs() {
  let e = null, n = "", t = "", o = "default", l = [], r = 0, s, a = [];
  function c() {
    s !== void 0 && (clearTimeout(s), s = void 0), a = [], e && (e.style.removeProperty("cursor"), e = null);
  }
  function u(v) {
    return t.replace("native.gif", `native-${v}.gif`);
  }
  function f() {
    const v = e;
    if (!v || !v.isConnected) {
      c();
      return;
    }
    const g = (r + l.length - 1) % l.length;
    v.style.setProperty("cursor", `${u(r)}, ${u(g)}, ${o}`, "important");
    const w = l[r] || 60;
    r = (r + 1) % l.length, s = window.setTimeout(f, w);
  }
  function d(v) {
    if (!(v instanceof HTMLElement) || !v.isConnected) return;
    const g = Qs(v), w = Js.exec(g)?.[1], x = w ? Do(w)?.nativeFrameDelays : void 0;
    if (!w || !x || x.length < 2) {
      c();
      return;
    }
    if (v === e && w === n) return;
    c();
    const T = g.indexOf(",", g.indexOf(")") + 1);
    t = (T === -1 ? g : g.slice(0, T)).trim(), o = T === -1 ? "default" : g.slice(T + 1).trim(), a = [];
    for (let B = 0; B < x.length; B++) {
      const b = new Image();
      b.src = `/win-55-ui/cursors/${w}/native-${B}.gif`, b.decode().catch(() => {
      }), a.push(b);
    }
    e = v, n = w, l = x, r = 0, f();
  }
  return Me(c), { evaluate: d, stop: c };
}
const lo = 2, er = /* @__PURE__ */ oe({
  __name: "CursorOverlay",
  setup(e) {
    const n = Zs(), t = F(), o = F();
    let l = "", r = 0, s = 0, a = !1, c = 0, u = 0;
    function f(b) {
      return Math.round(b / lo) * lo;
    }
    function d() {
      const b = `translate(${f(c - r)}px, ${f(u - s)}px)`;
      t.value && (t.value.style.transform = b), o.value && (o.value.style.transform = b);
    }
    function v(b) {
      const $ = t.value, k = o.value;
      if (!$ && !k || b === a) return;
      a = b;
      const m = b ? "visible" : "hidden";
      $ && ($.style.visibility = m), k && (k.style.visibility = m);
    }
    function g(b, $) {
      b && ($ ? (b.src = $, b.style.display = "") : (b.style.display = "none", b.removeAttribute("src")));
    }
    function w(b) {
      if (b === l) {
        v(b !== "");
        return;
      }
      if (l = b, !b) {
        v(!1);
        return;
      }
      const $ = Do(b);
      g(t.value, $?.hasNormal ? `/win-55-ui/cursors/${b}/normal.gif` : void 0), g(o.value, $?.hasInvert ? `/win-55-ui/cursors/${b}/invert.gif` : void 0), r = ($?.hotspotX ?? 0) * Jn, s = ($?.hotspotY ?? 0) * Jn, v(!0), d();
    }
    function x(b) {
      return b.closest("a[href], area[href]") ? "link" : b.closest(Ho) ? "text" : b.closest(":disabled") ? "not-allowed" : "default";
    }
    function T(b) {
      if (!b) return;
      if (b.closest('[data-win55-cursor="off"]')) {
        w(""), n.stop();
        return;
      }
      const $ = getComputedStyle(b);
      if ($.getPropertyValue(gt).trim() !== "none") {
        w(""), n.evaluate(b);
        return;
      }
      n.stop();
      const k = $.getPropertyValue(Et).trim();
      if (k) {
        w(k);
        return;
      }
      const m = $.getPropertyValue(Mn).trim() || "windows-default";
      w(ht(m, x(b)) ?? "");
    }
    function B() {
      w(""), n.stop();
    }
    return qs({
      onMove: (b, $) => {
        c = b, u = $, l && d();
      },
      onIdentity: T,
      onLeave: B
    }), ge(rt, () => T(document.elementFromPoint(c, u))), be(() => {
      Gt();
    }), (b, $) => (S(), Q(bt, { to: "body" }, [
      D("img", {
        ref_key: "invertImg",
        ref: o,
        alt: "",
        style: { position: "fixed", top: "0", left: "0", visibility: "hidden", "pointer-events": "none", "z-index": "2147483647", "image-rendering": "pixelated", "mix-blend-mode": "difference" }
      }, null, 512),
      D("img", {
        ref_key: "normalImg",
        ref: t,
        alt: "",
        style: { position: "fixed", top: "0", left: "0", visibility: "hidden", "pointer-events": "none", "z-index": "2147483647", "image-rendering": "pixelated" }
      }, null, 512)
    ]));
  }
}), Ba = /* @__PURE__ */ oe({
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
    const t = e, o = E(() => t.element ?? "span"), l = ks(), r = E(() => t.scheme ?? l?.scheme.value ?? "windows-default"), s = E(() => t.role ?? l?.role.value), a = E(() => Cs() || (t.disabled ?? l?.disabled.value ?? !1)), c = E(() => t.mode ?? l?.mode.value ?? "native"), u = ft(/* @__PURE__ */ new Set()), f = ft(/* @__PURE__ */ new Set());
    function d(y) {
      u.add(y), y.finally(() => u.delete(y));
    }
    function v(y) {
      f.add(y), y.finally(() => f.delete(y));
    }
    const g = E(() => u.size > 0 || l?.hasBusy.value === !0), w = E(() => f.size > 0 || l?.hasProgress.value === !0);
    function x(y) {
      return y !== void 0 && y !== "default" ? y : g.value ? "wait" : w.value ? "progress" : y;
    }
    function T(y) {
      return ht(r.value, x(y) ?? "default");
    }
    function B(y) {
      return pt(r.value, x(y) ?? "default");
    }
    const b = E(() => {
      if (a.value) return "auto";
      rt.value;
      const y = ut(r.value, "default") ?? "default", R = l?.nativeBaseCss.value;
      return !R || R === "auto" ? y : t.root || t.scheme !== void 0 ? et(y, R) : R;
    }), $ = {
      scheme: r,
      mode: c,
      role: s,
      disabled: a,
      hasBusy: g,
      hasProgress: w,
      resolveRole: T,
      resolveRoleCss: B,
      nativeBaseCss: b,
      addBusy: d,
      addProgress: v
    };
    Ss($), n({ addBusy: d, addProgress: v, resolveRole: T, resolveRoleCss: B }), Gt();
    const k = F();
    be(() => {
      k.value && Ts(k.value, $), t.root && $s($);
    }), Me(() => {
      if (k.value && Rs(k.value), !!t.root) {
        Ms($), to(!1);
        for (const y of eo) document.documentElement.style.removeProperty(y);
      }
    });
    const m = E(() => x(s.value)), I = E(
      () => t.root || t.scheme !== void 0 || t.disabled === !1 || a.value || m.value !== void 0
    ), L = E(() => {
      rt.value;
      const y = r.value, R = m.value, p = {};
      if ((t.root || t.scheme) && (p[Mn] = y), c.value === "immersive") {
        p.cursor = "none", p[gt] = a.value ? "auto" : "none";
        const H = R ? ht(y, R) : void 0;
        return H && (p[Et] = H), p;
      }
      if (!I.value) return p;
      if (a.value) {
        for (const H of wt) p[H] = "auto";
        return p;
      }
      const A = b.value;
      if (R) {
        const H = et(pt(y, R), A);
        for (const Z of wt) p[Z] = H;
        return p;
      }
      return p[gt] = A, p[In] = et(ut(y, "link"), A), p[Bn] = et(ut(y, "text"), A), p[Nn] = et(ut(y, "not-allowed"), A), p;
    }), V = E(() => {
      const y = {};
      return t.element || (y.display = "contents"), t.root || Object.assign(y, L.value), y;
    });
    return t.root && (_t(() => to(t.disableAll === !0)), _t(() => {
      const y = L.value, R = document.documentElement.style;
      for (const p of eo)
        y[p] !== void 0 ? R.setProperty(p, y[p]) : R.removeProperty(p);
    })), (y, R) => (S(), O(ne, null, [
      (S(), Q(ko(o.value), {
        style: K(V.value),
        ref_key: "rootEl",
        ref: k
      }, {
        default: J(() => [
          fe(y.$slots, "default")
        ]),
        _: 3
      }, 8, ["style"])),
      e.root ? (S(), Q(er, { key: 0 })) : ce("", !0)
    ], 64));
  }
}), tr = /* @__PURE__ */ oe({
  __name: "HDivider",
  setup(e) {
    return (n, t) => (S(), Q(xe, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), nr = ["aria-orientation", "aria-valuemax", "aria-valuenow"], or = 23, At = 2, Fe = 6, so = 384, ro = 36, lr = 60, sr = 5, rr = 2, ar = /* @__PURE__ */ oe({
  __name: "ProgressBar",
  props: {
    value: {},
    max: { default: 100 },
    orientation: { default: "horizontal" },
    boxType: { default: "textarea" },
    padding: { default: 2 },
    gap: { default: 2 },
    segmentLength: {},
    segmentCount: {},
    fillStyle: { default: "segmented" },
    width: {},
    height: {},
    fillColor: { default: "#000080" },
    extraStyles: {},
    extraClass: {}
  },
  setup(e) {
    const n = {
      indent: Fe,
      "indent-dark": Fe,
      "panel-d-1": Fe,
      "panel-d-2": Fe,
      textarea: Fe,
      "border-groove": Fe,
      "white-box": Fe,
      notification: 12,
      none: Fe
    }, t = e, o = (_) => Math.round(_ / 2) * 2, l = (_) => Math.floor(_ / 2) * 2, r = (_) => Math.ceil(_ / 2) * 2, s = E(() => t.orientation === "vertical"), a = E(() => r(t.width ?? (s.value ? ro : so))), c = E(() => r(t.height ?? (s.value ? so : ro))), u = E(() => Math.max(0, o(t.padding))), f = E(() => Math.max(0, o(t.gap))), d = E(() => t.segmentLength === void 0 ? void 0 : Math.max(0, r(t.segmentLength))), v = E(() => t.segmentCount === void 0 ? void 0 : Math.max(0, Math.floor(t.segmentCount))), g = E(() => t.boxType === "custom" ? 0 : n[t.boxType]), w = E(() => t.boxType === "custom" ? "none" : t.boxType), x = F(null), T = F(0), B = F(0);
    let b = null;
    const $ = (_, X) => Math.max(0, l(_ > 0 ? _ : X)), k = E(() => $(T.value, a.value - 2 * (g.value + u.value))), m = E(() => $(B.value, c.value - 2 * (g.value + u.value))), I = E(() => s.value ? m.value : k.value), L = E(() => s.value ? k.value : m.value), V = E(() => t.value === void 0), y = (_) => Math.min(t.max, Math.max(0, Number.isFinite(_) ? _ : 0)), R = E(() => t.value === void 0 || !(t.max > 0) ? [] : (Array.isArray(t.value) ? t.value : [{ start: 0, end: t.value, color: t.fillColor }]).flatMap((X) => {
      const te = y(Math.min(X.start, X.end)), q = y(Math.max(X.start, X.end));
      return q > te ? [{ start: te, end: q, color: X.color || t.fillColor }] : [];
    })), p = E(() => V.value ? void 0 : R.value.reduce((_, X) => Math.max(_, X.end), 0)), A = F(0), H = E(() => Math.max(1, Math.round(L.value * 2 / 3) + rr)), Z = E(() => Math.min(I.value, o(H.value * sr))), ue = E(() => {
      const _ = I.value, X = Z.value;
      if (_ <= 0 || X <= 0) return [];
      const te = A.value % _, q = te + X;
      return q <= _ ? [{ start: te, end: q, color: t.fillColor }] : [
        { start: te, end: _, color: t.fillColor },
        { start: 0, end: q - _, color: t.fillColor }
      ];
    }), de = E(() => {
      if (V.value) return ue.value;
      const _ = I.value;
      return !(t.max > 0) || _ <= 0 ? [] : R.value.map((X) => ({
        start: X.start / t.max * _,
        end: X.end / t.max * _,
        color: X.color
      }));
    }), le = E(() => {
      const _ = I.value, X = f.value, te = d.value;
      let q, he;
      if (te !== void 0) {
        if (te < At) return [];
        if (q = Math.floor((_ + X) / (te + X)), q <= 0) return [];
        he = te;
      } else {
        const Ie = v.value ?? or;
        if (Ie <= 0) return [];
        if (q = Math.min(Ie, Math.floor((_ + X) / (At + X))), q <= 0) return [];
        he = l((_ - (q - 1) * X) / q);
      }
      if (he < At) return [];
      const ye = (_ - he * q - (q - 1) * X) / 2;
      return Array.from({ length: q }, (Ie, Be) => he + 2 * (Math.floor((Be + 1) * ye / q) - Math.floor(Be * ye / q)));
    }), ee = E(() => {
      const _ = le.value;
      if (_.length === 0) return [];
      const X = de.value, te = f.value;
      let q = 0;
      return _.map((he) => {
        const ye = q, Ie = ye + he;
        q = Ie + te;
        let Be = "transparent";
        for (const ze of X)
          Math.min(Ie, ze.end) - Math.max(ye, ze.start) >= At - 1e-9 && (Be = ze.color);
        return { length: he, color: Be };
      });
    }), j = E(() => {
      const _ = I.value;
      return _ <= 0 ? [] : de.value.flatMap((X) => {
        const te = o(X.start), q = o(X.end), he = Math.max(0, Math.min(te, q)), ye = Math.min(_, Math.max(te, q));
        return ye > he ? [{ offset: he, length: ye - he, color: X.color }] : [];
      });
    }), U = E(() => ["win55-progressbar", t.extraClass].filter(Boolean).join(" ")), P = E(() => ({
      width: `${a.value}px`,
      height: `${c.value}px`,
      padding: `${u.value}px`,
      overflow: "hidden",
      ...t.boxType === "none" ? {
        borderWidth: `${Fe}px`,
        borderStyle: "solid",
        borderColor: "transparent"
      } : {},
      ...t.extraStyles
    })), Y = E(() => ({
      gap: `${f.value}px`
    })), ae = (_) => s.value ? { height: `${_.length}px`, backgroundColor: _.color } : { width: `${_.length}px`, backgroundColor: _.color }, Ee = (_) => s.value ? { bottom: `${_.offset}px`, height: `${_.length}px`, backgroundColor: _.color } : { left: `${_.offset}px`, width: `${_.length}px`, backgroundColor: _.color }, pe = () => {
      const _ = x.value;
      _ && (T.value = _.clientWidth, B.value = _.clientHeight);
    };
    let we = 0, Oe = 0;
    const ke = (_) => {
      const X = Oe ? _ - Oe : 0;
      Oe = _;
      const te = I.value;
      te > 0 && (A.value = (A.value + X / lr * H.value) % te), we = requestAnimationFrame(ke);
    }, Te = () => {
      we || (Oe = 0, we = requestAnimationFrame(ke));
    }, Ye = () => {
      we && (cancelAnimationFrame(we), we = 0);
    };
    be(() => {
      pe(), b = new ResizeObserver(pe), x.value && b.observe(x.value), V.value && Te();
    }), ge(V, (_) => {
      if (_) {
        Te();
        return;
      }
      Ye(), A.value = 0;
    }), Yt(() => {
      Ye(), b?.disconnect();
    });
    let Re = !1;
    return _t(() => {
      Re || t.segmentLength !== void 0 && t.segmentCount !== void 0 && (Re = !0, console.warn("[ProgressBar] segmentLength and segmentCount are mutually exclusive; segmentLength wins."));
    }), (_, X) => (S(), Q(xe, {
      type: w.value,
      "extra-class": U.value,
      "extra-styles": P.value
    }, {
      default: J(() => [
        D("div", {
          ref_key: "trackRef",
          ref: x,
          class: He(["win55-progressbar-track", e.orientation]),
          style: K(Y.value),
          role: "progressbar",
          "aria-orientation": e.orientation,
          "aria-valuemin": "0",
          "aria-valuemax": e.max,
          "aria-valuenow": p.value
        }, [
          e.fillStyle === "continuous" ? (S(!0), O(ne, { key: 0 }, me(j.value, (te, q) => (S(), O("div", {
            key: q,
            class: "win55-progressbar-fill",
            style: K(Ee(te))
          }, null, 4))), 128)) : (S(!0), O(ne, { key: 1 }, me(ee.value, (te, q) => (S(), O("div", {
            key: q,
            class: "win55-progressbar-segment",
            style: K(ae(te))
          }, null, 4))), 128))
        ], 14, nr)
      ]),
      _: 1
    }, 8, ["type", "extra-class", "extra-styles"]));
  }
}), Na = /* @__PURE__ */ qe(ar, [["__scopeId", "data-v-8ef9dfa1"]]), ir = ["role"], ur = ["data-handle", "tabindex", "aria-orientation", "aria-valuemin", "aria-valuemax", "aria-valuenow", "aria-disabled", "onKeydown"], cr = ["src"], dr = ["src"], ao = 6, io = 4, Ge = 2, uo = 12, co = 2, fr = 16, Lt = 10, fo = 1e-9, vr = /* @__PURE__ */ oe({
  __name: "Slider",
  props: /* @__PURE__ */ xt({
    size: { default: "medium" },
    sizeMax: { default: void 0 },
    orientation: { default: "horizontal" },
    normalized: { type: Boolean, default: !1 },
    rangeColor: { default: "var(--win55-cga-blue, #0000AA)" },
    fixedValues: { default: void 0 },
    min: { default: 0 },
    max: { default: 100 },
    step: { default: 1 },
    disabled: { type: Boolean, default: !1 },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 }
  }, {
    modelValue: { default: 0 },
    modelModifiers: {},
    range: {},
    rangeModifiers: {}
  }),
  emits: ["update:modelValue", "update:range"],
  setup(e) {
    const n = Ct, t = {
      horizontal: {
        small: { src: "/win-55-ui/slider-thumbs/h-small.png", width: 10, height: 16 },
        medium: { src: "/win-55-ui/slider-thumbs/h-medium.png", width: 10, height: 20 },
        large: { src: "/win-55-ui/slider-thumbs/h-large.png", width: 14, height: 26 }
      },
      vertical: {
        small: { src: "/win-55-ui/slider-thumbs/v-small.png", width: 18, height: 10 },
        medium: { src: "/win-55-ui/slider-thumbs/v-medium.png", width: 22, height: 10 },
        large: { src: "/win-55-ui/slider-thumbs/v-large.png", width: 26, height: 14 }
      }
    }, o = e, l = Ae(e, "modelValue"), r = Ae(e, "range"), s = E(() => o.orientation === "vertical"), a = E(() => r.value !== void 0), c = E(() => t[o.orientation][o.size]), u = E(() => t[o.orientation][o.sizeMax ?? o.size]), f = E(() => a.value ? [c.value, u.value] : [c.value]), d = E(() => Math.max(...f.value.map((h) => h.width))), v = E(() => Math.max(...f.value.map((h) => h.height))), g = (h) => Math.min(o.max, Math.max(o.min, h)), w = (h) => Math.round(h / 2) * 2, x = (h) => Math.round((h - 1) / 2) * 2 + 1, T = () => o.step > 0 ? o.step : 1, B = (h) => {
      const N = T(), i = (String(N).split(".")[1] ?? "").length;
      return Number((o.min + h * N).toFixed(i));
    }, b = (h) => g(B(Math.round((g(h) - o.min) / T()))), $ = (h) => o.max === o.min ? 0 : (g(h) - o.min) / (o.max - o.min), k = E(() => {
      const h = (o.fixedValues ?? []).filter((N) => Number.isFinite(N) && N >= o.min && N <= o.max);
      return [...new Set(h)].sort((N, i) => N - i);
    }), m = E(() => k.value.length > 0), I = (h, N) => {
      let i = 0, C = 1 / 0;
      return h.forEach((M, z) => {
        const W = Math.abs(M - N);
        W < C && (i = z, C = W);
      }), i;
    }, L = (h) => k.value[I(k.value, g(h))], V = (h) => m.value ? L(h) : g(h), y = (h) => {
      if (m.value) {
        for (let C = k.value.length - 1; C >= 0; C -= 1)
          if (k.value[C] < h) return k.value[C];
        return null;
      }
      const N = Math.ceil((h - o.min) / T() - fo) - 1;
      if (N < 0) return null;
      const i = B(N);
      return i < h && i >= o.min ? i : null;
    }, R = (h) => {
      if (m.value)
        return k.value.find((C) => C > h) ?? null;
      const N = Math.floor((h - o.min) / T() + fo) + 1, i = B(N);
      return i > h && i <= o.max ? i : null;
    }, p = E(() => {
      const h = r.value;
      return h?.length === 2 ? h : [o.min, o.max];
    }), A = (h, N, i) => ({
      key: h,
      value: V(N),
      thumb: i
    }), H = E(() => {
      const h = A("low", a.value ? p.value[0] : l.value, c.value);
      return a.value ? [h, A("high", p.value[1], u.value)] : [h];
    }), Z = (h) => H.value.find((N) => N.key === h)?.value ?? o.min, ue = E(() => m.value ? k.value[0] : o.min), de = E(() => m.value ? k.value[k.value.length - 1] : o.max), le = (h, N) => {
      let i = m.value ? L(N) : b(N);
      if (!a.value) {
        i !== l.value && (l.value = i);
        return;
      }
      const C = p.value, M = h === "low" ? C[1] : C[0], z = V(M);
      if (o.normalized) {
        if (h === "low" && i >= z) {
          const se = y(z);
          if (se === null) return;
          i = se;
        } else if (h === "high" && i <= z) {
          const se = R(z);
          if (se === null) return;
          i = se;
        }
      }
      const W = h === "low" ? [i, z] : [z, i];
      W[0] === C[0] && W[1] === C[1] || (r.value = W);
    };
    ge([a, () => o.normalized, p, k], () => {
      if (!a.value || !o.normalized) return;
      const h = V(p.value[0]), N = V(p.value[1]);
      if (h !== N) return;
      const i = R(N);
      if (i !== null) {
        r.value = [h, i];
        return;
      }
      const C = y(h);
      C !== null && (r.value = [C, N]);
    }, { immediate: !0 });
    const ee = F(null), j = F(0), U = F(0), P = F(null);
    let Y = null;
    const ae = (h) => s.value ? h.height : h.width, Ee = (h) => s.value ? h.width : h.height, pe = E(() => Math.max(...f.value.map(ae)) / 2), we = (h) => {
      const N = s.value ? U.value : j.value, i = s.value ? 1 - $(h) : $(h), C = pe.value;
      return Math.min(N - C, Math.max(C, x(C + i * (N - C * 2))));
    }, Oe = E(() => ({
      ...s.value ? { width: `${d.value}px`, height: "100%" } : { height: `${v.value + fr}px` },
      opacity: o.disabled ? 0.5 : 1,
      ...o.extraStyles
    })), ke = E(() => {
      const h = s.value ? j.value : U.value;
      return h ? w((h - ao) / 2) : null;
    }), Te = E(() => {
      const h = ke.value, N = `${ao}px`, i = s.value ? `0 ${N} 0 0` : `0 0 ${N} 0`, C = h === null ? s.value ? { left: "50%", transform: "translateX(-50%)" } : { top: "50%", transform: "translateY(-50%)" } : s.value ? { left: `${h}px` } : { top: `${h}px` };
      return {
        position: "absolute",
        ...s.value ? { top: "0", bottom: "0", width: "0px" } : { left: "0", right: "0", height: "0px" },
        ...C,
        boxSizing: "border-box",
        borderWidth: i,
        borderImageWidth: i
      };
    }), Ye = (h) => typeof h == "number" ? `${h}px` : h, Re = (h, N, i) => ({
      left: Ye(N),
      top: Ye(i),
      width: `${h.thumb.width}px`,
      height: `${h.thumb.height}px`
    }), _ = (h) => w(((s.value ? d.value : U.value) - Ee(h)) / 2), X = (h) => {
      const N = we(h.value), i = _(h.thumb);
      return s.value ? Re(h, i, N - h.thumb.height / 2) : Re(h, N - h.thumb.width / 2, i);
    }, te = (h) => {
      const N = s.value ? U.value : j.value, i = s.value ? 1 - $(h.value) : $(h.value);
      return w(i * (N - ae(h.thumb)));
    }, q = (h) => {
      const N = Y === h.key ? P.value : null;
      if (m.value && j.value && U.value && N === null)
        return X(h);
      const i = N ?? h.value, C = s.value ? 1 - $(i) : $(i);
      return s.value ? {
        ...Re(h, (d.value - h.thumb.width) / 2, `${C * 100}%`),
        transform: `translateY(-${C * 100}%)`
      } : {
        ...Re(h, `${C * 100}%`, "50%"),
        transform: `translate(-${C * 100}%, -50%)`
      };
    }, he = (h) => {
      if (!j.value || !U.value) return q(h);
      if (m.value) return X(h);
      const N = te(h), i = _(h.thumb);
      return s.value ? Re(h, i, N) : Re(h, N, i);
    }, ye = (h) => we(h) - Ge / 2, Ie = E(() => {
      if (!a.value) return {};
      const h = ke.value;
      if (!j.value || !U.value || h === null) return { display: "none" };
      const N = h + 2, i = (ie, ve) => ({
        position: "absolute",
        backgroundColor: o.rangeColor,
        pointerEvents: "none",
        ...s.value ? { top: `${ie}px`, height: `${ve}px`, left: `${N}px`, width: `${io}px` } : { left: `${ie}px`, width: `${ve}px`, top: `${N}px`, height: `${io}px` }
      });
      if (m.value) {
        const ie = Math.min(H.value[0].value, H.value[1].value), ve = Math.max(H.value[0].value, H.value[1].value), je = ye(ie), Qe = ye(ve);
        return s.value ? i(Qe, Math.max(Ge, je + Ge - Qe)) : i(je, Math.max(Ge, Qe + Ge - je));
      }
      const C = (ie) => te(ie) + ae(ie.thumb) / 2, M = C(H.value[0]), z = C(H.value[1]), W = w(Math.min(M, z)), se = w(Math.max(M, z));
      return i(W, Math.max(0, se - W));
    }), Be = (h) => {
      const N = ke.value;
      if (!j.value || !U.value || N === null) return { display: "none" };
      const i = ye(h);
      return {
        position: "absolute",
        ...s.value ? {
          left: `${N - co}px`,
          top: `${i}px`,
          width: `${uo}px`,
          height: `${Ge}px`
        } : {
          top: `${N - co}px`,
          left: `${i}px`,
          width: `${Ge}px`,
          height: `${uo}px`
        },
        backgroundColor: "var(--win55-cga-dark-gray, #555555)",
        pointerEvents: "none"
      };
    }, ze = () => {
      const h = ee.value;
      if (!h) return;
      const N = h.getBoundingClientRect();
      j.value = Math.floor(N.width), U.value = Math.floor(N.height);
    };
    let at = null;
    be(() => {
      ze(), at = new ResizeObserver(ze), ee.value && at.observe(ee.value);
    }), Yt(() => {
      at?.disconnect();
    });
    const Kt = (h) => ee.value?.querySelector(`.win55-slider-handle[data-handle="${h}"]`) ?? null, qt = (h) => {
      Kt(h)?.focus({ preventScroll: !0 });
    }, St = (h, N) => {
      if (m.value && j.value && U.value) {
        const M = we(h.value);
        return {
          x: s.value ? N.left + d.value / 2 : N.left + M,
          y: s.value ? N.top + M : N.top + N.height / 2
        };
      }
      const C = (s.value ? 1 - $(h.value) : $(h.value)) * (s.value ? N.height - h.thumb.height : N.width - h.thumb.width) + ae(h.thumb) / 2;
      return {
        x: s.value ? N.left + d.value / 2 : N.left + C,
        y: s.value ? N.top + C : N.top + N.height / 2
      };
    }, kt = (h, N) => {
      if (!a.value || !ee.value) return "low";
      const i = ee.value.getBoundingClientRect();
      let C = "low", M = 1 / 0;
      for (const z of H.value) {
        const W = St(z, i), se = h - W.x, ie = N - W.y, ve = se * se + ie * ie;
        ve < M && (C = z.key, M = ve);
      }
      return C;
    }, Tt = (h, N, i) => {
      const C = ee.value;
      if (!C) return o.min;
      const M = C.getBoundingClientRect(), z = H.value.find((ve) => ve.key === i)?.thumb ?? c.value, W = s.value ? M.height - z.height : M.width - z.width, se = s.value ? N - M.top - z.height / 2 : h - M.left - z.width / 2, ie = W > 0 ? se / W : 0;
      return s.value ? o.max - ie * (o.max - o.min) : o.min + ie * (o.max - o.min);
    }, Jt = (h) => {
      if (o.disabled || h.button !== 0) return;
      const N = kt(h.clientX, h.clientY), i = Tt(h.clientX, h.clientY, N);
      Y = N, P.value = i, qt(N), ee.value?.setPointerCapture(h.pointerId), le(N, i), h.preventDefault();
    }, Qt = (h) => {
      if (!Y) return;
      const N = Tt(h.clientX, h.clientY, Y);
      P.value = N, le(Y, N);
    }, Rt = (h) => {
      Y && (Y = null, P.value = null, ee.value?.hasPointerCapture(h.pointerId) && ee.value.releasePointerCapture(h.pointerId));
    }, Zt = {
      ArrowLeft: "prev",
      ArrowDown: "prev",
      ArrowRight: "next",
      ArrowUp: "next",
      PageDown: "page-prev",
      PageUp: "page-next",
      Home: "min",
      End: "max"
    }, en = (h) => Zt[h] ?? null, tn = (h, N) => {
      if (o.disabled) return;
      const i = en(h.key);
      if (!i) return;
      if (h.preventDefault(), m.value) {
        const z = k.value.length - 1;
        let W = I(k.value, Z(N));
        i === "min" ? W = 0 : i === "max" ? W = z : i === "prev" ? W -= 1 : i === "next" ? W += 1 : i === "page-prev" ? W -= Lt : i === "page-next" && (W += Lt), le(N, k.value[Math.max(0, Math.min(z, W))]);
        return;
      }
      const C = T();
      let M = Z(N);
      i === "min" ? M = o.min : i === "max" ? M = o.max : i === "prev" ? M -= C : i === "next" ? M += C : i === "page-prev" ? M -= C * Lt : i === "page-next" && (M += C * Lt), le(N, M);
    };
    return (h, N) => Ne((S(), O("div", {
      ref_key: "rootRef",
      ref: ee,
      class: He(["win55-slider", e.extraClass ?? ""]),
      style: K(Oe.value),
      role: a.value ? "group" : void 0,
      onPointerdown: Jt,
      onPointermove: Qt,
      onPointerup: Rt,
      onPointercancel: Rt
    }, [
      re(xe, {
        type: "border-groove",
        "extra-styles": Te.value
      }, null, 8, ["extra-styles"]),
      a.value ? (S(), O("div", {
        key: 0,
        class: "win55-slider-range",
        style: K(Ie.value),
        "aria-hidden": "true"
      }, null, 4)) : ce("", !0),
      (S(!0), O(ne, null, me(k.value, (i) => (S(), O("div", {
        key: `notch-${i}`,
        class: "win55-slider-notch",
        style: K(Be(i)),
        "aria-hidden": "true"
      }, null, 4))), 128)),
      (S(!0), O(ne, null, me(H.value, (i) => (S(), O("div", {
        key: i.key,
        class: "win55-slider-handle",
        "data-handle": i.key,
        style: K(q(i)),
        role: "slider",
        tabindex: e.disabled ? -1 : 0,
        "aria-orientation": e.orientation,
        "aria-valuemin": ue.value,
        "aria-valuemax": de.value,
        "aria-valuenow": i.value,
        "aria-disabled": e.disabled || void 0,
        onKeydown: (C) => tn(C, i.key)
      }, [
        D("img", {
          class: "win55-slider-thumb",
          src: i.thumb.src,
          draggable: "false",
          alt: ""
        }, null, 8, cr)
      ], 44, ur))), 128)),
      (S(!0), O(ne, null, me(H.value, (i) => (S(), O("img", {
        key: `faux-${i.key}`,
        class: "win55-slider-faux-thumb",
        src: i.thumb.src,
        style: K(he(i)),
        draggable: "false",
        alt: "",
        "aria-hidden": "true"
      }, null, 12, dr))), 128))
    ], 46, ir)), [
      [G(n), e.disabled ? "not-allowed" : "default"]
    ]);
  }
}), Aa = /* @__PURE__ */ qe(vr, [["__scopeId", "data-v-0166ac43"]]), Le = 2, Ue = (e) => Math.ceil(e / Le) * Le, Wt = (e) => Math.floor(e / Le) * Le, mr = (e) => Math.round(e / Le) * Le;
function bn(e, n, t, o) {
  if (o === "rtl") for (const l of e) l.x = n - l.x - l.w;
  if (o === "btt") for (const l of e) l.y = t - l.y - l.h;
  return e;
}
function En(e, n, t) {
  const o = e.length;
  if (!o) return { starts: [], sizes: [] };
  const l = e.reduce((u, f) => u + f, 0) || o, r = Math.max(0, n - (o - 1) * t), s = [];
  let a = 0;
  for (let u = 0; u < o; u++)
    s.push(mr(r * a / l) + u * t), a += e[u];
  const c = s.map((u, f) => (f === o - 1 ? n : s[f + 1] - t) - u);
  return { starts: s, sizes: c };
}
function hr(e) {
  const n = Ue(e.gap ?? 0), t = Ue(e.itemHeight), o = Wt(e.width), l = e.flow ?? "ltr";
  let r, s;
  if (e.itemWidth !== void 0) {
    const v = Ue(e.itemWidth), g = Math.max(1, Math.floor((o + n) / (v + n)));
    r = Array.from({ length: g }, (w, x) => x * (v + n)), s = Array.from({ length: g }, () => v);
  } else {
    const v = Math.max(1, e.columns ?? 1);
    ({ starts: r, sizes: s } = En(Array(v).fill(1), o, n));
  }
  const a = r.length, c = Math.ceil(e.count / a), u = [];
  for (let v = 0; v < e.count; v++) {
    const g = v % a, w = (v - g) / a;
    u.push({
      x: r[g],
      y: w * (t + n),
      w: s[g],
      h: t,
      row: l === "btt" ? c - w : w + 1,
      col: l === "rtl" ? a - g : g + 1,
      flowRow: w + 1,
      flowCol: g + 1
    });
  }
  const f = Math.max(0, c * t + (c - 1) * n), d = Math.max(f, e.height ?? 0);
  return { rects: bn(u, o, d, l), rows: c, cols: a, height: f };
}
function pr(e) {
  const n = Ue(e.gap ?? 0), t = Ue(e.itemSize), o = Wt(e.width), l = e.flow ?? "ltr";
  if ((e.direction ?? "vertical") === "vertical") {
    const B = Math.max(1, Math.floor((o + n) / (t + n))), b = Array(B).fill(0), $ = Array(B).fill(0), k = [], m = [], I = [];
    for (const R of e.sizes) {
      let p = 0;
      for (let Z = 1; Z < B; Z++) b[Z] < b[p] && (p = Z);
      const A = Ue(R), H = $[p]++;
      m.push(p), I.push(H), k.push({ x: p * (t + n), y: b[p], w: t, h: A, row: 0, col: 0, flowRow: 0, flowCol: 0 }), b[p] += A + n;
    }
    const L = Math.max(...$);
    k.forEach((R, p) => {
      const A = m[p];
      R.row = l === "btt" ? $[A] - I[p] : I[p] + 1, R.col = l === "rtl" ? B - A : A + 1, R.flowRow = I[p] + 1, R.flowCol = A + 1;
    });
    const V = Math.max(0, Math.max(...b) - n), y = Math.max(V, e.height ?? 0);
    return { rects: bn(k, o, y, l), rows: L, cols: B, height: V };
  }
  const s = [], a = [], c = [], u = [];
  let f = 0, d = 0, v = 0;
  for (const B of e.sizes) {
    const b = Ue(B);
    f > 0 && f + b > o && (f = 0, d += t + n, v++);
    const $ = a[v] ?? 0;
    a[v] = $ + 1, c.push(v), u.push($), s.push({ x: f, y: d, w: b, h: t, row: 0, col: 0, flowRow: 0, flowCol: 0 }), f += b + n;
  }
  const g = a.length, w = Math.max(0, ...a);
  s.forEach((B, b) => {
    const $ = c[b];
    B.row = l === "btt" ? g - $ : $ + 1, B.col = l === "rtl" ? a[$] - u[b] : u[b] + 1, B.flowRow = $ + 1, B.flowCol = u[b] + 1;
  });
  const x = Math.max(0, d + t), T = Math.max(x, e.height ?? 0);
  return { rects: bn(s, o, T, l), rows: g, cols: w, height: x };
}
function gr(e) {
  const n = Ue(e.gap ?? 0), t = En(e.columns.trim().split(/\s+/).map(parseFloat), Wt(e.width), n), o = En(e.rows.trim().split(/\s+/).map(parseFloat), Wt(e.height), n), l = e.areas.replace(/"/g, " ").split(/[/\n]/).map((a) => a.trim().split(/\s+/).filter(Boolean)), r = {};
  l.forEach((a, c) => a.forEach((u, f) => {
    if (u === "." || o.starts[c] === void 0 || t.starts[f] === void 0) return;
    const d = r[u];
    if (!d) {
      r[u] = { r0: c, r1: c, c0: f, c1: f };
      return;
    }
    d.r0 = Math.min(d.r0, c), d.r1 = Math.max(d.r1, c), d.c0 = Math.min(d.c0, f), d.c1 = Math.max(d.c1, f);
  }));
  const s = {};
  for (const [a, c] of Object.entries(r)) {
    const u = t.starts[c.c0], f = o.starts[c.r0];
    s[a] = {
      x: u,
      y: f,
      w: t.starts[c.c1] + t.sizes[c.c1] - u,
      h: o.starts[c.r1] + o.sizes[c.r1] - f,
      row: c.r0 + 1,
      col: c.c0 + 1,
      flowRow: c.r0 + 1,
      flowCol: c.c0 + 1
    };
  }
  return { rects: s, rows: o.starts.length, cols: t.starts.length };
}
const La = /* @__PURE__ */ oe({
  __name: "IntGrid",
  props: {
    mode: { default: "fill" },
    itemWidth: { default: 64 },
    itemHeight: { default: 32 },
    columns: { default: 4 },
    gap: { default: 2 },
    direction: { default: "vertical" },
    flow: { default: "ltr" },
    fixedHeight: { type: Boolean, default: !1 },
    areas: {},
    cols: {},
    rows: {},
    extraClass: {},
    extraStyles: {}
  },
  setup(e, { expose: n }) {
    const t = e, o = F(null);
    let l = null, r = null;
    const s = () => o.value ? [...o.value.children] : [];
    function a(d, v, g, w, x) {
      const T = d.style;
      T.position = "absolute", T.left = `${v}px`, T.top = `${g}px`, T.width = `${w}px`, T.height = x === void 0 ? "auto" : `${x}px`;
    }
    function c(d, v) {
      const g = d.dataset;
      g.win55Row = `${v.row}`, g.win55Col = `${v.col}`, g.win55FlowRow = `${v.flowRow}`, g.win55FlowCol = `${v.flowCol}`;
      const w = d.style;
      w.setProperty("--win55-row", `${v.row}`), w.setProperty("--win55-col", `${v.col}`), w.setProperty("--win55-flow-row", `${v.flowRow}`), w.setProperty("--win55-flow-col", `${v.flowCol}`);
    }
    function u(d, v, g) {
      d.dataset.win55Rows = `${v}`, d.dataset.win55Cols = `${g}`, d.style.setProperty("--win55-rows", `${v}`), d.style.setProperty("--win55-cols", `${g}`);
    }
    function f() {
      const d = o.value;
      if (!d) return;
      const v = d.getBoundingClientRect(), g = Math.floor(v.width / Le) * Le, w = Math.floor(v.height / Le) * Le;
      if (t.mode === "areas") {
        if (!t.areas || !t.cols || !t.rows) return;
        const m = gr({
          width: g,
          height: w,
          areas: t.areas,
          columns: t.cols,
          rows: t.rows,
          gap: t.gap
        });
        for (const I of s()) {
          const L = m.rects[I.dataset.intgridArea ?? ""];
          L && (a(I, L.x, L.y, L.w, L.h), c(I, L));
        }
        u(d, m.rows, m.cols);
        return;
      }
      const x = s();
      if (!x.length) {
        t.fixedHeight || (d.style.height = "");
        return;
      }
      let T, B, b = !1, $ = 0, k = 0;
      if (t.mode === "masonry") {
        const m = t.direction === "vertical", I = m ? t.itemWidth : t.itemHeight;
        for (const y of x)
          y.style.position = "absolute", y.style.left = "0px", y.style.top = "0px", y.style.width = m ? `${I}px` : "max-content", y.style.height = m ? "auto" : `${I}px`, l?.observe(y);
        const L = x.map((y) => {
          const R = y.getBoundingClientRect();
          return m ? R.height : R.width;
        }), V = pr({ width: g, sizes: L, itemSize: I, direction: t.direction, gap: t.gap, flow: t.flow, height: t.fixedHeight ? w : void 0 });
        T = V.rects, B = V.height, $ = V.rows, k = V.cols, b = m;
      } else {
        const m = hr({
          width: g,
          count: x.length,
          itemHeight: t.itemHeight,
          itemWidth: t.mode === "fill" ? t.itemWidth : void 0,
          columns: t.mode === "columns" ? t.columns : void 0,
          gap: t.gap,
          flow: t.flow,
          height: t.fixedHeight ? w : void 0
        });
        T = m.rects, B = m.height, $ = m.rows, k = m.cols;
      }
      if (x.forEach((m, I) => {
        const L = T[I];
        L && (a(m, L.x, L.y, L.w, b ? void 0 : L.h), c(m, L));
      }), u(d, $, k), !t.fixedHeight) {
        const m = `${B}px`;
        d.style.height !== m && (d.style.height = m);
      }
    }
    return ge(
      () => [t.mode, t.itemWidth, t.itemHeight, t.columns, t.gap, t.direction, t.flow, t.fixedHeight, t.areas, t.cols, t.rows],
      () => f(),
      { flush: "post" }
    ), be(() => {
      const d = o.value;
      d && (l = new ResizeObserver(() => f()), l.observe(d), r = new MutationObserver(() => f()), r.observe(d, { childList: !0 }), f());
    }), Me(() => {
      l?.disconnect(), r?.disconnect();
    }), n({ layout: f }), (d, v) => (S(), O("div", {
      ref_key: "root",
      ref: o,
      class: He(e.extraClass),
      style: K([{ position: "relative" }, e.extraStyles])
    }, [
      fe(d.$slots, "default")
    ], 6));
  }
}), wr = { class: "menu-dropdown-items" }, Pa = /* @__PURE__ */ oe({
  __name: "MenuDropdown",
  setup(e) {
    return (n, t) => (S(), Q(El, null, {
      trigger: J(() => [
        D("span", null, [
          fe(n.$slots, "trigger")
        ])
      ]),
      items: J(() => [
        re(xe, { type: "panel-d-1" }, {
          default: J(() => [
            D("div", wr, [
              fe(n.$slots, "items")
            ])
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), yr = { style: { display: "flex", "align-items": "center" } }, xr = ["src"], br = ["src"], Er = ["checked", "disabled", "value", "name"], Cr = { key: 0 }, Oa = /* @__PURE__ */ oe({
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
    const t = Ct, o = e, l = n, r = E(() => o.modelValue === o.value), s = (a) => {
      a.preventDefault(), !o.disabled && (r.value || l("update:modelValue", o.value));
    };
    return (a, c) => Ne((S(), O("div", {
      class: He(["radio-container", { disabled: e.disabled }]),
      style: K({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: e.disabled ? 0.5 : 1,
        userSelect: "none",
        marginBottom: "2px"
      }),
      onClick: s
    }, [
      D("div", yr, [
        r.value ? (S(), O("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, xr)) : (S(), O("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, br))
      ]),
      D("input", {
        type: "radio",
        checked: r.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, Er),
      e.label ? (S(), O("span", Cr, $e(e.label), 1)) : ce("", !0)
    ], 6)), [
      [G(t), e.disabled ? "not-allowed" : "link"]
    ]);
  }
}), nt = /* @__PURE__ */ oe({
  __name: "Typography",
  props: {
    element: { default: void 0 },
    display: { default: "inline" },
    fontSize: {},
    isBold: { type: Boolean },
    isItalic: { type: Boolean },
    fontColor: {},
    shorthand: {},
    fontShadowColor: {},
    fontName: {}
  },
  setup(e) {
    const n = e, t = E(() => n.element ?? "span"), o = E(() => {
      const l = $o(n);
      return n.element || (l.display = n.display), l;
    });
    return (l, r) => (S(), Q(ko(t.value), {
      style: K(o.value)
    }, {
      default: J(() => [
        fe(l.$slots, "default")
      ]),
      _: 3
    }, 8, ["style"]));
  }
}), Sr = { key: 1 }, kr = {
  key: 4,
  style: { "text-decoration": "underline" }
}, Tr = {
  key: 5,
  style: { "text-decoration": "line-through" }
}, Rr = ["href"], $r = ["aria-label", "data-win55-emoji"], Mr = ["src", "alt"], Ir = /* @__PURE__ */ oe({
  __name: "RichTextNode",
  props: {
    node: {},
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    function n(t, o) {
      return t ? _e(t) : kn(o);
    }
    return (t, o) => {
      const l = tl("RichTextNode", !0);
      return e.node.type === "text" ? (S(), O(ne, { key: 0 }, [
        st($e(e.node.value), 1)
      ], 64)) : e.node.type === "break" ? (S(), O("br", Sr)) : e.node.type === "bold" ? (S(), Q(nt, {
        key: 2,
        "is-bold": ""
      }, {
        default: J(() => [
          (S(!0), O(ne, null, me(e.node.children, (r, s) => (S(), Q(l, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "italic" ? (S(), Q(nt, {
        key: 3,
        "is-italic": ""
      }, {
        default: J(() => [
          (S(!0), O(ne, null, me(e.node.children, (r, s) => (S(), Q(l, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "underline" ? (S(), O("span", kr, [
        (S(!0), O(ne, null, me(e.node.children, (r, s) => (S(), Q(l, {
          key: s,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "strike" ? (S(), O("span", Tr, [
        (S(!0), O(ne, null, me(e.node.children, (r, s) => (S(), Q(l, {
          key: s,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "color" ? (S(), Q(nt, {
        key: 6,
        "font-color": e.node.value
      }, {
        default: J(() => [
          (S(!0), O(ne, null, me(e.node.children, (r, s) => (S(), Q(l, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-color"])) : e.node.type === "size" && e.allowSizes ? (S(), Q(nt, {
        key: 7,
        "font-size": e.node.value
      }, {
        default: J(() => [
          (S(!0), O(ne, null, me(e.node.children, (r, s) => (S(), Q(l, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-size"])) : e.node.type === "size" ? (S(!0), O(ne, { key: 8 }, me(e.node.children, (r, s) => (S(), Q(l, {
        key: s,
        node: r,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "url" && e.allowLinks ? (S(), O("a", {
        key: 9,
        href: e.node.href,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "richtext-link"
      }, [
        (S(!0), O(ne, null, me(e.node.children, (r, s) => (S(), Q(l, {
          key: s,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ], 8, Rr)) : e.node.type === "url" ? (S(!0), O(ne, { key: 10 }, me(e.node.children, (r, s) => (S(), Q(l, {
        key: s,
        node: r,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "emoji" ? (S(), O("span", {
        key: 11,
        class: "win55-emoji",
        role: "img",
        "aria-label": e.node.emoji,
        "data-win55-emoji": e.node.emoji,
        style: { "--win55-emoji-size": "30px" }
      }, [
        D("img", {
          class: "win55-emoji-image",
          src: n(e.node.code, e.node.emoji),
          alt: e.node.emoji,
          draggable: "false"
        }, null, 8, Mr)
      ], 8, $r)) : ce("", !0);
    };
  }
}), Br = {
  b: "bold",
  i: "italic",
  u: "underline",
  s: "strike",
  strike: "strike",
  color: "color",
  size: "size",
  url: "url"
}, Nr = /* @__PURE__ */ new Set(["br"]), vo = {
  normal: 12,
  big: 24
};
function Yo(e) {
  return e.map((n) => n.type === "text" ? n.value : n.type === "emoji" ? n.emoji : n.type === "break" ? `
` : Yo(n.children)).join("");
}
function mo(e) {
  switch (e.tagType) {
    case "color":
      return { type: "color", value: e.value ?? "inherit", children: e.children };
    case "size": {
      const n = (e.value ?? "").trim().toLowerCase(), t = vo[n], o = Number.parseInt(e.value ?? "", 10);
      return { type: "size", value: t ?? (Number.isFinite(o) ? o : vo.normal), children: e.children };
    }
    case "url":
      return {
        type: "url",
        href: e.value ?? Yo(e.children).trim(),
        children: e.children
      };
    default:
      return { type: e.tagType, children: e.children };
  }
}
function Ar(e, n) {
  for (let t = e.length - 1; t >= 0; t--)
    if (e[t].tagType === n) return t;
  return -1;
}
function Lr(e, n) {
  if (!e) return [];
  if (!n) return [{ type: "text", value: e }];
  const t = [], o = /:([a-zA-Z0-9_+-]+):/g;
  let l = 0, r;
  for (; r = o.exec(e); ) {
    const s = n.get(r[1].toLowerCase());
    s && (r.index > l && t.push({ type: "text", value: e.slice(l, r.index) }), t.push({ type: "emoji", emoji: s.emoji, code: s.code }), l = r.index + r[0].length);
  }
  return l < e.length && t.push({ type: "text", value: e.slice(l) }), t.length > 0 ? t : [{ type: "text", value: e }];
}
function Pr(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const ho = /* @__PURE__ */ new WeakMap(), Or = new RegExp(mt, "gu");
function zr(e) {
  if (!e) return Or;
  const n = ho.get(e);
  if (n) return n;
  const t = Object.keys(e).sort((r, s) => s.length - r.length).map(Pr), o = t.length > 0 ? `${t.join("|")}|${mt}` : mt, l = new RegExp(o, "gu");
  return ho.set(e, l), l;
}
function jr(e, n) {
  const t = zr(n), o = [];
  let l = 0, r;
  for (t.lastIndex = 0; r = t.exec(e); ) {
    const s = r[0], a = n?.[s];
    r.index > l && o.push({ type: "text", value: e.slice(l, r.index) }), o.push({ type: "emoji", emoji: s, code: a }), l = r.index + s.length;
  }
  return l < e.length && o.push({ type: "text", value: e.slice(l) }), o.length > 0 ? o : [{ type: "text", value: e }];
}
function Fr(e, n, t) {
  const o = [];
  for (const l of Lr(e, n))
    l.type === "text" ? o.push(...jr(l.value, t)) : o.push(l);
  return o;
}
function Dr(e, n, t = null) {
  const o = [], l = [], r = /\[(\/?)(\w+)(?:=([^\]]*))?\]/g;
  let s = 0, a;
  const c = () => l.length ? l[l.length - 1].children : o, u = (f) => c().push(...Fr(f, n, t));
  for (; a = r.exec(e); ) {
    const [f, d, v, g] = a, w = v.toLowerCase();
    if (Nr.has(w)) {
      u(e.slice(s, a.index)), s = a.index + f.length, c().push({ type: "break" });
      continue;
    }
    const x = Br[w];
    if (!x) continue;
    if (u(e.slice(s, a.index)), s = a.index + f.length, !d) {
      l.push({ tagType: x, value: g, children: [] });
      continue;
    }
    const T = Ar(l, x);
    if (T === -1) {
      u(f);
      continue;
    }
    for (; l.length > T + 1; ) {
      const b = l.pop();
      l[l.length - 1].children.push(mo(b));
    }
    const B = l.pop();
    c().push(mo(B));
  }
  for (u(e.slice(s)); l.length; ) {
    const f = l.pop();
    (l.length ? l[l.length - 1].children : o).push(...f.children);
  }
  return o;
}
const _r = {
  "data-win55-richtext": "",
  style: { display: "contents" }
}, za = /* @__PURE__ */ oe({
  __name: "RichText",
  props: {
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    const n = Ct, t = e, o = Eo(), l = F(null), r = F(null);
    Tn().then((u) => {
      const f = /* @__PURE__ */ new Map();
      for (const d of u)
        for (const v of d.shortcodes)
          f.set(v.toLowerCase(), { emoji: d.emoji, code: d.code });
      l.value = f;
    }), Je().then((u) => {
      r.value = u;
    });
    const s = E(() => {
      const u = l.value;
      return u ? { get: (f) => u.get(f) } : null;
    });
    function a(u) {
      return u.map((f) => typeof f.children == "string" ? f.children : Array.isArray(f.children) ? a(f.children) : "").join("");
    }
    const c = E(() => Dr(a(o.default?.() ?? []), s.value, r.value));
    return (u, f) => Ne((S(), O("span", _r, [
      (S(!0), O(ne, null, me(c.value, (d, v) => (S(), Q(Ir, {
        key: v,
        node: d,
        "allow-links": t.allowLinks,
        "allow-sizes": t.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
    ])), [
      [G(n), "text"]
    ]);
  }
});
function Hr(e, n, t, o, l) {
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
  ], c = po(o), u = po(l), f = Math.floor(n / s), d = Math.floor(t / s);
  e.width = Math.floor(n * 2) / 2, e.height = Math.floor(t * 2) / 2;
  for (let v = 0; v < d; v++)
    for (let g = 0; g < f; g++) {
      const w = g * s, x = v * s, T = (g + v) / (f + d - 6), B = (a[v % 8][g % 8] + 0.5) / 64, b = T > B ? 1 : 0, $ = Math.round(c.r * (1 - b) + u.r * b), k = Math.round(c.g * (1 - b) + u.g * b), m = Math.round(c.b * (1 - b) + u.b * b);
      r.fillStyle = `rgb(${$}, ${k}, ${m})`, r.fillRect(w, x, s, s);
    }
}
function po(e) {
  const n = e.replace("#", ""), t = parseInt(n, 16);
  return {
    r: t >> 16 & 255,
    g: t >> 8 & 255,
    b: t & 255
  };
}
const Vr = { style: { height: "0", overflow: "visible" } }, Wr = { class: "titlebar-content" }, Ur = { class: "titlebar-image" }, Yr = ["src"], Xr = { class: "titlebar-text" }, Gr = { class: "titlebar-buttons" }, Kr = /* @__PURE__ */ oe({
  __name: "Titlebar",
  props: {
    title: {},
    icon: {},
    showPlaceholderButtons: { type: Boolean },
    gradientColorA: { default: "5555ff" },
    gradientColorB: { default: "0000aa" }
  },
  setup(e) {
    const n = e, t = F(null);
    let o = null;
    function l(s, a) {
      const c = n.gradientColorA, u = n.gradientColorB;
      Hr(s, s.width, s.height, c, u), a.fillStyle = "#555555", a.fillRect(0, s.height - 2, Math.floor(s.width / 2) * 2, 4);
    }
    function r() {
      const s = t.value;
      if (!s) return;
      const a = s.getContext("2d");
      if (!a) return;
      const c = s.getBoundingClientRect(), u = Math.floor(c.width * 2) / 2, f = Math.floor(c.height * 2) / 2;
      (s.width !== u || s.height !== f) && (s.width = u, s.height = f), l(s, a);
    }
    return ge(() => [n.gradientColorA, n.gradientColorB], () => {
      if (t.value) {
        const s = t.value.getContext("2d");
        s && l(t.value, s);
      }
    }), be(() => {
      r(), t.value && (o = new ResizeObserver(() => {
        r();
      }), o.observe(t.value));
    }), Me(() => {
      o?.disconnect();
    }), (s, a) => (S(), O("div", null, [
      D("div", Vr, [
        D("canvas", {
          ref_key: "canvasRef",
          ref: t,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      D("div", Wr, [
        D("div", Ur, [
          D("img", {
            src: e.icon ?? "/win-55-ui/icons/program.png"
          }, null, 8, Yr)
        ]),
        D("div", Xr, [
          re(nt, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: J(() => [
              st($e(e.title), 1)
            ]),
            _: 1
          })
        ]),
        D("div", Gr, [
          fe(s.$slots, "buttons"),
          e.showPlaceholderButtons ? (S(), O(ne, { key: 0 }, [
            re(De, {
              "extra-class": "titlebar-button",
              "box-type": "panel-d-2",
              disabled: ""
            }, {
              default: J(() => [...a[0] || (a[0] = [
                D("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/o.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            re(De, {
              "extra-class": "titlebar-button",
              "box-type": "panel-d-2",
              disabled: ""
            }, {
              default: J(() => [...a[1] || (a[1] = [
                D("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/_.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            a[3] || (a[3] = D("div", { style: { width: "2px" } }, null, -1)),
            re(De, {
              "extra-class": "titlebar-button",
              "box-type": "panel-d-2",
              disabled: ""
            }, {
              default: J(() => [...a[2] || (a[2] = [
                D("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/x.png"
                }, null, -1)
              ])]),
              _: 1
            })
          ], 64)) : ce("", !0)
        ])
      ])
    ]));
  }
}), ja = /* @__PURE__ */ oe({
  __name: "Tooltip",
  props: {
    text: {},
    offsetX: { default: 24 },
    offsetY: { default: 24 }
  },
  setup(e) {
    const n = e, t = F(!1), o = ft({ x: 0, y: 0 });
    let l = null;
    const r = () => {
      l = window.setTimeout(() => {
        t.value = !0;
      }, 400);
    }, s = () => {
      l !== null && (clearTimeout(l), l = null), t.value = !1;
    }, a = (u) => {
      o.x = u.clientX + n.offsetX, o.y = u.clientY + n.offsetY;
    }, c = E(() => ({
      position: "fixed",
      left: `${o.x}px`,
      top: `${o.y}px`,
      pointerEvents: "none",
      whiteSpace: "nowrap",
      zIndex: 1e3
    }));
    return Me(() => {
      l !== null && clearTimeout(l);
    }), (u, f) => (S(), O("span", {
      onMouseenter: r,
      onMouseleave: s,
      onMousemove: a,
      style: { position: "relative", display: "inline-block" }
    }, [
      fe(u.$slots, "default"),
      t.value ? (S(), Q(xe, {
        key: 0,
        style: K(c.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: J(() => [
          st($e(n.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : ce("", !0)
    ], 32));
  }
}), qr = {
  class: "window-container",
  style: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%"
  }
}, Pt = 6, Jr = /* @__PURE__ */ oe({
  __name: "Window",
  props: /* @__PURE__ */ xt({
    title: {},
    icon: {},
    showPlaceholderButtons: { type: Boolean },
    gradientColorA: {},
    gradientColorB: {},
    extraStyles: {},
    extraClass: {},
    minWidth: { default: 240 },
    minHeight: { default: 40 },
    resizable: { type: Boolean },
    resizableHorizontally: { type: Boolean },
    resizableVertically: { type: Boolean },
    faux: { type: Boolean },
    overflow: {},
    overflowX: {},
    overflowY: {},
    forgiveVerticalOverflow: { type: Boolean }
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
    const n = Ps, t = e, o = Ae(e, "x"), l = Ae(e, "y"), r = Ae(e, "width"), s = Ae(e, "height"), a = Math.ceil(t.minWidth / 2) * 2, c = Math.ceil(t.minHeight / 2) * 2, u = E(() => (t.resizable ?? !1) || (t.resizableHorizontally ?? !1)), f = E(() => (t.resizable ?? !1) || (t.resizableVertically ?? !1));
    let d = !1, v = !1;
    const g = F("");
    let w = "";
    const x = {
      n: "ns-resize",
      s: "ns-resize",
      e: "ew-resize",
      w: "ew-resize",
      ne: "nesw-resize",
      sw: "nesw-resize",
      nw: "nwse-resize",
      se: "nwse-resize"
    }, T = E(() => x[g.value] ?? "");
    let B = 0, b = 0, $ = 0, k = 0, m = 0, I = 0;
    const L = (H) => Math.round(H / 2) * 2;
    function V(H) {
      if (t.faux || g.value) return;
      const Z = H.target;
      Z.closest(".titlebar-image") || Z.closest(".titlebar-buttons") || (d = !0, B = H.clientX, b = H.clientY, m = o.value, I = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", R), window.addEventListener("mouseup", p));
    }
    function y(H) {
      t.faux || g.value && (!u.value && !f.value || (v = !0, w = g.value, B = H.clientX, b = H.clientY, $ = r.value, k = s.value, m = o.value, I = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", R), window.addEventListener("mouseup", p)));
    }
    function R(H) {
      if (t.faux) return;
      const Z = H.clientX - B, ue = H.clientY - b;
      if (d && (o.value = L(m + Z), l.value = L(I + ue)), v) {
        const de = w;
        let le = L(m), ee = L(I), j = L(m + $), U = L(I + k);
        u.value && de.includes("e") && (j = Math.max(le + a, L(m + $ + Z))), f.value && de.includes("s") && (U = Math.max(ee + c, L(I + k + ue))), u.value && de.includes("w") && (le = Math.min(j - a, L(m + Z))), f.value && de.includes("n") && (ee = Math.min(U - c, L(I + ue))), o.value = le, l.value = ee, r.value = j - le, s.value = U - ee;
      }
    }
    function p() {
      d = !1, v = !1, w = "", g.value = "", document.body.style.userSelect = "", window.removeEventListener("mousemove", R), window.removeEventListener("mouseup", p);
    }
    function A(H) {
      if (t.faux) {
        g.value = "";
        return;
      }
      if (v) return;
      if (!u.value && !f.value) {
        g.value = "";
        return;
      }
      const ue = H.currentTarget.getBoundingClientRect(), de = H.clientX - ue.left, le = ue.right - H.clientX, ee = H.clientY - ue.top, j = ue.bottom - H.clientY;
      let U = "";
      f.value && (ee < Pt ? U += "n" : j < Pt && (U += "s")), u.value && (de < Pt ? U += "w" : le < Pt && (U += "e")), g.value = U;
    }
    return (H, Z) => Ne((S(), Q(xe, {
      "extra-class": e.extraClass,
      "extra-styles": t.faux ? e.extraStyles : {
        position: "absolute",
        left: o.value + "px",
        top: l.value + "px",
        width: r.value + "px",
        height: s.value + "px",
        ...e.extraStyles
      },
      type: "panel-d-2",
      onMousemove: A,
      onMousedown: y
    }, {
      default: J(() => [
        D("div", qr, [
          D("div", {
            class: "titlebar-wrapper",
            onMousedown: dt(V, ["stop"]),
            style: { height: "34px" }
          }, [
            re(Kr, {
              title: e.title,
              icon: e.icon,
              "show-placeholder-buttons": e.showPlaceholderButtons,
              "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
              "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
            }, {
              buttons: J(() => [
                fe(H.$slots, "titlebar-buttons")
              ]),
              _: 3
            }, 8, ["title", "icon", "show-placeholder-buttons", "gradient-color-a", "gradient-color-b"])
          ], 32),
          re(xe, {
            type: "none",
            "overflow-x": t.overflowX ?? t.overflow ?? "auto",
            "overflow-y": t.overflowY ?? t.overflow ?? "auto",
            "forgive-vertical-overflow": t.forgiveVerticalOverflow,
            "extra-styles": {
              flex: "1",
              minHeight: "0",
              marginTop: "4px"
            }
          }, {
            default: J(() => [
              fe(H.$slots, "default")
            ]),
            _: 3
          }, 8, ["overflow-x", "overflow-y", "forgive-vertical-overflow"])
        ])
      ]),
      _: 3
    }, 8, ["extra-class", "extra-styles"])), [
      [G(n), T.value]
    ]);
  }
}), Qr = { class: "label" }, Zr = { class: "label-text" }, ea = /* @__PURE__ */ oe({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" },
    extraStyles: {}
  },
  setup(e) {
    return (n, t) => (S(), Q(xe, {
      type: "border-groove",
      "extra-styles": { padding: "10px", margin: "10px", ...e.extraStyles }
    }, {
      default: J(() => [
        D("div", Qr, [
          D("div", {
            class: "line-hider",
            style: K({ backgroundColor: e.backgroundColorHint })
          }, null, 4),
          D("div", Zr, $e(e.label), 1)
        ]),
        fe(n.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }, 8, ["extra-styles"]));
  }
}), Fa = /* @__PURE__ */ qe(ea, [["__scopeId", "data-v-52cb0766"]]), go = "/win-55-ui/emoji/emoji-by-category.json";
let hn = null;
async function wo() {
  return hn || (hn = fetch(go).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${go}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), hn;
}
const ta = { class: "emoji-picker-body" }, na = { class: "emoji-picker-tabs" }, oa = ["onClick"], la = { class: "emoji-picker-grid" }, sa = ["src", "title", "onClick"], ra = "546", Da = /* @__PURE__ */ oe({
  __name: "EmojiPickerWindow",
  setup(e) {
    const n = F(null), t = F([]), o = F(null), l = F(void 0), r = E(() => t.value.find((u) => u.category === o.value) ?? null);
    async function s() {
      if (Math.random() < 0.75) {
        l.value = _e(ra);
        return;
      }
      const f = (await wo()).flatMap((v) => v.emojis);
      if (f.length === 0) return;
      const d = f[Math.floor(Math.random() * f.length)];
      l.value = _e(d.code);
    }
    ge(lt, async (u) => {
      u && (s(), t.value.length === 0 && (t.value = await wo(), o.value = t.value[0]?.category ?? null));
    }, { immediate: !0 });
    function a(u) {
      o.value = u;
    }
    function c(u) {
      if (!lt.value) return;
      const f = u.target;
      n.value?.contains(f) || Gn();
    }
    return be(() => {
      document.addEventListener("click", c);
    }), Me(() => {
      document.removeEventListener("click", c);
    }), (u, f) => (S(), Q(bt, { to: "body" }, [
      G(lt) ? (S(), O("div", {
        key: 0,
        ref_key: "rootRef",
        ref: n,
        style: { display: "contents" }
      }, [
        re(Jr, {
          x: G(We).x,
          "onUpdate:x": f[0] || (f[0] = (d) => G(We).x = d),
          y: G(We).y,
          "onUpdate:y": f[1] || (f[1] = (d) => G(We).y = d),
          width: G(We).width,
          "onUpdate:width": f[2] || (f[2] = (d) => G(We).width = d),
          height: G(We).height,
          "onUpdate:height": f[3] || (f[3] = (d) => G(We).height = d),
          resizable: "",
          title: "Emoji Picker",
          icon: l.value,
          "min-width": 240,
          "min-height": 200,
          "overflow-x": "hidden",
          "overflow-y": "hidden",
          "extra-class": "emoji-picker-window",
          "extra-styles": { zIndex: 1200 }
        }, {
          "titlebar-buttons": J(() => [
            re(De, {
              "extra-class": "titlebar-button",
              "box-type": "panel-d-2",
              onClick: G(Gn)
            }, {
              default: J(() => [...f[4] || (f[4] = [
                D("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/x.png"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]),
          default: J(() => [
            re(xe, {
              type: "textarea",
              "extra-styles": { width: "100%", height: "calc(100% - 2px)", marginTop: "2px", padding: "2px" }
            }, {
              default: J(() => [
                D("div", ta, [
                  D("div", na, [
                    (S(!0), O(ne, null, me(t.value, (d) => (S(), O("span", {
                      key: d.category,
                      class: He(["emoji-picker-tab", { "emoji-picker-tab--selected": d.category === o.value }]),
                      onClick: (v) => a(d.category)
                    }, [
                      re(nt, {
                        shorthand: d.category === o.value ? "Bold12" : "Regular12"
                      }, {
                        default: J(() => [
                          st($e(d.category), 1)
                        ]),
                        _: 2
                      }, 1032, ["shorthand"])
                    ], 10, oa))), 128))
                  ]),
                  re(tr),
                  re(xe, {
                    type: "none",
                    "overflow-y": "auto",
                    "extra-class": "emoji-picker-scroll"
                  }, {
                    default: J(() => [
                      D("div", la, [
                        (S(!0), O(ne, null, me(r.value?.emojis ?? [], (d) => (S(), O("div", {
                          key: d.code,
                          class: "emoji-picker-grid-cell"
                        }, [
                          D("img", {
                            src: G(_e)(d.code),
                            title: d.shortcodes[0] ? `:${d.shortcodes[0]}:` : void 0,
                            class: "emoji-picker-grid-item",
                            onClick: (v) => G(is)(d.emoji)
                          }, null, 8, sa)
                        ]))), 128))
                      ])
                    ]),
                    _: 1
                  })
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["x", "y", "width", "height", "icon"])
      ], 512)) : ce("", !0)
    ]));
  }
}), aa = ["src", "alt", "width", "height"], yo = 15, Ot = 2, _a = /* @__PURE__ */ oe({
  __name: "Emoji",
  props: {
    emoji: {}
  },
  setup(e) {
    const n = e, t = new RegExp(`^(?:${mt})$`, "u"), o = F(""), l = F(n.emoji), r = F(yo * Ot), s = F(yo * Ot);
    async function a(u) {
      if (t.test(u)) {
        l.value = u;
        const d = await Pl(u);
        o.value = d ?? kn(u);
        return;
      }
      const f = await Fo(u);
      if (f) {
        l.value = f.emoji, o.value = _e(f.code);
        return;
      }
      console.warn(`[win-55-ui] Emoji: could not resolve "${u}" as an emoji or a shortcode alias.`), l.value = u, o.value = "";
    }
    ge(() => n.emoji, (u) => {
      a(u);
    }, { immediate: !0 });
    function c(u) {
      const f = u.target;
      r.value = f.naturalWidth * Ot, s.value = f.naturalHeight * Ot;
    }
    return (u, f) => (S(), O("img", {
      class: "win55-emoji-standalone",
      src: o.value,
      alt: l.value,
      width: r.value,
      height: s.value,
      draggable: "false",
      onLoad: c
    }, null, 40, aa));
  }
}), Ha = (e, n = 20, t = 48, o = 30) => {
  const l = F(
    Array.from({ length: e }, (u, f) => ({
      sin: Math.sin(0 + f * Math.PI * 2 / e),
      cos: Math.cos(0 + f * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let r = 0, s = 0;
  const a = n > 0 ? 1e3 / n : 0, c = () => {
    r = requestAnimationFrame(c);
    const u = Date.now();
    if (u - s < a) return;
    s = u;
    const f = Array.from({ length: e }, (w, x) => ({
      sin: Math.sin(u / (1e3 + x * 200) + x * Math.PI * 2 / e),
      cos: Math.cos(u / (3e3 + x * 400) + x * Math.PI * 2 / e + Math.PI / 4)
    })), d = f.map((w) => t + w.sin * o), v = e * t, g = d.reduce((w, x) => w + x, 0);
    if (g > 0) {
      const w = v / g;
      l.value = f.map((x) => ({
        sin: ((t + x.sin * o) * w - t) / o,
        cos: x.cos
      }));
    } else
      l.value = f;
  };
  return be(() => {
    r = requestAnimationFrame(c);
  }), Me(() => {
    cancelAnimationFrame(r);
  }), { values: l };
}, ia = 8, ua = "win-55-ui/assets.json", Xo = "/", xo = `${Xo}${ua}`, ca = /* @__PURE__ */ new Set(["avif", "bmp", "gif", "ico", "jpeg", "jpg", "png", "svg", "webp"]), da = /* @__PURE__ */ new Set(["otf", "ttf", "woff", "woff2"]), Se = ft({
  total: 0,
  loaded: 0,
  percent: 0,
  done: !1
}), pn = /* @__PURE__ */ new Set(), ct = [];
let gn = null, yt = !1, zt = null;
function Ut() {
  Se.percent = Se.total === 0 ? yt ? 100 : 0 : Math.floor(Se.loaded / Se.total * 100), Se.done = yt && Se.loaded >= Se.total;
}
function fa(e) {
  const n = e.trim();
  return n ? /^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(n) || n.startsWith("/") ? n : `${Xo}${n}` : "";
}
function Go(e) {
  const n = fa(e);
  !n || pn.has(n) || (pn.add(n), ct.push(n), Se.total = pn.size, Ut());
}
function Ko() {
  return gn || (gn = (async () => {
    try {
      const e = await fetch(xo);
      if (!e.ok) throw new Error(`${e.status} ${e.statusText}`);
      const n = await e.json();
      if (!Array.isArray(n)) throw new Error("expected an array of paths");
      for (const t of n)
        typeof t == "string" && Go(t);
    } catch (e) {
      console.warn(`[win-55-ui] Could not load ${xo}: ${e.message}`);
    }
  })()), gn;
}
function va(e) {
  const n = e.split(/[?#]/)[0], t = n.lastIndexOf(".");
  return t === -1 ? "" : n.slice(t + 1).toLowerCase();
}
function ma(e) {
  const n = e.split(/[?#]/)[0], t = n.slice(n.lastIndexOf("/") + 1), o = t.lastIndexOf(".");
  return o === -1 ? t : t.slice(0, o);
}
function ha(e) {
  const n = new Image();
  return n.src = e, typeof n.decode == "function" ? n.decode() : new Promise((t, o) => {
    n.onload = () => t(), n.onerror = () => o(new Error(`Could not preload image ${e}`));
  });
}
async function qo(e) {
  const n = await fetch(e);
  if (!n.ok) throw new Error(`Could not preload ${e}: ${n.status} ${n.statusText}`);
  await n.arrayBuffer();
}
async function pa(e) {
  const n = ma(e);
  if (n && typeof document < "u" && document.fonts)
    try {
      if ((await document.fonts.load(`16px "${n}"`)).length > 0) return;
    } catch {
    }
  await qo(e);
}
async function ga(e) {
  const n = va(e);
  return ca.has(n) ? ha(e) : da.has(n) ? pa(e) : qo(e);
}
async function wa() {
  const e = async () => {
    for (let t = ct.shift(); t !== void 0; t = ct.shift()) {
      try {
        await ga(t);
      } catch (o) {
        console.warn(`[win-55-ui] Could not preload ${t}: ${o.message}`);
      }
      Se.loaded += 1, Ut();
    }
  }, n = Math.min(ia, Math.max(ct.length, 1));
  await Promise.all(Array.from({ length: n }, e));
}
function Pn() {
  return zt || (zt = wa().finally(() => {
    zt = null, ct.length && Pn();
  })), zt;
}
function ya(e) {
  Go(e), yt && Pn();
}
async function xa() {
  if (typeof document > "u") {
    yt = !0, Se.loaded = Se.total, Ut();
    return;
  }
  await Ko(), yt = !0, Ut(), await Pn();
}
const ba = {
  progress: Se,
  addPreloadPath: ya,
  startPreload: xa
};
let bo = !1;
function Va() {
  return bo || (bo = !0, typeof document < "u" && Ko()), ba;
}
function Wa(e) {
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
  xl as Balloon,
  El as BaseDropdown,
  No as BaseInput,
  xe as Box,
  De as Button,
  Le as CELL,
  fn as COMBO_LIST_SLIDE_MS,
  _o as CURSOR_CONTEXT_KEY,
  Ia as Checkbox,
  Ma as ComboBox,
  Ba as CursorContext,
  _a as Emoji,
  Da as EmojiPickerWindow,
  tr as HDivider,
  La as IntGrid,
  Pa as MenuDropdown,
  Fa as NamedPanel,
  $a as NumberInput,
  Na as ProgressBar,
  Oa as RadioButton,
  gs as RichInput,
  za as RichText,
  cn as SimpleStringInput,
  Aa as Slider,
  Kr as Titlebar,
  ja as Tooltip,
  nt as Typography,
  Jr as Window,
  Rn as activeTarget,
  gr as areaGrid,
  Gn as closePicker,
  Ps as cursorDirective,
  Ct as cursorWeakDirective,
  Ta as customEmojiDirective,
  Hr as drawAngledBayerDitherGradient,
  os as emojiDirective,
  Pl as getEmojiGifPath,
  _e as getEmojiGifPathFromCode,
  Sa as getEmojiRegistry,
  ot as getSelectionOffset,
  Pe as getTextWithCustomEmoji,
  ka as hasEmoji,
  is as insertEmoji,
  Je as loadEmojiRegistry,
  Ra as loadSchemeIndex,
  pr as masonryGrid,
  as as openPicker,
  us as pickNextButtonIcon,
  lt as pickerOpen,
  We as pickerPosition,
  Ss as provideCursorContext,
  Xn as registerActiveInput,
  Wa as registerGlobalImageErrorHandler,
  hr as repeatGrid,
  Ca as resetEmojiRegistryCache,
  vt as restoreSelectionOffset,
  $o as typographyStyles,
  ks as useCursorContext,
  Ha as useSineWave,
  Va as useWin55Preload
};
