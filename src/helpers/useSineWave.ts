import { ref, onMounted, onUnmounted } from 'vue'

export const useSineWave = (n: number, fps: number = 20, baseHeight: number = 48, amplitude: number = 30) => {
  const values = ref<Array<{sin: number, cos: number}>>(
    Array.from({ length: n }, (_, i) => ({
      sin: Math.sin(0 + (i * Math.PI * 2)/n),
      cos: Math.cos(0 + (i * Math.PI * 2)/n + Math.PI/4)
    }))
  )

  let frame = 0
  let lastUpdate = 0
  const minInterval = fps > 0 ? 1000 / fps : 0

  const update = () => {
    frame = requestAnimationFrame(update)

    const now = Date.now()
    if (now - lastUpdate < minInterval) return
    lastUpdate = now

    const rawValues = Array.from({ length: n }, (_, i) => ({
      sin: Math.sin(now / (1000 + i*200) + (i * Math.PI * 2)/n),
      cos: Math.cos(now / (3000 + i*400) + (i * Math.PI * 2)/n + Math.PI/4)
    }))

    const rawHeights = rawValues.map(v => baseHeight + v.sin * amplitude)
    const targetTotalHeight = n * baseHeight
    const currentTotalHeight = rawHeights.reduce((a, b) => a + b, 0)

    if (currentTotalHeight > 0) {
      const scaleFactor = targetTotalHeight / currentTotalHeight

      values.value = rawValues.map((v) => ({
        sin: ((baseHeight + v.sin * amplitude) * scaleFactor - baseHeight) / amplitude,
        cos: v.cos
      }))
    } else {
      values.value = rawValues
    }
  }

  onMounted(() => {
    frame = requestAnimationFrame(update)
  })

  onUnmounted(() => {
    cancelAnimationFrame(frame)
  })

  return { values }
}
