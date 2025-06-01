<template>
    <div class="fc-footer">
        <div class="footer_inner">
            <div class="footer_left">
                <div class="version">
                    <span>version</span>
                    <span>{{ version }}</span>
                </div>
                <div class="date">建站日期：2023-02-15 网站已运行: {{ runningTime }}</div>
                <div class="beian">
                    <Icon icon="material-symbols:shield" />
                    <a href="http://www.beian.miit.gov.cn">备案号：湘ICP备2021010654号-3</a>
                </div>
            </div>
            <div class="footer_right">
                <div class="social-icons">
                    <a href="#" title="哔哩哔哩" target="_blank">
                        <Icon icon="simple-icons:bilibili" />
                    </a>
                    <a href="#" title="Gitee" target="_blank">
                        <Icon icon="simple-icons:gitee" />
                    </a>
                    <a href="#" title="GitHub" target="_blank" :class="{ 'github-icon': theme === 'light' }">
                        <Icon icon="mdi:github" />
                    </a>
                    <a href="#" title="博客" target="_blank">
                        <Icon icon="material-symbols:rss-feed" />
                    </a>
                    <a href="#" title="微信" target="_blank">
                        <Icon icon="simple-icons:wechat" />
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { watch } from 'vue';
import { theme } from '../common/fc_theme';

const version = ref('9.0.1');
const runningTime = ref('');

// 计算网站运行时间
const calculateRunningTime = () => {
    const startDate = new Date('2023-02-15');
    const now = new Date();
    const diff = now.getTime() - startDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    runningTime.value = `${days}天${hours}时${minutes}分${seconds}秒`;
};

let timer: number;
onMounted(() => {
    calculateRunningTime();
    timer = window.setInterval(calculateRunningTime, 1000);
});

onUnmounted(() => {
    clearInterval(timer);
});
</script>

<style scoped lang="less">
.fc-footer {
    background-color: @primary;
    height: 200px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .footer_inner {
        display: flex;
        justify-content: center;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        gap: 100px;

        .footer_left {
            display: flex;
            flex-direction: column;
            justify-content: center;

            .version {
                display: flex;
                margin-bottom: 15px;

                span {
                    color: var(--color-text-2);
                    height: 40px;
                    padding: 8px;
                    text-align: center;
                    background-color: var(--color-primary-light-4);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 5px 0 0 5px;
                    min-width: 63px;
                }

                span:last-child {
                    background-color: var(--color-neutral-3);
                    border-radius: 0 5px 5px 0;
                    min-width: 53px;
                }
            }

            .date {
                color: var(--color-text-2);
                margin-bottom: 10px;
                font-size: 14px;
            }

            .beian {
                display: flex;
                align-items: center;
                font-size: 14px;

                svg {
                    font-size: 20px;
                    margin-right: 5px;
                    color: #3370ff;
                }

                a {
                    color: var(--color-text-2);
                    text-decoration: none;

                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }

        .footer_right {
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .social-icons {
                display: flex;
                gap: 20px;

                a {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    transition: all 0.3s ease;
                    font-size: 35px;

                    &:hover {
                        transform: translateY(-5px);
                    }

                    &:nth-child(1) svg {
                        color: #00a1d6; // 哔哩哔哩蓝色
                    }

                    &:nth-child(2) svg {
                        color: #c71d23; // Gitee红色
                    }

                    &:nth-child(3) svg {

                        color: #fff; // GitHub白色
                    }

                    &:nth-child(4) svg {
                        color: #f26522; // RSS橙色
                    }

                    &:nth-child(5) svg {
                        color: #07c160; // 微信绿色
                    }
                }

                a.github-icon {
                    svg {
                        color: #333; // GitHub黑色
                    }
                }
            }
        }
    }
}
</style>