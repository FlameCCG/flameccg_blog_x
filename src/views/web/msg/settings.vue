<template>
    <div class="msg_setting_view">
        <a-form :label-col-props="{ span: 2 }">
            <a-form-item @change="update" label="评论和@">
                <a-switch v-model="data.openCommentMessage"></a-switch>
                <template #help>有人对我的内容进行评论时，我会收到消息提醒</template>
            </a-form-item>
            <a-form-item label="赞和收藏">
                <a-switch @change="update" v-model="data.openLikeAndCollectMessage"></a-switch>
                <template #help>有人对我表达的内容表示赞同时，我会收到消息提醒</template>
            </a-form-item>
            <a-form-item label="陌生人私信">
                <a-switch @change="update" v-model="data.openPrivateChat"></a-switch>
                <template #help>开启后陌生人可以私信我</template>
            </a-form-item>
        </a-form>
    </div>
</template>

<script setup lang="ts">
import { siteMsgConfApi, siteMsgConfUpdateApi, type siteMsgConfRes } from '@/api/site_msg_api';
import { Message } from '@arco-design/web-vue';
import { reactive } from 'vue';
const data = reactive<siteMsgConfRes>({
    openCommentMessage: false,
    openLikeAndCollectMessage: false,
    openPrivateChat: false,
})
async function getData() {
    const res = await siteMsgConfApi()
    Object.assign(data, res.data)
}
getData()
async function update() {
    const res = await siteMsgConfUpdateApi(data)
    Message.success(res.msg)
}
</script>

<style lang="less">
.msg_setting_view {
    padding: 10px 20px;
}
</style>