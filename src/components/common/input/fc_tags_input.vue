<template>
    <a-space wrap>
        <a-tag v-for="(tag, index) of tags" :key="tag" :closable="true" @close="handleRemove(tag)">
            {{ tag }}
        </a-tag>
        <a-input v-if="showInput" ref="inputRef" :style="{ width: '90px' }" size="mini" v-model.trim="inputVal"
            @keyup.enter="handleAdd" @blur="handleAdd" />
        <a-tag v-else :style="{
            width: '90px',
            backgroundColor: 'var(--color-fill-2)',
            border: '1px dashed var(--color-fill-3)',
            cursor: 'pointer',
        }" @click="handleEdit">
            <template #icon>
                <icon-plus />
            </template>
            Add Tag
        </a-tag>
    </a-space>
</template>


<script setup lang="ts">
import { watch } from 'vue';
import { ref, nextTick } from 'vue';
const tags = ref<string[]>([]);
interface Props {
    value?: string[]
}
const props = defineProps<Props>();
const emits = defineEmits(['ok'])

const inputRef = ref<HTMLInputElement | null>(null);
const showInput = ref(false);
const inputVal = ref('');

const handleEdit = () => {
    showInput.value = true;
    nextTick(() => {
        if (inputRef.value) {
            inputRef.value.focus();
        }
    });
};

watch(() => props.value, (val) => {
    console.log(val);
    if (val) {
        tags.value = JSON.parse(JSON.stringify(val));
    }
}, { immediate: true });

const handleAdd = () => {
    if (inputVal.value) {
        tags.value.push(inputVal.value);
        inputVal.value = '';
        emits('ok', tags.value);
    }
    showInput.value = false;
    console.log("handleAdd");
};

const handleRemove = (key: string) => {
    tags.value = tags.value.filter((tag) => tag !== key);
    console.log("handleRemove");
    emits('ok', tags.value);
};
</script>

<style scoped></style>