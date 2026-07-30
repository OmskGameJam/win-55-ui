<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
import emojiDirective from './directives/emoji'

const vEmoji = emojiDirective

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

const exampleTextInputState = ref('sample')
const exampleCheckboxState = ref(false)
const exampleRadioState = ref('sample')

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
  <Typography v-emoji font-color="black">
    <h1>Kitchen sink</h1>
    <div>
      <h2>Currently prepared bitmap strikes</h2>
      <Typography shorthand="Regular12">The quick brown fox jumps over the lazy dog</Typography>
      <Typography shorthand="Bold12">The quick brown fox jumps over the lazy dog</Typography>
      <Typography shorthand="Regular24">The quick brown fox jumps over the lazy dog</Typography>
      <h2>ABCDE</h2>
      <h2>Font tester (pixel alignment)</h2>
      <FontTester shorthand="Regular12" text="The quick brown fox jumps over the lazy dog" />
    </div>
    <Box type="border-groove" :extra-styles="containerStyle">
      <h2>Text input</h2>
      <Typography font-shadow-color="#00000000">
        <BaseInput
          v-model="exampleTextInputState"
          :extra-styles="{ width: '512px' }"
          show-emoji-button
        />
      </Typography>
    </Box>

    <Box type="border-groove" :extra-styles="containerStyle">
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

    <Box type="border-groove" :extra-styles="containerStyle">
      <h2>Emoji</h2>
      <div>By literal emoji: <Emoji emoji="🍕" /></div>
      <div>By shortcode alias: <Emoji emoji="pizza" /></div>
      <div>Outside the registry: <Emoji emoji="🦖" /></div>
      <div>Unresolvable alias: <Emoji emoji="not-a-real-alias" /></div>
      <div>Custom size: <Emoji emoji="🍕" width="60" height="60" /></div>
    </Box>

    <Box type="border-groove" :extra-styles="containerStyle">
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

    <Box type="border-groove" :extra-styles="containerStyle">
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

    <Box type="panel-d-2" :extra-styles="containerStyle">
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

    <Box type="border-groove" :extra-styles="containerStyle">
      <h2>Sized boxes</h2>
      <Box v-for="(item, index) in testingBoxes"
        :extra-styles="{ ...boxStyle, width: (2 * 48 + values[index].cos * 50) + 'px', height: (2 * 24 + values[index].sin * 30) + 'px' }"
        :type="item"
        :key="index"
      />
      <br />
    </Box>

    <div>
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

    <div>
      <h2>Button with tooltip</h2>
      <Tooltip text="Text!">
        <Button :extra-styles="{ margin: '8px' }" @click="handleClick">
          This has a tooltip on hover
        </Button>
      </Tooltip>
    </div>

    <div style=" 
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

    <div>
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
  <Typography v-emoji font-color="black">
    <h2>Second, independent v-emoji instance</h2>
    <div>🎉✨ party over here too</div>
  </Typography>

  <!-- Global singleton: mounted once, shared by every BaseInput's emoji button -->
  <EmojiPickerWindow />
</template>
