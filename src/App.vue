<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style lang="less">
.arco-trigger-popup {
  z-index: 1000 !important;
}
</style>
