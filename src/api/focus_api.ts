import { useAxios, type baseResponse, type listResponse, type paramsType } from '.';

export interface followReq {
  focusUserID: number;
}

export const followApi = (data: followReq): Promise<baseResponse<string>> => {
  return useAxios.post('/focus', data);
};

export interface unfollowReq {
  focusUserID: number;
}
// type FocusUserRequest struct {
// 	FocusUserID uint `form:"focusUserID" binding:"required"`
// }
export const unfollowApi = (data: unfollowReq): Promise<baseResponse<string>> => {
  return useAxios.delete('/focus', {
    data,
  });
};
export interface focusAndFansReq extends paramsType {
  userID?: number;
  isMe: boolean;
}

export interface focusAndFansRes {
  userID: number;
  userNickname: string;
  userAvatar: string;
  userAbstract: string;
  createdAt: string;
  relationShip: number;
}
export const FocusListApi = (
  params: focusAndFansReq,
): Promise<baseResponse<listResponse<focusAndFansRes>>> => {
  if (params.isMe) {
    params.userID = undefined;
  }
  return useAxios.get('/focus/my_focus', { params });
};

export const FansApi = (
  params: focusAndFansReq,
): Promise<baseResponse<listResponse<focusAndFansRes>>> => {
  if (params.isMe) {
    params.userID = undefined;
  }
  return useAxios.get('/focus/my_fans', { params });
};
