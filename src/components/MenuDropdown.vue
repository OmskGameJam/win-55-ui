<script setup lang="ts">
import BaseDropdown from './BaseDropdown.vue'
import Box from './Box.vue'
</script>

<template>
  <BaseDropdown>
    <template #trigger>
      <slot name="trigger" />
    </template>
    <template #items>
      <Box type="panel-d-1">
        <slot name="items" />
      </Box>
    </template>
  </BaseDropdown>
</template>
