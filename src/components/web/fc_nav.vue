<template>
    <div class="fc_nav">
        <div class="container">
            <div class="slogan">
                <div class="slogan-cn"><span>{{ slogan }}</span></div>
                <div class="slogan-en"><span>{{ enSlogan }}</span></div>
            </div>
            <div class="web_mode" style="color: var(--color-text-1);cursor: pointer;" @click="goHome">{{
                siteStore.siteInfo.siteInfo.mode ? '博客模式' :
                    '社区模式' }}
            </div>
            <Fc_text_modal v-model:visible="visible" ref="textModalRef"></Fc_text_modal>
            <Fc_ai_modal v-model:visible="aiVisible"></Fc_ai_modal>
            <div class="center">
                <!-- <a style="cursor: pointer;" @click="goHome">首页</a> -->
                <i class="iconfont icon-dengpao" v-if="siteStore.siteInfo.ai.enable" @click="showAiModal"></i>
                <a-input-search placeholder="搜你感兴趣的文章" @keydown.enter="search" @search="search" v-model="key">
                </a-input-search>
            </div>
            <div class="right">
                <Fc_home_user_info></Fc_home_user_info>
                <div class="message" v-if="isLogin">
                    <fc_nav_msg></fc_nav_msg>
                </div>
                <div class="history" v-if="isLogin">
                    <span @click="router.push({ name: 'userBrowseHistory' })">历史</span>
                </div>
                <div class="publish" v-if="isLogin" @click="router.push({ name: 'platformArticleAdd' })">
                    <i class="iconfont icon-fabu"></i>
                    <span>发布</span>
                </div>
                <Fc_them></Fc_them>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { slogan, enSlogan } from '@/global/global';
import Fc_them from '../common/fc_them.vue';
import { ref, onMounted, onUnmounted, computed, watchEffect, reactive } from 'vue';
import { useUserStore } from '@/stores/user_store';
import { useRouter, useRoute } from 'vue-router';
import fc_nav_msg from "@/components/web/fc_nav_msg.vue";
import Fc_home_user_info from './fc_home_user_info.vue';
import { userBaseInfo } from '@/api/user_api';
import type { listResponse, paramsType } from '@/api';
import { fullTextSearchApi, type fullTextSearchRes } from '@/api/search_api';
import Fc_text_modal from './fc_text_modal.vue';
import { useSiteStore } from '@/stores/site_store';
import Fc_ai_modal from './fc_ai_modal.vue';
import { theme } from '../common/fc_theme';
const aiVisible = ref(false);
const showAiModal = () => {
    aiVisible.value = true;
}
const siteStore = useSiteStore()
siteStore.getSiteInfo()
const visible = ref(false);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const textModalRef = ref<InstanceType<typeof Fc_text_modal>>();
const key = ref('')
const goHome = () => {
    router.push({ name: 'webHome' });
}
const search = () => {
    visible.value = true;
    if (key.value) {
        textModalRef.value?.setSearach(key.value)
    }
}
const getUserInfo = async () => {
    try {
        if (userStore.userBaseInfo.userID) {
            const res = await userBaseInfo(userStore.userBaseInfo.userID)
            if (res.data.avatar) {
                userStore.userBaseInfo.avatar = res.data.avatar;
            }
        }
        return
    } catch (error) {
        console.error(error)
    }
}
getUserInfo();
let lastScrollTop = 0;

// 简化滚动处理函数
const handleScroll = () => {
    const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
    lastScrollTop = currentScrollTop;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

const isLogin = computed(() => userStore.isLogin);

</script>

<style lang="less">
html {
    overflow-x: hidden;
}

.fc_nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    width: 100%;
    height: 64px;
    background-color: var(--color-bg-1);
    backdrop-filter: saturate(180%) blur(10px);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    border-bottom: 1px solid var(--color-border-1);
    display: flex;
    justify-content: center;

    .container {
        width: 100%;
        max-width: 1280px;
        height: 100%;
        padding: 0 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        // slogan 区域
        .slogan {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-width: 160px;

            .slogan-cn {
                font-size: 20px;
                font-weight: bold;
                color: var(--color-text-1);
                line-height: 1.2;
            }

            .slogan-en {
                font-size: 12px;
                color: var(--color-text-3);
                transform: scale(0.9);
                transform-origin: left center;
                margin-top: 2px;
            }
        }

        .center {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 32px;

            i {
                font-size: 22px;
                color: rgb(var(--arcoblue-6));
                margin-right: 12px;
                transition: color 0.3s ease, transform 0.2s;

                &:hover {
                    color: rgb(var(--arcoblue-5));
                    transform: scale(1.1);
                }
            }

            .arco-input-wrapper {
                width: 420px;
                border-radius: 20px;
                transition: box-shadow 0.3s ease;

                &:hover,
                &:focus-within {
                    box-shadow: 0 0 0 2px rgba(var(--arcoblue-6), 0.1);
                }
            }
        }

        .right {
            display: flex;
            align-items: center;
            gap: 8px;

            a {
                font-size: 14px;
                color: var(--color-text-1);
                cursor: pointer;
                border-radius: 4px;
                padding: 2px 4px;
                transition: color 0.3s ease, background-color 0.3s ease;
                text-decoration: none;
            }

            .message,
            .history {
                display: flex;
                align-items: center;
                font-size: 14px;
                color: var(--color-text-1);
                cursor: pointer;
                border-radius: 6px;
                padding: 4px 8px;
                transition: color 0.3s ease, background-color 0.3s ease;

                &:hover {
                    color: rgb(var(--primary-6));
                    background-color: var(--color-fill-2);
                }

                a {
                    display: flex;
                    align-items: center;
                }
            }

            .message {
                .arco-badge {
                    .arco-badge-dot {
                        top: 0px !important;
                        right: 3px !important;
                    }
                }
            }

            .publish {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 6px 16px;
                font-size: 14px;
                color: var(--color-text-1);
                margin-left: 10px;
                border-radius: 20px;
                background-color: rgb(var(--primary-6));
                gap: 6px;
                cursor: pointer;
                color: #fff;
                transition: background-color 0.3s ease, box-shadow 0.3s ease;

                i {
                    font-size: 16px;
                }

                &:hover {
                    background-color: rgb(var(--arcoblue-5));
                    box-shadow: 0 2px 8px rgba(var(--arcoblue-6), 0.25);
                }
            }

            .theme-switch {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background-color 0.3s ease;
                position: relative;

                top: 0px;
                left: 120px;

                &:hover {
                    background-color: var(--color-fill-2);
                }
            }
        }
    }
}

.arco-badge-number,
.arco-badge-dot,
.arco-badge-text,
.arco-badge-custom-dot {
    top: -1px !important;
    right: -2px !important;
}

.arco-dropdown-option-content {
    overflow: visible;
}
</style>
@/stores/user_store