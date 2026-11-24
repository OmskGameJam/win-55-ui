import { type CSSProperties } from 'vue';
import type { BoxType } from './Box.vue';
import { type ComboBoxItem } from '../helpers/comboBox';
declare const _default: <T>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_expose?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: __VLS_PrettifyLocal<Pick<Partial<{}> & Omit<{
        readonly onSelect?: ((selection: string | ComboBoxItem<T>) => any) | undefined;
        readonly "onUpdate:modelValue"?: ((value: string) => any) | undefined;
    } & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, never>, "onSelect" | "onUpdate:modelValue"> & {
        modelValue: string;
        placeholder?: string;
        disabled?: boolean;
        maxLength?: number;
        boxType?: BoxType;
        /** Styles for the whole field/button row; the inner field is managed by the component. */
        extraStyles?: CSSProperties;
        showEmojiButton?: boolean;
        /**
         * Either rich rows (`{ key, data }`, select emits the row object) or plain
         * strings (`select` emits the string). With plain strings and no `select`
         * listener, choosing a row updates `modelValue`.
         */
        data?: readonly ComboBoxItem<T>[] | readonly string[];
    } & Partial<{}>> & import("vue").PublicProps;
    expose(exposed: import("vue").ShallowUnwrapRef<{}>): void;
    attrs: any;
    slots: {};
    emit: ((evt: "select", selection: string | ComboBoxItem<T>) => void) & ((evt: "update:modelValue", value: string) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
export default _default;
type __VLS_PrettifyLocal<T> = {
    [K in keyof T]: T[K];
} & {};
