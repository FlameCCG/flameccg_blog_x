<script setup lang="ts">
import fc_web_card from "@/components/web/fc_web_card.vue";
import { showUpdateEmailModal } from "@/components/common/fc_update_email";
import { showUpdatePassword } from "@/components/common/fc_update_password";
import { useUserCenterStore } from "@/stores/user_center_store";
import { reactive } from "vue";
import { useRouter } from "vue-router";
const userCenterStore = useUserCenterStore();
const form = reactive({})
const router = useRouter();
</script>

<template>
    <div class="user_center_account_view">
        <fc_web_card title="账户设置">
            <div class="body">
                <a-form :label-col-props="{ span: 2 }" :model="form">
                    <a-form-item label="密码">
                        <span v-if="userCenterStore.userDetail.usePassword" class="password">
                            ****** <a-link href="javascript:void(0)" @click="showUpdatePassword">修改密码</a-link>
                        </span>
                        <span v-else>
                            未启用密码
                        </span>
                    </a-form-item>

                    <a-form-item label="邮箱">
                        <a-link href="javascript:void(0)" @click="showUpdateEmailModal">{{
                            userCenterStore.userDetail.email
                                === '' ? '绑定邮箱' : "修改邮箱"
                        }}</a-link>
                    </a-form-item>

                    <a-form-item label="登录记录">
                        <a-link href="javascript:void(0)"
                            @click="router.push({ name: 'userLoginRecord' })">查看记录</a-link>
                    </a-form-item>
                </a-form>
            </div>
        </fc_web_card>
    </div>
</template>

<style lang="less">
.user_center_account_view {
    background: var(--color-bg-1);
    border-radius: 5px;
    color: var(--color-text-1);

    .body {
        .password {
            margin-left: 4.5px;
        }

        .arco-row {
            margin-bottom: 10px;
        }
    }
}
</style>