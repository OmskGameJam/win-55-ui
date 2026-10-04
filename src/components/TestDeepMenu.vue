<script setup lang="ts">
import Button from './Button.vue'
import HDivider from './HDivider.vue'
import MenuDropdown from './MenuDropdown.vue'

withDefaults(defineProps<{
  level?: number
  maxLevel?: number
}>(), {
  level: 1,
  maxLevel: 50,
})
</script>

<template>
  <MenuDropdown>
    <template #trigger>
      <Button v-if="level === 1">Deep menu ({{ maxLevel }} levels)</Button>
      <div v-else>Level {{ level }}</div>
    </template>
    <template #items>
      <div>Item {{ level }}a</div>
      <div>Item {{ level }}b</div>
      <HDivider />
      <MenuDropdown>
        <template #trigger>
          <div>Side {{ level }}</div>
        </template>
        <template #items>
          <div>Side {{ level }} item 1</div>
          <div>Side {{ level }} item 2</div>
        </template>
      </MenuDropdown>
      <TestDeepMenu v-if="level < maxLevel" :level="level + 1" :max-level="maxLevel" />
    </template>
  </MenuDropdown>
</template>
