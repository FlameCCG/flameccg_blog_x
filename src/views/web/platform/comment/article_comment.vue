<template>
    <div class="comment-container">
        <Comment_list ref="commentListRef" :type="1" v-slot="{ item }: { item: commentListRes }">
            <div class="comment-content">
                <div class="comment-header">
                    <span class="user-nickname">{{ item.userNickname }}</span>
                    <Fc_label :options="relationOptions" :value="item.relation" />
                    <span class="comment-time">
                        <icon-clock-circle />
                        {{ dateTimeFormat(item.createdAt) }}
                    </span>
                </div>

                <div class="comment-text">
                    <a-typography-text :ellipsis="{ rows: 2, css: true }">
                        {{ item.content }}
                    </a-typography-text>
                </div>

                <div class="comment-footer">
                    <div class="comment-actions-bar">
                        <div class="action-btn like-btn">
                            <icon-thumb-up />
                            <span v-if="item.diggCount">{{ item.diggCount }}</span>
                        </div>
                        <div class="action-divider"></div>
                        <div class="action-btn reply-btn">
                            <a-trigger trigger="click" :unmount-on-close="false" content-class="apply_comment_trigger"
                                position="bottom" :popup-visible="activeCommentId === item.id"
                                @popup-visible-change="(visible: boolean) => handleVisibleChange(visible, item.id)"
                                @show="show" @hide="hide">
                                <div @click="() => prepareReply(item)">
                                    <icon-message />
                                    <span class="apply">回复</span>
                                </div>
                                <template #content>
                                    <a-textarea placeholder="请输入回复的内容" v-model="form.comment"
                                        :auto-size="{ minRows: 2, maxRows: 6 }" ref="textareaRef"
                                        @keydown.enter="handleReply"></a-textarea>
                                    <a-button type="primary" size="mini" @click="handleReply">回复</a-button>
                                </template>
                            </a-trigger>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="item.articleCover" class="article-preview">
                <div class="article-cover">
                    <img :src="item.articleCover" alt="文章封面">
                </div>
                <div class="article-title">
                    <a-typography-text :ellipsis="{ rows: 1, css: true }">
                        {{ item.articleTitle }}
                    </a-typography-text>
                </div>
            </div>
        </Comment_list>
    </div>
</template>

<script setup lang="ts">
import { useAxios, type listResponse } from '@/api';
import { commentRemove, type commentListReq, type commentListRes, commentCreateApi, commentList, type commentCreateReq } from '@/api/comment_api';
import Comment_list from '@/components/comment/comment_list.vue';
import Fc_a from '@/components/common/fc_a.vue';
import Fc_label from '@/components/common/fc_label.vue';
import { relationOptions } from '@/options/options';
import { dateTimeFormat } from '@/utils/date';
import { Message } from '@arco-design/web-vue';
import { reactive, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
const commentListRef = ref<InstanceType<typeof Comment_list>>();
const currentItem = ref<commentListRes | null>(null);
const activeCommentId = ref<number | null>(null);
const textareaRef = ref();

const handleVisibleChange = (visible: boolean, commentId: number) => {
    if (visible) {
        activeCommentId.value = commentId;
    } else {
        activeCommentId.value = null;
    }
};

const show = () => {
    console.log("show");
    textareaRef.value?.focus();
}
const hide = () => {
}
const prepareReply = (item: commentListRes) => {
    currentItem.value = item;
    form.articleID = item.articleID;
    form.parentID = item.id;
    activeCommentId.value = item.id;
};

const handleReply = () => {
    if (currentItem.value) {
        apply(currentItem.value);
        activeCommentId.value = null;
    }
};

const apply = async (item: commentListRes | null) => {
    console.log(item);
    if (!item) return;
    if (form.comment.trim() === "") {
        Message.warning("评论内容不能为空");
        return;
    }
    const res = await commentCreateApi(form);
    form.comment = "";
    Message.success(res.msg);
    commentListRef.value?.getData();
}

const route = useRoute();
const form = reactive<commentCreateReq>({
    articleID: 0,
    parentID: 0,
    comment: "",
})
</script>

<style lang="less">
.comment-container {}

.apply_comment_trigger {
    width: 320px;
    border-radius: 8px;
    border: none;
    background-color: var(--color-bg-2);
    position: relative;
    padding: 16px;
    z-index: 100;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    overflow: hidden;

    .arco-textarea-wrapper {
        margin-bottom: 40px;
        border-radius: 6px;
        border: 1px solid var(--color-border-2);
        transition: all 0.2s ease;
        overflow: hidden;

        &:hover,
        &:focus-within {
            border-color: var(--color-primary-5);
            box-shadow: 0 0 0 2px rgba(var(--primary-6), 0.1);
        }

        .arco-textarea {
            padding: 10px 12px;
            font-size: 14px;
            line-height: 1.6;
            border: none;
            background: transparent;
            resize: none;
            outline: none;
            transition: all 0.2s ease;

            &::placeholder {
                color: var(--color-text-3);
                opacity: 0.7;
            }
        }
    }

    .arco-btn {
        position: absolute;
        right: 16px;
        bottom: 16px;
        border-radius: 6px;
        padding: 4px 16px;
        font-size: 13px;
        background: linear-gradient(to right, var(--color-primary-6), var(--color-primary-5));
        border: none;
        transition: all 0.3s ease;
        box-shadow: 0 2px 6px rgba(var(--primary-6), 0.3);
        color: var(--color-text-2);

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(var(--primary-6), 0.4);
        }

        &:active {
            transform: translateY(0);
            box-shadow: 0 2px 6px rgba(var(--primary-6), 0.3);
        }
    }
}

.action-btn.reply-btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover {
        color: var(--color-primary-6);
        background-color: rgba(var(--primary-6), 0.1);
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }

    .apply {
        font-size: 13px;
    }
}
</style>