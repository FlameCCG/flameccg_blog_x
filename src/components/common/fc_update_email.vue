<template>
    <Modal :visible="props.visible" @cancel="cancel" :title="userCenterStore.userDetail.email ? '修改邮箱' : '绑定邮箱'"
        width="400px" :footer="false">
        <Form ref="formRef" :model="form" :rules="rules" label-width="100px" :label-col-props="{ span: 7 }"
            :wrapper-col-props="{ span: 14 }" v-if="emailState === 1">
            <FormItem :label="userCenterStore.userDetail.email ? '新邮箱' : '邮箱'" field="newEmail">
                <Input v-model="form.newEmail" type="text"
                    :placeholder="userCenterStore.userDetail.email ? '请输入新邮箱' : '请输入邮箱'" />
            </FormItem>
            <FormItem field="captchaCode" label="验证码" :label-col-props="{ span: 7 }" :wrapper-col-props="{ span: 14 }">
                <Input v-model="form.captchaCode" type="text" placeholder="请输入验证码">
                </Input>
                <img :src="captchaImage" alt="验证码" style="width: 100px; height: 30px; cursor: pointer;"
                    @click="reloadCaptcha" />
            </FormItem>
            <Button type="primary" :loading="sending" @click="handleOk(1)">验证邮箱</Button>
        </Form>
        <Form ref="formRef" :model="form" :rules="rules" label-width="100px" :label-col-props="{ span: 4 }"
            :wrapper-col-props="{ span: 20 }" v-if="emailState === 2">
            <FormItem label="邮箱验证码" field="code">
                <Input v-model="form.emailCode" type="text" placeholder="请输入邮箱验证码" />
            </FormItem>
            <Button type="primary" :loading="sending" @click="handleOk(2)">确定</Button>
        </Form>
    </Modal>
</template>

<script setup lang="ts">
import { Modal, Form, FormItem, Input, Message, Button } from '@arco-design/web-vue';
import { ref } from 'vue';

import { sendEmailApi, captchaApi, userEmailBindApi } from '@/api/user_api';
import { onMounted } from 'vue';
import { useUserCenterStore } from '@/stores/user_center_store';
const userCenterStore = useUserCenterStore();
interface Props {
    visible: boolean;
}
const props = defineProps<Props>();
const emits = defineEmits(['update:visible']);
const captchaImage = ref("");
// 1 修改邮箱的第一步 2 修改邮箱的第二步
const emailState = ref<1 | 2>(1)

const formRef = ref();
const form = ref({
    newEmail: '',
    captchaCode: '', // 验证码
    emailCode: '', // 邮箱验证码
});
const sending = ref<boolean>(false);

const rules = {

};
onMounted(() => {
    reloadCaptcha();
});

const reloadCaptcha = async () => {
    try {
        const res = await captchaApi();
        captchaImage.value = res.data.captchaB64;
        captchaID = res.data.captchaID;
        return res.data.captchaID;
    } catch (error) {
        console.error(error);
        // 如果API调用失败，可以设置一个占位图像
        captchaImage.value = "https://via.placeholder.com/120x40?text=验证码";
    }
}
let captchaID = "";
let emailID = "";
const handleOk = async (type: 1 | 2) => {
    if (type === 1) {
        const val = await formRef.value.validate();
        if (val) return
        try {
            const body = {
                captchaID,
                captchaCode: form.value.captchaCode,
                type: 3,
                email: form.value.newEmail
            }
            console.log(body)
            const res = await sendEmailApi(body)
            emailState.value = 2
            emailID = res.data.emailID;
            Message.success(res.msg);
        } catch (error) {
            console.log(error);
            reloadCaptcha()
        }
    } else if (type === 2) {
        const val = await formRef.value.validate();
        if (val) return
        try {
            const body = {
                captchaID: emailID,
                captchaCode: form.value.emailCode,
            }
            const res = await userEmailBindApi(body)
            cancel()
            Message.success(res.msg);
        } catch (error) {
            console.log(error);
            reloadCaptcha()
        }
    }
}

function cancel() {
    // 清空表单
    formRef.value.resetFields();
    emailState.value = 1
    reloadCaptcha()
    // 关闭弹窗
    emits('update:visible', false);
}
</script>

<style lang="less">
#fc_update_email_modal+div {
    img {
        cursor: pointer;
        margin-left: 10px;
    }
}
</style>
