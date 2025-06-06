<template>
    <base_msg :t="2" v-slot="{ item }: { item: mySiteMsgRes }" class="fc_msg_like_view" ref="baseMsgRef"
        @get-data="getData">
        <a-avatar :image-url="item.actionUserAvatar" @click="router.push('/user/' + item.actionUserID + '/article')"
            style="cursor: pointer;"></a-avatar>
        <div class="content">
            <div class="user">
                <span class="nick">{{ item.actionUserName }}</span>
                <fc_label v-if="item.relation !== 0 && item.relation !== 5" :options="relationOptions"
                    :value="item.relation"></fc_label>
                <span class="type">
                    <fc_label :options="siteMsgTypeOptions" :value="item.type"></fc_label>
                </span>
            </div>
            <div class="content_inner" :class="{ read: item.isRead }">
                <a-typography-text :ellipsis="{ rows: 2, css: true }">
                    {{ item.content }}
                </a-typography-text>
            </div>
            <div class="article">
                <RouterLink :to="{ name: 'article', params: { id: item.articleID } }"> {{ item.articleTitle }}
                </RouterLink>
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
import { useRoute } from 'vue-router';
const baseMsgRef = ref()
const getData = () => {
    baseMsgRef.value.getData()
}
const route = useRoute()

</script>

<style lang="less">
.fc_msg_like_view {
    .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid var(--color-border-2);
        background: var(--color-bg-1);
        transition: background 0.2s;
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

        .article {
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