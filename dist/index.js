import { defineComponent as U, computed as B, ref as j, onMounted as ce, onBeforeUnmount as uo, openBlock as w, createElementBlock as $, normalizeClass as Le, createElementVNode as I, withDirectives as he, vShow as Ge, withModifiers as _e, normalizeStyle as X, createCommentVNode as K, reactive as nt, watch as ae, useModel as be, unref as P, Fragment as G, createBlock as F, renderSlot as J, mergeModels as rt, useSlots as bn, nextTick as kt, onUnmounted as fe, Teleport as st, createVNode as Q, withCtx as V, createTextVNode as $e, toDisplayString as de, inject as En, provide as Cn, shallowRef as fo, renderList as oe, mergeProps as Sn, watchEffect as bt, resolveDynamicComponent as kn, resolveComponent as vo } from "vue";
const mo = ["src"], ho = ["src"], po = {
  key: 0,
  class: "sb-nubs"
}, go = ["src"], yo = ["src"], ft = 32, wo = 500, xo = 50, bo = 28, Eo = /* @__PURE__ */ U({
  __name: "ScrollBar",
  props: {
    orientation: {},
    scrollPos: {},
    viewportSize: {},
    contentSize: {}
  },
  emits: ["scrollTo", "scrollBy"],
  setup(e, { emit: n }) {
    const t = e, o = n, l = B(() => t.orientation === "vertical"), r = B(() => l.value ? "up" : "left"), s = B(() => l.value ? "down" : "right"), a = (O, W) => `/win-55-ui/whole-components/scrollbar-buttons/btn-${O}${W ? "-pressed" : ""}.png`, f = j(null), i = j(0);
    let d = null;
    function u() {
      const O = f.value;
      O && (i.value = l.value ? O.offsetHeight : O.offsetWidth);
    }
    ce(() => {
      u(), d = new ResizeObserver(u), f.value && d.observe(f.value);
    });
    const v = B(() => t.contentSize - t.viewportSize), h = B(() => v.value > 0), p = (O) => Math.round(O / 2) * 2, g = B(() => {
      if (!h.value) return 0;
      const O = p(i.value * t.viewportSize / t.contentSize);
      return Math.min(i.value, Math.max(bo, O));
    }), E = B(() => {
      const O = i.value - g.value;
      return !h.value || O <= 0 ? 0 : Math.min(O, Math.max(0, p(t.scrollPos / v.value * O)));
    }), N = B(() => g.value > 50), x = B(
      () => l.value ? { height: `${g.value}px`, transform: `translateY(${E.value}px)` } : { width: `${g.value}px`, transform: `translateX(${E.value}px)` }
    );
    let R = 0;
    function b() {
      clearTimeout(R);
    }
    function A(O) {
      b(), O(), R = window.setTimeout(function W() {
        O(), R = window.setTimeout(W, xo);
      }, wo);
    }
    uo(() => {
      b(), d?.disconnect();
    });
    const y = j(null);
    function L(O, W) {
      O.button === 0 && (O.currentTarget.setPointerCapture(O.pointerId), y.value = W, A(() => o("scrollBy", W === "start" ? -ft : ft)));
    }
    function _() {
      y.value = null, b();
    }
    const m = (O) => l.value ? O.clientY : O.clientX;
    let T = 0, C = !1;
    function M(O) {
      const te = f.value.getBoundingClientRect();
      return l.value ? O.clientY - te.top : O.clientX - te.left;
    }
    function D(O) {
      O.button !== 0 || !h.value || (f.value.setPointerCapture(O.pointerId), C = !0, T = M(O), A(() => {
        const W = Math.max(2, t.viewportSize - ft);
        T < E.value ? o("scrollBy", -W) : T > E.value + g.value && o("scrollBy", W);
      }));
    }
    function Y(O) {
      C && (T = M(O));
    }
    function Z() {
      C = !1, b();
    }
    let q = null;
    function ee(O) {
      O.button === 0 && (O.currentTarget.setPointerCapture(O.pointerId), q = { start: m(O), startScroll: t.scrollPos });
    }
    function ge(O) {
      if (!q) return;
      const W = i.value - g.value;
      W <= 0 || o("scrollTo", q.startScroll + (m(O) - q.start) * v.value / W);
    }
    function le() {
      q = null;
    }
    return (O, W) => (w(), $("div", {
      class: Le(["win55-scrollbar", e.orientation]),
      "aria-hidden": "true"
    }, [
      I("div", {
        class: "sb-button",
        onPointerdown: W[0] || (W[0] = (te) => L(te, "start")),
        onPointerup: _,
        onPointercancel: _
      }, [
        he(I("img", {
          src: a(r.value, !1),
          draggable: "false"
        }, null, 8, mo), [
          [Ge, y.value !== "start"]
        ]),
        he(I("img", {
          src: a(r.value, !0),
          draggable: "false"
        }, null, 8, ho), [
          [Ge, y.value === "start"]
        ])
      ], 32),
      I("div", {
        ref_key: "trackRef",
        ref: f,
        class: "sb-track",
        onPointerdown: D,
        onPointermove: Y,
        onPointerup: Z,
        onPointercancel: Z
      }, [
        h.value ? (w(), $("div", {
          key: 0,
          class: "sb-thumb",
          style: X(x.value),
          onPointerdown: _e(ee, ["stop"]),
          onPointermove: ge,
          onPointerup: le,
          onPointercancel: le
        }, [
          N.value ? (w(), $("div", po)) : K("", !0)
        ], 36)) : K("", !0)
      ], 544),
      I("div", {
        class: "sb-button",
        onPointerdown: W[1] || (W[1] = (te) => L(te, "end")),
        onPointerup: _,
        onPointercancel: _
      }, [
        he(I("img", {
          src: a(s.value, !1),
          draggable: "false"
        }, null, 8, go), [
          [Ge, y.value !== "end"]
        ]),
        he(I("img", {
          src: a(s.value, !0),
          draggable: "false"
        }, null, 8, yo), [
          [Ge, y.value === "end"]
        ])
      ], 32)
    ], 2));
  }
}), Tt = (e, n) => {
  const t = e.__vccOpts || e;
  for (const [o, l] of n)
    t[o] = l;
  return t;
}, Yt = /* @__PURE__ */ Tt(Eo, [["__scopeId", "data-v-08aa801a"]]), vt = 28;
function ot(e) {
  return e === "hidden" || e === "scroll" || e === "auto";
}
function Co(e, n) {
  if (ot(e) === ot(n)) return { x: e, y: n };
  const t = (o) => o === "clip" ? "hidden" : o === "visible" ? "auto" : o;
  return { x: t(e), y: t(n) };
}
function we(e, n) {
  return Math.min(n, Math.max(0, Math.round(e / 2) * 2));
}
const So = 4, ko = 100;
function To(e, n, t) {
  const o = j(null), l = j(null), r = B(
    () => Co(e.overflowX ?? e.overflow ?? "visible", e.overflowY ?? e.overflow ?? "visible")
  ), s = B(() => ot(r.value.x) || ot(r.value.y)), a = j(r.value.y === "scroll"), f = j(r.value.x === "scroll"), i = nt({ top: 0, left: 0, clientW: 0, clientH: 0, scrollW: 0, scrollH: 0 }), d = B(() => s.value ? {
    display: "grid",
    gridTemplateColumns: a.value ? `minmax(0, 1fr) ${vt}px` : "minmax(0, 1fr)",
    gridTemplateRows: f.value ? `minmax(0, 1fr) ${vt}px` : "minmax(0, 1fr)"
  } : { overflowX: e.overflowX ?? e.overflow, overflowY: e.overflowY ?? e.overflow }), u = B(() => ({
    overflowX: r.value.x,
    overflowY: r.value.y
  }));
  function v(m) {
    i.top = m.scrollTop, i.left = m.scrollLeft, i.clientW = m.clientWidth, i.clientH = m.clientHeight, i.scrollW = m.scrollWidth, i.scrollH = m.scrollHeight;
  }
  function h(m) {
    const T = we(m.scrollTop, m.scrollHeight - m.clientHeight), C = we(m.scrollLeft, m.scrollWidth - m.clientWidth);
    Math.abs(T - m.scrollTop) > 0.01 && (m.scrollTop = T), Math.abs(C - m.scrollLeft) > 0.01 && (m.scrollLeft = C);
  }
  let p = null, g = null, E = 0, N = 0;
  function x() {
    E || (E = requestAnimationFrame(() => {
      E = 0, R();
    }));
  }
  function R() {
    const m = o.value, T = l.value;
    if (!m || !T) return;
    T.style.display = "none";
    const C = m.scrollHeight, M = m.scrollWidth, D = m.clientHeight, Y = m.clientWidth, Z = vt, { x: q, y: ee } = r.value, ge = e.forgiveVerticalOverflow ? So : 0, le = Y + (a.value ? Z : 0), O = D + (f.value ? Z : 0);
    let W = ee === "scroll", te = q === "scroll";
    ee === "auto" && C - ge > O && (W = !0), q === "auto" && M > le - (W ? Z : 0) && (te = !0), ee === "auto" && !W && C - ge > O - (te ? Z : 0) && (W = !0);
    const ze = W !== a.value;
    a.value = W, ze && q === "auto" || (f.value = te);
    const ye = (C - D) % 2 !== 0, ve = (M - Y) % 2 !== 0;
    (ye || ve) && (T.style.top = ye ? `${C}px` : "0px", T.style.left = ve ? `${M}px` : "0px", T.style.display = "block"), g?.takeRecords();
    for (const Oe of Array.from(m.children)) p?.observe(Oe);
    h(m), v(m);
  }
  function b() {
    clearTimeout(N);
    const m = o.value;
    m && (h(m), v(m));
  }
  function A() {
    const m = o.value;
    if (!m) return;
    v(m);
    const T = we(m.scrollTop, m.scrollHeight - m.clientHeight), C = we(m.scrollLeft, m.scrollWidth - m.clientWidth);
    n.value !== T && (n.value = T), t.value !== C && (t.value = C), clearTimeout(N), N = window.setTimeout(b, ko);
  }
  function y(m, T) {
    const C = o.value;
    C && (m === "y" ? C.scrollTop = we(T, C.scrollHeight - C.clientHeight) : C.scrollLeft = we(T, C.scrollWidth - C.clientWidth));
  }
  function L(m, T) {
    const C = o.value;
    C && y(m, (m === "y" ? C.scrollTop : C.scrollLeft) + T);
  }
  function _(m) {
    const T = o.value, C = m === "y" ? n : t;
    if (!T || C.value === void 0) return;
    const M = m === "y" ? T.scrollTop : T.scrollLeft, D = m === "y" ? T.scrollHeight - T.clientHeight : T.scrollWidth - T.clientWidth;
    if (we(M, D) === C.value) return;
    y(m, C.value);
    const Y = we(C.value, D);
    C.value !== Y && (C.value = Y);
  }
  return ae(n, () => _("y")), ae(t, () => _("x")), ae([r, () => e.forgiveVerticalOverflow], R, { flush: "post" }), ae(
    o,
    (m, T, C) => {
      m && (p = new ResizeObserver(x), p.observe(m), g = new MutationObserver(x), g.observe(m, { childList: !0, subtree: !0, characterData: !0, attributes: !0 }), R(), _("y"), _("x"), C(() => {
        p?.disconnect(), g?.disconnect(), p = null, g = null, clearTimeout(N), cancelAnimationFrame(E), E = 0;
      }));
    },
    { flush: "post" }
  ), {
    wrapperRef: o,
    spacerRef: l,
    scrollMode: s,
    showV: a,
    showH: f,
    metrics: i,
    rootStyle: d,
    wrapperStyle: u,
    onScroll: A,
    snapNow: b,
    scrollToAxis: y,
    scrollByAxis: L
  };
}
const Ro = {
  key: 2,
  class: "win55-sb-corner"
}, Bo = /* @__PURE__ */ U({
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
    const t = e, o = be(e, "scrollTop"), l = be(e, "scrollLeft"), r = j(null), {
      wrapperRef: s,
      spacerRef: a,
      scrollMode: f,
      showV: i,
      showH: d,
      metrics: u,
      rootStyle: v,
      wrapperStyle: h,
      onScroll: p,
      snapNow: g,
      scrollToAxis: E,
      scrollByAxis: N
    } = To(t, o, l), x = B(() => ({
      "--img": `url(/win-55-ui/${t.type}.png)`,
      ...v.value,
      ...t.extraStyles
    }));
    return n({ el: r, scrollEl: s, verticalBarVisible: i }), (R, b) => (w(), $("div", {
      ref_key: "rootRef",
      ref: r,
      class: Le(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: X(x.value)
    }, [
      P(f) ? (w(), $(G, { key: 0 }, [
        P(i) ? (w(), F(Yt, {
          key: 0,
          class: "win55-sb-v",
          orientation: "vertical",
          "scroll-pos": P(u).top,
          "viewport-size": P(u).clientH,
          "content-size": P(u).scrollH,
          onScrollTo: b[0] || (b[0] = (A) => P(E)("y", A)),
          onScrollBy: b[1] || (b[1] = (A) => P(N)("y", A))
        }, null, 8, ["scroll-pos", "viewport-size", "content-size"])) : K("", !0),
        P(d) ? (w(), F(Yt, {
          key: 1,
          class: "win55-sb-h",
          orientation: "horizontal",
          "scroll-pos": P(u).left,
          "viewport-size": P(u).clientW,
          "content-size": P(u).scrollW,
          onScrollTo: b[2] || (b[2] = (A) => P(E)("x", A)),
          onScrollBy: b[3] || (b[3] = (A) => P(N)("x", A))
        }, null, 8, ["scroll-pos", "viewport-size", "content-size"])) : K("", !0),
        P(i) && P(d) ? (w(), $("div", Ro)) : K("", !0),
        I("div", {
          ref_key: "wrapperRef",
          ref: s,
          class: "win55-scroll-wrapper",
          style: X(P(h)),
          onScroll: b[4] || (b[4] = //@ts-ignore
          (...A) => P(p) && P(p)(...A)),
          onScrollend: b[5] || (b[5] = //@ts-ignore
          (...A) => P(g) && P(g)(...A))
        }, [
          J(R.$slots, "default", {}, void 0, !0),
          I("div", {
            ref_key: "spacerRef",
            ref: a,
            class: "win55-scroll-spacer",
            "aria-hidden": "true"
          }, null, 512)
        ], 36)
      ], 64)) : J(R.$slots, "default", { key: 1 }, void 0, !0)
    ], 6));
  }
}), ie = /* @__PURE__ */ Tt(Bo, [["__scopeId", "data-v-c896ad2e"]]), Io = { class: "balloon-tip-box" }, No = {
  key: 1,
  class: "balloon-wrapper"
}, Ao = { class: "balloon-tip-box" }, Ke = 8, $o = /* @__PURE__ */ U({
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
    function t(y) {
      return "top" in y;
    }
    function o(y) {
      return t(y) ? y : { top: y.y, bottom: y.y, left: y.x, right: y.x };
    }
    const l = e, r = bn(), s = B(() => l.side ?? "top"), a = B(() => l.bias), f = j(s.value), i = B(() => l.anchor ? f.value : s.value), d = B(() => {
      const y = {};
      switch (s.value) {
        case "top":
          y.bottom = "100%", y.left = "50%", y.transform = "translateX(-50%)";
          break;
        case "bottom":
          y.top = "100%", y.left = "50%", y.transform = "translateX(-50%)";
          break;
        case "left":
          y.right = "100%", y.top = "50%", y.transform = "translateY(-50%)";
          break;
        case "right":
          y.left = "100%", y.top = "50%", y.transform = "translateY(-50%)";
          break;
      }
      return y;
    }), u = B(() => {
      switch (i.value) {
        case "top":
          return "column";
        case "bottom":
          return "column-reverse";
        case "left":
          return "row";
        case "right":
          return "row-reverse";
      }
    }), v = B(() => {
      let y = "", L = !1;
      switch (i.value) {
        case "top":
          y = "rotate(0deg)", a.value === "right" && (L = !0);
          break;
        case "bottom":
          y = "rotate(180deg)", a.value === "left" && (L = !0);
          break;
        case "left":
          y = "rotate(-90deg)";
          break;
        case "right":
          y = "rotate(90deg)", L = !0;
          break;
      }
      return L ? `${y} scaleX(-1)` : y;
    }), h = B(() => {
      const y = {};
      return a.value ? ((i.value === "top" || i.value === "bottom") && (a.value === "left" && (y.transform = "translateX(calc(-50% + 28px))"), a.value === "right" && (y.transform = "translateX(calc(50% - 28px))")), (i.value === "left" || i.value === "right") && (a.value === "up" && (y.transform = "translateY(calc(-50% + 28px))"), a.value === "down" && (y.transform = "translateY(calc(50% - 28px))")), y) : {};
    }), p = j(null), g = j(null), E = { top: "bottom", bottom: "top", left: "right", right: "left" }, N = {
      top: ["left", "right"],
      bottom: ["left", "right"],
      left: ["top", "bottom"],
      right: ["top", "bottom"]
    };
    function x(y, L, _) {
      const m = (L.left + L.right) / 2, T = (L.top + L.bottom) / 2;
      return y === "top" || y === "bottom" ? {
        top: y === "top" ? L.top - _.height : L.bottom,
        left: m - _.width / 2
      } : {
        left: y === "left" ? L.left - _.width : L.right,
        top: T - _.height / 2
      };
    }
    function R(y, L, _, m) {
      return y.top >= Ke && y.left >= Ke && y.top + L.height <= m - Ke && y.left + L.width <= _ - Ke;
    }
    function b() {
      const y = p.value;
      if (!l.anchor || !y) return;
      const L = o(l.anchor), _ = y.getBoundingClientRect(), m = window.innerWidth, T = window.innerHeight, C = l.side ?? "top", D = [
        C,
        E[C],
        ...N[C]
      ].find((Y) => R(x(Y, L, _), _, m, T)) ?? C;
      f.value = D, g.value = x(D, L, _);
    }
    ae(
      [() => l.anchor, n],
      async ([y, L]) => {
        !y || !L || (await kt(), b());
      },
      { deep: !0, immediate: !0 }
    );
    const A = () => {
      l.anchor && n.value && b();
    };
    return ce(() => {
      window.addEventListener("resize", A), window.addEventListener("scroll", A, !0);
    }), fe(() => {
      window.removeEventListener("resize", A), window.removeEventListener("scroll", A, !0);
    }), (y, L) => e.anchor ? (w(), F(st, {
      key: 0,
      to: "body"
    }, [
      n.value ? (w(), $("div", {
        key: 0,
        ref_key: "anchoredRef",
        ref: p,
        class: "balloon-anchored",
        style: X({
          top: (g.value?.top ?? 0) + "px",
          left: (g.value?.left ?? 0) + "px"
        })
      }, [
        I("div", {
          class: "balloon-inner",
          style: X({ flexDirection: u.value })
        }, [
          I("div", {
            class: "balloon-box-wrapper",
            style: X(h.value)
          }, [
            Q(ie, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: V(() => [
                P(r).content ? J(y.$slots, "content", { key: 0 }) : (w(), $(G, { key: 1 }, [
                  $e(de(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          I("div", Io, [
            I("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: X({ transform: v.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : K("", !0)
    ])) : (w(), $("div", No, [
      J(y.$slots, "default"),
      n.value ? (w(), $("div", {
        key: 0,
        class: "balloon",
        style: X(d.value)
      }, [
        I("div", {
          class: "balloon-inner",
          style: X({ flexDirection: u.value })
        }, [
          I("div", {
            class: "balloon-box-wrapper",
            style: X(h.value)
          }, [
            Q(ie, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: V(() => [
                P(r).content ? J(y.$slots, "content", { key: 0 }) : (w(), $(G, { key: 1 }, [
                  $e(de(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          I("div", Ao, [
            I("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: X({ transform: v.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : K("", !0)
    ]));
  }
}), Xt = /* @__PURE__ */ Symbol("win55-dropdown"), jo = 200, Lo = /* @__PURE__ */ U({
  __name: "BaseDropdown",
  props: /* @__PURE__ */ rt({
    matchTriggerWidth: { type: Boolean, default: !1 }
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(e) {
    const n = e, t = be(e, "open"), o = j(null), l = En(Xt, null), r = l !== null, s = /* @__PURE__ */ new Set();
    let a = null;
    Cn(Xt, {
      registerChild: (b) => (s.add(b), () => s.delete(b)),
      claimActive: (b) => (a && a !== b && a(), a = b, () => {
        a === b && (a = null);
      })
    });
    const f = j(null), i = j(null), d = () => {
      const b = f.value, A = i.value;
      if (!b || !A) return;
      const y = b.getBoundingClientRect(), L = window.innerHeight, _ = A.offsetHeight;
      let m, T;
      if (r) {
        const C = A.offsetWidth;
        m = y.top + window.scrollY, T = y.right + window.scrollX, y.top + _ > L && (m = Math.max(0, L - _) + window.scrollY), y.right + C > window.innerWidth && (T = y.left + window.scrollX - C);
      } else
        m = y.bottom + window.scrollY, T = y.left + window.scrollX, y.bottom + _ > L && (m = y.top + window.scrollY - _);
      o.value = {
        top: m,
        left: T,
        width: n.matchTriggerWidth ? y.width : void 0
      };
    };
    let u = null;
    ae(t, async (b) => {
      b ? (u = l?.claimActive(() => {
        t.value = !1;
      }) ?? null, await kt(), d()) : (u?.(), u = null);
    });
    const v = (b) => !!f.value?.contains(b) || !!i.value?.contains(b) || [...s].some((A) => A.containsTarget(b)), h = l?.registerChild({ containsTarget: v });
    let p;
    const g = () => {
      !r || t.value || (p = setTimeout(() => {
        t.value = !0;
      }, jo));
    }, E = () => clearTimeout(p), N = () => {
      t.value && d();
    }, x = (b) => {
      t.value && (v(b.target) || (t.value = !1));
    };
    ce(() => {
      window.addEventListener("resize", N), window.addEventListener("scroll", N), document.addEventListener("click", x);
    }), fe(() => {
      window.removeEventListener("resize", N), window.removeEventListener("scroll", N), document.removeEventListener("click", x), clearTimeout(p), u?.(), h?.();
    });
    const R = () => {
      t.value = r ? !0 : !t.value;
    };
    return (b, A) => (w(), $(G, null, [
      I("div", {
        ref_key: "triggerRef",
        ref: f,
        style: X({ display: r ? "block" : "inline-block" }),
        onClick: _e(R, ["stop"]),
        onMouseenter: g,
        onMouseleave: E
      }, [
        J(b.$slots, "trigger")
      ], 36),
      (w(), F(st, { to: "body" }, [
        t.value ? (w(), $("div", {
          key: 0,
          ref_key: "dropdownRef",
          ref: i,
          style: X({
            position: "absolute",
            top: (o.value?.top ?? 0) + "px",
            left: (o.value?.left ?? 0) + "px",
            width: e.matchTriggerWidth ? (o.value?.width ?? "auto") + "px" : "auto"
          })
        }, [
          J(b.$slots, "items")
        ], 4)) : K("", !0)
      ]))
    ], 64));
  }
}), Tn = [
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
], zo = [8, 10, 12, 16, 18, 24], Rn = "Standard", Oo = {
  BoldItalic: ["BoldItalic", "Bold", "Italic", "Regular"],
  Bold: ["Bold", "Regular"],
  Italic: ["Italic", "Regular"],
  Regular: ["Regular"]
};
function Gt(e, n) {
  return Tn.filter((t) => t.fontName === e && t.style === n).map((t) => t.size);
}
function Po(e, n, t) {
  const o = Tn.some((r) => r.fontName === e) ? e : Rn, l = Oo[n] ?? ["Regular"];
  for (const r of l)
    if (Gt(o, r).includes(t))
      return { fontName: o, style: r, size: t };
  for (const r of l) {
    const s = Gt(o, r);
    if (s.length > 0)
      return { fontName: o, style: r, size: In(t, s) };
  }
  return { fontName: o, style: "Regular", size: t };
}
function Bn(e) {
  const { style: n, size: t } = e.shorthand ? _o(e.shorthand) : {
    style: Mo(e.isBold, e.isItalic),
    size: In(e.fontSize ?? 12, zo)
  }, { fontName: o, style: l, size: r } = Po(e.fontName ?? Rn, n, t), s = {
    fontFamily: `${o}-${l}-${r}, ${o}-${l}-${r}-TofuMaker`,
    fontSize: `${r * 2}px`,
    lineHeight: `${r * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (s.textShadow = `2px 2px 0 ${e.fontShadowColor}`), s;
}
function Mo(e, n) {
  return e && n ? "BoldItalic" : e ? "Bold" : n ? "Italic" : "Regular";
}
function _o(e) {
  const n = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!n)
    throw new Error(`Invalid shorthand format: ${e}`);
  const t = n[1], o = parseInt(n[2], 10);
  return { style: t, size: o };
}
function In(e, n) {
  if (n.length === 0)
    throw new Error("Array cannot be empty");
  return n.reduce((t, o) => {
    const l = Math.abs(o - e), r = Math.abs(t - e);
    return l < r ? o : t;
  });
}
function ue(e) {
  if (e instanceof Text)
    return e.nodeValue ?? "";
  if (!(e instanceof Element || e instanceof DocumentFragment))
    return Array.from(e.childNodes).map(ue).join("");
  if (e instanceof Element) {
    const n = e.getAttribute("data-win55-emoji");
    if (n)
      return n;
    if (e.tagName === "BR")
      return `
`;
  }
  return Array.from(e.childNodes).map(ue).join("");
}
function Ne(e) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !n.isCollapsed)
    return null;
  const t = n.getRangeAt(0);
  if (!e.contains(t.startContainer))
    return null;
  const o = document.createRange();
  return o.selectNodeContents(e), o.setEnd(t.startContainer, t.startOffset), ue(o.cloneContents()).length;
}
function Nn(e, n) {
  if (e instanceof Text) {
    const l = e.nodeValue?.length ?? 0;
    return n <= l ? { node: e, offset: n, remaining: 0 } : { node: e, offset: l, remaining: n - l };
  }
  if (e instanceof Element) {
    const l = e.getAttribute("data-win55-emoji");
    if (l)
      return n <= 0 ? { node: e.parentNode ?? e, offset: mt(e), remaining: 0 } : n <= l.length ? { node: e.parentNode ?? e, offset: mt(e) + 1, remaining: 0 } : {
        node: e.parentNode ?? e,
        offset: mt(e) + 1,
        remaining: n - l.length
      };
  }
  let t = n, o = {
    offset: e.childNodes.length,
    remaining: t
  };
  for (const l of Array.from(e.childNodes)) {
    const r = Nn(l, t);
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
function mt(e) {
  return e.parentNode ? Array.prototype.indexOf.call(e.parentNode.childNodes, e) : 0;
}
function Fe(e, n, t = !1) {
  if (n === null || !e.isConnected)
    return;
  const o = Nn(e, n);
  if (!o)
    return;
  const l = document.createRange(), r = window.getSelection();
  t && e.focus({ preventScroll: !0 }), l.setStart(o.node, o.offset), l.collapse(!0), r?.removeAllRanges(), r?.addRange(l);
}
const Kt = typeof Intl.Segmenter == "function" ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
function Rt(e) {
  return Kt ? Array.from(Kt.segment(e), (n) => n.segment) : Array.from(e);
}
function An(e) {
  return Rt(e).length;
}
function Fo(e, n) {
  return Rt(e).slice(0, n).join("");
}
function Do(e, n, t = null) {
  const o = Rt(e);
  let l = 0;
  return { value: o.filter((s, a) => {
    const f = n(s);
    return !f && t !== null && a < t && l++, f;
  }).join(""), caret: t === null ? null : t - l };
}
const qt = new RegExp("\\p{Extended_Pictographic}|\\p{Regional_Indicator}|‍|️|⃣", "u");
function Ho(e, n, t) {
  return !(n && (n.lastIndex = 0, !n.test(e)) || t && (t.lastIndex = 0, t.test(e)));
}
const Vo = { class: "baseinput-wrapper" }, Wo = ["contenteditable", "data-placeholder", "aria-multiline", "aria-disabled"], $n = /* @__PURE__ */ U({
  __name: "BaseInput",
  props: {
    modelValue: {},
    placeholder: { default: "" },
    disabled: { type: Boolean, default: !1 },
    maxLength: { default: void 0 },
    boxType: { default: "textarea" },
    extraStyles: { default: void 0 },
    editorExtraStyles: { default: void 0 },
    multiline: { type: Boolean, default: !1 },
    wrap: { type: Boolean, default: !0 },
    allow: { default: void 0 },
    deny: { default: void 0 }
  },
  emits: ["update:modelValue", "input", "keydown", "beforeinput", "paste", "focus", "blur"],
  setup(e, { expose: n, emit: t }) {
    const o = e, l = t, r = j(null), s = j(null);
    ce(() => {
      s.value && o.modelValue && (s.value.innerText = o.modelValue);
    }), ae(() => o.modelValue, (h) => {
      if (s.value && ue(s.value) !== h) {
        const p = document.activeElement === s.value, g = p ? Ne(s.value) : null;
        s.value.innerText = h ?? "", p && Fe(s.value, g);
      }
    });
    const a = () => {
      if (!s.value) return;
      let h = ue(s.value);
      if (o.multiline || (h = h.replace(/\n/g, "")), o.allow || o.deny) {
        const p = document.activeElement === s.value ? Ne(s.value) : null, g = Do(
          h,
          (E) => E === `
` || Ho(E, o.allow, o.deny),
          p
        );
        g.value !== h && (h = g.value, s.value.innerText = h, p !== null && Fe(s.value, g.caret));
      }
      if (o.maxLength && An(h) > o.maxLength) {
        h = Fo(h, o.maxLength), s.value.innerText = h;
        const p = document.createRange(), g = window.getSelection();
        p.selectNodeContents(s.value), p.collapse(!1), g?.removeAllRanges(), g?.addRange(p);
      }
      l("update:modelValue", h);
    }, f = () => {
      a(), l("input");
    }, i = (h) => {
      l("keydown", h), !o.multiline && h.key === "Enter" && h.preventDefault(), h.key === "Tab" && h.preventDefault();
    }, d = (h) => {
      if (l("paste", h), h.defaultPrevented) return;
      h.preventDefault();
      let p = h.clipboardData?.getData("text/plain") ?? "";
      o.multiline || (p = p.replace(/\n/g, " "));
      const g = window.getSelection(), E = g?.rangeCount ? g.getRangeAt(0) : null;
      if (E) {
        E.deleteContents();
        const N = document.createTextNode(p);
        E.insertNode(N), E.collapse(!1), g?.removeAllRanges(), g?.addRange(E);
      }
      f();
    }, u = () => {
      s.value && ue(s.value) === "" && (s.value.innerHTML = ""), l("blur");
    }, v = () => ({
      ...Bn({ fontColor: "black" }),
      minHeight: "100%",
      ...o.wrap ? {} : { whiteSpace: "nowrap", width: "max-content", minWidth: "100%" },
      ...o.editorExtraStyles
    });
    return n({ el: s, boxRef: r, syncValue: a }), (h, p) => (w(), $("div", Vo, [
      Q(ie, {
        ref_key: "boxRef",
        ref: r,
        type: e.boxType,
        overflow: "auto",
        "forgive-vertical-overflow": "",
        "extra-styles": e.extraStyles
      }, {
        default: V(() => [
          I("div", {
            ref_key: "el",
            ref: s,
            contenteditable: !e.disabled,
            style: X(v()),
            "data-placeholder": e.placeholder,
            role: "textbox",
            "aria-multiline": e.multiline,
            "aria-disabled": e.disabled,
            onInput: f,
            onKeydown: i,
            onBeforeinput: p[0] || (p[0] = (g) => l("beforeinput", g)),
            onPaste: d,
            onFocus: p[1] || (p[1] = (g) => l("focus")),
            onBlur: u
          }, null, 44, Wo)
        ]),
        _: 1
      }, 8, ["type", "extra-styles"]),
      J(h.$slots, "default")
    ]));
  }
}), jn = "/win-55-ui/emoji", ht = `${jn}/emoji-registry.csv`, De = [
  "[\\u{1F1E6}-\\u{1F1FF}]{2}",
  "[0-9#*]\\uFE0F?\\u20E3",
  "\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\uFE0E)?)*",
  "\\p{Emoji_Presentation}"
].join("|");
let Qe = null, Et = null, et = null;
function Uo(e) {
  return e.replace(/\/$/, "");
}
function Ln(e) {
  return e.trim().replace(/\.gif$/i, "");
}
function Yo(e) {
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
    const a = r.slice(0, s).trim(), f = Ln(r.slice(s + 1));
    a && f && (n[a] = f);
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
  }).then(Yo).then((t) => (n === ht && (et = t), t))), Qe);
}
function Kr() {
  Qe = null, Et = null, et = null;
}
async function Xo(e, n = {}) {
  const o = (await ke(n))[e];
  return o ? pe(o, n) : null;
}
function pe(e, n = {}) {
  return `${Uo(n.basePath ?? jn)}/${Ln(e)}.gif`;
}
async function qr(e = {}) {
  return ke(e);
}
async function Jr(e, n = {}) {
  const t = await ke(n);
  return e in t;
}
ke();
function Go(e) {
  return e.map((n) => {
    const t = parseInt(n.replace(/^#/, ""), 16);
    return [t >> 16 & 255, t >> 8 & 255, t & 255];
  });
}
function Ko(e, n, t, o) {
  let l = 1 / 0, r = [0, 0, 0];
  for (const s of o) {
    const a = e - s[0], f = n - s[1], i = t - s[2], d = a * a + f * f + i * i;
    d < l && (l = d, r = s);
  }
  return r;
}
function zn() {
  return typeof navigator < "u" && /firefox/i.test(navigator.userAgent);
}
const qo = "win55-emoji", Jo = "win55-emoji-image", se = 15, Ct = 2, Jt = zn(), Zo = [
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
], Qo = Go(Zo), Zt = De, el = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION"
]), Be = /* @__PURE__ */ new WeakMap(), Qt = /* @__PURE__ */ new WeakMap(), en = /* @__PURE__ */ new Map();
function tl(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function nl(e) {
  const n = Qt.get(e);
  if (n)
    return n;
  const t = Object.keys(e).sort((r, s) => s.length - r.length).map(tl), o = t.length > 0 ? `${t.join("|")}|${Zt}` : Zt, l = new RegExp(o, "gu");
  return Qt.set(e, l), l;
}
function On(e) {
  return e.value === !1 ? null : typeof e.value == "object" ? e.value : {};
}
const ol = "data-win55-richtext";
function ll(e) {
  return el.has(e.tagName) || e.hasAttribute("data-win55-emoji");
}
function Pn(e) {
  let n = e.parentElement;
  for (; n; ) {
    const t = Be.get(n);
    if (t && On(t.binding))
      return !0;
    n = n.parentElement;
  }
  return !1;
}
function rl(e, n) {
  const t = [], o = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, {
    acceptNode(l) {
      const r = l.parentElement;
      return !r || ll(r) || n && r.closest(`[${ol}]`) || !l.nodeValue?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  for (; o.nextNode(); )
    t.push(o.currentNode);
  return t;
}
function sl() {
  return `${se * Ct}px`;
}
function al(e, n, t, o, l) {
  const r = Math.min(1, Math.max(0, l)), s = e.getImageData(0, 0, n, t), a = s.data;
  for (let f = 0; f < a.length; f += 4) {
    const i = a[f], d = a[f + 1], u = a[f + 2];
    if (a[f + 3] < 80)
      a[f] = 0, a[f + 1] = 0, a[f + 2] = 0, a[f + 3] = 0;
    else {
      const [h, p, g] = Ko(
        i,
        d,
        u,
        o
      ), E = Math.round(i + (h - i) * r), N = Math.round(d + (p - d) * r), x = Math.round(u + (g - u) * r);
      a[f] = E, a[f + 1] = N, a[f + 2] = x, a[f + 3] = 255;
    }
  }
  e.putImageData(s, 0, 0);
}
function il(e, n, t) {
  const o = e.getImageData(0, 0, n, t), l = new Uint8ClampedArray(o.data), r = o.data, s = (a, f) => (f * n + a) * 4;
  for (let a = 0; a < t; a++)
    for (let f = 0; f < n; f++) {
      const i = s(f, a), u = [
        f > 0 ? s(f - 1, a) : -1,
        f < n - 1 ? s(f + 1, a) : -1,
        a > 0 ? s(f, a - 1) : -1,
        a < t - 1 ? s(f, a + 1) : -1
      ].filter((v) => v !== -1).filter((v) => l[v + 3] > 127);
      if (l[i + 3] > 127 && u.length <= 1)
        r[i] = r[i + 1] = r[i + 2] = r[i + 3] = 0;
      else if (l[i + 3] === 0 && u.length >= 3) {
        const v = u[0];
        r[i] = l[v], r[i + 1] = l[v + 1], r[i + 2] = l[v + 2], r[i + 3] = 255;
      }
    }
  e.putImageData(o, 0, 0);
}
function Bt(e) {
  const n = en.get(e);
  if (n)
    return n;
  const t = cl(e);
  return en.set(e, t), t;
}
function cl(e) {
  const n = document.createElement("canvas");
  n.width = se, n.height = se;
  const t = n.getContext("2d");
  if (!t)
    return "";
  const o = '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif', l = se * 4;
  t.textBaseline = "alphabetic", t.font = `${l}px ${o}`;
  const r = t.measureText(e), s = r.actualBoundingBoxLeft + r.actualBoundingBoxRight, a = r.actualBoundingBoxAscent + r.actualBoundingBoxDescent;
  if (s > 0 && a > 0) {
    const f = l * Math.min(se / s, se / a);
    t.font = `${f}px ${o}`;
    const i = t.measureText(e), d = i.actualBoundingBoxLeft + i.actualBoundingBoxRight, u = i.actualBoundingBoxAscent + i.actualBoundingBoxDescent, v = (se - d) / 2 + i.actualBoundingBoxLeft, h = (se - u) / 2 + i.actualBoundingBoxAscent;
    t.fillText(e, v, h - 0.5), al(t, se, se, Qo, 0.1), il(t, se, se), pl(n);
  }
  return n.toDataURL("image/png");
}
function ul(e, n, t) {
  const o = document.createElement("span"), l = document.createElement("img");
  return o.className = t.className ?? qo, o.contentEditable = "false", o.dataset.win55Emoji = e, o.role = "img", o.ariaLabel = e, o.style.setProperty("--win55-emoji-size", sl()), l.src = n, l.alt = e, l.className = Jo, l.draggable = !1, l.dataset.win55EmojiImg = "true", l.addEventListener("load", () => {
    const r = l.naturalWidth * Ct, s = l.naturalHeight * Ct;
    o.style.width = `${r}px`, o.style.height = `${s}px`, l.style.width = `${r}px`, l.style.height = `${s}px`;
  }, { once: !0 }), o.append(l), o;
}
function dl(e, n, t, o) {
  const l = e.parentElement;
  if (!l)
    return;
  const r = window.getSelection(), s = r && r.rangeCount > 0 && r.isCollapsed ? r.getRangeAt(0) : null, a = s?.startContainer === e, f = !!(s && s.startContainer === l && s.startOffset === Array.prototype.indexOf.call(l.childNodes, e) + 1), i = a || f, d = f ? e.nodeValue?.length ?? 0 : a ? s?.startOffset ?? null : null, u = e.nodeValue ?? "";
  let v = 0, h = !1;
  const p = document.createDocumentFragment();
  let g = null, E = 0;
  const N = (R, b) => {
    g || (g = R, E = b);
  };
  n.lastIndex = 0;
  for (const R of u.matchAll(n)) {
    const b = R[0], A = R.index, y = t[b];
    if (A === void 0)
      continue;
    const L = y ? pe(y, o) : Bt(b);
    if (!L)
      continue;
    h = !0;
    const _ = u.slice(v, A);
    if (Jt || _.length > 0) {
      const T = document.createTextNode(_);
      d !== null && d >= v && d <= A && N(T, d - v), p.append(T);
    } else d !== null && d >= v && d <= A && N(l, Array.prototype.indexOf.call(l.childNodes, e) + p.childNodes.length);
    const m = ul(b, L, o);
    p.append(m), d !== null && d > A && d <= A + b.length && N(l, Array.prototype.indexOf.call(l.childNodes, e) + p.childNodes.length), v = A + b.length;
  }
  if (!h)
    return;
  const x = u.slice(v);
  if (Jt || x.length > 0) {
    const R = document.createTextNode(x);
    d !== null && d >= v && N(R, d - v), p.append(R);
  } else d !== null && d >= v && N(l, Array.prototype.indexOf.call(l.childNodes, e) + p.childNodes.length);
  if (e.replaceWith(p), i && g) {
    const R = document.createRange();
    R.setStart(g, E), R.collapse(!0), r?.removeAllRanges(), r?.addRange(R);
  }
}
function Mn(e, n, t, o) {
  const l = nl(n);
  if (l)
    for (const r of rl(e, o))
      dl(r, l, n, t);
}
const pt = /* @__PURE__ */ new WeakMap();
async function gt(e, n = {}) {
  const t = (pt.get(e) ?? 0) + 1;
  pt.set(e, t);
  const o = await ke(n);
  pt.get(e) !== t || !e.isConnected || Mn(e, o, n, !1);
}
async function fl(e, n) {
  const t = On(n.binding);
  if (!t)
    return;
  n.version += 1;
  const o = n.version, l = await ke(t);
  Be.get(e)?.version !== o || !e.isConnected || Pn(e) || Mn(e, l, t, !0);
}
function St(e, n) {
  n.renderQueued || (n.renderQueued = !0, n.renderFrame = window.requestAnimationFrame(() => {
    n.renderQueued = !1, n.renderFrame = null, fl(e, n).catch((t) => {
      console.warn("[win-55-ui] Could not render custom emoji.", t);
    });
  }));
}
function vl(e, n) {
  const t = window.getSelection();
  if (!t || t.rangeCount === 0 || !n.clipboardData || Pn(e))
    return;
  const o = t.getRangeAt(0);
  if (!o.intersectsNode(e))
    return;
  const l = o.cloneContents(), r = ue(l);
  r && (n.clipboardData.setData("text/plain", r), n.preventDefault());
}
function ml(e, n) {
  const t = new MutationObserver(() => {
    St(e, n);
  });
  return t.observe(e, {
    characterData: !0,
    childList: !0,
    subtree: !0
  }), t;
}
const hl = {
  mounted(e, n) {
    const t = {
      binding: n,
      copyHandler: (o) => vl(e, o),
      observer: null,
      renderFrame: null,
      renderQueued: !1,
      version: 0
    };
    t.observer = ml(e, t), Be.set(e, t), e.addEventListener("copy", t.copyHandler), St(e, t);
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
function pl(e) {
  const n = e.getContext("2d");
  if (!n) {
    console.warn("Unable to get 2D context from canvas");
    return;
  }
  const t = e.width, o = e.height, l = n.getImageData(0, 0, t, o), r = l.data, s = (u, v) => u < 0 || v < 0 || u >= t || v >= o ? 0 : r[(v * t + u) * 4 + 3], a = Array.from({ length: o }, () => Array(t).fill(!1)), f = [];
  for (let u = 0; u < t; u++)
    s(u, 0) === 0 && !a[0][u] && (a[0][u] = !0, f.push({ x: u, y: 0 })), s(u, o - 1) === 0 && !a[o - 1][u] && (a[o - 1][u] = !0, f.push({ x: u, y: o - 1 }));
  for (let u = 0; u < o; u++)
    s(0, u) === 0 && !a[u][0] && (a[u][0] = !0, f.push({ x: 0, y: u })), s(t - 1, u) === 0 && !a[u][t - 1] && (a[u][t - 1] = !0, f.push({ x: t - 1, y: u }));
  const i = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];
  for (; f.length; ) {
    const { x: u, y: v } = f.shift();
    for (const [h, p] of i) {
      const g = u + h, E = v + p;
      g >= 0 && g < t && E >= 0 && E < o && !a[E][g] && s(g, E) === 0 && (a[E][g] = !0, f.push({ x: g, y: E }));
    }
  }
  const d = Array.from({ length: o }, () => Array(t).fill(!1));
  for (let u = 0; u < o; u++)
    for (let v = 0; v < t; v++) {
      if (s(v, u) === 0) continue;
      let h = !1;
      for (const [p, g] of i) {
        const E = v + p, N = u + g;
        if (E < 0 || N < 0 || E >= t || N >= o) {
          h = !0;
          break;
        }
        if (s(E, N) === 0 && a[N][E]) {
          h = !0;
          break;
        }
      }
      h && (d[u][v] = !0);
    }
  for (let u = 0; u < o; u++)
    for (let v = 0; v < t; v++)
      if (d[u][v]) {
        const h = (u * t + v) * 4;
        r[h] = 0, r[h + 1] = 0, r[h + 2] = 0;
      }
  n.putImageData(l, 0, 0);
}
const Zr = hl;
function gl(e) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !n.isCollapsed)
    return null;
  const t = n.getRangeAt(0);
  if (!e.contains(t.startContainer))
    return null;
  const o = Ne(e), l = t.cloneRange();
  l.collapse(!0);
  const r = document.createElement("span");
  r.textContent = "​", l.insertNode(r);
  const s = r.getBoundingClientRect(), a = r.parentNode;
  return r.remove(), a?.normalize(), Fe(e, o), s;
}
const tn = "/win-55-ui/emoji/emoji-categories.json";
let yt = null;
async function It() {
  return yt || (yt = fetch(tn).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${tn}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), yt;
}
async function yl(e) {
  const n = e.trim().toLowerCase();
  if (!n)
    return [];
  const t = await It(), o = [], l = /* @__PURE__ */ new Set();
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
async function _n(e) {
  const n = e.trim().toLowerCase();
  if (!n)
    return;
  const o = (await It()).find((l) => l.shortcodes.some((r) => r.toLowerCase() === n));
  return o ? { emoji: o.emoji, code: o.code } : void 0;
}
const Ae = j(!1), xe = j({ x: 160, y: 120, width: 360, height: 420 }), Nt = fo(null);
function nn(e) {
  Nt.value = e;
}
function wl() {
  Ae.value = !0;
}
function on() {
  Ae.value = !1;
}
function xl(e) {
  Nt.value?.insertEmoji(e);
}
let ln = 0;
function bl(e) {
  const n = e[ln % e.length];
  return ln += 1, n;
}
const El = ["src"], Cl = { class: "shortcode-suggestions" }, Sl = {
  key: 0,
  class: "shortcode-suggestion-ellipsis"
}, kl = ["src"], Tl = {
  key: 1,
  class: "shortcode-suggestion-ellipsis"
}, Rl = "546", qe = 5, Bl = 200, Qr = /* @__PURE__ */ U({
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
    ], l = e, r = t, s = j(null), a = B(() => s.value?.el ?? null), f = () => {
      Xn(), W();
    }, i = () => {
      s.value?.syncValue(), f();
    }, d = /:([A-Za-z0-9_+-]*)$/, u = /:([A-Za-z0-9_+-]{2,}):$/, v = j(!1), h = j(null), p = j([]), g = j(0), E = j(null);
    let N = 0;
    const x = j(0);
    function R(c) {
      c < x.value ? x.value = c : c > x.value + qe - 1 && (x.value = c - qe + 1);
    }
    const b = B(() => {
      const c = x.value;
      return p.value.slice(c, c + qe).map((k, S) => ({ match: k, index: c + S }));
    }), A = B(() => x.value > 0), y = B(() => x.value + qe < p.value.length), L = () => {
      v.value = !1, h.value = null, p.value = [], g.value = 0, x.value = 0;
    }, _ = (c, k) => {
      if (!a.value) return;
      const S = window.getSelection();
      if (!S || S.rangeCount === 0 || !S.isCollapsed) return;
      const z = S.getRangeAt(0), H = z.startContainer;
      if (!(H instanceof Text) || !a.value.contains(H)) return;
      const ne = z.startOffset, re = ne - c;
      if (re < 0) return;
      const me = H.nodeValue ?? "";
      Xe(), H.nodeValue = me.slice(0, re) + k + me.slice(ne), Ee(H, re + k.length), Te(), i(), gt(a.value);
    }, m = () => {
      const c = p.value[g.value];
      !c || h.value === null || (_(1 + h.value.length, c.emoji), L());
    }, T = j(null), M = { insertEmoji: (c) => {
      if (!a.value) return;
      const z = (document.activeElement === a.value ? Ne(a.value) : null) ?? T.value ?? An(ue(a.value));
      Fe(a.value, z, !0);
      const H = window.getSelection();
      if (!H || H.rangeCount === 0 || !H.isCollapsed) return;
      const ne = H.getRangeAt(0);
      Xe(), ne.deleteContents();
      const re = document.createTextNode(c);
      ne.insertNode(re), Ee(re, re.length), Te(), i(), gt(a.value);
    } }, D = j(!1), Y = B(() => Ae.value && Nt.value === M), Z = B(() => l.showEmojiButton && (D.value || Y.value)), q = j(o[0]), ee = B(() => Y.value ? Rl : q.value), ge = () => {
      q.value = bl(o);
    };
    ae(Z, (c) => {
      c && ge();
    });
    const le = () => {
      D.value = !0, nn(M);
    }, O = () => {
      nn(M), wl();
    }, W = async () => {
      if (!a.value) {
        L();
        return;
      }
      const c = window.getSelection();
      if (!c || c.rangeCount === 0 || !c.isCollapsed) {
        L();
        return;
      }
      const k = c.getRangeAt(0), S = k.startContainer;
      if (!(S instanceof Text) || !a.value.contains(S)) {
        L();
        return;
      }
      const z = (S.nodeValue ?? "").slice(0, k.startOffset), H = v.value ? h.value : null, ne = u.exec(z);
      if (ne) {
        if (H === ne[1]) {
          const Ut = await _n(ne[1]);
          Ut && _(ne[0].length, Ut.emoji);
        }
        L();
        return;
      }
      const me = d.exec(z)?.[1] ?? null;
      if (me === null || me.length < 2) {
        L();
        return;
      }
      const Pe = gl(a.value);
      if (!Pe) {
        L();
        return;
      }
      const Vt = ++N, Wt = await yl(me);
      if (Vt !== N || Wt.length === 0) {
        Vt === N && L();
        return;
      }
      h.value = me, p.value = Wt, g.value = 0, x.value = 0, E.value = { top: Pe.top, bottom: Pe.bottom, left: Pe.left, right: Pe.right }, v.value = !0;
    }, te = [], ze = [];
    let ye = null, ve = null;
    const Oe = () => a.value ? { html: a.value.innerHTML, caret: Ne(a.value) } : null, Mt = (c) => {
      a.value && (a.value.innerHTML = c.html, Fe(a.value, c.caret, !0), i());
    }, Xe = () => {
      ye || (ye = Oe()), ze.length = 0;
    }, Te = () => {
      ve !== null && (clearTimeout(ve), ve = null), ye && (te.push(ye), ye = null);
    }, Xn = () => {
      ve !== null && clearTimeout(ve), ve = setTimeout(Te, Bl);
    }, Gn = () => {
      Te();
      const c = te.pop();
      if (!c) return;
      const k = Oe();
      k && ze.push(k), Mt(c);
    }, Kn = () => {
      const c = ze.pop();
      if (!c) return;
      const k = Oe();
      k && te.push(k), Mt(c);
    }, Ee = (c, k) => {
      const S = document.createRange(), z = window.getSelection();
      a.value?.focus({ preventScroll: !0 }), S.setStart(c, k), S.collapse(!0), z?.removeAllRanges(), z?.addRange(S);
    }, qn = (c) => c instanceof Text ? c.nodeValue?.length ?? 0 : c.childNodes.length, Ce = (c) => c.parentNode ? Array.prototype.indexOf.call(c.parentNode.childNodes, c) : 0, ut = (c, k) => c instanceof Text ? k > 0 ? null : c.previousSibling ?? (c.parentNode && c.parentNode !== a.value ? ut(c.parentNode, Ce(c.parentNode)) : null) : c.childNodes[k - 1] ?? (c.parentNode && c !== a.value ? ut(c.parentNode, Ce(c)) : null), dt = (c, k) => c instanceof Text ? k < (c.nodeValue?.length ?? 0) ? null : c.nextSibling ?? (c.parentNode && c.parentNode !== a.value ? dt(c.parentNode, Ce(c.parentNode) + 1) : null) : c.childNodes[k] ?? (c.parentNode && c !== a.value ? dt(c.parentNode, Ce(c) + 1) : null), Jn = (c, k) => {
      let S = c;
      for (; S; ) {
        if (S instanceof HTMLElement && S.hasAttribute("data-win55-emoji"))
          return S;
        if (S instanceof Text) {
          if ((S.nodeValue ?? "").length > 0)
            return null;
          S = k === "backward" ? S.previousSibling : S.nextSibling;
          continue;
        }
        if (S.childNodes.length > 0) {
          S = k === "backward" ? S.childNodes[S.childNodes.length - 1] : S.childNodes[0];
          continue;
        }
        return null;
      }
      return null;
    }, _t = (c) => {
      if (c.cloneContents().querySelector?.("[data-win55-emoji]"))
        return !0;
      const S = c.startContainer instanceof Element ? c.startContainer : c.startContainer.parentElement, z = c.endContainer instanceof Element ? c.endContainer : c.endContainer.parentElement;
      return !!(S?.closest("[data-win55-emoji]") || z?.closest("[data-win55-emoji]"));
    }, Ft = (c) => {
      if (!a.value) return;
      const k = c.startContainer, S = c.startOffset;
      c.deleteContents(), k.isConnected && a.value.contains(k) ? Ee(k, Math.min(S, qn(k))) : Ee(a.value, a.value.childNodes.length), i();
    }, Zn = (c) => {
      const k = document.createRange();
      return k.setStart(c.startContainer, c.startOffset), k.setEnd(c.endContainer, c.endOffset), k;
    }, Qn = (c) => c instanceof HTMLElement && c.hasAttribute("data-win55-emoji"), eo = (c, k, S) => {
      if (!a.value || c.collapsed || c.startContainer !== c.endContainer || !(c.startContainer instanceof Text))
        return !1;
      const z = c.startContainer, H = z.nodeValue?.length ?? 0;
      if (c.startOffset !== 0 || c.endOffset !== H)
        return !1;
      const ne = k === "backward" ? z.previousSibling : z.nextSibling;
      if (!Qn(ne) || !z.parentNode)
        return !1;
      S();
      const re = z.parentNode, me = Ce(z);
      return z.remove(), Ee(re, me), i(), !0;
    }, Dt = (c, k, S) => {
      const z = S === "backward" ? ut(c, k) : dt(c, k);
      return Jn(z, S);
    }, Ht = (c, k, S, z) => {
      const H = Dt(c, k, S);
      if (!H || !H.parentNode)
        return !1;
      z();
      const ne = H.parentNode, re = Ce(H);
      return H.remove(), Ee(ne, re), i(), !0;
    }, to = (c, k, S) => {
      if (!a.value || !a.value.contains(c.startContainer))
        return "none";
      const z = Zn(c);
      return z.collapsed ? Ht(
        c.startContainer,
        c.startOffset,
        k,
        S
      ) ? "deleted" : "none" : _t(z) ? (S(), Ft(z), "deleted") : eo(z, k, S) ? "deleted" : ue(z.cloneContents()) ? "native" : "none";
    }, no = (c, k) => {
      if (!a.value) return !1;
      const S = window.getSelection();
      if (!S || S.rangeCount === 0)
        return !1;
      const z = S.getRangeAt(0);
      return a.value.contains(z.startContainer) ? S.isCollapsed ? Ht(
        z.startContainer,
        z.startOffset,
        c,
        k
      ) : _t(z) ? (k(), Ft(z), !0) : !1 : !1;
    }, oo = (c) => {
      if (!zn() || c.shiftKey || c.ctrlKey || c.metaKey || c.altKey || c.key !== "ArrowLeft" && c.key !== "ArrowRight" || !a.value) return !1;
      const k = window.getSelection();
      if (!k || k.rangeCount === 0 || !k.isCollapsed) return !1;
      const S = k.getRangeAt(0);
      if (!a.value.contains(S.startContainer)) return !1;
      const z = c.key === "ArrowLeft" ? "backward" : "forward", H = Dt(S.startContainer, S.startOffset, z);
      return !H || !H.parentNode ? !1 : (c.preventDefault(), Ee(H.parentNode, Ce(H) + (z === "forward" ? 1 : 0)), !0);
    }, lo = (c) => {
      if (v.value) {
        if (c.key === "ArrowDown") {
          c.preventDefault(), g.value = (g.value + 1) % p.value.length, R(g.value);
          return;
        }
        if (c.key === "ArrowUp") {
          c.preventDefault(), g.value = (g.value - 1 + p.value.length) % p.value.length, R(g.value);
          return;
        }
        if (c.key === "Tab" || c.key === " " || c.key === "Enter") {
          c.preventDefault(), m();
          return;
        }
        if (c.key === "Escape") {
          c.preventDefault(), L();
          return;
        }
      }
      oo(c);
    }, ro = (c) => {
      if (!a.value) return;
      if (c.inputType === "historyUndo" || c.inputType === "historyRedo") {
        c.preventDefault(), c.inputType === "historyUndo" ? Gn() : Kn();
        return;
      }
      if (Xe(), c.inputType !== "deleteContentBackward" && c.inputType !== "deleteContentForward")
        return;
      if (ue(a.value) === "") {
        c.preventDefault(), a.value.focus({ preventScroll: !0 });
        return;
      }
      const k = c.inputType === "deleteContentBackward" ? "backward" : "forward", S = c.getTargetRanges();
      for (const z of S) {
        const H = to(
          z,
          k,
          () => c.preventDefault()
        );
        if (H === "deleted") {
          a.value.focus({ preventScroll: !0 });
          return;
        }
        if (H === "native")
          return;
      }
      no(k, () => c.preventDefault()) && a.value.focus({ preventScroll: !0 });
    }, so = (c) => {
      c.preventDefault();
      let k = c.clipboardData?.getData("text/plain") ?? "";
      if (l.multiline || (k = k.replace(/\n/g, " ")), !a.value) return;
      Xe();
      const S = window.getSelection(), z = S?.getRangeAt(0);
      if (z) {
        z.deleteContents();
        const H = document.createTextNode(k);
        z.insertNode(H), z.collapse(!1), S?.removeAllRanges(), S?.addRange(z);
      }
      i(), Te(), gt(a.value);
    }, ao = () => {
      Te(), L(), D.value = !1, a.value && (T.value = Ne(a.value));
    }, io = B(() => l.showEmojiButton ? { paddingRight: "34px" } : void 0), co = B(() => s.value?.boxRef?.verticalBarVisible ? { right: "38px" } : void 0);
    return n({ el: a }), (c, k) => (w(), $(G, null, [
      Q($n, {
        ref_key: "baseRef",
        ref: s,
        "model-value": e.modelValue,
        placeholder: e.placeholder,
        disabled: e.disabled,
        "max-length": e.maxLength,
        "box-type": e.boxType,
        "extra-styles": e.extraStyles,
        "editor-extra-styles": io.value,
        multiline: e.multiline,
        wrap: e.wrap,
        "onUpdate:modelValue": k[1] || (k[1] = (S) => r("update:modelValue", S)),
        onInput: f,
        onKeydown: lo,
        onBeforeinput: ro,
        onPaste: so,
        onFocus: le,
        onBlur: ao
      }, {
        default: V(() => [
          Z.value ? (w(), $("img", {
            key: 0,
            src: P(pe)(ee.value),
            style: X(co.value),
            width: "30",
            height: "30",
            class: "baseinput-emoji-button",
            "data-emoji-picker-trigger": "",
            onMousedown: k[0] || (k[0] = _e(() => {
            }, ["prevent"])),
            onClick: _e(O, ["stop"])
          }, null, 44, El)) : K("", !0)
        ]),
        _: 1
      }, 8, ["model-value", "placeholder", "disabled", "max-length", "box-type", "extra-styles", "editor-extra-styles", "multiline", "wrap"]),
      v.value && E.value ? (w(), F($o, {
        key: 0,
        shown: !0,
        anchor: E.value,
        side: "top"
      }, {
        content: V(() => [
          I("div", Cl, [
            A.value ? (w(), $("div", Sl, "...")) : K("", !0),
            (w(!0), $(G, null, oe(b.value, ({ match: S, index: z }) => (w(), $("div", {
              key: S.shortcode,
              class: Le(["shortcode-suggestion", { "shortcode-suggestion--selected": z === g.value }])
            }, [
              I("img", {
                src: P(pe)(S.code),
                width: "30",
                height: "30",
                class: "shortcode-suggestion-image"
              }, null, 8, kl),
              I("span", null, ":" + de(S.shortcode) + ":", 1)
            ], 2))), 128)),
            y.value ? (w(), $("div", Tl, "...")) : K("", !0)
          ])
        ]),
        _: 1
      }, 8, ["anchor"])) : K("", !0)
    ], 64));
  }
}), Il = /* @__PURE__ */ U({
  __name: "SimpleStringInput",
  props: {
    modelValue: {},
    placeholder: {},
    disabled: { type: Boolean },
    maxLength: {},
    boxType: {},
    extraStyles: {},
    editorExtraStyles: {},
    multiline: { type: Boolean },
    wrap: { type: Boolean },
    allow: {},
    deny: {}
  },
  setup(e) {
    const n = e, t = B(() => n.deny ? new RegExp(`${qt.source}|${n.deny.source}`, "u") : qt);
    return (o, l) => (w(), F($n, Sn(n, { deny: t.value }), null, 16, ["deny"]));
  }
}), es = /* @__PURE__ */ U({
  __name: "NumberInput",
  props: {
    modelValue: {},
    placeholder: {},
    disabled: { type: Boolean },
    maxLength: {},
    boxType: {},
    extraStyles: {},
    editorExtraStyles: {},
    multiline: { type: Boolean },
    wrap: { type: Boolean },
    deny: {}
  },
  setup(e) {
    return (n, t) => (w(), F(Il, Sn(n.$props, { allow: /[0-9.-]/ }), null, 16));
  }
}), Nl = "/win-55-ui/cursors/manifest.json", Al = "/win-55-ui/cursors/scheme.json";
let at = {}, At = {};
const je = j(0);
let wt = null;
async function rn(e) {
  const n = await fetch(e);
  if (!n.ok) throw new Error(`Could not load ${e}: ${n.status} ${n.statusText}`);
  return n.json();
}
function it() {
  return wt || (wt = Promise.all([
    rn(Nl),
    rn(Al)
  ]).then(([e, n]) => {
    at = e, At = n, je.value++;
  })), wt;
}
async function ts() {
  return await it(), At;
}
const sn = 2, $l = "/win-55-ui/cursors", an = "windows-default", jl = {
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
function cn(e, n) {
  const t = At[e]?.roles[n];
  if (!t) return;
  const o = at[t];
  if (!(!o || o.hotspotX === null || o.hotspotY === null))
    return t;
}
function He(e, n) {
  return je.value, cn(e, n) ?? (e === an ? void 0 : cn(an, n));
}
function Fn(e) {
  return je.value, at[e];
}
function Ve(e, n) {
  const t = jl[n], o = He(e, n), l = o ? at[o] : void 0;
  return !o || !l ? t : `url("${$l}/${o}/native.gif") ${l.hotspotX ?? 0} ${l.hotspotY ?? 0}, ${t ?? "default"}`;
}
function Me(e, n) {
  const t = Ve(e, n);
  return t?.startsWith("url(") || n === "default" ? t : Ve(e, "default") ?? t;
}
function Re(e, n) {
  if (!e) return n;
  const t = e.lastIndexOf(",");
  return t === -1 ? e : `${e.slice(0, t)}, ${n}`;
}
const Dn = /* @__PURE__ */ Symbol("win55ui:cursor-context"), Ye = "--win55-cursor", $t = "--win55-scheme", jt = "--win55-cursor-native-link", Lt = "--win55-cursor-native-text", zt = "--win55-cursor-native-notallowed", Ll = "a[href], area[href]", Hn = 'textarea, [contenteditable]:not([contenteditable="false"]), input:not([type]), input[type="text" i], input[type="search" i], input[type="url" i], input[type="tel" i], input[type="email" i], input[type="password" i], input[type="number" i]', We = "--win55-cursor-native", Ue = [
  We,
  jt,
  Lt,
  zt
], un = ["cursor", $t, Ye, ...Ue], Vn = j(!1);
function dn(e) {
  Vn.value = e;
}
function zl() {
  return Vn.value;
}
function Ol(e) {
  Cn(Dn, e);
}
function Pl() {
  return En(Dn, void 0);
}
const Ot = "__win55CursorContext";
function Ml(e, n) {
  e[Ot] = n;
}
function _l(e) {
  delete e[Ot];
}
let lt;
function Fl(e) {
  lt = e;
}
function Dl(e) {
  lt === e && (lt = void 0);
}
function Hl(e) {
  let n = e;
  for (; n; ) {
    const t = n[Ot];
    if (t) return t;
    n = n.parentElement;
  }
  return lt;
}
function Pt(e) {
  e.style.removeProperty("cursor"), e.style.removeProperty(Ye);
  for (const n of Ue) e.style.removeProperty(n);
}
function Vl(e, n, t) {
  const o = (t?.mode.value ?? "native") === "native";
  if (Pt(e), !n) return;
  if (o) {
    const r = t ? t.resolveRoleCss(n) : Ve("windows-default", n);
    if (!r) return;
    const s = t ? t.nativeBaseCss.value : Me("windows-default", "default"), a = Re(r, s ?? "default");
    e.style.setProperty("cursor", a, "important");
    for (const f of Ue) e.style.setProperty(f, a);
    return;
  }
  const l = t ? t.resolveRole(n) : He("windows-default", n);
  l && (e.style.cursor = "none", e.style.setProperty(Ye, l));
}
const Se = /* @__PURE__ */ new WeakMap();
function Wn(e) {
  return e.strong ?? e.weak;
}
function Wl(e) {
  const n = Se.get(e);
  if (!n) return;
  n.rev.value;
  const t = Wn(n);
  if (!t) {
    Pt(e);
    return;
  }
  Vl(e, t.role.value, t.context);
}
function Ul(e, n, t) {
  it();
  let o = Se.get(e);
  if (o || (o = { rev: j(0) }, Se.set(e, o)), o[n]) {
    const r = n === "strong" ? "v-cursor" : "v-cursor-weak";
    throw new Error(
      `[win-55-ui] two ${r} directives on one element. A reusable component must set its own cursor with v-cursor-weak so a consumer's v-cursor overrides it; two of the same strength on one element is unsupported. Element: ${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""}`
    );
  }
  const l = { role: j(t), context: void 0 };
  o[n] = l, o.rev.value++, kt(() => {
    const r = Se.get(e);
    !r || r[n] !== l || (l.context = Hl(e), r.stop ? l === Wn(r) && r.rev.value++ : r.stop = bt(() => Wl(e)));
  });
}
function Yl(e, n) {
  const t = Se.get(e);
  if (t) {
    if (t[n] = void 0, !t.strong && !t.weak) {
      t.stop?.(), Se.delete(e), Pt(e);
      return;
    }
    t.rev.value++;
  }
}
function Un(e) {
  return {
    mounted(n, t) {
      Ul(n, e, t.value);
    },
    updated(n, t) {
      if (t.value === t.oldValue) return;
      const o = Se.get(n)?.[e];
      o && (o.role.value = t.value);
    },
    unmounted(n) {
      Yl(n, e);
    }
  };
}
const Xl = Un("strong"), ct = Un("weak"), tt = /* @__PURE__ */ U({
  __name: "Button",
  props: {
    baseType: { default: "panel-d-1" },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: n }) {
    const t = ct, o = e, l = n, r = j(!1), s = j(!1), a = B(() => !o.disabled && r.value && s.value), f = B(() => o.disabled), i = (E) => {
      o.disabled || E.button !== 0 || (r.value = !0, s.value = !0);
    }, d = () => {
      o.disabled || (s.value = !0);
    }, u = () => {
      s.value = !1;
    }, v = (E) => {
      o.disabled || E.button !== 0 || (r.value && s.value && l("click"), r.value = !1);
    };
    ce(() => {
      window.addEventListener("mouseup", v);
    }), fe(() => {
      window.removeEventListener("mouseup", v);
    });
    const h = B(() => ({
      userSelect: "none",
      width: "fit-content",
      paddingBottom: "4px",
      paddingRight: "4px",
      ...o.extraStyles
    })), p = B(() => ({
      transform: a.value ? "translate(2px, 2px)" : "translate(0, 0)",
      opacity: f.value ? 0.5 : 1
    })), g = B(() => a.value ? "indent" : o.baseType);
    return (E, N) => he((w(), F(ie, {
      type: g.value,
      "extra-styles": h.value,
      "extra-class": e.extraClass,
      onMousedown: i,
      onMouseenter: d,
      onMouseleave: u
    }, {
      default: V(() => [
        I("div", {
          style: X(p.value)
        }, [
          J(E.$slots, "default")
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"])), [
      [P(t), f.value ? "not-allowed" : "default"]
    ]);
  }
}), Gl = { style: { display: "flex", "align-items": "center" } }, Kl = ["src", "alt"], ql = ["checked", "disabled", "value"], Jl = { key: 0 }, ns = /* @__PURE__ */ U({
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
    const t = ct, o = e, l = n, r = () => {
      o.disabled || l("update:modelValue", !o.modelValue);
    };
    return (s, a) => he((w(), $("div", {
      class: Le(["checkbox-container", { disabled: e.disabled }]),
      style: X({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: e.disabled ? 0.5 : 1,
        userSelect: "none",
        marginBottom: "2px"
      }),
      onClick: r
    }, [
      I("div", Gl, [
        I("img", {
          draggable: "false",
          src: e.modelValue ? e.checkedIcon : e.uncheckedIcon,
          alt: e.modelValue ? "checked" : "unchecked"
        }, null, 8, Kl)
      ]),
      I("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, ql),
      e.label ? (w(), $("span", Jl, de(e.label), 1)) : K("", !0)
    ], 6)), [
      [P(t), e.disabled ? "not-allowed" : "link"]
    ]);
  }
}), fn = 120;
function Zl({ onMove: e, onIdentity: n, onLeave: t }) {
  let o = 0, l = 0, r;
  function s(v) {
    o = v.clientX, l = v.clientY, e(o, l);
  }
  function a(v) {
    s(v);
  }
  function f(v) {
    v.target instanceof Element && (o = v.clientX, l = v.clientY, n(v.target));
  }
  function i(v) {
    v.relatedTarget === null && t();
  }
  function d() {
    n(document.elementFromPoint(o, l));
  }
  function u() {
    document.hidden ? (r !== void 0 && (clearInterval(r), r = void 0), t()) : (r === void 0 && (r = window.setInterval(d, fn)), d());
  }
  ce(() => {
    window.addEventListener("pointermove", s, { passive: !0 }), "onpointerrawupdate" in window && window.addEventListener("pointerrawupdate", a, { passive: !0 }), document.addEventListener("pointerover", f, { passive: !0 }), document.addEventListener("pointerout", i, { passive: !0 }), document.addEventListener("visibilitychange", u), r = window.setInterval(d, fn);
  }), fe(() => {
    window.removeEventListener("pointermove", s), window.removeEventListener("pointerrawupdate", a), document.removeEventListener("pointerover", f), document.removeEventListener("pointerout", i), document.removeEventListener("visibilitychange", u), r !== void 0 && clearInterval(r);
  });
}
const Ql = /\/win-55-ui\/cursors\/([^/"')]+)\/native\.gif/;
function er(e) {
  const n = getComputedStyle(e);
  let t = "";
  return e.closest(":disabled") ? t = n.getPropertyValue(zt) : e.matches(Ll) ? t = n.getPropertyValue(jt) : e.matches(Hn) && (t = n.getPropertyValue(Lt)), t = t.trim(), t && t !== "none" ? t : n.getPropertyValue(We).trim();
}
function tr() {
  let e = null, n = "", t = "", o = "default", l = [], r = 0, s, a = [];
  function f() {
    s !== void 0 && (clearTimeout(s), s = void 0), a = [], e && (e.style.removeProperty("cursor"), e = null);
  }
  function i(v) {
    return t.replace("native.gif", `native-${v}.gif`);
  }
  function d() {
    const v = e;
    if (!v || !v.isConnected) {
      f();
      return;
    }
    const h = (r + l.length - 1) % l.length;
    v.style.setProperty("cursor", `${i(r)}, ${i(h)}, ${o}`, "important");
    const p = l[r] || 60;
    r = (r + 1) % l.length, s = window.setTimeout(d, p);
  }
  function u(v) {
    if (!(v instanceof HTMLElement) || !v.isConnected) return;
    const h = er(v), p = Ql.exec(h)?.[1], g = p ? Fn(p)?.nativeFrameDelays : void 0;
    if (!p || !g || g.length < 2) {
      f();
      return;
    }
    if (v === e && p === n) return;
    f();
    const E = h.indexOf(",", h.indexOf(")") + 1);
    t = (E === -1 ? h : h.slice(0, E)).trim(), o = E === -1 ? "default" : h.slice(E + 1).trim(), a = [];
    for (let N = 0; N < g.length; N++) {
      const x = new Image();
      x.src = `/win-55-ui/cursors/${p}/native-${N}.gif`, x.decode().catch(() => {
      }), a.push(x);
    }
    e = v, n = p, l = g, r = 0, d();
  }
  return fe(f), { evaluate: u, stop: f };
}
const vn = 2, nr = /* @__PURE__ */ U({
  __name: "CursorOverlay",
  setup(e) {
    const n = tr(), t = j(), o = j();
    let l = "", r = 0, s = 0, a = !1, f = 0, i = 0;
    function d(x) {
      return Math.round(x / vn) * vn;
    }
    function u() {
      const x = `translate(${d(f - r)}px, ${d(i - s)}px)`;
      t.value && (t.value.style.transform = x), o.value && (o.value.style.transform = x);
    }
    function v(x) {
      const R = t.value, b = o.value;
      if (!R && !b || x === a) return;
      a = x;
      const A = x ? "visible" : "hidden";
      R && (R.style.visibility = A), b && (b.style.visibility = A);
    }
    function h(x, R) {
      x && (R ? (x.src = R, x.style.display = "") : (x.style.display = "none", x.removeAttribute("src")));
    }
    function p(x) {
      if (x === l) {
        v(x !== "");
        return;
      }
      if (l = x, !x) {
        v(!1);
        return;
      }
      const R = Fn(x);
      h(t.value, R?.hasNormal ? `/win-55-ui/cursors/${x}/normal.gif` : void 0), h(o.value, R?.hasInvert ? `/win-55-ui/cursors/${x}/invert.gif` : void 0), r = (R?.hotspotX ?? 0) * sn, s = (R?.hotspotY ?? 0) * sn, v(!0), u();
    }
    function g(x) {
      return x.closest("a[href], area[href]") ? "link" : x.closest(Hn) ? "text" : x.closest(":disabled") ? "not-allowed" : "default";
    }
    function E(x) {
      if (!x) return;
      if (x.closest('[data-win55-cursor="off"]')) {
        p(""), n.stop();
        return;
      }
      const R = getComputedStyle(x);
      if (R.getPropertyValue(We).trim() !== "none") {
        p(""), n.evaluate(x);
        return;
      }
      n.stop();
      const b = R.getPropertyValue(Ye).trim();
      if (b) {
        p(b);
        return;
      }
      const A = R.getPropertyValue($t).trim() || "windows-default";
      p(He(A, g(x)) ?? "");
    }
    function N() {
      p(""), n.stop();
    }
    return Zl({
      onMove: (x, R) => {
        f = x, i = R, l && u();
      },
      onIdentity: E,
      onLeave: N
    }), ae(je, () => E(document.elementFromPoint(f, i))), ce(() => {
      it();
    }), (x, R) => (w(), F(st, { to: "body" }, [
      I("img", {
        ref_key: "invertImg",
        ref: o,
        alt: "",
        style: { position: "fixed", top: "0", left: "0", visibility: "hidden", "pointer-events": "none", "z-index": "2147483647", "image-rendering": "pixelated", "mix-blend-mode": "difference" }
      }, null, 512),
      I("img", {
        ref_key: "normalImg",
        ref: t,
        alt: "",
        style: { position: "fixed", top: "0", left: "0", visibility: "hidden", "pointer-events": "none", "z-index": "2147483647", "image-rendering": "pixelated" }
      }, null, 512)
    ]));
  }
}), os = /* @__PURE__ */ U({
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
    const t = e, o = B(() => t.element ?? "span"), l = Pl(), r = B(() => t.scheme ?? l?.scheme.value ?? "windows-default"), s = B(() => t.role ?? l?.role.value), a = B(() => zl() || (t.disabled ?? l?.disabled.value ?? !1)), f = B(() => t.mode ?? l?.mode.value ?? "native"), i = nt(/* @__PURE__ */ new Set()), d = nt(/* @__PURE__ */ new Set());
    function u(m) {
      i.add(m), m.finally(() => i.delete(m));
    }
    function v(m) {
      d.add(m), m.finally(() => d.delete(m));
    }
    const h = B(() => i.size > 0 || l?.hasBusy.value === !0), p = B(() => d.size > 0 || l?.hasProgress.value === !0);
    function g(m) {
      return m !== void 0 && m !== "default" ? m : h.value ? "wait" : p.value ? "progress" : m;
    }
    function E(m) {
      return He(r.value, g(m) ?? "default");
    }
    function N(m) {
      return Ve(r.value, g(m) ?? "default");
    }
    const x = B(() => {
      if (a.value) return "auto";
      je.value;
      const m = Me(r.value, "default") ?? "default", T = l?.nativeBaseCss.value;
      return !T || T === "auto" ? m : t.root || t.scheme !== void 0 ? Re(m, T) : T;
    }), R = {
      scheme: r,
      mode: f,
      role: s,
      disabled: a,
      hasBusy: h,
      hasProgress: p,
      resolveRole: E,
      resolveRoleCss: N,
      nativeBaseCss: x,
      addBusy: u,
      addProgress: v
    };
    Ol(R), n({ addBusy: u, addProgress: v, resolveRole: E, resolveRoleCss: N }), it();
    const b = j();
    ce(() => {
      b.value && Ml(b.value, R), t.root && Fl(R);
    }), fe(() => {
      if (b.value && _l(b.value), !!t.root) {
        Dl(R), dn(!1);
        for (const m of un) document.documentElement.style.removeProperty(m);
      }
    });
    const A = B(() => g(s.value)), y = B(
      () => t.root || t.scheme !== void 0 || t.disabled === !1 || a.value || A.value !== void 0
    ), L = B(() => {
      je.value;
      const m = r.value, T = A.value, C = {};
      if ((t.root || t.scheme) && (C[$t] = m), f.value === "immersive") {
        C.cursor = "none", C[We] = a.value ? "auto" : "none";
        const D = T ? He(m, T) : void 0;
        return D && (C[Ye] = D), C;
      }
      if (!y.value) return C;
      if (a.value) {
        for (const D of Ue) C[D] = "auto";
        return C;
      }
      const M = x.value;
      if (T) {
        const D = Re(Ve(m, T), M);
        for (const Y of Ue) C[Y] = D;
        return C;
      }
      return C[We] = M, C[jt] = Re(Me(m, "link"), M), C[Lt] = Re(Me(m, "text"), M), C[zt] = Re(Me(m, "not-allowed"), M), C;
    }), _ = B(() => {
      const m = {};
      return t.element || (m.display = "contents"), t.root || Object.assign(m, L.value), m;
    });
    return t.root && (bt(() => dn(t.disableAll === !0)), bt(() => {
      const m = L.value, T = document.documentElement.style;
      for (const C of un)
        m[C] !== void 0 ? T.setProperty(C, m[C]) : T.removeProperty(C);
    })), (m, T) => (w(), $(G, null, [
      (w(), F(kn(o.value), {
        style: X(_.value),
        ref_key: "rootEl",
        ref: b
      }, {
        default: V(() => [
          J(m.$slots, "default")
        ]),
        _: 3
      }, 8, ["style"])),
      e.root ? (w(), F(nr, { key: 0 })) : K("", !0)
    ], 64));
  }
}), or = /* @__PURE__ */ U({
  __name: "HDivider",
  setup(e) {
    return (n, t) => (w(), F(ie, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), lr = { class: "menu-dropdown-items" }, ls = /* @__PURE__ */ U({
  __name: "MenuDropdown",
  setup(e) {
    return (n, t) => (w(), F(Lo, null, {
      trigger: V(() => [
        I("span", null, [
          J(n.$slots, "trigger")
        ])
      ]),
      items: V(() => [
        Q(ie, { type: "panel-d-1" }, {
          default: V(() => [
            I("div", lr, [
              J(n.$slots, "items")
            ])
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), rr = { style: { display: "flex", "align-items": "center" } }, sr = ["src"], ar = ["src"], ir = ["checked", "disabled", "value", "name"], cr = { key: 0 }, rs = /* @__PURE__ */ U({
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
    const t = ct, o = e, l = n, r = B(() => o.modelValue === o.value), s = (a) => {
      a.preventDefault(), !o.disabled && (r.value || l("update:modelValue", o.value));
    };
    return (a, f) => he((w(), $("div", {
      class: Le(["radio-container", { disabled: e.disabled }]),
      style: X({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: e.disabled ? 0.5 : 1,
        userSelect: "none",
        marginBottom: "2px"
      }),
      onClick: s
    }, [
      I("div", rr, [
        r.value ? (w(), $("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, sr)) : (w(), $("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, ar))
      ]),
      I("input", {
        type: "radio",
        checked: r.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, ir),
      e.label ? (w(), $("span", cr, de(e.label), 1)) : K("", !0)
    ], 6)), [
      [P(t), e.disabled ? "not-allowed" : "link"]
    ]);
  }
}), Ie = /* @__PURE__ */ U({
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
    const n = e, t = B(() => n.element ?? "span"), o = B(() => {
      const l = Bn(n);
      return n.element || (l.display = n.display), l;
    });
    return (l, r) => (w(), F(kn(t.value), {
      style: X(o.value)
    }, {
      default: V(() => [
        J(l.$slots, "default")
      ]),
      _: 3
    }, 8, ["style"]));
  }
}), ur = { key: 1 }, dr = {
  key: 4,
  style: { "text-decoration": "underline" }
}, fr = {
  key: 5,
  style: { "text-decoration": "line-through" }
}, vr = ["href"], mr = ["aria-label", "data-win55-emoji"], hr = ["src", "alt"], pr = /* @__PURE__ */ U({
  __name: "RichTextNode",
  props: {
    node: {},
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    function n(t, o) {
      return t ? pe(t) : Bt(o);
    }
    return (t, o) => {
      const l = vo("RichTextNode", !0);
      return e.node.type === "text" ? (w(), $(G, { key: 0 }, [
        $e(de(e.node.value), 1)
      ], 64)) : e.node.type === "break" ? (w(), $("br", ur)) : e.node.type === "bold" ? (w(), F(Ie, {
        key: 2,
        "is-bold": ""
      }, {
        default: V(() => [
          (w(!0), $(G, null, oe(e.node.children, (r, s) => (w(), F(l, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "italic" ? (w(), F(Ie, {
        key: 3,
        "is-italic": ""
      }, {
        default: V(() => [
          (w(!0), $(G, null, oe(e.node.children, (r, s) => (w(), F(l, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      })) : e.node.type === "underline" ? (w(), $("span", dr, [
        (w(!0), $(G, null, oe(e.node.children, (r, s) => (w(), F(l, {
          key: s,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "strike" ? (w(), $("span", fr, [
        (w(!0), $(G, null, oe(e.node.children, (r, s) => (w(), F(l, {
          key: s,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ])) : e.node.type === "color" ? (w(), F(Ie, {
        key: 6,
        "font-color": e.node.value
      }, {
        default: V(() => [
          (w(!0), $(G, null, oe(e.node.children, (r, s) => (w(), F(l, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-color"])) : e.node.type === "size" && e.allowSizes ? (w(), F(Ie, {
        key: 7,
        "font-size": e.node.value
      }, {
        default: V(() => [
          (w(!0), $(G, null, oe(e.node.children, (r, s) => (w(), F(l, {
            key: s,
            node: r,
            "allow-links": e.allowLinks,
            "allow-sizes": e.allowSizes
          }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
        ]),
        _: 1
      }, 8, ["font-size"])) : e.node.type === "size" ? (w(!0), $(G, { key: 8 }, oe(e.node.children, (r, s) => (w(), F(l, {
        key: s,
        node: r,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "url" && e.allowLinks ? (w(), $("a", {
        key: 9,
        href: e.node.href,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "richtext-link"
      }, [
        (w(!0), $(G, null, oe(e.node.children, (r, s) => (w(), F(l, {
          key: s,
          node: r,
          "allow-links": e.allowLinks,
          "allow-sizes": e.allowSizes
        }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
      ], 8, vr)) : e.node.type === "url" ? (w(!0), $(G, { key: 10 }, oe(e.node.children, (r, s) => (w(), F(l, {
        key: s,
        node: r,
        "allow-links": e.allowLinks,
        "allow-sizes": e.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128)) : e.node.type === "emoji" ? (w(), $("span", {
        key: 11,
        class: "win55-emoji",
        role: "img",
        "aria-label": e.node.emoji,
        "data-win55-emoji": e.node.emoji,
        style: { "--win55-emoji-size": "30px" }
      }, [
        I("img", {
          class: "win55-emoji-image",
          src: n(e.node.code, e.node.emoji),
          alt: e.node.emoji,
          draggable: "false"
        }, null, 8, hr)
      ], 8, mr)) : K("", !0);
    };
  }
}), gr = {
  b: "bold",
  i: "italic",
  u: "underline",
  s: "strike",
  strike: "strike",
  color: "color",
  size: "size",
  url: "url"
}, yr = /* @__PURE__ */ new Set(["br"]), mn = {
  normal: 12,
  big: 24
};
function Yn(e) {
  return e.map((n) => n.type === "text" ? n.value : n.type === "emoji" ? n.emoji : n.type === "break" ? `
` : Yn(n.children)).join("");
}
function hn(e) {
  switch (e.tagType) {
    case "color":
      return { type: "color", value: e.value ?? "inherit", children: e.children };
    case "size": {
      const n = (e.value ?? "").trim().toLowerCase(), t = mn[n], o = Number.parseInt(e.value ?? "", 10);
      return { type: "size", value: t ?? (Number.isFinite(o) ? o : mn.normal), children: e.children };
    }
    case "url":
      return {
        type: "url",
        href: e.value ?? Yn(e.children).trim(),
        children: e.children
      };
    default:
      return { type: e.tagType, children: e.children };
  }
}
function wr(e, n) {
  for (let t = e.length - 1; t >= 0; t--)
    if (e[t].tagType === n) return t;
  return -1;
}
function xr(e, n) {
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
function br(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
const pn = /* @__PURE__ */ new WeakMap(), Er = new RegExp(De, "gu");
function Cr(e) {
  if (!e) return Er;
  const n = pn.get(e);
  if (n) return n;
  const t = Object.keys(e).sort((r, s) => s.length - r.length).map(br), o = t.length > 0 ? `${t.join("|")}|${De}` : De, l = new RegExp(o, "gu");
  return pn.set(e, l), l;
}
function Sr(e, n) {
  const t = Cr(n), o = [];
  let l = 0, r;
  for (t.lastIndex = 0; r = t.exec(e); ) {
    const s = r[0], a = n?.[s];
    r.index > l && o.push({ type: "text", value: e.slice(l, r.index) }), o.push({ type: "emoji", emoji: s, code: a }), l = r.index + s.length;
  }
  return l < e.length && o.push({ type: "text", value: e.slice(l) }), o.length > 0 ? o : [{ type: "text", value: e }];
}
function kr(e, n, t) {
  const o = [];
  for (const l of xr(e, n))
    l.type === "text" ? o.push(...Sr(l.value, t)) : o.push(l);
  return o;
}
function Tr(e, n, t = null) {
  const o = [], l = [], r = /\[(\/?)(\w+)(?:=([^\]]*))?\]/g;
  let s = 0, a;
  const f = () => l.length ? l[l.length - 1].children : o, i = (d) => f().push(...kr(d, n, t));
  for (; a = r.exec(e); ) {
    const [d, u, v, h] = a, p = v.toLowerCase();
    if (yr.has(p)) {
      i(e.slice(s, a.index)), s = a.index + d.length, f().push({ type: "break" });
      continue;
    }
    const g = gr[p];
    if (!g) continue;
    if (i(e.slice(s, a.index)), s = a.index + d.length, !u) {
      l.push({ tagType: g, value: h, children: [] });
      continue;
    }
    const E = wr(l, g);
    if (E === -1) {
      i(d);
      continue;
    }
    for (; l.length > E + 1; ) {
      const x = l.pop();
      l[l.length - 1].children.push(hn(x));
    }
    const N = l.pop();
    f().push(hn(N));
  }
  for (i(e.slice(s)); l.length; ) {
    const d = l.pop();
    (l.length ? l[l.length - 1].children : o).push(...d.children);
  }
  return o;
}
const Rr = {
  "data-win55-richtext": "",
  style: { display: "contents" }
}, ss = /* @__PURE__ */ U({
  __name: "RichText",
  props: {
    allowLinks: { type: Boolean, default: !1 },
    allowSizes: { type: Boolean, default: !1 }
  },
  setup(e) {
    const n = ct, t = e, o = bn(), l = j(null), r = j(null);
    It().then((i) => {
      const d = /* @__PURE__ */ new Map();
      for (const u of i)
        for (const v of u.shortcodes)
          d.set(v.toLowerCase(), { emoji: u.emoji, code: u.code });
      l.value = d;
    }), ke().then((i) => {
      r.value = i;
    });
    const s = B(() => {
      const i = l.value;
      return i ? { get: (d) => i.get(d) } : null;
    });
    function a(i) {
      return i.map((d) => typeof d.children == "string" ? d.children : Array.isArray(d.children) ? a(d.children) : "").join("");
    }
    const f = B(() => Tr(a(o.default?.() ?? []), s.value, r.value));
    return (i, d) => he((w(), $("span", Rr, [
      (w(!0), $(G, null, oe(f.value, (u, v) => (w(), F(pr, {
        key: v,
        node: u,
        "allow-links": t.allowLinks,
        "allow-sizes": t.allowSizes
      }, null, 8, ["node", "allow-links", "allow-sizes"]))), 128))
    ])), [
      [P(n), "text"]
    ]);
  }
});
function Br(e, n, t, o, l) {
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
  ], f = gn(o), i = gn(l), d = Math.floor(n / s), u = Math.floor(t / s);
  e.width = Math.floor(n * 2) / 2, e.height = Math.floor(t * 2) / 2;
  for (let v = 0; v < u; v++)
    for (let h = 0; h < d; h++) {
      const p = h * s, g = v * s, E = (h + v) / (d + u - 6), N = (a[v % 8][h % 8] + 0.5) / 64, x = E > N ? 1 : 0, R = Math.round(f.r * (1 - x) + i.r * x), b = Math.round(f.g * (1 - x) + i.g * x), A = Math.round(f.b * (1 - x) + i.b * x);
      r.fillStyle = `rgb(${R}, ${b}, ${A})`, r.fillRect(p, g, s, s);
    }
}
function gn(e) {
  const n = e.replace("#", ""), t = parseInt(n, 16);
  return {
    r: t >> 16 & 255,
    g: t >> 8 & 255,
    b: t & 255
  };
}
const Ir = { style: { height: "0", overflow: "visible" } }, Nr = { class: "titlebar-content" }, Ar = { class: "titlebar-image" }, $r = ["src"], jr = { class: "titlebar-text" }, Lr = { class: "titlebar-buttons" }, zr = /* @__PURE__ */ U({
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
    const n = e, t = j(null);
    let o = null;
    function l(s, a) {
      const f = n.gradientColorA || "5555ff", i = n.gradientColorB || "0000aa";
      Br(s, s.width, s.height, f, i), a.fillStyle = "#555555", a.fillRect(0, s.height - 2, Math.floor(s.width / 2) * 2, 4);
    }
    function r() {
      const s = t.value;
      if (!s) return;
      const a = s.getContext("2d");
      if (!a) return;
      const f = s.getBoundingClientRect(), i = Math.floor(f.width * 2) / 2, d = Math.floor(f.height * 2) / 2;
      (s.width !== i || s.height !== d) && (s.width = i, s.height = d), l(s, a);
    }
    return ae(() => [n.gradientColorA, n.gradientColorB], () => {
      if (t.value) {
        const s = t.value.getContext("2d");
        s && l(t.value, s);
      }
    }), ce(() => {
      r(), t.value && (o = new ResizeObserver(() => {
        r();
      }), o.observe(t.value));
    }), fe(() => {
      o?.disconnect();
    }), (s, a) => (w(), $("div", null, [
      I("div", Ir, [
        I("canvas", {
          ref_key: "canvasRef",
          ref: t,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      I("div", Nr, [
        I("div", Ar, [
          I("img", {
            src: e.icon ?? "/win-55-ui/icons/program.png"
          }, null, 8, $r)
        ]),
        I("div", jr, [
          Q(Ie, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: V(() => [
              $e(de(e.title), 1)
            ]),
            _: 1
          })
        ]),
        I("div", Lr, [
          J(s.$slots, "buttons"),
          e.placeholderButtons ? (w(), $(G, { key: 0 }, [
            Q(tt, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: V(() => [...a[0] || (a[0] = [
                I("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/o.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            Q(tt, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: V(() => [...a[1] || (a[1] = [
                I("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/_.png"
                }, null, -1)
              ])]),
              _: 1
            }),
            a[3] || (a[3] = I("div", { style: { width: "2px" } }, null, -1)),
            Q(tt, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              disabled: ""
            }, {
              default: V(() => [...a[2] || (a[2] = [
                I("img", {
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
}), as = /* @__PURE__ */ U({
  __name: "Tooltip",
  props: {
    text: {},
    offsetX: {},
    offsetY: {}
  },
  setup(e) {
    const n = e, t = j(!1), o = nt({ x: 0, y: 0 });
    let l = null;
    const r = () => {
      l = window.setTimeout(() => {
        t.value = !0;
      }, 400);
    }, s = () => {
      l !== null && (clearTimeout(l), l = null), t.value = !1;
    }, a = (i) => {
      o.x = i.clientX + (n.offsetX ?? 24), o.y = i.clientY + (n.offsetY ?? 24);
    }, f = B(() => ({
      position: "fixed",
      left: `${o.x}px`,
      top: `${o.y}px`,
      pointerEvents: "none",
      // now TS understands it's valid
      whiteSpace: "nowrap",
      zIndex: 1e3
    }));
    return fe(() => {
      l !== null && clearTimeout(l);
    }), (i, d) => (w(), $("span", {
      onMouseenter: r,
      onMouseleave: s,
      onMousemove: a,
      style: { position: "relative", display: "inline-block" }
    }, [
      J(i.$slots, "default"),
      t.value ? (w(), F(ie, {
        key: 0,
        style: X(f.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: V(() => [
          $e(de(n.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : K("", !0)
    ], 32));
  }
}), Or = {
  class: "window-container",
  style: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%"
  }
}, Je = 6, Pr = /* @__PURE__ */ U({
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
    const n = Xl, t = e, o = be(e, "x"), l = be(e, "y"), r = be(e, "width"), s = be(e, "height"), a = t.minWidth ?? 240, f = t.minHeight ?? 40, i = B(() => (t.resizable ?? !1) || (t.resizableHorizontally ?? !1)), d = B(() => (t.resizable ?? !1) || (t.resizableVertically ?? !1));
    let u = !1, v = !1;
    const h = j("");
    let p = "";
    const g = {
      n: "ns-resize",
      s: "ns-resize",
      e: "ew-resize",
      w: "ew-resize",
      ne: "nesw-resize",
      sw: "nesw-resize",
      nw: "nwse-resize",
      se: "nwse-resize"
    }, E = B(() => g[h.value] ?? "");
    let N = 0, x = 0, R = 0, b = 0, A = 0, y = 0;
    function L(M) {
      if (t.faux || h.value) return;
      const D = M.target;
      D.closest(".titlebar-image") || D.closest(".titlebar-buttons") || (u = !0, N = M.clientX, x = M.clientY, A = o.value, y = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", m), window.addEventListener("mouseup", T));
    }
    function _(M) {
      t.faux || h.value && (!i.value && !d.value || (v = !0, p = h.value, N = M.clientX, x = M.clientY, R = r.value, b = s.value, A = o.value, y = l.value, document.body.style.userSelect = "none", window.addEventListener("mousemove", m), window.addEventListener("mouseup", T)));
    }
    function m(M) {
      if (t.faux) return;
      const D = M.clientX - N, Y = M.clientY - x;
      if (u && (o.value = A + D, l.value = y + Y), v) {
        const Z = p;
        if (i.value && Z.includes("e") && (r.value = Math.max(a, R + D)), d.value && Z.includes("s") && (s.value = Math.max(f, b + Y)), i.value && Z.includes("w")) {
          const q = R - D, ee = Math.max(a, q);
          r.value = ee, o.value = A + (R - ee);
        }
        if (d.value && Z.includes("n")) {
          const q = b - Y, ee = Math.max(f, q);
          s.value = ee, l.value = y + (b - ee);
        }
      }
    }
    function T() {
      u = !1, v = !1, p = "", h.value = "", document.body.style.userSelect = "", window.removeEventListener("mousemove", m), window.removeEventListener("mouseup", T);
    }
    function C(M) {
      if (t.faux) {
        h.value = "";
        return;
      }
      if (v) return;
      if (!i.value && !d.value) {
        h.value = "";
        return;
      }
      const Y = M.currentTarget.getBoundingClientRect(), Z = M.clientX - Y.left, q = Y.right - M.clientX, ee = M.clientY - Y.top, ge = Y.bottom - M.clientY;
      let le = "";
      d.value && (ee < Je ? le += "n" : ge < Je && (le += "s")), i.value && (Z < Je ? le += "w" : q < Je && (le += "e")), h.value = le;
    }
    return (M, D) => he((w(), F(ie, {
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
      onMousemove: C,
      onMousedown: _
    }, {
      default: V(() => [
        I("div", Or, [
          I("div", {
            class: "titlebar-wrapper",
            onMousedown: _e(L, ["stop"]),
            style: { height: "34px" }
          }, [
            Q(zr, {
              title: e.title,
              icon: e.icon,
              "placeholder-buttons": e.placeholderButtons,
              disabled: e.disabled,
              "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
              "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
            }, {
              buttons: V(() => [
                J(M.$slots, "titlebar-buttons")
              ]),
              _: 3
            }, 8, ["title", "icon", "placeholder-buttons", "disabled", "gradient-color-a", "gradient-color-b"])
          ], 32),
          I("div", {
            class: "inner-container",
            style: X({
              flex: "1",
              overflowX: t.overflowX ?? "auto",
              overflowY: t.overflowY ?? "auto",
              marginTop: "4px",
              boxSizing: "border-box"
            })
          }, [
            J(M.$slots, "default")
          ], 4)
        ])
      ]),
      _: 3
    }, 8, ["extra-class", "extra-styles"])), [
      [P(n), E.value]
    ]);
  }
}), Mr = { class: "label" }, _r = { class: "label-text" }, Fr = /* @__PURE__ */ U({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" }
  },
  setup(e) {
    return (n, t) => (w(), F(ie, {
      type: "border-groove",
      "extra-styles": { padding: "10px", margin: "10px" }
    }, {
      default: V(() => [
        I("div", Mr, [
          I("div", {
            class: "line-hider",
            style: X({ backgroundColor: e.backgroundColorHint })
          }, null, 4),
          I("div", _r, de(e.label), 1)
        ]),
        J(n.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }));
  }
}), is = /* @__PURE__ */ Tt(Fr, [["__scopeId", "data-v-43f13cf9"]]), yn = "/win-55-ui/emoji/emoji-by-category.json";
let xt = null;
async function wn() {
  return xt || (xt = fetch(yn).then((e) => {
    if (!e.ok)
      throw new Error(
        `Could not load emoji categories from ${yn}: ${e.status} ${e.statusText}`
      );
    return e.json();
  })), xt;
}
const Dr = { class: "emoji-picker-body" }, Hr = { class: "emoji-picker-tabs" }, Vr = ["onClick"], Wr = { class: "emoji-picker-grid" }, Ur = ["src", "title", "onClick"], Yr = "546", cs = /* @__PURE__ */ U({
  __name: "EmojiPickerWindow",
  setup(e) {
    const n = j(null), t = j([]), o = j(null), l = j(void 0), r = B(() => t.value.find((i) => i.category === o.value) ?? null);
    async function s() {
      if (Math.random() < 0.75) {
        l.value = pe(Yr);
        return;
      }
      const d = (await wn()).flatMap((v) => v.emojis);
      if (d.length === 0) return;
      const u = d[Math.floor(Math.random() * d.length)];
      l.value = pe(u.code);
    }
    ae(Ae, async (i) => {
      i && (s(), t.value.length === 0 && (t.value = await wn(), o.value = t.value[0]?.category ?? null));
    }, { immediate: !0 });
    function a(i) {
      o.value = i;
    }
    function f(i) {
      if (!Ae.value) return;
      const d = i.target;
      n.value?.contains(d) || on();
    }
    return ce(() => {
      document.addEventListener("click", f);
    }), fe(() => {
      document.removeEventListener("click", f);
    }), (i, d) => (w(), F(st, { to: "body" }, [
      P(Ae) ? (w(), $("div", {
        key: 0,
        ref_key: "rootRef",
        ref: n,
        style: { display: "contents" }
      }, [
        Q(Pr, {
          x: P(xe).x,
          "onUpdate:x": d[0] || (d[0] = (u) => P(xe).x = u),
          y: P(xe).y,
          "onUpdate:y": d[1] || (d[1] = (u) => P(xe).y = u),
          width: P(xe).width,
          "onUpdate:width": d[2] || (d[2] = (u) => P(xe).width = u),
          height: P(xe).height,
          "onUpdate:height": d[3] || (d[3] = (u) => P(xe).height = u),
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
          "titlebar-buttons": V(() => [
            Q(tt, {
              "extra-class": "titlebar-button",
              "base-type": "panel-d-2",
              onClick: P(on)
            }, {
              default: V(() => [...d[4] || (d[4] = [
                I("img", {
                  draggable: "false",
                  src: "/win-55-ui/window/x.png"
                }, null, -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]),
          default: V(() => [
            Q(ie, {
              type: "textarea",
              "extra-styles": { width: "100%", height: "calc(100% - 2px)", marginTop: "2px", padding: "2px" }
            }, {
              default: V(() => [
                I("div", Dr, [
                  I("div", Hr, [
                    (w(!0), $(G, null, oe(t.value, (u) => (w(), $("span", {
                      key: u.category,
                      class: Le(["emoji-picker-tab", { "emoji-picker-tab--selected": u.category === o.value }]),
                      onClick: (v) => a(u.category)
                    }, [
                      Q(Ie, {
                        shorthand: u.category === o.value ? "Bold12" : "Regular12"
                      }, {
                        default: V(() => [
                          $e(de(u.category), 1)
                        ]),
                        _: 2
                      }, 1032, ["shorthand"])
                    ], 10, Vr))), 128))
                  ]),
                  Q(or),
                  Q(ie, {
                    type: "none",
                    "overflow-y": "auto",
                    "extra-class": "emoji-picker-scroll"
                  }, {
                    default: V(() => [
                      I("div", Wr, [
                        (w(!0), $(G, null, oe(r.value?.emojis ?? [], (u) => (w(), $("div", {
                          key: u.code,
                          class: "emoji-picker-grid-cell"
                        }, [
                          I("img", {
                            src: P(pe)(u.code),
                            title: u.shortcodes[0] ? `:${u.shortcodes[0]}:` : void 0,
                            class: "emoji-picker-grid-item",
                            onClick: (v) => P(xl)(u.emoji)
                          }, null, 8, Ur)
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
      ], 512)) : K("", !0)
    ]));
  }
}), Xr = ["src", "alt", "width", "height"], xn = 15, Ze = 2, us = /* @__PURE__ */ U({
  __name: "Emoji",
  props: {
    emoji: {}
  },
  setup(e) {
    const n = e, t = new RegExp(`^(?:${De})$`, "u"), o = j(""), l = j(n.emoji), r = j(xn * Ze), s = j(xn * Ze);
    async function a(i) {
      if (t.test(i)) {
        l.value = i;
        const u = await Xo(i);
        o.value = u ?? Bt(i);
        return;
      }
      const d = await _n(i);
      if (d) {
        l.value = d.emoji, o.value = pe(d.code);
        return;
      }
      console.warn(`[win-55-ui] Emoji: could not resolve "${i}" as an emoji or a shortcode alias.`), l.value = i, o.value = "";
    }
    ae(() => n.emoji, (i) => {
      a(i);
    }, { immediate: !0 });
    function f(i) {
      const d = i.target;
      r.value = d.naturalWidth * Ze, s.value = d.naturalHeight * Ze;
    }
    return (i, d) => (w(), $("img", {
      class: "win55-emoji-standalone",
      src: o.value,
      alt: l.value,
      width: r.value,
      height: s.value,
      draggable: "false",
      onLoad: f
    }, null, 40, Xr));
  }
}), ds = (e, n = 20, t = 48, o = 30) => {
  const l = j(
    Array.from({ length: e }, (i, d) => ({
      sin: Math.sin(0 + d * Math.PI * 2 / e),
      cos: Math.cos(0 + d * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let r = 0, s = 0;
  const a = n > 0 ? 1e3 / n : 0, f = () => {
    r = requestAnimationFrame(f);
    const i = Date.now();
    if (i - s < a) return;
    s = i;
    const d = Array.from({ length: e }, (p, g) => ({
      sin: Math.sin(i / (1e3 + g * 200) + g * Math.PI * 2 / e),
      cos: Math.cos(i / (3e3 + g * 400) + g * Math.PI * 2 / e + Math.PI / 4)
    })), u = d.map((p) => t + p.sin * o), v = e * t, h = u.reduce((p, g) => p + g, 0);
    if (h > 0) {
      const p = v / h;
      l.value = d.map((g) => ({
        sin: ((t + g.sin * o) * p - t) / o,
        cos: g.cos
      }));
    } else
      l.value = d;
  };
  return ce(() => {
    r = requestAnimationFrame(f);
  }), fe(() => {
    cancelAnimationFrame(r);
  }), { values: l };
};
function fs(e) {
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
  $o as Balloon,
  Lo as BaseDropdown,
  $n as BaseInput,
  ie as Box,
  tt as Button,
  Dn as CURSOR_CONTEXT_KEY,
  ns as Checkbox,
  os as CursorContext,
  us as Emoji,
  cs as EmojiPickerWindow,
  or as HDivider,
  ls as MenuDropdown,
  is as NamedPanel,
  es as NumberInput,
  rs as RadioButton,
  Qr as RichInput,
  ss as RichText,
  Il as SimpleStringInput,
  zr as Titlebar,
  as as Tooltip,
  Ie as Typography,
  Pr as Window,
  Nt as activeTarget,
  on as closePicker,
  Xl as cursorDirective,
  ct as cursorWeakDirective,
  Zr as customEmojiDirective,
  Br as drawAngledBayerDitherGradient,
  hl as emojiDirective,
  Xo as getEmojiGifPath,
  pe as getEmojiGifPathFromCode,
  qr as getEmojiRegistry,
  Ne as getSelectionOffset,
  ue as getTextWithCustomEmoji,
  Jr as hasEmoji,
  xl as insertEmoji,
  ke as loadEmojiRegistry,
  ts as loadSchemeIndex,
  wl as openPicker,
  bl as pickNextButtonIcon,
  Ae as pickerOpen,
  xe as pickerPosition,
  Ol as provideCursorContext,
  nn as registerActiveInput,
  fs as registerGlobalImageErrorHandler,
  Kr as resetEmojiRegistryCache,
  Fe as restoreSelectionOffset,
  Bn as typographyStyles,
  Pl as useCursorContext,
  ds as useSineWave
};
