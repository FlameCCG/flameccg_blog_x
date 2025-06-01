<template>
    <a-badge class="fc_point_com" :count="props.count" dot :dot-style="{ width: '5px', height: '5px' }">
        <slot></slot>
    </a-badge>
</template>

<script setup lang="ts">
interface Props {
    count: number;
}
const props = defineProps<Props>();

</script>

<style lang="less"></style>