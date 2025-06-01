<template>
    <div class="fc_image_upload">
        <a-input :model-value="props.modelValue" :placeholder="placeholder" @input="inputeHadler"></a-input>
        <a-upload action="/api/images" name="file" :headers="{ token: userStore.userBaseInfo.token }"
            @success="uploadSuccess" :show-file-list="false">
            <template #upload-button>
                <a-image :src="props.modelValue" :width="width" :height="height" preview="false"
                    :class="shape"></a-image>
            </template>
        </a-upload>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user_store';

const userStore = useUserStore();
interface Props {
    modelValue: string;
    placeholder?: string;
    shape?: string
    width?: number;
    height?: number;
}
const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);
// 解构props.placeholder默认值
const { placeholder = '请上传图片', shape = 'circle', width = 70, height = 70 } = props;
const inputeHadler = (e: string) => {
    emit('update:modelValue', e);
}
const uploadSuccess = (res: any) => {
    const imageUrl = res.response.data;
    emit('update:modelValue', imageUrl);
}
</script>

<style scoped lang="less">
.fc_image_upload {
    width: 100%;

    ::v-deep(.arco-upload-wrapper) {
        margin-top: 18px;
    }

    .arco-image {
        &.circle {
            border-radius: 50%;
        }
    }
}
</style>@/stores/user_store