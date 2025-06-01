<template>
    <div class="article_detail_view">
        <fc_nav></fc_nav>
        <fc_main>
            <Fc_article_modal :article-i-d="data.id" v-model:visible="visible" @select="collectArticle">
            </Fc_article_modal>
            <!-- 左侧浮动操作栏 -->
            <div class="article_action_float" ref="actionFloat">
                <div class="action_item" @click="goTop">
                    <i class="iconfont icon-fanhuidingbu"></i>
                    <span>{{ data.lookCount }}</span>
                </div>
                <div class="action_item" @click="handleLike">
                    <i class="iconfont icon-tuijian" :class="{ active: data.isLiked }"></i>
                    <span>{{ data.likeCount }}</span>
                </div>
                <div class="action_item" @click="goComment">
                    <i class="iconfont icon-pinglun"></i>
                    <span>{{ data.commentCount }}</span>
                </div>
                <div class="action_item" @click="handleCollect">
                    <i class="iconfont icon-shoucang" :class="{ active: data.isCollected }"></i>
                    <span>{{ data.collectCount }}</span>
                </div>
            </div>

            <div class="article_container">
                <div class="article_content">
                    <div class="head">
                        <div class="title">{{ data.title }}
                            <IconEdit style="cursor: pointer;" @click="router.push('/platform/article_edit/' + data.id)"
                                v-if="myStore.userBaseInfo.userID === data.userID">编辑
                            </IconEdit>
                        </div>
                        <div class="date">{{ dateFormat(data.createAt) }}</div>
                        <div class="tags">
                            <a-tag v-for="tag in data.tagList" :key="tag">{{ tag }}</a-tag>
                        </div>
                    </div>

                    <div class="body">
                        <MdPreview :id="`md_${data.id}`" :theme="theme" :model-value="data.content"></MdPreview>
                    </div>
                </div>
                <article_comment_tree v-if="data.openComment" :article-i-d="Number(route.params.id)"
                    ref="commentTreeRef" @create-comment="getData">
                </article_comment_tree>
                <div v-else class="no_comment">
                    <div class="no_comment_icon">
                        <i class="iconfont icon-guanbipinglun1"></i>
                    </div>
                    <div class="no_comment_text">作者未开启评论功能</div>
                </div>
            </div>

            <!-- 右侧浮动信息栏 -->
            <div class="article_info_float" ref="infoFloat">
                <div class="user_info">
                    <div class="user">
                        <a-avatar :image-url="data.userAvatar" @click="router.push('/user/' + data.userID + '/article')"
                            style="cursor: pointer"></a-avatar>
                    </div>
                    <div class="nick" @click="router.push('/user/' + data.userID + '/article')" style="cursor: pointer">
                        {{ data.nickname }}
                    </div>
                    <div class="data">
                        <div class="item">
                            <span>{{ data.lookCount }}</span>
                            <span><i class="iconfont icon-liulan"></i></span>
                        </div>
                        <div class="item">
                            <span>{{ data.likeCount }}</span>
                            <span><i class="iconfont icon-tuijian"></i></span>
                        </div>
                        <div class="item">
                            <span>{{ data.commentCount }}</span>
                            <span><i class="iconfont icon-pinglun"></i></span>
                        </div>
                        <div class="item">
                            <span>{{ data.collectCount }}</span>
                            <span><i class="iconfont icon-shoucang"></i></span>
                        </div>
                    </div>
                </div>
                <div class="catalog">
                    <div class="head">文章目录</div>
                    <div class="body" ref="catalogBody" :style="{ maxHeight: catalogMaxHeight + 'px' }">
                        <MdCatalog :editor-id="`md_${data.id}`" :scroll-element="scollElement" :theme="theme">
                        </MdCatalog>
                    </div>
                </div>
            </div>
        </fc_main>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import Fc_nav from "@/components/web/fc_nav.vue";
import Fc_main from "@/components/web/fc_main.vue";
import { MdCatalog, MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";
import { articleCollectApi, articleDetailApi, articleHistoryApi, articleLikeApi, type ArticleCreateRequest, type articleDetailType } from '@/api/article_api';
import { reactive, watch, ref, onMounted, onUnmounted, nextTick } from 'vue';
import { Message } from '@arco-design/web-vue';
import { dateFormat } from '@/utils/date';
import { theme } from '@/components/common/fc_theme';
import Fc_article_modal from '@/components/web/article/fc_article_modal.vue';
import article_comment_tree from '@/components/comment/article_comment_tree.vue';
import router from '@/router';
import { useUserStore } from '@/stores/user_store';
import { showLogin } from '@/components/web/fc_login';
const myStore = useUserStore()
const commentTreeRef = ref();
const visible = ref(false);
const scollElement = document.documentElement
const actionFloat = ref<HTMLElement>();
const infoFloat = ref<HTMLElement>();
const catalogBody = ref<HTMLElement>();
const commentContent = ref('');
const catalogMaxHeight = ref(400);
const data = reactive<articleDetailType>({
    id: 0,
    createAt: "",
    updateAt: "",
    title: "",
    abstract: "",
    content: "",
    tagList: [],
    cover: "",
    categoryID: 0,
    userID: 0,
    lookCount: 0,
    likeCount: 0,
    commentCount: 0,
    collectCount: 0,
    openComment: false,
    status: 0,
    username: "",
    userAvatar: "",
    nickname: "",
    categoryTitle: "",
    isLiked: false,
    isCollected: false,
});

const route = useRoute();

async function getData() {
    const res = await articleDetailApi(Number(route.params.id));
    Object.assign(data, res.data);
    if (data.collectCount < 0) {
        data.collectCount = 0;
    }
    // 数据加载完成后，计算目录最大高度
    await nextTick();
    calculateCatalogHeight();
    setTimeout(() => {
        putToLookHistory();
    }, 1000);
}

async function putToLookHistory() {
    if (!myStore.isLogin) {
        return
    }
    await articleHistoryApi(data.id)
}

// 计算目录容器的最大高度
function calculateCatalogHeight() {
    const windowHeight = window.innerHeight;
    const navHeight = 60; // 导航栏高度
    const userInfoHeight = 200; // 用户信息区域大概高度
    const padding = 100; // 留白
    catalogMaxHeight.value = windowHeight - navHeight - userInfoHeight - padding;
}

// 处理浮动定位
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const triggerHeight = 100; // 触发浮动的滚动距离
    if (actionFloat.value && infoFloat.value) {
        if (scrollTop > triggerHeight) {
            actionFloat.value.classList.add('fixed');
            infoFloat.value.classList.add('fixed');
        } else {
            actionFloat.value.classList.remove('fixed');
            infoFloat.value.classList.remove('fixed');
        }
    }
}

const goTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function handleLike() {
    const res = await articleLikeApi(data.id);
    Message.success(res.msg);
    data.isLiked = !data.isLiked;
    if (data.isLiked) {
        data.likeCount++;
    } else if (!data.isLiked) {
        data.likeCount--;
    }
}

function goComment() {
    // 跳转到评论区
    const commentSection = document.querySelector('.article_comment_com');
    if (commentSection) {
        commentSection.scrollIntoView({ behavior: 'smooth' });
    }
    commentTreeRef.value.textAreaFocus();
}
async function handleCollect() {
    if (!myStore.isLogin) {
        console.log(myStore.isLogin)
        showLogin()
        return
    }
    visible.value = !visible.value;
}

const collectArticle = async (id: number) => {
    const res = await articleCollectApi({
        articleID: data.id,
        collectID: id
    })
    if (res.msg === "收藏成功") {
        data.collectCount++;
        data.isCollected = true;
    } else if (res.msg === "取消收藏成功") {
        await getData();
        if (data.isCollected) {
            data.isCollected = true;
        } else if (!data.isCollected) {
            data.isCollected = false;
        }
        if (data.collectCount < 0) {
            data.collectCount = 0;
        }
    }
    Message.success(res.msg);
}
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', calculateCatalogHeight);
    calculateCatalogHeight();
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', calculateCatalogHeight);
});

watch(route.params, async () => {
    getData();
}, { immediate: true });

onMounted(() => {
    const id = route.query.id as string
    if (id) {
        setTimeout(() => {
            const div = document.getElementById(id) as HTMLElement
            document.documentElement.scrollTo({ top: div.offsetTop, behavior: 'smooth' })
        }, 100)
    }
}
)
</script>

<style lang="less">
.article_detail_view {
    .fc_container {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        position: relative;
    }

    // 左侧浮动操作栏
    .article_action_float {
        position: absolute;
        left: calc(50% - 550px);
        z-index: 999;
        top: 100px;
        width: 60px;
        background: var(--color-bg-1);
        border-radius: 30px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 10px 0;
        transition: all 0.3s ease;

        &.fixed {
            position: fixed;
            top: 100px;
        }

        .action_item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 15px 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            border-radius: 25px;
            margin: 5px;

            .icon-fanhuidingbu {
                font-size: 27px !important;
                transform: scale(1.1);
            }

            &:hover {
                background: var(--color-fill-1);
            }

            i {
                font-size: 18px;
                color: var(--color-text-2);
                margin-bottom: 5px;
                transition: all 0.3s ease;

                &.active {
                    color: rgb(var(--arcoblue-5));
                    text-shadow: 0 0 6px rgba(var(--arcoblue-5), 0.7),
                        0 0 12px rgba(var(--arcoblue-5), 0.5),
                        0 0 18px rgba(var(--arcoblue-5), 0.3);
                }
            }


            span {
                font-size: 12px;
                color: var(--color-text-3);
                font-weight: 500;
            }

            &:hover i {
                color: var(--color-text-1);
                transform: scale(1.2);
            }
        }
    }

    .article_container {
        width: 800px;
        margin: 0 20px;

        .article_content {
            background: var(--color-bg-1);
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

            .head {
                padding: 30px 30px 20px 30px;
                border-bottom: 1px solid var(--color-border-2);
                display: flex;
                flex-direction: column;
                align-items: center;

                .title {
                    font-size: 24px;
                    font-weight: 600;
                    color: var(--color-text-1);
                    text-align: center;
                    line-height: 1.4;
                }

                .date {
                    color: var(--color-text-3);
                    font-size: 14px;
                    margin: 10px 0;
                }

                .tags {
                    margin-top: 15px;
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
            }

            .body {
                padding: 20px 30px 30px 30px;

                .md-editor-preview-wrapper {
                    padding: 0;
                }
            }
        }

        .no_comment {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
            width: 100%;
            background: var(--color-bg-1);
            height: 100px;
            justify-content: center;

            .no_comment_icon {
                .icon-guanbipinglun1 {
                    font-size: 50px;
                    color: var(--color-text-2);
                }
            }

            .no_comment_text {
                font-size: 16px;
                color: var(--color-text-3);
                margin-bottom: 10px;
            }
        }

        .article_comment {
            margin-top: 20px;
            border-radius: 8px;
            background: var(--color-bg-1);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

            .add_comment {
                padding: 20px;
                position: relative;

                .arco-btn {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                }
            }
        }
    }

    // 右侧浮动信息栏
    .article_info_float {
        position: absolute;
        right: calc(50% - 750px);
        top: 100px;
        width: 280px;
        z-index: 100;
        transition: all 0.3s ease;

        &.fixed {
            position: fixed;
            top: 100px;
        }

        >div {
            background: var(--color-bg-1);
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
            margin-bottom: 20px;
        }

        .user_info {
            padding: 25px;
            display: flex;
            flex-direction: column;
            align-items: center;

            .user {
                margin-bottom: 15px;
            }

            .nick {
                font-weight: 600;
                color: var(--color-text-1);
                font-size: 16px;
                margin-bottom: 20px;
            }

            .data {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
                width: 100%;

                .item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    span:nth-child(1) {
                        font-size: 18px;
                        font-weight: 600;
                        color: var(--color-text-1);
                        margin-bottom: 8px;
                    }

                    span:nth-child(2) {
                        font-size: 12px;
                        color: var(--color-text-3);

                        i.iconfont {
                            font-size: 16px;
                        }
                    }

                    .icon-liulan {
                        font-size: 18px !important;
                        margin-top: 1px !important;
                    }
                }
            }
        }

        .catalog {
            .head {
                padding: 20px 20px 15px 20px;
                border-bottom: 1px solid var(--color-border-2);
                font-weight: 600;
                color: var(--color-text-1);
                font-size: 16px;
            }

            .body {
                padding: 15px 20px 20px 20px;
                overflow-y: auto;

                &::-webkit-scrollbar {
                    width: 4px;
                }

                &::-webkit-scrollbar-track {
                    background: var(--color-fill-2);
                    border-radius: 2px;
                }

                &::-webkit-scrollbar-thumb {
                    background: var(--color-fill-3);
                    border-radius: 2px;

                    &:hover {
                        background: var(--color-fill-4);
                    }
                }

                .md-editor-catalog-active>span {
                    color: rgb(var(--arcoblue-6));
                    font-weight: 600;
                }

                .md-editor-catalog-link span:hover {
                    color: rgb(var(--arcoblue-5));
                }

                .md-editor-catalog-indicator {
                    background: rgb(var(--arcoblue-6));
                }
            }
        }
    }

    // 响应式设计
    @media (max-width: 1400px) {
        .article_action_float {
            left: 20px;
        }

        .article_info_float {
            right: 20px;
        }

        .article_container {
            margin: 0 320px;
        }
    }

    @media (max-width: 1200px) {

        .article_action_float,
        .article_info_float {
            display: none;
        }

        .article_container {
            margin: 0 auto;
        }
    }
}
</style>