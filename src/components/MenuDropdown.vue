<script setup lang="ts">
import BaseDropdown from './BaseDropdown.vue'
import Box from './Box.vue'
</script>

<template>
  <BaseDropdown>
    <template #trigger>
      <span>
        <slot name="trigger" />
      </span>
    </template>
    <template #items>
      <Box type="panel-d-1">
        <div class="menu-dropdown-items">
          <slot name="items" />
        </div>
      </Box>
    </template>
  </BaseDropdown>
</template>

<style>
  .menu-dropdown-items > :hover {
    background-color: var(--win55-cga-blue);
    color: var(--win55-cga-white);
  }
</style>
