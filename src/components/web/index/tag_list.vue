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

        &::before {
            display: block;
            content: "";
            width: 20px;
            height: 20px;
            background-color: rgb(var(--arcoblue-6));
            position: absolute;
            left: 0;
            top: 0;
            animation: box_move 3s infinite ease-in-out;
        }

        @keyframes box_move {
            0% {
                left: 0;
                top: 0;
            }

            25% {
                left: calc(100% - 20px);
                top: 0px;
            }

            50% {
                left: calc(100% - 20px);
                top: calc(100% - 20px);
            }

            75% {
                top: calc(100% - 20px);
                left: 0;
            }

            to {
                left: 0;
                top: 0;
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