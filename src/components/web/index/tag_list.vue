<template>
    <Fc_card title="标签云" class="fc_tag_list_com">
        <div class="tag_list">
            <div class="item" v-for="item in data.list" :class="{ active: item.tag === route.query.tag }"
                @click="goTag(item)">
                <span class="tag">{{ item.tag }}</span>
                <span class="count">{{ item.articleCount }}</span>
            </div>
        </div>
    </Fc_card>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { listResponse, paramsType } from "@/api";
import { tagListApi, type tagListRes } from "@/api/search_api";
import { relativeTimeFormat } from "@/utils/date";
import router from "@/router";
import Fc_card from "@/components/common/fc_card.vue";
import { useRoute } from "vue-router";
const route = useRoute();
const params = reactive<paramsType>({
    limit: 10,
});
const data = reactive<listResponse<tagListRes>>({
    list: [],
    count: 0
});

const loading = ref(false);
async function getData() {
    loading.value = true;
    const res = await tagListApi(params);
    loading.value = false;
    Object.assign(data, res.data);
}
getData();

async function goTag(item: tagListRes) {
    let tag = item.tag
    if (tag === route.query.tag) {
        tag = ""
    }
    router.push({
        name: route.name as string,
        query: {
            tag: tag,
        }
    })
}
</script>
<style lang="less">
.fc_tag_list_com {
    .body {
        padding: 20px;
        position: relative;
        overflow: hidden; // 隐藏变形时可能产生的轻微溢出

        &::before {
            display: block;
            content: "";
            width: 20px;
            height: 20px;
            // 初始状态：一个蓝色的发光球
            background-color: rgb(var(--arcoblue-6));
            border-radius: 50%; // 变成圆形
            box-shadow: 0 0 12px rgb(var(--arcoblue-6)), 0 0 4px white; // 增加光晕效果

            position: absolute;
            left: 0;
            top: 0;
            // 动画时间稍作延长，让变形效果更舒展
            animation: creative_move 5s infinite ease-in-out;
        }

        // --- 核心改动在这里 ---
        // 保留了原有的 left/top 移动路径，但增加了 transform, border-radius, background-color 的变化
        @keyframes creative_move {
            0% {
                left: 0;
                top: 0;
                transform: rotate(0deg);
                border-radius: 50%; // 圆形
                background-color: rgb(var(--arcoblue-6));
                box-shadow: 0 0 12px rgb(var(--arcoblue-6));
            }

            25% {
                left: calc(100% - 20px);
                top: 0px;
                transform: rotate(360deg);
                border-radius: 50% 70% 50% 30%; // 变形
                background-color: rgb(var(--green-6));
                box-shadow: 0 0 15px rgb(var(--green-6));
            }

            50% {
                left: calc(100% - 20px);
                top: calc(100% - 20px);
                transform: rotate(720deg);
                border-radius: 50%; // 变回圆形
                background-color: rgb(var(--orangered-6));
                box-shadow: 0 0 12px rgb(var(--orangered-6));
            }

            75% {
                top: calc(100% - 20px);
                left: 0;
                transform: rotate(1080deg);
                border-radius: 30% 50% 70% 50%; // 再次变形
                background-color: rgb(var(--purple-6));
                box-shadow: 0 0 15px rgb(var(--purple-6));
            }

            100% {
                left: 0;
                top: 0;
                transform: rotate(1440deg);
                border-radius: 50%; // 恢复初始状态
                background-color: rgb(var(--arcoblue-6));
                box-shadow: 0 0 12px rgb(var(--arcoblue-6));
            }
        }

        .tag_list {
            display: flex;
            flex-wrap: wrap;

            .item {
                width: 50%;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: var(--color-text-1);
                // 确保标签内容在动画之上
                position: relative;
                z-index: 2;

                &.active {
                    color: rgb(var(--arcoblue-6));
                }

                &:nth-child(4n + 3),
                &:nth-child(4n + 4) {
                    background-color: var(--color-fill-1);
                }

                &:nth-child(4n + 1),
                &:nth-child(4n + 2) {
                    background-color: var(--color-fill-2);
                }
            }
        }
    }
}
</style>