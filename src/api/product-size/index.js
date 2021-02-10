import request from '@/request';

export default {
  findSizesByArticleNumber(articleNumber) {
    const url = '/product-sizes';
    return request.get(url, {
      params: {
        articleNumber,
      },
    });
  },
};
