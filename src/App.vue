<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import Box, { type BoxType } from './components/Box.vue'
import Button from './components/Button.vue'
import BaseDropdown from './components/BaseDropdown.vue'
import { useSineWave } from './helpers/useSineWave'
import BaseInput from './components/BaseInput.vue'
import Typography from './components/Typography.vue'
import Checkbox from './components/Checkbox.vue'
import RadioButton from './components/RadioButton.vue'
import MenuDropdown from './components/MenuDropdown.vue'
import HDivider from './components/HDivider.vue'
import Window from './components/Window.vue'
import Tooltip from './components/Tooltip.vue'
import Balloon from './components/Balloon.vue'
import NamedPanel from './components/NamedPanel.vue'
import EmojiPickerWindow from './components/EmojiPickerWindow.vue'
import Emoji from './components/Emoji.vue'
import RichText from './components/RichText.vue'
import FontTester from './components/FontTester.vue'
import StrikeTester from './components/StrikeTester.vue'
import CursorContext from './components/CursorContext.vue'
import CursorBusyDemoButton from './components/CursorBusyDemoButton.vue'
import { loadSchemeIndex } from './helpers/cursors'
import type { CursorRole } from './helpers/cursorContext'
import emojiDirective from './directives/emoji'
import cursorDirective from './directives/cursor'

const vEmoji = emojiDirective
const vCursor = cursorDirective

const testingBoxes: BoxType[] = [
  'indent',
  'indent-dark',
  'panel-d-1',
  'panel-d-2',
  'textarea',
  'border-groove',
  'white-box',
  'notification',
]
const { values } = useSineWave(testingBoxes.length)

const containerStyle = {
  width: 'fit-content',
  margin: '4px',
  padding: '4px',
}

const boxStyle = {
  marginBottom: '10px',
  marginLeft: '8px',
}

// Window resize mode controls
const resizeMode = ref('horizontal')
const windowX = ref(100)
const windowY = ref(100)
const windowWidth = ref(320)
const windowHeight = ref(220)

// Computed properties for resize flags
const resizable = computed(() => resizeMode.value === 'both')
const resizableHorizontally = computed(() => resizeMode.value === 'horizontal' || resizeMode.value === 'both')
const resizableVertically = computed(() => resizeMode.value === 'vertical' || resizeMode.value === 'both')

const handleClick = () => window.alert('Click!')

const strikeTesterOpen = ref(false)

const exampleTextInputState = ref('sample')
const exampleCheckboxState = ref(false)
const exampleRadioState = ref('sample')

// Each kitchen-sink section is gated behind a checkbox and hidden until toggled on.
// Grouped into NamedPanels purely for the debug-toggle UI.
const sectionGroups: { label: string; sections: { key: string; label: string }[] }[] = [
  {
    label: 'Typography & text',
    sections: [
      { key: 'bitmapStrikes', label: 'Bitmap strikes' },
      { key: 'textInput', label: 'Text input' },
      { key: 'richText', label: 'RichText' },
    ],
  },
  {
    label: 'Emoji',
    sections: [
      { key: 'customEmoji', label: 'Custom emoji' },
      { key: 'emoji', label: 'Emoji' },
      { key: 'spinningDonut', label: 'Spinning donut' },
      { key: 'secondEmoji', label: 'Second v-emoji instance' },
    ],
  },
  {
    label: 'Layout & forms',
    sections: [
      { key: 'formElements', label: 'Form elements' },
      { key: 'sizedBoxes', label: 'Sized boxes' },
      { key: 'window', label: 'Window' },
    ],
  },
  {
    label: 'Overlays',
    sections: [
      { key: 'buttonTooltip', label: 'Button with tooltip' },
      { key: 'balloons', label: 'Balloons' },
      { key: 'dropdowns', label: 'Dropdowns' },
    ],
  },
  {
    label: 'Cursors',
    sections: [
      { key: 'cursorContext', label: 'CursorContext' },
      { key: 'cursorRoles', label: 'Cursor roles' },
    ],
  },
]
const sections = reactive<Record<string, boolean>>(
  Object.fromEntries(
    sectionGroups.flatMap((group) => group.sections.map((s) => [s.key, false])),
  ),
)

// Simulates text arriving after the initial render (e.g. from an API call),
// mixing registered emoji (rendered as our GIFs) and unregistered ones
// (rendered via the canvas fallback) with plain text.
const delayedEmojiText = ref('')
setTimeout(() => {
  delayedEmojiText.value = 'Loaded later: pizza night 🍕🐶 party time 🎉✨ and also 😀🥳🦄 surprise!'
}, 2000)

const DONUT_EMOJI_COUNT = 32
const DONUT_EMOJI_POOL = ['🍕', '🐶', '🎉', '✨', '😀', '🥳', '🦄', '☀', '🌈', '🚀', '💾', '🦖']
const DONUT_RADIUS_Y = 24
const DONUT_SPIN_SPEED = (Math.PI * 2) / 3000
const DONUT_SQUASH_SPEED = (Math.PI * 2) / 8000

const donutEmojis = Array.from(
  { length: DONUT_EMOJI_COUNT },
  () => DONUT_EMOJI_POOL[Math.floor(Math.random() * DONUT_EMOJI_POOL.length)],
)

const donutTime = ref(0)
let donutFrame = 0

function tickDonut(timestamp: number): void {
  donutTime.value = timestamp
  donutFrame = requestAnimationFrame(tickDonut)
}

onMounted(() => {
  donutFrame = requestAnimationFrame(tickDonut)
})

onUnmounted(() => {
  cancelAnimationFrame(donutFrame)
})

const cursorMode = ref<'native' | 'immersive'>('native')
const rootScheme = ref('windows-default')
const rootSchemeMenuOpen = ref(false)
const demoScheme = ref('windows-default')
const schemeMenuOpen = ref(false)
const schemeNames = ref<string[]>(['windows-default'])
void loadSchemeIndex().then((index) => {
  schemeNames.value = Object.keys(index).sort()
})
function pickRootScheme(name: string): void {
  rootScheme.value = name
  rootSchemeMenuOpen.value = false
}
function pickScheme(name: string): void {
  demoScheme.value = name
  schemeMenuOpen.value = false
}

const roleScheme = ref('windows-default')
const roleSchemeMenuOpen = ref(false)
const CURSOR_ROLES: CursorRole[] = [
  'default',
  'link',
  'text',
  'move',
  'not-allowed',
  'wait',
  'progress',
  'help',
  'crosshair',
  'handwriting',
  'alternate',
  'ns-resize',
  'ew-resize',
  'nesw-resize',
  'nwse-resize',
]
function pickRoleScheme(name: string): void {
  roleScheme.value = name
  roleSchemeMenuOpen.value = false
}

const progressDemoContext = ref<InstanceType<typeof CursorContext>>()
function triggerBusyDemo(): void {
  progressDemoContext.value?.addBusy(new Promise((resolve) => setTimeout(resolve, 3000)))
}
function triggerProgressDemo(): void {
  progressDemoContext.value?.addProgress(new Promise((resolve) => setTimeout(resolve, 3000)))
}

const donutPositions = computed(() => {
  const t = donutTime.value
  const radiusX = DONUT_RADIUS_Y * Math.cos(t * DONUT_SQUASH_SPEED)

  return donutEmojis.map((emoji, i) => {
    const angle = (i / DONUT_EMOJI_COUNT) * Math.PI * 2 + t * DONUT_SPIN_SPEED
    return {
      emoji,
      x: 32 + radiusX * Math.cos(angle),
      y: 32 + DONUT_RADIUS_Y * Math.sin(angle),
    }
  })
})
</script>

<template>
  <CursorContext root :mode="cursorMode" :scheme="rootScheme">
    <Box type="panel-d-1" :extra-styles="containerStyle">
      <h2>Debug sections</h2>
      <div style="display: flex; flex-wrap: wrap; align-items: flex-start;">
        <NamedPanel v-for="group in sectionGroups" :key="group.label" :label="group.label">
          <Checkbox
            v-for="item in group.sections"
            :key="item.key"
            v-model="sections[item.key]"
            :label="item.label"
          />
          <BaseDropdown v-if="group.label === 'Cursors'" v-model:open="rootSchemeMenuOpen">
            <template #trigger>
              <Button>root scheme: {{ rootScheme }}</Button>
            </template>
            <template #items>
              <Box type="panel-d-1">
                <Button v-for="name in schemeNames" :key="name" @click="pickRootScheme(name)">{{ name }}</Button>
              </Box>
            </template>
          </BaseDropdown>
        </NamedPanel>
      </div>
    </Box>
    <Typography v-emoji is-bold font-color="black">
      <div v-if="sections.bitmapStrikes">
        <Typography shorthand="Regular24">Съешь же ещё этих мягких французских булок, да выпей чаю</Typography>
        <h2>Currently prepared bitmap strikes</h2>
        <Typography shorthand="Regular12">The quick brown fox jumps over the lazy dog</Typography>
        <Typography shorthand="Bold12">The quick brown fox jumps over the lazy dog</Typography>
        <Typography shorthand="Regular24">The quick brown fox jumps over the lazy dog</Typography>
        <Typography shorthand="Regular12">Съешь же ещё этих мягких французских булок, да выпей чаю</Typography>
        <Typography shorthand="Bold12">Съешь же ещё этих мягких французских булок, да выпей чаю</Typography>
        <Typography shorthand="Regular24">Съешь же ещё этих мягких французских булок, да выпей чаю</Typography>
      
        <h1>Another H1</h1>

        <h2>ABCDE</h2>
        <h2>Font tester (pixel alignment)</h2>
        <FontTester shorthand="Regular12" text="The quick brown fox jumps over the lazy dog" />

        <h2>Strike tester</h2>
        <Button :extra-styles="{ margin: '8px' }" @click="strikeTesterOpen = true">
          Open strike tester
        </Button>
      </div>
      <Box v-if="sections.textInput" type="border-groove" :extra-styles="containerStyle">
        <h2>Text input</h2>
        <Typography font-shadow-color="#00000000">
          <BaseInput
            v-model="exampleTextInputState"
            :extra-styles="{ width: '512px' }"
            show-emoji-button
          />
        </Typography>
      </Box>

      <Box v-if="sections.customEmoji" type="border-groove" :extra-styles="containerStyle">
        <h2>Custom emoji</h2>
        <div>
          Static ☀ 🌈 😄 🚀 💾
        </div>
        <div>
          {{ exampleTextInputState }}
        </div>
        <div>
          {{ delayedEmojiText || 'Loading later...' }}
        </div>
        <div v-emoji>
          Nested v-emoji (should not double-render): 🍕🐶
        </div>
      </Box>

      <Box v-if="sections.emoji" type="border-groove" :extra-styles="containerStyle">
        <h2>Emoji</h2>
        <div>By literal emoji: <Emoji emoji="🍕" /></div>
        <div>By shortcode alias: <Emoji emoji="pizza" /></div>
        <div>Outside the registry: <Emoji emoji="🦖" /></div>
        <div>Unresolvable alias: <Emoji emoji="not-a-real-alias" /></div>
        <div>Custom size: <Emoji emoji="🍕" width="60" height="60" /></div>
      </Box>

      <Box v-if="sections.spinningDonut" type="border-groove" :extra-styles="containerStyle">
        <h2>Spinning donut</h2>
        <div style="position: relative; width: 64px; height: 64px;">
          <Emoji
            v-for="(item, i) in donutPositions"
            :key="i"
            :emoji="item.emoji"
            width="12"
            height="12"
            :style="{
              position: 'absolute',
              left: `${item.x}px`,
              top: `${item.y}px`,
              transform: 'translate(-50%, -50%)',
              zIndex: Math.round(item.y),
            }"
          />
        </div>
      </Box>

      <Box v-if="sections.richText" type="border-groove" :extra-styles="containerStyle">
        <h2>RichText (BBCode + :shortcodes:)</h2>
        <RichText allow-links allow-sizes>
          Plain text, [b]bold[/b], [i]italic (no strike! tell anton to fix fonts)[/i],
          [u]underline[/u], [s]strike[/s], [color=#aa0000]red[/color], [size=24]big[/size],
          [url=https://example.com]a link[/url], and :smile: an emoji
          Also, real emoji! ☀ 🌈 😄 🚀 💾
        </RichText>
        <RichText>
          Links disabled here: [url=https://example.com]this should render as plain text[/url]
        </RichText>
        <RichText allow-links>
          Sizes disabled here: [size=24]this should render as plain text[/size]
        </RichText>
        <RichText>
          Emoji outside the registry (rasterized fallback, not plain text): 🦖
        </RichText>
      </Box>

      <Box v-if="sections.formElements" type="panel-d-2" :extra-styles="containerStyle">
        <h2>Form elements</h2>
        <Box type="border-groove" :extra-styles="containerStyle">
          <Checkbox
            v-model="exampleCheckboxState"
            label="Sample"
          />
          <Checkbox
            v-model="exampleCheckboxState"
            label="Sample"
          />
        </Box>
        <Box type="border-groove" :extra-styles="containerStyle">
          <RadioButton
            v-model="exampleRadioState"
            value="a"
            label="A"
          />
          <RadioButton
            v-model="exampleRadioState"
            value="sample"
            label="Sample"
          />
          <RadioButton
            v-model="exampleRadioState"
            value="b"
            label="B"
          />
          <RadioButton
            v-model="exampleRadioState"
            value="c"
            label="C"
          />
        </Box>
      </Box>

      <Box v-if="sections.sizedBoxes" type="border-groove" :extra-styles="containerStyle">
        <h2>Sized boxes</h2>
        <Box v-for="(item, index) in testingBoxes"
          :extra-styles="{ ...boxStyle, width: (2 * 48 + values[index].cos * 50) + 'px', height: (2 * 24 + values[index].sin * 30) + 'px' }"
          :type="item"
          :key="index"
        />
        <br />
      </Box>

      <div v-if="sections.window">
        <h2>Window</h2>
        <div style="margin-bottom: 10px;">
          <h3>Resize Mode:</h3>
          <div style="display: flex; flex-direction: column; gap: 5px; margin-left: 8px;">
            <RadioButton
              v-model="resizeMode"
              value="both"
              label="Resizable (both axes)"
            />
            <RadioButton
              v-model="resizeMode"
              value="horizontal"
              label="Resizable horizontally"
            />
            <RadioButton
              v-model="resizeMode"
              value="vertical"
              label="Resizable vertically"
            />
            <RadioButton
              v-model="resizeMode"
              value="none"
              label="Not resizable"
            />
          </div>
        </div>
      
        <!-- First window is floating like normal -->
        <Window 
          :resizable="resizable" 
          :resizableHorizontally="resizableHorizontally" 
          :resizableVertically="resizableVertically"
          v-model:x="windowX" 
          v-model:y="windowY" 
          v-model:width="windowWidth" 
          v-model:height="windowHeight"
          title="Title but long so we can see shit" 
          icon="/win-55-ui/icons/program.png" 
          placeholder-buttons
        >
          <NamedPanel label="Это борт!">
            TEXT TEXT TEXT TEXT TEXT TEXT TEXT <br>
            TEXT TEXT TEXT TEXT TEXT TEXT TEXT <br>
          </NamedPanel>
        </Window>
      
        <!-- Second window is in faux mode, behaving as a div -->
        <Window faux title="Title 👀😀🥳🦄🎉✨ " placeholder-buttons>
          Sample
        </Window>
      </div>

      <div v-if="sections.buttonTooltip">
        <h2>Button with tooltip</h2>
        <Tooltip text="Text!">
          <Button :extra-styles="{ margin: '8px' }" @click="handleClick">
            This has a tooltip on hover
          </Button>
        </Tooltip>
      </div>

      <div v-if="sections.balloons" style="
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 100px;"
      >

        <Balloon side="bottom" bias="right" :shown="true">
          <Button>BUTTON</Button>
          <template #content>
            TEXT TEXT TEXT TEXT  <br>
            TEXT TEXT TEXT TEXT 
          </template>
        </Balloon>
        <Balloon side="right" bias="down" text="LEFT" :shown="true">
          <Button>BUTTON</Button>
          <template #content>
            TEXT TEXT TEXT TEXT <br>
            TEXT TEXT TEXT TEXT <br>
            TEXT TEXT TEXT TEXT <br>
            TEXT TEXT TEXT TEXT  
          </template>
        </Balloon>
        <Balloon side="left" bias="up" text="RIGHT" :shown="true">
          <Button>BUTTON</Button>
          <template #content>
            TEXT TEXT TEXT TEXT <br>
            TEXT TEXT TEXT TEXT <br>
            TEXT TEXT TEXT TEXT <br>
            TEXT TEXT TEXT TEXT  
          </template>
        </Balloon>
        <Balloon side="top" bias="left" :shown="true">
          <Button>BUTTON</Button>
          <template #content>
            TEXT TEXT TEXT TEXT  <br>
            TEXT TEXT TEXT TEXT 
          </template>
        </Balloon>

        <Balloon side="right" :shown="true">
          <Button>BUTTON</Button>
          <template #content>
            TEXT TEXT TEXT TEXT  <br>
            TEXT TEXT TEXT TEXT 
          </template>
        </Balloon>
        <Balloon side="top" :shown="true">
          <Button>BUTTON</Button>
          <template #content>
            TEXT TEXT TEXT TEXT  <br>
            TEXT TEXT TEXT TEXT 
          </template>
        </Balloon>
        <Balloon side="bottom" :shown="true">
          <Button>BUTTON</Button>
          <template #content>
            TEXT TEXT TEXT TEXT  <br>
            TEXT TEXT TEXT TEXT 
          </template>
        </Balloon>
        <Balloon side="left" :shown="true">
          <Button>BUTTON</Button>
          <template #content>
            TEXT TEXT TEXT TEXT  <br>
            TEXT TEXT TEXT TEXT 
          </template>
        </Balloon>

        <Balloon side="top" bias="right" :shown="true">
          <Button>BUTTON</Button>
          <template #content>
            TEXT TEXT TEXT TEXT  <br>
            TEXT TEXT TEXT TEXT 
          </template>
        </Balloon>
        <Balloon side="left" bias="down" text="LEFT" :shown="true">
          <Button>BUTTON</Button>
          <template #content>
            TEXT TEXT TEXT TEXT <br>
            TEXT TEXT TEXT TEXT <br>
            TEXT TEXT TEXT TEXT <br>
            TEXT TEXT TEXT TEXT  
          </template>
        </Balloon>
        <Balloon side="right" bias="up" text="RIGHT" :shown="true">
          <Button>BUTTON</Button>
          <template #content>
            TEXT TEXT TEXT TEXT <br>
            TEXT TEXT TEXT TEXT <br>
            TEXT TEXT TEXT TEXT <br>
            TEXT TEXT TEXT TEXT  
          </template>
        </Balloon>
        <Balloon side="bottom" bias="left" :shown="true">
          <Button>BUTTON</Button>
          <template #content>
            TEXT TEXT TEXT TEXT  <br>
            TEXT TEXT TEXT TEXT 
          </template>
        </Balloon>
      
      </div>

      <div v-if="sections.dropdowns">
        <h2>Basic dropdown</h2>
        <div style="margin-left: 8px">
          <BaseDropdown>
            <template #trigger>
              <Button>This is a dropdown</Button>
            </template>
            <template #items>
              <Button>Item 1</Button>
              <Button>Item 2</Button>
              <Button>Item 3</Button>
              <Button>Item 4</Button>
            </template>
          </BaseDropdown>
          <MenuDropdown>
            <template #trigger>
              <Button>This is a nice menu dropdown!</Button>
            </template>
            <template #items>
              <div>New</div>
              <div>Open...</div>
              <HDivider />
              <div>Save</div>
              <div>Save as...</div>
            </template>
          </MenuDropdown>
          <br />
          <br />
          <br />
          <br />
          <br />
          <BaseDropdown>
            <template #trigger>
              <Button>This is also a dropdown</Button>
            </template>
            <template #items>
              <Button>Item 1</Button>
              <Button>Item 2</Button>
              <Button>Item 3</Button>
              <Button>Item 4</Button>
            </template>
          </BaseDropdown>
        </div>
      </div>
    </Typography>

    <!-- Independent of the v-emoji above (not a descendant of it): verifies
         multiple separate v-emoji instances on the same page both work. -->
    <Typography v-if="sections.secondEmoji" v-emoji font-color="black">
      <h2>Second, independent v-emoji instance</h2>
      <div>🎉✨ party over here too</div>
    </Typography>

    <!-- Global singleton: mounted once, shared by every BaseInput's emoji button -->
    <EmojiPickerWindow />

    <StrikeTester v-model:open="strikeTesterOpen" />

    <NamedPanel v-if="sections.cursorContext" label="CursorContext" background-color-hint="#CBCBCB" style="width: fit-content; margin: 8px">
      <CursorContext :scheme="demoScheme">
        <div style="display: flex; gap: 12px; margin-bottom: 8px; align-items: center">
          <RadioButton v-model="cursorMode" value="native" label="native mode" />
          <RadioButton v-model="cursorMode" value="immersive" label="immersive mode" />
          <BaseDropdown v-model:open="schemeMenuOpen">
            <template #trigger>
              <Button>base scheme: {{ demoScheme }}</Button>
            </template>
            <template #items>
              <Box type="panel-d-1">
                <Button v-for="name in schemeNames" :key="name" @click="pickScheme(name)">{{ name }}</Button>
              </Box>
            </template>
          </BaseDropdown>
        </div>
        <div style="display: flex; gap: 8px">
          <CursorContext>
            <div style="width: 180px; height: 100px; padding: 8px">defaults</div>
          </CursorContext>
          <CursorContext role="text">
            <div style="width: 180px; height: 100px; padding: 8px">text</div>
          </CursorContext>
          <CursorContext scheme="dinosaur" role="default">
            <div style="width: 180px; height: 100px; padding: 8px">dinosaur</div>
          </CursorContext>
          <CursorContext scheme="dinosaur">
            <div style="width: 180px; height: 100px; padding: 8px">
              dinosaur
              <div v-cursor="'not-allowed'" style="margin-top: 4px">v-cursor</div>
            </div>
          </CursorContext>
          <CursorContext scheme="dinosaur">
            <div style="width: 200px; height: 100px; padding: 8px">
              derived
              <a href="#" @click.prevent style="display: block; margin-top: 4px">link</a>
              <input type="text" placeholder="text" style="width: 100%; margin-top: 4px" />
              <button disabled style="margin-top: 4px">disabled (not-allowed)</button>
            </div>
          </CursorContext>
          <CursorContext disabled>
            <div style="width: 200px; height: 100px; padding: 8px">
              disabled
              <input type="text" placeholder="text" style="width: 100%; margin-top: 4px" />
              <CursorContext :disabled="false" element="div" style="display: block; margin-top: 4px">
                [ re-enabled ]
              </CursorContext>
            </div>
          </CursorContext>
          <CursorContext scheme="3d-bronze">
            <div style="width: 180px; height: 100px; padding: 8px">
              3d-bronze
              <CursorContext role="not-allowed" style="display: block; margin-top: 4px">
                [ nested ]
              </CursorContext>
            </div>
          </CursorContext>
          <CursorContext scheme="3d-bronze" role="help">
            <div style="width: 180px; height: 100px; padding: 8px">fallback</div>
          </CursorContext>
          <CursorContext ref="progressDemoContext">
            <div style="width: 180px; height: 100px; padding: 8px">
              ref:
              <Button @click="triggerBusyDemo">busy</Button>
              <Button @click="triggerProgressDemo">progress</Button>
            </div>
          </CursorContext>
          <CursorContext>
            <div style="width: 220px; height: 100px; padding: 8px">
              inject:
              <div>
                <div>
                  <CursorBusyDemoButton mode="busy" label="busy" />
                  <CursorBusyDemoButton mode="progress" label="progress" />
                </div>
              </div>
            </div>
          </CursorContext>
          <CursorContext>
            <div style="width: 220px; height: 100px; padding: 8px">
              weak override:
              <Button disabled>disabled (weak not-allowed)</Button>
              <Button disabled v-cursor="'help'">+ v-cursor -&gt; help</Button>
            </div>
          </CursorContext>
        </div>
      </CursorContext>
    </NamedPanel>

    <NamedPanel v-if="sections.cursorRoles" label="Cursor roles" background-color-hint="#CBCBCB" style="width: fit-content; margin: 8px">
      <CursorContext :scheme="roleScheme">
        <BaseDropdown v-model:open="roleSchemeMenuOpen">
          <template #trigger>
            <Button>scheme: {{ roleScheme }}</Button>
          </template>
          <template #items>
            <Box type="panel-d-1">
              <Button v-for="name in schemeNames" :key="name" @click="pickRoleScheme(name)">{{ name }}</Button>
            </Box>
          </template>
        </BaseDropdown>
        <div style="display: flex; flex-wrap: wrap; gap: 16px; max-width: 640px; margin-top: 8px">
          <span v-for="role in CURSOR_ROLES" :key="role" v-cursor="role">{{ role }}</span>
        </div>
      </CursorContext>
    </NamedPanel>
  </CursorContext>
</template>
