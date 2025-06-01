<template>
    <fc_card title="更新日志" class="version">
        <div class="version_list">
            <div class="version_item" v-for="(item, index) in list">
                <div class="version_header">
                    <div class="version_num">{{ index + 1 }}.</div>
                    <div class="version_title">{{ item.title }}</div>
                    <div class="version_date">{{ formatDate(item.date, "relativeTime") }}</div>
                </div>
                <ul class="version_content" v-if="item.items?.length">
                    <li v-for="li in item.items">{{ li }}</li>
                </ul>
            </div>
        </div>
    </fc_card>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/date'
import Fc_card from './fc_card.vue'
interface versionType {
    title: string
    date: string
    items?: string[]
}

const list: versionType[] = [
    {
        title: "v2.3.0 正式发布：全新权限架构上线",
        date: "2025-04-12",
        items: [
            "支持基于资源路径+操作的精细化权限控制",
            "新增权限配置 UI，可视化配置角色权限",
            "权限缓存引入 Redis，提高访问效率",
            "超级管理员权限默认放开，可在线编辑"
        ]
    },
    {
        title: "v2.2.0 性能优化与异步任务调度中心",
        date: "2025-03-30",
        items: [
            "引入任务调度中心，支持 Cron 表达式和定时任务管理",
            "GORM 查询优化，平均接口响应时间降低 35%",
            "全局接口限流 + 并发控制",
            "分页查询默认开启缓存，缓存失效策略支持 LRU"
        ]
    },
    {
        title: "v1.9.0 支持多语言与国际化",
        date: "2025-02-10",
        items: [
            "新增中英文语言包，支持动态语言切换",
            "国际化文本管理界面上线，支持 JSON 编辑导入导出",
            "新增语言适配器 Hook，支持多语言内容注入"
        ]
    },
    {
        title: "v1.8.0 AI 模块试验性上线",
        date: "2025-01-25",
        items: [
            "接入 OpenAI GPT 接口，支持自然语言生成表单配置",
            "新增智能问答助手，支持后台常见问题解析",
            "AI 模块权限需单独授权，支持用量统计与计费模式"
        ]
    }
]

</script>

<style scoped lang="less">
.version {
    .version_list {
        padding: 16px;

        .version_item {
            padding: 8px 0;

            &:not(:last-child) {
                margin-bottom: 10px;
            }

            .version_header {
                display: flex;
                align-items: center;
                padding-bottom: 8px;

                .version_num {
                    margin-right: 6px;
                    font-weight: 600;
                }

                .version_title {
                    flex: 1;
                    font-weight: 500;
                }

                .version_date {
                    color: var(--color-text-3);
                    font-size: 14px;
                }
            }

            .version_content {
                margin: 0;
                padding-left: 26px;

                li {
                    position: relative;
                    padding: 4px 0;
                    color: var(--color-text-2);
                    font-size: 14px;
                    line-height: 1.4;

                    &::before {
                        content: '•';
                        position: absolute;
                        left: -12px;
                    }
                }
            }
        }
    }
}
</style>