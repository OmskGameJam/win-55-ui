<script setup lang="ts">
import Typography from './Typography.vue'
import { getEmojiGifPathFromCode } from '../helpers/emoji'
import type { RichNode } from '../helpers/richText'

withDefaults(defineProps<{ node: RichNode; allowLinks?: boolean }>(), {
  allowLinks: false,
})
</script>

<template>
  <template v-if="node.type === 'text'">{{ node.value }}</template>

  <br v-else-if="node.type === 'break'" />

  <Typography v-else-if="node.type === 'bold'" is-bold>
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" />
  </Typography>

  <Typography v-else-if="node.type === 'italic'" is-italic>
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" />
  </Typography>

  <span v-else-if="node.type === 'underline'" style="text-decoration: underline;">
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" />
  </span>

  <span v-else-if="node.type === 'strike'" style="text-decoration: line-through;">
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" />
  </span>

  <Typography v-else-if="node.type === 'color'" :font-color="node.value">
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" />
  </Typography>

  <Typography v-else-if="node.type === 'size'" :font-size="node.value">
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" />
  </Typography>

  <!-- [url] with links disabled silently fails: renders its children unwrapped, no <a>. -->
  <a
    v-else-if="node.type === 'url' && allowLinks"
    :href="node.href"
    target="_blank"
    rel="noopener noreferrer"
    class="richtext-link"
  >
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" />
  </a>

  <template v-else-if="node.type === 'url'">
    <RichTextNode v-for="(child, i) in node.children" :key="i" :node="child" :allow-links="allowLinks" />
  </template>

  <span
    v-else-if="node.type === 'emoji'"
    class="win55-emoji"
    role="img"
    :aria-label="node.emoji"
    :data-win55-emoji="node.emoji"
    style="--win55-emoji-size: 30px;"
  >
    <img class="win55-emoji-image" :src="getEmojiGifPathFromCode(node.code)" :alt="node.emoji" draggable="false" />
  </span>
</template>
