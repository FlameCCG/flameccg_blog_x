<template>
    <div class="fc_home_echarts_v1">
        <div class="left">
            <a-statistic :value="data.growthNum">
                <template #extra>
                    <span :class="{
                        green: data.growthRate > 0,
                        gray: data.growthRate === 0,
                        red: data.growthRate < 0
                    }">{{ data.growthRate.toFixed(2) }}%</span>
                </template>
            </a-statistic>
        </div>
        <div class="right">
            <Echarts_v1 :class="`growth_chart_${props.type}`" :class-name="`growth_chart_${props.type}`"
                :count-list="data.countList" :date-list="data.dateList" :type="props.type">
            </Echarts_v1>
        </div>
    </div>
</template>

<script setup lang="ts">
import Echarts_v1 from '@/components/echarts/echarts_v1/echarts_v1.vue';
import { reactive } from 'vue';
import { type growthDataResponse, growthDataApi } from '@/api/data_api';
interface Props {
    type: 1 | 2 | 3;
}
const props = defineProps<Props>();
const data = reactive<growthDataResponse>(
    {
        growthRate: 0,
        growthNum: 0,
        countList: [],
        dateList: []
    }
);
const getGrowthData = async () => {
    try {
        const res = await growthDataApi(props.type);
        Object.assign(data, res.data);
        console.log(data);
    } catch (error) {
        console.log(error);
    }
    console.log(data);
}
getGrowthData();
</script>
<style scoped lang="less">
.fc_home_echarts_v1 {
    display: flex;
    justify-content: space-between;
    height: 200px;

    .left {
        width: 40%;
        display: flex;
        align-items: center;
        justify-content: center;

        .arco-statistic-extra {
            .green {
                color: #52c41a;
                font-weight: 700;
                font-size: 18px;
                position: relative;

                &::before {
                    content: "+";
                    margin-right: 4px;
                    font-size: 20px;
                    color: #52c41a;
                    font-weight: bold;
                    text-shadow: 0 0 5px rgba(82, 196, 26, 0.5);
                }

                &::after {
                    content: "↑";
                    display: inline-block;
                    margin-left: 6px;
                    font-size: 24px;
                    color: #52c41a;
                    transform: translateY(0);
                    animation: arrowUp 1.2s infinite ease-in-out;
                }
            }

            .gray {
                color: #999;
                font-weight: 600;
                font-size: 16px;
            }

            .red {
                color: #ff4d4f;
                font-weight: 700;
                font-size: 18px;
                position: relative;

                &::after {
                    content: "↓";
                    display: inline-block;
                    margin-left: 6px;
                    font-size: 30px;
                    transform: rotate(12deg);
                    color: #ff4d4f;
                    // animation: arrowDown 1.2s infinite ease-in-out;
                }
            }

            .arco-statistic-value {
                display: flex;
                align-items: center;
            }
        }
    }

    .right {
        width: 60%;
    }
}

/* 上升箭头浮动 */
@keyframes arrowUp {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-4px);
    }
}

/* 下降箭头浮动 */
@keyframes arrowDown {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(4px);
    }
}
</style>
