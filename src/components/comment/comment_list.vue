<template>
    <div class="comment_list_com">
        <div class="comment-header-bar">
            <a-checkbox class="select-all" @change="selectAll" v-model="isCheckAll">全选</a-checkbox>
            <a-button @click="removeComment" type="outline" size="small" status="danger" v-if="checkDeleteIds.length">
                <template #icon><icon-delete /></template>
                删除
            </a-button>
        </div>
        <a-spin :loading="loading" dot>
            <div class="comment-list">
                <a-checkbox-group v-model="checkDeleteIds">
                    <div v-for="item in data.list" :key="item.id" class="comment-item">
                        <div class="comment-checkbox">
                            <a-checkbox :value="item.id"></a-checkbox>
                        </div>
                        <a-avatar :image-url="item.userAvatar" :size="36" class="user-avatar" v-if="props.type === 1" />
                        <slot :item="item"></slot>
                    </div>
                </a-checkbox-group>
                <div v-if="!data.list.length && !loading" class="empty-state">
                    <icon-empty />
                    <p>暂无评论</p>
                </div>
            </div>
        </a-spin>

        <div class="comment-pagination">
            <a-pagination :total="data.count" :page-size="params.limit" show-total show-jumper size="small"
                v-model:current="params.page" @change="handlePageChange" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAxios, type listResponse } from '@/api';
import { commentList, commentRemove, type commentListReq, type commentListRes } from '@/api/comment_api';
import Fc_a from '@/components/common/fc_a.vue';
import Fc_label from '@/components/common/fc_label.vue';
import { relationOptions } from '@/options/options';
import { dateTimeFormat } from '@/utils/date';
import { Message } from '@arco-design/web-vue';
import { reactive, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

interface Props {
    type: 1 | 2
}
const props = defineProps<Props>();
const loading = ref(false);
const isCheckAll = ref(false);
const selectAll = (val: boolean) => {
    console.log(val);
    if (val) {
        checkDeleteIds.value = data.list.map((item) => item.id);
    } else {
        checkDeleteIds.value = [];
    }
}
const params = reactive<commentListReq>({
    type: props.type,
    page: 1,
    limit: 10
});
watch(() => route.query.key, () => {
    console.log(route.query.key);
    if (route.query.key) {
        params.key = route.query.key as string;
        getData();
    }
})
const data = reactive<listResponse<commentListRes>>({
    list: [],
    count: 0
});



const checkDeleteIds = ref<number[]>([]);
const getData = async () => {
    loading.value = true;
    try {
        const res = await commentList(params);
        Object.assign(data, res.data);
    } catch (error) {
        console.error('获取评论列表失败', error);
    } finally {
        loading.value = false;
    }
};

const handlePageChange = (page: number) => {
    params.page = page;
    getData();
    // 滚动到评论区顶部
    const container = document.querySelector('.comment-container');
    if (container) {
        container.scrollIntoView({ behavior: 'smooth' });
    }
};
const removeComment = async () => {
    const resList = await Promise.all(checkDeleteIds.value.map((item) => commentRemove(item)))
    resList.forEach((res) => {
        if (res.code) {
            console.error('删除评论失败', res.msg);
            return
        }
    })
    Message.success("删除成功");
    checkDeleteIds.value = [];
    getData();
}
defineExpose(
    {
        getData,
    }
)
onMounted(() => {
    getData();
});
</script>

<style lang="less">
.comment_list_com {
    background-color: var(--color-bg-2);
    border-radius: 6px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
    padding: 16px;

    .arco-spin {
        width: 100%;
    }

    .comment-header-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 12px;
        margin-bottom: 12px;
        border-bottom: 1px solid var(--color-border-1);
        height: 24px;

        .select-all {
            font-size: 13px;
        }

        .arco-btn {
            font-size: 13px;
            padding: 0 12px;


            .arco-icon {
                font-size: 14px;
            }
        }
    }

    .comment-list {
        .arco-checkbox-group {
            width: 100%;
        }

        .comment-item {
            display: flex;
            padding: 12px;
            margin-bottom: 12px;
            border-radius: 6px;
            background-color: var(--color-bg-1);
            border: 1px solid var(--color-border-2);
            transition: all 0.2s ease;

            &:hover {
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
            }

            .comment-checkbox {
                display: flex;
                align-items: flex-start;
                padding-top: 8px;
                margin-right: 6px;
            }

            .user-avatar {
                margin-right: 12px;
                border: 1px solid var(--color-primary-light-4);
            }
        }

        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 30px 0;
            color: var(--color-text-3);

            .arco-icon {
                font-size: 40px;
                margin-bottom: 8px;
                color: var(--color-text-4);
            }

            p {
                font-size: 13px;
            }
        }
    }

    .comment-pagination {
        display: flex;
        justify-content: center;
        margin-top: 16px;

        .arco-pagination-item {
            margin: 0 2px;
        }
    }

    .comment-content {
        flex: 1;
        min-width: 0;

        .comment-header {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;

            .user-nickname {
                font-weight: 500;
                font-size: 14px;
                color: var(--color-text-1);
            }

            .comment-time {
                color: var(--color-text-3);
                font-size: 12px;
                display: flex;
                align-items: center;
                margin-left: auto;

                .arco-icon {
                    margin-right: 3px;
                    font-size: 12px;
                }
            }
        }

        .comment-text {
            color: var(--color-text-2);
            font-size: 14px;
            line-height: 1.5;
            margin: 6px 0;
        }

        .comment-footer {
            margin-top: 8px;

            .comment-actions-bar {
                display: flex;
                align-items: center;

                .action-divider {
                    height: 12px;
                    width: 1px;
                    background-color: var(--color-border-2);
                    margin: 0 4px;
                }

                .action-btn {
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    color: var(--color-text-3);
                    transition: all 0.2s;
                    padding: 3px 6px;
                    border-radius: 3px;
                    font-size: 12px;

                    .arco-icon {
                        margin-right: 3px;
                        font-size: 13px;
                    }
                }

                .like-btn:hover {
                    color: #ff5252;
                }
            }
        }
    }

    .article-preview {
        width: 150px;
        margin-left: 12px;
        border-radius: 4px;
        overflow: hidden;
        background-color: var(--color-bg-2);
        border: 1px solid var(--color-border-2);

        .article-cover {
            height: 80px;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.2s;
            }
        }

        .article-title {
            padding: 6px;
            font-size: 12px;
            color: var(--color-text-2);
        }

        &:hover img {
            transform: scale(1.05);
        }
    }
}
</style>