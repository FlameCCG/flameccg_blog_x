<template>
  <a-modal :visible="visible" @cancel="cancel" :title="isEdit ? seditLable ? seditLable : addLable : addLable"
    :on-before-ok="beforeOk">
    <a-form :model="form" ref="formRef">
      <template v-for="item in formList">
        <a-form-item :field="item.field" :label="item.label" :rules="item.rules"
          :validate-trigger="item.validateTrigger" v-if="!isEdit || (isEdit && !item.editDisabled)">
          <template v-if="item.type === 'input' || item.type === 'password'">
            <a-input v-model="form[item.field]" :placeholder="item.label"
              :type="item.type === 'input' ? 'text' : 'password'"></a-input>
          </template>
          <template v-else-if="item.type === 'select'">
            <a-select :multiple="item.multiple" v-model="form[item.field]" :placeholder="item.label"
              :options="item.options" allow-clear>
            </a-select>
          </template>
          <template v-else-if="item.type === 'switch'">
            <a-switch v-model="form[item.field]"></a-switch>
          </template>
          <template v-else-if="item.type === 'radio'">
            <a-radio-group v-model="form[item.field]" :options="item.options"></a-radio-group>
          </template>
          <template v-else-if="item.type === 'textarea'">
            <a-textarea v-model="form[item.field]" :placeholder="item.label"></a-textarea>
          </template>
          <template v-else>
            <slot :name="item.field" :form="form"></slot>
          </template>
          <template #help>
            <slot :name="`${item.field}_help`" :form="form"></slot>
          </template>
        </a-form-item>
      </template>
    </a-form>
    <template #footer>
      <slot name="footer" :form="form"></slot>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import type { optionType, optionsFunc } from '@/api';
import { FieldRule } from '@arco-design/web-vue';
import { reactive, ref } from 'vue';

export interface formListType {
  label: string;
  field: string;
  type: 'input' | 'textarea' | 'select' | 'switch' | 'radio' | "password" | "";
  validateTrigger?: ('focus' | 'input' | 'blur' | 'change')[];
  rules?: FieldRule<any>[];
  source?: optionType[] | optionsFunc
  options?: optionType[]
  autoSize?: boolean | {
    minRows?: number | undefined;
    maxRows?: number | undefined;
  };
  multiple?: boolean;
  editDisabled?: boolean;
}

interface Props {
  visible: boolean;
  formList: formListType[];
  addLable: string | undefined;    // 添加的时候显示的名字
  seditLable?: string;  // 编辑的时候显示的名字如果没有就用添加的名字
}

const isEdit = ref(false);

function setForm(formObj: any) {
  isEdit.value = true;
  Object.assign(form, formObj);
}
defineExpose({ setForm });

export type emitFnType = (val: boolean) => void;

const props = defineProps<Props>();
console.log(props.formList);
const emits = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
  (e: 'create', form: object, fn?: emitFnType): void;
  (e: 'update', form: object, fn?: emitFnType): void;
}>();


interface FormType {
  [key: string]: string | undefined;
}

const formList = ref<formListType[]>([]);
const initFrom = async () => {
  formList.value = [];
  for (const f of props.formList) {
    if (typeof f.source === 'function') {
      try {
        const res = await f.source()
        f.options = res.data;
      } catch (error) {
        console.log(error);
        return
      }
    } else {
      f.options = f.source;
    }
    formList.value.push(f);
  }
  console.log(formList.value);
}
initFrom();
console.log(props.seditLable);
const form = reactive<FormType>({});
function cancel() {
  formRef.value.resetFields();
  formRef.value.clearValidate();
  isEdit.value = false;
  emits('update:visible', false);
}

const formRef = ref();

const emitFn = (val: boolean) => {
  if (val) {
    cancel()
    return
  }
}
const beforeOk = async () => {
  const val = await formRef.value.validate();
  if (val) return;

  if (isEdit.value) {
    emits('update', form, emitFn);
  } else {
    emits('create', form, emitFn);
  }

};
</script>

<style scoped></style>
