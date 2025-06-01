<template>
    <div class="login-btn" v-if="!isLogin" @click="toLogin">
        <span>登录</span>
    </div>
    <div class="avatar-container" v-if="userStore.isLogin">
        <a-trigger trigger="hover" :unmount-on-close="false" position="bottom" :popup-translate="[0, 10]" show-arrow
            :click-to-close="false" :mouse-enter-delay="100" :mouse-leave-delay="200"
            @popup-visible-change="handlePopupVisibleChange">
            <div class="avatar-wrapper" :class="{ 'avatar-menu-active': isPopupActive }">
                <a-avatar @click="router.push({
                    name: 'userArticle', params: {
                        id: userStore.userBaseInfo.userID
                    }
                })" :image-url="userStore.userBaseInfo.avatar" :size="40" class="dynamic-avatar">
                    {{ userStore.userBaseInfo.username[0] }}
                </a-avatar>
            </div>
            <template #content>
                <div class="fc_nav_avatar_com">
                    <div class="nickname">{{ userStore.userBaseInfo.username }}</div>
                    <div class="data">
                        <a-statistic @click="goDest('userFans')" extra="粉丝" :value="userStore.userBaseInfo.fansCount" />
                        <a-statistic @click="goDest('userFollow')" extra="关注"
                            :value="userStore.userBaseInfo.followCount" />
                        <a-statistic @click="goDest('userArticle')" extra="文章"
                            :value="userStore.userBaseInfo.articleCount" />
                    </div>
                    <div class="menu">
                        <div class="item" @click="menuHandler('userInfo')">
                            <i class="iconfont icon-yonghuxinxi"></i><span>个人中心</span>
                        </div>
                        <div class="item" @click="menuHandler('platformArticle')">
                            <i class="iconfont icon-navicon-wzgl"></i><span>文章管理</span>
                        </div>
                        <div class="item" @click="menuHandler('myMessage')"><i
                                class="iconfont icon-wodexiaoxi"></i><span>我的消息</span></div>
                        <div class="item" v-if="userStore.isAdmin" @click="menuHandler('home')"><i
                                class="iconfont icon-houtaiguanli-houtaiguanli"></i><span>后台管理</span></div>
                    </div>
                    <div class="exit" @click="logout">
                        <div class="item"><i class="iconfont icon-liulianliang"></i><span>退出</span></div>
                    </div>
                </div>
            </template>
        </a-trigger>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from "@/stores/user_store";
import { theme } from '../common/fc_theme';
import fc_login_modal from "@/components/common/fc_login_modal.vue";
import { showLogin } from './fc_login';
import router from '@/router';
const goDest = (name: string) => {
    console.log(name);
    router.push({ name, params: { id: userStore.userBaseInfo.userID } });
}
const menuHandler = (name: string) => {
    if (name === "userInfo") {
        router.push({ name: "userInfo" });
    } else if (name === "platformArticle") {
        router.push({ name: "platformArticle" });
    } else if (name === "myMessage") {
        router.push({ name: "myMessage" });
    } else if (name === "home") {
        router.push({ name: "home" });
    }

}

const userStore = useUserStore();
const isPopupActive = ref(false);
const isVisible = ref(false);

const handlePopupVisibleChange = (visible: boolean) => {
    isPopupActive.value = visible;
};

const logout = () => {
    isPopupActive.value = false;
    userStore.webLogout();
}
const isLogin = computed(() => userStore.isLogin);
// 跳转到登录页面
const toLogin = () => {
    showLogin();
}
</script>

<style lang="less">
.avatar-container {
    position: relative;
    display: inline-block;
}

.avatar-wrapper {
    position: relative;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    .dynamic-avatar {
        transform: scale(1);
        transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1),
            box-shadow 0.35s cubic-bezier(0.23, 1, 0.32, 1),
            border-color 0.35s cubic-bezier(0.23, 1, 0.32, 1);
        border-radius: 50%;
        border: 2px solid transparent;
        background-clip: padding-box;
        will-change: transform, box-shadow;

        .arco-avatar-text {
            color: var(--color-text-1);
        }
    }

    &.avatar-menu-active {
        .dynamic-avatar {
            transform: scale(1.65);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
            border: @fc_border;
            background-color: var(--color-bg-1);
            z-index: 9999;
            background-color: var(--color-bg-1);
        }
    }
}

.fc_nav_avatar_com {
    width: 180px;
    border-radius: 8px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    background-color: var(--color-bg-1);
    color: var(--color-text-1);
    animation: dropdown-show 0.3s cubic-bezier(0.23, 1, 0.32, 1);

    @keyframes dropdown-show {
        from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
        }

        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    .nickname {
        text-align: center;
        padding: 18px 20px 8px 20px;
        font-weight: 500;
        font-size: 15px;
    }

    .data {
        border-top: 1px solid var(--color-border);
        border-bottom: 1px solid var(--color-border);
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        padding: 10px 15px;

        .arco-statistic {
            padding: 0 5px;
            cursor: pointer !important;
        }

        .arco-statistic-content {
            display: flex;
            flex-direction: column;
            align-items: center;

            .arco-statistic-value-integer {
                font-size: 18px;
                color: var(--color-text-1);
                font-weight: 500;
                line-height: 1.3;
            }

            .arco-statistic-extra {
                margin-top: 2px;
                font-size: 11px;
                color: var(--color-text-3);
            }
        }
    }

    .item {
        height: 38px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s ease, color 0.2s ease;

        &:hover {
            background-color: var(--color-fill-2);
            color: var(--color-primary);
        }

        i.iconfont {
            margin-right: 12px;
            font-size: 16px;
        }
    }

    .menu {
        padding: 8px 0;
    }

    .exit {
        padding: 8px 0;
        border-top: 1px solid var(--color-border);

        .item:hover {
            color: rgb(var(--danger-6));
            background-color: rgba(var(--danger-6), 0.05);
        }
    }
}

:deep(.arco-trigger-popup) {
    transition: opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1), transform 0.3s cubic-bezier(0.23, 1, 0.32, 1) !important;
}

:deep(.arco-trigger-arrow) {
    background-color: var(--color-bg-1) !important;
    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.06) !important;
}

.login-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 20px;
    font-size: 14px;
    color: #fff;
    border-radius: 20px;
    background-color: rgb(var(--arcoblue-6));
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        background-color: rgb(var(--arcoblue-5));
        box-shadow: 0 2px 8px rgba(var(--arcoblue-6), 0.25);
    }
}
</style>
