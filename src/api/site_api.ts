import { type baseResponse, useAxios } from './';
export interface indexRightType {
  title: string;
  enable: boolean;
}
export interface siteResponse {
  qiNiu: {
    enable: boolean;
  };
  ai: {
    enable: boolean;
  };
  siteInfo: {
    title: string;
    logo: string;
    filing: string;
    mode: number;
  };
  project: {
    title: string;
    icon: string;
    webPath: string;
  };
  seo: {
    keywords: string;
    description: string;
  };
  about: {
    siteDate: string;
    qq: string;
    version: string;
    wechat: string;
    gitee: string;
    github: string;
    bilibili: string;
  };
  article: {
    noExamine: boolean;
    commentLine: number;
  };
  login: {
    qqpLogin: boolean;
    usernamePwdLogin: boolean;
    emailLogin: boolean;
    captcha: boolean;
  };
  indexRight: {
    list: { title: string; enable: boolean }[];
  };
}

export type siteName = 'site' | 'email' | 'qq' | 'qiNiu' | 'ai';

export interface aiResponse {
  enable: true;
  nickName: string;
  chatGPTSecret: string;
  deepSeekSecret: string;
  avatar: string;
  abstract: string;
}
export interface emailResponse {
  domain: string;
  port: number;
  sendEmail: string;
  authCode: string;
  sendNickName: string;
  ssl: boolean;
  tls: boolean;
}
export interface qqResponse {
  appID: string;
  appKey: string;
  redirect: string;
}
export interface qiNiuResponse {
  enable: true;
  accessKey: string;
  secretKey: string;
  bucket: string;
  region: string;
  uri: string;
  prefix: string;
  maxSize: number;
  expire: number;
}

interface siteBaseResponse {
  site: siteResponse;
  email: emailResponse;
  qq: qqResponse;
  qiNiu: qiNiuResponse;
  ai: aiResponse;
}
export function siteApi<T extends siteName>(name: T): Promise<baseResponse<siteBaseResponse[T]>> {
  return useAxios.get(`/site/${name}`);
}

export function siteUpdate<T extends siteName>(
  name: T,
  data: siteBaseResponse[T],
): Promise<baseResponse<string>> {
  return useAxios.put(`/site/${name}`, data);
}

export interface qiNiuUploadConfigRes {
  token: string;
  key: string;
  region: string;
  url: string;
}

export function qiNiuUploadConfig(): Promise<baseResponse<qiNiuUploadConfigRes>> {
  return useAxios.post('/images/qiNiu');
}

export interface noReadMsgCountRes {
  commentMsgCount: number;
  likeMsgCount: number;
  privateMsgCount: number;
  systemMsgCount: number;
}

export const noReadMsgCountApi = (): Promise<baseResponse<noReadMsgCountRes>> => {
  return useAxios.get('/site_msg/user');
};
