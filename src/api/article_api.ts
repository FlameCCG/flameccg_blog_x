import { type paramsType, type baseResponse, type listResponse, useAxios } from '@/api/';
export interface articleListType {
  id: number;
  createAt: string;
  updateAt: string;
  title: string;
  abstract: string;
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
  userTop: boolean;
  adminTop: boolean;
  categoryTitle: string | null;
  userNickname: string;
  userAvatar: string;
}

export interface articleListRequest extends paramsType {
  type: 1 | 2 | 3;
  userID?: number;
  collectID?: number;
  status?: number;
  categoryID?: number;
}

export function articleListApi(
  params?: articleListRequest | paramsType,
): Promise<baseResponse<listResponse<articleListType>>> {
  return useAxios.get('/article_list', { params });
}

export interface articleDetailType {
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
  username: string;
  userAvatar: string;
  nickname: string;
  categoryTitle: string | null;
  isLiked: boolean;
  isCollected: boolean;
}

export function articleDetailApi(id: number): Promise<baseResponse<articleDetailType>> {
  return useAxios.get('/article_detail/' + id);
}

export interface articleExaminRequest {
  articleID: number;
  status: number;
  msg?: string;
}

export function articleExamineApi(data: articleExaminRequest): Promise<baseResponse<any>> {
  return useAxios.post('/article_examine', data);
}

// admin控制用户是否开启评论
export interface userArticleIsOpenCommentRequest {
  articleID: number;
  openComment: boolean;
}
export function userArticleIsOpenComment(
  data: userArticleIsOpenCommentRequest,
): Promise<baseResponse<any>> {
  return useAxios.put('/user/isOpenComment', {
    articleID: data.articleID,
    openComment: data.openComment,
  });
}

export interface articleHistoryListRequest extends paramsType {
  userID?: number;
  type: 1 | 2;
}

export interface articleLookListResp {
  id: number;
  lookDate: string;
  title: string;
  cover: string;
  nickname: string;
  avatar: string;
  userID: number;
  articleID: number;
}

// 用户浏览历史记录
export function articleLookListApi(
  params: articleHistoryListRequest,
): Promise<baseResponse<listResponse<articleLookListResp>>> {
  // 传递json
  // console.log(params);
  return useAxios.get('/article_history', { params });
}

// 用户浏览历史记录删除
export function articleLookDeleteApi(ids: number[]): Promise<baseResponse<string>> {
  return useAxios.delete('/article_history', { data: { ids } });
}

// 更新文章浏览记录
export function articleHistoryApi(articleID: number) {
  return useAxios.put('/article_history', { articleID });
}

export interface ArticleCreateRequest {
  title: string; // 标题，必填
  abstract?: string; // 摘要，可选
  content: string; // 内容，必填
  categoryID?: number; // 分类 ID，可选
  tagList: string[]; // 标签列表，ctype.List 一般是 string[] 类型，具体根据你的定义调整
  cover?: string; // 封面链接，可选
  openComment: boolean; // 是否开启评论
  status: 1 | 2; // 1 = 草稿, 2 = 审核中
}
// article_create
export function articleCreateApi(data: ArticleCreateRequest): Promise<baseResponse<string>> {
  return useAxios.post('/article_create', data);
}

// article_update
export interface ArticleUpdateRequest extends ArticleCreateRequest {
  id: number; // 文章 ID，必填
}

export function articleUpdateApi(data: ArticleUpdateRequest): Promise<baseResponse<string>> {
  return useAxios.put('/article_update', data);
}

export interface articleCategoryOptionRes {
  label: string;
  value: number;
}
export function articleTagListOptionsApi(): Promise<baseResponse<articleCategoryOptionRes[]>> {
  return useAxios.get('/article/tagList_options');
}
export function articleDeleteApi(id: number): Promise<baseResponse<string>> {
  return useAxios.delete('/user_remove_article/' + id);
}

export function articleLikeApi(articleID: number): Promise<baseResponse<string>> {
  return useAxios.post('/article_like/' + articleID);
}

export interface articleCollectRequest {
  articleID: number;
  collectID?: number;
}
export function articleCollectApi(data: articleCollectRequest): Promise<baseResponse<string>> {
  return useAxios.post('/article_collect', data);
}
export interface articlerecommendRes {
  id: number;
  title: string;
  lookCount: number;
  userAvatar: string;
  userID: number;
  userNickName: string;
}

export function articleRecommendApi(): Promise<baseResponse<articlerecommendRes[]>> {
  return useAxios.get('/article_recommend');
}
