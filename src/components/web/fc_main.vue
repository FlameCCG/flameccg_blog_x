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
    flex-direction: column;
    align-items: center;
    margin-top: 64px;
    min-height: calc(100vh - 128px);
    flex: 1;
    background: linear-gradient(180deg, var(--color-fill-1), var(--color-fill-2));

    >.banner {
        width: 100%;
        max-width: 1200px;
        height: 220px;
        margin: 0 24px;
        border-radius: 12px;
        background: linear-gradient(135deg, rgb(var(--arcoblue-4)), rgb(var(--arcoblue-6)));
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    }

    >.fc_container {
        width: 100%;
        max-width: 1200px;
        min-height: calc(100vh - 80px);
        margin-top: 24px;
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
    }
}
</style>