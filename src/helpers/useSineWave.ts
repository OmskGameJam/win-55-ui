import { ref, onMounted, onUnmounted } from 'vue'

export const useSineWave = (n: number, fps: number = 30, baseHeight: number = 48, amplitude: number = 30) => {
  const values = ref<Array<{sin: number, cos: number}>>(
    Array.from({ length: n }, (_, i) => ({
      sin: Math.sin(0 + (i * Math.PI * 2)/n),
      cos: Math.cos(0 + (i * Math.PI * 2)/n + Math.PI/4)
    }))
  )

  let frame: number
  let lastUpdate = 0

  const update = () => {
    const now = Date.now()
    if (now - lastUpdate >= 1000/fps) {
      // Generate raw values
      const rawValues = Array.from({ length: n }, (_, i) => ({
        sin: Math.sin(now / (1000 + i*200) + (i * Math.PI * 2)/n),
        cos: Math.cos(now / (3000 + i*400) + (i * Math.PI * 2)/n + Math.PI/4)
      }))

      // Calculate what the actual heights would be with your formula
      const rawHeights = rawValues.map(v => baseHeight + v.sin * amplitude)

      // Calculate target total height (constant)
      const targetTotalHeight = n * baseHeight

      // Normalize heights to maintain constant sum
      const currentTotalHeight = rawHeights.reduce((a, b) => a + b, 0)

      if (currentTotalHeight > 0) {
        const scaleFactor = targetTotalHeight / currentTotalHeight

        const normalizedValues = rawValues.map((v) => {
          const newSin = ((baseHeight + v.sin * amplitude) * scaleFactor - baseHeight) / amplitude

          return {
            sin: newSin,
            cos: v.cos
          }
        })

        values.value = normalizedValues
      } else {
        values.value = rawValues
      }

      lastUpdate = now
    }
    frame = requestAnimationFrame(update)
  }

  onMounted(() => {
    frame = requestAnimationFrame(update)
  })

  onUnmounted(() => {
    cancelAnimationFrame(frame)
  })

  return { values }
}
