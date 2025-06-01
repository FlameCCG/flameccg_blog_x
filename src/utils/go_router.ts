import router from '@/router';

export const goArticle = (id: number) => {
  router.push({ name: 'articleDetail', params: { id } });
};
