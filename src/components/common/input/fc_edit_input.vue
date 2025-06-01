<template>
    <div class="fc-edit-input">
        <span v-if="!showEdit" :class="props.type">{{ props.value }}</span>
        <template v-else>
            {{ props.type }}
            <a-textarea v-if="props.type === 'textarea'" v-model="text" :placeholder="props.placeholder" @blur="
                inputBlur" @change="inputChange" ref="nicknameInputRef"
                :auto-size="{ minRows: 2, maxRows: 6 }"></a-textarea>
            <a-input v-else v-model="text" :placeholder="props.placeholder" ref="nicknameInputRef" @blur="inputBlur"
                @change="inputChange"></a-input>
        </template>
        <a-link class="edit-btn" href="javascript:void 0" @click="editClick" v-if="!props.noEdit">
            <IconEdit></IconEdit>编辑
        </a-link>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { nextTick, watch } from 'vue';
interface Props {
    value: string
    type?: "textarea"
    placeholder?: string
    noEdit?: boolean
}
const props = defineProps<Props>()
const showEdit = ref(false);
const emits = defineEmits(['ok'])
const editClick = () => {
    showEdit.value = true;
    nextTick(() => {
        nicknameInputRef.value.focus();
    });
};
const inputBlur = () => {
    showEdit.value = false;
    console.log(showEdit.value)
}
const inputChange = (val: string) => {
    emits('ok', val);
}
const nicknameInputRef = ref();
const text = ref("")
watch(() => props.value, (val) => {
    text.value = val;
}, { immediate: true })
</script>

<style lang="less">
.fc-edit-input {
    .edit-btn {
        margin-left: 5px;
    }

    span.textarea {
        white-space: break-spaces;
    }

    .arco-input-wrapper {
        width: fit-content;
    }

    .arco-textarea-wrapper {}
}
</style>