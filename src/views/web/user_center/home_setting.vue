<template>
    <div class="user_center_home_setting_view">
        <fc_web_card title="主页设置">
            <a-form :label-col-props="{ span: 4 }" :label-align="'left'" :model="userCenterStore.userDetail">
                <a-form-item label="主页样式" class="home_style_item">
                    <a-radio-group v-model="userCenterStore.userDetail.homeStyleID">
                        <a-radio :value="1">
                            <img src="/src/assets/images/miku.png" alt="主页样式4">
                            <div class="text">二次元</div>
                        </a-radio>
                        <a-radio :value="2">
                            <img src="/src/assets/images/日系.png" alt="主页样式2">
                            <div class="text">日系</div>
                        </a-radio>

                        <a-radio :value="3">
                            <img src="/src/assets/images/星系.png" alt="主页样式3">
                            <div class="text">星系</div>
                        </a-radio>
                    </a-radio-group>
                </a-form-item>
            </a-form>
            <a-button type="primary" @click="userUpdateColumn">更新</a-button>
        </fc_web_card>
    </div>
</template>

<script setup lang="ts">
import { userUpdateInfoApi } from "@/api/user_api";
import fc_web_card from "@/components/web/fc_web_card.vue";
import { useUserCenterStore } from "@/stores/user_center_store";
import { Message } from "@arco-design/web-vue";
const userCenterStore = useUserCenterStore();
const userUpdateColumn = async () => {
    try {
        const data = {
            homeStyleID: userCenterStore.userDetail.homeStyleID,
        };
        const res = await userUpdateInfoApi(data);
        Message.success(res.msg);
    } catch (error) {
    }
};
</script>

<style lang="less">
.user_center_home_setting_view {
    .arco-form {
        .home_style_item {
            flex-direction: column;
        }

        .arco-radio-group {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            grid-row-gap: 20px;
            grid-column-gap: 20px;
        }

        .arco-radio {
            width: 100%;
            border: @fc_border;
            border-radius: 5px;
            display: flex;
            flex-direction: column-reverse;
            justify-content: center;
            align-items: center;
            padding: 10px;

            .arco-radio-label {
                img {
                    width: 100%;
                    object-fit: cover;
                    object-position: center;
                }

                .text {
                    text-align: center;
                    margin-bottom: 10px;
                    color: var(--color-text-2);
                }
            }
        }
    }
}
</style>