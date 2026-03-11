import { defineComponent as M, ref as S, computed as y, openBlock as m, createElementBlock as b, normalizeStyle as x, normalizeClass as Z, renderSlot as B, useModel as A, useSlots as ce, createElementVNode as v, createVNode as T, withCtx as k, unref as ue, Fragment as Q, createTextVNode as j, toDisplayString as W, createCommentVNode as N, mergeModels as ee, watch as te, nextTick as de, onMounted as O, onUnmounted as P, withModifiers as ne, createBlock as I, Teleport as fe, resolveDynamicComponent as he, reactive as pe } from "vue";
const E = /* @__PURE__ */ M({
  __name: "Box",
  props: {
    type: {},
    extraStyles: {},
    extraClass: {}
  },
  setup(e, { expose: o }) {
    const t = e, i = S(null), a = y(() => ({
      "--img": `url(/win-55-ui/${t.type}.png)`,
      ...t.extraStyles
    }));
    return o({ el: i }), (n, l) => (m(), b("div", {
      ref_key: "rootRef",
      ref: i,
      class: Z(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: x(a.value)
    }, [
      B(n.$slots, "default")
    ], 6));
  }
}), me = { class: "balloon-wrapper" }, ve = { class: "balloon-tip-box" }, Xe = /* @__PURE__ */ M({
  __name: "Balloon",
  props: /* @__PURE__ */ ee({
    text: {},
    side: {},
    bias: {}
  }, {
    shown: { type: Boolean, default: !1 },
    shownModifiers: {}
  }),
  emits: ["update:shown"],
  setup(e) {
    const o = A(e, "shown"), t = e, i = ce(), a = y(() => t.side ?? "top"), n = y(() => t.bias), l = y(() => {
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
    }), h = y(() => {
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
    }), d = y(() => {
      let s = "", f = !1;
      switch (a.value) {
        case "top":
          s = "rotate(0deg)", n.value === "right" && (f = !0);
          break;
        case "bottom":
          s = "rotate(180deg)", n.value === "left" && (f = !0);
          break;
        case "left":
          s = "rotate(-90deg)";
          break;
        case "right":
          s = "rotate(90deg)", f = !0;
          break;
      }
      return f ? `${s} scaleX(-1)` : s;
    }), c = y(() => {
      const s = {};
      return n.value ? ((a.value === "top" || a.value === "bottom") && (n.value === "left" && (s.transform = "translateX(calc(-50% + 28px))"), n.value === "right" && (s.transform = "translateX(calc(50% - 28px))")), (a.value === "left" || a.value === "right") && (n.value === "up" && (s.transform = "translateY(calc(-50% + 28px))"), n.value === "down" && (s.transform = "translateY(calc(50% - 28px))")), s) : {};
    });
    return (s, f) => (m(), b("div", me, [
      B(s.$slots, "default"),
      o.value ? (m(), b("div", {
        key: 0,
        class: "balloon",
        style: x(l.value)
      }, [
        v("div", {
          class: "balloon-inner",
          style: x({ flexDirection: h.value })
        }, [
          v("div", {
            class: "balloon-box-wrapper",
            style: x(c.value)
          }, [
            T(E, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: k(() => [
                ue(i).content ? B(s.$slots, "content", { key: 0 }) : (m(), b(Q, { key: 1 }, [
                  j(W(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          v("div", ve, [
            v("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: x({ transform: d.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : N("", !0)
    ]));
  }
}), ge = /* @__PURE__ */ M({
  __name: "BaseDropdown",
  props: {
    matchTriggerWidth: { type: Boolean, default: !1 }
  },
  setup(e) {
    const o = e, t = S(!1), i = S(null), a = S(null), n = S(null), l = () => {
      const s = a.value, f = n.value;
      if (!s || !f) return;
      const r = s.getBoundingClientRect(), u = window.innerHeight, p = f.offsetHeight;
      let g = r.bottom + window.scrollY;
      const $ = r.left + window.scrollX;
      r.bottom + p > u && (g = r.top + window.scrollY - p), i.value = {
        top: g,
        left: $,
        width: o.matchTriggerWidth ? r.width : void 0
      };
    };
    te(t, async (s) => {
      s && (await de(), l());
    });
    const h = () => {
      t.value && l();
    }, d = (s) => {
      if (!t.value) return;
      const f = s.target;
      a.value?.contains(f) || n.value?.contains(f) || (t.value = !1);
    };
    O(() => {
      window.addEventListener("resize", h), window.addEventListener("scroll", h), document.addEventListener("click", d);
    }), P(() => {
      window.removeEventListener("resize", h), window.removeEventListener("scroll", h), document.removeEventListener("click", d);
    });
    const c = () => {
      t.value = !t.value;
    };
    return (s, f) => (m(), b(Q, null, [
      v("div", {
        ref_key: "triggerRef",
        ref: a,
        style: { display: "inline-block" },
        onClick: ne(c, ["stop"])
      }, [
        B(s.$slots, "trigger")
      ], 512),
      (m(), I(fe, { to: "body" }, [
        t.value ? (m(), b("div", {
          key: 0,
          ref_key: "dropdownRef",
          ref: n,
          style: x({
            position: "absolute",
            top: (i.value?.top ?? 0) + "px",
            left: (i.value?.left ?? 0) + "px",
            width: e.matchTriggerWidth ? (i.value?.width ?? "auto") + "px" : "auto"
          })
        }, [
          B(s.$slots, "items")
        ], 4)) : N("", !0)
      ]))
    ], 64));
  }
}), we = [10, 12, 14, 16, 24];
function oe(e) {
  const { style: o, size: t } = e.shorthand ? be(e.shorthand) : {
    style: ye(e.isBold, e.isItalic),
    size: xe(e.fontSize ?? 12, we)
  }, i = {
    fontFamily: `${o}${t}, Arial, sans`,
    fontSize: `${t * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (i.textShadow = `2px 2px 0 ${e.fontShadowColor}`), i;
}
function ye(e, o) {
  return e && o ? "BoldItalic" : e ? "Bold" : o ? "Italic" : "Regular";
}
function be(e) {
  const o = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!o)
    throw new Error(`Invalid shorthand format: ${e}`);
  const t = o[1], i = parseInt(o[2], 10);
  return { style: t, size: i };
}
function xe(e, o) {
  if (o.length === 0)
    throw new Error("Array cannot be empty");
  return o.reduce((t, i) => {
    const a = Math.abs(i - e), n = Math.abs(t - e);
    return a < n ? i : t;
  });
}
const Ye = /* @__PURE__ */ M({
  __name: "BaseInput",
  props: {
    modelValue: {},
    placeholder: { default: "" },
    disabled: { type: Boolean, default: !1 },
    maxLength: { default: void 0 },
    boxType: { default: "textarea" },
    extraStyles: { default: void 0 }
  },
  emits: ["update:modelValue"],
  setup(e, { expose: o, emit: t }) {
    const i = e, a = t, n = S(null), l = y(() => n.value?.el ?? null);
    te(() => i.modelValue, (r) => {
      l.value && l.value.innerText !== r && (l.value.innerText = r);
    });
    const h = () => {
      if (!l.value) return;
      let r = l.value.innerText || "";
      if (i.maxLength && r.length > i.maxLength) {
        r = r.slice(0, i.maxLength), l.value.innerText = r;
        const u = document.createRange(), p = window.getSelection();
        u.selectNodeContents(l.value), u.collapse(!1), p?.removeAllRanges(), p?.addRange(u);
      }
      a("update:modelValue", r);
    }, d = (r) => {
      r.key === "Enter" && r.preventDefault(), r.key === "Tab" && r.preventDefault();
    }, c = (r) => {
      r.preventDefault();
      const u = r.clipboardData?.getData("text/plain") ?? "";
      if (!l.value) return;
      const p = window.getSelection(), g = p?.getRangeAt(0);
      if (g) {
        g.deleteContents();
        const $ = document.createTextNode(u);
        g.insertNode($), g.collapse(!1), p?.removeAllRanges(), p?.addRange(g);
      }
      h();
    }, s = () => {
      l.value && l.value.innerText === "" && (l.value.innerHTML = "");
    }, f = y(() => ({
      ...i.extraStyles,
      ...oe({ fontColor: "black" })
    }));
    return o({ el: l }), (r, u) => (m(), I(E, {
      ref_key: "boxRef",
      ref: n,
      type: e.boxType,
      contenteditable: !e.disabled,
      "extra-styles": f.value,
      "data-placeholder": e.placeholder,
      role: "textbox",
      "aria-multiline": "false",
      "aria-disabled": e.disabled,
      onInput: h,
      onKeydown: d,
      onPaste: c,
      onBlur: s
    }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-disabled"]));
  }
}), le = /* @__PURE__ */ M({
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
    const o = e, t = y(() => o.element ?? "span"), i = y(() => {
      const a = oe(o);
      return o.element || (a.display = "contents"), a;
    });
    return (a, n) => (m(), I(he(t.value), {
      style: x(i.value)
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
    extraClass: { default: void 0 }
  },
  emits: ["click"],
  setup(e, { emit: o }) {
    const t = e, i = o, a = S(!1), n = S(!1), l = y(() => a.value && n.value), h = (u) => {
      u.button === 0 && (a.value = !0, n.value = !0);
    }, d = () => {
      n.value = !0;
    }, c = () => {
      n.value = !1;
    }, s = (u) => {
      u.button === 0 && (a.value && n.value && i("click"), a.value = !1);
    };
    O(() => {
      window.addEventListener("mouseup", s);
    }), P(() => {
      window.removeEventListener("mouseup", s);
    });
    const f = y(() => ({
      userSelect: "none",
      width: "fit-content",
      paddingBottom: "4px",
      paddingRight: "4px",
      cursor: "default",
      ...t.extraStyles
    })), r = y(() => ({
      transform: l.value ? "translate(2px, 2px)" : "translate(0, 0)"
    }));
    return (u, p) => (m(), I(E, {
      type: l.value ? "indent" : e.baseType,
      "extra-styles": f.value,
      "extra-class": e.extraClass,
      onMousedown: h,
      onMouseenter: d,
      onMouseleave: c
    }, {
      default: k(() => [
        v("div", {
          style: x(r.value)
        }, [
          T(le, {
            "font-color": "black",
            "font-size": 12,
            "font-shadow-color": "#a5a5a5"
          }, {
            default: k(() => [
              B(u.$slots, "default")
            ]),
            _: 3
          })
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"]));
  }
}), ke = { style: { display: "flex", "align-items": "center" } }, Me = ["src"], Se = ["src"], $e = ["checked", "disabled", "value"], Ae = /* @__PURE__ */ M({
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
  setup(e, { emit: o }) {
    const t = e, i = o, a = () => {
      t.disabled || i("update:modelValue", !t.modelValue);
    };
    return (n, l) => (m(), b("div", {
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
      v("div", ke, [
        e.modelValue ? (m(), b("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, Me)) : (m(), b("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, Se))
      ]),
      v("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, $e),
      e.label ? (m(), b("span", {
        key: 0,
        style: x({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, W(e.label), 5)) : N("", !0)
    ], 6));
  }
}), We = /* @__PURE__ */ M({
  __name: "HDivider",
  setup(e) {
    return (o, t) => (m(), I(E, {
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
    return (o, t) => (m(), I(ge, null, {
      trigger: k(() => [
        B(o.$slots, "trigger")
      ]),
      items: k(() => [
        T(E, { type: "panel-d-1" }, {
          default: k(() => [
            B(o.$slots, "items")
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), ze = { style: { display: "flex", "align-items": "center" } }, Be = ["src"], Ce = ["src"], Te = ["checked", "disabled", "value", "name"], Pe = /* @__PURE__ */ M({
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
  setup(e, { emit: o }) {
    const t = e, i = o, a = y(() => t.modelValue === t.value), n = (l) => {
      l.preventDefault(), !t.disabled && (a.value || i("update:modelValue", t.value));
    };
    return (l, h) => (m(), b("div", {
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
      onClick: n
    }, [
      v("div", ze, [
        a.value ? (m(), b("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, Be)) : (m(), b("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, Ce))
      ]),
      v("input", {
        type: "radio",
        checked: a.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, Te),
      e.label ? (m(), b("span", {
        key: 0,
        style: x({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, W(e.label), 5)) : N("", !0)
    ], 6));
  }
});
function Ie(e, o, t, i, a) {
  const n = e.getContext("2d");
  if (!n) return;
  n.clearRect(0, 0, e.width, e.height);
  const l = 2, h = [
    [0, 48, 12, 60, 3, 51, 15, 63],
    [32, 16, 44, 28, 35, 19, 47, 31],
    [8, 56, 4, 52, 11, 59, 7, 55],
    [40, 24, 36, 20, 43, 27, 39, 23],
    [2, 50, 14, 62, 1, 49, 13, 61],
    [34, 18, 46, 30, 33, 17, 45, 29],
    [10, 58, 6, 54, 9, 57, 5, 53],
    [42, 26, 38, 22, 41, 25, 37, 21]
  ], d = J(i), c = J(a), s = Math.floor(o / l), f = Math.floor(t / l);
  e.width = Math.floor(o * 2) / 2, e.height = Math.floor(t * 2) / 2;
  for (let r = 0; r < f; r++)
    for (let u = 0; u < s; u++) {
      const p = u * l, g = r * l, $ = (u + r) / (s + f - 6), R = (h[r % 8][u % 8] + 0.5) / 64, z = $ > R ? 1 : 0, D = Math.round(d.r * (1 - z) + c.r * z), H = Math.round(d.g * (1 - z) + c.g * z), U = Math.round(d.b * (1 - z) + c.b * z);
      n.fillStyle = `rgb(${D}, ${H}, ${U})`, n.fillRect(p, g, l, l);
    }
}
function J(e) {
  const o = e.replace("#", ""), t = parseInt(o, 16);
  return {
    r: t >> 16 & 255,
    g: t >> 8 & 255,
    b: t & 255
  };
}
const Re = { style: { height: "0", overflow: "visible" } }, _e = { class: "titlebar-content" }, Ee = { class: "titlebar-image" }, De = ["src"], Le = { class: "titlebar-text" }, Ve = /* @__PURE__ */ M({
  __name: "Titlebar",
  props: {
    title: {},
    icon: {}
  },
  setup(e) {
    const o = S(null);
    let t = null;
    function i(n, l) {
      Ie(n, n.width, n.height, "5555ff", "0000aa"), l.fillStyle = "#555555", l.fillRect(0, n.height - 2, Math.floor(n.width / 2) * 2, 4);
    }
    function a() {
      const n = o.value;
      if (!n) return;
      const l = n.getContext("2d");
      if (!l) return;
      const h = n.getBoundingClientRect(), d = Math.floor(h.width * 2) / 2, c = Math.floor(h.height * 2) / 2;
      (n.width !== d || n.height !== c) && (n.width = d, n.height = c), i(n, l);
    }
    return O(() => {
      a(), o.value && (t = new ResizeObserver(() => {
        a();
      }), t.observe(o.value));
    }), P(() => {
      t?.disconnect();
    }), (n, l) => (m(), b("div", null, [
      v("div", Re, [
        v("canvas", {
          ref_key: "canvasRef",
          ref: o,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      v("div", _e, [
        v("div", Ee, [
          v("img", { src: e.icon }, null, 8, De)
        ]),
        v("div", Le, [
          T(le, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: k(() => [
              j(W(e.title), 1)
            ]),
            _: 1
          })
        ]),
        T(K, {
          "extra-class": "titlebar-button",
          "base-type": "panel-d-2"
        }, {
          default: k(() => [...l[0] || (l[0] = [
            v("img", {
              draggable: "false",
              src: "/win-55-ui/window/o.png"
            }, null, -1)
          ])]),
          _: 1
        }),
        T(K, {
          "extra-class": "titlebar-button",
          "base-type": "panel-d-2"
        }, {
          default: k(() => [...l[1] || (l[1] = [
            v("img", {
              draggable: "false",
              src: "/win-55-ui/window/_.png"
            }, null, -1)
          ])]),
          _: 1
        }),
        l[3] || (l[3] = v("div", { style: { width: "2px" } }, null, -1)),
        T(K, {
          "extra-class": "titlebar-button",
          "base-type": "panel-d-2"
        }, {
          default: k(() => [...l[2] || (l[2] = [
            v("img", {
              draggable: "false",
              src: "/win-55-ui/window/x.png"
            }, null, -1)
          ])]),
          _: 1
        }),
        l[4] || (l[4] = v("div", { style: { width: "2px" } }, null, -1))
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
    const o = e, t = S(!1), i = pe({ x: 0, y: 0 });
    let a = null;
    const n = () => {
      a = window.setTimeout(() => {
        t.value = !0;
      }, 400);
    }, l = () => {
      a !== null && (clearTimeout(a), a = null), t.value = !1;
    }, h = (c) => {
      i.x = c.clientX + (o.offsetX ?? 24), i.y = c.clientY + (o.offsetY ?? 24);
    }, d = y(() => ({
      position: "fixed",
      left: `${i.x}px`,
      top: `${i.y}px`,
      pointerEvents: "none",
      // now TS understands it's valid
      whiteSpace: "nowrap",
      zIndex: 1e3
    }));
    return P(() => {
      a !== null && clearTimeout(a);
    }), (c, s) => (m(), b("span", {
      onMouseenter: n,
      onMouseleave: l,
      onMousemove: h,
      style: { position: "relative", display: "inline-block" }
    }, [
      B(c.$slots, "default"),
      t.value ? (m(), I(E, {
        key: 0,
        style: x(d.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: k(() => [
          j(W(o.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : N("", !0)
    ], 32));
  }
}), F = 6, Oe = /* @__PURE__ */ M({
  __name: "Window",
  props: /* @__PURE__ */ ee({
    extraStyles: {},
    extraClass: {},
    minWidth: {},
    minHeight: {},
    resizable: { type: Boolean },
    resizableHorizontally: { type: Boolean },
    resizableVertically: { type: Boolean }
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
    const o = e, t = A(e, "x"), i = A(e, "y"), a = A(e, "width"), n = A(e, "height"), l = o.minWidth ?? 240, h = o.minHeight ?? 40, d = o.resizable ?? o.resizableHorizontally ?? !1, c = o.resizable ?? o.resizableVertically ?? !1;
    let s = !1, f = !1, r = "", u = "", p = 0, g = 0, $ = 0, R = 0, z = 0, D = 0;
    const H = S("default");
    function U(w) {
      r || (s = !0, p = w.clientX, g = w.clientY, z = t.value, D = i.value, window.addEventListener("mousemove", q), window.addEventListener("mouseup", G));
    }
    function ae(w) {
      r && (!d && !c || (f = !0, u = r, p = w.clientX, g = w.clientY, $ = a.value, R = n.value, z = t.value, D = i.value, window.addEventListener("mousemove", q), window.addEventListener("mouseup", G)));
    }
    function q(w) {
      const X = w.clientX - p, C = w.clientY - g;
      if (s && (t.value = z + X, i.value = D + C), f) {
        const L = u;
        if (d && L.includes("e") && (a.value = Math.max(l, $ + X)), c && L.includes("s") && (n.value = Math.max(h, R + C)), d && L.includes("w")) {
          const Y = $ - X, _ = Math.max(l, Y);
          a.value = _, t.value = z + ($ - _);
        }
        if (c && L.includes("n")) {
          const Y = R - C, _ = Math.max(h, Y);
          n.value = _, i.value = D + (R - _);
        }
      }
    }
    function G() {
      s = !1, f = !1, u = "", window.removeEventListener("mousemove", q), window.removeEventListener("mouseup", G);
    }
    function se(w) {
      if (f) return;
      if (!d && !c) {
        r = "", H.value = "default";
        return;
      }
      const C = w.currentTarget.getBoundingClientRect(), L = w.clientX - C.left, Y = C.right - w.clientX, _ = w.clientY - C.top, ie = C.bottom - w.clientY;
      let V = "";
      c && (_ < F ? V += "n" : ie < F && (V += "s")), d && (L < F ? V += "w" : Y < F && (V += "e")), r = V;
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
      H.value = re[V] ?? "default";
    }
    return (w, X) => (m(), I(E, {
      "extra-styles": {
        position: "absolute",
        left: t.value + "px",
        top: i.value + "px",
        width: a.value + "px",
        height: n.value + "px",
        cursor: H.value,
        ...e.extraStyles
      },
      type: "panel-d-2",
      onMousemove: se,
      onMousedown: ae
    }, {
      default: k(() => [
        v("div", {
          onMousedown: ne(U, ["stop"])
        }, [
          T(Ve, {
            title: "Sample",
            icon: "/win-55-ui/icons/program.png"
          })
        ], 32),
        B(w.$slots, "default")
      ]),
      _: 3
    }, 8, ["extra-styles"]));
  }
}), Ue = (e, o = 30, t = 48, i = 30) => {
  const a = S(
    Array.from({ length: e }, (d, c) => ({
      sin: Math.sin(0 + c * Math.PI * 2 / e),
      cos: Math.cos(0 + c * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let n, l = 0;
  const h = () => {
    const d = Date.now();
    if (d - l >= 1e3 / o) {
      const c = Array.from({ length: e }, (u, p) => ({
        sin: Math.sin(d / (1e3 + p * 200) + p * Math.PI * 2 / e),
        cos: Math.cos(d / (3e3 + p * 400) + p * Math.PI * 2 / e + Math.PI / 4)
      })), s = c.map((u) => t + u.sin * i), f = e * t, r = s.reduce((u, p) => u + p, 0);
      if (r > 0) {
        const u = f / r, p = c.map((g) => ({
          sin: ((t + g.sin * i) * u - t) / i,
          cos: g.cos
        }));
        a.value = p;
      } else
        a.value = c;
      l = d;
    }
    n = requestAnimationFrame(h);
  };
  return O(() => {
    n = requestAnimationFrame(h);
  }), P(() => {
    cancelAnimationFrame(n);
  }), { values: a };
};
function qe(e) {
  document.addEventListener(
    "error",
    (o) => {
      const t = o.target;
      t instanceof HTMLImageElement && e(t, o);
    },
    !0
    // IMPORTANT: use capture phase since error doesn't bubble
  );
}
export {
  Xe as Balloon,
  ge as BaseDropdown,
  Ye as BaseInput,
  E as Box,
  K as Button,
  Ae as Checkbox,
  We as HDivider,
  Ne as MenuDropdown,
  Pe as RadioButton,
  Ve as Titlebar,
  Fe as Tooltip,
  le as Typography,
  Oe as Window,
  Ie as drawAngledBayerDitherGradient,
  qe as registerGlobalImageErrorHandler,
  oe as typographyStyles,
  Ue as useSineWave
};
