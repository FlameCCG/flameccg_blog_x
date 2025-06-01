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
        console.error('鑾峰彇绯荤粺璧勬簮鏁版嵁澶辫触:', error);
    }
};

// 瀹氫箟涓嶅悓璧勬簮绫诲瀷鐨勯鑹查厤缃?const getResourceColors = () => {
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

// 鑾峰彇鑳屾櫙绾挎€ф笎鍙?const getLinearGradient = (color: string, opacity1: number = 0.3, opacity2: number = 0.05) => {
    return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: color },
        { offset: 1, color: echarts.color.modifyAlpha(color, opacity1) }
    ]);
};

// 鑾峰彇璀﹀憡棰滆壊 - 鍩轰簬浣跨敤鐜?const getStatusColor = (value: number) => {
    const isDark = theme.value === 'dark';
    if (value >= 90) {
        return isDark ? '#F53F3F' : '#F53F3F'; // 鍗遍櫓绾?    } else if (value >= 70) {
        return isDark ? '#F77234' : '#FF7D00'; // 璀﹀憡姗?    } else if (value >= 50) {
        return isDark ? '#FFAB00' : '#FF9A2E'; // 娉ㄦ剰榛?    } else {
        return isDark ? '#00B42A' : '#00B42A'; // 姝ｅ父缁?    }
};

type EChartsOption = echarts.EChartsOption;
const chartRef = ref<echarts.ECharts>();

const updateChart = () => {
    if (!chartRef.value) return;

    const colors = getResourceColors();
    const isDark = theme.value === 'dark';
    const axisTextColor = isDark ? '#86909C' : '#4E5969';
    const splitLineColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    // 涓烘瘡涓祫婧愬噯澶囨暟鎹?    const seriesData = [
        {
            name: 'CPU',
            value: data.cpuUsage,
            itemStyle: {
                color: getLinearGradient(getStatusColor(data.cpuUsage))
            }
        },
        {
            name: '鍐呭瓨',
            value: data.memoryUsage,
            itemStyle: {
                color: getLinearGradient(getStatusColor(data.memoryUsage))
            }
        },
        {
            name: '纾佺洏',
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
            left: '5%',
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
            data: ["CPU", "鍐呭瓨", "纾佺洏"],
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
        series: [
            {
                name: '浣跨敤鐜?,
                type: 'bar',
                barWidth: '40%',
                data: seriesData,
                label: {
                    show: true,
                    position: 'right',
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
                // 鐐叿鏁堟灉锛氭潯褰㈡笎鍙樺拰鑳屾櫙
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
        // 澧炲姞浜嬩欢鏍囪锛屾樉绀洪槇鍊肩嚎
        markLine: {
            silent: true,
            symbol: 'none',
            data: [
                {
                    name: '璀﹀憡闃堝€?,
                    xAxis: 70,
                    lineStyle: {
                        color: isDark ? '#FF7D00' : '#FF7D00',
                        type: 'dashed'
                    },
                    label: {
                        show: true,
                        formatter: '璀﹀憡',
                        color: isDark ? '#FF7D00' : '#FF7D00',
                        position: 'middle'
                    }
                },
                {
                    name: '鍗遍櫓闃堝€?,
                    xAxis: 90,
                    lineStyle: {
                        color: isDark ? '#F53F3F' : '#F53F3F',
                        type: 'dashed'
                    },
                    label: {
                        show: true,
                        formatter: '鍗遍櫓',
                        color: isDark ? '#F53F3F' : '#F53F3F',
                        position: 'middle'
                    }
                }
            ]
        }
    };

    chartRef.value.setOption(option, true);
};

// 鐩戝惉涓婚鍙樺寲
watch(() => theme.value, () => {
    // 閲嶆柊娓叉煋鍥捐〃浠ラ€傚簲鏂颁富棰?    if (chartRef.value) {
        updateChart();
    }
});

// 瀹氭湡鍒锋柊鏁版嵁
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

    // 绐楀彛澶у皬鍙樺寲鏃堕噸缁樺浘琛?    window.addEventListener('resize', () => {
        chartRef.value?.resize();
    });
});

onUnmounted(() => {
    // 娓呯悊瀹氭椂鍣ㄥ拰浜嬩欢鐩戝惉
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
