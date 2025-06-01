import { useAxios, type baseResponse, type listResponse, type paramsType } from '.';

export interface chatListAndUserRes {
  id: number;
  createAt: string;
  updateAt: string;
  senderUserID: number;
  receiverUserID: number;
  msgType: number;
  msg: msgType;
  sendUserNickname: string;
  sendUserAvatar: string;
  revUserAvatar: string;
  isMe: boolean;
  isRead: boolean;
  isDeleted: boolean;
}

export interface chatListReq extends paramsType {
  senderUserID?: number;
  revUserID: number;
  type: number; // 1前台普通用户调的 2后台管理员调的
}

// 与用户的对话列表
export const chatListApi = (
  params: chatListReq,
): Promise<baseResponse<listResponse<chatListAndUserRes>>> => {
  return useAxios.get('/chat', { params });
};
// 删除与用户的对话
export const removeUserSession = (id: number): Promise<baseResponse<string>> => {
  return useAxios.delete('/chat/user/' + id);
};
// 读取消息
export const readChat = (id: number): Promise<baseResponse<string>> => {
  return useAxios.post('/chat/read/' + id);
};

export const removeMessage = (ids: number): Promise<baseResponse<string>> => {
  return useAxios.delete('/chat', { data: ids });
};

export interface mySessionListRes {
  userID: number;
  userNickname: string;
  userAvatar: string;
  msg: msgType;
  msgType: number;
  newMsgDate: string;
  relation: number;
}

// 我的会话列表
export const mySessionListApi = (
  params?: paramsType,
): Promise<baseResponse<listResponse<mySessionListRes>>> => {
  return useAxios.get('/session', { params });
};

export interface msgType {
  textMsg: textMsg;
  imageMsg?: imageMsg;
  markdownMsg?: markdownMsg;
  msgReadMsg?: msgReadMsg;
}
// 文本消息接口
interface textMsg {
  content: string;
}
// 图片消息接口
interface imageMsg {
  src: string;
}
// Markdown 消息接口
interface markdownMsg {
  content: string;
}
// 已读消息接口
interface msgReadMsg {
  readChatID: number;
}
export interface realTimeChatReq {
  revUserId: number;
  msgType: number; // 1 文本消息 2 图片消息 3 md消息 11 已读消息
  msg: msgType;
}
