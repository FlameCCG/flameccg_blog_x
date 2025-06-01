<script setup lang="ts">
import Fc_list from '@/components/common/fc_list.vue';
import { ref } from 'vue';
import { reactive } from 'vue';
import { logListApi, logReadApi, type LogListType } from '@/api/log_api';
import { type logListParamsType } from '@/api/log_api';
import { logLevelOptions } from '@/options/options.ts';
import Fc_user from '@/components/common/fc_user.vue';
import { Message } from '@arco-design/web-vue';
import { type columnType } from '@/components/common/fc_list.vue';
import { nextTick, h, createApp } from 'vue';
import VueJsonPretty from 'vue-json-pretty';
import { render } from 'nprogress';
const visible = ref(false);
const columnsDict: { [key: number]: columnType[] } = reactive({
  1: [
    { title: 'ID', dataIndex: 'id' },
    { title: '地址', slotName: 'addr' },
    { title: '用户名', dataIndex: 'username' },
    { title: '状态', slotName: 'loginStatus' },
    { title: '标题', slotName: 'title' },
    { title: '时间', slotName: 'createAt', type: 'date' },
    { title: '操作', slotName: 'action' },
  ],
  2: [
    { title: 'ID', dataIndex: 'id' },
    { title: '地址', slotName: 'addr' },
    { title: '用户', slotName: 'user' },
    { title: '等级', dataIndex: 'level', type: 'options', options: logLevelOptions },
    { title: '标题', slotName: 'title' },
    { title: '时间', slotName: 'createAt', type: 'date' },
    { title: '操作', slotName: 'action' },
  ],
  3: [
    { title: 'ID', dataIndex: 'id' },
    { title: '服务', dataIndex: 'serviceName' },
    { title: '标题', slotName: 'title' },
    { title: '等级', dataIndex: 'level', type: 'options', options: logLevelOptions },
    { title: '时间', slotName: 'createAt', type: 'date' },
    { title: '操作', slotName: 'action' },
  ],
});
const params = reactive({
  logType: 2,
});

function edit(record: any) { }
const fListRef = ref<InstanceType<typeof Fc_list>>();
function logTypeChange() {
  params.logType = Number(params.logType);
  fListRef.value?.getList(params);
}
const content = ref('');
async function logRead(record: LogListType) {
  if (!record.isRead) {
    try {
      await logReadApi(record.id);
      fListRef.value?.getList(params);
    } catch (error) {
      console.log(error);
    }
  }
  content.value = record.content;
  visible.value = true;
  nextTick(() => {
    const jsonList = document.querySelectorAll('.log_json_body');
    jsonList.forEach((value) => {
      const jsonData = (value as HTMLPreElement).innerText;
      try {
        const data = JSON.parse(jsonData);
        const vNode = h(VueJsonPretty, {
          data: data,
          deep: 3,
          showLine: false,
          showDoubleQuotes: false,
          highlightMouseoverNode: true,
          showLength: false,
          showSelectController: false,
          pathSelectable: false,
          pathChecked: [],
          themes: {
            key: '#3c82e6',
            keyQuote: '#3c82e6',
            valueQuote: '',
            string: '#42b983',
            number: '#e96900',
            boolean: '#fc5286',
            null: '#8d8d8d',
            bracket: '#8d8d8d',
            comma: '#8d8d8d',
            indent: '  ',
          },
        });
        const app = createApp({
          render: () => vNode,
        });
        // 挂载app
        app.mount(value);
      } catch (e) {
        console.error('JSON解析错误:', e);
      }
    });
  });
}
</script>
<template>
  <div class="log_body">
    <a-modal v-model:visible="visible" title="日志详情" :footer="false" body-class="log_modal_body scrollbar" width="40%">
      <div class="log-container" v-html="content" :class="`log_type_${params.logType}`"></div>
    </a-modal>
    <fc_list ref="fListRef" no-add @edit="edit" :default-params="params" :url="logListApi"
      :columns="columnsDict[Number(params.logType)]">
      <template #action_search>
        <a-radio-group v-model="params.logType" @change="logTypeChange">
          <a-radio :value="1">登录日志</a-radio>
          <a-radio :value="2">操作日志</a-radio>
          <a-radio :value="3">运行日志</a-radio>
        </a-radio-group>
      </template>
      <template #addr="{ record }: { record: LogListType }">
        {{ record.ip }} {{ record.addr }}
      </template>

      <template #user="{ record }: { record: LogListType }">
        <fc_user v-if="record.userId" :nickName="record.userNickname" :avatar="record.userAvatar"></fc_user>
      </template>

      <template #loginStatus="{ record }: { record: LogListType }">
        <a-tag v-if="record.loginStatus">登录成功</a-tag>
        <a-tag v-else>登录失败</a-tag>
      </template>
      <template #title="{ record }: { record: LogListType }">
        <a-link href="javascript:void(0)" :class="{ is_read: record.isRead }" @click="logRead(record)">{{ record.title
        }}</a-link>
      </template>
    </fc_list>
  </div>
</template>

<style lang="less">
.log_modal_body {
  padding: 20px;
  max-height: 75vh;
  overflow-y: auto;
  background-color: var(--color-bg-2);

  .log_type_2 {
    padding: 16px;
    border-radius: 10px;
    margin-bottom: 16px;
    position: relative;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid var(--color-border-2);
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    .log_request_header {
      margin-bottom: 16px;
      position: relative;

      &::after {
        content: '请求头信息';
        display: block;
        position: absolute;
        right: 12px;
        top: 8px;
        color: rgb(var(--arcoblue-6));
        font-size: 12px;
        font-weight: 500;
        background-color: rgb(var(--arcoblue-1));
        padding: 2px 8px;
        border-radius: 4px;
      }

      &::before {
        display: block;
        position: absolute;
        left: 12px;
        top: 8px;
        color: var(--color-text-3);
        font-size: 12px;
        font-weight: 500;
      }

    }

    .log_request {
      .log_request_head {
        margin-bottom: 18px;
        display: flex;
        align-items: center;

        .log_request_method {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          margin-right: 14px;
          font-weight: bold;
          font-family: monospace;
          font-size: 13px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          transform: translateY(-3px);

          &.get {
            background-color: rgb(var(--success-1));
            color: rgb(var(--success-6));
            border: 1px solid rgba(var(--success-6), 0.2);
          }

          &.post {
            background-color: rgb(var(--arcoblue-1));
            color: rgb(var(--arcoblue-6));
            border: 1px solid rgba(var(--arcoblue-6), 0.2);
          }

          &.put {
            background-color: rgb(var(--warning-1));
            color: rgb(var(--warning-6));
            border: 1px solid rgba(var(--warning-6), 0.2);
          }

          &.delete {
            background-color: rgb(var(--danger-1));
            color: rgb(var(--danger-6));
            border: 1px solid rgba(var(--danger-6), 0.2);
          }
        }

        .log_request_path {
          font-family: 'Fira Code', 'Courier New', Courier, monospace;
          color: #007acc;
          font-size: 14px;
          color: var(--color-text-1);
          font-weight: 500;
          border-bottom: 1px dashed var(--color-border-2);
          padding-bottom: 3px;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .log_request_body {
        position: relative;

        &::after {
          content: '请求体信息';
          display: block;
          position: absolute;
          right: 12px;
          top: 8px;
          color: rgb(var(--success-6));
          font-size: 12px;
          font-weight: 500;
          background-color: rgb(var(--success-1));
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid rgba(var(--success-6), 0.2);
        }
      }
    }

    .log_response {
      &::after {
        content: '响应体信息';
        display: block;
        position: absolute;
        right: 12px;
        top: 8px;
        color: rgb(var(--success-6));
        font-size: 12px;
        font-weight: 500;
        background-color: rgb(var(--success-1));
        padding: 2px 8px;
        border-radius: 4px;
        border: 1px solid rgba(var(--success-6), 0.2);
      }

      position: relative;
    }

    .log_json_body {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      white-space: pre-wrap;
      margin: 0;
      max-height: 220px;
      overflow-y: auto;
      background-color: var(--color-fill-1);
      padding: 14px;
      border-radius: 8px;
      color: var(--color-text-1);
      font-size: 13px;
      line-height: 1.6;
      border: 1px solid var(--color-border-2);
      scrollbar-width: thin;
      scrollbar-color: var(--color-text-3) transparent;

      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(var(--arcoblue-6), 0.3);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: rgba(var(--arcoblue-6), 0.6);
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }
    }

    .log_response_header {
      &::after {
        content: '响应头信息';
        display: block;
        position: absolute;
        right: 12px;
        top: 8px;
        color: rgb(var(--arcoblue-6));
        font-size: 12px;
        font-weight: 500;
        background-color: rgb(var(--arcoblue-1));
        padding: 2px 8px;
        border-radius: 4px;
        border: 1px solid rgba(var(--arcoblue-6), 0.2);
      }

      margin-bottom: 16px;
      position: relative;

      &::before {
        display: block;
        position: absolute;
        left: 12px;
        top: 8px;
        color: var(--color-text-3);
        font-size: 12px;
        font-weight: 500;
      }

      .log_json_body {
        margin-top: 10px; // 为标题腾出空间
      }
    }

    .vjs-tree {
      font-family:
        'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace !important;
      font-size: 13px;
      line-height: 1.6;

      .vjs-tree-node {
        cursor: pointer;
        position: relative;
        padding: 1px 3px;

        &:hover {
          background-color: rgba(var(--arcoblue-4), 0.3);
          border-radius: 3px;
        }
      }

      .vjs-key {
        color: #3c82e6;
        font-weight: 500;
      }

      .vjs-value-string {
        color: #42b983;
      }

      .vjs-value-number {
        color: #e96900;
      }

      .vjs-value-boolean {
        color: #fc5286;
      }

      .vjs-value-null {
        color: #8d8d8d;
      }

      .vjs-tree-brackets {
        color: #8d8d8d;
        font-weight: normal;
      }

      .vjs-indent-unit {
        width: 1.5em;

        &.has-line {
          border-left: 1px dashed rgba(var(--arcoblue-6), 0.3);
          height: 100%;

          &:hover {
            border-left: 1px solid rgba(var(--arcoblue-6), 0.8);
          }
        }
      }

      .vjs-carets {
        position: relative;
        margin-right: 3px;
        cursor: pointer;
        top: -1px;

        svg {
          fill: #3c82e6;
          transform-origin: center;
          transition: transform 0.2s ease;
        }

        &.is-close svg {
          transform: rotate(-90deg);
        }
      }
    }

    .log_item {
      padding: 16px;
      border-radius: 10px;
      margin: 16px 0;
      position: relative;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--color-border-2);
      transition: all 0.2s ease;
      display: flex;
      align-items: flex-start;
      background-color: var(--color-bg-2);

      &::after {
        content: '链接信息';
        display: inline-block;
        position: absolute;
        right: 8px;
        top: 8px;
        color: rgb(var(--arcoblue-6));
        font-size: 11px;
        font-weight: 600;
        background-color: rgb(var(--arcoblue-1));
        padding: 3px 8px;
        border-radius: 5px;
        border: 1px solid rgb(var(--arcoblue-2));
        line-height: 1.4;
      }
    }

    .log_item:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    .log_item_label {
      font-weight: 500;
      min-width: 120px;
      color: rgb(var(--arcoblue-6));
      padding: 4px 10px;
      background-color: rgb(var(--arcoblue-1));
      border-radius: 4px;
      margin-right: 16px;
      text-align: center;
      display: inline-block;
      border: 1px solid rgba(var(--arcoblue-6), 0.2);
    }

    .log_item_content {
      flex: 1;
      word-break: break-all;
    }

    .log_item.link .log_item_content a {
      color: rgb(var(--arcoblue-6));
      text-decoration: none;
      border-bottom: 1px dashed;
      transition: all 0.2s ease;
    }

    .log_item.link .log_item_content a:hover {
      color: rgb(var(--arcoblue-8));
      border-bottom: 1px solid;
    }

    /* Log image styling */
    .log_image {
      padding: 16px;
      border-radius: 10px;
      margin-bottom: 16px;
      position: relative;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--color-border-2);
      transition: all 0.2s ease;
      background-color: var(--color-bg-2);
    }

    .log_image:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    .log_image::after {
      content: '图片信息';
      display: block;
      position: absolute;
      right: 12px;
      top: 8px;
      color: rgb(var(--warning-6));
      font-size: 12px;
      font-weight: 500;
      background-color: rgb(var(--warning-1));
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid rgba(var(--warning-6), 0.2);
    }

    .log_image img {
      max-width: 100%;
      border-radius: 6px;
      margin-top: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--color-border-2);
    }

    /* Log error styling */
    .log_error {
      padding: 16px;
      border-radius: 10px;
      margin-bottom: 16px;
      position: relative;
      box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--color-border-2);
      transition: all 0.2s ease;
      background-color: var(--color-bg-2);
    }

    .log_error:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    .log_error::after {
      content: '错误信息';
      display: block;
      position: absolute;
      right: 12px;
      top: 8px;
      color: rgb(var(--danger-6));
      font-size: 12px;
      font-weight: 500;
      background-color: rgb(var(--danger-1));
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid rgba(var(--danger-6), 0.2);
    }

    .log_error .line {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid var(--color-border-2);
      margin-top: 16px;
    }

    .log_error .label {
      padding: 3px 8px;
      background-color: rgb(var(--danger-1));
      color: rgb(var(--danger-6));
      border-radius: 4px;
      font-weight: 500;
      font-size: 13px;
      margin-right: 12px;
      white-space: nowrap;
      border: 1px solid rgba(var(--danger-6), 0.2);
    }

    .log_error .value {
      flex: 1;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      color: var(--color-text-1);
      font-size: 13px;
      padding: 0 8px;
      border-right: 1px solid var(--color-border-2);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .log_error .type {
      color: var(--color-text-3);
      font-size: 12px;
      padding: 0 8px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      white-space: nowrap;
    }

    .log_error .stack {
      margin-top: 12px;
      padding: 14px;
      background-color: var(--color-fill-1);
      border-radius: 8px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 12px;
      line-height: 1.6;
      color: var(--color-text-2);
      white-space: pre-wrap;
      overflow-x: auto;
      border: 1px solid var(--color-border-2);
      max-height: 300px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--color-text-3) transparent;
    }

    .log_error .stack::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    .log_error .stack::-webkit-scrollbar-thumb {
      background: rgba(var(--danger-6), 0.3);
      border-radius: 3px;
    }

    .log_error .stack::-webkit-scrollbar-thumb:hover {
      background: rgba(var(--danger-6), 0.6);
    }

    .log_error .stack::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  .log-container.log_type_3 {
    background-color: #292929;
    border-radius: 6px;
    padding: 12px 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #e0e0e0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    margin: 12px 0;
    max-width: 100%;
    overflow: hidden;

    .log_time {
      text-align: right;
      font-size: 12px;
      color: #8a8a8a;
      margin: 10px 0;
      padding-bottom: 6px;
      border-bottom: 1px solid #3a3a3a;
    }

    .log_item {
      display: flex;
      padding: 8px 0;
      align-items: center;
      line-height: 1.5;

      &.info {
        color: #e0e0e0;

        .log_item_label {
          color: #e0e0e0;
        }
      }

      &.warning {
        color: #ffc107;

        .log_item_label {
          color: #ff9800;
        }
      }

      &.error {
        color: #ff5252;

        .log_item_label {
          color: #f44336;
        }
      }

      .log_item_label {
        flex: 0 0 auto;
        margin-right: 12px;
        font-weight: 500;
        position: relative;
        padding-right: 12px;

        &::after {
          content: ":";
          position: absolute;
          right: 0;
          color: #8a8a8a;
        }
      }

      .log_item_content {
        flex: 1;
        word-break: break-all;
      }
    }

    @media (max-width: 576px) {
      .log_item {
        flex-direction: column;
        align-items: flex-start;

        .log_item_label {
          margin-bottom: 4px;

          &::after {
            content: "";
          }
        }
      }
    }
  }
}

.is_read {
  color: var(--color-text-2);
  text-decoration: none;

  &:hover {
    color: rgb(var(--arcoblue-8));
    text-decoration: underline;
  }
}
</style>
