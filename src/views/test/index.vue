    <template>
        <div id="main">
        </div>
    </template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted } from 'vue';

type EChartsOption = echarts.EChartsOption;

onMounted(() => {
    var chartDom = document.getElementById('main')!;
    console.log(chartDom);
    var myChart = echarts.init(chartDom);
    console.log(myChart);
    var option: EChartsOption;

    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            min: 0,
            max: 100,
            axisLabel: {
                formatter: '{value}%'
            }
        },
        yAxis: {
            type: 'category',
            data: ["CPU", "内存", "磁盘"]
        },
        series: [
            {
                name: '2011',
                type: 'bar',
                data: [18.203, 23.489, 29.034],
                label: {
                    show: true,
                    formatter: (params: any) => {
                        return params.value.toFixed(2) + '%';
                    }
                }
            },
        ]
    };
    myChart.setOption(option);
})
</script>

<style scoped>
#main {
    width: 100%;
    height: 100vh;
}
</style>