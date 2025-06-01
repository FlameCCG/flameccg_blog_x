<template>
    <div class="ai_setting">
        <a-row>
            <a-col :span="8">
                <fc_site name="ai" v-slot="{ form }: { form: aiResponse }">
                    <fc_title>AI设置</fc_title>
                    <div class="body">
                        <a-form>
                            <a-form-item label="是否启用" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                                <a-switch v-model="form.enable"></a-switch>
                            </a-form-item>
                            <a-form-item label="chatGPTSecret" :label-col-props="{ span: 6 }"
                                :wrapper-col-props="{ span: 18 }">
                                <a-input placeholder="请输入chatGPTSecret" v-model="form.chatGPTSecret"></a-input>
                            </a-form-item>
                            <a-form-item label="deepSeekSecret" :label-col-props="{ span: 6 }"
                                :wrapper-col-props="{ span: 18 }">
                                <a-input placeholder="请输入deepSeekSecret" v-model="form.deepSeekSecret"></a-input>
                            </a-form-item>
                            <a-form-item label="ai昵称" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                                <a-input placeholder="请输入ai昵称" v-model="form.nickName"></a-input>
                            </a-form-item>
                            <a-form-item label="ai头像" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                                <Fc_image_upload v-model="form.avatar" placeholder="上传logo"></Fc_image_upload>
                            </a-form-item>
                            <a-form-item label="ai的介绍" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                                <a-textarea placeholder="请输入ai的prompts" v-model="form.abstract"></a-textarea>
                            </a-form-item>
                        </a-form>
                        <div class="site_update_btn"></div>
                    </div>
                </fc_site>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import Fc_site from '@/components/admin/site/fc_site.vue';
import Fc_title from '@/components/common/fc_title.vue';
import { type aiResponse, type emailResponse } from "@/api/site_api";
import Fc_image_upload from '@/components/common/fc_image_upload.vue';
import { onMounted } from 'vue';
onMounted(() => {
    const textarea = document.getElementsByClassName("arco-textarea")[0] as HTMLElement | undefined;
    if (textarea) {
        textarea.classList.add("scrollbar");
    }
});

</script>

<style scoped lang="less">
.email_setting {
    background-color: var(--color-bg-1);
    padding: 20px;
}
</style>