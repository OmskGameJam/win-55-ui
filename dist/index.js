import { defineComponent as M, ref as z, computed as C, openBlock as w, createElementBlock as k, normalizeStyle as S, normalizeClass as se, renderSlot as B, useModel as G, useSlots as ke, createElementVNode as v, createVNode as P, withCtx as T, unref as Se, Fragment as ce, createTextVNode as ue, toDisplayString as W, createCommentVNode as U, mergeModels as me, watch as te, nextTick as Ne, onMounted as J, onUnmounted as Q, withModifiers as he, createBlock as D, Teleport as Te, resolveDynamicComponent as Be, reactive as Me } from "vue";
const F = /* @__PURE__ */ M({
  __name: "Box",
  props: {
    type: {},
    extraStyles: {},
    extraClass: {}
  },
  setup(e, { expose: t }) {
    const n = e, o = z(null), l = C(() => ({
      "--img": `url(/win-55-ui/${n.type}.png)`,
      ...n.extraStyles
    }));
    return t({ el: o }), (i, a) => (w(), k("div", {
      ref_key: "rootRef",
      ref: o,
      class: se(["border-9-base", `border-9-${e.type}`, e.extraClass ?? ""]),
      style: S(l.value)
    }, [
      B(i.$slots, "default")
    ], 6));
  }
}), Re = { class: "balloon-wrapper" }, $e = { class: "balloon-tip-box" }, Ct = /* @__PURE__ */ M({
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
    const t = G(e, "shown"), n = e, o = ke(), l = C(() => n.side ?? "top"), i = C(() => n.bias), a = C(() => {
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
    }), c = C(() => {
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
    }), d = C(() => {
      let s = "", m = !1;
      switch (l.value) {
        case "top":
          s = "rotate(0deg)", i.value === "right" && (m = !0);
          break;
        case "bottom":
          s = "rotate(180deg)", i.value === "left" && (m = !0);
          break;
        case "left":
          s = "rotate(-90deg)";
          break;
        case "right":
          s = "rotate(90deg)", m = !0;
          break;
      }
      return m ? `${s} scaleX(-1)` : s;
    }), f = C(() => {
      const s = {};
      return i.value ? ((l.value === "top" || l.value === "bottom") && (i.value === "left" && (s.transform = "translateX(calc(-50% + 28px))"), i.value === "right" && (s.transform = "translateX(calc(50% - 28px))")), (l.value === "left" || l.value === "right") && (i.value === "up" && (s.transform = "translateY(calc(-50% + 28px))"), i.value === "down" && (s.transform = "translateY(calc(50% - 28px))")), s) : {};
    });
    return (s, m) => (w(), k("div", Re, [
      B(s.$slots, "default"),
      t.value ? (w(), k("div", {
        key: 0,
        class: "balloon",
        style: S(a.value)
      }, [
        v("div", {
          class: "balloon-inner",
          style: S({ flexDirection: c.value })
        }, [
          v("div", {
            class: "balloon-box-wrapper",
            style: S(f.value)
          }, [
            P(F, {
              type: "notification",
              "extra-styles": { whiteSpace: "pre" }
            }, {
              default: T(() => [
                Se(o).content ? B(s.$slots, "content", { key: 0 }) : (w(), k(ce, { key: 1 }, [
                  ue(W(e.text), 1)
                ], 64))
              ]),
              _: 3
            })
          ], 4),
          v("div", $e, [
            v("img", {
              class: "balloon-tip",
              src: "/win-55-ui/balloon-tip.png",
              style: S({ transform: d.value }),
              width: "18",
              height: "28"
            }, null, 4)
          ])
        ], 4)
      ], 4)) : U("", !0)
    ]));
  }
}), ze = /* @__PURE__ */ M({
  __name: "BaseDropdown",
  props: {
    matchTriggerWidth: { type: Boolean, default: !1 }
  },
  setup(e) {
    const t = e, n = z(!1), o = z(null), l = z(null), i = z(null), a = () => {
      const s = l.value, m = i.value;
      if (!s || !m) return;
      const g = s.getBoundingClientRect(), b = window.innerHeight, x = m.offsetHeight;
      let E = g.bottom + window.scrollY;
      const $ = g.left + window.scrollX;
      g.bottom + x > b && (E = g.top + window.scrollY - x), o.value = {
        top: E,
        left: $,
        width: t.matchTriggerWidth ? g.width : void 0
      };
    };
    te(n, async (s) => {
      s && (await Ne(), a());
    });
    const c = () => {
      n.value && a();
    }, d = (s) => {
      if (!n.value) return;
      const m = s.target;
      l.value?.contains(m) || i.value?.contains(m) || (n.value = !1);
    };
    J(() => {
      window.addEventListener("resize", c), window.addEventListener("scroll", c), document.addEventListener("click", d);
    }), Q(() => {
      window.removeEventListener("resize", c), window.removeEventListener("scroll", c), document.removeEventListener("click", d);
    });
    const f = () => {
      n.value = !n.value;
    };
    return (s, m) => (w(), k(ce, null, [
      v("div", {
        ref_key: "triggerRef",
        ref: l,
        style: { display: "inline-block" },
        onClick: he(f, ["stop"])
      }, [
        B(s.$slots, "trigger")
      ], 512),
      (w(), D(Te, { to: "body" }, [
        n.value ? (w(), k("div", {
          key: 0,
          ref_key: "dropdownRef",
          ref: i,
          style: S({
            position: "absolute",
            top: (o.value?.top ?? 0) + "px",
            left: (o.value?.left ?? 0) + "px",
            width: e.matchTriggerWidth ? (o.value?.width ?? "auto") + "px" : "auto"
          })
        }, [
          B(s.$slots, "items")
        ], 4)) : U("", !0)
      ]))
    ], 64));
  }
}), Ae = [10, 12, 14, 16, 24];
function ge(e) {
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
function _(e) {
  if (e instanceof Text)
    return e.nodeValue ?? "";
  if (!(e instanceof Element || e instanceof DocumentFragment))
    return Array.from(e.childNodes).map(_).join("");
  if (e instanceof Element) {
    const t = e.getAttribute("data-win55-emoji");
    if (t)
      return t;
    if (e.tagName === "BR")
      return `
`;
  }
  return Array.from(e.childNodes).map(_).join("");
}
function Le(e) {
  const t = window.getSelection();
  if (!t || t.rangeCount === 0 || !t.isCollapsed)
    return null;
  const n = t.getRangeAt(0);
  if (!e.contains(n.startContainer))
    return null;
  const o = document.createRange();
  return o.selectNodeContents(e), o.setEnd(n.startContainer, n.startOffset), _(o.cloneContents()).length;
}
function pe(e, t) {
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
    const i = pe(l, n);
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
function Ve(e, t) {
  if (t === null || !e.isConnected)
    return;
  const n = pe(e, t);
  if (!n)
    return;
  const o = document.createRange(), l = window.getSelection();
  o.setStart(n.node, n.offset), o.collapse(!0), l?.removeAllRanges(), l?.addRange(o);
}
const kt = /* @__PURE__ */ M({
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
    const o = e, l = n, i = z(null), a = C(() => i.value?.el ?? null);
    J(() => {
      a.value && o.modelValue && (a.value.innerText = o.modelValue);
    }), te(() => o.modelValue, (r) => {
      a.value && _(a.value) !== r && (a.value.innerText = r ?? "");
    });
    const c = () => {
      if (!a.value) return;
      let r = _(a.value);
      if (o.multiline || (r = r.replace(/\n/g, "")), o.maxLength && r.length > o.maxLength) {
        r = r.slice(0, o.maxLength), a.value.innerText = r;
        const h = document.createRange(), u = window.getSelection();
        h.selectNodeContents(a.value), h.collapse(!1), u?.removeAllRanges(), u?.addRange(h);
      }
      l("update:modelValue", r);
    }, d = (r, h) => {
      const u = document.createRange(), y = window.getSelection();
      a.value?.focus({ preventScroll: !0 }), u.setStart(r, h), u.collapse(!0), y?.removeAllRanges(), y?.addRange(u);
    }, f = (r) => r instanceof Text ? r.nodeValue?.length ?? 0 : r.childNodes.length, s = (r) => r.parentNode ? Array.prototype.indexOf.call(r.parentNode.childNodes, r) : 0, m = (r, h) => r instanceof Text ? h > 0 ? null : r.previousSibling ?? (r.parentNode && r.parentNode !== a.value ? m(r.parentNode, s(r.parentNode)) : null) : r.childNodes[h - 1] ?? (r.parentNode && r !== a.value ? m(r.parentNode, s(r)) : null), g = (r, h) => r instanceof Text ? h < (r.nodeValue?.length ?? 0) ? null : r.nextSibling ?? (r.parentNode && r.parentNode !== a.value ? g(r.parentNode, s(r.parentNode) + 1) : null) : r.childNodes[h] ?? (r.parentNode && r !== a.value ? g(r.parentNode, s(r) + 1) : null), b = (r, h) => {
      let u = r;
      for (; u; ) {
        if (u instanceof HTMLElement && u.hasAttribute("data-win55-emoji"))
          return u;
        if (u instanceof Text) {
          if ((u.nodeValue ?? "").length > 0)
            return null;
          u = h === "backward" ? u.previousSibling : u.nextSibling;
          continue;
        }
        if (u.childNodes.length > 0) {
          u = h === "backward" ? u.childNodes[u.childNodes.length - 1] : u.childNodes[0];
          continue;
        }
        return null;
      }
      return null;
    }, x = (r) => {
      if (r.cloneContents().querySelector?.("[data-win55-emoji]"))
        return !0;
      const u = r.startContainer instanceof Element ? r.startContainer : r.startContainer.parentElement, y = r.endContainer instanceof Element ? r.endContainer : r.endContainer.parentElement;
      return !!(u?.closest("[data-win55-emoji]") || y?.closest("[data-win55-emoji]"));
    }, E = (r) => {
      if (!a.value) return;
      const h = r.startContainer, u = r.startOffset;
      r.deleteContents(), h.isConnected && a.value.contains(h) ? d(h, Math.min(u, f(h))) : d(a.value, a.value.childNodes.length), c();
    }, $ = (r, h) => {
      if (!a.value) return !1;
      const u = window.getSelection();
      if (!u || u.rangeCount === 0)
        return !1;
      const y = u.getRangeAt(0);
      if (!a.value.contains(y.startContainer))
        return !1;
      if (!u.isCollapsed)
        return x(y) ? (h(), E(y), !0) : !1;
      const X = r === "backward" ? m(y.startContainer, y.startOffset) : g(y.startContainer, y.startOffset), p = b(X, r);
      if (!p || !p.parentNode)
        return !1;
      h();
      const N = p.parentNode, A = s(p);
      return p.remove(), d(N, A), c(), !0;
    }, I = (r) => {
      if ((r.key === "Backspace" || r.key === "Delete") && a.value) {
        if (_(a.value) === "") {
          r.preventDefault(), a.value.focus({ preventScroll: !0 });
          return;
        }
        const h = r.key === "Backspace" ? "backward" : "forward";
        if ($(h, () => r.preventDefault())) {
          a.value.focus({ preventScroll: !0 });
          return;
        }
      }
      !o.multiline && r.key === "Enter" && r.preventDefault(), r.key === "Tab" && r.preventDefault();
    }, R = (r) => {
      r.preventDefault();
      let h = r.clipboardData?.getData("text/plain") ?? "";
      if (o.multiline || (h = h.replace(/\n/g, " ")), !a.value) return;
      const u = window.getSelection(), y = u?.getRangeAt(0);
      if (y) {
        y.deleteContents();
        const X = document.createTextNode(h);
        y.insertNode(X), y.collapse(!1), u?.removeAllRanges(), u?.addRange(y);
      }
      c();
    }, L = () => {
      a.value && _(a.value) === "" && (a.value.innerHTML = "");
    }, V = C(() => ({
      ...o.extraStyles,
      ...ge({ fontColor: "black" }),
      overflow: "auto"
    }));
    return t({ el: a }), (r, h) => (w(), D(F, {
      ref_key: "boxRef",
      ref: i,
      type: e.boxType,
      contenteditable: !e.disabled,
      "extra-styles": V.value,
      "data-placeholder": e.placeholder,
      role: "textbox",
      "aria-multiline": e.multiline,
      "aria-disabled": e.disabled,
      onInput: c,
      onKeydown: I,
      onPaste: R,
      onBlur: L
    }, null, 8, ["type", "contenteditable", "extra-styles", "data-placeholder", "aria-multiline", "aria-disabled"]));
  }
}), le = /* @__PURE__ */ M({
  __name: "Button",
  props: {
    baseType: { default: "panel-d-1" },
    extraStyles: { default: void 0 },
    extraClass: { default: void 0 },
    disabled: { type: Boolean, default: !1 }
  },
  emits: ["click"],
  setup(e, { emit: t }) {
    const n = e, o = t, l = z(!1), i = z(!1), a = C(() => !n.disabled && l.value && i.value), c = C(() => n.disabled), d = (E) => {
      n.disabled || E.button !== 0 || (l.value = !0, i.value = !0);
    }, f = () => {
      n.disabled || (i.value = !0);
    }, s = () => {
      i.value = !1;
    }, m = (E) => {
      n.disabled || E.button !== 0 || (l.value && i.value && o("click"), l.value = !1);
    };
    J(() => {
      window.addEventListener("mouseup", m);
    }), Q(() => {
      window.removeEventListener("mouseup", m);
    });
    const g = C(() => ({
      userSelect: "none",
      width: "fit-content",
      paddingBottom: "4px",
      paddingRight: "4px",
      cursor: c.value ? "not-allowed" : "default",
      ...n.extraStyles
    })), b = C(() => ({
      transform: a.value ? "translate(2px, 2px)" : "translate(0, 0)",
      opacity: c.value ? 0.5 : 1
    })), x = C(() => a.value ? "indent" : n.baseType);
    return (E, $) => (w(), D(F, {
      type: x.value,
      "extra-styles": g.value,
      "extra-class": e.extraClass,
      onMousedown: d,
      onMouseenter: f,
      onMouseleave: s
    }, {
      default: T(() => [
        v("div", {
          style: S(b.value)
        }, [
          B(E.$slots, "default")
        ], 4)
      ]),
      _: 3
    }, 8, ["type", "extra-styles", "extra-class"]));
  }
}), _e = { style: { display: "flex", "align-items": "center" } }, Fe = ["src", "alt"], He = ["checked", "disabled", "value"], St = /* @__PURE__ */ M({
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
    return (i, a) => (w(), k("div", {
      class: se(["checkbox-container", { disabled: e.disabled }]),
      style: S({
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
      v("div", _e, [
        v("img", {
          draggable: "false",
          src: e.modelValue ? e.checkedIcon : e.uncheckedIcon,
          alt: e.modelValue ? "checked" : "unchecked"
        }, null, 8, Fe)
      ]),
      v("input", {
        type: "checkbox",
        checked: e.modelValue,
        disabled: e.disabled,
        value: e.value,
        style: { display: "none" }
      }, null, 8, He),
      e.label ? (w(), k("span", {
        key: 0,
        style: S({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, W(e.label), 5)) : U("", !0)
    ], 6));
  }
}), Nt = /* @__PURE__ */ M({
  __name: "HDivider",
  setup(e) {
    return (t, n) => (w(), D(F, {
      type: "border-groove",
      "extra-styles": {
        height: "0px",
        boxSizing: "border-box",
        borderImageWidth: "0 0 6px 0",
        marginBottom: "6px"
      }
    }));
  }
}), Tt = /* @__PURE__ */ M({
  __name: "MenuDropdown",
  setup(e) {
    return (t, n) => (w(), D(ze, null, {
      trigger: T(() => [
        B(t.$slots, "trigger")
      ]),
      items: T(() => [
        P(F, { type: "panel-d-1" }, {
          default: T(() => [
            B(t.$slots, "items")
          ]),
          _: 3
        })
      ]),
      _: 3
    }));
  }
}), Oe = { style: { display: "flex", "align-items": "center" } }, Pe = ["src"], Xe = ["src"], Ye = ["checked", "disabled", "value", "name"], Bt = /* @__PURE__ */ M({
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
    const n = e, o = t, l = C(() => n.modelValue === n.value), i = (a) => {
      a.preventDefault(), !n.disabled && (l.value || o("update:modelValue", n.value));
    };
    return (a, c) => (w(), k("div", {
      class: se(["radio-container", { disabled: e.disabled }]),
      style: S({
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
      v("div", Oe, [
        l.value ? (w(), k("img", {
          key: 0,
          draggable: "false",
          src: e.checkedIcon
        }, null, 8, Pe)) : (w(), k("img", {
          key: 1,
          draggable: "false",
          src: e.uncheckedIcon
        }, null, 8, Xe))
      ]),
      v("input", {
        type: "radio",
        checked: l.value,
        disabled: e.disabled,
        value: e.value,
        name: e.name,
        style: { display: "none" }
      }, null, 8, Ye),
      e.label ? (w(), k("span", {
        key: 0,
        style: S({ cursor: e.disabled ? "not-allowed" : "pointer" })
      }, W(e.label), 5)) : U("", !0)
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
  ], d = de(o), f = de(l), s = Math.floor(t / a), m = Math.floor(n / a);
  e.width = Math.floor(t * 2) / 2, e.height = Math.floor(n * 2) / 2;
  for (let g = 0; g < m; g++)
    for (let b = 0; b < s; b++) {
      const x = b * a, E = g * a, $ = (b + g) / (s + m - 6), I = (c[g % 8][b % 8] + 0.5) / 64, R = $ > I ? 1 : 0, L = Math.round(d.r * (1 - R) + f.r * R), V = Math.round(d.g * (1 - R) + f.g * R), r = Math.round(d.b * (1 - R) + f.b * R);
      i.fillStyle = `rgb(${L}, ${V}, ${r})`, i.fillRect(x, E, a, a);
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
const Ue = /* @__PURE__ */ M({
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
    const t = e, n = C(() => t.element ?? "span"), o = C(() => {
      const l = ge(t);
      return t.element || (l.display = "contents"), l;
    });
    return (l, i) => (w(), D(Be(n.value), {
      style: S(o.value)
    }, {
      default: T(() => [
        B(l.$slots, "default")
      ]),
      _: 3
    }, 8, ["style"]));
  }
}), Ge = { style: { height: "0", overflow: "visible" } }, qe = { class: "titlebar-content" }, Je = { class: "titlebar-image" }, Qe = ["src"], Ze = { class: "titlebar-text" }, Ke = /* @__PURE__ */ M({
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
      const d = t.gradientColorA || "5555ff", f = t.gradientColorB || "0000aa";
      We(a, a.width, a.height, d, f), c.fillStyle = "#555555", c.fillRect(0, a.height - 2, Math.floor(a.width / 2) * 2, 4);
    }
    function i() {
      const a = n.value;
      if (!a) return;
      const c = a.getContext("2d");
      if (!c) return;
      const d = a.getBoundingClientRect(), f = Math.floor(d.width * 2) / 2, s = Math.floor(d.height * 2) / 2;
      (a.width !== f || a.height !== s) && (a.width = f, a.height = s), l(a, c);
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
    }), (a, c) => (w(), k("div", null, [
      v("div", Ge, [
        v("canvas", {
          ref_key: "canvasRef",
          ref: n,
          style: { width: "100%", height: "34px", display: "block" }
        }, null, 512)
      ]),
      v("div", qe, [
        v("div", Je, [
          v("img", {
            src: e.icon ?? "/win-55-ui/icons/program.png"
          }, null, 8, Qe)
        ]),
        v("div", Ze, [
          P(Ue, {
            shorthand: "Bold12",
            "font-color": "white",
            "font-shadow-color": "black"
          }, {
            default: T(() => [
              ue(W(e.title), 1)
            ]),
            _: 1
          })
        ]),
        B(a.$slots, "buttons"),
        e.placeholderButtons ? (w(), k(ce, { key: 0 }, [
          P(le, {
            "extra-class": "titlebar-button",
            "base-type": "panel-d-2",
            disabled: ""
          }, {
            default: T(() => [...c[0] || (c[0] = [
              v("img", {
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
            default: T(() => [...c[1] || (c[1] = [
              v("img", {
                draggable: "false",
                src: "/win-55-ui/window/_.png"
              }, null, -1)
            ])]),
            _: 1
          }),
          c[3] || (c[3] = v("div", { style: { width: "2px" } }, null, -1)),
          P(le, {
            "extra-class": "titlebar-button",
            "base-type": "panel-d-2",
            disabled: ""
          }, {
            default: T(() => [...c[2] || (c[2] = [
              v("img", {
                draggable: "false",
                src: "/win-55-ui/window/x.png"
              }, null, -1)
            ])]),
            _: 1
          }),
          c[4] || (c[4] = v("div", { style: { width: "2px" } }, null, -1))
        ], 64)) : U("", !0)
      ])
    ]));
  }
}), Mt = /* @__PURE__ */ M({
  __name: "Tooltip",
  props: {
    text: {},
    offsetX: {},
    offsetY: {}
  },
  setup(e) {
    const t = e, n = z(!1), o = Me({ x: 0, y: 0 });
    let l = null;
    const i = () => {
      l = window.setTimeout(() => {
        n.value = !0;
      }, 400);
    }, a = () => {
      l !== null && (clearTimeout(l), l = null), n.value = !1;
    }, c = (f) => {
      o.x = f.clientX + (t.offsetX ?? 24), o.y = f.clientY + (t.offsetY ?? 24);
    }, d = C(() => ({
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
    }), (f, s) => (w(), k("span", {
      onMouseenter: i,
      onMouseleave: a,
      onMousemove: c,
      style: { position: "relative", display: "inline-block" }
    }, [
      B(f.$slots, "default"),
      n.value ? (w(), D(F, {
        key: 0,
        style: S(d.value),
        class: "tooltip",
        type: "white-box"
      }, {
        default: T(() => [
          ue(W(t.text), 1)
        ]),
        _: 1
      }, 8, ["style"])) : U("", !0)
    ], 32));
  }
}), et = {
  class: "titlebar-wrapper",
  style: { height: "34px" }
}, Z = 6, Rt = /* @__PURE__ */ M({
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
    const t = e, n = G(e, "x"), o = G(e, "y"), l = G(e, "width"), i = G(e, "height"), a = t.minWidth ?? 240, c = t.minHeight ?? 40, d = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableHorizontally ?? !1), f = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableVertically ?? !1);
    let s = !1, m = !1, g = "", b = "", x = 0, E = 0, $ = 0, I = 0, R = 0, L = 0;
    const V = z("default");
    function r(p) {
      t.faux || g || (s = !0, x = p.clientX, E = p.clientY, R = n.value, L = o.value, window.addEventListener("mousemove", u), window.addEventListener("mouseup", y));
    }
    function h(p) {
      t.faux || g && (!d && !f || (m = !0, b = g, x = p.clientX, E = p.clientY, $ = l.value, I = i.value, R = n.value, L = o.value, window.addEventListener("mousemove", u), window.addEventListener("mouseup", y)));
    }
    function u(p) {
      if (t.faux) return;
      const N = p.clientX - x, A = p.clientY - E;
      if (s && (n.value = R + N, o.value = L + A), m) {
        const H = b;
        if (d && H.includes("e") && (l.value = Math.max(a, $ + N)), f && H.includes("s") && (i.value = Math.max(c, I + A)), d && H.includes("w")) {
          const j = $ - N, O = Math.max(a, j);
          l.value = O, n.value = R + ($ - O);
        }
        if (f && H.includes("n")) {
          const j = I - A, O = Math.max(c, j);
          i.value = O, o.value = L + (I - O);
        }
      }
    }
    function y() {
      s = !1, m = !1, b = "", window.removeEventListener("mousemove", u), window.removeEventListener("mouseup", y);
    }
    function X(p) {
      if (t.faux) {
        g = "", V.value = "default";
        return;
      }
      if (m) return;
      const N = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableHorizontally ?? !1), A = (t.resizable !== void 0 ? t.resizable : !1) || (t.resizableVertically ?? !1);
      if (!N && !A) {
        g = "", V.value = "default";
        return;
      }
      const j = p.currentTarget.getBoundingClientRect(), O = p.clientX - j.left, ye = j.right - p.clientX, xe = p.clientY - j.top, Ee = j.bottom - p.clientY;
      let Y = "";
      A && (xe < Z ? Y += "n" : Ee < Z && (Y += "s")), N && (O < Z ? Y += "w" : ye < Z && (Y += "e")), g = Y;
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
      V.value = Ce[Y] ?? "default";
    }
    return te(() => [t.resizable, t.resizableHorizontally, t.resizableVertically], () => {
      const p = document.querySelector(`[data-v-${Math.random().toString(36).substr(2, 9)}]`);
      if (p) {
        const N = p.getBoundingClientRect(), A = N.left + N.width / 2, H = N.top + N.height / 2;
        X({
          currentTarget: p,
          clientX: A,
          clientY: H
        });
      }
    }, { immediate: !0 }), (p, N) => (w(), D(F, {
      "extra-class": e.extraClass,
      "extra-styles": t.faux ? e.extraStyles : {
        position: "absolute",
        left: n.value + "px",
        top: o.value + "px",
        width: l.value + "px",
        height: i.value + "px",
        cursor: V.value,
        ...e.extraStyles
      },
      type: "panel-d-2",
      onMousemove: X,
      onMousedown: h
    }, {
      default: T(() => [
        v("div", {
          class: "window-container",
          onMousedown: he(r, ["stop"]),
          style: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%"
          }
        }, [
          v("div", et, [
            P(Ke, {
              title: e.title,
              icon: e.icon,
              "placeholder-buttons": e.placeholderButtons,
              disabled: e.disabled,
              "gradient-color-a": e.faux ? "#888888" : e.gradientColorA,
              "gradient-color-b": e.faux ? "#555555" : e.gradientColorB
            }, {
              buttons: T(() => [
                B(p.$slots, "titlebar-buttons")
              ]),
              _: 3
            }, 8, ["title", "icon", "placeholder-buttons", "disabled", "gradient-color-a", "gradient-color-b"])
          ]),
          v("div", {
            class: "inner-container",
            style: S({
              flex: "1",
              overflowX: t.overflowX ?? "auto",
              overflowY: t.overflowY ?? "auto",
              margin: "2px",
              marginTop: "0",
              boxSizing: "border-box"
            })
          }, [
            B(p.$slots, "default")
          ], 4)
        ], 32)
      ]),
      _: 3
    }, 8, ["extra-class", "extra-styles"]));
  }
}), tt = /* @__PURE__ */ M({
  __name: "NamedPanel",
  props: {
    label: {},
    backgroundColorHint: { default: "#CBCBCB" }
  },
  setup(e) {
    return (t, n) => (w(), D(F, {
      type: "border-groove",
      "extra-styles": { padding: "10px", margin: "10px" }
    }, {
      default: T(() => [
        v("div", {
          class: "label",
          style: S({ backgroundColor: e.backgroundColorHint })
        }, W(e.label), 5),
        B(t.$slots, "default", {}, void 0, !0)
      ]),
      _: 3
    }));
  }
}), nt = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, l] of t)
    n[o] = l;
  return n;
}, $t = /* @__PURE__ */ nt(tt, [["__scopeId", "data-v-9a25af1b"]]), ve = "/win-55-ui/emoji", ae = `${ve}/emoji-registry.csv`;
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
    const c = i.slice(0, a).trim(), d = we(i.slice(a + 1));
    c && d && (t[c] = d);
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
function zt() {
  K = null, re = null, ee = null;
}
async function At(e, t = {}) {
  const o = (await ne(t))[e];
  return o ? be(o, t) : null;
}
function be(e, t = {}) {
  return `${ot(t.basePath ?? ve)}/${we(e)}.gif`;
}
async function It(e = {}) {
  return ne(e);
}
async function jt(e, t = {}) {
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
function ht(e) {
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
function gt() {
  return `${it * st}px`;
}
function pt(e, t, n) {
  const o = document.createElement("span"), l = document.createElement("img");
  return o.className = n.className ?? at, o.contentEditable = "false", o.dataset.win55Emoji = e, o.role = "img", o.ariaLabel = e, o.style.setProperty("--win55-emoji-size", gt()), l.src = be(t, n), l.alt = e, l.className = rt, l.draggable = !1, l.dataset.win55EmojiImg = "true", o.append(l), o;
}
function vt(e, t, n, o) {
  if (!e.parentElement)
    return;
  const l = e.nodeValue ?? "";
  let i = 0, a = !1;
  const c = document.createDocumentFragment();
  t.lastIndex = 0;
  for (const d of l.matchAll(t)) {
    const f = d[0], s = d.index, m = n[f];
    s === void 0 || !m || (a = !0, s > i && c.append(document.createTextNode(l.slice(i, s))), c.append(pt(f, m, o)), i = s + f.length);
  }
  a && (i < l.length && c.append(document.createTextNode(l.slice(i))), e.replaceWith(c));
}
async function wt(e, t) {
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
  const a = Le(e);
  for (const c of ht(e))
    vt(c, i, l, n);
  Ve(e, a);
}
function ie(e, t) {
  t.renderQueued || (t.renderQueued = !0, t.renderFrame = window.requestAnimationFrame(() => {
    t.renderQueued = !1, t.renderFrame = null, wt(e, t).catch((n) => {
      console.warn("[win-55-ui] Could not render custom emoji.", n);
    });
  }));
}
function bt(e, t) {
  const n = window.getSelection();
  if (!n || n.rangeCount === 0 || !t.clipboardData)
    return;
  const o = n.getRangeAt(0);
  if (!o.intersectsNode(e))
    return;
  const l = o.cloneContents(), i = _(l);
  i && (t.clipboardData.setData("text/plain", i), t.preventDefault());
}
function yt(e, t) {
  const n = new MutationObserver(() => {
    ie(e, t);
  });
  return n.observe(e, {
    characterData: !0,
    childList: !0,
    subtree: !0
  }), n;
}
const xt = {
  mounted(e, t) {
    const n = {
      binding: t,
      copyHandler: (o) => bt(e, o),
      observer: null,
      renderFrame: null,
      renderQueued: !1,
      version: 0
    };
    n.observer = yt(e, n), q.set(e, n), e.addEventListener("copy", n.copyHandler), ie(e, n);
  },
  updated(e, t) {
    const n = q.get(e);
    n && (n.binding = t, ie(e, n));
  },
  unmounted(e) {
    const t = q.get(e);
    t && (t.observer?.disconnect(), t.renderFrame !== null && window.cancelAnimationFrame(t.renderFrame), e.removeEventListener("copy", t.copyHandler)), q.delete(e);
  }
}, Dt = xt, Lt = (e, t = 30, n = 48, o = 30) => {
  const l = z(
    Array.from({ length: e }, (d, f) => ({
      sin: Math.sin(0 + f * Math.PI * 2 / e),
      cos: Math.cos(0 + f * Math.PI * 2 / e + Math.PI / 4)
    }))
  );
  let i, a = 0;
  const c = () => {
    const d = Date.now();
    if (d - a >= 1e3 / t) {
      const f = Array.from({ length: e }, (b, x) => ({
        sin: Math.sin(d / (1e3 + x * 200) + x * Math.PI * 2 / e),
        cos: Math.cos(d / (3e3 + x * 400) + x * Math.PI * 2 / e + Math.PI / 4)
      })), s = f.map((b) => n + b.sin * o), m = e * n, g = s.reduce((b, x) => b + x, 0);
      if (g > 0) {
        const b = m / g, x = f.map((E) => ({
          sin: ((n + E.sin * o) * b - n) / o,
          cos: E.cos
        }));
        l.value = x;
      } else
        l.value = f;
      a = d;
    }
    i = requestAnimationFrame(c);
  };
  return J(() => {
    i = requestAnimationFrame(c);
  }), Q(() => {
    cancelAnimationFrame(i);
  }), { values: l };
};
function Vt(e) {
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
  Ct as Balloon,
  ze as BaseDropdown,
  kt as BaseInput,
  F as Box,
  le as Button,
  St as Checkbox,
  Nt as HDivider,
  Tt as MenuDropdown,
  $t as NamedPanel,
  Bt as RadioButton,
  Ke as Titlebar,
  Mt as Tooltip,
  Ue as Typography,
  Rt as Window,
  Dt as customEmojiDirective,
  We as drawAngledBayerDitherGradient,
  xt as emojiDirective,
  At as getEmojiGifPath,
  be as getEmojiGifPathFromCode,
  It as getEmojiRegistry,
  Le as getSelectionOffset,
  _ as getTextWithCustomEmoji,
  jt as hasEmoji,
  ne as loadEmojiRegistry,
  Vt as registerGlobalImageErrorHandler,
  zt as resetEmojiRegistryCache,
  Ve as restoreSelectionOffset,
  ge as typographyStyles,
  Lt as useSineWave
};
