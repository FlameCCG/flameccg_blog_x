import { followApi, unfollowApi } from '@/api/focus_api';
import { showLogin } from '@/components/web/fc_login';
import { useUserStore } from '@/stores/user_store';
import { Message } from '@arco-design/web-vue';
const store = useUserStore();
export const focusService = async (isFocusing: boolean, userID: number) => {
  if (!store.isLogin) {
    showLogin();
  }
  if (isFocusing) {
    const res = await followApi({
      focusUserID: userID,
    });
    Message.success(res.msg);
  } else {
    const res = await unfollowApi({
      focusUserID: userID,
    });
    Message.success(res.msg);
  }
};
