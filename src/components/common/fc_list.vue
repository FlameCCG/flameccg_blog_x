<template>
  <div class="fc_list_com">
    <Fc_modal_form v-if="props.formList?.length" v-model:visible="isVisible" :form-list="props.formList"
      :sedit-lable="props.editFormLable" :add-lable="props.addFormLabel" ref="modalFormRef" @create="create"
      @update="update">
    </Fc_modal_form>
    <div class="fc_list_head">
      <slot name="action_create">
        <div class="action_create" v-if="!noAdd">
          <a-button type="primary" @click="add">{{ createLabel }}</a-button>
        </div>
      </slot>
      <div class="action_group" v-if="!noDefaultGroup">
        <a-select placeholder="操作" style="width: 140px" v-model="actionGroupValue"
          :options="actionGroupOptions"></a-select>
        <a-button type="primary" status="danger" @click="handleActionGroup" v-if="actionGroupValue">执行</a-button>
      </div>
      <div class="action_search">
        <a-input-search :placeholder="searchPlaceholder" @search="handleSearch"></a-input-search>
      </div>
      <div class="action_filter">
        <a-select v-for="item in filterGroups" :placeholder="item.label" :options="item.options" @change="item.callback"
          :style="{ width: item.width ? item.width + 'px' : 140 + 'px' }">
        </a-select>
      </div>
      <div class="action_search_slot">
        <slot name="action_search"></slot>
      </div>
      <div class="action_flush" @click="getList">
        <icon-refresh></icon-refresh>
      </div>
    </div>
    <div class="fc_list_body">
      <a-spin tip="加载中..." :loading="loading">
        <div class="fc_list_table">
          <a-table :data="data.list" :row-key="rowKey" v-model:selectedKeys="selectedKeys"
            :row-selection="props.noCheck ? undefined : rowSelection" :pagination="false" @row-click="rowClick">
            <template #columns>
              <template v-for="col in props.columns">
                <a-table-column v-if="col.type === 'date'" v-bind="col">
                  <template #cell="data">
                    {{ formatDate(data.record[col.slotName], col.dateFormat) }}
                  </template>
                </a-table-column>
                <a-table-column v-else-if="col.type === 'options'" v-bind="col">
                  <template #cell="data">
                    <Fc_label :options="col.options" :value="data.record[col.dataIndex]"></Fc_label>
                  </template>
                </a-table-column>
                <a-table-column v-else-if="col.type === 'switch' && !col.slotName" v-bind="col">
                  <template #cell="data">
                    <a-switch v-model="data.record[col.dataIndex]"></a-switch>
                  </template>
                </a-table-column>
                <a-table-column v-else-if="col.dataIndex" v-bind="col"></a-table-column>

                <a-table-column v-else-if="col.slotName" v-bind="col">
                  <template #cell="data">
                    <div class="col_actions" v-if="col.slotName === 'action'">
                      <slot v-bind="data" name="action_left"></slot>
                      <a-button type="primary" @click="edit(data.record)" v-if="!noEdit">{{
                        editLabel
                      }}</a-button>
                      <a-popconfirm content="确认删除?" @ok="handleDelete(data.record)" v-if="!noDelete">
                        <a-button type="primary" status="danger">{{ deleteLabel }}</a-button>
                      </a-popconfirm>
                      <slot v-bind="data" name="action_right"></slot>
                    </div>
                    <div v-if="col.slotName === 'createAt'">
                      {{ formatDate(data.record[col.slotName], col.dateFormat) }}
                    </div>
                    <div v-if="col.slotName === 'role'">
                      {{
                        data.record[col.slotName] === 1
                          ? '管理员'
                          : data.record[col.slotName] === 2
                            ? '普通用户'
                            : data.record[col.slotName] === 3
                              ? '游客'
                              : ''
                      }}
                    </div>
                    <slot v-else :name="col.slotName" v-bind="data"></slot>
                  </template>
                </a-table-column>
              </template>
            </template>
          </a-table>
        </div>
        <div class="fc_list_page" v-if="!noPage">
          <a-pagination show-total :total="data.count" @change="pageChange" :page-size="params.limit"
            v-model:current="params.page">
          </a-pagination>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { paramsType, listResponse, optionType, optionsFunc } from '@/api';
import { defaultDelete, defaultPost, defaultPut } from '@/api/user_api';
import { type baseResponse } from '@/api/';
import { Message, type TableData, type TableColumnData } from '@arco-design/web-vue';
import { reactive, ref } from 'vue';
import { formatDate } from '@/utils/date';
import Fc_modal_form, { type formListType, type emitFnType } from '../admin/fc_modal_form.vue';
import { formToJSON } from 'axios';
import type { articleListRequest } from '@/api/article_api';
import { type optionsType } from '@/options/options';
import Fc_label from './fc_label.vue';
import type { logListParamsType } from '@/api/log_api';

const modalFormRef = ref<InstanceType<typeof Fc_modal_form>>();
const selectedKeys = ref([]);
const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true,
  onlyCurrent: false,
});

const loading = ref(false);
const isVisible = ref(false);
export interface columnType extends TableColumnData {
  title: string;
  slotName?: string;
  dataIndex?: string;
  dateFormat?: string;
  type?: 'date' | 'options' | 'switch';
  options?: optionsType[];
}
interface Props {
  url: (params?: any) => Promise<baseResponse<listResponse<any>>>;
  columns: TableColumnData[];
  rowKey?: string;
  noDefalutDelete?: boolean;
  noAdd?: boolean;
  noDelete?: boolean;
  noBatchDelete?: boolean;
  noEdit?: boolean;
  noDefaultGroup?: boolean;
  searchPlaceholder?: string;
  createLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  noCheck?: boolean;
  actionGroup?: actionGroupType[];
  filterGroup?: filterGroupType[];
  noPage?: boolean;
  limit?: number;
  formList?: formListType[];
  addFormLabel?: string;
  editFormLable?: string;
  defaultParams?: Object;
}
export interface filterGroupType {
  label: string;
  source: optionType[] | optionsFunc;
  column: string;
  options?: optionType[];
  params?: paramsType;
  callback?: (value: number | string) => void;
  width?: number;
}

const props = defineProps<Props>();

const data = reactive<listResponse<any>>({
  list: [],
  count: 0,
});

const pageChange = (page: number) => {
  params.key = '';
  getList(params);
};
const create = async (form: any, fn?: emitFnType) => {
  try {
    await defaultPost(form);
    Message.success('创建成功');
    if (fn) {
      fn(true);
    }
    getList(params);
  } catch (error) {
    if (fn) {
      fn(false);
    }
    console.log(error);
    return;
  }
};
console.log(props.editFormLable);

const update = async (form: any, fn?: emitFnType) => {
  try {
    console.log(form);
    await defaultPut(form);
    Message.success('更新成功');
    if (fn) {
      fn(true);
    }
    getList(params);
  } catch (error) {
    if (fn) {
      fn(false);
    }
    console.log(error);
    return;
  }
};

const filterGroups = ref<filterGroupType[]>([]);
async function initFilterGroups() {
  for (const f of props.filterGroup || []) {
    if (typeof f.source === 'function') {
      try {
        const res = await f.source(f.params || {});
        f.options = res.data;
      } catch (error) {
        console.log(error);
        return;
      }
    } else {
      f.options = f.source;
    }
    if (!f.callback) {
      f.callback = (value: number | string) => {
        const p: Record<string, any> = {};
        if (f.column) {
          p[f.column] = value;
        }
        console.log(p);
        getList(p);
      };
    }
    filterGroups.value.push(f);
  }
}
initFilterGroups();
export interface actionGroupType {
  label: string;
  value?: number;
  callback: (keyList: number[]) => void;
}

const {
  rowKey = 'id',
  noDefalutDelete = false,
  searchPlaceholder = '搜索',
  createLabel = '添加',
  editLabel = '编辑',
  deleteLabel = '删除',
  limit = 10,
} = props;

const params = reactive<paramsType>({
  limit: props.noPage ? -1 : limit,
});

const actionGroupOptions = ref<actionGroupType[]>([]);

const initActionGroup = () => {
  let index = 0;
  if (!props.noBatchDelete) {
    actionGroupOptions.value.push({
      label: '批量删除',
      value: 1,
      callback: (keyList: number[]) => {
        baseDelete(keyList);
        selectedKeys.value = [];
      },
    });
    index = 1;
  }
  index++;
  for (const action of props.actionGroup || []) {
    actionGroupOptions.value.push({
      label: '批量升级',
      value: index,
      callback: action.callback,
    });
  }
};
initActionGroup();
const getList = async (newParams?: paramsType) => {
  try {
    if (props.defaultParams) {
      Object.assign(params, props.defaultParams);
    }
    if (newParams) {
      Object.assign(params, newParams);
    }
    loading.value = true;
    const res = await props.url(params);
    console.log(res);
    loading.value = false;
    data.list = res.data.list;
    data.count = res.data.count;
  } catch (error) {
    console.log(error);
    return;
  }
};
getList(params);
const handleDelete = async (record: any) => {
  const key = record[rowKey];
  baseDelete([key]);
};

const baseDelete = async (keyList: number[]) => {
  if (noDefalutDelete) {
    emit('delete', keyList);
    return;
  }
  try {
    await defaultDelete(keyList);
    Message.success('删除成功');
    getList(params);
  } catch (error) {
    console.log(error);
    return;
  }
};
const rowClick = (record: TableData, ev: Event) => {
  emit('rowClick', record);
};

const emit = defineEmits<{
  delete: [id: number[] | string[]];
  add: [];
  edit: [record: any];
  rowClick: [record: any];
}>();

const add = () => {
  if (props.formList?.length) {
    isVisible.value = true;
  }
  emit('add');
};
const edit = (record: any) => {
  if (props.formList?.length) {
    console.log(record);
    modalFormRef.value?.setForm(record);
    isVisible.value = true;
  }
  emit('edit', record);
};

const handleSearch = (key: string) => {
  params.key = key;
  params.page = 1;
  getList(params);
};
const handleEdit = (row: any) => { };

const actionGroupValue = ref();
const handleActionGroup = () => {
  console.log(actionGroupValue.value);
  const action = actionGroupOptions.value.find((value) => value.value === actionGroupValue.value);
  console.log(action);
  if (action) {
    action.callback(selectedKeys.value);
  }
};
defineExpose({
  getList,
  data,
});
</script>

<style scoped lang="less">
.fc_list_com {
  background-color: @primary;

  .fc_list_head {
    padding: 20px 20px 10px 20px;
    border-bottom: @fc_border;
    display: flex;
    align-items: center;
    position: relative;

    .action_create,
    .action_group,
    .action_search,
    .action_search_slot {
      margin-right: 10px;
    }

    .action_group {
      align-items: center;
      display: flex;

      button {
        margin-left: 10px;
      }
    }

    .action_filter {
      display: flex;
      align-items: center;

      &> :nth-child(2) {
        margin-left: 20px !important;
      }

      &> :nth-child(3) {
        margin-left: 20px !important;
      }
    }

    .action_flush {
      position: absolute;
      right: 20px;
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--color-fill-2);
      border-radius: 5px;
      cursor: pointer;
    }
  }

  .fc_list_body {
    padding: 10px 20px 20px 20px;

    >.arco-spin {
      width: 100%;

      .fc_list_page {
        margin-top: 20px;
        display: flex;
        justify-content: center;
      }

      .fc_list_table {
        ::v-deep(.col_actions) {
          button {
            margin-right: 15px;
          }

          button:last-child {
            margin-right: 0;
          }
        }

        ::v-deep(.arco-table-pagination) {
          display: none !important;
        }
      }
    }
  }
}
</style>
