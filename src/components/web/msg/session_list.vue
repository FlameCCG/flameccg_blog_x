<template>
    <div class="fc_session_list">
        <div class="item" @click="goItem(item)" v-for="item in session.list"
            :class="{ active: item.userID === Number(route.query.userID) }">
            <a-avatar :image-url="item.userAvatar"></a-avatar>
            <div class="info">
                <div class="top">
                    <div class="left">
                        <a-typography-text :ellipsis="{ rows: 2 }">{{ item.userNickname }}</a-typography-text>
                        <fc_label :options="relationOptions" :value="item.relation"></fc_label>
                    </div>
                    <div class="date">{{ dateFormat(item.newMsgDate) }}</div>
                    <div class="bottom">
                        <a-typography-text :ellipsis="{ rows: 1 }">{{ item.msg.textMsg.content
                        }}</a-typography-text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type paramsType, type baseResponse, type listResponse } from '@/api';
import { mySessionListApi, type mySessionListRes } from '@/api/chat_api';
import Fc_label from '@/components/common/fc_label.vue';
import { relationOptions } from '@/options/options';
import router from '@/router';
import { useUserStore } from '@/stores/user_store';
import { dateFormat } from '@/utils/date';
import { reactive } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const emits = defineEmits(['routeChange'])
const goItem = (item: mySessionListRes) => {
    router.push({
        name: 'msgChat',
        query: {
            userID: item.userID
        }
    });
    emits('routeChange', item.userID)
}
const session = reactive<listResponse<mySessionListRes>>({
    list: [],
    count: 0
})
const params = reactive<paramsType>({})
const store = useUserStore();
const getData = async () => {
    if (!store.isLogin) return;
    const res = await mySessionListApi(params);
    Object.assign(session, res.data);
}
getData()
</script>

<style lang="less">
.fc_session_list {
    width: 260px;
    border-right: @fc_border;
    height: 100%;

    .item {
        display: flex;
        padding: 10px 20px;
        cursor: pointer;

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
</style>