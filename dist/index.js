import { defineComponent as R, ref as z, computed as k, openBlock as w, createElementBlock as S, normalizeStyle as T, normalizeClass as se, renderSlot as N, useModel as G, useSlots as ke, createElementVNode as g, createVNode as P, withCtx as B, unref as Se, Fragment as ce, createTextVNode as ue, toDisplayString as Y, createCommentVNode as W, mergeModels as me, watch as te, nextTick as Te, onMounted as J, onUnmounted as Q, withModifiers as pe, createBlock as V, Teleport as Be, resolveDynamicComponent as Ne, reactive as Re } from "vue";
const H = /* @__PURE__ */ R({
  __name: "Box",
  props: {
    type: {},
    extraStyles: {},
    extraClass: {}
  },
  setup(e, { expose: t }) {
    const n = e, o = z(null), l = k(() => ({
      "--img": `url(/win-55-ui/${n.type}.png)`,
      ...n.extraStyles
    }));
    return t({ el: o }), (i, a) => (w(), S("div", {
      ref_key: "rootRef",
      ref: o,
      class: se(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: T(l.value)
    }, [
      N(i.$slots, "default")
    ], 6));
  }
}), Me = { class: "balloon-wrapper" }, $e = { class: "balloon-tip-box" }, kt = /* @__PURE__ */ R({
  __name: "Balloon",
  props: /* @__PURE__ */ me({
    text: {},
    side: {},
    bias: {}
  }, {
    shown: { type: Boolean, default: !1 },
    shownModifiers: {}
  }),
  emits: ["update:shown"],
  setup(e) {
    const t = G(e, "shown"), n = e, o = ke(), l = k(() => n.side ?? "top"), i = k(() => n.bias), a = k(() => {
      const s = {};
      switch (l.value) {
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
    }), c = k(() => {
      switch (l.value) {
        case "top":
          return "column";
        case "bottom":
          return "column-reverse";
        case "left":
          return "row";
        case "right":
          return "row-reverse";
      }
    }), u = k(() => {
      let s = "", p = !1;
      switch (l.value) {
        case "top":
          s = "rotate(0deg)", i.value === "right" && (p = !0);
          break;
        case "bottom":
          s = "rotate(180deg)", i.value === "left" && (p = !0);
          break;
        case "left":
          s = "rotate(-90deg)";
          break;
        case "right":
          s = "rotate(90deg)", p = !0;
          break;
      }
      return p ? `${s} scaleX(-1)` : s;
    }), d = k(() => {
      const s = {};
      return i.value ? ((l.value === "top" || l.value === "bottom") && (i.value === "left" && (s.transform = "translateX(calc(-50% + 28px))"), i.value === "right" && (s.transform = "translateX(calc(50% - 28px))")), (l.value === "left" || l.value === "right") && (i.value === "up" && (s.transform = "translateY(calc(-50% + 28px))"), i.value === "down" && (s.transform = "translateY(calc(50% - 28px))")), s) : {};
    });
    return (s, p) => (w(), S("div", Me, [
      N(s.$slots, "default"),
      t.value ? (w(), S("div", {
        key: 0,
        class: "balloon",
        style: T(a.value)
      }, [
        g("div", {
          class: "balloon-inner",
          style: T({ flexDirection: c.value })
        }, [
          g("div", {
            class: "balloon-box-wrapper",
            style: T(d.value)
          }, [
            P(H, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: B(() => [
                Se(o).content ? N(s.$slots, "content", { key: 0 }) : (w(), S(ce, { key: 1 }, [
                  ue(Y(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          g("div", $e, [
            g("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: T({ transform: u.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : W("", !0)
    ]));
  }
}), ze = /* @__PURE__ */ R({
  __name: "BaseDropdown",
  props: {
    matchTriggerWidth: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = z(!1), o = z(null), l = z(null), i = z(null), a = () => {
      const s = l.value, p = i.value;
      if (!s || !p) return;
      const h = s.getBoundingClientRect(), b = window.innerHeight, y = p.offsetHeight;
      let E = h.bottom + window.scrollY;
      const M = h.left + window.scrollX;
      h.bottom + y > b && (E = h.top + window.scrollY - y), o.value = {
        top: E,
        left: M,
        width: t.matchTriggerWidth ? h.width : void 0
      };
    };
    te(n, async (s) => {
      s && (await Te(), a());
    });
    const c = () => {
      n.value && a();
    }, u = (s) => {
      if (!n.value) return;
      const p = s.target;
      l.value?.contains(p) || i.value?.contains(p) || (n.value = !1);
    };
    J(() => {
      window.addEventListener("resize", c), window.addEventListener("scroll", c), document.addEventListener("click", u);
    }), Q(() => {
      window.removeEventListener("resize", c), window.removeEventListener("scroll", c), document.removeEventListener("click", u);
    });
    const d = () => {
      n.value = !n.value;
    };
    return (s, p) => (w(), S(ce, null, [
      g("div", {
        ref_key: "triggerRef",
        ref: l,
        style: { display: "inline-block" },
        onClick: pe(d, ["stop"])
      }, [
        N(s.$slots, "trigger")
      ], 512),
      (w(), V(Be, { to: "body" }, [
        n.value ? (w(), S("div", {
          key: 0,
          ref_key: "dropdownRef",
          ref: i,
          style: T({
            position: "absolute",
            top: (o.value?.top ?? 0) + "px",
            left: (o.value?.left ?? 0) + "px",
            width: e.matchTriggerWidth ? (o.value?.width ?? "auto") + "px" : "auto"
          })
        }, [
          N(s.$slots, "items")
        ], 4)) : W("", !0)
      ]))
    ], 64));
  }
}), Ae = [10, 12, 14, 16, 24];
function he(e) {
  const { style: t, size: n } = e.shorthand ? je(e.shorthand) : {
    style: Ie(e.isBold, e.isItalic),
    size: De(e.fontSize ?? 12, Ae)
  }, o = {
    fontFamily: `${t}${n}, Arial, sans`,
    fontSize: `${n * 2}px`,
    color: e.fontColor
  };
  return e.fontShadowColor && (o.textShadow = `2px 2px 0 ${e.fontShadowColor}`), o;
}
function Ie(e, t) {
  return e && t ? "BoldItalic" : e ? "Bold" : t ? "Italic" : "Regular";
}
function je(e) {
  const t = e.match(/^([A-Za-z]+)(\d+)$/);
  if (!t)
    throw new Error(`Invalid shorthand format: ${e}`);
  const n = t[1], o = parseInt(t[2], 10);
  return { style: n, size: o };
}
function De(e, t) {
  if (t.length === 0)
    throw new Error("Array cannot be empty");
  return t.reduce((n, o) => {
    const l = Math.abs(o - e), i = Math.abs(n - e);
    return l < i ? o : n;
  });
}
function L(e) {
  if (e instanceof Text)
    return e.nodeValue ?? "";
  if (!(e instanceof Element || e instanceof DocumentFragment))
    return Array.from(e.childNodes).map(L).join("");
  if (e instanceof Element) {
    const t = e.getAttribute("data-win55-emoji");
    if (t)
      return t;
    if (e.tagName === "BR")
      return `
`;
  }
  return Array.from(e.childNodes).map(L).join("");
}
function Le(e) {
  const t = window.getSelection();
  if (!t || t.rangeCount === 0 || !t.isCollapsed)
    return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.startContainer))
    return null;
  const o = document.createRange();
  return o.selectNodeContents(e), o.setEnd(n.startContainer, n.startOffset), L(o.cloneContents()).length;
}
function ge(e, t) {
  if (e instanceof Text) {
    const l = e.nodeValue?.length ?? 0;
    return t <= l ? { node: e, offset: t, remaining: 0 } : { node: e, offset: l, remaining: t - l };
  }
  if (e instanceof Element) {
    const l = e.getAttribute("data-win55-emoji");
    if (l)
      return t <= 0 ? { node: e.parentNode ?? e, offset: oe(e), remaining: 0 } : t <= l.length ? { node: e.parentNode ?? e, offset: oe(e) + 1, remaining: 0 } : {
        node: e.parentNode ?? e,
        offset: oe(e) + 1,
        remaining: t - l.length
      };
  }
  let n = t, o = {
    offset: e.childNodes.length,
    remaining: n
  };
  for (const l of Array.from(e.childNodes)) {
    const i = ge(l, n);
    if (i && i.remaining === 0)
      return i;
    i && (n = i.remaining, o = i);
  }
  return {
    node: e,
    offset: e.childNodes.length,
    remaining: o.remaining
  };
}
function oe(e) {
  return e.parentNode ? Array.prototype.indexOf.call(e.parentNode.childNodes, e) : 0;
}
function Ve(e, t, n = !1) {
  if (t === null || !e.isConnected)
    return;
  const o = ge(e, t);
  if (!o)
    return;
  const l = document.createRange(), i = window.getSelection();
  n && e.focus({ preventScroll: !0 }), l.setStart(o.node, o.offset), l.collapse(!0), i?.removeAllRanges(), i?.addRange(l);
}
const St = /* @__PURE__ */ R({
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
  setup(e, { expose: t, emit: n }) {
    const o = e, l = n, i = z(null), a = k(() => i.value?.el ?? null);
    J(() => {
      a.value && o.modelValue && (a.value.innerText = o.modelValue);
    }), te(() => o.modelValue, (r) => {
      a.value && L(a.value) !== r && (a.value.innerText = r ?? "");
    });
    const c = () => {
      if (!a.value) return;
      let r = L(a.value);
      if (o.multiline || (r = r.replace(/\n/g, "")), o.maxLength && r.length > o.maxLength) {
        r = r.slice(0, o.maxLength), a.value.innerText = r;
        const m = document.createRange(), f = window.getSelection();
        m.selectNodeContents(a.value), m.collapse(!1), f?.removeAllRanges(), f?.addRange(m);
      }
      l("update:modelValue", r);
    }, u = (r, m) => {
      const f = document.createRange(), x = window.getSelection();
      a.value?.focus({ preventScroll: !0 }), f.setStart(r, m), f.collapse(!0), x?.removeAllRanges(), x?.addRange(f);
    }, d = (r) => r instanceof Text ? r.nodeValue?.length ?? 0 : r.childNodes.length, s = (r) => r.parentNode ? Array.prototype.indexOf.call(r.parentNode.childNodes, r) : 0, p = (r, m) => r instanceof Text ? m > 0 ? null : r.previousSibling ?? (r.parentNode && r.parentNode !== a.value ? p(r.parentNode, s(r.parentNode)) : null) : r.childNodes[m - 1] ?? (r.parentNode && r !== a.value ? p(r.parentNode, s(r)) : null), h = (r, m) => r instanceof Text ? m < (r.nodeValue?.length ?? 0) ? null : r.nextSibling ?? (r.parentNode && r.parentNode !== a.value ? h(r.parentNode, s(r.parentNode) + 1) : null) : r.childNodes[m] ?? (r.parentNode && r !== a.value ? h(r.parentNode, s(r) + 1) : null), b = (r, m) => {
      let f = r;
      for (; f; ) {
        if (f instanceof HTMLElement && f.hasAttribute("data-win55-emoji"))
          return f;
        if (f instanceof Text) {
          if ((f.nodeValue ?? "").length > 0)
            return null;
          f = m === "backward" ? f.previousSibling : f.nextSibling;
          continue;
        }
        if (f.childNodes.length > 0) {
          f = m === "backward" ? f.childNodes[f.childNodes.length - 1] : f.childNodes[0];
          continue;
        }
        return null;
      }
      return null;
    }, y = (r) => {
      if (r.cloneContents().querySelector?.("[data-win55-emoji]"))
        return !0;
      const f = r.startContainer instanceof Element ? r.startContainer : r.startContainer.parentElement, x = r.endContainer instanceof Element ? r.endContainer : r.endContainer.parentElement;
      return !!(f?.closest("[data-win55-emoji]") || x?.closest("[data-win55-emoji]"));
    }, E = (r) => {
      if (!a.value) return;
      const m = r.startContainer, f = r.startOffset;
      r.deleteContents(), m.isConnected && a.value.contains(m) ? u(m, Math.min(f, d(m))) : u(a.value, a.value.childNodes.length), c();
    }, M = (r, m) => {
      if (!a.value) return !1;
      const f = window.getSelection();
      if (!f || f.rangeCount === 0)
        return !1;
      const x = f.getRangeAt(0);
      if (!a.value.contains(x.startContainer))
        return !1;
      if (!f.isCollapsed)
        return y(x) ? (m(), E(x), !0) : !1;
      const v = r === "backward" ? p(x.startContainer, x.startOffset) : h(x.startContainer, x.startOffset), C = b(v, r);
      if (!C || !C.parentNode)
        return !1;
      m();
      const A = C.parentNode, j = s(C);
      return C.remove(), u(A, j), c(), !0;
    }, I = (r) => {
      if ((r.key === "Backspace" || r.key === "Delete") && a.value) {
        if (L(a.value) === "") {
          r.preventDefault(), a.value.focus({ preventScroll: !0 });
          return;
        }
        const m = r.key === "Backspace" ? "backward" : "forward";
        if (M(m, () => r.preventDefault())) {
          a.value.focus({ preventScroll: !0 });
          return;
        }
      }
      !o.multiline && r.key === "Enter" && r.preventDefault(), r.key === "Tab" && r.preventDefault();
    }, $ = (r) => {
      if (!a.value || r.inputType !== "deleteContentBackward" && r.inputType !== "deleteContentForward")
        return;
      if (L(a.value) === "") {
        r.preventDefault(), a.value.focus({ preventScroll: !0 });
        return;
      }
      const m = r.inputType === "deleteContentBackward" ? "backward" : "forward";
      M(m, () => r.preventDefault()) && a.value.focus({ preventScroll: !0 });
    }, _ = (r) => {
      r.preventDefault();
      let m = r.clipboardData?.getData("text/plain") ?? "";
      if (o.multiline || (m = m.replace(/\n/g, " ")), !a.value) return;
      const f = window.getSelection(), x = f?.getRangeAt(0);
      if (x) {
        x.deleteContents();
        const v = document.createTextNode(m);
        x.insertNode(v), x.collapse(!1), f?.removeAllRanges(), f?.addRange(x);
      }
      c();
    }, F = () => {
      a.value && L(a.value) === "" && (a.value.innerHTML = "");
    }, U = k(() => ({
      ...o.extraStyles,
      ...he({ fontColor: "black" }),
      overflow: "auto"
    }));
    return t({ el: a }), (r, m) => (w(), V(H, {
      ref_key: "boxRef",
      ref: i,
      type: e.boxType,
      contenteditable: !e.disabled,
      "extra-styles": U.value,
      "data-placeholder": e.placeholder,
      role: "textbox",
      "aria-multiline": e.multiline,
      "aria-disabled": e.disabled,
      onInput: c,
      onKeydown: I,
      onBeforeinput: $,
      onPaste: _,
      onBlur: F
    }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"]));
  }
}), le = /* @__PURE__ */ R({
  __name: "Button",
  props: {
    baseType: { default: "panel-d-1" },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: t }) {
    const n = e, o = t, l = z(!1), i = z(!1), a = k(() => !n.disabled && l.value && i.value), c = k(() => n.disabled), u = (E) => {
      n.disabled || E.button !== 0 || (l.value = !0, i.value = !0);
    }, d = () => {
      n.disabled || (i.value = !0);
    }, s = () => {
      i.value = !1;
    }, p = (E) => {
      n.disabled || E.button !== 0 || (l.value && i.value && o("click"), l.value = !1);
    };
    J(() => {
      window.addEventListener("mouseup", p);
    }), Q(() => {
      window.removeEventListener("mouseup", p);
    });
    const h = k(() => ({
      userSelect: "none",
      width: "fit-content",
      paddingBottom: "4px",
      paddingRight: "4px",
      cursor: c.value ? "not-allowed" : "default",
      ...n.extraStyles
    })), b = k(() => ({
      transform: a.value ? "translate(2px, 2px)" : "translate(0, 0)",
      opacity: c.value ? 0.5 : 1
    })), y = k(() => a.value ? "indent" : n.baseType);
    return (E, M) => (w(), V(H, {
      type: y.value,
      "extra-styles": h.value,
      "extra-class": e.extraClass,
      onMousedown: u,
      onMouseenter: d,
      onMouseleave: s
    }, {
      default: B(() => [
        g("div", {
          style: T(b.value)
        }, [
          N(E.$slots, "default")
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"]));
  }
}), _e = { style: { display: "flex", "align-items": "center" } }, Fe = ["src", "alt"], He = ["checked", "disabled", "value"], Tt = /* @__PURE__ */ R({
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
    const n = e, o = t, l = () => {
      n.disabled || o("update:modelValue", !n.modelValue);
    };
    return (i, a) => (w(), S("div", {
      class: se(["checkbox-container", { disabled: e.disabled }]),
      style: T({
        display: "flex",
        alignItems: "center",
        gap: "8px",
        opacity: e.disabled ? 0.5 : 1,
        cursor: e.disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        marginBottom: "2px"
      }),
      onClick: l
    }, [
      g("div", _e, [
        g("img", {
          draggable: "false",
          src: e.modelValue ? e.checkedIcon : e.uncheckedIcon,
          alt: e.modelValue ? "checked" : "unchecked"
        }, null, 8, Fe)
      ]),
      g("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, He),
      e.label ? (w(), S("span", {
        key: 0,
        style: T({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, Y(e.label), 5)) : W("", !0)
    ], 6));
  }
}), Bt = /* @__PURE__ */ R({
  __name: "HDivider",
  setup(e) {
    return (t, n) => (w(), V(H, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), Nt = /* @__PURE__ */ R({
  __name: "MenuDropdown",
  setup(e) {
    return (t, n) => (w(), V(ze, null, {
      trigger: B(() => [
        N(t.$slots, "trigger")
      ]),
      items: B(() => [
        P(H, { type: "panel-d-1" }, {
          default: B(() => [
            N(t.$slots, "items")
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), Oe = { style: { display: "flex", "align-items": "center" } }, Pe = ["src"], Xe = ["src"], Ye = ["checked", "disabled", "value", "name"], Rt = /* @__PURE__ */ R({
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
    const n = e, o = t, l = k(() => n.modelValue === n.value), i = (a) => {
      a.preventDefault(), !n.disabled && (l.value || o("update:modelValue", n.value));
    };
    return (a, c) => (w(), S("div", {
      class: se(["radio-container", { disabled: e.disabled }]),
      style: T({
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
      g("div", Oe, [
        l.value ? (w(), S("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, Pe)) : (w(), S("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, Xe))
      ]),
      g("input", {
        type: "radio",
        checked: l.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, Ye),
      e.label ? (w(), S("span", {
        key: 0,
        style: T({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, Y(e.label), 5)) : W("", !0)
    ], 6));
  }
});
function We(e, t, n, o, l) {
  const i = e.getContext("2d");
  if (!i) return;
  i.clearRect(0, 0, e.width, e.height);
  const a = 2, c = [
    [0, 48, 12, 60, 3, 51, 15, 63],
    [32, 16, 44, 28, 35, 19, 47, 31],
    [8, 56, 4, 52, 11, 59, 7, 55],
    [40, 24, 36, 20, 43, 27, 39, 23],
    [2, 50, 14, 62, 1, 49, 13, 61],
    [34, 18, 46, 30, 33, 17, 45, 29],
    [10, 58, 6, 54, 9, 57, 5, 53],
    [42, 26, 38, 22, 41, 25, 37, 21]
  ], u = de(o), d = de(l), s = Math.floor(t / a), p = Math.floor(n / a);
  e.width = Math.floor(t * 2) / 2, e.height = Math.floor(n * 2) / 2;
  for (let h = 0; h < p; h++)
    for (let b = 0; b < s; b++) {
      const y = b * a, E = h * a, M = (b + h) / (s + p - 6), I = (c[h % 8][b % 8] + 0.5) / 64, $ = M > I ? 1 : 0, _ = Math.round(u.r * (1 - $) + d.r * $), F = Math.round(u.g * (1 - $) + d.g * $), U = Math.round(u.b * (1 - $) + d.b * $);
      i.fillStyle = `rgb(${_}, ${F}, ${U})`, i.fillRect(y, E, a, a);
    }
}
function de(e) {
  const t = e.replace("#", ""), n = parseInt(t, 16);
  return {
    r: n >> 16 & 255,
    g: n >> 8 & 255,
    b: n & 255
  };
}
const Ue = /* @__PURE__ */ R({
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
    const t = e, n = k(() => t.element ?? "span"), o = k(() => {
      const l = he(t);
      return t.element || (l.display = "contents"), l;
    });
    return (l, i) => (w(), V(Ne(n.value), {
      style: T(o.value)
    }, {
      default: B(() => [
        N(l.$slots, "default")
      ]),
      _: 3
    }, 8, ["style"]));
  }
}), Ge = { style: { height: "0", overflow: "visible" } }, qe = { class: "titlebar-content" }, Je = { class: "titlebar-image" }, Qe = ["src"], Ze = { class: "titlebar-text" }, Ke = /* @__PURE__ */ R({
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
    const t = e, n = z(null);
    let o = null;
    function l(a, c) {
      const u = t.gradientColorA || "5555ff", d = t.gradientColorB || "0000aa";
      We(a, a.width, a.height, u, d), c.fillStyle = "#555555", c.fillRect(0, a.height - 2, Math.floor(a.width / 2) * 2, 4);
    }
    function i() {
      const a = n.value;
      if (!a) return;
      const c = a.getContext("2d");
      if (!c) return;
      const u = a.getBoundingClientRect(), d = Math.floor(u.width * 2) / 2, s = Math.floor(u.height * 2) / 2;
      (a.width !== d || a.height !== s) && (a.width = d, a.height = s), l(a, c);
    }
    return te(() => [t.gradientColorA, t.gradientColorB], () => {
      if (n.value) {
        const a = n.value.getContext("2d");
        a && l(n.value, a);
      }
    }), J(() => {
      i(), n.value && (o = new ResizeObserver(() => {
        i();
      }), o.observe(n.value));
    }), Q(() => {
      o?.disconnect();
    }), (a, c) => (w(), S("div", null, [
      g("div", Ge, [
        g("canvas", {
          ref_key: "canvasRef",
          ref: n,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      g("div", qe, [
        g("div", Je, [
          g("img", {
            src: e.icon ?? "/win-55-ui/icons/program.png"
          }, null, 8, Qe)
        ]),
        g("div", Ze, [
          P(Ue, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: B(() => [
              ue(Y(e.title), 1)
            ]),
            _: 1
          })
        ]),
        N(a.$slots, "buttons"),
        e.placeholderButtons ? (w(), S(ce, { key: 0 }, [
          P(le, {
            "extra-class": "titlebar-button",
            "base-type": "panel-d-2",
            disabled: ""
          }, {
            default: B(() => [...c[0] || (c[0] = [
              g("img", {
                draggable: "false",
                src: "/win-55-ui/window/o.png"
              }, null, -1)
            ])]),
            _: 1
          }),
          P(le, {
            "extra-class": "titlebar-button",
            "base-type": "panel-d-2",
            disabled: ""
          }, {
            default: B(() => [...c[1] || (c[1] = [
              g("img", {
                draggable: "false",
                src: "/win-55-ui/window/_.png"
              }, null, -1)
            ])]),
            _: 1
          }),
          c[3] || (c[3] = g("div", { style: { width: "2px" } }, null, -1)),
          P(le, {
            "extra-class": "titlebar-button",
            "base-type": "panel-d-2",
            disabled: ""
          }, {
            default: B(() => [...c[2] || (c[2] = [
              g("img", {
                draggable: "false",
                src: "/win-55-ui/window/x.png"
              }, null, -1)
            ])]),
            _: 1
          }),
          c[4] || (c[4] = g("div", { style: { width: "2px" } }, null, -1))
        ], 64)) : W("", !0)
      ])
    ]));
  }
}), Mt = /* @__PURE__ */ R({
  __name: "Tooltip",
  props: {
    text: {},
    offsetX: {},
    offsetY: {}
  },
  setup(e) {
    const t = e, n = z(!1), o = Re({ x: 0, y: 0 });
    let l = null;
    const i = () => {
      l = window.setTimeout(() => {
        n.value = !0;
      }, 400);
    }, a = () => {
      l !== null && (clearTimeout(l), l = null), n.value = !1;
    }, c = (d) => {
      o.x = d.clientX + (t.offsetX ?? 24), o.y = d.clientY + (t.offsetY ?? 24);
    }, u = k(() => ({
      position: "fixed",
      left: `${o.x}px`,
      top: `${o.y}px`,
      pointerEvents: "none",
      // now TS understands it's valid
      whiteSpace: "nowrap",
      zIndex: 1e3
    }));
    return Q(() => {
      l !== null && clearTimeout(l);
    }), (d, s) => (w(), S("span", {
      onMouseenter: i,
      onMouseleave: a,
      onMousemove: c,
      style: { position: "relative", display: "inline-block" }
    }, [
      N(d.$slots, "default"),
      n.value ? (w(), V(H, {
        key: 0,
        style: T(u.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: B(() => [
          ue(Y(t.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : W("", !0)
    ], 32));
  }
}), et = {
  class: "titlebar-wrapper",
  style: { height: "34px" }
}, Z = 6, $t = /* @__PURE__ */ R({
  __name: "Window",
  props: /* @__PURE__ */ me({
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
    const t = e, n = G(e, "x"), o = G(e, "y"), l = G(e, "width"), i = G(e, "height"), a = t.minWidth ?? 240, c = t.minHeight ?? 40, u = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableHorizontally ?? !1), d = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableVertically ?? !1);
    let s = !1, p = !1, h = "", b = "", y = 0, E = 0, M = 0, I = 0, $ = 0, _ = 0;
    const F = z("default");
    function U(v) {
      t.faux || h || (s = !0, y = v.clientX, E = v.clientY, $ = n.value, _ = o.value, window.addEventListener("mousemove", m), window.addEventListener("mouseup", f));
    }
    function r(v) {
      t.faux || h && (!u && !d || (p = !0, b = h, y = v.clientX, E = v.clientY, M = l.value, I = i.value, $ = n.value, _ = o.value, window.addEventListener("mousemove", m), window.addEventListener("mouseup", f)));
    }
    function m(v) {
      if (t.faux) return;
      const C = v.clientX - y, A = v.clientY - E;
      if (s && (n.value = $ + C, o.value = _ + A), p) {
        const j = b;
        if (u && j.includes("e") && (l.value = Math.max(a, M + C)), d && j.includes("s") && (i.value = Math.max(c, I + A)), u && j.includes("w")) {
          const D = M - C, O = Math.max(a, D);
          l.value = O, n.value = $ + (M - O);
        }
        if (d && j.includes("n")) {
          const D = I - A, O = Math.max(c, D);
          i.value = O, o.value = _ + (I - O);
        }
      }
    }
    function f() {
      s = !1, p = !1, b = "", window.removeEventListener("mousemove", m), window.removeEventListener("mouseup", f);
    }
    function x(v) {
      if (t.faux) {
        h = "", F.value = "default";
        return;
      }
      if (p) return;
      const C = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableHorizontally ?? !1), A = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableVertically ?? !1);
      if (!C && !A) {
        h = "", F.value = "default";
        return;
      }
      const D = v.currentTarget.getBoundingClientRect(), O = v.clientX - D.left, ye = D.right - v.clientX, xe = v.clientY - D.top, Ee = D.bottom - v.clientY;
      let X = "";
      A && (xe < Z ? X += "n" : Ee < Z && (X += "s")), C && (O < Z ? X += "w" : ye < Z && (X += "e")), h = X;
      const Ce = {
        n: "ns-resize",
        s: "ns-resize",
        e: "ew-resize",
        w: "ew-resize",
        ne: "nesw-resize",
        sw: "nesw-resize",
        nw: "nwse-resize",
        se: "nwse-resize"
      };
      F.value = Ce[X] ?? "default";
    }
    return te(() => [t.resizable, t.resizableHorizontally, t.resizableVertically], () => {
      const v = document.querySelector(`[data-v-${Math.random().toString(36).substr(2, 9)}]`);
      if (v) {
        const C = v.getBoundingClientRect(), A = C.left + C.width / 2, j = C.top + C.height / 2;
        x({
          currentTarget: v,
          clientX: A,
          clientY: j
        });
      }
    }, { immediate: !0 }), (v, C) => (w(), V(H, {
      "extra-class": e.extraClass,
      "extra-styles": t.faux ? e.extraStyles : {
        position: "absolute",
        left: n.value + "px",
        top: o.value + "px",
        width: l.value + "px",
        height: i.value + "px",
        cursor: F.value,
        ...e.extraStyles
      },
      type: "panel-d-2",
      onMousemove: x,
      onMousedown: r
    }, {
      default: B(() => [
        g("div", {
          class: "window-container",
          onMousedown: pe(U, ["stop"]),
          style: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%"
          }
        }, [
          g("div", et, [
            P(Ke, {
              title: e.title,
              icon: e.icon,
              "placeholder-buttons": e.placeholderButtons,
              disabled: e.disabled,
              "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
              "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
            }, {
              buttons: B(() => [
                N(v.$slots, "titlebar-buttons")
              ]),
              _: 3
            }, 8, ["title", "icon", "placeholder-buttons", "disabled", "gradient-color-a", "gradient-color-b"])
          ]),
          g("div", {
            class: "inner-container",
            style: T({
              flex: "1",
              overflowX: t.overflowX ?? "auto",
              overflowY: t.overflowY ?? "auto",
              margin: "2px",
              marginTop: "0",
              boxSizing: "border-box"
            })
          }, [
            N(v.$slots, "default")
          ], 4)
        ], 32)
      ]),
      _: 3
    }, 8, ["extra-class", "extra-styles"]));
  }
}), tt = /* @__PURE__ */ R({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" }
  },
  setup(e) {
    return (t, n) => (w(), V(H, {
      type: "border-groove",
      "extra-styles": { padding: "10px", margin: "10px" }
    }, {
      default: B(() => [
        g("div", {
          class: "label",
          style: T({ backgroundColor: e.backgroundColorHint })
        }, Y(e.label), 5),
        N(t.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }));
  }
}), nt = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, l] of t)
    n[o] = l;
  return n;
}, zt = /* @__PURE__ */ nt(tt, [["__scopeId", "data-v-9a25af1b"]]), ve = "/win-55-ui/emoji", ae = `${ve}/emoji-registry.csv`;
let K = null, re = null, ee = null;
function ot(e) {
  return e.replace(/\/$/, "");
}
function we(e) {
  return e.trim().replace(/\.gif$/i, "");
}
function lt(e) {
  const t = {}, n = e.replace(/^\uFEFF/, "").split(/\r?\n/);
  for (const [o, l] of n.entries()) {
    const i = l.trim();
    if (!i || o === 0 && i.toLowerCase() === "emoji,code")
      continue;
    const a = i.indexOf(",");
    if (a === -1)
      throw new Error(`Could not parse emoji registry row ${o + 1}: missing comma`);
    const c = i.slice(0, a).trim(), u = we(i.slice(a + 1));
    c && u && (t[c] = u);
  }
  return t;
}
async function ne(e = {}) {
  const t = e.registryUrl ?? ae;
  return ee && t === ae ? ee : ((!K || re !== t) && (re = t, K = fetch(t).then((n) => {
    if (!n.ok)
      throw new Error(
        `Could not load emoji registry from ${t}: ${n.status} ${n.statusText}`
      );
    return n.text();
  }).then(lt).then((n) => (t === ae && (ee = n), n))), K);
}
function At() {
  K = null, re = null, ee = null;
}
async function It(e, t = {}) {
  const o = (await ne(t))[e];
  return o ? be(o, t) : null;
}
function be(e, t = {}) {
  return `${ot(t.basePath ?? ve)}/${we(e)}.gif`;
}
async function jt(e = {}) {
  return ne(e);
}
async function Dt(e, t = {}) {
  const n = await ne(t);
  return e in n;
}
const at = "win55-emoji", rt = "win55-emoji-image", it = 15, st = 2, ct = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "INPUT",
  "SELECT",
  "OPTION"
]), q = /* @__PURE__ */ new WeakMap(), fe = /* @__PURE__ */ new WeakMap();
function ut(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function dt(e) {
  const t = fe.get(e);
  if (t)
    return t;
  const n = Object.keys(e).sort((l, i) => i.length - l.length);
  if (n.length === 0)
    return null;
  const o = new RegExp(n.map(ut).join("|"), "gu");
  return fe.set(e, o), o;
}
function ft(e) {
  return e.value === !1 ? null : typeof e.value == "object" ? e.value : {};
}
function mt(e) {
  return ct.has(e.tagName) || e.hasAttribute("data-win55-emoji");
}
function pt(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, {
    acceptNode(o) {
      const l = o.parentElement;
      return !l || mt(l) || !o.nodeValue?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
    }
  });
  for (; n.nextNode(); )
    t.push(n.currentNode);
  return t;
}
function ht() {
  return `${it * st}px`;
}
function gt(e, t, n) {
  const o = document.createElement("span"), l = document.createElement("img");
  return o.className = n.className ?? at, o.contentEditable = "false", o.dataset.win55Emoji = e, o.role = "img", o.ariaLabel = e, o.style.setProperty("--win55-emoji-size", ht()), l.src = be(t, n), l.alt = e, l.className = rt, l.draggable = !1, l.dataset.win55EmojiImg = "true", o.append(l), o;
}
function vt(e, t, n, o) {
  if (!e.parentElement)
    return;
  const l = e.nodeValue ?? "";
  let i = 0, a = !1;
  const c = document.createDocumentFragment();
  t.lastIndex = 0;
  for (const u of l.matchAll(t)) {
    const d = u[0], s = u.index, p = n[d];
    s === void 0 || !p || (a = !0, s > i && c.append(document.createTextNode(l.slice(i, s))), c.append(gt(d, p, o)), i = s + d.length);
  }
  a && (i < l.length && c.append(document.createTextNode(l.slice(i))), e.replaceWith(c));
}
function wt(e) {
  const t = document.activeElement;
  return !(t instanceof HTMLElement) || !e.contains(t) || !t.isContentEditable ? null : t;
}
async function bt(e, t) {
  const n = ft(t.binding);
  if (!n)
    return;
  t.version += 1;
  const o = t.version, l = await ne(n);
  if (q.get(e)?.version !== o || !e.isConnected)
    return;
  const i = dt(l);
  if (!i)
    return;
  const a = wt(e), c = a ?? e, u = Le(c);
  for (const d of pt(e))
    vt(d, i, l, n);
  Ve(c, u, !!a);
}
function ie(e, t) {
  t.renderQueued || (t.renderQueued = !0, t.renderFrame = window.requestAnimationFrame(() => {
    t.renderQueued = !1, t.renderFrame = null, bt(e, t).catch((n) => {
      console.warn("[win-55-ui] Could not render custom emoji.", n);
    });
  }));
}
function yt(e, t) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !t.clipboardData)
    return;
  const o = n.getRangeAt(0);
  if (!o.intersectsNode(e))
    return;
  const l = o.cloneContents(), i = L(l);
  i && (t.clipboardData.setData("text/plain", i), t.preventDefault());
}
function xt(e, t) {
  const n = new MutationObserver(() => {
    ie(e, t);
  });
  return n.observe(e, {
    characterData: !0,
    childList: !0,
    subtree: !0
  }), n;
}
const Et = {
  mounted(e, t) {
    const n = {
      binding: t,
      copyHandler: (o) => yt(e, o),
      observer: null,
      renderFrame: null,
      renderQueued: !1,
      version: 0
    };
    n.observer = xt(e, n), q.set(e, n), e.addEventListener("copy", n.copyHandler), ie(e, n);
  },
  updated(e, t) {
    const n = q.get(e);
    n && (n.binding = t, ie(e, n));
  },
  unmounted(e) {
    const t = q.get(e);
    t && (t.observer?.disconnect(), t.renderFrame !== null && window.cancelAnimationFrame(t.renderFrame), e.removeEventListener("copy", t.copyHandler)), q.delete(e);
  }
}, Lt = Et, Vt = (e, t = 30, n = 48, o = 30) => {
  const l = z(
    Array.from({ length: e }, (u, d) => ({
      sin: Math.sin(0 + d * Math.PI * 2 / e),
      cos: Math.cos(0 + d * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let i, a = 0;
  const c = () => {
    const u = Date.now();
    if (u - a >= 1e3 / t) {
      const d = Array.from({ length: e }, (b, y) => ({
        sin: Math.sin(u / (1e3 + y * 200) + y * Math.PI * 2 / e),
        cos: Math.cos(u / (3e3 + y * 400) + y * Math.PI * 2 / e + Math.PI / 4)
      })), s = d.map((b) => n + b.sin * o), p = e * n, h = s.reduce((b, y) => b + y, 0);
      if (h > 0) {
        const b = p / h, y = d.map((E) => ({
          sin: ((n + E.sin * o) * b - n) / o,
          cos: E.cos
        }));
        l.value = y;
      } else
        l.value = d;
      a = u;
    }
    i = requestAnimationFrame(c);
  };
  return J(() => {
    i = requestAnimationFrame(c);
  }), Q(() => {
    cancelAnimationFrame(i);
  }), { values: l };
};
function _t(e) {
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
  kt as Balloon,
  ze as BaseDropdown,
  St as BaseInput,
  H as Box,
  le as Button,
  Tt as Checkbox,
  Bt as HDivider,
  Nt as MenuDropdown,
  zt as NamedPanel,
  Rt as RadioButton,
  Ke as Titlebar,
  Mt as Tooltip,
  Ue as Typography,
  $t as Window,
  Lt as customEmojiDirective,
  We as drawAngledBayerDitherGradient,
  Et as emojiDirective,
  It as getEmojiGifPath,
  be as getEmojiGifPathFromCode,
  jt as getEmojiRegistry,
  Le as getSelectionOffset,
  L as getTextWithCustomEmoji,
  Dt as hasEmoji,
  ne as loadEmojiRegistry,
  _t as registerGlobalImageErrorHandler,
  At as resetEmojiRegistryCache,
  Ve as restoreSelectionOffset,
  he as typographyStyles,
  Vt as useSineWave
};
