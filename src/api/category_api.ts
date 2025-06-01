import { number } from 'echarts';
import { useAxios, type baseResponse, type listResponse, type paramsType } from '.';

export interface ArticleCategroyListRes {
  id: number;
  createAt: string;
  updateAt: string;
  title: string;
  userID: number;
  articleCount: number;
  nickname: string;
  avatar: string;
}
export interface ArticleCategoryListRequest extends paramsType {
  userID: number;
  type: 1 | 2 | 3; // 1. 查自己 2. 查别人 3. 管理员查
}
export function articleCategoryListApi(
  params: ArticleCategoryListRequest,
): Promise<baseResponse<listResponse<ArticleCategroyListRes>>> {
  return useAxios.get('/article_category', { params });
}

export interface categoryCreateReq {
  id: number;
  title: string;
}

export function categoryCreate(data: categoryCreateReq): Promise<baseResponse<string>> {
  return useAxios.post('/article_category', data);
}

export function categoryDelete(ids: number[]): Promise<baseResponse<string>> {
  return useAxios.delete('/article_category', { data: { ids } });
}
