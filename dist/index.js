import { defineComponent as z, ref as $, computed as w, openBlock as p, createElementBlock as y, normalizeStyle as x, normalizeClass as j, renderSlot as B, useModel as N, useSlots as de, createElementVNode as m, createVNode as L, withCtx as k, unref as ue, Fragment as J, createTextVNode as Q, toDisplayString as W, createCommentVNode as _, mergeModels as le, watch as q, nextTick as fe, onMounted as P, onUnmounted as O, withModifiers as oe, createBlock as I, Teleport as he, resolveDynamicComponent as ve, reactive as me } from "vue";
const E = /* @__PURE__ */ z({
  __name: "Box",
  props: {
    type: {},
    extraStyles: {},
    extraClass: {}
  },
  setup(e, { expose: t }) {
    const l = e, n = $(null), a = w(() => ({
      "--img": `url(/win-55-ui/${l.type}.png)`,
      ...l.extraStyles
    }));
    return t({ el: n }), (i, o) => (p(), y("div", {
      ref_key: "rootRef",
      ref: n,
      class: j(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: x(a.value)
    }, [
      B(i.$slots, "default")
    ], 6));
  }
}), pe = { class: "balloon-wrapper" }, be = { class: "balloon-tip-box" }, Ne = /* @__PURE__ */ z({
  __name: "Balloon",
  props: /* @__PURE__ */ le({
    text: {},
    side: {},
    bias: {}
  }, {
    shown: { type: Boolean, default: !1 },
    shownModifiers: {}
  }),
  emits: ["update:shown"],
  setup(e) {
    const t = N(e, "shown"), l = e, n = de(), a = w(() => l.side ?? "top"), i = w(() => l.bias), o = w(() => {
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
    }), c = w(() => {
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
    }), u = w(() => {
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
    }), d = w(() => {
      const s = {};
      return i.value ? ((a.value === "top" || a.value === "bottom") && (i.value === "left" && (s.transform = "translateX(calc(-50% + 28px))"), i.value === "right" && (s.transform = "translateX(calc(50% - 28px))")), (a.value === "left" || a.value === "right") && (i.value === "up" && (s.transform = "translateY(calc(-50% + 28px))"), i.value === "down" && (s.transform = "translateY(calc(50% - 28px))")), s) : {};
    });
    return (s, h) => (p(), y("div", pe, [
      B(s.$slots, "default"),
      t.value ? (p(), y("div", {
        key: 0,
        class: "balloon",
        style: x(o.value)
      }, [
        m("div", {
          class: "balloon-inner",
          style: x({ flexDirection: c.value })
        }, [
          m("div", {
            class: "balloon-box-wrapper",
            style: x(d.value)
          }, [
            L(E, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: k(() => [
                ue(n).content ? B(s.$slots, "content", { key: 0 }) : (p(), y(J, { key: 1 }, [
                  Q(W(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          m("div", be, [
            m("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: x({ transform: u.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : _("", !0)
    ]));
  }
}), ge = /* @__PURE__ */ z({
  __name: "BaseDropdown",
  props: {
    matchTriggerWidth: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, l = $(!1), n = $(null), a = $(null), i = $(null), o = () => {
      const s = a.value, h = i.value;
      if (!s || !h) return;
      const r = s.getBoundingClientRect(), f = window.innerHeight, v = h.offsetHeight;
      let b = r.bottom + window.scrollY;
      const M = r.left + window.scrollX;
      r.bottom + v > f && (b = r.top + window.scrollY - v), n.value = {
        top: b,
        left: M,
        width: t.matchTriggerWidth ? r.width : void 0
      };
    };
    q(l, async (s) => {
      s && (await fe(), o());
    });
    const c = () => {
      l.value && o();
    }, u = (s) => {
      if (!l.value) return;
      const h = s.target;
      a.value?.contains(h) || i.value?.contains(h) || (l.value = !1);
    };
    P(() => {
      window.addEventListener("resize", c), window.addEventListener("scroll", c), document.addEventListener("click", u);
    }), O(() => {
      window.removeEventListener("resize", c), window.removeEventListener("scroll", c), document.removeEventListener("click", u);
    });
    const d = () => {
      l.value = !l.value;
    };
    return (s, h) => (p(), y(J, null, [
      m("div", {
        ref_key: "triggerRef",
        ref: a,
        style: { display: "inline-block" },
        onClick: oe(d, ["stop"])
      }, [
        B(s.$slots, "trigger")
      ], 512),
      (p(), I(he, { to: "body" }, [
        l.value ? (p(), y("div", {
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
        ], 4)) : _("", !0)
      ]))
    ], 64));
  }
}), we = [10, 12, 14, 16, 24];
function ne(e) {
  const { style: t, size: l } = e.shorthand ? xe(e.shorthand) : {
    style: ye(e.isBold, e.isItalic),
    size: ke(e.fontSize ?? 12, we)
  }, n = {
    fontFamily: `${t}${l}, Arial, sans`,
    fontSize: `${l * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (n.textShadow = `2px 2px 0 ${e.fontShadowColor}`), n;
}
function ye(e, t) {
  return e && t ? "BoldItalic" : e ? "Bold" : t ? "Italic" : "Regular";
}
function xe(e) {
  const t = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!t)
    throw new Error(`Invalid shorthand format: ${e}`);
  const l = t[1], n = parseInt(t[2], 10);
  return { style: l, size: n };
}
function ke(e, t) {
  if (t.length === 0)
    throw new Error("Array cannot be empty");
  return t.reduce((l, n) => {
    const a = Math.abs(n - e), i = Math.abs(l - e);
    return a < i ? n : l;
  });
}
const Pe = /* @__PURE__ */ z({
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
  setup(e, { expose: t, emit: l }) {
    const n = e, a = l, i = $(null), o = w(() => i.value?.el ?? null);
    P(() => {
      o.value && n.modelValue && (o.value.innerText = n.modelValue);
    }), q(() => n.modelValue, (r) => {
      o.value && o.value.innerText !== r && (o.value.innerText = r ?? "");
    });
    const c = () => {
      if (!o.value) return;
      let r = o.value.innerText || "";
      if (n.multiline || (r = r.replace(/\n/g, "")), n.maxLength && r.length > n.maxLength) {
        r = r.slice(0, n.maxLength), o.value.innerText = r;
        const f = document.createRange(), v = window.getSelection();
        f.selectNodeContents(o.value), f.collapse(!1), v?.removeAllRanges(), v?.addRange(f);
      }
      a("update:modelValue", r);
    }, u = (r) => {
      !n.multiline && r.key === "Enter" && r.preventDefault(), r.key === "Tab" && r.preventDefault();
    }, d = (r) => {
      r.preventDefault();
      let f = r.clipboardData?.getData("text/plain") ?? "";
      if (n.multiline || (f = f.replace(/\n/g, " ")), !o.value) return;
      const v = window.getSelection(), b = v?.getRangeAt(0);
      if (b) {
        b.deleteContents();
        const M = document.createTextNode(f);
        b.insertNode(M), b.collapse(!1), v?.removeAllRanges(), v?.addRange(b);
      }
      c();
    }, s = () => {
      o.value && o.value.innerText === "" && (o.value.innerHTML = "");
    }, h = w(() => ({
      ...n.extraStyles,
      ...ne({ fontColor: "black" }),
      overflow: "auto"
    }));
    return t({ el: o }), (r, f) => (p(), I(E, {
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
}), Be = /* @__PURE__ */ z({
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
    const t = e, l = w(() => t.element ?? "span"), n = w(() => {
      const a = ne(t);
      return t.element || (a.display = "contents"), a;
    });
    return (a, i) => (p(), I(ve(l.value), {
      style: x(n.value)
    }, {
      default: k(() => [
        B(a.$slots, "default")
      ]),
      _: 3
    }, 8, ["style"]));
  }
}), Z = /* @__PURE__ */ z({
  __name: "Button",
  props: {
    baseType: { default: "panel-d-1" },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: t }) {
    const l = e, n = t, a = $(!1), i = $(!1), o = w(() => !l.disabled && a.value && i.value), c = w(() => l.disabled), u = (b) => {
      l.disabled || b.button !== 0 || (a.value = !0, i.value = !0);
    }, d = () => {
      l.disabled || (i.value = !0);
    }, s = () => {
      i.value = !1;
    }, h = (b) => {
      l.disabled || b.button !== 0 || (a.value && i.value && n("click"), a.value = !1);
    };
    P(() => {
      window.addEventListener("mouseup", h);
    }), O(() => {
      window.removeEventListener("mouseup", h);
    });
    const r = w(() => ({
      userSelect: "none",
      width: "fit-content",
      paddingBottom: "4px",
      paddingRight: "4px",
      cursor: c.value ? "not-allowed" : "default",
      ...l.extraStyles
    })), f = w(() => ({
      transform: o.value ? "translate(2px, 2px)" : "translate(0, 0)",
      opacity: c.value ? 0.5 : 1
    })), v = w(() => o.value ? "indent" : l.baseType);
    return (b, M) => (p(), I(E, {
      type: v.value,
      "extra-styles": r.value,
      "extra-class": e.extraClass,
      onMousedown: u,
      onMouseenter: d,
      onMouseleave: s
    }, {
      default: k(() => [
        m("div", {
          style: x(f.value)
        }, [
          B(b.$slots, "default")
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"]));
  }
}), ze = { style: { display: "flex", "align-items": "center" } }, Me = ["src", "alt"], Ce = ["checked", "disabled", "value"], Oe = /* @__PURE__ */ z({
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
    const l = e, n = t, a = () => {
      l.disabled || n("update:modelValue", !l.modelValue);
    };
    return (i, o) => (p(), y("div", {
      class: j(["checkbox-container", { disabled: e.disabled }]),
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
      m("div", ze, [
        m("img", {
          draggable: "false",
          src: e.modelValue ? e.checkedIcon : e.uncheckedIcon,
          alt: e.modelValue ? "checked" : "unchecked"
        }, null, 8, Me)
      ]),
      m("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, Ce),
      e.label ? (p(), y("span", {
        key: 0,
        style: x({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, W(e.label), 5)) : _("", !0)
    ], 6));
  }
}), Fe = /* @__PURE__ */ z({
  __name: "HDivider",
  setup(e) {
    return (t, l) => (p(), I(E, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), qe = /* @__PURE__ */ z({
  __name: "MenuDropdown",
  setup(e) {
    return (t, l) => (p(), I(ge, null, {
      trigger: k(() => [
        B(t.$slots, "trigger")
      ]),
      items: k(() => [
        L(E, { type: "panel-d-1" }, {
          default: k(() => [
            B(t.$slots, "items")
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), $e = { style: { display: "flex", "align-items": "center" } }, Se = ["src"], Te = ["src"], Ie = ["checked", "disabled", "value", "name"], Ue = /* @__PURE__ */ z({
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
    const l = e, n = t, a = w(() => l.modelValue === l.value), i = (o) => {
      o.preventDefault(), !l.disabled && (a.value || n("update:modelValue", l.value));
    };
    return (o, c) => (p(), y("div", {
      class: j(["radio-container", { disabled: e.disabled }]),
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
      m("div", $e, [
        a.value ? (p(), y("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, Se)) : (p(), y("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, Te))
      ]),
      m("input", {
        type: "radio",
        checked: a.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, Ie),
      e.label ? (p(), y("span", {
        key: 0,
        style: x({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, W(e.label), 5)) : _("", !0)
    ], 6));
  }
});
function Re(e, t, l, n, a) {
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
  ], u = te(n), d = te(a), s = Math.floor(t / o), h = Math.floor(l / o);
  e.width = Math.floor(t * 2) / 2, e.height = Math.floor(l * 2) / 2;
  for (let r = 0; r < h; r++)
    for (let f = 0; f < s; f++) {
      const v = f * o, b = r * o, M = (f + r) / (s + h - 6), V = (c[r % 8][f % 8] + 0.5) / 64, S = M > V ? 1 : 0, A = Math.round(u.r * (1 - S) + d.r * S), X = Math.round(u.g * (1 - S) + d.g * S), U = Math.round(u.b * (1 - S) + d.b * S);
      i.fillStyle = `rgb(${A}, ${X}, ${U})`, i.fillRect(v, b, o, o);
    }
}
function te(e) {
  const t = e.replace("#", ""), l = parseInt(t, 16);
  return {
    r: l >> 16 & 255,
    g: l >> 8 & 255,
    b: l & 255
  };
}
const Ee = { style: { height: "0", overflow: "visible" } }, Ve = { class: "titlebar-content" }, De = { class: "titlebar-image" }, He = ["src"], Le = { class: "titlebar-text" }, Ae = /* @__PURE__ */ z({
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
    const t = e, l = $(null);
    let n = null;
    function a(o, c) {
      const u = t.gradientColorA || "5555ff", d = t.gradientColorB || "0000aa";
      Re(o, o.width, o.height, u, d), c.fillStyle = "#555555", c.fillRect(0, o.height - 2, Math.floor(o.width / 2) * 2, 4);
    }
    function i() {
      const o = l.value;
      if (!o) return;
      const c = o.getContext("2d");
      if (!c) return;
      const u = o.getBoundingClientRect(), d = Math.floor(u.width * 2) / 2, s = Math.floor(u.height * 2) / 2;
      (o.width !== d || o.height !== s) && (o.width = d, o.height = s), a(o, c);
    }
    return q(() => [t.gradientColorA, t.gradientColorB], () => {
      if (l.value) {
        const o = l.value.getContext("2d");
        o && a(l.value, o);
      }
    }), P(() => {
      i(), l.value && (n = new ResizeObserver(() => {
        i();
      }), n.observe(l.value));
    }), O(() => {
      n?.disconnect();
    }), (o, c) => (p(), y("div", null, [
      m("div", Ee, [
        m("canvas", {
          ref_key: "canvasRef",
          ref: l,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      m("div", Ve, [
        m("div", De, [
          m("img", {
            src: e.icon ?? "/win-55-ui/icons/program.png"
          }, null, 8, He)
        ]),
        m("div", Le, [
          L(Be, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: k(() => [
              Q(W(e.title), 1)
            ]),
            _: 1
          })
        ]),
        B(o.$slots, "buttons"),
        e.placeholderButtons ? (p(), y(J, { key: 0 }, [
          L(Z, {
            "extra-class": "titlebar-button",
            "base-type": "panel-d-2",
            disabled: ""
          }, {
            default: k(() => [...c[0] || (c[0] = [
              m("img", {
                draggable: "false",
                src: "/win-55-ui/window/o.png"
              }, null, -1)
            ])]),
            _: 1
          }),
          L(Z, {
            "extra-class": "titlebar-button",
            "base-type": "panel-d-2",
            disabled: ""
          }, {
            default: k(() => [...c[1] || (c[1] = [
              m("img", {
                draggable: "false",
                src: "/win-55-ui/window/_.png"
              }, null, -1)
            ])]),
            _: 1
          }),
          c[3] || (c[3] = m("div", { style: { width: "2px" } }, null, -1)),
          L(Z, {
            "extra-class": "titlebar-button",
            "base-type": "panel-d-2",
            disabled: ""
          }, {
            default: k(() => [...c[2] || (c[2] = [
              m("img", {
                draggable: "false",
                src: "/win-55-ui/window/x.png"
              }, null, -1)
            ])]),
            _: 1
          }),
          c[4] || (c[4] = m("div", { style: { width: "2px" } }, null, -1))
        ], 64)) : _("", !0)
      ])
    ]));
  }
}), Ge = /* @__PURE__ */ z({
  __name: "Tooltip",
  props: {
    text: {},
    offsetX: {},
    offsetY: {}
  },
  setup(e) {
    const t = e, l = $(!1), n = me({ x: 0, y: 0 });
    let a = null;
    const i = () => {
      a = window.setTimeout(() => {
        l.value = !0;
      }, 400);
    }, o = () => {
      a !== null && (clearTimeout(a), a = null), l.value = !1;
    }, c = (d) => {
      n.x = d.clientX + (t.offsetX ?? 24), n.y = d.clientY + (t.offsetY ?? 24);
    }, u = w(() => ({
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
    }), (d, s) => (p(), y("span", {
      onMouseenter: i,
      onMouseleave: o,
      onMousemove: c,
      style: { position: "relative", display: "inline-block" }
    }, [
      B(d.$slots, "default"),
      l.value ? (p(), I(E, {
        key: 0,
        style: x(u.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: k(() => [
          Q(W(t.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : _("", !0)
    ], 32));
  }
}), Xe = {
  class: "titlebar-wrapper",
  style: { height: "34px" }
}, F = 6, Ke = /* @__PURE__ */ z({
  __name: "Window",
  props: /* @__PURE__ */ le({
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
    const t = e, l = N(e, "x"), n = N(e, "y"), a = N(e, "width"), i = N(e, "height"), o = t.minWidth ?? 240, c = t.minHeight ?? 40, u = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableHorizontally ?? !1), d = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableVertically ?? !1);
    let s = !1, h = !1, r = "", f = "", v = 0, b = 0, M = 0, V = 0, S = 0, A = 0;
    const X = $("default");
    function U(g) {
      t.faux || r || (s = !0, v = g.clientX, b = g.clientY, S = l.value, A = n.value, window.addEventListener("mousemove", G), window.addEventListener("mouseup", K));
    }
    function ae(g) {
      t.faux || r && (!u && !d || (h = !0, f = r, v = g.clientX, b = g.clientY, M = a.value, V = i.value, S = l.value, A = n.value, window.addEventListener("mousemove", G), window.addEventListener("mouseup", K)));
    }
    function G(g) {
      if (t.faux) return;
      const C = g.clientX - v, R = g.clientY - b;
      if (s && (l.value = S + C, n.value = A + R), h) {
        const D = f;
        if (u && D.includes("e") && (a.value = Math.max(o, M + C)), d && D.includes("s") && (i.value = Math.max(c, V + R)), u && D.includes("w")) {
          const T = M - C, H = Math.max(o, T);
          a.value = H, l.value = S + (M - H);
        }
        if (d && D.includes("n")) {
          const T = V - R, H = Math.max(c, T);
          i.value = H, n.value = A + (V - H);
        }
      }
    }
    function K() {
      s = !1, h = !1, f = "", window.removeEventListener("mousemove", G), window.removeEventListener("mouseup", K);
    }
    function ee(g) {
      if (t.faux) {
        r = "", X.value = "default";
        return;
      }
      if (h) return;
      const C = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableHorizontally ?? !1), R = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableVertically ?? !1);
      if (!C && !R) {
        r = "", X.value = "default";
        return;
      }
      const T = g.currentTarget.getBoundingClientRect(), H = g.clientX - T.left, se = T.right - g.clientX, ie = g.clientY - T.top, re = T.bottom - g.clientY;
      let Y = "";
      R && (ie < F ? Y += "n" : re < F && (Y += "s")), C && (H < F ? Y += "w" : se < F && (Y += "e")), r = Y;
      const ce = {
        n: "ns-resize",
        s: "ns-resize",
        e: "ew-resize",
        w: "ew-resize",
        ne: "nesw-resize",
        sw: "nesw-resize",
        nw: "nwse-resize",
        se: "nwse-resize"
      };
      X.value = ce[Y] ?? "default";
    }
    return q(() => [t.resizable, t.resizableHorizontally, t.resizableVertically], () => {
      const g = document.querySelector(`[data-v-${Math.random().toString(36).substr(2, 9)}]`);
      if (g) {
        const C = g.getBoundingClientRect(), R = C.left + C.width / 2, D = C.top + C.height / 2;
        ee({
          currentTarget: g,
          clientX: R,
          clientY: D
        });
      }
    }, { immediate: !0 }), (g, C) => (p(), I(E, {
      "extra-class": e.extraClass,
      "extra-styles": t.faux ? e.extraStyles : {
        position: "absolute",
        left: l.value + "px",
        top: n.value + "px",
        width: a.value + "px",
        height: i.value + "px",
        cursor: X.value,
        ...e.extraStyles
      },
      type: "panel-d-2",
      onMousemove: ee,
      onMousedown: ae
    }, {
      default: k(() => [
        m("div", {
          class: "window-container",
          onMousedown: oe(U, ["stop"]),
          style: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%"
          }
        }, [
          m("div", Xe, [
            L(Ae, {
              title: e.title,
              icon: e.icon,
              "placeholder-buttons": e.placeholderButtons,
              disabled: e.disabled,
              "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
              "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
            }, {
              buttons: k(() => [
                B(g.$slots, "titlebar-buttons")
              ]),
              _: 3
            }, 8, ["title", "icon", "placeholder-buttons", "disabled", "gradient-color-a", "gradient-color-b"])
          ]),
          m("div", {
            class: "inner-container",
            style: x({
              flex: "1",
              overflowX: t.overflowX ?? "auto",
              overflowY: t.overflowY ?? "auto",
              margin: "2px",
              marginTop: "0",
              boxSizing: "border-box"
            })
          }, [
            B(g.$slots, "default")
          ], 4)
        ], 32)
      ]),
      _: 3
    }, 8, ["extra-class", "extra-styles"]));
  }
}), Ye = /* @__PURE__ */ z({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" }
  },
  setup(e) {
    return (t, l) => (p(), I(E, {
      type: "border-groove",
      "extra-styles": { padding: "10px", margin: "10px" }
    }, {
      default: k(() => [
        m("div", {
          class: "label",
          style: x({ backgroundColor: e.backgroundColorHint })
        }, W(e.label), 5),
        B(t.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }));
  }
}), We = (e, t) => {
  const l = e.__vccOpts || e;
  for (const [n, a] of t)
    l[n] = a;
  return l;
}, Ze = /* @__PURE__ */ We(Ye, [["__scopeId", "data-v-9a25af1b"]]), je = (e, t = 30, l = 48, n = 30) => {
  const a = $(
    Array.from({ length: e }, (u, d) => ({
      sin: Math.sin(0 + d * Math.PI * 2 / e),
      cos: Math.cos(0 + d * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let i, o = 0;
  const c = () => {
    const u = Date.now();
    if (u - o >= 1e3 / t) {
      const d = Array.from({ length: e }, (f, v) => ({
        sin: Math.sin(u / (1e3 + v * 200) + v * Math.PI * 2 / e),
        cos: Math.cos(u / (3e3 + v * 400) + v * Math.PI * 2 / e + Math.PI / 4)
      })), s = d.map((f) => l + f.sin * n), h = e * l, r = s.reduce((f, v) => f + v, 0);
      if (r > 0) {
        const f = h / r, v = d.map((b) => ({
          sin: ((l + b.sin * n) * f - l) / n,
          cos: b.cos
        }));
        a.value = v;
      } else
        a.value = d;
      o = u;
    }
    i = requestAnimationFrame(c);
  };
  return P(() => {
    i = requestAnimationFrame(c);
  }), O(() => {
    cancelAnimationFrame(i);
  }), { values: a };
};
function Je(e) {
  document.addEventListener(
    "error",
    (t) => {
      const l = t.target;
      l instanceof HTMLImageElement && e(l, t);
    },
    !0
    // IMPORTANT: use capture phase since error doesn't bubble
  );
}
export {
  Ne as Balloon,
  ge as BaseDropdown,
  Pe as BaseInput,
  E as Box,
  Z as Button,
  Oe as Checkbox,
  Fe as HDivider,
  qe as MenuDropdown,
  Ze as NamedPanel,
  Ue as RadioButton,
  Ae as Titlebar,
  Ge as Tooltip,
  Be as Typography,
  Ke as Window,
  Re as drawAngledBayerDitherGradient,
  Je as registerGlobalImageErrorHandler,
  ne as typographyStyles,
  je as useSineWave
};
