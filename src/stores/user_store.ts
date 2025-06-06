import { adminLogin, userLogin } from '@/api/user_api';
import { defineStore } from 'pinia';
import router from '@/router';
import { Message, Notification } from '@arco-design/web-vue';
import { userBaseInfo } from '@/api/user_api';
import { jsonStr } from '@/utils/decode';
import { noReadMsgCountApi, type noReadMsgCountRes, type siteResponse } from '@/api/site_api';
import type { chatListAndUserRes } from '@/api/chat_api';
import type { baseResponse } from '@/api';
interface userBaseInfoType {
  userID: number;
  codeAge: number;
  avatar: string;
  username: string;
  fansCount: number;
  followCount: number;
  token: string;
  role: number;
  articleCount: number;
  openFollow: boolean;
  openFans: boolean;
  openCollect: boolean;
  lookCount: number;
  place: string;
  homeStyleID: number;
}

interface userStoreType {
  userBaseInfo: userBaseInfoType;
  noReadMsgInfo: noReadMsgCountRes;
  ws: WebSocket | null;
  wsChatList: chatListAndUserRes[];
}

export const useUserStore = defineStore('userStore', {
  state: (): userStoreType => ({
    userBaseInfo: {
      userID: 0,
      fansCount: 0,
      followCount: 0,
      articleCount: 0,
      token: '',
      codeAge: 0,
      avatar: '',
      username: '',
      role: 0,
      openFollow: false,
      openFans: false,
      openCollect: false,
      lookCount: 0,
      place: '',
      homeStyleID: 0,
    },
    noReadMsgInfo: {
      commentMsgCount: 0,
      likeMsgCount: 0,
      privateMsgCount: 0,
      systemMsgCount: 0,
    },
    ws: null,
    wsChatList: [],
  }),
  actions: {
    async login(loginForm: any) {
      const res = await userLogin({
        val: loginForm.val,
        pwd: loginForm.pwd,
        captchaID: loginForm.captchaID,
        captchaCode: loginForm.captchaCode,
      });

      // Base64 解码 + UTF-8 兼容
      const token = res.data.token;
      const payloadBase64 = token.split('.')[1];
      console.log(payloadBase64);
      const user = JSON.parse(jsonStr(payloadBase64));
      console.log(user);
      const isExpired = this.tokenIsExpired(user);
      if (!isExpired) {
        this.userBaseInfo.token = token;
        this.userBaseInfo.role = user.role;
        await this.setUserInfo(user.user_id);
        Message.success('登录成功');
      }
    },
    async adminLogin(loginForm: any) {
      const res = await adminLogin({
        val: loginForm.val,
        pwd: loginForm.pwd,
      });
      // Base64 解码 + UTF-8 兼容
      const token = res.data.token;
      const payloadBase64 = token.split('.')[1];
      const user = JSON.parse(jsonStr(payloadBase64));
      const isExpired = this.tokenIsExpired(user);
      if (!isExpired) {
        this.userBaseInfo.token = token;
        this.userBaseInfo.role = user.role;
        await this.setUserInfo(user.user_id);
        Message.success('登录成功');
      }
    },
    tokenIsExpired(user: any): boolean {
      // 判断token是否过期
      if (Date.now() > user.exp * 1000) {
        Message.error('登录过期，请重新登录');
        router.push({ name: 'login' });
        return true;
      }
      return false;
    },
    async setValue(userID: number) {
      try {
        const res = await userBaseInfo(userID);
        Object.assign(this.userBaseInfo, res.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async setUserInfo(userID: number) {
      await this.setValue(userID);
      localStorage.setItem('userBaseInfo', JSON.stringify(this.userBaseInfo));
      this.initWs();
    },
    async loadUserInfo(userID?: number) {
      const val = localStorage.getItem('userBaseInfo');
      if (!val) return;
      try {
        this.userBaseInfo = JSON.parse(val);
        if (userID) {
          await this.setValue(userID);
          return;
        }
        await this.setValue(this.userBaseInfo.userID);
        // 判断token是否过期
        if (this.userBaseInfo.token) {
          const payloadBase64 = this.userBaseInfo.token.split('.')[1];
          const user = jsonStr(payloadBase64);
          if (user && typeof user === 'string') {
            const userData = JSON.parse(user);
            if (Date.now() > userData.exp * 1000) {
              Message.error('登录过期，请重新登录');
              router.push({ name: 'login' });
              this.logout();
              return;
            }
          }
        }
        this.initWs();
      } catch (e) {
        console.error('加载用户信息失败:', e);
        localStorage.removeItem('userBaseInfo');
      }
    },
    async noReadMsg() {
      if (!this.isLogin) return;
      const res = await noReadMsgCountApi();
      Object.assign(this.noReadMsgInfo, res.data);
    },
    initWs() {
      // 如果已存在 ws 且是 OPEN 状态，则不重复连接
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        return;
      }
      // 如果 ws 实例存在但非 OPEN，尝试关闭旧连接
      if (this.ws) {
        this.ws.close();
      }
      this.ws = new WebSocket(
        `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws/api/chat/ws?token=${this.userBaseInfo.token}`,
      );
      this.ws.onopen = () => {
        console.log('ws连接成功');
      };

      this.ws.onmessage = (event) => {
        const res = JSON.parse(event.data) as baseResponse<chatListAndUserRes>;
        if (res.code === 1001) {
          Message.info(res.msg);
          return;
        }
        if (!res.data.isMe) {
          // 我是接收方
          const userID = Number(router.currentRoute.value.query.userID);
          if (userID !== res.data.senderUserID) {
            Notification.info({
              title: '新消息',
              content: '你有一条新消息',
            });
            return;
          }
        }
        this.wsChatList = [];
        this.wsChatList.push(res.data);
      };
      this.ws.onclose = () => {
        console.log('ws连接断开');
      };
      this.ws.onerror = (event) => {
        console.log('ws连接出错', event);
      };
    },
    logout() {
      this.userBaseInfo = {
        userID: 0,
        fansCount: 0,
        token: '',
        codeAge: 0,
        avatar: '',
        username: '',
        role: 0,
        openFollow: false,
        openFans: false,
        openCollect: false,
        articleCount: 0,
        followCount: 0,
        lookCount: 0,
        place: '',
        homeStyleID: 0,
      };
      localStorage.removeItem('userBaseInfo');
      router.push({ name: 'login' });
    },
    webLogout() {
      this.userBaseInfo = {
        userID: 0,
        fansCount: 0,
        token: '',
        codeAge: 0,
        role: 0,
        openFollow: false,
        openFans: false,
        openCollect: false,
        avatar: '',
        username: '',
        articleCount: 0,
        followCount: 0,
        lookCount: 0,
        place: '',
        homeStyleID: 0,
      };
      localStorage.removeItem('userBaseInfo');
      router.push({ name: 'webHome' });
    },
  },
  getters: {
    isLogin(): boolean {
      return !!this.userBaseInfo.token;
    },
    isAdmin(): boolean {
      return this.userBaseInfo.role === 1;
    },
    noReadMsgAllCount(): number {
      return (
        this.noReadMsgInfo.commentMsgCount +
        this.noReadMsgInfo.likeMsgCount +
        this.noReadMsgInfo.privateMsgCount +
        this.noReadMsgInfo.systemMsgCount
      );
    },
  },
});
