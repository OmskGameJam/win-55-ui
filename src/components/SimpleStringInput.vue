<script setup lang="ts">
import { computed } from 'vue'
import BaseInput, { type BaseInputProps } from './BaseInput.vue'
import { EMOJI_PATTERN } from '../helpers/inputFilters'

const props = defineProps<BaseInputProps>()

const denyPattern = computed(() =>
  props.deny ? new RegExp(`${EMOJI_PATTERN.source}|${props.deny.source}`, 'u') : EMOJI_PATTERN)
</script>

<template>
  <BaseInput v-bind="props" :deny="denyPattern" />
</template>
