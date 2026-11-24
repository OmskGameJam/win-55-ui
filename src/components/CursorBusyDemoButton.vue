<script setup lang="ts">
import Button from './Button.vue'
import { useCursorContext } from '../helpers/cursorContext'
import { simulateWork } from '../helpers/simulateWork'

const props = defineProps<{
  mode: 'busy' | 'progress'
  label: string
}>()

// Inject the nearest ancestor context; no template ref needed.
const context = useCursorContext()

function trigger(): void {
  if (!context) return
  const track = props.mode === 'busy' ? context.addBusy : context.addProgress
  simulateWork(track, 3000)
}
</script>

<template>
  <Button @click="trigger">{{ label }}</Button>
</template>
