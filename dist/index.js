import { defineComponent as M, ref as $, computed as b, openBlock as g, createElementBlock as y, normalizeStyle as k, normalizeClass as Z, renderSlot as B, useModel as N, useSlots as ce, createElementVNode as p, createVNode as T, withCtx as x, unref as de, Fragment as j, createTextVNode as J, toDisplayString as P, createCommentVNode as X, mergeModels as te, watch as Q, nextTick as ue, onMounted as F, onUnmounted as O, withModifiers as le, createBlock as I, Teleport as fe, resolveDynamicComponent as he, reactive as me } from "vue";
const D = /* @__PURE__ */ M({
  __name: "Box",
  props: {
    type: {},
    extraStyles: {},
    extraClass: {}
  },
  setup(e, { expose: l }) {
    const t = e, n = $(null), s = b(() => ({
      "--img": `url(/win-55-ui/${t.type}.png)`,
      ...t.extraStyles
    }));
    return l({ el: n }), (i, o) => (g(), y("div", {
      ref_key: "rootRef",
      ref: n,
      class: Z(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: k(s.value)
    }, [
      B(i.$slots, "default")
    ], 6));
  }
}), ve = { class: "balloon-wrapper" }, pe = { class: "balloon-tip-box" }, He = /* @__PURE__ */ M({
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
    const l = N(e, "shown"), t = e, n = ce(), s = b(() => t.side ?? "top"), i = b(() => t.bias), o = b(() => {
      const a = {};
      switch (s.value) {
        case "top":
          a.bottom = "100%", a.left = "50%", a.transform = "translateX(-50%)";
          break;
        case "bottom":
          a.top = "100%", a.left = "50%", a.transform = "translateX(-50%)";
          break;
        case "left":
          a.right = "100%", a.top = "50%", a.transform = "translateY(-50%)";
          break;
        case "right":
          a.left = "100%", a.top = "50%", a.transform = "translateY(-50%)";
          break;
      }
      return a;
    }), c = b(() => {
      switch (s.value) {
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
      let a = "", h = !1;
      switch (s.value) {
        case "top":
          a = "rotate(0deg)", i.value === "right" && (h = !0);
          break;
        case "bottom":
          a = "rotate(180deg)", i.value === "left" && (h = !0);
          break;
        case "left":
          a = "rotate(-90deg)";
          break;
        case "right":
          a = "rotate(90deg)", h = !0;
          break;
      }
      return h ? `${a} scaleX(-1)` : a;
    }), d = b(() => {
      const a = {};
      return i.value ? ((s.value === "top" || s.value === "bottom") && (i.value === "left" && (a.transform = "translateX(calc(-50% + 28px))"), i.value === "right" && (a.transform = "translateX(calc(50% - 28px))")), (s.value === "left" || s.value === "right") && (i.value === "up" && (a.transform = "translateY(calc(-50% + 28px))"), i.value === "down" && (a.transform = "translateY(calc(50% - 28px))")), a) : {};
    });
    return (a, h) => (g(), y("div", ve, [
      B(a.$slots, "default"),
      l.value ? (g(), y("div", {
        key: 0,
        class: "balloon",
        style: k(o.value)
      }, [
        p("div", {
          class: "balloon-inner",
          style: k({ flexDirection: c.value })
        }, [
          p("div", {
            class: "balloon-box-wrapper",
            style: k(d.value)
          }, [
            T(D, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: x(() => [
                de(n).content ? B(a.$slots, "content", { key: 0 }) : (g(), y(j, { key: 1 }, [
                  J(P(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          p("div", pe, [
            p("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: k({ transform: u.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : X("", !0)
    ]));
  }
}), ge = /* @__PURE__ */ M({
  __name: "BaseDropdown",
  props: {
    matchTriggerWidth: { type: Boolean, default: !1 }
  },
  setup(e) {
    const l = e, t = $(!1), n = $(null), s = $(null), i = $(null), o = () => {
      const a = s.value, h = i.value;
      if (!a || !h) return;
      const r = a.getBoundingClientRect(), f = window.innerHeight, m = h.offsetHeight;
      let v = r.bottom + window.scrollY;
      const S = r.left + window.scrollX;
      r.bottom + m > f && (v = r.top + window.scrollY - m), n.value = {
        top: v,
        left: S,
        width: l.matchTriggerWidth ? r.width : void 0
      };
    };
    Q(t, async (a) => {
      a && (await ue(), o());
    });
    const c = () => {
      t.value && o();
    }, u = (a) => {
      if (!t.value) return;
      const h = a.target;
      s.value?.contains(h) || i.value?.contains(h) || (t.value = !1);
    };
    F(() => {
      window.addEventListener("resize", c), window.addEventListener("scroll", c), document.addEventListener("click", u);
    }), O(() => {
      window.removeEventListener("resize", c), window.removeEventListener("scroll", c), document.removeEventListener("click", u);
    });
    const d = () => {
      t.value = !t.value;
    };
    return (a, h) => (g(), y(j, null, [
      p("div", {
        ref_key: "triggerRef",
        ref: s,
        style: { display: "inline-block" },
        onClick: le(d, ["stop"])
      }, [
        B(a.$slots, "trigger")
      ], 512),
      (g(), I(fe, { to: "body" }, [
        t.value ? (g(), y("div", {
          key: 0,
          ref_key: "dropdownRef",
          ref: i,
          style: k({
            position: "absolute",
            top: (n.value?.top ?? 0) + "px",
            left: (n.value?.left ?? 0) + "px",
            width: e.matchTriggerWidth ? (n.value?.width ?? "auto") + "px" : "auto"
          })
        }, [
          B(a.$slots, "items")
        ], 4)) : X("", !0)
      ]))
    ], 64));
  }
}), be = [10, 12, 14, 16, 24];
function oe(e) {
  const { style: l, size: t } = e.shorthand ? ye(e.shorthand) : {
    style: we(e.isBold, e.isItalic),
    size: xe(e.fontSize ?? 12, be)
  }, n = {
    fontFamily: `${l}${t}, Arial, sans`,
    fontSize: `${t * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (n.textShadow = `2px 2px 0 ${e.fontShadowColor}`), n;
}
function we(e, l) {
  return e && l ? "BoldItalic" : e ? "Bold" : l ? "Italic" : "Regular";
}
function ye(e) {
  const l = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!l)
    throw new Error(`Invalid shorthand format: ${e}`);
  const t = l[1], n = parseInt(l[2], 10);
  return { style: t, size: n };
}
function xe(e, l) {
  if (l.length === 0)
    throw new Error("Array cannot be empty");
  return l.reduce((t, n) => {
    const s = Math.abs(n - e), i = Math.abs(t - e);
    return s < i ? n : t;
  });
}
const Xe = /* @__PURE__ */ M({
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
    const n = e, s = t, i = $(null), o = b(() => i.value?.el ?? null);
    F(() => {
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
      s("update:modelValue", r);
    }, u = (r) => {
      !n.multiline && r.key === "Enter" && r.preventDefault(), r.key === "Tab" && r.preventDefault();
    }, d = (r) => {
      r.preventDefault();
      let f = r.clipboardData?.getData("text/plain") ?? "";
      if (n.multiline || (f = f.replace(/\n/g, " ")), !o.value) return;
      const m = window.getSelection(), v = m?.getRangeAt(0);
      if (v) {
        v.deleteContents();
        const S = document.createTextNode(f);
        v.insertNode(S), v.collapse(!1), m?.removeAllRanges(), m?.addRange(v);
      }
      c();
    }, a = () => {
      o.value && o.value.innerText === "" && (o.value.innerHTML = "");
    }, h = b(() => ({
      ...n.extraStyles,
      ...oe({ fontColor: "black" }),
      overflow: "auto"
    }));
    return l({ el: o }), (r, f) => (g(), I(D, {
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
      onBlur: a
    }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"]));
  }
}), ne = /* @__PURE__ */ M({
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
      const s = oe(l);
      return l.element || (s.display = "contents"), s;
    });
    return (s, i) => (g(), I(he(t.value), {
      style: k(n.value)
    }, {
      default: x(() => [
        B(s.$slots, "default")
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
    const t = e, n = l, s = $(!1), i = $(!1), o = b(() => !t.disabled && s.value && i.value), c = b(() => t.disabled), u = (v) => {
      t.disabled || v.button !== 0 || (s.value = !0, i.value = !0);
    }, d = () => {
      t.disabled || (i.value = !0);
    }, a = () => {
      i.value = !1;
    }, h = (v) => {
      t.disabled || v.button !== 0 || (s.value && i.value && n("click"), s.value = !1);
    };
    F(() => {
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
    return (v, S) => (g(), I(D, {
      type: m.value,
      "extra-styles": r.value,
      "extra-class": e.extraClass,
      onMousedown: u,
      onMouseenter: d,
      onMouseleave: a
    }, {
      default: x(() => [
        p("div", {
          style: k(f.value)
        }, [
          T(ne, {
            "font-color": "black",
            "font-size": 12,
            "font-shadow-color": "#a5a5a5"
          }, {
            default: x(() => [
              B(v.$slots, "default")
            ]),
            _: 3
          })
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"]));
  }
}), ke = { style: { display: "flex", "align-items": "center" } }, Be = ["src", "alt"], Me = ["checked", "disabled", "value"], Ye = /* @__PURE__ */ M({
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
    const t = e, n = l, s = () => {
      t.disabled || n("update:modelValue", !t.modelValue);
    };
    return (i, o) => (g(), y("div", {
      class: Z(["checkbox-container", { disabled: e.disabled }]),
      style: k({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: e.disabled ? 0.5 : 1,
        cursor: e.disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        marginBottom: "2px"
      }),
      onClick: s
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
      e.label ? (g(), y("span", {
        key: 0,
        style: k({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, P(e.label), 5)) : X("", !0)
    ], 6));
  }
}), We = /* @__PURE__ */ M({
  __name: "HDivider",
  setup(e) {
    return (l, t) => (g(), I(D, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), Ne = /* @__PURE__ */ M({
  __name: "MenuDropdown",
  setup(e) {
    return (l, t) => (g(), I(ge, null, {
      trigger: x(() => [
        B(l.$slots, "trigger")
      ]),
      items: x(() => [
        T(D, { type: "panel-d-1" }, {
          default: x(() => [
            B(l.$slots, "items")
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), Se = { style: { display: "flex", "align-items": "center" } }, $e = ["src"], Ce = ["src"], ze = ["checked", "disabled", "value", "name"], Pe = /* @__PURE__ */ M({
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
    const t = e, n = l, s = b(() => t.modelValue === t.value), i = (o) => {
      o.preventDefault(), !t.disabled && (s.value || n("update:modelValue", t.value));
    };
    return (o, c) => (g(), y("div", {
      class: Z(["radio-container", { disabled: e.disabled }]),
      style: k({
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
      p("div", Se, [
        s.value ? (g(), y("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, $e)) : (g(), y("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, Ce))
      ]),
      p("input", {
        type: "radio",
        checked: s.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, ze),
      e.label ? (g(), y("span", {
        key: 0,
        style: k({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, P(e.label), 5)) : X("", !0)
    ], 6));
  }
});
function Te(e, l, t, n, s) {
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
  ], u = ee(n), d = ee(s), a = Math.floor(l / o), h = Math.floor(t / o);
  e.width = Math.floor(l * 2) / 2, e.height = Math.floor(t * 2) / 2;
  for (let r = 0; r < h; r++)
    for (let f = 0; f < a; f++) {
      const m = f * o, v = r * o, S = (f + r) / (a + h - 6), R = (c[r % 8][f % 8] + 0.5) / 64, C = S > R ? 1 : 0, V = Math.round(u.r * (1 - C) + d.r * C), L = Math.round(u.g * (1 - C) + d.g * C), U = Math.round(u.b * (1 - C) + d.b * C);
      i.fillStyle = `rgb(${V}, ${L}, ${U})`, i.fillRect(m, v, o, o);
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
    function s(o, c) {
      const u = l.gradientColorA || "5555ff", d = l.gradientColorB || "0000aa";
      Te(o, o.width, o.height, u, d), c.fillStyle = "#555555", c.fillRect(0, o.height - 2, Math.floor(o.width / 2) * 2, 4);
    }
    function i() {
      const o = t.value;
      if (!o) return;
      const c = o.getContext("2d");
      if (!c) return;
      const u = o.getBoundingClientRect(), d = Math.floor(u.width * 2) / 2, a = Math.floor(u.height * 2) / 2;
      (o.width !== d || o.height !== a) && (o.width = d, o.height = a), s(o, c);
    }
    return Q(() => [l.gradientColorA, l.gradientColorB], () => {
      if (t.value) {
        const o = t.value.getContext("2d");
        o && s(t.value, o);
      }
    }), F(() => {
      i(), t.value && (n = new ResizeObserver(() => {
        i();
      }), n.observe(t.value));
    }), O(() => {
      n?.disconnect();
    }), (o, c) => (g(), y("div", null, [
      p("div", Ie, [
        p("canvas", {
          ref_key: "canvasRef",
          ref: t,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      p("div", Re, [
        p("div", Ee, [
          p("img", { src: e.icon }, null, 8, De)
        ]),
        p("div", Ve, [
          T(ne, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: x(() => [
              J(P(e.title), 1)
            ]),
            _: 1
          })
        ]),
        B(o.$slots, "buttons"),
        e.placeholderButtons ? (g(), y(j, { key: 0 }, [
          T(K, {
            "extra-class": "titlebar-button",
            "base-type": "panel-d-2",
            disabled: ""
          }, {
            default: x(() => [...c[0] || (c[0] = [
              p("img", {
                draggable: "false",
                src: "/win-55-ui/window/o.png"
              }, null, -1)
            ])]),
            _: 1
          }),
          T(K, {
            "extra-class": "titlebar-button",
            "base-type": "panel-d-2",
            disabled: ""
          }, {
            default: x(() => [...c[1] || (c[1] = [
              p("img", {
                draggable: "false",
                src: "/win-55-ui/window/_.png"
              }, null, -1)
            ])]),
            _: 1
          }),
          c[3] || (c[3] = p("div", { style: { width: "2px" } }, null, -1)),
          T(K, {
            "extra-class": "titlebar-button",
            "base-type": "panel-d-2",
            disabled: ""
          }, {
            default: x(() => [...c[2] || (c[2] = [
              p("img", {
                draggable: "false",
                src: "/win-55-ui/window/x.png"
              }, null, -1)
            ])]),
            _: 1
          }),
          c[4] || (c[4] = p("div", { style: { width: "2px" } }, null, -1))
        ], 64)) : X("", !0)
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
    const l = e, t = $(!1), n = me({ x: 0, y: 0 });
    let s = null;
    const i = () => {
      s = window.setTimeout(() => {
        t.value = !0;
      }, 400);
    }, o = () => {
      s !== null && (clearTimeout(s), s = null), t.value = !1;
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
      s !== null && clearTimeout(s);
    }), (d, a) => (g(), y("span", {
      onMouseenter: i,
      onMouseleave: o,
      onMousemove: c,
      style: { position: "relative", display: "inline-block" }
    }, [
      B(d.$slots, "default"),
      t.value ? (g(), I(D, {
        key: 0,
        style: k(u.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: x(() => [
          J(P(l.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : X("", !0)
    ], 32));
  }
}), _ = 6, Oe = /* @__PURE__ */ M({
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
    const l = e, t = N(e, "x"), n = N(e, "y"), s = N(e, "width"), i = N(e, "height"), o = l.minWidth ?? 240, c = l.minHeight ?? 40, u = l.resizable ?? l.resizableHorizontally ?? !1, d = l.resizable ?? l.resizableVertically ?? !1;
    let a = !1, h = !1, r = "", f = "", m = 0, v = 0, S = 0, R = 0, C = 0, V = 0;
    const L = $("default");
    function U(w) {
      l.faux || r || (a = !0, m = w.clientX, v = w.clientY, C = t.value, V = n.value, window.addEventListener("mousemove", q), window.addEventListener("mouseup", G));
    }
    function ae(w) {
      l.faux || r && (!u && !d || (h = !0, f = r, m = w.clientX, v = w.clientY, S = s.value, R = i.value, C = t.value, V = n.value, window.addEventListener("mousemove", q), window.addEventListener("mouseup", G)));
    }
    function q(w) {
      if (l.faux) return;
      const Y = w.clientX - m, z = w.clientY - v;
      if (a && (t.value = C + Y, n.value = V + z), h) {
        const A = f;
        if (u && A.includes("e") && (s.value = Math.max(o, S + Y)), d && A.includes("s") && (i.value = Math.max(c, R + z)), u && A.includes("w")) {
          const W = S - Y, E = Math.max(o, W);
          s.value = E, t.value = C + (S - E);
        }
        if (d && A.includes("n")) {
          const W = R - z, E = Math.max(c, W);
          i.value = E, n.value = V + (R - E);
        }
      }
    }
    function G() {
      a = !1, h = !1, f = "", window.removeEventListener("mousemove", q), window.removeEventListener("mouseup", G);
    }
    function se(w) {
      if (l.faux) {
        r = "", L.value = "default";
        return;
      }
      if (h) return;
      if (!u && !d) {
        r = "", L.value = "default";
        return;
      }
      const z = w.currentTarget.getBoundingClientRect(), A = w.clientX - z.left, W = z.right - w.clientX, E = w.clientY - z.top, ie = z.bottom - w.clientY;
      let H = "";
      d && (E < _ ? H += "n" : ie < _ && (H += "s")), u && (A < _ ? H += "w" : W < _ && (H += "e")), r = H;
      const re = {
        n: "ns-resize",
        s: "ns-resize",
        e: "ew-resize",
        w: "ew-resize",
        ne: "nesw-resize",
        sw: "nesw-resize",
        nw: "nwse-resize",
        se: "nwse-resize"
      };
      L.value = re[H] ?? "default";
    }
    return (w, Y) => (g(), I(D, {
      "extra-styles": l.faux ? e.extraStyles : {
        position: "absolute",
        left: t.value + "px",
        top: n.value + "px",
        width: s.value + "px",
        height: i.value + "px",
        cursor: L.value,
        ...e.extraStyles
      },
      type: "panel-d-2",
      onMousemove: se,
      onMousedown: ae
    }, {
      default: x(() => [
        p("div", {
          onMousedown: le(U, ["stop"])
        }, [
          T(Le, {
            title: e.title,
            icon: e.icon,
            "placeholder-buttons": e.placeholderButtons,
            disabled: e.disabled,
            "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
            "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
          }, {
            buttons: x(() => [
              B(w.$slots, "titlebar-buttons")
            ]),
            _: 3
          }, 8, ["title", "icon", "placeholder-buttons", "disabled", "gradient-color-a", "gradient-color-b"])
        ], 32),
        B(w.$slots, "default")
      ]),
      _: 3
    }, 8, ["extra-styles"]));
  }
}), _e = (e, l = 30, t = 48, n = 30) => {
  const s = $(
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
      })), a = d.map((f) => t + f.sin * n), h = e * t, r = a.reduce((f, m) => f + m, 0);
      if (r > 0) {
        const f = h / r, m = d.map((v) => ({
          sin: ((t + v.sin * n) * f - t) / n,
          cos: v.cos
        }));
        s.value = m;
      } else
        s.value = d;
      o = u;
    }
    i = requestAnimationFrame(c);
  };
  return F(() => {
    i = requestAnimationFrame(c);
  }), O(() => {
    cancelAnimationFrame(i);
  }), { values: s };
};
function Ue(e) {
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
  He as Balloon,
  ge as BaseDropdown,
  Xe as BaseInput,
  D as Box,
  K as Button,
  Ye as Checkbox,
  We as HDivider,
  Ne as MenuDropdown,
  Pe as RadioButton,
  Le as Titlebar,
  Fe as Tooltip,
  ne as Typography,
  Oe as Window,
  Te as drawAngledBayerDitherGradient,
  Ue as registerGlobalImageErrorHandler,
  oe as typographyStyles,
  _e as useSineWave
};
