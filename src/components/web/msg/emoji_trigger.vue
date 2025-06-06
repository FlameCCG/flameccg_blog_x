<template>
    <a-trigger trigger="click" position="top" :unmount-on-close="false" v-model:popupVisible="visible"
        popup-container="body">
        <span class="emoji-trigger">
            <IconFaceSmileFill />
        </span>

        <template #content>
            <div class="emoji-picker">
                <a-tabs :default-active-key="1" position="top" class="emoji-tabs">
                    <a-tab-pane :key="1" title="😊 默认表情">
                        <div class="emoji-grid" @click="emojiClick">
                            <span v-for="(emoji, idx) in emojis" :key="idx" class="emoji-item" :title="emoji">
                                {{ emoji }}
                            </span>
                        </div>
                    </a-tab-pane>

                    <a-tab-pane :key="2" title="🎭 表情包">
                        <div class="image-grid" @click="emojiClick">
                            <div class="image-item" v-for="(item, idx) in imageList" :key="idx">
                                <img :src="item" :alt="`表情包${idx + 1}`" loading="lazy">
                            </div>
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </template>
    </a-trigger>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false);

const emits = defineEmits<{
    (event: 'select', type: string, value: string): void;
}>();

const emojiClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // 处理emoji点击
    if (target.classList.contains('emoji-item')) {
        emits('select', 'emoji', target.innerText);
        visible.value = false;
        return;
    }

    // 处理图片点击
    if (target.tagName === 'IMG') {
        emits('select', 'img', (target as HTMLImageElement).src);
        visible.value = false;
        return;
    }

    if (target.classList.contains('image-item') && target.tagName === 'DIV') {
        const img = target.querySelector('img') as HTMLImageElement;
        if (img) {
            emits('select', 'img', img.src);
            visible.value = false;
        }
    }
};

const imageList = ref<string[]>([]);

const initImages = () => {
    const files: Record<string, { default: string }> = import.meta.glob('@/assets/images/二次元表情包/*.png', { eager: true });

    for (const key in files) {
        const path = files[key].default;
        imageList.value.push(new URL(path, import.meta.url).href);
    }
};

initImages();

const emojis = ref<string[]>([
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍',
    '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢',
    '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱',
    '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
    '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹',
    '😻', '😼', '😽', '🙀', '😿', '😾'
]);
</script>

<style lang="less" scoped>
.emoji-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--color-text-2);

    &:hover {
        background-color: var(--color-fill-2);
        color: var(--color-text-1);
    }
}

.emoji-picker {
    background: var(--color-bg-popup);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    border: 1px solid var(--color-border-2);
    width: 320px;
    max-height: 380px;
    overflow: hidden;

    .emoji-tabs {
        :deep(.arco-tabs-nav) {
            padding: 0 16px;
            margin: 0;
            border-bottom: 1px solid var(--color-border-2);

            .arco-tabs-tab {
                padding: 12px 16px;
                margin: 0 4px;
                border-radius: 8px 8px 0 0;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.2s ease;

                &:hover {
                    background-color: var(--color-fill-1);
                }

                &.arco-tabs-tab-active {
                    color: var(--color-text-1)
                }
            }
        }
    }
}

.emoji-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
    max-height: 280px;
    overflow-y: auto;
    padding: 4px;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--color-fill-3);
        border-radius: 2px;

        &:hover {
            background: var(--color-fill-4);
        }
    }

    .emoji-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        font-size: 20px;
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.15s ease;
        user-select: none;

        &:hover {
            background-color: var(--color-primary-light-1);
            transform: scale(1.1);
        }

        &:active {
            transform: scale(0.95);
        }
    }
}

.image-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
    max-height: 280px;
    overflow-y: auto;
    padding: 4px;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--color-fill-3);
        border-radius: 2px;

        &:hover {
            background: var(--color-fill-4);
        }
    }

    .image-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        background: var(--color-fill-1);
        overflow: hidden;

        &:hover {
            background: var(--color-primary-light-1);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &:active {
            transform: translateY(0);
        }

        img {
            width: 36px;
            height: 36px;
            object-fit: cover;
            border-radius: 4px;
            transition: transform 0.2s ease;
        }

        &:hover img {
            transform: scale(1.05);
        }
    }
}

// 响应式设计
@media (max-width: 480px) {
    .emoji-picker {
        width: 280px;
        max-height: 320px;
    }

    .emoji-grid {
        grid-template-columns: repeat(7, 1fr);
        max-height: 220px;
    }

    .image-grid {
        grid-template-columns: repeat(4, 1fr);
        max-height: 220px;

        .image-item {
            width: 44px;
            height: 44px;

            img {
                width: 32px;
                height: 32px;
            }
        }
    }
}
</style>