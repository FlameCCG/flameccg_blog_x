<template>
    <fc_card title="文章推荐" class="article_recommend_com">
        <a-spin :loading="loading" class="full-width">
            <template #empty>
                <a-empty description="暂无推荐文章" />
            </template>
            <div class="item" v-for="item in data" :key="item.id">
                <router-link :to="{ name: 'article', params: { id: item.id } }" class="article-link">
                    <div class="article-content">
                        <div class="title-row">
                            <a-typography-text :ellipsis="{ rows: 2 }" class="title">{{ item.title
                            }}</a-typography-text>
                        </div>
                        <div class="meta-info">
                            <span class="view-count">
                                <icon-eye />
                                {{ item.lookCount || 0 }}
                            </span>
                            <span class="author" v-if="item.userID">
                                <a-avatar :size="35" :image-url="item.userAvatar" style="margin-left: 10px;"
                                    @click.prevent.stop="handleAvatarClick(item.userID)"></a-avatar>
                                <a-typography-text :ellipsis="{ rows: 1 }" class="nickname"
                                    @click.prevent.stop="handleAvatarClick(item.userID)">{{ item.userNickName
                                    }}</a-typography-text>
                            </span>
                        </div>
                    </div>
                </router-link>
            </div>
        </a-spin>
    </fc_card>
</template>

<script setup lang="ts">
import type { paramsType } from '@/api';
import { articleRecommendApi, type articlerecommendRes } from '@/api/article_api';
import { reactive, ref } from 'vue';
import fc_card from '@/components/common/fc_card.vue';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const loading = ref(false);
const handleAvatarClick = (userId: number) => {
    if (userId) {
        router.push('/user/' + userId + '/article');
    }
};
const data = reactive<articlerecommendRes[]>([]);
const getData = async () => {
    loading.value = true;
    try {
        const res = await articleRecommendApi();
        Object.assign(data, res.data);
    } catch (error) {
        Message.error('获取推荐文章失败');
    } finally {
        loading.value = false;
    }
}
getData();
</script>

<style lang="less" scoped>
.article_recommend_com {
    .full-width {
        width: 100%;
    }

    :deep(.body) {
        padding: 16px;
    }

    .item {
        position: relative;
        padding: 12px 16px;
        border-radius: 8px;
        transition: all 0.3s ease;
        margin-bottom: 10px;
        border-left: 3px solid transparent;

        &:hover {
            background-color: var(--color-fill-2);
            border-left-color: rgb(var(--primary-6));
            transform: translateX(2px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        &:last-child {
            margin-bottom: 0;
        }

        .article-link {
            display: block;
            text-decoration: none;
            color: inherit;
        }

        .article-content {
            .title-row {
                margin-bottom: 10px;

                .title {
                    font-size: 15px;
                    font-weight: 500;
                    color: var(--color-text-1);
                    line-height: 1.4;
                    transition: color 0.2s;

                    &:hover {
                        color: rgb(var(--primary-6));
                    }
                }
            }

            .meta-info {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 12px;
                color: var(--color-text-3);

                .view-count {
                    display: flex;
                    align-items: center;

                    :deep(.arco-icon) {
                        margin-right: 4px;
                        font-size: 14px;
                        color: var(--color-text-3);
                    }
                }

                .author {
                    display: flex;
                    align-items: center;

                    :deep(.arco-avatar) {
                        margin-right: 6px;
                        border: 1px solid var(--color-fill-3);
                    }

                    .nickname {
                        font-weight: 500;
                        color: var(--color-text-2);
                        transition: color 0.2s;

                        &:hover {
                            color: rgb(var(--arcoblue-6));
                        }
                    }
                }
            }
        }
    }
}
</style>