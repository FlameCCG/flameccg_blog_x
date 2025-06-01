import { useAxios, type baseResponse, type listResponse, type paramsType } from '.';

export interface articleSearchRes {
  id: number;
  createAt: string;
  updateAt: string;
  title: string;
  abstract: string;
  content: string;
  tagList: string[];
  cover: string;
  categoryID: number;
  userID: number;
  lookCount: number;
  likeCount: number;
  commentCount: number;
  collectCount: number;
  openComment: boolean;
  status: number;
  collectID: number;
  collects: {
    id: number;
    createAt: string;
    updateAt: string;
    title: string;
    abstract: string;
    cover: string;
    isDefault: boolean;
    collectCount: number;
    abstractCount: number;
    UserID: number;
  };
  adminTop: boolean;
  categoryTitle: string;
  userNickname: string;
  userAvatar: string;
}

export interface articleSearchReq extends paramsType {
  tag?: string;
  t?: number; // 0 猜你喜欢 1 最新发布 2 最多回复 3 最多点赞 4 最多收藏
}

export const searchArticleApi = (
  params: articleSearchReq,
): Promise<baseResponse<listResponse<articleSearchRes>>> => {
  return useAxios.get('/article/search', { params });
};

export interface tagListRes {
  tag: string;
  articleCount: number;
}

// 聚合标签
export const tagListApi = (params: paramsType): Promise<baseResponse<listResponse<tagListRes>>> => {
  return useAxios.get('/tags', { params });
};

export interface fullTextSearchRes {
  articleID: number;
  head: string;
  body: string;
  flag: string;
}

/// 全文搜索
export const fullTextSearchApi = (
  params: paramsType,
): Promise<baseResponse<listResponse<fullTextSearchRes>>> => {
  return useAxios.get('/text/search', { params });
};
