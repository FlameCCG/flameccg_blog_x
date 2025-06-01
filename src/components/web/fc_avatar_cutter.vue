<template>
    <ImgCutter v-on:cutDown="cutDown" rate="1:1">
        <template #open>
            <slot></slot>
        </template>
    </ImgCutter>
</template>

<script lang="ts" setup>
import { imageUploadApi } from "@/api/image_api"
import { Message } from "@arco-design/web-vue"
import ImgCutter from 'vue-img-cutter'
const emits = defineEmits(['ok'])
async function cutDown(img: any) {
    try {
        const res = await imageUploadApi(img.file)
        console.log(res)
        Message.success(res.msg)
        emits('ok', res.data)
    } catch (error) {
        console.log(error)
    }
}
</script>

<style scoped></style>