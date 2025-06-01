        
<script setup lang="ts">
import { ref } from 'vue'
import { theme, setTheme, loadTheme } from './fc_theme';
loadTheme()
</script>
<template>
    <span title="白天模式" class="theme-switch" v-if="theme === 'dark'"><icon-sun-fill @click="setTheme('')" /></span>
    <span title="夜间模式" class="theme-switch" v-if="theme === 'light'"><icon-moon-fill @click="setTheme('dark')" /></span>
</template>

<style scoped lang="less">
.theme-switch {
    color: var(--color-text-1);
    cursor: pointer;
}
</style>