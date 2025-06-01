<template>
    <div class="fc_msg_base_com">
        <div class="list">
            <div class="item" v-for="item in data.list" v-if="data.list.length">
                <div class="action">
                    <span class="date">{{ dateFormat(item.updateAt) }}</span>
                    <span class="more">
                        <a-dropdown @select="handleSelect($event, item.id)">
                            <IconMore></IconMore>
                            <template #content>
                                <a-doption value="delete">删除消息</a-doption>
                                <a-doption value="read" :disabled="item.isRead">读取消息</a-doption>
                            </template>
                        </a-dropdown>
                    </span>
                </div>
                <slot :item="item"></slot>
            </div>
            <div class="no-data" v-else>
                <a-empty description="暂无数据"></a-empty>
            </div>
        </div>
        <div class="page" v-if="data.list.length">
            <a-pagination :page-size="params.limit" :total="data.count" show-total v-model:current="params.page"
                @change="getData"></a-pagination>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { baseResponse, listResponse } from '@/api';
import { getMySiteMsg, type mySiteMsgListReq, type mySiteMsgRes } from '@/api/site_msg_api';
import router from '@/router';
import { useUserStore } from '@/stores/user_store';
import { dateFormat } from '@/utils/date';
import { Message } from '@arco-design/web-vue';
import { reactive } from 'vue';
import { readSiteMsg, removeSiteMsg } from '@/api/site_msg_api';
import NoDataLottie from '@/components/NoDataLottie.vue';

interface Props {
    t: 1 | 2 | 3
}

const emits = defineEmits(['getData'])
const props = defineProps<Props>()
const data = reactive<listResponse<mySiteMsgRes>>({
    list: [],
    count: 0
})
const store = useUserStore()

const handleSelect = async (key: string, id: number) => {
    let res: baseResponse<string>
    if (key === 'delete') {
        res = await removeSiteMsg({ id, t: props.t })
        Message.success(res.msg)
    } else if (key === 'read') {
        res = await readSiteMsg({ id, t: props.t })
        Message.success(res.msg)
        store.noReadMsg()
    }
    emits('getData')
}
const params = reactive<mySiteMsgListReq>({
    t: props.t,
    limit: 5,
    page: 1,
})
const userStore = useUserStore()
const getData = async () => {
    if (!userStore.isLogin) {
        router.push({ name: 'webHome' })
    }
    const res = await getMySiteMsg(params)
    Object.assign(data, res.data)
}
getData()
defineExpose({
    getData
})
</script>

<style lang="less">
.fc_msg_base_com {
    height: 100%;

    .list {
        padding: 10px 20px;
        background-color: var(--color-bg-1);
        color: var(--color-text-3);
        height: 93%;

        .item {
            .action {
                width: 100px;

                .date {
                    margin-right: 10px;
                    color: var(--color-text-2);
                }

                .more {
                    cursor: pointer;
                    color: var(--color-text-2);
                }
            }
        }
    }

    .page {
        background-color: var(--color-bg-1);
        display: flex;
        justify-content: center;
        padding-top: 10px;
    }
}
</style>