<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { drawAngledBayerDitherGradient } from '../helpers/bayerMatrix'
import Button from './Button.vue'
import Typography from './Typography.vue'

const props = defineProps<{
  title: string
  icon: string
  placeholderButtons?: boolean
  disabled?: boolean
  gradientColorA?: string
  gradientColorB?: string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let resizeObserver: ResizeObserver | null = null

function draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
  const colorA = props.gradientColorA || '5555ff'
  const colorB = props.gradientColorB || '0000aa'
  
  drawAngledBayerDitherGradient(canvas, canvas.width, canvas.height, colorA, colorB)
  context.fillStyle = '#555555'
  context.fillRect(0, canvas.height - 2, Math.floor(canvas.width / 2) * 2, 4)
}

function resizeCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  const context = canvas.getContext('2d')
  if (!context) return

  const rect = canvas.getBoundingClientRect()
  const width = Math.floor(rect.width * 2) / 2
  const height = Math.floor(rect.height * 2) / 2

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }

  draw(canvas, context)
}

// Redraw when gradient colors change
watch(() => [props.gradientColorA, props.gradientColorB], () => {
  if (canvasRef.value) {
    const context = canvasRef.value.getContext('2d')
    if (context) {
      draw(canvasRef.value, context)
    }
  }
})

onMounted(() => {
  resizeCanvas()

  if (canvasRef.value) {
    resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })
    resizeObserver.observe(canvasRef.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})
</script>

<template>
  <div>
    <div style="height: 0; overflow: visible">
      <canvas
        ref="canvasRef"
        style="width: 100%; height: 34px; display: block"
      />
    </div>
    <div class="titlebar-content">
      <div class="titlebar-image">
        <img :src="icon" />
      </div>
      <div class="titlebar-text">
        <Typography shorthand="Bold12" font-color="white" font-shadow-color="black">
          {{ title }}
        </Typography>
      </div>
      
      <!-- Slot for custom buttons -->
      <slot name="buttons"></slot>
      
      <!-- Placeholder buttons when slot is empty and placeholderButtons is true -->
      <template v-if="placeholderButtons">
        <Button 
          extra-class="titlebar-button" 
          base-type="panel-d-2"
          disabled
        >
          <img draggable="false" src="/win-55-ui/window/o.png" />
        </Button>
        <Button 
          extra-class="titlebar-button" 
          base-type="panel-d-2"
          disabled
        >
          <img draggable="false" src="/win-55-ui/window/_.png" />
        </Button>
        <div style="width: 2px"><!-- Он тут реально! --></div>
        <Button 
          extra-class="titlebar-button" 
          base-type="panel-d-2"
          disabled
        >
          <img draggable="false" src="/win-55-ui/window/x.png" />
        </Button>
        <div style="width: 2px"><!-- Он тут реально! --></div>
      </template>
    </div>
  </div>
</template>