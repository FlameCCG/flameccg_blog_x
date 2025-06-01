<template>
    <div class="qq_setting">
        <a-row>
            <a-col :span="7">
                <fc_site name="qq" v-slot="{ form }: { form: qqResponse }">
                    <fc_title>邮箱设置</fc_title>
                    <div class="body">
                        <a-form>
                            <a-form-item label="appID" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                                <a-input placeholder="请输入appID" v-model="form.appID"></a-input>
                                <template #help>
                                    <span class="help">详见<a href="https://connect.qq.com/">QQ互联开发者平台</a></span>
                                </template>
                            </a-form-item>
                            <a-form-item label="appKey" :label-col-props="{ span: 6 }"
                                :wrapper-col-props="{ span: 18 }">
                                <a-input placeholder="请输入appKey" v-model="form.appKey"></a-input>
                            </a-form-item>
                            <a-form-item label="回调地址" :label-col-props="{ span: 6 }" :wrapper-col-props="{ span: 18 }">
                                <a-input placeholder="请输入回调地址" v-model="form.redirect"></a-input>
                                <template #help>
                                    <span class="help">这个地址必须是你线上的地址</span>
                                </template>
                            </a-form-item>
                            <div class="site_update_btn"></div>
                        </a-form>
                    </div>
                </fc_site>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import Fc_site from '@/components/admin/site/fc_site.vue';
import Fc_title from '@/components/common/fc_title.vue';
import { type emailResponse, type qqResponse } from "@/api/site_api";
</script>

<style scoped lang="less">
.qq_setting {
    padding: 20px;
    background-color: var(--color-bg-1);
}
</style>