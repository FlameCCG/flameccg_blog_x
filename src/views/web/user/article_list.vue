<template>
  <div class="user_article_list_view">
    <fc_category_list :user-i-d="Number(route.params.id)" :is-me="store.isMe"></fc_category_list>
    <Fc_article_list></Fc_article_list>
  </div>
</template>

<script setup lang="ts">
import { articleListApi, type articleListRequest, type articleListType } from '@/api/article_api';
import { type listResponse } from '@/api/index';
import { reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import fc_category_list from '@/components/web/article/fc_category_list.vue';
import { userBaseInfoStore } from '@/stores/user_base_store';
import Fc_article_list from '@/components/web/article/fc_article_list.vue';
const store = userBaseInfoStore();
const route = useRoute();
</script>

<style lang="less">
.user_article_list_view {
  display: flex;

  .fc_category_list_view {
    width: 150px;
  }
}
</style>
