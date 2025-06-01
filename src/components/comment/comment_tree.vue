<template>
    <a-comment class="comment_tree_com" :content="item.content" :datetime="relativeTimeFormat(item.createdAt)"
        v-for="item in props.data" :key="item.id">
        <template #actions>
            <span class="action" key="heart" @click="like(item)" :class="{ liked: item.isLiked }">
                <span>
                    <IconHeartFill :style="{ color: 'var(--color-danger-6)' }" />
                </span>
                点赞{{ item.diggCount }}
            </span>
            <span class="action" :class="{ noApply: props.line === siteStore.siteInfo.article.commentLine }" key="reply"
                @click="apply(item)">
                <IconMessage :style="{ color: 'var(--color-primary-6)' }" /> 回复{{ item.applyCount }}
            </span>
            <a-popconfirm content="确定删除评论？" :ok-text="`确定`" :cancel-text="`取消`" @ok="deleteComment(item)">
                <span class="action" v-if="myStore.userBaseInfo.userID === item.userID">
                    <i>
                        <IconDelete></IconDelete>
                    </i>删除
                </span>
            </a-popconfirm>
        </template>
        <template #avatar>
            <a-avatar @click="router.push('/user/' + item.userID + '/article')">
                <img alt="avatar" :src="item.userAvatar" />
            </a-avatar>
        </template>
        <template #author>
            <span @click="router.push('/user/' + item.userID + '/article')" style="cursor: pointer;">{{
                item.userNickname }}</span>
            <fc_label :options="relationOptions" :value="item.relation" style="margin-left: 5px;"></fc_label>
        </template>
        <div class="apply-comment" v-if="item.isApply">
            <a-input :class="`apply-input-${item.id}`" v-model="item.applyContent"
                :placeholder="`回复 ${item.userNickname}`" />
            <a-button type="primary" @click="applyComment(item)">回复</a-button>
        </div>
        <Comment_tree :line="Number(props.line) + 1" @ok="ok" :data="item.subComments" v-if="item.subComments.length">
        </Comment_tree>
    </a-comment>
</template>

<script setup lang="ts">
import { commentCreateApi, commentLike, commentRemove, type commentListRes, type commentTreeRes } from '@/api/comment_api';
import { useSiteStore } from '@/stores/site_store';
import { dateFormat, relativeTimeFormat } from '@/utils/date';
import { Message } from '@arco-design/web-vue';
import { IconStarFill, IconHeartFill, IconDelete } from '@arco-design/web-vue/es/icon';
import { nextTick, ref } from 'vue';
import Fc_label from '../common/fc_label.vue';
import { relationOptions } from '@/options/options';
import { useUserStore } from '@/stores/user_store';
import router from '@/router';
const myStore = useUserStore()
const siteStore = useSiteStore();
siteStore.getSiteInfo();
interface Props {
    data: commentTreeRes[]
    line?: number
}
const ok = () => {
    emits("ok")
}
const deleteComment = async (item: commentTreeRes) => {
    const res = await commentRemove(item.id)
    Message.success(res.msg);
    emits("ok")
}
const emits = defineEmits(['ok']);
const applyComment = async (item: commentTreeRes) => {
    if (item.applyContent?.trim() === '') {
        Message.error('回复内容不能为空');
        return;
    }
    const res = await commentCreateApi(
        {
            comment: item.applyContent as string,
            parentID: item.id,
            articleID: item.articleID,
        }
    )
    Message.success(res.msg);
    emits("ok")
}
const props = defineProps<Props>();
const apply = async (item: commentTreeRes) => {
    item.isApply = !item.isApply;
    if (!item.isApply) {
        return
    }
    nextTick(() => {
        const input = document.querySelector(`.apply-input-${item.id} input`) as HTMLInputElement;
        if (input) {
            console.log(input);
            input.focus();
        }
    })
}
const like = async (item: commentTreeRes) => {
    console.log(item.id);
    const res = await commentLike(item.id)
    Message.success(res.msg);
    item.isLiked = !item.isLiked;
    if (item.isLiked) {
        item.diggCount++;
    } else {
        item.diggCount--;
    }
}
</script>

<style lang="less" scoped>
.comment_tree_com {
    .apply-comment {
        display: flex;
        margin-bottom: 20px;

        .arco-input-wrapper {
            margin-right: 20px;
        }
    }

    .action {
        cursor: pointer;
        user-select: none;
        transition: color 0.2s ease;
        padding: 0 4px;
        color: var(--color-text-3);

        &.liked {
            color: var(--arcoblue-6);
        }

        &:hover {
            color: var(--color-text-1);
        }
    }

    .arco-comment {
        background-color: var(--color-bg-1);
        border-radius: 4px;
        margin-bottom: 8px;

        .arco-comment-inner-comment {
            margin-top: 8px;

            .arco-comment {

                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
}
</style>