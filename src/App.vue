<script setup lang="ts">
import { ref } from 'vue'
import Box from './components/Box.vue'
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

const { values } = useSineWave(5)

const containerStyle = {
  width: 'fit-content',
  margin: '4px',
  padding: '4px',
}

const boxStyle = {
  marginBottom: '10px',
  marginLeft: '8px',
}

const windowStyle = {
  marginBottom: '10px',
  marginLeft: '8px',
}

const handleClick = () => window.alert('Click!')

const exampleTextInputState = ref('sample')
const scrollableTextInputState = ref('aasdfasdfasdfasdfasdfasdf\naasdfasdfasdfasdfasdfasdf\naasdfasdfasdfasdfasdfasdf\naasdfasdfasdfasdfasdfasdf\naasdfasdfasdfasdfasdfasdfaasdfasdfasdfasdfasdfasdf\naasdfasdfasdfasdfasdfasdf\naasdfasdfasdfasdfasdfasdf\naasdfasdfasdfasdfasdfasdf\naasdfasdfasdfasdfasdfasdf\naasdfasdfasdfasdfasdfasdf\naasdfasdfasdfasdfasdfasdfaasdfasdfasdfasdfasdfasdf\naasdfasdfasdfasdfasdfasdf\n')
const exampleCheckboxState = ref(false)
const exampleRadioState = ref('sample')
</script>

<template>
  <Typography font-color="black">
    <h1>Kitchen sink</h1>
    <div>
      <h2>The quick brown fox jumps over the lazy dog</h2>
      <h2>ABCDE</h2>
    </div>
    <Box type="border-groove" :extra-styles="containerStyle">
      <h2>Text input</h2>
      <Typography font-shadow-color="#00000000">
        <BaseInput
          v-model="exampleTextInputState"
          :extra-styles="{ width: '512px' }"
        />
      </Typography>
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
      <Box
        :extra-styles="{ ...boxStyle, width: (2 * 48 + values[0].cos * 50) + 'px', height: (2 * 24 + values[0].sin * 30) + 'px' }"
        type="panel-d-1"
      />
      <br />
      <Box
        :extra-styles="{ ...boxStyle, width: (2 * 48 + values[1].cos * 50) + 'px', height: (2 * 24 + values[1].sin * 30) + 'px' }"
        type="panel-d-2"
      />
      <br />
      <Box
        :extra-styles="{ ...boxStyle, width: (2 * 48 + values[2].cos * 50) + 'px', height: (2 * 24 + values[2].sin * 30) + 'px' }"
        type="border-groove"
      />
      <br />
      <Box
        :extra-styles="{ ...boxStyle, width: (2 * 48 + values[3].cos * 50) + 'px', height: (2 * 24 + values[3].sin * 30) + 'px' }"
        type="indent"
      />
      <br />
      <Box
        :extra-styles="{ ...boxStyle, width: (2 * 48 + values[4].cos * 50) + 'px', height: (2 * 24 + values[4].sin * 30) + 'px' }"
        type="textarea"
      />
      <br />
    </Box>

    <div>
      <h2>Window</h2>
      (it's floating)
      <Window resizable :extra-styles="{ ...windowStyle }">
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

    <div>
      <h2>Scrollable</h2>
      <BaseInput style="width: 320px; height: 240px; white-space: pre;" v-model="scrollableTextInputState" multiline>
      </BaseInput>
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
</template>
