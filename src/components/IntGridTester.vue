<script setup lang="ts">
import { computed, ref } from 'vue'
import IntGrid from './IntGrid.vue'
import Slider from './Slider.vue'

const width = ref(320)
const height = ref(160)
const count = ref(9)

const tall = [48, 72, 40, 96, 56, 64, 40, 88, 48]
const wide = [40, 64, 28, 80, 48, 56, 32, 72, 44]

const tileHeight = (i: number) => tall[i % tall.length]
const tileWidth = (i: number) => wide[i % wide.length]

const widthStyle = computed(() => ({ width: `${width.value}px` }))
const boxStyle = computed(() => ({ width: `${width.value}px`, height: `${height.value}px` }))
</script>

<template>
  <div class="int-grid-tester">
    <div class="controls">
      <span>Width {{ width }}</span>
      <Slider v-model="width" :min="120" :max="700" :step="1" :extra-styles="{ width: '200px' }" />
      <span>Height {{ height }} (areas + horizontal)</span>
      <Slider v-model="height" :min="60" :max="700" :step="1" :extra-styles="{ width: '200px' }" />
      <span>Items {{ count }}</span>
      <Slider v-model="count" :min="0" :max="24" :step="1" :extra-styles="{ width: '200px' }" />
    </div>

    <div>
      <div class="caption">fill — 64px items, gap 4, {{ count }} items</div>
      <IntGrid mode="fill" fixed-height extra-class="frame" :item-width="64" :item-height="48" :gap="4" :extra-styles="boxStyle">
        <div v-for="n in count" :key="n" class="tile">{{ n }}</div>
      </IntGrid>
    </div>

    <div>
      <div class="caption">fill — 200px items (single column when narrow)</div>
      <IntGrid mode="fill" fixed-height extra-class="frame" :item-width="200" :item-height="48" :gap="4" :extra-styles="boxStyle">
        <div v-for="n in count" :key="n" class="tile">{{ n }}</div>
      </IntGrid>
    </div>

    <div>
      <div class="caption">fill — right-to-left</div>
      <IntGrid mode="fill" flow="rtl" fixed-height extra-class="frame" :item-width="64" :item-height="48" :gap="4" :extra-styles="boxStyle">
        <div v-for="n in count" :key="n" class="tile">{{ n }}</div>
      </IntGrid>
    </div>

    <div>
      <div class="caption">columns — fixed 3, gap 4</div>
      <IntGrid mode="columns" fixed-height extra-class="frame" :columns="3" :item-height="40" :gap="4" :extra-styles="boxStyle">
        <div v-for="n in count" :key="n" class="tile">{{ n }}</div>
      </IntGrid>
    </div>

    <div>
      <div class="caption">columns — fixed 4, gap 0</div>
      <IntGrid mode="columns" fixed-height extra-class="frame" :columns="4" :item-height="40" :gap="0" :extra-styles="boxStyle">
        <div v-for="n in count" :key="n" class="tile">{{ n }}</div>
      </IntGrid>
    </div>

    <div>
      <div class="caption">columns — fixed 4, bottom-up (visual/flow)</div>
      <IntGrid mode="columns" flow="btt" fixed-height extra-class="frame" :columns="4" :item-height="40" :gap="4" :extra-styles="boxStyle">
        <div v-for="n in count" :key="n" class="tile coords">{{ n }}</div>
      </IntGrid>
    </div>

    <div>
      <div class="caption">masonry — vertical, natural heights</div>
      <IntGrid mode="masonry" direction="vertical" extra-class="frame" :item-width="64" :gap="4" :extra-styles="widthStyle">
        <div v-for="n in count" :key="n" class="tile" :style="{ minHeight: tileHeight(n - 1) + 'px' }">{{ n }}</div>
      </IntGrid>
    </div>

    <div>
      <div class="caption">masonry — vertical, bottom-up</div>
      <IntGrid mode="masonry" direction="vertical" flow="btt" extra-class="frame" :item-width="64" :gap="4" :extra-styles="widthStyle">
        <div v-for="n in count" :key="n" class="tile" :style="{ minHeight: tileHeight(n - 1) + 'px' }">{{ n }}</div>
      </IntGrid>
    </div>

    <div>
      <div class="caption">masonry — horizontal, natural widths</div>
      <IntGrid mode="masonry" direction="horizontal" fixed-height extra-class="frame" :item-height="40" :gap="4" :extra-styles="boxStyle">
        <div v-for="n in count" :key="n" class="tile" :style="{ minWidth: tileWidth(n - 1) + 'px' }">{{ n }}</div>
      </IntGrid>
    </div>

    <div>
      <div class="caption">masonry — horizontal, right-to-left</div>
      <IntGrid mode="masonry" direction="horizontal" flow="rtl" fixed-height extra-class="frame" :item-height="40" :gap="4" :extra-styles="boxStyle">
        <div v-for="n in count" :key="n" class="tile" :style="{ minWidth: tileWidth(n - 1) + 'px' }">{{ n }}</div>
      </IntGrid>
    </div>

    <div>
      <div class="caption">areas — 2fr 1fr / 1fr 3fr</div>
      <IntGrid
        mode="areas"
        cols="2fr 1fr"
        rows="1fr 3fr"
        areas="title title / body side"
        extra-class="frame"
        :gap="4"
        :extra-styles="boxStyle"
      >
        <div data-intgrid-area="title" class="tile">title</div>
        <div data-intgrid-area="body" class="tile">body</div>
        <div data-intgrid-area="side" class="tile">side</div>
      </IntGrid>
    </div>

    <div>
      <div class="caption">areas — 3 columns, empty cell</div>
      <IntGrid
        mode="areas"
        cols="1fr 2fr 1fr"
        rows="1fr 2fr"
        areas="head head head / tree list ."
        extra-class="frame"
        :gap="4"
        :extra-styles="boxStyle"
      >
        <div data-intgrid-area="head" class="tile">head</div>
        <div data-intgrid-area="tree" class="tile">tree</div>
        <div data-intgrid-area="list" class="tile">list</div>
      </IntGrid>
    </div>
  </div>
</template>

<style scoped>
.int-grid-tester {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: flex-start;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  flex-basis: 100%;
}

.caption {
  margin-bottom: 4px;
}

.frame {
  outline: 2px dashed rgba(0, 0, 0, 0.4);
}

.tile {
  background: #cbcbcb;
  border: 2px solid #555555;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tile.coords::after {
  content: " " attr(data-win55-row) ":" attr(data-win55-col) "/" attr(data-win55-flow-row) ":" attr(data-win55-flow-col);
  font-size: 12px;
  opacity: 0.7;
}
</style>
