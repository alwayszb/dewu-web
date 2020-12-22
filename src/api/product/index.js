import request from '@/request';

export default {
  findProductsByQuery(query) {
    const url = '/products';
    return request.get(url, {
      params: {
        query,
      },
    });
  },
};
