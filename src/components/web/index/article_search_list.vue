<template>
    <div class="article_search_list_com">
        <!-- 炫酷的头部区域 -->
        <div class="head">
            <div class="left">
                <div class="filter-tabs">
                    <span class="tab-item" :class="{ active: currentFilter === 'recommend' }"
                        @click="changeFilter('recommend')" data-filter="recommend">
                        <i class="iconfont icon-xihuan"></i>
                        猜你喜欢
                    </span>
                    <span class="tab-item" :class="{ active: currentFilter === 'latest' }"
                        @click="changeFilter('latest')" data-filter="latest">
                        <i class="iconfont icon-shijian"></i>
                        最新发布
                    </span>
                    <span class="tab-item" :class="{ active: currentFilter === 'replies' }"
                        @click="changeFilter('replies')" data-filter="replies">
                        <i class="iconfont icon-pinglun"></i>
                        最多回复
                    </span>
                    <span class="tab-item" :class="{ active: currentFilter === 'likes' }" @click="changeFilter('likes')"
                        data-filter="likes">
                        <i class="iconfont icon-tuijian"></i>
                        最多点赞
                    </span>
                    <span class="tab-item" :class="{ active: currentFilter === 'collect' }"
                        @click="changeFilter('collect')" data-filter="collect">
                        <i class="iconfont icon-shoucang"></i>
                        最多收藏
                    </span>
                </div>
            </div>
            <div class="search-container">
                <a-input-search placeholder="搜索你感兴趣的文章..." v-model="params.key" class="modern-search" @search="getData"
                    @keydown.enter="getData" />
            </div>
        </div>

        <!-- 文章列表区域 -->
        <a-spin :loading="loading" tip="Loading...">
            <div class="list content-container">
                <div class="item" v-for="(item, index) in data.list" :key="item.id">
                    <!-- 置顶标识 -->
                    <div class="admin_top" v-if="item.adminTop">
                        <i class="iconfont icon-guanliyuanzhiding"></i>
                        <span>管理员置顶</span>
                    </div>

                    <!-- 用户信息 -->
                    <div class="top_info">
                        <div class="user-section">
                            <a-avatar :size="40" :image-url="item.userAvatar"
                                @click="router.push('/user/' + item.userID + '/article')" class="user-avatar" />
                            <div class="user-details">
                                <span class="nickname" @click="router.push('/user/' + item.userID + '/article')">
                                    {{ item.userNickname }}
                                </span>
                                <span class="date">
                                    <i class="iconfont icon-shijian"></i>
                                    最后更新于 {{ relativeTimeFormat(item.updateAt) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 文章内容 -->
                    <div class="article_info">
                        <div class="info">
                            <div class="title" v-html="item.title" @click="router.push('/article/' + item.id)">
                            </div>
                            <div class="abs">
                                <a-typography-paragraph :ellipsis="{ row: 2, css: true }">
                                    <div v-html="item.abstract"></div>
                                </a-typography-paragraph>
                            </div>

                            <!-- 标签区域 -->
                            <div class="tags" v-if="item.tagList && item.tagList.length">
                                <a-tag v-for="tag in item.tagList" :key="tag" class="modern-tag">
                                    {{ tag }}
                                </a-tag>
                            </div>

                            <!-- 数据统计 -->
                            <div class="data">
                                <div class="data-list">
                                    <span class="stat-item">
                                        <i class="iconfont icon-liulan"></i>
                                        <span class="count">{{ formatCount(item.lookCount) }}</span>
                                    </span>
                                    <span class="stat-item likes">
                                        <i class="iconfont icon-tuijian"></i>
                                        <span class="count">{{ formatCount(item.likeCount) }}</span>
                                    </span>
                                    <span class="stat-item">
                                        <i class="iconfont icon-pinglun"></i>
                                        <span class="count">{{ formatCount(item.commentCount) }}</span>
                                    </span>
                                    <span class="stat-item">
                                        <i class="iconfont icon-shoucang"></i>
                                        <span class="count">{{ formatCount(item.collectCount) }}</span>
                                    </span>
                                    <div class="category" v-if="item.categoryTitle">
                                        <span class="category-name">{{ item.categoryTitle }}</span>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- 封面图片 -->
                        <div class="cover" v-if="item.cover">
                            <img :src="item.cover" @click="router.push('/article/' + item.id)" alt="封面" />
                            <div class="cover-overlay">
                                <i class="iconfont icon-chakan"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 无数据时显示占位内容 -->
                <div class="empty-placeholder" v-if="data.list.length === 0 && !loading">
                    <a-empty description="暂无文章" />
                </div>
            </div>
        </a-spin>
        <div class="pagination-container" v-if="data.list.length > 0">
            <a-pagination v-model:current="params.page" v-model:page-size="params.limit" :total="data.count" show-total
                show-jumper show-page-size @change="getData" @page-size-change="getData" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import type { listResponse, paramsType } from "@/api";
import { bannerListApi, type bannerListType } from "@/api/banner_api";
import { searchArticleApi, type articleSearchReq, type articleSearchRes } from "@/api/search_api";
import { relativeTimeFormat } from "@/utils/date";
import router from "@/router";

const data = reactive<listResponse<articleSearchRes>>({
    list: [],
    count: 0
});

// 当前选中的过滤器
const currentFilter = ref('recommend');

// 确保params对象包含page和limit属性
const params = reactive<articleSearchReq>({
    page: 1,
    limit: 10,
    t: 0
});
const loading = ref(false);

// 格式化数字显示
const formatCount = (count: number) => {
    if (count >= 10000) {
        return (count / 10000).toFixed(1) + 'w';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
};

// 切换过滤器
const changeFilter = (filter: string) => {
    if (currentFilter.value === filter) return;

    currentFilter.value = filter;
    params.page = 1; // 重置页码

    // 根据不同的过滤器设置不同的排序参数
    switch (filter) {
        case 'recommend':
            params.t = 0; // 推荐排序
            break;
        case 'latest':
            params.t = 1; // 最新发布
            break;
        case 'replies':
            params.t = 2; // 最多回复
            break;
        case 'likes':
            params.t = 3; // 最多点赞
            break;
        case 'collect':
            params.t = 4; // 最多收藏
            break;
    }

    getData();
};

// 搜索
const onSearch = () => {
    params.page = 1;
    getData();
};

async function getData() {
    loading.value = true;
    const res = await searchArticleApi(params);
    loading.value = false;
    Object.assign(data, res.data);

    // 平滑滚动到列表顶部
    // const listElement = document.querySelector('.article_search_list_com');
    // if (listElement && params.page && params.page > 1) {
    //     listElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // }
}

getData();
</script>

<style lang="less">
.article_search_list_com {
    background: var(--color-bg-1);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    border: 1px solid rgba(var(--color-border-2), 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    margin-bottom: 20px;

    .pagination-container {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        padding: 10px 0;
    }

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg,
                rgb(var(--arcoblue-6)),
                rgb(var(--purple-6)),
                rgb(var(--cyan-6)));
        z-index: 1;
    }

    .head {
        padding: 24px 32px;
        background: rgba(var(--color-bg-1), 0.9);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(var(--color-border-2), 0.2);
        position: relative;
        display: flex;

        .left {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 20px;

            .filter-tabs {
                display: flex;
                align-items: center;
                gap: 8px;
                background: rgba(var(--color-bg-2), 0.8);
                padding: 8px;
                border-radius: 16px;
                border: 1px solid rgba(var(--color-border-2), 0.3);

                .tab-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 12px 12px;
                    border-radius: 12px;
                    cursor: pointer;
                    color: var(--color-text-2);
                    font-weight: 500;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;

                    i {
                        font-size: 14px;
                        transition: transform 0.3s ease;
                    }

                    &::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg,
                                rgba(var(--arcoblue-6), 0.1),
                                rgba(var(--arcoblue-6), 0.2),
                                rgba(var(--arcoblue-6), 0.1));
                        transition: left 0.5s ease;
                    }

                    &:hover {
                        color: rgb(var(--arcoblue-6));
                        background: rgba(var(--arcoblue-1), 0.5);
                        transform: translateY(-2px);
                        box-shadow: 0 8px 25px rgba(var(--arcoblue-6), 0.2);

                        i {
                            transform: scale(1.1);
                        }

                        &::before {
                            left: 100%;
                        }
                    }

                    &.active {
                        color: rgb(var(--arcoblue-6));
                        background: linear-gradient(135deg,
                                rgba(var(--arcoblue-6), 0.15),
                                rgba(var(--arcoblue-6), 0.1));
                        box-shadow: 0 4px 15px rgba(var(--arcoblue-6), 0.25);
                        font-weight: 600;

                        i {
                            transform: scale(1.1);
                        }
                    }
                }
            }
        }

        .search-container {
            width: calc(100% - 576px);
            display: flex;
            align-items: center;

            .modern-search {
                width: 280px;

                :deep(.arco-input-wrapper) {
                    border-radius: 25px;
                    border: 2px solid rgba(var(--color-border-2), 0.3);
                    background: rgba(var(--color-bg-1), 0.8);
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

                    &:hover {
                        border-color: rgba(var(--arcoblue-6), 0.4);
                        box-shadow: 0 8px 25px rgba(var(--arcoblue-6), 0.15);
                        transform: translateY(-2px);
                    }

                    &.arco-input-focus {
                        border-color: rgb(var(--arcoblue-6));
                        box-shadow: 0 0 0 3px rgba(var(--arcoblue-6), 0.1);
                    }

                    .arco-input {
                        background: transparent;
                        border: none;
                        font-size: 14px;

                        &::placeholder {
                            color: var(--color-text-3);
                        }
                    }

                    .arco-input-suffix {
                        .arco-btn {
                            border: none;
                            background: linear-gradient(135deg,
                                    rgb(var(--arcoblue-6)),
                                    rgb(var(--arcoblue-5)));
                            border-radius: 20px;
                            transition: all 0.3s ease;

                            &:hover {
                                transform: scale(1.05);
                                box-shadow: 0 4px 15px rgba(var(--arcoblue-6), 0.3);
                            }
                        }
                    }
                }
            }
        }
    }

    .arco-spin {
        width: 100%;
    }

    .list {
        em {
            color: red;
        }

        &.content-container {
            min-height: 500px;
        }

        .empty-placeholder {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 300px;
        }

        .item {
            padding: 24px 32px;
            border-bottom: 1px solid rgba(var(--color-border-2), 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            background: rgba(var(--color-bg-1), 0.6);
            backdrop-filter: blur(10px);

            &:hover {
                background: rgba(var(--color-bg-1), 0.9);
                transform: translateX(8px);
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);

                .cover img {
                    transform: scale(1.05);
                }

                .cover-overlay {
                    opacity: 1;
                }
            }

            .cover {
                width: 100%;
                height: 100%;
            }

            &:last-child {
                border-bottom: none;
            }

            .admin_top {
                position: absolute;
                top: 16px;
                right: 32px;
                background: linear-gradient(135deg,
                        rgb(var(--red-6)),
                        rgb(var(--orange-6)));
                color: var(--color-text-1);
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 4px;
                box-shadow: 0 4px 15px rgba(var(--red-6), 0.3);
                animation: pulse 2s infinite;

                i {
                    font-size: 12px;
                }
            }

            .top_info {
                margin-bottom: 16px;

                .user-section {
                    display: flex;
                    align-items: center;
                    gap: 12px;

                    .user-avatar {
                        cursor: pointer;
                        transition: all 0.3s ease;
                        border: 2px solid rgba(var(--arcoblue-6), 0.2);

                        &:hover {
                            transform: scale(1.1);
                            border-color: rgb(var(--arcoblue-6));
                            box-shadow: 0 4px 15px rgba(var(--arcoblue-6), 0.3);
                        }
                    }

                    .user-details {
                        display: flex;
                        flex-direction: column;
                        gap: 4px;

                        .nickname {
                            cursor: pointer;
                            color: var(--color-text-1);
                            font-weight: 600;
                            font-size: 15px;
                            transition: all 0.3s ease;

                            &:hover {
                                color: rgb(var(--arcoblue-6));
                            }
                        }

                        .date {
                            font-size: 12px;
                            color: var(--color-text-3);
                            display: flex;
                            align-items: center;
                            gap: 4px;

                            i {
                                font-size: 12px;
                            }
                        }
                    }
                }
            }

            .article_info {
                display: flex;
                gap: 20px;
                height: 120px;

                .info {
                    flex: 1;

                    .title {
                        font-size: 20px;
                        font-weight: 700;
                        color: var(--color-text-1);
                        cursor: pointer;
                        line-height: 1.4;
                        margin-bottom: 12px;
                        transition: all 0.3s ease;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        overflow: hidden;

                        &:hover {
                            color: rgb(var(--arcoblue-6));
                        }
                    }

                    .abs {
                        margin-bottom: 16px;
                        color: var(--color-text-2);
                        line-height: 1.6;
                    }

                    .tags {
                        margin-bottom: 16px;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;

                        .modern-tag {
                            background: linear-gradient(135deg,
                                    rgba(var(--arcoblue-1), 0.8),
                                    rgba(var(--purple-1), 0.6));
                            border: 1px solid rgba(var(--arcoblue-6), 0.2);
                            color: rgb(var(--arcoblue-6));
                            border-radius: 20px;
                            padding: 6px 12px;
                            font-size: 12px;
                            font-weight: 500;
                            transition: all 0.3s ease;

                            &:hover {
                                background: linear-gradient(135deg,
                                        rgba(var(--arcoblue-6), 0.1),
                                        rgba(var(--purple-6), 0.1));
                                transform: translateY(-2px);
                                box-shadow: 0 4px 15px rgba(var(--arcoblue-6), 0.2);
                            }
                        }
                    }

                    .data {
                        .data-list {
                            display: flex;
                            align-items: center;

                            .stat-item {
                                display: flex;
                                align-items: center;
                                gap: 6px;
                                color: var(--color-text-3);
                                font-size: 13px;
                                padding: 8px 12px;
                                border-radius: 20px;
                                background: rgba(var(--color-bg-2), 0.5);
                                transition: all 0.3s ease;
                                cursor: pointer;

                                i {
                                    font-size: 14px;
                                    transition: transform 0.3s ease;
                                }

                                .count {
                                    font-weight: 600;
                                }

                                &:hover {
                                    background: rgba(var(--arcoblue-1), 0.5);
                                    color: rgb(var(--arcoblue-6));
                                    transform: translateY(-2px);

                                    i {
                                        transform: scale(1.2);
                                    }
                                }

                                &.likes:hover {
                                    background: rgba(var(--red-1), 0.5);
                                    color: rgb(var(--red-6));
                                }
                            }

                            .category {
                                display: inline-block;
                                background: linear-gradient(135deg, #6a5acd, #00bcd4);
                                padding: 4px 12px;
                                border-radius: 999px;
                                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                                transition: transform 0.2s ease;
                                max-width: 100%;
                                white-space: nowrap;
                                transform: translateY(-2px);

                                &:hover {
                                    transform: scale(1.05);
                                }
                            }

                            .category-name {
                                color: var(--color-text-2);
                                font-weight: 600;
                                font-size: 14px;
                                letter-spacing: 0.5px;
                            }
                        }


                    }
                }

                .cover {
                    width: 200px;
                    height: 120px;
                    flex-shrink: 0;
                    border-radius: 16px;
                    overflow: hidden;
                    position: relative;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        cursor: pointer;
                        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    }

                    .cover-overlay {
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: linear-gradient(135deg,
                                rgba(var(--arcoblue-6), 0.8),
                                rgba(var(--purple-6), 0.6));
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        opacity: 0;
                        transition: all 0.3s ease;
                        cursor: pointer;

                        i {
                            color: white;
                            font-size: 24px;
                            transform: scale(0.8);
                            transition: transform 0.3s ease;
                        }

                        &:hover i {
                            transform: scale(1);
                        }
                    }
                }
            }
        }
    }
}

@keyframes pulse {
    0% {
        box-shadow: 0 4px 15px rgba(var(--red-6), 0.3);
    }

    50% {
        box-shadow: 0 4px 25px rgba(var(--red-6), 0.5);
    }

    100% {
        box-shadow: 0 4px 15px rgba(var(--red-6), 0.3);
    }
}

// 响应式设计
@media (max-width: 768px) {
    .article_search_list_com {
        margin: 10px;
        border-radius: 16px;

        .head {


            padding: 16px 20px;

            .left {
                flex-direction: column;
                gap: 16px;
            }

            .filter-tabs {
                overflow-x: auto;
                scrollbar-width: none;

                &::-webkit-scrollbar {
                    display: none;
                }
            }

            .search-container .modern-search {
                width: 100%;
            }
        }

        .list .item {
            padding: 16px 20px;

            .article_info {
                flex-direction: column-reverse;
                gap: 16px;

                .cover {
                    width: 100%;
                    height: 180px;
                }
            }
        }
    }
}
</style>