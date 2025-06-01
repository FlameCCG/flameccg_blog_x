<script setup lang="ts">
import { useUserCenterStore } from '@/stores/user_center_store';
const userCenterStore = useUserCenterStore();
</script>

<template>
    <div class="fc_main" :class="`user_style_${userCenterStore.userDetail.homeStyleID}`">
        <div class="banner">
        </div>
        <div class="fc_container">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="less">
.fc_main {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 60px;
    min-height: calc(100vh - 120px);
    flex: 1;
    background-color: var(--color-neutral-2);

    >.fc_container {
        width: 1200px;
        min-height: calc(100vh - 80px);
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
    }
}
</style>