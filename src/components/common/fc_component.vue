<template>
  <component :is="props.is" v-if="typeof props.is === 'object'" />
  <i :class="props.is" v-else></i>
</template>
<script lang="ts" setup>
import { type Component } from 'vue';

interface Props {
  is?: string | Component;
}
const props = defineProps<Props>();
</script>
<style scoped></style>
