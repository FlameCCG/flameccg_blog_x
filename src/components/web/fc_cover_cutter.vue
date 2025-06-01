<template>
    <ImgCutter v-on:cutDown="cutDown" rate="16:9">
        <template #open>
            <slot></slot>
        </template>
    </ImgCutter>
</template>

<script lang="ts" setup>
import { imageUploadApi } from "@/api/image_api"
import { qiNiuUploadConfig, type qiNiuUploadConfigRes } from "@/api/site_api"
import { useSiteStore } from "@/stores/site_store"
import { loadScript } from "@/utils/load"
import { Message } from "@arco-design/web-vue"
import ImgCutter from 'vue-img-cutter'
const emits = defineEmits(['ok'])
const siteStore = useSiteStore()
function upload(file: File, conf: qiNiuUploadConfigRes) {
    const token = conf.token
    const observer = {
        next: (res: any) => {
            console.log('next', res);
        },
        error: (err: any) => {
            console.error('error', err);
            if (err.code === 614) {
                emits('ok', conf.url)
            }
        },
        complete: (res: any) => {
            console.log('上传完成', res);
            emits('ok', conf.url)
        },
    };
    const config = {
        useCdnDomain: true,
        region: 'as0',
    };
    const key = conf.key
    const putExtra = {};
    const observable = qiniu.upload(file, conf.key, token, putExtra, config);
    const subscription = observable.subscribe(observer); // 上传开始
    console.log(subscription);
}
async function cutDown(img: any) {
    try {
        console.log(siteStore.siteInfo.qiNiu.enable)
        if (!siteStore.siteInfo.qiNiu.enable) {
            const res = await imageUploadApi(img.file)
            console.log(res)
            Message.success(res.msg)
            emits('ok', res.data)
            return
        }
        // 获取上传的配置
        const res = await qiNiuUploadConfig()
        loadScript("/public/js/qiNiu.min.js", () => {
            upload(img.file, res.data)
        })
        // upload(img.file, res.data)
        Message.success(res.msg)

    } catch (error) {
        console.log(error)
    }
}
</script>

<style scoped></style>