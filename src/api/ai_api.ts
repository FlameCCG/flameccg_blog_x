import { useAxios, type baseResponse } from '.';

export interface aiArticleAnalysisApiRes {
  title: string;
  abstract: string;
  category: string;
  tag: string[];
}

export const aiArticleAnalysisApi = (
  content: string,
): Promise<baseResponse<aiArticleAnalysisApiRes>> => {
  return useAxios.post('/ai/article_analysis', { content });
};
// {
//   "enable": true,
//   "nickname": "flameccg",
//   "avatar": "/uploads/images/02.jpg",
//   "abstract": "你是flameccg"
// },
export interface aiInfoApiRes {
  enable: boolean;
  nickname: string;
  avatar: string;
  abstract: string;
}
export const aiInfoApi = (): Promise<baseResponse<aiInfoApiRes>> => {
  return useAxios.get('/site/ai_info');
};
