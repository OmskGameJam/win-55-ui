import { defineComponent as M, ref as $, computed as b, openBlock as v, createElementBlock as w, normalizeStyle as x, normalizeClass as Z, renderSlot as B, useModel as P, useSlots as re, createElementVNode as p, createVNode as D, withCtx as k, unref as ce, Fragment as j, createTextVNode as J, toDisplayString as X, createCommentVNode as Y, mergeModels as te, watch as Q, nextTick as de, onMounted as _, onUnmounted as O, withModifiers as le, createBlock as z, Teleport as ue, resolveDynamicComponent as fe, reactive as he } from "vue";
const I = /* @__PURE__ */ M({
  __name: "Box",
  props: {
    type: {},
    extraStyles: {},
    extraClass: {}
  },
  setup(e, { expose: l }) {
    const t = e, n = $(null), a = b(() => ({
      "--img": `url(/win-55-ui/${t.type}.png)`,
      ...t.extraStyles
    }));
    return l({ el: n }), (i, o) => (v(), w("div", {
      ref_key: "rootRef",
      ref: n,
      class: Z(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: x(a.value)
    }, [
      B(i.$slots, "default")
    ], 6));
  }
}), me = { class: "balloon-wrapper" }, pe = { class: "balloon-tip-box" }, Ye = /* @__PURE__ */ M({
  __name: "Balloon",
  props: /* @__PURE__ */ te({
    text: {},
    side: {},
    bias: {}
  }, {
    shown: { type: Boolean, default: !1 },
    shownModifiers: {}
  }),
  emits: ["update:shown"],
  setup(e) {
    const l = P(e, "shown"), t = e, n = re(), a = b(() => t.side ?? "top"), i = b(() => t.bias), o = b(() => {
      const s = {};
      switch (a.value) {
        case "top":
          s.bottom = "100%", s.left = "50%", s.transform = "translateX(-50%)";
          break;
        case "bottom":
          s.top = "100%", s.left = "50%", s.transform = "translateX(-50%)";
          break;
        case "left":
          s.right = "100%", s.top = "50%", s.transform = "translateY(-50%)";
          break;
        case "right":
          s.left = "100%", s.top = "50%", s.transform = "translateY(-50%)";
          break;
      }
      return s;
    }), c = b(() => {
      switch (a.value) {
        case "top":
          return "column";
        case "bottom":
          return "column-reverse";
        case "left":
          return "row";
        case "right":
          return "row-reverse";
      }
    }), u = b(() => {
      let s = "", h = !1;
      switch (a.value) {
        case "top":
          s = "rotate(0deg)", i.value === "right" && (h = !0);
          break;
        case "bottom":
          s = "rotate(180deg)", i.value === "left" && (h = !0);
          break;
        case "left":
          s = "rotate(-90deg)";
          break;
        case "right":
          s = "rotate(90deg)", h = !0;
          break;
      }
      return h ? `${s} scaleX(-1)` : s;
    }), d = b(() => {
      const s = {};
      return i.value ? ((a.value === "top" || a.value === "bottom") && (i.value === "left" && (s.transform = "translateX(calc(-50% + 28px))"), i.value === "right" && (s.transform = "translateX(calc(50% - 28px))")), (a.value === "left" || a.value === "right") && (i.value === "up" && (s.transform = "translateY(calc(-50% + 28px))"), i.value === "down" && (s.transform = "translateY(calc(50% - 28px))")), s) : {};
    });
    return (s, h) => (v(), w("div", me, [
      B(s.$slots, "default"),
      l.value ? (v(), w("div", {
        key: 0,
        class: "balloon",
        style: x(o.value)
      }, [
        p("div", {
          class: "balloon-inner",
          style: x({ flexDirection: c.value })
        }, [
          p("div", {
            class: "balloon-box-wrapper",
            style: x(d.value)
          }, [
            D(I, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: k(() => [
                ce(n).content ? B(s.$slots, "content", { key: 0 }) : (v(), w(j, { key: 1 }, [
                  J(X(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          p("div", pe, [
            p("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: x({ transform: u.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : Y("", !0)
    ]));
  }
}), ve = /* @__PURE__ */ M({
  __name: "BaseDropdown",
  props: {
    matchTriggerWidth: { type: Boolean, default: !1 }
  },
  setup(e) {
    const l = e, t = $(!1), n = $(null), a = $(null), i = $(null), o = () => {
      const s = a.value, h = i.value;
      if (!s || !h) return;
      const r = s.getBoundingClientRect(), f = window.innerHeight, m = h.offsetHeight;
      let g = r.bottom + window.scrollY;
      const C = r.left + window.scrollX;
      r.bottom + m > f && (g = r.top + window.scrollY - m), n.value = {
        top: g,
        left: C,
        width: l.matchTriggerWidth ? r.width : void 0
      };
    };
    Q(t, async (s) => {
      s && (await de(), o());
    });
    const c = () => {
      t.value && o();
    }, u = (s) => {
      if (!t.value) return;
      const h = s.target;
      a.value?.contains(h) || i.value?.contains(h) || (t.value = !1);
    };
    _(() => {
      window.addEventListener("resize", c), window.addEventListener("scroll", c), document.addEventListener("click", u);
    }), O(() => {
      window.removeEventListener("resize", c), window.removeEventListener("scroll", c), document.removeEventListener("click", u);
    });
    const d = () => {
      t.value = !t.value;
    };
    return (s, h) => (v(), w(j, null, [
      p("div", {
        ref_key: "triggerRef",
        ref: a,
        style: { display: "inline-block" },
        onClick: le(d, ["stop"])
      }, [
        B(s.$slots, "trigger")
      ], 512),
      (v(), z(ue, { to: "body" }, [
        t.value ? (v(), w("div", {
          key: 0,
          ref_key: "dropdownRef",
          ref: i,
          style: x({
            position: "absolute",
            top: (n.value?.top ?? 0) + "px",
            left: (n.value?.left ?? 0) + "px",
            width: e.matchTriggerWidth ? (n.value?.width ?? "auto") + "px" : "auto"
          })
        }, [
          B(s.$slots, "items")
        ], 4)) : Y("", !0)
      ]))
    ], 64));
  }
}), ge = [10, 12, 14, 16, 24];
function oe(e) {
  const { style: l, size: t } = e.shorthand ? ye(e.shorthand) : {
    style: be(e.isBold, e.isItalic),
    size: we(e.fontSize ?? 12, ge)
  }, n = {
    fontFamily: `${l}${t}, Arial, sans`,
    fontSize: `${t * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (n.textShadow = `2px 2px 0 ${e.fontShadowColor}`), n;
}
function be(e, l) {
  return e && l ? "BoldItalic" : e ? "Bold" : l ? "Italic" : "Regular";
}
function ye(e) {
  const l = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!l)
    throw new Error(`Invalid shorthand format: ${e}`);
  const t = l[1], n = parseInt(l[2], 10);
  return { style: t, size: n };
}
function we(e, l) {
  if (l.length === 0)
    throw new Error("Array cannot be empty");
  return l.reduce((t, n) => {
    const a = Math.abs(n - e), i = Math.abs(t - e);
    return a < i ? n : t;
  });
}
const We = /* @__PURE__ */ M({
  __name: "BaseInput",
  props: {
    modelValue: {},
    placeholder: { default: "" },
    disabled: { type: Boolean, default: !1 },
    maxLength: { default: void 0 },
    boxType: { default: "textarea" },
    extraStyles: { default: void 0 },
    multiline: { type: Boolean, default: !1 }
  },
  emits: ["update:modelValue"],
  setup(e, { expose: l, emit: t }) {
    const n = e, a = t, i = $(null), o = b(() => i.value?.el ?? null);
    _(() => {
      o.value && n.modelValue && (o.value.innerText = n.modelValue);
    }), Q(() => n.modelValue, (r) => {
      o.value && o.value.innerText !== r && (o.value.innerText = r ?? "");
    });
    const c = () => {
      if (!o.value) return;
      let r = o.value.innerText || "";
      if (n.multiline || (r = r.replace(/\n/g, "")), n.maxLength && r.length > n.maxLength) {
        r = r.slice(0, n.maxLength), o.value.innerText = r;
        const f = document.createRange(), m = window.getSelection();
        f.selectNodeContents(o.value), f.collapse(!1), m?.removeAllRanges(), m?.addRange(f);
      }
      a("update:modelValue", r);
    }, u = (r) => {
      !n.multiline && r.key === "Enter" && r.preventDefault(), r.key === "Tab" && r.preventDefault();
    }, d = (r) => {
      r.preventDefault();
      let f = r.clipboardData?.getData("text/plain") ?? "";
      if (n.multiline || (f = f.replace(/\n/g, " ")), !o.value) return;
      const m = window.getSelection(), g = m?.getRangeAt(0);
      if (g) {
        g.deleteContents();
        const C = document.createTextNode(f);
        g.insertNode(C), g.collapse(!1), m?.removeAllRanges(), m?.addRange(g);
      }
      c();
    }, s = () => {
      o.value && o.value.innerText === "" && (o.value.innerHTML = "");
    }, h = b(() => ({
      ...n.extraStyles,
      ...oe({ fontColor: "black" }),
      overflow: "auto"
    }));
    return l({ el: o }), (r, f) => (v(), z(I, {
      ref_key: "boxRef",
      ref: i,
      type: e.boxType,
      contenteditable: !e.disabled,
      "extra-styles": h.value,
      "data-placeholder": e.placeholder,
      role: "textbox",
      "aria-multiline": e.multiline,
      "aria-disabled": e.disabled,
      onInput: c,
      onKeydown: u,
      onPaste: d,
      onBlur: s
    }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"]));
  }
}), xe = /* @__PURE__ */ M({
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
    const l = e, t = b(() => l.element ?? "span"), n = b(() => {
      const a = oe(l);
      return l.element || (a.display = "contents"), a;
    });
    return (a, i) => (v(), z(fe(t.value), {
      style: x(n.value)
    }, {
      default: k(() => [
        B(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["style"]));
  }
}), K = /* @__PURE__ */ M({
  __name: "Button",
  props: {
    baseType: { default: "panel-d-1" },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: l }) {
    const t = e, n = l, a = $(!1), i = $(!1), o = b(() => !t.disabled && a.value && i.value), c = b(() => t.disabled), u = (g) => {
      t.disabled || g.button !== 0 || (a.value = !0, i.value = !0);
    }, d = () => {
      t.disabled || (i.value = !0);
    }, s = () => {
      i.value = !1;
    }, h = (g) => {
      t.disabled || g.button !== 0 || (a.value && i.value && n("click"), a.value = !1);
    };
    _(() => {
      window.addEventListener("mouseup", h);
    }), O(() => {
      window.removeEventListener("mouseup", h);
    });
    const r = b(() => ({
      userSelect: "none",
      width: "fit-content",
      paddingBottom: "4px",
      paddingRight: "4px",
      cursor: c.value ? "not-allowed" : "default",
      ...t.extraStyles
    })), f = b(() => ({
      transform: o.value ? "translate(2px, 2px)" : "translate(0, 0)",
      opacity: c.value ? 0.5 : 1
    })), m = b(() => o.value ? "indent" : t.baseType);
    return (g, C) => (v(), z(I, {
      type: m.value,
      "extra-styles": r.value,
      "extra-class": e.extraClass,
      onMousedown: u,
      onMouseenter: d,
      onMouseleave: s
    }, {
      default: k(() => [
        p("div", {
          style: x(f.value)
        }, [
          B(g.$slots, "default")
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"]));
  }
}), ke = { style: { display: "flex", "align-items": "center" } }, Be = ["src", "alt"], Me = ["checked", "disabled", "value"], Ne = /* @__PURE__ */ M({
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
  setup(e, { emit: l }) {
    const t = e, n = l, a = () => {
      t.disabled || n("update:modelValue", !t.modelValue);
    };
    return (i, o) => (v(), w("div", {
      class: Z(["checkbox-container", { disabled: e.disabled }]),
      style: x({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: e.disabled ? 0.5 : 1,
        cursor: e.disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        marginBottom: "2px"
      }),
      onClick: a
    }, [
      p("div", ke, [
        p("img", {
          draggable: "false",
          src: e.modelValue ? e.checkedIcon : e.uncheckedIcon,
          alt: e.modelValue ? "checked" : "unchecked"
        }, null, 8, Be)
      ]),
      p("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, Me),
      e.label ? (v(), w("span", {
        key: 0,
        style: x({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, X(e.label), 5)) : Y("", !0)
    ], 6));
  }
}), Pe = /* @__PURE__ */ M({
  __name: "HDivider",
  setup(e) {
    return (l, t) => (v(), z(I, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), _e = /* @__PURE__ */ M({
  __name: "MenuDropdown",
  setup(e) {
    return (l, t) => (v(), z(ve, null, {
      trigger: k(() => [
        B(l.$slots, "trigger")
      ]),
      items: k(() => [
        D(I, { type: "panel-d-1" }, {
          default: k(() => [
            B(l.$slots, "items")
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), Ce = { style: { display: "flex", "align-items": "center" } }, $e = ["src"], Se = ["src"], ze = ["checked", "disabled", "value", "name"], Oe = /* @__PURE__ */ M({
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
  setup(e, { emit: l }) {
    const t = e, n = l, a = b(() => t.modelValue === t.value), i = (o) => {
      o.preventDefault(), !t.disabled && (a.value || n("update:modelValue", t.value));
    };
    return (o, c) => (v(), w("div", {
      class: Z(["radio-container", { disabled: e.disabled }]),
      style: x({
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
      p("div", Ce, [
        a.value ? (v(), w("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, $e)) : (v(), w("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, Se))
      ]),
      p("input", {
        type: "radio",
        checked: a.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, ze),
      e.label ? (v(), w("span", {
        key: 0,
        style: x({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, X(e.label), 5)) : Y("", !0)
    ], 6));
  }
});
function Te(e, l, t, n, a) {
  const i = e.getContext("2d");
  if (!i) return;
  i.clearRect(0, 0, e.width, e.height);
  const o = 2, c = [
    [0, 48, 12, 60, 3, 51, 15, 63],
    [32, 16, 44, 28, 35, 19, 47, 31],
    [8, 56, 4, 52, 11, 59, 7, 55],
    [40, 24, 36, 20, 43, 27, 39, 23],
    [2, 50, 14, 62, 1, 49, 13, 61],
    [34, 18, 46, 30, 33, 17, 45, 29],
    [10, 58, 6, 54, 9, 57, 5, 53],
    [42, 26, 38, 22, 41, 25, 37, 21]
  ], u = ee(n), d = ee(a), s = Math.floor(l / o), h = Math.floor(t / o);
  e.width = Math.floor(l * 2) / 2, e.height = Math.floor(t * 2) / 2;
  for (let r = 0; r < h; r++)
    for (let f = 0; f < s; f++) {
      const m = f * o, g = r * o, C = (f + r) / (s + h - 6), R = (c[r % 8][f % 8] + 0.5) / 64, S = C > R ? 1 : 0, V = Math.round(u.r * (1 - S) + d.r * S), L = Math.round(u.g * (1 - S) + d.g * S), U = Math.round(u.b * (1 - S) + d.b * S);
      i.fillStyle = `rgb(${V}, ${L}, ${U})`, i.fillRect(m, g, o, o);
    }
}
function ee(e) {
  const l = e.replace("#", ""), t = parseInt(l, 16);
  return {
    r: t >> 16 & 255,
    g: t >> 8 & 255,
    b: t & 255
  };
}
const Ie = { style: { height: "0", overflow: "visible" } }, Re = { class: "titlebar-content" }, Ee = { class: "titlebar-image" }, De = ["src"], Ve = { class: "titlebar-text" }, Le = /* @__PURE__ */ M({
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
    const l = e, t = $(null);
    let n = null;
    function a(o, c) {
      const u = l.gradientColorA || "5555ff", d = l.gradientColorB || "0000aa";
      Te(o, o.width, o.height, u, d), c.fillStyle = "#555555", c.fillRect(0, o.height - 2, Math.floor(o.width / 2) * 2, 4);
    }
    function i() {
      const o = t.value;
      if (!o) return;
      const c = o.getContext("2d");
      if (!c) return;
      const u = o.getBoundingClientRect(), d = Math.floor(u.width * 2) / 2, s = Math.floor(u.height * 2) / 2;
      (o.width !== d || o.height !== s) && (o.width = d, o.height = s), a(o, c);
    }
    return Q(() => [l.gradientColorA, l.gradientColorB], () => {
      if (t.value) {
        const o = t.value.getContext("2d");
        o && a(t.value, o);
      }
    }), _(() => {
      i(), t.value && (n = new ResizeObserver(() => {
        i();
      }), n.observe(t.value));
    }), O(() => {
      n?.disconnect();
    }), (o, c) => (v(), w("div", null, [
      p("div", Ie, [
        p("canvas", {
          ref_key: "canvasRef",
          ref: t,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      p("div", Re, [
        p("div", Ee, [
          p("img", {
            src: e.icon ?? "/win-55-ui/icons/program.png"
          }, null, 8, De)
        ]),
        p("div", Ve, [
          D(xe, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: k(() => [
              J(X(e.title), 1)
            ]),
            _: 1
          })
        ]),
        B(o.$slots, "buttons"),
        e.placeholderButtons ? (v(), w(j, { key: 0 }, [
          D(K, {
            "extra-class": "titlebar-button",
            "base-type": "panel-d-2",
            disabled: ""
          }, {
            default: k(() => [...c[0] || (c[0] = [
              p("img", {
                draggable: "false",
                src: "/win-55-ui/window/o.png"
              }, null, -1)
            ])]),
            _: 1
          }),
          D(K, {
            "extra-class": "titlebar-button",
            "base-type": "panel-d-2",
            disabled: ""
          }, {
            default: k(() => [...c[1] || (c[1] = [
              p("img", {
                draggable: "false",
                src: "/win-55-ui/window/_.png"
              }, null, -1)
            ])]),
            _: 1
          }),
          c[3] || (c[3] = p("div", { style: { width: "2px" } }, null, -1)),
          D(K, {
            "extra-class": "titlebar-button",
            "base-type": "panel-d-2",
            disabled: ""
          }, {
            default: k(() => [...c[2] || (c[2] = [
              p("img", {
                draggable: "false",
                src: "/win-55-ui/window/x.png"
              }, null, -1)
            ])]),
            _: 1
          }),
          c[4] || (c[4] = p("div", { style: { width: "2px" } }, null, -1))
        ], 64)) : Y("", !0)
      ])
    ]));
  }
}), Fe = /* @__PURE__ */ M({
  __name: "Tooltip",
  props: {
    text: {},
    offsetX: {},
    offsetY: {}
  },
  setup(e) {
    const l = e, t = $(!1), n = he({ x: 0, y: 0 });
    let a = null;
    const i = () => {
      a = window.setTimeout(() => {
        t.value = !0;
      }, 400);
    }, o = () => {
      a !== null && (clearTimeout(a), a = null), t.value = !1;
    }, c = (d) => {
      n.x = d.clientX + (l.offsetX ?? 24), n.y = d.clientY + (l.offsetY ?? 24);
    }, u = b(() => ({
      position: "fixed",
      left: `${n.x}px`,
      top: `${n.y}px`,
      pointerEvents: "none",
      // now TS understands it's valid
      whiteSpace: "nowrap",
      zIndex: 1e3
    }));
    return O(() => {
      a !== null && clearTimeout(a);
    }), (d, s) => (v(), w("span", {
      onMouseenter: i,
      onMouseleave: o,
      onMousemove: c,
      style: { position: "relative", display: "inline-block" }
    }, [
      B(d.$slots, "default"),
      t.value ? (v(), z(I, {
        key: 0,
        style: x(u.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: k(() => [
          J(X(l.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : Y("", !0)
    ], 32));
  }
}), F = 6, Ue = /* @__PURE__ */ M({
  __name: "Window",
  props: /* @__PURE__ */ te({
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
    faux: { type: Boolean }
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
    const l = e, t = P(e, "x"), n = P(e, "y"), a = P(e, "width"), i = P(e, "height"), o = l.minWidth ?? 240, c = l.minHeight ?? 40, u = l.resizable ?? l.resizableHorizontally ?? !1, d = l.resizable ?? l.resizableVertically ?? !1;
    let s = !1, h = !1, r = "", f = "", m = 0, g = 0, C = 0, R = 0, S = 0, V = 0;
    const L = $("default");
    function U(y) {
      l.faux || r || (s = !0, m = y.clientX, g = y.clientY, S = t.value, V = n.value, window.addEventListener("mousemove", q), window.addEventListener("mouseup", G));
    }
    function ne(y) {
      l.faux || r && (!u && !d || (h = !0, f = r, m = y.clientX, g = y.clientY, C = a.value, R = i.value, S = t.value, V = n.value, window.addEventListener("mousemove", q), window.addEventListener("mouseup", G)));
    }
    function q(y) {
      if (l.faux) return;
      const W = y.clientX - m, T = y.clientY - g;
      if (s && (t.value = S + W, n.value = V + T), h) {
        const H = f;
        if (u && H.includes("e") && (a.value = Math.max(o, C + W)), d && H.includes("s") && (i.value = Math.max(c, R + T)), u && H.includes("w")) {
          const N = C - W, E = Math.max(o, N);
          a.value = E, t.value = S + (C - E);
        }
        if (d && H.includes("n")) {
          const N = R - T, E = Math.max(c, N);
          i.value = E, n.value = V + (R - E);
        }
      }
    }
    function G() {
      s = !1, h = !1, f = "", window.removeEventListener("mousemove", q), window.removeEventListener("mouseup", G);
    }
    function ae(y) {
      if (l.faux) {
        r = "", L.value = "default";
        return;
      }
      if (h) return;
      if (!u && !d) {
        r = "", L.value = "default";
        return;
      }
      const T = y.currentTarget.getBoundingClientRect(), H = y.clientX - T.left, N = T.right - y.clientX, E = y.clientY - T.top, se = T.bottom - y.clientY;
      let A = "";
      d && (E < F ? A += "n" : se < F && (A += "s")), u && (H < F ? A += "w" : N < F && (A += "e")), r = A;
      const ie = {
        n: "ns-resize",
        s: "ns-resize",
        e: "ew-resize",
        w: "ew-resize",
        ne: "nesw-resize",
        sw: "nesw-resize",
        nw: "nwse-resize",
        se: "nwse-resize"
      };
      L.value = ie[A] ?? "default";
    }
    return (y, W) => (v(), z(I, {
      "extra-class": e.extraClass,
      "extra-styles": l.faux ? e.extraStyles : {
        position: "absolute",
        left: t.value + "px",
        top: n.value + "px",
        width: a.value + "px",
        height: i.value + "px",
        cursor: L.value,
        ...e.extraStyles
      },
      type: "panel-d-2",
      onMousemove: ae,
      onMousedown: ne
    }, {
      default: k(() => [
        p("div", {
          onMousedown: le(U, ["stop"])
        }, [
          D(Le, {
            title: e.title,
            icon: e.icon,
            "placeholder-buttons": e.placeholderButtons,
            disabled: e.disabled,
            "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
            "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
          }, {
            buttons: k(() => [
              B(y.$slots, "titlebar-buttons")
            ]),
            _: 3
          }, 8, ["title", "icon", "placeholder-buttons", "disabled", "gradient-color-a", "gradient-color-b"])
        ], 32),
        B(y.$slots, "default")
      ]),
      _: 3
    }, 8, ["extra-class", "extra-styles"]));
  }
}), He = /* @__PURE__ */ M({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" }
  },
  setup(e) {
    return (l, t) => (v(), z(I, {
      type: "border-groove",
      "extra-styles": { padding: "10px", margin: "10px" }
    }, {
      default: k(() => [
        p("div", {
          class: "label",
          style: x({ backgroundColor: e.backgroundColorHint })
        }, X(e.label), 5),
        B(l.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }));
  }
}), Ae = (e, l) => {
  const t = e.__vccOpts || e;
  for (const [n, a] of l)
    t[n] = a;
  return t;
}, qe = /* @__PURE__ */ Ae(He, [["__scopeId", "data-v-9a25af1b"]]), Ge = (e, l = 30, t = 48, n = 30) => {
  const a = $(
    Array.from({ length: e }, (u, d) => ({
      sin: Math.sin(0 + d * Math.PI * 2 / e),
      cos: Math.cos(0 + d * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let i, o = 0;
  const c = () => {
    const u = Date.now();
    if (u - o >= 1e3 / l) {
      const d = Array.from({ length: e }, (f, m) => ({
        sin: Math.sin(u / (1e3 + m * 200) + m * Math.PI * 2 / e),
        cos: Math.cos(u / (3e3 + m * 400) + m * Math.PI * 2 / e + Math.PI / 4)
      })), s = d.map((f) => t + f.sin * n), h = e * t, r = s.reduce((f, m) => f + m, 0);
      if (r > 0) {
        const f = h / r, m = d.map((g) => ({
          sin: ((t + g.sin * n) * f - t) / n,
          cos: g.cos
        }));
        a.value = m;
      } else
        a.value = d;
      o = u;
    }
    i = requestAnimationFrame(c);
  };
  return _(() => {
    i = requestAnimationFrame(c);
  }), O(() => {
    cancelAnimationFrame(i);
  }), { values: a };
};
function Ke(e) {
  document.addEventListener(
    "error",
    (l) => {
      const t = l.target;
      t instanceof HTMLImageElement && e(t, l);
    },
    !0
    // IMPORTANT: use capture phase since error doesn't bubble
  );
}
export {
  Ye as Balloon,
  ve as BaseDropdown,
  We as BaseInput,
  I as Box,
  K as Button,
  Ne as Checkbox,
  Pe as HDivider,
  _e as MenuDropdown,
  qe as NamedPanel,
  Oe as RadioButton,
  Le as Titlebar,
  Fe as Tooltip,
  xe as Typography,
  Ue as Window,
  Te as drawAngledBayerDitherGradient,
  Ke as registerGlobalImageErrorHandler,
  oe as typographyStyles,
  Ge as useSineWave
};
