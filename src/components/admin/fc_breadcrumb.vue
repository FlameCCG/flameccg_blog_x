<template>
  <a-space direction="vertical">
    <a-breadcrumb>
      <template #separator>
        <icon-right />
      </template>
      <template v-for="r in route.matched">
        <a-breadcrumb-item v-if="r.name !== 'home'">{{ r.meta?.title }}</a-breadcrumb-item>
      </template>
    </a-breadcrumb>
  </a-space>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();

console.log(route.matched);
</script>

<style scoped></style>
