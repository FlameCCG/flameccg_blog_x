<template>
    <a-tag :color="item.color">{{ item.label }}</a-tag>
</template>

<script setup lang="ts">
import { type optionsType } from "@/options/options";
import { computed, defineProps } from "vue";
interface Props {
    value: number | string | undefined;
    options: optionsType[];
}
const props = defineProps<Props>();
const item = computed(() => {
    const option = props.options.find(item => item.value === props.value);
    if (option) {
        return option;
    }
    return { label: "无", color: "" };
});
</script>

<style lang="less">
.arco-tag {
    border-radius: 5px;
    color: var(--color-text-2);
    margin-left: 8px;
}
</style>