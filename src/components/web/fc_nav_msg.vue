<template>
    <template v-if="isLogin">
        <fc_point :count="userStore.noReadMsgAllCount">
            <a-dropdown @select="select">
                <a href="javascript:void(0);">消息</a>
                <template #content>
                    <a-doption value="msgComment">
                        <fc_point :count="userStore.noReadMsgInfo.commentMsgCount">评论和@</fc_point>
                    </a-doption>
                    <a-doption value="msgLike">
                        <a-badge :count="userStore.noReadMsgInfo.likeMsgCount" dot
                            :dot-style="{ width: '5px', height: '5px' }">
                            赞和收藏
                        </a-badge>
                    </a-doption>
                    <a-doption value="msgChat">
                        <a-badge :count="userStore.noReadMsgInfo.privateMsgCount" dot
                            :dot-style="{ width: '5px', height: '5px' }">
                            私信
                        </a-badge>
                    </a-doption>
                    <a-doption value="msgSystem">
                        <fc_point :count="userStore.noReadMsgInfo.systemMsgCount">系统通知</fc_point>
                    </a-doption>
                </template>
            </a-dropdown>
        </fc_point>
    </template>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user_store';
import fc_point from '../common/fc_point.vue';
import { watch } from 'vue';
import { ref } from 'vue';
import router from '@/router';

const select = (key: string) => {
    console.log(key)
    router.push({ name: key })
}
const userStore = useUserStore();
const isLogin = ref<boolean>(false)
isLogin.value = userStore.isLogin;
if (userStore.isLogin) {
    userStore.noReadMsg();
}
watch(() => userStore.isLogin, () => {
    if (!userStore.isLogin) {
        isLogin.value = false;
    }
});
</script>

<style scoped></style>