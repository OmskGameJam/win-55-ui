<script setup lang="ts">
import Box from './Box.vue'
</script>

<template>
  <Box
    type="border-groove"
    :extra-styles="{
      height: '0px',
      boxSizing: 'border-box',
      borderImageWidth: '0 0 6px 0',
      marginBottom: '6px',
    }"
  />
</template>
