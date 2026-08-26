<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Window from './Window.vue'
import Button from './Button.vue'
import NamedPanel from './NamedPanel.vue'
import RadioButton from './RadioButton.vue'
import Checkbox from './Checkbox.vue'
import Typography from './Typography.vue'
import FontTester from './FontTester.vue'
import HDivider from './HDivider.vue'
import { TEST_SCRIPTS } from '../helpers/testScripts'
import { SUPPORTED_FACES } from '../helpers/generatedFonts'

// SUPPORTED_FACES is generated from src-font/fonts.json - it's the actual set of registered
// face/style/size combos, not a guess at what typography.ts's degrade logic could fall back to.
// Face -> Style -> Size cascades through it so this tester can never select a combo that doesn't
// really exist.
const FACE_OPTIONS = [...new Set(SUPPORTED_FACES.map((face) => face.fontName))]

function styleLabel(style: string): string {
  return style.replace(/([a-z])([A-Z])/g, '$1 $2')
}

const open = defineModel<boolean>('open', { default: false })

function close() {
  open.value = false
}

const selectedFace = ref(FACE_OPTIONS[0])

const styleOptions = computed(() => [...new Set(SUPPORTED_FACES.filter((face) => face.fontName === selectedFace.value).map((face) => face.style))])
const selectedStyle = ref(styleOptions.value[0])

const sizeOptions = computed(() =>
  SUPPORTED_FACES.filter((face) => face.fontName === selectedFace.value && face.style === selectedStyle.value).map((face) => face.size),
)
const selectedSize = ref(sizeOptions.value[0])

// Face changing can invalidate the current style, which can in turn invalidate the current size -
// each watcher only resets its own selection when it's no longer in the (recomputed) option list.
watch(styleOptions, (options) => {
  if (!options.includes(selectedStyle.value)) selectedStyle.value = options[0]
})
watch(sizeOptions, (options) => {
  if (!options.includes(selectedSize.value)) selectedSize.value = options[0]
})

const selectedScriptName = ref(TEST_SCRIPTS[0].name)
const capitalFirst = ref(false)
const capitalSecond = ref(false)

const shorthand = computed(() => `${selectedStyle.value}${selectedSize.value}`)
const selectedScript = computed(() => TEST_SCRIPTS.find((script) => script.name === selectedScriptName.value) ?? TEST_SCRIPTS[0])

const firstLetters = computed(() => (capitalFirst.value ? selectedScript.value.upper : selectedScript.value.lower))
const secondLetters = computed(() => (capitalSecond.value ? selectedScript.value.upper : selectedScript.value.lower))

// Flattened row-major so the grid is one v-for instead of nested v-fors - `gridTemplateColumns`
// below is what actually folds it back into an NxN square.
const gridPairs = computed(() => firstLetters.value.flatMap((a) => secondLetters.value.map((b) => a + b)))

const fontWindow = ref({ x: 40, y: 40, width: 440, height: 210 })
const scriptWindow = ref({ x: 40, y: 260, width: 200, height: 170 })
const rendererWindow = ref({ x: 500, y: 40, width: 560, height: 560 })
</script>

<template>
  <template v-if="open">
    <Window
      v-model:x="fontWindow.x"
      v-model:y="fontWindow.y"
      v-model:width="fontWindow.width"
      v-model:height="fontWindow.height"
      title="Strike Tester - Font"
      icon="/win-55-ui/icons/program.png"
      resizable
    >
      <template #titlebar-buttons>
        <Button extra-class="titlebar-button" base-type="panel-d-2" @click="close">
          <img draggable="false" src="/win-55-ui/window/x.png" />
        </Button>
      </template>

      <div style="display: flex; flex-direction: row; align-items: flex-start;">
        <NamedPanel label="Face">
          <div style="display: flex; flex-direction: column;">
            <RadioButton v-for="face in FACE_OPTIONS" :key="face" v-model="selectedFace" :value="face" :label="face" />
          </div>
        </NamedPanel>

        <NamedPanel label="Style">
          <div style="display: flex; flex-direction: column;">
            <RadioButton
              v-for="style in styleOptions"
              :key="style"
              v-model="selectedStyle"
              :value="style"
              :label="styleLabel(style)"
            />
          </div>
        </NamedPanel>

        <NamedPanel label="Size">
          <div style="display: flex; flex-direction: column;">
            <RadioButton v-for="size in sizeOptions" :key="size" v-model="selectedSize" :value="size" :label="String(size)" />
          </div>
        </NamedPanel>
      </div>
    </Window>

    <Window
      v-model:x="scriptWindow.x"
      v-model:y="scriptWindow.y"
      v-model:width="scriptWindow.width"
      v-model:height="scriptWindow.height"
      title="Strike Tester - Script"
      icon="/win-55-ui/icons/program.png"
      resizable
    >
      <template #titlebar-buttons>
        <Button extra-class="titlebar-button" base-type="panel-d-2" @click="close">
          <img draggable="false" src="/win-55-ui/window/x.png" />
        </Button>
      </template>

      <NamedPanel label="Script">
        <div style="display: flex; flex-direction: column;">
          <RadioButton
            v-for="script in TEST_SCRIPTS"
            :key="script.name"
            v-model="selectedScriptName"
            :value="script.name"
            :label="script.name"
          />
        </div>
      </NamedPanel>
    </Window>

    <Window
      v-model:x="rendererWindow.x"
      v-model:y="rendererWindow.y"
      v-model:width="rendererWindow.width"
      v-model:height="rendererWindow.height"
      title="Strike Tester - Renderer"
      icon="/win-55-ui/icons/program.png"
      resizable
    >
      <template #titlebar-buttons>
        <Button extra-class="titlebar-button" base-type="panel-d-2" @click="close">
          <img draggable="false" src="/win-55-ui/window/x.png" />
        </Button>
      </template>

      <FontTester :shorthand="shorthand" :font-name="selectedFace" :text="selectedScript.sample" />

      <HDivider />

      <div style="display: flex; gap: 16px; margin: 8px 0;">
        <Checkbox v-model="capitalFirst" label="Capital first" />
        <Checkbox v-model="capitalSecond" label="Capital second" />
      </div>

      <div class="strike-tester-grid" :style="{ gridTemplateColumns: `repeat(${firstLetters.length}, auto)` }">
        <Typography
          v-for="(pair, i) in gridPairs"
          :key="i"
          element="div"
          class="strike-tester-cell"
          :shorthand="shorthand"
          :font-name="selectedFace"
        >{{ pair }}</Typography>
      </div>
    </Window>
  </template>
</template>

<style scoped>
.strike-tester-grid {
  display: grid;
  width: fit-content;
}

.strike-tester-cell {
  padding: 2px 4px;
  white-space: nowrap;
}
</style>
