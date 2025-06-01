<script setup lang="ts">
import { reactive } from "vue";
import type { listResponse } from "@/api";
import { bannerListApi, type bannerListType } from "@/api/banner_api";
import fc_card from "@/components/common/fc_card.vue";

const data = reactive<listResponse<bannerListType>>({
    list: [],
    count: 0
});

async function getData() {
    const res = await bannerListApi({ type: 2 });
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
    <fc_card title="独家推广" class="extension-banner">
        <a-carousel class="fc_banner_com" v-if="data.list.length">
            <a-carousel-item v-for="item in data.list">
                <img :src="item.cover" @click="goLink(item)" :class="{ 'has-link': item.href !== '' }" />
            </a-carousel-item>
        </a-carousel>
    </fc_card>
</template>

<style lang="less">
.extension-banner {
    .body {
        padding: 20px;
    }

    .fc_banner_com {
        height: 200px;

        .has-link {
            cursor: pointer;
        }
    }

    .arco-carousel img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>