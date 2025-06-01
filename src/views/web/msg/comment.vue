<template>
    <base_msg :t="1" v-slot="{ item }: { item: mySiteMsgRes }" class="fc_msg_comment_view" ref="baseMsgRef"
        @get-data="getData">
        <div class="message-item" :class="{ 'unread': !item.isRead, 'read': item.isRead }">
            <!-- 未读指示器 -->
            <div class="read-indicator" v-if="!item.isRead">
                <div class="pulse-dot"></div>
            </div>

            <a-avatar :image-url="item.actionUserAvatar" @click="router.push('/user/' + item.actionUserID + '/article')"
                class="user-avatar"></a-avatar>

            <div class="content">
                <div class="user">
                    <span class="nick">{{ item.actionUserName }}</span>
                    <fc_label v-if="item.relation !== 0 && item.relation !== 5" :options="relationOptions"
                        :value="item.relation"></fc_label>
                    <span class="type">
                        <fc_label :options="siteMsgTypeOptions" :value="item.type"></fc_label>
                    </span>
                </div>
                <div class="content_inner" :class="{ read: item.isRead }">
                    <a-typography-text :ellipsis="{ rows: 2, css: true }">
                        {{ item.content }}
                    </a-typography-text>
                </div>
                <div class="article">
                    <RouterLink :to="{ name: 'article', params: { id: item.articleID } }">
                        {{ item.articleTitle }}
                    </RouterLink>
                </div>
            </div>

            <!-- 已读状态图标 -->
            <div class="status-icon">
                <div v-if="item.isRead" class="read-check">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <div v-else class="unread-dot">
                    <div class="dot"></div>
                </div>
            </div>
        </div>
    </base_msg>
</template>

<script setup lang="ts">
import Base_msg from '@/components/web/msg/base_msg.vue';
import { readSiteMsg, removeSiteMsg, type mySiteMsgRes } from '@/api/site_msg_api';
import { relationOptions, siteMsgTypeOptions } from '@/options/options';
import Fc_label from '@/components/common/fc_label.vue';
import { dateFormat } from '@/utils/date';
import type { baseResponse } from '@/api';
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import router from '@/router';

const baseMsgRef = ref()

const getData = () => {
    baseMsgRef.value.getData()
}
</script>

<style lang="less">
.fc_msg_comment_view {
    .message-item {
        position: relative;
        display: flex;
        align-items: flex-start;
        padding: 16px 20px;
        border-bottom: 1px solid var(--color-border-2);
        background: var(--color-bg-1);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: transparent;
            transition: all 0.3s ease;
        }

        &.unread {
            background: linear-gradient(135deg,
                    rgba(var(--arcoblue-1), 0.3) 0%,
                    rgba(var(--arcoblue-2), 0.1) 100%);
            border-left: 4px solid rgb(var(--arcoblue-6));
            box-shadow: 0 2px 8px rgba(var(--arcoblue-6), 0.15);

            &::before {
                background: linear-gradient(180deg,
                        rgb(var(--arcoblue-6)) 0%,
                        rgb(var(--arcoblue-4)) 100%);
                box-shadow: 0 0 20px rgba(var(--arcoblue-6), 0.4);
            }

            &:hover {
                background: linear-gradient(135deg,
                        rgba(var(--arcoblue-2), 0.4) 0%,
                        rgba(var(--arcoblue-3), 0.2) 100%);
                transform: translateX(4px);
                box-shadow: 0 4px 20px rgba(var(--arcoblue-6), 0.25);
            }
        }

        &.read {
            background: var(--color-bg-1);
            opacity: 0.85;

            &:hover {
                background: var(--color-bg-2);
                opacity: 1;
                transform: translateX(2px);
            }

            .content_inner {
                color: var(--color-text-3);
            }
        }

        &:hover {
            border-color: rgba(var(--arcoblue-6), 0.3);
        }
    }

    .read-indicator {
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 2;

        .pulse-dot {
            width: 8px;
            height: 8px;
            background: rgb(var(--arcoblue-6));
            border-radius: 50%;
            animation: pulse 2s infinite;
            box-shadow: 0 0 0 0 rgba(var(--arcoblue-6), 0.7);
        }
    }

    .user-avatar {
        flex-shrink: 0;
        margin-right: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;

        &:hover {
            transform: scale(1.05);
            border-color: rgb(var(--arcoblue-6));
            box-shadow: 0 4px 12px rgba(var(--arcoblue-6), 0.3);
        }
    }

    .content {
        flex: 1;
        min-width: 0;

        .user {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;

            .nick {
                font-weight: 600;
                color: var(--color-text-1);
                font-size: 14px;
                transition: color 0.3s ease;
            }
        }

        .content_inner {
            margin: 8px 0 12px 0;
            color: var(--color-text-2);
            line-height: 1.6;
            transition: all 0.3s ease;

            &.read {
                color: var(--color-text-4);
            }
        }

        .article {
            a {
                color: rgb(var(--arcoblue-6));
                text-decoration: none;
                font-weight: 500;
                position: relative;
                transition: all 0.3s ease;
                display: inline-block;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: linear-gradient(90deg,
                            rgb(var(--arcoblue-6)),
                            rgb(var(--arcoblue-4)));
                    transition: width 0.3s ease;
                }

                &:hover {
                    color: rgb(var(--arcoblue-5));
                    transform: translateY(-1px);

                    &::after {
                        width: 100%;
                    }
                }
            }
        }
    }

    .status-icon {
        flex-shrink: 0;
        margin-left: 16px;
        display: flex;
        align-items: center;

        .read-check {
            width: 24px;
            height: 24px;
            color: rgb(var(--green-6));
            opacity: 0.7;
            transition: all 0.3s ease;

            svg {
                width: 100%;
                height: 100%;
            }

            &:hover {
                opacity: 1;
                color: rgb(var(--green-5));
                transform: scale(1.1);
            }
        }

        .unread-dot {
            .dot {
                width: 12px;
                height: 12px;
                background: linear-gradient(135deg,
                        rgb(var(--red-5)),
                        rgb(var(--red-6)));
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(var(--red-6), 0.4);
                animation: bounce 2s infinite;
            }
        }
    }
}

@keyframes pulse {
    0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(var(--arcoblue-6), 0.7);
    }

    70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(var(--arcoblue-6), 0);
    }

    100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(var(--arcoblue-6), 0);
    }
}

@keyframes bounce {

    0%,
    20%,
    53%,
    80%,
    100% {
        transform: translate3d(0, 0, 0);
    }

    40%,
    43% {
        transform: translate3d(0, -8px, 0);
    }

    70% {
        transform: translate3d(0, -4px, 0);
    }

    90% {
        transform: translate3d(0, -2px, 0);
    }
}

// 响应式设计
@media (max-width: 768px) {
    .fc_msg_comment_view {
        .message-item {
            padding: 12px 16px;

            .user-avatar {
                margin-right: 12px;
            }

            .status-icon {
                margin-left: 12px;
            }
        }
    }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
    .fc_msg_comment_view {
        .message-item {
            &.unread {
                background: linear-gradient(135deg,
                        rgba(var(--arcoblue-9), 0.2) 0%,
                        rgba(var(--arcoblue-8), 0.1) 100%);
                box-shadow: 0 2px 8px rgba(var(--arcoblue-6), 0.1);
            }
        }
    }
}
</style>