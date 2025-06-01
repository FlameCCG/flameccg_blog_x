import axios from 'axios';
import { Message } from '@arco-design/web-vue';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { useUserStore } from '@/stores/user_store';
import type { Ref } from 'vue';
import type { optionsType } from '@/options/options';

export interface listResponse<T> {
  list: T[];
  count: number;
}

export interface paramsType {
  key?: string;
  limit?: number;
  page?: number;
  sort?: string;
  [key: string]: any;
}

export const useAxios: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

useAxios.interceptors.request.use((config) => {
  const val = localStorage.getItem('userBaseInfo');
  if (val) {
    const userBaseInfo = JSON.parse(val);
    if (userBaseInfo.token) {
      config.headers.set('token', userBaseInfo.token);
    }
  }
  return config;
});

useAxios.interceptors.response.use(
  (res: AxiosResponse<any>) => {
    if (res.data.code === 0) {
      return res.data;
    } else {
      Message.error(res.data.msg);
      return Promise.reject(res.data.msg);
    }
  },
  (error) => {
    Message.error(error.response?.data?.msg || '请求失败');
    return Promise.reject(error);
  },
);

export interface optionType {
  label: string;
  value: string | number;
}

export type optionsFunc = (param?: paramsType) => Promise<baseResponse<optionType[]>>;

export interface baseResponse<T> {
  code: number;
  data: T;
  msg: string;
}

export function getOptions(ref: Ref<optionsType[]>, func: optionsFunc, params?: paramsType) {
  func(params).then((res) => {
    ref.value = res.data;
    console.log(res.data);
  });
}
