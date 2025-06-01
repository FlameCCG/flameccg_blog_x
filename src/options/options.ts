export interface optionsType {
  label: string;
  value: number | string;
  color?: string;
}
export const articleStatusOptions: optionsType[] = [
  { label: '草稿', value: 1, color: 'green' },
  { label: '审核中', value: 2, color: 'red' },
  { label: '已发布', value: 3, color: 'blue' },
  { label: '审核拒绝', value: 4, color: 'red' },
];

export const logLevelOptions: optionsType[] = [
  { label: 'info', value: 1, color: 'blue' },
  { label: 'warn', value: 2, color: 'orange' },
  { label: 'error', value: 3, color: 'red' },
];
export const registerSourceOptions: optionsType[] = [
  { label: '邮箱注册', value: 1, color: 'blue' },
  { label: 'QQ注册', value: 2, color: 'orange' },
  { label: '命令行注册', value: 3, color: 'red' },
];

// 1 陌生人 双方都没有关注
// 2 已关注 关注了对方，但是对方没有关注你
// 3 粉丝 对方关注了你
// 4 好友 双方互关
// 5 自己

export const relationOptions: optionsType[] = [
  { label: '我', value: 0, color: '#7E5BEF' },
  { label: '陌生人', value: 1, color: '#A0A0A0' },
  { label: '已关注', value: 2, color: '#3A7AFE' },
  { label: '粉丝', value: 3, color: '#FFB400' },
  { label: '好友', value: 4, color: '#00B578' },
  { label: '我', value: 5, color: '#7E5BEF' },
];

export const siteMsgTypeOptions: optionsType[] = [
  { label: '评论了你的评论', value: 1, color: '#409EFF' }, // 蓝色，表示互动
  { label: '回复了你的评论', value: 2, color: '#66B1FF' }, // 浅蓝，强调通知性质
  { label: '点赞了你的文章', value: 3, color: '#67C23A' }, // 绿色，表示积极、正向反馈
  { label: '取消了点赞', value: 4, color: '#C0C4CC' }, // 灰色，中性动作
  { label: '点赞了你的评论', value: 5, color: '#95D475' }, // 浅绿，保持与文章点赞区别
  { label: '取消了评论点赞', value: 6, color: '#D3D4D6' }, // 更浅的灰色
  { label: '收藏了你的文章', value: 7, color: '#E6A23C' }, // 橙色，强调动作带有价值感
  { label: '取消了收藏', value: 8, color: '#F4F4F5' }, // 更淡灰色，弱提示
  { label: '系统通知', value: 9, color: '#F56C6C' }, // 红色，代表重要或需要注意的系统级信息
];
