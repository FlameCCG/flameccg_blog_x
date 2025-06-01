<template>
    <div class="articleStatisticChart" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import * as echarts from 'echarts';
import { theme } from '@/components/common/fc_theme';
import { articleStatisticsApi } from '@/api/data_api';
import { reactive } from 'vue';

const chartRef = ref<HTMLElement | null>(null); // 绑定 DOM
let chartInstance: echarts.ECharts | null = null;
const data = reactive({
    growthRate: 0,
    growthNum: 0,
    countList: [],
    dateList: [],
})

// 初始化图表实例
function initChart() {
    if (chartRef.value && !chartInstance) {
        chartInstance = echarts.init(chartRef.value);
    }
}

function updateChart() {
    if (!chartInstance) return;

    const textColor = getComputedStyle(document.body).getPropertyValue('--color-text-1');
    const lineColor = getComputedStyle(document.body).getPropertyValue('--color-neutral-3');
    let themeColor = ['#56CCF2', '#2F80ED']; // 渐变蓝紫系
    if (theme.value === 'dark') {
        themeColor = ['#FF9A8B', '#FF6A88']; // 暗色渐变红紫
    }

    const option: echarts.EChartsOption = {
        backgroundColor: 'transparent',
        color: themeColor,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#ccc',
                    width: 1,
                },
            },
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '5%',
            top: '10%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: data.dateList,
            axisLine: { lineStyle: { color: lineColor } },
            axisTick: { show: false },
            axisLabel: { color: textColor },
            splitLine: {
                show: true,
                lineStyle: {
                    color: 'rgba(255,255,255,0.05)',
                },
            },
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: lineColor } },
            axisTick: { show: false },
            axisLabel: { color: textColor },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: 'rgba(255,255,255,0.08)',
                },
            },
        },
        series: [
            {
                type: 'line',
                smooth: true,
                data: data.countList,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.3)',
                    shadowBlur: 10,
                    shadowOffsetY: 5,
                },
                itemStyle: {
                    color: themeColor[1],
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                label: {
                    show: true,
                    position: 'top',
                    color: textColor,
                    fontSize: 12,
                    distance: 0,
                },
                areaStyle: {
                    opacity: 0.2,
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: themeColor[1] },
                            { offset: 1, color: 'rgba(255, 255, 255, 0)' },
                        ],
                    },
                },
            },
        ],
    };

    chartInstance.setOption(option);
}

// 获取数据
async function fetchData() {
    try {
        const res = await articleStatisticsApi();
        Object.assign(data, res.data);
        updateChart();
    } catch (err) {
        console.error('获取图表数据失败:', err);
    }
}

// 生命周期：挂载后初始化图表 + 拉数据
onMounted(() => {
    initChart();
    fetchData();

});

// 响应主题切换更新图表颜色
watch(theme, () => {
    updateChart();
});
</script>

<style scoped>
.articleStatisticChart {
    width: 100%;
    height: 260px;
    background-color: var(--color-bg-1);
    border-radius: 5px;
}
</style>