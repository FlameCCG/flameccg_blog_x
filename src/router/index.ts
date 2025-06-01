import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress';
import { Message } from '@arco-design/web-vue';
import { useUserStore } from '@/stores/user_store';
import { useRouter } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/index.vue'),
      meta: {
        title: '首页',
        role: [1, 2, 3],
      },
      children: [
        {
          name: 'home',
          path: '',
          component: () => import('@/views/admin/home/index.vue'),
          meta: {
            title: '首页',
          },
        },

        // {
        //   name: 'userCenter',
        //   path: 'user_center',
        //   meta: {
        //     title: '个人中心',
        //     role: [1, 2, 3],
        //   },
        //   children: [
        //     {
        //       name: 'userInfo',
        //       path: 'user_info',
        //       component: () => import('@/views/admin/user_center/index.vue'),
        //       meta: {
        //         title: '个人信息',
        //       },
        //     },
        //   ],
        // },

        {
          name: 'userManage',
          path: 'user_manage',
          meta: {
            title: '用户管理',
            role: [1],
          },
          children: [
            {
              name: 'userList',
              path: 'user_list',
              component: () => import('@/views/admin/user_manage/index.vue'),
              meta: {
                title: '用户列表',
              },
            },
          ],
        },
        {
          name: 'articleManage',
          path: '',
          children: [
            {
              name: 'articleList',
              path: 'article_list',
              component: () => import('@/views/admin/aticle_manage/article_list.vue'),
              meta: {
                title: '文章列表',
              },
            },
          ],
        },
        {
          name: 'settingsManage',
          path: 'setting_manage',
          meta: {
            title: '系统管理',
            role: [1],
          },
          children: [
            {
              name: 'siteConfig',
              path: 'site_config',
              meta: {
                title: '站点配置',
              },
              children: [
                {
                  name: 'websiteSetting',
                  path: '',
                  component: () =>
                    import('@/views/admin/settings_manage/site_setting/web_setting.vue'),
                  meta: {
                    title: '网站设置',
                  },
                },
                {
                  name: 'emailSetting',
                  path: 'email_setting',
                  component: () =>
                    import('@/views/admin/settings_manage/site_setting/email_setting.vue'),
                  meta: {
                    title: '邮件设置',
                  },
                },
                {
                  name: 'qqSetting',
                  path: 'qq_setting',
                  component: () =>
                    import('@/views/admin/settings_manage/site_setting/qq_setting.vue'),
                  meta: {
                    title: 'QQ设置',
                  },
                },
                {
                  name: 'aiSetting',
                  path: 'ai_setting',
                  component: () =>
                    import('@/views/admin/settings_manage/site_setting/ai_setting.vue'),
                  meta: {
                    title: 'AI设置',
                  },
                },
                {
                  name: 'qiNiuSetting',
                  path: 'qi_niu_setting',
                  component: () =>
                    import('@/views/admin/settings_manage/site_setting/qiNiu_setting.vue'),
                  meta: {
                    title: '对象存储',
                  },
                },
              ],
            },
            {
              name: 'logList',
              path: 'log_list',
              component: () => import('@/views/admin/settings_manage/log_list.vue'),
            },
            {
              name: 'bannerList',
              path: 'banner_list',
              component: () => import('@/views/admin/settings_manage/banner_list.vue'),
            },
          ],
        },
      ],
    },
    {
      name: 'web',
      path: '/',
      component: () => import('@/views/web/index.vue'),
      children: [
        {
          name: 'webHome',
          path: '',
          component: () => import('@/views/web/weHome.vue'),
        },
        {
          name: 'userCenter',
          path: 'center',
          component: () => import('@/views/web/user_center/index.vue'),
          children: [
            {
              name: 'userInfo',
              path: 'user_info',
              component: () => import('@/views/web/user_center/info.vue'),
            },
            {
              name: 'userAccount',
              path: 'account',
              component: () => import('@/views/web/user_center/account.vue'),
            },
            {
              name: 'userLoginRecord',
              path: 'login_record',
              component: () => import('@/views/web/user_center/login_record.vue'),
            },
            {
              name: 'userPrivacy',
              path: 'user_privacy',
              component: () => import('@/views/web/user_center/privacy.vue'),
            },
            {
              name: 'userHomeSetting',
              path: 'user_home_setting',
              component: () => import('@/views/web/user_center/home_setting.vue'),
            },
            // 用户浏览历史
            {
              name: 'userBrowseHistory',
              path: 'user_browse_history',
              component: () => import('@/views/web/user_center/history.vue'),
            },
          ],
        },
        {
          name: 'article',
          path: 'article/:id',
          component: () => import('@/views/web/article/index.vue'),
        },
        {
          name: 'platform',
          path: 'platform',
          component: () => import('@/views/web/platform/index.vue'),
          children: [
            {
              name: 'platformArticle',
              path: 'article',
              component: () => import('@/views/web/platform/platform_article.vue'),
            },
            {
              name: 'platformArticleAdd',
              path: 'article_add',
              component: () => import('@/views/web/platform/platform_article_add.vue'),
            },
            {
              name: 'platformArticleEdit',
              path: 'article_edit/:id',
              component: () => import('@/views/web/platform/platform_article_edit.vue'),
            },
            {
              name: 'platformComment',
              path: 'comment',
              component: () => import('@/views/web/platform/comment/index.vue'),
              redirect: '/platform/comment/article',
              children: [
                {
                  name: 'platformCommentArticle',
                  path: 'article',
                  component: () => import('@/views/web/platform/comment/article_comment.vue'),
                },
                {
                  name: 'platformCommentMy',
                  path: 'me',
                  component: () => import('@/views/web/platform/comment/my_comment.vue'),
                },
              ],
            },
          ],
        },
        {
          name: 'user',
          path: 'user/:id',
          component: () => import('@/views/web/user/index.vue'),
          redirect: '/user/:id/article',
          children: [
            {
              name: 'userArticle',
              path: 'article',
              component: () => import('@/views/web/user/article_list.vue'),
            },
            {
              name: 'userCollect',
              path: 'collect',
              component: () => import('@/views/web/user/collect_list.vue'),
            },
            {
              name: 'userFollow',
              path: 'follow',
              component: () => import('@/views/web/user/follow_list.vue'),
            },
            {
              name: 'userFans',
              path: 'fans',
              component: () => import('@/views/web/user/fans_list.vue'),
            },
          ],
        },
        {
          name: 'msg',
          path: 'msg',
          component: () => import('@/views/web/msg/index.vue'),
          children: [
            {
              name: 'msgComment',
              path: 'comment',
              component: () => import('@/views/web/msg/comment.vue'),
            },
            {
              name: 'msgLike',
              path: 'like',
              component: () => import('@/views/web/msg/digg.vue'),
            },
            {
              name: 'msgChat',
              path: 'chat',
              component: () => import('@/views/web/msg/chat.vue'),
            },
            {
              name: 'msgSystem',
              path: 'system',
              component: () => import('@/views/web/msg/system.vue'),
            },
            {
              name: 'msgSettings',
              path: 'settings',
              component: () => import('@/views/web/msg/settings.vue'),
            },
          ],
        },
      ],
      meta: {
        title: '首页',
        role: [1, 2, 3],
      },
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: 'adminLogin',
      },
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/test1',
      name: 'test',
      component: () => import('@/views/test/image_cut.vue'),
    },
    {
      path: '/:catchAll(.*)*',
      name: 'notFound',
      component: () => import('@/views/404/index.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  NProgress.start(); // 开启进度条
  const userStore = useUserStore();
  userStore.loadUserInfo();
  if (to.name === 'login') {
    if (userStore.isLogin) {
      next({ name: 'home' });
    }
  }
  if (to.meta.role) {
    if (!userStore.isLogin && to.name === 'home') {
      if (from.name === 'login') {
        return;
      }
      Message.error('请先登录');
      next({ name: 'login', query: { redirect: to.fullPath } });
      return;
    }

    if (!to.meta.role.includes(userStore.userBaseInfo.role) && to.name === 'admin') {
      Message.error('没有权限访问该页面');
      next({ name: 'home' });
      return;
    }
  }
  next();
});

router.afterEach(() => {
  // 在和将进入的页面组件更新后...
  NProgress.done(); // 完成进度条
});

export default router;
