<template>
  <div class="userLoginChart"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as echarts from 'echarts';
import { theme } from '../common/fc_theme';
import { watch, ref } from 'vue';

type EChartsOption = echarts.EChartsOption;

let myChart: echarts.ECharts | null = null;

const initEcharts = () => {
  const textColor = getComputedStyle(document.body).getPropertyValue('--color-text-1');
  const lineColor = getComputedStyle(document.body).getPropertyValue('--color-neutral-2');
  let themeColor = ['#87CEF2', '#F68868'];
  if (theme.value === 'dark') {
    themeColor = ['#9F5946', '#D0A468'];
  }

  const option: EChartsOption = {
    color: themeColor,
    title: {
      text: '用户数据',
      textStyle: {
        color: textColor,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['登录', '注册'],
      textStyle: {
        color: textColor,
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLine: {
          lineStyle: {
            color: lineColor,
          },
        },
        axisLabel: {
          color: textColor,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: lineColor,
          },
        },
        axisLabel: {
          color: textColor,
        },
      },
    ],
    series: [
      {
        name: '登录',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: [120, 132, 101, 134, 90, 230, 210],
        smooth: true,
      },
      {
        name: '注册',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        smooth: true,
        data: [220, 182, 191, 234, 290, 330, 310],
      },
    ],
  };

  myChart?.setOption(option);
};

onMounted(() => {
  const userLoginChartDom = document.querySelector('.userLoginChart') as HTMLElement;
  myChart = echarts.init(userLoginChartDom);
  initEcharts();
});

watch(theme, () => {
  initEcharts();
});
</script>

<style scoped>
.userLoginChart {
  width: 100%;
  height: 260px;
  background-color: var(--color-bg-1);
  border-radius: 5px;
}
</style>
