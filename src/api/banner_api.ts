import { type baseResponse, type listResponse, type paramsType, useAxios } from '@/api/index';

export interface bannerListType {
  id: number;
  createdAt: string;
  updatedAt: string;
  show: boolean;
  cover: string;
  href: string;
}

export interface bannerListReq extends paramsType {
  show?: boolean;
  type?: number;
}
export function bannerListApi(
  params?: bannerListReq,
): Promise<baseResponse<listResponse<bannerListType>>> {
  return useAxios.get('/banner', { params });
}

export const deleteBannerApi = (ids: number[]): Promise<baseResponse<string>> => {
  return useAxios.delete('/banner', { data: { ids } });
};

export interface bannerType {
  id?: number;
  cover: string;
  href: string;
  show: boolean;
}

export function bannerCreateUpdateApi(data: bannerType): Promise<baseResponse<string>> {
  if (data.id) {
    return useAxios.put('/banner/' + data.id.toString(), data);
  }
  return useAxios.post('/banner', data);
}
