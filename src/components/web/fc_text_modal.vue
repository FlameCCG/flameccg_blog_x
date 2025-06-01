<template>
    <a-modal title="全文搜索" @before-open="handleBeforeOpen" body-class="fc_article_search_modal" :visible="visible"
        @cancel="handleCancel" :footer="false">
        <div class="head">
            <a-input placeholder="请输入搜索内容" v-model="params.key" @keydown.enter="search" ref="searchInputRef"></a-input>
            <a-button type="primary" @click="search">搜索</a-button>
        </div>
        <div class="body">
            <div class="list scrollbar">
                <div class="item" v-for="item in data.list" @click="goArticleDeatil(item)">
                    <div class="title" v-html="item.head"></div>
                    <div class="abs" v-html="item.body"></div>
                </div>
            </div>
            <div class="page" v-if="isSearch">
                共搜索到{{ data.list.length }}条
            </div>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import type { listResponse, paramsType } from '@/api';
import { fullTextSearchApi, type fullTextSearchRes } from '@/api/search_api';
import { nextTick, reactive, ref } from 'vue';
const goArticleDeatil = (item: fullTextSearchRes) => {
    window.open(`/article/${item.articleID}?id=${item.head}`, "_blank")
}
interface Props {
    visible: boolean;
}
const searchInputRef = ref();
const props = defineProps<Props>();
const emit = defineEmits(['update:visible']);
const data = reactive<listResponse<fullTextSearchRes>>({
    list: [],
    count: 0
});
const params = reactive<paramsType>({
    limit: 22,
})
const isSearch = ref(false)
const search = async () => {
    isSearch.value = false;
    const res = await fullTextSearchApi(params)
    isSearch.value = true;
    Object.assign(data, res.data)
}
const handleCancel = () => {
    data.list = [];
    params.key = '';
    emit('update:visible', false)
}
const handleBeforeOpen = () => {
    nextTick(() => {
        if (params.key === '') {
            searchInputRef.value?.focus()
        }
    })
}
function setSearach(key: string) {
    params.key = key;
    search();
}
defineExpose({
    setSearach
})
</script>
<style lang="less">
.fc_article_search_modal {
    .head {
        padding: 10px 20px;
        display: flex;

        .arco-btn {
            margin-left: 10px;
        }
    }

    .body {
        .list {
            max-height: 60vh;
            overflow-y: auto;
        }

        .item {
            padding: 10px 20px;
            cursor: pointer;

            .title {
                font-size: 16px;
            }

            .abs {
                margin-top: 5px;
                font-size: 12px;
                overflow-x: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            em {
                color: red;
            }

            &:hover {
                background-color: var(--color-fill-1);
            }
        }

        .page {
            padding: 10px 20px;
            text-align: center;
            color: var(--color-text-2);
        }
    }
}
</style>