<template>
    <div class="email_setting">
        <a-row>
            <a-col :span="8">
                <fc_site name="email" v-slot="{ form }: { form: emailResponse }">
                    <fc_title>邮箱设置</fc_title>
                    <div class="body">
                        <a-alert type="info">配置邮箱之后，系统的邮箱注册功能才能正常使用</a-alert>
                        <a-form>
                            <a-form-item label="邮箱域名">
                                <a-input placeholder="邮箱域名" v-model="form.domain"></a-input>
                            </a-form-item>
                            <a-form-item label="邮箱端口">
                                <a-input-number placeholder="邮箱端口" v-model="form.port"></a-input-number>
                            </a-form-item>
                            <a-form-item label="发信邮箱">
                                <a-input placeholder="发信邮箱" v-model="form.sendEmail"></a-input>
                            </a-form-item>
                            <a-form-item label="授权码">
                                <a-input placeholder="授权码" v-model="form.authCode"></a-input>
                            </a-form-item>
                            <a-form-item label="发信名称">
                                <a-input placeholder="发信名称" v-model="form.sendNickName"></a-input>
                            </a-form-item>
                            <a-form-item label="ssl">
                                <a-switch v-model="form.ssl"></a-switch>
                            </a-form-item>
                            <a-form-item label="tls">
                                <a-switch v-model="form.tls"></a-switch>
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
import { type emailResponse } from "@/api/site_api";
</script>

<style scoped lang="less">
.email_setting {
    background-color: var(--color-bg-1);
    padding: 20px;
}
</style>