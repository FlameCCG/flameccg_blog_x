<script setup lang="ts">
import { reactive } from "vue";
import type { listResponse } from "@/api";
import { bannerListApi, type bannerListType } from "@/api/banner_api";

const data = reactive<listResponse<bannerListType>>({
    list: [],
    count: 0
});

async function getData() {
    const res = await bannerListApi({ type: 1 });
    const list: bannerListType[] = []
    res.data.list.forEach(item => {
        if (item.show) {
            list.push(item);
        }
    })
    data.list = list;
}
const goLink = (item: bannerListType) => {
    if (item.href === "") {
        return
    }
    window.open(item.href, "_blank");
}
getData();
</script>

<template>
    <a-carousel class="fc_banner_com" v-if="data.list.length">
        <a-carousel-item v-for="item in data.list">
            <img :src="item.cover" @click="goLink(item)" :class="{ 'has-link': item.href !== '' }" />
        </a-carousel-item>
    </a-carousel>
</template>

<style lang="less">
.fc_banner_com {
    height: 300px;

    .has-link {
        cursor: pointer;
    }
}

.arco-carousel img {
    width: 100%;
    height: 100%;
}
</style>