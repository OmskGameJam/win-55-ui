<script setup lang="ts">
import { ref, watch } from 'vue'
import { EMOJI_DETECTION_PATTERN, getEmojiGifPath, getEmojiGifPathFromCode } from '../helpers/emoji'
import { getFallbackEmojiImageSrc } from '../directives/emoji'
import { resolveShortcode } from '../helpers/shortcodes'

const props = defineProps<{
  /** A literal unicode emoji (e.g. "🍕") or a shortcode alias (e.g. "pizza"). */
  emoji: string
}>()

const BASE_EMOJI_SIZE = 15
const UI_SCALE = 2
const LITERAL_EMOJI_PATTERN = new RegExp(`^(?:${EMOJI_DETECTION_PATTERN})$`, 'u')

const src = ref('')
const alt = ref(props.emoji)
const width = ref(BASE_EMOJI_SIZE * UI_SCALE)
const height = ref(BASE_EMOJI_SIZE * UI_SCALE)

async function resolveSrc(value: string): Promise<void> {
  if (LITERAL_EMOJI_PATTERN.test(value)) {
    alt.value = value
    const gifPath = await getEmojiGifPath(value)
    src.value = gifPath ?? getFallbackEmojiImageSrc(value)
    return
  }

  const resolved = await resolveShortcode(value)

  if (resolved) {
    alt.value = resolved.emoji
    src.value = getEmojiGifPathFromCode(resolved.code)
    return
  }

  console.warn(`[win-55-ui] Emoji: could not resolve "${value}" as an emoji or a shortcode alias.`)
  alt.value = value
  src.value = ''
}

watch(() => props.emoji, (value) => { void resolveSrc(value) }, { immediate: true })

/* Registry GIFs aren't guaranteed to be a 15x15 square (some are 15x14 etc.),
   so the real 2x size is only known once the browser has decoded the image. */
function onLoad(event: Event): void {
  const image = event.target as HTMLImageElement
  width.value = image.naturalWidth * UI_SCALE
  height.value = image.naturalHeight * UI_SCALE
}
</script>

<template>
  <img
    class="win55-emoji-standalone"
    :src="src"
    :alt="alt"
    :width="width"
    :height="height"
    draggable="false"
    @load="onLoad"
  />
</template>
