<script lang="ts" setup>
import fc_web_card from "@/components/web/fc_web_card.vue";
import { useUserCenterStore } from "@/stores/user_center_store.ts";
import { userUpdateInfoApi, type UserUpdateInfoResqType } from "@/api/user_api.ts";
import { Message } from "@arco-design/web-vue";
const store = useUserCenterStore();
const userUpdateColumn = async (column: "openCollect" | "openFans" | "openFollow", value: boolean) => {
    try {
        console.log(column, value)
        let data: UserUpdateInfoResqType = {}
        value = value as boolean
        data[column] = value
        const res = await userUpdateInfoApi(data)
        Message.success(res.msg)
    } catch (error) {
    }
}
</script>

<template>
    <div class="user_center_privacy_view">
        <fc_web_card title="隐私设置">
            <a-form :label-col-props="{ span: 4 }" :label-align="'left'">
                <a-form-item label="公开我的收藏">
                    <a-switch v-model="store.userDetail.openCollect"
                        @click="userUpdateColumn('openCollect', store.userDetail.openCollect)"></a-switch>
                </a-form-item>

                <a-form-item label="公开我的关注列表">
                    <a-switch v-model="store.userDetail.openFollow"
                        @click="userUpdateColumn('openFollow', store.userDetail.openFollow)"></a-switch>
                </a-form-item>

                <a-form-item label="公开我的粉丝列表">
                    <a-switch v-model="store.userDetail.openFans"
                        @click="userUpdateColumn('openFans', store.userDetail.openFans)"></a-switch>
                </a-form-item>
            </a-form>
        </fc_web_card>
    </div>
</template>

<style scoped lang="less"></style>