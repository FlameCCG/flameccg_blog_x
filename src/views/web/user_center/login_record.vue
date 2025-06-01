<template>
    <div class="user_center_login_record_view">
        <fc_web_card title="登录日志">
            <div class="tips">
                若发现异常登录，请尽快 <a-link href="javascript:void 0" @click="showUpdatePassword">修改密码</a-link>
            </div>

            <!-- 搜索筛选区域 -->
            <div class="search-area">
                <a-form :model="searchForm" layout="inline">
                    <a-form-item field="dateRange" label="登录时间">
                        <a-range-picker v-model="searchForm.dateRange" style="width: 320px" format="YYYY-MM-DD HH:mm:ss"
                            :show-time="{ format: 'HH:mm:ss' }" allow-clear />
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" @click="handleSearch" status="normal">
                            <template #icon><icon-search /></template>
                            查询
                        </a-button>
                        <a-button style="margin-left: 8px" @click="resetSearch" type="outline">
                            <template #icon><icon-refresh /></template>
                            重置
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>

            <div class="login_list">
                <a-spin :loading="loading">
                    <div class="item" v-for="(item, index) in loginList" :key="index">
                        <div class="time">{{ formatDate(item.createAt) }}</div>
                        <div class="info">
                            <div class="ip">IP: {{ item.ip }}</div>
                            <div class="addr">地址: {{ item.addr || '未知' }}</div>
                            <div class="device">设备: {{ getUserAgent(item.ua) }}</div>
                        </div>
                    </div>
                    <a-empty v-if="loginList.length === 0" description="暂无登录记录" />
                    <a-pagination v-if="loginList.length > 0" v-model:current="current" :total="total"
                        :page-size="pageSize" @change="changePage" simple class="pagination" />
                </a-spin>
            </div>
        </fc_web_card>
    </div>
</template>

<script setup lang="ts">
import { showUpdatePassword } from '@/components/common/fc_update_password';
import Fc_web_card from '@/components/web/fc_web_card.vue';
import { userLoginListApi, type UserLoginListRespType, type loginListResqType } from '@/api/user_api';
import { onMounted, ref, reactive } from 'vue';
import dayjs from 'dayjs';
import { IconSearch, IconRefresh } from '@arco-design/web-vue/es/icon';
import { UAParser } from 'ua-parser-js';
const loginList = ref<UserLoginListRespType[]>([]);
const total = ref(0);
const current = ref(1);
const pageSize = ref(10);
const loading = ref(false);

// 搜索表单
const searchForm = reactive({
    dateRange: [] as any[]
});

const formatDate = (date: string) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

const getUserAgent = (ua: string) => {
    if (!ua) return '未知设备';

    const parser = new UAParser(ua);
    const result = parser.getResult();

    let deviceInfo = '';

    // Device type
    if (result.device && result.device.type) {
        deviceInfo += `${result.device.type} `;
    }

    // OS
    if (result.os.name) {
        deviceInfo += `${result.os.name}`;
        if (result.os.version) {
            deviceInfo += ` ${result.os.version}`;
        }
    }

    // Browser
    if (result.browser.name) {
        if (deviceInfo) deviceInfo += ' / ';
        deviceInfo += `${result.browser.name}`;
        if (result.browser.version) {
            deviceInfo += ` ${result.browser.version}`;
        }
    }

    // Fallback if we couldn't parse anything
    if (!deviceInfo) {
        if (ua.includes('iPhone') || ua.includes('iPad')) {
            return 'iOS设备';
        } else if (ua.includes('Android')) {
            return '安卓设备';
        } else if (ua.includes('Windows')) {
            return 'Windows设备';
        } else if (ua.includes('Mac')) {
            return 'Mac设备';
        } else {
            return '其他设备';
        }
    }

    return deviceInfo || '未知设备';
};

// 构建请求参数
const buildParams = (): loginListResqType => {
    const params: loginListResqType = {
        page: current.value,
        pageSize: pageSize.value,
        type: 1,
    };

    // 添加时间筛选 - 使用后端要求的格式
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
        params.startTime = dayjs(searchForm.dateRange[0]).format('YYYY-MM-DD HH:mm:ss');
        params.endTime = dayjs(searchForm.dateRange[1]).format('YYYY-MM-DD HH:mm:ss');
    }

    return params;
};

const getLoginList = async () => {
    try {
        loading.value = true;
        const params = buildParams();
        const res = await userLoginListApi(params);

        if (res.data && res.data.list) {
            loginList.value = res.data.list;
            total.value = res.data.count;
        }
    } catch (error) {
        console.error('获取登录记录失败:', error);
    } finally {
        loading.value = false;
    }
};

const changePage = (page: number) => {
    current.value = page;
    getLoginList();
};

// 查询按钮事件
const handleSearch = () => {
    current.value = 1; // 重置到第一页
    getLoginList();
};

// 重置按钮事件
const resetSearch = () => {
    searchForm.dateRange = [];
    current.value = 1;
    getLoginList();
};

onMounted(() => {
    getLoginList();
});
</script>

<style lang="less">
.user_center_login_record_view {
    width: 100%;

    .tips {
        margin-bottom: 16px;
        color: var(--color-text-3);
    }

    .search-area {
        margin-bottom: 20px;
        padding: 20px;
        background-color: var(--color-fill-2);
        border-radius: var(--border-radius-medium);
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);

        .arco-btn {}
    }

    .login_list {
        width: 100%;
        border-radius: var(--border-radius-medium);
        overflow: hidden;
        background: var(--color-bg-2);
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.06);
        display: flex;
        align-items: center;

        .arco-spin {
            width: 100%;

            .item {
                padding: 18px 24px;
                border-bottom: 1px solid var(--color-border-2);
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 40px;
                transition: background-color 0.3s;

                &:hover {
                    background-color: var(--color-fill-1);
                }

                &:last-child {
                    border-bottom: none;
                }

                .time {
                    font-weight: 600;
                    color: var(--color-text-1);
                    min-width: 180px;
                }

                .info {
                    display: flex;
                    gap: 40px;
                    color: var(--color-text-2);
                    flex-wrap: wrap;

                    .ip,
                    .addr,
                    .device {
                        display: flex;
                        align-items: center;

                        &::before {
                            content: '';
                            display: inline-block;
                            width: 6px;
                            height: 6px;
                            border-radius: 50%;
                            background-color: var(--color-primary-light-4);
                            margin-right: 8px;
                        }
                    }
                }
            }
        }


        .pagination {
            margin-top: 20px;
            padding: 16px 0;
            display: flex;
            justify-content: center;
            width: 100%;
            border-top: 1px solid var(--color-border-2);
        }
    }
}
</style>