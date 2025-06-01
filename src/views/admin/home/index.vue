<script setup lang="ts">
import { type growthDataResponse, growthDataApi } from '@/api/data_api';
import Fc_quick_entrance from '@/components/admin/fc_quick_entrance.vue';
import Fc_welcome from '@/components/admin/fc_welcome.vue';
import Fc_title from '@/components/common/fc_title.vue';
import Fc_version from '@/components/common/fc_version.vue';
import fc_home_echarts_v1 from "@/components/admin/fc_home_echarts_v1.vue";
import artileStatisticsEcharts from '@/components/echarts/echarts_v1/fc_article_statistic_eharts.vue';
import Fc_system_resource from '@/components/echarts/echarts_v1/fc_system_resource.vue';
</script>

<template>
  <div class="home_view">
    <div class="left">
      <fc_welcome></fc_welcome>
      <div class="charts charts_3">
        <div class="item">
          <Fc_title :type=2>访问人数</Fc_title>
          <fc_home_echarts_v1 :type="1">
          </fc_home_echarts_v1>
        </div>
        <div class="item">
          <Fc_title :type=2>发布文章</Fc_title>
          <fc_home_echarts_v1 :type="2">
          </fc_home_echarts_v1>
        </div>
        <div class="item">
          <Fc_title :type=2>新增用户</Fc_title>
          <fc_home_echarts_v1 :type="3">
          </fc_home_echarts_v1>
        </div>
      </div>
      <div class="charts charts_2">
        <div class="item">
          <div class="body">
            <artileStatisticsEcharts></artileStatisticsEcharts>
          </div>
        </div>
        <div class="item">
          <Fc_title :type=2>系统资源</Fc_title>
          <div class="body">
            <Fc_system_resource></Fc_system_resource>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <fc_quick_entrance></fc_quick_entrance>
      <fc_version></fc_version>
    </div>
  </div>
</template>


<style lang="less" scoped>
.home_view {
  background-color: inherit !important;
  display: flex;
  justify-content: space-between;

  >.left {
    width: 75%;

    .charts {
      display: grid;
      grid-column-gap: 20px;
      margin-bottom: 20px;

      .item {
        background-color: var(--color-bg-1);
        border-radius: 5px;
        padding: 20px 10px;
      }
    }

    .charts_3 {
      grid-template-columns: repeat(3, 1fr);
    }

    .charts_2 {
      grid-template-columns: 7fr 3fr;
    }
  }

  >.right {
    width: calc(25% - 20px);

    .fc_quick_entrance {
      margin-bottom: 20px;
    }
  }
}
</style>
