import { type CursorMode, type CursorRole } from '../helpers/cursorContext';
interface Props {
    element?: string;
    /** `undefined` inherits the nearest context's scheme. */
    scheme?: string;
    /** Pin one cursor for the subtree; unset derives it from each element's native `cursor`. */
    role?: CursorRole;
    /** OS cursor instead of the kit cursor. `undefined` inherits; `false` re-enables locally. */
    disabled?: boolean;
    /** `native` paints real CSS cursors; `immersive` hides them and draws sprites in an overlay. */
    mode?: CursorMode;
    /** Publishes scheme + cursor props on `<html>` and mounts the overlay, reaching teleported content. */
    root?: boolean;
    /** `root` only: hard-disable everywhere, beating nested re-enables. Not the same as `disabled`. */
    disableAll?: boolean;
}
declare function addBusy(promise: Promise<unknown>): void;
declare function addProgress(promise: Promise<unknown>): void;
declare function resolveRole(role: string): string | undefined;
declare function resolveRoleCss(role: string): string | undefined;
declare var __VLS_7: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_7) => any;
};
declare const __VLS_component: import("vue").DefineComponent<Props, {
    addBusy: typeof addBusy;
    addProgress: typeof addProgress;
    resolveRole: typeof resolveRole;
    resolveRoleCss: typeof resolveRoleCss;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<Props> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithSlots<typeof __VLS_component, __VLS_Slots>;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
