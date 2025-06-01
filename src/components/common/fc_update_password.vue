<template>
    <Modal :visible="props.visible" @cancel="cancel" title="修改密码" width="400px" @before-ok="handleOk">
        <Form ref="formRef" :model="form" :rules="rules" label-width="100px" :label-col-props="{ span: 7 }"
            :wrapper-col-props="{ span: 15 }">
            <FormItem label="旧密码" field="oldPassword">
                <Input v-model="form.oldPassword" type="password" placeholder="请输入旧密码" />
            </FormItem>
            <FormItem label="新密码" field="newPassword">
                <Input v-model="form.newPassword" type="password" placeholder="请输入新密码" />
            </FormItem>
            <FormItem label="确认新密码" field="confirmNewPassword">
                <Input v-model="form.confirmNewPassword" type="password" placeholder="请再次输入新密码" />
            </FormItem>
        </Form>
    </Modal>
</template>

<script setup lang="ts">
import { userUpdatePwdApi } from '@/api/user_api';
import { Modal, Form, FormItem, Input, Message } from '@arco-design/web-vue';
import { ref } from 'vue';

interface Props {
    visible: boolean;
}
const props = defineProps<Props>();
const emits = defineEmits(['update:visible']);

const formRef = ref();
const form = ref({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
});

const rules = {
    oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' },
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6位', trigger: 'blur' },
    ],
    confirmNewPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少6位', trigger: 'blur' },
        {
            validator: (value: string, callback: (error?: string) => void) => {
                if (value !== form.value.newPassword) {
                    callback('两次密码输入不一致');
                } else {
                    callback();
                }
            },
            trigger: 'blur',
        },
    ],
};
const handleOk = async () => {
    const val = await formRef.value.validate();
    if (val) return
    try {
        const body = {
            oldPassword: form.value.oldPassword,
            newPassword: form.value.newPassword,
        }
        const res = await userUpdatePwdApi(body);
        Message.success(res.msg);
        cancel()
    } catch (error) {
        console.log(error);
    }
}

function cancel() {
    // 清空表单
    formRef.value.resetFields();
    // 关闭弹窗
    emits('update:visible', false);
}
</script>

<style lang="less"></style>
