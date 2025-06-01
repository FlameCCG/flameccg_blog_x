<template>
  <div class="fc_welcome">
    <div class="title">
      {{ welcomeTitle }}{{ userStore.userBaseInfo.username }},请开始一天的工作吧
    </div>
    <div class="gvb_weather weather" v-if="!noWeather && weatherData">
      <div class="weather-main">
        <div class="location">{{ weatherData.province }} · {{ weatherData.city }}</div>
        <div class="weather-info">
          <div class="weather-icon">
            <i :class="'qi-' + weatherData.icon"></i>
            <span class="weather-text">{{ weatherData.text }}</span>
          </div>
          <div class="temperature">
            {{ weatherData.temp }}℃
            <span class="feels-like">体感温度{{ weatherData.feelsLike }}℃</span>
          </div>
        </div>
      </div>
      <div class="weather-details">
        <div class="detail-item">
          <span class="label">风向</span>
          <span class="value">{{ weatherData.windDir }} {{ weatherData.windScale }}级</span>
        </div>
        <div class="detail-item">
          <span class="label">风速</span>
          <span class="value">{{ weatherData.windSpeed }}km/h</span>
        </div>
        <div class="detail-item">
          <span class="label">湿度</span>
          <span class="value">{{ weatherData.humidity }}%</span>
        </div>
        <div class="detail-item">
          <span class="label">降水量</span>
          <span class="value">{{ weatherData.precip }}mm</span>
        </div>
        <div class="detail-item">
          <span class="label">气压</span>
          <span class="value">{{ weatherData.pressure }}hPa</span>
        </div>
        <div class="detail-item">
          <span class="label">能见度</span>
          <span class="value">{{ weatherData.vis }}km</span>
        </div>
        <div class="detail-item" v-if="weatherData.cloud">
          <span class="label">云量</span>
          <span class="value">{{ weatherData.cloud }}%</span>
        </div>
        <div class="detail-item" v-if="weatherData.dew">
          <span class="label">露点温度</span>
          <span class="value">{{ weatherData.dew }}℃</span>
        </div>
      </div>
    </div>
    <div class="statistics">
      <a-statistic animation title="在线流量" :value="sumData?.flowCount" show-group-separator />
      <a-statistic animation title="消息总数" :value="sumData?.messageCount" show-group-separator />
      <a-statistic animation title="文章总数" :value="sumData?.articleCount" show-group-separator />
      <a-statistic animation title="评论总数" :value="sumData?.commentCount" show-group-separator />
      <a-statistic animation title="用户总数" :value="sumData?.userCount" show-group-separator />
      <a-statistic animation title="今日登陆" :value="sumData?.newLoginCount" show-group-separator />
      <a-statistic animation title="今日注册" :value="sumData?.newSignCount" show-group-separator />
    </div>
    <div class="extra" v-if="!noWeather">
      欢迎来到flameccg的后台管理系统，可查看<a href="">系统帮助</a>以便更好地使用系统！
    </div>
  </div>
</template>

<script setup lang="ts">
import { getWeather, type sumDataResponse, type weatherResponse, sumDataApi } from '@/api/data_api';
import { useUserStore } from '@/stores/user_store';
import { computed, onMounted, ref } from 'vue';
const userStore = useUserStore();
interface Props {
  noWeather?: boolean;
  noHelp?: boolean;
}

const props = defineProps<Props>();
const welcomeTitle = computed(() => {
  const now = new Date();
  const hour = now.getHours();
  console.log(hour);
  if (hour <= 9 && hour >= 6) {
    return '早安';
  } else if (hour <= 12 && hour > 9) {
    return '上午好';
  } else if (hour <= 18 && hour > 12) {
    return '下午好';
  } else if (hour <= 24 && hour > 18) {
    return '晚上好';
  }
});
const sumData = ref<sumDataResponse>();

async function initSumData() {
  try {
    const res = await sumDataApi();
    sumData.value = res.data;
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}
initSumData();
const weatherData = ref<weatherResponse>();
async function initWeather() {
  try {
    const res = await getWeather();
    weatherData.value = res.data;
    console.log('获取天气数据成功:', res.data);
  } catch (error) {
    console.error('获取天气数据失败:', error);
  }
}
initWeather();
onMounted(() => { });
</script>

<style scoped lang="less">
.fc_welcome {
  width: 100%;
  background-color: var(--color-bg-1);
  border-radius: 10px;
  background-image: url(/src/assets/images/电脑场景.png);
  background-size: 460px;
  background-repeat: no-repeat;
  background-position: right center;
  padding: 20px;
  color: var(--color-text-2);
  margin-bottom: 20px;

  .extra {
    a {
      text-decoration: none;
      color: @primary-6;
    }
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    color: var(--color-text-1);
  }

  .weather {
    font-size: 14px;
    border-radius: 8px;
    padding: 16px;

    .weather-main {
      margin-bottom: 16px;

      .location {
        font-size: 16px;
        font-weight: 500;
        color: var(--color-text-1);
        margin-bottom: 8px;
      }

      .weather-info {
        display: flex;
        align-items: center;
        gap: 16px;

        .weather-icon {
          display: flex;
          align-items: center;
          gap: 8px;

          i {
            font-size: 24px;
            color: @primary-6;
          }

          .weather-text {
            font-size: 16px;
            color: var(--color-text-1);
          }
        }

        .temperature {
          font-size: 24px;
          font-weight: 500;
          color: var(--color-text-1);

          .feels-like {
            font-size: 14px;
            color: var(--color-text-3);
            margin-left: 8px;
          }
        }
      }
    }

    .weather-details {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
      padding-top: 12px;

      .detail-item {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .label {
          font-size: 12px;
          color: var(--color-text-3);
        }

        .value {
          font-size: 14px;
          color: var(--color-text-2);
          font-weight: 500;
        }
      }
    }
  }

  .statistics {
    display: flex;
    flex-wrap: wrap;

    ::v-deep(.arco-statistic) {
      margin-right: 22px !important;
      margin-bottom: 15px !important;

      &:last-child {
        margin-right: 0 !important;
      }
    }
  }
}
</style>
@/stores/user_store