<template>
    <a-dropdown @select="handleSelect" :popup-max-height="false">
        <div class="fc_user_dropdown">
            <a-avatar :imageUrl="userStore.userBaseInfo.avatar" size="large">
            </a-avatar>
            <span class="username">{{ userStore.userBaseInfo.username }}</span>
            <IconDown />
        </div>
        <template #content>
            <a-doption v-for="item in dropList" :value="item.name">{{ item.title }}</a-doption>
        </template>
    </a-dropdown>

</template>

<script setup lang="ts">
import router from '@/router';
import { useUserStore } from '@/stores/user_store';
import { ref, computed } from 'vue';
const userStore = useUserStore();


const handleSelect = (key: string) => {
    if (key === 'logout') {
        userStore.logout();
        return
    }
    router.push({ name: key });
};
interface DropDown {
    title: string;
    name: string;
}
const dropList = ref<DropDown[]>([{
    title: '个人中心',
    name: 'userInfo',
},
{
    title: '退出登录',
    name: 'logout',
}
]);

if (userStore.isAdmin) {
    dropList.value = [
        {
            title: '个人中心',
            name: 'userInfo',
        },
        {
            title: '用户列表',
            name: 'userList',
        },
        {
            title: '系统信息',
            name: 'websiteSetting',
        },
        {
            title: '退出登录',
            name: 'logout',
        }
    ];
}
</script>

<style scoped lang="less">
.fc_user_dropdown {
    display: flex;
    align-items: center;
    padding: 4px 8px;
    border-radius: 20px;
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
        background-color: var(--color-fill-2);
    }

    .arco-avatar {
        margin-right: 8px;
        border: 2px solid var(--color-border-2);
        transition: all 0.2s ease;
    }

    svg {
        color: var(--color-text-2);
        margin-left: 4px;
        transition: all 0.2s ease;
    }

    .username {
        color: var(--color-text-1);
        font-size: 14px;
        max-width: 100px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
@/stores/user_store