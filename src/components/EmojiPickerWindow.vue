<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Window from './Window.vue'
import Box from './Box.vue'
import Button from './Button.vue'
import HDivider from './HDivider.vue'
import Typography from './Typography.vue'
import { getEmojiGifPathFromCode } from '../helpers/emoji'
import { loadEmojiCategories, type CategoryGroup } from '../helpers/emojiCategories'
import { pickerOpen, pickerPosition, closePicker, insertEmoji } from '../helpers/emojiPickerStore'

const rootRef = ref<HTMLDivElement | null>(null)
const groups = ref<CategoryGroup[]>([])
const selectedCategory = ref<string | null>(null)
const icon = ref<string | undefined>(undefined)

const selectedGroup = computed(() =>
  groups.value.find((group) => group.category === selectedCategory.value) ?? null)

/* The exact registry match for `:book:`, favored as the window icon. */
const BOOK_ICON_CODE = '546'

async function rollIcon() {
  if (Math.random() < 0.75) {
    icon.value = getEmojiGifPathFromCode(BOOK_ICON_CODE)
    return
  }

  const loadedGroups = await loadEmojiCategories()
  const all = loadedGroups.flatMap((group) => group.emojis)

  if (all.length === 0) return

  const entry = all[Math.floor(Math.random() * all.length)]
  icon.value = getEmojiGifPathFromCode(entry.code)
}

watch(pickerOpen, async (isOpen) => {
  if (!isOpen) return

  void rollIcon()

  if (groups.value.length === 0) {
    groups.value = await loadEmojiCategories()
    selectedCategory.value = groups.value[0]?.category ?? null
  }
}, { immediate: true })

function selectCategory(category: string) {
  selectedCategory.value = category
}

function handleClickOutside(e: MouseEvent) {
  if (!pickerOpen.value) return

  const target = e.target as Node

  if (rootRef.value?.contains(target)) return

  closePicker()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="pickerOpen" ref="rootRef" style="display: contents;">
        <Window
          v-model:x="pickerPosition.x"
          v-model:y="pickerPosition.y"
          v-model:width="pickerPosition.width"
          v-model:height="pickerPosition.height"
          resizable
          title="Emoji Picker"
          :icon="icon"
          :min-width="240"
          :min-height="200"
          overflow-x="hidden"
          overflow-y="hidden"
          extra-class="emoji-picker-window"
          :extra-styles="{ zIndex: 1200 }"
        >
          <template #titlebar-buttons>
            <Button extra-class="titlebar-button" base-type="panel-d-2" @click="closePicker">
              <img draggable="false" src="/win-55-ui/window/x.png" />
            </Button>
          </template>

          <Box
            type="textarea"
            :extra-styles="{ width: '100%', height: 'calc(100% - 2px)', marginTop: '2px', padding: '2px' }"
          >
            <div class="emoji-picker-body">
              <div class="emoji-picker-tabs">
                <span
                  v-for="group in groups"
                  :key="group.category"
                  class="emoji-picker-tab"
                  :class="{ 'emoji-picker-tab--selected': group.category === selectedCategory }"
                  @click="selectCategory(group.category)"
                >
                  <Typography :shorthand="group.category === selectedCategory ? 'Bold12' : 'Regular12'">
                    {{ group.category }}
                  </Typography>
                </span>
              </div>

              <HDivider />

              <div class="emoji-picker-grid">
                <div
                  v-for="entry in selectedGroup?.emojis ?? []"
                  :key="entry.code"
                  class="emoji-picker-grid-cell"
                >
                  <img
                    :src="getEmojiGifPathFromCode(entry.code)"
                    :title="entry.shortcodes[0] ? `:${entry.shortcodes[0]}:` : undefined"
                    class="emoji-picker-grid-item"
                    @click="insertEmoji(entry.emoji)"
                  />
                </div>
              </div>
            </div>
          </Box>
        </Window>
    </div>
  </Teleport>
</template>
