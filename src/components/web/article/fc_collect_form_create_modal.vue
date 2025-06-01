<template>
    <a-modal width="30%" :title="props.id ? '编辑收藏夹' : '创建收藏夹'" :visible="props.visible"
        :on-before-ok="addCategoryHandler" @cancel="cancel" body-class="scrollbar">
        <a-form ref="formRef" :model="formData" :label-col-props="{ span: 7 }" :wrapper-col-props="{ span: 17 }">
            <a-form-item label="收藏夹标题" field="title" validate-trigger="blur"
                :rules="[{ required: true, message: '请输入收藏夹标题' }]">
                <a-input v-model="formData.title" placeholder="请输入收藏夹标题"></a-input>
            </a-form-item>
            <a-form-item label="收藏夹简介" field="abstract">
                <a-textarea v-model="formData.abstract" placeholder="请输入收藏夹简介" :auto-size="{ minRows: 2, maxRows: 4 }">
                </a-textarea>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { collectCreateApi } from '@/api/collect_api';
import { Message } from '@arco-design/web-vue';
import { reactive, watch } from 'vue';

interface Props {
    id?: number;
    visible: boolean;
    title: string;
    abstract?: string;
}

const props = defineProps<Props>();
const emits = defineEmits(['update:visible', 'update:title', 'update:abstract', 'ok']);

const formData = reactive({
    title: '',
    abstract: ''
});

// 监听props变化，同步到本地表单数据
watch(() => props.visible, (newVal) => {
    if (newVal) {
        // 当模态框显示时，同步props到本地表单
        formData.title = props.title;
        formData.abstract = props.abstract || '';
    }
}, { immediate: true });

// 监听本地表单数据变化，同步到父组件
// watch(() => formData.title, (newVal) => {
//     emits('update:title', newVal);
// });

// watch(() => formData.abstract, (newVal) => {
//     emits('update:abstract', newVal);
// });

async function addCategoryHandler() {
    if (!formData.title.trim()) {
        Message.warning("请输入收藏夹标题");
        return false;
    }
    try {
        const res = await collectCreateApi({
            id: props.id || 0,
            title: formData.title,
            abstract: formData.abstract,
        });
        Message.success(res.msg);
        cancel();
        emits('ok');
        // return true;
    } catch (error) {
        // return false;
        console.log(error);
    }
}

function cancel() {
    // 关闭模态框
    emits('update:visible', false);

    // 清空本地表单数据
    formData.title = '';
    formData.abstract = '';

    // 同步到父组件
    emits('update:title', '');
    emits('update:abstract', '');
}
</script>

<style scoped></style>