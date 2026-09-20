<script setup lang="ts">
import Box from './Box.vue';

withDefaults(defineProps<{
  label: string
  backgroundColorHint?: string
}>(), {
  backgroundColorHint: '#CBCBCB'
})

</script>

<template>
  <Box type="border-groove" :extra-styles="{padding: '10px', margin: '10px'}">
    
    <div class="label">
      <div class="line-hider" :style="{backgroundColor: backgroundColorHint}"></div>
      <div class="label-text">{{ label }}</div>
    </div>
    <slot></slot>
  </Box>
</template>

<style scoped>
  .label {
    position: absolute;
    /* bottom: calc(100% - 10px); */
    top: -22px;
    padding: 4px;
  }

  .line-hider {
    width: 100%;
    height: 4px;
    position: absolute;
    top: 16px;
    left: -2px;
  }

  .label-text {
    position: relative;
    overflow: hidden;
    word-wrap: none;
    height: 1em;
  }
</style>