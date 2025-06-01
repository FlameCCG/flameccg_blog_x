<template>
  <div class="fc_quick_entrance">
    <Fc_card title="快捷入口" class="quick_entry">
      <div class="quick_items">
        <div class="item" v-for="item in list" @click="goRouter(item)">
          <div class="icon">
            <Fc_component :is="item.icon"></Fc_component>
          </div>
          <div class="label">{{ item.label }}</div>
        </div>
      </div>
    </Fc_card>
  </div>
</template>

<script setup lang="ts">
import Fc_card from '@/components/common/fc_card.vue';
import { type Component, ref } from 'vue';
import { IconHome, IconUser } from '@arco-design/web-vue/es/icon';
import Fc_component from '../common/fc_component.vue';
import router from '@/router';
interface quickType {
  label: string;
  icon: string | Component;
  name: string;
}
// { title: '首页', name: 'home', icon: IconHome },
//   {
//     title: '个人中心',
//     name: 'userCenter',
//     icon: IconUser,
//     children: [{ title: '个人信息', name: 'userInfo', icon: 'iconfont icon-yonghuxinxi' }],
//   },
//   {
//     title: '用户管理',
//     name: 'userManage',
//     icon: 'iconfont icon-navicon-yhgl',
//     role: 1,
//     children: [{ title: '用户列表', name: 'userList', icon: 'iconfont icon-s_yonghuliebiao' }],
//   },
//   {
//     title: '系统管理',
//     name: 'settingsManage',
//     icon: IconSettings,
//     role: 1,
//     children: [{
//       title: '站点配置',
//       name: 'siteConfig',
//       icon: 'iconfont icon-zhandianpeizhi1',
//       children: [{
//         title: "网站设置",
//         name: "websiteSetting",
//         icon: "iconfont icon-wangzhan",
//       },
//       {
//         title: "邮箱设置",
//         name: "emailSetting",
//         icon: "iconfont icon-youxiangpeizhi",
//       },
//       {
//         title: "QQ设置",
//         name: "qqSetting",
//         icon: "iconfont icon-QQ-",
//       },

//       {
//         title: "AI设置",
//         name: "aiSetting",
//         icon: "iconfont icon-aishezhi",
//       },
//       {
//         title: "对象存储",
//         name: "qiNiuSetting",
//         icon: "iconfont icon-ossduixiangcunchu",
//       },
//       ]
//     },
//     {
//       title: "日志列表", name: "logList", icon: "iconfont icon-rizhiliebiao"
//     },
//     {
//       title: "Banner列表", name: "bannerList", icon: "iconfont icon-bannerliebiao1"
//     }
//     ],
//   },
//   {
//     title: '文章管理',
//     name: 'articleManage',
//     icon: 'iconfont icon-navicon-wzgl',
//     children: [
//       { title: '文章列表', name: 'articleList', icon: 'iconfont icon-wenzhangliebiao' }
//     ],
//   },

const list: quickType[] = [
  { label: '首页', icon: IconHome, name: 'home' },
  { label: '个人中心', icon: IconUser, name: 'userInfo' },
  { label: '用户列表', icon: 'iconfont icon-s_yonghuliebiao', name: 'userList' },
  { label: '文章列表', icon: 'iconfont icon-wenzhangliebiao', name: 'articleList' },
  { label: '日志列表', icon: 'iconfont icon-rizhiliebiao', name: 'logList' },
  { label: '对象存储', icon: 'iconfont icon-ossduixiangcunchu', name: 'qiNiuSetting' },
  { label: '邮箱设置', icon: 'iconfont icon-youxiangpeizhi', name: 'emailSetting' },
  { label: 'QQ设置', icon: 'iconfont icon-QQ-', name: 'qqSetting' },
  { label: 'AI设置', icon: 'iconfont icon-aishezhi', name: 'aiSetting' },
  { label: '网站设置', icon: 'iconfont icon-wangzhan', name: 'websiteSetting' },
];
const goRouter = (item: quickType) => {
  router.push({ name: item.name });
};
</script>

<style scoped lang="less">
.fc_quick_entrance {
  ::v-deep(.body) {
    padding: 15px;

    .quick_items {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      row-gap: 16px;
    }

    .item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);

        .icon {
          background-color: var(--color-primary-light-1);
          color: var(--color-primary);
          box-shadow: 0 6px 12px rgba(var(--primary-6), 0.2);
        }

        .label {
          color: var(--color-text-1);
        }
      }

      .icon {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        background-color: var(--color-fill-2);
        color: var(--color-text-2);
        transition: all 0.3s ease;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      }

      .label {
        margin-top: 8px;
        color: var(--color-text-2);
        font-size: 14px;
        transition: color 0.3s ease;
      }
    }
  }
}
</style>
