<template>
    <div class="platform_article_view">
        <div class="head">
            <div class="left">
                <div class="title">我的文章</div>
                <RouterLink :to="{ name: 'platformArticleAdd' }">
                    <a-button type="primary">发布文章</a-button>
                </RouterLink>
            </div>
            <div class="right">
                <a-input-search placeholder="搜索文章" v-model="params.key" @search="getData"
                    @keyup.enter="getData"></a-input-search>
            </div>
        </div>
        <div class="body scrollbar">
            <div class="menu">
                <Fc_a @click="checkStatus(3)" :class="{ active: params.status === 3 }">已发布</Fc_a>
                <Fc_a @click="checkStatus(2)" :class="{ active: params.status === 2 }">待审核</Fc_a>
                <Fc_a @click="checkStatus(1)" :class="{ active: params.status === 1 }">草稿箱</Fc_a>
            </div>
            <div class="article_list">
                <a-spin :loading="loading" tip="加载中...">
                    <div class="item" v-for="item in data.list" :key="item.id">
                        <div class="cover">
                            <img v-if="item.cover" :src="item.cover" alt="封面"
                                @click="router.push({ name: 'article', params: { id: item.id } })"
                                style="cursor: pointer;">
                            <div v-else class="no-cover">
                                <icon-file-image />
                            </div>
                        </div>
                        <div class="user_top" v-if="item.userTop">
                            <span class="ribbon-text">置顶</span>
                            <span class="ribbon-left"></span>
                            <span class="ribbon-right"></span>
                        </div>
                        <div class="info">
                            <div class="title" @click="router.push({ name: 'article', params: { id: item.id } })"
                                style="cursor: pointer;">{{ item.title }}</div>
                            <div class="abs">
                                <a-typography-text :ellipsis="{ rows: 2, css: true }">{{ item.abstract
                                    }}</a-typography-text>
                            </div>
                            <div class="data">
                                <IconEye></IconEye>
                                <span>{{ item.lookCount }}</span>
                                <IconMessage></IconMessage>
                                <span>{{ item.commentCount }}</span>
                                <div class="tags">
                                    <a-tag v-for="tag in item.tagList">{{ tag }}</a-tag>
                                </div>
                                <div class="date">
                                    {{ relativeTimeFormat(item.updateAt) }}
                                </div>
                                <div class="more" :style="item.userTop ? 'top:44px;' : ''">
                                    <a-dropdown @select="handleSelect(item.id, $event)">
                                        <IconMore />
                                        <template #content>
                                            <a-doption :value="item.userTop ? 'cancelTop' : 'top'"
                                                v-if="item.status === 3">{{ item.userTop ?
                                                    '取消置顶' : '置顶' }}</a-doption>
                                            <a-doption value="platformArticleEdit">编辑文章</a-doption>
                                            <a-doption value="delete" style="color: red;">删除文章</a-doption>
                                        </template>
                                    </a-dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-spin>
                <div class="page" v-if="data.count > 0">
                    <a-pagination v-model:current="params.page" :total="data.count" :page-size="params.limit" show-total
                        @change="getData"></a-pagination>
                </div>
                <div class="no-data" v-if="data.list.length === 0 && !loading">
                    <a-empty description="暂无数据" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Fc_a from '@/components/common/fc_a.vue';
import { articleDeleteApi, articleListApi, type articleListRequest, type articleListType } from '@/api/article_api';
import { reactive, ref } from 'vue'
import { type listResponse } from "@/api/index"
import { Message } from '@arco-design/web-vue';
import { dateFormat, relativeTimeFormat } from '@/utils/date';
import router from '@/router';
import { userArticleTopApi } from '@/api/user_api';
const handleSelect = async (id: number, value: string) => {
    // console.log(id, value)
    if (value === 'platformArticleEdit') {
        router.push({ name: 'platformArticleEdit', params: { id } })
        return
    } else if (value === 'delete') {
        const res = await articleDeleteApi(id)
        Message.success(res.msg)
        getData()
    } else if (value === 'top') {
        const res = await userArticleTopApi({
            articleID: id,
            type: 1
        })
        Message.success(res.msg)
        getData()
    } else if (value === 'cancelTop') {
        const res = await userArticleTopApi({
            articleID: id,
            type: 1
        })
        Message.success(res.msg)
        getData()
    }
}
const data = reactive<listResponse<articleListType>>({
    list: [],
    count: 0
})

const loading = ref(false)

const params = reactive<articleListRequest>({
    type: 2,
    status: 3,
    limit: 10,
})

async function getData() {
    loading.value = true
    try {
        const res = await articleListApi(params)
        console.log(res)
        Object.assign(data, res.data)
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}

function checkStatus(status: number) {
    params.status = status
    getData()
}
getData()

</script>
<style lang="less">
.platform_article_view {
    background: var(--color-bg-1);
    border-radius: var(--border-radius-large);
    height: 100%;
    display: flex;
    flex-direction: column;
    width: 100%;
    box-shadow: var(--shadow-1);

    >.body {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
    }

    .head {
        display: flex;
        justify-content: space-between;
        padding: 24px;
        border-bottom: 1px solid var(--color-border-2);
        align-items: center;
        background: var(--color-bg-2);
        border-radius: var(--border-radius-large) var(--border-radius-large) 0 0;

        .left {
            display: flex;
            align-items: center;
            gap: 16px;

            .title {
                color: var(--color-text-1);
                font-size: 20px;
                font-weight: 600;
            }

            .arco-btn {
                border-radius: var(--border-radius-circle);
                height: 36px;
                padding: 0 20px;
                font-weight: 500;
                transition: all 0.2s ease;

                &:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(var(--primary-6), 0.2);
                }
            }
        }

        .arco-input-search {
            border-radius: var(--border-radius-circle);
            width: 280px;

            .arco-input {
                height: 36px;
            }
        }
    }

    .body {
        .menu {
            margin-bottom: 24px;
            display: flex;
            gap: 24px;

            a {
                color: var(--color-text-2);
                font-size: 15px;
                font-weight: 500;
                padding: 8px 16px;
                border-radius: var(--border-radius-small);
                transition: all 0.2s ease;
                position: relative;

                &:hover {
                    color: rgb(var(--primary-6));
                    background: var(--color-fill-2);
                }

                &.active {
                    color: rgb(var(--primary-6));
                    background: var(--color-fill-2);

                    &::after {
                        content: '';
                        position: absolute;
                        bottom: -2px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 20px;
                        height: 3px;
                        background: rgb(var(--primary-6));
                        border-radius: var(--border-radius-circle);
                    }
                }
            }
        }

        .article_list {
            position: relative;
            min-height: 200px;

            .arco-spin {
                width: 100%;
            }

            .item {
                display: flex;
                padding: 24px;
                border: 1px solid var(--color-border-2);
                border-radius: var(--border-radius-large);
                margin-bottom: 24px;
                background-color: var(--color-bg-2);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;

                &:last-child {
                    margin-bottom: 0;
                }

                &:hover {
                    transform: translateY(-2px);
                    border-color: rgb(var(--primary-6));
                    box-shadow: 0 8px 24px rgba(var(--primary-6), 0.12);
                }

                .user_top {
                    position: absolute;
                    top: 0;
                    right: 0;
                    z-index: 2;
                    height: 48px;
                    width: 140px;
                    pointer-events: none;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-end;

                    .ribbon-text {
                        position: absolute;
                        right: -40px;
                        top: 12px;
                        display: block;
                        width: 120px;
                        text-align: center;
                        font-size: 15px;
                        font-weight: 700;
                        color: var(--color-text-1);
                        letter-spacing: 2px;
                        background: linear-gradient(120deg, #ff4d4f 60%, #ffb300 100%);
                        border-radius: 6px;
                        padding: 4px 0;
                        transform: rotate(45deg);
                        text-shadow: 0 1px 4px #b3000033;
                        box-shadow: 0 2px 8px 0 #ffb30033;
                        overflow: hidden;
                    }

                    .ribbon-left,
                    .ribbon-right {
                        position: absolute;
                        top: 28px;
                        width: 18px;
                        height: 18px;
                        background: linear-gradient(135deg, #ff4d4f 80%, #ffb300 100%);
                        z-index: -1;
                        border-radius: 2px;
                        filter: blur(0.5px);
                        opacity: 0.7;
                    }

                    .ribbon-left {
                        left: 38px;
                        transform: rotate(20deg) skewY(20deg);
                        box-shadow: -2px 2px 4px #ffb30022;
                    }

                    .ribbon-right {
                        right: -8px;
                        transform: rotate(-20deg) skewY(-20deg);
                        box-shadow: 2px 2px 4px #ffb30022;
                    }
                }

                .cover {
                    width: 200px;
                    min-width: 200px;
                    height: 120px;
                    margin-right: 24px;
                    border-radius: var(--border-radius-medium);
                    overflow: hidden;
                    box-shadow: var(--shadow-1);

                    .no-cover {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: var(--color-text-3);
                        font-size: 40px;
                        background: var(--color-fill-2);
                        border-radius: var(--border-radius-medium);
                        width: 100%;
                        height: 100%;
                        transition: all 0.3s ease;
                    }

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 0.3s ease;

                        &:hover {
                            transform: scale(1.05);
                        }
                    }
                }

                .info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;

                    .title {
                        font-size: 20px;
                        font-weight: 600;
                        color: var(--color-text-1);
                        cursor: pointer;
                        transition: color 0.2s ease;
                        line-height: 1.4;

                        &:hover {
                            color: rgb(var(--primary-6));
                        }
                    }

                    .abs {
                        font-size: 14px;
                        color: var(--color-text-2);
                        line-height: 1.6;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        min-height: 44px;
                    }

                    .data {
                        margin-top: auto;
                        display: flex;
                        align-items: center;
                        font-size: 13px;
                        color: var(--color-text-3);
                        gap: 16px;

                        .arco-icon {
                            font-size: 16px;
                            color: var(--color-text-3);
                        }

                        .tags {
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            margin-right: auto;

                            .arco-tag {
                                background: var(--color-fill-2);
                                border: none;
                                padding: 2px 8px;
                                font-size: 12px;
                                border-radius: var(--border-radius-small);
                                transition: all 0.2s ease;

                                &:hover {
                                    background: var(--color-fill-3);
                                    transform: translateY(-1px);
                                }
                            }
                        }

                        .date {
                            color: var(--color-text-3);
                            font-size: 12px;
                        }

                        .more {
                            position: absolute;
                            right: 20px;
                            top: 18px;
                            z-index: 3;
                            cursor: pointer;
                            padding: 6px;
                            border-radius: var(--border-radius-circle);
                            background: transparent;
                            transition: background 0.2s, box-shadow 0.2s, top 0.2s;

                            &:hover {
                                background: var(--color-fill-2);
                                box-shadow: 0 2px 8px rgba(var(--primary-6), 0.08);
                            }

                            svg {
                                font-size: 22px;
                                color: var(--color-text-3);
                            }
                        }
                    }
                }

                .user_top~.info .more {
                    top: 44px;
                }
            }

            .page {
                margin-top: 32px;
                display: flex;
                justify-content: center;
            }
        }
    }
}
</style>