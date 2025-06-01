<template>
    <div class="article_comment_com">
        <div class="add_comment">
            <a-textarea v-model="form.comment" placeholder="请输入评论内容" :auto-size="{ minRows: 4, maxRows: 6 }"
                @keyup.enter="createComment" ref="commentInput"></a-textarea>
            <a-button type="primary" size="mini" @click="createComment">发布评论</a-button>
        </div>
        <div class="comment_list">
            <Comment_tree :data="data.list" @ok="getCommentTree" :line="1"></Comment_tree>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import Comment_tree from './comment_tree.vue';
import { commentCreateApi, type commentCreateReq, commentTree, type commentTreeRes } from '@/api/comment_api';
import { useRoute } from 'vue-router';
import { type listResponse } from '@/api';
import { Message } from '@arco-design/web-vue';
const data = reactive<listResponse<commentTreeRes>>({
    list: [],
    count: 0
})
interface Props {
    articleID: number;
}
const commentInput = ref();
const props = defineProps<Props>();
const route = useRoute();
const getCommentTree = async () => {
    const res = await commentTree(props.articleID);
    console.log(res);
    Object.assign(data, res.data);
}
const form = reactive<commentCreateReq>({
    comment: "",
    articleID: props.articleID,
    parentID: undefined
})
const emits = defineEmits(['createComment'])
async function createComment() {
    form.articleID = props.articleID;
    console.log(form);
    if (form.comment.trim() === '') {
        Message.warning('评论内容不能为空');
        return
    }
    const res = await commentCreateApi(form);
    Message.success(res.msg);
    emits('createComment');
    getCommentTree();
    form.comment = "";
}

const textAreaFocus = () => {
    commentInput.value.focus();
}

defineExpose({
    textAreaFocus
})
watch(() => props.articleID, () => {
    getCommentTree();
}, { immediate: true })
</script>

<style lang="less">
.article_comment_com {
    margin-top: 20px;
    border-radius: 8px;
    background: var(--color-bg-1);
    box-shadow: 0 2px 8px var(--color-neutral-2);

    .add_comment {
        padding: 20px;
        position: relative;

        .arco-btn {
            position: absolute;
            bottom: 35px;
            right: 35px;
            z-index: 999
        }
    }

    .comment_list {
        padding: 20px;

        .arco-comment {
            margin-top: 0;
            margin-bottom: 0;
        }
    }
}
</style>