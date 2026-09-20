<script setup lang="ts">
import SimpleStringInput from './SimpleStringInput.vue'
import type { BaseInputProps } from './BaseInput.vue'

defineProps<Omit<BaseInputProps, 'allow'>>()
</script>

<template>
  <SimpleStringInput v-bind="$props" :allow="/[0-9.-]/" />
</template>
