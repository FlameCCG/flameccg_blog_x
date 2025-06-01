<template>
    <div class="qiNiuSetting">
        <a-row>
            <a-col :span="10">
                <fc_site name="qiNiu" v-slot="{ form }: { form: qiNiuResponse }">
                    <fc_title>对象存储设置设置</fc_title>
                    <div class="body">
                        <a-form>
                            <a-form-item label="是否启用" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                                <a-switch v-model="form.enable"></a-switch>
                            </a-form-item>
                            <a-form-item label="accessKey" :label-col-props="{ span: 6 }"
                                :wrapper-col-props="{ span: 18 }">
                                <a-input placeholder="请输入accessKey" v-model="form.accessKey"></a-input>
                            </a-form-item>
                            <a-form-item label="secretKey" :label-col-props="{ span: 6 }"
                                :wrapper-col-props="{ span: 18 }">
                                <a-input placeholder="请输入secretKey" v-model="form.secretKey"></a-input>
                            </a-form-item>
                            <a-form-item label="存储桶" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                                <a-input placeholder="请输入存储桶" v-model="form.bucket"></a-input>
                            </a-form-item>
                            <a-form-item label="访问uri" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                                <a-input placeholder="请输入访问uri" v-model="form.uri"></a-input>
                                <template #help>
                                    <span class="help">一般是你的协议加你的域名如: https://flameccg.com</span>
                                </template>
                            </a-form-item>
                            <a-form-item label="地区" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                                <a-input placeholder="请输入地区" v-model="form.region"></a-input>
                            </a-form-item>
                            <a-form-item label="上传目录" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                                <a-input placeholder="请输入上传目录" v-model="form.prefix"></a-input>
                            </a-form-item>
                            <a-form-item label="大小限制" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                                <a-input-number placeholder="请输入大小限制" v-model="form.maxSize">
                                    <template #append>单位MB</template>
                                </a-input-number>
                            </a-form-item>
                            <a-form-item label="过期时间" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                                <a-input-number placeholder="请输入过期时间" v-model="form.expire">
                                </a-input-number>
                                <template #help><span class="help">用于生成客户端上传凭证的过期时间，单位小时</span></template>
                            </a-form-item>
                        </a-form>
                        <div class=" site_update_btn">
                        </div>
                    </div>
                </fc_site>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import Fc_site from '@/components/admin/site/fc_site.vue';
import Fc_title from '@/components/common/fc_title.vue';
import { type qiNiuResponse } from "@/api/site_api";
</script>

<style scoped lang="less">
.qiNiuSetting {
    background-color: var(--color-bg-1);
    padding: 20px;
}
</style>