<script setup lang="ts">
import Fc_list from '@/components/common/fc_list.vue';
import { bannerListApi, bannerCreateUpdateApi, deleteBannerApi, type bannerListType, type bannerType } from "@/api/banner_api.ts";
import { ref } from 'vue';
import { reactive } from 'vue';
import Fc_image_upload from '@/components/common/fc_image_upload.vue';
import { Message } from '@arco-design/web-vue';
const columns = [
  { title: "ID", dataIndex: 'id' },
  { title: "图片", slotName: 'cover' },
  { title: "跳转地址", slotName: 'href' },
  { title: "是否显示", slotName: 'show' },
  { title: "时间", slotName: 'createAt' },
  { title: "操作", slotName: 'action' },
]
const visible = ref(false);
const data = reactive<bannerType>({
  cover: '',
  href: '',
  show: true,
});

function create() {
  data.id = undefined;
  data.cover = '';
  data.href = '';
  data.show = true;
  visible.value = true;
}
function edit(record: bannerListType) {
  data.id = record.id;
  data.cover = record.cover;
  data.href = record.href;
  visible.value = true;
}
const fListRef = ref<InstanceType<typeof Fc_list>>();

async function handleOk() {
  try {
    const res = await bannerCreateUpdateApi(data);
    Message.success(res.msg);
    fListRef.value?.getList();
  } catch (error) {
    console.log(error);
  }
}

async function handleDelete(keyList: number[] | string[]) {
  try {
    const res = await deleteBannerApi(keyList as number[]);
    Message.success(res.msg);
    fListRef.value?.getList();
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <div>
    <a-modal v-model:visible="visible" :on-before-ok="handleOk" :title="data.id ? '编辑banner' : '新增banner'">
      <a-form>
        <a-form-item label="封面">
          <Fc_image_upload v-model="data.cover" placeholder="请上传banner图片" :height="60" :width="60" shape="">
          </Fc_image_upload>
        </a-form-item>
        <a-form-item label="跳转地址">
          <a-input v-model="data.href"></a-input>
        </a-form-item>
        <a-form-item label="是否显示">
          <a-switch v-model="data.show"></a-switch>
        </a-form-item>
      </a-form>
    </a-modal>
    <fc_list ref="fListRef" :url=bannerListApi :columns="columns" @edit="edit" @add="create" no-defalut-delete
      @delete="handleDelete">
      <template #cover="{ record }: { record: bannerListType }">
        <a-image :src="record.cover" :width="60"> </a-image>
      </template>
      <template #show="{ record }: { record: bannerListType }">
        <a-switch v-model="record.show"></a-switch>
      </template>
      <template #href="{ record }: { record: bannerListType }">
        <a-link v-if="record.href" :href="record.href" target="_blank">{{ record.href }}</a-link>
        <span v-else>无</span>
      </template>
    </fc_list>
  </div>
</template>

<style scoped></style>
