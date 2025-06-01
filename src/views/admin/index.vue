<script setup lang="ts">
import Fc_menu from '@/components/admin/fc_menu.vue';
import Fc_screen from '@/components/common/fc_screen.vue';
import Fc_them from '@/components/common/fc_them.vue';
import { collapsed } from '@/components/admin/fc_menu';
import Fc_breadcrumb from '@/components/admin/fc_breadcrumb.vue';
import Fc_user_dropdown from '@/components/common/fc_user_dropdown.vue';
import Fc_tabs from '@/components/admin/fc_tabs.vue';
import Fc_logo from '@/components/admin/fc_logo.vue';
import { useUserStore } from '@/stores/user_store';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { nextTick } from 'vue';
import { watch } from 'vue';
const userStore = useUserStore();
const router = useRouter();
// 修改watch回调函数
// watch(() => collapsed.value, () => {
//   nextTick(() => {
//     setAsideTransition();
//   });
// });
// function setAsideTransition() {
//   const asideDom = document.querySelector(".fc_aside");
//   console.log(collapsed.value);
//   if (collapsed.value) {
//     if (asideDom) {
//       (asideDom as HTMLElement).style.transition = "width 0.2s cubic-bezier(0.34, 0.69, 0.1, 1)";
//       console.log("Transition applied:", (asideDom as HTMLElement).style.transition);
//     } else {
//       console.warn("Could not find .fc_aside element");
//     }
//   }
// }
</script>
<template>
  <div class="fc_admin">
    <div class="fc_aside" :class="{ collapsed: collapsed }">
      <Fc_logo></Fc_logo>
      <Fc_menu></Fc_menu>
    </div>
    <div class="fc_main" :class="{ collapsed: collapsed }">
      <div class="fc_head">
        <div class="fc_breadcrumbs">
          <Fc_breadcrumb></Fc_breadcrumb>
        </div>
        <div class="fc_actions">
          <icon-home @click="() => router.push({ name: 'home' })" />
          <Fc_them></Fc_them>
          <Fc_screen></Fc_screen>
          <Fc_user_dropdown></Fc_user_dropdown>
        </div>
      </div>
      <div class="fc_tabs">
        <Fc_tabs></Fc_tabs>
      </div>
      <div class="fc_container scrollbar">
        <router-view v-slot="{ Component }" class="fc_base_view">
          <transition name="fade-transform" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.fc_admin {
  display: flex;
  background-color: var(--color-bg-1);
  color: @color-text-1;

  .fc_aside {
    width: 240px;
    height: 100vh;
    overflow-y: hidden;
    overflow-x: hidden;
    transition: width 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
    background-color: var(--color-menu-light-bg);

    .fc_logo {
      width: 100%;
      height: 90px;
      border-bottom: @fc_border;
    }

    &.collapsed {
      width: 48px;
    }
  }

  .fc_aside {
    border-right: @fc_border;
  }

  .fc_main {
    width: calc(100% - 240px);
    transition: width 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);

    &.collapsed {
      width: calc(100% - 48px);
    }

    .fc_head {
      width: 100%;
      height: 60px;
      border-bottom: @fc_border;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;

      .fc_actions {
        display: flex;
        align-items: center;

        svg {
          cursor: pointer;
          margin-right: 15px;
          font-size: 18px;
        }
      }
    }

    .fc_tabs {
      width: 100%;
      height: 30px;
      border-bottom: @fc_border;
    }

    .fc_container {
      width: 100%;
      padding: 20px;
      height: calc(100vh - 90px);
      overflow-y: auto;
      overflow-x: hidden;
      background-color: @color-fill-2;
      position: relative;

      .fc_base_view {
        border-radius: 8px;
        border-radius: 5px;
        min-height: calc(100vh - 130px);
      }
    }
  }
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.zoom-fade-enter-active,
.zoom-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.zoom-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.zoom-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.flip-transform-enter-active,
.flip-transform-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  backface-visibility: hidden;
}

.flip-transform-enter-from {
  opacity: 0;
  transform: perspective(800px) rotateY(60deg);
}

.flip-transform-leave-to {
  opacity: 0;
  transform: perspective(800px) rotateY(-60deg);
}
</style>