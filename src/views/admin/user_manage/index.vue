<script setup lang="ts">
import { articleCategoryOptions, userList, type userListType } from '@/api/user_api';
import Fc_modal_form from '@/components/admin/fc_modal_form.vue';
import Fc_list from '@/components/common/fc_list.vue';
import type { actionGroupType, filterGroupType } from '@/components/common/fc_list.vue';
import { reactive, ref } from 'vue';
import { type formListType } from '@/components/admin/fc_modal_form.vue';
import { ValidateTrigger } from '@arco-design/web-vue';
import { title } from '@/global/global';

const columns = [
  { title: 'ID', dataIndex: 'id' },
  { title: '用户名', dataIndex: 'username' },
  { title: '昵称', dataIndex: 'nickname' },
  { title: '头像', slotName: 'avatar' },
  { title: "ip", dataIndex: 'ip' },
  { title: '地址', dataIndex: 'addr' },
  { title: '角色', slotName: 'role' },
  { title: "主页访问量", dataIndex: "indexCount" },
  { title: "关注数", dataIndex: "focusCount" },
  { title: "粉丝数", dataIndex: "fansCount" },
  // { title: "邮箱", dataIndex: "email" },
  {
    title: '注册时间',
    slotName: 'createAt',
    dateFormat: 'date',
  },
  {
    title: '最后登录时间',
    slotName: 'lastLoginAt',
    dateFormat: 'relativeTime',
  },
  { title: '操作', slotName: 'action' },
];
const handleDelete = (id: number[] | string[]) => {
  console.log(id);
};
const actionGroup: actionGroupType[] = [
  {
    label: '批量升级',
    callback: (keyList: number[]) => {
      console.log(keyList);
    },
  },
];
const fcList = ref<InstanceType<typeof Fc_list>>();
const filters: filterGroupType[] = [
  {
    label: '角色过滤',
    source: [
      { label: '管理员', value: 1 },
      { label: '用户', value: 2 },
    ],
    column: 'role',
    callback: (value: number | string) => {
      console.log(value);
      console.log(fcList.value?.data);
      console.log('end');
      fcList.value?.getList({ role: value });
    },
  },
  {
    label: 'ip过滤',
    source: [
      { label: '外网', value: 1 },
      { label: '内网', value: 2 },
    ],
    column: 'ip',
    width: 140,
  },
  {
    label: '文章分类',
    source: articleCategoryOptions,
    column: 'title',
    width: 140,
  },
];
const handleRowClick = (record: userListType) => {
  // console.log(record);
};
const formList: formListType[] = [
  {
    label: '用户名',
    field: 'username',
    type: 'input',
    rules: [{ required: true }],
    validateTrigger: ['blur'],
  },
  {
    label: '昵称',
    field: 'nickname',
    type: 'input',
    rules: [],
    validateTrigger: ['blur'],
  },
  {
    label: '角色',
    field: 'role',
    type: 'select',
    source: [
      { label: '管理员', value: 1 },
      { label: '用户', value: 2 },
      { label: '游客', value: 3 },
    ],
    rules: [{ required: true }],
    validateTrigger: ['change'],
  },
  {
    label: '密码',
    field: 'password',
    type: 'input',
    rules: [],
    validateTrigger: ['blur'],
  },
  {
    label: '邮箱',
    field: 'email',
    type: 'input',
    rules: [],
    validateTrigger: ['blur'],
  },
];


</script>

<template>
  <div>
    <fc_list :url="userList" :columns="columns" @delete="handleDelete" :action-group="actionGroup"
      :filter-group="filters" ref="fcList" @rowClick="handleRowClick" add-form-label="创建用户" edit-form-lable="编辑用户"
      :form-list="formList">
      <template #avatar="{ record }: { record: userListType }">
        <a-avatar :image-url="record.avatar"></a-avatar>
      </template>
      <!-- <template #action_left>
        <a-button>预览</a-button>
      </template> -->
    </fc_list>
  </div>
</template>

<style scoped></style>
