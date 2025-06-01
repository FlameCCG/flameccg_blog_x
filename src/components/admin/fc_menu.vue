<template>
  <div class="fc_menu_com">
    <a-menu show-collapse-button v-model:collapsed="collapsed" @menu-item-click="menuItemClick"
      v-model:open-keys="openKeys" v-model:selected-keys="selectedKeys">
      <fc_menu_item :list="menuList"></fc_menu_item>
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import fc_menu_item from '@/components/admin/fc_menu_item.vue';
import { IconUser, IconHome, IconSettings } from '@arco-design/web-vue/es/icon';
import { type Component, ref, watch } from 'vue';
import { collapsed } from '@/components/admin/fc_menu.ts';
import router from '@/router';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user_store';
import { nextTick } from 'vue';
const userStore = useUserStore();
interface MenuType {
  title: string;
  name: string;
  icon?: string | Component;
  children?: MenuType[];
  role?: number
}

const menuItemClick = (name: string) => {
  console.log(name);
  router.push({ name });
};

const menuList: MenuType[] = [
  { title: '首页', name: 'home', icon: IconHome },
  {
    title: '个人中心',
    name: 'userCenter',
    icon: IconUser,
    children: [{ title: '个人信息', name: 'userInfo', icon: 'iconfont icon-yonghuxinxi' }],
  },
  {
    title: '用户管理',
    name: 'userManage',
    icon: 'iconfont icon-navicon-yhgl',
    role: 1,
    children: [{ title: '用户列表', name: 'userList', icon: 'iconfont icon-s_yonghuliebiao' }],
  },
  {
    title: '系统管理',
    name: 'settingsManage',
    icon: IconSettings,
    role: 1,
    children: [{
      title: '站点配置',
      name: 'siteConfig',
      icon: 'iconfont icon-zhandianpeizhi1',
      children: [{
        title: "网站设置",
        name: "websiteSetting",
        icon: "iconfont icon-wangzhan",
      },
      {
        title: "邮箱设置",
        name: "emailSetting",
        icon: "iconfont icon-youxiangpeizhi",
      },
      {
        title: "QQ设置",
        name: "qqSetting",
        icon: "iconfont icon-QQ-",
      },

      {
        title: "AI设置",
        name: "aiSetting",
        icon: "iconfont icon-aishezhi",
      },
      {
        title: "对象存储",
        name: "qiNiuSetting",
        icon: "iconfont icon-ossduixiangcunchu",
      },
      ]
    },
    {
      title: "日志列表", name: "logList", icon: "iconfont icon-rizhiliebiao"
    },
    {
      title: "Banner列表", name: "bannerList", icon: "iconfont icon-bannerliebiao1"
    }
    ],
  },
  {
    title: '文章管理',
    name: 'articleManage',
    icon: 'iconfont icon-navicon-wzgl',
    children: [
      { title: '文章列表', name: 'articleList', icon: 'iconfont icon-wenzhangliebiao' }
    ],
  },
];
const openKeys = ref<string[]>([]);
const selectedKeys = ref<string[]>([]);
const route = useRoute();
const initRoute = () => {
  console.log(route.matched);
  if (route.matched.length >= 3) {
    for (let i = 1; i < route.matched.length - 1; i++) {
      openKeys.value.push(route.matched[i].name as string);
    }
  }
  selectedKeys.value = [route.name as string];
};
watch(
  () => route.name,
  () => initRoute(),
  { immediate: false },
);
initRoute();

nextTick(() => {
  const menu = document.querySelector('.arco-menu-inner');
  if (menu) {
    menu.classList.add('scrollbar');
  }
})
const scrollbar = ref(false);
</script>


<style lang="less">
.fc_menu_com {
  .arco-menu {
    height: 100% !important;
    overflow-x: hidden;
    overflow-y: auto;
    margin-right: 20px;
  }

  height: calc(100vh - 90px);
}
</style>