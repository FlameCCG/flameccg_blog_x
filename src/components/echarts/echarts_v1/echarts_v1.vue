<template>
    <div class="echarts-v1" :class="props.className"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import * as echarts from 'echarts';
import { theme } from '@/components/common/fc_theme';

interface Props {
    type: 1 | 2 | 3;
    className: string;
    countList: number[];
    dateList: string[];
}

const props = defineProps<Props>();
const echartInstance = ref<echarts.EChartsType | null>(null);

// 根据type生成不同的图表颜色配置
const chartColors = computed(() => {
    const isDark = theme.value === 'dark';
    // 基于type和主题返回对应的颜色配置
    switch (props.type) {
        case 1:
            return {
                line: isDark ? '#5B8FF9' : "red",
                area: isDark ? 'rgba(91, 143, 249, 0.2)' : 'rgba(22, 93, 255, 0.1)',
                point: isDark ? '#5B8FF9' : '#165DFF'
            };
        case 2:
            return {
                line: isDark ? '#5AD8A6' : '#00B42A',
                area: isDark ? 'rgba(90, 216, 166, 0.2)' : 'rgba(0, 180, 42, 0.1)',
                point: isDark ? '#5AD8A6' : '#00B42A'
            };
        case 3:
            return {
                line: isDark ? '#F6BD16' : '#FF7D00',
                area: isDark ? 'rgba(246, 189, 22, 0.2)' : 'rgba(255, 125, 0, 0.1)',
                point: isDark ? '#F6BD16' : '#FF7D00'
            };
        default:
            return {
                line: isDark ? '#5B8FF9' : '#165DFF',
                area: isDark ? 'rgba(91, 143, 249, 0.2)' : 'rgba(22, 93, 255, 0.1)',
                point: isDark ? '#5B8FF9' : '#165DFF'
            };
    }
});

// 监听主题变化或type变化
watch([() => theme.value, () => props.type], () => {
    updateChart();
});

const updateChart = () => {
    // 从 CSS 变量获取文本颜色
    let textColor = getComputedStyle(document.body).getPropertyValue('--color-text-1');
    const lineColor = getComputedStyle(document.body).getPropertyValue('--color-neutral-2');

    if (!echartInstance.value) return;

    const colors = chartColors.value;

    const option = {
        xAxis: {
            type: 'category',
            data: props.dateList,
            show: false,
        },
        grid: {
            left: 0,
            right: 0,
            top: 20,
            bottom: 20,
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                show: false
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: colors.line,
                }
            }
        },
        series: [
            {
                data: props.countList,
                type: 'line',
                smooth: true,
                showSymbol: true,
                symbolSize: 6,
                areaStyle: {
                    color: colors.area
                },
                label: {
                    show: true,
                    position: 'top',
                    distance: 0,
                    color: textColor,
                    fontSize: 10,
                    fontWeight: 'bold',
                    borderRadius: 4,
                    padding: [2, 4],
                },
                itemStyle: {
                    color: colors.point
                },
                lineStyle: {
                    width: 2,
                    color: colors.line
                }
            }
        ]
    };

    echartInstance.value.setOption(option);
};

watch(() => [props.dateList, props.countList], () => {
    updateChart();
}, { deep: true });

onMounted(() => {
    const chartDom = document.querySelector('.' + props.className) as HTMLElement;
    if (chartDom) {
        echartInstance.value = echarts.init(chartDom);
        updateChart();
    }
});

window.addEventListener('resize', () => {
    echartInstance.value?.resize();
});
</script>

<style scoped lang="less">
.echarts-v1 {
    width: 100%;
    height: 100%;
}
</style>