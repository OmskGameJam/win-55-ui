<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Box from './Box.vue'

const lineCount = ref(0)
let tick = 0
let timer = 0

function step() {
  if (tick < 30) lineCount.value = tick + 1
  else if (tick < 60) lineCount.value = 30
  else if (tick < 90) lineCount.value = 89 - tick
  else lineCount.value = 0
  tick = (tick + 1) % 120
}

onMounted(() => {
  step()
  timer = window.setInterval(step, 100)
})

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <Box type="textarea" overflow="auto" :extra-styles="{ width: '400px', height: '200px' }">
    <div v-for="n in lineCount" :key="n">Line {{ n }} of {{ lineCount }}</div>
  </Box>
</template>
