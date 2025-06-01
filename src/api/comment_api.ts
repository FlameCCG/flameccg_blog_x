import { useAxios, type baseResponse, type listResponse, type paramsType } from '.';

export interface commentCreateReq {
  comment: string;
  articleID: number;
  parentID?: number;
}

export const commentCreateApi = async (data: commentCreateReq): Promise<baseResponse<string>> => {
  return useAxios.post('/comment_create', data);
};

export interface commentListReq extends paramsType {
  articleID?: number;
  userID?: number;
  type: number; // 1 查我所有已经发布的文章的评论 2 只查我发布的评论 3 管理员查看所有评论
}

export interface commentListRes {
  id: number;
  createdAt: string;
  content: string;
  userID: number;
  userNickname: string;
  userAvatar: string;
  articleID: number;
  articleTitle: string;
  articleCover: string;
  diggCount: number;
  relation?: 0 | 1 | 2 | 3 | 4 | 5; //  陌生人 已关注 粉丝 好友 自己
  isMe: boolean;
}

export const commentList = async (
  params: commentListReq,
): Promise<baseResponse<listResponse<commentListRes>>> => {
  return useAxios.get('/comment_list', { params });
};

export const commentRemove = async (commentID: number): Promise<baseResponse<string>> => {
  return useAxios.delete('/comment_remove/' + commentID);
};

export const commentLike = async (commentID: number): Promise<baseResponse<string>> => {
  return useAxios.put('/comment_like/' + commentID);
};

export interface commentTreeRes {
  id: number;
  createdAt: string;
  content: string;
  userID: number;
  userNickname: string;
  userAvatar: string;
  articleID: number;
  parentID?: number;
  diggCount: number;
  applyCount: number;
  subComments: commentTreeRes[];
  isMeComment: boolean;
  relation: number;
  isApply?: boolean;
  applyContent?: string;
  isLiked?: boolean;
}
// /comment_tree/:id
export const commentTree = (
  articleID: number,
): Promise<baseResponse<listResponse<commentTreeRes>>> => {
  return useAxios.get('/comment_tree/' + articleID);
};
