import { defineComponent as G, computed as T, ref as A, onMounted as ae, onBeforeUnmount as lo, openBlock as h, createElementBlock as N, normalizeClass as je, createElementVNode as B, withDirectives as he, vShow as Xe, withModifiers as _e, normalizeStyle as Y, createCommentVNode as K, reactive as nt, watch as ie, useModel as be, unref as M, Fragment as X, createBlock as H, renderSlot as Z, mergeModels as rt, useSlots as yn, nextTick as kt, onUnmounted as fe, Teleport as st, createVNode as ne, withCtx as W, createTextVNode as Ae, toDisplayString as ue, shallowRef as ro, renderList as oe, inject as so, provide as io, watchEffect as bt, resolveDynamicComponent as xn, resolveComponent as ao } from "vue";
const co = ["src"], uo = ["src"], fo = {
  key: 0,
  class: "sb-nubs"
}, vo = ["src"], mo = ["src"], ft = 32, ho = 500, po = 50, go = 28, wo = /* @__PURE__ */ G({
  __name: "ScrollBar",
  props: {
    orientation: {},
    scrollPos: {},
    viewportSize: {},
    contentSize: {}
  },
  emits: ["scrollTo", "scrollBy"],
  setup(e, { emit: n }) {
    const t = e, l = n, o = T(() => t.orientation === "vertical"), r = T(() => o.value ? "up" : "left"), s = T(() => o.value ? "down" : "right"), c = (O, V) => `/win-55-ui/whole-components/scrollbar-buttons/btn-${O}${V ? "-pressed" : ""}.png`, i = A(null), u = A(0);
    let d = null;
    function f() {
      const O = i.value;
      O && (u.value = o.value ? O.offsetHeight : O.offsetWidth);
    }
    ae(() => {
      f(), d = new ResizeObserver(f), i.value && d.observe(i.value);
    });
    const v = T(() => t.contentSize - t.viewportSize), x = T(() => v.value > 0), y = (O) => Math.round(O / 2) * 2, g = T(() => {
      if (!x.value) return 0;
      const O = y(u.value * t.viewportSize / t.contentSize);
      return Math.min(u.value, Math.max(go, O));
    }), S = T(() => {
      const O = u.value - g.value;
      return !x.value || O <= 0 ? 0 : Math.min(O, Math.max(0, y(t.scrollPos / v.value * O)));
    }), j = T(() => g.value > 50), p = T(
      () => o.value ? { height: `${g.value}px`, transform: `translateY(${S.value}px)` } : { width: `${g.value}px`, transform: `translateX(${S.value}px)` }
    );
    let k = 0;
    function I() {
      clearTimeout(k);
    }
    function z(O) {
      I(), O(), k = window.setTimeout(function V() {
        O(), k = window.setTimeout(V, po);
      }, ho);
    }
    lo(() => {
      I(), d?.disconnect();
    });
    const w = A(null);
    function L(O, V) {
      O.button === 0 && (O.currentTarget.setPointerCapture(O.pointerId), w.value = V, z(() => l("scrollBy", V === "start" ? -ft : ft)));
    }
    function _() {
      w.value = null, I();
    }
    const m = (O) => o.value ? O.clientY : O.clientX;
    let R = 0, C = !1;
    function P(O) {
      const ee = i.value.getBoundingClientRect();
      return o.value ? O.clientY - ee.top : O.clientX - ee.left;
    }
    function F(O) {
      O.button !== 0 || !x.value || (i.value.setPointerCapture(O.pointerId), C = !0, R = P(O), z(() => {
        const V = Math.max(2, t.viewportSize - ft);
        R < S.value ? l("scrollBy", -V) : R > S.value + g.value && l("scrollBy", V);
      }));
    }
    function U(O) {
      C && (R = P(O));
    }
    function J() {
      C = !1, I();
    }
    let q = null;
    function Q(O) {
      O.button === 0 && (O.currentTarget.setPointerCapture(O.pointerId), q = { start: m(O), startScroll: t.scrollPos });
    }
    function ge(O) {
      if (!q) return;
      const V = u.value - g.value;
      V <= 0 || l("scrollTo", q.startScroll + (m(O) - q.start) * v.value / V);
    }
    function le() {
      q = null;
    }
    return (O, V) => (h(), N("div", {
      class: je(["win55-scrollbar", e.orientation]),
      "aria-hidden": "true"
    }, [
      B("div", {
        class: "sb-button",
        onPointerdown: V[0] || (V[0] = (ee) => L(ee, "start")),
        onPointerup: _,
        onPointercancel: _
      }, [
        he(B("img", {
          src: c(r.value, !1),
          draggable: "false"
        }, null, 8, co), [
          [Xe, w.value !== "start"]
        ]),
        he(B("img", {
          src: c(r.value, !0),
          draggable: "false"
        }, null, 8, uo), [
          [Xe, w.value === "start"]
        ])
      ], 32),
      B("div", {
        ref_key: "trackRef",
        ref: i,
        class: "sb-track",
        onPointerdown: F,
        onPointermove: U,
        onPointerup: J,
        onPointercancel: J
      }, [
        x.value ? (h(), N("div", {
          key: 0,
          class: "sb-thumb",
          style: Y(p.value),
          onPointerdown: _e(Q, ["stop"]),
          onPointermove: ge,
          onPointerup: le,
          onPointercancel: le
        }, [
          j.value ? (h(), N("div", fo)) : K("", !0)
        ], 36)) : K("", !0)
      ], 544),
      B("div", {
        class: "sb-button",
        onPointerdown: V[1] || (V[1] = (ee) => L(ee, "end")),
        onPointerup: _,
        onPointercancel: _
      }, [
        he(B("img", {
          src: c(s.value, !1),
          draggable: "false"
        }, null, 8, vo), [
          [Xe, w.value !== "end"]
        ]),
        he(B("img", {
          src: c(s.value, !0),
          draggable: "false"
        }, null, 8, mo), [
          [Xe, w.value === "end"]
        ])
      ], 32)
    ], 2));
  }
}), Rt = (e, n) => {
  const t = e.__vccOpts || e;
  for (const [l, o] of n)
    t[l] = o;
  return t;
}, Ut = /* @__PURE__ */ Rt(wo, [["__scopeId", "data-v-08aa801a"]]), vt = 28;
function ot(e) {
  return e === "hidden" || e === "scroll" || e === "auto";
}
function yo(e, n) {
  if (ot(e) === ot(n)) return { x: e, y: n };
  const t = (l) => l === "clip" ? "hidden" : l === "visible" ? "auto" : l;
  return { x: t(e), y: t(n) };
}
function ye(e, n) {
  return Math.min(n, Math.max(0, Math.round(e / 2) * 2));
}
const xo = 4, bo = 100;
function Eo(e, n, t) {
  const l = A(null), o = A(null), r = T(
    () => yo(e.overflowX ?? e.overflow ?? "visible", e.overflowY ?? e.overflow ?? "visible")
  ), s = T(() => ot(r.value.x) || ot(r.value.y)), c = A(r.value.y === "scroll"), i = A(r.value.x === "scroll"), u = nt({ top: 0, left: 0, clientW: 0, clientH: 0, scrollW: 0, scrollH: 0 }), d = T(() => s.value ? {
    display: "grid",
    gridTemplateColumns: c.value ? `minmax(0, 1fr) ${vt}px` : "minmax(0, 1fr)",
    gridTemplateRows: i.value ? `minmax(0, 1fr) ${vt}px` : "minmax(0, 1fr)"
  } : { overflowX: e.overflowX ?? e.overflow, overflowY: e.overflowY ?? e.overflow }), f = T(() => ({
    overflowX: r.value.x,
    overflowY: r.value.y
  }));
  function v(m) {
    u.top = m.scrollTop, u.left = m.scrollLeft, u.clientW = m.clientWidth, u.clientH = m.clientHeight, u.scrollW = m.scrollWidth, u.scrollH = m.scrollHeight;
  }
  function x(m) {
    const R = ye(m.scrollTop, m.scrollHeight - m.clientHeight), C = ye(m.scrollLeft, m.scrollWidth - m.clientWidth);
    Math.abs(R - m.scrollTop) > 0.01 && (m.scrollTop = R), Math.abs(C - m.scrollLeft) > 0.01 && (m.scrollLeft = C);
  }
  let y = null, g = null, S = 0, j = 0;
  function p() {
    S || (S = requestAnimationFrame(() => {
      S = 0, k();
    }));
  }
  function k() {
    const m = l.value, R = o.value;
    if (!m || !R) return;
    R.style.display = "none";
    const C = m.scrollHeight, P = m.scrollWidth, F = m.clientHeight, U = m.clientWidth, J = vt, { x: q, y: Q } = r.value, ge = e.forgiveVerticalOverflow ? xo : 0, le = U + (c.value ? J : 0), O = F + (i.value ? J : 0);
    let V = Q === "scroll", ee = q === "scroll";
    Q === "auto" && C - ge > O && (V = !0), q === "auto" && P > le - (V ? J : 0) && (ee = !0), Q === "auto" && !V && C - ge > O - (ee ? J : 0) && (V = !0);
    const ze = V !== c.value;
    c.value = V, ze && q === "auto" || (i.value = ee);
    const we = (C - F) % 2 !== 0, ve = (P - U) % 2 !== 0;
    (we || ve) && (R.style.top = we ? `${C}px` : "0px", R.style.left = ve ? `${P}px` : "0px", R.style.display = "block"), g?.takeRecords();
    for (const Le of Array.from(m.children)) y?.observe(Le);
    x(m), v(m);
  }
  function I() {
    clearTimeout(j);
    const m = l.value;
    m && (x(m), v(m));
  }
  function z() {
    const m = l.value;
    if (!m) return;
    v(m);
    const R = ye(m.scrollTop, m.scrollHeight - m.clientHeight), C = ye(m.scrollLeft, m.scrollWidth - m.clientWidth);
    n.value !== R && (n.value = R), t.value !== C && (t.value = C), clearTimeout(j), j = window.setTimeout(I, bo);
  }
  function w(m, R) {
    const C = l.value;
    C && (m === "y" ? C.scrollTop = ye(R, C.scrollHeight - C.clientHeight) : C.scrollLeft = ye(R, C.scrollWidth - C.clientWidth));
  }
  function L(m, R) {
    const C = l.value;
    C && w(m, (m === "y" ? C.scrollTop : C.scrollLeft) + R);
  }
  function _(m) {
    const R = l.value, C = m === "y" ? n : t;
    if (!R || C.value === void 0) return;
    const P = m === "y" ? R.scrollTop : R.scrollLeft, F = m === "y" ? R.scrollHeight - R.clientHeight : R.scrollWidth - R.clientWidth;
    if (ye(P, F) === C.value) return;
    w(m, C.value);
    const U = ye(C.value, F);
    C.value !== U && (C.value = U);
  }
  return ie(n, () => _("y")), ie(t, () => _("x")), ie([r, () => e.forgiveVerticalOverflow], k, { flush: "post" }), ie(
    l,
    (m, R, C) => {
      m && (y = new ResizeObserver(p), y.observe(m), g = new MutationObserver(p), g.observe(m, { childList: !0, subtree: !0, characterData: !0, attributes: !0 }), k(), _("y"), _("x"), C(() => {
        y?.disconnect(), g?.disconnect(), y = null, g = null, clearTimeout(j), cancelAnimationFrame(S), S = 0;
      }));
    },
    { flush: "post" }
  ), {
    wrapperRef: l,
    spacerRef: o,
    scrollMode: s,
    showV: c,
    showH: i,
    metrics: u,
    rootStyle: d,
    wrapperStyle: f,
    onScroll: z,
    snapNow: I,
    scrollToAxis: w,
    scrollByAxis: L
  };
}
const Co = {
  key: 2,
  class: "win55-sb-corner"
}, So = /* @__PURE__ */ G({
  __name: "Box",
  props: /* @__PURE__ */ rt({
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
    const t = e, l = be(e, "scrollTop"), o = be(e, "scrollLeft"), r = A(null), {
      wrapperRef: s,
      spacerRef: c,
      scrollMode: i,
      showV: u,
      showH: d,
      metrics: f,
      rootStyle: v,
      wrapperStyle: x,
      onScroll: y,
      snapNow: g,
      scrollToAxis: S,
      scrollByAxis: j
    } = Eo(t, l, o), p = T(() => ({
      "--img": `url(/win-55-ui/${t.type}.png)`,
      ...v.value,
      ...t.extraStyles
    }));
    return n({ el: r, scrollEl: s, verticalBarVisible: u }), (k, I) => (h(), N("div", {
      ref_key: "rootRef",
      ref: r,
      class: je(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: Y(p.value)
    }, [
      M(i) ? (h(), N(X, { key: 0 }, [
        M(u) ? (h(), H(Ut, {
          key: 0,
          class: "win55-sb-v",
          orientation: "vertical",
          "scroll-pos": M(f).top,
          "viewport-size": M(f).clientH,
          "content-size": M(f).scrollH,
          onScrollTo: I[0] || (I[0] = (z) => M(S)("y", z)),
          onScrollBy: I[1] || (I[1] = (z) => M(j)("y", z))
        }, null, 8, ["scroll-pos", "viewport-size", "content-size"])) : K("", !0),
        M(d) ? (h(), H(Ut, {
          key: 1,
          class: "win55-sb-h",
          orientation: "horizontal",
          "scroll-pos": M(f).left,
          "viewport-size": M(f).clientW,
          "content-size": M(f).scrollW,
          onScrollTo: I[2] || (I[2] = (z) => M(S)("x", z)),
          onScrollBy: I[3] || (I[3] = (z) => M(j)("x", z))
        }, null, 8, ["scroll-pos", "viewport-size", "content-size"])) : K("", !0),
        M(u) && M(d) ? (h(), N("div", Co)) : K("", !0),
        B("div", {
          ref_key: "wrapperRef",
          ref: s,
          class: "win55-scroll-wrapper",
          style: Y(M(x)),
          onScroll: I[4] || (I[4] = //@ts-ignore
          (...z) => M(y) && M(y)(...z)),
          onScrollend: I[5] || (I[5] = //@ts-ignore
          (...z) => M(g) && M(g)(...z))
        }, [
          Z(k.$slots, "default", {}, void 0, !0),
          B("div", {
            ref_key: "spacerRef",
            ref: c,
            class: "win55-scroll-spacer",
            "aria-hidden": "true"
          }, null, 512)
        ], 36)
      ], 64)) : Z(k.$slots, "default", { key: 1 }, void 0, !0)
    ], 6));
  }
}), de = /* @__PURE__ */ Rt(So, [["__scopeId", "data-v-85175a6d"]]), ko = { class: "balloon-tip-box" }, Ro = {
  key: 1,
  class: "balloon-wrapper"
}, To = { class: "balloon-tip-box" }, Ge = 8, Bo = /* @__PURE__ */ G({
  __name: "Balloon",
  props: /* @__PURE__ */ rt({
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
    const n = be(e, "shown");
    function t(w) {
      return "top" in w;
    }
    function l(w) {
      return t(w) ? w : { top: w.y, bottom: w.y, left: w.x, right: w.x };
    }
    const o = e, r = yn(), s = T(() => o.side ?? "top"), c = T(() => o.bias), i = A(s.value), u = T(() => o.anchor ? i.value : s.value), d = T(() => {
      const w = {};
      switch (s.value) {
        case "top":
          w.bottom = "100%", w.left = "50%", w.transform = "translateX(-50%)";
          break;
        case "bottom":
          w.top = "100%", w.left = "50%", w.transform = "translateX(-50%)";
          break;
        case "left":
          w.right = "100%", w.top = "50%", w.transform = "translateY(-50%)";
          break;
        case "right":
          w.left = "100%", w.top = "50%", w.transform = "translateY(-50%)";
          break;
      }
      return w;
    }), f = T(() => {
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
    }), v = T(() => {
      let w = "", L = !1;
      switch (u.value) {
        case "top":
          w = "rotate(0deg)", c.value === "right" && (L = !0);
          break;
        case "bottom":
          w = "rotate(180deg)", c.value === "left" && (L = !0);
          break;
        case "left":
          w = "rotate(-90deg)";
          break;
        case "right":
          w = "rotate(90deg)", L = !0;
          break;
      }
      return L ? `${w} scaleX(-1)` : w;
    }), x = T(() => {
      const w = {};
      return c.value ? ((u.value === "top" || u.value === "bottom") && (c.value === "left" && (w.transform = "translateX(calc(-50% + 28px))"), c.value === "right" && (w.transform = "translateX(calc(50% - 28px))")), (u.value === "left" || u.value === "right") && (c.value === "up" && (w.transform = "translateY(calc(-50% + 28px))"), c.value === "down" && (w.transform = "translateY(calc(50% - 28px))")), w) : {};
    }), y = A(null), g = A(null), S = { top: "bottom", bottom: "top", left: "right", right: "left" }, j = {
      top: ["left", "right"],
      bottom: ["left", "right"],
      left: ["top", "bottom"],
      right: ["top", "bottom"]
    };
    function p(w, L, _) {
      const m = (L.left + L.right) / 2, R = (L.top + L.bottom) / 2;
      return w === "top" || w === "bottom" ? {
        top: w === "top" ? L.top - _.height : L.bottom,
        left: m - _.width / 2
      } : {
        left: w === "left" ? L.left - _.width : L.right,
        top: R - _.height / 2
      };
    }
    function k(w, L, _, m) {
      return w.top >= Ge && w.left >= Ge && w.top + L.height <= m - Ge && w.left + L.width <= _ - Ge;
    }
    function I() {
      const w = y.value;
      if (!o.anchor || !w) return;
      const L = l(o.anchor), _ = w.getBoundingClientRect(), m = window.innerWidth, R = window.innerHeight, C = o.side ?? "top", F = [
        C,
        S[C],
        ...j[C]
      ].find((U) => k(p(U, L, _), _, m, R)) ?? C;
      i.value = F, g.value = p(F, L, _);
    }
    ie(
      [() => o.anchor, n],
      async ([w, L]) => {
        !w || !L || (await kt(), I());
      },
      { deep: !0, immediate: !0 }
    );
    const z = () => {
      o.anchor && n.value && I();
    };
    return ae(() => {
      window.addEventListener("resize", z), window.addEventListener("scroll", z, !0);
    }), fe(() => {
      window.removeEventListener("resize", z), window.removeEventListener("scroll", z, !0);
    }), (w, L) => e.anchor ? (h(), H(st, {
      key: 0,
      to: "body"
    }, [
      n.value ? (h(), N("div", {
        key: 0,
        ref_key: "anchoredRef",
        ref: y,
        class: "balloon-anchored",
        style: Y({
          top: (g.value?.top ?? 0) + "px",
          left: (g.value?.left ?? 0) + "px"
        })
      }, [
        B("div", {
          class: "balloon-inner",
          style: Y({ flexDirection: f.value })
        }, [
          B("div", {
            class: "balloon-box-wrapper",
            style: Y(x.value)
          }, [
            ne(de, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: W(() => [
                M(r).content ? Z(w.$slots, "content", { key: 0 }) : (h(), N(X, { key: 1 }, [
                  Ae(ue(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          B("div", ko, [
            B("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: Y({ transform: v.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : K("", !0)
    ])) : (h(), N("div", Ro, [
      Z(w.$slots, "default"),
      n.value ? (h(), N("div", {
        key: 0,
        class: "balloon",
        style: Y(d.value)
      }, [
        B("div", {
          class: "balloon-inner",
          style: Y({ flexDirection: f.value })
        }, [
          B("div", {
            class: "balloon-box-wrapper",
            style: Y(x.value)
          }, [
            ne(de, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: W(() => [
                M(r).content ? Z(w.$slots, "content", { key: 0 }) : (h(), N(X, { key: 1 }, [
                  Ae(ue(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          B("div", To, [
            B("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: Y({ transform: v.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : K("", !0)
    ]));
  }
}), Io = /* @__PURE__ */ G({
  __name: "BaseDropdown",
  props: /* @__PURE__ */ rt({
    matchTriggerWidth: { type: Boolean, default: !1 }
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const n = e, t = be(e, "open"), l = A(null), o = A(null), r = A(null), s = () => {
      const d = o.value, f = r.value;
      if (!d || !f) return;
      const v = d.getBoundingClientRect(), x = window.innerHeight, y = f.offsetHeight;
      let g = v.bottom + window.scrollY;
      const S = v.left + window.scrollX;
      v.bottom + y > x && (g = v.top + window.scrollY - y), l.value = {
        top: g,
        left: S,
        width: n.matchTriggerWidth ? v.width : void 0
      };
    };
    ie(t, async (d) => {
      d && (await kt(), s());
    });
    const c = () => {
      t.value && s();
    }, i = (d) => {
      if (!t.value) return;
      const f = d.target;
      o.value?.contains(f) || r.value?.contains(f) || (t.value = !1);
    };
    ae(() => {
      window.addEventListener("resize", c), window.addEventListener("scroll", c), document.addEventListener("click", i);
    }), fe(() => {
      window.removeEventListener("resize", c), window.removeEventListener("scroll", c), document.removeEventListener("click", i);
    });
    const u = () => {
      t.value = !t.value;
    };
    return (d, f) => (h(), N(X, null, [
      B("div", {
        ref_key: "triggerRef",
        ref: o,
        style: { display: "inline-block" },
        onClick: _e(u, ["stop"])
      }, [
        Z(d.$slots, "trigger")
      ], 512),
      (h(), H(st, { to: "body" }, [
        t.value ? (h(), N("div", {
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
          Z(d.$slots, "items")
        ], 4)) : K("", !0)
      ]))
    ], 64));
  }
}), bn = [
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
], No = [8, 10, 12, 16, 18, 24], En = "Standard", Ao = {
  BoldItalic: ["BoldItalic", "Bold", "Italic", "Regular"],
  Bold: ["Bold", "Regular"],
  Italic: ["Italic", "Regular"],
  Regular: ["Regular"]
};
function Yt(e, n) {
  return bn.filter((t) => t.fontName === e && t.style === n).map((t) => t.size);
}
function $o(e, n, t) {
  const l = bn.some((r) => r.fontName === e) ? e : En, o = Ao[n] ?? ["Regular"];
  for (const r of o)
    if (Yt(l, r).includes(t))
      return { fontName: l, style: r, size: t };
  for (const r of o) {
    const s = Yt(l, r);
    if (s.length > 0)
      return { fontName: l, style: r, size: Sn(t, s) };
  }
  return { fontName: l, style: "Regular", size: t };
}
function Cn(e) {
  const { style: n, size: t } = e.shorthand ? zo(e.shorthand) : {
    style: jo(e.isBold, e.isItalic),
    size: Sn(e.fontSize ?? 12, No)
  }, { fontName: l, style: o, size: r } = $o(e.fontName ?? En, n, t), s = {
    fontFamily: `${l}-${o}-${r}, ${l}-${o}-${r}-TofuMaker`,
    fontSize: `${r * 2}px`,
    lineHeight: `${r * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (s.textShadow = `2px 2px 0 ${e.fontShadowColor}`), s;
}
function jo(e, n) {
  return e && n ? "BoldItalic" : e ? "Bold" : n ? "Italic" : "Regular";
}
function zo(e) {
  const n = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!n)
    throw new Error(`Invalid shorthand format: ${e}`);
  const t = n[1], l = parseInt(n[2], 10);
  return { style: t, size: l };
}
function Sn(e, n) {
  if (n.length === 0)
    throw new Error("Array cannot be empty");
  return n.reduce((t, l) => {
    const o = Math.abs(l - e), r = Math.abs(t - e);
    return o < r ? l : t;
  });
}
function ce(e) {
  if (e instanceof Text)
    return e.nodeValue ?? "";
  if (!(e instanceof Element || e instanceof DocumentFragment))
    return Array.from(e.childNodes).map(ce).join("");
  if (e instanceof Element) {
    const n = e.getAttribute("data-win55-emoji");
    if (n)
      return n;
    if (e.tagName === "BR")
      return `
`;
  }
  return Array.from(e.childNodes).map(ce).join("");
}
function Me(e) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !n.isCollapsed)
    return null;
  const t = n.getRangeAt(0);
  if (!e.contains(t.startContainer))
    return null;
  const l = document.createRange();
  return l.selectNodeContents(e), l.setEnd(t.startContainer, t.startOffset), ce(l.cloneContents()).length;
}
function kn(e, n) {
  if (e instanceof Text) {
    const o = e.nodeValue?.length ?? 0;
    return n <= o ? { node: e, offset: n, remaining: 0 } : { node: e, offset: o, remaining: n - o };
  }
  if (e instanceof Element) {
    const o = e.getAttribute("data-win55-emoji");
    if (o)
      return n <= 0 ? { node: e.parentNode ?? e, offset: mt(e), remaining: 0 } : n <= o.length ? { node: e.parentNode ?? e, offset: mt(e) + 1, remaining: 0 } : {
        node: e.parentNode ?? e,
        offset: mt(e) + 1,
        remaining: n - o.length
      };
  }
  let t = n, l = {
    offset: e.childNodes.length,
    remaining: t
  };
  for (const o of Array.from(e.childNodes)) {
    const r = kn(o, t);
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
function mt(e) {
  return e.parentNode ? Array.prototype.indexOf.call(e.parentNode.childNodes, e) : 0;
}
function Ze(e, n, t = !1) {
  if (n === null || !e.isConnected)
    return;
  const l = kn(e, n);
  if (!l)
    return;
  const o = document.createRange(), r = window.getSelection();
  t && e.focus({ preventScroll: !0 }), o.setStart(l.node, l.offset), o.collapse(!0), r?.removeAllRanges(), r?.addRange(o);
}
const Rn = "/win-55-ui/emoji", ht = `${Rn}/emoji-registry.csv`, Fe = [
  "[\\u{1F1E6}-\\u{1F1FF}]{2}",
  "[0-9#*]\\uFE0F?\\u20E3",
  "\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?)*",
  "\\p{Emoji_Presentation}"
].join("|");
let Qe = null, Et = null, et = null;
function Lo(e) {
  return e.replace(/\/$/, "");
}
function Tn(e) {
  return e.trim().replace(/\.gif$/i, "");
}
function Oo(e) {
  const n = {}, t = e.replace(/^\uFEFF/, "").split(/\r?\n/);
  for (const [l, o] of t.entries()) {
    const r = o.trim();
    if (!r || l === 0 && r.toLowerCase() === "emoji,code")
      continue;
    const s = r.indexOf(",");
    if (s === -1) {
      console.warn(`[win-55-ui] Skipping emoji registry row ${l + 1}: missing comma`);
      continue;
    }
    const c = r.slice(0, s).trim(), i = Tn(r.slice(s + 1));
    c && i && (n[c] = i);
  }
  return n;
}
async function ke(e = {}) {
  const n = e.registryUrl ?? ht;
  return et && n === ht ? et : ((!Qe || Et !== n) && (Et = n, Qe = fetch(n).then((t) => {
    if (!t.ok)
      throw new Error(
        `Could not load emoji registry from ${n}: ${t.status} ${t.statusText}`
      );
    return t.text();
  }).then(Oo).then((t) => (n === ht && (et = t), t))), Qe);
}
function Fr() {
  Qe = null, Et = null, et = null;
}
async function Mo(e, n = {}) {
  const l = (await ke(n))[e];
  return l ? pe(l, n) : null;
}
function pe(e, n = {}) {
  return `${Lo(n.basePath ?? Rn)}/${Tn(e)}.gif`;
}
async function Dr(e = {}) {
  return ke(e);
}
async function Hr(e, n = {}) {
  const t = await ke(n);
  return e in t;
}
ke();
function Po(e) {
  return e.map((n) => {
    const t = parseInt(n.replace(/^#/, ""), 16);
    return [t >> 16 & 255, t >> 8 & 255, t & 255];
  });
}
function _o(e, n, t, l) {
  let o = 1 / 0, r = [0, 0, 0];
  for (const s of l) {
    const c = e - s[0], i = n - s[1], u = t - s[2], d = c * c + i * i + u * u;
    d < o && (o = d, r = s);
  }
  return r;
}
function Bn() {
  return typeof navigator < "u" && /firefox/i.test(navigator.userAgent);
}
const Fo = "win55-emoji", Do = "win55-emoji-image", se = 15, Ct = 2, Xt = Bn(), Ho = [
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
], Vo = Po(Ho), Gt = Fe, Wo = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION"
]), Be = /* @__PURE__ */ new WeakMap(), Kt = /* @__PURE__ */ new WeakMap(), qt = /* @__PURE__ */ new Map();
function Uo(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function Yo(e) {
  const n = Kt.get(e);
  if (n)
    return n;
  const t = Object.keys(e).sort((r, s) => s.length - r.length).map(Uo), l = t.length > 0 ? `${t.join("|")}|${Gt}` : Gt, o = new RegExp(l, "gu");
  return Kt.set(e, o), o;
}
function In(e) {
  return e.value === !1 ? null : typeof e.value == "object" ? e.value : {};
}
const Xo = "data-win55-richtext";
function Go(e) {
  return Wo.has(e.tagName) || e.hasAttribute("data-win55-emoji");
}
function Nn(e) {
  let n = e.parentElement;
  for (; n; ) {
    const t = Be.get(n);
    if (t && In(t.binding))
      return !0;
    n = n.parentElement;
  }
  return !1;
}
function Ko(e, n) {
  const t = [], l = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, {
    acceptNode(o) {
      const r = o.parentElement;
      return !r || Go(r) || n && r.closest(`[${Xo}]`) || !o.nodeValue?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  for (; l.nextNode(); )
    t.push(l.currentNode);
  return t;
}
function qo() {
  return `${se * Ct}px`;
}
function Jo(e, n, t, l, o) {
  const r = Math.min(1, Math.max(0, o)), s = e.getImageData(0, 0, n, t), c = s.data;
  for (let i = 0; i < c.length; i += 4) {
    const u = c[i], d = c[i + 1], f = c[i + 2];
    if (c[i + 3] < 80)
      c[i] = 0, c[i + 1] = 0, c[i + 2] = 0, c[i + 3] = 0;
    else {
      const [x, y, g] = _o(
        u,
        d,
        f,
        l
      ), S = Math.round(u + (x - u) * r), j = Math.round(d + (y - d) * r), p = Math.round(f + (g - f) * r);
      c[i] = S, c[i + 1] = j, c[i + 2] = p, c[i + 3] = 255;
    }
  }
  e.putImageData(s, 0, 0);
}
function Zo(e, n, t) {
  const l = e.getImageData(0, 0, n, t), o = new Uint8ClampedArray(l.data), r = l.data, s = (c, i) => (i * n + c) * 4;
  for (let c = 0; c < t; c++)
    for (let i = 0; i < n; i++) {
      const u = s(i, c), f = [
        i > 0 ? s(i - 1, c) : -1,
        i < n - 1 ? s(i + 1, c) : -1,
        c > 0 ? s(i, c - 1) : -1,
        c < t - 1 ? s(i, c + 1) : -1
      ].filter((v) => v !== -1).filter((v) => o[v + 3] > 127);
      if (o[u + 3] > 127 && f.length <= 1)
        r[u] = r[u + 1] = r[u + 2] = r[u + 3] = 0;
      else if (o[u + 3] === 0 && f.length >= 3) {
        const v = f[0];
        r[u] = o[v], r[u + 1] = o[v + 1], r[u + 2] = o[v + 2], r[u + 3] = 255;
      }
    }
  e.putImageData(l, 0, 0);
}
function Tt(e) {
  const n = qt.get(e);
  if (n)
    return n;
  const t = Qo(e);
  return qt.set(e, t), t;
}
function Qo(e) {
  const n = document.createElement("canvas");
  n.width = se, n.height = se;
  const t = n.getContext("2d");
  if (!t)
    return "";
  const l = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif', o = se * 4;
  t.textBaseline = "alphabetic", t.font = `${o}px ${l}`;
  const r = t.measureText(e), s = r.actualBoundingBoxLeft + r.actualBoundingBoxRight, c = r.actualBoundingBoxAscent + r.actualBoundingBoxDescent;
  if (s > 0 && c > 0) {
    const i = o * Math.min(se / s, se / c);
    t.font = `${i}px ${l}`;
    const u = t.measureText(e), d = u.actualBoundingBoxLeft + u.actualBoundingBoxRight, f = u.actualBoundingBoxAscent + u.actualBoundingBoxDescent, v = (se - d) / 2 + u.actualBoundingBoxLeft, x = (se - f) / 2 + u.actualBoundingBoxAscent;
    t.fillText(e, v, x - 0.5), Jo(t, se, se, Vo, 0.1), Zo(t, se, se), sl(n);
  }
  return n.toDataURL("image/png");
}
function el(e, n, t) {
  const l = document.createElement("span"), o = document.createElement("img");
  return l.className = t.className ?? Fo, l.contentEditable = "false", l.dataset.win55Emoji = e, l.role = "img", l.ariaLabel = e, l.style.setProperty("--win55-emoji-size", qo()), o.src = n, o.alt = e, o.className = Do, o.draggable = !1, o.dataset.win55EmojiImg = "true", o.addEventListener("load", () => {
    const r = o.naturalWidth * Ct, s = o.naturalHeight * Ct;
    l.style.width = `${r}px`, l.style.height = `${s}px`, o.style.width = `${r}px`, o.style.height = `${s}px`;
  }, { once: !0 }), l.append(o), l;
}
function tl(e, n, t, l) {
  const o = e.parentElement;
  if (!o)
    return;
  const r = window.getSelection(), s = r && r.rangeCount > 0 && r.isCollapsed ? r.getRangeAt(0) : null, c = s?.startContainer === e, i = !!(s && s.startContainer === o && s.startOffset === Array.prototype.indexOf.call(o.childNodes, e) + 1), u = c || i, d = i ? e.nodeValue?.length ?? 0 : c ? s?.startOffset ?? null : null, f = e.nodeValue ?? "";
  let v = 0, x = !1;
  const y = document.createDocumentFragment();
  let g = null, S = 0;
  const j = (k, I) => {
    g || (g = k, S = I);
  };
  n.lastIndex = 0;
  for (const k of f.matchAll(n)) {
    const I = k[0], z = k.index, w = t[I];
    if (z === void 0)
      continue;
    const L = w ? pe(w, l) : Tt(I);
    if (!L)
      continue;
    x = !0;
    const _ = f.slice(v, z);
    if (Xt || _.length > 0) {
      const R = document.createTextNode(_);
      d !== null && d >= v && d <= z && j(R, d - v), y.append(R);
    } else d !== null && d >= v && d <= z && j(o, Array.prototype.indexOf.call(o.childNodes, e) + y.childNodes.length);
    const m = el(I, L, l);
    y.append(m), d !== null && d > z && d <= z + I.length && j(o, Array.prototype.indexOf.call(o.childNodes, e) + y.childNodes.length), v = z + I.length;
  }
  if (!x)
    return;
  const p = f.slice(v);
  if (Xt || p.length > 0) {
    const k = document.createTextNode(p);
    d !== null && d >= v && j(k, d - v), y.append(k);
  } else d !== null && d >= v && j(o, Array.prototype.indexOf.call(o.childNodes, e) + y.childNodes.length);
  if (e.replaceWith(y), u && g) {
    const k = document.createRange();
    k.setStart(g, S), k.collapse(!0), r?.removeAllRanges(), r?.addRange(k);
  }
}
function An(e, n, t, l) {
  const o = Yo(n);
  if (o)
    for (const r of Ko(e, l))
      tl(r, o, n, t);
}
const pt = /* @__PURE__ */ new WeakMap();
async function gt(e, n = {}) {
  const t = (pt.get(e) ?? 0) + 1;
  pt.set(e, t);
  const l = await ke(n);
  pt.get(e) !== t || !e.isConnected || An(e, l, n, !1);
}
async function nl(e, n) {
  const t = In(n.binding);
  if (!t)
    return;
  n.version += 1;
  const l = n.version, o = await ke(t);
  Be.get(e)?.version !== l || !e.isConnected || Nn(e) || An(e, o, t, !0);
}
function St(e, n) {
  n.renderQueued || (n.renderQueued = !0, n.renderFrame = window.requestAnimationFrame(() => {
    n.renderQueued = !1, n.renderFrame = null, nl(e, n).catch((t) => {
      console.warn("[win-55-ui] Could not render custom emoji.", t);
    });
  }));
}
function ol(e, n) {
  const t = window.getSelection();
  if (!t || t.rangeCount === 0 || !n.clipboardData || Nn(e))
    return;
  const l = t.getRangeAt(0);
  if (!l.intersectsNode(e))
    return;
  const o = l.cloneContents(), r = ce(o);
  r && (n.clipboardData.setData("text/plain", r), n.preventDefault());
}
function ll(e, n) {
  const t = new MutationObserver(() => {
    St(e, n);
  });
  return t.observe(e, {
    characterData: !0,
    childList: !0,
    subtree: !0
  }), t;
}
const rl = {
  mounted(e, n) {
    const t = {
      binding: n,
      copyHandler: (l) => ol(e, l),
      observer: null,
      renderFrame: null,
      renderQueued: !1,
      version: 0
    };
    t.observer = ll(e, t), Be.set(e, t), e.addEventListener("copy", t.copyHandler), St(e, t);
  },
  updated(e, n) {
    const t = Be.get(e);
    t && (t.binding = n, St(e, t));
  },
  unmounted(e) {
    const n = Be.get(e);
    n && (n.observer?.disconnect(), n.renderFrame !== null && window.cancelAnimationFrame(n.renderFrame), e.removeEventListener("copy", n.copyHandler)), Be.delete(e);
  }
};
function sl(e) {
  const n = e.getContext("2d");
  if (!n) {
    console.warn("Unable to get 2D context from canvas");
    return;
  }
  const t = e.width, l = e.height, o = n.getImageData(0, 0, t, l), r = o.data, s = (f, v) => f < 0 || v < 0 || f >= t || v >= l ? 0 : r[(v * t + f) * 4 + 3], c = Array.from({ length: l }, () => Array(t).fill(!1)), i = [];
  for (let f = 0; f < t; f++)
    s(f, 0) === 0 && !c[0][f] && (c[0][f] = !0, i.push({ x: f, y: 0 })), s(f, l - 1) === 0 && !c[l - 1][f] && (c[l - 1][f] = !0, i.push({ x: f, y: l - 1 }));
  for (let f = 0; f < l; f++)
    s(0, f) === 0 && !c[f][0] && (c[f][0] = !0, i.push({ x: 0, y: f })), s(t - 1, f) === 0 && !c[f][t - 1] && (c[f][t - 1] = !0, i.push({ x: t - 1, y: f }));
  const u = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  for (; i.length; ) {
    const { x: f, y: v } = i.shift();
    for (const [x, y] of u) {
      const g = f + x, S = v + y;
      g >= 0 && g < t && S >= 0 && S < l && !c[S][g] && s(g, S) === 0 && (c[S][g] = !0, i.push({ x: g, y: S }));
    }
  }
  const d = Array.from({ length: l }, () => Array(t).fill(!1));
  for (let f = 0; f < l; f++)
    for (let v = 0; v < t; v++) {
      if (s(v, f) === 0) continue;
      let x = !1;
      for (const [y, g] of u) {
        const S = v + y, j = f + g;
        if (S < 0 || j < 0 || S >= t || j >= l) {
          x = !0;
          break;
        }
        if (s(S, j) === 0 && c[j][S]) {
          x = !0;
          break;
        }
      }
      x && (d[f][v] = !0);
    }
  for (let f = 0; f < l; f++)
    for (let v = 0; v < t; v++)
      if (d[f][v]) {
        const x = (f * t + v) * 4;
        r[x] = 0, r[x + 1] = 0, r[x + 2] = 0;
      }
  n.putImageData(o, 0, 0);
}
const Vr = rl, Jt = typeof Intl.Segmenter == "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function $n(e) {
  return Jt ? Array.from(Jt.segment(e), (n) => n.segment) : Array.from(e);
}
function Zt(e) {
  return $n(e).length;
}
function il(e, n) {
  return $n(e).slice(0, n).join("");
}
function al(e) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !n.isCollapsed)
    return null;
  const t = n.getRangeAt(0);
  if (!e.contains(t.startContainer))
    return null;
  const l = Me(e), o = t.cloneRange();
  o.collapse(!0);
  const r = document.createElement("span");
  r.textContent = "​", o.insertNode(r);
  const s = r.getBoundingClientRect(), c = r.parentNode;
  return r.remove(), c?.normalize(), Ze(e, l), s;
}
const Qt = "/win-55-ui/emoji/emoji-categories.json";
let wt = null;
async function Bt() {
  return wt || (wt = fetch(Qt).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${Qt}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), wt;
}
async function cl(e) {
  const n = e.trim().toLowerCase();
  if (!n)
    return [];
  const t = await Bt(), l = [], o = /* @__PURE__ */ new Set();
  for (const r of t) {
    const s = r.shortcodes.find((c) => c.toLowerCase().startsWith(n));
    s && (l.push({ emoji: r.emoji, code: r.code, shortcode: s }), o.add(r.code));
  }
  for (const r of t) {
    if (o.has(r.code))
      continue;
    const s = r.tags.find((c) => c.toLowerCase().startsWith(n));
    s && (l.push({ emoji: r.emoji, code: r.code, shortcode: r.shortcodes[0] ?? s }), o.add(r.code));
  }
  return l;
}
async function jn(e) {
  const n = e.trim().toLowerCase();
  if (!n)
    return;
  const l = (await Bt()).find((o) => o.shortcodes.some((r) => r.toLowerCase() === n));
  return l ? { emoji: l.emoji, code: l.code } : void 0;
}
const Ne = A(!1), xe = A({ x: 160, y: 120, width: 360, height: 420 }), It = ro(null);
function en(e) {
  It.value = e;
}
function ul() {
  Ne.value = !0;
}
function tn() {
  Ne.value = !1;
}
function dl(e) {
  It.value?.insertEmoji(e);
}
let nn = 0;
function fl(e) {
  const n = e[nn % e.length];
  return nn += 1, n;
}
const vl = { class: "baseinput-emoji-wrapper" }, ml = ["contenteditable", "data-placeholder", "aria-multiline", "aria-disabled"], hl = ["src"], pl = { class: "shortcode-suggestions" }, gl = {
  key: 0,
  class: "shortcode-suggestion-ellipsis"
}, wl = ["src"], yl = {
  key: 1,
  class: "shortcode-suggestion-ellipsis"
}, xl = "546", Ke = 5, bl = 200, Wr = /* @__PURE__ */ G({
  __name: "BaseInput",
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
    ], o = e, r = t, s = A(null), c = A(null), i = T(() => c.value);
    ae(() => {
      i.value && o.modelValue && (i.value.innerText = o.modelValue);
    }), ie(() => o.modelValue, (a) => {
      if (i.value && ce(i.value) !== a) {
        const b = document.activeElement === i.value, E = b ? Me(i.value) : null;
        i.value.innerText = a ?? "", b && Ze(i.value, E);
      }
    });
    const u = () => {
      if (!i.value) return;
      let a = ce(i.value);
      if (o.multiline || (a = a.replace(/\n/g, "")), o.maxLength && Zt(a) > o.maxLength) {
        a = il(a, o.maxLength), i.value.innerText = a;
        const b = document.createRange(), E = window.getSelection();
        b.selectNodeContents(i.value), b.collapse(!1), E?.removeAllRanges(), E?.addRange(b);
      }
      Dn(), r("update:modelValue", a), V();
    }, d = /:([A-Za-z0-9_+-]*)$/, f = /:([A-Za-z0-9_+-]{2,}):$/, v = A(!1), x = A(null), y = A([]), g = A(0), S = A(null);
    let j = 0;
    const p = A(0);
    function k(a) {
      a < p.value ? p.value = a : a > p.value + Ke - 1 && (p.value = a - Ke + 1);
    }
    const I = T(() => {
      const a = p.value;
      return y.value.slice(a, a + Ke).map((b, E) => ({ match: b, index: a + E }));
    }), z = T(() => p.value > 0), w = T(() => p.value + Ke < y.value.length), L = () => {
      v.value = !1, x.value = null, y.value = [], g.value = 0, p.value = 0;
    }, _ = (a, b) => {
      if (!i.value) return;
      const E = window.getSelection();
      if (!E || E.rangeCount === 0 || !E.isCollapsed) return;
      const $ = E.getRangeAt(0), D = $.startContainer;
      if (!(D instanceof Text) || !i.value.contains(D)) return;
      const te = $.startOffset, re = te - a;
      if (re < 0) return;
      const me = D.nodeValue ?? "";
      Ye(), D.nodeValue = me.slice(0, re) + b + me.slice(te), Ee(D, re + b.length), Re(), u(), gt(i.value);
    }, m = () => {
      const a = y.value[g.value];
      !a || x.value === null || (_(1 + x.value.length, a.emoji), L());
    }, R = A(null), P = { insertEmoji: (a) => {
      if (!i.value) return;
      const $ = (document.activeElement === i.value ? Me(i.value) : null) ?? R.value ?? Zt(ce(i.value));
      Ze(i.value, $, !0);
      const D = window.getSelection();
      if (!D || D.rangeCount === 0 || !D.isCollapsed) return;
      const te = D.getRangeAt(0);
      Ye(), te.deleteContents();
      const re = document.createTextNode(a);
      te.insertNode(re), Ee(re, re.length), Re(), u(), gt(i.value);
    } }, F = A(!1), U = T(() => Ne.value && It.value === P), J = T(() => o.showEmojiButton && (F.value || U.value)), q = A(l[0]), Q = T(() => U.value ? xl : q.value), ge = () => {
      q.value = fl(l);
    };
    ie(J, (a) => {
      a && ge();
    });
    const le = () => {
      F.value = !0, en(P);
    }, O = () => {
      en(P), ul();
    }, V = async () => {
      if (!i.value) {
        L();
        return;
      }
      const a = window.getSelection();
      if (!a || a.rangeCount === 0 || !a.isCollapsed) {
        L();
        return;
      }
      const b = a.getRangeAt(0), E = b.startContainer;
      if (!(E instanceof Text) || !i.value.contains(E)) {
        L();
        return;
      }
      const $ = (E.nodeValue ?? "").slice(0, b.startOffset), D = v.value ? x.value : null, te = f.exec($);
      if (te) {
        if (D === te[1]) {
          const Wt = await jn(te[1]);
          Wt && _(te[0].length, Wt.emoji);
        }
        L();
        return;
      }
      const me = d.exec($)?.[1] ?? null;
      if (me === null || me.length < 2) {
        L();
        return;
      }
      const Oe = al(i.value);
      if (!Oe) {
        L();
        return;
      }
      const Ht = ++j, Vt = await cl(me);
      if (Ht !== j || Vt.length === 0) {
        Ht === j && L();
        return;
      }
      x.value = me, y.value = Vt, g.value = 0, p.value = 0, S.value = { top: Oe.top, bottom: Oe.bottom, left: Oe.left, right: Oe.right }, v.value = !0;
    }, ee = [], ze = [];
    let we = null, ve = null;
    const Le = () => i.value ? { html: i.value.innerHTML, caret: Me(i.value) } : null, Mt = (a) => {
      i.value && (i.value.innerHTML = a.html, Ze(i.value, a.caret, !0), u());
    }, Ye = () => {
      we || (we = Le()), ze.length = 0;
    }, Re = () => {
      ve !== null && (clearTimeout(ve), ve = null), we && (ee.push(we), we = null);
    }, Dn = () => {
      ve !== null && clearTimeout(ve), ve = setTimeout(Re, bl);
    }, Hn = () => {
      Re();
      const a = ee.pop();
      if (!a) return;
      const b = Le();
      b && ze.push(b), Mt(a);
    }, Vn = () => {
      const a = ze.pop();
      if (!a) return;
      const b = Le();
      b && ee.push(b), Mt(a);
    }, Ee = (a, b) => {
      const E = document.createRange(), $ = window.getSelection();
      i.value?.focus({ preventScroll: !0 }), E.setStart(a, b), E.collapse(!0), $?.removeAllRanges(), $?.addRange(E);
    }, Wn = (a) => a instanceof Text ? a.nodeValue?.length ?? 0 : a.childNodes.length, Ce = (a) => a.parentNode ? Array.prototype.indexOf.call(a.parentNode.childNodes, a) : 0, ut = (a, b) => a instanceof Text ? b > 0 ? null : a.previousSibling ?? (a.parentNode && a.parentNode !== i.value ? ut(a.parentNode, Ce(a.parentNode)) : null) : a.childNodes[b - 1] ?? (a.parentNode && a !== i.value ? ut(a.parentNode, Ce(a)) : null), dt = (a, b) => a instanceof Text ? b < (a.nodeValue?.length ?? 0) ? null : a.nextSibling ?? (a.parentNode && a.parentNode !== i.value ? dt(a.parentNode, Ce(a.parentNode) + 1) : null) : a.childNodes[b] ?? (a.parentNode && a !== i.value ? dt(a.parentNode, Ce(a) + 1) : null), Un = (a, b) => {
      let E = a;
      for (; E; ) {
        if (E instanceof HTMLElement && E.hasAttribute("data-win55-emoji"))
          return E;
        if (E instanceof Text) {
          if ((E.nodeValue ?? "").length > 0)
            return null;
          E = b === "backward" ? E.previousSibling : E.nextSibling;
          continue;
        }
        if (E.childNodes.length > 0) {
          E = b === "backward" ? E.childNodes[E.childNodes.length - 1] : E.childNodes[0];
          continue;
        }
        return null;
      }
      return null;
    }, Pt = (a) => {
      if (a.cloneContents().querySelector?.("[data-win55-emoji]"))
        return !0;
      const E = a.startContainer instanceof Element ? a.startContainer : a.startContainer.parentElement, $ = a.endContainer instanceof Element ? a.endContainer : a.endContainer.parentElement;
      return !!(E?.closest("[data-win55-emoji]") || $?.closest("[data-win55-emoji]"));
    }, _t = (a) => {
      if (!i.value) return;
      const b = a.startContainer, E = a.startOffset;
      a.deleteContents(), b.isConnected && i.value.contains(b) ? Ee(b, Math.min(E, Wn(b))) : Ee(i.value, i.value.childNodes.length), u();
    }, Yn = (a) => {
      const b = document.createRange();
      return b.setStart(a.startContainer, a.startOffset), b.setEnd(a.endContainer, a.endOffset), b;
    }, Xn = (a) => a instanceof HTMLElement && a.hasAttribute("data-win55-emoji"), Gn = (a, b, E) => {
      if (!i.value || a.collapsed || a.startContainer !== a.endContainer || !(a.startContainer instanceof Text))
        return !1;
      const $ = a.startContainer, D = $.nodeValue?.length ?? 0;
      if (a.startOffset !== 0 || a.endOffset !== D)
        return !1;
      const te = b === "backward" ? $.previousSibling : $.nextSibling;
      if (!Xn(te) || !$.parentNode)
        return !1;
      E();
      const re = $.parentNode, me = Ce($);
      return $.remove(), Ee(re, me), u(), !0;
    }, Ft = (a, b, E) => {
      const $ = E === "backward" ? ut(a, b) : dt(a, b);
      return Un($, E);
    }, Dt = (a, b, E, $) => {
      const D = Ft(a, b, E);
      if (!D || !D.parentNode)
        return !1;
      $();
      const te = D.parentNode, re = Ce(D);
      return D.remove(), Ee(te, re), u(), !0;
    }, Kn = (a, b, E) => {
      if (!i.value || !i.value.contains(a.startContainer))
        return "none";
      const $ = Yn(a);
      return $.collapsed ? Dt(
        a.startContainer,
        a.startOffset,
        b,
        E
      ) ? "deleted" : "none" : Pt($) ? (E(), _t($), "deleted") : Gn($, b, E) ? "deleted" : ce($.cloneContents()) ? "native" : "none";
    }, qn = (a, b) => {
      if (!i.value) return !1;
      const E = window.getSelection();
      if (!E || E.rangeCount === 0)
        return !1;
      const $ = E.getRangeAt(0);
      return i.value.contains($.startContainer) ? E.isCollapsed ? Dt(
        $.startContainer,
        $.startOffset,
        a,
        b
      ) : Pt($) ? (b(), _t($), !0) : !1 : !1;
    }, Jn = (a) => {
      if (!Bn() || a.shiftKey || a.ctrlKey || a.metaKey || a.altKey || a.key !== "ArrowLeft" && a.key !== "ArrowRight" || !i.value) return !1;
      const b = window.getSelection();
      if (!b || b.rangeCount === 0 || !b.isCollapsed) return !1;
      const E = b.getRangeAt(0);
      if (!i.value.contains(E.startContainer)) return !1;
      const $ = a.key === "ArrowLeft" ? "backward" : "forward", D = Ft(E.startContainer, E.startOffset, $);
      return !D || !D.parentNode ? !1 : (a.preventDefault(), Ee(D.parentNode, Ce(D) + ($ === "forward" ? 1 : 0)), !0);
    }, Zn = (a) => {
      if (v.value) {
        if (a.key === "ArrowDown") {
          a.preventDefault(), g.value = (g.value + 1) % y.value.length, k(g.value);
          return;
        }
        if (a.key === "ArrowUp") {
          a.preventDefault(), g.value = (g.value - 1 + y.value.length) % y.value.length, k(g.value);
          return;
        }
        if (a.key === "Tab" || a.key === " " || a.key === "Enter") {
          a.preventDefault(), m();
          return;
        }
        if (a.key === "Escape") {
          a.preventDefault(), L();
          return;
        }
      }
      !o.multiline && a.key === "Enter" && a.preventDefault(), a.key === "Tab" && a.preventDefault(), Jn(a);
    }, Qn = (a) => {
      if (!i.value) return;
      if (a.inputType === "historyUndo" || a.inputType === "historyRedo") {
        a.preventDefault(), a.inputType === "historyUndo" ? Hn() : Vn();
        return;
      }
      if (Ye(), a.inputType !== "deleteContentBackward" && a.inputType !== "deleteContentForward")
        return;
      if (ce(i.value) === "") {
        a.preventDefault(), i.value.focus({ preventScroll: !0 });
        return;
      }
      const b = a.inputType === "deleteContentBackward" ? "backward" : "forward", E = a.getTargetRanges();
      for (const $ of E) {
        const D = Kn(
          $,
          b,
          () => a.preventDefault()
        );
        if (D === "deleted") {
          i.value.focus({ preventScroll: !0 });
          return;
        }
        if (D === "native")
          return;
      }
      qn(b, () => a.preventDefault()) && i.value.focus({ preventScroll: !0 });
    }, eo = (a) => {
      a.preventDefault();
      let b = a.clipboardData?.getData("text/plain") ?? "";
      if (o.multiline || (b = b.replace(/\n/g, " ")), !i.value) return;
      Ye();
      const E = window.getSelection(), $ = E?.getRangeAt(0);
      if ($) {
        $.deleteContents();
        const D = document.createTextNode(b);
        $.insertNode(D), $.collapse(!1), E?.removeAllRanges(), E?.addRange($);
      }
      u(), Re(), gt(i.value);
    }, to = () => {
      Re(), L(), F.value = !1, i.value && (R.value = Me(i.value)), i.value && ce(i.value) === "" && (i.value.innerHTML = "");
    }, no = T(() => ({
      ...Cn({ fontColor: "black" }),
      minHeight: "100%",
      ...o.wrap ? {} : { whiteSpace: "nowrap", width: "max-content", minWidth: "100%" },
      ...o.showEmojiButton ? { paddingRight: "34px" } : {}
    })), oo = T(() => s.value?.verticalBarVisible ? { right: "38px" } : void 0);
    return n({ el: i }), (a, b) => (h(), N(X, null, [
      B("div", vl, [
        ne(de, {
          ref_key: "boxRef",
          ref: s,
          type: e.boxType,
          overflow: "auto",
          "forgive-vertical-overflow": "",
          "extra-styles": e.extraStyles
        }, {
          default: W(() => [
            B("div", {
              ref_key: "editorRef",
              ref: c,
              contenteditable: !e.disabled,
              style: Y(no.value),
              "data-placeholder": e.placeholder,
              role: "textbox",
              "aria-multiline": e.multiline,
              "aria-disabled": e.disabled,
              onInput: u,
              onKeydown: Zn,
              onBeforeinput: Qn,
              onPaste: eo,
              onFocus: le,
              onBlur: to
            }, null, 44, ml)
          ]),
          _: 1
        }, 8, ["type", "extra-styles"]),
        J.value ? (h(), N("img", {
          key: 0,
          src: M(pe)(Q.value),
          style: Y(oo.value),
          width: "30",
          height: "30",
          class: "baseinput-emoji-button",
          "data-emoji-picker-trigger": "",
          onMousedown: b[0] || (b[0] = _e(() => {
          }, ["prevent"])),
          onClick: _e(O, ["stop"])
        }, null, 44, hl)) : K("", !0)
      ]),
      v.value && S.value ? (h(), H(Bo, {
        key: 0,
        shown: !0,
        anchor: S.value,
        side: "top"
      }, {
        content: W(() => [
          B("div", pl, [
            z.value ? (h(), N("div", gl, "...")) : K("", !0),
            (h(!0), N(X, null, oe(I.value, ({ match: E, index: $ }) => (h(), N("div", {
              key: E.shortcode,
              class: je(["shortcode-suggestion", { "shortcode-suggestion--selected": $ === g.value }])
            }, [
              B("img", {
                src: M(pe)(E.code),
                width: "30",
                height: "30",
                class: "shortcode-suggestion-image"
              }, null, 8, wl),
              B("span", null, ":" + ue(E.shortcode) + ":", 1)
            ], 2))), 128)),
            w.value ? (h(), N("div", yl, "...")) : K("", !0)
          ])
        ]),
        _: 1
      }, 8, ["anchor"])) : K("", !0)
    ], 64));
  }
}), El = "/win-55-ui/cursors/manifest.json", Cl = "/win-55-ui/cursors/scheme.json";
let it = {}, Nt = {};
const $e = A(0);
let yt = null;
async function on(e) {
  const n = await fetch(e);
  if (!n.ok) throw new Error(`Could not load ${e}: ${n.status} ${n.statusText}`);
  return n.json();
}
function at() {
  return yt || (yt = Promise.all([
    on(El),
    on(Cl)
  ]).then(([e, n]) => {
    it = e, Nt = n, $e.value++;
  })), yt;
}
async function Ur() {
  return await at(), Nt;
}
const ln = 2, Sl = "/win-55-ui/cursors", rn = "windows-default", kl = {
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
function sn(e, n) {
  const t = Nt[e]?.roles[n];
  if (!t) return;
  const l = it[t];
  if (!(!l || l.hotspotX === null || l.hotspotY === null))
    return t;
}
function De(e, n) {
  return $e.value, sn(e, n) ?? (e === rn ? void 0 : sn(rn, n));
}
function zn(e) {
  return $e.value, it[e];
}
function He(e, n) {
  const t = kl[n], l = De(e, n), o = l ? it[l] : void 0;
  return !l || !o ? t : `url("${Sl}/${l}/native.gif") ${o.hotspotX ?? 0} ${o.hotspotY ?? 0}, ${t ?? "default"}`;
}
function Pe(e, n) {
  const t = He(e, n);
  return t?.startsWith("url(") || n === "default" ? t : He(e, "default") ?? t;
}
function Te(e, n) {
  if (!e) return n;
  const t = e.lastIndexOf(",");
  return t === -1 ? e : `${e.slice(0, t)}, ${n}`;
}
const Ln = /* @__PURE__ */ Symbol("win55ui:cursor-context"), Ue = "--win55-cursor", At = "--win55-scheme", $t = "--win55-cursor-native-link", jt = "--win55-cursor-native-text", zt = "--win55-cursor-native-notallowed", Rl = "a[href], area[href]", On = 'textarea, [contenteditable]:not([contenteditable="false"]), input:not([type]), input[type="text" i], input[type="search" i], input[type="url" i], input[type="tel" i], input[type="email" i], input[type="password" i], input[type="number" i]', Ve = "--win55-cursor-native", We = [
  Ve,
  $t,
  jt,
  zt
], an = ["cursor", At, Ue, ...We], Mn = A(!1);
function cn(e) {
  Mn.value = e;
}
function Tl() {
  return Mn.value;
}
function Bl(e) {
  io(Ln, e);
}
function Il() {
  return so(Ln, void 0);
}
const Lt = "__win55CursorContext";
function Nl(e, n) {
  e[Lt] = n;
}
function Al(e) {
  delete e[Lt];
}
let lt;
function $l(e) {
  lt = e;
}
function jl(e) {
  lt === e && (lt = void 0);
}
function zl(e) {
  let n = e;
  for (; n; ) {
    const t = n[Lt];
    if (t) return t;
    n = n.parentElement;
  }
  return lt;
}
function Ot(e) {
  e.style.removeProperty("cursor"), e.style.removeProperty(Ue);
  for (const n of We) e.style.removeProperty(n);
}
function Ll(e, n, t) {
  const l = (t?.mode.value ?? "native") === "native";
  if (Ot(e), !n) return;
  if (l) {
    const r = t ? t.resolveRoleCss(n) : He("windows-default", n);
    if (!r) return;
    const s = t ? t.nativeBaseCss.value : Pe("windows-default", "default"), c = Te(r, s ?? "default");
    e.style.setProperty("cursor", c, "important");
    for (const i of We) e.style.setProperty(i, c);
    return;
  }
  const o = t ? t.resolveRole(n) : De("windows-default", n);
  o && (e.style.cursor = "none", e.style.setProperty(Ue, o));
}
const Se = /* @__PURE__ */ new WeakMap();
function Pn(e) {
  return e.strong ?? e.weak;
}
function Ol(e) {
  const n = Se.get(e);
  if (!n) return;
  n.rev.value;
  const t = Pn(n);
  if (!t) {
    Ot(e);
    return;
  }
  Ll(e, t.role.value, t.context);
}
function Ml(e, n, t) {
  at();
  let l = Se.get(e);
  if (l || (l = { rev: A(0) }, Se.set(e, l)), l[n]) {
    const r = n === "strong" ? "v-cursor" : "v-cursor-weak";
    throw new Error(
      `[win-55-ui] two ${r} directives on one element. A reusable component must set its own cursor with v-cursor-weak so a consumer's v-cursor overrides it; two of the same strength on one element is unsupported. Element: ${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""}`
    );
  }
  const o = { role: A(t), context: void 0 };
  l[n] = o, l.rev.value++, kt(() => {
    const r = Se.get(e);
    !r || r[n] !== o || (o.context = zl(e), r.stop ? o === Pn(r) && r.rev.value++ : r.stop = bt(() => Ol(e)));
  });
}
function Pl(e, n) {
  const t = Se.get(e);
  if (t) {
    if (t[n] = void 0, !t.strong && !t.weak) {
      t.stop?.(), Se.delete(e), Ot(e);
      return;
    }
    t.rev.value++;
  }
}
function _n(e) {
  return {
    mounted(n, t) {
      Ml(n, e, t.value);
    },
    updated(n, t) {
      if (t.value === t.oldValue) return;
      const l = Se.get(n)?.[e];
      l && (l.role.value = t.value);
    },
    unmounted(n) {
      Pl(n, e);
    }
  };
}
const _l = _n("strong"), ct = _n("weak"), tt = /* @__PURE__ */ G({
  __name: "Button",
  props: {
    baseType: { default: "panel-d-1" },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: n }) {
    const t = ct, l = e, o = n, r = A(!1), s = A(!1), c = T(() => !l.disabled && r.value && s.value), i = T(() => l.disabled), u = (S) => {
      l.disabled || S.button !== 0 || (r.value = !0, s.value = !0);
    }, d = () => {
      l.disabled || (s.value = !0);
    }, f = () => {
      s.value = !1;
    }, v = (S) => {
      l.disabled || S.button !== 0 || (r.value && s.value && o("click"), r.value = !1);
    };
    ae(() => {
      window.addEventListener("mouseup", v);
    }), fe(() => {
      window.removeEventListener("mouseup", v);
    });
    const x = T(() => ({
      userSelect: "none",
      width: "fit-content",
      paddingBottom: "4px",
      paddingRight: "4px",
      ...l.extraStyles
    })), y = T(() => ({
      transform: c.value ? "translate(2px, 2px)" : "translate(0, 0)",
      opacity: i.value ? 0.5 : 1
    })), g = T(() => c.value ? "indent" : l.baseType);
    return (S, j) => he((h(), H(de, {
      type: g.value,
      "extra-styles": x.value,
      "extra-class": e.extraClass,
      onMousedown: u,
      onMouseenter: d,
      onMouseleave: f
    }, {
      default: W(() => [
        B("div", {
          style: Y(y.value)
        }, [
          Z(S.$slots, "default")
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"])), [
      [M(t), i.value ? "not-allowed" : "default"]
    ]);
  }
}), Fl = { style: { display: "flex", "align-items": "center" } }, Dl = ["src", "alt"], Hl = ["checked", "disabled", "value"], Vl = { key: 0 }, Yr = /* @__PURE__ */ G({
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
    const t = ct, l = e, o = n, r = () => {
      l.disabled || o("update:modelValue", !l.modelValue);
    };
    return (s, c) => he((h(), N("div", {
      class: je(["checkbox-container", { disabled: e.disabled }]),
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
      B("div", Fl, [
        B("img", {
          draggable: "false",
          src: e.modelValue ? e.checkedIcon : e.uncheckedIcon,
          alt: e.modelValue ? "checked" : "unchecked"
        }, null, 8, Dl)
      ]),
      B("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, Hl),
      e.label ? (h(), N("span", Vl, ue(e.label), 1)) : K("", !0)
    ], 6)), [
      [M(t), e.disabled ? "not-allowed" : "link"]
    ]);
  }
}), un = 120;
function Wl({ onMove: e, onIdentity: n, onLeave: t }) {
  let l = 0, o = 0, r;
  function s(v) {
    l = v.clientX, o = v.clientY, e(l, o);
  }
  function c(v) {
    s(v);
  }
  function i(v) {
    v.target instanceof Element && (l = v.clientX, o = v.clientY, n(v.target));
  }
  function u(v) {
    v.relatedTarget === null && t();
  }
  function d() {
    n(document.elementFromPoint(l, o));
  }
  function f() {
    document.hidden ? (r !== void 0 && (clearInterval(r), r = void 0), t()) : (r === void 0 && (r = window.setInterval(d, un)), d());
  }
  ae(() => {
    window.addEventListener("pointermove", s, { passive: !0 }), "onpointerrawupdate" in window && window.addEventListener("pointerrawupdate", c, { passive: !0 }), document.addEventListener("pointerover", i, { passive: !0 }), document.addEventListener("pointerout", u, { passive: !0 }), document.addEventListener("visibilitychange", f), r = window.setInterval(d, un);
  }), fe(() => {
    window.removeEventListener("pointermove", s), window.removeEventListener("pointerrawupdate", c), document.removeEventListener("pointerover", i), document.removeEventListener("pointerout", u), document.removeEventListener("visibilitychange", f), r !== void 0 && clearInterval(r);
  });
}
const Ul = /\/win-55-ui\/cursors\/([^/"')]+)\/native\.gif/;
function Yl(e) {
  const n = getComputedStyle(e);
  let t = "";
  return e.closest(":disabled") ? t = n.getPropertyValue(zt) : e.matches(Rl) ? t = n.getPropertyValue($t) : e.matches(On) && (t = n.getPropertyValue(jt)), t = t.trim(), t && t !== "none" ? t : n.getPropertyValue(Ve).trim();
}
function Xl() {
  let e = null, n = "", t = "", l = "default", o = [], r = 0, s, c = [];
  function i() {
    s !== void 0 && (clearTimeout(s), s = void 0), c = [], e && (e.style.removeProperty("cursor"), e = null);
  }
  function u(v) {
    return t.replace("native.gif", `native-${v}.gif`);
  }
  function d() {
    const v = e;
    if (!v || !v.isConnected) {
      i();
      return;
    }
    const x = (r + o.length - 1) % o.length;
    v.style.setProperty("cursor", `${u(r)}, ${u(x)}, ${l}`, "important");
    const y = o[r] || 60;
    r = (r + 1) % o.length, s = window.setTimeout(d, y);
  }
  function f(v) {
    if (!(v instanceof HTMLElement) || !v.isConnected) return;
    const x = Yl(v), y = Ul.exec(x)?.[1], g = y ? zn(y)?.nativeFrameDelays : void 0;
    if (!y || !g || g.length < 2) {
      i();
      return;
    }
    if (v === e && y === n) return;
    i();
    const S = x.indexOf(",", x.indexOf(")") + 1);
    t = (S === -1 ? x : x.slice(0, S)).trim(), l = S === -1 ? "default" : x.slice(S + 1).trim(), c = [];
    for (let j = 0; j < g.length; j++) {
      const p = new Image();
      p.src = `/win-55-ui/cursors/${y}/native-${j}.gif`, p.decode().catch(() => {
      }), c.push(p);
    }
    e = v, n = y, o = g, r = 0, d();
  }
  return fe(i), { evaluate: f, stop: i };
}
const dn = 2, Gl = /* @__PURE__ */ G({
  __name: "CursorOverlay",
  setup(e) {
    const n = Xl(), t = A(), l = A();
    let o = "", r = 0, s = 0, c = !1, i = 0, u = 0;
    function d(p) {
      return Math.round(p / dn) * dn;
    }
    function f() {
      const p = `translate(${d(i - r)}px, ${d(u - s)}px)`;
      t.value && (t.value.style.transform = p), l.value && (l.value.style.transform = p);
    }
    function v(p) {
      const k = t.value, I = l.value;
      if (!k && !I || p === c) return;
      c = p;
      const z = p ? "visible" : "hidden";
      k && (k.style.visibility = z), I && (I.style.visibility = z);
    }
    function x(p, k) {
      p && (k ? (p.src = k, p.style.display = "") : (p.style.display = "none", p.removeAttribute("src")));
    }
    function y(p) {
      if (p === o) {
        v(p !== "");
        return;
      }
      if (o = p, !p) {
        v(!1);
        return;
      }
      const k = zn(p);
      x(t.value, k?.hasNormal ? `/win-55-ui/cursors/${p}/normal.gif` : void 0), x(l.value, k?.hasInvert ? `/win-55-ui/cursors/${p}/invert.gif` : void 0), r = (k?.hotspotX ?? 0) * ln, s = (k?.hotspotY ?? 0) * ln, v(!0), f();
    }
    function g(p) {
      return p.closest("a[href], area[href]") ? "link" : p.closest(On) ? "text" : p.closest(":disabled") ? "not-allowed" : "default";
    }
    function S(p) {
      if (!p) return;
      if (p.closest('[data-win55-cursor="off"]')) {
        y(""), n.stop();
        return;
      }
      const k = getComputedStyle(p);
      if (k.getPropertyValue(Ve).trim() !== "none") {
        y(""), n.evaluate(p);
        return;
      }
      n.stop();
      const I = k.getPropertyValue(Ue).trim();
      if (I) {
        y(I);
        return;
      }
      const z = k.getPropertyValue(At).trim() || "windows-default";
      y(De(z, g(p)) ?? "");
    }
    function j() {
      y(""), n.stop();
    }
    return Wl({
      onMove: (p, k) => {
        i = p, u = k, o && f();
      },
      onIdentity: S,
      onLeave: j
    }), ie($e, () => S(document.elementFromPoint(i, u))), ae(() => {
      at();
    }), (p, k) => (h(), H(st, { to: "body" }, [
      B("img", {
        ref_key: "invertImg",
        ref: l,
        alt: "",
        style: { position: "fixed", top: "0", left: "0", visibility: "hidden", "pointer-events": "none", "z-index": "2147483647", "image-rendering": "pixelated", "mix-blend-mode": "difference" }
      }, null, 512),
      B("img", {
        ref_key: "normalImg",
        ref: t,
        alt: "",
        style: { position: "fixed", top: "0", left: "0", visibility: "hidden", "pointer-events": "none", "z-index": "2147483647", "image-rendering": "pixelated" }
      }, null, 512)
    ]));
  }
}), Xr = /* @__PURE__ */ G({
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
    const t = e, l = T(() => t.element ?? "span"), o = Il(), r = T(() => t.scheme ?? o?.scheme.value ?? "windows-default"), s = T(() => t.role ?? o?.role.value), c = T(() => Tl() || (t.disabled ?? o?.disabled.value ?? !1)), i = T(() => t.mode ?? o?.mode.value ?? "native"), u = nt(/* @__PURE__ */ new Set()), d = nt(/* @__PURE__ */ new Set());
    function f(m) {
      u.add(m), m.finally(() => u.delete(m));
    }
    function v(m) {
      d.add(m), m.finally(() => d.delete(m));
    }
    const x = T(() => u.size > 0 || o?.hasBusy.value === !0), y = T(() => d.size > 0 || o?.hasProgress.value === !0);
    function g(m) {
      return m !== void 0 && m !== "default" ? m : x.value ? "wait" : y.value ? "progress" : m;
    }
    function S(m) {
      return De(r.value, g(m) ?? "default");
    }
    function j(m) {
      return He(r.value, g(m) ?? "default");
    }
    const p = T(() => {
      if (c.value) return "auto";
      $e.value;
      const m = Pe(r.value, "default") ?? "default", R = o?.nativeBaseCss.value;
      return !R || R === "auto" ? m : t.root || t.scheme !== void 0 ? Te(m, R) : R;
    }), k = {
      scheme: r,
      mode: i,
      role: s,
      disabled: c,
      hasBusy: x,
      hasProgress: y,
      resolveRole: S,
      resolveRoleCss: j,
      nativeBaseCss: p,
      addBusy: f,
      addProgress: v
    };
    Bl(k), n({ addBusy: f, addProgress: v, resolveRole: S, resolveRoleCss: j }), at();
    const I = A();
    ae(() => {
      I.value && Nl(I.value, k), t.root && $l(k);
    }), fe(() => {
      if (I.value && Al(I.value), !!t.root) {
        jl(k), cn(!1);
        for (const m of an) document.documentElement.style.removeProperty(m);
      }
    });
    const z = T(() => g(s.value)), w = T(
      () => t.root || t.scheme !== void 0 || t.disabled === !1 || c.value || z.value !== void 0
    ), L = T(() => {
      $e.value;
      const m = r.value, R = z.value, C = {};
      if ((t.root || t.scheme) && (C[At] = m), i.value === "immersive") {
        C.cursor = "none", C[Ve] = c.value ? "auto" : "none";
        const F = R ? De(m, R) : void 0;
        return F && (C[Ue] = F), C;
      }
      if (!w.value) return C;
      if (c.value) {
        for (const F of We) C[F] = "auto";
        return C;
      }
      const P = p.value;
      if (R) {
        const F = Te(He(m, R), P);
        for (const U of We) C[U] = F;
        return C;
      }
      return C[Ve] = P, C[$t] = Te(Pe(m, "link"), P), C[jt] = Te(Pe(m, "text"), P), C[zt] = Te(Pe(m, "not-allowed"), P), C;
    }), _ = T(() => {
      const m = {};
      return t.element || (m.display = "contents"), t.root || Object.assign(m, L.value), m;
    });
    return t.root && (bt(() => cn(t.disableAll === !0)), bt(() => {
      const m = L.value, R = document.documentElement.style;
      for (const C of an)
        m[C] !== void 0 ? R.setProperty(C, m[C]) : R.removeProperty(C);
    })), (m, R) => (h(), N(X, null, [
      (h(), H(xn(l.value), {
        style: Y(_.value),
        ref_key: "rootEl",
        ref: I
      }, {
        default: W(() => [
          Z(m.$slots, "default")
        ]),
        _: 3
      }, 8, ["style"])),
      e.root ? (h(), H(Gl, { key: 0 })) : K("", !0)
    ], 64));
  }
}), Kl = /* @__PURE__ */ G({
  __name: "HDivider",
  setup(e) {
    return (n, t) => (h(), H(de, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), Gr = /* @__PURE__ */ G({
  __name: "MenuDropdown",
  setup(e) {
    return (n, t) => (h(), H(Io, null, {
      trigger: W(() => [
        Z(n.$slots, "trigger")
      ]),
      items: W(() => [
        ne(de, { type: "panel-d-1" }, {
          default: W(() => [
            Z(n.$slots, "items")
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), ql = { style: { display: "flex", "align-items": "center" } }, Jl = ["src"], Zl = ["src"], Ql = ["checked", "disabled", "value", "name"], er = { key: 0 }, Kr = /* @__PURE__ */ G({
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
    const t = ct, l = e, o = n, r = T(() => l.modelValue === l.value), s = (c) => {
      c.preventDefault(), !l.disabled && (r.value || o("update:modelValue", l.value));
    };
    return (c, i) => he((h(), N("div", {
      class: je(["radio-container", { disabled: e.disabled }]),
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
      B("div", ql, [
        r.value ? (h(), N("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, Jl)) : (h(), N("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, Zl))
      ]),
      B("input", {
        type: "radio",
        checked: r.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, Ql),
      e.label ? (h(), N("span", er, ue(e.label), 1)) : K("", !0)
    ], 6)), [
      [M(t), e.disabled ? "not-allowed" : "link"]
    ]);
  }
}), Ie = /* @__PURE__ */ G({
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
    const n = e, t = T(() => n.element ?? "span"), l = T(() => {
      const o = Cn(n);
      return n.element || (o.display = n.display), o;
    });
    return (o, r) => (h(), H(xn(t.value), {
      style: Y(l.value)
    }, {
      default: W(() => [
        Z(o.$slots, "default")
      ]),
      _: 3
    }, 8, ["style"]));
  }
}), tr = { key: 1 }, nr = {
  key: 4,
  style: { "text-decoration": "underline" }
}, or = {
  key: 5,
  style: { "text-decoration": "line-through" }
}, lr = ["href"], rr = ["aria-label", "data-win55-emoji"], sr = ["src", "alt"], ir = /* @__PURE__ */ G({
  __name: "RichTextNode",
  props: {
    node: {},
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    function n(t, l) {
      return t ? pe(t) : Tt(l);
    }
    return (t, l) => {
      const o = ao("RichTextNode", !0);
      return e.node.type === "text" ? (h(), N(X, { key: 0 }, [
        Ae(ue(e.node.value), 1)
      ], 64)) : e.node.type === "break" ? (h(), N("br", tr)) : e.node.type === "bold" ? (h(), H(Ie, {
        key: 2,
        "is-bold": ""
      }, {
        default: W(() => [
          (h(!0), N(X, null, oe(e.node.children, (r, s) => (h(), H(o, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "italic" ? (h(), H(Ie, {
        key: 3,
        "is-italic": ""
      }, {
        default: W(() => [
          (h(!0), N(X, null, oe(e.node.children, (r, s) => (h(), H(o, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "underline" ? (h(), N("span", nr, [
        (h(!0), N(X, null, oe(e.node.children, (r, s) => (h(), H(o, {
          key: s,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "strike" ? (h(), N("span", or, [
        (h(!0), N(X, null, oe(e.node.children, (r, s) => (h(), H(o, {
          key: s,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "color" ? (h(), H(Ie, {
        key: 6,
        "font-color": e.node.value
      }, {
        default: W(() => [
          (h(!0), N(X, null, oe(e.node.children, (r, s) => (h(), H(o, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-color"])) : e.node.type === "size" && e.allowSizes ? (h(), H(Ie, {
        key: 7,
        "font-size": e.node.value
      }, {
        default: W(() => [
          (h(!0), N(X, null, oe(e.node.children, (r, s) => (h(), H(o, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-size"])) : e.node.type === "size" ? (h(!0), N(X, { key: 8 }, oe(e.node.children, (r, s) => (h(), H(o, {
        key: s,
        node: r,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "url" && e.allowLinks ? (h(), N("a", {
        key: 9,
        href: e.node.href,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "richtext-link"
      }, [
        (h(!0), N(X, null, oe(e.node.children, (r, s) => (h(), H(o, {
          key: s,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ], 8, lr)) : e.node.type === "url" ? (h(!0), N(X, { key: 10 }, oe(e.node.children, (r, s) => (h(), H(o, {
        key: s,
        node: r,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "emoji" ? (h(), N("span", {
        key: 11,
        class: "win55-emoji",
        role: "img",
        "aria-label": e.node.emoji,
        "data-win55-emoji": e.node.emoji,
        style: { "--win55-emoji-size": "30px" }
      }, [
        B("img", {
          class: "win55-emoji-image",
          src: n(e.node.code, e.node.emoji),
          alt: e.node.emoji,
          draggable: "false"
        }, null, 8, sr)
      ], 8, rr)) : K("", !0);
    };
  }
}), ar = {
  b: "bold",
  i: "italic",
  u: "underline",
  s: "strike",
  strike: "strike",
  color: "color",
  size: "size",
  url: "url"
}, cr = /* @__PURE__ */ new Set(["br"]), fn = {
  normal: 12,
  big: 24
};
function Fn(e) {
  return e.map((n) => n.type === "text" ? n.value : n.type === "emoji" ? n.emoji : n.type === "break" ? `
` : Fn(n.children)).join("");
}
function vn(e) {
  switch (e.tagType) {
    case "color":
      return { type: "color", value: e.value ?? "inherit", children: e.children };
    case "size": {
      const n = (e.value ?? "").trim().toLowerCase(), t = fn[n], l = Number.parseInt(e.value ?? "", 10);
      return { type: "size", value: t ?? (Number.isFinite(l) ? l : fn.normal), children: e.children };
    }
    case "url":
      return {
        type: "url",
        href: e.value ?? Fn(e.children).trim(),
        children: e.children
      };
    default:
      return { type: e.tagType, children: e.children };
  }
}
function ur(e, n) {
  for (let t = e.length - 1; t >= 0; t--)
    if (e[t].tagType === n) return t;
  return -1;
}
function dr(e, n) {
  if (!e) return [];
  if (!n) return [{ type: "text", value: e }];
  const t = [], l = /:([a-zA-Z0-9_+-]+):/g;
  let o = 0, r;
  for (; r = l.exec(e); ) {
    const s = n.get(r[1].toLowerCase());
    s && (r.index > o && t.push({ type: "text", value: e.slice(o, r.index) }), t.push({ type: "emoji", emoji: s.emoji, code: s.code }), o = r.index + r[0].length);
  }
  return o < e.length && t.push({ type: "text", value: e.slice(o) }), t.length > 0 ? t : [{ type: "text", value: e }];
}
function fr(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const mn = /* @__PURE__ */ new WeakMap(), vr = new RegExp(Fe, "gu");
function mr(e) {
  if (!e) return vr;
  const n = mn.get(e);
  if (n) return n;
  const t = Object.keys(e).sort((r, s) => s.length - r.length).map(fr), l = t.length > 0 ? `${t.join("|")}|${Fe}` : Fe, o = new RegExp(l, "gu");
  return mn.set(e, o), o;
}
function hr(e, n) {
  const t = mr(n), l = [];
  let o = 0, r;
  for (t.lastIndex = 0; r = t.exec(e); ) {
    const s = r[0], c = n?.[s];
    r.index > o && l.push({ type: "text", value: e.slice(o, r.index) }), l.push({ type: "emoji", emoji: s, code: c }), o = r.index + s.length;
  }
  return o < e.length && l.push({ type: "text", value: e.slice(o) }), l.length > 0 ? l : [{ type: "text", value: e }];
}
function pr(e, n, t) {
  const l = [];
  for (const o of dr(e, n))
    o.type === "text" ? l.push(...hr(o.value, t)) : l.push(o);
  return l;
}
function gr(e, n, t = null) {
  const l = [], o = [], r = /\[(\/?)(\w+)(?:=([^\]]*))?\]/g;
  let s = 0, c;
  const i = () => o.length ? o[o.length - 1].children : l, u = (d) => i().push(...pr(d, n, t));
  for (; c = r.exec(e); ) {
    const [d, f, v, x] = c, y = v.toLowerCase();
    if (cr.has(y)) {
      u(e.slice(s, c.index)), s = c.index + d.length, i().push({ type: "break" });
      continue;
    }
    const g = ar[y];
    if (!g) continue;
    if (u(e.slice(s, c.index)), s = c.index + d.length, !f) {
      o.push({ tagType: g, value: x, children: [] });
      continue;
    }
    const S = ur(o, g);
    if (S === -1) {
      u(d);
      continue;
    }
    for (; o.length > S + 1; ) {
      const p = o.pop();
      o[o.length - 1].children.push(vn(p));
    }
    const j = o.pop();
    i().push(vn(j));
  }
  for (u(e.slice(s)); o.length; ) {
    const d = o.pop();
    (o.length ? o[o.length - 1].children : l).push(...d.children);
  }
  return l;
}
const wr = {
  "data-win55-richtext": "",
  style: { display: "contents" }
}, qr = /* @__PURE__ */ G({
  __name: "RichText",
  props: {
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    const n = ct, t = e, l = yn(), o = A(null), r = A(null);
    Bt().then((u) => {
      const d = /* @__PURE__ */ new Map();
      for (const f of u)
        for (const v of f.shortcodes)
          d.set(v.toLowerCase(), { emoji: f.emoji, code: f.code });
      o.value = d;
    }), ke().then((u) => {
      r.value = u;
    });
    const s = T(() => {
      const u = o.value;
      return u ? { get: (d) => u.get(d) } : null;
    });
    function c(u) {
      return u.map((d) => typeof d.children == "string" ? d.children : Array.isArray(d.children) ? c(d.children) : "").join("");
    }
    const i = T(() => gr(c(l.default?.() ?? []), s.value, r.value));
    return (u, d) => he((h(), N("span", wr, [
      (h(!0), N(X, null, oe(i.value, (f, v) => (h(), H(ir, {
        key: v,
        node: f,
        "allow-links": t.allowLinks,
        "allow-sizes": t.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
    ])), [
      [M(n), "text"]
    ]);
  }
});
function yr(e, n, t, l, o) {
  const r = e.getContext("2d");
  if (!r) return;
  r.clearRect(0, 0, e.width, e.height);
  const s = 2, c = [
    [0, 48, 12, 60, 3, 51, 15, 63],
    [32, 16, 44, 28, 35, 19, 47, 31],
    [8, 56, 4, 52, 11, 59, 7, 55],
    [40, 24, 36, 20, 43, 27, 39, 23],
    [2, 50, 14, 62, 1, 49, 13, 61],
    [34, 18, 46, 30, 33, 17, 45, 29],
    [10, 58, 6, 54, 9, 57, 5, 53],
    [42, 26, 38, 22, 41, 25, 37, 21]
  ], i = hn(l), u = hn(o), d = Math.floor(n / s), f = Math.floor(t / s);
  e.width = Math.floor(n * 2) / 2, e.height = Math.floor(t * 2) / 2;
  for (let v = 0; v < f; v++)
    for (let x = 0; x < d; x++) {
      const y = x * s, g = v * s, S = (x + v) / (d + f - 6), j = (c[v % 8][x % 8] + 0.5) / 64, p = S > j ? 1 : 0, k = Math.round(i.r * (1 - p) + u.r * p), I = Math.round(i.g * (1 - p) + u.g * p), z = Math.round(i.b * (1 - p) + u.b * p);
      r.fillStyle = `rgb(${k}, ${I}, ${z})`, r.fillRect(y, g, s, s);
    }
}
function hn(e) {
  const n = e.replace("#", ""), t = parseInt(n, 16);
  return {
    r: t >> 16 & 255,
    g: t >> 8 & 255,
    b: t & 255
  };
}
const xr = { style: { height: "0", overflow: "visible" } }, br = { class: "titlebar-content" }, Er = { class: "titlebar-image" }, Cr = ["src"], Sr = { class: "titlebar-text" }, kr = { class: "titlebar-buttons" }, Rr = /* @__PURE__ */ G({
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
    const n = e, t = A(null);
    let l = null;
    function o(s, c) {
      const i = n.gradientColorA || "5555ff", u = n.gradientColorB || "0000aa";
      yr(s, s.width, s.height, i, u), c.fillStyle = "#555555", c.fillRect(0, s.height - 2, Math.floor(s.width / 2) * 2, 4);
    }
    function r() {
      const s = t.value;
      if (!s) return;
      const c = s.getContext("2d");
      if (!c) return;
      const i = s.getBoundingClientRect(), u = Math.floor(i.width * 2) / 2, d = Math.floor(i.height * 2) / 2;
      (s.width !== u || s.height !== d) && (s.width = u, s.height = d), o(s, c);
    }
    return ie(() => [n.gradientColorA, n.gradientColorB], () => {
      if (t.value) {
        const s = t.value.getContext("2d");
        s && o(t.value, s);
      }
    }), ae(() => {
      r(), t.value && (l = new ResizeObserver(() => {
        r();
      }), l.observe(t.value));
    }), fe(() => {
      l?.disconnect();
    }), (s, c) => (h(), N("div", null, [
      B("div", xr, [
        B("canvas", {
          ref_key: "canvasRef",
          ref: t,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      B("div", br, [
        B("div", Er, [
          B("img", {
            src: e.icon ?? "/win-55-ui/icons/program.png"
          }, null, 8, Cr)
        ]),
        B("div", Sr, [
          ne(Ie, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: W(() => [
              Ae(ue(e.title), 1)
            ]),
            _: 1
          })
        ]),
        B("div", kr, [
          Z(s.$slots, "buttons"),
          e.placeholderButtons ? (h(), N(X, { key: 0 }, [
            ne(tt, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: W(() => [...c[0] || (c[0] = [
                B("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/o.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            ne(tt, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: W(() => [...c[1] || (c[1] = [
                B("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/_.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            c[3] || (c[3] = B("div", { style: { width: "2px" } }, null, -1)),
            ne(tt, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: W(() => [...c[2] || (c[2] = [
                B("img", {
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
}), Jr = /* @__PURE__ */ G({
  __name: "Tooltip",
  props: {
    text: {},
    offsetX: {},
    offsetY: {}
  },
  setup(e) {
    const n = e, t = A(!1), l = nt({ x: 0, y: 0 });
    let o = null;
    const r = () => {
      o = window.setTimeout(() => {
        t.value = !0;
      }, 400);
    }, s = () => {
      o !== null && (clearTimeout(o), o = null), t.value = !1;
    }, c = (u) => {
      l.x = u.clientX + (n.offsetX ?? 24), l.y = u.clientY + (n.offsetY ?? 24);
    }, i = T(() => ({
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
    }), (u, d) => (h(), N("span", {
      onMouseenter: r,
      onMouseleave: s,
      onMousemove: c,
      style: { position: "relative", display: "inline-block" }
    }, [
      Z(u.$slots, "default"),
      t.value ? (h(), H(de, {
        key: 0,
        style: Y(i.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: W(() => [
          Ae(ue(n.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : K("", !0)
    ], 32));
  }
}), Tr = {
  class: "window-container",
  style: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%"
  }
}, qe = 6, Br = /* @__PURE__ */ G({
  __name: "Window",
  props: /* @__PURE__ */ rt({
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
    const n = _l, t = e, l = be(e, "x"), o = be(e, "y"), r = be(e, "width"), s = be(e, "height"), c = t.minWidth ?? 240, i = t.minHeight ?? 40, u = T(() => (t.resizable ?? !1) || (t.resizableHorizontally ?? !1)), d = T(() => (t.resizable ?? !1) || (t.resizableVertically ?? !1));
    let f = !1, v = !1;
    const x = A("");
    let y = "";
    const g = {
      n: "ns-resize",
      s: "ns-resize",
      e: "ew-resize",
      w: "ew-resize",
      ne: "nesw-resize",
      sw: "nesw-resize",
      nw: "nwse-resize",
      se: "nwse-resize"
    }, S = T(() => g[x.value] ?? "");
    let j = 0, p = 0, k = 0, I = 0, z = 0, w = 0;
    function L(P) {
      if (t.faux || x.value) return;
      const F = P.target;
      F.closest(".titlebar-image") || F.closest(".titlebar-buttons") || (f = !0, j = P.clientX, p = P.clientY, z = l.value, w = o.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", m), window.addEventListener("mouseup", R));
    }
    function _(P) {
      t.faux || x.value && (!u.value && !d.value || (v = !0, y = x.value, j = P.clientX, p = P.clientY, k = r.value, I = s.value, z = l.value, w = o.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", m), window.addEventListener("mouseup", R)));
    }
    function m(P) {
      if (t.faux) return;
      const F = P.clientX - j, U = P.clientY - p;
      if (f && (l.value = z + F, o.value = w + U), v) {
        const J = y;
        if (u.value && J.includes("e") && (r.value = Math.max(c, k + F)), d.value && J.includes("s") && (s.value = Math.max(i, I + U)), u.value && J.includes("w")) {
          const q = k - F, Q = Math.max(c, q);
          r.value = Q, l.value = z + (k - Q);
        }
        if (d.value && J.includes("n")) {
          const q = I - U, Q = Math.max(i, q);
          s.value = Q, o.value = w + (I - Q);
        }
      }
    }
    function R() {
      f = !1, v = !1, y = "", x.value = "", document.body.style.userSelect = "", window.removeEventListener("mousemove", m), window.removeEventListener("mouseup", R);
    }
    function C(P) {
      if (t.faux) {
        x.value = "";
        return;
      }
      if (v) return;
      if (!u.value && !d.value) {
        x.value = "";
        return;
      }
      const U = P.currentTarget.getBoundingClientRect(), J = P.clientX - U.left, q = U.right - P.clientX, Q = P.clientY - U.top, ge = U.bottom - P.clientY;
      let le = "";
      d.value && (Q < qe ? le += "n" : ge < qe && (le += "s")), u.value && (J < qe ? le += "w" : q < qe && (le += "e")), x.value = le;
    }
    return (P, F) => he((h(), H(de, {
      "extra-class": e.extraClass,
      "extra-styles": t.faux ? e.extraStyles : {
        position: "absolute",
        left: l.value + "px",
        top: o.value + "px",
        width: r.value + "px",
        height: s.value + "px",
        ...e.extraStyles
      },
      type: "panel-d-2",
      onMousemove: C,
      onMousedown: _
    }, {
      default: W(() => [
        B("div", Tr, [
          B("div", {
            class: "titlebar-wrapper",
            onMousedown: _e(L, ["stop"]),
            style: { height: "34px" }
          }, [
            ne(Rr, {
              title: e.title,
              icon: e.icon,
              "placeholder-buttons": e.placeholderButtons,
              disabled: e.disabled,
              "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
              "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
            }, {
              buttons: W(() => [
                Z(P.$slots, "titlebar-buttons")
              ]),
              _: 3
            }, 8, ["title", "icon", "placeholder-buttons", "disabled", "gradient-color-a", "gradient-color-b"])
          ], 32),
          B("div", {
            class: "inner-container",
            style: Y({
              flex: "1",
              overflowX: t.overflowX ?? "auto",
              overflowY: t.overflowY ?? "auto",
              marginTop: "4px",
              boxSizing: "border-box"
            })
          }, [
            Z(P.$slots, "default")
          ], 4)
        ])
      ]),
      _: 3
    }, 8, ["extra-class", "extra-styles"])), [
      [M(n), S.value]
    ]);
  }
}), Ir = { class: "label" }, Nr = { class: "label-text" }, Ar = /* @__PURE__ */ G({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" }
  },
  setup(e) {
    return (n, t) => (h(), H(de, {
      type: "border-groove",
      "extra-styles": { padding: "10px", margin: "10px" }
    }, {
      default: W(() => [
        B("div", Ir, [
          B("div", {
            class: "line-hider",
            style: Y({ backgroundColor: e.backgroundColorHint })
          }, null, 4),
          B("div", Nr, ue(e.label), 1)
        ]),
        Z(n.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }));
  }
}), Zr = /* @__PURE__ */ Rt(Ar, [["__scopeId", "data-v-43f13cf9"]]), pn = "/win-55-ui/emoji/emoji-by-category.json";
let xt = null;
async function gn() {
  return xt || (xt = fetch(pn).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${pn}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), xt;
}
const $r = { class: "emoji-picker-body" }, jr = { class: "emoji-picker-tabs" }, zr = ["onClick"], Lr = { class: "emoji-picker-grid" }, Or = ["src", "title", "onClick"], Mr = "546", Qr = /* @__PURE__ */ G({
  __name: "EmojiPickerWindow",
  setup(e) {
    const n = A(null), t = A([]), l = A(null), o = A(void 0), r = T(() => t.value.find((u) => u.category === l.value) ?? null);
    async function s() {
      if (Math.random() < 0.75) {
        o.value = pe(Mr);
        return;
      }
      const d = (await gn()).flatMap((v) => v.emojis);
      if (d.length === 0) return;
      const f = d[Math.floor(Math.random() * d.length)];
      o.value = pe(f.code);
    }
    ie(Ne, async (u) => {
      u && (s(), t.value.length === 0 && (t.value = await gn(), l.value = t.value[0]?.category ?? null));
    }, { immediate: !0 });
    function c(u) {
      l.value = u;
    }
    function i(u) {
      if (!Ne.value) return;
      const d = u.target;
      n.value?.contains(d) || tn();
    }
    return ae(() => {
      document.addEventListener("click", i);
    }), fe(() => {
      document.removeEventListener("click", i);
    }), (u, d) => (h(), H(st, { to: "body" }, [
      M(Ne) ? (h(), N("div", {
        key: 0,
        ref_key: "rootRef",
        ref: n,
        style: { display: "contents" }
      }, [
        ne(Br, {
          x: M(xe).x,
          "onUpdate:x": d[0] || (d[0] = (f) => M(xe).x = f),
          y: M(xe).y,
          "onUpdate:y": d[1] || (d[1] = (f) => M(xe).y = f),
          width: M(xe).width,
          "onUpdate:width": d[2] || (d[2] = (f) => M(xe).width = f),
          height: M(xe).height,
          "onUpdate:height": d[3] || (d[3] = (f) => M(xe).height = f),
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
          "titlebar-buttons": W(() => [
            ne(tt, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              onClick: M(tn)
            }, {
              default: W(() => [...d[4] || (d[4] = [
                B("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/x.png"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]),
          default: W(() => [
            ne(de, {
              type: "textarea",
              "extra-styles": { width: "100%", height: "calc(100% - 2px)", marginTop: "2px", padding: "2px" }
            }, {
              default: W(() => [
                B("div", $r, [
                  B("div", jr, [
                    (h(!0), N(X, null, oe(t.value, (f) => (h(), N("span", {
                      key: f.category,
                      class: je(["emoji-picker-tab", { "emoji-picker-tab--selected": f.category === l.value }]),
                      onClick: (v) => c(f.category)
                    }, [
                      ne(Ie, {
                        shorthand: f.category === l.value ? "Bold12" : "Regular12"
                      }, {
                        default: W(() => [
                          Ae(ue(f.category), 1)
                        ]),
                        _: 2
                      }, 1032, ["shorthand"])
                    ], 10, zr))), 128))
                  ]),
                  ne(Kl),
                  B("div", Lr, [
                    (h(!0), N(X, null, oe(r.value?.emojis ?? [], (f) => (h(), N("div", {
                      key: f.code,
                      class: "emoji-picker-grid-cell"
                    }, [
                      B("img", {
                        src: M(pe)(f.code),
                        title: f.shortcodes[0] ? `:${f.shortcodes[0]}:` : void 0,
                        class: "emoji-picker-grid-item",
                        onClick: (v) => M(dl)(f.emoji)
                      }, null, 8, Or)
                    ]))), 128))
                  ])
                ])
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["x", "y", "width", "height", "icon"])
      ], 512)) : K("", !0)
    ]));
  }
}), Pr = ["src", "alt", "width", "height"], wn = 15, Je = 2, es = /* @__PURE__ */ G({
  __name: "Emoji",
  props: {
    emoji: {}
  },
  setup(e) {
    const n = e, t = new RegExp(`^(?:${Fe})$`, "u"), l = A(""), o = A(n.emoji), r = A(wn * Je), s = A(wn * Je);
    async function c(u) {
      if (t.test(u)) {
        o.value = u;
        const f = await Mo(u);
        l.value = f ?? Tt(u);
        return;
      }
      const d = await jn(u);
      if (d) {
        o.value = d.emoji, l.value = pe(d.code);
        return;
      }
      console.warn(`[win-55-ui] Emoji: could not resolve "${u}" as an emoji or a shortcode alias.`), o.value = u, l.value = "";
    }
    ie(() => n.emoji, (u) => {
      c(u);
    }, { immediate: !0 });
    function i(u) {
      const d = u.target;
      r.value = d.naturalWidth * Je, s.value = d.naturalHeight * Je;
    }
    return (u, d) => (h(), N("img", {
      class: "win55-emoji-standalone",
      src: l.value,
      alt: o.value,
      width: r.value,
      height: s.value,
      draggable: "false",
      onLoad: i
    }, null, 40, Pr));
  }
}), ts = (e, n = 20, t = 48, l = 30) => {
  const o = A(
    Array.from({ length: e }, (u, d) => ({
      sin: Math.sin(0 + d * Math.PI * 2 / e),
      cos: Math.cos(0 + d * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let r = 0, s = 0;
  const c = n > 0 ? 1e3 / n : 0, i = () => {
    r = requestAnimationFrame(i);
    const u = Date.now();
    if (u - s < c) return;
    s = u;
    const d = Array.from({ length: e }, (y, g) => ({
      sin: Math.sin(u / (1e3 + g * 200) + g * Math.PI * 2 / e),
      cos: Math.cos(u / (3e3 + g * 400) + g * Math.PI * 2 / e + Math.PI / 4)
    })), f = d.map((y) => t + y.sin * l), v = e * t, x = f.reduce((y, g) => y + g, 0);
    if (x > 0) {
      const y = v / x;
      o.value = d.map((g) => ({
        sin: ((t + g.sin * l) * y - t) / l,
        cos: g.cos
      }));
    } else
      o.value = d;
  };
  return ae(() => {
    r = requestAnimationFrame(i);
  }), fe(() => {
    cancelAnimationFrame(r);
  }), { values: o };
};
function ns(e) {
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
  Bo as Balloon,
  Io as BaseDropdown,
  Wr as BaseInput,
  de as Box,
  tt as Button,
  Ln as CURSOR_CONTEXT_KEY,
  Yr as Checkbox,
  Xr as CursorContext,
  es as Emoji,
  Qr as EmojiPickerWindow,
  Kl as HDivider,
  Gr as MenuDropdown,
  Zr as NamedPanel,
  Kr as RadioButton,
  qr as RichText,
  Rr as Titlebar,
  Jr as Tooltip,
  Ie as Typography,
  Br as Window,
  It as activeTarget,
  tn as closePicker,
  _l as cursorDirective,
  ct as cursorWeakDirective,
  Vr as customEmojiDirective,
  yr as drawAngledBayerDitherGradient,
  rl as emojiDirective,
  Mo as getEmojiGifPath,
  pe as getEmojiGifPathFromCode,
  Dr as getEmojiRegistry,
  Me as getSelectionOffset,
  ce as getTextWithCustomEmoji,
  Hr as hasEmoji,
  dl as insertEmoji,
  ke as loadEmojiRegistry,
  Ur as loadSchemeIndex,
  ul as openPicker,
  fl as pickNextButtonIcon,
  Ne as pickerOpen,
  xe as pickerPosition,
  Bl as provideCursorContext,
  en as registerActiveInput,
  ns as registerGlobalImageErrorHandler,
  Fr as resetEmojiRegistryCache,
  Ze as restoreSelectionOffset,
  Cn as typographyStyles,
  Il as useCursorContext,
  ts as useSineWave
};
