<template>
    <div class="user_center_view">
        <Fc_nav></Fc_nav>
        <fc_main>
            <div class="fc_menu">
                <router-link :to="{ name: 'userInfo' }">个人资料</router-link>
                <router-link :to="{ name: 'userAccount' }">账号设置</router-link>
                <router-link :to="{ name: 'userPrivacy' }">隐私设置</router-link>
                <router-link :to="{ name: 'userHomeSetting' }">主页设置</router-link>
                <router-link :to="{ name: 'userBrowseHistory' }">浏览历史</router-link>
            </div>
            <div class="fc_view">
                <router-view />
            </div>
        </fc_main>
    </div>
</template>

<script lang="ts" setup>
import Fc_nav from "@/components/web/fc_nav.vue";
import Fc_main from "@/components/web/fc_main.vue";
import Fc_footer from "@/components/web/fc_footer.vue";
import { useUserCenterStore } from "@/stores/user_center_store";
const userCenterStore = useUserCenterStore();
userCenterStore.getUserDetail();
</script>

<style lang="less">
.user_center_view {
    overflow: hidden;

    .user_style_1 {
        background-image: url("/src/assets/images/miku.png");
        background-size: cover;
        background-position: center;
    }

    .user_style_2 {
        background-image: url("/src/assets/images/日系.png");
        background-size: cover;
        background-position: center;
    }

    .user_style_3 {
        background-image: url("/src/assets/images/星系.png");
        background-size: cover;
        background-position: center;
    }

    .user_style_4 {

        // animation: subtleFloat 12s infinite ease-in-out;
        // transition: transform 0.5s ease-out;
    }


    // .user_style_4:hover {
    //     transform: scale(1.02) translateY(-4px) rotate(0.5deg);
    // }

    // @keyframes subtleFloat {

    //     0%,
    //     100% {
    //         transform: translateY(0px) rotate(-0.5deg);
    //     }

    //     50% {
    //         transform: translateY(-8px) rotate(0.5deg);
    //     }
    // }


    .fc_menu {
        width: 180px;
        background: var(--color-bg-1);
        border-radius: 5px;
        min-height: 400px;
        max-height: 750px;
        // display: flex;
        // flex-direction: column;
        padding: 20px 0;

        a {
            height: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-decoration: none;
            color: var(--color-text-2);
        }

        a:hover {
            background: var(--color-fill-1);
        }

        a.router-link-active {
            background-color: var(--color-fill-1);
            color: rgb(var(--arcoblue-6));
        }
    }

    .fc_view {
        width: calc(100% - 200px);
    }
}
</style>