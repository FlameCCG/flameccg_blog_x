<script setup lang="ts">
import Fc_list from '@/components/common/fc_list.vue';
import { ref } from 'vue';
import { articleListApi, articleDetailApi, articleExamineApi, userArticleIsOpenComment, type articleListType } from '@/api/article_api';
import Fc_label from '@/components/common/fc_label.vue';
import { articleStatusOptions } from '@/options/options';
import { type columnType } from "@/components/common/fc_list.vue";
import { reactive } from 'vue';
import { type articleDetailType } from "@/api/article_api";
import { Avatar, Message } from '@arco-design/web-vue';
import Fc_user from '@/components/common/fc_user.vue';
import { nextTick } from 'vue';
import { userArticleTopApi } from '@/api/user_api';
const columns: columnType[] = [
    { title: 'ID', dataIndex: 'id' },
    { title: '文章标题', dataIndex: 'title' },
    { title: '发布用户', slotName: 'user' },
    { title: '文章封面', slotName: 'cover' },
    { title: '浏览量', dataIndex: 'lookCount' },
    { title: '评论数', dataIndex: 'commentCount' },
    { title: "开启评论", slotName: "openComment", type: "switch" },
    { title: '点赞', dataIndex: 'likeCount' },
    { title: '收藏', dataIndex: 'collectCount' },
    { title: '状态', dataIndex: 'status', type: 'options', options: articleStatusOptions },
    { title: '文章置顶', slotName: 'adminTop', type: 'switch' },
    { title: '分类', slotName: 'category' },
    { title: '发布时间', slotName: 'createAt', type: 'date' },
    { title: '最后更新时间', slotName: 'updateAt', type: 'date', dateFormat: "relativeTime" },
    { title: '操作', slotName: 'action' }
];
const visible = ref(false);
const data = reactive<articleDetailType>({
    "id": 0,
    "createAt": "",
    "updateAt": "",
    "title": "2",
    "abstract": "",
    "content": "",
    "tagList": [],
    "cover": "",
    "categoryID": 0,
    "userID": 0,
    "lookCount": 0,
    "likeCount": 0,
    "commentCount": 0,
    "collectCount": 0,
    "openComment": false,
    "status": 0,
    "username": "",
    "userAvatar": "",
    "nickname": "",
    "categoryTitle": null,
    "isLiked": false,
    "isCollected": false
});
async function edit(record: articleListType) {
    try {
        if (record.id !== data.id) {
            const res = await articleDetailApi(record.id)
            Object.assign(data, res.data);
            visible.value = true;
            return
        }
        visible.value = true;
    } catch (error) {
        console.log(error);
    }
}
const fListRef = ref<InstanceType<typeof Fc_list>>();
async function handleOk() {
    if (data.status !== 2) {
        Message.warning("草稿状态下无法审核")
        return
    }
    try {
        form.articleID = data.id;
        const res = await articleExamineApi(form);
        Message.success(res.msg);
        fListRef.value?.getList();
    } catch (error) {
        console.log(error);
        return false;
    }
}
async function handleDelete(keyList: number[] | string[]) {
    try {

    } catch (error) {
        console.log(error);
    }
}
const form = reactive({
    articleID: 0,
    status: 0,
    msg: ''
});
const adminTopHandle = async (record: articleListType) => {
    console.log(record)
    if (record.status !== 3) {
        Message.warning("只有审核通过的文章才能置顶")
        record.adminTop = !record.adminTop
        return
    }
    try {
        const res = await userArticleTopApi({ articleID: record.id, type: 2 });
        Message.success(res.msg);
        fListRef.value?.getList();
    } catch (error) {
        console.log(error);
    }
}
const handleOpenComment = async (record: articleListType) => {
    console.log(record)
    try {
        console.log(record.id, record.openComment)
        const res = await userArticleIsOpenComment({ articleID: record.id, openComment: record.openComment })
        Message.success(res.msg);
        fListRef.value?.getList();
    } catch (error) {
        console.log(error);
    }
}
</script>

<template>
    <div class="article_list_container">
        <a-modal v-model:visible="visible" title="文章审核" modal-class="article_examine_modal" @before-ok="handleOk">
            <a-form>
                <a-form-item label="文章标题">{{ data.title }}</a-form-item>
                <a-form-item label="文章简介"> {{ data.abstract }}</a-form-item>
                <a-form-item label="发布用户">
                    <Fc_user :avatar="data.userAvatar" :nick-name="data.nickname"></Fc_user>
                </a-form-item>
                <a-form-item label="文章分类">
                    {{ data.categoryTitle ? data.categoryTitle : '无' }}
                </a-form-item>
                <a-form-item label="文章标签">
                    <a-tag v-for="tag in data.tagList" :key="tag" style="margin-left: 3px;">{{ tag }}</a-tag>
                </a-form-item>
                <a-form-item label="文章正文">
                    {{ data.content }}
                </a-form-item>
                <a-form-item>
                    <a-radio-group v-model="form.status">
                        <a-radio :value="3">审核通过</a-radio>
                        <a-radio :value="4">审核不通过</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item v-if="form.status === 4">
                    <a-textarea v-model="form.msg" placeholder="请输入拒绝原因"></a-textarea>
                </a-form-item>
            </a-form>
        </a-modal>
        <fc_list ref="fListRef" :url=articleListApi :columns="columns" @edit="edit" no-defalut-delete
            @delete="handleDelete" :default-params="{ type: 3 }" :scroll="{ x: '100%' }">
            <template #cover="{ record }: { record: articleListType }">
                <a-image :src="record.cover" :width="60"> </a-image>
            </template>
            <template #user="{ record }: { record: articleListType }">
                <Fc_user :avatar="record.userAvatar" :nick-name="record.userNickname"></Fc_user>
            </template>
            <template #category="{ record }: { record: articleListType }">
                <span>{{ record.categoryTitle ? record.categoryTitle : '无' }}</span>
            </template>
            <template #adminTop="{ record }: { record: articleListType }">
                <a-switch v-model="record.adminTop" @change="adminTopHandle(record)"></a-switch>
            </template>
            <template #openComment="{ record }: { record: articleListType }">
                <a-switch v-model="record.openComment" @change="handleOpenComment(record)"></a-switch>
            </template>
        </fc_list>
    </div>
</template>


<style lang="less"></style>