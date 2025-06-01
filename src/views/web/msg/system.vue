<template>
    <base_msg :t="3" v-slot="{ item }: { item: mySiteMsgRes }" class="fc_system_view" ref="baseMsgRef"
        @get-data="getData">
        <div class="content">
            <div class="content_inner" :class="{ read: item.isRead }">
                <a-typography-text :ellipsis="{ rows: 2, css: true }">
                    {{ item.content }}
                </a-typography-text>
            </div>
            <div class="link" v-if="item.linkTitle">
                <span>链接:</span><a :href="item.linkHref">{{ item.linkTitle }}</a>
            </div>
        </div>
    </base_msg>
</template>

<script setup lang="ts">
import Base_msg from '@/components/web/msg/base_msg.vue';
import { readSiteMsg, removeSiteMsg, type mySiteMsgRes } from '@/api/site_msg_api';
import { relationOptions, siteMsgTypeOptions } from '@/options/options';
import Fc_label from '@/components/common/fc_label.vue';
import { dateFormat } from '@/utils/date';
import type { baseResponse } from '@/api';
import { ref } from 'vue';
import { Message } from '@arco-design/web-vue';
import router from '@/router';
const baseMsgRef = ref()
const getData = () => {
    baseMsgRef.value.getData()
}
</script>

<style lang="less">
.fc_system_view {
    .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid var(--color-border-2);
    }

    .arco-avatar {
        flex-shrink: 0;
    }

    .content {
        width: calc(100% - 160px);

        .user {
            .nick {
                margin-right: 10px;
                color: var(--color-text-1);
            }
        }

        .content_inner {
            margin: 5px 0;
            color: var(--color-text-2);

            &.read {
                color: var(--color-text-4);
            }
        }

        .link {
            a {
                color: var(--color-link);

                &:hover {
                    color: rgb(var(--arcoblue-5));
                }
            }
        }
    }
}
</style>