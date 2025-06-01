<template>
    <div id="system-resource"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, onUnmounted, watch } from 'vue';
import { type systemResourceResponseResponse, systemResourceApi } from '@/api/data_api';
import { reactive, ref } from 'vue';
import { theme } from '@/components/common/fc_theme';

const data = reactive<systemResourceResponseResponse>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0
});

const REFRESH_INTERVAL = 10000;
let timer: number | null = null;

const fetchData = async () => {
    try {
        const res = await systemResourceApi();
        Object.assign(data, res.data);
    } catch (error) {
        console.error('获取系统资源数据失败:', error);
    }
};

// 定义不同资源类型的颜色配置
const getResourceColors = () => {
    const isDark = theme.value === 'dark';

    return {
        cpu: {
            base: isDark ? '#5B8FF9' : '#165DFF',
            light: isDark ? 'rgba(91, 143, 249, 0.3)' : 'rgba(22, 93, 255, 0.2)',
            shadow: isDark ? 'rgba(91, 143, 249, 0.1)' : 'rgba(22, 93, 255, 0.1)',
            textColor: isDark ? '#E8F3FF' : '#1D2129'
        },
        memory: {
            base: isDark ? '#5AD8A6' : '#00B42A',
            light: isDark ? 'rgba(90, 216, 166, 0.3)' : 'rgba(0, 180, 42, 0.2)',
            shadow: isDark ? 'rgba(90, 216, 166, 0.1)' : 'rgba(0, 180, 42, 0.1)',
            textColor: isDark ? '#E8F3FF' : '#1D2129'
        },
        disk: {
            base: isDark ? '#F6BD16' : '#FF7D00',
            light: isDark ? 'rgba(246, 189, 22, 0.3)' : 'rgba(255, 125, 0, 0.2)',
            shadow: isDark ? 'rgba(246, 189, 22, 0.1)' : 'rgba(255, 125, 0, 0.1)',
            textColor: isDark ? '#E8F3FF' : '#1D2129'
        }
    };
};

// 获取背景线性渐变
const getLinearGradient = (color: string, opacity1: number = 0.3, opacity2: number = 0.05) => {
    return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: color },
        { offset: 1, color: echarts.color.modifyAlpha(color, opacity1) }
    ]);
};

// 获取警告颜色 - 基于使用率
const getStatusColor = (value: number): string => {
    const isDark = theme.value === 'dark';
    if (value >= 90) {
        return isDark ? '#F53F3F' : '#F53F3F'; // 危险红
    } else if (value >= 70) {
        return isDark ? '#F77234' : '#FF7D00'; // 警告橙
    } else if (value >= 50) {
        return isDark ? '#FFAB00' : '#FF9A2E'; // 注意黄
    } else {
        return isDark ? '#00B42A' : '#00B42A'; // 正常绿
    }
};

type EChartsOption = echarts.EChartsOption;
const chartRef = ref<echarts.ECharts>();

const updateChart = () => {
    if (!chartRef.value) return;

    const colors = getResourceColors();
    const isDark = theme.value === 'dark';
    const axisTextColor = isDark ? '#86909C' : '#4E5969';
    const splitLineColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    // 为每个资源准备数据
    const seriesData = [
        {
            name: 'CPU',
            value: data.cpuUsage,
            itemStyle: {
                color: getLinearGradient(getStatusColor(data.cpuUsage))
            }
        },
        {
            name: '内存',
            value: data.memoryUsage,
            itemStyle: {
                color: getLinearGradient(getStatusColor(data.memoryUsage))
            }
        },
        {
            name: '磁盘',
            value: data.diskUsage,
            itemStyle: {
                color: getLinearGradient(getStatusColor(data.diskUsage))
            }
        }
    ];

    const option: EChartsOption = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: (params: any) => {
                const data = params[0];
                return `${data.name}: ${data.value.toFixed(2)}%`;
            }
        },
        grid: {
            left: '1%',
            right: '5%',
            bottom: '8%',
            top: '8%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLabel: {
                formatter: '{value}%',
                color: axisTextColor
            },
            splitLine: {
                lineStyle: {
                    color: splitLineColor,
                    type: 'dashed'
                }
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: splitLineColor
                }
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'category',
            data: ["CPU", "内存", "磁盘"],
            axisLabel: {
                color: axisTextColor,
                fontSize: 14,
                fontWeight: 'bold'
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: splitLineColor
                }
            },
            axisTick: {
                show: false
            }
        },
        // 忽略ts类型检查，因为echarts的类型定义文件中没有暴露出BarSeriesOption类型
        // @ts-ignore
        series: [
            {
                name: '使用率',
                type: 'bar',
                barWidth: '30%',
                data: seriesData,
                label: {
                    show: true,
                    position: 'top',
                    formatter: (params: any) => {
                        return params.value.toFixed(2) + '%';
                    },
                    color: ({ value }: { value: number }) => getStatusColor(value),
                    fontSize: 14,
                    fontWeight: 'bold',
                    distance: 5
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.2)'
                    }
                },
                showBackground: true,
                backgroundStyle: {
                    color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    borderRadius: [0, 20, 20, 0]
                },
                itemStyle: {
                    borderRadius: [0, 20, 20, 0]
                }
            }
        ],
        // 增加事件标记，显示阈值线
        markLine: {
            silent: true,
            symbol: 'none',
            data: [
                {
                    name: '警告阈值',
                    xAxis: 70,
                    lineStyle: {
                        color: isDark ? '#FF7D00' : '#FF7D00',
                        type: 'dashed'
                    },
                    label: {
                        show: true,
                        formatter: '警告',
                        color: isDark ? '#FF7D00' : '#FF7D00',
                        position: 'middle'
                    }
                },
                {
                    name: '危险阈值',
                    xAxis: 90,
                    lineStyle: {
                        color: isDark ? '#F53F3F' : '#F53F3F',
                        type: 'dashed'
                    },
                    label: {
                        show: true,
                        formatter: '危险',
                        color: isDark ? '#F53F3F' : '#F53F3F',
                        position: 'middle'
                    }
                }
            ]
        }
    };

    chartRef.value.setOption(option, true);
};

// 监听主题变化
watch(() => theme.value, () => {
    // 重新渲染图表以适应新主题
    if (chartRef.value) {
        updateChart();
    }
});

// 定期刷新数据
const startDataRefresh = () => {
    timer = window.setInterval(async () => {
        await fetchData();
        updateChart();
    }, REFRESH_INTERVAL);
};

onMounted(async () => {
    let chartDom = document.getElementById('system-resource')!;
    chartRef.value = echarts.init(chartDom);
    await fetchData();
    updateChart();
    startDataRefresh();

    // 窗口大小变化时重绘图表
    window.addEventListener('resize', () => {
        chartRef.value?.resize();
    });
});

onUnmounted(() => {
    // 清理定时器和事件监听
    if (timer) {
        clearInterval(timer);
    }
    window.removeEventListener('resize', () => {
        chartRef.value?.resize();
    });
    chartRef.value?.dispose();
});
</script>

<style scoped>
#system-resource {
    width: 100%;
    height: 300px;
    position: relative;
    border-radius: 8px;
    padding: 8px;
    box-sizing: border-box;
    transition: all 0.3s ease;
}
</style>