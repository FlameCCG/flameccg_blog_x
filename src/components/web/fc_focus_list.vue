<template>
    <div class="focus_list_view">
        <div class="user_list" v-if="data.list.length > 0">
            <div class="item" v-for="item in data.list" :key="item.userID">
                <div class="avatar-wrapper">
                    <a-avatar :image-url="item.userAvatar" @click="goUser(item.userID)"></a-avatar>
                    <div class="avatar-ring"></div>
                </div>
                <div class="info">
                    <div class="nick" @click="goUser(item.userID)">
                        {{ item.userNickname }}
                        <fc_label :options="relationOptions" :value="item.relationShip">
                        </fc_label>
                    </div>
                    <div class="abs">
                        <a-typography-text :ellipsis="{ rows: 1, css: true }">{{ item.userAbstract
                            }}</a-typography-text>
                    </div>
                    <div class="action" v-if="item.relationShip !== 5">
                        <a-button type="primary" @click="focus(false, item.userID)" size="mini"
                            v-if="item.relationShip === 2 || item.relationShip === 4" class="followed-btn">
                            <span class="btn-text">已关注</span>
                        </a-button>
                        <a-button @click="focus(true, item.userID)" size="mini" v-else class="follow-btn">
                            <span class="btn-text">关注</span>
                        </a-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="no-data" v-else>
            <div class="empty-container">
                <div class="empty-icon">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="60" cy="60" r="50" stroke="url(#gradient1)" stroke-width="2" opacity="0.1" />
                        <circle cx="60" cy="60" r="40" stroke="url(#gradient1)" stroke-width="2" opacity="0.2" />
                        <circle cx="60" cy="60" r="30" stroke="url(#gradient1)" stroke-width="2" opacity="0.3" />
                        <path
                            d="M30 60C30 43.4315 43.4315 30 60 30C76.5685 30 90 43.4315 90 60C90 76.5685 76.5685 90 60 90"
                            stroke="url(#gradient1)" stroke-width="3" stroke-linecap="round" />
                        <circle cx="45" cy="50" r="3" fill="var(--color-text-3)" />
                        <circle cx="75" cy="50" r="3" fill="var(--color-text-3)" />
                        <path d="M45 70C45 70 52 78 75 70" stroke="var(--color-text-3)" stroke-width="2"
                            stroke-linecap="round" />
                        <defs>
                            <linearGradient id="gradient1" x1="0" y1="0" x2="120" y2="120">
                                <stop offset="0%" stop-color="rgb(22, 93, 255)" />
                                <stop offset="100%" stop-color="rgb(114, 46, 209)" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <div class="empty-text">用户暂未关注任何人</div>
                <div class="empty-subtext">快去发现有趣的人吧~</div>
            </div>
        </div>
        <div class="page" v-if="data.list.length > 0">
            <a-pagination v-model:current="params.page" :total="data.count" :page-size="params.limit"
                @change="handlePageChange" show-total show-size-changer />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { listResponse } from '@/api';
import { FocusListApi, type focusAndFansRes, type focusAndFansReq, FansApi, followApi, unfollowApi } from '@/api/focus_api';
import Fc_label from '@/components/common/fc_label.vue';
import { relationOptions } from '@/options/options';
import { userBaseInfoStore } from '@/stores/user_base_store';
import { useUserStore } from '@/stores/user_store';
import { Message } from '@arco-design/web-vue';
import { reactive, watch } from 'vue';
import { useRoute } from 'vue-router';
import { showLogin } from './fc_login';
import router from '@/router';
import { focusService } from '@/service/focus';

const goUser = (id: number) => {
    router.push({ name: 'userArticle', params: { id } });
}

const focus = async (isFocusing: boolean, userID: number) => {
    focusService(isFocusing, userID)
    getData();
}

const handlePageChange = () => {
    getData();
}

interface Props {
    userID: number;
    type: "follow" | "fans";
}

const props = defineProps<Props>();

const data = reactive<listResponse<focusAndFansRes>>({
    list: [],
    count: 0,
});

const params = reactive<focusAndFansReq>({
    userID: props.userID,
    isMe: false,
    limit: 12, // 改为12，正好显示3行，每行4个
    page: 1
});

const store = useUserStore()

async function getData() {
    params.isMe = store.userBaseInfo.userID === props.userID;
    if (props.type === "follow") {
        const res = await FocusListApi(params);
        Object.assign(data, res.data);
    } else if (props.type === "fans") {
        const res = await FansApi(params);
        Object.assign(data, res.data);
    }
}

getData();

const route = useRoute();
watch(() => route.query.key, (key) => {
    params.key = key as string || '';
    getData();
})
</script>

<style lang="less">
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.2);
        opacity: 0.3;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

@keyframes shimmer {
    0% {
        background-position: -200% center;
    }

    100% {
        background-position: 200% center;
    }
}

.focus_list_view {
    padding: 24px;
    background: linear-gradient(135deg, var(--color-bg-1) 0%, var(--color-bg-2) 100%);
    min-height: calc(100vh - 48px);
    position: relative;
    display: flex;
    flex-direction: column;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background:
            radial-gradient(circle at 20% 50%, rgba(22, 93, 255, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(114, 46, 209, 0.05) 0%, transparent 50%);
        pointer-events: none;
    }

    .user_list {
        display: grid;
        grid-template-columns: repeat(4, 1fr); // 固定4列
        gap: 24px;
        padding: 24px;
        position: relative;
        z-index: 1;
        flex: 1;
        align-content: start; // 让内容从顶部开始排列

        .item {
            background: var(--color-bg-1);
            border-radius: 16px;
            padding: 20px;
            display: flex;
            align-items: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            border: 1px solid var(--color-border-1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            animation: fadeIn 0.5s ease-out backwards;
            position: relative;
            overflow: hidden;

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, rgb(22, 93, 255), rgb(114, 46, 209));
                transform: scaleX(0);
                transform-origin: left center;
                transition: transform 0.3s ease;
            }

            &:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                border-color: var(--color-border-2);

                &::before {
                    transform: scaleX(1);
                }

                .avatar-ring {
                    animation: pulse 1.5s ease-in-out infinite;
                }

                .nick {
                    color: rgb(22, 93, 255);
                }
            }

            // 动画延迟效果
            &:nth-child(1) {
                animation-delay: 0.1s;
            }

            &:nth-child(2) {
                animation-delay: 0.15s;
            }

            &:nth-child(3) {
                animation-delay: 0.2s;
            }

            &:nth-child(4) {
                animation-delay: 0.25s;
            }

            &:nth-child(5) {
                animation-delay: 0.3s;
            }

            &:nth-child(6) {
                animation-delay: 0.35s;
            }

            &:nth-child(7) {
                animation-delay: 0.4s;
            }

            &:nth-child(8) {
                animation-delay: 0.45s;
            }

            &:nth-child(9) {
                animation-delay: 0.5s;
            }

            &:nth-child(10) {
                animation-delay: 0.55s;
            }

            &:nth-child(11) {
                animation-delay: 0.6s;
            }

            &:nth-child(12) {
                animation-delay: 0.65s;
            }

            .avatar-wrapper {
                position: relative;
                flex-shrink: 0;
                cursor: pointer;

                .arco-avatar {
                    width: 56px;
                    height: 56px;
                    position: relative;
                    z-index: 2;
                    transition: transform 0.3s ease;

                    &:hover {
                        transform: scale(1.1);
                    }
                }

                .avatar-ring {
                    position: absolute;
                    top: -4px;
                    left: -4px;
                    right: -4px;
                    bottom: -4px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgb(22, 93, 255), rgb(114, 46, 209));
                    opacity: 0.3;
                    z-index: 1;
                }
            }

            .info {
                margin-left: 16px;
                flex: 1;
                min-width: 0;

                .nick {
                    font-size: 16px;
                    font-weight: 500;
                    color: var(--color-text-1);
                    margin-bottom: 8px;
                    cursor: pointer;
                    transition: color 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    .arco-tag {
                        font-size: 12px;
                        padding: 2px 8px;
                        border-radius: 12px;
                        background: linear-gradient(135deg, var(--color-primary-light-1), var(--color-primary-light-3));
                        border: none;
                    }
                }

                .abs {
                    color: var(--color-text-3);
                    font-size: 14px;
                    line-height: 1.5;
                    margin-bottom: 12px;
                    min-height: 21px;
                }

                .action {
                    .arco-btn {
                        border-radius: 20px;
                        padding: 0 16px;
                        height: 32px;
                        font-weight: 500;
                        position: relative;
                        overflow: hidden;
                        transition: all 0.3s ease;

                        .btn-text {
                            position: relative;
                            z-index: 1;
                        }

                        &::before {
                            content: '';
                            position: absolute;
                            top: 0;
                            left: -100%;
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                            transition: left 0.5s ease;
                        }

                        &:hover::before {
                            left: 100%;
                        }

                        &.follow-btn {
                            background: linear-gradient(135deg, rgb(22, 93, 255), rgb(114, 46, 209));
                            border: none;
                            color: white;

                            &:hover {
                                transform: scale(1.05);
                                box-shadow: 0 4px 12px rgba(22, 93, 255, 0.4);
                            }
                        }

                        &.followed-btn {
                            background: var(--color-fill-2);
                            border: 1px solid var(--color-border-2);
                            color: var(--color-text-2);

                            &:hover {
                                background: var(--color-fill-3);
                                border-color: var(--color-border-3);
                            }
                        }
                    }
                }
            }
        }
    }

    .no-data {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 500px;

        .empty-container {
            text-align: center;
            padding: 60px;
            animation: fadeIn 0.6s ease-out;
            margin-bottom: 300px;

            .empty-icon {
                margin-bottom: 24px;
                animation: float 3s ease-in-out infinite;

                svg {
                    filter: drop-shadow(0 4px 24px rgba(22, 93, 255, 0.1));
                }
            }

            .empty-text {
                font-size: 18px;
                color: var(--color-text-1);
                font-weight: 500;
                margin-bottom: 8px;
                background: linear-gradient(135deg, rgb(22, 93, 255), rgb(114, 46, 209));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }

            .empty-subtext {
                font-size: 14px;
                color: var(--color-text-3);
            }
        }
    }

    .page {
        margin-top: auto; // 让分页自动推到底部
        padding-top: 60px; // 增加与内容的间距
        padding-bottom: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 1;

        .arco-pagination {
            background: var(--color-bg-1);
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

            .arco-pagination-item {
                transition: all 0.3s ease;

                &:hover:not(.arco-pagination-item-disabled) {
                    transform: scale(1.1);
                }

                &.arco-pagination-item-active {
                    background: linear-gradient(135deg, rgb(22, 93, 255), rgb(114, 46, 209));
                    border: none;
                    color: white;
                    font-weight: 500;
                }
            }
        }
    }
}

// 响应式布局
@media screen and (max-width: 1200px) {
    .focus_list_view {
        .user_list {
            grid-template-columns: repeat(3, 1fr);
        }
    }
}

@media screen and (max-width: 900px) {
    .focus_list_view {
        .user_list {
            grid-template-columns: repeat(2, 1fr);
        }
    }
}

@media screen and (max-width: 600px) {
    .focus_list_view {
        .user_list {
            grid-template-columns: 1fr;
            padding: 16px;
            gap: 16px;
        }
    }
}
</style>
