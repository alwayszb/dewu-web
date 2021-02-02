import request from '@/request';

export default {
  findProductsByQuery({ query, page = 0, limit = 100 }) {
    const url = '/products';
    return request.get(url, {
      params: {
        query,
        page,
        limit,
      },
    });
  },
};
