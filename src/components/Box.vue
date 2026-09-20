<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, ref } from 'vue'
import ScrollBar from './ScrollBar.vue'
import type { BoxOverflow } from '../helpers/scroll'
import { useScrollContainer } from '../helpers/useScrollContainer'

export type BoxType =
  | 'indent'
  | 'indent-dark'
  | 'panel-d-1'
  | 'panel-d-2'
  | 'textarea'
  | 'border-groove'
  | 'white-box'
  | 'notification'

const props = defineProps<{
  type: BoxType
  overflow?: BoxOverflow
  overflowX?: BoxOverflow
  overflowY?: BoxOverflow
  forgiveVerticalOverflow?: boolean
  extraStyles?: CSSProperties
  extraClass?: string
}>()

const scrollTop = defineModel<number>('scrollTop')
const scrollLeft = defineModel<number>('scrollLeft')

const rootRef = ref<HTMLDivElement | null>(null)

const {
  wrapperRef,
  spacerRef,
  scrollMode,
  showV,
  showH,
  metrics,
  rootStyle,
  wrapperStyle,
  onScroll,
  snapNow,
  scrollToAxis,
  scrollByAxis,
} = useScrollContainer(props, scrollTop, scrollLeft)

const style = computed<CSSProperties>(() => ({
  '--img': `url(/win-55-ui/${props.type}.png)`,
  ...rootStyle.value,
  ...props.extraStyles,
} as CSSProperties))

defineExpose({ el: rootRef, scrollEl: wrapperRef, verticalBarVisible: showV })
</script>

<template>
  <div
    ref="rootRef"
    :class="['border-9-base', `border-9-${type}`, extraClass ?? '']"
    :style="style"
  >
    <template v-if="scrollMode">
      <ScrollBar
        v-if="showV"
        class="win55-sb-v"
        orientation="vertical"
        :scroll-pos="metrics.top"
        :viewport-size="metrics.clientH"
        :content-size="metrics.scrollH"
        @scroll-to="scrollToAxis('y', $event)"
        @scroll-by="scrollByAxis('y', $event)"
      />
      <ScrollBar
        v-if="showH"
        class="win55-sb-h"
        orientation="horizontal"
        :scroll-pos="metrics.left"
        :viewport-size="metrics.clientW"
        :content-size="metrics.scrollW"
        @scroll-to="scrollToAxis('x', $event)"
        @scroll-by="scrollByAxis('x', $event)"
      />
      <div v-if="showV && showH" class="win55-sb-corner" />
      <div ref="wrapperRef" class="win55-scroll-wrapper" :style="wrapperStyle" @scroll="onScroll" @scrollend="snapNow">
        <slot />
        <div ref="spacerRef" class="win55-scroll-spacer" aria-hidden="true" />
      </div>
    </template>
    <slot v-else />
  </div>
</template>

<style scoped>
.win55-scroll-wrapper {
  grid-column: 1;
  grid-row: 1;
  min-width: 0;
  min-height: 0;
  position: relative;
  scrollbar-width: none;
}

.win55-scroll-wrapper::-webkit-scrollbar {
  display: none;
}

.win55-scroll-spacer {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: 1px;
  visibility: hidden;
  pointer-events: none;
}

.win55-sb-v {
  grid-column: 2;
  grid-row: 1;
}

.win55-sb-h {
  grid-column: 1;
  grid-row: 2;
}

.win55-sb-corner {
  grid-column: 2;
  grid-row: 2;
  background: #999;
}
</style>
