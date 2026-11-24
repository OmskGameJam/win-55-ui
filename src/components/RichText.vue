<script setup lang="ts">
import { computed, ref, useSlots, type VNode } from 'vue'
import RichTextNode from './RichTextNode.vue'
import { loadShortcodeIndex } from '../helpers/shortcodes'
import { loadEmojiRegistry, type EmojiRegistry } from '../helpers/emoji'
import { parseRichText, type ShortcodeLookup } from '../helpers/richText'
import { cursorWeakDirective } from '../directives/cursor'

// weak: a consumer's plain v-cursor overrides this default.
const vCursor = cursorWeakDirective

const props = withDefaults(defineProps<{ allowLinks?: boolean; allowSizes?: boolean }>(), {
  allowLinks: false,
  allowSizes: false,
})

const slots = useSlots()

/*
 * Async: renders plain until emoji data loads, then re-renders. Shortcode and
 * raw emoji both become `emoji` RichNodes.
 */
const shortcodeMap = ref<Map<string, { emoji: string; code: string }> | null>(null)
const emojiRegistry = ref<EmojiRegistry | null>(null)

void loadShortcodeIndex().then((entries) => {
  const map = new Map<string, { emoji: string; code: string }>()

  for (const entry of entries) {
    for (const shortcode of entry.shortcodes) {
      map.set(shortcode.toLowerCase(), { emoji: entry.emoji, code: entry.code })
    }
  }

  shortcodeMap.value = map
})

void loadEmojiRegistry().then((registry) => {
  emojiRegistry.value = registry
})

const shortcodeLookup = computed<ShortcodeLookup | null>(() => {
  const map = shortcodeMap.value
  return map ? { get: (name: string) => map.get(name) } : null
})

/** Flattens the default slot to text. */
function slotToText(vnodes: VNode[]): string {
  return vnodes.map((node) => {
    if (typeof node.children === 'string') return node.children
    if (Array.isArray(node.children)) return slotToText(node.children as VNode[])
    return ''
  }).join('')
}

const nodes = computed(() =>
  parseRichText(slotToText(slots.default?.() ?? []), shortcodeLookup.value, emojiRegistry.value))
</script>

<template>
  <span v-cursor="'text'" data-win55-richtext style="display: contents;">
    <RichTextNode v-for="(node, i) in nodes" :key="i" :node="node" :allow-links="props.allowLinks" :allow-sizes="props.allowSizes" />
  </span>
</template>
