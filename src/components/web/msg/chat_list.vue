<template>
    <div class="fc_chat_list_com scrollbar">
        <div class="action">
            <span class="patchAction" @click="check">批量操作</span>
            <a-button status="danger" size="mini" v-if="checkIDList.length && isCheck"
                @click="chatRemoveApi">批量删除</a-button>
        </div>
        <div class="innter">
            <div class="more">
                <span @click="loadMore">加载更多</span>
            </div>
            <a-checkbox-group v-model="checkIDList">
                <div class="item" v-for="item in chats.list" :key="item.id"
                    :class="{ isMe: item.isMe, isCheck: inList(item.id) }">
                    <div class="top">
                        <div class="date">{{ dateTimeFormat(item.createAt) }}</div>
                    </div>
                    <div class="bottom">
                        <a-checkbox :value="item.id" v-if="isCheck"></a-checkbox>
                        <a-avatar :image-url="item.sendUserAvatar"
                            @click="() => router.push({ name: 'userArticle', params: { id: item.senderUserID } })"
                            style="cursor: pointer;"></a-avatar>
                        <div class="content">
                            <Msg_content :msg="item.msg"></Msg_content>
                        </div>
                    </div>
                </div>
            </a-checkbox-group>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type chatListAndUserRes, chatListApi, type chatListReq } from '@/api/chat_api'
import { reactive, nextTick, ref, defineExpose } from 'vue';
import type { listResponse } from '@/api';
import { useRoute } from 'vue-router';
import { dateTimeFormat } from '@/utils/date';
import { useUserStore } from '@/stores/user_store';
import { watch } from 'vue';
import { Message } from '@arco-design/web-vue';
import { useRouter } from 'vue-router';
import Msg_content from './msg_content.vue';
import { removeChatMessage } from '@/api/chat_api'
const isCheck = ref(false);
const check = () => {
    console.log(isCheck.value)
    isCheck.value = !isCheck.value
}
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
const chatRemoveApi = async () => {
    const res = await removeChatMessage(checkIDList.value)
    checkIDList.value = []
    getData()
    Message.success(res.msg)

}
const checkIDList = ref<number[]>([])
async function loadMore() {
    params.page = (params.page ?? 1) + 1
    const res = await chatListApi(params)
    if (res.data.list.length === 0) {
        Message.info('已经是最早的消息了')
        return
    }
    chats.list = [...res.data.list.reverse(), ...chats.list]
    chats.count += res.data.count
}
defineExpose({ getData })
const inList = (id: number): boolean => {
    return checkIDList.value.some(item => item === id)
}
</script>
<style lang="less">
.fc_chat_list_com {
    overflow-y: auto;

    .action {
        display: flex;
        align-items: center;
        padding: 10px 20px;
        height: 30px;

        .patchAction {
            cursor: pointer;
            font-size: 14px;
            color: var(--color-text-2);
            margin-right: 10px;
        }
    }


    .more {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: var(--color-text-1);

        span {
            cursor: pointer;

        }
    }

    .arco-checkbox-group {
        width: 100%;
    }

    .item {
        padding: 10px 20px;

        &.isCheck {
            background-color: var(--color-fill-2);
        }

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