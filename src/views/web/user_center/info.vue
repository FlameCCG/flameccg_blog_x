<template>
    <div class="user_center_info_view">
        <div class="top">
            <div class="avatar">
                <Fc_avatar_cutter @ok="userUpdateColumn('avatar', $event)"
                    v-if="userCenterStore.userDetail.registerSource !== 2">
                    <div class="avatar-innter" @mouseenter="isHover = true" @mouseleave="isHover = false">
                        <IconCamera v-if="isHover"></IconCamera>
                        <a-avatar :size="64" :image-url="userCenterStore.userDetail.avatar">{{
                            userCenterStore.userDetail.username[0]
                        }}</a-avatar>
                    </div>
                </Fc_avatar_cutter>
                <a-avatar :size="64" :image-url="userCenterStore.userDetail.avatar"
                    v-if="userCenterStore.userDetail.registerSource === 2">{{
                        userCenterStore.userDetail.username[0]
                    }}</a-avatar>
            </div>
            <div class="info">
                <div class="title">{{ userCenterStore.userDetail.nickname }}</div>
                <div class="code-age">
                    <a-tag color="blue">码龄 {{ userCenterStore.userDetail.codeAge }} 年</a-tag>
                </div>
            </div>
        </div>
        <div class="base-info">
            <div class="head">基本信息</div>
            <div class="body">
                <a-form :label-col-props="{ span: 2 }" :wrapper-col-props="{ span: 22 }" label-align="left"
                    :model="userCenterStore.userDetail">
                    <a-form-item label="用户昵称">
                        <Fc_edit_input :value="userCenterStore.userDetail.nickname" placeholder="用户昵称"
                            :no-edit="userCenterStore.userDetail.registerSource === 2"
                            @ok="userUpdateColumn('nickname', $event)">
                        </Fc_edit_input>
                    </a-form-item>
                    <a-form-item label="用户名">
                        <fc_edit_input :value="userCenterStore.userDetail.username" placeholder="用户名"
                            :no-edit="!isUpdateUsername(userCenterStore.userDetail.updateUsernameDate)"
                            @ok="userUpdateColumn('username', $event)"></fc_edit_input>
                        <template #help>
                            <span>登录的唯一标识，30天内可以修改一次</span>
                        </template>
                    </a-form-item>
                    <a-form-item label="简介">
                        <Fc_edit_input :value="userCenterStore.userDetail.abstract" placeholder="用户简介" type="textarea"
                            @ok="userUpdateColumn('abstract', $event)">
                        </Fc_edit_input>
                    </a-form-item>
                    <a-form-item label="注册时间">{{ dateFormat(userCenterStore.userDetail.createdAt) }}</a-form-item>
                    <a-form-item label="注册来源">
                        <Fc_label :options="registerSourceOptions" :value="userCenterStore.userDetail.registerSource">
                        </Fc_label>
                    </a-form-item>
                </a-form>

            </div>
        </div>
        <div class="tags">
            <div class="head">
                <div class="title">兴趣标签</div>
                <div class="abs">请您选择感兴趣的技术标签，帮助作者找到您感兴趣的内容。</div>
            </div>
            <div class="body">
                <div>
                    <Fc_tags_input :value="userCenterStore.userDetail.likeTags" @ok="editTag($event)">
                    </Fc_tags_input>
                </div>
                <div>
                    <a-button type="primary" size="small"
                        @click="updateTag(userCenterStore.userDetail.likeTags)">更新</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Fc_label from '@/components/common/fc_label.vue';
import { useUserCenterStore } from '@/stores/user_center_store';
import { dateFormat } from '@/utils/date';
import { registerSourceOptions } from '@/options/options';
import Fc_edit_input from '@/components/common/input/fc_edit_input.vue';
import type { UserUpdateInfoResqType } from '@/api/user_api';
import { userUpdateInfoApi } from '@/api/user_api';
import { Message } from '@arco-design/web-vue';
import Fc_avatar_cutter from '@/components/web/fc_avatar_cutter.vue';
import { IconCamera } from '@arco-design/web-vue/es/icon';
import { ref } from 'vue';
import Fc_tags_input from '@/components/common/input/fc_tags_input.vue';
const userCenterStore = useUserCenterStore();
const userUpdateColumn = async (column: "username" | "nickname" | "avatar" | "abstract" | "likeTags", value: string | string[]) => {
    try {
        let data: UserUpdateInfoResqType = {}
        if (column === "likeTags") {
            value = value as string[]
            data[column] = value
        } else {
            value = value as string
            data[column] = value
        }
        console.log(data)
        const res = await userUpdateInfoApi(data)
        Message.success(res.msg)
        userCenterStore.getUserDetail()
    } catch (error) {
        console.log(error)
    }
}
const isHover = ref(false)
const isUpdateUsername = (updateTime?: string): boolean => {
    if (!updateTime) {
        return true
    }
    const t1 = new Date(updateTime)
    const t2 = new Date()
    // 得到相差的天数
    const subDays = Math.abs(t2.getTime() - t1.getTime()) / (24 * 3600 * 1000)
    if (subDays > 30) {
        return true
    }
    return false
}
const tags = ref<string[]>([]);
const updateTag = (oldTags?: string[]) => {
    console.log(oldTags, tags.value)
    if (JSON.stringify(oldTags) === JSON.stringify(tags.value)) {
        return
    }
    userUpdateColumn("likeTags", tags.value)
}
const editTag = (val: string[]) => {
    console.log(val)
    tags.value = val
    console.log(tags.value)
}

</script>

<style lang="less" scoped>
.user_center_info_view {
    >div {
        background-color: var(--color-bg-1);
        border-radius: 5px;
    }

    .top {
        margin-bottom: 20px;
        display: flex;
        padding: 20px;
        align-items: center;

        .avatar {
            width: 80px;

            .avatar-innter {
                position: relative;
                width: 64px;
                cursor: pointer;

                &:hover svg {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 2;
                    color: white;
                    font-size: 20px;
                }
            }
        }

        .info {
            display: flex;
            justify-content: center;
            flex-direction: column;

            .title {
                font-size: 18px;
                color: var(--color-text-1);
                margin-bottom: 10px;
            }
        }
    }

    .base-info {
        margin-bottom: 20px;

        .head {
            padding: 20px 20px 10px 20px;
            border-bottom: @fc_border;
            font-weight: 600;
            color: var(--color-text-1);
        }

        .body {
            padding: 10px 20px 20px 20px;
            color: var(--color-text-2);

            .arco-form {}
        }
    }

    .tags {
        .head {
            padding: 20px 20px 10px 20px;
            border-bottom: @fc_border;
            display: flex;
            align-items: center;

            .title {
                font-weight: 600;
                color: var(--color-text-1);
            }
        }

        .abs {
            margin-left: 10px;
            color: var(--color-text-2);
        }
    }

    .body {
        padding: 10px 20px 20px 20px;

        .abstract {
            // margin-right: 10px;
            cursor: pointer;
        }
    }
}
</style>