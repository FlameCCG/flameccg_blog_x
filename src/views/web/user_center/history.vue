<script setup lang="ts">
import type { listResponse } from '@/api';
import type { articleHistoryListRequest, articleLookListResp } from '@/api/article_api';
import { articleLookListApi, articleLookDeleteApi } from '@/api/article_api';
import Fc_user from '@/components/common/fc_user.vue';
import fc_card from "@/components/web/fc_web_card.vue"
import router from '@/router';
import { dateFormat } from '@/utils/date';
import { Message, Modal } from '@arco-design/web-vue';
import { number } from 'echarts';
import { reactive, ref } from 'vue';
import { goArticle } from "@/utils/go_router"

// 历史记录请求参数
const params = reactive<articleHistoryListRequest>({
    type: 1,
    page: 1,
    pageSize: 10
})

// 历史记录数据类型定义
interface historyType {
    date: string
    articleList: articleLookListResp[]
}

// 历史记录数据
const data = reactive<listResponse<historyType>>({
    list: [],
    count: 0
})

// 是否处于批量管理模式
const batchMode = ref(false);

// 用于存储选中的记录ID
const selectedIds = ref<number[]>([]);

// 切换批量管理模式
const toggleBatchMode = () => {
    batchMode.value = !batchMode.value;
    // 进入批量管理模式时，确保选中状态初始化
    if (batchMode.value) {
        selectedIds.value = [];
    } else {
        // 退出批量管理模式时清空选中项
        selectedIds.value = [];
    }
}

// 清空历史记录确认弹窗
const showClearHistoryModal = () => {
    Modal.warning({
        title: '清空历史记录',
        content: '确定要清空全部历史记录吗？清空后无法恢复。',
        okText: '确定清空',
        cancelText: '取消',
        onOk: () => clearAllHistory()
    })
}

// 清空全部历史记录
const clearAllHistory = async () => {
    try {
        // 收集所有记录的ID
        const allIds: number[] = [];
        data.list.forEach(dateGroup => {
            dateGroup.articleList.forEach(item => {
                allIds.push(item.id);
            });
        });

        if (allIds.length === 0) {
            Message.info('暂无历史记录可清空');
            return;
        }

        // 调用删除API删除所有记录
        const res = await articleLookDeleteApi(allIds);
        Message.success(res.msg);
        getData(); // 重新获取数据（此时应为空）
    } catch (error) {
        Message.error('清空历史记录失败');
        console.error(error);
    }
}

// 单个删除
const deleteHistoryItem = async (item: articleLookListResp) => {
    try {
        const res = await articleLookDeleteApi([item.id])
        Message.success(res.msg)
        getData()
    } catch (error) {
        Message.error('删除失败')
    }
}

// 批量删除
const batchDelete = async () => {
    if (selectedIds.value.length === 0) {
        Message.warning('请先选择要删除的记录')
        return
    }

    Modal.warning({
        title: '批量删除',
        content: `确定要删除选中的${selectedIds.value.length}条记录吗？`,
        okText: '确定删除',
        cancelText: '取消',
        onOk: async () => {
            try {
                const res = await articleLookDeleteApi(selectedIds.value)
                Message.success(`成功删除${selectedIds.value.length}条记录`)
                selectedIds.value = [] // 清空选中项
                getData()
            } catch (error) {
                Message.error('批量删除失败')
            }
        }
    })
}

// 全选/取消全选
const toggleSelectAll = (checked: boolean) => {
    if (checked) {
        // 全选：收集所有记录的ID
        selectedIds.value = []
        data.list.forEach(dateGroup => {
            dateGroup.articleList.forEach(item => {
                selectedIds.value.push(item.id)
            })
        })
    } else {
        // 取消全选
        selectedIds.value = []
    }
}

// 检查是否全部选中
const isAllSelected = (): boolean => {
    // 如果没有选中任何项目，返回false
    if (selectedIds.value.length === 0) {
        return false;
    }

    // 只要选中了至少一个项目，就返回true
    return selectedIds.value.length > 0;
}

// 选择/取消选择单个项目
const toggleSelectItem = (id: number) => {
    const index = selectedIds.value.indexOf(id)
    if (index > -1) {
        selectedIds.value.splice(index, 1) // 如果已选中，则取消选择
    } else {
        selectedIds.value.push(id) // 如果未选中，则选择
    }

    // 触发全选检查的更新
    isAllSelected();
}

// 检查项目是否被选中
const isSelected = (id: number): boolean => {
    return selectedIds.value.includes(id)
}

// 获取所有已选择的比例
const getSelectedRatio = (): string => {
    let totalItems = 0;
    data.list.forEach(dateGroup => {
        totalItems += dateGroup.articleList.length;
    });

    if (totalItems === 0) return '0/0';
    return `${selectedIds.value.length}/${totalItems}`;
}

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 页码改变
const handlePageChange = (page: number) => {
    currentPage.value = page;
    params.page = page;
    getData();
    // 切换页面时清空选中状态
    selectedIds.value = [];
}

// 每页条数改变
const handlePageSizeChange = (size: number) => {
    pageSize.value = size;
    params.pageSize = size;
    currentPage.value = 1;
    params.page = 1;
    getData();
    // 切换每页条数时清空选中状态
    selectedIds.value = [];
}

// 获取数据
const getData = async () => {
    try {
        // 清空之前的列表数据
        data.list = [];

        const res = await articleLookListApi(params)
        data.count = res.data.count
        total.value = res.data.count
        const dateMap: Record<string, articleLookListResp[]> = {}
        for (const item of res.data.list) {
            const date = dateFormat(item.lookDate)
            const d = dateMap[date]
            if (d) {
                dateMap[date].push(item)
            } else {
                dateMap[date] = [item]
            }
        }
        for (const key in dateMap) {
            const value = dateMap[key]
            data.list.push({
                date: key,
                articleList: value
            })
        }
        data.list.sort((a, b) => {
            const ad = new Date(a.date).valueOf()
            const bd = new Date(b.date).valueOf()
            return bd - ad
        })
    } catch (error) {
        console.log(error)
        Message.error('获取历史记录失败')
    }
}
getData()

</script>

<template>
    <div class="user_center_history_view">
        <fc_card title="足迹">
            <!-- 顶部工具栏 -->
            <div class="history-header">
                <!-- 正常模式工具栏 -->
                <div v-if="!batchMode" class="header-normal">
                    <div class="left-actions">
                        <a-button type="secondary" @click="toggleBatchMode">
                            <template #icon><icon-edit /></template>
                            批量管理
                        </a-button>
                    </div>
                    <div class="right-actions">
                        <a-button type="secondary" status="danger" @click="showClearHistoryModal">
                            <template #icon><icon-delete /></template>
                            清空历史
                        </a-button>
                    </div>
                </div>

                <!-- 批量管理模式工具栏 -->
                <div v-else class="header-batch">
                    <div class="left-actions">
                        <a-checkbox @change="toggleSelectAll" :model-value="isAllSelected()">
                            全选 ({{ getSelectedRatio() }})
                        </a-checkbox>
                    </div>
                    <div class="right-actions">
                        <a-button type="outline" status="danger" @click="batchDelete"
                            :disabled="selectedIds.length === 0">
                            <template #icon><icon-delete /></template>
                            删除
                        </a-button>
                        <a-button type="text" @click="toggleBatchMode">取消</a-button>
                    </div>
                </div>
            </div>

            <!-- 无数据时提示 -->
            <div v-if="data.list.length === 0" class="empty-history">
                <a-empty description="暂无历史足迹">
                    <template #image>
                        <icon-history style="font-size: 48px; color: var(--color-text-3);" />
                    </template>
                </a-empty>
            </div>

            <!-- 历史记录列表 -->
            <a-timeline v-else>
                <a-timeline-item lineType="dashed" v-for="date in data.list" :key="date.date">
                    {{ date.date }}
                    <template #label>
                        <div class="article_list">
                            <div class="item" v-for="item in date.articleList" :key="item.id"
                                @click="!batchMode ? goArticle(item.articleID) : undefined">
                                <!-- 批量管理模式下显示的复选框 -->
                                <div class="select-box" v-if="batchMode" @click.stop>
                                    <a-checkbox :model-value="isSelected(item.id)" @change="toggleSelectItem(item.id)"
                                        class="item-checkbox"></a-checkbox>
                                </div>

                                <div class="cover">
                                    <img v-if="item.cover" :src="item.cover" alt="封面" />
                                    <div v-else class="no-cover">
                                        <icon-file-image />
                                    </div>
                                </div>

                                <div class="info">
                                    <div class="title" :class="{ 'title-with-checkbox': batchMode }">
                                        {{ item.title }}
                                    </div>
                                    <div class="user">
                                        <fc_user :nick-name="item.nickname" :avatar="item.avatar" :size="30"></fc_user>
                                    </div>
                                </div>

                                <!-- 非批量管理模式下显示的删除按钮 -->
                                <div class="action" v-if="!batchMode">
                                    <a-button type="secondary" size="mini" shape="circle"
                                        @click.stop="deleteHistoryItem(item)">
                                        <template #icon><icon-delete /></template>
                                    </a-button>
                                </div>
                            </div>
                        </div>
                    </template>
                </a-timeline-item>
            </a-timeline>

            <!-- 分页 -->
            <div class="pagination-container" v-if="data.list.length > 0">
                <a-pagination v-model:current="currentPage" v-model:page-size="pageSize" :total="total" show-total
                    show-jumper show-page-size @change="handlePageChange" @page-size-change="handlePageSizeChange" />
            </div>
        </fc_card>
    </div>
</template>

<style lang="less">
.user_center_history_view {
    .fc_card_com {
        .body {
            max-height: 700px;
            overflow: auto;
        }
    }

    .pagination-container {
        display: flex;
        justify-content: center;
        margin-top: 20px;
        padding: 10px 0;
    }

    .history-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 0 10px;

        .header-normal,
        .header-batch {
            display: flex;
            justify-content: space-between;
            width: 100%;
            align-items: center;
            margin-top: 10px;
        }

        .left-actions,
        .right-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    }

    .empty-history {
        padding: 40px 0;
        display: flex;
        justify-content: center;
    }

    .article_list {
        .item {
            display: flex;
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
            margin-bottom: 10px;
            border: 1px solid transparent;

            &:hover {
                background-color: var(--color-fill-2);
                border-color: var(--color-border-2);

                .action {
                    opacity: 1;
                }
            }

            .select-box {
                display: flex;
                align-items: center;
                margin-right: 12px;
                z-index: 1;

                .item-checkbox {
                    transform: scale(1.2);
                }
            }

            .cover {
                width: 100px;
                height: 65px;
                border-radius: 6px;
                overflow: hidden;
                margin-right: 15px;
                background-color: var(--color-fill-2);
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .no-cover {
                    color: var(--color-text-3);
                    font-size: 24px;
                }
            }

            .action {
                transition: all 0.3s ease;
                opacity: 0;
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
            }

            .info {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                flex: 1;

                .title {
                    font-size: 16px;
                    color: var(--color-text-1);
                    font-weight: 500;
                    margin-bottom: 8px;
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                }
            }
        }
    }
}
</style>