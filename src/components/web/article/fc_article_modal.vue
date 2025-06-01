<template>
    <a-modal body-class="collect_modal_body scrollbar" :title="title" @before-open="beforeOpen" :visible="props.visible"
        :footer="false" @cancel="handleCancel">
        <Fc_collect_form_create_modal v-model:title="createTitle" v-model:visible="collectVisible" @ok="beforeOpen">
        </Fc_collect_form_create_modal>
        <div class="add" @click="addModal">
            <i class="iconfont icon-chuangjianshoucangjia"></i>
            <span>创建收藏夹</span>
        </div>
        <div class="list">
            <div class="item" v-for="item in data.list">
                <div class="left">
                    <div class="title">{{ item.title }}
                        <a-tag color="blue" v-if="item.isDefault">默认收藏夹</a-tag>
                    </div>
                    <div class="count">{{ item.collectCount }}篇文章</div>
                </div>
                <a-button type="primary" size="mini" class="collect-btn" @click="select(item)"
                    :status="item.articleUse ? 'danger' : 'success'">{{ item.articleUse ?
                        '取消收藏' : '收藏' }}</a-button>
            </div>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import type { listResponse } from '@/api';
import { collectListApi, type collectListReq, type collectRes } from '@/api/collect_api';
import { Message, Modal } from '@arco-design/web-vue';
import { nextTick, reactive, ref } from 'vue';
import Fc_collect_form_create_modal from './fc_collect_form_create_modal.vue';
import { Model } from 'echarts';
import { useUserStore } from '@/stores/user_store';
import { showLogin } from '../fc_login';
import Fc_login_modal from '@/components/common/fc_login_modal.vue';

const collectVisible = ref();
const addModal = () => {
    collectVisible.value = true;
}
const createTitle = ref('');
const select = (item: collectRes) => {
    emits('select', item.id)
    handleCancel();
}

interface Props {
    visible: boolean;
    title?: string;
    articleID: number;
}
const props = defineProps<Props>();
const { title = "收藏文章" } = props
const emits = defineEmits(['update:visible', "select"])
function handleCancel() {
    emits('update:visible', false)
}
const data = reactive<listResponse<collectRes>>({
    list: [],
    count: 0
})
const userStore = useUserStore()

async function beforeOpen() {
    data.list = []
    data.count = 0
    const res = await collectListApi({ type: 1, articleID: props.articleID })

    Object.assign(data, res.data)
    if (data.list.length === 0) {
        data.list.push({
            id: 0,
            createAt: '',
            updateAt: '',
            title: '',
            abstract: '',
            cover: '',
            isDefault: true,
            UserID: userStore.userBaseInfo.userID,
            collectCount: 0,
            articleUse: false,
        })
    }
}
nextTick(() => {
    const arcoModal = document.querySelector('.arco-modal-body') as HTMLElement
    arcoModal.classList.add('scrollbar')
})
</script>

<style lang="less">
.collect_modal_body {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;

    .add {
        display: flex;
        align-items: center;
        padding: 14px 16px;
        background-color: var(--color-fill-2);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 16px;

        &:hover {
            background-color: var(--color-fill-3);
        }

        .iconfont {
            margin-right: 8px;
            font-size: 18px;
            color: var(--color-primary-light-1);
        }

        span {
            font-size: 14px;
            font-weight: 500;
            color: var(--color-text-1);
        }
    }

    .list {
        width: 100%;

        .item {
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            padding: 16px 5px;
            border-bottom: 1px solid var(--color-neutral-3);
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
                background-color: var(--color-fill-1);
            }

            .left {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .arco-btn {
                color: var(--color-text-1);

                &:hover {
                    background-color: rgb(var(--arcoblue-3)) !important;
                }
            }

            .title {
                font-size: 16px;
                font-weight: 500;
                color: var(--color-text-1);
            }

            .count {
                font-size: 13px;
                color: var(--color-text-3);
            }

            .collect-btn {
                border-radius: 20px;
                font-weight: 500;
                padding: 0 16px;
                height: 32px;
                background-color: var(--color-primary-6);
                border-color: var(--color-primary-6);
                box-shadow: 0 2px 6px rgba(var(--primary-6-rgb), 0.2);

                &:hover {
                    background-color: var(--color-primary-7);
                    border-color: var(--color-primary-7);
                    box-shadow: 0 4px 8px rgba(var(--primary-6-rgb), 0.3);
                }
            }
        }
    }
}

// 为模态框整体添加样式
.arco-modal {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

    .arco-modal-body {
        padding: 20px !important;
        padding-right: 15px !important;
    }


    .arco-modal-header {
        padding: 16px 20px;
        border-bottom: 1px solid var(--color-neutral-3);

        .arco-modal-title {
            font-weight: 500;
            font-size: 16px;
            color: var(--color-text-1);
        }
    }

    .arco-modal-close-btn {
        top: 14px;
        right: 16px;

        &:hover {
            background-color: var(--color-fill-2);
        }
    }
}
</style>