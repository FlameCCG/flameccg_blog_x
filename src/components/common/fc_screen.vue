<template>
    <icon-fullscreen v-if="!isFullScreen" @click="fullScreen" class="cursor-pointer" />
    <icon-fullscreen-exit v-else @click="exitFullScreen" class="cursor-pointer" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const isFullScreen = ref(false);
const fullScreen = () => {
    document.documentElement?.requestFullscreen();
    isFullScreen.value = true;
}

const exitFullScreen = () => {
    document?.exitFullscreen();
    isFullScreen.value = false;
}
</script>

<style scoped></style>