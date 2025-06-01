import { siteApi, type siteResponse } from '@/api/site_api';
import { defineStore } from 'pinia';
import { useUserStore } from './user_store';
interface siteInfoType {
  siteInfo: siteResponse;
}
const userStore = useUserStore();

export const useSiteStore = defineStore('site', {
  state: (): siteInfoType => ({
    siteInfo: {
      qiNiu: {
        enable: false,
      },
      ai: {
        enable: false,
      },
      siteInfo: {
        title: '',
        logo: '',
        filing: '',
        mode: 0,
      },
      project: {
        title: '',
        icon: '',
        webPath: '',
      },
      seo: {
        keywords: '',
        description: '',
      },
      about: {
        siteDate: '',
        qq: '',
        version: '',
        wechat: '',
        gitee: '',
        github: '',
        bilibili: '',
      },
      article: {
        noExamine: false,
        commentLine: 0,
      },
      login: {
        qqpLogin: false,
        usernamePwdLogin: false,
        emailLogin: false,
        captcha: false,
      },
      indexRight: {
        list: [],
      },
    } as siteResponse,
  }),
  actions: {
    async getSiteInfo() {
      const response = await siteApi('site');
      this.siteInfo = response.data;
    },
  },
});
