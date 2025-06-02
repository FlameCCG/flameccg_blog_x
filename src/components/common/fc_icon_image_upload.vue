<template>
    <div class="fc_image_upload">
        <a-upload action="/api/images" name="file" :headers="{ token: userStore.userBaseInfo.token }"
            @success="uploadSuccess" :show-file-list="false">
            <template #upload-button>
                <IconImage></IconImage>
            </template>
        </a-upload>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user_store';
import { IconImage } from '@arco-design/web-vue/es/icon';
const userStore = useUserStore();
const emit = defineEmits(['ok']);
const uploadSuccess = (res: any) => {
    const imageUrl = res.response.data;
    emit('ok', imageUrl);
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