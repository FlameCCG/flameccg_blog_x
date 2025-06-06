<template>
    <fc_card title="作者推荐" class="auth_recommend_com">
        <a-spin :loading="loading" class="full-width">
            <template #empty>
                <a-empty description="暂无推荐作者" />
            </template>
            <div class="item" v-for="item in data.list" :key="item.userID">
                <router-link :to="{ name: 'userArticle', params: { id: item.userID } }" class="author-link">
                    <a-avatar :image-url="item.userAvatar" :size="40"></a-avatar>
                    <div class="info">
                        <div class="userNickName">
                            <a-typography-text :ellipsis="{ rows: 1 }">{{ item.userNickName }}</a-typography-text>
                        </div>
                        <div class="abs">
                            <a-typography-text :ellipsis="{ rows: 1 }">{{ item.userAbstract || '这个作者很懒，还没有介绍自己~'
                                }}</a-typography-text>
                        </div>
                    </div>
                </router-link>
                <a-button type="outline" size="mini" status="success" @click.stop="focus(true, item.userID)">
                    <template #icon>
                        <icon-plus />
                    </template>
                    关注
                </a-button>
            </div>
        </a-spin>
    </fc_card>
</template>

<script setup lang="ts">
import type { listResponse, paramsType } from '@/api';
import { authorRecommendApi, type authorRecommendRes } from '@/api/user_api';
import { reactive, ref } from 'vue';
import fc_card from '@/components/common/fc_card.vue';
import { focusService } from '@/service/focus';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/stores/user_store';
import { showLogin } from '../fc_login';

const loading = ref(false);
const params = reactive<paramsType>({
    limit: 6
});
const store = useUserStore();
const focus = async (isFocusing: boolean, userID: number) => {
    if (!store.isLogin) {
        Message.info('请先登录');
        showLogin()
        return
    }
    try {
        await focusService(isFocusing, userID);
        getData();
    } catch (error) {
        Message.error('关注失败');
    }
}

const data = reactive<listResponse<authorRecommendRes>>({
    list: [],
    count: 0
});

const getData = async () => {
    loading.value = true;
    try {
        const res = await authorRecommendApi(params);
        Object.assign(data, res.data)
        console.log(data);
    } catch (error) {
        Message.error('获取推荐作者失败');
    } finally {
        loading.value = false;
    }
}

getData();
</script>

<style lang="less" scoped>
.auth_recommend_com {
    .full-width {
        width: 100%;
    }

    :deep(.body) {
        padding: 16px;
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        border-radius: 12px;
        transition: all 0.3s ease;
        margin-bottom: 8px;
        border: 1px solid transparent;

        &:hover {
            background-color: var(--color-fill-2);
            border-color: var(--color-border-2);
            transform: translateY(-2px);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        &:last-child {
            margin-bottom: 0;
        }

        .author-link {
            display: flex;
            align-items: center;
            flex: 1;
            overflow: hidden;
            text-decoration: none;
            color: inherit;
        }

        :deep(.arco-avatar) {
            flex-shrink: 0;
            margin-right: 12px;
            border: 2px solid var(--color-fill-3);
            transition: transform 0.3s ease;

            &:hover {
                transform: scale(1.05);
            }
        }

        .info {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-right: 12px;

            .userNickName {
                font-size: 14px;
                font-weight: 600;
                color: var(--color-text-1);

                :deep(.arco-typography) {
                    line-height: 1.2;
                }
            }

            .abs {
                font-size: 12px;
                color: var(--color-text-3);

                :deep(.arco-typography) {
                    line-height: 1.2;
                }
            }
        }

        :deep(.arco-btn) {
            flex-shrink: 0;
            border-radius: 20px;
            padding: 0 12px;
            transition: all 0.3s ease;

            &:hover {
                background-color: rgb(var(--success-6));
                color: #fff;
            }
        }
    }
}
</style>