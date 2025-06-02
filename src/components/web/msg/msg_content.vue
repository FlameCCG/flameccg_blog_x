<template>
    <div class="fc_msg_content_com" :class="`msg_${msgType}`">
        <template v-if="msgType === 1">
            {{ props.msg.textMsg?.content }}
        </template>
        <template v-if="msgType === 2">
            <a-image :src="props.msg.imageMsg?.src" alt="图片消息"></a-image>
        </template>
        <template v-if="msgType === 3">
            <MdPreview :content="props.msg.markdownMsg?.content"></MdPreview>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { msgType } from '@/api/chat_api';
import { MdPreview } from 'md-editor-v3';
import { computed } from 'vue';

interface Props {
    msg: msgType
}

const props = defineProps<Props>()

const msgType = computed(() => {
    if (props.msg.textMsg) {
        return 1
    }
    if (props.msg.imageMsg) {
        return 2
    }
    if (props.msg.markdownMsg) {
        return 3
    }
    return 0
})

</script>

<style lang="less">
.fc_msg_content_com {
    &.msg_1 {
        white-space: break-spaces;
        word-break: break-all;
    }

    &.msg_2 {
        .arco-image {
            max-width: 200px;

            img {
                width: 100%;
            }
        }
    }
}
</style>