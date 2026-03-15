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
    <div class="label" :style="{backgroundColor: backgroundColorHint}">{{ label }}</div>
    <slot></slot>
  </Box>
</template>

<style scoped>
  .label {
    background-color: rgb(203, 203, 203);
    position: absolute;
    top: -20px;
    padding: 4px;
  }
</style>