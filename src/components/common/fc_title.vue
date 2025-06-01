<template>
    <div class="fc_title" :class="`fc_title_${type}`">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
interface Props {
    type?: 1 | 2
}
const props = defineProps<Props>();
const { type = 1 } = props;
</script>

<style scoped lang="less">
.fc_title {
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 16px;

    &::before {
        margin-right: 5px;
        width: 4px;
        height: 1.5rem;
        content: "";
        display: inline-block;
        background: rgb(var(--primary-6));
    }

    &.fc_title_1 {
        &::before {
            width: 4px;
            height: 1.5rem;
        }
    }

    &.fc_title_2 {
        &::before {
            width: 5px;
            height: 5px;
            border-radius: 50%;
        }
    }
}
</style>