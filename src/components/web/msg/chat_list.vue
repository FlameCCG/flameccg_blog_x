<template>
    <div class="fc_chat_list_com scrollbar">
        <div class="innter">
            <div class="more">
                <span @click="loadMore">加载更多</span>
            </div>
            <div class="item" v-for="item in chats.list" :key="item.id" :class="{ isMe: item.isMe }">
                <div class="top">
                    <div class="date">{{ dateTimeFormat(item.createAt) }}</div>
                </div>
                <div class="bottom">
                    <a-avatar :image-url="item.sendUserAvatar"
                        @click="() => router.push({ name: 'userArticle', params: { id: item.senderUserID } })"
                        style="cursor: pointer;"></a-avatar>
                    <div class="content">
                        <Msg_content :msg="item.msg"></Msg_content>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type chatListAndUserRes, chatListApi, type chatListReq } from '@/api/chat_api'
import { reactive, nextTick } from 'vue';
import type { listResponse } from '@/api';
import { useRoute } from 'vue-router';
import { dateTimeFormat } from '@/utils/date';
import { useUserStore } from '@/stores/user_store';
import { watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import { MdPreview } from 'md-editor-v3';
import Msg_content from './msg_content.vue';
const router = useRouter()
const chats = reactive<listResponse<chatListAndUserRes>>({
    list: [],
    count: 0
})
const route = useRoute()
const params = reactive<chatListReq>({
    revUserID: Number(route.query.userID),
    type: 1,
    page: 1
})
const store = useUserStore()
const getData = async (userID?: number) => {
    if (route.query.userID && store.isLogin) {
        if (userID) {
            params.revUserID = userID
        }
        const res = await chatListApi(params)
        chats.list = res.data.list.reverse()
        chats.count = res.data.count
    }
    nextTick(() => {
        goBottom()
    })
}
getData()

function goBottom() {
    const el = document.querySelector('.fc_chat_list_com') as HTMLElement
    const top = el.scrollHeight
    el.scrollTo({
        top: top,
        behavior: 'smooth'
    })
}
watch(
    () => store.wsChatList[store.wsChatList.length - 1],
    (newMsg, oldMsg) => {
        if (!newMsg) return;
        if (newMsg.id === oldMsg?.id) return;
        chats.list.push(newMsg);
        nextTick(() => {
            goBottom();
        });
    }
);

async function loadMore() {
    // @ts-ignore
    params.page += 1
    const res = await chatListApi(params)
    if (res.data.list.length === 0) {
        Message.info('已经是最早的消息了')
        return
    }
    chats.list = [...res.data.list.reverse(), ...chats.list]
    chats.count += res.data.count
}
defineExpose({ getData })
</script>
<style lang="less">
.fc_chat_list_com {
    overflow-y: auto;

    .more {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: var(--color-text-1);
        margin-top: 10px;

        span {
            cursor: pointer;

        }
    }

    .item {
        padding: 10px 20px;

        &.isMe {
            .bottom {
                flex-direction: row-reverse;

                .content {
                    margin-left: 0px;
                    margin-right: 10px;
                }
            }
        }

        .top {
            display: flex;
            justify-content: center;
            font-size: 12px;
            color: var(--color-text-2);
        }

        .bottom {
            display: flex;

            .arco-avatar {
                flex-shrink: 0;
            }

            .content {
                margin-left: 10px;
                background-color: var(--color-fill-2);
                padding: 10px;
                border-radius: 5px;
            }
        }
    }
}
</style>