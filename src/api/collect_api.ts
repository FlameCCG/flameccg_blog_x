import { useAxios, type baseResponse, type listResponse, type paramsType } from '.';

export interface collectRes {
  id: number;
  createAt: string;
  updateAt: string;
  title: string;
  abstract: string;
  cover: string;
  isDefault: boolean;
  UserID: number;
  collectCount: number;
  articleUse: boolean;
}

export interface collectListReq extends paramsType {
  userID?: number;
  type: 1 | 2 | 3; // 1. 查自己 2. 查别人 3. 管理员查
  articleID?: number;
}
// 收藏夹列表
export const collectListApi = (
  params: collectListReq,
): Promise<baseResponse<listResponse<collectRes>>> => {
  return useAxios.get('/collect', {
    params,
  });
};

export interface collectCreateReq {
  id?: number;
  title: string;
  abstract: string;
  cover?: string;
}

// 创建收藏夹
export const collectCreateApi = (body: collectCreateReq): Promise<baseResponse<string>> => {
  return useAxios.post('/collect', body);
};

// 删除收藏夹
export const collectDeleteApi = (ids: number[]): Promise<baseResponse<string>> => {
  return useAxios.delete('/collect', {
    data: {
      ids,
    },
  });
};

export interface removeCollectArticleReq {
  collectionID: number;
  articleIDList: number[];
}

export const removeCollectArticle = async (
  data: removeCollectArticleReq,
): Promise<baseResponse<string>> => {
  return useAxios.delete('/article_collect', {
    data,
  });
};
