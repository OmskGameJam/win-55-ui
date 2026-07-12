<script setup lang="ts">
import { computed, ref, useSlots, type VNode } from 'vue'
import RichTextNode from './RichTextNode.vue'
import { loadShortcodeIndex } from '../helpers/shortcodes'
import { parseRichText, type ShortcodeLookup } from '../helpers/richText'

const props = withDefaults(defineProps<{ allowLinks?: boolean }>(), {
  allowLinks: false,
})

const slots = useSlots()

/*
 * Populated asynchronously; nodes render without emoji resolution until this
 * loads, then re-render once it's ready (same fetch-and-cache pattern as
 * the rest of the emoji system).
 */
const shortcodeMap = ref<Map<string, { emoji: string; code: string }> | null>(null)

void loadShortcodeIndex().then((entries) => {
  const map = new Map<string, { emoji: string; code: string }>()

  for (const entry of entries) {
    for (const shortcode of entry.shortcodes) {
      map.set(shortcode.toLowerCase(), { emoji: entry.emoji, code: entry.code })
    }
  }

  shortcodeMap.value = map
})

const shortcodeLookup = computed<ShortcodeLookup | null>(() => {
  const map = shortcodeMap.value
  return map ? { get: (name: string) => map.get(name) } : null
})

/** Flattens the default slot's vnodes down to their raw text content. */
function slotToText(nodes: VNode[]): string {
  return nodes.map((node) => {
    if (typeof node.children === 'string') return node.children
    if (Array.isArray(node.children)) return slotToText(node.children as VNode[])
    return ''
  }).join('')
}

const nodes = computed(() => parseRichText(slotToText(slots.default?.() ?? []), shortcodeLookup.value))
</script>

<template>
  <RichTextNode v-for="(node, i) in nodes" :key="i" :node="node" :allow-links="props.allowLinks" />
</template>
