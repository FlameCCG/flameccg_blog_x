import { useAxios, type baseResponse } from '.';

const weatherAPI = '/data/weather';
export const getWeather = (): Promise<baseResponse<weatherResponse>> => {
  return useAxios.get(weatherAPI);
};

export interface weatherResponse {
  province: string;
  city: string;
  obsTime: string;
  temp: string;
  feelsLike: string;
  icon: string;
  fc_welcometext: string;
  wind360: string;
  windDir: string;
  windScale: string;
  windSpeed: string;
  humidity: string;
  precip: string;
  pressure: string;
  vis: string;
  cloud: string;
  dew: string;
  text: string;
}

export interface sumDataResponse {
  flowCount: number;
  userCount: number;
  articleCount: number;
  messageCount: number;
  commentCount: number;
  newLoginCount: number;
  newSignCount: number;
}

export const sumDataApi = (): Promise<baseResponse<sumDataResponse>> => {
  return useAxios.get('/data/sum');
};
export interface growthDataResponse {
  growthRate: number;
  growthNum: number;
  countList: number[];
  dateList: string[];
}
// 1.网站流量数据 2:用户增长数据 3:文章增长数据

export const growthDataApi = (type: 1 | 2 | 3): Promise<baseResponse<growthDataResponse>> => {
  return useAxios.get('/data/growth', { params: { type } });
};

// 文章统计类型
export interface articleStatisticsResponse {
  growthRate: number;
  growthNum: number;
  countList: [number];
  dateList: string[];
}
export const articleStatisticsApi = (): Promise<baseResponse<articleStatisticsResponse>> => {
  return useAxios.get('/data/article_statistics');
};

export interface systemResourceResponseResponse {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export const systemResourceApi = (): Promise<baseResponse<systemResourceResponseResponse>> => {
  return useAxios.get('/data/computer');
};
