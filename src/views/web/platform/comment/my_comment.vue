<template>
    <div class="my-comment-container">
        <Comment_list :type="2" v-slot="{ item }: { item: commentListRes }">
            <div class="comment-content">
                <div class="comment-header">
                    <div class="article-info">
                        我评论了文章: <RouterLink to="" class="article-title">{{ item.articleTitle }}</RouterLink>
                    </div>
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
                        <a-tooltip content="点赞">
                            <div class="action-btn like-btn">
                                <icon-thumb-up />
                                <span v-if="item.diggCount">{{ item.diggCount }}</span>
                            </div>
                        </a-tooltip>
                    </div>
                </div>
            </div>
        </Comment_list>
    </div>
</template>

<script setup lang="ts">
import { useAxios, type listResponse } from '@/api';
import { commentRemove, type commentListReq, type commentListRes } from '@/api/comment_api';
import Comment_list from '@/components/comment/comment_list.vue';
import Fc_a from '@/components/common/fc_a.vue';
import Fc_label from '@/components/common/fc_label.vue';
import { relationOptions } from '@/options/options';
import { dateTimeFormat } from '@/utils/date';
import { Message } from '@arco-design/web-vue';
import { reactive, ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();

</script>

<style lang="less">
.my-comment-container {
    .comment-content {
        padding: 4px 0;
        transition: all 0.3s ease;
        border-radius: 8px;

        .comment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            color: var(--color-text-3);
            font-size: 14px;

            .article-info {
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                a {
                    color: rgb(var(--primary-6); )
                }
            }

            .article-title {
                color: var(--color-primary-6);
                font-weight: 500;
                transition: color 0.2s;
                margin-left: 4px;

                &:hover {
                    text-decoration: underline;
                }
            }

            .comment-time {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 12px;
                color: var(--color-text-3);
                margin-left: 12px;

                .arco-icon {
                    font-size: 14px;
                }
            }
        }

        .comment-text {
            margin: 8px 0;
            color: var(--color-text-1);
            line-height: 1.6;
            font-size: 14px;
            background-color: var(--color-bg-1);
            padding: 8px 12px;
            border-radius: 6px;
            border-left: 3px solid var(--color-primary-light-4);
        }

        .comment-footer {
            margin-top: 8px;

            .comment-actions-bar {
                display: flex;
                align-items: center;

                .action-btn {
                    padding: 4px 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    gap: 4px;

                    &:hover {
                        background-color: rgba(var(--primary-6), 0.1);
                    }

                    &.like-btn {
                        color: var(--color-text-3);

                        &:hover {
                            color: #ff5252;
                            background-color: rgba(255, 82, 82, 0.1);
                        }
                    }
                }
            }
        }
    }
}
</style>