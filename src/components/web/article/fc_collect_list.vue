<template>
  <div class="fc_collect_list_view">
    <div class="add" v-if="props.isMe">
      <a-button type="outline" @click="addCollect">
        <template #icon>
          <IconPlus></IconPlus>
          创建
        </template>
      </a-button>
    </div>
    <Fc_collect_form_create_modal @ok="getCollectList" v-model:title="form.title" v-model:visible="visible"
      v-model:abstract="form.abstract" :id="form.id">
    </Fc_collect_form_create_modal>
    <div class="collectList">
      <div class="item" v-for="item in collectData.list" :key="item.id"
        :class="{ active: item.id === Number(route.query.collectID) }">
        <a-trigger trigger="contextMenu" align-point content-class="collect-trigger" v-if="props.isMe">
          <Fc_a @click="changeCollect(item)">
            <span class="title">
              <a-typography-title :ellipsis="{ css: true, rows: 1 }">{{ item.title
              }}</a-typography-title>
            </span>
            <span>{{ item.collectCount }}</span>
          </Fc_a>
          <template #content>
            <div class="item" @click="showEditModal(item)">编辑</div>
            <div class="item delete" @click="removeCollect(item)">删除</div>
          </template>
        </a-trigger>
        <Fc_a v-else @click="changeCollect(item)"> <span class="title">
            <a-typography-title :ellipsis="{ css: true, rows: 1 }">{{ item.title
            }}</a-typography-title>
          </span>
          <span>{{ item.collectCount }}</span>
        </Fc_a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type listResponse } from '@/api';
import { Message } from '@arco-design/web-vue';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Fc_a from '@/components/common/fc_a.vue';
import type { collectListReq, collectRes } from '@/api/collect_api';
import { collectDeleteApi, collectListApi, type collectCreateReq } from '@/api/collect_api';
import Fc_collect_form_create_modal from './fc_collect_form_create_modal.vue';
const router = useRouter()
const route = useRoute();
const form = reactive<collectCreateReq>({
  title: "",
  abstract: "",
  cover: ""
})
const visible = ref(false);

const changeCollect = (item: collectRes) => {
  // 判断是不是已经点了
  const collectID = Number(route.query.collectID)
  let _id: number | undefined = item.id
  console.log('collectID', collectID)
  console.log('item.id', item.id)
  if (collectID === _id) {
    _id = undefined
  }
  router.push({
    name: route.name as string,
    query: {
      ...route.query,
      collectID: _id,
    },
    params: route.params,
  });
}

interface Props {
  userID: number;
  isMe: boolean;
}
const props = defineProps<Props>();
const collectData = reactive<listResponse<collectRes>>({
  list: [],
  count: 0,
});
const addCollect = () => {
  form.id = 0
  form.title = "";
  form.abstract = "";
  visible.value = true;
}
const params = ref<collectListReq>(
  {
    userID: 0,
    type: 2,
    articleID: 0,
  }
);
const getCollectList = async () => {
  params.value.userID = props.userID;
  params.value.type = 2;
  const res = await collectListApi(
    params.value
  );
  Object.assign(collectData, res.data)
  console.log('collectData', collectData)
}
const removeCollect = async (item: collectRes) => {
  const res = await collectDeleteApi([item.id]);
  Message.success(res.msg);
  getCollectList()
}
getCollectList()
const showEditModal = (item: collectRes) => {
  // 先确保表单数据已经重置
  form.id = item.id;
  form.title = item.title || "";
  form.abstract = item.abstract || "";
  // 然后再显示模态框
  visible.value = true;
}
</script>

<style lang="less">
.fc_collect_list_view {
  width: 100%;
  border-right: 1px solid var(--color-border-2);
  padding: 16px;
  background-color: var(--color-bg-1);
  transition: all 0.3s ease;

  .add {
    position: relative;
    margin-bottom: 16px;

    .arco-btn {
      width: 100%;
      border-radius: 6px;
      background-color: var(--color-fill-2);
      border: 1px solid var(--color-border-2);
      color: var(--color-text-1);
      transition: all 0.2s ease;
      height: 36px;
      font-size: 14px;

      &:hover {
        background-color: var(--color-fill-3);
        color: rgb(var(--primary-6));
      }

      .arco-icon {
        margin-right: 4px;
        transform: translateY(3px);
      }
    }
  }

  .collectList {
    margin-top: 10px;

    .item {
      position: relative;
      transition: all 0.2s ease;
      margin-bottom: 8px;
      border-radius: 6px;

      &:last-child {
        margin-bottom: 0;
      }

      &:hover {
        background-color: var(--color-fill-2);
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      &.active {
        background-color: var(--color-fill-2);

        a {
          color: rgb(var(--primary-6)) !important;
          padding-left: 15px;
          font-weight: 500;
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 20%;
            width: 3px;
            height: 60%;
            background-color: rgb(var(--primary-6));
            border-radius: 0 2px 2px 0;
          }
        }
      }

      a {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 12px;
        border-radius: 6px;
        font-size: 14px;
        text-decoration: none;
        transition: all 0.2s ease;
        position: relative;

        .title {
          flex: 1;
          overflow: hidden;
          margin-right: 8px;

          .arco-typography {
            font-size: 14px;
            margin: 0;
            font-weight: normal;
            color: inherit;
            line-height: 1.5;
          }
        }

        span:last-child {
          font-size: 14px;
          color: var(--color-text-2);
          min-width: 16px;
          text-align: right;
        }

        &:hover {
          color: rgb(var(--primary-6));
        }

        &.router-link-active,
        &.router-link-exact-active {
          color: var(--color-text-2);
        }
      }
    }
  }
}

.collect-trigger {
  background-color: var(--color-bg-1);
  border-radius: 5px;
  border: @fc_border;
  padding: 5px 0;

  .item {
    padding: 10px 20px;
    cursor: pointer;

    &.delete {
      color: red;
    }

    &:hover {
      background-color: var(--color-fill-1);
    }
  }
}
</style>