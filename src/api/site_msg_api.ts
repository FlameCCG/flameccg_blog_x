import { useAxios, type baseResponse, type listResponse, type paramsType } from '.';

export interface mySiteMsgRes {
  id: number;
  createAt: string;
  updateAt: string;
  type: number;
  receiverID: number;
  actionUserID: number;
  actionUserAvatar: string;
  actionUserName: string;
  title: string;
  content: string;
  articleID: number;
  articleTitle: string;
  commentID: number;
  linkTitle: string;
  linkHref: string;
  isRead: boolean;
  relation: number;
}

// CommentType          Type = 1
// ApplyType            Type = 2
// ArticleLikeType      Type = 3
// UnLikeType           Type = 4
// LikeCommentType      Type = 5
// UnLikeCommentType    Type = 6
// CollectArticleType   Type = 7
// UnCollectArticleType Type = 8
// SystemType           Type = 9

export interface mySiteMsgListReq extends paramsType {
  t: 1 | 2 | 3; // 1: 评论和回复 2: 点赞和收藏 3: 系统消息
}
// 获取我的站内消息
export const getMySiteMsg = (
  params: mySiteMsgListReq,
): Promise<baseResponse<listResponse<mySiteMsgRes>>> => {
  return useAxios.get('/site_msg', { params });
};

export interface readSiteMsgReq {
  id: number;
  t: number; // 1: 评论和回复 2: 点赞和收藏 3: 系统消息
}
// 标记站内消息为已读
export const readSiteMsg = (body: readSiteMsgReq): Promise<baseResponse<string>> => {
  return useAxios.post('/site_msg', body);
};

// 删除站内消息
export interface SiteMsgRemoveReq {
  id: number;
  t: 1 | 2 | 3; // 一键删除这些种类的 1 评论 2 点赞 3 系统
}

export const removeSiteMsg = (params: SiteMsgRemoveReq): Promise<baseResponse<string>> => {
  return useAxios.delete('/site_msg', { params });
};

export const siteMsgConfApi = (): Promise<baseResponse<siteMsgConfRes>> => {
  return useAxios.get('/site_msg/conf');
};

export interface siteMsgConfRes {
  userId?: boolean;
  openCommentMessage: boolean;
  openLikeAndCollectMessage: boolean;
  openPrivateChat: boolean;
}

export const siteMsgConfUpdateApi = (data: siteMsgConfRes): Promise<baseResponse<string>> => {
  return useAxios.put('/site_msg/conf', data);
};
