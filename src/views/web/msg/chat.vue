<template>
    <div class="chat_view">
        <session_list @routeChange="getChatList"></session_list>
        <div class="chat_innter">
            <Chat_list v-if="route.query.userID" ref="chatListRef"></Chat_list>
            <div class="chat_menu" v-if="route.query.userID">
                <div class="icons">
                    <span>
                        <IconImage></IconImage>
                    </span>
                    <span>
                        <IconImage></IconImage>
                    </span>
                </div>
                <div class="chat_ipt">
                    <a-textarea placeholder="请输入消息" :auto-size="{ minRows: 6, maxRows: 6 }" @keydown.enter="send"
                        v-model="msg"></a-textarea>
                    <div class="right">
                        <span class="tips">按enter发送</span><a-button type="primary" size="small"
                            @click="send">发送</a-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type realTimeChatReq } from '@/api/chat_api';
import Chat_list from '@/components/web/msg/chat_list.vue';
import session_list from '@/components/web/msg/session_list.vue'
import { useUserStore } from '@/stores/user_store';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const chatListRef = ref()
const route = useRoute()
const store = useUserStore()
const msg = ref()
const getChatList = (userID: number) => {
    chatListRef.value?.getData(userID)
}
const send = (_event?: Event) => {
    if (_event instanceof KeyboardEvent && _event.key === 'Enter') {
        _event.preventDefault();
    }
    let data: realTimeChatReq = {
        revUserId: Number(route.query.userID),
        msgType: 1,
        msg: {
            textMsg: {
                content: msg.value
            }
        }
    }
    store.ws?.send(JSON.stringify(data))
    msg.value = ''
}
</script>

<style lang="less">
.chat_view {
    display: flex;
    height: 100%;

    .session_list {
        width: 260px;
        border-right: @fc_border;
        height: 100%;

        .item {
            display: flex;
            padding: 10px 20px;

            .arco-avatar {
                flex-shrink: 0;
            }

            &:hover {
                background-color: var(--color-fill-2);
            }

            &.active {
                background-color: var(--color-fill-1);
            }

            .info {
                width: 100%;
                margin-left: 10px;
                display: flex;
                flex-direction: column;
                justify-content: start;

                .top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .left {
                        display: flex;
                        align-items: center;
                    }

                    .date {
                        font-size: 12px;
                        color: var(--color-text-2);
                    }
                }
            }
        }
    }

    .chat_innter {
        width: calc(100% - 260px);

        .fc_chat_list_com {
            height: calc(100% - 170px);
        }

        .chat_menu {
            width: 100%;
            border-top: @fc_border;

            .icons {
                >span {
                    padding: 8px;
                    color: var(--color-text-2);
                    cursor: pointer;

                    &:hover {
                        background-color: var(--color-fill-1);
                    }

                    svg {
                        font-size: 16px;
                    }
                }
            }

            .chat_ipt {
                position: relative;

                .arco-textarea-wrapper {
                    background-color: transparent;
                    border: none;
                }

                .right {
                    position: absolute;
                    right: 10px;
                    bottom: 10px;
                    z-index: 2;

                    .tips {
                        font-size: 12px;
                        color: var(--color-text-2);
                        margin-right: 10px;
                    }

                    .arco-btn {
                        border-radius: 4px;
                        font-size: 14px;
                    }
                }
            }
        }
    }
}
</style>
