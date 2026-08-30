interface Props {
    element?: string;
    scheme?: string;
    /** Pins one cursor for the whole subtree. Left unset, each element's cursor is derived from its native `cursor` (link -> `link`, text field -> `text`, ...) and resolved against `scheme` - see CursorOverlay.vue. */
    role?: string;
    /** Turns the kit cursor off for this subtree - the OS cursor renders instead. Inherits; a nested `<CursorContext :disabled="false">` turns it back on. */
    disabled?: boolean;
    /**
     * Puts `cursor: none` + the ambient scheme on `<html>` instead of this wrapper's element, and
     * mounts CursorOverlay. For the one outermost CursorContext of an app: CSS inheritance follows the
     * real DOM, so `<Teleport>`-ed content (dropdown menus, Window, ...) lands under `<body>` outside
     * this wrapper's subtree - only a style set on `<html>` reaches everything. `<html>` not `<body>`
     * because body's box is only as tall as its content (Meyer reset), so it isn't reliably an
     * ancestor of every hoverable pixel.
     */
    root?: boolean;
    /** `root` only: hard-disables the kit cursor everywhere, overriding any nested re-enable. */
    disableAll?: boolean;
}
declare function addBusy(promise: Promise<unknown>): void;
declare function addProgress(promise: Promise<unknown>): void;
declare function resolveRole(role: string): Promise<string | undefined>;
declare var __VLS_7: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_7) => any;
};
declare const __VLS_component: import("vue").DefineComponent<Props, {
    addBusy: typeof addBusy;
    addProgress: typeof addProgress;
    resolveRole: typeof resolveRole;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
