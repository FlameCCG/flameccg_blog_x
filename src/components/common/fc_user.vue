<template>
    <div class="fc_user_com">
        <a-avatar :image-url="props.avatar" :size="size"></a-avatar>
        <span style="margin-left: 2px;" class="text">{{ props.nickName }}</span>
    </div>
</template>

<script setup lang="ts">
interface Props {
    avatar: string;
    nickName: string;
    size?: number;
}
const props = defineProps<Props>();
const { size = 40 } = props;
</script>

<style scoped></style>