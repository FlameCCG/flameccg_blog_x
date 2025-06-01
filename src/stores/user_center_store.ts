import { defineStore } from 'pinia';
import { userDetailApi, type UserDetailResType } from '@/api/user_api';
import { useUserStore } from './user_store';

interface UserDetailState {
  userDetail: UserDetailResType;
}
const store = useUserStore();

export const useUserCenterStore = defineStore('userCenterStore', {
  state: (): UserDetailState => {
    return {
      userDetail: {
        id: 0,
        createdAt: '',
        username: '',
        nickname: '',
        avatar: '',
        abstract: '',
        registerSource: 0,
        codeAge: 0,
        userID: 0,
        likeTags: [],
        updateUsernameDate: '',
        openCollect: false,
        openFans: false,
        openFollow: false,
        homeStyleID: 0,
        lookCount: 0,
        role: 0,
        email: '',
        usePassword: false,
      },
    };
  },
  actions: {
    async getUserDetail() {
      try {
        if (!store.isLogin) {
          return;
        }
        const res = await userDetailApi();
        Object.assign(this.userDetail, res.data);
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {},
});
