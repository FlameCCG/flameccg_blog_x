<script setup lang="ts">
import type { Component } from 'vue';
import { useUserStore } from '@/stores/user_store';
import fc_menu_item from '@/components/admin/fc_menu_item.vue';
import Fc_component from '../common/fc_component.vue';

const userStore = useUserStore();

interface MenuType {
    title: string;
    name: string;
    icon?: string | Component;
    children?: MenuType[];
    role?: number
}

// usage
interface Props {
    list: MenuType[];
}

const props = defineProps<Props>();
</script>

<template>
    <template v-for="menu in props.list" :key="menu.name">
        <a-menu-item :key="menu.name"
            v-if="!menu.children && (menu.role === undefined || userStore.userBaseInfo.role === 1)">
            <template #icon>
                <fc_component :is="menu.icon" />
            </template>
            {{ menu.title }}
        </a-menu-item>
        <a-sub-menu :key="menu.name"
            v-if="menu.children && (menu.role === undefined || userStore.userBaseInfo.role === 1)">
            <template #icon>
                <fc_component :is="menu.icon" />
            </template>
            <template #title>{{ menu.title }}</template>
            <fc_menu_item :list="menu.children">
            </fc_menu_item>
        </a-sub-menu>
    </template>
</template>
<style scoped></style>
@/stores/user_store