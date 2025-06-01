<template>
    <div class="fc_site">
        <slot :form="data"></slot>
        <Teleport to=".site_update_btn" v-if="isShow">
            <a-button type="primary" @click="update">更新</a-button>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { siteApi, siteUpdate, type siteName } from "@/api/site_api";
import { Message } from "@arco-design/web-vue";
import { reactive, Teleport, ref } from "vue";

interface Props {
    name: siteName
}
const props = defineProps<Props>()
const data = reactive<any>({})
const isShow = ref(false)
async function getData() {
    try {
        const res = await siteApi(props.name)
        Object.assign(data, res.data)
    } catch (error) {
        console.log(error)
    }
    isShow.value = true
}
getData()
async function update() {
    try {
        const res = await siteUpdate(props.name, data)
        Object.assign(data, res.data)
        Message.success("更新成功")
    } catch (error) {
        console.log(error)
    }
}
</script>

<style scoped lang="less">
::v-deep(.body) {
    margin-top: 20px;

    .arco-form {
        margin-top: 20px;

        .help {
            color: var(--color-text-1);

            a {
                color: var(--color-link-light-4);
                text-decoration: none;
                cursor: pointer;
            }
        }
    }
}
</style>