<template>
    <div class="fc-session-list">
        <div class="session-item" :class="{ active: item.userID === Number(route.query.userID) }"
            v-for="item in session.list" :key="item.userID" @click="goItem(item)">
            <div class="avatar-wrapper">
                <a-avatar :image-url="item.userAvatar" :size="48" shape="circle" />
            </div>

            <div class="content-wrapper">
                <!-- 顶部：昵称 + 关系标签 -->
                <div class="header-row">
                    <div class="user-info">
                        <span class="nickname" :title="item.userNickname">{{ item.userNickname }}</span>
                        <fc_label :options="relationOptions" :value="item.relation" />
                    </div>
                </div>

                <!-- 底部：最后一条消息 + 时间 -->
                <div class="bottom-row">
                    <div class="message-preview" :title="item.msg.textMsg?.content">
                        <Msg_preview :msg="item.msg"></Msg_preview>
                    </div>
                    <span class="timestamp">{{ dateFormat(item.newMsgDate) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { relationOptions } from '@/options/options';
import Fc_label from '@/components/common/fc_label.vue';
import { mySessionListApi, type mySessionListRes } from '@/api/chat_api';
import { dateFormat } from '@/utils/date';
import { type paramsType, type listResponse } from '@/api';
import { userBaseInfoStore } from '@/stores/user_base_store';
import { useUserStore } from '@/stores/user_store';
import Msg_preview from './msg_preview.vue';

const route = useRoute();
const router = useRouter();
const emit = defineEmits<{
    (e: 'routeChange', userID: number): void;
}>();

const session = reactive<listResponse<mySessionListRes>>({ list: [], count: 0 });
const params = reactive<paramsType>({});

const userStore = useUserStore();
const baseStore = userBaseInfoStore();

const goItem = (item: mySessionListRes) => {
    router.push({ name: 'msgChat', query: { userID: item.userID } });
    emit('routeChange', item.userID);
};

const initUser = (userID: number) => {
    if (session.list.some((i) => i.userID === userID) || !baseStore.userBaseInfo.userID) return;

    session.list.push({
        userID,
        userAvatar: baseStore.userBaseInfo.avatar,
        userNickname: baseStore.userBaseInfo.nickname,
        relation: baseStore.userBaseInfo.relation,
        newMsgDate: dateFormat(new Date().toString()),
        msgType: 1,
        msg: { textMsg: { content: '' } },
    });
};

const getData = async () => {
    if (!userStore.isLogin) return;
    const { data } = await mySessionListApi(params);
    Object.assign(session, data);

    // 若 URL 中 userID 不在列表，补一条占位项（常见于首次私聊）
    const urlID = Number(route.query.userID);
    if (!Number.isNaN(urlID) && !session.list.some((i) => i.userID === urlID)) {
        initUser(urlID);
    }
};

onMounted(getData);
</script>

<style lang="less" scoped>
.fc-session-list {
    width: 300px;
    height: 100%;
    background-color: var(--color-bg-1);
    border-right: 1px solid var(--color-border-2);
    overflow-y: auto;

    // 自定义滚动条样式
    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: var(--color-fill-1);
    }

    &::-webkit-scrollbar-thumb {
        background: var(--color-fill-3);
        border-radius: 2px;

        &:hover {
            background: var(--color-fill-4);
        }
    }

    .session-item {
        display: flex;
        align-items: flex-start;
        padding: 16px;
        cursor: pointer;
        transition: all 0.2s var(--motion-ease-out);
        border-bottom: 1px solid var(--color-border-1);
        position: relative;

        &:hover {
            background-color: var(--color-fill-1);
        }

        &.active {
            background-color: var(--color-primary-light-1);

            &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 3px;
                background-color: var(--color-primary-6);
            }

            .nickname {
                color: var(--color-primary-6);
                font-weight: 600;
            }
        }

        &:last-child {
            border-bottom: none;
        }

        .avatar-wrapper {
            flex-shrink: 0;
            margin-right: 12px;
        }

        .content-wrapper {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 6px;

            .header-row {
                display: flex;
                align-items: center;
                width: 100%;

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex: 1;
                    min-width: 0;

                    .nickname {
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--color-text-1);
                        line-height: 1.4;
                        max-width: 120px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        flex-shrink: 0;
                    }
                }
            }

            .bottom-row {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                gap: 8px;
                width: 100%;

                .message-preview {
                    font-size: 13px;
                    color: var(--color-text-2);
                    line-height: 1.4;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    flex: 1;
                    min-width: 0;
                }

                .timestamp {
                    font-size: 12px;
                    color: var(--color-text-3);
                    white-space: nowrap;
                    flex-shrink: 0;
                    line-height: 1.2;
                    align-self: flex-end;
                }
            }
        }
    }
}

// 响应式适配
@media (max-width: 768px) {
    .fc-session-list {
        width: 280px;

        .session-item {
            padding: 12px;

            .content-wrapper {
                .header-row {
                    .user-info {
                        .nickname {
                            max-width: 100px;
                        }
                    }
                }
            }
        }
    }
}
</style>