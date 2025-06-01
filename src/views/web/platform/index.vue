<template>
    <div class="platform_view">
        <Fc_nav></Fc_nav>
        <fc_main>
            <div class="fc_menu">
                <router-link :to="{ name: 'platformArticle' }">文章管理</router-link>
                <router-link :to="{ name: 'platformComment' }">评论管理</router-link>
            </div>
            <div class="fc_view scrollbar">
                <router-view />
            </div>
        </fc_main>
    </div>
</template>

<script setup lang="ts">
import Fc_nav from "@/components/web/fc_nav.vue";
import Fc_main from "@/components/web/fc_main.vue";
import Fc_footer from "@/components/web/fc_footer.vue";
import { useUserCenterStore } from "@/stores/user_center_store";
import { useSiteStore } from "@/stores/site_store";
const userCenterStore = useUserCenterStore();
userCenterStore.getUserDetail();
const siteStore = useSiteStore();
siteStore.getSiteInfo();
</script>

<style lang="less">
.platform_view {
    .fc_menu {
        width: 180px;
        background: var(--color-bg-1);
        border-radius: 5px;
        min-height: 400px;
        display: flex;
        flex-direction: column;
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
        max-height: calc(100vh - 140px);
        padding: 10px;
        background-color: var(--color-bg-1);
        overflow-y: auto;
    }
}
</style>