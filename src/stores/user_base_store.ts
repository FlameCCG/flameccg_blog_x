import { type userBaseInfoRes } from '@/api/user_api';
import { defineStore } from 'pinia';
import { userBaseInfo } from '@/api/user_api';
import { useUserStore } from './user_store';
const store = useUserStore();

interface userStoreType {
  userBaseInfo: userBaseInfoRes;
}

export const userBaseInfoStore = defineStore('userBaseStore', {
  state: (): userStoreType => ({
    userBaseInfo: {
      userID: 0,
      codeAge: 0,
      avatar: '',
      username: '',
      nickname: '',
      lookCount: 0,
      articleCount: 0,
      fansCount: 0,
      followCount: 0,
      place: '',
      openFollow: false,
      openFans: false,
      openCollect: false,
      homeStyleID: 0,
      relation: 0,
      role: 0,
    },
  }),
  actions: {
    async getUserBaseInfo(userID: number) {
      const res = await userBaseInfo(userID);
      Object.assign(this.userBaseInfo, res.data);
    },
  },
  getters: {
    isMe(): boolean {
      return store.userBaseInfo.userID === this.userBaseInfo.userID;
    },
  },
});
