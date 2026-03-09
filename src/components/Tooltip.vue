<script setup lang="ts">
import { ref, reactive, onUnmounted, computed, type CSSProperties } from 'vue';
import Box from './Box.vue';

const props = defineProps<{
  text: string;
  offsetX?: number;
  offsetY?: number;
}>();

const visible = ref(false);
const cursor = reactive({ x: 0, y: 0 });
let hoverTimeout: number | null = null;

const startHover = () => {
  hoverTimeout = window.setTimeout(() => {
    visible.value = true;
  }, 400);
};

const endHover = () => {
  if (hoverTimeout !== null) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }
  visible.value = false;
};

const updateCursor = (event: MouseEvent) => {
  cursor.x = event.clientX + (props.offsetX ?? 24);
  cursor.y = event.clientY + (props.offsetY ?? 24);
};

const tooltipStyle = computed<CSSProperties>(() => ({
  position: 'fixed',
  left: `${cursor.x}px`,
  top: `${cursor.y}px`,
  pointerEvents: 'none',  // now TS understands it's valid
  whiteSpace: 'nowrap',
  zIndex: 1000,
}));

onUnmounted(() => {
  if (hoverTimeout !== null) clearTimeout(hoverTimeout);
});
</script>

<template>
  <span
    @mouseenter="startHover"
    @mouseleave="endHover"
    @mousemove="updateCursor"
    style="position: relative; display: inline-block;"
  >
    <slot />
    <Box
      v-if="visible"
      :style="tooltipStyle"
      class="tooltip"
      type="white-box"
    >
      {{ props.text }}
    </Box>
  </span>
</template>