<script setup lang="ts">
import Button from './Button.vue'
import { useCursorContext } from '../helpers/cursorContext'
import { simulateWork } from '../helpers/simulateWork'

const props = defineProps<{
  mode: 'busy' | 'progress'
  label: string
}>()

// No template ref to a CursorContext anywhere in this file - inject() finds the nearest ancestor
// regardless of how deep this component is nested under it (see App.vue's kitchen sink demo).
const context = useCursorContext()

function trigger(): void {
  if (!context) return
  const track = props.mode === 'busy' ? context.addBusy : context.addProgress
  simulateWork(track, 3000) // handed to a function with zero Vue imports, called from there instead
}
</script>

<template>
  <Button @click="trigger">{{ label }}</Button>
</template>
