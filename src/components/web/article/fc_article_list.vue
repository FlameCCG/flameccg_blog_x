<template>
    <div class="fc_article_list_com_parent">
        <div class="actions" v-if="isCheck">
            <span class="batch-action" @click="isCheckHandler">批量操作</span>
            <a-button size="mini" status="danger" v-if="checkIDList.length > 0 && isCheckShow" class="batch-delete"
                @click="dispatchDelete">批量删除</a-button>
        </div>
        <div class="fc_article_list_com">
            <a-spin :loading="loading" tip="Loading...">
                <a-checkbox-group v-model="checkIDList">
                    <div class="item" v-for="item in data.list" :key="item.id" @click="goToDetail(item)">
                        <div class="check-box" v-if="isCheck && isCheckShow" @click.stop>
                            <a-checkbox :value="item.id">
                            </a-checkbox>
                        </div>
                        <div class="cover">
                            <img v-if="item.cover" :src="item.cover" alt="封面" />
                            <div v-else class="no-cover">
                                <icon-file-image />
                            </div>
                        </div>
                        <div class="user_top" v-if="item.userTop">
                            <span class="ribbon-text">置顶</span>
                            <span class="ribbon-left"></span>
                            <span class="ribbon-right"></span>
                        </div>
                        <div class="info">
                            <div class="title">{{ item.title }}</div>
                            <div class="abs">
                                <a-typography-text :ellipsis="{ rows: 1, css: true }">{{
                                    item.abstract
                                    }}</a-typography-text>
                            </div>
                            <div class="data">
                                <div class="stats">
                                    <span class="stat-item">
                                        <IconEye />
                                        <span>{{ item.lookCount }}</span>
                                    </span>
                                    <span class="stat-item">
                                        <IconMessage />
                                        <span>{{ item.commentCount }}</span>
                                    </span>
                                </div>
                                <div class="tags">
                                    <a-tag v-for="tag in item.tagList" size="small">{{ tag }}</a-tag>
                                </div>
                                <div class="date">
                                    最后更新于{{ relativeTimeFormat(item.updateAt) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </a-checkbox-group>
            </a-spin>
            <div class="page" v-if="data.count > 0">
                <a-pagination v-model:current="params.page" :total="data.count" :page-size="params.limit" show-total
                    size="small" @change="getData"></a-pagination>
            </div>
            <div class="no-data" v-if="data.list.length === 0 && !loading">
                <a-empty description="暂无数据" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { articleListApi, type articleListRequest, type articleListType } from '@/api/article_api';
import { type listResponse } from '@/api/index';
import router from '@/router';
import { relativeTimeFormat } from '@/utils/date';
import { reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
const loading = ref(false);
const route = useRoute();
function goToDetail(item: articleListType) {
    router.push(`/article/${item.id}`);
}
const isCheckShow = ref(false);
const isCheckHandler = () => {
    isCheckShow.value = !isCheckShow.value;
}
async function getData() {
    try {
        loading.value = true;
        const res = await articleListApi(params);
        console.log(res)
        data.list = res.data.list;
        data.count = res.data.count;
    } catch (error) {
        console.log(error)
        params.page = 2
    } finally {
        loading.value = false;
    }
}

interface Props {
    isCheck?: boolean;
}
const props = defineProps<Props>();
const emits = defineEmits(['dispatchDelete']);
const checkIDList = ref<number[]>([]);


const data = reactive<listResponse<articleListType>>({
    list: [],
    count: 0,
});

const params = reactive<articleListRequest>({
    type: 1,
    limit: 4,
    page: 1,
    userID: Number(route.params.id),
});
watch(() => route.query, () => {
    const categoryID = Number(route.query.categoryID);
    if (isNaN(categoryID)) {
        params.categoryID = undefined
    } else {
        params.categoryID = categoryID
    }
    if (route.query.key !== undefined) {
        params.key = route.query.key as string;
    }
    const collectID = Number(route.query.collectID);
    console.log(collectID)
    if (isNaN(collectID)) {
        params.collectID = undefined
    } else {
        params.collectID = collectID
    }
    if (route.query.key !== undefined) {
        params.key = route.query.key as string;
    }
    console.log(params)
    getData()
}, {
    deep: true,
    immediate: true,
})
defineExpose({
    getData,
})
const dispatchDelete = async () => {
    emits('dispatchDelete', checkIDList.value);
    checkIDList.value = []
}
</script>

<style lang="less">
.fc_article_list_com_parent {
    width: 100%;

    .actions {
        height: 30px;

        >* {
            margin-left: 40px;
        }

        span.batch-action {
            color: var(--color-text-1);
            cursor: pointer;
        }
    }

    .fc_article_list_com {
        position: relative;
        padding-left: 16px;

        .arco-spin {
            width: 100%;

            .arco-checkbox-group {
                width: 100%;
            }
        }

        .item {
            display: flex;
            padding: 16px;
            margin-bottom: 8px;
            transition: all 0.2s ease;
            position: relative;
            cursor: pointer;
            border-radius: 4px;
            overflow: hidden;

            &:last-child {
                margin-bottom: 10px;
            }

            &:hover {
                background-color: var(--color-fill-1);

                .title {
                    color: rgb(var(--primary-6));
                }

                .cover {
                    img {
                        transform: scale(1.05);
                    }
                }
            }

            a.router-link-active {
                background-color: var(--color-fill-1) !important;
            }

            .cover {
                width: 120px;
                min-width: 120px;
                height: 75px;
                margin-right: 16px;
                border-radius: 4px;
                overflow: hidden;

                .no-cover {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: var(--color-text-3);
                    font-size: 24px;
                    background: var(--color-fill-2);
                    width: 100%;
                    height: 100%;
                }

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }
            }

            .user_top {
                position: absolute;
                top: 0;
                right: 0;
                z-index: 2;
                height: 40px;
                width: 100px;
                pointer-events: none;
                display: flex;
                align-items: flex-start;
                justify-content: flex-end;

                .ribbon-text {
                    position: absolute;
                    right: -32px;
                    top: 8px;
                    display: block;
                    width: 90px;
                    text-align: center;
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--color-text-2);
                    letter-spacing: 1px;
                    background: linear-gradient(120deg, #ff4d4f 60%, #ffb300 100%);
                    border-radius: 3px;
                    padding: 2px 0;
                    transform: rotate(45deg);
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                    box-shadow: 0 2px 4px 0 rgba(255, 77, 79, 0.3);
                }

                .ribbon-left,
                .ribbon-right {
                    position: absolute;
                    top: 22px;
                    width: 13px;
                    height: 13px;
                    background: linear-gradient(135deg, #ff4d4f 80%, #ffb300 100%);
                    z-index: -1;
                    border-radius: 2px;
                    opacity: 0.8;
                }

                .ribbon-left {
                    left: 30px;
                    transform: rotate(20deg) skewY(20deg);
                    box-shadow: -1px 1px 3px rgba(255, 77, 79, 0.2);
                }

                .ribbon-right {
                    right: -5px;
                    transform: rotate(-20deg) skewY(-20deg);
                    box-shadow: 1px 1px 3px rgba(255, 77, 79, 0.2);
                }
            }

            .info {
                flex: 1;
                display: flex;
                flex-direction: column;
                overflow: hidden;

                .title {
                    font-size: 16px;
                    font-weight: 500;
                    color: var(--color-text-1);
                    transition: color 0.2s ease;
                    margin-bottom: 6px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .abs {
                    font-size: 13px;
                    color: var(--color-text-3);
                    line-height: 1.5;
                    margin-bottom: 8px;
                    max-height: 19.5px;
                    overflow: hidden;
                }

                .data {
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    color: var(--color-text-3);

                    .stats {
                        display: flex;
                        align-items: center;

                        .stat-item {
                            display: flex;
                            align-items: center;
                            margin-right: 12px;

                            .arco-icon {
                                font-size: 14px;
                                margin-right: 4px;
                            }
                        }
                    }

                    .tags {
                        display: flex;
                        align-items: center;
                        flex-wrap: nowrap;
                        overflow: hidden;
                        margin-right: auto;
                        max-width: 50%;

                        .arco-tag {
                            margin-right: 4px;
                            padding: 0 6px;
                            font-size: 12px;
                            height: 20px;
                            line-height: 18px;
                            background: var(--color-fill-2);
                            border: none;
                            white-space: nowrap;

                            &:last-child {
                                margin-right: 0;
                            }
                        }
                    }

                    .date {
                        color: var(--color-text-3);
                        font-size: 12px;
                        white-space: nowrap;
                    }
                }
            }
        }

        .page {
            margin: 16px 0;
            display: flex;
            justify-content: center;

            .arco-pagination {
                font-size: 13px;
            }
        }

        .no-data {
            margin: 40px 0;
        }
    }
}
</style>