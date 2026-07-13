<script setup lang="ts">
import Typography from './Typography.vue'
import { getEmojiGifPathFromCode } from '../helpers/emoji'
import { getFallbackEmojiImageSrc } from '../directives/emoji'
import type { RichNode } from '../helpers/richText'

withDefaults(defineProps<{ node: RichNode; allowLinks?: boolean; allowSizes?: boolean }>(), {
  allowLinks: false,
  allowSizes: false,
})

function emojiImageSrc(code: string | undefined, emoji: string): string {
  return code ? getEmojiGifPathFromCode(code) : getFallbackEmojiImageSrc(emoji)
}
</script>

<template>
  <template v-if="node.type === 'text'">{{ node.value }}</template>

  <br v-else-if="node.type === 'break'" />

  <Typography v-else-if="node.type === 'bold'" is-bold>
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" :allow-sizes="allowSizes" />
  </Typography>

  <Typography v-else-if="node.type === 'italic'" is-italic>
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" :allow-sizes="allowSizes" />
  </Typography>

  <span v-else-if="node.type === 'underline'" style="text-decoration: underline;">
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" :allow-sizes="allowSizes" />
  </span>

  <span v-else-if="node.type === 'strike'" style="text-decoration: line-through;">
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" :allow-sizes="allowSizes" />
  </span>

  <Typography v-else-if="node.type === 'color'" :font-color="node.value">
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" :allow-sizes="allowSizes" />
  </Typography>

  <Typography v-else-if="node.type === 'size' && allowSizes" :font-size="node.value">
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" :allow-sizes="allowSizes" />
  </Typography>

  <!-- [size] with sizes disabled silently fails: renders its children unwrapped, no size change. -->
  <template v-else-if="node.type === 'size'">
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" :allow-sizes="allowSizes" />
  </template>

  <!-- [url] with links disabled silently fails: renders its children unwrapped, no <a>. -->
  <a
    v-else-if="node.type === 'url' && allowLinks"
    :href="node.href"
    target="_blank"
    rel="noopener noreferrer"
    class="richtext-link"
  >
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" :allow-sizes="allowSizes" />
  </a>

  <template v-else-if="node.type === 'url'">
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" :allow-sizes="allowSizes" />
  </template>

  <span
    v-else-if="node.type === 'emoji'"
    class="win55-emoji"
    role="img"
    :aria-label="node.emoji"
    :data-win55-emoji="node.emoji"
    style="--win55-emoji-size: 30px;"
  >
    <img class="win55-emoji-image" :src="emojiImageSrc(node.code, node.emoji)" :alt="node.emoji" draggable="false" />
  </span>
</template>
