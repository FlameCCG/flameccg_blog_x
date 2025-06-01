import { useAxios, type baseResponse, type listResponse, type paramsType } from '.';

export interface LogListType {
  id: number;
  createAt: string;
  updateAt: string;
  logType: number;
  title: string;
  content: string;
  level: number;
  userId: number;
  ip: string;
  addr: string;
  isRead: boolean;
  loginStatus: boolean;
  username: string;
  pwd: string;
  loginType: number;
  serverName: string;
  userNickname: string;
  userAvatar: string;
}

export interface logListParamsType extends paramsType {
  logType: 1 | 2 | 3; // 1 登录日志 2 操作日志 3 运行日志
  level?: 1 | 2 | 3; // 1 信息 2 警告 3 错误
  userId?: number;
  ip?: string;
  serverName?: string;
  loginStatus?: boolean;
}
export function logListApi(
  params?: logListParamsType,
): Promise<baseResponse<listResponse<LogListType>>> {
  return useAxios.get('/logs', { params });
}

export function logReadApi(id: number): Promise<baseResponse<string>> {
  return useAxios.get('/logs/' + id.toString());
}
