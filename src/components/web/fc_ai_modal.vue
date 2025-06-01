<template>
    <a-modal title="文章助手" @before-open="handleBeforeOpen" modal-class="fc_ai_modal"
        :class="{ 'theme-dark': theme === 'dark', 'theme-light': theme === 'light' }" body-class="scrollbar"
        :visible="visible" @cancel="handleCancel" :footer="false">
        <div class="ai-chat-container">
            <!-- 对话区域 -->
            <div class="chat-body">
                <div class="chat-item" v-for="item in chatList" :class="{ 'is-me': item.isMe }">
                    <div class="avatar-wrapper">
                        <a-avatar :image-url="item.avatar" :size="40"></a-avatar>
                        <div class="status-indicator" v-if="!item.isMe"></div>
                    </div>
                    <div class="message-wrapper">
                        <div class="message-info" v-if="!item.isMe">
                            <span class="nickname">{{ item.nickname }}</span>
                            <span class="timestamp">刚刚</span>
                        </div>
                        <div class="message-bubble" :class="{ 'user-message': item.isMe, 'ai-message': !item.isMe }">
                            <div class="message-content" v-if="!item.isMe" v-html="item.content"></div>
                            <div class="message-content" v-else>{{ item.content }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 输入区域 -->
            <div class="chat-input">
                <div class="input-wrapper">
                    <a-textarea :auto-size="{ minRows: 1, maxRows: 4 }" placeholder="请输入你感兴趣的内容..." v-model="key"
                        @keydown.enter="send" ref="textareaRef" class="message-input" :bordered="false">
                    </a-textarea>
                    <div class="input-actions">
                        <a-button type="primary" @click="send" :disabled="!key.trim()" size="small">
                            <template #icon>
                                <icon-send />
                            </template>
                        </a-button>
                    </div>
                </div>
                <div class="input-tips">
                    <span class="tip-text">按 Enter 发送，按 Shift + Enter 换行</span>
                </div>
            </div>
        </div>
    </a-modal>
</template>
<script setup lang="ts">
import type { baseResponse, listResponse, paramsType } from '@/api';
import { aiInfoApi, type aiInfoApiRes } from '@/api/ai_api';
import { fullTextSearchApi, type fullTextSearchRes } from '@/api/search_api';
import { useUserStore } from '@/stores/user_store';
import { nextTick, onMounted, reactive, ref } from 'vue';
import { showLogin } from './fc_login';
import { IconSend } from '@arco-design/web-vue/es/icon';
import { theme } from '../common/fc_theme';
const store = useUserStore()
const goArticleDeatil = (item: fullTextSearchRes) => {
    window.open(`/article/${item.articleID}?id=${item.head}`, "_blank")
}
const key = ref('');
interface Props {
    visible: boolean;
}

const chatList = ref<chatRes[]>()
nextTick(() => {
    const textarea = document.querySelector(".arco-textarea") as HTMLTextAreaElement;
    if (textarea) {
        textarea.classList.add("scrollbar");
    }
});
const send = () => {
    if (!store.isLogin) {
        showLogin()
        return;
    }

    if (!key.value.trim()) return;

    chatList.value?.push({
        isMe: true,
        nickname: store.userBaseInfo.username,
        avatar: store.userBaseInfo.avatar,
        content: key.value,
    })

    const item = reactive<chatRes>({
        isMe: false,
        nickname: aiData.value.nickname,
        avatar: aiData.value.avatar,
        content: "",
    })

    const eventSource = new EventSource(`/api/ai/article_ai?content=${key.value}&token=${store.userBaseInfo.token}`);
    eventSource.onmessage = (e) => {
        const message = JSON.parse(e.data) as baseResponse<string>;
        item.content += message.data;
    };
    eventSource.onerror = (e) => {
        console.log(e);
        eventSource.close();
        return;
    };
    eventSource.addEventListener("close", function (e) {
        console.log(e);
    });

    chatList.value?.push(item)
    key.value = ''
}

const aiData = ref<chatRes>({
    isMe: false,
    nickname: "",
    avatar: "",
    content: "",
})

interface chatRes {
    isMe: boolean
    nickname: string
    avatar: string
    content: string
}

const textareaRef = ref();
const props = defineProps<Props>();
const emit = defineEmits(['update:visible']);

const data = reactive<aiInfoApiRes>({
    enable: false,
    nickname: '',
    avatar: '',
    abstract: '',
});

const isSearch = ref(false)

const handleCancel = () => {
    emit('update:visible', false)
}

const handleBeforeOpen = async () => {
    chatList.value = []
    const res = await aiInfoApi()
    Object.assign(aiData.value, res.data)
    nextTick(() => {
        textareaRef.value?.focus()
    })
    const item = reactive<chatRes>({
        isMe: false,
        nickname: res.data.nickname,
        avatar: res.data.avatar,
        content: "",
    })
    chatList.value.push(item)
    const list = res.data.abstract.split("")
    for (let i = 0; i < list.length; i++) {
        setTimeout(() => {
            item.content += list[i]
        }, i * 40)
    }
}
</script>

<style lang="less">
// 基础样式
.fc_ai_modal {
    .arco-modal {
        border-radius: 12px;
        overflow: hidden;
    }

    .arco-modal-header {
        border-bottom: 1px solid var(--color-border-2);
        padding: 16px 24px;

        .arco-modal-title {
            font-weight: 600;
            font-size: 16px;
        }

        .arco-modal-close-btn {
            opacity: 0.8;
            transition: opacity 0.2s;

            &:hover {
                opacity: 1;
            }
        }
    }

    .arco-modal-body {
        padding: 0;
    }

    .ai-chat-container {
        display: flex;
        flex-direction: column;
        height: 70vh;
        max-height: 600px;
        min-height: 400px;
    }

    .chat-body {
        flex: 1;
        padding: 20px;
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-track {
            border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 3px;
        }
    }

    .chat-item {
        display: flex;
        margin-bottom: 24px;
        animation: slideIn 0.3s ease-out;

        &.is-me {
            flex-direction: row-reverse;

            .avatar-wrapper {
                margin-left: 12px;
                margin-right: 0;
            }

            .message-wrapper {
                align-items: flex-end;
            }

            .message-info {
                text-align: right;
            }
        }
    }

    .avatar-wrapper {
        position: relative;
        margin-right: 12px;
        flex-shrink: 0;

        .arco-avatar {
            border: 2px solid var(--color-border-1);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .status-indicator {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: var(--color-success-6);
            border: 2px solid var(--color-bg-1);
            animation: pulse 2s infinite;
        }
    }

    .message-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .message-info {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        gap: 8px;

        .nickname {
            font-size: 12px;
            font-weight: 500;
        }

        .timestamp {
            font-size: 11px;
        }
    }

    .message-bubble {
        position: relative;
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 16px;
        word-wrap: break-word;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);

        &.ai-message {
            border-bottom-left-radius: 6px;
            border: 1px solid var(--color-border-1);
        }

        &.user-message {
            color: var(--color-white);
            border-bottom-right-radius: 6px;
            margin-left: auto;
        }
    }

    .message-content {
        line-height: 1.6;
        font-size: 14px;

        a {
            color: rgb(var(--arcoblue-6));
        }

        * {
            max-width: 100%;
        }
    }

    .chat-input {
        border-top: 1px solid var(--color-border-2);
        padding: 16px 20px;

        .input-wrapper {
            display: flex;
            align-items: flex-end;
            gap: 12px;
            border: 1px solid var(--color-border-2);
            border-radius: 12px;
            padding: 12px 16px;
            transition: all 0.2s;

            &:hover {
                border-color: var(--color-border-3);
            }

            &:focus-within {
                border-color: var(--color-primary);
                box-shadow: 0 0 0 2px var(--color-primary-light-1);
            }
        }

        .message-input {
            flex: 1;

            .arco-textarea {
                background: transparent;
                resize: none;
                font-size: 14px;
                line-height: 1.5;

                &::placeholder {
                    color: var(--color-text-3);
                }

                &:focus {
                    box-shadow: none;
                }
            }
        }

        .input-actions {
            display: flex;
            align-items: center;

            .arco-btn {
                border-radius: 8px;
                font-weight: 500;
                transition: all 0.2s;

                &:not(:disabled):hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(var(--primary-6), 0.3);
                }

                &:disabled {
                    opacity: 0.5;
                }
            }
        }

        .input-tips {
            margin-top: 8px;
            text-align: center;

            .tip-text {
                font-size: 12px;
                padding: 4px 12px;
                border-radius: 12px;
                display: inline-block;
            }
        }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(var(--success-6), 0.7);
        }

        70% {
            box-shadow: 0 0 0 6px rgba(var(--success-6), 0);
        }

        100% {
            box-shadow: 0 0 0 0 rgba(var(--success-6), 0);
        }
    }
}

// **白天模式样式**
.theme-light {
    .fc_ai_modal {
        .arco-modal-header {
            background: linear-gradient(135deg, #e3f2fd 0%, #2196f3 100%);

            .arco-modal-title {
                color: #ffffff;
            }

            .arco-modal-close-btn {
                color: #ffffff;

                &:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }
            }
        }

        .arco-modal-body {
            background-color: #f5f7fa;
        }

        .chat-body {
            background: linear-gradient(to bottom, #ffffff, #f0f2f5);

            &::-webkit-scrollbar-track {
                background: #e8ebf0;
            }

            &::-webkit-scrollbar-thumb {
                background: #c5cad3;

                &:hover {
                    background: #a8b0bd;
                }
            }
        }

        .avatar-wrapper {
            .arco-avatar {
                border-color: #e0e3e8;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }

            .status-indicator {
                background: #52c41a;
                border-color: #ffffff;
                box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.2);
            }
        }

        .message-info {
            .nickname {
                color: #303133;
            }

            .timestamp {
                color: #909399;
            }
        }

        .message-bubble {
            &.ai-message {
                background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
                color: #303133;
                border-color: #e4e7ed;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
            }

            &.user-message {
                background: linear-gradient(135deg, #409eff 0%, #2080f0 100%);
                box-shadow: 0 4px 16px rgba(64, 158, 255, 0.3);
            }
        }

        .chat-input {
            background: #ffffff;
            border-top-color: #ebeef5;
            box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.03);

            .input-wrapper {
                background: #f8fbff;
                border-color: #dcdfe6;

                &:hover {
                    background: #f0f7ff;
                    border-color: #c0c4cc;
                }

                &:focus-within {
                    background: #ffffff;
                    border-color: #409eff;
                    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
                }
            }

            .tip-text {
                color: #909399;
                background: #f4f4f5;
            }
        }
    }
}

// **黑夜模式样式**
.theme-dark {
    .fc_ai_modal {
        .arco-modal-header {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-bottom-color: #2a2d3a;

            .arco-modal-title {
                color: #f0f0f0;
            }

            .arco-modal-close-btn {
                color: #b8bcc3;

                &:hover {
                    background-color: rgba(255, 255, 255, 0.05);
                    color: #ffffff;
                }
            }
        }

        .arco-modal-body {
            background-color: #0f1419;
        }

        .chat-body {
            background: linear-gradient(to bottom, #1a1f29, #0f1419);

            &::-webkit-scrollbar-track {
                background: #1a1f29;
            }

            &::-webkit-scrollbar-thumb {
                background: #2d3541;

                &:hover {
                    background: #3a424f;
                }
            }
        }

        .avatar-wrapper {
            .arco-avatar {
                border-color: #2d3541;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            }

            .status-indicator {
                background: #00d66b;
                border-color: #0f1419;
                box-shadow: 0 0 8px rgba(0, 214, 107, 0.6);
            }
        }

        .message-info {
            .nickname {
                color: #e0e0e0;
            }

            .timestamp {
                color: #707a88;
            }
        }

        .message-bubble {
            &.ai-message {
                background: linear-gradient(135deg, #1e2732 0%, #252d3a 100%);
                color: #e0e0e0;
                border-color: #2d3541;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            }

            &.user-message {
                background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
                box-shadow: 0 4px 20px rgba(30, 136, 229, 0.4);
            }
        }

        .chat-input {
            background: #0f1419;
            border-top-color: #1a1f29;
            box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.4);

            .input-wrapper {
                background: #1a1f29;
                border-color: #2d3541;

                &:hover {
                    background: #1e2732;
                    border-color: #3a424f;
                }

                &:focus-within {
                    background: #1e2732;
                    border-color: #1e88e5;
                    box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.3);
                }
            }

            .message-input {
                .arco-textarea {
                    color: #e0e0e0;

                    &::placeholder {
                        color: #707a88;
                    }
                }
            }

            .tip-text {
                color: #707a88;
                background: #1a1f29;
            }
        }

        // 黑夜模式特殊效果
        .status-indicator {
            animation: pulse-dark 2s infinite;
        }

        @keyframes pulse-dark {
            0% {
                box-shadow: 0 0 0 0 rgba(0, 214, 107, 0.7);
            }

            70% {
                box-shadow: 0 0 0 10px rgba(0, 214, 107, 0);
            }

            100% {
                box-shadow: 0 0 0 0 rgba(0, 214, 107, 0);
            }
        }
    }
}
</style>
