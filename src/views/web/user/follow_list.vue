<template>
    <Fc_focus_list :user-i-d="route.params.id" type="follow"></Fc_focus_list>
</template>

<script setup>
import Fc_focus_list from '@/components/web/fc_focus_list.vue';
import { useRoute } from 'vue-router';
const route = useRoute();
</script>


<style lang="less"></style>