<script setup lang="ts">
interface Props {
  title: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="fc_card">
    <div class="title">
      {{ props.title }}
    </div>
    <div class="body">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.fc_card {
  background-color: var(--color-bg-1);
  border-radius: 10px;

  .title {
    padding: 20px;
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text-1);
    border-bottom: @fc_border;
  }
}
</style>
