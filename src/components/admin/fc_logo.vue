<template>
    <div class="fc_logo" :class="{ collapsed: collapsed }">
        <img src="https://www.fengfengzhidao.com/image/logo.png" class="logo" alt="logo">
        <div class="slogan">
            <div>枫枫知道</div>
            <div>fengfengzhidao</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user_store';
import { collapsed } from './fc_menu';


</script>

<style scoped lang="less">
.fc_logo {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden; // 防止溢出内容影响布局

    .logo {
        width: 50px;
        height: 50px;
        transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); // 使用更平滑的缓动函数
    }

    .slogan {
        margin-left: 20px;
        transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        width: auto; // 确保宽度正确计算
        opacity: 1;
        white-space: nowrap; // 防止文字换行
    }

    &.collapsed {
        .slogan {
            transform: translateX(-20px);
            transform: scale(0);
            transform-origin: left;
            opacity: 0;
            width: 0;
            margin-left: 0;
        }

        .logo {
            transform: translateX(-2px); // 调整位置，使动画更自然
            width: 40px;
            height: 40px;
        }
    }
}
</style>@/stores/user_store