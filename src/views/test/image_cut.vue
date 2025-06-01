<template>
    <ImgCutter v-on:cutDown="cutDown"></ImgCutter>
</template>

<script setup lang="ts">
import { imageUploadApi } from "@/api/image_api"
import { Message } from "@arco-design/web-vue"
import ImgCutter from 'vue-img-cutter'
async function cutDown(img: any) {
    const res = await imageUploadApi(img.file)
    console.log(res)
    Message.success(res.msg)

}
</script>

<style scoped></style>