<template>
    <div class="chat_view">
        <template v-if="count">
            <session_list @routeChange="getChatList" @get-session-count="getSessionCount"></session_list>
        </template>
        <template v-else>
            <a-empty title="暂无会话"></a-empty>
        </template>
        <div class="chat_innter" v-if="count">
            <Chat_list v-if="route.query.userID" ref="chatListRef"></Chat_list>
            <div class="chat_menu" v-if="route.query.userID">
                <div class="icons">
                    <emoji_trigger @select="select"></emoji_trigger>
                    <span>
                        <Fc_icon_image_upload @ok="sendImage"></Fc_icon_image_upload>
                    </span>
                </div>
                <div class="chat_ipt">
                    <a-textarea placeholder="请输入消息" :auto-size="{ minRows: 6, maxRows: 6 }" @keydown.enter="sendText"
                        class="fc_textarea_msg" v-model="msg"></a-textarea>
                    <div class="right">
                        <span class="tips">按enter发送</span><a-button type="primary" size="small"
                            @click="sendText">发送</a-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type realTimeChatReq } from '@/api/chat_api';
import Fc_icon_image_upload from '@/components/common/fc_icon_image_upload.vue';
import Chat_list from '@/components/web/msg/chat_list.vue';
import session_list from '@/components/web/msg/session_list.vue'
import { useUserStore } from '@/stores/user_store';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import emoji_trigger from '@/components/web/msg/emoji_trigger.vue'
const select = (type: string, value: string) => {
    if (type === 'emoji') {
        const t = document.querySelector('.fc_textarea_msg textarea') as HTMLTextAreaElement
        const s1 = msg.value.substring(0, t.selectionStart)
        const s2 = msg.value.substring(t.selectionEnd)
        msg.value = s1 + value + s2
        return
    }
    sendImage(value)
}
const count = ref(1)
const getSessionCount = (c: number) => {
    count.value = c
}

const chatListRef = ref()
const route = useRoute()
const store = useUserStore()
const msg = ref('')
const getChatList = (userID: number) => {
    chatListRef.value?.getData(userID)
}
const sendText = (_event: Event) => {
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
const sendImage = (src: string) => {
    let data: realTimeChatReq = {
        revUserId: Number(route.query.userID),
        msgType: 2,
        msg: {
            imageMsg: {
                src
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
    color: var(--color-text-2);

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
            height: 170px;

            .icons {
                display: flex;
                align-items: center;

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
                height: 75%;

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
