<template>
  <div class="web-container">
    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">


</script>

<style scoped lang="less">
.web-container {
  display: flex;
  flex-direction: column;
  background-color: var(--color-neutral-2);
  width: 100vw;
}
</style>