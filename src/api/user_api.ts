import { extend } from 'dayjs';
import {
  useAxios,
  type listResponse,
  type optionType,
  type paramsType,
  type baseResponse,
} from './index';

export interface userBaseInfoRes {
  userID: number;
  codeAge: number;
  avatar: string;
  username: string;
  nickname: string;
  lookCount: number;
  articleCount: number;
  fansCount: number;
  followCount: number;
  place: string;
  openFollow: boolean;
  openFans: boolean;
  openCollect: boolean;
  homeStyleID: number;
  relation: number; // 1 陌生人 双方都没有关注   // 2 已关注 关注了对方，但是对方没有关注你   // 3 粉丝 对方关注了你   // 4 好友 双方互关
  role: number;
}

export const userBaseInfo = (userID: number): Promise<baseResponse<userBaseInfoRes>> => {
  return useAxios.get('/user/base_info', { params: { id: userID } });
};

export function userLogin(param: {
  val: string;
  pwd: string;
  captchaID?: string;
  captchaCode?: string;
}): Promise<baseResponse<any>> {
  return useAxios.post('/user/pwd_login', param);
}
export function adminLogin(param: { val: string; pwd: string }): Promise<baseResponse<any>> {
  return useAxios.post('/user/admin_pwd_login', param);
}

export interface captchaResponse {
  captchaID: string;
  captchaB64: string;
}
export const captchaApi = (): Promise<baseResponse<captchaResponse>> => {
  return useAxios.get('/captcha');
};

export const articleCategoryOptions = (param?: paramsType): Promise<baseResponse<optionType[]>> => {
  return useAxios.get('/article/category_options', { params: param });
};

export const userList = (
  params?: paramsType,
): Promise<baseResponse<listResponse<userListType>>> => {
  return useAxios.get('/user/list', { params });
};

const defaultDeleteAPI = '/users';
export const defaultDelete = (ids: number[]): Promise<baseResponse<string>> => {
  return useAxios.delete(defaultDeleteAPI, { data: { ids } });
};

const defaultAdminCreateUserAPI = '/user/adminCreate';
export const defaultPost = (data: any): Promise<baseResponse<string>> => {
  console.log(data);
  return useAxios.post(defaultAdminCreateUserAPI, data);
};

const adminUpdateUserInfoAPI = '/user/admin_update_info';
export const defaultPut = (data: any): Promise<baseResponse<string>> => {
  return useAxios.put(adminUpdateUserInfoAPI, data);
};

export interface sendEmailReq {
  captchaID: string;
  captchaCode: string;
  type: number; // 2: 注册
  email: string;
}

export interface sendEmailRes {
  emailID: string;
}
export const sendEmailApi = (form: sendEmailReq): Promise<baseResponse<sendEmailRes>> => {
  return useAxios.post('/user/send_mail', form);
};

export interface mailRegisterReq {
  username: string;
  pwd: string;
  captchaID: string;
  captchaCode: string;
}

export interface mailRegisterRes {
  emailID: string;
}
export const mailRegisterApi = (form: mailRegisterReq): Promise<baseResponse<mailRegisterRes>> => {
  return useAxios.post('/user/mail_register', form);
};

export interface userResetPwdReq {
  pwd: string;
  captchaID: string;
  captchaCode: string;
}
export const userResetPwdApi = (form: userResetPwdReq): Promise<baseResponse<string>> => {
  return useAxios.put('/user/reset_pwd', form);
};

export interface userListType {
  id: number;
  nickname: string;
  username: string;
  avatar: string;
  articleCount: number;
  fansCount: number;
  focusCount: number;
  indexCount: number;
  ip: string;
  addr: string;
  createdAt: string;
  lastLoginAt: string;
  role: number;
}

export interface UserDetailResType {
  id: number;
  createdAt: string;
  username: string;
  nickname: string;
  avatar: string;
  abstract: string;
  registerSource: number;
  codeAge: number;
  userID: number;
  likeTags: string[];
  updateUsernameDate: string;
  openCollect: boolean;
  openFans: boolean;
  openFollow: boolean;
  homeStyleID: number;
  lookCount: number;
  role: number;
  email: string;
  usePassword: boolean;
}
export const userDetailApi = (): Promise<baseResponse<UserDetailResType>> => {
  return useAxios.get('/user/detail');
};

export interface UserUpdateInfoResqType {
  username?: string;
  nickname?: string;
  avatar?: string;
  abstract?: string;
  likeTags?: string[];
  openCollect?: boolean;
  openFans?: boolean;
  openFollow?: boolean;
  homeStyleID?: number;
}

export const userUpdateInfoApi = (form: UserUpdateInfoResqType): Promise<baseResponse<string>> => {
  return useAxios.put('/user/update_info', form);
};

export interface UserUpdatePwdResqType {
  oldPassword: string;
  newPassword: string;
}

export const userUpdatePwdApi = (form: UserUpdatePwdResqType): Promise<baseResponse<string>> => {
  return useAxios.put('/user/update_pwd', form);
};
// user/email_bind
export interface UserEmailBindReqType {
  captchaID: string;
  captchaCode: string;
}
export const userEmailBindApi = (form: UserEmailBindReqType): Promise<baseResponse<string>> => {
  return useAxios.put('/user/email_bind', form);
};

export interface UserLoginListRespType {
  id: number;
  createAt: string;
  updateAt: string;
  user_id: number;
  ip: string;
  addr: string;
  ua: string;
}
export interface loginListResqType extends paramsType {
  userID?: number;
  ip?: string;
  addr?: string;
  startTime?: string; // 字符串格式的时间戳（10 位）
  endTime?: string;
  type: 1 | 2; // 1 用户 2 管理员
}

export const userLoginListApi = (
  params?: loginListResqType,
): Promise<baseResponse<listResponse<UserLoginListRespType>>> => {
  return useAxios.get('/user/login_list', { params });
};

export interface userArticleTopRequest {
  articleID: number;
  type: number; // 1 普通用户置頂 2 管理员置頂
}
export function userArticleTopApi(params: userArticleTopRequest): Promise<baseResponse<string>> {
  return useAxios.post('/user/topping_article', params);
}

export interface authorRecommendRes {
  userID: number;
  userNickName: string;
  userAbstract: string;
  userAvatar: string;
}

export function authorRecommendApi(params: paramsType): Promise<baseResponse<authorRecommendRes>> {
  return useAxios.get('/user/authorRecommend');
}
