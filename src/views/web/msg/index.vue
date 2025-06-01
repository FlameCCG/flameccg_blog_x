<template>
  <div class="msg_index_view">
    <fc_nav></fc_nav>
    <fc_main>
      <div class="head">
        <div class="title">消息中心</div>
        <div class="settings">
          <RouterLink :to="{ name: 'msgSettings' }" style="color: var(--color-text-2);">
            <IconSettings></IconSettings>
            消息设置
          </RouterLink>
        </div>
      </div>
      <div class="menu">
        <a-badge :count="userStore.noReadMsgInfo.commentMsgCount">
          <router-link :to="{ name: 'msgComment' }">评论和@</router-link>
        </a-badge>
        <a-badge :count="userStore.noReadMsgInfo.likeMsgCount">
          <router-link :to="{ name: 'msgLike' }">赞和收藏</router-link>
        </a-badge>
        <a-badge :count="userStore.noReadMsgInfo.privateMsgCount">
          <router-link :to="{ name: 'msgChat' }">私信</router-link>
        </a-badge>
        <a-badge :count="userStore.noReadMsgInfo.systemMsgCount">
          <router-link :to="{ name: 'msgSystem' }">系统通知</router-link>
        </a-badge>
      </div>
      <div class="body">
        <router-view></router-view>
      </div>
    </fc_main>
  </div>
</template>

<script setup lang="ts">
import Fc_nav from '@/components/web/fc_nav.vue';
import Fc_main from '@/components/web/fc_main.vue';
import { useUserStore } from '@/stores/user_store';
const userStore = useUserStore();
userStore.noReadMsg();
</script>

<style lang="less">
.msg_index_view {
  .fc_container {
    border-radius: var(--border-radius-medium);
    display: block;
  }

  .head {
    padding: 20px 20px 10px 20px;
    display: flex;
    justify-content: space-between;
    background-color: var(--color-bg-1);

    .title {
      font-size: 18px;
      color: var(--color-text-1);
    }

    .settings {
      color: var(--color-text-3);
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: rgb(var(--arcoblue-6));
      }
    }
  }

  .menu {
    background-color: var(--color-bg-1);
    border-bottom: 1px solid var(--color-border-2);
    padding: 10px 20px;

    >span {
      margin-right: 20px;

    }

    .arco-badge {
      .arco-badge-number {
        transform: translateY(-18px) translateX(10px) scale(0.7);
        top: 8px !important;
        right: -4px !important;
      }
    }

    a {
      color: var(--color-text-2);
      transition: color 0.2s;

      &.router-link-active {
        color: rgb(var(--arcoblue-6));
        font-weight: 500;
      }

      &:hover {
        color: rgb(var(--arcoblue-5));
      }
    }
  }

  .body {
    height: calc(100vh - 188px);
    overflow-y: hidden;
    background-color: var(--color-bg-1);
  }
}
</style>